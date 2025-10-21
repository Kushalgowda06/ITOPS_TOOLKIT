import os
import autogen
from autogen import ConversableAgent
 
SCRIPT_PATH = os.path.dirname(__file__)

class TrainAssistAgent:
    def __init__(self, system_message = None):

        self.az_config_list = autogen.config_list_from_json(os.path.join(SCRIPT_PATH, "config", "AZ_OAI_CONFIG_LIST"))

        self.llm_config = {"config_list": self.az_config_list}

        self.assistant = ConversableAgent(
            name = "quiz_assistant", 
            system_message = system_message,
            llm_config = self.llm_config,
            human_input_mode="NEVER"
        )
       
    def generate_reply(self, prompt = "", conv_history = []):

        conv_history.append({"role": "user", "content": prompt})
        reply = self.assistant.generate_reply(
            messages = conv_history
        )
        conv_history.append({"role": "assistant", "content": reply})

        return reply, conv_history



class TrainAssistBot:
    def generate_mcqs(self, prompt, conv_history=None):
        with open(os.path.join(SCRIPT_PATH, "config", "mcq_template.txt"), "r") as f:
            templates = f.read()

        agent = TrainAssistAgent(system_message = templates)
        reply, conv_history = agent.generate_reply(prompt=prompt, conv_history=conv_history)

        return reply, conv_history

    def generate_scenarios(self, prompt, conv_history=None):
        with open(os.path.join(SCRIPT_PATH, "config", "scenario_template.txt"), "r") as f:
            templates = f.read()

        agent = TrainAssistAgent(system_message = templates)
        reply, conv_history = agent.generate_reply(prompt=prompt, conv_history=conv_history)

        return reply, conv_history

        
