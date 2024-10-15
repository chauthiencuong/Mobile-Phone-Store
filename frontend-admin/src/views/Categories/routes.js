import React from "react";
import PropTypes from "prop-types";
import { Routes } from "../../components";

const CategoriesRoutes = ({ routes }) => {
  return <Routes routes={routes} />;
};

export default CategoriesRoutes;

CategoriesRoutes.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object),
};
