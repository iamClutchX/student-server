const express = require("express");
const mongoose = require("mongoose");
const Student = require("./student");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

require("dotenv").config();

const databaseUrl = process.env.DATABASE_URL;

mongoose
  .connect(databaseUrl)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log(error));

app.post("/api/students", async (req, res) => {
  try {
    const { name, email, phone, address, dateOfBirth, gender } = req.body;
    const student = new Student({
      name,
      email,
      phone,
      address,
      dateOfBirth,
      gender,
    });

    const savedStudent = await student.save();
    res.json(savedStudent);
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while creating the student" });
  }
});

app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while fetching the students" });
  }
});

app.put("/api/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, dateOfBirth, gender } = req.body;

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { name, email, phone, address, dateOfBirth, gender },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(updatedStudent);
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while updating the student" });
  }
});

app.delete("/api/students/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(deletedStudent);
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while deleting the student" });
  }
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
