import React, { useEffect, useState } from "react";
import { Box } from "@material-ui/core";
import { PageBody, PageHeader } from "../../components";
import apiPromotion from "../../api/apiPromotion";
import { Link } from 'react-router-dom';

const Promotions = () => {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                const data = await apiPromotion.getAllPromotions();
                // Format dates before setting state
                const formattedPromotions = data.map(promotion => ({
                    ...promotion,
                    startDate: new Date(promotion.startDate).toLocaleString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    }),
                    endDate: new Date(promotion.endDate).toLocaleString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    })
                }));
                setPromotions(formattedPromotions);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPromotions();
    }, []);

    const deletePromotion = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa khuyến mại này?")) {
            try {
                await apiPromotion.deletePromotion(id);
                setPromotions(promotions.filter(promotion => promotion.id !== id));
            } catch (err) {
                setError(err.message);
            }
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <React.Fragment>
            <PageHeader title='Quản lý khuyến mại' />
            <PageBody style={{ display: "flex", justifyContent: "center" }}>
                <Box
                    flexGrow='1'
                    width='90%'
                    display='flex'
                    flexDirection='column'
                    alignItems='center'
                >
                    <table className="table table-bordered" style={{ maxWidth: '900px' }}>
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col" className="text-center">Tên chương trình khuyến mại</th>
                                <th scope="col" className="text-center" style={{ width: '180px' }}>Ngày bắt đầu</th>
                                <th scope="col" className="text-center" style={{ width: '180px' }}>Ngày kết thúc</th>
                                <th scope="col" className="text-center" style={{ width: '130px' }}>Trạng thái</th>
                                <th scope="col" className="text-center" style={{ width: '120px' }}>Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {promotions.map(promotion => (
                                <tr key={promotion.id}>
                                    <th className="text-center">{promotion.id}</th>
                                    <td className="text-center">{promotion.name}</td>
                                    <td className="text-center">{promotion.startDate}</td>
                                    <td className="text-center">{promotion.endDate}</td>
                                    <td className="text-center">{promotion.isActive == 1 ? 'Đang khuyến mại' : 'Hết hạn'}</td>
                                    <td className="text-center">
                                        <Link to={`/promotions/edit/${promotion.id}`}>
                                            <img
                                                src="https://cdn-icons-png.flaticon.com/128/3597/3597075.png"
                                                alt="Edit Icon"
                                                style={{ width: '24px', height: 'auto', marginRight: '8px', cursor: 'pointer' }}
                                            />
                                        </Link>
                                        <img
                                            onClick={() => deletePromotion(promotion.id)}
                                            src="https://cdn-icons-png.flaticon.com/128/11540/11540197.png"
                                            alt="Delete Icon"
                                            style={{ width: '24px', height: 'auto', cursor: 'pointer' }} 
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Box>
            </PageBody>
        </React.Fragment>
    );
};

export default Promotions;
