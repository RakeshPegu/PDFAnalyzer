import { generateTextEmbedding, getNodeRedisClient } from "./generateSentenceEmbedding.js"

class FixedSizeChunker{
    constructor({chunkSize, overlap, stripWhiteSpace = true}){
        if (chunkSize <= 0) {
            throw new Error("chunkSize must be greater than 0")
        }

        if (overlap < 0 || overlap >= chunkSize) {
            throw new Error(
                "overlap must be >= 0 and smaller than chunkSize"
            )
        }
        this.chunkSize = chunkSize 
        this.overlap = overlap
        this.stripWhiteSpace = stripWhiteSpace

    }

    async chunkByChar(text){
        if(!text){
            return []
        };
        let chunkIndex = 0
        const chunks = []
        const step = this.chunkSize - this.overlap
        const documentId = crypto.randomUUID()
        for(let start = 0 ; start < text.length ; start += step){

            const end = Math.min(start + this.chunkSize, text.length)                   

            let chunkText = text.slice(start, end)
            const embedding = await generateTextEmbedding(chunkText)
       
            if(this.stripWhiteSpace){
                chunkText = chunkText.trim()
            }
            if (!chunkText) {
             continue;
            }
            chunks.push({
                text: chunkText,
                embedding,
                metaData:{
                    documentId,
                    chunkIndex

                }
            })
            chunkIndex ++


            if(end >= text.length){
                break
            }

        }
        return chunks
        

    }
    
}

export async function pdfChunker(query) {


    const chunker = new FixedSizeChunker({chunkSize:300, overlap:50} )
    const charChunks = chunker.chunkByChar(query)
    return charChunks
    
}