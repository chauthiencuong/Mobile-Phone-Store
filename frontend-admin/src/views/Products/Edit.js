import React, { useState, useEffect } from 'react';
import {
    Grid, Box, Button, TextField, makeStyles, MenuItem, Select, InputLabel, FormControl
} from '@material-ui/core';
import { PageBody, PageHeader } from '../../components';
import apiProduct from '../../api/apiProduct';
import apiGallery from '../../api/apiGallery';
import apiColor from '../../api/apiColor';
import apiConfiguration from '../../api/apiConfiguration';
import apiProductVariant from '../../api/apiProductVariant';
import apiCategory from '../../api/apiCategory';
import apiBrand from '../../api/apiBrand';
import { useParams, useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    formControl: {
        marginTop: theme.spacing(3),
        minWidth: 200,
        marginBottom: theme.spacing(1),
    },
    formControl1: {
        marginTop: theme.spacing(3),
        minWidth: 200,
        marginBottom: theme.spacing(1),
        marginLeft: theme.spacing(5)
    },
    textField: {
        marginBottom: theme.spacing(2),
    },
    button: {
        marginTop: theme.spacing(2),
    },
    imagePreview: {
        width: '100px',
        height: '100px',
        objectFit: 'cover',
        marginRight: theme.spacing(2),
    },
}));

const Edit = () => {
    const classes = useStyles();
    const { id } = useParams(); // ProductId from URL
    const history = useHistory();

    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        description: '',
        categoryId: '',
        brandId: '',
        status: 0,
        isVariant: false,
        price: '',
        qty: ''
    });

    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [colors, setColors] = useState([]);
    const [configurations, setConfigurations] = useState([]);
    const [productVariants, setProductVariants] = useState([{ colorId: '', configurationId: '', price: '', qty: '' }]);
    const [categories, setCategories] = useState([]); // State cho danh mục
    const [brands, setBrands] = useState([]); // State cho thương hiệu

    useEffect(() => {
        const fetchData = async () => {
            try {
                const colorsResponse = await apiColor.getAllColors();
                setColors(colorsResponse);

                const configurationsResponse = await apiConfiguration.getAllConfigurations();
                setConfigurations(configurationsResponse);

                const productResponse = await apiProduct.getProductById(id);
                setFormData(productResponse);

                const variantsResponse = await apiProductVariant.getProductVariantsByProductId(id);
                setProductVariants(variantsResponse);

                const galleryResponse = await apiGallery.getGalleriesByProductId(id);
                setImagePreviews(galleryResponse.map(img => img.imageGallery));

                const categoriesResponse = await apiCategory.getAllCategories();
                setCategories(categoriesResponse);

                const brandsResponse = await apiBrand.getAllBrands();
                setBrands(brandsResponse);
            } catch (error) {
                console.error("Error fetching product data:", error);
            }
        };

        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImageFiles(files);

        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    const handleVariantChange = (index, event) => {
        const { name, value } = event.target;
        const [key] = name.split('-');

        // Cập nhật biến thể
        const updatedVariants = [...productVariants];
        // Nếu key là color hoặc configuration, gán value trực tiếp
        if (key === 'color' || key === 'configuration') {
            updatedVariants[index] = { ...updatedVariants[index], [key]: { value } };
        } else {
            updatedVariants[index] = { ...updatedVariants[index], [key]: value };
        }
        setProductVariants(updatedVariants);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await apiProduct.updateProduct(id, formData);
        } catch (error) {
            console.error('Lỗi khi cập nhật sản phẩm:', error.response?.data || error.message);
            alert(`Lỗi khi cập nhật sản phẩm: ${error.response?.data?.title || error.message}`);
            return;
        }

        // Cập nhật hình ảnh sản phẩm
        if (imageFiles.length > 0) {
            const formDataForImages = new FormData();
            imageFiles.forEach((file) => {
                formDataForImages.append('ImageFiles', file);
            });
            formDataForImages.append('ProductId', id);

            try {
                await apiGallery.updateGallery(id, formDataForImages);
            } catch (error) {
                console.error('Lỗi khi cập nhật hình ảnh:', error.response?.data || error.message);
                alert(`Lỗi khi cập nhật hình ảnh: ${error.response?.data?.title || error.message}`);
                return;
            }
        }

        try {
            for (const variant of productVariants) {
                const { color, configuration, id: variantId, price, qty } = variant;

                let colorId, configId;

                // Xử lý màu sắc
                if (color && color.value) {
                    let colorEntry = colors.find(c => c.value === color.value);
                    if (!colorEntry) {
                        const colorResponse = await apiColor.createColor({ value: color.value });
                        colorEntry = { id: colorResponse.id, value: color.value };
                        setColors(prevColors => [...prevColors, colorEntry]);
                    }
                    colorId = colorEntry.id;
                }

                // Xử lý cấu hình
                if (configuration && configuration.value) {
                    let configEntry = configurations.find(c => c.value === configuration.value);
                    if (!configEntry) {
                        const configResponse = await apiConfiguration.createConfiguration({ value: configuration.value });
                        configEntry = { id: configResponse.id, value: configuration.value };
                        setConfigurations(prevConfigs => [...prevConfigs, configEntry]);
                    }
                    configId = configEntry.id;
                }

                // Kiểm tra nếu không có `colorId` và `configurationId`
                if (!colorId && !configId && variantId) {
                    // Chỉ cần update biến thể hiện có
                    await apiProductVariant.updateProductVariant(variantId, {
                        price,
                        qty
                    });
                } else if (colorId || configId) {
                    // Xóa biến thể cũ nếu có màu sắc hoặc cấu hình mới
                    if (variantId) {
                        await apiProductVariant.deleteProductVariant(variantId);
                    }

                    // Tạo mới biến thể
                    await apiProductVariant.createProductVariant({
                        productId: id,
                        colorId: colorId || color?.id,
                        configurationId: configId || configuration?.id,
                        price,
                        qty
                    });
                }
            }
            alert('Sản phẩm đã được cập nhật thành công.');
            history.push('/products/all');
        } catch (error) {
            console.error('Lỗi khi gửi dữ liệu:', error.response?.data || error.message);
            alert(`Lỗi khi gửi dữ liệu: ${error.response?.data?.title || error.message}`);
        }
    };



    const addProductVariant = () => {
        setProductVariants([...productVariants, { colorId: '', configurationId: '', price: '', qty: '' }]);
    };

    return (
        <React.Fragment>
            <PageHeader title='Chỉnh sửa sản phẩm' />
            <PageBody style={{ display: "flex" }}>
                <Box
                    flexGrow='1'
                    width='100%'
                    display='flex'
                    flexDirection='column'
                    alignItems='center'
                >
                    <form onSubmit={handleSubmit} style={{ width: '80%', maxWidth: '600px' }}>
                        <TextField
                            label="Tên sản phẩm"
                            variant="outlined"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={classes.textField}
                            fullWidth
                            required
                        />
                        <TextField
                            label="SKU"
                            variant="outlined"
                            type="number"
                            name="sku"
                            value={formData.sku}
                            onChange={handleChange}
                            className={classes.textField}
                            fullWidth
                        />
                        <TextField
                            label="Mô tả"
                            variant="outlined"
                            multiline
                            rows={4}
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className={classes.textField}
                            fullWidth
                        />
                        <FormControl className={classes.formControl} fullWidth variant="outlined">
                            <InputLabel>Danh mục</InputLabel>
                            <Select
                                label="Danh mục"
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                                required
                            >
                                {categories.map((category) => (
                                    <MenuItem key={category.id} value={category.id}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl className={classes.formControl} fullWidth variant="outlined">
                            <InputLabel>Thương hiệu</InputLabel>
                            <Select
                                label="Thương hiệu"
                                name="brandId"
                                value={formData.brandId}
                                onChange={handleChange}
                                required
                            >
                                {brands.map((brand) => (
                                    <MenuItem key={brand.id} value={brand.id}>
                                        {brand.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl variant="outlined" className={classes.formControl}>
                            <InputLabel>Trạng thái</InputLabel>
                            <Select
                                label="Trạng thái"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <MenuItem value={0}>Ẩn</MenuItem>
                                <MenuItem value={1}>Hiện</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl variant="outlined" className={classes.formControl1}>
                            <InputLabel>Loại biến thể</InputLabel>
                            <Select
                                label="Loại biến thể"
                                name="isVariant"
                                value={formData.isVariant}
                                onChange={handleChange}
                            >
                                <MenuItem value={false}>Sản phẩm thường</MenuItem>
                                <MenuItem value={true}>Sản phẩm có biến thể</MenuItem>
                            </Select>
                        </FormControl>
                        {formData.isVariant ? (
                            <>
                                <Box display="flex" alignItems="center" mb={2}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={addProductVariant}
                                        className={classes.button}
                                    >
                                        Thêm biến thể
                                    </Button>
                                </Box>
                                {productVariants.map((variant, index) => (
                                    <Box key={index} mt={2} mb={2}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={3}>
                                                <TextField
                                                    label="Màu sắc"
                                                    variant="outlined"
                                                    name={`color-${index}`}
                                                    value={variant.color ? variant.color.value : ''} // Ensure value is not undefined
                                                    onChange={(e) => handleVariantChange(index, e)}
                                                    fullWidth
                                                    className={classes.textField}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={3}>
                                                <TextField
                                                    label="Cấu hình"
                                                    variant="outlined"
                                                    name={`configuration-${index}`}
                                                    value={variant.configuration ? variant.configuration.value : ''} // Ensure value is not undefined
                                                    onChange={(e) => handleVariantChange(index, e)}
                                                    fullWidth
                                                    className={classes.textField}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={3}>
                                                <TextField
                                                    label="Giá tiền"
                                                    variant="outlined"
                                                    type="number"
                                                    name={`price-${index}`}
                                                    value={variant.price || ''} // Ensure value is not undefined
                                                    onChange={(e) => handleVariantChange(index, e)}
                                                    fullWidth
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={3}>
                                                <TextField
                                                    label="Số lượng"
                                                    variant="outlined"
                                                    type="number"
                                                    name={`qty-${index}`}
                                                    value={variant.qty || ''} // Ensure value is not undefined
                                                    onChange={(e) => handleVariantChange(index, e)}
                                                    fullWidth
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                ))}
                            </>
                        ) : (
                            productVariants.map((variant, index) => (
                                <Box key={index} mt={2} mb={2}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={5}>
                                            <TextField
                                                label="Giá tiền"
                                                variant="outlined"
                                                type="number"
                                                name={`price-${index}`}
                                                value={variant.price || ''} // Ensure value is not undefined
                                                onChange={(e) => handleVariantChange(index, e)}
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={3}>
                                            <TextField
                                                label="Số lượng"
                                                variant="outlined"
                                                type="number"
                                                name={`qty-${index}`}
                                                value={variant.qty || ''} // Ensure value is not undefined
                                                onChange={(e) => handleVariantChange(index, e)}
                                                fullWidth
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            ))
                        )}


                        <Box mt={2} mb={2}>
                            <h6>Hình ảnh</h6>

                            {/* Hidden file input */}
                            <input
                                accept="image/*"
                                type="file"
                                multiple
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                                id="upload-button"
                            />

                            {/* Button to trigger file input */}
                            <label htmlFor="upload-button">
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    component="span"
                                >
                                    Tải lên hình ảnh
                                </Button>
                            </label>

                            {/* Display image previews */}
                            <Box
                                mt={2}
                                display="flex"
                                flexWrap="wrap"
                                justifyContent="flex-start"
                                className={classes.imageContainer}
                            >
                                {imagePreviews.map((preview, index) => (
                                    <Box
                                        key={index}
                                        className={classes.imageWrapper}
                                        display="flex"
                                    >
                                        <img
                                            src={preview}
                                            alt={`preview-${index}`}
                                            className={classes.imagePreview}
                                        />
                                    </Box>
                                ))}
                            </Box>

                            <Box mt={2} display="flex" alignItems="flex-start">
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    className={classes.button}
                                >
                                    Cập nhật sản phẩm
                                </Button>
                            </Box>
                        </Box>

                    </form>
                </Box>
            </PageBody>
        </React.Fragment>
    );
};

export default Edit;
