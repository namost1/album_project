import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()
app.use(express.json())

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.static(path.join(__dirname, 'public')))

let albums = []

function initializeDatabase() {
    albums = [
        { id: 1, band: "Metallica", title: "Master of Puppets", year: 1986, genre: "Metal" },
        { id: 2, band: "Pink Floyd", title: "The Dark Side of the Moon", year: 1973, genre: "Progressive Rock" }
    ]
}

initializeDatabase()

app.get('/albums', (req, res) => {
    res.status(200).json(albums)
})

app.get("/albums/:id", (req, res) => {
    const id = parseInt(req.params.id)
    const album = albums.find(a => a.id === id)
    if (!album) {
        return res.status(404).json({ message: "Album nem található" })
    }
    res.status(200).json(album)
})

app.post('/albums', (req, res) => {
    const { band, title, year, genre } = req.body
    if (!band || !title || !year || !genre) {
        return res.status(400).json({ message: "Hiányzó adatok" })
    }
    const newAlbum = {
        id: albums.length ? albums[albums.length - 1].id + 1 : 1,
        band,
        title,
        year,
        genre
    }
    albums.push(newAlbum)
    res.status(201).json(newAlbum)
})

app.put('/albums/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const { band, title, year, genre } = req.body
    const index = albums.findIndex(a => a.id === id)
    if (index === -1) {
        return res.status(404).json({ message: "Album nem található" })
    }
    albums[index] = { id, band, title, year, genre }
    res.status(200).json(albums[index])
})

app.delete('/albums/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const index = albums.findIndex(a => a.id === id)
    if (index === -1) {
        return res.status(404).json({ message: "Album nem található" })
    }
    albums.splice(index, 1)
    res.status(200).json({ message: "Album törölve!" })
})
app.use((err, req, res, next) => {
    console.error(err)
    res.status(500).json({ message: `Szerverhiba: ${err.message}` })
})

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Szerver fut a ${PORT}-es porton`)
})
