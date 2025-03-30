// Chatbot functionality for Adventure Saria Hotel

document.addEventListener('DOMContentLoaded', function() {
    // Chat responses database
    const responses = {
        greetings: [
            "Hello! Welcome to Adventure Saria Hotel. How can I help you today?",
            "Hi there! Thanks for reaching out. What can I assist you with?",
            "Welcome to Adventure Saria! I'm your virtual assistant. How may I help you?"
        ],
        rooms: [
            "We offer several types of rooms including Luxury Suites, Deluxe Rooms, and Standard Rooms. All rooms feature stunning mountain views, premium bedding, and modern amenities. Would you like to know more about a specific room type?",
            "Our accommodations range from cozy Standard Rooms to spacious Luxury Suites with private balconies. Each room is designed with both comfort and local aesthetics in mind."
        ],
        booking: [
            "You can book a room directly through our website's booking page, call us at +923144259666, or send us an email at booking@adventuresaria.com. Would you like me to provide more details about any of these options?",
            "Booking is easy! You can use our online reservation system, contact us via WhatsApp, or email us at booking@adventuresaria.com. What's your preferred method?"
        ],
        location: [
            "Adventure Saria Hotel is located in the beautiful Gilgit-Baltistan region of Pakistan, surrounded by majestic mountains and scenic landscapes. Our exact address is [Hotel Address], and we're approximately [X] km from Gilgit Airport.",
            "We're nestled in the heart of Gilgit-Baltistan, Pakistan. Our location offers breathtaking views of the surrounding mountains and easy access to popular trekking routes. Would you like directions from a specific location?"
        ],
        activities: [
            "We offer various adventure activities including trekking, mountain climbing, cultural tours, jeep safaris, and fishing expeditions. All activities are led by experienced local guides. Which activity interests you the most?",
            "There's plenty to do at Adventure Saria! Popular activities include guided treks to nearby peaks, cultural tours to local villages, photography excursions, and relaxing nature walks. We can customize activities based on your preferences."
        ],
        dining: [
            "Our restaurant serves authentic local Gilgit-Baltistani cuisine as well as international dishes. We use fresh, locally sourced ingredients, and can accommodate dietary restrictions. Would you like to see our menu?",
            "At Adventure Saria, we pride ourselves on our diverse dining options. Our restaurant offers traditional Pakistani dishes, regional specialties from Gilgit-Baltistan, and international cuisine. Our chef can also prepare meals according to dietary needs."
        ],
        weather: [
            "The weather in Gilgit-Baltistan varies by season. Summers (June-August) are pleasant with temperatures between 15-30°C. Winters (November-February) are cold with temperatures often below freezing. Spring and autumn offer mild temperatures ideal for outdoor activities.",
            "Gilgit-Baltistan has distinct seasons. Currently, we're experiencing [current season] with typical temperatures between [temperature range]. The best time to visit for outdoor activities is from May to October."
        ],
        transportation: [
            "You can reach us by air (flights to Gilgit Airport), by road from Islamabad (approximately 12-15 hours), or we can arrange private transportation for you. Would you like information on any specific transportation option?",
            "There are several ways to reach Adventure Saria. You can fly to Gilgit Airport and we'll arrange a pickup, take a scenic drive from Islamabad, or use public transportation. We're happy to help arrange your journey."
        ],
        amenities: [
            "Our hotel amenities include free Wi-Fi, room service, laundry service, guided tours, a restaurant serving local and international cuisine, a cozy lounge area, and private parking. Is there a specific amenity you're interested in?",
            "Adventure Saria offers comprehensive amenities including high-speed internet, daily housekeeping, airport transfers, tour planning services, and in-house dining. We also have equipment rental for various outdoor activities."
        ],
        packages: [
            "We offer several packages including the 'Adventure Package' (accommodation + trekking), 'Cultural Immersion Package' (accommodation + cultural tours), and 'Relaxation Package' (accommodation + spa services). Would you like details on any of these?",
            "Our popular packages include weekend getaways, week-long adventure trips, honeymoon specials, and family vacation bundles. Each package can be customized to your preferences. Would you like to know pricing for any specific package?"
        ],
        default: [
            "I don't have that specific information, but I'd be happy to connect you with our staff who can answer your question in detail. Would you like to contact us via WhatsApp or email?",
            "That's a great question! While I don't have the complete details, our reception staff would be happy to help you with this. You can reach them at +923144259666.",
            "I'm still learning about that. For the most accurate information, please contact our hotel directly through WhatsApp or email at info@adventuresaria.com."
        ]
    };

    // Find or add the chatbot elements to the page
    function initChatbot() {
        // Check if chatbot elements already exist
        if (document.querySelector('.chat-container')) {
            return;
        }

        // Create chatbot button
        const chatbotButton = document.createElement('div');
        chatbotButton.className = 'chatbot-btn';
        chatbotButton.innerHTML = '<i class="fas fa-comments"></i>';
        document.body.appendChild(chatbotButton);

        // Create chat container
        const chatContainer = document.createElement('div');
        chatContainer.className = 'chat-container';
        chatContainer.innerHTML = `
            <div class="chat-header">
                <h3>Adventure Saria Assistant</h3>
                <div class="chat-close">&times;</div>
            </div>
            <div class="chat-messages">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
            <div class="chat-input-container">
                <textarea class="chat-input" placeholder="Type your question here..." rows="1"></textarea>
                <button class="chat-send">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        `;
        document.body.appendChild(chatContainer);

        // Add event listeners
        chatbotButton.addEventListener('click', toggleChat);
        document.querySelector('.chat-close').addEventListener('click', toggleChat);
        document.querySelector('.chat-send').addEventListener('click', sendMessage);
        
        const chatInput = document.querySelector('.chat-input');
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
            
            // Auto resize textarea
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
        
        // Show welcome message
        setTimeout(() => {
            addBotMessage(getRandomResponse('greetings'));
        }, 500);
    }

    function toggleChat() {
        const chatContainer = document.querySelector('.chat-container');
        chatContainer.classList.toggle('active');
        
        // If opening chat, focus input
        if (chatContainer.classList.contains('active')) {
            setTimeout(() => {
                document.querySelector('.chat-input').focus();
            }, 300);
        }
    }

    function sendMessage() {
        const chatInput = document.querySelector('.chat-input');
        const message = chatInput.value.trim();
        
        if (message === '') {
            return;
        }
        
        // Add user message to chat
        addUserMessage(message);
        chatInput.value = '';
        chatInput.style.height = 'auto';
        
        // Show typing indicator
        const typingIndicator = document.querySelector('.typing-indicator');
        typingIndicator.style.display = 'flex';
        
        // Process message and generate response
        setTimeout(() => {
            typingIndicator.style.display = 'none';
            const response = generateResponse(message);
            addBotMessage(response);
        }, 1000 + Math.random() * 1000); // Random delay to simulate thinking
    }

    function addUserMessage(message) {
        const chatMessages = document.querySelector('.chat-messages');
        const messageElement = document.createElement('div');
        messageElement.className = 'message user-message';
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        scrollToBottom();
    }

    function addBotMessage(message) {
        const chatMessages = document.querySelector('.chat-messages');
        const messageElement = document.createElement('div');
        messageElement.className = 'message bot-message';
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        scrollToBottom();
    }

    function scrollToBottom() {
        const chatMessages = document.querySelector('.chat-messages');
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function generateResponse(message) {
        message = message.toLowerCase();
        
        // Check for keywords in the message
        if (containsAny(message, ['hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'])) {
            return getRandomResponse('greetings');
        } else if (containsAny(message, ['room', 'accommodation', 'stay', 'suite', 'lodging'])) {
            return getRandomResponse('rooms');
        } else if (containsAny(message, ['book', 'reservation', 'reserve', 'booking'])) {
            return getRandomResponse('booking');
        } else if (containsAny(message, ['where', 'location', 'address', 'place', 'situated', 'find'])) {
            return getRandomResponse('location');
        } else if (containsAny(message, ['activity', 'adventure', 'trek', 'hike', 'tour', 'climb', 'do'])) {
            return getRandomResponse('activities');
        } else if (containsAny(message, ['food', 'eat', 'restaurant', 'dining', 'meal', 'breakfast', 'lunch', 'dinner'])) {
            return getRandomResponse('dining');
        } else if (containsAny(message, ['weather', 'climate', 'temperature', 'season', 'rain', 'snow'])) {
            return getRandomResponse('weather');
        } else if (containsAny(message, ['transport', 'transportation', 'travel', 'reach', 'get there', 'arrive'])) {
            return getRandomResponse('transportation');
        } else if (containsAny(message, ['amenity', 'facilities', 'service', 'feature', 'offer', 'provide', 'wifi', 'internet'])) {
            return getRandomResponse('amenities');
        } else if (containsAny(message, ['package', 'deal', 'offer', 'special', 'discount', 'price', 'cost', 'rate'])) {
            return getRandomResponse('packages');
        } else {
            return getRandomResponse('default');
        }
    }

    function containsAny(str, keywords) {
        return keywords.some(keyword => str.includes(keyword));
    }

    function getRandomResponse(category) {
        const responseList = responses[category] || responses.default;
        return responseList[Math.floor(Math.random() * responseList.length)];
    }

    // Initialize the chatbot
    initChatbot();
});
