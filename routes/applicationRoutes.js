import express from 'express';
import Application from '../models/applicationModel.js'; // Import model
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
const router = express.Router();

dotenv.config();




// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail
    pass: process.env.EMAIL_PASS, // App password (not your regular email password)
  },
});

// POST route to handle application form submission

// POST route to handle application form submission

router.post('/', async (req, res) => {
  const { name, number, email, city, course, collegeName, location } = req.body;
console.log(req.body);

  try {
    // Create a new application entry
    const newApplication = new Application({
      name,
      number,
      email,
      city,
      course,
      collegeName,
      location,
    });

    // Save the new application to the database
    const application = await newApplication.save();

    // Email content for admin
    const mailOptions = {
      from: email,
      to: process.env.ADMIN_EMAIL, // Sending email to admin
      subject: 'New Application Submitted',
      html: `
        <h2>New Application Received</h2>
        <p>A new application has been submitted with the following details:</p>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Phone Number:</strong> ${number}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>City:</strong> ${city}</li>
          <li><strong>Course:</strong> ${course}</li>
          <li><strong>College Name:</strong> ${collegeName}</li>
          <li><strong>Location:</strong> ${location}</li>
        </ul>
        <p>Please review the application in the system.</p>
      `,
    };

    // Send the email to admin
    const emailResponse = await transporter.sendMail(mailOptions);

    if (emailResponse.accepted.length > 0) {
      res.status(201).json({
        application,
        message: 'Application saved and email sent successfully',
      });
    } else {
      res.status(500).json({
        message: 'Application saved, but email sending failed',
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error saving application data or sending email' });
  }
});





router.get('/', async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 }); // Latest first
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications' });
  }
});




router.put("/:id/add-note", async (req, res) => {
  const { id } = req.params;
  const { note } = req.body; // Get the note from the request body

  if (!note || note.trim().length === 0) {
    return res.status(400).json({ message: "Note cannot be empty" });
  }

  try {
    // Find the application by ID and update the note field
    const application = await Application.findByIdAndUpdate(
      id,
      { note },
      { new: true } // Return the updated application document
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    return res.status(200).json({ message: "Note added successfully", application });
  } catch (error) {
    console.error("Error adding note:", error);
    return res.status(500).json({ message: "Server error" });
  }
});


  router.put("/:id/complete", async (req, res) => {
    try {
      const application = await Application.findById(req.params.id);
      console.log(req.params.id);
      
      if (!application) return res.status(404).json({ message: "Application not found" });
  
      application.completed = !application.completed;
      await application.save();
  
      res.json(application);    
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

export default router;
