const express = require('express');
const router = express.Router();
const cloudinary = require('../config/cloudinary');
const Post = require('../models/postModel');
const upload = require('../middleware/upload');

/* ===== Helper Function ===== */
const getPublicId = (imageUrl) => {
  const parts = imageUrl.split('/');
  const publicIdWithExtension = parts.slice(-2).join('/');
  return publicIdWithExtension.split('.')[0];
};

/* ===== Create Post ===== */
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, author, content } = req.body;

    if (!title || !author || !content) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const imageUrl = req.file ? req.file.path : '';

    const post = await Post.create({
      title,
      author,
      content,
      imageUrl,
    });

    res.status(201).json(post);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create post' });
  }
});

/* ===== Get All Posts ===== */
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
});

/* ===== Update Post ===== */
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, author, content } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (req.file) {
      if (post.imageUrl) {
        const publicId = getPublicId(post.imageUrl);
        await cloudinary.uploader.destroy(publicId);
      }

      post.imageUrl = req.file.path;
    }

    post.title = title || post.title;
    post.author = author || post.author;
    post.content = content || post.content;

    const updatedPost = await post.save();

    res.status(200).json(updatedPost);

  } catch (error) {
    res.status(500).json({ message: 'Failed to update post' });
  }
});

/* ===== Delete Post ===== */
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.imageUrl) {
      const publicId = getPublicId(post.imageUrl);
      await cloudinary.uploader.destroy(publicId);
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Post deleted successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Failed to delete post' });
  }
});

module.exports = router;