const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const OpenAI = require('openai'); // ✅ openai@4 syntax

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

app.use(cors());

io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);

  socket.on('send_message', async (data) => {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful AI study assistant.' },
          { role: 'user', content: data.message }
        ]
      });

      const aiMessage = response.choices[0].message.content;
      socket.emit('receive_message', { message: aiMessage });

    } catch (error) {
      console.error('❌ OpenAI error:', error);
      socket.emit('receive_message', { message: 'Sorry, there was an error from AI.' });
    }
  });

  socket.on('disconnect', () => {
    console.log('🔌 User disconnected:', socket.id);
  });
});

const PORT = 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
