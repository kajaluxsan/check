# FairMiete.ch

> Alles was du über deine Wohnung wissen musst — gratis, ohne Login, aus Open Data gebaut.

FairMiete.ch ist ein Next.js-Dashboard, das Mieterinnen und Mietern in der
Schweiz hilft, ihre Wohnung einzuschätzen. Aus einer einzigen Adresseingabe
entsteht eine Analyse mit sechs parallelen Karten: Mietpreis-Vergleich,
Umgebung, öffentlicher Verkehr, Lärm, Steuern und rechtliche Schnellinfos.

Die App läuft **vollständig im Browser**. Es gibt kein Backend, keine
Datenbank, keine Registrierung und keine Cookies. Alle Daten kommen aus
öffentlichen Quellen (BFS, OpenStreetMap, geo.admin.ch, transport.opendata.ch,
BWO) und werden live bei jedem Aufruf geladen.

---

## Inhaltsverzeichnis

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Datenquellen & APIs](#datenquellen--apis)
- [Projektstruktur](#projektstruktur)
- [Seiten im Detail](#seiten-im-detail)
- [Die sechs Analyse-Karten](#die-sechs-analyse-karten)
- [Rechner-Tools](#rechner-tools)
- [Design System](#design-system)
- [Lokale Entwicklung](#lokale-entwicklung)
- [Deployment auf Vercel](#deployment-auf-vercel)
- [Roadmap Phase 2](#roadmap-phase-2)
- [Rechtliches](#rechtliches)

---

## Features

### Phase 1 — live

- **Landing Page** mit grosser Adress-Suchleiste, 4-Tools-Erklärung und
  Vergleich gegen kostenpflichtige Immoportale.
- **Adress-Analyse** — sechs Karten parallel für eine beliebige Schweizer
  Adresse:
  1. Mietpreis-Check gegen den BFS-Median des Kantons
  2. Interaktive Umgebungskarte mit POI-Filtern (Leaflet)
  3. ÖV mit Live-Abfahrten und Reisezeit-Rechner
  4. Strassen- und Bahnlärm in Dezibel
  5. Steuerbelastung und Leerstandsquote auf Kantonsebene
  6. Rechtliche Schnellinfos (Anfangsmiete, Kaution, Kündigung, Referenzzins)
- **Rechner-Tools** — zwei interaktive Mini-Tools:
  - Referenzzinssatz-Rechner (Art. 270a OR / VMWG Art. 13)
  - Tragbarkeits-Rechner (1/3-Einkommen-Faustregel)
- **Abdeckung aller 26 Schweizer Kantone** mit Median-Mieten pro Zimmerzahl.

### Phase 2 — geplant

- Nebenkosten-Check (Tool 3)
- Kündigungsfrist-Rechner (Tool 4)
- Vollständiger Mietrecht-Ratgeber
- Französisch / Italienisch
- Gemeindespezifische Steuerdaten
- Sonnenstunden und Strassenausrichtung
- Vergleich mit Nachbargemeinden

---

## Tech Stack

| Bereich | Technologie |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Sprache | TypeScript 5 (strict) |
| Styling | Tailwind CSS 3 |
| Karten | Leaflet + react-leaflet |
| Fonts | DM Sans + DM Serif Display (Google Fonts CDN) |
| Hosting | Vercel (statisch, gratis) |
| Backend | keines |
| Datenbank | keine |
| Auth | keine |

Alle Seiten werden von Next.js **statisch prerendered**. Die dynamischen
Daten kommen zur Laufzeit direkt aus dem Browser über `fetch()` an die
öffentlichen APIs.

---

## Datenquellen & APIs

Alle verwendeten Dienste sind **kostenlos**, **ohne API-Key** nutzbar und
**CORS-freigegeben**, so dass sie direkt vom Browser angesprochen werden
können.

| Quelle | Verwendung | Key nötig |
|---|---|---|
| [BFS Strukturerhebung](https://opendata.swiss) | Median-Mietpreise aller 26 Kantone | ❌ |
| [Nominatim (OpenStreetMap)](https://nominatim.openstreetmap.org) | Adresse → Koordinaten + Kanton | ❌ |
| [Overpass API](https://overpass-api.de) | POIs: Parkplätze, Läden, Schulen, Ärzte, Bahnhöfe | ❌ |
| [transport.opendata.ch](https://transport.opendata.ch) | Haltestellen, Abfahrten, Reiseverbindungen | ❌ |
| [geo.admin.ch / BAFU](https://api3.geo.admin.ch) | Strassenlärm + Bahnlärm in dB | ❌ |
| ESTV / BFS Aggregate | Steuerbelastung, Einwohnerzahl, Leerstandsquote (statisch) | ❌ |
| [BWO](https://www.bwo.admin.ch) | Referenzzinssatz (aktuell 1.75%, manuell updaten) | ❌ |

### Wichtige Hinweise zu den APIs

- **Nominatim** hat eine Fair-Use-Policy (1 Request/Sekunde, User-Agent
  Pflicht). Für Produktion empfiehlt sich ein eigener Nominatim-Server
  oder ein bezahlter Anbieter bei hohem Volumen.
- **Overpass API** kann bei hoher Last rate-limiten. Die Abfrage bündelt
  alle Kategorien in einem Request, um Round-Trips zu minimieren.
- **geo.admin.ch Identify** liefert nicht überall Werte — ländliche
  Gebiete ohne kartierten Lärm zeigen "keine Daten". Dies wird als
  neutraler Zustand behandelt.

---

## Projektstruktur

Modularer Aufbau — jedes Modul hat genau eine Verantwortung und lässt sich
unabhängig testen.

```
check/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root-Layout mit Nav + Footer
│   ├── page.tsx                  # Landing Page
│   ├── globals.css               # Dark theme + Leaflet tweaks
│   ├── analyse/
│   │   ├── page.tsx              # Suspense-Wrapper
│   │   └── AnalyseView.tsx       # Client-Komponente, orchestriert alle Karten
│   ├── rechner/page.tsx          # Tools 1 + 2
│   ├── mietrecht/page.tsx        # Phase 2 Platzhalter
│   └── ueber/page.tsx            # Datenquellen + Impressum
│
├── components/
│   ├── Nav.tsx                   # Sticky Navbar mit 4 Links
│   ├── Footer.tsx                # Footer mit Datenquellen
│   ├── AddressSearch.tsx         # Wiederverwendbare Suchleiste
│   ├── Map.tsx                   # Leaflet dynamic import (SSR: false)
│   ├── ui/
│   │   └── Card.tsx              # Shared Card + Metric + Pill Primitives
│   └── cards/
│       ├── RentCheckCard.tsx     # Karte 1 — Mietpreis-Check
│       ├── MapCard.tsx           # Karte 2 — Umgebungskarte
│       ├── TransportCard.tsx     # Karte 3 — ÖV
│       ├── NoiseCard.tsx         # Karte 4 — Lärm
│       ├── TaxCard.tsx           # Karte 5 — Steuern & Gemeinde
│       └── LegalCard.tsx         # Karte 6 — Rechtliche Schnellinfos
│
├── lib/
│   ├── types.ts                  # Shared Domain-Typen
│   ├── api/                      # API-Clients, je eine Datei pro Service
│   │   ├── nominatim.ts
│   │   ├── overpass.ts           # inkl. haversine-Distanzrechner
│   │   ├── transport.ts
│   │   ├── geoadmin.ts
│   │   └── tax.ts
│   ├── calc/                     # Pure Calculators, keine Side-Effects
│   │   ├── rent.ts               # Median-Check mit Verdict
│   │   ├── reference.ts          # Referenzzinssatz-Senkung (VMWG 13)
│   │   └── affordability.ts      # 1/3-Einkommen-Regel
│   └── data/                     # Statische Daten
│       ├── cantons.ts            # 26 Kantone + Median-Mieten pro Zimmerzahl
│       └── laws.ts               # OR/BWO-Konstanten
│
├── public/                       # Statische Assets (aktuell leer)
├── next.config.js
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
└── package.json
```

---

## Seiten im Detail

### `/` — Landing Page

- Hero mit grosser Adress-Suchleiste (Adresse + Zimmer + Nettomiete)
- Klickt der User "Analysieren →", wird er mit Query-Parametern auf
  `/analyse` weitergeleitet.
- 4-Tools-Erklärung: Mietpreis, Umgebung, Lärm/Steuern, Recht
- Vergleichs-Sektion gegen kostenpflichtige Immoportale (CHF 40/Mt.)
- Final-CTA

### `/analyse?address=…&rooms=…&rent=…`

- Liest die Query-Parameter mit `useSearchParams()`
- Geocodiert die Adresse beim Mount einmal via Nominatim
- Die resultierenden Koordinaten (`lat`/`lon`) und der ISO-Kanton-Code
  werden an alle sechs Karten weitergereicht
- Jede Karte lädt ihre Daten **unabhängig und parallel** — fällt eine
  API aus, zeigt nur die betroffene Karte einen Fehler, der Rest läuft
  weiter
- Responsives Grid: auf Desktop 2 Spalten, mobil 1 Spalte

### `/rechner`

- Tool 1 — **Referenzzinssatz-Rechner**
- Tool 2 — **Tragbarkeits-Rechner**
- Beide Rechner sind vollständig clientseitig, reagieren live auf
  Eingaben (`useMemo`) und zeigen Ergebnis-Pill, Metriken und Fortschritts-
  Balken.

### `/mietrecht`

- Platzhalter für Phase 2 mit Hinweis auf die Schnell-Infos in der
  Adress-Analyse.

### `/ueber`

- Ausführliche Datenquellen-Erklärung
- Liste aller 26 Kantone als Chips
- Klarstellung "Was FairMiete nicht ist"
- Phase 1 vs Phase 2 Roadmap

---

## Die sechs Analyse-Karten

### 1. Mietpreis-Check 💰

- **Quelle**: BFS Strukturerhebung (in `lib/data/cantons.ts`)
- **Logik**: Vergleicht die Nettomiete mit dem Kantons-Median für die
  angegebene Zimmerzahl. Toleranzband ±8%.
- **Verdict**:
  - `great` — mehr als 10% unter Median → **Sehr günstig**
  - `fair`  — innerhalb ±5% → **Fair**
  - `slightly` — 5% bis 15% über → **Etwas teuer**
  - `overpriced` — mehr als 15% über → **Überteuert**
- **Visualisierung**: farbiger Preisbalken mit `du`-Marker und einer
  weissen `fair`-Zone (Low–High).

### 2. Umgebungskarte 🗺️

- **Quelle**: Overpass API (OpenStreetMap)
- **POI-Kategorien**: Parkplätze 🅿️, Supermärkte 🛒, Schulen 🏫,
  Apotheken 💊, Ärzte 🏥, Restaurants 🍽️, Bahnhöfe 🚆
- **Interaktion**: Filter-Buttons für jede Kategorie, Radius-Slider
  200–1000m, Default 500m
- **Karte**: Leaflet mit CartoDB Dark Tiles, dynamisch geladen
  (`ssr: false`), benutzerdefinierte Marker mit Emoji-Icons
- **Distanzen**: werden mit Haversine berechnet und im Popup angezeigt

### 3. Öffentlicher Verkehr 🚆

- **Quelle**: `transport.opendata.ch`
- **Daten**:
  - Nächste Haltestelle + Distanz in Metern + geschätzte Gehzeit
  - Nächste 5 Abfahrten live (Zeit, Kategorie, Ziel)
  - **Reisezeit-Rechner**: User tippt eine Zieladresse ein, die App
    berechnet die tatsächliche ÖV-Fahrzeit von der nächstgelegenen
    Haltestelle

### 4. Lärm & Umwelt 🔊

- **Quelle**: `api3.geo.admin.ch` MapServer Identify
- **Layer**:
  - `ch.bafu.laerm-strassenlaerm_tag` (Strasse)
  - `ch.bafu.laerm-bahnlaerm_tag` (Bahn)
- **Klassifizierung**:
  - < 50 dB → 🟢 Ruhig
  - 50–60 dB → 🟡 Normal
  - 60–70 dB → 🟠 Laut
  - > 70 dB → 🔴 Sehr laut
- **Darstellung**: zwei Rows mit grosser dB-Zahl, Pill und Balken

### 5. Steuern & Gemeinde 🏛️

- **Quelle**: BFS/ESTV Aggregate (statisch in `lib/api/tax.ts`)
- **Metriken**:
  - Durchschnittliche Steuerbelastung in % mit Rang unter allen 26 Kantonen
  - Leerstandsquote (< 1% = angespannter Markt, bewertet als `bad`)
  - Einwohnerzahl
- **Phase 2**: Gemeindespezifische Daten aus ESTV-Tabellen

### 6. Rechtliche Schnellinfos ⚖️

- **Quelle**: Obligationenrecht (OR) + BWO, statisch in `lib/data/laws.ts`
- **Antworten auf die 4 häufigsten Fragen**:
  - **Anfangsmiete** — max. +10% zur Vormiete, Formular verlangen
  - **Maximale Kaution** — 3 Nettomieten (Art. 257e OR), dynamisch
    berechnet aus dem eingegebenen Mietpreis
  - **Kündigungsfrist** — 3 Monate, Standard-Termine
  - **Referenzzinssatz** — aktuell 1.75%, Verweis auf Rechner

---

## Rechner-Tools

### Tool 1 — Referenzzinssatz-Rechner

Basierend auf **VMWG Art. 13**: jede Senkung des hypothekarischen
Referenzzinssatzes um 0,25 Prozentpunkte berechtigt zu einer Mietzins-
reduktion von **2,91%**.

**Input**
- Aktuelle Nettomiete (CHF)
- Referenzzinssatz bei Vertragsabschluss (%)

**Output**
- Neue mögliche Miete
- Ersparnis pro Monat und pro Jahr
- Hinweis mit rechtlicher Begründung (Art. 270a OR)

### Tool 2 — Tragbarkeits-Rechner

Faustregel: monatliche Miete ≤ 1/3 des Nettoeinkommens.

**Input**
- Nettoeinkommen pro Monat
- Aktuelle Miete

**Output**
- Empfohlenes Budget (33% des Einkommens)
- Aktuelle Belastungsquote mit Fortschrittsbalken
- Verdict: Tragbar / Grenzwertig / Zu hoch

---

## Design System

### Farbpalette

| Token | Hex | Verwendung |
|---|---|---|
| `ink-bg` | `#0a0a0a` | Hintergrund |
| `ink-elev` | `#141414` | Karten |
| `ink-elev2` | `#1c1c1c` | Noch tiefere Flächen |
| `ink-border` | `#262626` | Borders / Trennlinien |
| `ink-mute` | `#a3a3a3` | Sekundärtext |
| `ink-dim` | `#737373` | Labels, Metadata |
| `lime-accent` | `#c8f035` | Primärakzent, CTAs, positive Verdicts |
| `lime-dark` | `#a7cc2c` | Hover-Zustand für Akzente |

### Verdict-Farben

- 🟢 **Grün** (`#c8f035`) — Gut / Fair / Günstig
- 🟡 **Gelb** — Grenzwertig
- 🟠 **Orange** — Aufpassen
- 🔴 **Rot** — Problem / Überteuert

### Typografie

- **DM Sans** — alles außer Headlines (via Google Fonts CDN)
- **DM Serif Display** — große Überschriften mit der `.font-serif`-Klasse
- Fließtext nutzt `system-ui` als Fallback

### Layout-Prinzipien

- Mobile-first, sticky Nav mit 4 Links: Analyse / Rechner / Mietrecht / Über uns
- Adress-Analyse nutzt ein 2-Spalten-Grid auf Desktop, 1 Spalte mobil
- Alle Karten haben denselben `Card`-Wrapper mit Loading-Spinner,
  Error-Fallback und optionaler Quellen-Fußzeile
- Animationen minimal: Buttons mit `transition`, Ladespinner aus
  CSS-Animations

---

## Lokale Entwicklung

### Voraussetzungen

- Node.js ≥ 18.17 (empfohlen: 20+)
- npm oder pnpm
- Internet-Zugang für die Live-APIs

### Setup

```bash
git clone https://github.com/kajaluxsan/check.git
cd check
npm install --legacy-peer-deps
npm run dev
```

> Das `--legacy-peer-deps` Flag ist nötig, weil `react-leaflet` (noch)
> React 19 als Peer verlangt, wir aber React 18.3 pinned haben.

Die App läuft auf [http://localhost:3000](http://localhost:3000).

### Verfügbare Scripts

| Befehl | Zweck |
|---|---|
| `npm run dev` | Dev-Server mit Hot Reload |
| `npm run build` | Produktions-Build (statisch prerendered) |
| `npm run start` | Startet den gebauten Build |
| `npm run lint` | ESLint-Check |

### Neue Kantone / Daten updaten

Die Median-Mieten liegen in `lib/data/cantons.ts`. Um sie auf das neueste
BFS-Release zu heben:

1. CSV von opendata.swiss laden (Strukturerhebung → Mietpreise).
2. Werte pro Kanton und Zimmerzahl extrahieren (ggf. mit einem Python-
   Script).
3. Das Array `CANTONS` überschreiben.
4. Build neu laufen lassen.

Der Referenzzinssatz wird in `lib/data/laws.ts` gepflegt (`REFERENCE_RATE`)
und muss bei jeder BWO-Aktualisierung (4×/Jahr) von Hand nachgezogen werden.

---

## Deployment auf Vercel

Das Projekt ist für Vercel vorkonfiguriert — keine `vercel.json` nötig.

1. Repo auf Vercel importieren
2. Framework Preset: **Next.js** (automatisch erkannt)
3. Root directory: `/`
4. Install command: `npm install --legacy-peer-deps`
5. Deploy

Das Build-Output ist komplett statisch, alle Seiten werden als HTML
prerendered. Dynamische Daten kommen zur Laufzeit im Browser.

---

## Roadmap Phase 2

- [ ] **Tool 3 — Nebenkosten-Check** (Zimmer + NK-Pauschale + Heiztyp +
      Baujahr → Normal/Hoch/Sehr hoch)
- [ ] **Tool 4 — Kündigungsfrist-Rechner** (Vertragsdatum + Kanton →
      nächster Termin + Deadline für Brief)
- [ ] **Mietrecht-Ratgeber** — ausführliche Antworten zu:
  - Anfangsmiete anfechten (Schritt für Schritt)
  - Mängel melden — Brief-Vorlage
  - Kaution zurückfordern
  - Kündigung korrekt einreichen
  - Wann ist eine Mietzinserhöhung illegal?
  - Was darf der Vermieter in der Bewerbung fragen?
  - Betreibungsauszug — Bezug und Gültigkeit
- [ ] **Mehrsprachigkeit** — Französisch und Italienisch
- [ ] **Gemeindespezifische Steuerdaten** aus ESTV-Rohdaten
- [ ] **Sonnenstunden + Strassenausrichtung** aus geo.admin.ch
- [ ] **Vergleich mit Nachbargemeinden** (günstiger/teurer)

---

## Rechtliches

FairMiete.ch ist ein nicht-kommerzielles Informations-Tool. Die Seite:

- ist **keine Rechtsberatung**. Für verbindliche Auskünfte wende dich an
  den [Schweizerischen Mieterverband](https://www.mieterverband.ch)
- ist **kein Immobilienportal** — wir vermieten keine Wohnungen
- gibt **keine Garantie**, dass eine Anfechtung erfolgreich ist
- ist **kein Ersatz** für eine Besichtigung vor Ort

Alle verwendeten Daten stammen aus öffentlichen Quellen (CC-BY,
OpenStreetMap ODbL, BFS OGD). Die Quellenangabe ist an jeder Karte
direkt sichtbar.

---

## Lizenz

MIT
