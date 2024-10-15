import '../../assets/css/PostNew.css';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiPost from '../../api/apiPost';

function PostNew() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                let data = await apiPost.getAllPosts();
                data = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                data = data.slice(0, 4);
                setPosts(data);
                console.log(data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div>
            <div>
                <h2 className="post-title">Tin công nghệ</h2>
            </div>
            <section className="row">   
                <div className="col-12 pt-2 pl-md-1 mb-3 mb-lg-4">
                    <div className="row flex-row d-flex justify-content-between">
                        {posts.length > 0 ? (
                            posts.map(post => (
                                <div key={post.id} className="col-12 col-md-3 pb-1 pt-0 pr-1">
                                    <div className="card border-0 rounded-0 text-white overflow zoom">
                                        <div className="position-relative">
                                            <div className="ratio_right-cover-2 image-wrapper">
                                                <Link to={`/chi-tiet-bai-viet/${post.id}`}>
                                                    <img
                                                        className="img-fluid"
                                                        src={post.imagePost}
                                                        alt={post.name}
                                                    />
                                                </Link>
                                            </div>
                                            <div className="position-absolute p-2 p-lg-3 b-0 w-100 bg-shadow">
                                                <Link to={`/chi-tiet-bai-viet/${post.id}`}>
                                                    <h2 className="h5 text-white my-1">{post.name}</h2>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Không có bài viết mới.</p>
                        )}
                    </div>
                </div>

            </section>
        </div>
    );
}

export default PostNew;
