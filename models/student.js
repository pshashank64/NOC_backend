const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    index: { unique: true}
  },
  roll: {
    type: Number,
    required: true,
    index: { unique: true}
  },
  password: {
    type: String,
    required: true
  },
  role:{
    type: String,
    required: true
  }
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;