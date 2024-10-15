import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Paper, makeStyles } from "@material-ui/core";
import { PageBody, PageHeader } from "../../components";
import { useParams, useHistory } from "react-router-dom";
import apiCategory from "../../api/apiCategory";

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
  const [category, setCategory] = useState(null);
  const [parentCategoryName, setParentCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryDetail = async () => {
      try {
        const data = await apiCategory.getCategoryById(id);
        setCategory(data);

        // Nếu category có parent_id khác 0, lấy thông tin danh mục cha
        if (data.parent_id !== 0) {
          const parentCategory = await apiCategory.getCategoryById(data.parent_id);
          setParentCategoryName(parentCategory.name);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryDetail();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <React.Fragment>
      <PageHeader title="Chi tiết danh mục">
        <Button
          variant="contained"
          color="primary"
          className={classes.leftSpacing}
          onClick={() => history.push('/categories/all')}
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
                  {category.imageCategory ? (
                    <img
                      src={category.imageCategory}
                      alt={category.name}
                      className={classes.image}
                    />
                  ) : (
                    <Typography>Chưa có hình ảnh</Typography>
                  )}
                </td>
              </tr>
              <tr>
                <td>Tên thương hiệu</td>
                <td>{category.name}</td>
              </tr>
              <tr>
                <td>Slug</td>
                <td>{category.slug}</td>
              </tr>
              <tr>
                <td>Mô tả</td>
                <td>{category.description || 'Không có mô tả'}</td>
              </tr>
              <tr>
                <td>Trạng thái</td>
                <td>{category.status === 1 ? 'Hiển thị' : 'Ẩn'}</td>
              </tr>
              <tr>
                <td>Ngày tạo</td>
                <td>{new Date(category.createdAt).toLocaleString()}</td>
                </tr>
              <tr>
                <td>Ngày cập nhật</td>
                <td>{new Date(category.updatedAt).toLocaleString()}</td>
                </tr>
              <tr>
                <td>Người tạo</td>
                <td>{category.createdBy === 1 ? 'Admin' : category.updatedBy}</td>
              </tr>
              <tr>
                <td>Người cập nhật</td>
                <td>{category.updatedBy === 1 ? 'Admin' : category.updatedBy}</td>
                </tr>
            </tbody>
          </table>
        </Paper>
      </PageBody>
    </React.Fragment>
  );
};

export default Detail;
