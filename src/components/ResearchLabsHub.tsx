import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Beaker, Sparkles, Languages, Users, ChevronRight, Zap, 
  HelpCircle, CheckCircle, Flame, Plus, Undo2, ArrowRightCircle,
  TrendingDown, TrendingUp, AlertTriangle, Play, RefreshCw, Cpu,
  Bookmark, Eye, Download, Keyboard, ShieldAlert, Activity, Gauge, Timer
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip, BarChart, Bar, AreaChart, Area } from 'recharts';
import { runMultiAgentDebate, CouncilDebateResult, DebateTurn, runSpectrometryAnalysis, SpectrometryAnalysisResult } from '../services/geminiService';
import RegionalResearchLabs from './RegionalResearchLabs';
import { Artifact, User } from '../types';

interface ResearchLabsHubProps {
  currentUser: User;
  artifacts: Artifact[];
}

// Map characters to authentic-looking ancient Brahmi, Indus, or Kharosthi-like glyph symbols
const GLYPH_MAP: { [key: string]: string } = {
  a: '𑀅', b: '𑀩', c: '𑀘', d: '𑀤', e: '𑀏', f: '𑀨', g: '𑀕', h: '𑀳',
  i: '𑀇', j: '𑀚', k: '𑀓', l: '𑀮', m: '𑀫', n: '𑀦', o: '𑀑', p: '𑀧',
  q: '𑀔', r: '𑀭', s: '𑀲', t: '𑀢', u: '𑀉', v: '𑀯', w: '𑀯', x: '𑀱',
  y: '𑀬', z: '𑀚', ' ': '  ',
  '1': '𑁒', '2': '𑁓', '3': '𑁔', '4': '𑁕', '5': '𑁖', '6': '𑁗', '7': '𑁘', '8': '𑁙', '9': '𑁚', '0': '𑁐'
};

export default function ResearchLabsHub({ currentUser, artifacts }: ResearchLabsHubProps) {
  const [activeSubTab, setActiveSubTab] = useState<'nodes' | 'debate' | 'restoration' | 'epigraphy' | 'spectrometry'>('debate');

  // --- MULTI-AGENT STATE ---
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(artifacts[0] || null);
  const [debateResult, setDebateResult] = useState<CouncilDebateResult | null>(null);
  const [isDebating, setIsDebating] = useState(false);
  const [activeDebateTurn, setActiveDebateTurn] = useState<number>(-1);

  // --- RESTORATION STATE ---
  const [restorationTarget, setRestorationTarget] = useState<Artifact | null>(artifacts[0] || null);
  const [damageMarkers, setDamageMarkers] = useState<{ x: number; y: number }[]>([]);
  const [architecture, setArchitecture] = useState<'diffusion' | 'unet' | 'nerf'>('diffusion');
  const [denoiseSteps, setDenoiseSteps] = useState<number>(15);
  const [inpaintingLevel, setInpaintingLevel] = useState<number>(80);
  const [isRestoring, setIsRestoring] = useState(false);
  const [restorationProgress, setRestorationProgress] = useState<number>(0);
  const [restorationLogs, setRestorationLogs] = useState<string[]>([]);
  const [restoredView, setRestoredView] = useState<boolean>(false);
  const [metricsData, setMetricsData] = useState<{ epoch: number; loss: number; accuracy: number }[]>([]);

  // --- EPIGRAPHY TRANSCODING ---
  const [englishText, setEnglishText] = useState<string>('TEMPLE DECREE 2026');
  const [translatedGlyphs, setTranslatedGlyphs] = useState<string>('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [sealColor, setSealColor] = useState<'terracotta' | 'slate' | 'sandstone'>('terracotta');
  const [verificationResult, setVerificationResult] = useState<{ score: number; verdict: string; period: string } | null>(null);

  // --- SPECTROMETRY STATE ---
  const [spectrometryTarget, setSpectrometryTarget] = useState<Artifact | null>(artifacts[0] || null);
  const [datingMethod, setDatingMethod] = useState<'c14' | 'tl' | 'xrf'>('c14');
  const [chamberPressure, setChamberPressure] = useState<number>(0.85); // bar
  const [laserPower, setLaserPower] = useState<number>(75); // %
  const [isScanningSpectra, setIsScanningSpectra] = useState(false);
  const [spectroProgress, setSpectroProgress] = useState(0);
  const [spectroLogs, setSpectroLogs] = useState<string[]>([]);
  const [spectroResult, setSpectroResult] = useState<SpectrometryAnalysisResult | null>(null);
  const [showSpectroBeam, setShowSpectroBeam] = useState(false);


  const [sourceVoltage, setSourceVoltage] = useState<number>(45); // kV
  const [showGuide, setShowGuide] = useState(true);

  // Sync initial selections if landmarks load later
  useEffect(() => {
    if (artifacts.length > 0) {
      if (!selectedArtifact) setSelectedArtifact(artifacts[0]);
      if (!restorationTarget) setRestorationTarget(artifacts[0]);
      if (!spectrometryTarget) setSpectrometryTarget(artifacts[0]);
    }
  }, [artifacts]);

  // Translate automatically on typing
  useEffect(() => {
    const chars = englishText.toLowerCase().split('');
    const glyphs = chars.map(char => GLYPH_MAP[char] || char).join('');
    setTranslatedGlyphs(glyphs);
  }, [englishText]);

  // Handle Multi-Agent Counsel session
  const conveneAdvisoryCouncil = async () => {
    if (!selectedArtifact) return;
    setIsDebating(true);
    setDebateResult(null);
    setActiveDebateTurn(-1);

    try {
      const response = await runMultiAgentDebate(selectedArtifact);
      setDebateResult(response);
      
      // Step through debate turns mimicking live roundtable
      for (let i = 0; i < response.turns.length; i++) {
        setActiveDebateTurn(i);
        await new Promise(resolve => setTimeout(resolve, 3500));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDebating(false);
    }
  };

  // Simulated Volumetric Reconstruction Neural Sweep
  const runRestorationSweep = () => {
    setIsRestoring(true);
    setRestoredView(false);
    setRestorationProgress(0);
    setRestorationLogs(['Initializing Voxel Neural Interface...', 'Forming Dense Point Cloud Grid...']);
    setMetricsData([]);

    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      const progressPercent = Math.min((step / denoiseSteps) * 100, 100);
      setRestorationProgress(progressPercent);

      // Generate realistic loss/accuracy parameters mimicking real training
      const simulatedLoss = Math.max(0.02, 1.2 * Math.exp(-step / 4) + Math.sin(step) * 0.04 * (1 / step));
      const simulatedAccuracy = Math.min(99.6, 68 + progressPercent * 0.31 + Math.sin(step) * 1);
      
      setMetricsData(prev => [...prev, { epoch: step, loss: Number(simulatedLoss.toFixed(4)), accuracy: Number(simulatedAccuracy.toFixed(2)) }]);

      const logsPool = [
        `Running model inpainting feed-forward pass (Step ${step}/${denoiseSteps})`,
        `Analyzing color spectrograph coordinates...`,
        `Fitted neural loss: ${simulatedLoss.toFixed(4)}`,
        `Restoring structural coordinate density points... [PSNR: ${(20 + step * 0.8).toFixed(1)} dB]`,
        `Analyzing layer compaction margins...`
      ];
      setRestorationLogs(prev => [...prev, logsPool[step % logsPool.length]]);

      if (step >= denoiseSteps) {
        clearInterval(interval);
        setRestorationLogs(prev => [...prev, 'Neural restoration converged successfully.', 'Holographic image reconstruction projection READY.']);
        setIsRestoring(false);
        setRestoredView(true);
      }
    }, 400);
  };

  const handleVerifySeal = () => {
    setIsTranscribing(true);
    setTimeout(() => {
      setIsTranscribing(false);
      const randomScore = Number((0.85 + Math.random() * 0.14).toFixed(4));
      setVerificationResult({
        score: randomScore,
        verdict: randomScore > 0.93 ? "High Epigraphic Authenticity" : "Plausibly Re-carved Metric",
        period: "Simulated Late Brahmi (c. 3rd-4th Century AD)"
      });
    }, 1500);
  };

  const performSpectroScan = async () => {
    if (!spectrometryTarget) return;
    setIsScanningSpectra(true);
    setSpectroProgress(0);
    setSpectroResult(null);
    setShowSpectroBeam(true);
    setSpectroLogs([
      "Securing spectrometer vacuum containment atmosphere...",
      `Configuring laser excitation power to ${laserPower}%...`,
      `Adjusting background ambient pressure to ${chamberPressure} bar...`,
      "Targeting coherent spectrometry beam array at specimen coordinates...",
    ]);

    let prg = 0;
    const interval = setInterval(() => {
      prg += 10;
      setSpectroProgress(prg);

      const logsPool = [
        `Measuring high-energy XRF pulse refraction...`,
        `Analyzing K-line elemental scattering patterns [Excitation Voltage: ${sourceVoltage} kV]...`,
        `Detecting heavy isotope atomic decay cycles...`,
        `Synthesizing quantum carbonized residue counts...`,
        `Calibrating dendrochronology calibration curves...`
      ];
      setSpectroLogs(prev => [...prev, logsPool[(prg / 10) % logsPool.length]]);

      if (prg >= 100) {
        clearInterval(interval);
        setShowSpectroBeam(false);
      }
    }, 300);

    try {
      const response = await runSpectrometryAnalysis(
        spectrometryTarget.name,
        spectrometryTarget.civilization,
        spectrometryTarget.materialAnalysis || spectrometryTarget.type || "Organic Artifact",
        datingMethod === 'c14' ? 'C-14 Isotope Decay' : datingMethod === 'tl' ? 'Thermoluminescence' : 'X-Ray Fluorescence (XRF)'
      );
      // Wait slightly to match progress bar completion animation
      await new Promise(resolve => setTimeout(resolve, 3100));
      setSpectroResult(response);
      setSpectroLogs(prev => [
        ...prev,
        "Isotope decay profiles fully resolved.",
        "Forensic elemental composite locked into repository ledger."
      ]);
    } catch (e) {
      console.error(e);
      setSpectroLogs(prev => [...prev, "Critical: Spectrometer analysis failed. Local cached standards deployed."]);
    } finally {
      setIsScanningSpectra(false);
    }
  };


  return (
    <div className="space-y-12">
      {/* Upper Title Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 border-b border-slate-100 dark:border-slate-800 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
            <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">Forensic Intelligence Sandbox</h4>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
            AI Advanced <span className="text-indigo-600 dark:text-indigo-400">Research Labs</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Run multi-agent advisory councils, volumetric restorations, and ancient epigraphic synthesizers.
          </p>
        </div>

        {/* Tab Switcher Grid */}
        <div className="flex flex-wrap p-1.5 bg-slate-100 dark:bg-slate-900/80 rounded-2xl gap-2 border border-slate-200/40 dark:border-white/5 shadow-inner">
          <TabButton 
            active={activeSubTab === 'debate'} 
            onClick={() => setActiveSubTab('debate')}
            icon={<Users className="w-4 h-4" />}
            label="Advisory Council"
          />
          <TabButton 
            active={activeSubTab === 'restoration'} 
            onClick={() => setActiveSubTab('restoration')}
            icon={<Sparkles className="w-4 h-4" />}
            label="Neural Repair Studio"
          />
          <TabButton 
            active={activeSubTab === 'epigraphy'} 
            onClick={() => setActiveSubTab('epigraphy')}
            icon={<Languages className="w-4 h-4" />}
            label="Epigraphy Sandbox"
          />
          <TabButton 
            active={activeSubTab === 'spectrometry'} 
            onClick={() => setActiveSubTab('spectrometry')}
            icon={<Gauge className="w-4 h-4" />}
            label="Spectrometry Lab"
          />
          <TabButton 
            active={activeSubTab === 'nodes'} 
            onClick={() => setActiveSubTab('nodes')}
            icon={<Beaker className="w-4 h-4" />}
            label="Research Nodes"
          />
        </div>
      </div>

      {/* Dynamic Lab Operational Guide */}
      <div className="glass-card bg-slate-50 border-slate-200/60 rounded-3xl p-6 relative overflow-hidden transition-all shadow-inner">
        <div className="flex items-center justify-between cursor-pointer select-none" onClick={() => setShowGuide(!showGuide)}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
               <HelpCircle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
               <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">LAB OPERATIONAL GUIDE</h4>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Learn how the current sandbox works</p>
            </div>
          </div>
          <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest px-3.5 py-1.5 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 shadow-sm transition-all select-none">
             {showGuide ? "HIDE GUIDE" : "SHOW GUIDE"}
          </span>
        </div>

        <AnimatePresence>
          {showGuide && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mt-4"
            >
              <div className="border-t border-slate-200/60 pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <h5 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1.5">Active Module</h5>
                  <p className="text-xs font-black text-slate-800">
                    {activeSubTab === 'debate' && "Advisory Council Roundtable"}
                    {activeSubTab === 'restoration' && "Neural Repair Studio"}
                    {activeSubTab === 'epigraphy' && "Epigraphy & Seal Sandbox"}
                    {activeSubTab === 'spectrometry' && "Spectrometry Analysis Lab"}
                    {activeSubTab === 'nodes' && "Regional Research Nodes"}
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-1">
                    {activeSubTab === 'debate' && "Select an artifact and launch the Advisory Council. Three simulated archeological advisors (historian, conservator, computational philologist) will conduct a structured debate to infer its provenance and historical structure."}
                    {activeSubTab === 'restoration' && "Load a damaged artifact, set inpainting level & diffusion parameters, and trigger the AI restoration. The deep neural restorer reconstructs geometric voids and maps original textures."}
                    {activeSubTab === 'epigraphy' && "Enter modern scriptures to see them instantly transcoded into ancient Brahmi/Kharosthi glyph characters. Test historical sealing and imprint clay prototypes."}
                    {activeSubTab === 'spectrometry' && "Select a subject artifact, calibrate laser parameters & chamber pressure, and run spectrometry analysis. Resolves carbon-14 levels, Thermoluminescence decay, and maps heavy element distributions."}
                    {activeSubTab === 'nodes' && "Monitor global computational nodes located at prime archeological hubs (Rakhigarhi, Pompeii, Cairo, Keeladi). View real-time active cluster loads and synchronized data transfers."}
                  </p>
                </div>

                <div>
                  <h5 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1.5">Primary Parameters</h5>
                  <ul className="text-[11px] text-slate-500 font-medium leading-relaxed space-y-1 list-disc pl-4">
                    {activeSubTab === 'debate' && (
                      <>
                        <li><strong>Advisors involved</strong>: Historian, Conservator, Philologist.</li>
                        <li><strong>AI Engine</strong>: Cross-Agent Multi-Round Reasoning model.</li>
                        <li><strong>Artifact Input</strong>: Subject artifact details and provenancing data.</li>
                      </>
                    )}
                    {activeSubTab === 'restoration' && (
                      <>
                        <li><strong>Denoise Steps</strong>: Fine-tunes texture diffusion intensity.</li>
                        <li><strong>Inpainting Level</strong>: Percentage area reconstructed near guiding pins.</li>
                        <li><strong>Core Architecture</strong>: Choose U-Net, Diffusion or NeRF models.</li>
                      </>
                    )}
                    {activeSubTab === 'epigraphy' && (
                      <>
                        <li><strong>Glyph Map</strong>: Authentic Unicode Brahmi-Kharosthi font pairings.</li>
                        <li><strong>Seal Material</strong>: Select Terracotta, Slate or Sandstone lookups.</li>
                        <li><strong>Verification Rating</strong>: Scoring of transcript fidelity and historical era.</li>
                      </>
                    )}
                    {activeSubTab === 'spectrometry' && (
                      <>
                        <li><strong>Lasers Calibration</strong>: Adjust Power output & chamber gas density.</li>
                        <li><strong>Analysis Focus</strong>: Toggle C-14, TL decay, or XRF heavy spectra scan.</li>
                        <li><strong>Accuracy Rating</strong>: Displays probability match of materials.</li>
                      </>
                    )}
                    {activeSubTab === 'nodes' && (
                      <>
                        <li><strong>Active Node Clusters</strong>: Physical data servers on site.</li>
                        <li><strong>Network Heartbeat</strong>: Reflected in live cluster bandwidth charts.</li>
                        <li><strong>Dataset Sync Level</strong>: Continuous automatic backup metrics.</li>
                      </>
                    )}
                  </ul>
                </div>

                <div>
                  <h5 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1.5">Operational Output</h5>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                    {activeSubTab === 'debate' && "Generates transcript summaries, timeline breakdowns, and full structural inferences. Helps researchers build structured consensus."}
                    {activeSubTab === 'restoration' && "Displays volumetric preview comparisons, structural losses metrics, and provides geometry asset downloads."}
                    {activeSubTab === 'epigraphy' && "Provides copies of vector scripts, authentic clay render blocks, and metadata for archival preservation cataloging."}
                    {activeSubTab === 'spectrometry' && "Plots complete laser emission spectrographs with key tracer element profiles and prints verified carbon dating certificates."}
                    {activeSubTab === 'nodes' && "Enables syncing telemetry streams with global archives and maintaining server authoritative ledger logs."}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* RENDER SUITE VIEWS */}
      <AnimatePresence mode="wait">
        
        {/* TAB 1: COLLABORATIVE NODES (ORIGNAL LIST) */}
        {activeSubTab === 'nodes' && (
          <motion.div
            key="nodes-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            <RegionalResearchLabs currentUser={currentUser} />
          </motion.div>
        )}

        {/* TAB 2: MULTI-AGENT ADVISORY COUNCIL */}
        {activeSubTab === 'debate' && (
          <motion.div
            key="debate-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10"
          >
            {/* Left: Configuration Panel */}
            <div className="lg:col-span-4 space-y-6">
              <div className="glass-card bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 p-8 rounded-[2.5rem] shadow-xl space-y-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Convene Council</h3>
                  <p className="text-xs text-slate-500">Pick an archive artifact and assemble specialized AI scholars to solve temporal disputes.</p>
                </div>

                {/* Artifact Selection Picker */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Target Specimen</label>
                  <select
                    value={selectedArtifact?.id || ''}
                    onChange={(e) => {
                      const found = artifacts.find(a => a.id === e.target.value);
                      if (found) {
                        setSelectedArtifact(found);
                        setDebateResult(null);
                        setActiveDebateTurn(-1);
                      }
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    {artifacts.map((a) => (
                      <option key={a.id} value={a.id}>{a.name} ({a.civilization})</option>
                    ))}
                  </select>
                </div>

                {/* Artifact Details Summary */}
                {selectedArtifact && (
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-3">
                    <div className="aspect-video w-full rounded-xl overflow-hidden relative">
                      <img 
                        src={selectedArtifact.imageUrl} 
                        alt={selectedArtifact.name} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2 right-2 px-2.5 py-1 bg-indigo-600/90 text-white rounded-lg text-[8px] font-black uppercase tracking-wider">
                        {selectedArtifact.civilization}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white leading-tight">{selectedArtifact.name}</h4>
                      <p className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-snug font-medium mt-1">
                        {selectedArtifact.description.length > 120 
                          ? `${selectedArtifact.description.substring(0, 115)}...` 
                          : selectedArtifact.description}
                      </p>
                    </div>
                  </div>
                )}

                <button
                  onClick={conveneAdvisoryCouncil}
                  disabled={isDebating || !selectedArtifact}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 dark:shadow-none flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isDebating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Council is conferring...
                    </>
                  ) : (
                    <>
                      <Cpu className="w-4 h-4" />
                      Convene Scholars
                    </>
                  )}
                </button>
              </div>

              {/* Council Roster Guide */}
              <div className="p-6 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-3xl space-y-4">
                <h4 className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest">Active Council Seats</h4>
                <div className="grid grid-cols-2 gap-3 text-[10px] font-bold">
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl space-y-0.5 border border-slate-100 dark:border-slate-800/50">
                    <p className="text-amber-600 dark:text-amber-400">Dr. Evelyn Vance</p>
                    <p className="text-slate-400 text-[8.5px] uppercase">Epigraphy</p>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl space-y-0.5 border border-slate-100 dark:border-slate-800/50">
                    <p className="text-sky-600 dark:text-sky-400">Prof. Rajan Mehta</p>
                    <p className="text-slate-400 text-[8.5px] uppercase">Archaeometallurgy</p>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl space-y-0.5 border border-slate-100 dark:border-slate-800/50">
                    <p className="text-emerald-300 dark:text-emerald-400">Dr. Chloe Durand</p>
                    <p className="text-slate-400 text-[8.5px] uppercase">Archaeobotany</p>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl space-y-0.5 border border-slate-100 dark:border-slate-800/50">
                    <p className="text-indigo-600 dark:text-indigo-400">AIDEN AI Matrix</p>
                    <p className="text-slate-400 text-[8.5px] uppercase">Consensus Solver</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Debate Transcript & Status Mapping */}
            <div className="lg:col-span-8 flex flex-col min-h-[500px] border border-slate-200/50 dark:border-white/5 rounded-[2.5rem] bg-indigo-50/20 dark:bg-slate-900/40 p-8 space-y-6 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse" />
                  <span className="font-mono text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">
                    {isDebating ? 'SOLVER ACTIVE' : 'COUNCIL STANDBY'}
                  </span>
                </div>
                {debateResult && (
                  <div className="flex items-center gap-4 bg-white dark:bg-slate-950 border border-indigo-100 dark:border-slate-800 px-4 py-2 rounded-xl text-xs font-black">
                    <span className="text-slate-400 uppercase tracking-widest text-[9px]">Consensus Epoch</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">{debateResult.consensusEpoch}</span>
                    <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
                    <span className="text-emerald-600 dark:text-emerald-400">{debateResult.confidenceScore}% Sync</span>
                  </div>
                )}
              </div>

              {/* Chat-like Conversation Container */}
              <div className="flex-1 space-y-6 overflow-y-auto max-h-[550px] pr-2">
                {!debateResult && !isDebating ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-20">
                    <div className="w-16 h-16 bg-white dark:bg-slate-950 rounded-2xl flex items-center justify-center shadow-lg border border-slate-100 dark:border-slate-800 mb-4">
                      <Cpu className="w-8 h-8 text-slate-300" />
                    </div>
                    <h4 className="text-base font-black text-slate-900 dark:text-white mb-1">Awaiting Council Convene</h4>
                    <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                      Initialize the roundtable scholars to analyze physical composition & context vectors.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {debateResult?.turns.slice(0, activeDebateTurn + 1).map((turn: DebateTurn, idx: number) => {
                      const getColors = () => {
                        switch (turn.agent) {
                          case 'epigraphist': return { bg: 'bg-amber-50 dark:bg-amber-950/20 border-amber-200/50 dark:border-amber-500/10', text: 'text-amber-700 dark:text-amber-400', badge: 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300' };
                          case 'metallurgist': return { bg: 'bg-sky-50 dark:bg-sky-950/20 border-sky-200/50 dark:border-sky-500/10', text: 'text-sky-700 dark:text-sky-400', badge: 'bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-300' };
                          case 'botanist': return { bg: 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200/50 dark:border-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-400', badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300' };
                          default: return { bg: 'bg-indigo-50 dark:bg-indigo-950/20 border-indigo-200/50 dark:border-indigo-500/10', text: 'text-indigo-700 dark:text-indigo-400', badge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300' };
                        }
                      };
                      const colors = getColors();
                      const isLast = idx === activeDebateTurn;

                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                          className={`p-6 rounded-[2rem] border ${colors.bg} space-y-3 relative group transition-all duration-300`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className={`px-3 py-1 text-[8.5px] font-black uppercase tracking-widest rounded-lg ${colors.badge}`}>
                                {turn.roleTitle}
                              </span>
                              <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100">{turn.agentName}</span>
                            </div>
                            {turn.confidenceShift > 0 && (
                              <div className="flex items-center gap-1 text-[9px] font-bold text-amber-500 dark:text-amber-400">
                                <TrendingUp className="w-3.5 h-3.5" />
                                <span>+{turn.confidenceShift}% Solver Focus</span>
                              </div>
                            )}
                          </div>
                          
                          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">
                            {turn.body}
                          </p>

                          {isLast && isDebating && (
                            <div className="absolute right-4 bottom-4 flex items-center gap-1 text-[9px] font-bold text-purple-600 animate-pulse">
                              <Sparkles className="w-3 h-3 animate-spin" />
                              <span>Thinking...</span>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: HOLOGRAPHIC RESTORATION STUDIO */}
        {activeSubTab === 'restoration' && (
          <motion.div
            key="restoration-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10"
          >
            {/* Left Tools Column */}
            <div className="lg:col-span-4 space-y-6">
              <div className="glass-card bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 p-8 rounded-[2.5rem] shadow-xl space-y-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Neural Repair Studio</h3>
                  <p className="text-xs text-slate-500">Employ coordinate inpainting models to auto-estimate surface fractals and inpaint missing geometry.</p>
                </div>

                {/* Relic Picker */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Target Fractured Object</label>
                  <select
                    value={restorationTarget?.id || ''}
                    onChange={(e) => {
                      const found = artifacts.find(a => a.id === e.target.value);
                      if (found) {
                        setRestorationTarget(found);
                        setDamageMarkers([]);
                        setRestoredView(false);
                      }
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    {artifacts.map((a) => (
                      <option key={a.id} value={a.id}>{a.name} ({a.estimatedEra})</option>
                    ))}
                  </select>
                </div>

                {/* Pipeline Selection */}
                <div className="space-y-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Network Architecture</span>
                  <div className="grid grid-cols-3 gap-3">
                    <button 
                      onClick={() => setArchitecture('unet')}
                      className={`h-11 px-2 rounded-xl text-[9px] font-bold uppercase transition-all border flex items-center justify-center text-center leading-tight ${
                        architecture === 'unet' 
                          ? 'bg-purple-600 text-white border-transparent' 
                          : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-800/80'
                      }`}
                    >
                      U-Net Edge
                    </button>
                    <button 
                      onClick={() => setArchitecture('diffusion')}
                      className={`h-11 px-2 rounded-xl text-[9px] font-bold uppercase transition-all border flex items-center justify-center text-center leading-tight ${
                        architecture === 'diffusion' 
                          ? 'bg-purple-600 text-white border-transparent' 
                          : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-800/80'
                      }`}
                    >
                      Diffusion Prior
                    </button>
                    <button 
                      onClick={() => setArchitecture('nerf')}
                      className={`h-11 px-2 rounded-xl text-[9px] font-bold uppercase transition-all border flex items-center justify-center text-center leading-tight ${
                        architecture === 'nerf' 
                          ? 'bg-purple-600 text-white border-transparent' 
                          : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-800/80'
                      }`}
                    >
                      Voxel NeRF
                    </button>
                  </div>
                </div>

                {/* Hyperparam Sliders */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      <span>Denoising Steps</span>
                      <span>{denoiseSteps}</span>
                    </div>
                    <input 
                      type="range" 
                      min="5" 
                      max="40" 
                      value={denoiseSteps}
                      onChange={(e) => setDenoiseSteps(Number(e.target.value))}
                      className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      <span>Inpainting Level</span>
                      <span>{inpaintingLevel}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="100" 
                      value={inpaintingLevel}
                      onChange={(e) => setInpaintingLevel(Number(e.target.value))}
                      className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                  </div>
                </div>

                {/* Execute */}
                <button
                  onClick={runRestorationSweep}
                  disabled={isRestoring || !restorationTarget}
                  className="w-full py-4 bg-purple-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-purple-700 transition-all shadow-xl shadow-purple-100 dark:shadow-none flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isRestoring ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Denoising & Structuring...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Inpaint Geometry
                    </>
                  )}
                </button>
              </div>

              {/* Instructions Callout */}
              <div className="p-5 bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-300 rounded-3xl text-xs space-y-1">
                <p className="font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Volumetric Alignment Guide
                </p>
                <p className="leading-relaxed opacity-80 text-[10.5px]">
                  Click directly on the relic viewport image to anchor spatial keypoints where structural damage is densest.
                </p>
              </div>
            </div>

            {/* Right: Restoration Interactive Screen and Real-time Training Logs */}
            <div className="lg:col-span-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Visual Canvas Panel */}
                <div className="glass-card bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 p-6 rounded-[2.5rem] flex flex-col space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Holographic Specimen Screen</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setDamageMarkers([])}
                        className="p-1 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-[9px] font-black uppercase text-slate-500 cursor-pointer"
                      >
                        Reset Anchors
                      </button>
                    </div>
                  </div>

                  {/* Interactive Target Image Viewport */}
                  {restorationTarget && (
                    <div 
                      onClick={(e) => {
                        if (isRestoring) return;
                        const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                        const x = ((e.clientX - rect.left) / rect.width) * 100;
                        const y = ((e.clientY - rect.top) / rect.height) * 100;
                        setDamageMarkers(prev => [...prev, { x, y }]);
                      }}
                      className="aspect-square w-full bg-slate-950 rounded-[2rem] overflow-hidden relative border border-slate-100 dark:border-slate-800/80 group cursor-crosshair shadow-inner"
                    >
                      {/* Before / After Filter projection */}
                      <img 
                        src={restorationTarget.imageUrl} 
                        alt="Restoration Specimen" 
                        className={`w-full h-full object-cover transition-all duration-1000 ${
                          isRestoring ? 'blur-md opacity-60 scale-95' : restorationProgress === 100 ? 'filter contrast-125 saturate-110 brightness-110' : ''
                        }`}
                        referrerPolicy="no-referrer"
                      />

                      {/* Restaurative Shader Layer */}
                      {restoredView && (
                        <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-indigo-500/20 mix-blend-screen animate-pulse pointer-events-none" />
                      )}

                      {/* Visual Damage Markers overlay */}
                      {damageMarkers.map((marker, i) => (
                        <div 
                          key={i} 
                          style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                          className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none"
                        >
                          <span className="absolute h-5 w-5 rounded-full border border-rose-500 bg-rose-500/10 animate-ping" />
                          <span className="relative h-2 w-2 rounded-full bg-rose-600" />
                        </div>
                      ))}

                      {/* Scanner Beam Bar Animation */}
                      {isRestoring && (
                        <motion.div 
                          className="absolute inset-x-0 h-1 bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.8)] z-10"
                          initial={{ top: '0%' }}
                          animate={{ top: '100%' }}
                          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                        />
                      )}

                      {/* Level Indicator overlay */}
                      {!isRestoring && restorationProgress === 100 && (
                        <div className="absolute top-4 left-4 p-3 bg-purple-600 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Volumetric Sweep Consolidated</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Validation loss chart using Recharts */}
                <div className="glass-card bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 p-6 rounded-[2.5rem] flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest">Real-time Neural Loss Sweep</span>
                    <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-2">Divergence rate converging down per model epoch run.</h4>
                  </div>

                  {metricsData.length > 0 ? (
                    <div className="h-44 w-full mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={metricsData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="epoch" stroke="#94a3b8" fontSize={9} />
                          <YAxis stroke="#94a3b8" fontSize={9} />
                          <Tooltip wrapperStyle={{ fontSize: 10, fontFamily: 'monospace' }} />
                          <Line type="monotone" dataKey="loss" stroke="#8b5cf6" strokeWidth={2.5} activeDot={{ r: 6 }} name="Loss Coefficient" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-44 w-full flex flex-col items-center justify-center text-center text-slate-400 border border-dashed border-slate-100 dark:border-slate-800 rounded-3xl">
                      <TrendingDown className="w-8 h-8 opacity-40 mb-2" />
                      <span className="text-[10.5px] font-medium max-w-xs px-4">Initialize target sweep to plot model loss reduction statistics.</span>
                    </div>
                  )}

                  {/* Diagnostic metrics */}
                  {metricsData.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                      <div>
                        <span className="text-[8.5px] font-black text-slate-400 uppercase">Val Error Rate</span>
                        <p className="text-base font-black text-rose-500 font-mono">{(metricsData[metricsData.length - 1]?.loss || 0).toFixed(4)}</p>
                      </div>
                      <div>
                        <span className="text-[8.5px] font-black text-slate-400 uppercase">Aesthetic Match</span>
                        <p className="text-base font-black text-emerald-500 font-mono">{metricsData[metricsData.length - 1]?.accuracy || 0}%</p>
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* Dynamic Pipeline Logs Output Console */}
              <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 font-mono text-xs text-indigo-200">
                <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Compiler Pipeline Console</span>
                  <div className="flex gap-2">
                    <span className="h-2 w-2 rounded-full bg-indigo-500" />
                    <span className="h-2 w-2 rounded-full bg-purple-500" />
                  </div>
                </div>

                <div className="space-y-1.5 max-h-[140px] overflow-y-auto">
                  {restorationLogs.map((log, i) => (
                    <div key={i} className="flex gap-3 leading-relaxed items-start">
                      <span className="text-slate-600 shrink-0">[{i}]</span>
                      <span className="text-slate-200">{log}</span>
                    </div>
                  ))}
                  {isRestoring && (
                    <div className="flex gap-3 text-purple-400 animate-pulse">
                      <span>[&gt;]</span>
                      <span>Processing fractal spatial parameters...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 4: EPIGRAPHY TRANSCRIPTION SANDBOX */}
        {activeSubTab === 'epigraphy' && (
          <motion.div
            key="epigraphy-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10"
          >
            {/* Left Configuration Panel */}
            <div className="lg:col-span-5 space-y-6">
              <div className="glass-card bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 p-8 rounded-[2.5rem] shadow-xl space-y-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Ancient Script Transcribing</h3>
                  <p className="text-xs text-slate-500">Inputs modern English letters to transcode and carve a virtual clay decree utilizing phonetic Brahmi symbols.</p>
                </div>

                {/* Interactive Inputs */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">English Message Input</label>
                    <input 
                      type="text"
                      maxLength={32}
                      value={englishText}
                      onChange={(e) => setEnglishText(e.target.value.toUpperCase())}
                      placeholder="e.g. EMPIRE CODE 400"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded-2xl p-4 text-xs font-bold focus:outline-none tracking-wider text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  {/* Aesthetic Theme */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Seal Material</label>
                    <div className="grid grid-cols-3 gap-3">
                      <button 
                        onClick={() => setSealColor('terracotta')}
                        className={`h-11 px-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all border flex items-center justify-center text-center leading-tight ${
                          sealColor === 'terracotta' 
                            ? 'bg-amber-600 text-white border-transparent shadow-lg shadow-amber-600/10' 
                            : 'bg-slate-50 dark:bg-slate-950 text-slate-500 border-slate-100 dark:border-slate-800'
                        }`}
                      >
                        Terracotta Clay
                      </button>
                      <button 
                        onClick={() => setSealColor('slate')}
                        className={`h-11 px-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all border flex items-center justify-center text-center leading-tight ${
                          sealColor === 'slate' 
                            ? 'bg-slate-700 text-white border-transparent shadow-lg shadow-slate-700/10' 
                            : 'bg-slate-50 dark:bg-slate-950 text-slate-500 border-slate-100 dark:border-slate-800'
                        }`}
                      >
                        Grey Slate
                      </button>
                      <button 
                        onClick={() => setSealColor('sandstone')}
                        className={`h-11 px-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all border flex items-center justify-center text-center leading-tight ${
                          sealColor === 'sandstone' 
                            ? 'bg-amber-100 text-amber-900 border-transparent shadow-lg shadow-amber-200/10' 
                            : 'bg-slate-50 dark:bg-slate-950 text-slate-500 border-slate-100 dark:border-slate-800'
                        }`}
                      >
                        Sandstone
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleVerifySeal}
                    disabled={isTranscribing || !englishText.trim()}
                    className="flex-1 py-4 bg-teal-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-teal-700 transition-all shadow-xl shadow-teal-100 dark:shadow-none flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isTranscribing ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <TrendingUp className="w-4 h-4" />
                    )}
                    Verify Authenticity
                  </button>
                </div>
              </div>

              {/* Translation metrics */}
              {verificationResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 bg-teal-50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/40 rounded-3xl space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-teal-600 dark:text-teal-400 uppercase tracking-widest">Structural Validator Code</span>
                    <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400">{(verificationResult.score * 100).toFixed(2)}% Match</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">{verificationResult.verdict}</h4>
                    <p className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-normal font-medium mt-1">
                      Epigraphy analyzer matched glyph spacing parameters to ancient {verificationResult.period}.
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right: Immersive Clay Tablet Seal rendering */}
            <div className="lg:col-span-7 flex flex-col justify-between border border-slate-200/50 dark:border-white/5 rounded-[2.5rem] bg-indigo-50/20 dark:bg-slate-900/40 p-10 space-y-8 relative overflow-hidden min-h-[480px]">
              <div className="flex justify-between items-center pointer-events-none">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-1 leading-none">Indological Inscription Ledger</span>
                  <span className="text-slate-900 dark:text-white text-base font-extrabold font-display">Terracotta Imperial Seal</span>
                </div>
                <Bookmark className="w-5 h-5 text-indigo-500" />
              </div>

              {/* Tablet Frame Render Box */}
              <div className="flex-1 flex items-center justify-center">
                <motion.div
                  layoutId="claySeal"
                  className={`w-72 h-72 rounded-[3.5rem] relative flex items-center justify-center p-8 text-center border-4 select-none cursor-pointer transition-all duration-500 ${
                    sealColor === 'terracotta' 
                      ? 'bg-gradient-to-br from-amber-700 via-amber-800 to-amber-950 text-amber-100 border-amber-600/40 shadow-[0_25px_50px_-12px_rgba(217,119,6,0.5)]'
                      : sealColor === 'slate'
                      ? 'bg-gradient-to-br from-slate-600 via-slate-700 to-slate-900 text-slate-100 border-slate-500/40 shadow-[0_25px_50px_-12px_rgba(71,85,105,0.5)]'
                      : 'bg-gradient-to-br from-amber-100 via-amber-200 to-amber-300 text-amber-900 border-amber-300/40 shadow-[0_25px_50px_-12px_rgba(253,230,138,0.5)]'
                  }`}
                  animate={{ rotate: [0, 0.5, -0.5, 0] }}
                  transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                >
                  {/* Decorative engraving ring */}
                  <div className={`absolute inset-4 rounded-[2.5rem] border-2 border-dashed ${
                    sealColor === 'terracotta' ? 'border-amber-500/10' : sealColor === 'slate' ? 'border-slate-400/10' : 'border-amber-900/10'
                  } pointer-events-none`} />

                  {/* Carving texture depth shadow */}
                  <div className="absolute inset-x-8 text-center space-y-6">
                    <div className="space-y-2">
                      <p className={`text-[8px] font-mono tracking-widest uppercase font-bold opacity-60 ${
                        sealColor === 'terracotta' ? 'text-amber-300/80' : sealColor === 'slate' ? 'text-slate-300/80' : 'text-amber-950/80'
                      }`}>
                        -- Imperial Seal Codex --
                      </p>
                      
                      {/* Brahmi Glyphs output text */}
                      <p className={`text-4xl leading-relaxed tracking-wider font-extrabold filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)] ${
                        sealColor === 'terracotta' ? 'text-amber-100' : sealColor === 'slate' ? 'text-slate-100' : 'text-amber-950'
                      }`}>
                        {translatedGlyphs || '...' }
                      </p>
                    </div>

                    <p className={`text-[10px] font-mono font-bold tracking-[0.2em] italic uppercase ${
                      sealColor === 'terracotta' ? 'text-amber-200/50' : sealColor === 'slate' ? 'text-slate-400/55' : 'text-amber-900/55'
                    }`}>
                      {englishText || 'NO MESSAGE STAMPED'}
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Status footer labels */}
              <div className="flex justify-between text-[9px] text-slate-400 dark:text-slate-500 font-bold font-mono">
                <span>SEAL_STAMP_OK</span>
                <span>METALLURGY: HIGH CORRELATION</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 5: SPECTROMETRY & CHRONO-DATING LAB */}
        {activeSubTab === 'spectrometry' && (
          <motion.div
            key="spectrometry-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 cursor-default"
          >
            {/* Left Column: Diagnostics Config Panel */}
            <div className="lg:col-span-4 space-y-6">
              <div className="glass-card bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 p-8 rounded-[2.5rem] shadow-xl space-y-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-indigo-500" /> Spectrograph Scan
                  </h3>
                  <p className="text-xs text-slate-500">Subject artifacts to high-energy beams to measure isotope breakdown and calibration models.</p>
                </div>

                {/* Target Picker */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Target Specimen</label>
                  <select
                    value={spectrometryTarget?.id || ''}
                    onChange={(e) => {
                      const found = artifacts.find(a => a.id === e.target.value);
                      if (found) {
                        setSpectrometryTarget(found);
                        setSpectroResult(null);
                      }
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    {artifacts.map((a) => (
                      <option key={a.id} value={a.id}>{a.name} ({a.civilization})</option>
                    ))}
                  </select>
                </div>

                {/* Method selection */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Assay Mode</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'c14', label: 'C-14 Decay' },
                      { id: 'tl', label: 'Thermo-lum' },
                      { id: 'xrf', label: 'XRF Pulse' }
                    ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => {
                          setDatingMethod(m.id as any);
                          setSpectroResult(null);
                        }}
                        className={`h-11 px-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all border flex items-center justify-center text-center leading-tight ${
                          datingMethod === m.id
                            ? 'bg-indigo-600 text-white border-transparent'
                            : 'bg-slate-50 dark:bg-slate-950 text-slate-500 border-slate-100 dark:border-slate-800'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sliders for Simulation Complexity */}
                <div className="space-y-4 pt-2">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      <span>Excitation Volt</span>
                      <span className="text-slate-700 dark:text-slate-300 font-mono">{sourceVoltage} kV</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={sourceVoltage}
                      onChange={(e) => setSourceVoltage(Number(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      <span>Laser Coherence Power</span>
                      <span className="text-slate-700 dark:text-slate-300 font-mono">{laserPower}%</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      value={laserPower}
                      onChange={(e) => setLaserPower(Number(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      <span>Chamber Pressure</span>
                      <span className="text-slate-700 dark:text-slate-300 font-mono">{chamberPressure.toFixed(2)} bar</span>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="2.5"
                      step="0.05"
                      value={chamberPressure}
                      onChange={(e) => setChamberPressure(Number(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer text-xs"
                    />
                  </div>
                </div>

                {/* Run button */}
                <button
                  onClick={performSpectroScan}
                  disabled={isScanningSpectra}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isScanningSpectra ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Activity className="w-4 h-4" />
                  )}
                  {isScanningSpectra ? 'Bombarding Specimen...' : 'Trigger Resonance Blast'}
                </button>
              </div>

              {/* Progress Bar & Telemetry */}
              {isScanningSpectra && (
                <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-3xl space-y-3">
                  <div className="flex justify-between text-[10px] font-black tracking-widest text-slate-400">
                    <span>Excitation Progress</span>
                    <span>{spectroProgress}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-indigo-600 animate-pulse" 
                      style={{ width: `${spectroProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Dynamic Spectroscopy Output & Visualization */}
            <div className="lg:col-span-8 flex flex-col justify-between border border-slate-200/50 dark:border-white/5 rounded-[2.5rem] bg-indigo-50/20 dark:bg-slate-900/40 p-10 space-y-8 relative overflow-hidden min-h-[500px]">
              {/* Dynamic Laser Beam simulation */}
              {showSpectroBeam && (
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-500 via-pink-500 to-amber-400 animate-pulse shadow-[0_0_20px_4px_rgba(239,68,68,0.8)] z-10" />
              )}

              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-1 leading-none">Diagnostic Analysis Dashboard</span>
                  <span className="text-slate-900 dark:text-white text-base font-extrabold font-display">Holographic Spectrograph Output</span>
                </div>
                {spectrometryTarget && (
                  <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200/40 dark:border-white/5 shadow-sm text-[10px] font-bold text-slate-600 dark:text-slate-300">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    {spectrometryTarget.name}
                  </div>
                )}
              </div>

              {/* Central Area: Chart of Spectrometry Peaks OR Live Scan Logs */}
              <div className="flex-1 min-h-[220px] flex flex-col justify-center">
                {!spectroResult && !isScanningSpectra ? (
                  <div className="flex flex-col items-center justify-center text-center p-8 space-y-4">
                    <div className="p-4 bg-indigo-500/10 dark:bg-indigo-500/10 rounded-full text-indigo-500">
                      <Gauge className="w-10 h-10 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-white">Spectrometer Idle</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1 mx-auto">Select an artifact on the left and trigger a Coherent Resonance Blast to fetch chemical peak profiles.</p>
                    </div>
                  </div>
                ) : isScanningSpectra ? (
                  <div className="p-6 bg-slate-900 text-green-400 font-mono text-[10.5px] rounded-3xl border border-slate-800 space-y-2 max-h-52 overflow-y-auto">
                    {spectroLogs.slice(-4).map((l, idx) => (
                      <div key={idx} className="flex gap-2">
                        <span className="text-indigo-400 font-bold">&gt;&gt;</span>
                        <span>{l}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  spectroResult && (
                    <div className="space-y-6">
                      <div className="h-[220px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={spectroResult.elements}>
                            <defs>
                              <linearGradient id="colorPeak" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:hidden" />
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" className="hidden dark:block" />
                            <XAxis dataKey="element" stroke="#94a3b8" fontSize={9} fontWeight="bold" />
                            <YAxis stroke="#94a3b8" fontSize={9} fontWeight="bold" />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: '#0f172a', 
                                border: 'none', 
                                borderRadius: '16px', 
                                color: '#fff', 
                                fontSize: '11px', 
                                fontWeight: 'bold' 
                              }} 
                            />
                            <Area type="monotone" dataKey="percentage" stroke="#6366f1" fillOpacity={1} fill="url(#colorPeak)" name="Composition %" strokeWidth={3} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Diagnostic metrics grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-white/5 rounded-2xl">
                          <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest block mb-1">Estimated Era</span>
                          <span className="text-xs font-black text-slate-800 dark:text-indigo-300 font-mono">c. {spectroResult.ageEstimated} Years Old</span>
                        </div>
                        <div className="p-4 bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-white/5 rounded-2xl">
                          <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest block mb-1">Standard Error</span>
                          <span className="text-xs font-black text-slate-800 dark:text-red-400 font-mono">± {spectroResult.errorMargin} Years</span>
                        </div>
                        <div className="p-4 bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-white/5 rounded-2xl">
                          <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest block mb-1">Calibrated Half-Life</span>
                          <span className="text-xs font-black text-slate-800 dark:text-green-400 font-mono">{spectroResult.halfLifeRemaining}% Remaining</span>
                        </div>
                        <div className="p-4 bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-white/5 rounded-2xl">
                          <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest block mb-1">Assay Technique</span>
                          <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 font-mono uppercase">{datingMethod.toUpperCase()}</span>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Detailed molecular narrative summary explanation */}
              {spectroResult && (
                <div className="p-6 bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/10 dark:border-indigo-500/20 rounded-3xl space-y-2">
                  <div className="flex items-center gap-2">
                    <Timer className="w-4 h-4 text-indigo-500" />
                    <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">Holographic Decay Reconstruction</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-[10.5px] leading-relaxed font-medium">
                    {spectroResult.bondingNarrative}
                  </p>
                </div>
              )}

              {/* Footer labels */}
              <div className="flex justify-between text-[9px] text-slate-400 dark:text-slate-500 font-bold font-mono border-t border-slate-200/40 dark:border-white/5 pt-4">
                <span>SPECTRA_COHERENT_SCAN: OK</span>
                <span>VACUUM_ATMOSPHERE_LEVEL: {chamberPressure} BAR</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Sub-Component TabButton
function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 cursor-pointer transition-all px-4 py-2.5 rounded-xl text-xs font-extrabold tracking-wide uppercase ${
        active 
          ? 'bg-white dark:bg-slate-950 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/40 dark:border-white/5' 
          : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
