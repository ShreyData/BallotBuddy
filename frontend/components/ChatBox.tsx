import { InputBox } from "./InputBox";
import { Loader } from "./Loader";
import { ChevronDown, ChevronUp, BrainCircuit } from "lucide-react";
import { useState } from "react";
import { Message } from "../hooks/useChat";

interface ChatBoxProps {
  messages: Message[];
  onSendMessage: (msg: string) => void;
  onImageUpload?: (file: File) => void;
  isLoading: boolean;
  error: string | null;
}

export function ChatBox({ messages, onSendMessage, onImageUpload, isLoading, error }: ChatBoxProps) {
  return (
    <section className="flex flex-col bg-white/60 backdrop-blur-xl rounded-[32px] shadow-2xl border border-white/20 overflow-hidden max-w-3xl w-full mx-auto h-[600px]" aria-label="AI Chat Assistant">
      <div 
        className="flex-1 overflow-y-auto p-6 space-y-4" 
        role="log" 
        aria-live="polite"
        aria-label="Chat messages"
      >
        {messages.length === 0 && !isLoading && (
          <div className="text-center text-gray-500 mt-10">Start a conversation to get election guidance!</div>
        )}
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div 
              className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                msg.role === "user" 
                  ? "bg-blue-600 text-white rounded-br-none" 
                  : "bg-white text-gray-800 rounded-bl-none border border-gray-100"
              }`}
            >
              <div className="text-sm leading-relaxed">{msg.content}</div>
              
              {msg.role === "ai" && msg.reasoning && (
                <div className="mt-3 pt-3 border-t border-gray-50">
                  <Reasoning reasoning={msg.reasoning} confidence={msg.confidence} />
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && <Loader />}
        
        {error && (
          <div className="p-4 text-red-700 bg-red-50 border border-red-100 rounded-2xl max-w-[80%]" role="alert">
            {error}
          </div>
        )}
      </div>
      
      <div className="p-6 border-t border-gray-100 bg-gray-50/50">
        <InputBox onSubmit={onSendMessage} onImageUpload={onImageUpload} isLoading={isLoading} placeholder="Ask about elections..." />
      </div>
    </section>
  );
}

function Reasoning({ reasoning, confidence }: { reasoning: string, confidence?: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-2">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="ai-reasoning-panel"
        className="flex items-center gap-2 text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors"
      >
        <BrainCircuit className="w-3 h-3" />
        {isOpen ? "Hide AI Reasoning" : "View AI Reasoning"}
        {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>
      
      {isOpen && (
        <div 
          id="ai-reasoning-panel"
          className="bg-blue-50/50 p-3 rounded-xl border border-blue-100/50 animate-in fade-in slide-in-from-top-1 duration-200"
        >
          <p className="text-[11px] text-blue-800 leading-relaxed italic">
            &quot;{reasoning}&quot;
          </p>
          {confidence !== undefined && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-1 bg-blue-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full" 
                  style={{ width: `${confidence * 100}%` }}
                />
              </div>
              <span className="text-[9px] font-black text-blue-600">{Math.round(confidence * 100)}% Confidence</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
