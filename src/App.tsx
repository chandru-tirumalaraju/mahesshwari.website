import React, { useState } from 'react';
import { User2, Brain } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
}

interface Person {
  id: string;
  name: string;
  questions: Question[];
  correctImage: string;
  allCorrectImage: string;
}

// This will be replaced with API calls
/*
const MOCK_DATA: Person[] = [
  {
    id: '1',
    name: 'Alice',
    questions: [
      {
        id: 1,
        text: "What is Alice's favorite color?",
        options: ['Blue', 'Red', 'Green', 'Yellow'],
        correctAnswer: 'Blue'
      },
      {
        id: 2,
        text: "What is Alice's favorite season?",
        options: ['Spring', 'Summer', 'Fall', 'Winter'],
        correctAnswer: 'Spring'
      }
    ],
    correctImage: 'https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1',
    allCorrectImage: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94'
  },
  {
    id: '2',
    name: 'Bob',
    questions: [
      {
        id: 1,
        text: "What is Bob's favorite sport?",
        options: ['Football', 'Basketball', 'Tennis', 'Soccer'],
        correctAnswer: 'Basketball'
      },
      {
        id: 2,
        text: "What is Bob's favorite food?",
        options: ['Pizza', 'Burger', 'Sushi', 'Pasta'],
        correctAnswer: 'Pizza'
      }
    ],
    correctImage: 'https://images.unsplash.com/photo-1546519638-68e109498ffc',
    allCorrectImage: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131'
  }
];
*/
const API_URL = 'https://4f4pbirzpj.execute-api.ap-south-1.amazonaws.com/dev';

const submitAnswers = async (name: string, answers: string[]) => {
  try {
    const response = await fetch(`${API_URL}/fournames/${name}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answers }),
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

function App() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  const handlePersonSelect = (person: Person) => {
    setSelectedPerson(person);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setShowResult(false);
  };

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestionIndex < 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  const getCorrectAnswersCount = () => {
    if (!selectedPerson) return 0;
    return answers.reduce((count, answer, index) => {
      return count + (answer === selectedPerson.questions[index].correctAnswer ? 1 : 0);
    }, 0);
  };

  const renderResult = () => {
    if (!selectedPerson) return null;
    const correctCount = getCorrectAnswersCount();
    const imageUrl = correctCount === 2 ? selectedPerson.allCorrectImage : 
                    correctCount === 1 ? selectedPerson.correctImage : '';

    return (
      <div className="text-center">
        <h3 className="text-xl font-bold mb-4">
          You got {correctCount} correct answers!
        </h3>
        {imageUrl && (
          <img 
            src={imageUrl} 
            alt="Result" 
            className="w-full max-w-md mx-auto rounded-lg shadow-lg"
          />
        )}
        <button
          onClick={() => setSelectedPerson(null)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Start Over
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Interactive Quiz App
        </h1>

        {!selectedPerson ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_DATA.map((person) => (
              <button
                key={person.id}
                onClick={() => handlePersonSelect(person)}
                className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition flex items-center space-x-4"
              >
                <User2 className="w-8 h-8 text-blue-500" />
                <span className="text-xl font-semibold">{person.name}</span>
              </button>
            ))}
          </div>
        ) : showResult ? (
          renderResult()
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="flex items-center space-x-2 mb-6">
              <Brain className="w-6 h-6 text-blue-500" />
              <h2 className="text-2xl font-bold">
                Question {currentQuestionIndex + 1}
              </h2>
            </div>
            <p className="text-xl mb-6">
              {selectedPerson.questions[currentQuestionIndex].text}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedPerson.questions[currentQuestionIndex].options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  className="p-4 text-left border rounded-lg hover:bg-blue-50 transition"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;