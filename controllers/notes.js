const notesRouter = require('express').Router();
const Note = require('../models/note');

// get all notes
notesRouter.get('/', (req, res) => {
  Note.find({}).then((notes) => {
    res.json(notes);
  });
});

notesRouter.put('/:id', (req, res, next) => {
  console.log('I am put...');
  const { body } = req;

  const note = {
    content: body.content,
    important: body.important,
  };

  Note.findByIdAndUpdate(req.params.id, note, { new: true })
    .then((updatedNote) => {
      res.json(updatedNote);
    })
    .catch((error) => next(error));
});

// get one note
notesRouter.get('/:id', (req, res, next) => {
  Note.findById(req.params.id).then((note) => {
    if (note) {
      res.json(note);
    } else {
      res.status(404).end();
    }
  })
    .catch((error) => next(error));
});

// delete one note
notesRouter.delete('/:id', (req, res, next) => {
  const noteId = Number(req.params.id);

  Note.findByIdAndRemove(noteId)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

// post one note
notesRouter.post('/', (req, res, next) => {
  const { body } = req;
  if (!body.content) {
    return res.status(400).json({ error: 'System malfunction, conten is missing...' });
  }

  const note = new Note({
    content: body.content,
    date: new Date(),
    important: body.important || false,
  });

  note.save().then((savedNote) => {
    res.json(savedNote);
  })
    .catch((error) => next(error));
});

module.exports = notesRouter;
