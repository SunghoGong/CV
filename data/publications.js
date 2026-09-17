/* ==========================================================================
   출판물(Publications)
   ── 새 출판물은 배열 "맨 아래"에 추가하세요. 화면에서는 자동으로 맨 위에 쌓입니다.
      (정렬 규칙: date 최신순 → 날짜가 같거나 없으면 나중에 추가한 항목이 위)

   한 항목 템플릿 — 필요 없는 줄은 지우거나 "" 로 두면 화면에 안 나옵니다.
   {
     date: "2026-05",                        // "2026" / "2026-05" / "2026-05-14"
     type: "Journal",                        // Journal / Conference / Thesis / Preprint / Book Chapter ...
     title: "논문 제목",
     authors: "Hong, G., & Kim, S.",
     venue: "학술지명, 12(3), 45–67.",
     note: "KCI 등재",
     image: "images/publications/파일명.png", // 그림/표/포스터 썸네일 (클릭하면 확대)
     pdf:   "files/publications/파일명.pdf",  // PDF 원문 (사이트 폴더에 직접 업로드)
     url:   "https://...",                    // 출처 웹페이지
     doi:   "10.1234/abcd",                   // 또는 전체 DOI 링크
     code:  "https://github.com/...",
     slides:"files/publications/slides.pdf",
     data:  "https://...",
     abstract: "한두 문장 요약 (선택)"
   },
   ========================================================================== */

window.PUBLICATIONS = [

  {
    date: "2025-08",
    type: "Conference",
    title: "코퍼스 기반 대중음악 가사의 감정 어휘 변화: 1990–2020",
    authors: "Hong, G.",
    venue: "○○영어영문학회 여름 학술대회, 서울.",
    note: "구두발표",
    image: "",
    pdf: "",
    url: "",
    abstract: "30년간의 가사 코퍼스에서 감정 어휘의 빈도·연어 패턴 변화를 분석한 예비 연구."
  },

  {
    date: "2026-05",
    type: "Preprint",
    title: "Emotional (Mis)alignment between Lyrics and Album Artwork: A Multimodal Corpus Study of the Billboard 200",
    authors: "Hong, G., & Kim, S.",
    venue: "Preprint (under review).",
    note: "",
    image: "images/publications/sample-figure.png",
    pdf: "files/publications/sample-paper.pdf",
    url: "https://example.org/preprint",
    doi: "",
    code: "https://github.com/아이디/billboard-multimodal",
    abstract: "가사 감정 점수와 앨범 커버 이미지 감정 점수의 시계열 정렬도를 측정하고, 장르·시대별 이탈 구간을 통계적으로 검증한다."
  }

];
