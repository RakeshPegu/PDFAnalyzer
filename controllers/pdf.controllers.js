import { float32Buffer, generateTextEmbedding, getNodeRedisClient } from "../utility/generateSentenceEmbedding.js";


export const uploadFiles = async(req, res)=>{
    try {
        console.log(req.files);
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
    console.log(`queryProductDescriptionEmbeddingsByKNN started`)
    let result = {}
    if(_searchTxt){
        _resultCount = _resultCount ?? 5 
        const nodeRedisClient = await getNodeRedisClient()
        const searchTxtVectorArr = await generateTextEmbedding(_searchTxt)
        const searchQuery = `*=>[KNN ${_resultCount} @productDescriptionEmbeddings $searchBlob AS score]`;
        result = await nodeRedisClient.ft.search(
            process.env.PRODUCTS_INDEX_KEY,
            searchQuery,
            {
                PARAMS:{
                    searchBlob:float32Buffer(searchTxtVectorArr)
                },
                 RETURN: [
                    'score',
                    'brandName',
                    'productDisplayName',
                    'imageURL',
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
export  const query = async (req, res) => {
    try {
        console.log('this is the body', req.body)
        const {query} = req.body 
        console.log('this is the query', query)
        const result = await queryProductDescriptionEmbeddingsByKNN(
            query,
            3
        )
        console.log('this is the result ', result)
        res.status(200).json({
            success:true,
            result
            
        })
        
    } catch (error) {
        console.log('error occured during querying pertaining to uploaded files', error)
        res.status(500).json({
            success:false,
            message:"Something went wrong"

        })
        
    }
    
}















