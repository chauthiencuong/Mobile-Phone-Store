import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Button, TextField, makeStyles, MenuItem, Select, InputLabel, FormControl } from "@material-ui/core";
import { PageBody, PageHeader } from "../../components";
import apiCategory from "../../api/apiCategory";
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
  const [parent_id, setParentId] = useState(0);
  const [status, setStatus] = useState(1);
  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const history = useHistory();
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const data = await apiCategory.getCategoryById(id);
        setName(data.name);
        setDescription(data.description);
        setParentId(data.parent_id);
        setStatus(data.status);
      } catch (error) {
        console.error("Failed to fetch category:", error);
        setFetchError("Không thể tải danh mục. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    const fetchAllCategories = async () => {
      try {
        const result = await apiCategory.getAllCategories();
        setCategories(result);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setFetchError("Không thể tải các danh mục cha. Vui lòng thử lại.");
      }
    };

    fetchCategory();
    fetchAllCategories();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const categoryData = new FormData();
    categoryData.append("Name", name);
    categoryData.append("Description", description);
    categoryData.append("Parent_id", parent_id);
    categoryData.append("Status", status);
    if (imageFile) {
      categoryData.append("ImageFile", imageFile);
    }

    try {
      await apiCategory.updateCategory(id, categoryData);
      alert("Cập nhật danh mục thành công!");
      history.push("/categories/all")
    } catch (error) {
      let errorMessage = "Cập nhật danh mục thất bại";

      if (error.response && error.response.data) {
        errorMessage = error.response.data.message || error.response.data.errors || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(errorMessage);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (fetchError) return <p>Error: {fetchError}</p>;

  return (
    <React.Fragment>
      <PageHeader title='Cập nhật danh mục' />
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
              label="Tên danh mục"
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
              <InputLabel id="parent-id-label">Danh mục cha</InputLabel>
              <Select
                labelId="parent-id-label"
                value={parent_id}
                onChange={(e) => setParentId(e.target.value)}
                label="Danh mục cha"
              >
                <MenuItem value={0}>
                  <em>Không có</em>
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
                Cập nhật danh mục
              </Button>
            </div>
          </form>
        </Box>
      </PageBody>
    </React.Fragment>
  );
};

export default Edit;
