import React, { useState } from 'react';
import { Box, Button, TextField, Typography, makeStyles } from "@material-ui/core";
import apiPromotion from '../../api/apiPromotion';
import { PageBody, PageHeader } from "../../components";
import { useHistory } from 'react-router-dom';
const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(4),
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '600px',
        margin: '0 auto',
    },
    input: {
        marginBottom: theme.spacing(2),
    },
    error: {
        color: 'red',
        marginBottom: theme.spacing(2),
    },
}));

const CreatePromotion = () => {
    const classes = useStyles();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [discount, setDiscount] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [error, setError] = useState(null);
    const history = useHistory();
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isNaN(discount) || discount < 0 || discount > 100) {
            setError('Giảm giá phải nằm trong khoảng từ 0 đến 100.');
            return;
        }

        if (new Date(startDate) >= new Date(endDate)) {
            setError('Ngày bắt đầu phải nhỏ hơn ngày kết thúc.');
            return;
        }

        const promotionData = {
            name,
            description,
            discount: parseFloat(discount),
            startDate,
            endDate,
        };

        try {
            await apiPromotion.createPromotion(promotionData);
            alert('Khuyến mãi đã được tạo thành công!');
            history.push("/promotions/all")
            setName('');
            setDescription('');
            setDiscount('');
            setStartDate('');
            setEndDate('');
        } catch (err) {
            setError('Lỗi khi tạo khuyến mãi.');
        }
    };

    return (
        <React.Fragment>
            <PageHeader title='Tạo Khuyến Mãi' />
            <PageBody>
                <Box className={classes.container}>
                    {error && <Typography className={classes.error}>{error}</Typography>}
                    <form className={classes.form} onSubmit={handleSubmit}>
                        <TextField
                            id="name"
                            label="Tên"
                            variant="outlined"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className={classes.input}
                        />
                        <TextField
                            id="description"
                            label="Mô tả"
                            variant="outlined"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            className={classes.input}
                        />
                        <TextField
                            id="discount"
                            label="Giảm giá (%)"
                            type="number"
                            variant="outlined"
                            value={discount}
                            onChange={(e) => setDiscount(e.target.value)}
                            required
                            className={classes.input}
                        />
                        <TextField
                            id="startDate"
                            label="Ngày bắt đầu"
                            type="datetime-local"
                            variant="outlined"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                            className={classes.input}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            id="endDate"
                            label="Ngày kết thúc"
                            type="datetime-local"
                            variant="outlined"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                            className={classes.input}
                            InputLabelProps={{ shrink: true }}
                        />
                        <Button type="submit" variant="contained" color="primary">
                            Tạo Khuyến Mãi
                        </Button>
                    </form>
                </Box>
            </PageBody>
        </React.Fragment>
    );
};

export default CreatePromotion;
