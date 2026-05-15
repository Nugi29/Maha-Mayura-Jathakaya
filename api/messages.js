import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://user:1234@thoranachat.f2zjodw.mongodb.net/?appName=thoranachat";

// Connect to MongoDB
let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient.db('thoranachat');
  }
  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return client.db('thoranachat');
}

export default async function handler(req, res) {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('messages');

    if (req.method === 'GET') {
      // Fetch the last 50 messages
      const messages = await collection.find({}).sort({ time: 1 }).limit(50).toArray();
      return res.status(200).json(messages);
    } 
    
    if (req.method === 'POST') {
      // Save a new message
      const { name, text } = req.body;
      const newMessage = {
        name,
        text,
        time: new Date()
      };
      await collection.insertOne(newMessage);
      return res.status(201).json(newMessage);
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (error) {
    console.error("MongoDB Error:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
