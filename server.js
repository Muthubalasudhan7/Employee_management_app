// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const port = 3001; // Choose any port you prefer

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB 
mongoose.connect('mongodb://127.0.0.1:27017/employee_management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

  // Define User schema and model (assuming you have a User model in MongoDB)
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
  });
  
  const User = mongoose.model('User', userSchema);

  // API endpoint for user login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body);
  
    // Check if the user exists in the database (replace 'username' with the actual field name)
    const user = User.findOne({ username, password});
  
    console.log('User:', user);

    if (user){
        res.json({ success: true, message: 'Login successful' });
    } else {
      res.json({ success: false, message: 'Invalid credentials' });
    }
  });

// Define a mongoose schema for your Employee model
const employeeSchema = new mongoose.Schema({
  employeeName: String,
  id: String,
  fatherName: String,
  salary: Number,
  dob: Date,
  gender: String,
  languages: [String],
  country: String,
  profileUpload: String,
  resumeUpload: String,
});

// Create a mongoose model based on the schema
const Employee = mongoose.model('Employee', employeeSchema);

// API endpoint to save an employee to the database
app.post('/api/employees', async (req, res) => {
  try {
    console.log('Incoming data:', req.body);
    const country = req.body.country ? req.body.country.value || '' : '';
        // Convert profileUpload and resumeUpload objects to strings
        const profileUpload = req.body.profileUpload ? req.body.profileUpload[0]?.path || '' : '';
        const resumeUpload = req.body.resumeUpload ? req.body.resumeUpload[0]?.path || '' : '';

    const newEmployee = new Employee({
        ...req.body,
        _id: new mongoose.Types.ObjectId(), // Generate a new unique ObjectId
        country,
        profileUpload,
        resumeUpload,
    });
    
    const savedEmployee = await newEmployee.save();
    res.status(201).json(savedEmployee);
  } catch (error) {    
    console.error('Error saving employee:', error);
    res.status(500).json({ error: 'Error saving employee to the database' });
    }  
});

// API endpoint to get all employees
app.get('/api/employees', async (req, res) => {
    try {
      const employees = await Employee.find();
      res.json(employees);
    } catch (error) {
      console.error('Error fetching employees:', error);
      res.status(500).json({ error: 'Error fetching employees' });
    }
  });

  // API endpoint to delete an employee by _id
app.delete('/api/employees/:id', async (req, res) => {
    try {
      const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
      if (deletedEmployee) {
        res.json({ success: true, message: 'Employee deleted successfully' });
      } else {
        res.status(404).json({ success: false, message: 'Employee not found' });
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      res.status(500).json({ error: 'Error deleting employee' });
    }
  });
  

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
