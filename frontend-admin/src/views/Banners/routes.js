import React from "react";
import PropTypes from "prop-types";
import { Routes } from "../../components";

const BannersRoutes = ({ routes }) => {
  return <Routes routes={routes} />;
};

export default BannersRoutes;

BannersRoutes.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object),
};
