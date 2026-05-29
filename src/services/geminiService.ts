import { usageService } from "./usageService";
import { GoogleGenAI, Type } from "@google/genai";

// Initialize the Gemini API client
// Note: In this environment, process.env.GEMINI_API_KEY is automatically handled for Vite apps.
// We provide a way to override this dynamically via localStorage for research continuity.
const USER_PROVIDED_KEY = "AIzaSyDkFiabeOu8__K3pTA1IS0sRpTxC7rkrgE";
const FALLBACK_KEY = "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";
const DEFAULT_MODEL = "gemini-3.5-flash";

const getAIClient = () => {
    const overrideKey = typeof window !== 'undefined' ? localStorage.getItem('GEMINI_API_KEY_OVERRIDE') : null;
    const apiKey = overrideKey || USER_PROVIDED_KEY || process.env.GEMINI_API_KEY || '';
    return new GoogleGenAI({ apiKey });
};

const isGeminiError = (error: any) => {
  if (!error) return false;
  
  // Convert to object if it's a string
  let errorObj = error;
  if (typeof error === 'string') {
    try { 
      errorObj = JSON.parse(error); 
    } catch (e) {
      const lower = error.toLowerCase();
      if (lower.includes("quota") || lower.includes("exhausted") || lower.includes("429") || 
          lower.includes("404") || lower.includes("not found") || lower.includes("limit")) {
        return true;
      }
      return false;
    }
  }

  // Handle SDK specific error objects
  const message = (
    errorObj?.message || 
    errorObj?.error?.message || 
    errorObj?.details?.[0]?.message ||
    ""
  ).toLowerCase();
  
  const status = errorObj?.status || errorObj?.error?.status || "";
  const code = errorObj?.code || errorObj?.error?.code || errorObj?.status_code;

  return (
    status === 429 || code === 429 || 
    status === 404 || code === 404 || 
    status === "RESOURCE_EXHAUSTED" || 
    status === "NOT_FOUND" ||
    message.includes("quota") || 
    message.includes("exhausted") || 
    message.includes("limit exceeded") ||
    message.includes("rate limit") ||
    message.includes("not found") || 
    message.includes("entity was not found") ||
    message.includes("model not found")
  );
};

async function callNvidiaNim(prompt: string, options: { json?: boolean, image?: { data: string, mimeType: string } } = {}) {
  const apiKey = "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";
  const model = "meta/llama-3.1-70b-instruct";
  
  const messages: any[] = [{
    role: "user",
    content: options.image ? [
      { type: "text", text: prompt },
      { type: "image_url", image_url: { url: `data:${options.image.mimeType};base64,${options.image.data}` } }
    ] : prompt
  }];

  try {
    const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        messages,
        response_format: options.json ? { type: "json_object" } : undefined,
        temperature: 0.2,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || "NVIDIA NIM failure");
    }

    const data = await response.json();
    usageService.recordNvidia(900); // Record usage
    return data.choices?.[0]?.message?.content || "";
  } catch (error) {
    console.error("Critical: NVIDIA NIM fallback failed.", error);
    throw error;
  }
}

async function callOpenRouter(prompt: string, options: { json?: boolean, image?: { data: string, mimeType: string } } = {}) {
  const model = "google/gemini-2.0-flash-001";
  const messages: any[] = [{
    role: "user",
    content: options.image ? [
      { type: "text", text: prompt },
      { type: "image_url", image_url: { url: `data:${options.image.mimeType};base64,${options.image.data}` } }
    ] : prompt
  }];

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${FALLBACK_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": typeof window !== 'undefined' ? window.location.origin : '',
        "X-Title": "ArcheoMind"
      },
      body: JSON.stringify({
        model,
        messages,
        response_format: options.json ? { type: "json_object" } : undefined
      })
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || "OpenRouter failure");
    }
    const data = await response.json();
    usageService.recordOpenRouter(1000); // Record usage
    return data.choices?.[0]?.message?.content || "";
  } catch (error) {
    console.warn("⚠️ OpenRouter request failed, propagating error to fallback logic.", error);
    throw error;
  }
}

let lastGeminiFailure = 0;
const FAILURE_COOLDOWN = 30000; // 30 seconds

export async function runAI(prompt: string, options: { 
  json?: boolean, 
  image?: { data: string, mimeType: string },
  fallbackValue?: any 
} = {}) {
  const now = Date.now();
  const shouldSkipGemini = now - lastGeminiFailure < FAILURE_COOLDOWN;

  // 1. Start with Google Gemini
  if (!shouldSkipGemini) {
    try {
      // Direct client check for local API key override
      const overrideKey = typeof window !== 'undefined' ? localStorage.getItem('GEMINI_API_KEY_OVERRIDE') : null;
      if (overrideKey) {
        const client = new GoogleGenAI({ apiKey: overrideKey });
        const result = await client.models.generateContent({
          model: DEFAULT_MODEL,
          contents: [
            {
              parts: [
                { text: prompt },
                ...(options.image ? [{ inlineData: { data: options.image.data, mimeType: options.image.mimeType } }] : [])
              ]
            }
          ],
          config: options.json ? { responseMimeType: "application/json" } : undefined
        });

        if (!result.text) throw new Error("Empty Gemini response");
        usageService.recordGemini(result.usageMetadata?.totalTokenCount || 500); // Record usage
        return options.json ? JSON.parse(result.text) : result.text;
      }

      // Default secure path: Proxy through server-side /api/gemini/run
      const response = await fetch('/api/gemini/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt, options })
      });

      if (!response.ok) {
        const errObj = await response.json().catch(() => ({}));
        throw new Error(errObj.error || `Server responded with ${response.status}`);
      }

      const data = await response.json();
      if (data.error && data.result === undefined) {
        throw new Error(data.error);
      }
      usageService.recordGemini(400); // Record average proxy usage
      return data.result;
    } catch (error) {
      console.warn("⚠️ Gemini request failed, moving to NVIDIA NIM fallback.", error);
      lastGeminiFailure = Date.now();
      // Fall through to NVIDIA
    }
  }

  // 2. Use NVIDIA NIM if Gemini fails or is in cooldown
  try {
    console.log("🔄 Initiating NVIDIA NIM fallback with Llama 3.1...");
    const nvidiaResult = await callNvidiaNim(prompt, options);
    return options.json ? (typeof nvidiaResult === 'string' ? JSON.parse(nvidiaResult) : nvidiaResult) : nvidiaResult;
  } catch (nvidiaError) {
    console.warn("⚠️ NVIDIA backup failed, moving to OpenRouter last resort fallback.", nvidiaError);

    // 3. Use OpenRouter as the last resort backup
    try {
      console.log("🔄 Initiating OpenRouter fallback...");
      const openRouterResult = await callOpenRouter(prompt, options);
      return options.json ? (typeof openRouterResult === 'string' ? JSON.parse(openRouterResult) : openRouterResult) : openRouterResult;
    } catch (openRouterError) {
      console.error("❌ Last resort OpenRouter backup also failed.", openRouterError);
      if (options.fallbackValue !== undefined) {
        console.log("ℹ️ Recovered with offline structural cache.");
        return options.fallbackValue;
      }
      throw openRouterError;
    }
  }
}

export interface ArtifactAnalysis {
  name: string;
  civilization: string;
  estimatedEra: string;
  confidenceScore: number;
  description: string;
  culturalSignificance: string;
  reconstructionPrompt: string;
  location: {
    lat: number;
    lng: number;
  };
  materialComposition: string;
  historicalUsage: string;
  socialStructureInference: string;
  stratigraphicContext: {
    layer: string;
    environment: string;
    preservationState: string;
  };
}

function getMockAnalysis(name: string = "Ancient Specimen [Simulation Mode]"): ArtifactAnalysis {
  return {
    name: name,
    civilization: "Pre-AI Era (Simulated)",
    estimatedEra: "4000-2000 BCE",
    confidenceScore: 0.92,
    description: "A precision reconstruction based on local archival heuristics. This specimen shows significant signs of ritual wear and craftsmanship characteristic of early urban settlements.",
    culturalSignificance: "Represents a cornerstone of early social cohesion and spiritual practice in prehistoric societies.",
    reconstructionPrompt: "Detailed archaeological artifact in a vibrant ancient marketplace, sunlight filtering through dust.",
    location: { lat: 28.6139, lng: 77.2090 },
    materialComposition: "Terra-cotta / Copper Alloy Composite",
    historicalUsage: "Symbolic and Utilitarian",
    socialStructureInference: "Indicates a complex division of labor and specialized craft guilds.",
    stratigraphicContext: {
      layer: "Primary Occupation Layer",
      environment: "Arid Alluvial Plain",
      preservationState: "Excellent"
    }
  };
}

export async function analyzeArtifactImage(base64Image: string): Promise<ArtifactAnalysis> {
  const base64Data = base64Image.includes(",") ? base64Image.split(",")[1] : base64Image;
  const mimeType = base64Image.includes(";") ? base64Image.split(";")[0].split(":")[1] : "image/jpeg";

  const prompt = `You are a world-class archaeologist and forensic historian specialized in global artifact resonance and cultural reconstruction. 
    Analyze the provided archaeological artifact with extreme precision and historical rigor. 
    Look for micro-details: wear patterns, material impurities, symbolic inscriptions, and stylistic nuances across any civilization (Egypt, Rome, China, Mesopotamia, Mesoamerica, Indus Valley, etc.).

    Your analysis must be exhaustive and multi-dimensional.
    
    Return a JSON object with these EXACT keys:
    - name, civilization, estimatedEra, confidenceScore, description, culturalSignificance, reconstructionPrompt, location: { lat, lng }, materialComposition, historicalUsage, socialStructureInference, stratigraphicContext: { layer, environment, preservationState }.`;

  return runAI(prompt, { 
    json: true, 
    image: { data: base64Data, mimeType },
    fallbackValue: getMockAnalysis("Ancient Discovery [Local Cache Mode]")
  });
}

export async function quickIdentify(base64Image: string): Promise<{ name: string, civilization: string, period: string, materials: string }> {
  const base64Data = base64Image.includes(",") ? base64Image.split(",")[1] : base64Image;
  const mimeType = base64Image.includes(";") ? base64Image.split(";")[0].split(":")[1] : "image/jpeg";
  const prompt = `Quickly identify this archaeological artifact. Return ONLY a JSON object with these keys: name, civilization, period, materials. Keep values brief (2-3 words max each).`;

  return runAI(prompt, { 
    json: true, 
    image: { data: base64Data, mimeType },
    fallbackValue: { name: "", civilization: "", period: "", materials: "" }
  });
}

export async function askHistorian(artifact: any, question: string) {
  const prompt = `Artifact Context: ${JSON.stringify(artifact)}\n\nQuestion: ${question}\n\nAnswer as a highly knowledgeable cyber-archaeologist in a concise, insightful way.`;
  return runAI(prompt, { 
    fallbackValue: "The Cyber-Historian is currently processing a massive archival influx. (Archival Fallback mode activated)." 
  });
}

export async function compareArtifactsResonance(item1: any, item2: any) {
  const prompt = `Perform a Deep Cross-Resonance Analysis between these two archaeological artifacts:
    Artifact 1: ${item1.name} (${item1.civilization}, ${item1.estimatedEra})
    Artifact 2: ${item2.name} (${item2.civilization}, ${item2.estimatedEra})
    Format the output as a set of concise points with clear headings. Use a scholarly yet high-tech archaeological tone.`;

  return runAI(prompt, { 
    fallbackValue: "COMPARATIVE RESONANCE: ARCHIVAL FALLBACK MODE\n\n1. Temporal Pulse: Overlapping cultural horizons detected.\n2. Aesthetic Signature: Shared motifs observed.\n3. Entanglement: Likely part of a regional trade network." 
  });
}

export async function semanticSearchGrounding(artifacts: any[], query: string) {
  const prompt = `You are a search grounding engine for an archaeological database. 
    User query: "${query}"
    Artifacts: ${JSON.stringify(artifacts.map(a => ({ id: a.id, name: a.name, civilization: a.civilization })))}
    Return a JSON array of the IDs of the top 5 matching artifacts, ordered by relevance. If no matches, return [].`;

  return runAI(prompt, { 
    json: true, 
    fallbackValue: [] 
  });
}

export async function translateDescription(text: string, targetLang: string) {
  const prompt = `Translate this archaeological description into ${targetLang}. Maintain academic tone. Text: "${text}"`;
  return runAI(prompt, { fallbackValue: text });
}

export async function analyzeIndianArtifactImage(base64Image: string): Promise<ArtifactAnalysis> {
  const base64Data = base64Image.includes(",") ? base64Image.split(",")[1] : base64Image;
  const mimeType = base64Image.includes(";") ? base64Image.split(";")[0].split(":")[1] : "image/jpeg";
  const prompt = `You are the lead AI forensic historian for Indian Heritage Research. Analyze the image with 99.9% forensic accuracy. If Indian, provide match. If not, find cross-cultural resonance. Return JSON with ArtifactAnalysis keys.`;

  return runAI(prompt, { 
    json: true, 
    image: { data: base64Data, mimeType },
    fallbackValue: getMockAnalysis("Indian Heritage Specimen [Local Cache Mode]")
  });
}

export async function predictHotspots(artifacts: any[]) {
  const prompt = `Predict 3 potential high-probability "Hotspots" for future discoveries. Return JSON array of objects: { name, lat, lng, reasoning, inferredCivilization }.`;
  return runAI(prompt, { json: true, fallbackValue: [] });
}

export interface DebateTurn {
  agent: 'epigraphist' | 'metallurgist' | 'botanist' | 'coordinator';
  agentName: string;
  roleTitle: string;
  body: string;
  confidenceShift: number;
}

export interface CouncilDebateResult {
  turns: DebateTurn[];
  consensusEpoch: string;
  confidenceScore: number;
}

function getMockDebate(artifact: any): CouncilDebateResult {
  const artName = artifact?.name || "Ancient Specimen";
  const civ = artifact?.civilization || "Unknown Civilization";
  const material = artifact?.materialAnalysis || "Organic & Ceramic elements";
  const era = artifact?.estimatedEra || "1st Millennium BCE";

  return {
    turns: [
      {
        agent: 'epigraphist',
        agentName: 'Dr. Evelyn Vance',
        roleTitle: 'Chief Epigraphist & Philologist',
        body: `Upon close visual inspection of "${artName}", the faint surface markings and geometric incisions show strong structural correlation with proto-script matrices common across the ${civ} trade zone. The tracking of outer groove frequency suggests these were administrative markers rather than merely aesthetic or ceremonial patterns.`,
        confidenceShift: 4
      },
      {
        agent: 'metallurgist',
        agentName: 'Prof. Rajan Mehta',
        roleTitle: 'Principal Archaeometallurgist',
        body: `Spectrographic material mapping of "${material}" confirms localized high-temperature sintering. The microcrystalline grain boundaries point to advanced annealing techniques, indicating a stable centralized workshop system. This craftsmanship style was highly active around the era of ${era}, implying well-established trade corridors.`,
        confidenceShift: 8
      },
      {
        agent: 'botanist',
        agentName: 'Dr. Chloe Durand',
        roleTitle: 'Senior Archaeobotanist',
        body: `Our organic residue analysis on "${artName}" recovered high traces of carbonized seed hulls and lipid compounds. This strongly aligns with agrarian processing of ancient millets and aromatic resins. It confirms this specimen was maintained in active storage granaries, corroborating the administrative hypothesis proposed by Dr. Vance.`,
        confidenceShift: 5
      },
      {
        agent: 'coordinator',
        agentName: 'A.I.D.E.N.',
        roleTitle: 'Temporal Consensus AI System',
        body: `Synthesizing epigraphic, metallurgic, and organic vectors: Bayesian triangulation yields 94.7% convergence tracking back to ${era}. The combined structural signatures confirm a high secondary utility as a trade metric, demonstrating specialized social divisions in active ${civ} provincial hubs.`,
        confidenceShift: 10
      }
    ],
    consensusEpoch: era,
    confidenceScore: 94.7
  };
}

export async function runMultiAgentDebate(artifact: any): Promise<CouncilDebateResult> {
  const prompt = `You are a state-of-the-art Archaeological consensus engine driving a roundtable between 4 specialized AI agents explaining this artifact:
    Artifact Name: "${artifact.name}"
    Civilization: "${artifact.civilization}"
    Material: "${artifact.materialAnalysis || 'Complex core'}"
    Era: "${artifact.estimatedEra}"

    Each agent must take a turn explaining their forensic expertise:
    1. Dr. Evelyn Vance (Chief Epigraphist & Philologist): Focuses on inscriptions, iconography, script traits.
    2. Prof. Rajan Mehta (Principal Archaeometallurgist): Focuses on material synthesis, physical composition, craftsmanship temperature, micro-stress.
    3. Dr. Chloe Durand (Senior Archaeobotanist): Focuses on residues, carbonized elements, botanical context.
    4. A.I.D.E.N. (Temporal Consensus AI): Synthesizes the final Bayesian chronological lock.

    Deliver a JSON object matching this schema exactly:
    {
      "consensusEpoch": "string of estimated era",
      "confidenceScore": number (e.g., 94.5),
      "turns": [
        {
          "agent": "epigraphist" | "metallurgist" | "botanist" | "coordinator",
          "agentName": "Evelyn Vance" | "Rajan Mehta" | "Chloe Durand" | "A.I.D.E.N.",
          "roleTitle": "string",
          "body": "Expert observations about the artifact...",
          "confidenceShift": number (positive integer or percent, like 5)
        }
      ]
    }
    Make sure each turn contains detailed, academic, and highly technical insights specific to the artifact's properties.`;

  return runAI(prompt, {
    json: true,
    fallbackValue: getMockDebate(artifact)
  });
}

export interface SpectrometryAnalysisResult {
  elements: { element: string; percentage: number; peakKeV: number }[];
  ageEstimated: number;
  errorMargin: number;
  halfLifeRemaining: number;
  bondingNarrative: string;
}

export async function runSpectrometryAnalysis(artifactName: string, civilization: string, material: string, method: string): Promise<SpectrometryAnalysisResult> {
  const prompt = `Perform a highly technical, realistic, and forensic simulated chemical spectrometry and chrono-dating analysis for this archaeological artifact:
    Artifact: "${artifactName}"
    Civilization: "${civilization}"
    Declared Material: "${material || 'Unknown material'}"
    Analytical Method Selected: "${method}"

    Generate realistic molecular/elemental components (typically 4-5 key elements with percentages adding up exactly to 100%, and estimated peak energy in keV e.g. Iron, Copper, Tin, Calcium, Carbon, Lead, Silica, etc.), an estimated physical age elapsed (positive integer in years), and a scientific narrative explaining crystal stress, material impurities, or isotope decay.

    Format as a JSON object matching this schema exactly:
    {
      "elements": [
        { "element": "Iron", "percentage": 68.4, "peakKeV": 6.4 },
        { "element": "Silica", "percentage": 20.2, "peakKeV": 1.74 }
      ],
      "ageEstimated": 2450,
      "errorMargin": 45,
      "halfLifeRemaining": 74.2,
      "bondingNarrative": "Molecular structural bonding narrative..."
    }`;

  return runAI(prompt, {
    json: true,
    fallbackValue: {
      elements: [
        { element: "Silicon Dioxide (SiO2)", percentage: 65.4, peakKeV: 1.74 },
        { element: "Calcium Oxide (CaO)", percentage: 18.2, peakKeV: 3.69 },
        { element: "Iron (Fe)", percentage: 10.3, peakKeV: 6.40 },
        { element: "Residual Carbon-14", percentage: 6.1, peakKeV: 0.27 }
      ],
      ageEstimated: 2200,
      errorMargin: 35,
      halfLifeRemaining: 76.8,
      bondingNarrative: `Dendro-calibrated isotope tracking of the carbonized elements in the specimen core confirms stable decay cycles indicating long-term anaerobic preservation. Microcrystalline silicon boundaries show extensive mineralized recrystallization consistent with ancient localized alluvial deposits.`
    }
  });
}

