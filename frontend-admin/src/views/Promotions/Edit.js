import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Button, TextField, makeStyles, MenuItem, Select, InputLabel, FormControl } from "@material-ui/core";
import { PageBody, PageHeader } from "../../components";
import apiPromotion from "../../api/apiPromotion";
import { useHistory } from "react-router-dom";
 
const useStyles = makeStyles((theme) => ({
    leftSpacing: {
        marginRight: theme.spacing(1),
    },
    inputField: {
        marginBottom: theme.spacing(2),
    },
    buttonWrapper: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: theme.spacing(2),
    },
    formControl: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
}));

const Edit = () => {
    const { id } = useParams();
    const classes = useStyles();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [discount, setDiscount] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isActive, setIsActive] = useState("");
    const [loading, setLoading] = useState(true);
    const history = useHistory();
    useEffect(() => {
        const fetchPromotion = async () => {
            try {
                const data = await apiPromotion.getPromotionById(id);
                setName(data.name);
                setDescription(data.description);
                setDiscount(data.discount);
                setStartDate(data.startDate);
                setEndDate(data.endDate);
                setIsActive(data.isActive);
            } catch (error) {
                console.error("Failed to fetch promotion:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPromotion();
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validate dates
        if (new Date(startDate) >= new Date(endDate)) {
            alert('Ngày bắt đầu phải nhỏ hơn ngày kết thúc.');
            return;
        }

        // Validate discount
        if (isNaN(discount) || discount < 0 || discount > 100) {
            alert('Giảm giá phải nằm trong khoảng từ 0 đến 100.');
            return;
        }

        const promotionData = {
            name,
            description,
            discount: parseFloat(discount),
            startDate,
            endDate,
            isActive,
        };

        try {
            await apiPromotion.updatePromotion(id, promotionData);
            alert("Cập nhật khuyến mại thành công!");
            history.push("/promotions/all")
        } catch (error) {
            let errorMessage = "Cập nhật khuyến mại thất bại";
            if (error.response && error.response.data) {
                errorMessage = error.response.data.message || error.response.data.errors || errorMessage;
            } else if (error.message) {
                errorMessage = error.message;
            }
            alert(errorMessage);
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <React.Fragment>
            <PageHeader title='Cập nhật khuyến mại' />
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
                            label="Tên chương trình khuyến mại"
                            variant="outlined"
                            fullWidth
                            className={classes.inputField}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <TextField
                            label="Mô tả"
                            variant="outlined"
                            fullWidth
                            className={classes.inputField}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                        <TextField
                            label="Giảm giá (%)"
                            type="number"
                            variant="outlined"
                            fullWidth
                            className={classes.inputField}
                            value={discount}
                            onChange={(e) => setDiscount(e.target.value)}
                            required
                            inputProps={{ min: 0, max: 100 }}
                        />
                        <TextField
                            label="Ngày bắt đầu"
                            type="datetime-local"
                            variant="outlined"
                            fullWidth
                            className={classes.inputField}
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            label="Ngày kết thúc"
                            type="datetime-local"
                            variant="outlined"
                            fullWidth
                            className={classes.inputField}
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                            InputLabelProps={{ shrink: true }}
                        />
                        <FormControl variant="outlined" className={classes.formControl}>
                            <InputLabel id="status-label">Trạng thái</InputLabel>
                            <Select
                                labelId="status-label"
                                value={isActive}
                                onChange={(e) => setIsActive(e.target.value === 'true')}
                                label="Trạng thái"
                            >
                                <MenuItem value={true}>Đang khuyến mại</MenuItem>
                                <MenuItem value={false}>Hết hạn</MenuItem>
                            </Select>
                        </FormControl>

                        <div className={classes.buttonWrapper}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                            >
                                Cập nhật khuyến mại
                            </Button>
                        </div>
                    </form>
                </Box>
            </PageBody>
        </React.Fragment>
    );
};

export default Edit;
