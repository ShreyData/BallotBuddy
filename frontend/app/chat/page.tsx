"use client";
import { useChat } from "../../hooks/useChat";
import { ChatBox } from "../../components/ChatBox";

export default function ChatPage() {
  const { messages, isLoading, error, sendMessage } = useChat();

  return (
    <div className="flex flex-col items-center">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">AI Election Assistant</h1>
        <p className="text-gray-600">Ask anything about voting, candidates, or election rules.</p>
      </div>
      <ChatBox 
        messages={messages} 
        onSendMessage={sendMessage} 
        isLoading={isLoading} 
        error={error} 
      />
    </div>
  );
}
