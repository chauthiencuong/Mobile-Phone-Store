import React, { useState, useEffect } from "react";
import { Box, Button, TextField, makeStyles, MenuItem, Select, InputLabel, FormControl } from "@material-ui/core";
import { PageBody, PageHeader } from "../../components";
import { useHistory } from "react-router-dom";
import apiMenu from "../../api/apiMenu";
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
  const [link, setLink] = useState("");
  const [status, setStatus] = useState(1);    
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const result = await apiMenu.getAllMenus();
        setMenus(result);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch brands:", error);
        setLoading(false);
      }
    };
    fetchMenus();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const menuData = new FormData();
    menuData.append("Name", name);
    menuData.append("Link", link);
    menuData.append("Status", status);

    try {
      await apiMenu.createMenu(menuData);
      alert("Thêm thành công!");
      history.push("/menus/all")
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
      <PageHeader title='Thêm menu' />
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
              label="Tên menu"
              variant="outlined"
              fullWidth
              className={classes.inputField}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <TextField
              label="Link"
              variant="outlined"
              fullWidth
              className={classes.inputField}
              value={link}
              onChange={(e) => setLink(e.target.value)}
              required
            />
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="status-label">Trạng thái</InputLabel>
              <Select
                labelId="status-label"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                label="Trạng thái"
              >
                <MenuItem value={1}>Hiển thị</MenuItem>
                <MenuItem value={0}>Ẩn</MenuItem>
              </Select>
            </FormControl>
            <div className={classes.buttonWrapper}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                Tạo menu
              </Button>
            </div>
          </form>
        </Box>
      </PageBody>
    </React.Fragment>
  );
};

export default Create;
