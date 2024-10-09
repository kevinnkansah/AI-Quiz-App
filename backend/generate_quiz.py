import ollama
import json


with open('/home/negus/Documents/AI Quiz App/backend/mistakes.json') as f:
    mistake_data = json.load(f)

number_of_questions = len(mistake_data)

system_prompt = f'''
You task is to generate data for a JSON file in the format specified below. 
This data is for a Italian to English course quiz on grammar and vocabulary also translations.
There are placeholders in the code. Only generate the data; do not generate anything else.
There must be 4 options to choose from, but only 1 is correct; 
the correct answer does not need to be in the same position every time.


The questions will be based off these ones {mistake_data}

1.Generate similar questions and answers as the ones below.
2.Generate {number_of_questions} questions.
3.From the template you are only modifying PlaceholderQuestion, PlaceholderAnswer, PlaceHolderfalse/PlaceHoldertrue.
4.The ID always starts at 1.
5, Maximum length of a quiz is {number_of_questions} questions.

This is a list of 1 question and this is the template you shall use:
[
    {{
        "id": 1,
        "question": "PlaceholderQuestion",
        "answers": [
            {{ "id": 1, "text": "PlaceholderAnswer", "isCorrect": PlaceHolderfalse }},
            {{ "id": 2, "text": "PlaceholderAnswer", "isCorrect": PlaceHolderfalse }},
            {{ "id": 3, "text": "PlaceholderAnswer", "isCorrect": PlaceHoldertrue }},
            {{ "id": 4, "text": "PlaceholderAnswer", "isCorrect": PlaceHolderfalse }}
        ]
    }}
]
'''
output_text = []

# Initialize conversation with system prompt
stream = ollama.chat(
    # 0 is qwen 14B and 1 is llama 3.2 3b
    model=[v['name'] for v in ollama.list()['models']][0],
    messages=[
        {'role': 'system', 'content': system_prompt},
        {'role': 'user', 'content': 'Generate data'},
    ],
    stream=True,
)


for chunk in stream:
    output_text.append(chunk['message']['content'])
    print(chunk['message']['content'], end='', flush=True)
    
output_text = ''.join(output_text)
data=json.loads(output_text)

with open('backend/generated_questions.json', 'w') as json_file:
    json.dump(data, json_file, indent=4)