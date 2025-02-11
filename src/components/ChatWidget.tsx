"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import OpenAI from "openai";
console.log(process.env.OPENAI_API_KEY);
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

  const handleToggle = () => setIsOpen(!isOpen);

  const handleSendMessage = async () => {
    if (input.trim()) {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: input }],
        response_format: {
          type: "text",
        },
        temperature: 1,
        max_completion_tokens: 2048,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput("");
      // Simulate bot response
      console.log(response.choices[0].message.content);
      if (response.choices[0].message.content) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: response.choices[0].message.content || "how can I help you ?",
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
