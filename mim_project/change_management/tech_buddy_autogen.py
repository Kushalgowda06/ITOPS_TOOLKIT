# Author - Viraj Purandare
# Created On - Dec 9, 2024
import sys
import os
import json
import pprint
from typing import Any, Callable, Dict, List, Optional, Tuple, Type, Union

from PIL import Image
from termcolor import colored

import autogen
from autogen.coding import LocalCommandLineCodeExecutor
from autogen import Agent, AssistantAgent, ConversableAgent, UserProxyAgent
from autogen.agentchat.contrib.img_utils import _to_pil, get_image_data
from autogen.agentchat.contrib.multimodal_conversable_agent import MultimodalConversableAgent
from autogen.agentchat.contrib.retrieve_user_proxy_agent import RetrieveUserProxyAgent
from autogen.code_utils import DEFAULT_MODEL, UNKNOWN, content_str, execute_code, extract_code, infer_lang

from vertexai.generative_models import HarmBlockThreshold, HarmCategory


#from vault import Vault

# VertexAI - Google Gemini
# Safety settings for VertexAI
'''
safety_settings = {
        HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_ONLY_HIGH,
}

seed = 25

# Establish VertexAI connectivity
config_list_gemini = autogen.config_list_from_json(
        "config/OAI_CONFIG_LIST"
        )

for config_list in [config_list_gemini]:
    for config_list_item in config_list:
        config_list_item["safety_settings"] = safety_settings

'''

SCRIPT_PATH = os.path.dirname(__file__)
ROOT_PATH = SCRIPT_PATH.split("/change_management")[0]

LLM_PATH = ROOT_PATH + "/llm_app/"
print(LLM_PATH)
sys.path.append(LLM_PATH)
sys.path.append(ROOT_PATH)
from vault import Vault

from configuration import config

api_key = config["openai_key"]
api_version = config["openai_api_version"]
azure_endpoint = config["openai_azure_enpoint"]
model = config["openai_model"]
api_type = config["api_type"]

'''
az_config_list = autogen.config_list_from_json(
        SCRIPT_PATH + "/config/AZ_OAI_CONFIG_LIST"
        )
'''

az_config_list = [{
                "model": model,
                "api_type": api_type,
                "base_url": azure_endpoint,
                "api_key": api_key,
                "api_version": api_version
            }]

# Asset configurations
# SCRIPT_PATH = os.path.dirname(__file__)
app_conf_path = SCRIPT_PATH + "/config/app_config.json"

app_conf_file = open(app_conf_path, "r")
app_conf = json.load(app_conf_file)
app_conf_file.close()

# Initiate vault
vault_path = SCRIPT_PATH + "/config/.vault_token"

vault_file = open(vault_path, "r")
vault_token = vault_file.read().strip()
vault_file.close()

vault_url = app_conf["vault_url"]

# Initiate assistant agent
assist_backstory_f = open(SCRIPT_PATH + "/config/assistant_backstory.txt", "r")
assistant_backstory = assist_backstory_f.read()
assist_backstory_f.close()

'''
assistant = UserProxyAgent(
        "assistant",
        system_message = assistant_backstory,
        code_execution_config = False,
        # llm_config = {"config_list": config_list_gemini, "seed": seed},
        llm_config = {"config_list": az_config_list},
        human_input_mode = "NEVER",
        # max_consecutive_auto_reply = 2,
        is_termination_msg = lambda msg: " terminate " in msg["content"].lower(),
)
'''

assistant = ConversableAgent(
        "assistant",
        system_message = assistant_backstory,
        code_execution_config = False,
        # llm_config = {"config_list": config_list_gemini, "seed": seed},
        llm_config = {"config_list": az_config_list},
        human_input_mode = "NEVER",
        max_consecutive_auto_reply = 2,
        is_termination_msg = lambda msg: "exitcode: 0 (execution succeeded)" in msg["content"].lower(),
)

# Initiate code executor agent
'''
code_executor = AssistantAgent(
        "code_executor_agent",
        code_execution_config = {"work_dir": "coding", "use_docker": False},
        human_input_mode = "NEVER",
        llm_config = False,
        )
'''

code_executor = ConversableAgent(
        "code_executor_agent",
        code_execution_config = {"work_dir": "coding", "use_docker": False},
        human_input_mode = "NEVER",
        llm_config = False,
        # is_termination_msg = lambda msg: "terminate" in msg["content"].lower(),
        )

agents = {"assistant": "assistant", "user": "code_executor_agent"}

generic_agent = ConversableAgent(
        "generic_agent",
        # llm_config = {"config_list": config_list_gemini, "seed": seed},
        llm_config = {"config_list": az_config_list},
        human_input_mode = "NEVER",
        )


# Conversational bot
def chat_with_llm(prompt, history_list, username = ""):
    cred_details = ""
    if username != "":
        vault_session = Vault(vault_url, vault_token)
        secrets = vault_session.list_secrets("/")

        allowed_secrets = []
        for secret in secrets:
            if secret.startswith(username):
                allowed_secrets.append(secret)

        '''
        if allowed_secrets != []:
            creds_prompt = "Please read the following user query - \"" + prompt + "\"\n"
            creds_prompt += "From the below list of credentials, select the most relevant one that can fulfill user's ask -\n"
            creds_prompt += ", ".join(allowed_secrets)
            creds_prompt += "\n\nOutput should be python list with no explanation.\nSample output - \n[\"cred1\"]"

            creds_response = ask_llm_in_isolation(creds_prompt)
            for secret in allowed_secrets:
                if secret in creds_response.content:
                    username = secret
                    break
            print(creds_response.content)
        '''

        if allowed_secrets != []:
            cred_details += "\n********Here are credentials if required. Choose relevant for relevant actions********"

        for user_path in allowed_secrets:
            (status, creds) = vault_session.retrieve_secret(user_path)
            purpose = user_path.split(username + "_")[-1].strip()
            if purpose == "":
                cred_details += "\n\nUser credentials - "
            else:
                cred_details += "\n\n" + purpose + " credentials - "
                cred_details += "\nUsername - " + list(creds.keys())[0] + "\nPassword - " + creds[list(creds.keys())[0]]

    prompt += cred_details

    history = ""
    for entry in history_list[:-2]:
        history += entry.role + ": " + entry.content + "\n" 

    if history != "":
        history = history.replace(cred_details, "").replace("exitcode: 0 (execution succeeded)", "")
        prompt += "\n\nHere is the conversation history that sets context for you\n********\n" + history + "\n********"

    prompt += "\n\nIf you do not find the relevant credentials, please try all given in a loop."
    prompt += "\n\nIf API key is required, try password as API key."

    print(prompt)
    # logging_session_id = autogen.runtime_logging.start(logger_type = "file", config = {"filename": SCRIPT_PATH + "/config/.temp"})

    '''
    result = assistant.initiate_chat(
            code_executor,
            message = prompt,
            summary_method = "reflection_with_llm",
            )
    '''
    '''
    summary_prompt = "Filter out the response content specific to following query - i.e. \"" + prompt + "\""
    summary_prompt += "\n\nRESPONSE SHOULD BE CREDENTIAL FREE"
    '''

    summary_prompt = "Summarize the user's request response in a detailed or concise manner, based on the user's preference."
    summary_prompt += "\nUser's query was - " + prompt
    summary_prompt += "\n\nRESPONSE SHOULD NOT CONTAIN CREDENTIALS."

    # print(history)
    try:
        result = code_executor.initiate_chat(
                assistant,
                message = prompt,
                # summary_method = "reflection_with_llm",
                # summary_args = {"summary_prompt": summary_prompt},
                summary = "last_msg"
                # chat_messages = history
                )

        try:
            result = result.summary['content']
        except Exception:
            result = result.summary
    except Exception as e:
        result = str(e)

    # print(result)
    final_response_prompt = "Read the following details -\n\n----------------\nUSER QUERY -\n" + prompt
    final_response_prompt += "\n\nRESPONSE -\n" + result + "\n----------------"
    final_response_prompt += "\n\nUsing this information, form exact response to the user's latest query only."
    final_response_prompt += "\nENSURE TO EXCLUDE ANY CREDENTIAL DETAILS IN YOUR RESPONSE."

    result = ask_llm_in_isolation(final_response_prompt)
    result = result.content

    # autogen.runtime_logging.stop()
    return result


class Response:
    def __init__(self):
        content = ""


def ask_llm_in_isolation(prompt):
    response = Response()

    messages = [{"content": prompt, "role": "user"}]
    try:
        response.content = generic_agent.generate_reply(messages)
        try:
            response.content = response["content"]
        except Exception:
            pass
    except Exception as e:
        response.content = str(e)

    return response


'''
prompt = input("Enter your question - ")
print(ask_llm_in_isolation(prompt, "599350"))

history = ""
prompt = ""

while prompt != "TERMINATE":
    prompt = input("You: ")
    result = chat_with_llm(prompt, history)
    history = result["history"]
'''
