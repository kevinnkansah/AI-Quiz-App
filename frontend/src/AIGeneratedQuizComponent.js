import React, { useState, useEffect } from 'react';

const AIGeneratedQuizComponent = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/new-questions')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setQuestions(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching questions:', error);
        setError('Failed to load questions. Please try again later.');
        setIsLoading(false);
      });
  }, []);

  const handleAnswerChange = (questionId, answerId) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    fetch('http://localhost:5000/api/ai-submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userAnswers),
    })
      .then(response => response.json())
      .then(data => {
        setQuizResult(data);
        setQuizSubmitted(true);
      })
      .catch(error => {
        console.error('Error submitting quiz:', error);
        setError('Failed to submit quiz. Please try again.');
      });
  };

  if (isLoading) return 
  <section className="dots-container">
    <div className="dot"></div>
    <div className="dot"></div>
    <div className="dot"></div>
    <div className="dot"></div>
    <div className="dot"></div>
  </section>;

  if (error) return <div>{error}</div>;
  if (questions.length === 0) return <div>No questions available.</div>;

  if (quizSubmitted) {
    return (
      <div className='quiz-result'>
        <h2>Quiz Results</h2>
        <p>Score: {quizResult.score} out of {quizResult.total}</p>
        <p>Percentage: {quizResult.percentage.toFixed(2)}%</p>
        {quizResult.score === quizResult.total ? (
          <p>Congratulations! You got a perfect score!</p>
        ) : (
          <p>Great effort! Keep practicing to improve your score.</p>
        )}
        <button className='view-answers-button' onClick={() => window.location.href = '/ai-quiz-corrections'}>
          View Correct Answers
        </button>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;

  return (
    <div className='quiz-container'>
      <p className='question'>Question {currentQuestion + 1} of {questions.length}</p>
      <p className='quiz-question'>{question.question}</p>
      <ul className='quiz-answers'>
        {question.answers.map((answer) => (
          <li key={answer.id}>
            <input
              type="radio"
              id={`answer-${answer.id}`}
              name={`question-${currentQuestion}`}
              checked={userAnswers[currentQuestion] === answer.id}
              onChange={() => handleAnswerChange(currentQuestion, answer.id)}
            />
            <label htmlFor={`answer-${answer.id}`}>{answer.text}</label>
          </li>
        ))}
      </ul>
      <button
        className='previous-button'
        onClick={handlePrevious}
        disabled={currentQuestion === 0}
      >
        Previous
      </button>
      {!isLastQuestion ? (
        <button
          className='next-button'
          onClick={handleNext}
          disabled={!userAnswers[currentQuestion]}
        >
          Next
        </button>
      ) : (
        <button
          className='submit-button'
          onClick={handleSubmit}
          disabled={!userAnswers[currentQuestion]}
        >
          Submit
        </button>
      )}
    </div>
  );
};

export default AIGeneratedQuizComponent;