const { Note, User } = require("../models");

exports.createNote = async (req, res) => {
  try {
    const note = await Note.create({
      title: req.body.title,
      UserId: req.user.id
    });

    return res.status(200).json(note);
  } catch (err) {
    console.log("CREATE NOTE ERROR => ", err);
    return res.status(500).json({ error: err.message });
  }
};

exports.getMyNotes = async (req, res) => {
  try {
    const notes = await Note.findAll({
      where: { UserId: req.user.id }
    });

    return res.status(200).json(notes);
  } catch (err) {
    console.log("GET NOTES ERROR => ", err);
    return res.status(500).json({ error: err.message });
  }
};

exports.getAllNotes = async (req, res) => {
  try {
    const notes = await Note.findAll({
      include: {
        model: User,
        attributes: ["name", "email"]
      }
    });

    return res.status(200).json(notes);
  } catch (err) {
    console.log("GET ALL NOTES ERROR => ", err);
    return res.status(500).json({ error: err.message });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    await Note.destroy({
      where: {
        id: req.params.id,
        UserId: req.user.id // extra safety
      }
    });

    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
