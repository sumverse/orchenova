import { useState, useEffect, useRef } from "react";
import "./App.css";

// 컴포넌트 임포트
import HomePage from "./components/HomePage";
import StageView from "./components/StageView";
import InstrumentList from "./components/InstrumentList";
import QuizView from "./components/QuizView";
import Modal from "./components/Modal";

// 데이터 & API 임포트
import { INSTRUMENTS_DATA } from "./data";
import { getInstrumentSound } from "./api";

// ==================== 메인 앱 ====================
function App() {
  const [currentPage, setCurrentPage] = useState("index");
  const [instrumentSounds, setInstrumentSounds] = useState({});
  const [loadingStatus, setLoadingStatus] = useState({});
  const [currentAudio, setCurrentAudio] = useState(null);
  const [selectedInstrument, setSelectedInstrument] = useState(null);
  const [debugLogs, setDebugLogs] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);

  const audioRef = useRef(null);

  // 퀴즈 상태
  const [quizMode, setQuizMode] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [quizCount, setQuizCount] = useState(0);

  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      // 화면 높이(100vh)를 거의 다 넘어가면 헤더 색상 변경
      if (window.scrollY > window.innerHeight * 0.8) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const addLog = (message, type = "info") => {
    const time = new Date().toLocaleTimeString();
    setDebugLogs((prev) => [...prev, { time, message, type }]);
    console.log(`[${type.toUpperCase()}]`, message);
  };

  // 초기 로드
  useEffect(() => {
    addLog("🎼 오케스트라 시뮬레이터 시작!", "success");
    addLog(
      "💡 악기를 클릭하면 Freesound API에서 고정된 사운드를 가져옵니다",
      "info"
    );
  }, []);

  // 개별 악기 로딩 함수
  const loadInstrument = async (instrumentId) => {
    if (
      instrumentSounds[instrumentId] ||
      loadingStatus[instrumentId] === "loading"
    ) {
      return instrumentSounds[instrumentId];
    }

    const instrument = INSTRUMENTS_DATA[instrumentId];

    try {
      setLoadingStatus((prev) => ({ ...prev, [instrumentId]: "loading" }));

      const logMessage = instrument.soundFile
        ? `🎵 ${instrument.name} 로컬 파일 로드 중...`
        : `🔍 ${instrument.name} API 호출 중... (ID: ${instrument.soundId})`;
      addLog(logMessage, "info");

      const soundUrl = await getInstrumentSound(instrument);

      setInstrumentSounds((prev) => ({ ...prev, [instrumentId]: soundUrl }));
      setLoadingStatus((prev) => ({ ...prev, [instrumentId]: "ready" }));
      addLog(`✅ ${instrument.name} 로드 완료!`, "success");

      return soundUrl;
    } catch (error) {
      setLoadingStatus((prev) => ({ ...prev, [instrumentId]: "error" }));
      addLog(`❌ ${instrument.name} 로드 실패: ${error.message}`, "error");
      throw error;
    }
  };

  // 오디오 재생 함수
  const playSound = async (instrumentId) => {
    try {
      if (audioRef.current) {
        try {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          audioRef.current = null;
        } catch (err) {
          console.warn("이전 오디오 정리 중 오류:", err);
        }
      }

      const instrument = INSTRUMENTS_DATA[instrumentId];
      addLog(`🎵 ${instrument.name} 재생 시도...`, "info");

      let soundUrl = instrumentSounds[instrumentId];
      if (!soundUrl) {
        soundUrl = await loadInstrument(instrumentId);
      }

      if (!soundUrl) {
        throw new Error("사운드 URL을 찾을 수 없습니다");
      }

      const audio = new Audio(soundUrl);
      audioRef.current = audio;

      audio.addEventListener("loadeddata", () => {
        console.log("오디오 로드 완료");
      });

      audio.addEventListener("error", (e) => {
        console.error("오디오 로드 에러:", e);
        addLog(`❌ 오디오 재생 실패`, "error");
      });

      await audio.play();
      addLog(`▶️ ${instrument.name} 재생 중!`, "success");
      setCurrentAudio(instrumentId);

      audio.onended = () => {
        addLog(`⏹️ ${instrument.name} 재생 완료`, "info");
        setCurrentAudio(null);
        audioRef.current = null;
      };
    } catch (error) {
      console.error("재생 에러:", error);
      addLog(`❌ 재생 실패: ${error.message}`, "error");
      audioRef.current = null;
      setCurrentAudio(null);
    }
  };

  // 퀴즈 시작
  const startQuiz = async () => {
    addLog("🎯 퀴즈 시작! 모든 악기 API 로딩 중...", "success");
    setQuizMode(true);
    setScore(0);
    setQuizCount(0);

    const instrumentIds = Object.keys(INSTRUMENTS_DATA);
    for (const id of instrumentIds) {
      if (!instrumentSounds[id]) {
        try {
          await loadInstrument(id);
          await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (error) {
          console.error(`악기 ${id} 로드 실패:`, error);
        }
      }
    }

    addLog("✅ 모든 악기 로드 완료!", "success");
    generateQuestion();
  };

  // 퀴즈 문제 생성
  const generateQuestion = () => {
    const instrumentIds = Object.keys(INSTRUMENTS_DATA);
    const correctId =
      instrumentIds[Math.floor(Math.random() * instrumentIds.length)];

    const wrongChoices = instrumentIds
      .filter((id) => id !== correctId)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const choices = [correctId, ...wrongChoices].sort(
      () => Math.random() - 0.5
    );

    setCurrentQuestion({
      correctId,
      choices,
      answered: false,
    });

    playSound(correctId);
  };

  // 퀴즈 정답 확인
  const answerQuiz = (selectedId) => {
    if (currentQuestion.answered) return;

    const isCorrect = selectedId === currentQuestion.correctId;
    setCurrentQuestion({ ...currentQuestion, answered: true });

    if (isCorrect) {
      setScore((prev) => prev + 1);
      addLog("✅ 정답!", "success");
    } else {
      addLog(
        `❌ 오답! 정답: ${INSTRUMENTS_DATA[currentQuestion.correctId].name}`,
        "error"
      );
    }

    setTimeout(() => {
      const nextCount = quizCount + 1;
      if (nextCount < 5) {
        setQuizCount(nextCount);
        generateQuestion();
      } else {
        setQuizMode(false);
        addLog(
          `🎊 퀴즈 완료! 최종 점수: ${score + (isCorrect ? 1 : 0)}/5`,
          "success"
        );
      }
    }, 2000);
  };

  // 컴포넌트 언마운트 시 오디오 정리
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        try {
          audioRef.current.pause();
          audioRef.current = null;
        } catch (err) {
          console.warn("정리 중 오류:", err);
        }
      }
    };
  }, []);

  return (
    <div className="app">
      <header className={`header ${isScrolled ? "scrolled" : ""}`}>
        <div className="header-container">
          <div className="logo" onClick={() => setCurrentPage("index")}>
            <span className="logo-text">OrcheNova</span>
          </div>

          <nav className="nav">
            <button
              className={`nav-item ${currentPage === "index" ? "active" : ""}`}
              onClick={() => setCurrentPage("index")}
            >
              홈
            </button>
            <button
              className={`nav-item ${currentPage === "home" ? "active" : ""}`}
              onClick={() => setCurrentPage("home")}
            >
              무대 배치
            </button>
            <button
              className={`nav-item ${currentPage === "quiz" ? "active" : ""}`}
              onClick={() => setCurrentPage("quiz")}
            >
              Quiz
            </button>
          </nav>
        </div>
      </header>

      {currentPage === "index" && <HomePage />}

      <div className="container">
        {currentPage === "home" && (
          <StageView
            instruments={INSTRUMENTS_DATA}
            loadingStatus={loadingStatus}
            onInstrumentClick={playSound}
            onInstrumentSelect={setSelectedInstrument}
          />
        )}

        {currentPage === "quiz" && (
          <QuizView
            quizMode={quizMode}
            currentQuestion={currentQuestion}
            score={score}
            quizCount={quizCount}
            instruments={INSTRUMENTS_DATA}
            onStart={startQuiz}
            onAnswer={answerQuiz}
            onReplay={() =>
              currentQuestion && playSound(currentQuestion.correctId)
            }
          />
        )}

        {selectedInstrument && (
          <Modal
            instrument={INSTRUMENTS_DATA[selectedInstrument]}
            onClose={() => setSelectedInstrument(null)}
            onPlay={() => playSound(selectedInstrument)}
          />
        )}
      </div>
    </div>
  );
}

export default App;
