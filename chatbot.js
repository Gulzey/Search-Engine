document.addEventListener('DOMContentLoaded', () => {
    const chatContainer = document.getElementById('chatContainer');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const loading = document.getElementById('loading');
    const initialMessage = document.getElementById('initial-message');

    // Function to type out text letter by letter
    function typeText(element, text, speed = 30) {
        let currentIndex = 0;
        const typeMessage = () => {
            if (currentIndex < text.length) {
                element.textContent += text[currentIndex];
                currentIndex++;
                chatContainer.scrollTop = chatContainer.scrollHeight;
                setTimeout(typeMessage, speed);
            }
        };
        typeMessage();
    }

    // Show initial message with typing effect
    const welcomeMessage = "Hi! I'm your AI assistant. How can I help you today?";
    typeText(initialMessage, welcomeMessage);

    // Function to add a message to the chat
    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        
        if (isUser) {
            messageDiv.textContent = message;
        } else {
            typeText(messageDiv, message);
        }
    }

    // Function to handle sending messages
    async function sendMessage() {
        const message = userInput.value.trim();
        
        if (!message) return;
        
        // Add user message to chat
        addMessage(message, true);
        userInput.value = '';
        
        // Show loading indicator
        loading.classList.add('active');
        
        try {
            // Call our Llama 2 API endpoint
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message })
            });

            // Hide loading indicator
            loading.classList.remove('active');

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error Response:', errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('API Response:', data);
            
            // Add AI response to chat
            if (data && data.response) {
                addMessage(data.response);
            } else {
                console.error('Unexpected API response format:', data);
                addMessage('Sorry, I received an unexpected response format. Please try again.');
            }
        } catch (error) {
            console.error('Error details:', error);
            loading.classList.remove('active');
            addMessage(`Sorry, I encountered an error: ${error.message}. Please try again.`);
        }
    }

    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}); 