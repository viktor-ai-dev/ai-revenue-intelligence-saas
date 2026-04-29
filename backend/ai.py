from openai import OpenAI
from dotenv import load_dotenv
import os
import json
import re

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def generate_answer(question, context):
    prompt = f"""

    Question: 
    {question}
    
    Context:
    {context}

    You are a revenue intelligence analyst.

    Return ONLY valid JSON with EXACT schema:
    {{
    "summary": string,
    "products": [
        {{
        "name": string,
        "profit": number,
        "insights": [string]
        }}
    ],
    "answer": string
    }}

    Rules:
    - Use lowercase keys ONLY
    - Do NOT use "Name" or "Profit"
    - Do NOT add extra fields
    - Return ONLY JSON, no text
    """

    res = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )

    raw = res.choices[0].message.content

    # 🔥 CLEAN LLM OUTPUT
    cleaned = re.sub(r"```json|```", "", raw).strip()

    return json.loads(cleaned)