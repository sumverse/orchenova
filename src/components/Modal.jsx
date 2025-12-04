function Modal({ instrument, onClose, onPlay }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          ✕
        </button>
        <div className="modal-emoji">{instrument.emoji}</div>
        <h2 className="modal-title">{instrument.name}</h2>
        <div className="modal-badge">{instrument.groupName}</div>
        <p className="modal-description">{instrument.description}</p>
        <button className="btn btn-play modal-play-btn" onClick={onPlay}>
          🔊 소리 듣기 (API 호출)
        </button>
      </div>
    </div>
  );
}

export default Modal;
