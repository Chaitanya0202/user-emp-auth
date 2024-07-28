import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGlobelContext } from '../apiContext/UserContext';

const EditEmployee = () => {
  const [formData, setFormData] = useState({
    f_Name: '',
    f_Email: '',
    f_Mobile: '',
    f_Designation: '',
    f_Gender: '',
    f_Course: [],
    f_Image: null,
  });

  const [designations] = useState(['Manager', 'Developer', 'Tester']);
  const [courses] = useState(['React', 'Node', 'JavaScript', 'Python']);
  const { id } = useParams();
  const navigate = useNavigate();
  const { apiurl } = useGlobelContext();

  useEffect(() => {
    const token = localStorage.getItem('token'); 
    if (!token) {
      alert('No token found, please log in');
      navigate('/login');
      return;
    }

    fetchEmployeeDetails(token);
  }, [id, navigate]);

  const fetchEmployeeDetails = async (token) => {
    try {
      const res = await axios.get(`${apiurl}/employees/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { f_Name, f_Email, f_Mobile, f_Designation, f_Gender, f_Course, f_Image } = res.data;

      setFormData({
        f_Name,
        f_Email,
        f_Mobile,
        f_Designation,
        f_Gender,
        f_Course,
        f_Image,
      });
    } catch (error) {
      alert('Error fetching employee details');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked
          ? [...formData[name], value]
          : formData[name].filter(item => item !== value),
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, f_Image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.f_Email.includes('@')) {
      alert('Invalid email format');
      return;
    }

    if (!/^[0-9]+$/.test(formData.f_Mobile)) {
      alert('Mobile number must be numeric');
      return;
    }

    const formDataToSend = new FormData();
    for (const key in formData) {
      if (formData[key] instanceof Array) {
        formDataToSend.append(key, JSON.stringify(formData[key]));
      } else if (formData[key] instanceof File) {
        formDataToSend.append(key, formData[key]);
      } else {
        formDataToSend.append(key, formData[key]);
      }
    }

    try {
      const token = localStorage.getItem('token'); 
      if (!token) {
        alert('No token found, please log in');
        navigate('/login'); 
        return;
      }

      await axios.put(`${apiurl}/employees/edit/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Employee updated successfully');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (error) {
      alert('Error updating employee');
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">Edit Employee</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-4">
          <label htmlFor="f_Name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            id="f_Name"
            name="f_Name"
            placeholder="Name"
            value={formData.f_Name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="f_Email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            id="f_Email"
            name="f_Email"
            placeholder="Email"
            value={formData.f_Email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="f_Mobile" className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
          <input
            type="text"
            id="f_Mobile"
            name="f_Mobile"
            placeholder="Mobile"
            value={formData.f_Mobile}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="f_Designation" className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
          <select
            id="f_Designation"
            name="f_Designation"
            value={formData.f_Designation}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          >
            <option value="">Select Designation</option>
            {designations.map(designation => (
              <option key={designation} value={designation}>
                {designation}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="f_Gender"
                value="Male"
                checked={formData.f_Gender === 'Male'}
                onChange={handleChange}
                className="form-radio"
                required
              />
              <span className="ml-2">Male</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="f_Gender"
                value="Female"
                checked={formData.f_Gender === 'Female'}
                onChange={handleChange}
                className="form-radio"
                required
              />
              <span className="ml-2">Female</span>
            </label>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Courses</label>
          <div className="flex flex-wrap gap-4">
            {courses.map(course => (
              <label key={course} className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="f_Course"
                  value={course}
                  checked={formData.f_Course.includes(course)}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <span className="ml-2">{course}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="f_Image" className="block text-sm font-medium text-gray-700 mb-1">Image</label>
          <input
            type="file"
            id="f_Image"
            name="f_Image"
            onChange={handleImageChange}
            accept=".jpg,.png"
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          {formData.f_Image && (formData.f_Image instanceof Blob) ? (
            <img
              src={URL.createObjectURL(formData.f_Image)}
              alt={formData.f_Name}
              className="mt-2 w-32 h-32 object-cover"
            />
          ) : formData.f_Image ? (
            <img
              src={`data:image/jpeg;base64,${btoa(String.fromCharCode(...new Uint8Array(formData.f_Image.data)))}`}
              alt={formData.f_Name}
              className="mt-2 w-32 h-32 object-cover"
            />
          ) : null}
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Update Employee
        </button>
      </form>
    </div>
  );
};

export default EditEmployee;
