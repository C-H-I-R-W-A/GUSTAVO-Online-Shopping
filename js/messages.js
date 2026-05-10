// Messaging system for GUSTAVO Online Shopping

// Message management functions
const MessageSystem = {
    // Send a message from user to admin
    sendMessage: function(messageData) {
        const messages = JSON.parse(localStorage.getItem('messages')) || [];
        
        const message = {
            id: this.generateMessageId(),
            senderId: messageData.senderId,
            senderName: messageData.senderName,
            senderEmail: messageData.senderEmail,
            recipientId: 'admin', // All messages go to admin
            subject: messageData.subject,
            content: messageData.content,
            timestamp: new Date().toISOString(),
            status: 'unread', // unread, read, replied
            type: 'user_to_admin', // user_to_admin, admin_to_user
            replyTo: messageData.replyTo || null
        };
        
        messages.push(message);
        localStorage.setItem('messages', JSON.stringify(messages));
        
        return message;
    },
    
    // Send a reply from admin to user
    sendReply: function(messageData) {
        const messages = JSON.parse(localStorage.getItem('messages')) || [];
        
        const message = {
            id: this.generateMessageId(),
            senderId: messageData.senderId, // admin ID
            senderName: 'Admin',
            senderEmail: 'musagustave64@gmail.com',
            recipientId: messageData.recipientId, // user ID
            subject: messageData.subject,
            content: messageData.content,
            timestamp: new Date().toISOString(),
            status: 'unread',
            type: 'admin_to_user',
            replyTo: messageData.replyTo || null
        };
        
        messages.push(message);
        localStorage.setItem('messages', JSON.stringify(messages));
        
        // Mark original message as replied
        if (messageData.replyTo) {
            this.markMessageAsReplied(messageData.replyTo);
        }
        
        return message;
    },
    
    // Get messages for a specific user
    getUserMessages: function(userId) {
        const messages = JSON.parse(localStorage.getItem('messages')) || [];
        return messages.filter(msg => msg.recipientId === userId && msg.type === 'admin_to_user');
    },
    
    // Get all messages for admin
    getAdminMessages: function() {
        const messages = JSON.parse(localStorage.getItem('messages')) || [];
        return messages.filter(msg => msg.recipientId === 'admin' && msg.type === 'user_to_admin');
    },
    
    // Get unread message count for admin
    getUnreadAdminCount: function() {
        const messages = this.getAdminMessages();
        return messages.filter(msg => msg.status === 'unread').length;
    },
    
    // Get unread message count for user
    getUnreadUserCount: function(userId) {
        const messages = this.getUserMessages(userId);
        return messages.filter(msg => msg.status === 'unread').length;
    },
    
    // Mark message as read
    markAsRead: function(messageId) {
        const messages = JSON.parse(localStorage.getItem('messages')) || [];
        const messageIndex = messages.findIndex(msg => msg.id === messageId);
        
        if (messageIndex > -1) {
            messages[messageIndex].status = 'read';
            localStorage.setItem('messages', JSON.stringify(messages));
        }
    },
    
    // Mark message as replied
    markMessageAsReplied: function(messageId) {
        const messages = JSON.parse(localStorage.getItem('messages')) || [];
        const messageIndex = messages.findIndex(msg => msg.id === messageId);
        
        if (messageIndex > -1) {
            messages[messageIndex].status = 'replied';
            localStorage.setItem('messages', JSON.stringify(messages));
        }
    },
    
    // Delete message
    deleteMessage: function(messageId) {
        const messages = JSON.parse(localStorage.getItem('messages')) || [];
        const filteredMessages = messages.filter(msg => msg.id !== messageId);
        localStorage.setItem('messages', JSON.stringify(filteredMessages));
    },
    
    // Generate unique message ID
    generateMessageId: function() {
        return 'MSG_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },
    
    // Format timestamp
    formatTimestamp: function(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return Math.floor(diff / 60000) + ' minutes ago';
        if (diff < 86400000) return Math.floor(diff / 3600000) + ' hours ago';
        if (diff < 604800000) return Math.floor(diff / 86400000) + ' days ago';
        
        return date.toLocaleDateString();
    }
};

// Export for use in other scripts
window.messageSystem = MessageSystem;
