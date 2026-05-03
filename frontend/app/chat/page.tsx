"use client";

import nextDynamic from "next/dynamic";

const ChatBox = nextDynamic(() => import("../../components/ChatBox").then(m => m.ChatBox), { 
  ssr: false,
  loading: () => <div className="h-[600px] w-full flex items-center justify-center bg-white/40 rounded-3xl animate-pulse">Loading AI Assistant...</div>
});
import { useChat } from "../../hooks/useChat";



export default function ChatPage() {
  const { messages, isLoading, error, sendMessage, sendImage } = useChat();

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">BallotBuddy AI Assistant</h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Ask anything about Indian elections or upload a photo of your voter document for instant analysis.
        </p>
      </div>
      
      <ChatBox 
        messages={messages} 
        onSendMessage={sendMessage} 
        onImageUpload={sendImage}
        isLoading={isLoading} 
        error={error} 
      />
    </div>
  );
}
