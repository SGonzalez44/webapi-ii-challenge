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

server.listen(4440, () => console.log('API running on port 4440'));