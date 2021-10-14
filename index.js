const express = require("express");
const app = express();

const cors = require('cors')


// Allows express to show static content
app.use(express.static('build'))

// Takes to JSON data from the request and converts it to a javascript 
// object and then attaches it to the body property
app.use(express.json());

// Allows request from all origin (CORS Error)
app.use(cors())


const Note = require('./models/note');
const note = require("./models/note");


// You can use Morgan to log evry request made to server.

// get all notes
app.get('/api/notes', (req, res) => {
    Note.find({}).then(notes => {
        res.json(notes);
    })
});

app.put('/api/notes/:id', (req, res, next) => {
    console.log("I am put...")
    const body = req.body;

    const note = {
        content: body.content,
        important: body.important
    }

    Note.findByIdAndUpdate(req.params.id, note, { new: true })
        .then(updatedNote => {
            res.json(updatedNote);
        })
        .catch(error => next(error))
})


// get one note
app.get('/api/notes/:id', (req, res, next) => {
    Note.findById(req.params.id).then(note => {
        if (note) {
            res.json(note)
        } else {
            res.status(404).end();
        }
    })
        .catch(error => next(error));
});

// delete one note
app.delete('/api/notes/:id', (req, res) => {
    let noteId = Number(req.params.id);

    Note.findByIdAndRemove(noteId)
        .then(result => {
            res.status(204).end();
        })
        .catch(error => next(error));
});


//post one note
app.post('/api/notes', (req, res, next) => {
    const body = req.body;
    if (!body.content) {
        return res.status(400).json({ error: "System malfunction, conten is missing..." });
    }

    const note = new Note({
        content: body.content,
        date: new Date(),
        important: body.important || false,
    })

    note.save().then(savedNote => {
        res.json(savedNote)
    })
        .catch(error => next(error))
});



const errorHandler = (error, req, res, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message })
    }

    next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})