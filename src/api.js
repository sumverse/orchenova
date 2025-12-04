// ==================== Freesound API ====================
const FREESOUND_API_KEY = import.meta.env.VITE_FREESOUND_API_KEY;

// 악기 사운드 가져오기 (로컬 파일 또는 API)
export const getInstrumentSound = async (instrument) => {
  // 로컬 파일이 있으면 로컬 파일 경로 반환
  if (instrument.soundFile) {
    console.log(
      `🎵 로컬 파일 사용: ${instrument.name} (${instrument.soundFile})`
    );
    return instrument.soundFile;
  }

  // soundId가 있으면 Freesound API 호출
  if (instrument.soundId) {
    return await getFreesoundById(instrument.soundId);
  }

  throw new Error("사운드 파일 또는 Sound ID가 없습니다");
};

export const getFreesoundById = async (soundId) => {
  try {
    const url = `https://freesound.org/apiv2/sounds/${soundId}/`;

    console.log(`🔍 API 호출: Sound ID ${soundId}`);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Token ${FREESOUND_API_KEY}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();

    const previewUrl =
      data.previews["preview-hq-mp3"] || data.previews["preview-lq-mp3"];

    if (!previewUrl) {
      throw new Error("Preview URL을 찾을 수 없습니다");
    }

    console.log(`✅ 사운드 URL 획득: ${previewUrl}`);
    return previewUrl;
  } catch (error) {
    console.error(`❌ Freesound API 오류 (ID: ${soundId}):`, error);
    throw error;
  }
};
