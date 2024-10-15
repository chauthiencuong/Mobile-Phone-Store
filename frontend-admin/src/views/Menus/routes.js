import React from "react";
import PropTypes from "prop-types";
import { Routes } from "../../components";

const MenuRoutes = ({ routes }) => {
  return <Routes routes={routes} />;
};

export default MenuRoutes;

MenuRoutes.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object),
};
