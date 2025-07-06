// /client/src/components/Shared/Header.jsx
import React, { useEffect, useState,useContext } from 'react';
import { useForm } from 'react-hook-form';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import * as apiService from '../../services/userService';
import { UserContext } from "../Shared/UserContext";

const Header = () => {
  const location = useLocation();
  //const { register, handleSubmit } = useForm();
  const [userName, setUserName] = useState("");
  const { loginUser, setLoginUser } = useContext(UserContext);

  useEffect(() => {
    const loggedUser = location.state?.email;
    
    const fetchUser = async () => {
      if (!loggedUser) return;
      const result = await apiService.getUser(loggedUser);
      if (result.success) {
            setUserName(result.username); // ✅ updates state, triggers re-render
            setLoginUser(result.username);
      }
    };

    fetchUser(); 
  },[]);

  return (
    <div className="d-flex justify-content-between align-items-center bg-primary text-white px-4 py-2 shadow-sm">
      {/* Left: Profile + Status */}
      <div className="d-flex align-items-center gap-3">
        <strong>{userName || 'Loading...'}</strong>
        {/* onSubmit={handleSubmit(onSubmit)} */}
        {/* <form  className="d-flex align-items-center gap-2">
          <input
            type="text"
            placeholder="Update status"
            // {...register('status')}
            className="form-control form-control-sm"
          />
          <button className="btn btn-light btn-sm" type="submit">Set</button>
        </form> */}
      </div>

      {/* Right: Call Buttons */}
      <div className="d-flex gap-2">
        <button className="btn btn-outline-light btn-sm">
          <i className="bi bi-camera-video-fill me-1"></i> Video Call
        </button>
        <button className="btn btn-outline-light btn-sm">
          <i className="bi bi-telephone-fill me-1"></i> Audio Call
        </button>
      </div>
    </div>
  );
};

export default Header;