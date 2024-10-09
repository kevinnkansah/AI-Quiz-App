from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
import time
import subprocess

app = Flask(__name__)
CORS(app)

mistakes = [] 
ai_mistakes = []
last_quiz_generation_time = 0
new_questions = []
explanations_generated = False  
ai_explanations_generated = False

def load_questions():
    with open('backend/questions.json') as f:
        return json.load(f)

questions = load_questions()

@app.route('/api/questions', methods=['GET'])
def get_questions():
    return jsonify(questions)

@app.route('/api/submit', methods=['POST'])
def submit_quiz():
    global explanations_generated
    explanations_generated = False  # Reset the flag when a new quiz is submitted
    answers = request.json
    score = 0
    total_questions = len(questions)
    user_answers = []
    mistakes.clear()  

    for i, question in enumerate(questions):
        user_answer = answers.get(str(i))
        if user_answer is not None:
            correct_answer = next((a for a in question['answers'] if a['isCorrect']), None)
            user_answer_text = next((a['text'] for a in question['answers'] if a['id'] == user_answer), None)
            is_correct = correct_answer and user_answer == correct_answer['id']

            user_answers.append({
                'question': question['question'],
                'user_answer': user_answer_text,
                'correct_answer': correct_answer['text'],
                'is_correct': is_correct,
                'answers': question['answers']
            })

            if not is_correct:
                mistakes.append({
                    'question': question['question'],
                    'user_answer': user_answer_text,
                    'correct_answer': correct_answer['text']
                })  

            if is_correct:
                score += 1
    with open('backend/mistakes.json', 'w') as f:
        json.dump(mistakes, f)
    
    return jsonify({
        'score': score,
        'total': total_questions,
        'percentage': (score / total_questions) * 100,
        'user_answers': user_answers,
        'mistakes': mistakes
    })
 


@app.route('/api/mistakes', methods=['GET'])
def load_mistakes():
    with open('backend/mistakes.json') as f:
        return json.load(f)

def generate_new_quiz():
    try:
        subprocess.run(['python3', 'backend/generate_quiz.py'], check=True)
        print("New quiz generated successfully.")
    except subprocess.CalledProcessError as e:
        print(f"Error generating new quiz: {e}")

@app.route('/generate-quiz', methods=['POST'])
def generate_quiz_route():
    global last_quiz_generation_time
    generate_new_quiz()
    last_quiz_generation_time = time.time()
    return jsonify({"message": "New quiz generated successfully"})

@app.route('/api/new-questions', methods=['GET'])
def get_new_questions():
    return jsonify(new_questions)

def load_new_questions():
    global last_quiz_generation_time
    file_path = 'backend/generated_questions.json'
    if not os.path.exists(file_path):
        with open(file_path, 'w') as f:
            json.dump([], f)
    while time.time() - last_quiz_generation_time < 1:
        time.sleep(0.1)
    with open(file_path, 'r') as f:
        return json.load(f)

@app.before_request
def load_new_questions_before_request():
    global new_questions
    new_questions = load_new_questions()

@app.route('/api/ai-submit', methods=['POST'])
def ai_submit_quiz():
    answers = request.json
    score = 0
    total_questions = len(new_questions)
    user_answers = []
    global ai_mistakes
    global ai_explanations_generated
    ai_explanations_generated = False
    ai_mistakes = []

    for i, question in enumerate(new_questions):
        user_answer = answers.get(str(i))
        if user_answer is not None:
            correct_answer = next((a for a in question['answers'] if a['isCorrect']), None)
            user_answer_text = next((a['text'] for a in question['answers'] if a['id'] == user_answer), None)
            is_correct = correct_answer and user_answer == correct_answer['id']
            user_answers.append({
                'question': question['question'],
                'user_answer': user_answer_text,
                'correct_answer': correct_answer['text'],
                'is_correct': is_correct,
                'answers': question['answers']
            })
            if not is_correct:
                ai_mistakes.append({
                    'question': question['question'],
                    'user_answer': user_answer_text,
                    'correct_answer': correct_answer['text']
                })
            if is_correct:
                score += 1

    with open('backend/ai_mistakes.json', 'w') as f:
        json.dump(ai_mistakes, f)

    return jsonify({
        'score': score,
        'total': total_questions,
        'percentage': (score / total_questions) * 100,
        'user_answers': user_answers,
        'mistakes': ai_mistakes
    })
last_quiz_generation_time = 0
new_questions = []
ai_mistakes = []

@app.route('/api/ai-mistakes', methods=['GET'])
def load_ai_mistakes():
    with open('backend/ai_mistakes.json') as f:
        return json.load(f)


@app.route('/api/mistake-explanation', methods=['GET'])
def load_explanations():
    global explanations_generated
    explanation_file = 'backend/explanations.json'
    
    # Check if explanations have already been generated for this session
    if explanations_generated:
        # Load and return the existing explanations
        with open(explanation_file, 'r') as f:
            data = json.load(f)
        return jsonify(data)
    
    # If explanations haven't been generated, generate new ones
    data = generate_explanation()
    
    # Save the generated explanations to explanations.json
    with open(explanation_file, 'w') as f:
        json.dump(data, f)
    time.sleep(5)
    # Set the flag to prevent regeneration in this session
    explanations_generated = True
    
    return jsonify(data)


def generate_explanation():
    try:
        subprocess.run(['python3', 'backend/generate_corrections.py'], check=True)
        print("generate_corrections.py ran successfully.")
        with open('backend/explanations.json', 'r') as f:
            return json.load(f)
    except subprocess.CalledProcessError as e:
        print(f"Error generating Explanations: {e}")
        return {"error": str(e)}


@app.route('/generate-explanation', methods=['POST'])
def generate_explanation_route():
    data = generate_explanation()
    return jsonify(data)


@app.route('/api/ai-mistake-explanation', methods=['GET'])
def load_ai_explanations():
    global ai_explanations_generated
    explanation_file = 'backend/ai_explanations.json'
    
    # Check if explanations have already been generated for this session
    if ai_explanations_generated:
        # Load and return the existing explanations
        with open(explanation_file, 'r') as f:
            data = json.load(f)
        return jsonify(data)
    
    # If explanations haven't been generated, generate new ones
    data = ai_generate_explanation()
    
    # Save the generated explanations to ai_explanations.json
    with open(explanation_file, 'w') as f:
        json.dump(data, f)
    time.sleep(5)
    # Set the flag to prevent regeneration in this session
    ai_explanations_generated = True
    
    return jsonify(data)

def ai_generate_explanation():
    try:
        subprocess.run(['python3', 'backend/ai_generate_corrections.py'], check=True)
        print("ai_generate_corrections.py ran successfully.")
        with open('backend/ai_explanations.json', 'r') as f:
            return json.load(f)
    except subprocess.CalledProcessError as e:
        print(f"Error generating AI Explanations: {e}")
        return {"error": str(e)}

@app.route('/api/ai-generate-explanation', methods=['POST'])
def ai_generate_explanation_route():
    data = ai_generate_explanation()
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True, port=5000)