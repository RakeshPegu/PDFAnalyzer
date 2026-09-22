import express from 'express'
const app = express()
const port = process.env.PORT || 5001
import documentRoute from './routes/pdf.route.js'
import { createChunkIndex } from './utility/createIndex.js'
import { getNodeRedisClient } from './utility/generateSentenceEmbedding.js'
app.use(express.json())
app.use('/static', express.static('public'))
app.get('/api/v1/test', (req , res)=>{
    res.status(200).json({success:true,
        message:"This is a test route"
    })
})

createChunkIndex()
app.use('/api/v1/document', documentRoute)
app.listen(port, () => {
    console.log(`the server is listening on port ${port}`)
})