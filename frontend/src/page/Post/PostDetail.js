import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiPost from '../../api/apiPost';
import './PostDetail.css'; // Đảm bảo bạn đã tạo tệp CSS phù hợp

function PostDetail() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const data = await apiPost.getPostById(id);
                setPost(data);
            } catch (error) {
                setError('Có lỗi xảy ra khi tải bài viết.');
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    if (loading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <p>{error}</p>;

    if (!post) return <p>Không tìm thấy bài viết.</p>;

    return (
        <div className="post-detail-container">
            <h1 className="post-title">{post.name}</h1>
            <div className="post-content-section">
                <p>{post.description1}</p>
                <p>{post.description2}</p>
            </div>
            <div className="post-image-container">
                <img src={post.imagePost} alt={post.name} className="post-image" />
            </div>
            <div className="post-content-section">
                <p>{post.description3}</p>
                <p>{post.description4}</p>
            </div>
        </div>
    );
}

export default PostDetail;
