/* ==========================================================================
   진행중인 프로젝트(Projects)
   ── 새 프로젝트는 배열 "맨 아래"에 추가하면 목록 맨 앞에 나옵니다.
   ── 각 프로젝트의 updates 배열에도 새 진행상황을 "맨 아래"에 추가하세요.
      상세 페이지에서 최신 기록이 맨 위에 표시됩니다.
   ── id 는 영문/숫자/하이픈만 사용하고 프로젝트마다 겹치지 않게 하세요.
      (상세 페이지 주소가 project.html?id=아이디 로 만들어집니다)

   updates 한 건 템플릿:
   {
     date: "2026-04-12",
     title: "이번 주 한 일 요약",
     body: "여러 줄로 쓸 수 있습니다.\n\n- 목록도 가능\n- **굵게**, [링크](https://...) 도 가능",
     image: "images/projects/파일명.png",
     links: [{ label: "노트북 보기", url: "https://..." }]
   }
   ========================================================================== */

window.PROJECTS = [

  {
    id: "billboard-multimodal",
    title: "Billboard TOP 200 멀티모달 감정분석",
    status: "진행중",                       // 진행중 / 계획 / 완료 / 보류
    progress: 45,                            // 0–100 (없애려면 줄 삭제)
    started: "2025-09",
    role: "석사학위논문 (단독 연구)",
    collaborators: "지도교수 ○○○",
    stack: ["Python", "pandas", "HuggingFace Transformers", "CLIP", "statsmodels"],
    summary: "1963년부터 현재까지 Billboard 200 앨범의 가사·트랙 메타데이터·커버 이미지를 수집하여 텍스트 감정과 시각 감정의 시계열 정렬도를 분석한다.",
    cover: "",                               // images/projects/파일명.png
    repo: "https://github.com/아이디/billboard-multimodal",
    url: "",
    doc: "",
    description: "연구 질문\n\n- 가사의 감정 극성과 앨범 커버의 시각적 감정은 시대에 따라 수렴하는가, 이탈하는가?\n- 이탈 구간은 장르·레이블·차트 성적과 어떤 관계를 갖는가?\n\n방법: 가사 코퍼스 감정분석(사전 기반 + 트랜스포머), 커버 이미지 감정분석(CLIP/시각 감정 모델), 시계열 상관·변화점 탐지.",
    updates: [
      {
        date: "2025-10-05",
        title: "차트 데이터 수집 파이프라인 착수",
        body: "주간 차트 메타데이터 스키마를 확정하고 수집 스크립트 초안을 작성했다.\n\n- 앨범 단위 키(artist, album, release_date) 정규화 규칙 정리\n- 중복·재발매 판별 기준 수립",
        image: "",
        links: []
      },
      {
        date: "2026-03-18",
        title: "가사·커버 이미지 1차 수집 완료",
        body: "앨범 **12,000건**에 대해 트랙 목록과 커버 이미지를 확보했다. 가사 결측률은 8.4%.\n\n- 결측 보완 대상 목록 작성\n- 이미지 해상도 512px 이상으로 통일",
        image: "images/projects/sample-progress.png",
        links: [{ label: "수집 로그 요약", url: "" }]
      }
    ]
  },

  {
    id: "lyrics-sentiment-lexicon",
    title: "대중음악 가사용 한국어·영어 감정어휘 사전 구축",
    status: "계획",
    progress: 10,
    started: "2026-07",
    role: "공동 연구",
    stack: ["Python", "spaCy", "AntConc"],
    summary: "기존 범용 감정사전이 가사 장르의 은유·반어 표현을 제대로 포착하지 못하는 문제를 보완하기 위한 도메인 특화 사전 구축.",
    cover: "",
    repo: "",
    description: "1차 목표: 장르별 감정 어휘 후보 3,000개 추출 및 3인 교차 주석.",
    updates: [
      {
        date: "2026-07-02",
        title: "연구계획서 초안",
        body: "주석 가이드라인 v0.1 작성, 파일럿 샘플 200문장 선정.",
        image: "",
        links: []
      }
    ]
  }

];
