import { useEffect, useState } from 'react';
import { postsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { logout, user } = useAuth();

  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');

  const loadPosts = async () => {
    const data = await postsAPI.getAll();
    setPosts(data);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleCreate = async () => {
    if (!content) return;

    await postsAPI.create({ content });
    setContent('');
    loadPosts();
  };

  const handleLike = async (id) => {
    await postsAPI.like(id);
    loadPosts();
  };

  const handleDelete = async (id) => {
    await postsAPI.delete(id);
    loadPosts();
  };

  return (
    <div className="home">
      <h2>Welcome {user?.name}</h2>
      <button onClick={logout}>Logout</button>

      <div className="create-post">
        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button onClick={handleCreate}>Post</button>
      </div>

      <div className="posts">
        {posts.map((post) => (
          <div key={post._id} className="post">
            <p>{post.content}</p>
            <small>By: {post.author?.name}</small>

            <div>
              <button onClick={() => handleLike(post._id)}>
                👍 {post.likes?.length || 0}
              </button>

              {user?._id === post.author?._id && (
                <button onClick={() => handleDelete(post._id)}>
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
