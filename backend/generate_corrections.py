import json
import ollama

# Load mistakes and questions from JSON files
with open('backend/mistakes.json') as f:
    mistakes = json.load(f)

with open('backend/questions.json') as f:
    questions = json.load(f)

# Create a dictionary to store explanations with question IDs
explanations = {}

# Generate explanations for each mistake
for mistake in mistakes:
    question_text = mistake['question']
    question_id = next((q['id'] for q in questions if q['question'] == question_text), None)
    
    if question_id is not None:
        user_answer = mistake['user_answer']
        correct_answer = mistake['correct_answer']
        system_prompt = f"""
        YOU ARE TEACHER.
        Generate a concise explanation for why '{user_answer}' is incorrect and '{correct_answer}' is the correct answer for the question: '{question_text}'.

        STRICT REQUIREMENTS:
        1. Explanation MUST be exactly 2 sentences long. No more, no less.
        2. Use clear, simple English suitable for a general audience.
        3. First sentence: Briefly explain why the user's answer is incorrect.(do not mention them in the response)
        4. Second sentence: Succinctly state why the correct answer is right.
        5. Do not use introductory phrases or unnecessary words.
        6. Focus solely on the specific mistake and correction.
        7. Do not provide additional context or examples beyond the question scope.
        8. Ensure your response is direct, informative, and to the point.
        """
        stream = ollama.chat(
            model=[v['name'] for v in ollama.list()['models']][0],
            messages=[
                {'role': 'system', 'content': system_prompt},
                {'role': 'user', 'content': 'Generate a explanation, as punctual and short as possible.'},
            ],
            stream=True,
        )
        output_text = []
        for chunk in stream:
            print(chunk['message']['content'], end='', flush=True)
            output_text.append(chunk['message']['content'])
        explanation = ''.join(output_text)
        
        # Store explanation with question ID
        explanations[question_id] = {
            'id': question_id,
            'explanation': explanation
        }

# Output explanations in a format compatible with QuizCorrections.js
output = list(explanations.values())

# Save output to a file (e.g., explanations.json)
with open('backend/explanations.json', 'w') as f:
    json.dump(output, f, indent=4)