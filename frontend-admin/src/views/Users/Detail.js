import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Paper, makeStyles } from "@material-ui/core";
import { PageBody, PageHeader } from "../../components";
import { useParams, useHistory } from "react-router-dom";
import apiAuth from "../../api/apiAuth";

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
    width: '100px',
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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await apiAuth.getUserById(id);
        setUser(data);
        console.log(data)
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <React.Fragment>
      <PageHeader title="Chi tiết người dùng">
        <Button
          variant="contained"
          color="primary"
          className={classes.leftSpacing}
          onClick={() => history.push('/users/all')}
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
                  {user.imageUser ? (
                    <img
                      src={user.imageUser}
                      alt={user.name}
                      className={classes.image}
                    />
                  ) : (
                    <Typography>Chưa có hình ảnh</Typography>
                  )}
                </td>
              </tr>
              <tr>
                <td>Tên người dùng</td>
                <td>{user.name}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>{user.email}</td>
              </tr>
              <tr>
                <td>Số điện thoại</td>
                <td>{user.phone}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>{user.email}</td>
              </tr>
              <tr>
                <td>Vai trò</td>
                <td>{user.role}</td>
              </tr>   
            </tbody>
          </table>
        </Paper>
      </PageBody>
    </React.Fragment>
  );
};

export default Detail;
