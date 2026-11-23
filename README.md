# Neuburger Metalltechnik – Website

Statische Website (HTML/CSS/JS, kein Build-Schritt), gehostet auf Vercel. Jeder Push auf `main` wird automatisch veröffentlicht.

## Struktur

```
index.html            Startseite
metalltechnik.html    Was ist Metalltechnik? (Beispiele, Anfrage)
leistungen.html       Sechs Leistungsbereiche + Ablauf
ueber-uns.html        Familienbetrieb, Team
projekte.html         Projektgalerie (aus content/projekte.json)
kontakt.html          Kontakt, Standort Kindberg, Formular, FAQ
impressum.html / datenschutz.html
css/style.css         Eine Stylesheet-Datei (Abschnitt 16 = Überarbeitung 11/2026)
js/script.js          Eine Script-Datei
content/              Pflegbare Inhalte (siehe unten)
images/               Bilder und Logo
```

## Inhalte ohne HTML ändern (`content/`)

Die Dateien lassen sich direkt auf GitHub bearbeiten (Datei öffnen → Stift-Symbol → ändern → „Commit changes“). Vercel veröffentlicht die Änderung nach etwa einer Minute.
Wichtig: Anführungszeichen und Kommas wie im Beispiel beibehalten.

### News – `content/news.json`

| Feld | Bedeutung |
| --- | --- |
| `aktiv` | `true` = sichtbar, `false` = ausgeblendet |
| `datum` | Veröffentlichungsdatum `JJJJ-MM-TT`; Meldungen mit Datum in der Zukunft erscheinen erst ab diesem Tag |
| `anzeigenBis` | optional, z. B. Ende des Betriebsurlaubs; danach automatisch ausgeblendet. Leer = unbegrenzt |
| `kategorie` | kurzer Hinweis über dem Titel, z. B. „Wir erweitern uns!“ |
| `titel`, `text` | Überschrift und Text |
| `bild`, `bildText` | optional, z. B. `images/schauraum.jpg` und eine kurze Bildbeschreibung |
| `linkText`, `linkZiel` | optionaler Link, z. B. `kontakt.html` |

Es werden höchstens drei aktuelle Meldungen gezeigt (neueste zuerst). Ist keine aktiv, verschwindet der Bereich.

### Projekte – `content/projekte.json`

Felder: `titel`, `kategorie`, `beschreibung`, `ort` (optional), `bilder` (Liste von Bildpfaden, das erste ist das Titelbild), `vorherBild` / `nachherBild` (optional; nur wenn beide gesetzt sind, wird ein Vorher-Nachher-Vergleich gezeigt), `aufStartseite` (`true` = auch auf der Startseite, max. 3), `aktiv`.
Bilder vorher verkleinern (ca. 1600 px Breite, unter 300 KB) und in `images/` hochladen.
Nur eigene, ausgeführte Arbeiten eintragen.

### Einstellungen – `content/einstellungen.json`

| Feld | Wirkung |
| --- | --- |
| `googleBewertungLink` | Echten Google-Bewertungslink eintragen (beginnt mit `https://`). Erst dann erscheint der Bereich „Deine Erfahrung zählt.“ |
| `whatsappNummer` | z. B. `+43 677 …`. Erst dann erscheinen die WhatsApp-Buttons |
| `formularEndpunkt` | Adresse eines Formular-Dienstes (siehe unten). Leer = Formular öffnet das E-Mail-Programm |
| `schauraum.status` | Text zum Schauraum Kindberg (Kontaktseite und Footer). Nach der Eröffnung z. B.: „Beratung und Besichtigung nach Terminvereinbarung.“ |

## Logo tauschen

Das Logo wird überall aus `images/logo-neuburger-metalltechnik.png` geladen (freigestellt, für dunklen Hintergrund). Original: `../Logo/Logo_Neuburger_Metalltechnik_2026.jpg`.
Favicon: `favicon.ico`, `images/favicon-192.png`, `images/apple-touch-icon.png` (N-Symbol). Vorschaubild für Social Media/WhatsApp: `images/og-neuburger-metalltechnik.jpg` (wird über die Domain www.neuburger-metall.at geladen, funktioniert also erst nach der Domain-Umstellung).

## Kontaktformular

Ohne eingetragenen Formular-Dienst wird die Anfrage beim Absenden als vorbereitete E-Mail an office@neuburger-metall.at im E-Mail-Programm des Besuchers geöffnet; Nachrichten gehen dadurch nicht verloren.
Aktuell angebunden: Web3Forms (Adresse und `access_key` stehen direkt im Formular in `kontakt.html`, das hat Vorrang vor `formularEndpunkt`). Allgemein: Für den direkten Versand ohne E-Mail-Programm kann ein kostenloser Formular-Dienst angebunden werden, z. B. Web3Forms oder Formspree (Registrierung mit office@neuburger-metall.at). Die vom Dienst gelieferte Adresse kommt in `formularEndpunkt`; bei Web3Forms zusätzlich ein verstecktes Feld `access_key` im Formular ergänzen. Danach Datenschutzerklärung um den Dienst ergänzen.

## Ausblick: Eingabemaske für News und Projekte

Für eine Pflege per Eingabemaske statt JSON-Datei eignet sich Decap CMS (kostenlos, speichert direkt in GitHub, liest genau diese `content/`-Dateien). Dafür nötig: eine GitHub-OAuth-App und eine kleine Login-Funktion auf Vercel (Umgebungsvariablen). Ohne diesen Login darf keine Admin-Seite veröffentlicht werden.

## Lokal testen

VS Code „Live Server“ oder `python -m http.server 5799` im Projektordner. Direktes Öffnen der HTML-Datei (file://) lädt die `content/`-Dateien nicht.
