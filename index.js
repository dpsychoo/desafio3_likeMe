const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'likeme',
    password: '123123',
    port: 5432,
    allowExitOnIdle: true,
});

pool
    .connect()
    .then(() => {
        console.log('Conexión exitosa a la base de datos');
    })
    .catch((err) => {
        console.log('Error en la conexión a la base de datos', err);
    });

// Ruta G
app.get('/posts', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM posts');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los posts');
    }
});

// Ruta P
app.post('/posts', async (req, res) => {
    const { titulo, img, descripcion, likes } = req.body;
    try {
        await pool.query(
            'INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, $4)',
            [titulo, img, descripcion, likes]
        );
        res.status(201).send('Post creado exitosamente');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear el post');
    }
});

app.delete('/posts/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM posts WHERE id = $1', [id]);
        if (result.rowCount > 0) {
            res.send('Post eliminado exitosamente');
        } else {
            res.status(404).send('Post no encontrado');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar el post');
    }
});


app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
