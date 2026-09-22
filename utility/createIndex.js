import { getNodeRedisClient } from "./generateSentenceEmbedding.js";

export const createChunkIndex = async () => {
    const redis = await getNodeRedisClient();

    try {
        await redis.ft.create(
            "idx:chunks",
            {
                embedding: {
                    type: "VECTOR",
                    ALGORITHM: "HNSW",
                    TYPE: "FLOAT32",
                    DIM: 768,
                    DISTANCE_METRIC: "COSINE",
                },
            },
            {
                ON: "HASH",
                PREFIX: "chunk:",
            }
        );

        console.log("Redis vector index created");
    } catch (error) {
        if (error.message.includes("Index already exists")) {
            console.log("Redis vector index already exists");
        } else {
            throw error;
        }
    }
};