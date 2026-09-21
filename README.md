# 개인 CV 홈페이지 사용 설명서(Claude 사용)

HTML/CSS/JS로만 만든 **정적 사이트**입니다. 빌드 도구·서버·데이터베이스가 필요 없고,
GitHub Pages에 파일만 올리면 바로 웹사이트가 됩니다.

핵심 원칙: **HTML은 건드리지 않습니다.** 내용은 모두 `data/` 폴더의 세 파일에만 씁니다.

---

## 1. 폴더 구조

```
cv-site/
├─ index.html              메인화면 (Main)
├─ publications.html       출판물 목록
├─ projects.html           프로젝트 목록
├─ project.html            프로젝트 상세(진행상황) — 목록에서 클릭하면 열립니다
├─ data/
│   ├─ profile.js          ← 이름·직급·학교·소개·학력·소식
│   ├─ publications.js     ← 출판물 목록
│   └─ projects.js         ← 프로젝트 + 진행상황 기록
├─ files/
│   ├─ CV.pdf              (직접 넣으세요)
│   └─ publications/       논문 PDF를 여기에 넣으세요
├─ images/
│   ├─ profile.jpg         프로필 사진 (없으면 이니셜 원형 표시)
│   ├─ publications/       출판물 썸네일 이미지
│   └─ projects/           프로젝트 커버·진행상황 이미지
└─ assets/                 디자인(css) · 렌더링 스크립트(js) — 수정 불필요
```

## 2. 미리보기

`index.html` 을 **더블클릭**하면 브라우저에서 바로 열립니다. (별도 서버 불필요)
내용을 고친 뒤에는 브라우저에서 새로고침(⌘R)만 하면 됩니다.

## 3. 최신 항목이 위로 쌓이는 규칙

요청하신 "올리는 순서대로 아래에서 위로 쌓이는" 동작이 자동으로 적용됩니다.

1. `date` 가 **최신인 항목이 위**로 옵니다.
2. 날짜가 같거나 비어 있으면, **파일에서 나중에 적은 항목이 위**로 옵니다.

즉 **새 항목은 항상 배열 맨 아래에 붙여넣으면** 화면 맨 위에 나타납니다.
출판물·프로젝트·진행상황 기록·News 모두 같은 규칙입니다.

## 4. 내용 수정하는 방법

파일은 메모장·TextEdit·VS Code 등 아무 텍스트 편집기로 열면 됩니다.
따옴표 `" "` 안의 내용만 바꾸고, 각 줄 끝의 쉼표 `,` 는 지우지 마세요.

### (1) 메인화면 — `data/profile.js`

이름, 직급(`position`), 학과(`department`), 학교(`affiliation`), 이메일, 사진 경로,
소개글(`intro`), 연구 관심(`interests`), 학력(`education`), 경력(`experience`),
최근 소식(`news`)을 수정합니다. 비워둔 섹션은 화면에서 자동으로 사라집니다.

프로필 사진은 `images/profile.jpg` 로 저장하세요(정사각형 권장, 600×600px 정도).

### (2) 출판물 — `data/publications.js`

배열 맨 아래에 아래 블록을 복사해 붙이세요.

```js
  {
    date: "2026-09",                          // 필수: 최신순 정렬 기준
    type: "Journal",                          // Journal / Conference / Thesis / Preprint ...
    title: "논문 제목",
    authors: "Hong, G., & Kim, S.",
    venue: "학술지명, 12(3), 45–67.",
    note: "KCI 등재",
    image: "images/publications/fig1.png",    // 썸네일 (클릭하면 확대)
    pdf:   "files/publications/paper.pdf",    // PDF 원문
    url:   "https://journal.example.org/...", // 출처 웹페이지
    doi:   "10.1234/abcd",
    code:  "https://github.com/...",
    abstract: "한두 문장 요약"
  },
```

- **이미지**: PNG/JPG 파일을 `images/publications/` 에 넣고 `image:` 에 경로를 씁니다.
- **PDF**: `files/publications/` 에 넣고 `pdf:` 에 경로를 씁니다. 파일명은 영문·숫자·하이픈만 쓰는 편이 안전합니다.
- **출처 웹페이지**: `url:` 에 주소를 넣으면 제목 자체가 링크가 되고 "출처 웹페이지" 버튼도 생깁니다.
- 필요 없는 줄은 지우거나 `""` 로 두면 버튼이 표시되지 않습니다.
- `profile.js` 의 `highlightAuthor` 에 적은 저자명은 목록에서 **굵게** 강조됩니다.

### (3) 프로젝트 — `data/projects.js`

새 프로젝트는 배열 맨 아래에 추가합니다.

```js
  {
    id: "my-new-project",        // 영문/숫자/하이픈, 중복 불가 (주소에 쓰입니다)
    title: "프로젝트 명",
    status: "진행중",            // 진행중 / 계획 / 완료 / 보류 → 배지 색이 달라집니다
    progress: 30,                // 진행률 바 (0–100). 필요 없으면 이 줄 삭제
    started: "2026-09",
    role: "단독 연구",
    stack: ["Python", "R"],
    summary: "목록 카드에 보이는 한 줄 설명",
    cover: "images/projects/cover.png",
    repo: "https://github.com/...",
    description: "상세 페이지 개요. 빈 줄로 단락을 나누고, '- ' 로 목록을 만들 수 있습니다.",
    updates: []
  },
```

**진행상황 추가**가 이 페이지의 핵심입니다. 해당 프로젝트의 `updates: [ ... ]` 안,
맨 아래에 아래 블록을 붙이면 상세 페이지 타임라인 맨 위에 올라갑니다.

```js
      {
        date: "2026-09-17",
        title: "이번 주 진행 요약",
        body: "본문은 여러 줄로 쓸 수 있습니다.\n\n- 목록 항목\n- **굵게**, [링크 글자](https://example.org) 도 가능",
        image: "images/projects/2026-09-17-result.png",
        links: [{ label: "분석 노트북", url: "https://..." }]
      },
```

- `\n\n` 은 단락 구분, 줄 앞의 `- ` 는 목록, `**글자**` 는 굵게, `[글자](주소)` 는 링크입니다.
- 목록 카드에는 "최근 업데이트 날짜"와 "기록 N건"이 자동 계산되어 표시됩니다.

## 5. GitHub Pages로 공개하기

1. GitHub에 로그인 → **New repository** 클릭.
2. 저장소 이름을 **`아이디.github.io`** 로 만듭니다(예: `gildong.github.io`). Public으로 생성.
   - 이 이름으로 만들면 주소가 `https://아이디.github.io` 가 됩니다.
   - 다른 이름(예: `cv`)으로 만들면 주소는 `https://아이디.github.io/cv/` 가 됩니다.
3. 저장소 화면에서 **Add file → Upload files** 클릭 → `cv-site` 폴더 **안의 내용물 전체**를
   (폴더 자체가 아니라 `index.html`, `data/`, `assets/` … 를) 끌어다 놓고 **Commit changes**.
4. **Settings → Pages** → Source를 **Deploy from a branch**, Branch를 **main / (root)** 로 두고 Save.
5. 1–2분 뒤 주소로 접속하면 공개됩니다. 이후 내용 수정은 GitHub 웹에서 해당 파일을 열고
   연필(Edit) 아이콘 → 수정 → Commit 하면 끝입니다.

> 터미널을 쓰는 경우:
> ```bash
> cd ~/Desktop/cv-site
> git init && git add -A && git commit -m "init cv site"
> git branch -M main
> git remote add origin https://github.com/아이디/아이디.github.io.git
> git push -u origin main
> ```

`.nojekyll` 파일은 GitHub Pages가 파일을 임의로 가공하지 않게 하는 빈 파일입니다. 지우지 마세요.

## 6. 디자인 바꾸기

`assets/css/style.css` 파일 맨 위 `:root { ... }` 의 값만 바꾸면 전체 톤이 바뀝니다.

- `--accent`: 강조색 (기본 남색 `#1f4e79`)
- `--maxw`: 본문 최대 폭
- `--font-serif`: 제목용 서체

## 7. 자주 생기는 문제

| 증상 | 원인과 해결 |
| --- | --- |
| 화면이 비어 있음 | `data/*.js` 의 쉼표·중괄호가 깨졌을 가능성. 브라우저에서 우클릭 → 검사 → Console 탭의 빨간 오류 줄을 확인하세요. |
| 이미지·PDF가 안 열림 | 경로 대소문자와 확장자를 확인하세요. `Images/`≠`images/`, `.PNG`≠`.png`. |
| 순서가 이상함 | `date` 형식을 `"2026-09-17"` 처럼 맞추세요. `"2026.9.17"` 도 인식하지만 `"9/17/26"` 은 안 됩니다. |
| 프로젝트 클릭 시 "찾을 수 없음" | `projects.js` 의 `id` 값에 공백이나 한글이 들어갔는지 확인하세요. |
| 수정했는데 그대로 | 브라우저 강제 새로고침(⌘⇧R). GitHub Pages는 반영에 1–2분 걸립니다. |

---

## 참고: R Markdown 방식과 비교

R을 이미 쓰고 있다면 `distill` 이나 `quarto` 패키지로도 CV 사이트를 만들 수 있습니다.
다만 진행상황 기록처럼 **항목을 자주 덧붙이는 구조**에서는 매번 R에서 렌더링(`render`)을
다시 실행해야 하고, 프로젝트별 상세 페이지를 만들려면 `.Rmd` 파일을 계속 늘려야 합니다.
이 사이트는 데이터 파일 한 곳에 한 블록만 붙이면 되고 렌더링 단계가 없어,
업데이트 빈도가 높은 CV·프로젝트 로그에는 관리 부담이 더 적습니다.
나중에 논문 그림을 R로 그려 넣는 것은 그대로 가능합니다 — PNG로 저장해 `images/` 에 넣으면 됩니다.
