const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const db = require("../models");

const { Note } = db;

// CREATE NOTE (user/admin)
router.post("/", auth, async (req, res) => {
  try {
    const note = await Note.create({
      title: req.body.title,
      userId: req.user.id,
    });

    res.json(note);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET NOTES
// ADMIN → all notes WITH timestamps
// USER → own notes WITHOUT timestamps

router.get("/", auth, async (req, res) => {
  try {
    let notes;

    if (req.user.role === "admin") {
      notes = await Note.findAll();
    } else {
      notes = await Note.findAll({
        where: { userId: req.user.id },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
    }

    res.json(notes);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE NOTE
router.delete("/:id", auth, async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.id);

    if (!note) return res.status(404).json({ msg: "Note not found" });

    if (req.user.role !== "admin" && note.userId !== req.user.id) {
      return res.status(403).json({ msg: "Forbidden" });
    }

    await note.destroy();
    res.json({ msg: "Note deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;