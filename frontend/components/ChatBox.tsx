import { InputBox } from "./InputBox";
import { Loader } from "./Loader";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
}

interface ChatBoxProps {
  messages: Message[];
  onSendMessage: (msg: string) => void;
  isLoading: boolean;
  error: string | null;
}

export function ChatBox({ messages, onSendMessage, isLoading, error }: ChatBoxProps) {
  return (
    <div className="flex flex-col bg-white rounded-xl shadow-md border overflow-hidden max-w-3xl w-full mx-auto h-[600px]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4" role="log" aria-live="polite">
        {messages.length === 0 && !isLoading && (
          <div className="text-center text-gray-500 mt-10">Start a conversation to get election guidance!</div>
        )}
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] p-3 rounded-xl ${msg.role === "user" ? "bg-blue-600 text-white rounded-br-none" : "bg-gray-100 text-gray-800 rounded-bl-none"}`}>
              {msg.content}
            </div>
          </div>
        ))}
        
        {isLoading && <Loader />}
        
        {error && (
          <div className="p-3 text-red-700 bg-red-100 rounded-xl max-w-[80%]" role="alert">
            {error}
          </div>
        )}
      </div>
      
      <div className="p-4 border-t bg-gray-50">
        <InputBox onSubmit={onSendMessage} isLoading={isLoading} placeholder="Ask about elections..." />
      </div>
    </div>
  );
}
