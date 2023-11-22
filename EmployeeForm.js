// src/EmployeeForm.js
import React, { useState, useEffect} from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useHistory } from 'react-router-dom';  // Import useHistory from react-router-dom
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './EmployeeForm.css'; 
// import EmployeeList from './EmployeeList';
import Modal from 'react-modal';
import toastr from 'toastr';

Modal.setAppElement('#root'); 

const EmployeeForm = ({ onAddOrUpdateEmployee, selectedEmployee, onCancelEdit }) => {
  const { handleSubmit: handleFormSubmit, control, register, setValue, reset } = useForm();
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  //const [employees, setEmployees] = useState([]);

  useEffect(() => {
    if (selectedEmployee) {
      setValue('employeeName', selectedEmployee.employeeName);
      setValue('id', selectedEmployee.id);
      setValue('fatherName', selectedEmployee.fatherName);
      setValue('salary', selectedEmployee.salary);
      // Populate other fields as needed
      // ...
      setSelectedDate(new Date(selectedEmployee.dob));
      setValue('country', { value: selectedEmployee.country, label: selectedEmployee.country });
      setValue('languages', selectedEmployee.languages.map(language => ({ value: language, label: language })));
    }
  }, [selectedEmployee, setValue]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    reset();
    onCancelEdit(); // Clear the selectedEmployee state
  };

  const onSubmit = async (data) => {
    try {
      const url = selectedEmployee 
      ? `http://localhost:3001/api/employees/${selectedEmployee._id}` 
      : 'http://localhost:3001/api/employees';
      const method = selectedEmployee ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, dob: selectedDate.toISOString() }),
      });

      if (response.ok) {
        const savedEmployee = await response.json();
        if (selectedEmployee) {
          // If editing, call onEditEmployee with the updated employee
          onAddOrUpdateEmployee(savedEmployee);
        } else {
          // If adding, call onAddEmployee with the new employee
          console.log("data inserted form form page");
          onAddOrUpdateEmployee(savedEmployee);
        }

        closeModal(); 
        toastr.success("Employee added successfully", "Success",{
          closeButton: true,
          progressBar: true,
          timeOut: 3000,
          positionClass: "toast-top-center",
          showMethod: "fadeIn",
          hideMethod: "fadeOut",
        });
      } else {
        console.error('Error saving employee to the server');
        toastr.error('Error saving employee', {
          closeButton: true,
          progressBar: true,
          timeOut: 3000,
          positionClass: "toast-top-center",
          showMethod: "fadeIn",
          hideMethod: "fadeOut",
        });
      }
    } catch (error){
        console.error('Error saving employee to the server', error);
      }
    };

    // useEffect(() => {
    //   // If selectedEmployee is provided, populate the form with its data
    //   if (selectedEmployee) {
    //     setValue('employeeName', selectedEmployee.employeeName);
    //     setValue('id', selectedEmployee.id);
    //     setValue('fatherName', selectedEmployee.fatherName);
    //     setValue('salary', selectedEmployee.salary);
    //     setSelectedDate(new Date(selectedEmployee.dob));
    //     setValue('gender', selectedEmployee.gender);
    //     setValue('languages', selectedEmployee.languages);
    //     setValue('country', selectedEmployee.country);
    //     // Populate other fields as needed
    //   }
    // }, [selectedEmployee]);

  return (
    <div>
     <button onClick={openModal}>{
     selectedEmployee ? 'Edit Employee' : 'Add Employee'}</button>

     <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Employee Form Modal"
        className="modal"
        overlayClassName="overlay"
      >
        <button className="close-btn" onClick={closeModal}>
          &times;
        </button>
        <h2>{selectedEmployee ? 'Edit Employee' : 'Add Employee'}</h2> 

    <form className="employee-form" onSubmit={handleFormSubmit(onSubmit)}>
            
    <div className="form-group">
      <label>Employee Name</label>
      <input {...register('employeeName', { required: true })} />
    </div>

    <div className="form-group">
      <label>ID</label>
      <input {...register('id', { required: true })} />
    </div>

    <div className="form-group">
      <label>Father's Name</label>
      <input {...register('fatherName', { required: true })} />
    </div>

    <div className="form-group">
      <label>Salary</label>
      <input {...register('salary', { required: true })} type="number" />
    </div>

    <div className="form-group">
      <label>Date of Birth</label>
      <Controller
        control={control}
        name="dob"
        rules={{ required: 'Date of Birth is required' }}
        render={({ field }) => (
         <DatePicker 
         {...field}               
         selected={selectedDate}
          onChange={(date) => {
            setValue('dob', date, { shouldValidate: true });
           setSelectedDate(date)
        }} 
         dateFormat="dd/MM/yyyy"
        // {...field}
         />
  )}
      />
        {/* {errors.dob && <span className="error-message">{errors.dob.message}</span>} */}
    </div>

<div className="form-group">
      <label>Gender</label>
      <div>
      <label>
      Male
        <input type="radio" value="male" {...register('gender', { required: 'Gender is required' })} />
      </label>
      <label>
      Female
        <input type="radio" value="female" {...register('gender', { required: 'Gender is required' })} />
      </label>
      </div>
      {/* {errors.gender && <span className="error-message">{errors.gender.message}</span>} */}
    </div>

    <div className="form-group">
      <label>Languages</label>
      <div>
      <label>
      English
        <input type="checkbox" value="english" {...register('languages')} />
      </label>
      <label>
      Spanish
        <input type="checkbox" value="spanish" {...register('languages')} />
      </label>
      </div>
      {/* Add more languages as needed */}
    </div>


    <div className="form-group">
      <label>Country</label>
      <Controller
        control={control}
        name = "country"
        render={({ field }) => (
      <Select
      {...field}
        options={[{ value: 'usa', label: 'USA' }, { value: 'uk', label: 'UK' }]}
        // {...register('country')}
      />
        )}
        />
    </div>


    <div className="form-group">
      <label>Profile Upload</label>
      <input type="file" {...register('profileUpload')} />
    </div>

    <div className="form-group">
      <label>Resume Upload</label>
      <input type="file" {...register('resumeUpload')} />
    </div>

      <button className="submit-btn" type="submit">{selectedEmployee ? 'Update' : 'Submit'}</button>
    </form>
    </Modal>
    </div>
  );
};

export default EmployeeForm;
