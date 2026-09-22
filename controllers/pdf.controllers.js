import { pdfChunker } from "../utility/chunkingPDF.js";
import { float32Buffer, generateTextEmbedding, getNodeRedisClient } from "../utility/generateSentenceEmbedding.js";
import  {PDFParse} from 'pdf-parse'
import fs from 'fs'
import OpenAI from "openai";
//import { GoogleGenAI } from "@google/genai";

export const uploadFiles = async(req, res)=>{
    try {
        const pdfBuffer = fs.readFileSync(req.file.path)
        const parser = new PDFParse({
            data:pdfBuffer
        })
        const data = await parser.getText()
        const pdfChunks = await pdfChunker(data.text)
        console.log('this is the pdfChunks', pdfChunks)
        const redis = await getNodeRedisClient()
        for(let chunk of pdfChunks){
            const {text, embedding, metaData} = chunk
            const key = `chunk:${metaData.documentId}:${metaData.chunkIndex}`

            const embeddingBuffer = float32Buffer(embedding)
            console.log('this is the embedding buffer', embeddingBuffer)
            await redis.hSet(key, {
                text,
                documentId:metaData.documentId,
                chunkIndex:metaData.chunkIndex,
                embedding:embeddingBuffer
            })

        }
        

        //create chunk
        // use a vector ai model to embbed the chunks into vector embbeding
        //const {embedding} = await generateEmbedding()
        // store the embbeded vectors into vector database
        res.status(201).json({
            success:true,
            message:"Successfully uploaded files"
        })
        
        
    } catch (error) {
        console.log('error occurred during uploading files', error)
        res.status(500).json({
            success:false,
            message:"Something went wrong"
        })
           
    }
}


const queryProductDescriptionEmbeddingsByKNN =  async(_searchTxt, _resultCount)=>{
    let result = {}
    if(_searchTxt){
        _resultCount = _resultCount ?? 5 

        const nodeRedisClient = await getNodeRedisClient()
        const searchTxtVectorArr = await generateTextEmbedding(_searchTxt)
        // const queryVector = Buffer.from(
        //     new Float32Array(searchTxtVectorArr).buffer
        // )
        const queryVector = float32Buffer(searchTxtVectorArr)

        const searchQuery = `*=>[KNN ${_resultCount} @embedding $queryVector AS score]`;
        result = await nodeRedisClient.ft.search(
            "idx:chunks",
            searchQuery,
            {
                PARAMS:{
                    queryVector:queryVector
                },
                 RETURN: [
                    'text',
                    'documentId',
                    'chunkIndex',
                    'score',
                ],
                SORTBY: {
                    BY: 'score',
                    // DIRECTION: "DESC"
                },
                DIALECT: 2,
            

            }
        )


    }else{
        throw "Search text can't be empty"
    }
    
    return result;
}

//const ai = new GoogleGenAI({apiKey:process.env.GEMINI_API});


const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': '<YOUR_SITE_URL>', // Optional. Site URL for rankings on openrouter.ai.
    'X-OpenRouter-Title': '<YOUR_SITE_NAME>', // Optional. Site title for rankings on openrouter.ai.
  },
});






export  const query = async (req, res) => {
    try {
        const {query} = req.body
        const result = await queryProductDescriptionEmbeddingsByKNN(query)  
        const context = result.documents
                              .map(doc => doc.value.text)
                              .join("\n\n");  
        
        // const interaction = await ai.interactions.create({
        //     model: "gemini-3.8-flash",
        //     input: `
        //         Answer the user's question using ONLY the
        //         following retrieved document context.

        //         Context:
        //         ${context}

        //         User question:
        //         ${query}

        //         If the answer isn't present in the context,
        //         say that the information isn't available
        //         in the provided document.
        //     `
        // });
        const completion = await openai.chat.completions.create({
            model: "openrouter/free",
            messages: [
                {
                    role: "system",
                    content: `
        You are a document question-answering assistant.

        Answer the user's question using only the provided context.
        If the answer is not contained in the context, say that
        the information is not available in the provided document.
                    `
                },
                {
                    role: "user",
                    content: `
        Context:
        ${context}

        Question:
        ${query}
                    `
                }
            ]
        });
       

        const answer = completion.choices[0].message.content;
        res.status(200).json({
            success:true,
            text:answer
            
            
            
        })
        
    } catch (error) {
        console.log('error occured during querying pertaining to uploaded files', error)
        if(error.stat)
        res.status(500).json({
            success:false,
            message:"Something went wrong"

        })
        
    }
    
}



















