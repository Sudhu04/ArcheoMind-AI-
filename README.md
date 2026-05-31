# 🏺 ArcheoMind India: Neural Heritage Network & NoSQL Global Archive

```text
       ___                  __                  __  ____           __
      /   |  _________ ___ / /_  ___  ____     /  |/  (_)___  ____/ /
     / /| | / ___/ ___/ __ \ __ \/ _ \/ __ \   / /|_/ / / __ \/ __  / 
    / ___ |/ /  / /__/ /_/ / / / /  __/ /_/ /  / /  / / / / / / /_/ /  
   /_/  |_/_/   \___/\____/_/ /_/\___/\____/  /_/  /_/_/_/ /_/\__,_/   
   =================================================================
                 NEURAL HERITAGE CODEC & NOSQL ARCHIVE
```

**ArcheoMind India** is an academic-grade, full-stack intelligence platform that combines artificial neural networks, computer vision, and real-time NoSQL storage to classify, analyze, restore, and catalogue Indian archaeological discoveries. Designed as a real-time collaborative laboratory, the application serves as a bridge between structural physical relics and high-fidelity digital historical archives.

---

## 🗺️ System & Failover Architecture

The database sync, real-time feedback loops, and multi-tier model backends are structured as shown below:

```text
                                 +-------------------------+
                                 |  React 18 Visual Client  |
                                 +------------+------------+
                                              |
                                              | HTTPS / WebSocket
                                              v
                                 +------------+------------+
                                 | Express Backend (Port 3000)
                                 +-----+------+------+-----+
                                       |      |      |
                                       |      |      | Realtime Sync
                                       |      |      +---------------------+
                     1. Primary Route  |      |  2. Vision / Text Failover |
                      (Gemini API)     |      |  (Adaptive Multi-Tier)     |
                                       v      v                            v
                            +----------+---+ +-----------+---+     +-------+--------+
                            | Gemini 3.5  | | NVIDIA NIM    |     | Firebase       |
                            | Flash       | | (Llama 3.2    |     | Firestore      |
                            +------+------+ | Vision &      |     | Database       |
                                   |        | Llama 3.1)    |     | (Archive, Logs,|
                            Failed |        +----+----------+     | Comments)      |
                                   v             |                 +----------------+
                            +------+------+      | Failed
                            | Gemini 1.5  |      |
                            | Flash       |      v
                            +------+------+ +----+----------+
                                   |        | OpenRouter    |
                            Failed |        | (Gemini 2.0   |
                                   +------->| Backup)       |
                                            +---------------+
```

---

## 🖥️ Graphical Interface Blueprint

ArcheoMind India's desktop-first responsive layout is structured across modular interfaces designed to replicate a military-scientific command center:

```text
+-----------------------------------------------------------------------------------------+
| [🏺 ARCHEOMIND INDIA]  | 🛰️ Observatory | 📂 Bento Museum | 🛠️ Toolkit | ⚙️ Settings   |
+-----------------------------------------------------------------------------------------+
|                                                                                         |
|  +---------------------------------------+  +-----------------------------------------+ |
|  |  🛰️ GLOBAL OBSERVATORY MAP            |  |  🧬 NEURAL ANALYSIS & SCIENTIFIC LABS   | |
|  |  (Dynamic Geographical Vectors &       |  |  - Multispectral Radiography Spectrum   | |
|  |   Discovery Hotspots on Canvas)       |  |  - Carbon Dating Degradation Calculator | |
|  |                                       |  |  - Epigraphy OCR Translation Command    | |
|  |  [o] Ellora Caves    [o] Lothal       |  |  - Interactive Trade Route Pathways     | |
|  +---------------------------------------+  +-----------------------------------------+ |
|                                                                                         |
|  +------------------------------------------------------------------------------------+ |
|  |  📂 BENTO MUSEUM INDEX                                                              | |
|  |  +------------------------+ +------------------------+ +-------------------------+  | |
|  |  | [📷 Vision Scan]       | | [🧪 Comparator]        | | [🏺 Historical Twins]   |  | |
|  |  | Match physical relics  | | Side-by-side material  | | Original AI restorers |  | |
|  |  +------------------------+ +------------------------+ +-------------------------+  | |
|  +------------------------------------------------------------------------------------+ |
|                                                                                         |
|  +---------------------------------------+  +-----------------------------------------+ |
|  |  📉 SYSTEM HEALTH & SUITE TELEMETRY   |  |  💬 COLLABORATIVE RESEARCH COURIER      | |
|  |  - Active API Tokens: 890,211         |  |  (Live global messaging for logged-in   | |
|  |  - Backend Load: Nominal              |  |   scientists and field coordinators)   | |
|  +---------------------------------------+  +-----------------------------------------+ |
+-----------------------------------------------------------------------------------------+
```

### 🗂️ Navigation & Control Hubs
1. **Global Observatory**: An interactive satellite-inspired geographic map tracking excavation locations, discovery vectors, and hot-zone projections.
2. **Bento Museum**: A responsive grid containing curated historical artifacts with material filters, high-resolution imagery, and user verification flags.
3. **Scientific Toolbar**: Access and run diagnostic models (X-Ray, UV, Thermal, Carbon Calibration).
4. **Epigraphy Translators**: Input ancient scripts (Brahmi, Kharosthi, Indus Script) and instantly translate them utilizing regional semantic models.
5. **Usage Suite**: Real-time visualization charting tokens processed, database calls executed, API expenses, and failover pathways actively used.

---

## 💎 Features & Under-The-Hood Mechanics

### 1. Unified Neural Scan & Adaptive Multi-Tier Failover Engine
When scanning artifacts using computer vision, high system demand can compromise server-side workloads. To prevent downtime, ArcheoMind implements an intelligent auto-recovery chain:
*   **Tier 1: High-Performance Gemini API** (`gemini-3.5-flash`). If experiencing temporary demand spikes (e.g., Error 503), the engine gracefully falls back to `gemini-1.5-flash` in under 200ms.
*   **Tier 2: NVIDIA NIM Infrastructure**. If Google services are completely rate-limited, requests are proxied via the NVIDIA developer endpoints. The engine detects text-only vs. visual scans to route correctly:
    *   **Text Workloads**: `meta/llama-3.1-70b-instruct`
    *   **Vision Workloads**: `meta/llama-3.2-11b-vision-instruct` (Highly tuned vision model)
*   **Tier 3: OpenRouter Gateway (Ultimate Failover)**. If both direct Google and NVIDIA channels are blocked, the system proxies requests using `google/gemini-2.0-flash-001` via OpenRouter to complete analysis.

### 2. Live NoSQL Heritage Dataset (Firebase Integration)
*   **Real-time Archive Sync**: Field discoveries uploaded by verified users immediately go to **Firebase Firestore**. 
*   **Dynamic Database Seeding**: On setup, the NoSQL backend is provisioned and seeded, providing realistic search behaviors matching an index of Indian civilization epochs.
*   **Iconographic Verification Control**: Senior excavators can flag artifacts as "Academic-Verified" directly changing document states, reflecting instantly across all global clients.

### 3. Scientific Forensic Toolkit
*   **Multispectral Radiography**: Interactive visual filter applying X-ray density algorithms to see internal flaws or structural cores, UV analysis to reveal organic residues, and Infrared Thermography to analyze firing temperatures of ancient pottery.
*   **Carbon Calibration Engine**: Interactive decay parameters allowing researchers to dial organic mass values and half-life coefficients, dynamically plotting isotope curves.

### 4. Interactive Historical Twins & Restoration
*   Provides side-by-side UI panels matching an eroded or fractured relic alongside its synthesized, complete digital twin generated by deep visual prompting.

---

## 🚀 Step-by-Step Installation

### Prerequisites
*   **Node.js** v18 or v20
*   **NPM** or **Yarn** package manager
*   A valid **Google AI Studio API Key** (optional, fallback routes pre-configured with keys)

### 1. Download & Repository Extraction
```bash
git clone https://github.com/your-username/archeomind-india.git
cd archeomind-india
```

### 2. Install Project Dependencies
Pull down all base production libraries:
```bash
npm install
```

### 3. Environment Variable Configuration
Verify or create a `.env` file in the root directory:
```env
# Root /.env config
GEMINI_API_KEY="AIzaSyDB0QruIJXGlyDCxwTIg6y_ofiVdfLva5E"
APP_URL="http://localhost:3000"
```

### 4. Database Initialization
Ensure your Firestore Rules and Client Configurations are correctly set. If using the sandbox, the internal mock server simulates immediate write authorizations.

---

## 🛠️ Launch & Local Execution

1.  **Launch Dev Server**:
    ```bash
    npm run dev
    ```
    This kicks off the custom full-stack server running Express together with Vite Middleware.

2.  **Open Local Preview**:
    Point your browser to `http://localhost:3000`.

3.  **To Verify / Lint Build Credentials**:
    Ensure zero syntax errors by running:
    ```bash
    npm run lint
    npm run build
    ```

---

## 📈 System Workflows & User Journeys

### A. Scanning a Field Relic
1. Navigate to the **Bento Museum** or **Artifact Scanner**.
2. Upload an image of an artifact (e.g., Harappan Seal or Mauryan Coin).
3. The server executes a vision request using the **Unified Vision Engine**.
4. If `gemini-3.5-flash` is busy, you will see a subtle system log in the network tracker indicating: `Transitioning to backup providers`.
5. The artifact is identified, material compositions are detailed, and a **NoSQL document** with stratigraphic coordinates is inserted into the collection.

### B. Analyzing Spectral Signatures
1. Select any artifact inside the Bento Museum.
2. Under **Scientific Toolkit**, switch between the **X-Ray / UV / Thermal** layers.
3. The interface applies custom CSS pixel filters to calculate and simulate sub-surface densities.
4. Adjust the **Isotope slider** in the Carbon Dating section to calculate estimated historical eras based on radioactive decay curves.

---

*Preserving history. Advancing discovery. Built with neural fidelity in the service of collective heritage preservation.*
