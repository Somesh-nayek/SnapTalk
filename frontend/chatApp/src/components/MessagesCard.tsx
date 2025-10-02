import { Receive } from "../assets/receive";
import { Send } from "../assets/send";
import { messageProp } from "./ws";

export const Messages = (message: { messages: messageProp[] }) => {
  const { messages } = message;
  return (
    <div className="flex flex-col">
      {messages.map((messageObj, index) => (
        <div
          key={index}
          className={`flex items-center ${
            messageObj.send ? "justify-end" : "justify-start"
          }`}
        >
          <div className="flex bg-slate-900 gap-2 font-normal px-3 py-1 rounded-xl items-center justify-center">
          {messageObj.message}
          {messageObj.send ? <Send /> : <Receive />}
          </div>
        </div>
      ))}
    </div>
  );
};
