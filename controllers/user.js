const userRouter = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

userRouter.get('/', async (req, res) => {
  const result = await User.find({}).populate('posts', { title: 1, content: 1 });
  res.json(result);
})

userRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body;

  const existingUser = await User.findOne({ username });

  if(existingUser){
    return res.status(400).json({ error: 'Username already exsits' })
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const newUser = new User({
    username,
    name,
    passwordHash
  })

  const result = await newUser.save();
  res.status(201).json(result);
})

module.exports = userRouter;