function StageView({
  instruments,
  loadingStatus,
  onInstrumentClick,
  onInstrumentSelect,
}) {
  return (
    <div className="stage-container">
      <h2 className="page-title">🎭 오케스트라 무대 배치</h2>
      <div className="stage-wrapper">
        <svg viewBox="0 0 100 100" className="stage-svg">
          <rect
            x="0"
            y="0"
            width="100"
            height="100"
            fill="#1e1b4b"
            opacity="0.3"
          />
          <text
            x="50"
            y="15"
            textAnchor="middle"
            fill="#fbbf24"
            fontSize="4"
            fontWeight="bold"
          >
            ← STAGE →
          </text>

          {Object.entries(instruments).map(([id, inst]) => (
            <g
              key={id}
              transform={`translate(${inst.position.x}, ${inst.position.y})`}
            >
              <circle
                r="4"
                fill={inst.color}
                stroke="white"
                strokeWidth="0.5"
                className={`instrument-circle ${
                  loadingStatus[id] === "ready"
                    ? "ready"
                    : loadingStatus[id] === "loading"
                    ? "loading"
                    : "ready"
                }`}
                onClick={() => {
                  onInstrumentClick(id);
                  onInstrumentSelect(id);
                }}
              />
              <text
                y="7"
                textAnchor="middle"
                fill="white"
                fontSize="2.5"
                fontWeight="bold"
                className="instrument-emoji"
              >
                {inst.emoji}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <p className="hint">
        💡 원을 클릭하면 Freesound API에서 악기 소리를 가져옵니다!
      </p>
    </div>
  );
}

export default StageView;
