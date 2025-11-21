import autogen
import sys
from snow_ctask import ServiceNowTasks
import json
import os

SCRIPT_PATH = os.path.dirname(__file__)

az_config_list = autogen.config_list_from_json(
        SCRIPT_PATH + "/config/AZ_OAI_CONFIG_LIST"
        )

#LLM configurations
llm_config = {
    #'cache_seed': 10,
    'config_list': az_config_list,
    'temperature': 0.5
}

generic_agent = autogen.ConversableAgent(
        "generic_agent",
        # llm_config = {"config_list": config_list_gemini, "seed": seed},
        llm_config = {"config_list": az_config_list},
        human_input_mode = "NEVER",
        )

def get_suggestions(curr_chg, relevant_changes):
    
    '''
    with open ('zenoss_impl_plan.txt','r') as file1:
        impl_plan = file1.read()
 
    #print(impl_plan)
    '''    
    with open(SCRIPT_PATH + '/backstory.txt','r') as file2:
        final_response_prompt = file2.read()
        final_response_prompt = final_response_prompt.replace("{curr_chg}", str(curr_chg))
        final_response_prompt = final_response_prompt.replace("{historical_chg}", str(relevant_changes))

    #print(final_response_prompt)

    response = generic_agent.generate_reply(
            messages = [{"role": "user","content": final_response_prompt}]
    )
    #print(response)

    result = extract_code_block(response)

    try:
        with open(SCRIPT_PATH + '/output.txt','w') as file:
            file.write(result)
        print("File generated as output.txt with following content \n", result)
        return result
    except exception as e:
        print(e)
    

def extract_code_block(text):
    lines = text.split('\n')
    inside_code_block = False
    code_block = []

    for line in lines:
        if line.strip().startswith('```'):
            if inside_code_block:
                # End of code block
                inside_code_block = False
            else:
                # Start of code block
                inside_code_block = True
        elif inside_code_block:
            code_block.append(line)

    return '\n'.join(code_block).strip()

class ChangeTask:
    def extract_json(self,data):
    
        def RawJSONDecoder(index):
            class _RawJSONDecoder(json.JSONDecoder):
                end = None

                def decode(self,s, *_):
                    data, self.__class__.end = self.raw_decode(s, index)
                    return data
            return _RawJSONDecoder

        def extraction_json(s, index=0):
            results = []
            while (index := s.find('{', index)) != -1:
                try:
                    json_obj = json.loads(s, cls=(decoder := RawJSONDecoder(index)))
                    results.append(json_obj)
                    index = decoder.end
                except json.JSONDecodeError as e:
                    #print(f"\n\nllm_response{data}\n\n")
                    return (f'ERROR: {e}', [])
            #return ('OK', results)
            return results

        return extraction_json(data)
'''
ctask_obj = ServiceNowTasks()
change_number = input("Enter Change Request Number: ")
data = ctask_obj.get_change_details(change_number.upper())
result = get_suggestions(data[0]['implementation_plan'])
extract_object = ChangeTask()
ctask_json = extract_object.extract_json(result)
for ctask_data in ctask_json:
    ctask = ctask_obj.create_task(short_description = ctask_data['short_description'], number = change_number.upper(), sys_id = data[0]['sys_id'], description = ctask_data['description'],assignment_group = ctask_data['assignment_group'])

'''
