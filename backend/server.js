const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect("mongodb+srv://G-PORTAL:123@cluster0.0r1d2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

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
  votes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Grievance = mongoose.model("Grievance", grievanceSchema);

// ✅ Create a grievance
app.post("/api/grievances", async (req, res) => {
  try {
    const grievance = new Grievance(req.body);
    await grievance.save();
    res.status(201).json({ message: "✅ Grievance submitted successfully", grievance });
  } catch (error) {
    res.status(500).json({ message: "❌ Error submitting grievance", error });
  }
});

// ✅ Get all grievances
app.get("/api/grievances", async (_req, res) => {
  try {
    const grievances = await Grievance.find();
    res.json(grievances);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "❌ Error fetching grievances", error });
  }
});

// ✅ Update grievance status (solved or reply)
app.put("/api/grievances/:id", async (req, res) => {
  const { id } = req.params;

  console.log("🟡 Update request received for ID:", id);
  console.log("🟡 Request Body:", req.body);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "❌ Invalid grievance ID format" });
  }

  try {
    const updatedGrievance = await Grievance.findByIdAndUpdate(id, { $set: req.body }, { new: true });

    if (!updatedGrievance) {
      return res.status(404).json({ message: "❌ Grievance not found" });
    }

    res.json({ message: "✅ Grievance updated successfully", grievance: updatedGrievance });
  } catch (error) {
    console.error("❌ Error updating grievance:", error);
    res.status(500).json({ message: "❌ Error updating grievance", error });
  }
});

// ✅ Delete a grievance
app.delete("/api/grievances/:id", async (req, res) => {
  const { id } = req.params;
  console.log("🟡 Deleting grievance with ID:", id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "❌ Invalid grievance ID format" });
  }

  try {
    const deletedGrievance = await Grievance.findByIdAndDelete(id);
    if (!deletedGrievance) {
      return res.status(404).json({ message: "❌ Grievance not found" });
    }
    res.json({ message: "✅ Grievance deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "❌ Error deleting grievance", error });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
