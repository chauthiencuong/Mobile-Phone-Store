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
import { useHistory } from 'react-router-dom';

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

const Create = () => {
    const classes = useStyles();

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
    const [productVariants, setProductVariants] = useState([{ color: '', configuration: '', price: '', qty: '' }]);
    const [categories, setCategories] = useState([]); // State cho danh mục
    const [brands, setBrands] = useState([]); // State cho thương hiệu
    const history = useHistory(); // Khai báo useHistory

    useEffect(() => {
        const fetchData = async () => {
            try {
                const colorsResponse = await apiColor.getAllColors();
                setColors(colorsResponse);

                const configurationsResponse = await apiConfiguration.getAllConfigurations();
                setConfigurations(configurationsResponse);

                const categoriesResponse = await apiCategory.getAllCategories();
                setCategories(categoriesResponse);

                const brandsResponse = await apiBrand.getAllBrands();
                setBrands(brandsResponse);
            } catch (error) {
                console.error("Error fetching colors or configurations:", error);
            }
        };

        fetchData();
    }, []);

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

    const handleVariantChange = (index, e) => {
        const { name, value } = e.target;
        const newVariants = [...productVariants];
        newVariants[index] = { ...newVariants[index], [name]: value };
        setProductVariants(newVariants);
    };

    const addProductVariant = () => {
        setProductVariants([...productVariants, { color: '', configuration: '', price: '', qty: '' }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Xử lý sản phẩm không có biến thể
            if (!formData.isVariant) {
                if (!formData.price || !formData.qty) {
                    alert("Vui lòng nhập giá và số lượng cho sản phẩm.");
                    return;
                }
            }

            // Tạo sản phẩm
            const productResponse = await apiProduct.createProduct(formData);
            const productId = productResponse.id;

            // Tạo thư viện ảnh
            if (imageFiles.length > 0) {
                const formDataForImages = new FormData();
                imageFiles.forEach((file) => {
                    formDataForImages.append('ImageFiles', file);
                });
                formDataForImages.append('ProductId', productId);

                await apiGallery.createGallery(formDataForImages);
            }

            // Tạo biến thể sản phẩm nếu có
            if (formData.isVariant) {
                for (const variant of productVariants) {
                    // Đặt giá trị mặc định nếu màu sắc hoặc cấu hình bị trống
                    const colorValue = variant.color || 'default';
                    const configValue = variant.configuration || 'default';

                    let color = colors.find(c => c.value === colorValue);
                    if (!color) {
                        // Gửi yêu cầu POST để tạo màu mới hoặc lấy ID nếu đã tồn tại
                        const colorResponse = await apiColor.createColor({ value: colorValue });
                        color = { id: colorResponse.id, value: colorValue };
                    }

                    let configuration = configurations.find(c => c.value === configValue);
                    if (!configuration) {
                        // Gửi yêu cầu POST để tạo cấu hình mới hoặc lấy ID nếu đã tồn tại
                        const configResponse = await apiConfiguration.createConfiguration({ value: configValue });
                        configuration = { id: configResponse.id, value: configValue };
                    }

                    await apiProductVariant.createProductVariant({
                        productId,
                        colorId: color.id,
                        configurationId: configuration.id,
                        price: variant.price,
                        qty: variant.qty
                    });
                }
            } else {
                // Gửi yêu cầu tạo biến thể cho sản phẩm không có biến thể
                await apiProductVariant.createProductVariant({
                    productId,
                    price: formData.price,
                    qty: formData.qty,
                    colorId: null,
                    configurationId: null
                });
            }

            alert("Thêm sản phẩm thành công!");
            history.push('/products/all');

        } catch (error) {
            // Xử lý lỗi và thông báo chi tiết
            if (error.response && error.response.data) {
                console.error('Lỗi khi thêm sản phẩm hoặc ảnh:', error.response.data);
                alert(`Có lỗi xảy ra: ${error.response.data.title}`);
            } else {
                console.error('Lỗi khi thêm sản phẩm hoặc ảnh:', error.message);
                alert(`Có lỗi xảy ra: ${error.message}`);
            }
        }
    };


    return (
        <React.Fragment>
            <PageHeader title='Thêm sản phẩm' />
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
                        <FormControl variant="outlined" className={classes.formControl} >
                            <InputLabel>Trạng thái</InputLabel>
                            <Select
                                label="Trạng thái"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <MenuItem value={0}>Ẩn</MenuItem>
                                <MenuItem value={1}>Hiển thị</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl variant="outlined" className={classes.formControl1}>
                            <InputLabel>Là biến thể</InputLabel>
                            <Select
                                label="Là biến thể"
                                name="isVariant"
                                value={formData.isVariant}
                                onChange={handleChange}
                            >
                                <MenuItem value={true}>Có</MenuItem>
                                <MenuItem value={false}>Không</MenuItem>
                            </Select>
                        </FormControl>

                        {!formData.isVariant && (
                            <>
                                <TextField
                                    label="Giá tiền"
                                    variant="outlined"
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className={classes.textField}
                                    style={{ marginTop: '16px' }}
                                    fullWidth
                                    required
                                />
                                <TextField
                                    label="Số lượng"
                                    variant="outlined"
                                    type="number"
                                    name="qty"
                                    value={formData.qty}
                                    onChange={handleChange}
                                    className={classes.textField}
                                    fullWidth
                                    required
                                />
                            </>
                        )}

                        {formData.isVariant && (
                            <>
                                {productVariants.map((variant, index) => (
                                    <Box key={index} mt={2} mb={2}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={3}>
                                                <TextField
                                                    label="Màu sắc"
                                                    variant="outlined"
                                                    name="color"
                                                    value={variant.color}
                                                    onChange={(e) => handleVariantChange(index, e)}
                                                    className={classes.textField}
                                                    fullWidth
                                                />
                                            </Grid>
                                            <Grid item xs={3}>
                                                <TextField
                                                    label="Cấu hình"
                                                    variant="outlined"
                                                    name="configuration"
                                                    value={variant.configuration}
                                                    onChange={(e) => handleVariantChange(index, e)}
                                                    className={classes.textField}
                                                    fullWidth
                                                />
                                            </Grid>
                                            <Grid item xs={3}>
                                                <TextField
                                                    label="Giá tiền"
                                                    variant="outlined"
                                                    type="number"
                                                    name="price"
                                                    value={variant.price}
                                                    onChange={(e) => handleVariantChange(index, e)}
                                                    className={classes.textField}
                                                    fullWidth
                                                />
                                            </Grid>

                                            <Grid item xs={3}>
                                                <TextField
                                                    label="Số lượng"
                                                    variant="outlined"
                                                    type="number"
                                                    name="qty"
                                                    value={variant.qty}
                                                    onChange={(e) => handleVariantChange(index, e)}
                                                    className={classes.textField}
                                                    fullWidth
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                ))}
                                <Box display="flex" alignItems="flex-start">
                                    <Button
                                        onClick={addProductVariant}
                                        className={classes.button}
                                        variant="contained"
                                        color="primary"
                                    >
                                        Thêm biến thể
                                    </Button>
                                </Box>
                            </>
                        )}
                        <Box mt={2} mb={2}>
                            <h6>Hình ảnh</h6>
                            <input
                                accept="image/*"
                                type="file"
                                multiple
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                                id="upload-button"
                            />
                            <label htmlFor="upload-button">
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    component="span"
                                >
                                    Tải lên hình ảnh
                                </Button>
                            </label>

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
                                    >
                                        <img
                                            src={preview}
                                            alt={`preview-${index}`}
                                            className={classes.imagePreview}
                                        />
                                    </Box>
                                ))}
                            </Box>
                        </Box>


                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            fullWidth
                        >
                            Thêm Sản Phẩm
                        </Button>
                    </form>
                </Box>
            </PageBody>
        </React.Fragment>
    );
};

export default Create;
