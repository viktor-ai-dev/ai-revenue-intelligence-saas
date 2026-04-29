from openai import OpenAI
import json
from dotenv import load_dotenv
import os

load_dotenv()
client =  OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def decision_agent(products: any[]):

    prompt = f"""

    You are an expert business AI agent. 

    Analyze these products:
    {products}

    You must:

    1. Select the BEST actions to execute.
    2. Prioritize them
    3. Decide if they should be executed automatically

    Return ONLY valid JSON:
    {{
        "decisions":[
            {{
                "action": "..",
                "execute": "true/false",
                "priority": "1-5",
                "reason": "...",
                "impact": "..."
            }}
        ]
    }}

    Be aggressive and do your VERY BEST in improving revenue.
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role":"user", "content": prompt}],
        temperature=0.4
    )

    return json.loads(response.choices[0].message.content)