import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import BlogModule from './BlogModule.jsx';
import Auth from './Auth.js';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BlogModule />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  );
}