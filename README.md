# 🏺 ArcheoMind India: Neural Heritage Network & NoSQL Global Archive

```text
       ___                  __                  __  ____           __
      /   |  _________ ___ / /_  ___  ____     /  |/  (_)___  ____/ /
     / /| | / ___/ ___/ __ \ __ \/ _ \/ __ \   / /|_/ / / __ \/ __  / 
    / ___ |/ /  / /__/ /_/ / / / /  __/ /_/ /  / /  / / / / / / /_/ /  
   /_/  |_/_/   \___/\____/_/ /_/\___/\____/  /_/  /_/_/_/ /_/\__,_/   
   =================================================================
             ACADEMIC-GRADE NEURAL HERITAGE CODEC & ARCHIVE
```

**ArcheoMind India** is a premier, responsive, full-stack intelligence workspace engineered to classify, analyze, conserve, and catalogue historical artifacts across the Indian subcontinent. Combining advanced **computer vision (Gemini & NVIDIA NIM Llama)**, robust **NoSQL storage configurations (Firebase Firestore)**, and custom **forensic shader tools**, the workspace bridges tactile brick-and-mortar preservation with high-fidelity digital historical archives.

---

## 🗺️ Master Full-Stack Architecture

The application is structured around a decoupled multi-tier topology consisting of:
1.  **React 18 Visual Interface & Forensic Suite (Vite Client)**: Driven by real-time SVG maps, canvas-render graphics, and microstate managers.
2.  **Node.js / Express Proxy Edge Core (Port 3000)**: Coordinates network failovers, handles heavy image arrays, and exposes administrative telemetry APIs.
3.  **Real-Time Data Layer**: Synchronized globally across client sessions via real-time subscription queries to **Firebase Firestore**.

```text
  +--------------------------------------------------------------------------------+
  |                             React 18 Visual Client                             |
  +---------------------------------------+----------------------------------------+
                                          |
                                          | HTTP POST (Base64 Relic Payload) / WebSocket
                                          v
  +--------------------------------------------------------------------------------+
  |                          Express Backend (Port 3000)                           |
  +-----+---------------------------------+----------------------------------+-----+
        |                                 |                                  |
        | 1. Primary Route                | 2. Server Failover Channels      | 3. Database Sync
        |    (Gemini API API Session)     |    (Multi-Provider Routing)      |    (NoSQL Firestore)
        v                                 v                                  v
  +-----+--------------+          +-------+--------------+          +--------+-------+
  |  gemini-3.5-flash  |          | NVIDIA NIM Router    |          | Firebase       |
  +-----+--------------+          | - Text: Llama-3.1-70b|          | Firestore      |
        |                         | - Vision: Llama-3.2   |          | Collections    |
        | (Overloaded 503)        +-------+--------------+          | - `artifacts`  |
        v                                 |                         | - `users`      |
  +-----+--------------+                  | (Timeout / Blocked)     | - `chat`       |
  |gemini-3.1-flash-lite                  |                         | - `logs`       |
  +--------------------+          +-------+--------------+          +----------------+
                                  | OpenRouter Gateway   |
                                  | - gemini-2.0-flash   |
                                  +----------------------+
```

---

## 📂 System Directory Layout

```text
/
├── server.ts                       # Multi-Tier API Gateway, Express Server & Vite Server Middleware
├── package.json                    # Package orchestration and run vectors
├── metadata.json                   # Applet permissions and visual credentials
├── src/
│   ├── main.tsx                    # Client entry point
│   ├── App.tsx                     # Primary router and workspace framework
│   ├── index.css                   # Tailwinds initialization & styling parameters
│   ├── lib/
│   │   ├── firebase.ts             # Firebase Firestore initialization configuration
│   │   └── seeder.ts               # Database migration & automatic dataset seeding script
│   ├── services/
│   │   ├── authService.ts          # Core authorization workflows (Academic Ranks & XP Level Tracking)
│   │   ├── geminiService.ts        # Client model integrations, fallbacks & options configuration
│   │   └── storageService.ts       # Firestore document transaction, image proxying & cataloging services
│   └── components/                 # Modularity-first component system (detailed below)
```

---

## 🧩 Module-Wise Technical Breakdown

Every component within ArcheoMind has been engineered around strict separation of concerns to avoid token boundary truncation, performance bottlenecks, or runtime state collisions.

### 🛰️ Core Observatory Modules
*   **`GlobalObservatory.tsx`**
    *   **Description**: An immersive geographic map rendering ancient archaeological sites, discovery clusters, and shifting cultural maps.
    *   **How it works**: Leverages fluid coordinate projections on HTML5 Canvas and SVG overlay layers. It translates geographic latitudes and longitudes into relative interface space. Clicking a marker sends a dynamic filter query down into the Bento Museum to isolate localized relics instantly.
*   **`TradeRouteExplorer.tsx`**
    *   **Description**: Visual interface designed to trace and model ancient exchange paths (e.g., the Dakshinapatha, Maurya Trade Network, Kushan Silk Highway).
    *   **How it works**: Models intersections, trade lanes, and nodes mathematically. Coordinates mapped artifact provenance indices to reconstruct the historic flow of coinage, pottery techniques, and lapidary materials between ancient urban centers.

### 🧪 Neural Forensic & Reconstruction Modules
*   **`ArtifactScanner.tsx`**
    *   **Description**: High-fidelity drag-and-drop neural scanning platform designed to classify and catalog unindexed field discoveries.
    *   **How it works**: Compresses uploaded image attachments, generates an base64-encoded array, and forwards the scan to `/api/scan/indian-heritage`. Displays real-time model computation states, network diagnostics, and stratigraphical depth predictors.
*   **`ScientificToolkit.tsx` & `ResonanceAnalyzer.tsx`**
    *   **Description**: Forensic analysis suite designed to inspect subsurface structural characteristics.
    *   **How it works**: Implements custom CSS blend modes, pixelated SVG matrices, and hardware-accelerated filters to simulate:
        1.  **X-Ray Radiography**: Highlights internal core cracks or underlying joints.
        2.  **UV Fluorescence**: Highlights residual organic contaminants or surface varnishes.
        3.  **Infrared Thermography**: Determines historic firing temperatures based on color spectrum density metrics.
*   **`ArchaeologicalTimeline.tsx` & `CarbonCalibrator.tsx` (Inside Toolkits)**
    *   **Description**: Calibration system designed to estimate epoch origins by carbon isotope decay rates.
    *   **How it works**: Implements the carbon-14 decay formula:
        $$\text{Activity} = N_0 \cdot e^{-\lambda t}$$
        Dragging the chronological mass slider recalculates expected isotopic yields, updating real-time SVG charting paths dynamically.

### 📝 Epigraphy & Translation Modules
*   **`EpigraphyTranslator.tsx`**
    *   **Description**: Automated transcription system designed to parse ancient Indus, Brahmic, and Kharosthi glyphs.
    *   **How it works**: Captures custom canvas drawn glyph paths or raw image uploads, matching them against local symbol databases and submitting translated text models to the translation endpoints. It outputs confidence levels, geographic origins, and modern English translations side-by-side.

### 📦 Bento Museum & Archive Index Modules
*   **`BentoMuseum.tsx` & `ArtifactCard.tsx`**
    *   **Description**: Flexible, bento-styled archive interface presenting the collection of historical assets.
    *   **How it works**: Operates a state-managed filter controller. Sorts artifacts by estimated epoch, civilization origin, material category, and validation grade.
*   **`ComparativeAnalyzer.tsx` & `NeuralRestoration.tsx`**
    *   **Description**: Deep twin comparative visualizer. Matches weathered artifact relics alongside their restored virtual representations.
    *   **How it works**: Couples high-contrast split view comparison sliders, rendering comparative analytics charts and tracking materials, volumes, and weight deltas.

### 👥 Live Collaboration Modules
*   **`GlobalChat.tsx` & `NotificationSystem.tsx`**
    *   **Description**: High-frequency, synchronized chat box serving researchers in field environments.
    *   **How it works**: Listens directly to the `chat` collection in Firestore via real-time subscription snapshots, rendering messaging feeds, dispatching audio cues during new discovery events, and coordinating active coordinate relays.

---

## 🗄️ Database Design (NoSQL Schema)

The Firebase Firestore NoSQL collections are designed with strict data validation fields, keeping document complexity predictable and enabling optimal indexing.

```text
  [Firebase Firestore Database Root]
    |
    +--- (Collection) `artifacts` -------> [id] -> { name, type, geographicalCoord, level, verifiedStatus, base64Image... }
    |
    +--- (Collection) `users` ----------> [id] -> { email, role, realName, institutionalAffiliation, xpProgress... }
    |
    +--- (Collection) `chat` ----------> [id] -> { messageText, timestamp, senderName, senderUid... }
    |
    +--- (Collection) `logs` -----------> [id] -> { eventName, detailBlock, creationEpoch, initiatorUid... }
```

### Collection Model Schema Details

#### 1. `artifacts` Collection Document
```json
{
  "_id": "art_90xK12bYlS",
  "userId": "usr_7s8df91yHj",
  "userName": "Dr. Aarav Sharma",
  "name": "Steatite Mugdh Unicorn Seal",
  "type": "Steatite",
  "rarityLevel": 5,
  "description": "An exquisite square steatite seal depicting a standing unicorn profile before a ceremonial brazier.",
  "estimatedEra": "Late Harappan Phase, c. 1900 BCE",
  "civilization": "Indus Valley Civilization",
  "location": {
    "lat": 26.9856,
    "lng": 68.1368,
    "name": "Mohenjo-daro Excavation Block G"
  },
  "imageUrl": "data:image/jpeg;base64,/9j/4AAQSkZ...",
  "isVerified": true,
  "confidenceScore": 98.4,
  "stratigraphy": {
    "depth": 2.45,
    "layer": "Stratum III",
    "description": "Found buried under dense mud-brick collapse layers."
  },
  "neuralAnnotations": {
    "ocrTranscription": "𑀅𑀓𑀲𑀫 (Proto-Indus Pictographs)",
    "provenancePrediction": "Unified Urban Mohenjan Craft Complex"
  },
  "history": [
    {
      "action": "Catalogued in database",
      "timestamp": 1780189201000,
      "updatedBy": "Dr. Aarav Sharma"
    }
  ]
}
```

#### 2. `users` Collection Document
```json
{
  "_id": "usr_7s8df91yHj",
  "email": "aarav.sharma@asi.gov.in",
  "role": "admin",
  "name": "Dr. Aarav Sharma",
  "isVerified": true,
  "xp": 4820,
  "level": 14,
  "affiliation": "Archaeological Survey of India"
}
```

#### 3. `chat` Collection Document
```json
{
  "_id": "msg_00xPq9812",
  "userId": "usr_7s8df91yHj",
  "userName": "Dr. Aarav Sharma",
  "text": "Stratum III in Sector G has yielded a unique inscription. Dispatched to OCR parsing panel.",
  "timestamp": 1780189531000
}
```

---

## 💎 Adaptive Multi-Tier Resilience Core

To maintain seamless performance during server processing overloads (such as a Google Cloud `503 Service Unavailable` or `429 Rate Limit Exceeded` error), the `/api/scan/indian-heritage` routing engine initiates an autogenous failover scan cascade:

### High-Fidelity Routing Flow

*   **⚡ Primary Target**: **`gemini-3.5-flash`**. High speed, highly advanced multimodal classification engine.
*   **🔄 Failover Tier 1**: **`gemini-3.1-flash-lite`**. Sub-200ms failover triggered if a `503` status is caught from the primary pipeline.
*   **🛠️ Failover Tier 2**: **NVIDIA NIM Core Developer Endpoints**. Proxied automatically if direct API gateways fail. Contains input categorization logic:
    *   *Visual Relic Inputs*: Routed to **`meta/llama-3.2-11b-vision-instruct`** for high-accuracy graphic matrix decomposition.
    *   *Textual/Inscriptive Inputs*: Routed to **`meta/llama-3.1-70b-instruct`** for logical processing of linguistic files.
*   **🛡️ Failover Tier 3 (Ultimate Boundary)**: **OpenRouter Proxy Gateway**. Direct fallback routing to **`google/gemini-2.0-flash-001`**, restoring full spatial tracking and OCR outputs.

---

## 🚀 Setup & Local Installation

### Prerequisites
*   Verify your local environment has **Node.js v18** or **v20** installed:
    ```bash
    node -v
    ```
*   Have **NPM** (Node Package Manager) or **Yarn** verified.

### 1. Repository Acquisition
```bash
git clone https://github.com/your-username/archeomind-india.git
cd archeomind-india
```

### 2. Dependency Ingestion
Install the required packages:
```bash
npm install
```

### 3. Verification of Base Configuration
Create or inspect the `.env` configuration file in your project's root folder:
```env
# Root /.env configuration specs
GEMINI_API_KEY="AIzaSyDB0QruIJXGlyDCxwTIg6y_ofiVdfLva5E"
APP_URL="http://localhost:3000"
```

---

## 🛠️ Workspace Deployment

1.  **Launch Full-Stack Dev Server**:
    ```bash
    npm run dev
    ```
    This launches our Node.js/Vite Express routing server binding on port `3000`.

2.  **Access Visual Workspace**:
    Launch `http://localhost:3000` inside your browser of choice.

3.  **Validate / Build Pipeline**:
    Validate structure, type interfaces, and bundle code before staging:
    ```bash
    npm run lint
    npm run build
    ```

---

## 📖 Feature Walkthrough & User Journeys

### User Scenario 1: Field Scan & NoSQL Record Creation
1.  **Launch**: Field Researcher joins the workspace and selects **Artifact Scanner**.
2.  **Upload**: Drags and drops a high-res JPG of a Mauryan Terracotta Figurine.
3.  **Process**: Express forwards the image to the route: `/api/scan/indian-heritage`.
4.  **Encounter Recovery**: If Google APIs are busy, the server console reports `Transitioning to backup providers` and processes the file via **NVIDIA Llama-3.2 Vision**.
5.  **Commit**: The output structure is received and stored in Firestore under `/artifacts`.

### User Scenario 2: Spectral Analysis & Physical Integrity Review
1.  **Select**: Click on any cataloged Figurine inside the **Bento Museum Grid**.
2.  **Forensics**: Navigate to **Scientific Toolkit**. Toggle active filters to **X-Ray**.
3.  **Result**: Custom UI shaders reveal simulated structural core stress cracks. Increasing the **Carbon slider** graphs decay curves to help researchers narrow down historic dates.

---

*Advancing the boundaries of modern forensic archaeology. Built with deep neural fidelity and cloud-native resilience.*
