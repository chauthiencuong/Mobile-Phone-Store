import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Button, TextField, makeStyles, MenuItem, Select, InputLabel, FormControl } from "@material-ui/core";
import { PageBody, PageHeader } from "../../components";
import apiAuth from "../../api/apiAuth";
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
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [userName, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState(1);
    const [imageFile, setImageFile] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const history = useHistory();
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await apiAuth.getUserById(id);
                setName(data.name);
                setEmail(data.email);
                setPhone(data.phone);
                setUsername(data.userName);
                setPassword(data.password);
                setRole(data.role);
            } catch (error) {
                console.error("Failed to fetch category:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchAllUsers = async () => {
            try {
                const result = await apiAuth.getAllUsers();
                setUsers(result);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };

        fetchUser();
        fetchAllUsers();
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const userData = new FormData();
        userData.append("Name", name);
        userData.append("Email", email);
        userData.append("Phone", phone);
        userData.append("Username", userName);
        userData.append("Password", password);
        userData.append("Role", role);

        if (imageFile) {
            userData.append("ImageFile", imageFile);
        }

        try {
            await apiAuth.updateUser(id, userData);
            alert("Cập nhật người dùng thành công!");
            history.push('/users/all')
        } catch (error) {
            let errorMessage = "Cập nhật thất bại";

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
            <PageHeader title='Cập nhật người dùng' />
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
                            label="Họ tên"
                            variant="outlined"
                            fullWidth
                            className={classes.inputField}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            className={classes.inputField}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <TextField
                            label="Phone"
                            variant="outlined"
                            fullWidth
                            className={classes.inputField}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                        <TextField
                            label="Username"
                            variant="outlined"
                            fullWidth
                            className={classes.inputField}
                            value={userName}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <TextField
                            label="Mật khẩu"
                            variant="outlined"
                            fullWidth
                            className={classes.inputField}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            required
                        />
                        <FormControl variant="outlined" fullWidth className={classes.inputField}>
                            <InputLabel>Vai trò</InputLabel>
                            <Select
                                label="Vai trò"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                required
                            >
                                <MenuItem value="User">Người dùng</MenuItem>
                                <MenuItem value="Admin">Quản trị viên</MenuItem>
                            </Select>
                        </FormControl>
                        <input
                            type="file"
                            onChange={(e) => setImageFile(e.target.files[0])}
                            className={classes.inputField}
                        />
                        <div className={classes.buttonWrapper}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                            >
                                Cập nhật người dùng
                            </Button>
                        </div>
                    </form>
                </Box>
            </PageBody>
        </React.Fragment>
    );
};

export default Edit;
