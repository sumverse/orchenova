function InstrumentList({ instruments, loadingStatus, onPlay }) {
  const groupedInstruments = Object.values(instruments).reduce((acc, inst) => {
    if (!acc[inst.group]) acc[inst.group] = [];
    acc[inst.group].push(inst);
    return acc;
  }, {});

  return (
    <div className="list-container">
      <h2 className="page-title">📋 악기 목록</h2>
      {Object.entries(groupedInstruments).map(([group, insts]) => (
        <div key={group} className="instrument-group">
          <h3 className="section-title">{insts[0].groupName}</h3>
          <div className="instruments-grid">
            {insts.map((inst) => (
              <button
                key={inst.id}
                className="instrument-btn"
                style={{
                  backgroundColor: inst.color,
                  opacity:
                    loadingStatus[inst.id] === "ready"
                      ? 1
                      : loadingStatus[inst.id] === "loading"
                      ? 0.7
                      : 1,
                }}
                onClick={() => onPlay(inst.id)}
              >
                <div className="instrument-name">{inst.emoji}</div>
                <div className="instrument-name">{inst.name}</div>
                <div className="instrument-status">
                  {loadingStatus[inst.id] === "loading"
                    ? "⏳ API 호출 중..."
                    : loadingStatus[inst.id] === "ready"
                    ? "✅ 클릭하여 재생"
                    : loadingStatus[inst.id] === "error"
                    ? "❌ API 실패"
                    : "🔍 클릭하여 API 호출"}
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default InstrumentList;
