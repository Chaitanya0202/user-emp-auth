
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobelContext } from '../apiContext/UserContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    f_userName: '',
    f_Pwd: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { apiurl } = useGlobelContext();
  const { f_userName, f_Pwd } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
  
      await axios.post(`${apiurl}/users/signup`, formData);
      navigate('/login');
    } catch (err) {
      setError('Username already exists');
      console.log("first",err)
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label htmlFor="f_userName" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input 
              type="text" 
              id="f_userName"
              name="f_userName" 
              value={f_userName} 
              onChange={onChange} 
              required 
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="f_Pwd" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              id="f_Pwd"
              name="f_Pwd" 
              value={f_Pwd} 
              onChange={onChange} 
              required 
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
