const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI || "mongodb+srv://webdbUser:QT08QSlPZjRdoazt@cluster0.jnj91of.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.use(cors({
  
  origin: ["https://earnest-biscochitos-c1de54.netlify.app",
    "http://localhost:5173"
  ],
  credentials: true
}));

let productionCollection;
let eventsCollection;
let joinedEventsCollection;

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    const db = client.db('web_db');
    
    // Initialize collections
    productionCollection = db.collection('products');
    eventsCollection = db.collection('events');
    joinedEventsCollection = db.collection('joined_events');

    // Confirm connection
    await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
  res.send('Smart server is running');
});

app.post('/product', async (req, res) => {
  const newProduct = req.body;
  const result = await productionCollection.insertOne(newProduct);
  res.send(result);
});

app.get('/products', async (req, res) => {
  const products = await productionCollection.find().toArray();
  res.send(products);
});

const connectDB = async () => {
  if (eventsCollection) return; // Already connected
  await client.connect();
  const db = client.db('web_db');
  eventsCollection = db.collection('events');
  joinedEventsCollection = db.collection('joined_events');
  productionCollection = db.collection('products');
};

app.get('/events', async (req, res) => {
  try {
    await connectDB(); // Ensure connection is ready
    const events = await eventsCollection.find().toArray();
    res.send(events);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Failed to fetch events' });
  }
});

app.post('/events', async (req, res) => {
  try {
    const newEvent = req.body;
    newEvent.createdAt = new Date();
    const result = await eventsCollection.insertOne(newEvent);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: 'Failed to create event' });
  }
});

app.get('/events/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const event = await eventsCollection.findOne({ _id: new ObjectId(id) });
    res.send(event);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch event' });
  }
});


app.post('/joined-events', async (req, res) => {
  try {
    const joinData = req.body;
    const result = await joinedEventsCollection.insertOne(joinData);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: 'Failed to join event' });
  }
});

app.get('/joined-events/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const joinedEvents = await joinedEventsCollection.find({ userId: userId }).toArray();
    res.send(joinedEvents);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch joined events' });
  }
});

app.listen(port, () => {
  console.log(`Smart server is running on port: ${port}`);
});
module.exports = app;