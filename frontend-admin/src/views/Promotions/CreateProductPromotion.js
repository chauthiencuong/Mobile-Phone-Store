import React, { useEffect, useState } from 'react';
import apiProduct from '../../api/apiProduct';
import apiPromotion from '../../api/apiPromotion';
import apiProductPromotion from '../../api/apiProductPromotion';
import { Box, Button, MenuItem, Select, Typography, TextField, CircularProgress, FormControl, InputLabel, Grid, Card, CardContent, CardMedia, Checkbox, FormControlLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(3),
  },
  productCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    border: '1px solid #ddd',
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    textAlign: 'center',
    cursor: 'pointer',
    transition: '0.3s',
    '&:hover': {
      boxShadow: theme.shadows[5],
    },
  },
  productImage: {
    width: '15%',
    height: 'auto',
    borderRadius: theme.shape.borderRadius,
  },
  productName: {
    marginTop: theme.spacing(1),
    fontWeight: 500,
  },
  imageContainer: {
    marginTop: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
  },
  paginationControls: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
  },
  formContainer: {
    padding: theme.spacing(2),
    border: '1px solid #ddd',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: '#f5f5f5',
  },
  leftColumn: {
    paddingRight: theme.spacing(2),
  },
  rightColumn: {
    paddingLeft: theme.spacing(2),
  },
}));

function CreateProductPromotion() {
    const classes = useStyles();
    const [products, setProducts] = useState([]);
    const [promotions, setPromotions] = useState([]);
    const [selectedProductIds, setSelectedProductIds] = useState([]);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [applyToAllVariants, setApplyToAllVariants] = useState(false);
    const [selectedPromotion, setSelectedPromotion] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 3;

    useEffect(() => {
        const fetchProductsAndPromotions = async () => {
            try {
                setLoading(true);
                const productsData = await apiProduct.getAllProducts();
                const promotionsData = await apiPromotion.getAllPromotions();
                setProducts(productsData);
                setPromotions(promotionsData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProductsAndPromotions();
    }, []);

    const handleProductChange = (productId) => {
        setSelectedProductIds((prevSelectedProductIds) =>
            prevSelectedProductIds.includes(productId)
                ? prevSelectedProductIds.filter(id => id !== productId)
                : [...prevSelectedProductIds, productId]
        );
    };

    const handleApplyPromotion = async () => {
        if (selectedPromotion) {
            try {
                setLoading(true);
                const selectedProducts = products.filter(p => selectedProductIds.includes(p.id));
                if (applyToAllVariants) {
                    const allVariants = selectedProducts.flatMap(p => p.productVariants.map(v => v.id));
                    await Promise.all(
                        allVariants.map(variantId => 
                            apiProductPromotion.createProductPromotion({
                                productVariantId: variantId,
                                promotionId: selectedPromotion
                            })
                        )
                    );
                } else if (selectedVariant) {
                    await Promise.all(
                        selectedProductIds.map(productId => 
                            apiProductPromotion.createProductPromotion({
                                productVariantId: selectedVariant,
                                promotionId: selectedPromotion
                            })
                        )
                    );
                } else {
                    alert('Vui lòng chọn biến thể sản phẩm hoặc chọn áp dụng cho tất cả biến thể.');
                    return;
                }
                alert('Khuyến mãi đã được áp dụng.');
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        } else {
            alert('Vui lòng chọn khuyến mãi.');
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

    return (
        <Box className={classes.container}>
            {error && <Typography color="error">{error}</Typography>}
            <Typography variant="h4" align="center" gutterBottom>
                Áp dụng khuyến mãi cho sản phẩm
            </Typography>
        
            <TextField
                label="Tìm kiếm sản phẩm..."
                variant="outlined"
                fullWidth
                margin="normal"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        
        <Grid container spacing={2} className={classes.imageContainer}>
            <Grid item xs={12} md={6} className={classes.leftColumn}>
                {loading ? (
                    <Grid item xs={12} style={{ textAlign: 'center' }}>
                        <CircularProgress />
                    </Grid>
                ) : (
                    currentProducts.map(product => (
                        <Card className={classes.productCard} key={product.id}>
                            <CardMedia
                                component="img"
                                alt={product.name}
                                image={product.galleries[0]?.imageGallery || '/path/to/default/image.jpg'}
                                title={product.name}
                                className={classes.productImage}
                            />
                            <CardContent>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={selectedProductIds.includes(product.id)}
                                            onChange={() => handleProductChange(product.id)}
                                            color="primary"
                                        />
                                    }
                                    label={<Typography className={classes.productName} variant="h6">{product.name}</Typography>}
                                />
                            </CardContent>
                        </Card>
                    ))
                )}
                <Box className={classes.paginationControls}>
                    <Button
                        variant="contained"
                        color="default"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Trang trước
                    </Button>
                    <Typography variant="body1" component="span" style={{ margin: '0 16px' }}>
                        Trang {currentPage} / {totalPages}
                    </Typography>
                    <Button
                        variant="contained"
                        color="default"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Trang sau
                    </Button>
                </Box>
            </Grid>
            <Grid item xs={12} md={6} className={classes.rightColumn}>
                {selectedProductIds.length > 0 && (
                    <Box className={classes.formContainer}>
                        <FormControl variant="outlined" fullWidth margin="normal">
                            <InputLabel htmlFor="variantSelect">Chọn biến thể:</InputLabel>
                            <Select
                                id="variantSelect"
                                value={applyToAllVariants ? 'all' : selectedVariant || ''}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value === 'all') {
                                        setApplyToAllVariants(true);
                                        setSelectedVariant(null);
                                    } else {
                                        setApplyToAllVariants(false);
                                        setSelectedVariant(value);
                                    }
                                }}
                                label="Chọn biến thể:"
                            >
                                <MenuItem value="" disabled>Chọn biến thể sản phẩm</MenuItem>
                                <MenuItem value="all">Áp dụng cho tất cả biến thể</MenuItem>
                                {products.find(p => selectedProductIds.includes(p.id))?.productVariants.map(variant => (
                                    <MenuItem key={variant.id} value={variant.id}>
                                        {`Màu sắc: ${variant.colorId}, Cấu hình: ${variant.configurationId}`}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl variant="outlined" fullWidth margin="normal">
                            <InputLabel htmlFor="promotionSelect">Khuyến mãi:</InputLabel>
                            <Select
                                id="promotionSelect"
                                value={selectedPromotion || ''}
                                onChange={(e) => setSelectedPromotion(e.target.value)}
                                label="Khuyến mãi:"
                            >
                                <MenuItem value="" disabled>Chọn khuyến mãi</MenuItem>
                                {promotions.map(promo => (
                                    <MenuItem key={promo.id} value={promo.id}>
                                        {promo.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            onClick={handleApplyPromotion}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Áp dụng khuyến mãi'}
                        </Button>
                    </Box>
                )}
            </Grid>
        </Grid>
        </Box>
    );
}
export default CreateProductPromotion;
