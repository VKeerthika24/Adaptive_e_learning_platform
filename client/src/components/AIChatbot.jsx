import { useState } from 'react';
import { api } from '../services/api';
import '../styles/AIChatbot.css';

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Hi 👋 I am your AI English Tutor. Ask me about grammar, IELTS, TOEFL, or essays.'
    }
  ]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');

    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);

    try {
      const res = await api('/chat', 'POST', { message: userMsg });

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: res.reply }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: '⚠️ AI is busy. Try again.' }
      ]);
    }
  };

  return (
    <>
      {!open && (
        <button className="chatbot-fab" onClick={() => setOpen(true)}>
          🤖
        </button>
      )}

      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <span>AI English Tutor</span>
            <button className="close-icon" onClick={() => setOpen(false)}>
              ✖
            </button>
          </div>

          <div className="chatbot-body">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.role}`}>
                {msg.content}
              </div>
            ))}
          </div>

          <div className="chatbot-input">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Ask about grammar, IELTS, essays…"
            />
            <button onClick={sendMessage}>➤</button>
          </div>
        </div>
      )}
    </>
  );
}
