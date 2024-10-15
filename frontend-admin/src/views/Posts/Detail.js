import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Paper, makeStyles } from "@material-ui/core";
import { PageBody, PageHeader } from "../../components";
import { useParams, useHistory } from "react-router-dom";
import apiPost from "../../api/apiPost";

const useStyles = makeStyles((theme) => ({
  leftSpacing: {
    marginRight: theme.spacing(1),
  },
  detailContainer: {
    padding: theme.spacing(3),
    maxWidth: '600px',
    width: '100%',
  },
  image: {
    width: '200px',
    height: 'auto',
    maxHeight: '300px',
    objectFit: 'contain',
    marginBottom: theme.spacing(2),
  },
  table: {
    width: '100%',
    marginTop: theme.spacing(2),
    '& td, & th': {
      padding: theme.spacing(1),
      textAlign: 'left',
    },
  },
  tableHeader: {
    backgroundColor: theme.palette.grey[200],
    fontWeight: 'bold',
  },
}));

const Detail = () => {
  const { id } = useParams();
  const history = useHistory();
  const classes = useStyles();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await apiPost.getPostById(id);
        setPost(data);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <React.Fragment>
      <PageHeader title="Chi tiết bài viết">
        <Button
          variant="contained"
          color="primary"
          className={classes.leftSpacing}
          onClick={() => history.push('/posts/all')}
        >
          Quay lại danh sách
        </Button>
      </PageHeader>
      <PageBody style={{ display: "flex", justifyContent: "center" }}>
        <Paper elevation={3} className={classes.detailContainer}>
          <table className={classes.table}>
            <thead>
              <tr className={classes.tableHeader}>
                <th>Thông tin</th>
                <th>Giá trị</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Hình ảnh</td>
                <td>
                  {post.imagePost ? (
                    <img
                      src={post.imagePost}
                      alt={post.name}
                      className={classes.image}
                    />
                  ) : (
                    <Typography>Chưa có hình ảnh</Typography>
                  )}
                </td>
              </tr>
              <tr>
                <td>Tên bài viết</td>
                <td>{post.name}</td>
              </tr>
              <tr>
                <td>Slug</td>
                <td>{post.slug}</td>
              </tr>
              <tr>
                <td>Mô tả 1</td>
                <td>{post.description1 || 'Không có mô tả'}</td>
              </tr>
              <tr>
                <td>Mô tả 2</td>
                <td>{post.description2 || 'Không có mô tả'}</td>
              </tr>
              <tr>
                <td>Mô tả 3</td>
                <td>{post.description3 || 'Không có mô tả'}</td>
              </tr>
              <tr>
                <td>Mô tả 4</td>
                <td>{post.description4 || 'Không có mô tả'}</td>
              </tr>
              <tr>
                <td>Trạng thái</td>
                <td>{post.status === 1 ? 'Hiển thị' : 'Ẩn'}</td>
              </tr>
              <tr>
                <td>Ngày tạo</td>
                <td>{new Date(post.createdAt).toLocaleString()}</td>
                </tr>
              <tr>
                <td>Ngày cập nhật</td>
                <td>{new Date(post.updatedAt).toLocaleString()}</td>
                </tr>
              <tr>
                <td>Người tạo</td>
                <td>{post.createdBy === 1 ? 'Admin' : post.updatedBy}</td>
              </tr>
              <tr>
                <td>Người cập nhật</td>
                <td>{post.updatedBy === 1 ? 'Admin' : post.updatedBy}</td>
                </tr>
            </tbody>
          </table>
        </Paper>
      </PageBody>
    </React.Fragment>
  );
};

export default Detail;
