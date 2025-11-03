const express = require('express');
const router = express.Router();
const cloudinary = require('../config/cloudinary');
const Post = require('../models/postModel');
const upload = require('../middleware/upload');
const fs = require('fs');
const path = require('path');
const getPublicId = (imageUrl) => {
  const parts = imageUrl.split('/');
  console.log(11,parts);
  const publicIdWithExtension = parts.slice(-2).join('/');
   const publicId = publicIdWithExtension.split('.')[0];
   console.log(15,publicId); 
  return publicId;
}

// Create Post
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, author, content } = req.body;
    const imageUrl = req.file ? req.file.path : '';

    const post = await Post.create({ title, author, content, imageUrl });
    res.status(201).json(post);
  } catch (error) {
    console.log(error);
  }
});

// Get All Posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Update Post
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, author, content } = req.body;
    const updateData = { title, author, content };
    if (req.file) {
      const existingPost = await Post.findById(req.params.id);
      if (existingPost && existingPost.imageUrl) {
        const publicId = getPublicId(existingPost.imageUrl);
        await cloudinary.uploader.destroy(publicId);
      }
      updateData.imageUrl = req.file.path;
    }
    const updatePost = await Post.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json(updatePost);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update post' });
  }
});

// Delete Post
router.delete('/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    if (!post){
      return res.status(404).json({ message: 'Post not found' });
    }
    if (post.imageUrl) {
      const publicId = getPublicId(post.imageUrl);
      await cloudinary.uploader.destroy(publicId);
    }
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

module.exports = router;