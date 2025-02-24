import express from 'express';
import Application from '../models/applicationModel.js'; // Import model
const router = express.Router();

// POST route to handle application form submission
router.post('/', async (req, res) => {
  const { name, number, email, city, course, collegeName, location } = req.body;

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
    res.status(201).json(application); // Send back the saved application
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving application data" });
  }
});


router.get('/', async (req, res) => {
    try {
      const applications = await Application.find(); // Fetch all applications
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
