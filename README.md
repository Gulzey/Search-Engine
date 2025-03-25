# G3 Search Engine

A modern, dark-themed search engine interface using Brave Search API.

## Features
- Clean, modern dark theme interface
- Real-time search results using Brave Search API
- Responsive design
- Keyboard-friendly (Enter key support)

## AI Chatbot Feature

The project includes an AI chatbot powered by Ollama using the Llama 2 model. The chatbot provides an interactive interface for users to ask questions and receive AI-generated responses.

### Prerequisites
- [Node.js](https://nodejs.org/)
- [Ollama](https://ollama.ai/download)

### Setting up the Chatbot

1. Install Ollama from https://ollama.ai/download

2. Pull the Llama 2 model:
```bash
ollama pull llama2
```

3. Start the Node.js server:
```bash
node server.js
```

4. Open `chatbot.html` in your browser or navigate to the chatbot page through the main interface.

### Features
- Real-time chat interface
- Letter-by-letter typing animation for responses
- Error handling and loading states
- Navigation between search, image search, and chatbot features
- Responsive design with glowing blue aesthetic

### Note
The chatbot requires Ollama to be running locally on your machine. This is a local-only feature and requires additional setup for web deployment.

## Setup
1. Clone this repository
2. Replace the API key in `script.js` with your Brave Search API key
3. Open `index.html` in your browser


## Technologies Used
- HTML5
- CSS3
- JavaScript (ES6+)
- Brave Search API 

REQUEST TEMP ACCESS AT CORS DEMO SERVER: https://cors-anywhere.herokuapp.com/corsdemo WHEN SETTING UP
