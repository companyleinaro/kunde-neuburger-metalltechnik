/* ===================================================================
   NEUBURGER METALLTECHNIK — script.js
   1. Hilfsfunktionen
   2. Mobiles Menü
   3. Sticky Header beim Scrollen
   4. Scroll-Reveal-Animationen
   5. FAQ-Akkordeon
   6. Einstellungen (content/einstellungen.json)
   7. Aktuelles / News (content/news.json)
   8. Projekte (content/projekte.json)
   9. Kontaktformular
   10. Cookie-Banner
   11. Jahreszahl im Footer

   Inhalte wie News, Projekte, Google-Bewertungslink oder WhatsApp-Nummer
   werden NICHT hier, sondern in den Dateien im Ordner "content/" gepflegt.
=================================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- 1. Hilfsfunktionen ---------- */
  const escapeHtml = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));

  // Nur relative Pfade oder http(s)/mailto/tel-Links zulassen
  const safeUrl = (url) => {
    const value = String(url ?? "").trim();
    if (!value) return "";
    if (/^(https?:|mailto:|tel:)/i.test(value)) return value;
    if (/^[a-z][a-z0-9+.-]*:/i.test(value)) return "";
    return value;
  };

  const loadJson = async (path) => {
    try {
      const response = await fetch(path, { cache: "no-cache" });
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      return null;
    }
  };

  const today = () => {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  };

  const formatDate = (iso) => {
    const parts = String(iso || "").split("-");
    if (parts.length !== 3) return "";
    const months = ["Jänner", "Februar", "März", "April", "Mai", "Juni", "Juli",
      "August", "September", "Oktober", "November", "Dezember"];
    const month = months[parseInt(parts[1], 10) - 1];
    return month ? `${parseInt(parts[2], 10)}. ${month} ${parts[0]}` : "";
  };

  /* ---------- 2. Mobiles Menü ---------- */
  const menuBtn = document.getElementById("menuBtn");
  const navMenu = document.getElementById("navMenu");

  if (menuBtn && navMenu) {
    const setMenu = (open) => {
      menuBtn.classList.toggle("active", open);
      navMenu.classList.toggle("open", open);
      document.body.classList.toggle("menu-open", open);
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      menuBtn.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
    };

    menuBtn.addEventListener("click", () => {
      setMenu(!navMenu.classList.contains("open"));
    });

    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenu(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && navMenu.classList.contains("open")) {
        setMenu(false);
        menuBtn.focus();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 1024 && navMenu.classList.contains("open")) {
        setMenu(false);
      }
    });
  }

  /* ---------- 3. Sticky Header beim Scrollen ---------- */
  const header = document.getElementById("header");

  if (header) {
    const updateHeader = () => {
      header.classList.toggle("scrolled", window.scrollY > 40);
    };
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  /* ---------- 4. Scroll-Reveal-Animationen ---------- */
  const revealObserver = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 })
    : null;

  const observeReveal = (root) => {
    root.querySelectorAll(".reveal:not(.active)").forEach((element) => {
      if (revealObserver) revealObserver.observe(element);
      else element.classList.add("active");
    });
  };

  observeReveal(document);

  /* ---------- 5. FAQ-Akkordeon ---------- */
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    if (!question) return;
    question.setAttribute("aria-expanded", "false");

    question.addEventListener("click", () => {
      const willOpen = !item.classList.contains("active");
      faqItems.forEach((other) => {
        other.classList.remove("active");
        const q = other.querySelector(".faq-question");
        if (q) q.setAttribute("aria-expanded", "false");
      });
      item.classList.toggle("active", willOpen);
      question.setAttribute("aria-expanded", willOpen ? "true" : "false");
    });
  });

  /* ---------- 6. Einstellungen ---------- */
  let settings = {};

  const getSetting = (path) =>
    path.split(".").reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : undefined), settings);

  const applySettings = () => {
    // Texte, z. B. Status des Schauraums
    document.querySelectorAll("[data-setting]").forEach((element) => {
      const value = getSetting(element.dataset.setting);
      if (typeof value === "string" && value.trim()) element.textContent = value;
    });

    // Google-Bewertungen: Bereich nur zeigen, wenn ein echter Link eingetragen ist
    const reviewUrl = safeUrl(settings.googleBewertungLink);
    document.querySelectorAll("[data-google-review]").forEach((element) => {
      if (/^https:\/\//i.test(reviewUrl)) {
        element.hidden = false;
        element.querySelectorAll("[data-google-review-link]").forEach((link) => {
          link.href = reviewUrl;
        });
      }
    });

    // WhatsApp: nur zeigen, wenn eine Nummer eingetragen ist
    const whatsapp = String(settings.whatsappNummer || "").replace(/[^\d]/g, "");
    if (whatsapp.length >= 8) {
      document.querySelectorAll("[data-whatsapp]").forEach((element) => {
        element.hidden = false;
        const link = element.matches("a") ? element : element.querySelector("a");
        if (link) {
          link.href = `https://wa.me/${whatsapp}`;
          link.target = "_blank";
          link.rel = "noopener";
        }
      });
    }
  };

  /* ---------- 7. Aktuelles / News ---------- */
  const renderNews = (data) => {
    const container = document.getElementById("newsFeed");
    const section = document.getElementById("aktuelles");
    if (!container) return;

    const now = today();
    const items = (data && Array.isArray(data.meldungen) ? data.meldungen : [])
      .filter((n) => n && n.aktiv !== false && n.titel)
      .filter((n) => !n.datum || n.datum <= now)
      .filter((n) => !n.anzeigenBis || n.anzeigenBis >= now)
      .sort((a, b) => String(b.datum || "").localeCompare(String(a.datum || "")))
      .slice(0, 3);

    if (!items.length) {
      if (section) section.hidden = true;
      return;
    }

    container.innerHTML = items.map((n) => {
      const image = safeUrl(n.bild);
      const link = safeUrl(n.linkZiel);
      return `
        <article class="news-card reveal${image ? " has-image" : ""}">
          ${image ? `<div class="news-image"><img src="${escapeHtml(image)}" alt="${escapeHtml(n.bildText || n.titel)}" loading="lazy"></div>` : ""}
          <div class="news-body">
            <div class="news-meta">
              ${n.kategorie ? `<span class="news-badge">${escapeHtml(n.kategorie)}</span>` : ""}
              ${n.datum ? `<time datetime="${escapeHtml(n.datum)}">${escapeHtml(formatDate(n.datum))}</time>` : ""}
            </div>
            <h3>${escapeHtml(n.titel)}</h3>
            ${n.text ? `<p>${escapeHtml(n.text)}</p>` : ""}
            ${link ? `<a class="text-link" href="${escapeHtml(link)}">${escapeHtml(n.linkText || "Mehr erfahren")} <span aria-hidden="true">→</span></a>` : ""}
          </div>
        </article>`;
    }).join("");

    if (section) section.hidden = false;
    observeReveal(container);
  };

  /* ---------- 8. Projekte (Galerie, Filter, Großansicht) ---------- */
  const projectIcon = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20V9M4 9h16M20 20V9M4 14h16M9 9v11M15 9v11M3 20h18M7 9V5h10v4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  // Alle Bilder eines Projekts in Anzeigereihenfolge (Vorher, Nachher, weitere)
  const projectImages = (p) => {
    const list = [];
    const before = safeUrl(p.vorherBild);
    const after = safeUrl(p.nachherBild);
    if (before && after) {
      // "beschriftungImBild": Vorher/Nachher steht schon im Foto -> kein zusätzliches Etikett
      const showLabel = !p.beschriftungImBild;
      list.push({ src: before, label: "Vorher", show: showLabel });
      list.push({ src: after, label: "Nachher", show: showLabel });
    }
    (Array.isArray(p.bilder) ? p.bilder : []).map(safeUrl).filter(Boolean)
      .forEach((src) => list.push({ src, label: "" }));
    return list;
  };

  /* Großansicht (Lightbox) */
  let lightbox = null;
  let lbState = { project: null, images: [], index: 0, lastFocus: null };

  const showImage = (i) => {
    const imgs = lbState.images;
    if (!imgs.length) return;
    lbState.index = (i + imgs.length) % imgs.length;
    const item = imgs[lbState.index];
    const img = lightbox.querySelector(".lightbox-img");
    img.src = item.src;
    img.alt = `${lbState.project.titel}${item.label ? " – " + item.label.toLowerCase() : ""}`;
    const label = lightbox.querySelector(".lightbox-label");
    label.textContent = item.label;
    label.hidden = !item.label || item.show === false;
    lightbox.querySelector(".lightbox-count").textContent = imgs.length > 1 ? `Bild ${lbState.index + 1} von ${imgs.length}` : "";
    lightbox.querySelectorAll(".lightbox-nav").forEach((b) => { b.hidden = imgs.length < 2; });
  };

  const closeLightbox = () => {
    if (!lightbox || lightbox.hidden) return;
    lightbox.hidden = true;
    document.body.classList.remove("menu-open");
    if (lbState.lastFocus && lbState.lastFocus.focus) lbState.lastFocus.focus();
  };

  const buildLightbox = () => {
    lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.hidden = true;
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Projektbilder");
    lightbox.innerHTML = `
      <div class="lightbox-inner">
        <button type="button" class="lightbox-close" aria-label="Schließen">×</button>
        <figure class="lightbox-figure">
          <div class="lightbox-stage">
            <img class="lightbox-img" alt="">
            <span class="lightbox-label" hidden></span>
            <button type="button" class="lightbox-nav prev" aria-label="Vorheriges Bild">‹</button>
            <button type="button" class="lightbox-nav next" aria-label="Nächstes Bild">›</button>
          </div>
          <figcaption class="lightbox-caption">
            <span class="project-tag lightbox-tag"></span>
            <strong class="lightbox-title"></strong>
            <p class="lightbox-text"></p>
            <span class="lightbox-count"></span>
          </figcaption>
        </figure>
      </div>`;
    document.body.appendChild(lightbox);

    lightbox.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
    lightbox.querySelector(".prev").addEventListener("click", () => showImage(lbState.index - 1));
    lightbox.querySelector(".next").addEventListener("click", () => showImage(lbState.index + 1));
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox || e.target.classList.contains("lightbox-inner")) closeLightbox();
    });

    document.addEventListener("keydown", (e) => {
      if (!lightbox || lightbox.hidden) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showImage(lbState.index - 1);
      if (e.key === "ArrowRight") showImage(lbState.index + 1);
    });

    // Wischen am Handy
    let touchX = null;
    const stage = lightbox.querySelector(".lightbox-stage");
    stage.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener("touchend", (e) => {
      if (touchX === null) return;
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 40) showImage(lbState.index + (dx < 0 ? 1 : -1));
      touchX = null;
    });
  };

  const openLightbox = (p, startIndex = 0) => {
    const images = projectImages(p);
    if (!images.length) return;
    if (!lightbox) buildLightbox();
    lbState = { project: p, images, index: 0, lastFocus: document.activeElement };
    lightbox.querySelector(".lightbox-tag").textContent = p.kategorie || "";
    lightbox.querySelector(".lightbox-title").textContent = p.titel;
    lightbox.querySelector(".lightbox-text").textContent = p.beschreibung || "";
    showImage(startIndex);
    lightbox.hidden = false;
    document.body.classList.add("menu-open");
    lightbox.querySelector(".lightbox-close").focus();
  };

  const projectCard = (p, index) => {
    const imgs = projectImages(p);
    const hasBA = imgs.length > 1 && imgs[0].label === "Vorher";
    const cover = hasBA ? imgs[1] : imgs[0];
    const media = cover
      ? `<div class="project-photo">
           <img src="${escapeHtml(cover.src)}" alt="${escapeHtml(p.titel)}" loading="lazy">
           ${hasBA ? `<span class="project-badge">Vorher / Nachher</span>` : ""}
           ${imgs.length > 1 ? `<span class="project-count">${imgs.length} Bilder</span>` : ""}
         </div>`
      : `<div class="project-photo no-image"><div class="icon">${projectIcon}</div></div>`;
    return `
      <article class="project-card reveal${cover ? " is-clickable" : ""}" data-cat="${escapeHtml(p.kategorie || "")}" data-index="${index}">
        ${media}
        <div class="project-info">
          ${p.kategorie ? `<span class="project-tag">${escapeHtml(p.kategorie)}</span>` : ""}
          <h3>${cover ? `<button type="button" class="project-open">${escapeHtml(p.titel)}</button>` : escapeHtml(p.titel)}</h3>
          ${p.beschreibung ? `<p>${escapeHtml(p.beschreibung)}</p>` : ""}
          ${p.ort ? `<span class="project-location">${escapeHtml(p.ort)}</span>` : ""}
        </div>
      </article>`;
  };

  const renderProjects = (data) => {
    const all = (data && Array.isArray(data.projekte) ? data.projekte : [])
      .filter((p) => p && p.aktiv !== false && p.titel);
    const hint = (data && data.hinweis) || "Weitere Einblicke in unsere Projekte folgen.";

    // Hervorgehobenes Vorher-Nachher-Projekt (nur Projektseite)
    const featureBox = document.getElementById("projectFeature");
    const featured = all.find((p) => p.hervorheben && safeUrl(p.vorherBild) && safeUrl(p.nachherBild));
    if (featureBox && featured) {
      const n = projectImages(featured).length;
      featureBox.innerHTML = `
        <div class="project-feature reveal">
          <div class="feature-compare">
            <figure><img src="${escapeHtml(safeUrl(featured.vorherBild))}" alt="${escapeHtml(featured.titel)} – vorher" loading="lazy"><figcaption${featured.beschriftungImBild ? ' class="visually-hidden"' : ""}>Vorher</figcaption></figure>
            <figure><img src="${escapeHtml(safeUrl(featured.nachherBild))}" alt="${escapeHtml(featured.titel)} – nachher" loading="lazy"><figcaption${featured.beschriftungImBild ? ' class="visually-hidden"' : ""}>Nachher</figcaption></figure>
          </div>
          <div class="feature-text">
            <span class="project-tag">${escapeHtml(featured.kategorie || "")}</span>
            <h2>${escapeHtml(featured.titel)}</h2>
            <p>${escapeHtml(featured.beschreibung || "")}</p>
            <button type="button" class="btn secondary" data-open-featured>Alle ${n} Bilder ansehen <span class="btn-arrow">→</span></button>
          </div>
        </div>`;
      featureBox.hidden = false;
      featureBox.querySelector("[data-open-featured]").addEventListener("click", () => openLightbox(featured));
      featureBox.querySelectorAll("figure").forEach((f, i) => {
        f.addEventListener("click", () => openLightbox(featured, i));
      });
      observeReveal(featureBox);
    }

    document.querySelectorAll("[data-projects]").forEach((grid) => {
      const homeOnly = grid.dataset.projects === "startseite";
      const limit = parseInt(grid.dataset.limit || "0", 10);
      let items = homeOnly
        ? all.filter((p) => p.aufStartseite)
        : all.filter((p) => !(featureBox && featured && p === featured));
      if (limit > 0) items = items.slice(0, limit);

      const wrapper = grid.closest("[data-projects-section]");
      if (homeOnly && !items.length) {
        if (wrapper) wrapper.hidden = true;
        return;
      }

      const showHint = !homeOnly || !limit || items.length < limit;
      const hintCard = !showHint ? "" : `
        <div class="project-card project-hint reveal" data-cat="*">
          <div>
            <span class="project-tag">Projekte</span>
            <h3>${escapeHtml(hint)}</h3>
            <p>Wir dokumentieren laufend neue Arbeiten – von Gittermattenzäunen und Toranlagen bis zu Reparaturen und Sonderanfertigungen.</p>
          </div>
        </div>`;

      grid.innerHTML = items.map(projectCard).join("") + hintCard;

      grid.querySelectorAll(".project-card.is-clickable").forEach((card) => {
        const p = items[parseInt(card.dataset.index, 10)];
        card.addEventListener("click", () => openLightbox(p));
      });

      if (wrapper) wrapper.hidden = false;
      observeReveal(grid);

      // Filter (nur Projektseite)
      const filterBar = document.getElementById("projectFilter");
      if (filterBar && !homeOnly) {
        const used = new Set(items.map((p) => p.kategorie));
        const cats = (Array.isArray(data.filter) ? data.filter : []).filter((c) => used.has(c));
        if (cats.length > 1) {
          filterBar.innerHTML = ["Alle", ...cats].map((c, i) =>
            `<button type="button" class="filter-chip${i === 0 ? " active" : ""}" data-filter="${i === 0 ? "*" : escapeHtml(c)}" aria-pressed="${i === 0}">${escapeHtml(c)}</button>`
          ).join("");
          filterBar.hidden = false;
          filterBar.addEventListener("click", (e) => {
            const btn = e.target.closest(".filter-chip");
            if (!btn) return;
            const f = btn.dataset.filter;
            filterBar.querySelectorAll(".filter-chip").forEach((b) => {
              b.classList.toggle("active", b === btn);
              b.setAttribute("aria-pressed", b === btn ? "true" : "false");
            });
            grid.querySelectorAll(".project-card").forEach((card) => {
              const c = card.dataset.cat;
              card.hidden = !(f === "*" || c === f || c === "*");
              if (!card.hidden) card.classList.add("active");
            });
          });
        }
      }
    });
  };

  /* ---------- Inhalte laden ---------- */
  const needsNews = document.getElementById("newsFeed");
  const needsProjects = document.querySelector("[data-projects]");

  loadJson("content/einstellungen.json").then((data) => {
    settings = data || {};
    applySettings();
  });

  if (needsNews) loadJson("content/news.json").then(renderNews);
  if (needsProjects) loadJson("content/projekte.json").then(renderProjects);

  /* ---------- 9. Kontaktformular ---------- */
  const form = document.getElementById("contactForm");
  const successMessage = document.getElementById("formSuccess");
  const errorMessage = document.getElementById("formError");

  if (form) {
    // Leistung aus Link übernehmen, z. B. kontakt.html?leistung=zaun
    const serviceSelect = form.querySelector("#service");
    const param = new URLSearchParams(window.location.search).get("leistung");
    if (serviceSelect && param) {
      const match = Array.from(serviceSelect.options).find((o) => o.dataset.key === param);
      if (match) serviceSelect.value = match.value;
    }

    const show = (element, text) => {
      [successMessage, errorMessage].forEach((el) => el && el.classList.remove("visible"));
      if (element) {
        if (text) element.textContent = text;
        element.classList.add("visible");
      }
    };

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const data = new FormData(form);
      if (data.get("website")) return; // Spam-Schutz (unsichtbares Feld)
      data.delete("website");

      // Versandadresse aus dem action-Attribut des Formulars (Web3Forms), sonst aus content/einstellungen.json
      const endpoint = safeUrl(form.getAttribute("action") || settings.formularEndpunkt);
      const submitBtn = form.querySelector("button[type=submit]");

      if (/^https:\/\//i.test(endpoint)) {
        // Versand über einen eingetragenen Formular-Dienst
        try {
          if (submitBtn) submitBtn.disabled = true;
          const response = await fetch(endpoint, {
            method: "POST",
            body: data,
            headers: { Accept: "application/json" }
          });
          if (!response.ok) throw new Error("Versand fehlgeschlagen");
          show(successMessage, "Danke für deine Nachricht! Wir melden uns so schnell wie möglich bei dir.");
          form.reset();
        } catch (error) {
          show(errorMessage, "Die Nachricht konnte leider nicht gesendet werden. Bitte ruf uns an oder schreib direkt an office@neuburger-metall.at.");
        } finally {
          if (submitBtn) submitBtn.disabled = false;
        }
        return;
      }

      // Ohne Formular-Dienst: Anfrage im E-Mail-Programm vorbereiten
      const lines = [
        `Name: ${data.get("name") || ""}`,
        `Telefon: ${data.get("phone") || "-"}`,
        `E-Mail: ${data.get("email") || ""}`,
        `Firma: ${data.get("company") || "-"}`,
        `Gewünschte Leistung: ${data.get("service") || "-"}`,
        "",
        `${data.get("message") || ""}`
      ];
      const subject = `Anfrage über die Website: ${data.get("service") || "Allgemein"}`;
      window.location.href = `mailto:office@neuburger-metall.at?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
      show(successMessage, "Dein E-Mail-Programm wurde mit deiner Anfrage geöffnet. Bitte dort noch auf „Senden“ klicken. Falls sich nichts geöffnet hat, schreib uns direkt an office@neuburger-metall.at oder ruf uns an.");
    });
  }

  /* ---------- 10. Cookie-Banner ---------- */
  const cookieBanner = document.getElementById("cookieBanner");
  const cookieAcceptBtn = document.getElementById("cookieAccept");
  const cookieDeclineBtn = document.getElementById("cookieDecline");

  if (cookieBanner) {
    let consent = null;
    try { consent = localStorage.getItem("cookieConsent"); } catch (error) { consent = null; }

    if (!consent) {
      cookieBanner.classList.add("visible");
      requestAnimationFrame(() => cookieBanner.classList.add("show"));
    }

    const hideBanner = (value) => {
      try { localStorage.setItem("cookieConsent", value); } catch (error) { /* ignorieren */ }
      cookieBanner.classList.remove("show");
      setTimeout(() => cookieBanner.classList.remove("visible"), 400);
    };

    if (cookieAcceptBtn) cookieAcceptBtn.addEventListener("click", () => hideBanner("accepted"));
    if (cookieDeclineBtn) cookieDeclineBtn.addEventListener("click", () => hideBanner("declined"));
  }

  /* ---------- 11. Jahreszahl im Footer ---------- */
  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

});
