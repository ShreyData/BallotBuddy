import { useState } from "react";
import { apiService } from "../services/api";
import { AIQueryResponse } from "../types/api";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
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
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      setError(err.message || "Failed to get a response.");
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, isLoading, error, sendMessage };
}
