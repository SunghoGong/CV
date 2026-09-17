/* ==========================================================================
   Personal CV site — 렌더링 스크립트
   data/profile.js, data/publications.js, data/projects.js 의 내용을 읽어
   각 페이지를 그립니다. 이 파일은 보통 수정할 필요가 없습니다.
   ========================================================================== */

/* ---------- 유틸 ---------- */

const $ = (sel, root = document) => root.querySelector(sel);

function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

/* 날짜 파싱: "2026-03", "2026-03-14", "2026" 모두 허용 */
function parseDate(v) {
  if (!v) return null;
  const m = String(v).trim().match(/^(\d{4})(?:[-./](\d{1,2}))?(?:[-./](\d{1,2}))?/);
  if (!m) return null;
  return new Date(
    Number(m[1]),
    m[2] ? Number(m[2]) - 1 : 11,
    m[3] ? Number(m[3]) : 28
  ).getTime();
}

function fmtDate(v) {
  if (!v) return "";
  const s = String(v).trim();
  const m = s.match(/^(\d{4})(?:[-./](\d{1,2}))?(?:[-./](\d{1,2}))?$/);
  if (!m) return s;
  if (m[3]) return `${m[1]}. ${Number(m[2])}. ${Number(m[3])}.`;
  if (m[2]) return `${m[1]}. ${Number(m[2])}.`;
  return m[1];
}

/*
  최신순 정렬 규칙
  1) date 값이 최신인 항목이 위로
  2) date 가 같거나 없으면, 데이터 파일에서 "나중에 적은 항목"이 위로
     => 새 항목을 배열 맨 아래에 추가하면 화면 맨 위에 쌓입니다.
*/
function sortNewestFirst(items, key = "date") {
  return (items || [])
    .map((item, idx) => ({ item, idx }))
    .sort((a, b) => {
      const da = parseDate(a.item[key]) ?? -Infinity;
      const db = parseDate(b.item[key]) ?? -Infinity;
      if (db !== da) return db - da;
      return b.idx - a.idx;
    })
    .map((x) => x.item);
}

/* 진행상황 본문용 초경량 마크다운: 빈 줄=단락, "- "=목록, **강조**, [글자](링크) */
function richText(src) {
  if (!src) return "";
  const inline = (t) =>
    esc(t)
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener">$1</a>');

  return String(src)
    .split(/\n{2,}/)
    .map((blk) => {
      const lines = blk.split("\n").map((l) => l.trim()).filter(Boolean);
      if (lines.length && lines.every((l) => /^[-*]\s+/.test(l))) {
        return "<ul>" + lines.map((l) => `<li>${inline(l.replace(/^[-*]\s+/, ""))}</li>`).join("") + "</ul>";
      }
      return `<p>${lines.map(inline).join("<br>")}</p>`;
    })
    .join("");
}

/* 링크 버튼 묶음: [{label, url}] */
function linkRow(links, extraClass = "") {
  const items = (links || []).filter((l) => l && l.url && String(l.url).trim());
  if (!items.length) return "";
  return `<div class="linkrow">${items
    .map((l) => {
      const ext = /^(https?:)?\/\//.test(l.url);
      return `<a class="btn ${extraClass} ${l.ghost ? "ghost" : ""}" href="${esc(l.url)}"${
        ext ? ' target="_blank" rel="noopener"' : ""
      }>${esc(l.label)}</a>`;
    })
    .join("")}</div>`;
}

function statusClass(s) {
  const k = String(s || "").toLowerCase();
  if (/(진행|ongoing|active)/.test(k)) return "ongoing";
  if (/(계획|예정|planned)/.test(k)) return "planned";
  if (/(완료|종료|done|published)/.test(k)) return "done";
  if (/(보류|중단|paused|hold)/.test(k)) return "paused";
  return "ongoing";
}

function qs(name) {
  return new URLSearchParams(location.search).get(name) || "";
}

/* ---------- 공통 레이아웃 ---------- */

function renderChrome() {
  const p = window.PROFILE || {};
  document.querySelectorAll("[data-brand]").forEach((el) => {
    el.textContent = p.nameEn || p.name || "CV";
  });
  const foot = $("#footer-text");
  if (foot) {
    const y = new Date().getFullYear();
    foot.innerHTML = `© ${y} ${esc(p.name || "")}${
      p.nameEn ? " (" + esc(p.nameEn) + ")" : ""
    } · 마지막 업데이트 ${esc(window.SITE_UPDATED || "")}`;
  }
  const page = document.body.dataset.page;
  document.querySelectorAll(".navlink").forEach((a) => {
    if (a.dataset.nav === page) a.classList.add("active");
  });
  if (p.name && document.title.includes("{name}")) {
    document.title = document.title.replace("{name}", p.name);
  }
}

/* 이미지 클릭 확대 */
function initLightbox() {
  const box = document.createElement("div");
  box.className = "lightbox";
  box.innerHTML = '<img alt="확대 이미지">';
  document.body.appendChild(box);
  box.addEventListener("click", () => box.classList.remove("on"));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") box.classList.remove("on");
  });
  document.body.addEventListener("click", (e) => {
    const img = e.target.closest("img.thumb, img.log-img, img.zoomable");
    if (!img) return;
    box.querySelector("img").src = img.dataset.full || img.src;
    box.classList.add("on");
  });
}

/* ---------- 메인 화면 ---------- */

function renderProfile() {
  const p = window.PROFILE || {};
  const host = $("#profile");
  if (!host) return;

  const initials = (p.nameEn || p.name || "?").trim().split(/\s+/)
    .map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  const photo = p.photo
    ? `<img class="photo" src="${esc(p.photo)}" alt="${esc(p.name)}"
         onerror="this.outerHTML='<div class=\\'photo photo-fallback\\'>${esc(initials)}</div>'">`
    : `<div class="photo photo-fallback">${esc(initials)}</div>`;

  const contact = [];
  if (p.email) contact.push(`<a href="mailto:${esc(p.email)}">✉ ${esc(p.email)}</a>`);
  if (p.office) contact.push(`<span>📍 ${esc(p.office)}</span>`);
  (p.links || []).forEach((l) => {
    if (l && l.url) contact.push(`<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`);
  });
  if (p.cv) contact.push(`<a href="${esc(p.cv)}" target="_blank" rel="noopener">📄 CV (PDF)</a>`);

  host.innerHTML = `
    ${photo}
    <div class="who">
      <h1>${esc(p.name || "이름")}</h1>
      ${p.nameEn ? `<p class="name-sub">${esc(p.nameEn)}</p>` : ""}
      <p class="position">${esc(p.position || "")}</p>
      <p class="affil">${[p.department, p.affiliation].filter(Boolean).map(esc).join(", ")}</p>
      <div class="contact">${contact.join("")}</div>
    </div>`;

  // 소개
  const intro = $("#intro");
  if (intro) {
    const paras = Array.isArray(p.intro) ? p.intro : (p.intro ? [p.intro] : []);
    intro.innerHTML = paras.length ? paras.map((t) => `<p>${richTextInline(t)}</p>`).join("") : "";
    if (!paras.length) intro.closest("section")?.remove();
  }

  // 연구 관심
  const tags = $("#interests");
  if (tags) {
    const arr = p.interests || [];
    tags.innerHTML = arr.map((t) => `<span class="tag">${esc(t)}</span>`).join("");
    if (!arr.length) tags.closest("section")?.remove();
  }

  // 학력 / 경력
  fillTimeline("#education", p.education);
  fillTimeline("#experience", p.experience);

  // 최근 소식 (최신순)
  const news = $("#news");
  if (news) {
    const arr = sortNewestFirst(p.news || []);
    if (!arr.length) { news.closest("section")?.remove(); }
    else {
      news.innerHTML = arr.map((n) => `
        <li>
          <span class="when">${esc(fmtDate(n.date))}</span>
          <span class="what"><span>${richTextInline(n.text)}</span></span>
        </li>`).join("");
    }
  }
}

function richTextInline(t) {
  return esc(t)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
}

function fillTimeline(sel, items) {
  const el = $(sel);
  if (!el) return;
  const arr = sortNewestFirst(items || [], "from");
  if (!arr.length) { el.closest("section")?.remove(); return; }
  el.innerHTML = arr.map((e) => `
    <li>
      <span class="when">${esc(e.period || [fmtDate(e.from), e.to ? fmtDate(e.to) : "현재"].filter(Boolean).join(" – "))}</span>
      <span class="what">
        <strong>${esc(e.title || "")}</strong>
        <span>${[e.org, e.note].filter(Boolean).map(esc).join(" · ")}</span>
      </span>
    </li>`).join("");
}

/* ---------- 출판물 ---------- */

function renderPublications() {
  const host = $("#pub-list");
  if (!host) return;
  const pubs = sortNewestFirst(window.PUBLICATIONS || []);
  const meName = (window.PROFILE || {}).highlightAuthor;

  if (!pubs.length) {
    host.outerHTML = `<div class="empty">아직 등록된 출판물이 없습니다. <code>data/publications.js</code> 에 항목을 추가하세요.</div>`;
    return;
  }

  host.innerHTML = pubs.map((p) => {
    const authors = meName && p.authors
      ? esc(p.authors).replace(new RegExp(esc(meName), "g"), `<span class="me">${esc(meName)}</span>`)
      : esc(p.authors || "");

    const links = [
      p.pdf ? { label: "PDF", url: p.pdf } : null,
      p.url ? { label: "출처 웹페이지", url: p.url } : null,
      p.doi ? { label: "DOI", url: /^http/.test(p.doi) ? p.doi : "https://doi.org/" + p.doi, ghost: true } : null,
      p.code ? { label: "Code", url: p.code, ghost: true } : null,
      p.slides ? { label: "Slides", url: p.slides, ghost: true } : null,
      p.data ? { label: "Data", url: p.data, ghost: true } : null,
    ].filter(Boolean);

    const thumb = p.image
      ? `<img class="thumb" src="${esc(p.image)}" alt="${esc(p.title)} 이미지" loading="lazy">`
      : "";

    const label = p.type ? esc(p.type) : (p.date ? esc(String(p.date).slice(0, 4)) : "");

    return `
      <li class="pub">
        ${thumb}
        <div class="body">
          ${label ? `<span class="year-badge">${label}${p.type && p.date ? " · " + esc(String(p.date).slice(0, 4)) : ""}</span>` : ""}
          <h3>${p.url ? `<a href="${esc(p.url)}" target="_blank" rel="noopener">${esc(p.title)}</a>` : esc(p.title)}</h3>
          <p class="authors">${authors}</p>
          <p class="venue">${[p.venue, p.note].filter(Boolean).map(esc).join(" · ")}</p>
          ${p.abstract ? `<p class="abstract">${esc(p.abstract)}</p>` : ""}
          ${linkRow(links)}
        </div>
      </li>`;
  }).join("");
}

/* ---------- 프로젝트 목록 ---------- */

function latestUpdate(proj) {
  const ups = sortNewestFirst(proj.updates || []);
  return ups[0] || null;
}

function renderProjects() {
  const host = $("#proj-grid");
  if (!host) return;
  const projects = sortNewestFirst(window.PROJECTS || [], "started");

  if (!projects.length) {
    host.outerHTML = `<div class="empty">아직 등록된 프로젝트가 없습니다. <code>data/projects.js</code> 에 항목을 추가하세요.</div>`;
    return;
  }

  host.innerHTML = projects.map((p) => {
    const last = latestUpdate(p);
    const cover = p.cover
      ? `<img class="cover" src="${esc(p.cover)}" alt="${esc(p.title)} 커버" loading="lazy">`
      : "";
    return `
      <article class="card">
        <a class="card-link" href="project.html?id=${encodeURIComponent(p.id)}">
          ${cover}
          <div class="card-body">
            <span class="status ${statusClass(p.status)}">${esc(p.status || "진행중")}</span>
            <h3>${esc(p.title)}</h3>
            <p class="summary">${esc(p.summary || "")}</p>
            ${typeof p.progress === "number"
              ? `<div class="progress"><div style="width:${Math.max(0, Math.min(100, p.progress))}%"></div></div>
                 <div class="meta">진행률 ${p.progress}%</div>` : ""}
            <div class="meta">${last ? "최근 업데이트 " + esc(fmtDate(last.date)) : "업데이트 없음"} · 기록 ${(p.updates || []).length}건</div>
          </div>
        </a>
      </article>`;
  }).join("");
}

/* ---------- 프로젝트 상세 ---------- */

function renderProjectDetail() {
  const host = $("#proj-detail");
  if (!host) return;
  const id = qs("id");
  const proj = (window.PROJECTS || []).find((p) => String(p.id) === id);

  if (!proj) {
    host.innerHTML = `<div class="empty">프로젝트를 찾을 수 없습니다. <a href="projects.html">목록으로 돌아가기</a></div>`;
    return;
  }
  document.title = `${proj.title} · Project`;

  const updates = sortNewestFirst(proj.updates || []);
  const links = [
    proj.repo ? { label: "Repository", url: proj.repo } : null,
    proj.url ? { label: "관련 웹페이지", url: proj.url } : null,
    proj.doc ? { label: "문서 / PDF", url: proj.doc, ghost: true } : null,
  ].filter(Boolean);

  host.innerHTML = `
    <a class="backlink" href="projects.html">← 프로젝트 목록</a>
    <h1 class="page-title">${esc(proj.title)}</h1>
    <p class="page-desc">${esc(proj.summary || "")}</p>
    ${proj.cover ? `<img class="zoomable" style="border:1px solid var(--line);border-radius:10px;margin-bottom:22px" src="${esc(proj.cover)}" alt="">` : ""}
    <ul class="kv">
      <li><span class="k">상태</span><span><span class="status ${statusClass(proj.status)}">${esc(proj.status || "진행중")}</span></span></li>
      ${proj.started ? `<li><span class="k">시작</span><span>${esc(fmtDate(proj.started))}</span></li>` : ""}
      ${typeof proj.progress === "number" ? `<li><span class="k">진행률</span><span>${proj.progress}%</span></li>` : ""}
      ${proj.role ? `<li><span class="k">역할</span><span>${esc(proj.role)}</span></li>` : ""}
      ${proj.collaborators ? `<li><span class="k">협업</span><span>${esc(proj.collaborators)}</span></li>` : ""}
      ${(proj.stack || []).length ? `<li><span class="k">도구</span><span>${(proj.stack || []).map(esc).join(", ")}</span></li>` : ""}
    </ul>
    ${linkRow(links)}
    ${proj.description ? `<section class="block"><h2>개요</h2><div>${richText(proj.description)}</div></section>` : ""}
    <section class="block">
      <h2>진행상황 (최신순)</h2>
      ${updates.length ? `<ul class="log">${updates.map((u) => `
        <li>
          <div class="log-date">${esc(fmtDate(u.date))}</div>
          <h3>${esc(u.title || "")}</h3>
          <div class="log-body">${richText(u.body)}</div>
          ${u.image ? `<img class="log-img" src="${esc(u.image)}" alt="" loading="lazy">` : ""}
          ${linkRow((u.links || []).map((l) => ({ ...l, ghost: true })))}
        </li>`).join("")}</ul>`
        : `<div class="empty">아직 기록된 진행상황이 없습니다.</div>`}
    </section>`;
}

/* ---------- 부트 ---------- */

document.addEventListener("DOMContentLoaded", () => {
  renderChrome();
  renderProfile();
  renderPublications();
  renderProjects();
  renderProjectDetail();
  initLightbox();
});
