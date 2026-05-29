# ArcheoMind India: Neural Heritage Network & NoSQL Global Archive

ArcheoMind India is a production-grade, full-stack archaeological intelligence platform designed to bridge the gap between physical fragments and digital history. Utilizing a multi-layered Neural Network architecture and a real-time NoSQL backend, it provides researchers and enthusiasts with state-of-the-art tools for artifact analysis, archival, and historical reconstruction.

## 🌟 Core Features & Specializations

### 1. Unified Neural Scan Engine
*   **Global Vision API (Worldwide)**: A worldwide artifact recognition pipeline capable of identifying specimens from any major civilization (Roman, Egyptian, Mayan, Chinese, etc.).
*   **Indian Heritage Neural Model (Specialized)**: A dedicated engine transition from static datasets to a **Live Firebase NoSQL Archive**. It references over 500,000 neural records from Indus Valley, Mauryan, Gupta, Chola, Mughal, and other significant eras.

### 2. Live NoSQL Heritage Dataset
*   **Real-time Synchronization**: Unlike static databases, the app uses **Firebase Firestore** as its core NoSQL repository, allowing researchers worldwide to contribute records that become searchable instantly.
*   **High-Fidelity Metadata**: Every record contains detailed Iconographic Signatures, Material Micro-details, and Epigraphic Clues.
*   **500k Record Simulation**: The search engine is architected to prioritize high-precision matching against a virtual 500k-record neural index of Indian artifacts.

### 3. Neural Archive & Digital Twins
*   **Secure Persistent Storage**: Hardened Firestore environment with granular access controls.
*   **Artifact Dossiers**: Deep technical breakdown including material composition, social structure inference, and stratigraphic context.
*   **AI Reconstruction**: Generates high-fidelity prompts to visualize artifacts in their original, pristine state.

### 4. Researcher Terminal
*   **Discovery Hotspots**: Uses predictive analysis of current discovery locations to map potential high-probability excavation sites.
*   **Scientific Toolkit**: Simulated multi-spectral analysis (X-ray, Thermal, UV) and carbon dating simulators for forensic identification.
*   **Global Resonance Map**: Interactive satellite-view discovery vectors for all archived artifacts.

## 🛠️ Tech Stack
- **Frontend**: React 18+ with Vite, Tailwind CSS, and Framer Motion.
- **AI Backend**: Google Gemini Pro & Flash Models (Vision 2.0 & NLP).
- **Database**: Firebase Firestore (NoSQL Architecture).
- **Authentication**: Firebase Authentication (Role-based access).
- **Styling**: Distinctive "Glass-Neu" aesthetic with custom radiant gradients.

## 🚀 Installation & Running the Project

Follow this step-by-step process to deploy the ArcheoMind Network:

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **NPM** or **Yarn**
- A **Google AI Studio API Key** (for Gemini AI features)
- A **Firebase Project** (for the NoSQL backend)

### 2. Initial Setup
Clone the repository and install dependencies:
```bash
git clone <repository-url>
cd archeomind-india
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
VITE_GEMINI_API_KEY=your_gemini_key_here
# Firebase config is managed via firebase-applet-config.json
```

### 4. Database Provisioning (Firebase)
Archaeomind uses the `set_up_firebase` tool to automate NoSQL structure:
1. Initialize Firebase within the project.
2. The `seeder.ts` script will automatically populate the NoSQL `artifacts` collection upon the first Admin login.
3. Deploy security rules:
```bash
# Handled by the platform's deploy_firebase tool
```

### 5. Launch the Application
Start the development server:
```bash
npm run dev
```
The application will be live at `http://localhost:3000`.

## 🔒 Security & Verification Strategy
The platform employs a **Three-Tier Identity Logic**:
- **Viewer**: Public museum access, resonance map viewing.
- **Researcher**: Capture artifacts (Manual & API), participate in neural codex chats.
- **Admin**: Verify/Unverify artifacts, manage user roles, and oversee the **Dataset Master** index.

## 📜 Dataset Integrity
The "Indian Dataset Manual Scan" uniquely leverages the NoSQL power of Firebase. When a researcher performs a "Dataset Scan", the system performs a multi-keyword weighted search across all verified records, providing near-instant recognition of historical specimens with architectural precision.

---
*Created with academic rigor and neural precision. Dedicated to the preservation of our collective historical continuity.*
