import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Paper, makeStyles } from "@material-ui/core";
import { PageBody, PageHeader } from "../../components";
import { useParams, useHistory } from "react-router-dom";
import apiBanner from "../../api/apiBanner";

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
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const data = await apiBanner.getBannerById(id);
        setBanner(data);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBanner();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <React.Fragment>
      <PageHeader title="Chi tiết banner">
        <Button
          variant="contained"
          color="primary"
          className={classes.leftSpacing}
          onClick={() => history.push('/banners/all')}
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
                  {banner.imageBanner ? (
                    <img
                      src={banner.imageBanner}
                      alt={banner.name}
                      className={classes.image}
                    />
                  ) : (
                    <Typography>Chưa có hình ảnh</Typography>
                  )}
                </td>
              </tr>
              <tr>
                <td>Tên thương hiệu</td>
                <td>{banner.name}</td>
              </tr>
              <tr>
                <td>Slug</td>
                <td>{banner.slug}</td>
              </tr>
              <tr>
                <td>Mô tả</td>
                <td>{banner.description || 'Không có mô tả'}</td>
              </tr>
              <tr>
                <td>Trạng thái</td>
                <td>{banner.status === 1 ? 'Hiển thị' : 'Ẩn'}</td>
              </tr>
              <tr>
                <td>Ngày tạo</td>
                <td>{new Date(banner.createdAt).toLocaleString()}</td>
                </tr>
              <tr>
                <td>Ngày cập nhật</td>
                <td>{new Date(banner.updatedAt).toLocaleString()}</td>
                </tr>
              <tr>
                <td>Người tạo</td>
                <td>{banner.createdBy === 1 ? 'Admin' : banner.updatedBy}</td>
              </tr>
              <tr>
                <td>Người cập nhật</td>
                <td>{banner.updatedBy === 1 ? 'Admin' : banner.updatedBy}</td>
                </tr>
            </tbody>
          </table>
        </Paper>
      </PageBody>
    </React.Fragment>
  );
};

export default Detail;
