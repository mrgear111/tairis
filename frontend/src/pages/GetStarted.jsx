import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import ChatHistory from "../components/ChatHistory";
import "../styles/getstarted.css";
import arrowBtn from "../assets/arrow_btn.png";
import { RedFlagDetector } from "../services/RedFlagDetector";
import { ImmediateActionHandler } from "../services/ImmediateActionHandler";

function GetStarted() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm here to help with emergency medical guidance. Please describe your emergency situation.",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [currentChatId, setCurrentChatId] = useState(null);
  const [chats, setChats] = useState([]);
  const messagesEndRef = useRef(null);

  // Load chats from localStorage on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }

    const savedChats = localStorage.getItem("chatHistory");
    if (savedChats) {
      setChats(JSON.parse(savedChats));
    }
  }, [navigate]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const saveChatsToStorage = (updatedChats) => {
    localStorage.setItem("chatHistory", JSON.stringify(updatedChats));
    setChats(updatedChats);
  };

  const createNewChat = (firstMessage) => {
    const newChatId = Date.now();
    const newChat = {
      id: newChatId,
      title: firstMessage.substring(0, 30) + (firstMessage.length > 30 ? "..." : ""),
      messages: [
        {
          id: 1,
          text: "Hello! I'm here to help with emergency medical guidance. Please describe your emergency situation.",
          sender: "bot",
          timestamp: new Date()
        },
        {
          id: 2,
          text: firstMessage,
          sender: "user",
          timestamp: new Date()
        }
      ],
      createdAt: new Date(),
      lastUpdated: new Date()
    };

    const updatedChats = [newChat, ...chats];
    saveChatsToStorage(updatedChats);
    setCurrentChatId(newChatId);
    return newChatId;
  };

  const updateCurrentChat = (updatedMessages) => {
    if (currentChatId) {
      const updatedChats = chats.map(chat =>
        chat.id === currentChatId
          ? { ...chat, messages: updatedMessages, lastUpdated: new Date() }
          : chat
      );
      saveChatsToStorage(updatedChats);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    // Create new chat if this is the first message
    let chatId = currentChatId;
    if (!chatId) {
      chatId = createNewChat(inputValue);
    }

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue("");

    // Update chat in storage
    updateCurrentChat(updatedMessages);

    // Simulate bot response (replaced with real API call)
    // Add a temporary loading message
    const loadingMessageId = Date.now() + 1;
    const loadingMessage = {
      id: loadingMessageId,
      text: "Thinking...",
      sender: "bot",
      timestamp: new Date()
    };
    setMessages(prev => [...prev, loadingMessage]);



    // Check for Red Flags locally first
    if (RedFlagDetector.detect(inputValue)) {
      const reason = RedFlagDetector.getDetectedKeyword(inputValue);
      const immediateResponse = ImmediateActionHandler.handle(reason);
      
      // Simulate bot response with immediate action
      setTimeout(() => {
        setMessages(prev => {
          const filtered = prev.filter(msg => msg.id !== loadingMessageId);
          const botMessage = {
            id: loadingMessageId,
            text: immediateResponse.message,
            sender: "bot",
            timestamp: new Date(),
            isEmergency: true, // Flag for UI styling if needed
            actionData: immediateResponse // Store full JSON for UI to render buttons
          };
          const finalMessages = [...filtered, botMessage];
          updateCurrentChat(finalMessages);
          return finalMessages;
        });
      }, 500); // Fast response
      return; // Stop here, don't call API
    }

    // Prepare context with nearby facilities
    let contextMessage = inputValue;
    const savedFacilities = localStorage.getItem('tairis_nearby_facilities');
    
    if (savedFacilities) {
      try {
        const facilities = JSON.parse(savedFacilities).slice(0, 15); // Increased to Top 15
        const facilityContext = facilities.map(f => 
          `- ${f.name} (${f.type}): ${(f.distance_m/1000).toFixed(1)}km. Services: ${f.services ? f.services.join(', ') : 'N/A'}`
        ).join('\n');

        const systemContext = `
[System Context]
You are Tairis, an emergency medical triage assistant. Your goal is SPEED and SAFETY.
The user is near the following medical facilities:
${facilityContext}

Instructions:
1. Analyze symptoms.
2. If RED FLAG (unconscious, chest pain, etc) -> Recommend CALL EMERGENCY immediately.
3. If user asks for facilities, list ALL relevant ones from the context.
4. Format lists clearly with bullet points.
5. NEVER invent phone numbers.
6. Keep answers short and actionable.
[/System Context]

User Query: ${inputValue}`;
        
        contextMessage = systemContext;
      } catch (e) {
        console.error("Error parsing facility data", e);
      }
    }

    try {
      const response = await fetch("https://tairis-server-production.up.railway.app/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: contextMessage, // Send context in the message field
          history: messages // Send original history without modification
        }),
      });

      const data = await response.json();

      // Remove loading message and add real response
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== loadingMessageId);
        const botMessage = {
          id: loadingMessageId, // Reuse ID or generate new
          text: data.text || "Sorry, I couldn't process that.",
          sender: "bot",
          timestamp: new Date()
        };
        const finalMessages = [...filtered, botMessage];
        updateCurrentChat(finalMessages);
        return finalMessages;
      });

    } catch (err) {
      console.error("Error fetching AI response:", err);
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== loadingMessageId);
        return [...filtered, {
          id: Date.now(),
          text: "Sorry, I'm having trouble connecting to the server.",
          sender: "bot",
          timestamp: new Date()
        }];
      });
    }
  };

  const handleSelectChat = (chat) => {
    if (chat) {
      setCurrentChatId(chat.id);
      setMessages(chat.messages || [
        {
          id: 1,
          text: "Hello! I'm here to help with emergency medical guidance. Please describe your emergency situation.",
          sender: "bot",
          timestamp: new Date()
        }
      ]);
    } else {
      // New chat
      setCurrentChatId(null);
      setMessages([
        {
          id: 1,
          text: "Hello! I'm here to help with emergency medical guidance. Please describe your emergency situation.",
          sender: "bot",
          timestamp: new Date()
        }
      ]);
    }
  };

  const handleDeleteChat = (chatId) => {
    const updatedChats = chats.filter(chat => chat.id !== chatId);
    saveChatsToStorage(updatedChats);

    if (currentChatId === chatId) {
      handleSelectChat(null);
    }
  };

  const [sidebarWidth, setSidebarWidth] = useState(280);
  const isResizing = useRef(false);

  const startResizing = useCallback(() => {
    isResizing.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const stopResizing = useCallback(() => {
    isResizing.current = false;
    document.body.style.cursor = 'default';
    document.body.style.userSelect = 'auto';
  }, []);

  const resize = useCallback((mouseMoveEvent) => {
    if (isResizing.current) {
      const newWidth = mouseMoveEvent.clientX;
      if (newWidth >= 200 && newWidth <= 480) {
        setSidebarWidth(newWidth);
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  return (
    <div className="getstarted-wrapper">
      <div style={{ width: sidebarWidth, flexShrink: 0 }}>
        <ChatHistory
          chats={chats}
          onSelectChat={handleSelectChat}
          onDeleteChat={handleDeleteChat}
          currentChatId={currentChatId}
        />
      </div>
      <div className="resizer" onMouseDown={startResizing} />

      <div className="getstarted-container">
        {messages.length <= 1 ? (
          <div className="empty-state">
            <h1 style={{ color: "#ffffff" }}>Select Your Emergency Type</h1>
            <form onSubmit={handleSendMessage} className="chat-form centered-form">
              <div className="input-wrapper">
                <input
                  type="text"
                  className="chat-input"
                  placeholder="Ask anything"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <div className="right-icons">
                  <button type="submit" className="send-btn-icon">
                    <img src={arrowBtn} alt="Send" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <>
            <div className="chat-container">
              <div className="chat-messages">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`message ${message.sender === "user" ? "user-message" : "bot-message"}`}
                  >
                    <div className="message-content">
                      {message.text}
                    </div>
                    <div className="message-time">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="chat-form bottom-form">
                <div className="input-wrapper">
                  <input
                    type="text"
                    className="chat-input"
                    placeholder="Ask anything"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  <button type="submit" className="send-btn-icon">
                    <img src={arrowBtn} alt="Send" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default GetStarted;
