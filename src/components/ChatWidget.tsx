"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import OpenAI from "openai";
import "./style.css";
import ShimmerMessage from "./ui/shimmer/shimmer";
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
  const chatBodyRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleSendMessage = async () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput("");
      setIsLoading(true);
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
      setIsLoading(false);
      // Simulate bot response
      const botResponse =
        response.choices[0]?.message?.content || "How can I help you?";

      // Call the typing effect function
      simulateTyping(botResponse);
    }
  };

  const simulateTyping = (text: string) => {
    let index = 0;
    const typingSpeed = 50; // Adjust speed as needed (ms per character)

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: "", sender: "bot" },
    ]);

    const interval = setInterval(() => {
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        const lastMessage = updatedMessages[updatedMessages.length - 1];

        if (lastMessage.sender === "bot") {
          lastMessage.text += text.charAt(index - 1);
        }

        return updatedMessages;
      });

      index++;

      if (index >= text.length) {
        clearInterval(interval);
      }
    }, typingSpeed);
  };

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages.length, isLoading]);

  return (
    <div className="chat_wrapper fixed bottom-4 right-4 z-50 ">
      <Button className="chat_button" onClick={handleToggle}>
        <img
          src={isOpen ? "/x-close.svg" : "/message.svg"}
          alt={isOpen ? "Close" : "Chat"}
          className="w-6 h-6"
        />
      </Button>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="mt-2 w-100 h-[40rem] bg-gray-50 rounded-2xl shadow-xl flex flex-col"
        >
          <div className="chat_Header">Chat Support</div>
          <div
            className="chat_body flex-1 overflow-y-auto p-4 space-y-2"
            ref={chatBodyRef}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-xl ${
                  msg.sender === "user"
                    ? "msg_scr1"
                    : "msg_scr2 bg-gray-100 self-start"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {isLoading && <ShimmerMessage />}
          </div>
          <div className="chat_ft p-4 border-t flex items-center space-x-2">
            <input
              type="text"
              className="flex-1 p-2 border rounded-xl"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault(); // Prevent form submission or default behavior
                  handleSendMessage();
                }
              }}
              placeholder="Type a message..."
            />

            <Button onClick={handleSendMessage}>
              <img src="/send.svg" alt="Send" className="w-6 h-6" />
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ChatWidget;
