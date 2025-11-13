const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.PORT || 3000

app.use(cors ())

app.use(express.json())
{/**QT08QSlPZjRdoazt */}
const uri = "mongodb+srv://webdbUser:QT08QSlPZjRdoazt@cluster0.jnj91of.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.get("/",(req,res) =>{
    res.send('Smart server is running')
 })

 async function run() {
   try{
        await client.connect();

        const db = client.db('web_db')
        const productionCollection = db.collection('products')

        app.post('/product',async(req,res)=>{
            const newProduct = req.body
            const result = await productionCollection.insertOne()
            res.send(result)
        })
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    finally{

    }
 }

run().catch(console.dir)

 app.listen(port,()=>{
    console.log(`smart server is running on port:${port}`);
    
 })

//client.connect()
//.then(()=>{
  //  app.listen(port,()=>{
    //    console.log(`smart server is running now on port:${port}`);
        
  //  })
//})
//.catch(console.dir)