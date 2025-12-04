function DebugConsole({ debugLogs, onClearLogs }) {
  return (
    <div className="debug-console">
      <div className="debug-header">
        <h3 className="debug-title">🛠 디버그 콘솔 (API 호출 로그)</h3>
        <button className="clear-btn" onClick={onClearLogs}>
          Clear
        </button>
      </div>
      <div className="debug-logs">
        {debugLogs.slice(-5).map((log, i) => (
          <div key={i} className={`log-item log-${log.type}`}>
            [{log.time}] {log.message}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DebugConsole;
