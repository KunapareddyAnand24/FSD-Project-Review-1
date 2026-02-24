import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNotifications } from "../../contexts/NotificationContext";
import { useData } from "../../contexts/DataContext";
import { FiSend, FiMessageCircle } from "react-icons/fi";

// Mock message data
const initialMessages = [];

export default function Messages() {
    const { user, localUsers } = useAuth();
    const { applications, jobs } = useData();
    const { addNotification } = useNotifications();

    // Initialize messages from localStorage or fallback to initialMessages
    const [messages, setMessages] = useState(() => {
        const savedMessages = localStorage.getItem("skillshala_messages_clear");
        return savedMessages ? JSON.parse(savedMessages) : initialMessages;
    });
    const [newMessage, setNewMessage] = useState("");
    const [activeThread, setActiveThread] = useState(null);

    // Persist messages to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem("skillshala_messages_clear", JSON.stringify(messages));
    }, [messages]);

    // Sync messages across tabs/windows in real-time
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === "skillshala_messages_clear" && e.newValue) {
                try {
                    setMessages(JSON.parse(e.newValue));
                } catch (error) {
                    console.error("Error parsing synced messages:", error);
                }
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    // Get all contacts the user has threads with
    const myMessages = messages.filter(
        (m) => m.senderId === user.id || m.receiverId === user.id
    );

    // Group by threadId
    const threads = {};
    myMessages.forEach((m) => {
        if (!threads[m.threadId]) {
            threads[m.threadId] = [];
        }
        threads[m.threadId].push(m);
    });

    // We also want to auto-create contact threads based on Applications
    // If you're a student, you can message employers you've applied to.
    // If you're an employer, you can message students who've applied to you.
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

    // Initialize these empty threads into the dictionary if they don't exist
    possibleContacts.forEach(contactId => {
        const threadIdOptions = [
            `msg_${user.id}_${contactId}`,
            `msg_${contactId}_${user.id}`
        ];
        // Check if either possible thread ID exists in the threads object
        const existingId = threadIdOptions.find(id => threads[id]);

        if (!existingId) {
            // Create a fake "zero-message" thread
            threads[threadIdOptions[0]] = [];
        }
    });

    // Get thread summaries
    const threadList = Object.entries(threads).map(([threadId, msgs]) => {
        let otherPersonId;
        let otherPerson;

        if (msgs.length > 0) {
            const lastMsg = msgs[msgs.length - 1];
            otherPersonId = lastMsg.senderId === user.id ? lastMsg.receiverId : lastMsg.senderId;
        } else {
            // Extract from ID because there are no messages
            const ids = threadId.replace('msg_', '').split('_');
            otherPersonId = parseInt(ids[0]) === user.id ? parseInt(ids[1]) : parseInt(ids[0]);
        }

        otherPerson = localUsers.find((u) => u.id === otherPersonId);

        return {
            threadId,
            otherPerson: otherPerson || { name: "Unknown", avatar: "?" },
            lastMessage: msgs.length > 0 ? msgs[msgs.length - 1] : null,
            lastTime: msgs.length > 0 ? msgs[msgs.length - 1].timestamp : null,
            messages: msgs,
        };
    }).filter(t => t.otherPerson); // keep only valid threads

    const activeMessages = activeThread
        ? threads[activeThread] || []
        : [];

    const activeContact = activeThread
        ? threadList.find((t) => t.threadId === activeThread)?.otherPerson
        : null;

    const handleSend = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeThread || !activeContact) return;

        const msg = {
            id: messages.length + 1,
            threadId: activeThread,
            senderId: user.id,
            receiverId: activeContact.id,
            senderName: user.name,
            receiverName: activeContact.name,
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
        setMessages([...messages, msg]);
        setNewMessage("");

        // Notify the receiver
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
                            >
                                <div className="thread-avatar">{thread.otherPerson.avatar}</div>
                                <div className="thread-info">
                                    <span className="thread-name">{thread.otherPerson.name}</span>
                                    <span className="thread-preview">
                                        {thread.lastMessage ? `${thread.lastMessage.message.substring(0, 40)}...` : "Start a conversation"}
                                    </span>
                                </div>
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
                                    <p className="chat-subtitle">Start a conversation with '{activeContact.name}'</p>
                                </div>
                            </div>
                            <div className="chat-messages">
                                {activeMessages.length === 0 ? (
                                    <div className="empty-state">
                                        <p style={{ color: 'var(--text-muted)' }}>Send your first message to {activeContact.companyName || activeContact.name}</p>
                                    </div>
                                ) : activeMessages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`chat-bubble ${msg.senderId === user.id ? "sent" : "received"}`}
                                    >
                                        <p>{msg.message}</p>
                                        <span className="chat-time">{msg.timestamp}</span>
                                    </div>
                                ))}
                            </div>
                            <form className="chat-input-area" onSubmit={handleSend}>
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    className="chat-input"
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
