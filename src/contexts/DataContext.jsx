import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { mockJobs, mockApplications, mockPlacements } from "../data/mockData";

const DataContext = createContext(null);

export function DataProvider({ children }) {
    // 1. Initialize Jobs
    const [jobs, setJobs] = useState(() => {
        const saved = localStorage.getItem("skillshala_jobs_v2");
        return saved ? JSON.parse(saved) : mockJobs;
    });

    // 2. Initialize Applications
    const [applications, setApplications] = useState(() => {
        const saved = localStorage.getItem("skillshala_applications_v2");
        return saved ? JSON.parse(saved) : mockApplications;
    });

    // 3. Initialize Placements
    const [placements, setPlacements] = useState(() => {
        const saved = localStorage.getItem("skillshala_placements_v2");
        return saved ? JSON.parse(saved) : mockPlacements;
    });

    // Ensure initial sync if empty
    useEffect(() => {
        if (!localStorage.getItem("skillshala_jobs_v2")) {
            localStorage.setItem("skillshala_jobs_v2", JSON.stringify(mockJobs));
        }
        if (!localStorage.getItem("skillshala_applications_v2")) {
            localStorage.setItem("skillshala_applications_v2", JSON.stringify(mockApplications));
        }
        if (!localStorage.getItem("skillshala_placements_v2")) {
            localStorage.setItem("skillshala_placements_v2", JSON.stringify(mockPlacements));
        }
    }, []);

    // Persist on Changes
    useEffect(() => {
        localStorage.setItem("skillshala_jobs_v2", JSON.stringify(jobs));
    }, [jobs]);

    useEffect(() => {
        localStorage.setItem("skillshala_applications_v2", JSON.stringify(applications));
    }, [applications]);

    useEffect(() => {
        localStorage.setItem("skillshala_placements_v2", JSON.stringify(placements));
    }, [placements]);

    // Helpers
    const addJob = useCallback((jobData) => {
        setJobs((prev) => [...prev, { id: Date.now(), ...jobData }]);
    }, []);

    const addApplication = useCallback((appData) => {
        setApplications((prev) => [...prev, { id: Date.now(), ...appData }]);
    }, []);

    const updateApplicationStatus = useCallback((appId, newStatus, extraData = {}) => {
        setApplications((prev) =>
            prev.map((app) =>
                app.id === appId
                    ? {
                        ...app,
                        status: newStatus,
                        ...extraData,
                        updatedAt: new Date().toISOString().split("T")[0]
                    }
                    : app
            )
        );
    }, []);

    const updateJobStatus = useCallback((jobId, newStatus) => {
        setJobs(prev => prev.map(job =>
            job.id === jobId ? { ...job, status: newStatus } : job
        ));
    }, []);

    // CROSS-TAB SYNC: Listen for storage changes from other tabs
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === "skillshala_jobs_v2" && e.newValue) {
                setJobs(JSON.parse(e.newValue));
            }
            if (e.key === "skillshala_applications_v2" && e.newValue) {
                setApplications(JSON.parse(e.newValue));
            }
            if (e.key === "skillshala_placements_v2" && e.newValue) {
                setPlacements(JSON.parse(e.newValue));
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    return (
        <DataContext.Provider value={{
            jobs,
            applications,
            placements,
            addJob,
            addApplication,
            updateApplicationStatus,
            updateJobStatus,
            setJobs,
            setApplications
        }}>
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error("useData must be used within a DataProvider");
    }
    return context;
}
