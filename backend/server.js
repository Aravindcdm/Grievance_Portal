const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Allows JSON data in requests

// Connect to MongoDB
mongoose
  .connect("mongodb+srv://G-PORTAL:123@cluster0.0r1d2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Define Grievance Schema
const grievanceSchema = new mongoose.Schema({
  fullName: String,
  department: String,
  subject: String,
  details: String,
  priority: String,
  anonymous: Boolean,
  solved: { type: Boolean, default: false },
  reply: { type: String, default: "" },
  votes: { type: Number, default: 0 }, // Add 'votes' field
  createdAt: { type: Date, default: Date.now },
});

const Grievance = mongoose.model("Grievance", grievanceSchema);

// API Routes

// Create a grievance
app.post("/api/grievances", async (req, res) => {
  try {
    const grievance = new Grievance(req.body);
    await grievance.save();
    res.status(201).json({ message: "Grievance submitted successfully", grievance });
  } catch (error) {
    res.status(500).json({ message: "Error submitting grievance", error });
  }
});

// Get all grievances
app.get("/api/grievances", async (req, res) => {
  try {
    const grievances = await Grievance.find();
    res.json(grievances);
  } catch (error) {
    res.status(500).json({ message: "Error fetching grievances", error });
  }
});

// Update votes for a grievance (Voting API)
app.put("/api/grievances/vote/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Increment the vote by 1 using the $inc operator in MongoDB
    const updatedGrievance = await Grievance.findByIdAndUpdate(
      id,
      { $inc: { votes: 1 } }, // Increment vote count by 1
      { new: true, runValidators: true }  // Ensure validation rules are run
    );

    if (!updatedGrievance) {
      return res.status(404).json({ message: "Grievance not found" });
    }

    // Send the updated grievance back in the response
    res.status(200).json(updatedGrievance);
  } catch (error) {
    console.error("Error updating grievance votes:", error);
    res.status(500).json({ message: "Error updating grievance votes", error: error.message });
  }
});

// Delete a grievance
app.delete("/api/grievances/:id", async (req, res) => {
  const { id } = req.params;
  console.log('Deleting grievance with ID:', id); // Log the id to check the request
  try {
    const deletedGrievance = await Grievance.findByIdAndDelete(id);
    if (!deletedGrievance) {
      return res.status(404).json({ message: "Grievance not found" });
    }
    res.json({ message: "Grievance deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting grievance", error });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
