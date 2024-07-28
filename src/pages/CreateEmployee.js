import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGlobelContext } from '../apiContext/UserContext';

const CreateEmployee = () => {

  const { apiurl } = useGlobelContext();
  const [formData, setFormData] = useState({
    f_Name: '',
    f_Email: '',
    f_Mobile: '',
    f_Designation: '',
    f_Gender: '',
    f_Course: [], // Store courses as an array of selected courses
    f_Image: null,
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { f_Name, f_Email, f_Mobile, f_Designation, f_Gender, f_Course } = formData;

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else if (type === 'checkbox') {
      const updatedCourses = checked
        ? [...f_Course, value]
        : f_Course.filter((course) => course !== value);

      setFormData({ ...formData, f_Course: updatedCourses });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      if (formData[key] !== null && formData[key] !== undefined) {
        if (Array.isArray(formData[key])) {
          formData[key].forEach((item) => data.append(`${key}[]`, item));
        } else {
          data.append(key, formData[key]);
        }
      }
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('No token found, please log in');
      navigate('/login');
      return;
    }

    try {
      await axios.post(`${apiurl}/employees/add`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Employee added successfully');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000); 
    } catch (err) {
      toast.error('User Already Exist...');
      toast.error('Error adding employee');
      console.error('Error:', err); 
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <ToastContainer />
      <div className="p-6 max-w-md w-full bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Create Employee</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Name</label>
            <input
              type="text"
              name="f_Name"
              value={f_Name}
              onChange={handleChange}
              required
              className="border border-gray-300 p-2 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input
              type="email"
              name="f_Email"
              value={f_Email}
              onChange={handleChange}
              required
              className="border border-gray-300 p-2 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Mobile</label>
            <input
              type="number"
              name="f_Mobile"
              value={f_Mobile}
              onChange={handleChange}
              required
              className="border border-gray-300 p-2 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Designation</label>
            <select
              name="f_Designation"
              value={f_Designation}
              onChange={handleChange}
              required
              className="border border-gray-300 p-2 rounded w-full"
            >
              <option value="">Select Designation</option>
              <option value="Manager">Manager</option>
              <option value="Developer">Developer</option>
              <option value="Tester">Tester</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1">Gender</label>
            <div>
              <label className="inline-flex items-center mr-4">
                <input
                  type="radio"
                  name="f_Gender"
                  value="Male"
                  checked={f_Gender === 'Male'}
                  onChange={handleChange}
                  required
                  className="form-radio"
                />
                <span className="ml-2">Male</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="f_Gender"
                  value="Female"
                  checked={f_Gender === 'Female'}
                  onChange={handleChange}
                  required
                  className="form-radio"
                />
                <span className="ml-2">Female</span>
              </label>
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-1">Courses</label>
            <div>
              <label className="inline-flex items-center mr-4">
                <input
                  type="checkbox"
                  name="f_Course"
                  value="React"
                  checked={f_Course.includes('React')}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <span className="ml-2">React</span>
              </label>
              <label className="inline-flex items-center mr-4">
                <input
                  type="checkbox"
                  name="f_Course"
                  value="Node"
                  checked={f_Course.includes('Node')}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <span className="ml-2">Node</span>
              </label>
              <label className="inline-flex items-center mr-4">
                <input
                  type="checkbox"
                  name="f_Course"
                  value="JavaScript"
                  checked={f_Course.includes('JavaScript')}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <span className="ml-2">JavaScript</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="f_Course"
                  value="Python"
                  checked={f_Course.includes('Python')}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <span className="ml-2">Python</span>
              </label>
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-1">Image</label>
            <input
              type="file"
              name="f_Image"
              onChange={handleChange}
              accept=".jpg,.png"
              required
              className="border border-gray-300 p-2 rounded w-full"
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEmployee;
