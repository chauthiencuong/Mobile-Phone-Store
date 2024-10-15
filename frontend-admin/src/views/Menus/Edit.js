import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Button, TextField, makeStyles, MenuItem, Select, InputLabel, FormControl } from "@material-ui/core";
import { PageBody, PageHeader } from "../../components";
import apiMenu from "../../api/apiMenu";
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
  const [link, setLink] = useState("");
  const [status, setStatus] = useState(1);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await apiMenu.getMenuById(id);
        setName(data.name);
        setLink(data.link);
        setStatus(data.status);
      } catch (error) {
        console.error("Failed to fetch category:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchAllBanners = async () => {
      try {
        const result = await apiMenu.getAllMenus();
        setMenus(result);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchBanners();
    fetchAllBanners();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const menuData = new FormData();
    menuData.append("Name", name);
    menuData.append("Link", link);
    menuData.append("Status", status);
    try {
      await apiMenu.updateMenu(id, menuData);
      alert("Cập nhật menu thành công!");
      history.push('/menus/all')
    } catch (error) {
      let errorMessage = "Cập nhật menu thất bại";

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
      <PageHeader title='Cập nhật menu' />
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
                Cập nhật menu
              </Button>
            </div>
          </form>
        </Box>
      </PageBody>
    </React.Fragment>
  );
};

export default Edit;
