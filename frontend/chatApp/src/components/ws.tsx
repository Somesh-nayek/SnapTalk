import {
  ReactNode,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { WebSocketContext } from "../constants/useWebSocket";
import { useNavigate } from "react-router-dom";

export type messageProp = {
  message: string;
  send: boolean;
};

export type Prop = {
  type: string;
  payload?: {
    roomCode: string | null;
    message?: string;
  };
};

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const socketRef = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<messageProp[]>([]);
  const code = useRef<string | null>(null);
  
  const navigate = useNavigate();
  const stableNavigate = useCallback(navigate, [navigate]);
  
  useEffect(() => {
    if (!socketRef.current) {
      const wsUrl=import.meta.env.VITE_WS_URL || "ws://localhost:8080";
      socketRef.current = new WebSocket(wsUrl);
      console.log(`Connecting to WebSocket server at: ${wsUrl}`);

      socketRef.current.onopen = () => console.log("WebSocket Connected");

      socketRef.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        
        if (message.type === "roomCode") {
          console.log("Room code received", message.payload.code);
          code.current = message.payload.code;
          stableNavigate("/room"); // ✅ Using stable navigate
        } else if (message.type === "invalidRoomCode") {
          alert("Invalid room code. Please try again.");
          stableNavigate("/");
        } else if (message.type === "joinedRoom") {
          console.log("Room joined successfully", message.payload.code);
          code.current = message.payload.code;
          stableNavigate("/room");
        } else if (message.type === "message") {
          setMessages((prevMessages) => [
            ...prevMessages,
            { message: message.payload.message, send: false },
          ]);
        } else {
          console.warn("Unknown message type:", message);
          stableNavigate("/");
        }
      };

      socketRef.current.onerror = (error) => console.error("WebSocket Error:", error);
      socketRef.current.onclose = () => console.log("WebSocket Disconnected");

      return () => {
        socketRef.current?.close();
      };
    }
  }, [stableNavigate]);

  const sendMessage = (input: Prop) => {
    if (socketRef.current) {
      if (input.type === "message") {
        setMessages((prevMessages) => [
          ...prevMessages,
          { message: input.payload?.message || "", send: true },
        ]);
      }
      socketRef.current.send(JSON.stringify(input));
    }
  };

  return (
    <WebSocketContext.Provider value={{ messages, sendMessage, code }}>
      {children}
    </WebSocketContext.Provider>
  );
};
