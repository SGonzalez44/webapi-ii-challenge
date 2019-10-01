const express = require('express');
const app = express();

//Routes
const postRoutes = require('./routes/posts');

//Middleware
app.use(express.json());

app.use('/api/posts', postRoutes);

app.get('/', (req, res) => {
    res.send('App running');
});

app.listen(8080, postRoutes() => console.log('API running on port 4400'));