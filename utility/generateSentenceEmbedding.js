
import { pipeline} from "@xenova/transformers";
const modelName = "Xenova/all-distilroberta-v1";
import {createClient} from "redis";

const REDIS_URI = "redis://localhost:6379";
let nodeRedisClient = null;

export const getNodeRedisClient = async () => {
  if (!nodeRedisClient) {
    nodeRedisClient = createClient({ url: REDIS_URI });
    await nodeRedisClient.connect();
  }
  return nodeRedisClient;
};


let extractor;

async function getExtractor() {
  if (!extractor) {
    try {
      extractor = await pipeline(
        "feature-extraction",
        modelName
      );
    } catch (error) {
      console.error("PIPELINE ERROR:");
      console.error(error);
      console.error(error?.stack);
      throw error;
    }
  }

  return extractor;
}


export async function generateTextEmbedding(sentence) {
  const pipe = await getExtractor()
  const vectorOutput = await pipe(sentence, {
    pooling: "mean",
    normalize: true,
  });

  const embedding = Array.from(vectorOutput.data);
  return embedding;
}
export const float32Buffer = (arr) => {
    const floatArray = new Float32Array(arr);
    const float32Buffer = Buffer.from(floatArray.buffer);
    return float32Buffer;
};