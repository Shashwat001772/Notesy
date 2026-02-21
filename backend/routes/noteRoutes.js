const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const checkRole = require("../middleware/role");
const { createNote, getMyNotes, getAllNotes, deleteNote} = require("../controllers/noteController");

// User Routes
router.post("/", auth, createNote);       // Create note
router.get("/", auth, getMyNotes);        // View own notes
router.delete("/:id", auth, deleteNote);    // Delete own note
// Admin Routes
// Notice we pass "admin" to checkRole
router.get("/all", auth, checkRole("admin"), getAllNotes); 

module.exports = router;