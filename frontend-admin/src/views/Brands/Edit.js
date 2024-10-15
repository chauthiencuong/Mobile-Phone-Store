import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Button, TextField, makeStyles, MenuItem, Select, InputLabel, FormControl } from "@material-ui/core";
import { PageBody, PageHeader } from "../../components";
import apiBrand from "../../api/apiBrand";

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
  const [status, setStatus] = useState(1);
  const [imageFile, setImageFile] = useState(null);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const data = await apiBrand.getBrandById(id);
        setName(data.name);
        setDescription(data.description);
        setStatus(data.status);
      } catch (error) {
        console.error("Failed to fetch category:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchAllBrands = async () => {
      try {
        const result = await apiBrand.getAllBrands();
        setBrands(result);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchBrand();
    fetchAllBrands();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const brandData = new FormData();
    brandData.append("Name", name);
    brandData.append("Description", description);
    brandData.append("Status", status);
    if (imageFile) {
        brandData.append("ImageFile", imageFile);
    }

    try {
      await apiBrand.updateBrand(id, brandData);
      alert("Cập nhật thương hiệu thành công!");
    } catch (error) {
      let errorMessage = "Cập nhật thương hiệu thất bại";

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
      <PageHeader title='Cập nhật thương hiệu' />
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
              label="Tên thương hiệu"
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
                Cập nhật thương hiệu
              </Button>
            </div>
          </form>
        </Box>
      </PageBody>
    </React.Fragment>
  );
};

export default Edit;
