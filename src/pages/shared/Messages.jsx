import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useNotifications } from "../../contexts/NotificationContext";
import { useData } from "../../contexts/DataContext";
import { useMessaging } from "../../contexts/MessagingContext";
import { FiSend, FiMessageCircle } from "react-icons/fi";

export default function Messages() {
    const { user, localUsers } = useAuth();
    const { applications, jobs } = useData();
    const { addNotification } = useNotifications();
    const { messages, sendMessage } = useMessaging();

    const [newMessage, setNewMessage] = useState("");
    const [activeThread, setActiveThread] = useState(null);
    const chatBottomRef = useRef(null);
    const [searchParams] = useSearchParams();

    // Filter messages relevant to current user
    const myMessages = messages.filter(
        (m) => m.senderId === user.id || m.receiverId === user.id
    );

    // Group by threadId
    const threads = {};
    myMessages.forEach((m) => {
        if (!threads[m.threadId]) threads[m.threadId] = [];
        threads[m.threadId].push(m);
    });

    // Build list of possible contacts from applications
    let possibleContacts = [];
    if (user.role === "student") {
        const appliedJobs = applications.filter(a => a.studentId === user.id);
        const employerIds = appliedJobs.map(a => {
            const job = jobs.find(j => j.id === a.jobId);
            return job?.employerId;
        }).filter(Boolean);
        possibleContacts = [...new Set(employerIds)];
    } else if (user.role === "employer") {
        const myJobs = jobs.filter(j => j.employerId === user.id).map(j => j.id);
        const myApplicants = applications.filter(a => myJobs.includes(a.jobId));
        possibleContacts = [...new Set(myApplicants.map(a => a.studentId))];
    }

    // Ensure empty threads exist for all possible contacts
    possibleContacts.forEach(contactId => {
        const threadIdOptions = [
            `msg_${user.id}_${contactId}`,
            `msg_${contactId}_${user.id}`
        ];
        const existingId = threadIdOptions.find(id => threads[id]);
        if (!existingId) {
            threads[threadIdOptions[0]] = [];
        }
    });

    // Build thread list with metadata
    const threadList = Object.entries(threads).map(([threadId, msgs]) => {
        let otherPersonId;
        if (msgs.length > 0) {
            const lastMsg = msgs[msgs.length - 1];
            otherPersonId = lastMsg.senderId === user.id ? lastMsg.receiverId : lastMsg.senderId;
        } else {
            const ids = threadId.replace("msg_", "").split("_");
            otherPersonId = parseInt(ids[0]) === user.id ? parseInt(ids[1]) : parseInt(ids[0]);
        }
        const otherPerson = localUsers.find(u => u.id === otherPersonId);
        const unreadCount = msgs.filter(m => m.senderId !== user.id && !m.read).length;
        return {
            threadId,
            otherPerson: otherPerson || { name: "Unknown", avatar: "?", id: otherPersonId },
            lastMessage: msgs.length > 0 ? msgs[msgs.length - 1] : null,
            unreadCount,
            messages: msgs,
        };
    }).filter(t => t.otherPerson);

    // Auto-select thread from ?contact=ID URL param
    useEffect(() => {
        const contactParam = searchParams.get("contact");
        if (!contactParam) return;
        const contactId = parseInt(contactParam);

        const threadIdOptions = [
            `msg_${user.id}_${contactId}`,
            `msg_${contactId}_${user.id}`
        ];
        const existingThread = threadList.find(t => threadIdOptions.includes(t.threadId));
        if (existingThread) {
            setActiveThread(existingThread.threadId);
        } else {
            // Create empty thread and select it
            const newThreadId = threadIdOptions[0];
            setActiveThread(newThreadId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (chatBottomRef.current) {
            chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, activeThread]);

    const activeMessages = activeThread ? (threads[activeThread] || []) : [];
    const activeContact = activeThread
        ? threadList.find(t => t.threadId === activeThread)?.otherPerson
        : null;

    const handleSend = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeThread || !activeContact) return;

        const msg = {
            id: Date.now(),
            threadId: activeThread,
            senderId: user.id,
            receiverId: activeContact.id,
            senderName: user.name,
            receiverName: activeContact.name,
            read: false,
            message: newMessage.trim(),
            timestamp: new Date().toLocaleString("en-IN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            }),
        };

        sendMessage(msg);
        setNewMessage("");

        // Notify receiver
        addNotification({
            type: "info",
            title: "New Message",
            message: `You received a new message from ${user.name}`,
            role: activeContact.role,
            userId: activeContact.id,
        });
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1><FiMessageCircle style={{ verticalAlign: "middle" }} /> Messages</h1>
                <p>Communicate with {user.role === "student" ? "employers" : "candidates"} directly</p>
            </div>

            <div className="messages-container">
                {/* Thread List */}
                <div className="thread-list">
                    <div className="thread-list-header">
                        <h3>Conversations</h3>
                    </div>
                    {threadList.length === 0 ? (
                        <div className="thread-empty">No conversations yet</div>
                    ) : (
                        threadList.map((thread) => (
                            <div
                                key={thread.threadId}
                                className={`thread-item ${activeThread === thread.threadId ? "active" : ""}`}
                                onClick={() => setActiveThread(thread.threadId)}
                                style={{ position: "relative" }}
                            >
                                <div className="thread-avatar">{thread.otherPerson.avatar}</div>
                                <div className="thread-info">
                                    <span className="thread-name">{thread.otherPerson.name}</span>
                                    <span className="thread-preview">
                                        {thread.lastMessage
                                            ? thread.lastMessage.message.substring(0, 40) + (thread.lastMessage.message.length > 40 ? "..." : "")
                                            : "Start a conversation"}
                                    </span>
                                </div>
                                {thread.unreadCount > 0 && (
                                    <span style={{
                                        position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)",
                                        background: "var(--accent-primary)", color: "white",
                                        borderRadius: "50%", width: "20px", height: "20px",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: "0.7rem", fontWeight: 700
                                    }}>{thread.unreadCount}</span>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Chat Area */}
                <div className="chat-area">
                    {!activeThread ? (
                        <div className="chat-empty">
                            <FiMessageCircle size={48} />
                            <p>Select a conversation to start messaging</p>
                        </div>
                    ) : (
                        <>
                            <div className="chat-header">
                                <div className="chat-header-avatar">{activeContact?.avatar}</div>
                                <div>
                                    <strong>{activeContact?.name}</strong>
                                    <span className="online-indicator">● Online</span>
                                    <p className="chat-subtitle">Conversation with {activeContact?.companyName || activeContact?.name}</p>
                                </div>
                            </div>
                            <div className="chat-messages">
                                {activeMessages.length === 0 ? (
                                    <div className="empty-state">
                                        <p style={{ color: "var(--text-muted)" }}>
                                            Send your first message to {activeContact?.companyName || activeContact?.name}
                                        </p>
                                    </div>
                                ) : (
                                    activeMessages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`chat-bubble ${msg.senderId === user.id ? "sent" : "received"}`}
                                        >
                                            <p>{msg.message}</p>
                                            <span className="chat-time">{msg.timestamp}</span>
                                        </div>
                                    ))
                                )}
                                {/* Scroll anchor */}
                                <div ref={chatBottomRef} />
                            </div>
                            <form className="chat-input-area" onSubmit={handleSend}>
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    className="chat-input"
                                    autoComplete="off"
                                />
                                <button type="submit" className="btn btn-primary chat-send-btn">
                                    <FiSend />
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
