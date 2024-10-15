import React from "react";
import PropTypes from "prop-types";
import { Routes } from "../../components";

const ProductssRoutes = ({ routes }) => {
  return <Routes routes={routes} />;
};

export default ProductssRoutes;

ProductssRoutes.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object),
};
