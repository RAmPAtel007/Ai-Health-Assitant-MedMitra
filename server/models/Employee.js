const mongoose = require('mongoose');

const VaccinationSchema = new mongoose.Schema({
  vaccineName: String,
  doseNumber: Number,
  totalDoses: Number,
  nextDoseDate: String, // store YYYY-MM-DD
  completed: { type: Boolean, default: false }
});

const EmployeeSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  age: String,
  gender: String,
  address: String,
  city: String,
  state: String,
  phone1: String,
  phone2: String,
  blood: String,
  disease: String,
  medicine: String,

  vaccinations: [
    {
      vaccineName: String,
      nextDoseDate: String,
      doseNumber: Number,
      totalDoses: Number,
      completed: { type: Boolean, default: false }
    }
  ]
});


const EmployeeModel = mongoose.model("employees", EmployeeSchema);
module.exports = EmployeeModel;
