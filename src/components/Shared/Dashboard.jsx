import React, { useState } from 'react';
import Header from '../Shared/Header.jsx';
import Sidebar from '../Shared/Sidebar.jsx';
import ChatPanel from '../Shared/ChatPanel.jsx';
import { UserContext } from "../Shared/UserContext";

const Dashboard = () => {
    const [loginUser, setLoginUser] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    return (
        <UserContext.Provider value={{ loginUser, setLoginUser }}>
        <div className="d-flex flex-column vh-100">
            {/* Fixed Header */}
            <Header />

            {/* Main layout: Sidebar + ChatPanel */}
            <div className="d-flex flex-grow-1 overflow-hidden">
                {/* Sidebar (fixed width, scrollable if needed) */}
                <Sidebar
                    className="bg-light border-end"
                    style={{ width: '250px', overflowY: 'auto' }}
                    onUserSelect={(user) => setSelectedUser(user)}
                />

                {/* Chat panel takes remaining space, scrolls only its content */}
                <div className="flex-grow-1 d-flex flex-column h-100">
                    <ChatPanel receiver={selectedUser} />
                </div>
            </div>
        </div>
        </UserContext.Provider>
    );
};

export default Dashboard;