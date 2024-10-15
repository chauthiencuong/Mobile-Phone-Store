import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Box, Button, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import { PageBody, PageHeader } from '../../components';
import apiProduct from '../../api/apiProduct';
import apiColor from '../../api/apiColor';
import apiConfiguration from '../../api/apiConfiguration';
import apiProductPromotion from '../../api/apiProductPromotion';

const useStyles = makeStyles((theme) => ({
    leftSpacing: {
        marginRight: theme.spacing(1),
    },
    mainImage: {
        maxWidth: '100px',
        height: 'auto',
    },
    tableContainer: {
        marginTop: theme.spacing(3),
    },
}));

const Detail = () => {
    const classes = useStyles();
    const { id } = useParams();
    const history = useHistory();
    const [product, setProduct] = useState(null);
    const [colors, setColors] = useState([]);
    const [configurations, setConfigurations] = useState([]);
    const [promotions, setPromotions] = useState([]);

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                const data = await apiProduct.getProductById(id);
                setProduct(data);
            } catch (error) {
                console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
            }
        };

        const fetchAdditionalData = async () => {
            try {
                const [colorsData, configurationsData] = await Promise.all([
                    apiColor.getAllColors(),
                    apiConfiguration.getAllConfigurations()
                ]);
                setColors(colorsData);
                setConfigurations(configurationsData);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu bổ sung:', error);
            }
        };

        const fetchPromotions = async () => {
            try {
                const promotionsData = await apiProductPromotion.getPromotionsByProductId(id);
                setPromotions(promotionsData);
            } catch (error) {
                console.error('Lỗi khi lấy thông tin khuyến mại:', error);
            }
        };

        fetchProductDetail();
        fetchAdditionalData();
        fetchPromotions();
    }, [id]);

    if (!product) {
        return <div>Loading...</div>;
    }

    const getColorName = (colorId) => {
        const color = colors.find(c => c.id === colorId);
        return color ? color.value : 'Chưa có thông tin';
    };

    const getConfigurationName = (configurationId) => {
        const configuration = configurations.find(c => c.id === configurationId);
        return configuration ? configuration.value : 'Chưa có thông tin';
    };

    const getPromotion = (variantId) => {
        const promotion = promotions.find(p => p.productVariantId === variantId);
        return promotion || {};
    };

    const combinedVariantsAndPromotions = product.productVariants.map((variant) => {
        const promotion = getPromotion(variant.id);
        return {
            ...variant,
            priceSale: promotion.priceSale,
            isActive: promotion.isActive,
        };
    });

    const getProductPriceSale = () => {
        // Lấy giá khuyến mại cho sản phẩm không biến thể từ combinedVariantsAndPromotions
        const productPromotion = combinedVariantsAndPromotions.find(variant => variant.id === product.productVariants[0]?.id);
        return productPromotion?.priceSale ? productPromotion.priceSale.toLocaleString() + ' VNĐ' : 'Không';
    };

    return (
        <React.Fragment>
            <PageHeader title="Chi tiết sản phẩm">
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.leftSpacing}
                    onClick={() => history.push('/products/all')}
                >
                    Quay lại danh sách
                </Button>
            </PageHeader>
            <PageBody>
                <TableContainer component={Paper} className={classes.tableContainer}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell colSpan={2}>
                                    <Typography variant="h6">Thông tin sản phẩm</Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell><strong>Hình ảnh:</strong></TableCell>
                                <TableCell>{product.galleries.length > 0 ? (
                                    <img
                                        src={product.galleries[0].imageGallery}
                                        alt={product.name}
                                        className={classes.mainImage}
                                    />
                                ) : (
                                    <Typography>Chưa có hình ảnh</Typography>
                                )}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><strong>Tên sản phẩm:</strong></TableCell>
                                <TableCell>{product.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><strong>SKU:</strong></TableCell>
                                <TableCell>{product.sku}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><strong>Danh mục:</strong></TableCell>
                                <TableCell>{product.category.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><strong>Thương hiệu:</strong></TableCell>
                                <TableCell>{product.brand.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><strong>Mô tả:</strong></TableCell>
                                <TableCell>{product.description}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><strong>Trạng thái:</strong></TableCell>
                                <TableCell>{product.status === 1 ? 'Hiển thị' : 'Ẩn'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><strong>Biến thể:</strong></TableCell>
                                <TableCell>{product.isVariant ? 'Có' : 'Không'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><strong>Ngày tạo:</strong></TableCell>
                                <TableCell>{new Date(product.createdAt).toLocaleString()}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><strong>Ngày cập nhật:</strong></TableCell>
                                <TableCell>{new Date(product.updatedBy).toLocaleString()}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><strong>Người tạo:</strong></TableCell>
                                <TableCell>{product.createdBy === 1 ? 'Admin' : product.createdBy}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><strong>Người cập nhật:</strong></TableCell>
                                <TableCell>{product.updatedBy === 1 ? 'Admin' : product.updatedBy}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>

                {!product.isVariant && (
                    <TableContainer component={Paper} className={classes.tableContainer}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell colSpan={2}>
                                        <Typography variant="h6">Thông tin giá và số lượng</Typography>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell><strong>Giá gốc:</strong></TableCell>
                                    <TableCell>{product.productVariants[0]?.price ? product.productVariants[0].price.toLocaleString() + ' VNĐ' : 'Không có thông tin'}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell><strong>Giá khuyến mại:</strong></TableCell>
                                    <TableCell>{getProductPriceSale()}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell><strong>Số lượng:</strong></TableCell>
                                    <TableCell>{product.productVariants[0]?.qty || 'Không có thông tin'}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell><strong>Khuyến mại:</strong></TableCell>
                                    <TableCell>{product.productVariants[0]?.isActive ? 'Đang khuyến mại' : 'Không'}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                {product.isVariant && (
                    <TableContainer component={Paper} className={classes.tableContainer}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Màu</TableCell>
                                    <TableCell>Cấu hình</TableCell>
                                    <TableCell>Giá gốc</TableCell>
                                    <TableCell>Giá khuyến mại</TableCell>
                                    <TableCell>Số lượng</TableCell>
                                    <TableCell>Trạng thái</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {combinedVariantsAndPromotions.map((variant) => (
                                    <TableRow key={variant.id}>
                                        <TableCell>{getColorName(variant.colorId)}</TableCell>
                                        <TableCell>{getConfigurationName(variant.configurationId)}</TableCell>
                                        <TableCell>{variant.price ? variant.price.toLocaleString() + ' VNĐ' : 'Không có thông tin'}</TableCell>
                                        <TableCell>{variant.priceSale ? variant.priceSale.toLocaleString() + ' VNĐ' : 'Không'}</TableCell>
                                        <TableCell>{variant.qty || 'Không có thông tin'}</TableCell>
                                        <TableCell>{variant.isActive ? 'Đang khuyến mại' : 'Không'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </PageBody>
        </React.Fragment>
    );
};

export default Detail;
