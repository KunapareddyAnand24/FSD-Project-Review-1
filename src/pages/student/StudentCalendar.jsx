import { useState } from "react";
import { FiCalendar, FiClock, FiVideo } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";

export default function StudentCalendar() {
    const { user } = useAuth();
    const { applications } = useData();

    // Generate simple grid for current month
    const days = Array.from({ length: 30 }, (_, i) => i + 1);

    // Filter applications for this student and create events
    const myApplications = applications.filter(a => a.studentId === user.id);
    const dynamicEvents = myApplications
        .filter(a => ['shortlisted', 'interview_scheduled', 'selected'].includes(a.status))
        .map((app) => {
            const applyStr = app.appliedAt || "2026-02-15";
            const parts = applyStr.split("-");
            // Basic fallback if appliedAt format varies
            let baseDay = parts.length === 3 ? parseInt(parts[2], 10) : 15;
            if (isNaN(baseDay)) baseDay = 15;

            let eventDay = baseDay;
            let title = "";
            let type = "";

            if (app.status === 'interview_scheduled') {
                eventDay = (baseDay + 7) > 28 ? 5 : (baseDay + 7);
                title = `${app.companyName} Interview`;
                type = 'interview';
            } else if (app.status === 'selected') {
                eventDay = (baseDay + 10) > 28 ? 12 : (baseDay + 10);
                title = `${app.companyName} Onboarding`;
                type = 'event';
            } else if (app.status === 'shortlisted') {
                eventDay = (baseDay + 3) > 28 ? 2 : (baseDay + 3);
                title = `${app.companyName} Test Due`;
                type = 'deadline';
            }

            return {
                id: app.id,
                title: title,
                company: app.companyName,
                date: eventDay,
                time: "10:00 AM",
                type: type,
                link: type === 'interview' ? "meet.google.com/abc" : null
            };
        });

    const getDayEvents = (day) => {
        return dynamicEvents.filter(e => e.date === day);
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1><FiCalendar style={{ verticalAlign: 'middle', marginRight: '8px' }} /> My Calendar</h1>
                <p>Track your upcoming interviews, application deadlines, and placement events</p>
            </div>

            <div className="card">
                <div className="calendar-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                    <h2 className="card-title" style={{ margin: 0 }}>February 2026</h2>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <span className="status-badge" style={{ background: 'rgba(108, 99, 255, 0.1)', color: 'var(--accent-primary)' }}>Interview</span>
                        <span className="status-badge status-rejected">Deadline</span>
                        <span className="status-badge status-pending">Event</span>
                    </div>
                </div>

                <div className="calendar-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: '10px',
                    textAlign: 'center',
                    minWidth: '600px', /* Prevent squeezing on small screens */
                }}>
                    {/* Days of week */}
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} style={{ fontWeight: 'bold', color: 'var(--text-muted)', paddingBottom: '10px' }}>{day}</div>
                    ))}

                    {/* Empty cells for starting offset (Starts on Sunday Feb 1) */}
                    <div className="calendar-cell empty" style={{ background: 'transparent', border: 'none' }}></div>
                    <div className="calendar-cell empty" style={{ background: 'transparent', border: 'none' }}></div>

                    {/* Day cells */}
                    {days.map(day => {
                        const dayEvents = getDayEvents(day);
                        return (
                            <div key={day} style={{
                                border: '1px solid var(--border-color)',
                                minHeight: '100px',
                                padding: '8px',
                                borderRadius: 'var(--radius-md)',
                                background: 'var(--bg-card)',
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '5px'
                            }}>
                                <span style={{ position: 'absolute', top: '8px', right: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{day}</span>
                                <div style={{ marginTop: '25px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    {dayEvents.map(event => (
                                        <div key={event.id} title={event.title} style={{
                                            fontSize: '0.7rem',
                                            padding: '4px 6px',
                                            borderRadius: '4px',
                                            textAlign: 'left',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            background: event.type === 'interview' ? 'rgba(108, 99, 255, 0.15)' :
                                                event.type === 'deadline' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                                            color: event.type === 'interview' ? 'var(--accent-primary)' :
                                                event.type === 'deadline' ? 'var(--danger)' : 'var(--warning)',
                                            cursor: 'pointer',
                                            fontWeight: 500
                                        }}>
                                            {event.title}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="card" style={{ marginTop: '20px' }}>
                <h2 className="card-title">Upcoming Schedule</h2>
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Date & Time</th>
                                <th>Event / Company</th>
                                <th>Type</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dynamicEvents.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="empty-row" style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)" }}>
                                        No upcoming events. Apply to jobs to fill your calendar!
                                    </td>
                                </tr>
                            ) : (
                                dynamicEvents.map(event => (
                                    <tr key={event.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                                                <FiClock />
                                                Feb {event.date}, {event.time}
                                            </div>
                                        </td>
                                        <td style={{ fontWeight: 600 }}>{event.title}</td>
                                        <td>
                                            <span className="role-badge" style={{
                                                background: event.type === 'interview' ? 'rgba(108, 99, 255, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                color: event.type === 'interview' ? 'var(--accent-primary)' : 'var(--danger)'
                                            }}>
                                                {event.type.toUpperCase()}
                                            </span>
                                        </td>
                                        <td>
                                            {event.link ? (
                                                <a href={`https://${event.link}`} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ padding: '4px 12px', fontSize: '0.8rem' }}>
                                                    <FiVideo style={{ marginRight: '6px' }} /> Join Link
                                                </a>
                                            ) : (
                                                <span className="text-muted" style={{ fontSize: '0.8rem' }}>N/A</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
