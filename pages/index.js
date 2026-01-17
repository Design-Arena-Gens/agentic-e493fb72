import { useEffect, useRef, useState } from 'react';

const initialMessages = [
  {
    id: 'welcome',
    role: 'assistant',
    text: 'Hello! I am Nova, your conversational companion. How can I brighten your day?'
  }
];

export default function Home() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      text: trimmed
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const botMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        text: data.reply
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const botMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        text: 'I hit a snag reaching the server, but we can keep chatting! Try again in a moment.'
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    void sendMessage();
  };

  return (
    <main className="page">
      <section className="chat-shell">
        <header>
          <div className="indicator" />
          <div>
            <h1>Nova</h1>
            <p>Your always-on conversational co-pilot</p>
          </div>
        </header>

        <div className="messages" ref={listRef}>
          {messages.map((message) => (
            <article key={message.id} className={`message ${message.role}`}>
              <div className="avatar" aria-hidden>
                {message.role === 'assistant' ? '🤖' : '🙂'}
              </div>
              <p>{message.text}</p>
            </article>
          ))}
          {isLoading && (
            <article className="message assistant">
              <div className="avatar" aria-hidden>
                🤖
              </div>
              <p className="typing">
                <span />
                <span />
                <span />
              </p>
            </article>
          )}
        </div>

        <form className="composer" onSubmit={handleSubmit}>
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask me anything..."
            aria-label="Chat message"
            autoComplete="off"
          />
          <button type="submit" disabled={!input.trim() || isLoading}>
            {isLoading ? 'Sending' : 'Send'}
          </button>
        </form>
      </section>

      <style jsx>{`
        .page {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 24px;
        }

        .chat-shell {
          width: min(960px, 100%);
          height: min(720px, 90vh);
          background: rgba(15, 23, 42, 0.75);
          border: 1px solid rgba(148, 163, 184, 0.2);
          backdrop-filter: blur(16px);
          border-radius: 24px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 22px 45px rgba(15, 23, 42, 0.4);
        }

        header {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 24px;
          border-bottom: 1px solid rgba(148, 163, 184, 0.2);
          background: rgba(15, 23, 42, 0.85);
        }

        .indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #34d399, #059669);
          box-shadow: 0 0 8px rgba(52, 211, 153, 0.75);
        }

        h1 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
        }

        p {
          margin: 0;
        }

        .messages {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .message {
          display: flex;
          gap: 16px;
          align-items: flex-start;
          animation: fadeIn 180ms ease-out;
        }

        .message.user {
          align-self: flex-end;
        }

        .message.user p {
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          color: white;
          border-radius: 16px 16px 4px 16px;
        }

        .message.assistant p {
          background: rgba(148, 163, 184, 0.12);
          border-radius: 16px 16px 16px 4px;
        }

        .message p {
          padding: 12px 16px;
          line-height: 1.6;
          max-width: clamp(260px, 60vw, 480px);
        }

        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(148, 163, 184, 0.12);
          display: grid;
          place-items: center;
          font-size: 20px;
        }

        .composer {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 12px;
          padding: 24px;
          border-top: 1px solid rgba(148, 163, 184, 0.2);
          background: rgba(15, 23, 42, 0.85);
        }

        input {
          border: none;
          border-radius: 999px;
          padding: 14px 20px;
          background: rgba(15, 23, 42, 0.9);
          color: inherit;
          font-size: 1rem;
          box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.25);
        }

        input:focus {
          outline: 2px solid rgba(59, 130, 246, 0.5);
        }

        button {
          border: none;
          border-radius: 999px;
          padding: 14px 28px;
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: transform 120ms ease, box-shadow 120ms ease;
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        button:not(:disabled):hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 24px rgba(37, 99, 235, 0.25);
        }

        .typing {
          display: inline-flex;
          gap: 6px;
        }

        .typing span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(148, 163, 184, 0.6);
          animation: blink 1.1s infinite ease-in-out;
        }

        .typing span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes blink {
          0%, 80%, 100% {
            opacity: 0.2;
          }
          40% {
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 600px) {
          .chat-shell {
            height: 96vh;
            border-radius: 20px;
          }

          .message p {
            max-width: 85vw;
          }
        }
      `}</style>
    </main>
  );
}
