import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Button, TextField, makeStyles, MenuItem, Select, InputLabel, FormControl } from "@material-ui/core";
import { PageBody, PageHeader } from "../../components";
import apiPost from "../../api/apiPost";
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
  const [description1, setDescription1] = useState("");
  const [description2, setDescription2] = useState("");
  const [description3, setDescription3] = useState("");
  const [description4, setDescription4] = useState("");
  const [status, setStatus] = useState(1);
  const [imageFile, setImageFile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await apiPost.getPostById(id);
        setName(data.name);
        setDescription1(data.description1);
        setDescription2(data.description2);
        setDescription3(data.description3);
        setDescription4(data.description4);
        setStatus(data.status);
      } catch (error) {
        console.error("Failed to fetch category:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchAllPosts = async () => {
      try {
        const result = await apiPost.getAllPosts();
        setPosts(result);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchPost();
    fetchAllPosts();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const postData = new FormData();
    postData.append("Name", name);
    postData.append("Description1", description1);
    postData.append("Description2", description2);
    postData.append("Description3", description3);
    postData.append("Description4", description4);
    postData.append("Status", status);

    if (imageFile) {
        postData.append("ImageFile", imageFile);
    }

    try {
      await apiPost.updatePost(id, postData);
      alert("Cập nhật bài viết thành công!");
      history.push('/posts/all')
    } catch (error) {
      let errorMessage = "Cập nhật bài viết thất bại";

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
      <PageHeader title='Cập nhật bài viết' />
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
              label="Tên bài viết"
              variant="outlined"
              fullWidth
              className={classes.inputField}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <TextField
              label="Mô tả 1"
              variant="outlined"
              fullWidth
              className={classes.inputField}
              value={description1}
              onChange={(e) => setDescription1(e.target.value)}
              required
              multiline
              rows={4}
            />
            <TextField
              label="Mô tả 2"
              variant="outlined"
              fullWidth
              className={classes.inputField}
              value={description2}
              onChange={(e) => setDescription2(e.target.value)}
              required
              multiline
              rows={6}
            />
            <TextField
              label="Mô tả 3"
              variant="outlined"
              fullWidth
              className={classes.inputField}
              value={description3}
              onChange={(e) => setDescription3(e.target.value)}
              required
              multiline
              rows={6}
            />
            <TextField
              label="Mô tả 4"
              variant="outlined"
              fullWidth
              className={classes.inputField}
              value={description4}
              onChange={(e) => setDescription4(e.target.value)}
              required
              multiline
              rows={4}
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
                Cập nhật bài viết
              </Button>
            </div>
          </form>
        </Box>
      </PageBody>
    </React.Fragment>
  );
};

export default Edit;
