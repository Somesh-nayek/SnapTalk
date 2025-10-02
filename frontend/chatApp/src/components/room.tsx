import { useRef, KeyboardEvent, useState, useEffect } from "react";
import { Messages } from "./MessagesCard";
import { useWebSocket } from "../constants/useWebSocket";
import { SendButton } from "../assets/sendButton";
import { Copy } from "../assets/copy";
export const Room = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { messages, sendMessage, code } = useWebSocket();
  const [copied, setCopied] = useState<boolean>(false);
  const copyToClipboard = async () => {
    try {
      if (code.current === null) {
        return;
      }
      await navigator.clipboard.writeText(code.current);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 sec
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };
  const SendMessage = () => {
    if (!inputRef.current || inputRef.current.value.trim() === "") return;
    const message = inputRef.current.value.trim();
    sendMessage({
      type: "message",
      payload: { roomCode: code.current, message: message },
    });
    console.log("Message sent:", message);
    inputRef.current.value = "";
    inputRef.current.focus();
  };
  const handle = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      SendMessage();
    }
  };
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  return (
    <div className="flex flex-col items-center justify-center gap-2 bg-slate-900 text-white w-screen h-screen">
      <div>
        <h1 className="font-bold text-2xl font-mono cursor-copy flex gap-2 justify-center items-center">
          Room code - {code.current}
          <button
            className="relative text-sm text-gray-300 rounded flex justify-center items-center w-[40px]"
            onClick={copyToClipboard}
          >
            {copied ? (
              <span className="absolute left-5 whitespace-nowrap">Copied!</span>
            ) : (
              <Copy />
            )}
          </button>
        </h1>

        <div className="flex justify-center items-center text-sm font-light">
          Share it with your friend to chat
        </div>
      </div>
      <div className="min-w-xl min-h-[600px] rounded-2xl bg-slate-800 p-2.5 flex flex-col justify-end">
        <div
          ref={messagesEndRef}
          className="flex flex-col gap-4 py-4 h-[520px] overflow-y-auto justify-end" 
        >
          <Messages messages={messages} />
        </div>
        <div className="w-full flex justify-between items-center">
          <input
            ref={inputRef}
            type="text"
            className="border-2 p-2 w-[90%] flex justify-center items-center"
            placeholder="Your Message"
            onKeyDown={handle}
          />
          <div
            onClick={SendMessage}
            className="rounded-md p-2 w-[10%] flex justify-center items-center cursor-pointer"
          >
            <SendButton />
          </div>
        </div>
      </div>
    </div>
  );
};
