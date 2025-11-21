import os
import sys
import json
import traceback

from zoneinfo import ZoneInfo
from collections import defaultdict
from datetime import datetime, timedelta

from fastapi import APIRouter
from fastapi.responses import JSONResponse

from .models import *
from .train_assist_agent import TrainAssistBot
from .extract_json import extract_and_validate_json

SCRIPT_PATH = os.path.dirname(__file__)
ROOT_PATH = SCRIPT_PATH.split("/train_assist_source_code")[0]
sys.path.append(ROOT_PATH)

from database.sqldatabase_connector import SQLDatabase
from database.vectordb_connector import VectorDatabase

router = APIRouter()

class CustomError(Exception):
    """Custom exception for application-specific errors."""
    def __init__(self, message):
        super().__init__(message)
        self.message = message

TS_FORMAT = "%Y-%m-%d %H:%M:%S"

class TrainAssist:
    def __init__(self):
        pass

    def get_kb_content(self, numbers = []):
        try:
            db = SQLDatabase()
            data = db.retrieve_data(table_name = "knowledge_articles",
                                    columns = ["content", "metadata->>'number'"], 
                                    conditions = [{"col": "metadata->>'number'", "op": "i", "val": numbers}])

            content = {}

            for row in data:
                content[row["metadata->>'number'"]] = row['content']

        except Exception as e:
            content = {}
            raise CustomError(str(e))

        return content


    def generate_mcqs(self, articles_number = []):
        agent = TrainAssistBot()
        db = SQLDatabase()

        data_to_insert = []

        contents = self.get_kb_content(numbers = articles_number)

        for kb_number in contents:
            insert_kb = {}
            prompt = {}
            try:
                prompt['content'] = contents[kb_number]
                llm_response, conv_history = agent.generate_mcqs(prompt = str(prompt), conv_history = [])
        
                quizes = extract_and_validate_json(llm_response)

                insert_kb['kb_number'] = kb_number
                insert_kb['quiz'] = json.dumps(quizes[0].get("questions"))

                data_to_insert.append(insert_kb)

            except Exception as e:
                raise CustomError(str(e))

        try:
            ids_inserted = db.insert_data(table_name = "quizes", data = data_to_insert)
            quiz_code = "_".join(map(str, ids_inserted))

        except Exception as e:
            raise CustomError(str(e))

        return quiz_code

    def generate_scenarios(self, articles_number = "", prompt = "", conv_history = [], previous_question = []):
        agent = TrainAssistBot()


        if articles_number and not previous_question:
            contents = self.get_kb_content(numbers = [articles_number])
            prompt += f"\nGenerate a scenario based quiz based on the content: {contents}\n"
        elif articles_number and previous_question:
            contents = self.get_kb_content(numbers = [articles_number])
            prompt += f"\n{previous_question} : This is the previously generated scenario/question, So generate different one with the provided content - \n{contents}.\n"
        try:
            llm_response, conv_history = agent.generate_scenarios(prompt = str(prompt), conv_history = conv_history)

        except Exception as e:
                raise CustomError(str(e))

        return llm_response, conv_history
        


    def get_mcqs(self, quiz_code = '', user_id = '', type_of_submit = ''):
        db = SQLDatabase()

        ids = quiz_code.strip().split("_")

        response_data = {}
        conditions = []
        conditions.append({"col": "id", "op": "i", "val": ids})
        
        try:
            if type_of_submit == "start":
                working_col = "quiz"
                db.update_data(table_name = "quizes", update_dict = {"user_id": user_id}, conditions = conditions)

                data = db.retrieve_data(table_name = "quizes", columns = ["quiz"], conditions = conditions)

                now = datetime.now(ZoneInfo("Asia/Kolkata"))
                end_time = now + timedelta(minutes=len(data) * 10)
                now = now.strftime(TS_FORMAT)
                end_time = end_time.strftime(TS_FORMAT)

                db.update_data(table_name = "quizes", update_dict = {"start_time": now}, conditions = conditions)
                #print(f"Data: {data}")

                response_data['end_time'] = end_time

                mcqs = []
                # print(data)
                for row in data:
                    for item in row[working_col]:
                        item['user_response'] = ""
                        try:
                            del item['answer']   
                        except:
                            pass

                    mcqs.extend(row[working_col])

            elif type_of_submit == "resume":
                working_col = "user_response"
                conditions.append({"col": "user_id", "op": "eq", "val": user_id})
                data = db.retrieve_data(table_name = "quizes", columns = ["user_response","start_time"], conditions = conditions)

                mcqs = []

                if not data:
                    return {"questions": [], "end_time": ""}
            
                for row in data:
                    mcqs.extend(json.loads(row["user_response"]))

                row["start_time"] = row["start_time"].replace(tzinfo=ZoneInfo("Asia/Kolkata"))
                response_data['end_time'] = (row["start_time"] + timedelta(minutes = len(mcqs) * 2)).strftime(TS_FORMAT)

            response_data['questions'] = mcqs

        except Exception as e:
            raise CustomError(str(e))

        return response_data

    def calculate_score(self, user_id = '', quiz_code = ''):
        db = SQLDatabase()
        ids = quiz_code.strip().split("_")

        conditions = []
        conditions.append({"col": "id", "op": "i", "val": ids})
        conditions.append({"col": "user_id", "op": "eq", "val": user_id})

        try:
            calculate_data = db.retrieve_data(table_name = "quizes", columns = ["id", "quiz", "user_response"], conditions = conditions)
            # print(calculate_data)
            scores = {}
            for row in calculate_data:
                for id in ids:
                    score = 0
                    quiz = row.get("quiz") if row.get("id") == int(id) else None

                    if quiz:
                        user_response = row.get("user_response") 
                    
                        for element in quiz:
                            question = element.get("question")

                            for item in json.loads(user_response):
                                if item.get("question") == question:
                                    if element.get("answer").strip().lower() == item.get("user_response").strip().lower():
                                        score += 20

                        scores[id] = score
                        
            if scores:
                for id in ids:
                    conditions = []
                    conditions.append({"col": "id", "op": "eq", "val": id})
                    conditions.append({"col": "user_id", "op": "eq", "val": user_id})

                    db.update_data(table_name = "quizes", update_dict = {"score": scores[id]}, conditions = conditions)
                
                avg_score = sum(scores.values())/len(scores.values())
                return str(avg_score) + "%"
            else:
                return -1
            
        except Exception as e:
            raise CustomError(str(e))

    def submit_quiz(self, quiz_code = '', user_id = '', type_of_submit = '', questions = ''):
        db = SQLDatabase()
        ids = quiz_code.strip().split("_") 
        pointer = 0

        try:
            for id in ids:
                # print(id)
                insert_ques = questions[pointer:pointer + 5]
                pointer += 5

                conditions = []
                conditions.append({"col": "id", "op": "eq", "val": id})
                conditions.append({"col": "user_id", "op": "eq", "val": user_id})
                
                # print(json.dumps(insert_ques, indent=4))

                db.update_data(table_name = "quizes", update_dict = {"user_response": json.dumps(insert_ques, indent = 4)}, conditions = conditions)

            if type_of_submit in ["submit", "expire"]:
                score = self.calculate_score(user_id = user_id, quiz_code = quiz_code)
                return score
            
            return -1

        except Exception as e:
            raise CustomError(str(e))

    def get_description(self, kb_number):
        db = SQLDatabase()
        desc_data = db.retrieve_data(
            table_name = "knowledge_articles",
            columns = ["metadata->>'number'", "metadata->>'title'"],
            conditions = [
                {"col": "metadata->'number'", "op": "?|", "val": kb_number}
            ]
        )
        description = "\n".join(f"{item['metadata->>\'number\'']} - {item['metadata->>\'title\'']}" for item in desc_data)
                                
        return description

    def get_pending_quizes(self, user_id):
        db = SQLDatabase()

        try:
            data = db.retrieve_data(
                table_name = "quizes",
                columns = ["id", "start_time", "kb_number"], 
                conditions = [
                    {"col": "user_id", "op": "eq", "val": user_id},
                    {"col": "score", "op": "is", "val": None}
                ]
            )
        
            starttime_grp = defaultdict(lambda: {'quiz_id': [], 'kb_number': []})
            if data:
                for row in data:
                    start_time = row['start_time'].strftime(TS_FORMAT)

                    starttime_grp[start_time]['quiz_id'].append(row['id'])
                    starttime_grp[start_time]['kb_number'].append(row['kb_number'])

            return_data = []
            if starttime_grp:
                for key in starttime_grp:

                    return_dict = {}
                    return_dict['ids'] = "_".join(map(str, sorted(starttime_grp[key]['quiz_id'])))

                    description = self.get_description(kb_number = starttime_grp[key]['kb_number'])
                    
                    return_dict['description'] = description
                    return_data.append(return_dict)


        except Exception as e:
            error = "Failed to get the pending quizes " + str(e)
            raise CustomError(error)

        return return_data

    def get_completed_quizes(self, user_id = ''):
        db = SQLDatabase()

        try:
            conditions = []
            conditions.append({'col': 'user_id', 'op': 'eq', 'val': user_id})
            conditions.append({'col': 'score', 'op': 'ge', 'val': 0})

            data = db.retrieve_data(
                table_name = 'quizes',
                columns = ['id', 'kb_number', 'score', 'start_time', 'user_id'],
                conditions = conditions
            )
            
            grouped = defaultdict(list)
            for record in data:
                grouped[record['start_time']].append(record)
            
            result = []
            for start_time, items in grouped.items():
                items = sorted(items, key=lambda x: x['id'])
                quiz_id = '_'.join(str(item['id']) for item in items)
                kb_number = [item['kb_number'] for item in items]
                
                scores = [item['score'] if item['score'] is not None else 0 for item in items]
                avg_score = round(sum(scores) / len(scores), 2)

                grp_data = {
                    "quiz_id": quiz_id,
                    "kb_numbers": kb_number,
                    "description": self.get_description(kb_number),
                    "score": avg_score
                }

                result.append(grp_data)

            return result
            
        except Exception as e:
            error = "Failed to get the data for completed quizes " + str(e)
            raise CustomError(error)

    def get_all_quizes(self, user = ''):
        db = SQLDatabase()

        try:
            conditions = []
            if user:
                conditions.append(
                    {'col': 'user_id', 'op': 'eq', 'val': user}
                )

            data = db.retrieve_data(
                table_name = 'quizes',
                columns = ['id', 'kb_number', 'score', 'start_time', 'user_id'],
                conditions = conditions
            )
            
            grouped = defaultdict(list)
            for record in data:
                grouped[record['start_time']].append(record)
            
            result = []
            for start_time, items in grouped.items():
                items = sorted(items, key=lambda x: x['id'])
                user_id = str(items[0]['user_id']) if items else ''
                quiz_id = '_'.join(str(item['id']) for item in items)
                kb_number = [item['kb_number'] for item in items]
                
                scores = [item['score'] if item['score'] is not None else 0 for item in items]
                avg_score = round(sum(scores) / len(scores), 2)

                try:
                    end_time = start_time + timedelta(minutes=len(quiz_id.split('_')) * 10)
                except:
                    continue
                status = "completed" if datetime.now() > end_time else "resume"

                grp_data = {
                    "quiz_id": quiz_id,
                    "kb_numbers": kb_number,
                    "description": self.get_description(kb_number),
                    "status": status,
                    "score": avg_score
                }
                if not user:
                    grp_data["user_id"] = user_id

                result.append(grp_data)

            return result
        except Exception as e:
            error = "Failed to get the data for completed quizes " + str(e)
            raise CustomError(error)