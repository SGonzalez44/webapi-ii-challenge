const express = require('express');
const router = express.Router();
const db = require('../data/db');

//get al post
router.get('/', (req, res) => {
    db.find()
    .then(posts => {
        res.status(200).json({ post });
    })
    .catch(err => {
        res.status(200).json({ 
            error: 'The posts data cannot be retrieved.',
         });
    });
});

//get a single post
router.get('/:id', (req, res) => {
    let { id } = req.params;

    db.findById(id)
    .then(data => {
        if (!data || data.length == 0) {
            res.status(404).json({
                message: 'ID does not exist',
            })
        }
        res.status(200).json(data);
    })
    .catch(error => {
        res.status(500).json({
            error: 'Post data not retrieved',
        });
    });
});


//get a single coment
router.get('/:id/comments', (req, res) => {
    let {id} = req.params;

    db.findPostByComments(id)
    .then(data => {
        if (!data || data.length == 0) {
            res.status(400).json({
                message: 'ID does not exist.',
            })
    }
    res.status(200).json(data);
    })
    .catch(err =>
        res.status(500).json({
            error: 'Information could not be retrieved',
        })
    );
});


//add post

router.post('/', (req, res) => {
    let post = req.body;

    if (!post.title || !post.contents) {
        res.status(400).json({
            errorMessage: 'Provide title & contents for post'
        })
    }

    db.insert(post)
    .then(data => {
        //return newly created post
        console.log('return post id: ', data);
        db.findById(data.id)
        .then(data => {
            console.log('returned new post: ', data);
            res.status(201).json({ post: data });
        })
        .catch(err => {
            res.status(500).json({
                error: 'New created post error',
            })
        })
    })
    .catch(err => {
        console.log('Insert Error: ', err);
        res.status(500).json({
            error:
            'Error while saving post to database'
        });
    });
});

//Add a comment to a post

router.post('/:id/comments', (req, res) => {
    let {id} = req.params;
    let comment = req.body;

    comment.post_id = id

    if (!comment || !comment.text) {
        res.status(400).json({
            errorMessage: 'Provide text for comment',
        });
    }


    db.insertComment(comment)
        .then(data => {
            console.log('New Comment ID: ', data);

            db.findCommentById(data.id)
                .then(data => {
                    res.status(201).json(data);
                })
                .catch(err => {
                    res.status(500).json({
                        error:
                            'Error in sending back newly created comment, but it was created.',
                    });
                });
        })
        .catch(err => {
            res.status(500).json({
                error:
                    'There was an error while saving the comment to the database',
            });
        });
});

//Delete a post

router.delete('/:id', async (req, res) => {
    let { id } = req.params;

    let data = await db.findById(id);
    let post = data[0];

    db.remove(id)
        .then(data => {
            if (!data || data.length == 0) {
                res.status(404).json({
                    message: 'The post with the specified ID does not exist.',
                });
            }
            res.status(200).json(post);
        })
        .catch(err => {
            res.status(500).json({ error: 'The post could not be removed' });
        });
});

//Update a post
router.put('/:id', (req, res) => {
    let { id } = req.params;
    let post = req.body;

    if (!post.title || !post.contents) {
        res.status(400).json({
            errorMessage: 'Please provide title and contents for the post.',
        });
        return;
    }

    db.update(id, post)
        .then(data => {
            if (!data || data.length == 0) {
                res.status(404).json({
                    message: 'The post with the specified ID does not exist.',
                });
            }

            db.findById(id)
                .then(data => {
                    res.status(200).json(data);
                })
                .catch(err => {
                    res.status(500).json({
                        error:
                            'There was an error returning the updated post. The post was updated correctly',
                    });
                });
        })
        .catch(err => {
            res.status(500).json({
                error: 'There was an error updating the post. Failed',
            });
        });
});

module.exports = router;
