const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const dotenv = require('dotenv');

app.use(express.json());

dotenv.config();

app.post('/login', (req, res) => {
    // Authenticate User
    const username = req.body.username;
    const userObj = {username};
    const refreshToken = jwt.sign(userObj, process.env.REFRESH_TOKEN_SECRET);
    const accessToken = generateAccessToken(userObj);

    refreshTokens.push(refreshToken);

    res.json({ accessToken, refreshToken });
})

let refreshTokens = [];
 
app.post('/token', (req, res) => {
    const refreshToken = req.body.token
    if (refreshToken == null) return res.sendStatus(401)
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        const accessToken = generateAccessToken({ username: user.username })
        res.json({ accessToken })
    })
})

app.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.sendStatus(204)
})

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '20s'})
}

app.listen(5000, () => {
    console.log('Server is running on port 5000')
})