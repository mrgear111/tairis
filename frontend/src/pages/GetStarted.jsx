import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import ChatHistory from "../components/ChatHistory";
import "../styles/getstarted.css";
import arrowBtn from "../assets/arrow_btn.png";

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

    try {
      const response = await fetch("https://tairis-server-production.up.railway.app/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputValue,
          history: messages // Send previous context
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
            <h1 className="greeting-title">Ready when you are.</h1>
            <form onSubmit={handleSendMessage} className="chat-form centered-form">
              <div className="input-wrapper">
                <span className="plus-icon">+</span>
                <input
                  type="text"
                  className="chat-input"
                  placeholder="Ask anything"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  autoFocus
                />
                <div className="right-icons">
                  <button type="button" className="icon-btn">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 14C14.2091 14 16 12.2091 16 10V4C16 1.79086 14.2091 0 12 0C9.79086 0 8 1.79086 8 4V10C8 12.2091 9.79086 14 12 14Z" fill="currentColor" />
                      <path d="M19 10C19 13.866 15.866 17 12 17C8.13401 17 5 13.866 5 10H3C3 14.5817 6.44772 18.3696 10.875 18.9248V22H13.125V18.9248C17.5523 18.3696 21 14.5817 21 10H19Z" fill="currentColor" />
                    </svg>
                  </button>
                  <button type="submit" className="icon-btn" disabled={!inputValue.trim()}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" fill="currentColor" />
                    </svg>
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
                  <span className="plus-icon">+</span>
                  <input
                    type="text"
                    className="chat-input"
                    placeholder="Ask anything"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  <div className="right-icons">
                    <button type="button" className="icon-btn">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 14C14.2091 14 16 12.2091 16 10V4C16 1.79086 14.2091 0 12 0C9.79086 0 8 1.79086 8 4V10C8 12.2091 9.79086 14 12 14Z" fill="currentColor" />
                        <path d="M19 10C19 13.866 15.866 17 12 17C8.13401 17 5 13.866 5 10H3C3 14.5817 6.44772 18.3696 10.875 18.9248V22H13.125V18.9248C17.5523 18.3696 21 14.5817 21 10H19Z" fill="currentColor" />
                      </svg>
                    </button>
                    <button type="submit" className="icon-btn" disabled={!inputValue.trim()}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" fill="currentColor" />
                      </svg>
                    </button>
                  </div>
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
