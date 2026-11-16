/* First PC Gaming — shared page logic. No need to edit this file. */

(function () {
  const page = document.body.dataset.page;

  /* ---------- Shared header ---------- */
  const nav = [
    { href: "index.html", label: "Home", key: "home" },
    { href: "videos.html", label: "YouTube", key: "videos" },
    { href: "championship.html", label: "Championship", key: "championship" },
    { href: "index.html#contact", label: "Contact", key: "contact" }
  ];

  const header = document.getElementById("site-header");
  if (header) {
    header.innerHTML = `
      <div class="wrap header-inner">
        <a class="brand" href="index.html" aria-label="First PC Gaming home">
          <img src="assets/logo-wide.png" alt="First PC Gaming">
        </a>
        <button class="nav-toggle" aria-label="Menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
        <nav class="nav">
          ${nav.map(n => `<a href="${n.href}" class="${n.key === page ? "active" : ""}">${n.label}</a>`).join("")}
          <a class="btn btn-sm" href="${SITE.socials.youtube}?sub_confirmation=1" target="_blank" rel="noopener">Subscribe</a>
        </nav>
      </div>`;
    const toggle = header.querySelector(".nav-toggle");
    toggle.addEventListener("click", () => {
      const open = header.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open);
    });
  }

  /* ---------- Shared footer ---------- */
  const footer = document.getElementById("site-footer");
  if (footer) {
    footer.innerHTML = `
      <div class="wrap footer-inner">
        <div>
          <div class="brand-text">First PC <b>Gaming</b></div>
          <p class="muted">PC gaming from Wales, UK.</p>
        </div>
        <div class="socials">${socialLinks()}</div>
        <p class="muted small">© ${new Date().getFullYear()} First PC Gaming · Wales, UK</p>
      </div>`;
  }

  function socialLinks() {
    const icons = {
      youtube: '<path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8ZM9.8 15.1V8.9l5.7 3.1-5.7 3.1Z"/>',
      facebook: '<path d="M14 8.5V6.6c0-.9.6-1.1 1-1.1h2.6V1.6L14 1.6c-4 0-4.9 3-4.9 4.9v2H6.8v4h2.3V22.4H14V12.5h3.3l.4-4H14Z"/>',
      twitter: '<path d="M17.8 2h3.4l-7.4 8.5L22.5 22h-6.8l-5.3-7-6.1 7H.9l7.9-9.1L.5 2h7l4.8 6.4L17.8 2Zm-1.2 18h1.9L6.5 3.9H4.5L16.6 20Z"/>'
    };
    return Object.entries(SITE.socials).map(([k, url]) =>
      `<a href="${url}" target="_blank" rel="noopener" aria-label="${k}">
         <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">${icons[k]}</svg>
       </a>`).join("");
  }

  const thumb = id => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function card(v, ch, href) {
    return `
      <a class="vcard" href="${href}" data-id="${v.id}" data-ch="${ch.key}">
        <div class="vthumb">
          <img src="${thumb(v.id)}" alt="" loading="lazy">
          ${v.length ? `<span class="vlen">${v.length}</span>` : ""}
          <span class="vplay" aria-hidden="true"></span>
        </div>
        <div class="vmeta">
          <h3>${esc(v.title)}</h3>
          <span class="muted small">${esc(ch.owner)}${v.published ? " · " + ago(v.published) : ""}</span>
        </div>
      </a>`;
  }

  /* ---------- News (data/news.json is refreshed hourly by GitHub) ---------- */
  function ago(iso) {
    if (!iso) return "";
    const m = Math.round((Date.now() - new Date(iso)) / 60000);
    if (m < 60) return `${Math.max(m, 1)}m ago`;
    const h = Math.round(m / 60);
    if (h < 48) return `${h}h ago`;
    const d = Math.round(h / 24);
    if (d <= 30) return `${d}d ago`;
    return new Date(iso).toLocaleDateString("en-GB", { month: "short", year: "numeric" });
  }

  function newsCard(n) {
    return `
      <a class="ncard" href="${esc(n.link)}" target="_blank" rel="noopener">
        <div class="nimg">
          <span class="nsrc-big">${esc(n.source)}</span>
          ${n.image ? `<img src="${esc(n.image)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">` : ""}
        </div>
        <div class="nbody">
          <div class="ntags">
            <span class="ntag">${esc(n.source)}</span>
            ${n.brand ? `<span class="ntag brand ${n.brand.replace(/\W/g, "")}">${esc(n.brand)}</span>` : ""}
            <span class="ntime">${ago(n.date)}</span>
          </div>
          <h3>${esc(n.title)}</h3>
        </div>
      </a>`;
  }

  /* Auto-scrolling row: pauses on hover, click-and-drag (or swipe) to scroll by hand */
  function fillMarquee(el, items) {
    if (!el || !items || !items.length) return false;
    // Repeat short lists so one copy is always wider than the screen
    const reps = Math.max(1, Math.ceil(2600 / (items.length * 318)));
    const cards = items.map(newsCard).join("").repeat(reps);
    // Content is doubled so the loop is seamless
    el.innerHTML = `<div class="marquee-track">${cards}${cards}</div>`;
    const track = el.firstElementChild;
    const dir = el.classList.contains("reverse") ? 1 : -1;   // -1 = moves left
    const SPEED = 40;                                         // pixels per second
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    let half = 0, x = 0, last = performance.now();
    let hover = false, down = false, dragged = false, startX = 0, startOffset = 0, resumeAt = 0;

    let started = false;
    // Width of one copy of the cards (re-measured if the window or layout changes)
    const measure = () => {
      half = track.scrollWidth / 2;
      if (half && !started) { started = true; x = dir === 1 ? -half / 2 : 0; }
    };
    const wrap = v => half ? ((v % half) - half) % half : v;  // keep within (-half, 0]
    if ("ResizeObserver" in window) new ResizeObserver(measure).observe(track);
    addEventListener("resize", measure);

    function frame(t) {
      const dt = Math.min((t - last) / 1000, 0.1); last = t;
      if (!half) measure();
      if (!reduced && !hover && !down && t > resumeAt) x = wrap(x + dir * SPEED * dt);
      track.style.transform = `translate3d(${x}px,0,0)`;
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    el.addEventListener("mouseenter", () => { hover = true; });
    el.addEventListener("mouseleave", () => { hover = false; });

    el.addEventListener("pointerdown", e => {
      if (e.button !== 0) return;
      down = true; dragged = false; startX = e.clientX; startOffset = x;
    });
    addEventListener("pointermove", e => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 6 && !dragged) { dragged = true; el.classList.add("dragging"); }
      if (dragged) x = wrap(startOffset + dx);
    });
    const end = e => {
      if (!down) return;
      down = false;
      el.classList.remove("dragging");
      // On touch screens there's no hover, so wait a moment before carrying on
      if (e.pointerType !== "mouse") resumeAt = performance.now() + 3000;
    };
    addEventListener("pointerup", end);
    addEventListener("pointercancel", end);

    // A drag shouldn't open the story underneath
    el.addEventListener("click", e => { if (dragged) { e.preventDefault(); e.stopPropagation(); dragged = false; } }, true);
    el.addEventListener("dragstart", e => e.preventDefault());

    // Sideways trackpad / shift+wheel scrolling
    el.addEventListener("wheel", e => {
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : (e.shiftKey ? e.deltaY : 0);
      if (!d) return;
      e.preventDefault();
      x = wrap(x - d);
    }, { passive: false });
    return true;
  }

  async function loadNews() {
    const section = document.getElementById("news");
    if (!section) return;
    try {
      const res = await fetch("data/news.json", { cache: "no-cache" });
      if (!res.ok) return;
      const data = await res.json();
      section.hidden = false;
      let any = false;
      ["gaming", "hardware", "ai"].forEach(k => {
        const el = document.getElementById("news-" + k);
        if (!el) return;
        if (fillMarquee(el, data[k])) any = true;
        else { el.previousElementSibling.remove(); el.remove(); }   // hide empty rows
      });
      if (!any) { section.hidden = true; return; }
      document.getElementById("news-updated").textContent = data.updated ? `Updated ${ago(data.updated)}` : "";
      section.hidden = false;
    } catch (e) { /* no news yet — section stays hidden */ }
  }

  /* ---------- Latest uploads (data/videos.json is refreshed hourly by GitHub) ---------- */
  async function loadVideos() {
    try {
      const res = await fetch("data/videos.json", { cache: "no-cache" });
      if (!res.ok) return;
      const data = await res.json();
      CHANNELS.forEach(ch => {
        const auto = (data.channels || {})[ch.key];
        if (!auto || !auto.length) return;
        const manual = Object.fromEntries(ch.videos.map(v => [v.id, v]));
        const merged = auto.map(v => ({ ...v, ...(manual[v.id] ? { length: manual[v.id].length } : {}) }));
        // Keep older hand-added videos that YouTube's feed no longer lists
        ch.videos.forEach(v => { if (!merged.some(m => m.id === v.id)) merged.push(v); });
        ch.videos = merged;
      });
    } catch (e) { /* fall back to the list in site-data.js */ }
  }

  /* ---------- Home page ---------- */
  if (page === "home") {
    const latest = document.getElementById("latest-videos");
    if (latest) loadVideos().then(() => {
      const all = [];
      CHANNELS.forEach(ch => ch.videos.forEach((v, i) => all.push({ v, ch, i })));
      // Newest first by upload date; videos without a date keep their list order
      all.sort((a, b) => (b.v.published || "").localeCompare(a.v.published || "") || a.i - b.i);
      latest.innerHTML = all.slice(0, 4)
        .map(({ v, ch }) => card(v, ch, `videos.html?c=${ch.key}&v=${v.id}`)).join("");
    });
    const partners = document.getElementById("partners");
    if (partners) {
      partners.innerHTML = PARTNERS.map(p => `
        <a class="partner" href="${p.url}" target="_blank" rel="noopener sponsored">
          <h3>${esc(p.name)}</h3><p class="muted">${esc(p.text)}</p>
          <span class="link-arrow">Visit ${esc(p.name)} →</span>
        </a>`).join("");
    }
    loadNews();
    const cs = document.getElementById("champ-season");
    if (cs) cs.textContent = CHAMPIONSHIP.season;
    const email = document.getElementById("contact-email");
    if (email) { email.href = `mailto:${SITE.email}`; email.textContent = SITE.email; }
    const hs = document.getElementById("hero-socials");
    if (hs) hs.innerHTML = socialLinks();
  }

  /* ---------- Videos page ---------- */
  if (page === "videos") loadVideos().then(() => {
    const params = new URLSearchParams(location.search);
    let current = CHANNELS.find(c => c.key === params.get("c")) || CHANNELS[0];
    let currentId = params.get("v") || current.videos[0].id;

    const tabs = document.getElementById("channel-tabs");
    const grid = document.getElementById("video-grid");
    const player = document.getElementById("player");
    const npTitle = document.getElementById("np-title");
    const npOwner = document.getElementById("np-owner");
    const npYT = document.getElementById("np-youtube");
    const chInfo = document.getElementById("channel-info");

    function play(id, autoplay) {
      const ch = CHANNELS.find(c => c.videos.some(v => v.id === id)) || current;
      const v = ch.videos.find(x => x.id === id) || ch.videos[0];
      currentId = v.id;
      player.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${v.id}?rel=0${autoplay ? "&autoplay=1" : ""}"
        title="${esc(v.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen></iframe>`;
      npTitle.textContent = v.title;
      npOwner.textContent = ch.owner + (v.length ? " · " + v.length : "");
      npYT.href = `https://www.youtube.com/watch?v=${v.id}`;
      grid.querySelectorAll(".vcard").forEach(el => el.classList.toggle("playing", el.dataset.id === v.id));
      history.replaceState(null, "", `?c=${current.key}&v=${v.id}`);
    }

    function renderChannel() {
      tabs.innerHTML = CHANNELS.map(c =>
        `<button role="tab" aria-selected="${c === current}" data-key="${c.key}">
           ${esc(c.name)} <span class="count">${c.videos.length}</span>
         </button>`).join("");
      chInfo.innerHTML = `
        <div>
          <h2>${esc(current.name)}</h2>
          <p class="muted">${esc(current.blurb)}</p>
        </div>
        ${current.channelUrl ? `<a class="btn btn-ghost" href="${current.channelUrl}" target="_blank" rel="noopener">Open channel on YouTube</a>` : ""}`;
      grid.innerHTML = current.videos.map(v => card(v, current, `?c=${current.key}&v=${v.id}`)).join("");
      grid.querySelectorAll(".vcard").forEach(el => el.classList.toggle("playing", el.dataset.id === currentId));
    }

    tabs.addEventListener("click", e => {
      const b = e.target.closest("button");
      if (!b) return;
      current = CHANNELS.find(c => c.key === b.dataset.key);
      renderChannel();
    });

    grid.addEventListener("click", e => {
      const a = e.target.closest(".vcard");
      if (!a) return;
      e.preventDefault();
      play(a.dataset.id, true);
      document.getElementById("player-section").scrollIntoView({ behavior: "smooth", block: "start" });
    });

    renderChannel();
    play(currentId, false);
  });

  /* ---------- Championship page ---------- */
  if (page === "championship") {
    const C = CHAMPIONSHIP;
    document.getElementById("champ-title").textContent = C.title;
    document.getElementById("champ-season").textContent = C.season;

    document.getElementById("points-grid").innerHTML = C.points.map((p, i) =>
      `<div class="pos ${i < 3 ? "podium p" + (i + 1) : ""}"><span class="place">P${i + 1}</span><span class="pts">${p}</span></div>`).join("");

    const st = document.getElementById("standings");
    if (C.standings.length) {
      const rows = [...C.standings].sort((a, b) => b.points - a.points);
      st.innerHTML = `
        <table class="table">
          <thead><tr><th>Pos</th><th>Driver</th><th>Team</th><th>Wins</th><th class="r">Points</th></tr></thead>
          <tbody>${rows.map((r, i) => `
            <tr class="${i === 0 ? "leader" : ""}"><td>${i + 1}</td><td>${esc(r.driver)}</td><td class="muted">${esc(r.team || "")}</td>
            <td>${r.wins || 0}</td><td class="r"><b>${r.points}</b></td></tr>`).join("")}
          </tbody>
        </table>`;
    } else {
      st.innerHTML = `<div class="empty"><h3>Grid's empty — for now</h3><p class="muted">Standings appear here once the first race is in. Want a seat? <a href="index.html#contact">Get in touch</a>.</p></div>`;
    }

    const cal = document.getElementById("calendar");
    if (C.rounds.length) {
      cal.innerHTML = C.rounds.map(r => `
        <div class="round ${r.status || ""}">
          <span class="rnum">R${r.round}</span>
          <span class="rtrack">${esc(r.track)}</span>
          <span class="muted small">${r.date ? new Date(r.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "TBC"}</span>
        </div>`).join("");
    } else {
      cal.innerHTML = `<div class="empty"><p class="muted">Calendar to be announced.</p></div>`;
    }

    document.getElementById("rules").innerHTML = C.rules.map(r => `<li>${esc(r)}</li>`).join("");
  }
})();
