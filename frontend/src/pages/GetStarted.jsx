import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import ChatHistory from "../components/ChatHistory";
import "../styles/getstarted.css";
import arrowBtn from "../assets/arrow_btn.png";

function GetStarted() {
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
    const savedChats = localStorage.getItem("chatHistory");
    if (savedChats) {
      setChats(JSON.parse(savedChats));
    }
  }, []);

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

  const handleSendMessage = (e) => {
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

    // Simulate bot response
    setTimeout(() => {
      const botMessage = {
        id: updatedMessages.length + 1,
        text: "Thank you for providing that information. I'm analyzing your situation. Please provide more details about the emergency.",
        sender: "bot",
        timestamp: new Date()
      };
      const finalMessages = [...updatedMessages, botMessage];
      setMessages(finalMessages);
      updateCurrentChat(finalMessages);
    }, 800);
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
