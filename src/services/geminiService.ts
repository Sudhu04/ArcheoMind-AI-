import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeArtifact(imageBase64: string, mimeType: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: [
      {
        text: `You are ArcheoMind AI, a world-class archaeological expert and neural analyst. 
        Your task is to perform a deep forensic analysis of the provided artifact image.
        
        CRITICAL INSTRUCTIONS:
        1. IDENTIFICATION: Provide the most accurate name and classification for the specimen.
        2. CHRONOLOGY: Estimate the era with high precision (e.g., "Late Bronze Age, c. 1200 BCE").
        3. CIVILIZATION: Identify the specific culture or civilization of origin.
        4. MATERIAL ANALYSIS: Detail the likely materials (e.g., "Lapis lazuli, 22k gold leaf, cedar wood").
        5. CULTURAL SIGNIFICANCE: Explain the artifact's role in its society (religious, utilitarian, funerary).
        6. GEOSPATIAL DATA: Provide precise GPS coordinates (lat/lng) for the most likely discovery site (e.g., Valley of the Kings, Knossos, Machu Picchu).
        7. NEURAL RECONSTRUCTION: Provide a highly detailed prompt for a 3D visual reconstruction, including texture, lighting, and missing parts.
        
        Output must be a valid JSON object strictly following the provided schema.`,
      },
      {
        inlineData: {
          data: imageBase64.split(',')[1] || imageBase64,
          mimeType: mimeType,
        },
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          historicalContext: { type: Type.STRING },
          materialAnalysis: { type: Type.STRING },
          culturalSignificance: { type: Type.STRING },
          estimatedEra: { type: Type.STRING },
          civilization: { type: Type.STRING },
          suggestedTags: { type: Type.ARRAY, items: { type: Type.STRING } },
          confidenceScore: { type: Type.NUMBER },
          suggestedDiscoveryLocation: {
            type: Type.OBJECT,
            properties: {
              lat: { type: Type.NUMBER },
              lng: { type: Type.NUMBER },
              name: { type: Type.STRING },
            },
            required: ["lat", "lng", "name"],
          },
          reconstructionPrompt: { type: Type.STRING },
        },
        required: [
          "name", 
          "description", 
          "historicalContext", 
          "materialAnalysis", 
          "culturalSignificance", 
          "estimatedEra", 
          "civilization", 
          "suggestedTags", 
          "confidenceScore", 
          "suggestedDiscoveryLocation"
        ],
      },
    },
  });

  return JSON.parse(response.text || "{}");
}
