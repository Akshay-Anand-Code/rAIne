import { useState, useRef, useEffect, useMemo } from 'react';
import { Send, Terminal, Globe } from 'lucide-react';
import { getChatResponse } from '../services/openai';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const createHeart = (x, y) => {
      const heart = document.createElement('div');
      heart.innerHTML = '❤️'; // You can also use '♥' for a simpler heart
      heart.className = 'heart-cursor';
      heart.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        z-index: 9999;
        font-size: 14px;
        color: #ff0000;
        text-shadow: 0 0 5px rgba(255, 0, 0, 0.5);
        animation: float-away 1s forwards;
      `;
      
      document.body.appendChild(heart);

      setTimeout(() => {
        heart.remove();
      }, 1000);
    };

    const handleMouseMove = (e) => {
      createHeart(e.clientX, e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const createDrop = () => {
      const positions = [
        { x: window.innerWidth * 0.05 },  // Keep only far left
        { x: window.innerWidth * 0.95 }   // Keep only far right
      ];
      
      const newDrops = positions.flatMap(position => {
        const count = 1 + Math.random() * 2; // 1-3 drops per position
        return Array.from({ length: count }, () => ({
          id: Math.random(),
          x: position.x + (Math.random() * 10 - 5),
          y: 0,
          speed: 2 + Math.random() * 2,
          opacity: 0.8 + Math.random() * 0.2,
          width: 1 + Math.random() * 2
        }));
      });
      
      setDrops(prev => [...prev, ...newDrops]);
      
      // Remove drops when they reach bottom
      setTimeout(() => {
        newDrops.forEach(drop => {
          setDrops(prev => prev.filter(d => d.id !== drop.id));
        });
      }, 8000); // Longer duration for full screen travel
    };
    
    const interval = setInterval(createDrop, 100);
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    const animate = () => {
      setDrops(prev => prev.map(drop => ({
        ...drop,
        y: drop.y + drop.speed,
        opacity: drop.y > window.innerHeight ? 0 : drop.opacity
      })));
      requestAnimationFrame(animate);
    };
    
    const animation = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animation);
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = { user: 'User', text: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await getChatResponse(inputMessage);
      setMessages(prev => [...prev, {
        user: 'rAIne',
        text: response
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        user: 'System', 
        text: error.message 
      }]);
    }

    setInputMessage('');
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-gray-900 flex flex-col items-center overflow-hidden">
      <div className="absolute inset-0 flex bg-black">
        <div className="w-full h-full flex items-center justify-center">
          <img
            src="/raine.gif"
            alt="Background"
            className="h-full w-auto max-w-none"
            style={{ 
              opacity: 0.8,
            }}
          />
        </div>
      </div>
      
      <div className="w-[90%] max-w-2xl mt-8 mb-4 z-10">
        <h1 className="text-4xl font-bold text-white text-center mb-6 tracking-wider"
            style={{ 
              fontFamily: 'OctoberCrow, monospace',
              textShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
            }}>
          rAIne
        </h1>
        
        <div className="flex justify-center gap-8 mb-2">
          
          
          

          <a href="https://t.me/RaineAI_Sol" 
             target="_blank" 
             rel="noopener noreferrer"
             className="text-green-500 hover:text-green-400 transition-colors">
            <img 
              src="/telegram.PNG"
              alt="Telegram"
              className="w-8 h-8 hover:opacity-80 transition-opacity"
              style={{ 
                filter: 'sepia(100%) hue-rotate(-50deg) saturate(200%) brightness(0.8)',
                boxShadow: '0 0 10px rgba(255, 0, 0, 0.5)'
              }}
            />
          </a>
          
          <a href="https://pump.fun/coin/3dP59LLLuzWop3e2Zk5K12GY6w5wZekCLBLqs9g3pump" 
             target="_blank" 
             rel="noopener noreferrer"
             className="text-green-500 hover:text-green-400 transition-colors">
            <img 
              src="/pump.PNG"
              alt="pump fun"
              className="w-8 h-8 hover:opacity-80 transition-opacity"
              style={{ 
                filter: 'sepia(100%) hue-rotate(-50deg) saturate(200%) brightness(0.8)',
                boxShadow: '0 0 10px rgba(255, 0, 0, 0.5)'
              }}
            />
          </a>
        </div>
      </div>
      
      <div className="relative w-[90%] max-w-2xl h-[70vh] bg-black/90 rounded-lg border border-red-500 
                    shadow-lg shadow-red-500/20 overflow-hidden backdrop-blur-sm z-10">
        <div className="absolute top-0 left-0 right-0 bg-red-900/20 p-2 border-b border-red-500 flex items-center">
          <Terminal className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-500 font-mono text-sm">CA: 3dP59LLLuzWop3e2Zk5K12GY6w5wZekCLBLqs9g3pump </span>
        </div>

        <div className="h-full pt-12 pb-16 flex flex-col">
          <div 
            className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-red-500 scrollbar-track-gray-900 relative"
            style={{
              position: 'relative',
            }}
          >
            <div
              className="absolute inset-0 -z-10"
              style={{
                backgroundImage: 'url(/raine.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundBlendMode: 'overlay',
                filter: 'blur(2px)',
                opacity: 0.5
              }}
            />
            
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-3 rounded backdrop-blur-sm w-full ${
                  message.user === 'User'
                    ? 'bg-red-500/10 border border-red-500 text-right'
                    : 'bg-black/80 border border-red-500/50 text-left'
                }`}
              >
                <div className={`font-mono text-sm mb-1 ${
                  message.user === 'User' ? 'text-gray-200' : 'text-red-300'
                }`}>
                  {message.user === 'User' ? '> User' : '$ rAIne'}
                </div>
                <div className={`font-mono break-words ${
                  message.user === 'User' ? 'text-white' : 'text-red-500'
                }`}>
                  {message.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="p-3 rounded bg-black/80 border border-red-500/50 max-w-[80%]">
                <div className="font-mono text-sm text-red-300 mb-1">$ System</div>
                <div className="font-mono text-red-500 animate-pulse">Processing request...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-red-500 bg-black/90">
            <form onSubmit={sendMessage} className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Talk with rAIne..."
                className="flex-1 p-2 rounded bg-black/80 border border-red-500/50 
                         text-red-500 placeholder-red-700 font-mono text-sm
                         focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="p-2 bg-red-500/10 border border-red-500 text-red-500 
                         rounded hover:bg-red-500/20 disabled:opacity-50 
                         disabled:hover:bg-red-500/10 transition-colors duration-200"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;