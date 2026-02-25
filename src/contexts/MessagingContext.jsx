import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";

const MessagingContext = createContext(null);

const STORAGE_KEY = "skillshala_messages_clear";

export function MessagingProvider({ children }) {
    const [messages, setMessages] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    // Ref to always have the latest messages without triggering re-renders in the interval
    const messagesRef = useRef(messages);
    useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);

    // Persist to localStorage whenever messages change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }, [messages]);

    // CROSS-TAB SYNC: storage event fires in OTHER tabs
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === STORAGE_KEY && e.newValue) {
                try {
                    setMessages(JSON.parse(e.newValue));
                } catch {
                    /* ignore parse errors */
                }
            }
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    // SAME-SESSION POLLING: poll localStorage every 1.5s as a fallback
    // This catches updates written by other components in the same tab/session
    useEffect(() => {
        const interval = setInterval(() => {
            try {
                const raw = localStorage.getItem(STORAGE_KEY);
                if (!raw) return;
                const stored = JSON.parse(raw);
                // Only update state if something actually changed (compare lengths first, then deep)
                if (stored.length !== messagesRef.current.length) {
                    setMessages(stored);
                } else {
                    // Check if the last message id differs
                    const lastStored = stored[stored.length - 1];
                    const lastCurrent = messagesRef.current[messagesRef.current.length - 1];
                    if (lastStored?.id !== lastCurrent?.id) {
                        setMessages(stored);
                    }
                }
            } catch {
                /* ignore */
            }
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    // Send a message — updates shared state immediately (no round-trip needed)
    const sendMessage = useCallback((msg) => {
        setMessages((prev) => {
            const next = [...prev, msg];
            // Write to localStorage immediately so other tabs/polling pick it up
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            return next;
        });
    }, []);

    // Clear all messages (on logout)
    const clearMessages = useCallback(() => {
        setMessages([]);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    return (
        <MessagingContext.Provider value={{ messages, sendMessage, clearMessages, setMessages }}>
            {children}
        </MessagingContext.Provider>
    );
}

export function useMessaging() {
    const context = useContext(MessagingContext);
    if (!context) {
        throw new Error("useMessaging must be used within a MessagingProvider");
    }
    return context;
}
