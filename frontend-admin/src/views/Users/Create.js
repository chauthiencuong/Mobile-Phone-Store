import React, { useState, useEffect } from "react";
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

const Create = () => {
    const classes = useStyles();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [userName, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [users, setUser] = useState([]);
    const [loading, setLoading] = useState(true);
    const history = useHistory();
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const result = await apiAuth.getAllUsers();
                setUser(result);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch brands:", error);
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const userData = new FormData();
        userData.append("Name", name);
        userData.append("Email", email);
        userData.append("Phone", phone);
        userData.append("Username", userName);
        userData.append("Password", password);
        try {
            await apiAuth.createUser(userData);
            alert("Thêm thành công!");
            history.push("/users/all")
        } catch (error) {
            let errorMessage = "Failed to create brand";

            if (error.response && error.response.data) {
                errorMessage = error.response.data.message || error.response.data.errors || errorMessage;
            } else if (error.message) {
                errorMessage = error.message;
            }

            alert(errorMessage);
        }
    };
    return (
        <React.Fragment>
            <PageHeader title='Thêm quản trị viên' />
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
                            label="Password"
                            variant="outlined"
                            fullWidth
                            className={classes.inputField}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            type="password"
                        />
                        <div className={classes.buttonWrapper}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                            >
                                Tạo mới
                            </Button>
                        </div>
                    </form>
                </Box>
            </PageBody>
        </React.Fragment>
    );
};

export default Create;
