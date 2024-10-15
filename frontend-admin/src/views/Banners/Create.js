import React, { useState, useEffect } from "react";
import { Box, Button, TextField, makeStyles, MenuItem, Select, InputLabel, FormControl } from "@material-ui/core";
import { PageBody, PageHeader } from "../../components";
import apiBanner from "../../api/apiBanner";
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
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(1);    
  const [imageFile, setImageFile] = useState(null);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const result = await apiBanner.getAllBanners();
        setBanners(result);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch brands:", error);
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const bannerData = new FormData();
    bannerData.append("Name", name);
    bannerData.append("Description", description);
    bannerData.append("Status", status);
    if (imageFile) {
        bannerData.append("ImageFile", imageFile);
    }

    try {
      await apiBanner.createBanner(bannerData);
      alert("Thêm thành công!");
      history.push("/banners/all")
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
      <PageHeader title='Thêm banner' />
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
              label="Tên banner"
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
                Tạo banner
              </Button>
            </div>
          </form>
        </Box>
      </PageBody>
    </React.Fragment>
  );
};

export default Create;
