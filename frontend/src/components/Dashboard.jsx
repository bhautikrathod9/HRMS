import React, { useState, useEffect } from 'react';
import { IoHomeSharp } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EmployeeDashboard = () => {
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [address, setAddress] = useState({
    line1: '',
    city: '',
    state: '',
    zip: '',
  });
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      const employeeId = localStorage.getItem('employeeId');
      try {
        const response = await axios.get(`http://localhost:3000/employees/${employeeId}`);
        const fullAddress = response.data.address || '';
        const [line1 = '', city = '', state = '', zip = ''] = fullAddress.split(',').map(s => s.trim());
        setAddress({ line1, city, state, zip });
      } catch (error) {
        console.error('Failed to fetch employee data:', error);
      }
    };
  
    fetchEmployee();
  }, []);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const employeeId = localStorage.getItem('employeeId');
        const token = localStorage.getItem('token');
        
        const response = await axios.get(`http://localhost:3000/employee/${employeeId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const empData = response.data;
        setEmployee(empData);
  
        // Split the full address string into parts
        if (empData.address) {
          const [line1 = '', city = '', state = '', zip = ''] = empData.address.split(',').map(part => part.trim());
          setAddress({ line1, city, state, zip });
        } else {
          setAddress({
            line1: '',
            city: '',
            state: '',
            zip: '',
          });
        }
  
        setPhoto(empData.photoUrl || null); 
      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    };
  
    fetchEmployeeData();
  }, []);
  

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 200 * 1024) {
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (allowedTypes.includes(file.type)) {
        setPhoto(URL.createObjectURL(file));
      } else {
        alert('Only PDF, JPEG, and PNG formats are allowed.');
      }
    } else {
      alert('File size must be under 200KB.');
    }
  };

  const handleSubmit = async () => {
    try {
      const employeeId = localStorage.getItem('employeeId');
      const fullAddress = `${address.line1}, ${address.city}, ${address.state}, ${address.zip}`;
  
      await axios.put(`http://localhost:3000/address/${employeeId}`, {
        line1: address.line1,
        city: address.city,
        state: address.state,
        zip: address.zip,
      });
  
      alert('Address updated successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to update address.');
    }
  };

  const handleTabClick = (tab) => {
    if (tab === 'Employee Data') return;
    navigate('/comingSoon');
  };

  const handleCancel = () => {
    if (employee?.address) {
      setAddress(employee.address);
    } else {
      setAddress({
        line1: '',
        city: '',
        state: '',
        zip: '',
      });
    }
    setPhoto(null);
  };

  return (
    <div className="min-h-screen bg-white text-black p-6 font-sans">
      <div className="flex justify-between items-center border-b border-gray-300 pb-4 mb-4">
        <div className="flex gap-4">
          <IoHomeSharp className='text-2xl cursor-pointer' />
          <MdLogout className='text-2xl cursor-pointer' onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('employeeId');
            navigate('/login');
          }} />
        </div>
        <div className="bg-blue-600 text-white px-3 py-1 rounded">Privileged</div>
      </div>

      <div className="flex space-x-1 overflow-x-auto text-sm border-b border-gray-200 mb-6">
        {['Employee Data', 'View Compensation', 'View Benefits', 'Time Entry (weekly)', 'View Projects', 'View Payslips', 'View Tax Summary', 'Work Login'].map((tab, idx) => (
          <div
            key={idx}
            onClick={() => handleTabClick(tab)}
            className={`cursor-pointer px-4 py-2 ${idx === 0 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'} rounded-t`}
          >
            {tab}
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold text-center mb-4">View Employee Data</h2>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <table className="w-full border border-gray-300">
          <tbody>
            <tr><td className="p-2 font-bold border-b">Employee Name:</td><td className="p-2 border-b">{employee?.name || '-'}</td></tr>
            <tr><td className="p-2 font-bold border-b">Employment Type:</td><td className="p-2 border-b">{employee?.employment_type || 'Contractor'}</td></tr>
            <tr><td className="p-2 font-bold border-b">Contact Number:</td><td className="p-2 border-b">{employee?.contact_number || '-'}</td></tr>
            <tr><td className="p-2 font-bold">Job Location:</td><td className="p-2">{employee?.job_location || 'USA'}</td></tr>
          </tbody>
        </table>
        <table className="w-full border border-gray-300">
          <tbody>
            <tr><td className="p-2 font-bold border-b">Employee ID:</td><td className="p-2 border-b">{employee?.employee_id || '-'}</td></tr>
            <tr><td className="p-2 font-bold border-b">Job Title:</td><td className="p-2 border-b">{employee?.job_title || '-'}</td></tr>
            <tr><td className="p-2 font-bold">Date of Joining:</td><td className="p-2">{employee?.date_of_joining || '-'}</td></tr>
          </tbody>
        </table>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
        <h3 className="text-lg font-semibold mb-2 text-black">Address:</h3>
            <input
              name="line1"
              value={address.line1}
              onChange={handleAddressChange}
              placeholder="Street Address"
              className="w-full p-2 mb-2 border border-gray-300 rounded"
            />
            <input
              name="city"
              value={address.city}
              onChange={handleAddressChange}
              placeholder="City"
              className="w-full p-2 mb-2 border border-gray-300 rounded"
            />
            <input
              name="state"
              value={address.state}
              onChange={handleAddressChange}
              placeholder="State"
              className="w-full p-2 mb-2 border border-gray-300 rounded"
            />
            <input
              name="zip"
              value={address.zip}
              onChange={handleAddressChange}
              placeholder="Zip Code"
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
        </div>

        <div className="flex justify-center items-center">
          <label className="w-64 h-64 border-2 border-dashed border-gray-400 flex flex-col items-center justify-center cursor-pointer rounded-lg">
            <input type="file" className="hidden" onChange={handlePhotoUpload} />
            {photo ? (
              <img src={photo} alt="Uploaded" className="w-full h-full object-cover rounded" />
            ) : (
              <span className="text-gray-500">Click to upload image</span>
            )}
          </label>
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Submit</button>
        <button onClick={handleCancel} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded">Cancel</button>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
