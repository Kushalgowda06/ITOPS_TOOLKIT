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

SCRIPT_PATH = os.path.dirname(__file__)
ROOT_PATH = SCRIPT_PATH.split("/itsm")[0]

LLM_PATH = ROOT_PATH + "/llm_app/"
print(LLM_PATH)
sys.path.append(LLM_PATH)
sys.path.append(ROOT_PATH)
from vault import Vault

from configuration import config

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



az_config_list = autogen.config_list_from_json(
        "config/AZ_OAI_CONFIG_LIST"
        )
'''
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
SCRIPT_PATH = os.path.dirname(__file__)
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

# Initiate agent required for image analysis
image_agent = MultimodalConversableAgent(
        name = "image_explainer",
        max_consecutive_auto_reply = 10,
        llm_config = {
            "config_list": az_config_list,
            "temperature": 0.5
            }
        )

generic_agent = autogen.AssistantAgent(
            "generic_agent",
            llm_config =  {
                "config_list": az_config_list,
                "temperature": 0.5
                },
            human_input_mode = "NEVER"
            )


# Initiate user proxy agent
user_proxy = autogen.UserProxyAgent(
        name = "user_proxy",
        system_message = "A human admin.",
        is_termination_msg = lambda x: x.get("content", "").rstrip().contains("image"),
        human_input_mode = "NEVER",
        max_consecutive_auto_reply = 0
        )

# Conversational bot
def chat_with_llm(prompt, history_list, username = ""):
    history = ""
    for entry in history_list[:-2]:
        history += entry.role + ": " + entry.content + "\n"

    if history != "":
        prompt += "\n\nHere is the conversation history that sets context for you\n********\n" + history + "\n********"

    try:
        result = user_proxy.initiate_chat(
                image_agent,
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

    print(result)
    final_response_prompt = "Read the following details -\n\n----------------\nUSER QUERY -\n" + prompt
    final_response_prompt += "\n\nRESPONSE -\n" + result + "\n----------------"
    final_response_prompt += "\n\nSummarize the response."

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

