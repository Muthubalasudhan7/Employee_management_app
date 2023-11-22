// src/EmployeeList.js
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import './EmployeeList.css';
import EmployeeForm from './EmployeeForm';
import EditEmployeeForm from './EditEmployeeForm';
import './EditEmployeeForm.css';


const EmployeeList = ({ employees, onDelete }) => {
    const [editEmployee, setEditEmployee] = useState(null);

    const handleEditClick = (employee) => {
        setEditEmployee(employee);
      };

      const handleEditFormClose = () => {
        setEditEmployee(null);
      };
    
      const handleFormSubmit = (formData) => {
        // Implement your logic to handle form submission (add or edit)
        console.log('Form submitted:', formData);
        handleEditFormClose();
      };

  return (
    <div>
    <table>
      <thead>
        <tr>
          <th>Employee Name</th>
          <th>ID</th>
          <th>Father's Name</th>
          <th>Salary</th>
          <th>Date of Birth</th>
          <th>Gender</th>
          <th>Languages</th>
          <th>Country</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {employees.map((employee) => (
          <tr key={employee._id}>
            <td>{employee.employeeName}</td>
            <td>{employee.id}</td>
            <td>{employee.fatherName}</td>
            <td>{employee.salary}</td>
            <td>{employee.dob}</td>
            <td>{employee.gender}</td>
            <td>{employee.languages.join(', ')}</td>
            <td>{employee.country}</td>
            <td>
              <button onClick={() => handleEditClick(employee)}>
              <FontAwesomeIcon icon={faEdit} />
                </button>
              <button onClick={() => onDelete(employee._id)}>
              <FontAwesomeIcon icon={faTrash} />
                </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    {editEmployee && (
        <EditEmployeeForm
          employee={editEmployee}
          onClose={handleEditFormClose}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
      );
};

export default EmployeeList;
