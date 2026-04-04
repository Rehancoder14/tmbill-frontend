import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { API_BASE } from '../api/client';

const SOCKET_URL = API_BASE; // Backend URL

export const useSocket = (storeId, onNewOrder, onStatusUpdate) => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!storeId) return;

    // Connect to server
    socketRef.current = io(SOCKET_URL, {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      // Join store-specific room
      socket.emit('join_store', storeId);
    });

    socket.on('new_order', (order) => {
      console.log('Real-time: New order received', order);
      if (onNewOrder) onNewOrder(order);
    });

    socket.on('order_status_updated', (order) => {
      console.log('Real-time: Order status updated', order);
      if (onStatusUpdate) onStatusUpdate(order);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket');
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [storeId, onNewOrder, onStatusUpdate]);

  return socketRef.current;
};
