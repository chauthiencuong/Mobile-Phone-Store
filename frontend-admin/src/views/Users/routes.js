import React from "react";
import PropTypes from "prop-types";
import { Routes } from "../../components";

const UsersRoutes = ({ routes }) => {
  return <Routes routes={routes} />;
};

export default UsersRoutes;

UsersRoutes.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object),
};
