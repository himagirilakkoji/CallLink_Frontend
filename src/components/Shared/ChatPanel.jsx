import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Form, Button } from 'react-bootstrap';
import {ChatMessage} from '../Shared/Models/chartMsg';
import * as apiService from '../../services/userService';
import { useLocation } from 'react-router-dom';
import { startConnection, sendMessageSignalR } from '../../services/userService';

const ChatPanel = ({ receiver }) => {
  const { register, handleSubmit, reset } = useForm();
  const [messages, setMessages] = useState([]);
  const [selectedReceiver, setSelectedReceiver] = useState(null);
  const [senderId, setSenderId] = useState(null);
  const location = useLocation();

// 🟨 Get senderId from logged-in user email (passed via state)
  useEffect(() => {
    const fetchSenderId = async () => {
      const email = location.state?.email;
      if (!email) return;

      const response = await apiService.getUser(email); // assume it returns { id, username, ... }
      if (response && response.success) {
        setSenderId(response.id);
        const hubConn = await startConnection(response.id);

        // Register receive message listener
        hubConn.on('ReceiveMessage',  async (connectionId, message) => {
          if (message != null) {
            console.log("Received:", message);
            const data = await apiService.fetchMessagesBetweenUsers(message.senderId, message.receiverId);
            const mapped = data.map(
              m => new ChatMessage(m.id, m.senderId, m.receiverId, m.content, m.timestamp)
            );
            setMessages(mapped);
          }
        });

      }
    };

    fetchSenderId();
  }, [location.state]);

  // 🟨 Set selected receiver (when user clicks from sidebar)
  useEffect(() => {
    if (receiver) {
      setSelectedReceiver(receiver);
    }
  }, [receiver]);

    // 🟨 When receiver changes, fetch messages between sender & receiver
  useEffect(() => {
    const loadConversation = async () => {
      if (!senderId || !receiver) return;

      setSelectedReceiver(receiver);

      const data = await apiService.fetchMessagesBetweenUsers(senderId, receiver.id);
      const mapped = data.map(
        m => new ChatMessage(m.id, m.senderId, m.receiverId, m.content, m.timestamp)
      );
      setMessages(mapped);
    };

    loadConversation();
  }, [receiver, senderId]);

  // 🟨 Send message
  const onSubmit = async (data) => {
    if (data.message.trim()) {
      const rawMessage = {
        senderId, // example senderId
        receiverId:selectedReceiver.id, // example receiverId
        content: data.message,
        timestamp: new Date().toISOString()
      };

      const saved =await apiService.sendMessage(rawMessage); // response should include id, etc.
      await sendMessageSignalR(saved); // 🔁 Real-time push
      // 🔁 Refresh conversation after sending
      const updatedMessages = await apiService.fetchMessagesBetweenUsers(senderId, selectedReceiver.id);
      const mapped = updatedMessages.map(
        m => new ChatMessage(m.id, m.senderId, m.receiverId, m.content, m.timestamp)
      );
      setMessages(mapped);
      reset();
    }
  };

   // 🟩 Check if a message is sent by the logged-in user
  const isSentByUser = (msg) => msg.senderId === senderId;

  return (
    <div className="p-0 flex-grow-1 d-flex flex-column h-100">

      {/* 🟩 Top Chat Header */}
      <div className="bg-white px-4 py-3 border-bottom">
        <h5 className="mb-0">{selectedReceiver?.userName || 'No user selected'}</h5>
      </div>

      {/* 🟩 Message List */}
      <div className="flex-grow-1 overflow-auto p-3 bg-light">
        {messages.length === 0 && (
          <div className="text-muted">No messages yet. Start the conversation!</div>
        )}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`d-flex mb-2 ${isSentByUser(msg) ? 'justify-content-end' : 'justify-content-start'}`}
          >
            <div
              className="p-2 px-3 rounded shadow-sm"
              style={{
                background: isSentByUser(msg)
                  ? '#505AC9'
                  : '#f1f0f0',
                color: isSentByUser(msg) ? 'white' : 'black',
                maxWidth: '70%',
                wordBreak: 'break-word',
                borderRadius: '1rem',
              }}
            >
              <div style={{ fontSize: '0.95rem' }}>{msg.content}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 🟩 Message Input */}
      <div className="px-3 py-2 bg-white">
        <Form className="d-flex gap-2" onSubmit={handleSubmit(onSubmit)}>
          <Form.Control
            type="text"
            placeholder="Type a message"
            {...register('message')}
          />
          <Button variant="primary" type="submit">
            Send
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default ChatPanel;