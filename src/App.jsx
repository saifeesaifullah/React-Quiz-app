import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const QUESTION_BANKS = {
  Math: [
    { id: 1, q: "2 + 2 = ?", choices: ["3", "4", "5", "6"], answer: 1 },
    { id: 2, q: "5 × 6 = ?", choices: ["11", "30", "35", "56"], answer: 1 },
    { id: 3, q: "√81 = ?", choices: ["7", "8", "9", "10"], answer: 2 },
    {
      id: 4,
      q: "10% of 200 = ?",
      choices: ["10", "20", "30", "40"],
      answer: 1,
    },
    {
      id: 5,
      q: "LCM of 3 and 4 = ?",
      choices: ["7", "12", "6", "9"],
      answer: 1,
    },
  ],
  English: [
    {
      id: 1,
      q: 'Choose the correct plural: "One mouse, two ___"',
      choices: ["mouses", "mice", "mouse", "meese"],
      answer: 1,
    },
    {
      id: 2,
      q: 'Pick the synonym of "happy"',
      choices: ["sad", "angry", "joyful", "thin"],
      answer: 2,
    },
    {
      id: 3,
      q: "Which is a verb?",
      choices: ["quick", "run", "blue", "cat"],
      answer: 1,
    },
    {
      id: 4,
      q: 'Fill: "I ___ to school yesterday."',
      choices: ["go", "gone", "went", "going"],
      answer: 2,
    },
    {
      id: 5,
      q: 'Opposite of "cold"',
      choices: ["hot", "small", "tall", "far"],
      answer: 0,
    },
  ],
  General: [
    {
      id: 1,
      q: "Earth is the ___ planet from the Sun.",
      choices: ["first", "second", "third", "fourth"],
      answer: 2,
    },
    {
      id: 2,
      q: "Water boils at ___ °C (at sea level).",
      choices: ["50", "75", "100", "120"],
      answer: 2,
    },
    {
      id: 3,
      q: "HTML stands for?",
      choices: [
        "Hyperlinks and Text Markup Language",
        "Home Tool Markup Language",
        "HyperText Markup Language",
        "HyperTabular Markup Language",
      ],
      answer: 2,
    },
    {
      id: 4,
      q: "Which animal is known as the King of the Jungle?",
      choices: ["Tiger", "Elephant", "Lion", "Giraffe"],
      answer: 2,
    },
    {
      id: 5,
      q: "The largest ocean is the ___ Ocean.",
      choices: ["Atlantic", "Indian", "Pacific", "Arctic"],
      answer: 2,
    },
  ],
  Science: [
    {
      id: 1,
      q: "H2O is commonly known as?",
      choices: ["Oxygen", "Water", "Hydrogen", "Helium"],
      answer: 1,
    },
    {
      id: 2,
      q: "The process of plants making food is called?",
      choices: ["Respiration", "Photosynthesis", "Transpiration", "Osmosis"],
      answer: 1,
    },
  ],
  History: [
    {
      id: 1,
      q: "Who was the first President of the USA?",
      choices: [
        "Abraham Lincoln",
        "George Washington",
        "Thomas Jefferson",
        "John Adams",
      ],
      answer: 1,
    },
    {
      id: 2,
      q: "World War II ended in which year?",
      choices: ["1945", "1939", "1918", "1963"],
      answer: 0,
    },
  ],
};

const STORAGE_KEYS = { SCORES: "quiz_app_scores_v2" };
function saveScores(scores) {
  localStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(scores));
}
function loadScores() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SCORES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Header
function Header({ title, subtitle }) {
  return (
    <div className="mb-6 text-center">
      <h1 className="text-3xl font-extrabold text-white">{title}</h1>
      {subtitle && <p className="text-sm text-white/80 mt-1">{subtitle}</p>}
    </div>
  );
}

// Selector
function Selector({ banks, onStart }) {
  const [selected, setSelected] = useState(Object.keys(banks)[0]);
  const [numQ, setNumQ] = useState(5);
  const [timePerQuiz, setTimePerQuiz] = useState(60);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-md rounded-2xl p-6 shadow-lg"
    >
      <h2 className="text-xl font-semibold text-white mb-4">آزمون جدید</h2>
      <label className="block text-sm text-white/80 mb-1">دسته‌بندی</label>
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="w-full mb-4 p-2 rounded-lg bg-white/10 text-white"
      >
        {Object.keys(banks).map((k) => (
          <option key={k} value={k}>
            {k}
          </option>
        ))}
      </select>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-sm text-white/80 mb-1">تعداد سوال</label>
          <input
            type="number"
            min={1}
            max={banks[selected].length}
            value={numQ}
            onChange={(e) => setNumQ(Number(e.target.value))}
            className="w-full p-2 rounded-lg bg-white/10 text-white"
          />
        </div>
        <div>
          <label className="block text-sm text-white/80 mb-1">
            زمان هر سوال (ثانیه)
          </label>
          <input
            type="number"
            min={10}
            max={300}
            value={timePerQuiz}
            onChange={(e) => setTimePerQuiz(Number(e.target.value))}
            className="w-full p-2 rounded-lg bg-white/10 text-white"
          />
        </div>
      </div>
      <button
        onClick={() => onStart({ category: selected, numQ, timePerQuiz })}
        className="w-full py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold shadow"
      >
        شروع آزمون
      </button>
    </motion.div>
  );
}

// Timer
function Timer({ secondsLeft }) {
  const pct = Math.max(0, Math.min(1, secondsLeft / 300));
  return (
    <div className="flex items-center gap-3">
      <div className="w-36 h-3 bg-white/10 rounded-full overflow-hidden">
        <div
          style={{ width: `${pct * 100}%` }}
          className="h-3 bg-gradient-to-r from-green-400 to-rose-500"
        />
      </div>
      <div className="text-sm text-white/90">{secondsLeft}s</div>
    </div>
  );
}

// QuestionCard
function QuestionCard({ qObj, index, total, onAnswer, selectedChoice }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="bg-white/5 p-4 rounded-2xl"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="text-white font-medium">
          سوال {index + 1} از {total}
        </div>
      </div>
      <div className="text-white text-lg mb-4">{qObj.q}</div>
      <div className="grid gap-3">
        {qObj.choices.map((ch, i) => {
          const isSelected = selectedChoice === i;
          return (
            <button
              key={i}
              onClick={() => onAnswer(i)}
              disabled={selectedChoice !== null} // ✅ اگر جواب داده شد غیرفعال کن
              className={`text-left p-3 rounded-lg border ${
                isSelected
                  ? "border-rose-400 bg-rose-500/20"
                  : "border-white/10"
              } text-white`}
            >
              {ch}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

// Results
function Results({
  score,
  total,
  timeUsed,
  onRestart,
  saveEntry,
  history,
  onClearHistory,
}) {
  const data = {
    labels: history.map((h) => h.category),
    datasets: [
      {
        label: "نمره",
        data: history.map((h) => h.score),
        backgroundColor: "rgba(255,99,132,0.5)",
      },
    ],
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 p-6 rounded-2xl"
    >
      <h2 className="text-2xl font-bold text-white mb-2">نتیجه</h2>
      <div className="text-white/90 mb-4">
        نمره: <span className="font-bold text-rose-400">{score}</span> / {total}
      </div>
      <div className="text-white/80 mb-4">زمان استفاده شده: {timeUsed}s</div>
      <div className="flex gap-2 mb-4">
        <button
          onClick={onRestart}
          className="px-4 py-2 rounded-lg bg-indigo-500 text-white"
        >
          تکرار
        </button>
        <button
          onClick={saveEntry}
          className="px-4 py-2 rounded-lg bg-rose-500 text-white"
        >
          ذخیره نمره
        </button>
        <button
          onClick={onClearHistory}
          className="px-4 py-2 rounded-lg bg-gray-600 text-white"
        >
          🗑 حذف نتایج
        </button>
      </div>
      <h3 className="text-white font-semibold mb-2">تاریخچه نمرات</h3>
      <div className="max-h-48 overflow-auto space-y-2 mb-4">
        {history.length === 0 && (
          <div className="text-white/70 text-sm">هیچ نمره‌ای ذخیره نشده.</div>
        )}
        {history.map((h, i) => (
          <div
            key={i}
            className="flex justify-between text-sm text-white/80 p-2 bg-black/20 rounded-lg"
          >
            <div>
              {h.category} — {h.score}/{h.total} —{" "}
              {new Date(h.at).toLocaleString()}
            </div>
            <div className="text-rose-300">{h.time}s</div>
          </div>
        ))}
      </div>
      <Bar data={data} />
    </motion.div>
  );
}

// Main App
export default function App() {
  const [phase, setPhase] = useState("home");
  const [config, setConfig] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const intervalRef = useRef(null);
  const [historyScores, setHistoryScores] = useState(() => loadScores());
  const [resultSummary, setResultSummary] = useState(null);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  function startQuiz({ category, numQ, timePerQuiz }) {
    const pool = QUESTION_BANKS[category] || [];
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, numQ);
    setConfig({ category, numQ, timePerQuiz });
    setQuestions(shuffled);
    setCurrentIdx(0);
    setAnswers(Array(shuffled.length).fill(null));
    setSecondsLeft(timePerQuiz * shuffled.length);
    setPhase("quiz");
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current);
          finishQuiz();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }

  function answerCurrent(choiceIdx) {
    setAnswers((a) => {
      if (a[currentIdx] !== null) return a; // ✅ جلوگیری از تغییر بعد از انتخاب
      const copy = [...a];
      copy[currentIdx] = choiceIdx;
      return copy;
    });
    setSelected(choiceIdx);
  }

  function nextQuestion() {
    setSelected(null);
    setCurrentIdx((i) => Math.min(questions.length - 1, i + 1));
  }
  function prevQuestion() {
    setSelected(null);
    setCurrentIdx((i) => Math.max(0, i - 1));
  }

  function finishQuiz() {
    clearInterval(intervalRef.current);
    const total = questions.length;
    let score = 0;
    for (let i = 0; i < total; i++) {
      const q = questions[i];
      if (answers[i] !== null && answers[i] === q.answer) score += 1;
    }
    const timeUsed = config
      ? config.timePerQuiz * questions.length - secondsLeft
      : 0;
    setResultSummary({ score, total, time: timeUsed });
    setPhase("result");
  }

  function saveScore() {
    if (!config || !resultSummary) return;
    const entry = {
      at: Date.now(),
      category: config.category,
      score: resultSummary.score,
      total: resultSummary.total,
      time: resultSummary.time,
    };
    const updated = [entry, ...historyScores].slice(0, 50);
    setHistoryScores(updated);
    saveScores(updated);
  }

  function clearHistory() {
    setHistoryScores([]);
    saveScores([]);
  }

  useEffect(() => {
    setSelected(answers[currentIdx] ?? null);
  }, [currentIdx, answers]);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-900 via-indigo-900 to-rose-700">
      <div className="max-w-4xl mx-auto">
        <Header
          title="Quiz App"
          subtitle="آزمون‌های آماده — آفلاین و ذخیره نتایج"
        />
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <AnimatePresence mode="wait">
              {phase === "home" && (
                <motion.div
                  key="home"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  <Selector banks={QUESTION_BANKS} onStart={startQuiz} />
                </motion.div>
              )}
              {phase === "quiz" && (
                <motion.div
                  key="quiz"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-white">
                      {config.category} — سوال {currentIdx + 1}/
                      {questions.length}
                    </div>
                    <Timer secondsLeft={secondsLeft} />
                  </div>
                  <AnimatePresence mode="wait">
                    {questions[currentIdx] && (
                      <QuestionCard
                        key={questions[currentIdx].id}
                        qObj={questions[currentIdx]}
                        index={currentIdx}
                        total={questions.length}
                        selectedChoice={answers[currentIdx]}
                        onAnswer={answerCurrent}
                      />
                    )}
                  </AnimatePresence>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={prevQuestion}
                      className="px-4 py-2 rounded-lg bg-white/10 text-white"
                      disabled={currentIdx === 0}
                    >
                      قبلی
                    </button>
                    <button
                      onClick={nextQuestion}
                      className="px-4 py-2 rounded-lg bg-white/10 text-white"
                      disabled={currentIdx === questions.length - 1}
                    >
                      بعدی
                    </button>
                    <div className="ml-auto flex gap-2">
                      <button
                        onClick={() => finishQuiz()}
                        className="px-4 py-2 rounded-lg bg-rose-500 text-white"
                      >
                        پایان آزمون
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
              {phase === "result" && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  <Results
                    score={resultSummary.score}
                    total={resultSummary.total}
                    timeUsed={resultSummary.time}
                    onRestart={() => setPhase("home")}
                    saveEntry={saveScore}
                    history={historyScores}
                    onClearHistory={clearHistory} // ✅ اضافه شد
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar: Question Map */}
          <aside className="md:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 p-4 rounded-2xl"
            >
              <h4 className="text-white font-semibold mb-3">نقشه سوالات</h4>
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: questions.length || 5 }).map((_, i) => {
                  const state =
                    answers[i] == null
                      ? "empty"
                      : questions[i] && answers[i] === questions[i].answer
                      ? "good"
                      : "bad";
                  return (
                    <div
                      key={i}
                      className={`w-8 h-8 flex items-center justify-center rounded-full text-xs cursor-pointer
                      ${i === currentIdx ? "ring-2 ring-white" : ""}
                      ${
                        state === "empty"
                          ? "bg-white/10 text-white/70"
                          : state === "good"
                          ? "bg-green-500 text-white"
                          : "bg-rose-500 text-white"
                      }`}
                      onClick={() => setCurrentIdx(i)}
                    >
                      {i + 1}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </aside>
        </div>
      </div>
    </div>
  );
}
