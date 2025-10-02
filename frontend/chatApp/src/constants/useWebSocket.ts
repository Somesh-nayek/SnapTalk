import { createContext,  RefObject, useContext } from "react";
import { messageProp, Prop } from "../components/ws";
interface WebSocketContextType {
    messages: messageProp[];
    sendMessage: (input:Prop) => void;
    code: RefObject<string | null>;
}
export const WebSocketContext = createContext<WebSocketContextType | null>(null);
export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};
