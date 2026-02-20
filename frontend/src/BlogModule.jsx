import './App.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState,useEffect } from 'react';
const API_URL = 'https://miniblog-backend-mozj.onrender.com/api/posts'


export default function BlogModule() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [posts, setPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  useEffect(() => {
    if (!token) {
      navigate('/auth');
    } 
  }, [token, navigate]);
  const fetchPosts = async () => {
    try{
      const response = await fetch(API_URL);
      const data = await response.json();
      setPosts(data);
    }
    catch(error){
      console.error('Error fetching posts:', error);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const postData = { title, content, author };
    const url = editingPostId ? `${API_URL}/${editingPostId}` : API_URL;
    const method = editingPostId ? 'PUT' : 'POST';
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      })
      if (response.ok) {
        setTitle('');
        setContent('');
        setAuthor('');
        setEditingPostId(null);
        fetchPosts();
      } else {
        console.error('Error submitting post:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting post:', error);
    }
  }
  const handleDelete = async (postId) => {
    try {
      const response = await fetch(`${API_URL}/${postId}`, {method: 'DELETE'});
      if (response.ok) {
        await fetchPosts();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  }
  const handleEdit = async (post) => {
    setEditingPostId(post._id);
    setTitle(post.title);
    setContent(post.content);
    setAuthor(post.author);
  }
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth');
  }
  return (
    <div className="app-container">
      <button onClick={handleLogout} style={{float: 'right', padding:'10px', margin:'10px'}}>Logout</button>
      <div className="form-container">
        <h2>Create a New Post</h2>
        <form className='form-section' onSubmit={handleSubmit}>
          <input className='form-input' type ="text" placeholder="Author Name" value={author} onChange={(e) => setAuthor(e.target.value)} /> <br />
          <input className='form-input' type="text" placeholder="Post Title" value={title} onChange={(e) => setTitle(e.target.value)} /> <br />
          <textarea className='form-textarea' placeholder="write your post here..." value={content} onChange={(e) => setContent(e.target.value)} /> <br />
          <button className='form-button' type ="submit">{editingPostId? 'Update post' : 'Create post'}</button>
        </form>
        </div>
      <div className="posts-section">
        <h2>Latest posts</h2>
        {posts.map((post) => (
          <div key={post.id} className="posts-card">
            <h3>{post.title}</h3>
            <p className="posts-author">By {post.author}</p>
            <p>{post.content}</p>
            <div className="posts-actions">
              <button onClick={() => handleEdit(post._id)}>Edit</button>
              <button onClick={() => handleDelete(post._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

}



