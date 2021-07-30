const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const dotenv = require('dotenv');

app.use(express.json());

dotenv.config();

const posts = [
    {
        username: 'Mia',
        title: 'Post 1'
    },
    {
        username: 'Ava',
        title: 'Post 2'
    },
    {
        username: 'Lena',
        title: 'Post 3'
    }
]

app.get('/posts', authenticateToken, (req, res) => {
    res.send(posts.filter(post => post.username === req.user.username))
})

function authenticateToken (req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);

        req.user = user;
        next();
    })
}

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})