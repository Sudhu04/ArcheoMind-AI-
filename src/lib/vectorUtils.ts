export function cosineSimilarity(vecA: number[], vecB: number[]) {
  if (vecA.length !== vecB.length || vecA.length === 0) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  const similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  return isNaN(similarity) ? 0 : similarity;
}

export function findMatches(targetEmbedding: number[], allArtifacts: any[], threshold = 0.7) {
  if (!targetEmbedding || targetEmbedding.length === 0) return [];

  return allArtifacts
    .map(a => ({
      ...a,
      similarity: cosineSimilarity(targetEmbedding, a.embedding || [])
    }))
    .filter(a => a.similarity > threshold)
    .sort((a, b) => b.similarity - a.similarity);
}
