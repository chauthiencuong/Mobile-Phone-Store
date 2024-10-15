import React, { useEffect, useState } from "react";
import { Box, TextField } from "@material-ui/core";
import { PageBody, PageHeader } from "../../components";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import '../Orders/Orders.css';
import apiPost from "../../api/apiPost";

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');  // State để lưu giá trị tìm kiếm
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(6); // Số lượng post trên mỗi trang

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await apiPost.getAllPosts();
                setPosts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1); // Reset trang về 1 khi tìm kiếm
    };

    // Lọc danh mục dựa trên giá trị tìm kiếm
    const filteredPosts = posts.filter(post =>
        post.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Xử lý phân trang
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

    // Thay đổi trang
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const deletePost = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa post này?")) {
            try {
                await apiPost.deletePost(id);
                setPosts(posts.filter(post => post.id !== id));
            } catch (err) {
                setError(err.message);
            }
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <React.Fragment>
            <PageHeader title='Quản lý post' />
            <PageBody style={{ display: "flex", justifyContent: "center" }}>
                <Box
                    flexGrow='1'
                    width='90%'
                    display='flex'
                    flexDirection='column'
                    alignItems='center'
                >
                    <TextField 
                        label="Tìm kiếm post"
                        variant="outlined"
                        value={searchTerm}
                        onChange={handleSearch}
                        style={{ marginBottom: '20px', width: '100%', maxWidth: '400px' }}
                    />
                    
                    <table className="table table-bordered" style={{ maxWidth: '900px' }}>
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col" className="text-center" style={{ width: '120px' }}>Hình Ảnh</th>
                                <th scope="col" className="text-center">Tên bài viết</th>
                                <th scope="col" className="text-center">Mô tả</th>
                                <th scope="col" className="text-center" style={{ width: '120px' }}>Trạng thái</th>
                                <th scope="col" className="text-center" style={{ width: '120px' }}>Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPosts.map(post => (
                                <tr key={post.id}>
                                    <th className="text-center">{post.id}</th>
                                    <td className="text-center">
                                        {post.imagePost && (
                                            <img
                                                src={post.imagePost}
                                                alt={post.name}
                                                style={{ width: 'auto', height: '60px' }} 
                                            />
                                        )}
                                    </td>
                                    <td className="text-center">{post.name}</td>
                                    <td className="text-center">{post.description1}</td>
                                    <td className="text-center">{post.status === 1 ? 'Hiển thị' : 'Ẩn'}</td>
                                    <td className="text-center">
                                        <Link to={`/posts/edit/${post.id}`}>
                                            <img
                                                src="https://cdn-icons-png.flaticon.com/128/3597/3597075.png"
                                                alt="Edit Icon"
                                                style={{ width: '24px', height: 'auto', marginRight: '8px', cursor: 'pointer' }}
                                            />
                                        </Link>
                                        <img onClick={() => deletePost(post.id)}
                                            src="https://cdn-icons-png.flaticon.com/128/11540/11540197.png"
                                            alt="Delete Icon"
                                            style={{ width: '24px', height: 'auto', cursor: 'pointer' }} 
                                        />
                                        <Link to={`/posts/detail/${post.id}`}>
                                            <img
                                                src="https://cdn-icons-png.flaticon.com/128/1265/1265907.png"
                                                alt="Icon 3"
                                                style={{ width: '24px', height: 'auto', marginLeft: '8px' }} 
                                            />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Phân trang */}
                    <nav>
                        <ul className="pagination flex-wrap d-flex justify-content-center">
                            <li className="page-item">
                                <button
                                    className="page-link"
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    <FontAwesomeIcon icon={faAngleLeft} style={{ cursor: 'pointer' }} />
                                </button>
                            </li>
                            {Array.from({ length: Math.ceil(filteredPosts.length / postsPerPage) }, (_, index) => (
                                <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                    <button onClick={() => paginate(index + 1)} className="page-link">
                                        {index + 1}
                                    </button>
                                </li>
                            ))}
                            <li className="page-item">
                                <button
                                    className="page-link"
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === Math.ceil(filteredPosts.length / postsPerPage)}
                                >
                                    <FontAwesomeIcon icon={faAngleRight} style={{ cursor: 'pointer' }} />
                                </button>
                            </li>
                        </ul>
                    </nav>
                </Box>
            </PageBody>
        </React.Fragment>
    );
};

export default Posts;
