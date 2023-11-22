// src/EditEmployeeForm.js
import React, { useState, useEffect } from 'react';

const EditEmployeeForm = ({ employee, onClose, onSubmit  }) => {
  const [formData, setFormData] = useState({ ... employee  });

  useEffect(() => {
    // Update form data when selectedEmployee changes (i.e., when editing)
    setFormData( ...employee);
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Edit Employee</h2>

        <label>
          Employee Name:
          <input
            type="text"
            name="employeeName"
            value={formData.employeeName}
            onChange={handleChange}
          />
        </label>

        {/* Add other fields as needed */}

        <div className="button-container">
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditEmployeeForm;
