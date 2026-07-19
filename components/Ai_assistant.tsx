"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";
import { Trash2 } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const starterMessages: Message[] = [
  {
    role: "assistant",
    content: "Bonjour 👋 Je peux vous aider à découvrir nos solutions domotiques.",
  },
];

export default function Ai_assistant() {
  const [messages, setMessages] = useState<Message[]>(starterMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadStoredConversation = async () => {
      setIsLoading(true);

      try {
        const response = await fetch("/api/ai-process");
        const data = await response.json();

        if (response.ok && Array.isArray(data.messages)) {
          const restoredMessages = data.messages.map((message: { role: string; content: string }) => ({
            role: message.role === "user" ? "user" : "assistant",
            content: message.content,
          }));

          setMessages(restoredMessages.length > 0 ? restoredMessages : starterMessages);
        }
      } catch (error) {
        console.error("Failed to load previous conversation", error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadStoredConversation();
  }, []);


  const sendMessage = async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = { role: "user", content: trimmed };
    const priorMessages = messages;

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai-process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmed,
          history: priorMessages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue.");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || "Je n'ai pas pu répondre." },
      ]);
    } catch (error) {
      const errorText =
        error instanceof Error ? error.message : "Désolé, une erreur est survenue. Veuillez réessayer.";
      setMessages((prev) => [...prev, { role: "assistant", content: errorText }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await sendMessage(input);
  };

  const resetConversation = () => {
    setMessages(starterMessages);
    setInput("");
    setIsLoading(false);
  };

  return (
    <div className="w-full rounded-[10px] border border-gray-200 bg-white p-5 text-gray-900 shadow-sm dark:border-white/10 dark:bg-[#0b0f1a] dark:text-white">
      <div className="flex h-[400px] flex-col">
        <div className="mb-3 flex items-center justify-between">
          <Logo size="text-lg" />
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer border-red-600 bg-transparent text-red-600 hover:bg-red-600 hover:text-white"
            onClick={resetConversation}
          >
            <Trash2 size={14} className="mr-1" />
            Clear Chat
          </Button>
        </div>

        <ScrollArea className="mb-3 flex-1 overflow-y-auto pr-2">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`rounded-lg p-3 text-sm ${
                  message.role === "user"
                    ? "bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300"
                    : "bg-gray-50 text-gray-600 dark:bg-white/5 dark:text-gray-300"
                }`}
              >
                {message.content}
              </div>
            ))}
            {isLoading ? (
              <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600 dark:bg-white/5 dark:text-gray-300">
                Réflexion en cours...
              </div>
            ) : null}
            <div/>
          </div>
        </ScrollArea>

        <form className="flex gap-2" onSubmit={handleSubmit}>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                event.preventDefault();
                void sendMessage(input);
              }
            }}
            disabled={isLoading}
            placeholder="Écrivez votre message..."
            className="h-[80px] flex-1 resize-none rounded-[10px] border border-gray-300 bg-white p-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-amber-500 focus:outline-none disabled:opacity-60 dark:border-white/10 dark:bg-[#0b0f1a] dark:text-white dark:placeholder:text-gray-500"
          />
          <Button
            type="submit"
            className="self-center cursor-pointer font-medium bg-linear-to-r from-amber-400 to-orange-500 text-slate-950 hover:opacity-90"
            disabled={isLoading}
          >
            {isLoading ? "..." : "Envoyer"}
          </Button>
        </form>
      </div>
    </div>
  );
}