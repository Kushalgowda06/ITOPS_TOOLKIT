import os
import datetime
import json
import requests
from dotenv import load_dotenv
from itsm_connector import ITSM
from langchain.schema import Document
from kb_manager import KBManager
# from knowledge_assistant import KnowledgeAssistant
from change_assistant import ChangeAssistant
from snow_ctask import ServiceNowTasks
import split_impl

load_dotenv()


class ServiceNowChangeRequests:
    '''
    snow_url = os.getenv('SNOW_URL')
    snow_username = os.getenv('SNOW_USERNAME')
    snow_password = os.getenv('SNOW_PWD')

    headers = {'content-type': 'application/json'}

    def get_change_request_details(self, change_list):
        change_data = {}
        for change in change_list:
            change_url = self.snow_url + '/api/now/table/change_request?number=' +change
            #task_url = self.snow_url + '/api/now/table/change_task?change_request='

            try:
                change_response = requests.get(change_url, auth = (self.snow_username, self.snow_password), headers = self.headers, verify = False)
                #print(due_date)
                data = change_response.json()['result']
                change_data[change] = data
                # print(change_data[change][0]['implementation_plan'])
            
                #impl_plan = data[0]['implementation_plan']
                #print("\n",str(impl_plan))
                #print(f"{data[0]['sys_id']}\n")
            except Exception as e:
                print(str(e))

        return change_data 
    '''

snow_user = os.getenv('SNOW_USERNAME')
snow_pwd = os.getenv('SNOW_PWD')
change_list = ["CHG0036169", "CHG0036170","CHG0036171", "CHG0036172", "CHG0036173"]
change_obj = ITSM(snow_user, snow_pwd)
ctask_obj = ServiceNowTasks()

change_documents = []
ctasks_doc = []
for change in change_list:
    change_details = change_obj.get_change_request_details(change=change)
    
    '''
    for changes in change_details:
        ctask_result = ctask_obj.get_historical_ctasks(changes['sys_id'])
        ctasks = [{"number": d["number"],"short_description": d["short_description"], "assignment_group": d["assignment_group.name"]} for d in ctask_result]
        
        
        for task in task_number:
            ctask_content = 'Change Request Number - ' +change_details[0]['number'] + '\n C-Tasks - ' +task
            ctask_document = Document(page_content = ctask_content, metadata = {'source': task})
            ctasks_doc.append(ctask_document)
    '''


   #print('Printing change request \n',change_details)
    if change_details != None:
            content = 'Change Request Number - ' + change_details[0]['number'] +'\n\n'
            content += 'Short Description - ' + change_details[0]['short_description'] + '\n\n'
            content += 'Description - \n' + change_details[0]['description'] +'\n\n'
            content += 'Assignment Group -\n'+ change_details[0]['assignment_group']+'\n\n'
            content += 'Implementation Plan -\n' + change_details[0]['implementation_plan']+'\n\n'
            content += 'Backout Plan -\n' + change_details[0]['backout_plan']+'\n\n'
            content += 'Test Plan -\n' + change_details[0]['test_plan']+'\n\n'
            for changes in change_details:
                ctask_result = ctask_obj.get_historical_ctasks(changes['sys_id'])
                
                ctasks = [{"number": d["number"],"short_description": d["short_description"], "assignment_group": d["assignment_group.name"]} for d in ctask_result]
                task_number = [n["number"] for n in ctasks]
                sd = [d["short_description"] for d in ctasks]
                ag = [ag["assignment_group"] for ag in ctasks]
                
                for task,d,agn in zip(task_number,sd,ag):
                    ctask_content = 'C-Tasks - ' +task + '\n '
                    ctask_content += 'Short Description - ' +d+'\n '
                    ctask_content += 'Assignment Group - ' +agn +'\n '
                    content += ctask_content

            change_request_doc = Document(page_content = content, metadata = {'source':  change_details[0]['number']})
            change_documents.append(change_request_doc)

            #print(change_details[0]['number'])
    #print(content)
    

kb_mng_obj = KBManager()

#kb_mng_obj.insert_documents(change_documents, kb_name = 'platform_knowledge_base', collection_name = 'change_requests')
result = kb_mng_obj.retrieve_kb_connection(kb_name = 'platform_knowledge_base', collection_name = 'change_requests')
val = result.get()
#print(val["documents"])

#for i in val["documents"]:
#    print(i)
curr_chg_obj = ServiceNowTasks()
change_number = input("Enter change request number to create C-Tasks: ")
curr_chg = curr_chg_obj.get_change_details(number = change_number.upper())
quest = "Give me documents with change request similar to the below change request - \n"
quest += "Implementation Plan : \n"
quest += curr_chg[0]['implementation_plan'] + '\n' 
quest += "Backout Plan - \n" +curr_chg[0]['backout_plan'] +'\n'
quest += "Test Plan - \n" +curr_chg[0]['test_plan']+ '\n'
quest += "Find the most appropriate article for the above change request given "

ca_obj = ChangeAssistant()

relevant_docs = ca_obj.get_compressed_response(quest)
#print(relevant_docs)
historical_change = ''
for k, v in relevant_docs.items():
    #print("\n",k)
    #print(v)
    historical_change += v

#print(historical_change)
answer = split_impl.get_suggestions(curr_chg, historical_change)
extract_object = split_impl.ChangeTask()
ctask_json = extract_object.extract_json(answer)
for ctask_data in ctask_json:
    ctask = curr_chg_obj.create_task(short_description = ctask_data['short_description'], number = change_number.upper(), sys_id = curr_chg[0]['sys_id'], description = ctask_data['description'],assignment_group = ctask_data['assignment_group'])
