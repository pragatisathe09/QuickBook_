import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { roomsAPI, reservationsAPI } from '../services/api';
import animationData from "../assets/chatbot.json";
import Lottie from "lottie-react";

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [roomData, setRoomData] = useState(null);
    const [reservationData, setReservationData] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            fetchData();
        }
    }, [isOpen]);

    const fetchData = async () => {
        try {
            const [roomsResponse, reservationsResponse] = await Promise.all([
                roomsAPI.getAll(),
                reservationsAPI.getAll()
            ]);
            setRoomData(roomsResponse.data);
            setReservationData(reservationsResponse.data);
        } catch (error) {
            console.error('Error fetching data for chatbot:', error);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input;
        setInput('');
        setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const prompt = `
        As a meeting room booking assistant, use this context to answer the question:
        Available Rooms: ${JSON.stringify(roomData)}
        Current Reservations: ${JSON.stringify(reservationData)}
        
        User Question: ${userMessage}
        
        Please provide a clear and concise response about room availability, booking procedures, or room details.
        If you can't answer with certainty, suggest checking the room booking interface.
      `;

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${import.meta.env.VITE_GEMINI_API_KEY}`
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                })
            });

            const data = await response.json();
            const aiResponse = data.candidates[0].content.parts[0].text;

            setMessages(prev => [...prev, { type: 'bot', content: aiResponse }]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                type: 'bot',
                content: 'Sorry, I encountered an error. Please try again.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-10 right-10 z-50">
            {/* Chat Icon Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-purple-600 text-white border-2 border-black rounded-full shadow-lg hover:bg-purple-700"
            >
                {/* {isOpen ? <X size={24} /> : <MessageCircle size={24} />} */}
                {isOpen ?
                    <X size={24} className='m-4' /> :
                    // <img src={RoboIcon} alt="My Icon" className="w-15 h-15 " />
                    <Lottie
                        animationData={animationData}
                        loop={true}
                        className="w-15 h-15"
                    />
                }
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="absolute bottom-16 right-0 w-96 h-[500px] bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col">
                    {/* Header */}
                    <div className="p-4 border-b bg-purple-600 text-white rounded-t-lg">
                        <h3 className="font-semibold">Meeting Room Assistant</h3>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] p-3 rounded-lg ${message.type === 'user'
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-100 text-gray-800'
                                        }`}
                                >
                                    {message.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                                    <div className="typing-indicator">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="p-4 border-t">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask me anything about rooms..."
                                className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-purple-600 text-white p-2 rounded-md hover:bg-purple-700 disabled:opacity-50"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}