import axios from 'axios';
import * as signalR from '@microsoft/signalr';

const API_BASE_URL = 'https://localhost:7073/api/Auth';
const API_CHAT_URL = 'https://localhost:7073/api/chat';

let connection = null;

export const startConnection = async (userId) => {
  if (connection) return connection;

  connection = new signalR.HubConnectionBuilder()
    .withUrl(`https://localhost:7073/chathub?userId=${userId}`)
    .withAutomaticReconnect()
    .build();

  try {
    await connection.start();
    console.log('SignalR connected');

    return connection;
  } catch (error) {
    console.error('SignalR connection failed:', error);
    connection = null;
  }
};

export const sendMessageSignalR = async (message) => {
  if (connection && connection.state === 'Connected') {
    await connection.invoke('SendMessage', message);
  }
};

export const stopConnection = async () => {
  if (connection) {
    await connection.stop();
    connection = null;
  }
};

export const registerUser = async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, data);
      return response.data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Registration failed" };
    }
  };
  
  export const loginUser = async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, data);
      return response.data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Login failed" };
    }
  };

  export const getUser = async (email) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getUser`, {
        params: { email },
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch user",
      };
    }
  };

  export const getAllUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getAllUser`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch users",
      };
    }
  };

export const fetchMessages = async () => {
  const res = await axios.get(`${API_CHAT_URL}/messages`);
  return res.data;
};

export const sendMessage = async (message) => {
  const res = await axios.post(`${API_CHAT_URL}/send`, message);
  return res.data;
};

export const fetchMessagesBetweenUsers = async (senderId, receiverId) => {
  const res = await axios.get(`${API_CHAT_URL}/betweenUserMessages`, {
    params: { senderId, receiverId }
  });
  return res.data;
};

  


