const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Function to clean up the response
function cleanResponse(text) {
  if (!text) return '';
  
  // If it's an array, join it
  if (Array.isArray(text)) {
    text = text.join(' ');
  }

  // Remove any special tokens or markers
  text = text.replace(/<\|endoftext\|>/g, '');
  text = text.replace(/Human:.*Assistant:/g, '');
  
  // Remove all commas
  text = text.replace(/,/g, '');
  
  // Remove multiple spaces
  text = text.replace(/\s+/g, ' ');
  
  // Remove any remaining special characters except basic punctuation
  text = text.replace(/[^\w\s.!?-]/g, '');
  
  // Clean up any double punctuation
  text = text.replace(/([.!?])\1+/g, '$1');
  
  return text.trim();
}

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  console.log('Received chat request:', req.body);
  try {
    const { message } = req.body;
    console.log('Processing message:', message);
    
    // Add timeout to the fetch request
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama2',
        prompt: message,
        stream: false,
        system: "You are a helpful AI assistant. Provide clear, concise responses. Be informative and professional."
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Ollama server not running. Please start Ollama first.');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Received output from model:', data);

    // Clean up the response before sending it
    const cleanedResponse = cleanResponse(data.response);
    console.log('Sending cleaned response:', cleanedResponse);
    res.json({ response: cleanedResponse });
  } catch (error) {
    console.error('Detailed error:', error);
    if (error.name === 'AbortError') {
      res.status(504).json({ error: 'Request timed out. Please try again.' });
    } else {
      res.status(500).json({ error: `Failed to get response from AI: ${error.message}` });
    }
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 