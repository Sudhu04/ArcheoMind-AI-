# ArcheoMind AI - Neural Archaeological Gateway

An advanced artifact analysis and digital excavation platform powered by Gemini AI.

## 🚀 Local Setup Instructions

Follow these steps to run the project on your local machine:

### 1. Prerequisites
- **Node.js**: Ensure you have Node.js (v18 or higher) installed.
- **Gemini API Key**: You'll need a Google Gemini API key. You can get one for free at [aistudio.google.com](https://aistudio.google.com).

### 2. Installation
1. Extract the downloaded ZIP file.
2. Open your terminal in the project directory.
3. Install dependencies:
   ```bash
   npm install
   ```

### 3. Configuration
1. Create a `.env` file in the root directory (or rename `.env.example` to `.env`).
2. Add your Gemini API key to the `.env` file:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```

### 4. Running the App
Start the development server:
```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

## 🛠️ Tech Stack
- **Framework**: React 18+ with Vite
- **AI Engine**: Google Gemini 1.5 Flash
- **Styling**: Tailwind CSS 4.0
- **Animations**: Motion (framer-motion)
- **Icons**: Lucide React
- **Visualization**: Three.js & @react-three/fiber

## 📜 Project Structure
- `src/services/geminiService.ts`: Neural analysis logic.
- `src/services/storageService.ts`: Local data persistence.
- `src/components/ArtifactScanner.tsx`: AI-powered artifact processing.
- `src/components/AdminDashboard.tsx`: Specimen archive management.

## ⚖️ License
This project is for educational and investigative purposes in the field of digital archaeology.
