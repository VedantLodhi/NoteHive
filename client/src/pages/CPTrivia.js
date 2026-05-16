// export default CPTrivia;
import React, { useState, useEffect, useMemo } from "react";
import { FaClock, FaTrophy, FaStar, FaRegSmileBeam, FaRegSadTear } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from 'react-confetti';
import { apiUrl } from "../config/apiBase";

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
  const [finalScore, setFinalScore] = useState(0);
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
      const response = await fetch(apiUrl("/api/generateTrivia"), {
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
  const points = attemptsLeft === 2 ? 10 : 5;

  setScore(prev => prev + points);

  setSelectedAnswer(option);

  setTimeout(() => {
    nextQuestion(score + points);
  }, 1000);
} else {
      setAttemptsLeft(prev => prev - 1);
      setSelectedAnswer(option);
      
      if (attemptsLeft === 2) {
        setTimeout(() => setSelectedAnswer(null), 1000);
      } else {
        setTimeout(() => nextQuestion(score), 1000);
      }
    }
  };

  // Move to next question or finish quiz
  const nextQuestion = (finalScore = score) => {
  if (currentQuestion + 1 < quizData.length) {
    setCurrentQuestion(prev => prev + 1);
    setAttemptsLeft(2);
    setSelectedAnswer(null);
    setTimer(60);
  } else {
    setQuizFinished(true);
    setShowConfetti(true);

    setFinalScore(finalScore);

    setLeaderboard(prev => [
      ...prev,
      {
        topic,
        difficulty,
        score: finalScore,
        timestamp: new Date().toISOString()
      }
    ]);

    setTimeout(() => setShowConfetti(false), 5000);
  }
};
  // Timer logic
  // nextQuestion is stable enough for timer ticks; full deps would reset interval every render.
  useEffect(() => {
    if (quizFinished) return;
    if (timer === 0) {
      nextQuestion();
      return;
    }

    const interval = setTimeout(() => setTimer((prev) => prev - 1), 1000);
    return () => clearTimeout(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer, quizFinished]);

  // Update leaderboard

  const saveLeaderboard = async () => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    
    if (!token || !username) {
      console.warn("User not authenticated or missing username.");
      return;
    }
  
    try {
      const response = await fetch(apiUrl("/api/leaderboard/saveLeaderboard"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
      username,
      topic,
    difficulty,
  score: finalScore
}),
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
      const response = await fetch(apiUrl("/api/leaderboard/getLeaderboard"), {
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

  const sortedLeaderboard = useMemo(() => {
    return [...leaderboard].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  }, [leaderboard]);

  // Progress calculation
  const progress = quizData.length > 0 
    ? ((currentQuestion + 1) / quizData.length) * 100
    : 0;

  const selectClass =
    "nh-input w-full cursor-pointer appearance-none rounded-nh-sm py-2.5 pl-3 pr-8 text-sm text-nh-text";

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 py-10 sm:py-14">
      {showConfetti && <Confetti recycle={false} numberOfPieces={220} className="!fixed inset-0 pointer-events-none" />}

      <header className="mb-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-nh-muted">Practice</p>
        <motion.h1
          initial={{ y: -12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mt-3 font-display text-4xl text-nh-text sm:text-5xl"
        >
          CP Trivia
        </motion.h1>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-nh-muted sm:text-base">
          Choose a topic, set the pace, and answer with two attempts per question. Progress stays visible at a glance.
        </p>
      </header>

      <motion.section
        className="nh-card mb-8 rounded-nh-lg p-6 sm:p-8"
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-nh-muted">Topic</label>
            <select className={selectClass} value={topic} onChange={(e) => setTopic(e.target.value)}>
              {topics.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-nh-muted">Difficulty</label>
            <select className={selectClass} value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              {difficulties.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-nh-muted">Questions</label>
            <input
              type="number"
              min={1}
              max={10}
              value={numQuestions}
              onChange={(e) => setNumQuestions(e.target.value)}
              className="nh-input w-full text-center text-sm"
            />
          </div>
        </div>

        <motion.button
          type="button"
          onClick={fetchTriviaData}
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.01 }}
          whileTap={{ scale: loading ? 1 : 0.99 }}
          className="nh-btn nh-btn-primary mt-8 w-full justify-center py-3.5 text-base disabled:opacity-60"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              Generating quiz…
            </span>
          ) : (
            "Generate quiz"
          )}
        </motion.button>
      </motion.section>

      <AnimatePresence mode="wait">
        {quizFinished && (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="nh-card mb-8 rounded-nh-lg border border-nh-border-strong px-6 py-8 text-center"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-nh-muted">Session complete</p>
            <p className="mt-3 font-display text-3xl text-nh-text">Final score: {finalScore}</p>
            <p className="mt-2 text-sm text-nh-muted">
              {topic} · {difficulty}
            </p>
            {typeof window !== "undefined" && localStorage.getItem("token") && (
              <button
                type="button"
                onClick={() => saveLeaderboard()}
                className="nh-btn nh-btn-outline mx-auto mt-5 block px-6 text-sm"
              >
                Save score to server
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setQuizFinished(false);
                setQuizData([]);
              }}
              className="nh-btn nh-btn-outline mt-6 px-8"
            >
              New setup
            </button>
          </motion.div>
        )}

        {!quizFinished && quizData.length > 0 && (
          <motion.article
            key={currentQuestion}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="nh-glass-panel mb-10 rounded-nh-lg px-5 py-8 sm:px-8 sm:py-10"
          >
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2">
                <span className="nh-tag bg-nh-accent-soft text-nh-text">Score {score}</span>
                <span className="nh-tag bg-nh-surface-2 text-nh-muted">Attempts {attemptsLeft}</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-nh-danger">
                <FaClock className="text-base opacity-80" aria-hidden />
                <span>{timer}s</span>
              </div>
            </div>

            <div className="mb-8">
              <div className="mb-2 flex justify-between text-xs font-medium text-nh-muted">
                <span>
                  Question {currentQuestion + 1} / {quizData.length}
                </span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-nh-border">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-nh-primary/90 to-nh-accent"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                />
              </div>
            </div>

            <h2 className="font-display text-2xl leading-snug text-nh-text sm:text-3xl">
              {quizData[currentQuestion].question}
            </h2>

            <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2">
              {quizData[currentQuestion].options.map((option, idx) => {
                const isCorrect = option === quizData[currentQuestion].answer;
                const isSelected = selectedAnswer === option;
                const base =
                  "rounded-nh-lg border px-4 py-4 text-left text-sm font-medium leading-snug transition duration-200 sm:text-base";
                let state =
                  "cursor-pointer border-nh-border bg-nh-surface-2/50 text-nh-text hover:border-nh-accent hover:bg-nh-accent-soft/40";
                if (selectedAnswer) {
                  if (isCorrect) state = "border-nh-success/50 bg-nh-success/10 text-nh-text";
                  else if (isSelected) state = "border-nh-danger/40 bg-nh-danger/10 text-nh-text";
                  else state = "cursor-default border-transparent bg-nh-surface-2/30 text-nh-muted opacity-60";
                }

                return (
                  <motion.button
                    type="button"
                    key={`${currentQuestion}-${idx}`}
                    whileHover={!selectedAnswer ? { scale: 1.01 } : undefined}
                    whileTap={!selectedAnswer ? { scale: 0.99 } : undefined}
                    className={`${base} ${state}`}
                    onClick={() => handleAnswerClick(option)}
                    disabled={!!selectedAnswer}
                  >
                    <span className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-nh-border text-xs font-bold text-nh-muted">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="flex-1 break-words">{option}</span>
                      {selectedAnswer && isSelected && (
                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="shrink-0">
                          {isCorrect ? (
                            <FaRegSmileBeam className="text-xl text-nh-success" aria-hidden />
                          ) : (
                            <FaRegSadTear className="text-xl text-nh-danger" aria-hidden />
                          )}
                        </motion.span>
                      )}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.article>
        )}
      </AnimatePresence>

      <motion.section
        className="nh-card overflow-hidden rounded-nh-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex items-center gap-3 border-b border-nh-border bg-nh-surface-2/40 px-6 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-nh-border-strong bg-nh-accent-soft">
            <FaTrophy className="text-lg text-nh-primary" aria-hidden />
          </div>
          <div>
            <h3 className="font-display text-2xl text-nh-text">Leaderboard</h3>
            <p className="text-xs text-nh-muted">Ranked by highest score</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[320px] text-left text-sm">
            <thead>
              <tr className="border-b border-nh-border text-xs font-semibold uppercase tracking-wider text-nh-muted">
                <th className="px-5 py-3">Rank</th>
                <th className="px-5 py-3">Topic</th>
                <th className="px-5 py-3">Difficulty</th>
                <th className="px-5 py-3">Score</th>
              </tr>
            </thead>
            <tbody>
              {sortedLeaderboard.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-nh-muted">
                    Sign in and complete a quiz to see server leaderboard entries here. Local session scores appear after
                    you finish a run.
                  </td>
                </tr>
              ) : (
                sortedLeaderboard.map((entry, idx) => (
                  <motion.tr
                    key={`${entry.username || "anon"}-${entry.topic}-${entry.timestamp || idx}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={idx % 2 === 0 ? "bg-nh-surface/40" : "bg-nh-surface-2/25"}
                  >
                    <td className="px-5 py-3.5 font-medium text-nh-text">
                      <div className="flex items-center gap-2">
                        {idx === 0 && <FaStar className="text-nh-primary" aria-hidden />}
                        {idx + 1}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-nh-text">{entry.topic}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-block rounded-full border border-nh-border bg-nh-surface-2 px-2.5 py-0.5 text-xs font-semibold text-nh-muted">
                        {entry.difficulty}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-nh-primary">{entry.score}</td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.section>
    </div>
  );
};

export default CPTrivia;