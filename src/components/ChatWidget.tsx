"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

interface Message {
  text: string;
  sender: "user" | "bot";
}

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const widgetRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      widgetRef.current &&
      !widgetRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput("");
      setIsLoading(true);
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: input }],
        temperature: 1,
        max_tokens: 2048,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      setIsLoading(false);
      if (response.choices[0].message.content) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: response.choices[0].message.content || "How can I help you?",
            sender: "bot",
          },
        ]);
      }
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button className="rounded-full p-4 shadow-lg" onClick={handleToggle}>
        {isOpen ? "Close" : "Chat"}
      </Button>
      {isOpen && (
        <motion.div
          ref={widgetRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="mt-2 w-80 h-96 bg-white rounded-2xl shadow-xl flex flex-col"
        >
          <div className="p-4 border-b font-bold text-lg">Chat Support</div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-xl max-w-xs ${
                  msg.sender === "user"
                    ? "bg-blue-100 self-end"
                    : "bg-gray-100 self-start"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {isLoading && <div className="p-2">Loading...</div>}
          </div>
          <div className="p-4 border-t flex items-center space-x-2">
            <input
              type="text"
              className="flex-1 p-2 border rounded-xl"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
            />
            <Button onClick={handleSendMessage}>Send</Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ChatWidget;
