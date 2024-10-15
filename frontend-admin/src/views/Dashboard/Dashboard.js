import React from "react";
import { Box } from "@material-ui/core";
import { PageBody, PageHeader } from "../../components";

const Dashboard = () => {
  return (
    <React.Fragment>
      <PageHeader title='Chào mừng bạn đến trang quản trị' />
      <PageBody style={{ display: "flex" }}>
        <Box
          flexGrow='1'
          width='100%'
          display='flex'
          flexDirection='column'
          alignItems='center'
          justifyContent='center'>
          <h1>Welcome!</h1>
          <p>Hello Adminsitor</p>
        </Box>
      </PageBody>
    </React.Fragment>
  );
};

export default Dashboard;
