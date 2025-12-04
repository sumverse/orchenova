function QuizView({
  quizMode,
  currentQuestion,
  score,
  quizCount,
  instruments,
  onStart,
  onAnswer,
  onReplay,
}) {
  if (!quizMode) {
    return (
      <div className="quiz-start-container">
        <h2 className="page-title">🎯 음색 감별 퀴즈</h2>
        <p className="quiz-description">
          악기 소리를 듣고 어떤 악기인지 맞춰보세요!
          <br />총 5문제가 출제됩니다.
        </p>
        <button className="btn btn-play btn-large" onClick={onStart}>
          🎮 퀴즈 시작하기
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2 className="page-title">🎯 음색 감별 퀴즈</h2>
        <div className="quiz-score">
          문제 {quizCount + 1}/5 | 점수: {score}
        </div>
      </div>

      <div className="quiz-question-section">
        <h3 className="quiz-question-text">이 소리는 어떤 악기일까요?</h3>
        <button className="btn btn-play" onClick={onReplay}>
          🔊 다시 듣기
        </button>
      </div>

      <div className="instruments-grid">
        {currentQuestion?.choices.map((id) => {
          const isCorrect = id === currentQuestion.correctId;
          const isAnswered = currentQuestion.answered;

          return (
            <button
              key={id}
              className={`instrument-btn quiz-choice ${
                isAnswered ? (isCorrect ? "correct" : "incorrect") : ""
              }`}
              style={{
                backgroundColor: isAnswered
                  ? isCorrect
                    ? "#22c55e"
                    : "#dc2626"
                  : instruments[id].color,
                opacity: isAnswered && !isCorrect ? 0.5 : 1,
              }}
              onClick={() => onAnswer(id)}
              disabled={isAnswered}
            >
              <div className="instrument-name">{instruments[id].emoji}</div>
              <div className="instrument-name">{instruments[id].name}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default QuizView;
