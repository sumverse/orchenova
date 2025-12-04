function HomePage() {
  return (
    <div className="home-page">
      {/* 전체 화면 배경 비디오 */}
      <div className="video-background">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="background-video"
          onError={(e) => {
            console.error("비디오 로드 실패:", e);
            console.log("비디오 경로 확인:", e.target.src);
          }}
        >
          <source src="/music/orchestra.mp4" type="video/mp4" />
          비디오를 로드할 수 없습니다.
        </video>
        <div className="video-overlay"></div>
      </div>

      {/* 흰색 컨텐츠 섹션 */}
      <div className="content-sections">
        <section className="about-section">
          <div className="section-container">
            <div className="about-content">
              <h2 className="about-title">Orchestra</h2>
              <p className="about-text">
                오케스트라는 다양한 악기가 모여 하나의 음악을 만드는 연주
                단체입니다. 현악기, 목관악기, 금관악기, 타악기가 조화를 이루어
                풍부한 선율과 리듬을 선사합니다. 클래식은 물론 영화음악, 팝 등
                다양한 장르를 연주합니다.
              </p>
            </div>
          </div>
        </section>

        <section className="features-section-white">
          <div className="section-container">
            <h2 className="section-title">🎭 주요 기능</h2>
            <div className="features-grid-white">
              <div className="feature-card-white">
                <div className="feature-icon-white">🎭</div>
                <h3 className="feature-title-white">무대 배치</h3>
                <p className="feature-description-white">
                  오케스트라의 악기 배치를 시각적으로 확인하고 각 악기의 소리를
                  들어보세요.
                </p>
              </div>

              <div className="feature-card-white">
                <div className="feature-icon-white">📋</div>
                <h3 className="feature-title-white">악기 목록</h3>
                <p className="feature-description-white">
                  현악기, 목관악기, 금관악기, 타악기별로 분류된 악기들의 특징을
                  알아보세요.
                </p>
              </div>

              <div className="feature-card-white">
                <div className="feature-icon-white">🎯</div>
                <h3 className="feature-title-white">음색 퀴즈</h3>
                <p className="feature-description-white">
                  악기 소리를 듣고 맞추는 퀴즈로 음색 감별 능력을 키워보세요.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="info-section">
          <div className="section-container">
            <h2 className="section-title">🎵 오케스트라의 구성</h2>
            <div className="info-grid">
              <div className="info-card">
                <h3>현악기 (Strings)</h3>
                <p>
                  바이올린, 비올라, 첼로, 더블베이스 등으로 구성되며
                  오케스트라의 중심을 이룹니다.
                </p>
              </div>
              <div className="info-card">
                <h3>목관악기 (Woodwinds)</h3>
                <p>
                  플루트, 오보에, 클라리넷, 바순 등이 포함되며 섬세한 음색을
                  담당합니다.
                </p>
              </div>
              <div className="info-card">
                <h3>금관악기 (Brass)</h3>
                <p>
                  트럼펫, 호른, 트롬본, 튜바 등으로 화려하고 힘찬 사운드를
                  만듭니다.
                </p>
              </div>
              <div className="info-card">
                <h3>타악기 (Percussion)</h3>
                <p>팀파니, 심벌즈, 마림바 등으로 리듬과 강조를 담당합니다.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default HomePage;
