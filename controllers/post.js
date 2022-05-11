const postRouter = require('express').Router();
const jwt = require('jsonwebtoken');

const Post = require('../models/Post');
const User = require('../models/User');

// Get token
const getToken = req => {
  const authorization = req.get('authorization');
  if(authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
}

// GET
postRouter.get('/', async (req, res) => {
  const result = await Post.find({}).populate('author', { username: 1 });
  res.json(result);
})

postRouter.get('/:id', async (req, res) => {
  const result = await Post.findById(req.params.id).populate('author', { username: 1 });
  res.json(result);
})

// POST
postRouter.post('/', async (req, res) => {
  const { title, content } = req.body;

  const token = getToken(req);
  const decodedToken = jwt.verify(token, process.env.SECRET);

  if(!token || !decodedToken.id){
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  const user = await User.findById(decodedToken.id);

  const post = new Post({
    title,
    content,
    likes: 0,
    date: new Date().toISOString(),
    author: user._id,
  })

  const result = await post.save();
  user.posts = user.posts.concat(result._id)
  await user.save();

  res.status(201).json(result);
})

// PUT
postRouter.put('/:id', async (req, res) => {
  const body = req.body;

  const newPost = {
    title: body.title,
    content: body.content,
    likes: body.likes
  }


  const result = await Post.findByIdAndUpdate(req.params.id, newPost, { new: true }).populate('author', { username: 1 });
  res.json(result);
})

// DELETE
postRouter.delete('/:id', async (req, res) => {
  await Post.findByIdAndRemove(req.params.id);
  res.status(204).end();
})

module.exports = postRouter;