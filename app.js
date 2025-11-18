require('dotenv').config(); 
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000; 

// Retrieve the secret keys from environment variables
CD_SEARCH_URL = process.env.CD_SEARCH_URL;
CD_API_KEY = process.env.CD_API_KEY;
//SEARCH
GLOBAL_METRICS_URL = process.env.GLOBAL_METRICS_URL;
GLOBAL_METRICS_HOST = process.env.GLOBAL_METRICS_HOST;
GLOBAL_METRICS_KEY = process.env.GLOBAL_METRICS_KEY;
//GLOBAL METRICS
TRENDING_COIN_URL = process.env.TRENDING_COIN_URL;
TRENDING_ACCESS_TOKEN = process.env.TRENDING_ACCESS_TOKEN;
//TRENDING COINS
TOP_COINS_URL = process.env.TOP_COINS_URL;
//TOP COINS
NEWS_DATA_URL = process.env.NEWS_DATA_URL;
//NEWS

app.use(cors()); // Middleware to allow cross-origin requests from your frontend site
app.use(express.json()); // Middleware to parse JSON bodies if your proxy needed to handle POST requests

app.use(express.static(__dirname));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

//"Warming"
app.get('/health', (req, res) =>{
  res.status(200).json({status: 'ok', timestamp: new Date()});
});

//Search
app.get('/api/search', async(req, res) => {
  try{
    const{ search_string, limit } = req.query;
    if(!search_string){
      return res.status(400).json({error: "Missing parameter"});
    }
    const apiResponse = await axios.get(`${CD_SEARCH_URL}`, {
      headers: {
        // Use the secret API key stored securely on the server
        "Authorization": `Bearer ${CD_API_KEY}`, 
        "Content-Type": "application.json"
      },
      params: req.query, // Obtain query parameters from the client
    });
    // Send the data received from API back to frontend
    res.json(apiResponse.data);
  }catch(error){
    console.error('Error proxying request:', error.message);
    res.status(500).json({error: 'Internal Server Error' });
  }
});

//Global metrics
app.get('/api/global-metrics', async(req, res) => {
  try{
    const apiResponse = await axios.get(`${GLOBAL_METRICS_URL}`, {
      headers: {
        //Secret key/stuff stored securely on the server
        "x-rapidapi-key": `${GLOBAL_METRICS_KEY}`,
        "x-rapidapi-host": `${GLOBAL_METRICS_HOST}`
      },
      params: req.query, //Getting query parameters from the client
    });
    // Sending the data received from API to frontend
    res.json(apiResponse.data);
  }catch (error){
    console.error('Error proxying request:', error.message);
    res.status(500).json({error: 'Internal Server Error' });
  }
});

//Trending coins
app.get('/api/trending-coins', async (req, res) => {
  try{
    const apiResponse = await axios.get(`${TRENDING_COIN_URL}`, {
      headers: {
        "x-access-token": `${TRENDING_ACCESS_TOKEN}`
      },
      params: req.query,
    });
    res.json(apiResponse.data);
  }catch(error){
    console.error('Error proxying request:', error.message);
    res.status(500).json({error: 'Internal Server Error' });
  }
});

//Top coins
app.get('/api/top-coins', async (req, res) => {
  try{
    const apiResponse = await axios.get(`${TOP_COINS_URL}`,{});
    res.json(apiResponse.data);
  }catch(error){
    console.error('Error proxying request:', error.message);
    res.status(500).json({error: 'Internal Server Error' });
  }
});

//News
app.get('/api/news', async (req, res) => {
  try{
    const apiResponse = await axios.get(`${NEWS_DATA_URL}`,{});
    res.json(apiResponse.data);
  }catch(error){
    console.error('Error proxying request:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Proxy server running: ${PORT}`);
});

