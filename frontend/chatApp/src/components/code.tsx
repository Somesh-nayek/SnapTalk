import {  useRef } from "react";
import { useWebSocket } from "../constants/useWebSocket";

export const Code = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const {sendMessage}=useWebSocket();
  function newRoom() {
    sendMessage(({type:"newRoom"}));
  }
  function joinRoom() {
    if (!inputRef.current || inputRef.current.value.trim() === "") return;
    const code = inputRef.current.value.trim();
    sendMessage(({ type: "joinRoom", payload: { roomCode: code } }));
  }
  
  return (
    <div className="bg-gray-900 w-screen h-screen flex justify-center items-center">
      <div className="min-w-96 min-h-fit bg-gray-800 rounded-lg p-2">
        <div className="flex text-white border-gray-600 flex-col justify-center items-center border-b-2 p-4">
          <div className="flex flex-col items-center justify-center">
            <div className="text-2xl text-white">Welcome to "The Chat Room"</div>
            <div className="text-sm text-indigo-300">Chat without hesitation</div>
          </div>
        </div>
        <div className="flex flex-col p-4 justify-center items-center text-white gap-4">
          <button
            className="border-2 hover:bg-gray-600 p-2 w-full rounded-lg bg-gray-900"
            onClick={() => {
              newRoom();
            }}
          >
            Create Room
          </button>
          <div className="w-full gap-4 grid grid-cols-5">
            <input
              ref={inputRef}
              className="border-2 placeholder:text-gray-500 p-2 col-span-3"
              placeholder="Enter Code.."
            />
            <button
              className="bg-gray-900 p-2 hover:bg-gray-600 col-span-2 rounded-lg border-2"
              onClick={() => {
                joinRoom();
              }}
            >
              Join room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};