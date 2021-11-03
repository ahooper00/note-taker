const express = require('express');
const path = require('path');
const fs = require('fs/promises');

const PORT = 3001;

const app = express();

async function getNotes() {
    const database = await fs.readFile(path.join(__dirname, '/db/db.json'));
    return JSON.parse(database);
}

// GET route
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', async (req, res) => {
    const data = await getNotes();
    res.json(data)
});

app.listen(PORT, () =>
    console.log(`Listening at http://localhost:${PORT}`));