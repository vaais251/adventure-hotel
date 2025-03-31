/**
 * Adventure Saria Hotel - Simple Chatbot
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Chatbot script loaded');
    
    // Get chatbot elements
    const chatIcon = document.querySelector('.chat-icon');
    const chatbot = document.querySelector('.chatbot');
    const closeChat = document.querySelector('.close-chat');
    const chatInput = document.querySelector('.chat-input input');
    const sendButton = document.querySelector('.chat-input button');
    const chatMessages = document.querySelector('.chat-messages');
    
    console.log('Chatbot elements:', { chatIcon, chatbot, closeChat, chatInput, sendButton, chatMessages });
    
    if (!chatIcon || !chatbot || !closeChat || !chatInput || !sendButton || !chatMessages) {
        console.error('Could not find all required chatbot elements');
        return;
    }
    
    // Simple AI responses
    const responses = {
        greetings: [
            "Hello! How can I assist you with your stay at Adventure Saria?",
            "Welcome! What would you like to know about our hotel or services?",
            "Hi there! I'm your virtual assistant. How may I help you?"
        ],
        rooms: [
            "We offer luxury rooms with mountain views starting at 8,000 PKR per night.",
            "Our accommodations include suites and standard rooms. Would you like to know more?"
        ],
        booking: [
            "You can book directly through our website or call +923144259666.",
            "For reservations, please email booking@adventuresaria.com or use our online system."
        ],
        location: [
            "We're located in the beautiful Gilgit-Baltistan region of Pakistan.",
            "Adventure Saria is nestled in the heart of the mountains with breathtaking views."
        ],
        activities: [
            "We offer trekking, mountain climbing, cultural tours, and more!",
            "Our guided adventures include treks to Nanga Parbat and local village tours."
        ],
        default: [
            "I'm not sure I understand. Could you ask about our rooms, location, or activities?",
            "Feel free to ask about our services, accommodations, or adventure packages."
        ]
    };
    
    // Show/hide chat functionality
    chatIcon.addEventListener('click', function() {
        console.log('Opening chat');
        chatbot.style.display = 'flex';
        setTimeout(() => {
            chatbot.classList.add('active');
            chatIcon.style.display = 'none';
        }, 10);
    });
    
    closeChat.addEventListener('click', function() {
        console.log('Closing chat');
        chatbot.classList.remove('active');
        setTimeout(() => {
            chatbot.style.display = 'none';
            chatIcon.style.display = 'flex';
        }, 300);
    });
    
    // Send message functionality
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            console.log('Sending message:', message);
            
            // Add user message
            const userMessageElement = document.createElement('div');
            userMessageElement.className = 'message user-message';
            userMessageElement.textContent = message;
            chatMessages.appendChild(userMessageElement);
            
            // Clear input
            chatInput.value = '';
            
            // Generate response after a small delay
            setTimeout(() => {
                const botResponse = generateResponse(message);
                
                // Add bot message
                const botMessageElement = document.createElement('div');
                botMessageElement.className = 'message bot-message';
                botMessageElement.textContent = botResponse;
                chatMessages.appendChild(botMessageElement);
                
                // Scroll to bottom
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 500);
            
            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }
    
    // Handle send button click
    sendButton.addEventListener('click', sendMessage);
    
    // Handle enter key
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Generate a simple response
    function generateResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            return getRandomResponse('greetings');
        } else if (message.includes('room') || message.includes('stay') || message.includes('accommodation')) {
            return getRandomResponse('rooms');
        } else if (message.includes('book') || message.includes('reservation') || message.includes('reserve')) {
            return getRandomResponse('booking');
        } else if (message.includes('where') || message.includes('location') || message.includes('address')) {
            return getRandomResponse('location');
        } else if (message.includes('activity') || message.includes('adventure') || message.includes('tour')) {
            return getRandomResponse('activities');
        } else {
            return getRandomResponse('default');
        }
    }
    
    // Get a random response from category
    function getRandomResponse(category) {
        const options = responses[category];
        return options[Math.floor(Math.random() * options.length)];
    }
    
    console.log('Chatbot initialized');
});
