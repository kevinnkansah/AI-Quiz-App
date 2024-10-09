import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AIGeneratedQuizCorrections = () => {
  const [questions, setQuestions] = useState([]);
  const [mistakes, setMistakes] = useState([]);
  const [explanations, setExplanations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [visibleExplanations, setVisibleExplanations] = useState({})
  const explanationsHaveData = (data) => {
    return data && Array.isArray(data) && data.length > 0;  // Check if it's a valid array and not empty
  };

  useEffect(() => {
    const fetchAIQuestionsAndMistakes = async () => {
      try {
        const [questionsResponse, mistakesResponse, explanationResponse] = await Promise.all([
          fetch('http://localhost:5000/api/new-questions'),
          fetch('http://localhost:5000/api/ai-mistakes'),
          fetch('http://localhost:5000/api/ai-mistake-explanation')
        ]);

        if (!questionsResponse.ok || !mistakesResponse.ok || !explanationResponse.ok) {
          throw new Error('Network response was not ok');
        }

        const questionsData = await questionsResponse.json();
        const mistakesData = await mistakesResponse.json();
        const explanationsData = await explanationResponse.json();

        setQuestions(questionsData);
        setMistakes(mistakesData);

        if (explanationsHaveData(explanationsData)) {
          setExplanations(explanationsData);
        } else {
          setError('Explanations data is empty or invalid');
        }

        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchAIQuestionsAndMistakes();
  }, []);


  const toggleExplanation = (questionId) => {
    const updatedVisibility = {...visibleExplanations};
    updatedVisibility[questionId] = !updatedVisibility[questionId];
    setVisibleExplanations(updatedVisibility);
  }

  if (isLoading) return (
    <section className="dots-container">
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
    </section>
  );

  if (error) return <div>{error}</div>;
  if (questions.length === 0) return <div>No questions available.</div>;

  return (
    <div className='quiz-corrections'>
      <h2>Quiz Corrections</h2>
      {questions.map((question, index) => (
        <div key={index} className='question-correction'>
          <h3>Question {index + 1}</h3>
          <p>{question.question}</p>
          <ul>
            {question.answers.map((answer) => {
              const isMistake = mistakes.some(m => m.question === question.question && m.user_answer === answer.text);

              return (
                <li
                  key={answer.id}
                  className={answer.isCorrect ? 'correct-answer' : (isMistake ? 'user-mistake' : '')}
                >
                  {answer.text}
                  {answer.isCorrect && <span className='correct-answer-span'> (Correct Answer)</span>}
                  {isMistake && <span className='user-mistake-span'> (Your Answer)</span>}

                  {isMistake && (
                    <label className='eye-container'>
                    <button className="show-hide-btn" onClick={() => toggleExplanation(question.id)}>
                    <span className='toggle-text'>{visibleExplanations[question.id] ? 'Hide Explanation' : 'Show Explanation'}</span>
                      {visibleExplanations[questions[index].id] ? (
                        <svg class="eye-slash" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 640 512"><path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z"></path></svg>
                      ) : (
                        <svg class="eye" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"></path></svg>
                      )}
                    </button> 
                    </label>
                  )}

                  {isMistake && visibleExplanations[question.id] && (
                    <div className='explanation visible'>
                      <p className='explanation-text'>
                        {explanations.find((explanation) => explanation.id === question.id)?.explanation}
                      </p>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      <button className='back-to-quiz-button' onClick={() => navigate('/')}>Back to Learning</button>
    
    </div>
  );
};

export default AIGeneratedQuizCorrections;