import React from "react";
import PropTypes from "prop-types";
import { Routes } from "../../components";

const PromotionRoutes = ({ routes }) => {
  return <Routes routes={routes} />;
};

export default PromotionRoutes;

PromotionRoutes.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object),
};
