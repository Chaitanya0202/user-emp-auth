import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { useGlobelContext } from '../apiContext/UserContext';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [username, setUsername] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const { apiurl } = useGlobelContext();

  useEffect(() => {
    fetchEmployees();
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, [search, page, navigate]);

  const fetchEmployees = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No token found, please log in');
      navigate('/login');
      return;
    }

    try {
      const res = await axios.get(`${apiurl}/employees`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          search,
          page,
          limit: 10
        }
      });
      setEmployees(res.data.employees);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      alert('Error fetching employees');
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleCreate = () => {
    navigate('/create-employee');
  };

  const handleEdit = (id) => {
    navigate(`/edit-employee/${id}`);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No token found, please log in');
      navigate('/login');
      return;
    }

    try {
      await axios.delete(`${apiurl}/employees/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setEmployees(employees.filter(employee => employee._id !== id));
    } catch (error) {
      alert('Error deleting employee');
    }
  };

  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Employee Dashboard</h1>
      <div className="flex justify-between items-center mb-4">
        <p className="text-lg font-medium">Welcome, {username}</p>
        <div className="space-x-2">
          <button
            onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Create Employee
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search by name or email"
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left">Image</th>
              <th className="py-2 px-4 border-b text-left">Name</th>
              <th className="py-2 px-4 border-b text-left">Email</th>
              <th className="py-2 px-4 border-b text-left">Mobile</th>
              <th className="py-2 px-4 border-b text-left">Designation</th>
              <th className="py-2 px-4 border-b text-left">Gender</th>
              <th className="py-2 px-4 border-b text-left">Courses</th>
              <th className="py-2 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(employee => (
              <tr key={employee._id}>
                <td className="py-2 px-4 border-b">
                  {employee.f_Image && employee.f_Image.data ? (
                    <img
                      src={`data:image/jpeg;base64,${arrayBufferToBase64(employee.f_Image.data)}`}
                      alt={employee.f_Name}
                      className="w-16 h-16 object-cover"
                    />
                  ) : (
                    <span>No Image</span>
                  )}
                </td>
                <td className="py-2 px-4 border-b">{employee.f_Name}</td>
                <td className="py-2 px-4 border-b">{employee.f_Email}</td>
                <td className="py-2 px-4 border-b">{employee.f_Mobile}</td>
                <td className="py-2 px-4 border-b">{employee.f_Designation}</td>
                <td className="py-2 px-4 border-b">{employee.f_Gender}</td>
                <td className="py-2 px-4 border-b">{employee.f_Course.join(', ')}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleEdit(employee._id)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(employee._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-end gap-4 items-center lg:mr-12">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-blue-300"
        >
          <FaAnglesLeft />
        </button>
        <span className="text-lg">{`Page ${page} of ${totalPages}`}</span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-blue-300"
        >
          <FaAnglesRight />
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
