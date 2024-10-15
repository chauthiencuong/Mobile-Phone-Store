import React from "react";
import PropTypes from "prop-types";
import { Routes } from "../../components";

const OrdersRoutes = ({ routes }) => {
  return <Routes routes={routes} />;
};

export default OrdersRoutes;

OrdersRoutes.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object),
};
