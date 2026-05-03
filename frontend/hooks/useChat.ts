import { useState } from "react";
import { apiService } from "../services/api";
import { AIQueryResponse } from "../types/api";

export interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  reasoning?: string;
  confidence?: number;
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (question: string) => {
    if (!question.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), role: "user", content: question };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response: AIQueryResponse = await apiService.askAI(question);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: response.answer,
        reasoning: response.reasoning,
        confidence: response.confidence_score,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to get a response.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const sendImage = async (file: File) => {
    const userMessage: Message = { 
      id: Date.now().toString(), 
      role: "user", 
      content: `Uploaded an image: ${file.name}` 
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.analyzeVoterSlip(file);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: response.analysis,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to analyze image.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, isLoading, error, sendMessage, sendImage };
}
