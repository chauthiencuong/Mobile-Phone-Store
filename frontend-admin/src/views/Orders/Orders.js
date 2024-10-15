import React, { useEffect, useState } from "react";
import { Box } from "@material-ui/core";
import { PageBody, PageHeader } from "../../components";
import apiOrder from "../../api/apiOrder";
import apiAuth from "../../api/apiAuth";
import './Orders.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 10;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [orderData, userData] = await Promise.all([
                    apiOrder.getAllOrders(),
                    apiAuth.getAllUsers()
                ]);
                setOrders(orderData);
                setUsers(userData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Get current orders for pagination
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const getUserName = (userId) => {
        const user = users.find(user => user.id === userId);
        return user ? user.name : "Unknown User";
    };
    const deleteOrder = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) {
            try {
                await apiOrder.deleteOrder(id);
                setOrders(orders.filter(order => order.id !== id));
            } catch (err) {
                setError(err.message);
            }
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <React.Fragment>
            <PageHeader title="Quản lý đơn hàng" />
            <PageBody style={{ display: "flex", justifyContent: "center" }}>
                <Box
                    flexGrow="1"
                    width="90%"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                >
                    <table className="table table-bordered" style={{ maxWidth: "1200px" }}>
                        <thead>
                            <tr>
                                <th scope="col" className="text-center">ID</th>
                                <th scope="col" className="text-center" style={{ width: "140px" }}>Đơn hàng</th>
                                <th scope="col" className="text-center">Người đặt</th>
                                <th scope="col" className="text-center">Ngày đặt</th>
                                <th scope="col" className="text-center">Tổng tiền</th>
                                <th scope="col" className="text-center">Trạng thái</th>
                                <th scope="col" className="text-center" style={{ width: "120px" }}>Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentOrders.map(order => (
                                <tr key={order.id}>
                                    <th className="text-center">{order.id}</th>
                                    <td className="text-center">{order.name}</td>
                                    <td className="text-center">{getUserName(order.userId)}</td>
                                    <td className="text-center">{new Date(order.createdAt).toLocaleString()}</td>
                                    <td className="text-center">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalPrice)}
                                    </td>
                                    <td className="text-center">
                                        {order.status === 0 ? 'Đã đặt hàng' :
                                            order.status === 1 ? 'Đã thanh toán' :
                                                order.status === 2 ? 'Đã hủy' :
                                                    'Trạng thái không xác định'}
                                    </td>

                                    <td className="text-center">
                                        <Link to={`/orders/edit/${order.id}`}>
                                            <img
                                                src="https://cdn-icons-png.flaticon.com/128/3597/3597075.png"
                                                alt="Edit Icon"
                                                style={{ width: '24px', height: 'auto', marginRight: '8px', cursor: 'pointer' }}
                                            />
                                        </Link>
                                        <img onClick={() => deleteOrder(order.id)}
                                            src="https://cdn-icons-png.flaticon.com/128/11540/11540197.png"
                                            alt="Delete Icon"
                                            style={{ width: '24px', height: 'auto', cursor: 'pointer' }}
                                        />
                                        <Link to={`/orders/detail/${order.id}`}>
                                            <img
                                                src="https://cdn-icons-png.flaticon.com/128/1265/1265907.png"
                                                alt="Icon 3"
                                                style={{ width: '24px', height: 'auto', marginLeft: '8px', cursor: 'pointer' }}
                                            />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
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
                            {Array.from({ length: Math.ceil(orders.length / ordersPerPage) }, (_, index) => (
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
                                    disabled={currentPage === Math.ceil(orders.length / ordersPerPage)}
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

export default Orders;
