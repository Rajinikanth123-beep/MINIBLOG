import './App.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://miniblog-backend-mozj.onrender.com/api/posts';

export default function BlogModule() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [posts, setPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  /* ===== Redirect if Not Logged In ===== */
  useEffect(() => {
    if (!token) {
      navigate('/auth');
    }
  }, [token, navigate]);

  /* ===== Fetch Posts ===== */
  const fetchPosts = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  /* ===== Create or Update Post ===== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      navigate('/auth');
      return;
    }

    const postData = { title, content, author };
    const url = editingPostId
      ? `${API_URL}/${editingPostId}`
      : API_URL;
    const method = editingPostId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit post');
      }

      // Reset form
      setTitle('');
      setContent('');
      setAuthor('');
      setEditingPostId(null);

      fetchPosts();

    } catch (error) {
      console.error('Error submitting post:', error);
    }
  };

  /* ===== Delete Post ===== */
  const handleDelete = async (postId) => {
    try {
      const response = await fetch(`${API_URL}/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      fetchPosts();

    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  /* ===== Edit Post ===== */
  const handleEdit = (post) => {
    setEditingPostId(post._id);
    setTitle(post.title);
    setContent(post.content);
    setAuthor(post.author);
  };

  /* ===== Logout ===== */
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth');
  };

  return (
    <div className="app-container">

      <button
        onClick={handleLogout}
        style={{ float: 'right', padding: '10px', margin: '10px' }}
      >
        Logout
      </button>

      <div className="form-container">
        <h2>{editingPostId ? 'Edit Post' : 'Create a New Post'}</h2>

        <form className="form-section" onSubmit={handleSubmit}>
          <input
            className="form-input"
            type="text"
            placeholder="Author Name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />

          <input
            className="form-input"
            type="text"
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            className="form-textarea"
            placeholder="Write your post here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />

          <button className="form-button" type="submit">
            {editingPostId ? 'Update Post' : 'Create Post'}
          </button>
        </form>
      </div>

      <div className="posts-section">
        <h2>Latest Posts</h2>

        {posts.map((post) => (
          <div key={post._id} className="posts-card">
            <h3>{post.title}</h3>
            <p className="posts-author">By {post.author}</p>
            <p>{post.content}</p>

            <div className="posts-actions">
              <button onClick={() => handleEdit(post)}>
                Edit
              </button>
              <button onClick={() => handleDelete(post._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}