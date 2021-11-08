const express = require('express');
const path = require('path');
const fs = require('fs/promises');

const PORT = 3001;

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

async function getNotes() {
    const database = await fs.readFile(path.join(__dirname, '/db/db.json'));
    return JSON.parse(database);
};

// GET route
// Gets the index.html (front page)
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// Gets the notes.html page where the user can interact with notes
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// Gets the saved notes in the db.json file
app.get('/api/notes', async (req, res) => {
    const data = await getNotes();
    res.json(data)
});

// POST route
app.post('/api/notes', async (req, res) => {
    let newNote = req.body;
    let noteList = await getNotes();
    let noteLength = (noteList.length).toString();

    newNote.id = noteLength;

    noteList.push(newNote)

    // add a new note
    console.log(newNote);

    fs.writeFile("./db/db.json", JSON.stringify(noteList));
    res.json(noteList);
});

// DELETE route
app.delete('/api/notes/:id', async (req, res) => {
    let noteList = await getNotes();
    let noteId = (req.params.id).toString();

    noteList = noteList.filter(deleted => {
        return deleted.id != noteId;
    });

    fs.writeFile("./db/db.json", JSON.stringify(noteList));
    res.json(noteList);
});

app.listen(PORT, () =>
    console.log(`Listening at http://localhost:${PORT}`));