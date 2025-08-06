import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:5000');

function App() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setChat((prev) => [...prev, { from: 'AI', text: data.message }]);
    });

    return () => socket.disconnect();
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('send_message', { message });
      setChat((prev) => [...prev, { from: 'You', text: message }]);
      setMessage('');
    }
  };
  return (
    <div className="App">
      <h2>AI Study Chat</h2>
      <div className="chat-box">
        {chat.map((msg, i) => (
          <div key={i} className={msg.from === 'You' ? 'user' : 'ai'}>
            <strong>{msg.from}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="input-box">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask something..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
