
import json
import os
import sys
import datetime
import base64

from .change_assistant import ChangeAssistant
from .itsm_connector import ITSM
#from .tech_buddy_autogen import tech_buddy

SCRIPT_PATH = os.path.dirname(__file__)


#import visual_analyzer

ROOT_PATH = os.path.dirname(SCRIPT_PATH.split('/itsm')[0])
sys.path.append(ROOT_PATH)
sys.path.append(SCRIPT_PATH)

from vault import Vault
import tech_buddy_autogen
import visual_analyzer

class ChangeManagement:
    def __init__(self):
        """Initialize the Change Management system."""
        conf_f_path = ROOT_PATH + '/mim_project/config/mim_conf.json'

        # Read configuration file
        with open(conf_f_path) as conf_f:
            mim_conf = json.load(conf_f)

        self.snow_url = mim_conf['snow_url']

        if self.snow_url.endswith('/'):
            self.snow_url = self.snow_url[:-1]

        # Initiate vault
        vault_path = ROOT_PATH + '/mim_project/config/.vault_token'

        vault_file = open(vault_path, 'r')
        vault_token = vault_file.read().strip()
        vault_file.close()

        vault_url = mim_conf['vault_url']
        self.vault_session = Vault(vault_url, vault_token)

        self.ke_category = mim_conf["ke_category_name"]

        if mim_conf['proxy_url']:
            self.proxies = {
              "http"  : mim_conf['proxy_url'],
              "https" : mim_conf['proxy_url']
            }
        else:
            self.proxies = None

        snow_tag = mim_conf['snow_tag']

        if self.snow_url.endswith('/'):
            self.snow_url = self.snow_url[:-1]

        snow_creds = self.vault_session.retrieve_secret(snow_tag)
        if snow_creds[0]:
            for k, v in snow_creds[1].items():
                self.snow_username = k
                self.snow_password = v
        else:
            self.snow_username = None
            self.snow_password = None

        # self.snow_username = username
        # self.snow_password = password

        self.headers = {'content-type': 'application/json'}

   
    def handle_arch_upload(self, uploaded_file = ""):
        """Handle the uploaded file for architecture diagram."""

        uploaded_files = ""
        with open(SCRIPT_PATH + "/static/" + uploaded_file, "wb") as file:
            file.write(uploaded_file.getvalue())
            uploaded_files += ", " + uploaded_file

        if uploaded_files.startswith(","):
            uploaded_files = uploaded_files[1:]

        uploaded_files = ", ".join(set(uploaded_files.split(",")))

        return uploaded_files
    
    def draft_change_prompt(self, change_title, change_purpose, os_info, uploaded_files = "", config_items = ""):
        print(datetime.datetime.now())
        change_creation_prompt = self.create_prompt_for_change_request(change_title, change_purpose, config_items, os_info)
        print(datetime.datetime.now())
        print(change_creation_prompt)
        refined_prompt = "Please find below the requirement drafted by user - \n\n--------------------------------\n"
        refined_prompt += change_creation_prompt
        refined_prompt += "\n---------------------------------\n"
    
        ca_obj = ChangeAssistant()
        reference_changes = ca_obj.get_compressed_response(change_creation_prompt)
        print(datetime.datetime.now())
        print(reference_changes)

        if reference_changes != {}:
            refined_prompt += "\nBelow are historical change requests for your reference those were raised for same or similar requirement - \n"

            for chg_number, chg_details in reference_changes.items():
                refined_prompt += chg_number + "\n" + chg_details + "\n\n"

            refined_prompt += "\n---------------------------------" + "\n"

        result = {}

        outcome = self.create_change(refined_prompt)
        print(datetime.datetime.now())
        print(f"Printing Outcome from compressed response:  \n {outcome}")

        result["change_details"] = outcome
        impact_with_svc_map = self.analyze_change_impact_with_service_map(result["change_details"]["short_description"], result["change_details"]["description"], ci_items = config_items)
        impact_analysis = impact_with_svc_map
        print(uploaded_files)
        
        print(datetime.datetime.now())
        print(f"Printing Impact Anlaysis \n {impact_analysis}")
        if uploaded_files.strip() != "":
            #arch_image = self.handle_arch_upload(uploaded_file = uploaded_files)
            arch_image = uploaded_files
            impact_with_arch = self.analyze_change_impact_with_arch_diagram(short_description = result["change_details"]["short_description"], description= result["change_details"]["description"], uploaded_files = arch_image)

            if impact_analysis != "":
                impact_analysis += "\n\n" + impact_with_arch
            else:
                impact_analysis = impact_with_arch
        result["impact_analysis"] = impact_analysis
        return result

    def create_change(self, cr_create_prompt):
        

        refined_prompt = cr_create_prompt + "\n\nWith this background, create a JSON document for change request with below keys - \n"
        refined_prompt += "short_description\ndescription\nimplementation_plan\nbackout_plan\ntest_plan\nchg_model: normal or emergency"
        refined_prompt += "\nPlease ensure that the value corresponding to each key is a string. In a string, new point should start on new line. Examples can have different IPs/names. But document should not influence of those specifics. Please feel free to add missing steps and elaboration."

        # print(refined_prompt)

        outcome = visual_analyzer.ask_llm_in_isolation(refined_prompt)
        # print(outcome.content)
        outcome.content = "{" + outcome.content.replace("\n", "").split("{")[-1].split("}")[0].strip() + "}"
        outcome.content = json.loads(outcome.content)

        change= {}

        change["short_description"] = outcome.content["short_description"]
        change["description"] = outcome.content["description"]
        change["implementation_plan"] = outcome.content["implementation_plan"]
        change["backout_plan"] = outcome.content["backout_plan"]
        change["test_plan"]= outcome.content["test_plan"]
        change["chg_model"] = outcome.content["chg_model"]

        outcome = "Change Model - " + change["chg_model"]
        outcome += "\n\nShort Description - " + change["short_description"]
        outcome += "\n\nDescription - " + change["description"]
        outcome += "\n\nImplementation Plan - \n" + change["implementation_plan"]
        outcome += "\n\nBackout Plan - \n" + change["backout_plan"]
        outcome += "\n\nTest Plan - \n" + change["test_plan"]
        outcome += "\n\nHowever, you will be able to proceed with the action within schedule of this change post approval."

        return change

    def create_change_with_impact(self, uploaded_files = "", change = {}, config_items = ""):
        """Create a change request with impact analysis and attachments."""

        itsm_obj = ITSM()
        change_with_impact = {}
        attachments = []

        attachments.append(uploaded_files)
        '''
        files = self.handle_arch_upload(uploaded_files)
        if files != "":
            for file in files.split(","):
                attachments.append(file.strip())
        '''
        change_created= itsm_obj.create_change_request(short_description = change["short_description"],
                                                description = change["description"],
                                                ci = config_items,
                                                chg_model = change["chg_model"],
                                                implementation_plan = change["implementation_plan"],
                                                backout_plan = change["backout_plan"],
                                                test_plan = change["test_plan"],
                                                risk_impact_analysis = change["risk_impact_analysis"],
                                                attachments = attachments)
        change_with_impact["change_number"] = change_created["number"]
        change_with_impact["change_link"] = change_created["target_link"]

        return change_with_impact

    def analyze_change_impact_with_service_map(self, short_description, description, ci_items):
        """Analyze the impact of change on service maps of configuration items."""
        service_map_explanations = []
        itsm_obj = ITSM()
        ci_items = ci_items.split(",")
        for ci in ci_items:
            if ci.strip() == "":
                continue

            ci_obj = itsm_obj.get_cmdb_ci(ci.strip())
            if ci_obj != []:
                ci_obj = ci_obj[0]
            else:
                continue

            service_map = itsm_obj.get_parents_children(ci_obj["sys_id"], "parent")
            service_map = service_map[::-1]
            service_map = itsm_obj.get_parents_children(ci_obj["sys_id"], "child", service_map)

            service_map_explanation = "Service Map For CI " + ci.strip() + "-\n"
            for line in service_map:
                service_map_explanation += line.strip() + "\n"

            service_map_explanations.append(service_map_explanation)

        if service_map_explanations != []:
            prompt = "Below are the explanations of service maps associated to various configuration items -\n\n"
            prompt += "\n\n".join(service_map_explanations)

            prompt += "\nChange activity is planned on these CIs. Please list out the potential impact of below change activity on other components in service map - "
            prompt += "\nChange activity - " + short_description + " - " + description
            prompt += "\n\nImpact should be in terms of any service disruption that can happen when change activity is ongoing on overall architecture. Te impact analysis shouldn't just focus on 1 component, rather it's consequences on other connected components too. If applicable, also include challenges that end user can face while accessing the application or services. Explain any disruption or unavailability through logical example. It is must to justify why and how the impact happens."

            outcome = visual_analyzer.ask_llm_in_isolation(prompt)
            return outcome.content

        return ""
    
    def encode_image(self, image):
        """Encodes an image to base64."""
        image_path = SCRIPT_PATH + "/static/" + image
        print(image_path)
        with open(image_path, "rb") as image_file:
            base64_image =  base64.b64encode(image_file.read()).decode("utf-8")
        
        print(base64_image)
        return f"<image>data:image/png;base64,{base64_image}</image> \n"

    def analyze_change_impact_with_arch_diagram(self, short_description = "", description = "", uploaded_files = ""):

        prompt = "Please analyze below images those are likely related to architecture of environment/platform/tool etc.\n"
        '''
        for image in uploaded_files.split(","):
            prompt += "<img static/" + image.strip() + ">\n"
        '''
        prompt += f"<img {SCRIPT_PATH}/static/" + uploaded_files.strip() + ">\n"
        
            #prompt += "SCRIPT_PATH+ "/static/" + image.strip() + "\n"
        #prompt += self.encode_image(uploaded_files.strip())

        prompt += "\nAnalysis method -"
        prompt += "\n1. Check if the image has title."
        prompt += "\n2. Capture all the text information on the image to get right context of the image."
        prompt += "\n3. Try relating drawings around the text."
        prompt += "\n4. Check if there are multiple entities in the image which extablish some relationship."

        prompt += "\n\nPost analysis, list out the potential impact of below change activity on other components of the architecture - "
        prompt += "\nChange activity - " + short_description + " - " + description
        prompt += "\n\nImpact should be in terms of any service disruption that can happen when change activity is ongoing. Include specific details like names or IPs of impacted components if available. Include challenges that end user can face while accessing the application or services if applicable. Explain any disruption or unavailability through logical example. It is must to justify why and how the impact happens."

        history = []
        outcome = visual_analyzer.chat_with_llm(prompt, history, "")
        return outcome
    
    def create_prompt_for_change_request(self, change_title, change_purpose, config_items, os_info):
        
        prompt = "Please read the following details those are submitted by user for raising an IT change request-\n\n"

        if change_title not in ["", None]:
            prompt += "Change title - " + change_title + "\n\n"

        if change_purpose not in ["", None]:
            prompt += "Change purpose - " + change_purpose + "\n\n"

        if config_items not in ["", None]:
            prompt += "Configuration items - " + config_items + "\n\n"

        if os_info not in ["", None]:
            prompt += "Operating system of configuration items - " + os_info + "\n\n"

        prompt += "Assume that you are a GenAI prompt engineer. With above data collected, form a prompt to create a change request. It should be primarily understood by LLM. Kindly exclude any justifications before or after prompt."

        if change_title in ["", None] and change_purpose in ["", None]:
            pass
        else:
            change_creation_prompt = tech_buddy_autogen.ask_llm_in_isolation(prompt).content + ". The steps should be details and must include applicable CLI commands, steps for UI navigation, APIs etc."

        return change_creation_prompt
