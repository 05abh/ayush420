const jwt = require('jsonwebtoken');
const Patient = require('../models/Patient');
const Hospital = require('../models/Hospital');
const Admin = require('../models/Admin');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Patient Registration
exports.registerPatient = async (req, res) => {
  try {
    const { name, email, password, phone, ayushmanNumber, age, gender, address } = req.body;

    const patientExists = await Patient.findOne({ email });
    if (patientExists) {
      return res.status(400).json({ message: 'Patient already exists with this email' });
    }

    const patient = await Patient.create({
      name,
      email,
      password,
      phone,
      ayushmanNumber,
      age,
      gender,
      address
    });

    const token = generateToken(patient._id, 'patient');

    res.status(201).json({
      _id: patient._id,
      name: patient.name,
      email: patient.email,
      role: 'patient',
      token
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Hospital Registration
exports.registerHospital = async (req, res) => {
  try {
    const { name, email, password, address, phone, totalBeds, specialties } = req.body;

    const hospitalExists = await Hospital.findOne({ email });
    if (hospitalExists) {
      return res.status(400).json({ message: 'Hospital already exists with this email' });
    }

    const hospital = await Hospital.create({
      name,
      email,
      password,
      address,
      phone,
      totalBeds,
      availableBeds: totalBeds,
      specialties
    });

    const token = generateToken(hospital._id, 'hospital');

    res.status(201).json({
      _id: hospital._id,
      name: hospital.name,
      email: hospital.email,
      role: 'hospital',
      token
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    let user;
    if (role === 'patient') {
      user = await Patient.findOne({ email });
    } else if (role === 'hospital') {
      user = await Hospital.findOne({ email });
    } else if (role === 'admin') {
      user = await Admin.findOne({ email });
    }

    if (user && (await user.correctPassword(password))) {
      const token = generateToken(user._id, role);

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role,
        token
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};