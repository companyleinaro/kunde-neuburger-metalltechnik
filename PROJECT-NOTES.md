# PROJECT NOTES — Neuburger Metalltechnik Website

Diese Datei ist ein Briefing für Claude (egal ob Claude Code, Chat o. Ä.), damit der Kontext aus früheren Sessions nicht jedes Mal neu erklärt werden muss. Bitte diese Datei vor Änderungen am Projekt lesen.

---

## 1. Über das Projekt

Neue Website für **Neuburger Metalltechnik** (Steiermark, Österreich), ein Familienbetrieb für Tore, Zäune, Überdachungen und Sonderanfertigungen (Montage, Service, Reparatur). Ersetzt die alte Seite unter neuburger-metall.at. Reines HTML/CSS/JS, kein Framework, kein Build-Step.

**Firma:**
- Inhaber & Monteur: Marvin Neuburger
- Monteur: Hans-Peter Neuburger
- Gegründet: 2026
- E-Mail: office@neuburger-metall.at
- Telefon: +43 677 61811524
- Social: Instagram & Facebook (@neuburger_metalltechnik)

---

## 2. Wer der Nutzer ist (wichtig für den Arbeitsstil)

- **Kein Programmierer.** Möchte keinen Code selbst schreiben oder debuggen.
- Arbeitet mit VS Code, Git Bash, GitHub, Vercel (Hosting).
- Ziel: Webseiten für Kunden **schnell und mit minimalem eigenen Aufwand** bauen — professionelles Ergebnis, wenig Verwaltungsaufwand.
- Bevorzugt **kleine, gezielte Änderungen** statt große Code-Dumps, sobald die Basis steht (genau dafür ist Claude Code jetzt im Einsatz).
- Schickt gerne reale Bilder/Logos zum Einbauen sowie Stil-Inspirationen (z. B. Apple-Website) als Referenz.

---

## 3. Technische Struktur (Standard für ALLE Projekte dieses Nutzers)

Bewusste Entscheidung gegen die "klassische" modulare CSS-Struktur (reset.css, variables.css, typography.css, buttons.css, cards.css, navbar.css, animations.css, style.css getrennt) — das wurde getestet und wieder verworfen, weil es für Einzelprojekte ohne Build-Tools nur Verwaltungsaufwand und Fehlerquellen ohne Mehrwert bringt.

**Stattdessen gilt für jedes Projekt:**

```
projekt-name/
├── index.html
├── [weitere-seite].html      ← echte Unterseiten, kein One-Pager bei Mehrseiten-Projekten
├── css/
│   └── style.css              ← EINE Datei, intern mit Kommentar-Abschnitten strukturiert
├── js/
│   └── script.js              ← EINE Datei
├── images/
└── README.md                   ← Projektstruktur + Setup-Anleitung
```

Eine Datei pro Sprache. Innerhalb der CSS-Datei klare Kommentar-Trenner wie:
```css
/* ===================== 6. HERO ===================== */
```

---

## 4. Konkretes Design-System dieser Website

### Farben (CSS-Variablen in `:root`)
```css
--black: #0f1214;            /* seit 11/2026 an RAL 7016 angelehnt */
--anthracite: #181d20;
--anthracite-light: #22292d;
--ral7016: #383e42;
--steel-1: #c9cdd3;
--steel-2: #8b919b;
--steel-3: #5b6168;
--spark: #12c1c4;        /* ECHTE Markenfarbe der Firma — NICHT ändern ohne Rückfrage */
--spark-light: #4bd6d8;
--off-white: #f4f4f2;
--muted: #9a9fa6;
--border: rgba(255,255,255,0.07);
--border-strong: rgba(255,255,255,0.13);
--radius: 8px;
--radius-lg: 14px;
```

### Typografie
- Überschriften: **Sora** (Google Fonts, wght 500/600/700) — bewusst gewählt: "Charakter, aber elegant-ruhig", NICHT zu kantig/technisch (das war vorher "Archivo" und wurde verworfen)
- Fließtext: **Inter** (wght 400/500/600)
- Google Fonts Link-Snippet (steht in jedem HTML-`<head>`):
```html
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

### Design-Richtung: "Apple-Prinzip im Dunklen"
Der Nutzer wollte explizit den **Look von apple.com/at** als Vorbild — ABER mit dunklem Theme (nicht hell wie Apple selbst). Das bedeutet konkret:
- Großzügiger Weißraum / großzügige Section-Abstände (140px Padding zwischen Sections)
- Ruhige, zurückhaltende Typografie, keine Effekthascherei
- Akzentfarbe (Türkis) **sehr sparsam** einsetzen, nicht überall
- Wenig visuelle Unruhe, keine überladenen Elemente
- Hero-Bereich zentriert, kein Scroll-Cue. Statt Foto ein dezentes Doppelstab-Gittermatten-Raster (`.mesh-bg`), bis echte Projektfotos vorliegen

### Bewusst vermiedene Stilmittel
- Kein Glasmorphism/Verlaufs-Buttons wie im allerersten Premium-Template (zu "Startup-mäßig" für einen Metallbaubetrieb)
- Kein technisch-kantiges Schriftbild (Archivo wurde verworfen)
- Keine 01/02/03-Nummerierung außer bei echten Ablaufschritten (Prozess-Sektion auf leistungen.html)

### Wiederkehrende Layout-Bausteine
- `.detail-row` mit `style="...grid-template-columns:1fr; text-align:center;"` wird als CTA-Box am Ende jeder Seite genutzt
- Logo wird als **dezentes Wasserzeichen** (`opacity:0.05`, position absolute, rechts unten) in diesen CTA-Boxen eingebaut — Wunsch des Nutzers, dass das Logo öfter auf der Seite vorkommt
- FAQ-Akkordeon nutzt `.faq-item.active` Klasse, Toggle-Logik in `script.js`
- Scroll-Reveal-Animation über `.reveal` Klasse + IntersectionObserver in `script.js` (alle animierten Elemente brauchen diese Klasse)

---

## 5. Bilder

Liegen in `images/`:
- `logo-neuburger-metalltechnik.png` — neues Logo (11/2026, Metall-Optik), aus dem Original im Ordner `../Logo` freigestellt; überall eingebunden
- `favicon.ico`, `favicon-192.png`, `apple-touch-icon.png` — N-Symbol aus dem neuen Logo; `og-neuburger-metalltechnik.jpg` — Vorschaubild
- `logo.jpg` / `Logo_transparent.png` — altes Logo „Montage · Service · Reparatur“, nicht mehr verwendet
- `zaun_1.jpg` – `zaun_3.jpg` — Herkunft unklar, vermutlich Stockfotos, keine Gittermatten → bewusst NICHT als Referenz verwendet
- `team-marvin.jpg` — Portrait Marvin Neuburger
- `team-hans-peter.jpg` — Portrait Hans-Peter Neuburger

Bei neuen Bildern: sprechende Dateinamen verwenden, IMMER in `images/` ablegen, Pfade in HTML exakt `images/dateiname.jpg` (kein führendes `/`, sonst Probleme auf manchen Hosting-Setups).

---

## 6. Offene/bekannte To-Dos (Stand 20.11.2026)

- **Überarbeitung 11/2026 umgesetzt:** neue Seite `metalltechnik.html`, Navigation Home | Metalltechnik | Leistungen | Über uns | Projekte | Kontakt, mobiles Menü neu, 6 Leistungsbereiche, News/Projekte/Einstellungen in `content/*.json` (Pflege siehe README.md).
- **Impressum:** Platzhalter in eckigen Klammern (Adresse Firmensitz, Gewerbe, Behörde, UID) mit echten Daten füllen. Die Privatadresse (Krieglach) NUR im Impressum, nirgends sonst.
- **Kontaktformular:** kein echter Versand-Dienst angebunden; derzeit Fallback über vorbereitete E-Mail (mailto). Empfehlung: Web3Forms/Formspree mit office@neuburger-metall.at, dann `formularEndpunkt` setzen und Datenschutz ergänzen.
- **Google-Bewertungslink** und **WhatsApp-Nummer** fehlen → in `content/einstellungen.json` eintragen; Bereiche bleiben bis dahin ausgeblendet.
- **Projektbilder:** echte Fotos (v. a. Gittermattenzäune, Tore) vom Kunden nachliefern lassen → `content/projekte.json`. Vorher-Nachher erst ab 2027.
- **Hörmann:** Montagepartnerschaft nur textlich erwähnt (laut Kundenangabe), kein Logo.
- **Conmag:** nicht öffentlich nennen, solange keine Freigabe vorliegt.
- **Google Fonts** werden extern geladen → datenschutzfreundlicher wäre Selbsthosting.
- **Datenschutz:** allgemeiner Mustertext, rechtlich prüfen lassen.

## 7. Workflow-Vereinbarung (GitHub & Vercel)

Einmalig pro Projekt:
```bash
git init
git add .
git commit -m "Initial commit – v1.0"
git remote add origin https://github.com/USERNAME/REPO.git
git branch -M main
git push -u origin main
```
Dann auf vercel.com: Repository importieren, Framework Preset **"Other"** (kein Build-Schritt nötig, da reines HTML/CSS/JS).

Danach bei jeder Änderung nur noch:
```bash
git add .
git commit -m "Kurzbeschreibung der Änderung"
git push
```
→ Vercel deployed automatisch.

**Wichtig:** Frühere Probleme (Inhalte "verschwanden" auf Vercel, obwohl lokal alles funktionierte) lagen an falschen relativen Pfaden bzw. Ordnerstruktur-Inkonsistenzen. Bei jeder Änderung Bild-/CSS-/JS-Pfade gegen die tatsächliche Ordnerstruktur prüfen.

---

## 8. Wie der Nutzer zukünftig arbeiten möchte

- Möchte ab jetzt **viele kleine, gezielte Änderungen** vornehmen (z. B. "ändere nur Text X auf Seite Y", "passe Farbe Z an") — dafür ist Claude Code besser geeignet als der Chat, weil direkt in den bestehenden Dateien gearbeitet werden kann statt komplette Neu-Ausgabe.
- Bei neuen, anderen Kundenprojekten (andere Branche): gleiches Strukturprinzip (Punkt 3) anwenden, aber Design/Farben/Typografie komplett neu und passend zur jeweiligen Marke entwickeln — dieses Neuburger-Designsystem ist NICHT als generische Vorlage für andere Kunden gedacht, sondern individuell für diese Marke.
