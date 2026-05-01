import React, { useState } from "react";

interface InputBoxProps {
  onSubmit: (text: string) => void;
  placeholder?: string;
  isLoading?: boolean;
}

export function InputBox({ onSubmit, placeholder = "Type here...", isLoading = false }: InputBoxProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onSubmit(text);
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-4">
      <label htmlFor="user-input" className="sr-only">{placeholder}</label>
      <input
        id="user-input"
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        className="flex-1 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading || !text.trim()}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Send"
      >
        {isLoading ? "Wait..." : "Send"}
      </button>
      <button
        type="button"
        className="p-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
        aria-label="Voice input (Coming soon)"
        title="Voice input placeholder"
      >
        🎤
      </button>
    </form>
  );
}
