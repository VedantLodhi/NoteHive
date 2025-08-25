// import React, { useState, useEffect } from "react";
// import { FaClock, FaTrophy } from "react-icons/fa";
// import { motion } from "framer-motion";

// const CPTrivia = () => {
//   const [quizData, setQuizData] = useState([]);
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [score, setScore] = useState(0);
//   const [attemptsLeft, setAttemptsLeft] = useState(2);
//   const [selectedAnswer, setSelectedAnswer] = useState(null);
//   const [quizFinished, setQuizFinished] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [timer, setTimer] = useState(60);
//   const [leaderboard, setLeaderboard] = useState([]);

//   const [topic, setTopic] = useState("Data Structures");
//   const [difficulty, setDifficulty] = useState("Medium");
//   const [numQuestions, setNumQuestions] = useState(5);

//   const topics = [
//     "React Js", "Node Js",
//     "OOPS", "Operating System", "Computer Networks","Linux","Git",
//     "DBMS", "System Design", "Data Structures", "Algorithms"
//   ];

//   const difficulties = ["Easy", "Medium", "Hard"];

//   // Fetch trivia questions
//   const fetchTriviaData = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch("http://localhost:5000/api/generateTrivia", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ topic, difficulty, numQuestions }),
//       });

//       const data = await response.json();
//       console.log("Received Data:", data);

//       if (data.quizzes) {
//         setQuizData(data.quizzes);
//         setCurrentQuestion(0);
//         setScore(0);
//         setAttemptsLeft(2);
//         setQuizFinished(false);
//         setSelectedAnswer(null);
//         setTimer(60);
//       } else {
//         setQuizData([]);
//       }
//     } catch (error) {
//       console.error("Error fetching trivia:", error);
//     }
//     setLoading(false);
//   };

//   // Handle answer selection
//   const handleAnswerClick = (option) => {
//     if (selectedAnswer || attemptsLeft === 0) return;
  
//     if (option === quizData[currentQuestion].answer) {
//       // Correct Answer: Award points based on attempts
//       setScore((prevScore) => prevScore + (attemptsLeft === 2 ? 10 : 5));
//       setSelectedAnswer(option);
//       setTimeout(() => nextQuestion(), 1000);
//     } else {
//       // Wrong Answer: Reduce attempts
//       setAttemptsLeft((prev) => prev - 1);
//       setSelectedAnswer(option);
  
//       if (attemptsLeft === 2) {
//         // First Wrong Attempt: Reset selection after a delay
//         setTimeout(() => setSelectedAnswer(null), 1000);
//       } else {
//         // Second Wrong Attempt: Move to next question
//         setTimeout(() => nextQuestion(), 1000);
//       }
//     }
//   };
  

//   // Move to next question or finish quiz
//   const nextQuestion = () => {
//     if (currentQuestion + 1 < quizData.length) {
//       setCurrentQuestion((prev) => prev + 1);
//       setAttemptsLeft(2);
//       setSelectedAnswer(null);
//       setTimer(60);
//     } else {
//       setQuizFinished(true);
//       updateLeaderboard();
//     }
//   };

//   // Timer logic
//   useEffect(() => {
//     if (quizFinished) return;
//     if (timer === 0) {
//       nextQuestion();
//       return;
//     }

//     const interval = setTimeout(() => setTimer((prev) => prev - 1), 1000);
//     return () => clearTimeout(interval);
//   }, [timer, quizFinished]);

//   // Update leaderboard
//   const updateLeaderboard = () => {
//     setLeaderboard((prev) => [
//       ...prev,
//       { topic, difficulty, score, timestamp: new Date().toISOString() }
//     ]);
//   };

//   const saveLeaderboard = async () => {
//     const token = localStorage.getItem("token");
//     const username = localStorage.getItem("username"); // Ensure username is stored
    
//     if (!token || !username) {
//       console.warn("User not authenticated or missing username.");
//       return;
//     }
  
//     try {
//       const response = await fetch("http://localhost:5000/api/leaderboard/saveLeaderboard", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`,
//         },
//         body: JSON.stringify({ username, topic, difficulty, score }),
//       });
  
//       if (!response.ok) {
//         throw new Error(`Error ${response.status}: ${response.statusText}`);
//       }
  
//       console.log("Leaderboard entry saved successfully.");
//       fetchLeaderboard(); // Refresh leaderboard after saving
//     } catch (error) {
//       console.error("Error saving leaderboard:", error);
//     }
//   };
  
//   const fetchLeaderboard = async () => {
//     const token = localStorage.getItem("token");
  
//     if (!token) {
//       console.warn("No authentication token found.");
//       return;
//     }
  
//     try {
//       const response = await fetch("http://localhost:5000/api/leaderboard/getLeaderboard", {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`,
//         },
//       });
  
//       const data = await response.json();
//       console.log("Raw leaderboard data:", data); // Log the response
  
//       // Ensure leaderboard is an array
//       if (!Array.isArray(data.leaderboard)) {
//         throw new Error("Invalid leaderboard data format");
//       }
  
//       setLeaderboard(data.leaderboard);
//     } catch (error) {
//       console.error("Error fetching leaderboard:", error);
//       setLeaderboard([]); // Ensure leaderboard remains an array
//     }
//   };
  
//   useEffect(() => {
//     fetchLeaderboard();
//   }, []); // Run only once when component loads
  
  

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
//       <h1 className="text-3xl font-bold mb-4 animate-fade-in">
//       💡CP Trivia & Quizzes💡
//       </h1>

//       {/* Topic & Difficulty Selection */}
//       <div className="flex flex-wrap gap-4 mb-4">
//         <select className="px-4 py-2 bg-gray-700 rounded-md" value={topic} onChange={(e) => setTopic(e.target.value)}>
//           {topics.map((t) => <option key={t} value={t}>{t}</option>)}
//         </select>

//         <select className="px-4 py-2 bg-gray-700 rounded-md" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
//           {difficulties.map((d) => <option key={d} value={d}>{d}</option>)}
//         </select>

//         <input type="number" min="1" max="10" value={numQuestions} onChange={(e) => setNumQuestions(e.target.value)}
//           className="px-4 py-2 bg-gray-700 rounded-md text-center w-20" />
//       </div>

//       {/* Generate Quiz Button */}
//       <button onClick={fetchTriviaData} disabled={loading}
//         className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white font-semibold rounded-lg transition-transform transform hover:scale-105 active:scale-95 mb-6">
//         {loading ? "Generating Quiz..." : "Generate Quiz"}
//       </button>

//       {/* Quiz Container */}
//       {!quizFinished && quizData.length > 0 && (
//         <div className="w-full max-w-lg p-6 bg-gray-800 rounded-lg shadow-md animate-fade-in">
//           <h2 className="text-xl font-semibold mb-4">
//             Question {currentQuestion + 1}:
//           </h2>
//           <p className="text-lg">{quizData[currentQuestion].question}</p>

//           <ul className="mt-4 space-y-3">
//             {quizData[currentQuestion].options.map((option, idx) => (
//               <motion.li
//                 key={idx}
//                 onClick={() => handleAnswerClick(option)}
//                 className={`p-3 rounded-lg cursor-pointer transition duration-300 ${
//                   selectedAnswer === option 
//                     ? option === quizData[currentQuestion].answer
//                       ? "bg-green-500"
//                       : "bg-red-500"
//                     : "bg-gray-700 hover:bg-gray-600"
//                 }`}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 {option}
//               </motion.li>
//             ))}
//           </ul>

//           <div className="flex justify-between mt-4">
//             <p className="text-sm text-gray-300">Attempts Left: {attemptsLeft}</p>
//             <p className="text-sm text-red-400 flex items-center">
//               <FaClock className="mr-1" /> Time Left: {timer}s
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Leaderboard */}
//       <div className="w-full max-w-lg mt-6">
//         <h3 className="text-xl font-bold mb-2 flex items-center">
//           <FaTrophy className="mr-2 text-yellow-400" /> Leaderboard
//         </h3>
//         <table className="w-full bg-gray-800 text-white rounded-lg">
//           <thead>
//             <tr className="bg-gray-700">
//               <th className="p-2">#</th>
//               <th className="p-2">Topic</th>
//               <th className="p-2">Difficulty</th>
//               <th className="p-2">Score</th>
//             </tr>
//           </thead>
//           <tbody>
//   {Array.isArray(leaderboard) && leaderboard.length > 0 ? (
//     leaderboard.sort((a, b) => b.score - a.score).map((entry, idx) => (
//       <tr key={idx} className="text-center border-b border-gray-600">
//         <td className="p-2">{idx + 1}</td>
//         <td className="p-2">{entry.topic}</td>
//         <td className="p-2">{entry.difficulty}</td>
//         <td className="p-2">{entry.score}</td>
//       </tr>
//     ))
//   ) : (
//     <tr>
//       <td colSpan="4" className="p-4 text-center text-gray-400">
//         No leaderboard data available.
//       </td>
//     </tr>
//   )}
// </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default CPTrivia;
import React, { useState, useEffect } from "react";
import { FaClock, FaTrophy, FaStar, FaRegSmileBeam, FaRegSadTear } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from 'react-confetti';

const CPTrivia = () => {
  // State declarations
  const [quizData, setQuizData] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [attemptsLeft, setAttemptsLeft] = useState(2);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [topic, setTopic] = useState("Data Structures");
  const [difficulty, setDifficulty] = useState("Medium");
  const [numQuestions, setNumQuestions] = useState(5);

  // Constants
  const topics = [
    "React Js", "Node Js",
    "OOPS", "Operating System", "Computer Networks","Linux","Git",
    "DBMS", "System Design", "Data Structures", "Algorithms"
  ];

  const difficulties = ["Easy", "Medium", "Hard"];

  // Fetch trivia questions
  const fetchTriviaData = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/generateTrivia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, difficulty, numQuestions }),
      });

      const data = await response.json();
      console.log("Received Data:", data);

      if (data.quizzes) {
        setQuizData(data.quizzes);
        setCurrentQuestion(0);
        setScore(0);
        setAttemptsLeft(2);
        setQuizFinished(false);
        setSelectedAnswer(null);
        setTimer(60);
      } else {
        setQuizData([]);
      }
    } catch (error) {
      console.error("Error fetching trivia:", error);
    }
    setLoading(false);
  };

  // Handle answer selection
  const handleAnswerClick = (option) => {
    if (selectedAnswer || attemptsLeft === 0) return;

    const isCorrect = option === quizData[currentQuestion].answer;
    
    if (isCorrect) {
      setScore(prev => prev + (attemptsLeft === 2 ? 10 : 5));
      setSelectedAnswer(option);
      setTimeout(nextQuestion, 1000);
    } else {
      setAttemptsLeft(prev => prev - 1);
      setSelectedAnswer(option);
      
      if (attemptsLeft === 2) {
        setTimeout(() => setSelectedAnswer(null), 1000);
      } else {
        setTimeout(nextQuestion, 1000);
      }
    }
  };

  // Move to next question or finish quiz
  const nextQuestion = () => {
    if (currentQuestion + 1 < quizData.length) {
      setCurrentQuestion(prev => prev + 1);
      setAttemptsLeft(2);
      setSelectedAnswer(null);
      setTimer(60);
    } else {
      setQuizFinished(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
      updateLeaderboard();
    }
  };

  // Timer logic
  useEffect(() => {
    if (quizFinished) return;
    if (timer === 0) {
      nextQuestion();
      return;
    }

    const interval = setTimeout(() => setTimer(prev => prev - 1), 1000);
    return () => clearTimeout(interval);
  }, [timer, quizFinished]);

  // Update leaderboard
  const updateLeaderboard = () => {
    setLeaderboard(prev => [
      ...prev,
      { topic, difficulty, score, timestamp: new Date().toISOString() }
    ]);
  };

  const saveLeaderboard = async () => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    
    if (!token || !username) {
      console.warn("User not authenticated or missing username.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/leaderboard/saveLeaderboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ username, topic, difficulty, score }),
      });
  
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
  
      console.log("Leaderboard entry saved successfully.");
      fetchLeaderboard();
    } catch (error) {
      console.error("Error saving leaderboard:", error);
    }
  };
  
  const fetchLeaderboard = async () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      console.warn("No authentication token found.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/leaderboard/getLeaderboard", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
      if (Array.isArray(data.leaderboard)) {
        setLeaderboard(data.leaderboard);
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      setLeaderboard([]);
    }
  };
  
  useEffect(() => {
    fetchLeaderboard();
  }, []);

  // Progress calculation
  const progress = quizData.length > 0 
    ? ((currentQuestion + 1) / quizData.length) * 100
    : 0;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-blue-50 to-purple-50 p-6 relative">
      {showConfetti && <Confetti recycle={false} numberOfPieces={400} />}

      <motion.h1 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
      >
        💡 CP Trivia & Quizzes 💡
      </motion.h1>

      {/* Controls Section */}
      <motion.div 
        className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 mb-8"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="flex flex-wrap gap-4 justify-center">
          <div className="relative flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
            <select
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            >
              {topics.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="relative flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
            <select
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              {difficulties.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Questions</label>
            <input
              type="number"
              min="1"
              max="10"
              value={numQuestions}
              onChange={(e) => setNumQuestions(e.target.value)}
              className="w-24 px-4 py-2 rounded-lg border border-gray-300 bg-white text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <motion.button 
          onClick={fetchTriviaData}
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating Quiz...
            </div>
          ) : (
            "🚀 Start Quiz!"
          )}
        </motion.button>
      </motion.div>

      {/* Quiz Container */}
      <AnimatePresence mode='wait'>
        {!quizFinished && quizData.length > 0 && (
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 mb-8"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 px-4 py-2 rounded-full">
                  <span className="font-bold text-blue-600">Score: {score}</span>
                </div>
                <div className="bg-orange-100 px-4 py-2 rounded-full">
                  <span className="font-bold text-orange-600">Attempts: {attemptsLeft}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-red-500">
                <FaClock className="text-lg" />
                <span className="font-bold">{timer}s</span>
              </div>
            </div>

            <div className="h-2 bg-gray-200 rounded-full mb-6 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Question {currentQuestion + 1} of {quizData.length}
            </h2>
            <p className="text-lg text-gray-700 mb-8">{quizData[currentQuestion].question}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quizData[currentQuestion].options.map((option, idx) => {
                const isCorrect = option === quizData[currentQuestion].answer;
                const isSelected = selectedAnswer === option;
                
                return (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`p-4 rounded-xl cursor-pointer transition-all ${
                      selectedAnswer
                        ? isCorrect
                          ? 'bg-green-100 border-2 border-green-500'
                          : isSelected
                            ? 'bg-red-100 border-2 border-red-500'
                            : 'bg-gray-100 opacity-50'
                        : 'bg-gray-100 hover:bg-gray-50'
                    }`}
                    onClick={() => handleAnswerClick(option)}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-lg font-semibold ${
                        selectedAnswer
                          ? isCorrect ? 'text-green-600' : isSelected ? 'text-red-600' : 'text-gray-400'
                          : 'text-gray-700'
                      }`}>
                        {String.fromCharCode(65 + idx)}. {option}
                      </span>
                      {selectedAnswer && isSelected && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-auto"
                        >
                          {isCorrect ? (
                            <FaRegSmileBeam className="text-2xl text-green-500" />
                          ) : (
                            <FaRegSadTear className="text-2xl text-red-500" />
                          )}
                        </motion.span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Leaderboard Section */}
      <motion.div 
        className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <FaTrophy className="text-2xl text-yellow-500" />
          <h3 className="text-2xl font-bold text-gray-800">Leaderboard</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-gray-600 font-semibold">Rank</th>
                <th className="px-4 py-3 text-left text-gray-600 font-semibold">Topic</th>
                <th className="px-4 py-3 text-left text-gray-600 font-semibold">Difficulty</th>
                <th className="px-4 py-3 text-left text-gray-600 font-semibold">Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.sort((a, b) => b.score - a.score).map((entry, idx) => (
                <motion.tr
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {idx === 0 && <FaStar className="text-yellow-400" />}
                      {idx + 1}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-700">{entry.topic}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      entry.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                      entry.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {entry.difficulty}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-blue-600">{entry.score}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default CPTrivia;