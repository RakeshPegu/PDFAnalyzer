import express from 'express'
const app = express()
const port = process.env.PORT || 5001
import documentRoute from './routes/pdf.route.js'
import * as redis from 'redis'
import { generateTextEmbedding, getNodeRedisClient } from './utility/generateSentenceEmbedding.js'
app.use(express.json())
app.use('/static', express.static('public'))


{/*
const PRODUCTS_KEY_PREFIX = "products";
const PRODUCTS_INDEX_KEY = "idx:products";

const products = [
    {
        _id: '1',
        price: 4950,
        productDisplayName: 'Puma Men Race Black Watch',
        brandName: 'Puma',
        ageGroup: 'Adults-Men',
        gender: 'Men',
        masterCategory: 'Accessories',
        subCategory: 'Watches',
        imageURL: 'images/11002.jpg',
        productDescription:
            '<p>This watch from puma comes in a heavy duty design. The asymmetric dial and chunky casing gives this watch a tough appearance perfect for navigating the urban jungle.<br /><strong><br />Dial shape</strong>: Round<br /><strong>Case diameter</strong>: 32 cm<br /><strong>Warranty</strong>: 2 Years<br /><br />Stainless steel case with a fixed bezel for added durability, style and comfort<br />Leather straps with a tang clasp for comfort and style<br />Black dial with cat logo on the 12 hour mark<br />Date aperture at the 3 hour mark<br />Analog time display<br />Solid case back made of stainless steel for enhanced durability<br />Water resistant upto 100 metres</p>',
    },
    {
        _id: '2',
        price: 5450,
        productDisplayName: 'Puma Men Top Fluctuation Red Black Watches',
        brandName: 'Puma',
        ageGroup: 'Adults-Men',
        gender: 'Men',
        masterCategory: 'Accessories',
        subCategory: 'Watches',
        imageURL: 'images/11001.jpg',
        productDescription:
            '<p style="text-align: justify;">This watch from puma comes in a clean sleek design. This active watch is perfect for urban wear and can serve you well in the gym or a night of clubbing.<br /><strong><br />Case diameter</strong>: 40 mm&lt;</p>',
    },

    {
        _id: '3',
        price: 499,
        productDisplayName: 'Inkfruit Women Behind Cream Tshirts',
        brandName: 'Inkfruit',
        ageGroup: 'Adults-Women',
        gender: 'Women',
        masterCategory: 'Apparel',
        subCategory: 'Topwear',
        imageURL: 'images/11008.jpg',
        productDescription:
            `<p><strong>Composition</strong><br />Yellow round neck t-shirt made of 100% cotton, has short sleeves and graphic print on the front<br /><br /><strong>Fitting</strong><br />Comfort<br /><br /><strong>Wash care</strong><br />Hand wash separately in cool water at 30 degrees <br />Do not scrub <br />Do not bleach <br />Turn inside out and dry flat in shade <br />Warm iron on reverse<br />Do not iron on print<br /><br />Flaunt your pretty, long legs in style with this inkfruit t-shirt. The graphic print oozes sensuality, while the cotton fabric keeps you fresh and comfortable all day. Team this with a short denim skirt and high-heeled sandals and get behind the wheel in style.<br /><br /><em>Model statistics</em><br />The model wears size M in t-shirts <br />Height: 5'7", Chest: 33"</p>`,
    },
];

async function addProductWithEmbeddings(_products) {
    const nodeRedisClient = await getNodeRedisClient();

    if (_products && _products.length) {
        for (let product of _products) {
            console.log(
                `generating description embeddings for product ${product._id}`,
            );
            const sentenceEmbedding = await generateTextEmbedding(
                product.productDescription,
            );
            product['productDescriptionEmbeddings'] = sentenceEmbedding;

            await nodeRedisClient.json.set(`products:${product._id}`, '$', {
                ...product,
            });
            console.log(`product ${product._id} added to redis`);
        }
    }
}
addProductWithEmbeddings(products)

const createRedisIndex = async () => {
    const nodeRedisClient = await getNodeRedisClient();

    const schema = {
        "$.productDisplayName": {
            type: redis.SCHEMA_FIELD_TYPE.TEXT,
            NOSTEM: true,
            SORTABLE: true,
            AS: "productDisplayName",
        },

        "$.brandName": {
            type: redis.SCHEMA_FIELD_TYPE.TEXT,
            NOSTEM: true,
            SORTABLE: true,
            AS: "brandName",
        },

        "$.price": {
            type: redis.SCHEMA_FIELD_TYPE.NUMERIC,
            SORTABLE: true,
            AS: "price",
        },

        "$.masterCategory": {
            type: redis.SCHEMA_FIELD_TYPE.TAG,
            AS: "masterCategory",
        },

        "$.subCategory": {
            type: redis.SCHEMA_FIELD_TYPE.TAG,
            AS: "subCategory",
        },

        "$.productDescriptionEmbeddings": {
            type: redis.SCHEMA_FIELD_TYPE.VECTOR,
            TYPE: "FLOAT32",
            ALGORITHM: redis.SCHEMA_VECTOR_FIELD_ALGORITHM.FLAT,
            DIM: 768,
            DISTANCE_METRIC: "L2",
            INITIAL_CAP: 111,
            BLOCK_SIZE: 111,
            AS: "productDescriptionEmbeddings",
        },

        "$.productDescription": {
            type: redis.SCHEMA_FIELD_TYPE.TEXT,
            NOSTEM: true,
            SORTABLE: true,
            AS: "productDescription",
        },

        "$.imageURL": {
            type: redis.SCHEMA_FIELD_TYPE.TEXT,
            NOSTEM: true,
            AS: "imageURL",
        },
    };

    console.log(`index ${PRODUCTS_INDEX_KEY} created`);

    try {
        await nodeRedisClient.ft.dropIndex(PRODUCTS_INDEX_KEY);
    } catch (indexErr) {
        console.error(indexErr);
    }

    await nodeRedisClient.ft.create(PRODUCTS_INDEX_KEY, schema, {
        ON: "JSON",
        PREFIX: PRODUCTS_KEY_PREFIX,
    });
};

createRedisIndex();
*/} 
app.use('/api/v1/document', documentRoute)
app.listen(port, () => {
    console.log(`the server is listening on port ${port}`)
})