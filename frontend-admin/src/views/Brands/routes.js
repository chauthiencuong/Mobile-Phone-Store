import React from "react";
import PropTypes from "prop-types";
import { Routes } from "../../components";

const BrandsRoutes = ({ routes }) => {
  return <Routes routes={routes} />;
};

export default BrandsRoutes;

BrandsRoutes.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object),
};
