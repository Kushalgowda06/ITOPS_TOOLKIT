import json
import requests

def get_response_from_llm():
    endpoint = "https://aiinfusedterraformmodel.cognitiveservices.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2025-01-01-preview"
    api_key = "0911999a1afe4ccdaa361cb2c801ee11"
    
    headers = {
        "Content-Type": "application/json",
        "api-key": api_key
        
    }
    
    data = {
        "messages": [
            {"role": "user", "content": "What is the capital of India?"},
            {"role": "system", "content": "New Delhi"},
            {"role": "user", "content": "What is it for Bangladesh?"}
            ],
            "temperature": 0.7,
            "max_tokens": 1000
        
    }
    
    response = requests.post(endpoint, headers = headers, json = data)
    print(response.json()["choices"][0]["message"]["content"])

response = get_response_from_llm()
