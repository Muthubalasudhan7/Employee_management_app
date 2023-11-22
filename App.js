// src/App.js
import React, { useState, useEffect } from 'react';
import EmployeeForm from './EmployeeForm';
import EmployeeList from './EmployeeList';
import Login from './components/Login';
import toastr from 'toastr';
import { BrowserRouter as Router, Routes,Route,Navigate } from 'react-router-dom';


function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    // Fetch employees when the component mounts
    if (isLoggedIn) {
      fetchEmployees();
    }
  }, [isLoggedIn]);

  const handleLogin = (username, password) => {
    // Make a login API request
    // Assuming you have a login API endpoint
    fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setLoggedIn(true);
          toastr.success('Login successful');
        } else {
          toastr.error('Invalid credentials');
        }
      })
      .catch((error) => {
        console.error('Error logging in:', error);
        toastr.error('Error logging in');
      });
  };

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/employees');
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  useEffect(() => {
    // Fetch employees when the component mounts
    fetchEmployees();
  }, []);

  const handleEditEmployee = (employee) => {
    // Set the selectedEmployee state when editing
    setSelectedEmployee(employee);
  } 

  const handleAddOrUpdateEmployee = async (employeeData) => {
    try {
      console.log(selectedEmployee);
      if (selectedEmployee) {
        // If selectedEmployee is present, it's an edit operation
        const response = await fetch(`http://localhost:3001/api/employees/${selectedEmployee._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(employeeData),
        });

        if (response.ok) {
          toastr.success('Employee updated successfully');
          // Refresh the employee list after updating
          await fetchEmployees();
          // Clear the selectedEmployee state
          setSelectedEmployee(null);
        } else {
          toastr.error('Failed to update employee');
        }
      } else {
        await fetchEmployees();
        // If selectedEmployee is not present, it's an add operation
        // const response = await fetch('http://localhost:3001/api/employees', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(employeeData),
        // });

        // console.log(response);

        // if (response.ok) {
        //   const newEmployee = await response.json();
        //   setEmployees((prevEmployees) => [...prevEmployees, newEmployee]);
        //   await fetchEmployees();
        //   toastr.success('Employee added successfully');
        // } else {
        //   toastr.error('Failed to add employee');
        // }
      }
    } catch (error) {
      console.error('Error saving employee:', error);
      toastr.error('Error saving employee');
    }
  };


  // const handleRefreshEmployeeList = async () => {
  //   try {
  //     // Refresh the employee list after updating
  //     await fetchEmployees();
  //   } catch (error) {
  //     console.error('Error refreshing employee list:', error);
  //   }
  // };

  const handleDeleteEmployee = async (employeeId) => {
    // Implement delete functionality
    try {
      const response = await fetch(`http://localhost:3001/api/employees/${employeeId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('Employee deleted successfully');
        await fetchEmployees(); 
        toastr.success("Employee deleted successfully", "Success",{
          closeButton: true,
          progressBar: true,
          timeOut: 3000,
          positionClass: "toast-top-center",
          showMethod: "fadeIn",
          hideMethod: "fadeOut",
        });
      } else {
        console.error('Error deleting employee');
        toastr.error('Error deleting employee', {
          closeButton: true,
          progressBar: true,
          timeOut: 3000,
          positionClass: "toast-top-center",
          showMethod: "fadeIn",
          hideMethod: "fadeOut",
        });
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const onCancelEdit = () => {
    setSelectedEmployee(null);
  };

  return (
    <Router>
    <div className="App">
    <Routes>
    <Route 
    path="/" 
    element={!isLoggedIn ? (
    <Login onLogin={handleLogin} />
   ) : (
   <Navigate to="/employee" />
    )
    }
     />
    <Route path="/employee" 
    element={
      isLoggedIn ? ( 
        <>
          <h1>Employee Management System</h1>
      <EmployeeForm 
        onAddOrUpdateEmployee={handleAddOrUpdateEmployee}
      selectedEmployee={selectedEmployee}
      onCancelEdit={onCancelEdit}
      />
      <EmployeeList 
      employees={employees} 
      onEdit={handleEditEmployee} 
      onDelete={handleDeleteEmployee} 
      />
      </>
      ) : (
        <Navigate to="/login" />
      )
      } 
      />
      </Routes>
        </div>
        </Router>
      );
  }

export default App;
