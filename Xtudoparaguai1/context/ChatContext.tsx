import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export interface ChatMessage {
    id: string;
    senderId: string;
    senderRole: 'buyer' | 'seller';
    text: string;
    timestamp: number;
}

export interface ChatRoom {
    id: string;
    buyerId: string;
    sellerId: string;
    sellerName: string;
    lastMessage?: string;
    lastTimestamp?: number;
    unreadCount: number;
    messages: ChatMessage[];
}

interface ChatContextType {
    rooms: ChatRoom[];
    currentRoom: ChatRoom | null;
    totalUnread: number;
    openChat: (sellerId: string, sellerName: string) => void;
    sendMessage: (text: string) => void;
    closeChat: () => void;
    markAsRead: (roomId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [rooms, setRooms] = useState<ChatRoom[]>([]);
    const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);

    const totalUnread = rooms.reduce((acc, room) => acc + room.unreadCount, 0);

    const openChat = useCallback((sellerId: string, sellerName: string) => {
        setRooms(prev => {
            const existing = prev.find(r => r.sellerId === sellerId);
            if (existing) {
                setCurrentRoomId(existing.id);
                return prev.map(r => r.id === existing.id ? { ...r, unreadCount: 0 } : r);
            }
            const newRoom: ChatRoom = {
                id: `room_${Date.now()}`,
                buyerId: 'user_1',
                sellerId,
                sellerName,
                unreadCount: 0,
                messages: [],
            };
            setCurrentRoomId(newRoom.id);
            return [...prev, newRoom];
        });
    }, []);

    const sendMessage = useCallback((text: string) => {
        if (!currentRoomId) return;

        const newMessage: ChatMessage = {
            id: `msg_${Date.now()}`,
            senderId: 'user_1',
            senderRole: 'buyer',
            text,
            timestamp: Date.now(),
        };

        setRooms(prev => prev.map(room => {
            if (room.id === currentRoomId) {
                return {
                    ...room,
                    lastMessage: text,
                    lastTimestamp: newMessage.timestamp,
                    messages: [...room.messages, newMessage],
                };
            }
            return room;
        }));

        // Simulate automatic response from AI seller
        setTimeout(() => {
            const response: ChatMessage = {
                id: `msg_resp_${Date.now()}`,
                senderId: 'seller',
                senderRole: 'seller',
                text: 'Olá! Recebi sua mensagem, como posso ajudar? Estou verificando essa informação para você agora mesmo.',
                timestamp: Date.now(),
            };

            setRooms(prev => prev.map(room => {
                if (room.id === currentRoomId) {
                    return {
                        ...room,
                        lastMessage: response.text,
                        lastTimestamp: response.timestamp,
                        messages: [...room.messages, response],
                    };
                }
                return room;
            }));
        }, 1500);
    }, [currentRoomId]);

    const closeChat = useCallback(() => setCurrentRoomId(null), []);

    const markAsRead = useCallback((roomId: string) => {
        setRooms(prev => prev.map(r => r.id === roomId ? { ...r, unreadCount: 0 } : r));
    }, []);

    const currentRoom = rooms.find(r => r.id === currentRoomId) || null;

    return (
        <ChatContext.Provider value={{ rooms, currentRoom, totalUnread, openChat, sendMessage, closeChat, markAsRead }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) throw new Error('useChat must be used within ChatProvider');
    return context;
};
