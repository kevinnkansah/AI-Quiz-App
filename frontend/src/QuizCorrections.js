import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const QuizCorrections = () => {
  const [questions, setQuestions] = useState([]);
  const [mistakes, setMistakes] = useState([]);
  const [explanations, setExplanations] = useState([]);  // Store explanations
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const navigate = useNavigate();
  const [visibleExplanations, setVisibleExplanations] = useState({});  // Store visibility state for explanations
  const explanationsHaveData = (data) => {
    return data && Array.isArray(data) && data.length > 0;  // Check if it's a valid array and not empty
  };

  useEffect(() => {
    const fetchQuestionsAndMistakes = async () => {
      try {
        const [questionsResponse, mistakesResponse, explanationResponse] = await Promise.all([
          fetch('http://localhost:5000/api/questions'),
          fetch('http://localhost:5000/api/mistakes'),
          fetch('http://localhost:5000/api/mistake-explanation')
        ]);

        if (!questionsResponse.ok || !mistakesResponse.ok || !explanationResponse.ok) {
          throw new Error('Network response was not ok');
        }

        const questionsData = await questionsResponse.json();
        const mistakesData = await mistakesResponse.json();
        const explanationsData = await explanationResponse.json();

        setQuestions(questionsData);
        setMistakes(mistakesData);

        // Check if explanations have valid data before setting state
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

    fetchQuestionsAndMistakes();
  }, []);

  const handleGenerateQuiz = async () => {
    setIsGeneratingQuiz(true);

    try {
      const response = await axios.post('http://localhost:5000/generate-quiz');
      if (response.data.message === "New quiz generated successfully") {
        navigate('/ai-quiz');
      } else {
        setError('Unexpected response from server. Please try again.');
      }
    } catch (error) {
      console.error('Error generating quiz:', error);
      setError('Error generating quiz. Please try again.');
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  // Change the toggleExplanation function parameter from index to questionId
  const toggleExplanation = (questionId) => {
    const updatedVisibility = {...visibleExplanations};
    updatedVisibility[questionId] = !updatedVisibility[questionId];
    setVisibleExplanations(updatedVisibility);
  };


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

                  {/* Show/Hide button for explanation */}
                  {isMistake && (
                    <label className='eye-container'>
                    <button className="show-hide-btn" onClick={() => toggleExplanation(question.id)}>
                    <span className='toggle-text'>{visibleExplanations[question.id] ? 'Hide Explanation' : 'Show Explanation'}</span>
                      {visibleExplanations[questions[index].id] ? (
                        // Open eye SVG (when explanation is visible)
                        <svg class="eye-slash" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 640 512"><path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z"></path></svg>
                      ) : (
                        // Closed eye SVG (when explanation is hidden)
                        <svg class="eye" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"></path></svg>
                      )}
                    </button> 
                    </label>
                  )}

                  {/* Explanation section, shown/hidden based on state */}
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
      <button 
        className='ai-quiz-button' 
        onClick={handleGenerateQuiz}
        disabled={isGeneratingQuiz}
      > <div class="dots_border"></div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        class="sparkle"
      >
        <path
          class="path"
          stroke-linejoin="round"
          stroke-linecap="round"
          stroke="black"
          fill="black"
          d="M14.187 8.096L15 5.25L15.813 8.096C16.0231 8.83114 16.4171 9.50062 16.9577 10.0413C17.4984 10.5819 18.1679 10.9759 18.903 11.186L21.75 12L18.904 12.813C18.1689 13.0231 17.4994 13.4171 16.9587 13.9577C16.4181 14.4984 16.0241 15.1679 15.814 15.903L15 18.75L14.187 15.904C13.9769 15.1689 13.5829 14.4994 13.0423 13.9587C12.5016 13.4181 11.8321 13.0241 11.097 12.814L8.25 12L11.096 11.187C11.8311 10.9769 12.5006 10.5829 13.0413 10.0423C13.5819 9.50162 13.9759 8.83214 14.186 8.097L14.187 8.096Z"
        ></path>
        <path
          class="path"
          stroke-linejoin="round"
          stroke-linecap="round"
          stroke="black"
          fill="black"
          d="M6 14.25L5.741 15.285C5.59267 15.8785 5.28579 16.4206 4.85319 16.8532C4.42059 17.2858 3.87853 17.5927 3.285 17.741L2.25 18L3.285 18.259C3.87853 18.4073 4.42059 18.7142 4.85319 19.1468C5.28579 19.5794 5.59267 20.1215 5.741 20.715L6 21.75L6.259 20.715C6.40725 20.1216 6.71398 19.5796 7.14639 19.147C7.5788 18.7144 8.12065 18.4075 8.714 18.259L9.75 18L8.714 17.741C8.12065 17.5925 7.5788 17.2856 7.14639 16.853C6.71398 16.4204 6.40725 15.8784 6.259 15.285L6 14.25Z"
        ></path>
        <path
          class="path"
          stroke-linejoin="round"
          stroke-linecap="round"
          stroke="black"
          fill="black"
          d="M6.5 4L6.303 4.5915C6.24777 4.75718 6.15472 4.90774 6.03123 5.03123C5.90774 5.15472 5.75718 5.24777 5.5915 5.303L5 5.5L5.5915 5.697C5.75718 5.75223 5.90774 5.84528 6.03123 5.96877C6.15472 6.09226 6.24777 6.24282 6.303 6.4085L6.5 7L6.697 6.4085C6.75223 6.24282 6.84528 6.09226 6.96877 5.96877C7.09226 5.84528 7.24282 5.75223 7.4085 5.697L8 5.5L7.4085 5.303C7.24282 5.24777 7.09226 5.15472 6.96877 5.03123C6.84528 4.90774 6.75223 4.75718 6.697 4.5915L6.5 4Z"
        ></path>
      </svg>
      <span class="text_button">{isGeneratingQuiz ? 'Generating...' : 'Generate Quiz'}</span>
        
      </button>
    </div>
  );
};

export default QuizCorrections;
