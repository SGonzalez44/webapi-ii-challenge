require('dotenv').config();
const express = require('express');
const server = express();

//Routes
const postRoutes = require('./routes/posts');

//Middleware
server.use(express.json());

server.use('/api/posts', postRoutes);

server.get('/', (req, res) => {
    res.send('Server running from Sals mind');
});

const port = process.env.PORT || 5000;

server.listen(port, () => {
    console.log(`\n*** Server Running on http://localhost:${port} ***\n`);
  });