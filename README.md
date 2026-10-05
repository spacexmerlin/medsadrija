# MEDSADRIJA. — Website

Statische Website (HTML/CSS/JS, kein Build nötig) für Stand-up Comedy & Poesie von Med Sadrija.

## Lokal ansehen

```
python -m http.server 8317
```
Dann http://localhost:8317 öffnen.

## Struktur

| Pfad | Inhalt |
|---|---|
| `index.html` | Startseite (wechselnde Bildauswahl, Termine-Link) |
| `comedy.html` | Auftrittsvideos, Comedy auf Albanisch, kommende Termine |
| `poesie.html` | 3D-Buch „Echo", Bildauswahl, Instagram |
| `ueber-mich.html` | Bio, Crowdwork Show, Interviews, Pressebilder |
| `impressum.html`, `datenschutz.html` | Rechtliches (noch Platzhalter-Angaben!) |
| `css/style.css` | Gesamtes Design |
| `js/main.js` | Menü, Scroll-Effekte |
| `js/hero-slider.js` | Wechselndes Bild mit Favoriten-Herz (Home, Poesie, Über mich) |
| `js/video-embed.js` | YouTube-Einbettung (lädt erst beim Klick) |
| `js/magnetic-carousel.js`, `js/scroll-story.js` | Pressebilder-Karussell, Seitenleiste |
| `Bilder/web/` | Web-optimierte Bilder (`bild-01…17.jpg`, Flyer) |

## Inhalte pflegen

- **Termine:** in `comedy.html` (Abschnitt „Kommende Auftritte") eine Zeile kopieren und anpassen.
- **Video hinzufügen:** in `comedy.html` / `ueber-mich.html` eine Zeile `<div class="yt-embed" data-id="…">` ergänzen (`data-id` = Teil nach `v=` im YouTube-Link).
- **Bilder:** Originale liegen lokal in `Bilder/originale/` (nicht im Repo); fürs Web auf ca. 1400 px verkleinern und in `Bilder/web/` ablegen.

## Offene Punkte

- Impressum/Datenschutz: echte Angaben eintragen.
- Spotify-Link entfernt; Instagram-Einbettung (neuester Beitrag) noch offen.
