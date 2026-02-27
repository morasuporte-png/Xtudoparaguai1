import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';

const ChatWidget: React.FC = () => {
    const { currentRoom, sendMessage, closeChat } = useChat();
    const [text, setText] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [currentRoom?.messages]);

    if (!currentRoom) return null;

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;
        sendMessage(text);
        setText('');
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] w-[360px] max-w-[90vw] animate-in slide-in-from-bottom-8 duration-500">
            <div className="bg-white rounded-[32px] shadow-2xl shadow-indigo-200 border border-slate-100 overflow-hidden flex flex-col h-[500px]">

                {/* Header */}
                <div className="bg-indigo-600 p-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white font-bold text-xl">
                            {currentRoom.sellerName[0]}
                        </div>
                        <div>
                            <h3 className="text-white font-black text-sm leading-none mb-1">{currentRoom.sellerName}</h3>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                <span className="text-[10px] text-indigo-100 font-bold uppercase tracking-wider">Online</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={closeChat} className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Messages Container */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50">
                    <div className="text-center py-4">
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm">Início da Conversa</span>
                    </div>

                    {currentRoom.messages.length === 0 && (
                        <div className="text-center py-10">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-indigo-200 mx-auto mb-4 border border-slate-100 shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                            </div>
                            <p className="text-xs text-slate-400 font-medium px-6">Diga Olá para o vendedor e tire suas dúvidas sobre o produto.</p>
                        </div>
                    )}

                    {currentRoom.messages.map(msg => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.senderRole === 'buyer' ? 'justify-end' : 'justify-start'} animate-in fade-in zoom-in duration-300`}
                        >
                            <div className={`max-w-[80%] p-4 rounded-[22px] text-sm shadow-sm ${msg.senderRole === 'buyer'
                                    ? 'bg-indigo-600 text-white rounded-tr-none'
                                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none font-medium'
                                }`}>
                                {msg.text}
                                <p className={`text-[9px] mt-1.5 font-bold uppercase tracking-tighter opacity-50 ${msg.senderRole === 'buyer' ? 'text-right' : 'text-left'}`}>
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex items-center gap-3">
                    <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 flex items-center gap-2 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-50 transition-all">
                        <input
                            type="text"
                            placeholder="Escreva sua mensagem..."
                            className="flex-1 bg-transparent text-sm text-slate-700 outline-none font-medium"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        <button type="button" className="text-slate-400 hover:text-indigo-600 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                        </button>
                    </div>
                    <button
                        type="submit"
                        className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 -rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatWidget;
