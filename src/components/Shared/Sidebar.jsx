// const [stateValue, setStateValue] = useState(initialValue);
// stateValue: current value of the state

// setStateValue: function to update the state

// initialValue: what the state starts as (number, string, array, object, etc.) 

//stateValue will triggered when data changed at setStateValue

import React, { useState,useEffect ,useContext } from 'react';
import '../Shared/Sidebar.css';
import axios from 'axios';
import * as apiService from '../../services/userService';
import { UserContext } from "../Shared/UserContext";

const colors = ['#6f42c1', '#20c997', '#fd7e14', '#0d6efd', '#6610f2', '#198754', '#dc3545'];

const Sidebar = ({ onUserSelect }) => {
    const [allUsers, setAlUsers] = useState([]);
    const { loginUser } = useContext(UserContext);

  useEffect(() => {
 
    const fetchUser = async () => {
      const result = await apiService.getAllUsers();
      if (result.success) {
        setAlUsers(result.users); // ✅ updates state, triggers re-render
      }
    };

    fetchUser();
  }, []);


const handleUserClick = (user) => {
  onUserSelect(user); // Pass selected user to Dashboard
};

return (
<div className="bg-light border-end p-3 h-100" style={{ width: '250px' }}>
  <h6 className="fw-bold mb-3">Chats</h6>
  <ul className="list-unstyled">
    {allUsers.filter((user) => user.userName !== loginUser).map((user, index) => {
      const initials = user.userName
        .split(' ')
        .map((word) => word[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

      const statusColor = user.status === 'online' ? 'green' : user.status === 'in-call' ? 'orange' : '#daa520';
      const bgColor = colors[index % colors.length];

      return (
        <li
          key={user.id}
          onClick={() => handleUserClick(user)}
          className="d-flex align-items-center mb-3 p-2 rounded user-item"
          style={{ cursor: 'pointer' }}
        >
          {/* Avatar with status dot */}
          <div className="position-relative me-2">
            <div
              className="rounded-circle text-white d-flex align-items-center justify-content-center"
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: bgColor,
                fontSize: '0.9rem',
                fontWeight: 'bold',
              }}
            >

            {initials}

            </div>
            <span
              className="position-absolute"
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: statusColor,
                bottom: 0,
                right: 0,
                border: '2px solid white',
              }}
            ></span>
          </div>

          <span>{user.userName}</span>
        </li>
      );
    })}
  </ul>
</div>
  );
};

export default Sidebar;

