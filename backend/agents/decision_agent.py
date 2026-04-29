from openai import OpenAI
import json
from dotenv import load_dotenv
import os
from typing import List, Any

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def decision_agent(products: List[Any]):

    prompt = f"""
You are an expert business AI agent.

Analyze these products:
{json.dumps(products, indent=2)}

Return ONLY valid JSON:
{{
    "decisions":[
        {{
            "action": "..",
            "execute": true,
            "priority": 1,
            "reason": "...",
            "impact": "..."
        }}
    ]
}}
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role":"user", "content": prompt}],
        temperature=0.4,
    )

    content = response.choices[0].message.content.strip()
    return json.loads(content)