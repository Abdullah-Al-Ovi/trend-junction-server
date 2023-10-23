const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wukhoja.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {


  try {
  
    await client.connect();
    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    const productsCollection = client.db('resellerDB').collection('productsCollection')
    const usersCollection = client.db('resellerDB').collection('usersCollection')
    const cartCollection = client.db('resellerDB').collection('cartCollection')

    app.get('/products',async(req,res)=>{
      const cursor = productsCollection.find({})
      const result =await cursor.toArray()
      res.send(result)
    })

    app.get('/products/:brandname',async(req,res)=>{
      const brandname = req.params.brandname 
      const cursor =  productsCollection.find({brandname : brandname})
      const results = await cursor.toArray()
      res.send(results)
    })
    app.get('/products/id/:id',async(req,res)=>{
      const id = req.params.id
      console.log(id);
      const result = await productsCollection.findOne({ _id: new ObjectId(id) });
      res.send(result)
     
    })

    app.post('/users',async(req,res)=>{
      const userInfo = req.body
      const result = await usersCollection.insertOne(userInfo)
      res.send(result)
    })
    app.post('/products',async(req,res)=>{
      const product = req.body
      const result = await productsCollection.insertOne(product)
      res.send(result)
    })

    app.post('/cart',async(req,res)=>{
      const cartProduct = req.body
      const result = await cartCollection.insertOne(cartProduct)
      res.send(result)
    })

    app.put('/products/id/:id',async(req,res)=>{
      const id = req.params.id
      const product = req.body
      const {name,brandname,image,type,price,rating}= product
      const option = {upsert:true}
      const updatedProduct ={
        $set:{
          name : name,
          brandname:brandname,
          image:image,
          type:type,
          price:price,
          rating:rating
        }
      }
      const result = await productsCollection.updateOne({_id: new ObjectId(id)},updatedProduct,option)
      res.send(result)
    })

    // const database = client.db('resellerDB')
  } finally {
    
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('Server is running')
})
app.listen(port,()=>{
    console.log(`Server is running on ${port}`);
})

