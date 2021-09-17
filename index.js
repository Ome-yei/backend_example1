const express = require("express");
const app = express();
const cors = require('cors')

// Takes to JSON data from the request and converts it to a javascript 
// object and then attaches it to the body property
app.use(express.json());

// Allows request from all origin (CORS Error)
app.use(cors())

// You can use Morgan to log evry request made to server.

let notes = [
    {
        id: 1,
        content: "HTML is easy",
        date: "2019-05-30T17:30:31.098Z",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only Javascript",
        date: "2019-05-30T18:39:34.091Z",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        date: "2019-05-30T19:20:14.298Z",
        important: true
    }
]

// get all notes
app.get('/api/notes', (req, res) => {
    res.json(notes);
});

// get one note
app.get('/api/notes/:id', (req, res) => {
    let noteId = Number(req.params.id);

    // Check if that note is in the array - return note
    // If not in the array - return status code 400 {"Note not found"}
    const note = notes.find(note => note.id === noteId);
    if (!note) {
        res.status(400).json({ error: "System malfunction, note cannot be found..." })
    }
    res.json(note);
});

// delete one note
app.delete('/api/notes/:id', (req, res) => {
    let noteId = Number(req.params.id);

    // Check if noteID is in the array
    // True - send back status: 204 
    // False = send back status: 404 - {"System Malfunction, can't delete what is not there..."}
    const toBeDeleted = notes.find(note => note.id === noteId);
    if (!toBeDeleted) {
        res.status(404).json({ error: "System malfunction, can't delete what is not there..." });
    }

    // Actually remove the item from the array
    res.status(204).end();
});

//post one note
app.post('/api/notes', (req, res) => {
    const body = req.body;
    if (!body.content) {
        return res.status(400).json({ error: "System malfunction, conten is misisng..." });
    }

    const note = {
        id: randomId(),
        content: body.content,
        date: new Date(),
        important: body.important || false,
    }

    notes = notes.concat(note);
    res.json(note);
});


const randomId = () => {
    const maxId = notes.length > 0
        ? Math.max(...notes.map(n => n.id))
        : 0

    return maxId + 1;
}


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})