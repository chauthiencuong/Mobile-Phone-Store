import { lazy } from "react";

function importView(...args) {
  const path = args
    .map((arg) => {
      if (Array.isArray(arg)) {
        const nestPath = new Array(arg[1])
          .fill(0)
          .map(() => arg[0])
          .join("/");
        arg = nestPath;
      }
      return arg;
    })
    .join("/");
  return import(`../views/${path}.js`);
}

export const mainRoutes = [
  {
    path: `/auth/login`,
    component: lazy(() => importView(["LoginAuth", 2])),
  },
  {
    path: `/dashboard`,
    component: lazy(() => importView(["Dashboard", 2])),
  },
  {
    path: `/posts`,
    component: lazy(() => importView("Posts", "routes")),
    routes: [
      {
        path: `/posts/all`,
        component: lazy(() => importView("Posts", "Posts")),
      },
      {
        path: `/posts/create`,
        component: lazy(() => importView("Posts", "Create")),
      },
      {
        path: `/posts/edit/:id`,
        component: lazy(() => importView("Posts", "Edit")),
      },
      {
        path: `/posts/detail/:id`,
        component: lazy(() => importView("Posts", "Detail")),
      }
    ],
  },
  {
    path: `/menus`,
    component: lazy(() => importView("Menus", "routes")),
    routes: [
      {
        path: `/menus/all`,
        component: lazy(() => importView("Menus", "Menus")),
      },
      {
        path: `/menus/create`,
        component: lazy(() => importView("Menus", "Create")),
      },
      {
        path: `/menus/detail/:id`,
        component: lazy(() => importView("Menus", "Detail")),
      },
      {
        path: `/menus/edit/:id`,
        component: lazy(() => importView("Menus", "Edit")),
      }
    ],
  },
  {
    path: `/orders`,
    component: lazy(() => importView("Orders", "routes")),
    routes: [
      {
        path: `/orders/all`,
        component: lazy(() => importView("Orders", "Orders")),
      },
      {
        path: `/orders/detail/:id`,
        component: lazy(() => importView("Orders", "OrderDetail")),
      },
      {
        path: `/orders/edit/:id`,
        component: lazy(() => importView("Orders", "Edit")),
      },
    ],
  },
  {
    path: `/products`,
    component: lazy(() => importView("Products", "routes")),
    routes: [
      {
        path: `/products/all`,
        component: lazy(() => importView("Products", "Products")),
      },
      {
        path: `/products/promotion`,
        component: lazy(() => importView("Products", "ProductPromotion")),
      },
      {
        path: `/products/create`,
        component: lazy(() => importView("Products", "Create")),
      },
      {
        path: `/products/edit/:id`,
        component: lazy(() => importView("Products", "Edit")),
      },
      {
        path: `/products/detail/:id`,
        component: lazy(() => importView("Products", "Detail")),
      },
      {
        path: `/products/createProductPromotion`,
        component: lazy(() => importView("Products", "CreateProductPromotion")),
      },
    ],
  },
  {
    path: `/categories`,
    component: lazy(() => importView("Categories", "routes")),
    routes: [
      {
        path: `/categories/all`,
        component: lazy(() => importView("Categories", "Categories")),
      },
      {
        path: `/categories/create`,
        component: lazy(() => importView("Categories", "Create")),
      },
      {
        path: `/categories/edit/:id`,
        component: lazy(() => importView("Categories", "Edit")),
      },
      {
        path: `/categories/detail/:id`,
        component: lazy(() => importView("Categories", "Detail")),
      },
    ],
  },
  {
    path: `/brands`,
    component: lazy(() => importView("Brands", "routes")),
    routes: [
      {
        path: `/brands/all`,
        component: lazy(() => importView("Brands", "Brands")),
      },
      {
        path: `/brands/create`,
        component: lazy(() => importView("Brands", "Create")),
      },
      {
        path: `/brands/edit/:id`,
        component: lazy(() => importView("Brands", "Edit")),
      },
      {
        path: `/brands/detail/:id`,
        component: lazy(() => importView("Brands", "Detail")),
      },
    ],
  },
  {
    path: `/banners`,
    component: lazy(() => importView("Banners", "routes")),
    routes: [
      {
        path: `/banners/all`,
        component: lazy(() => importView("Banners", "Banners")),
      },
      {
        path: `/banners/create`,
        component: lazy(() => importView("Banners", "Create")),
      },
      {
        path: `/banners/edit/:id`,
        component: lazy(() => importView("Banners", "Edit")),
      },
      {
        path: `/banners/detail/:id`,
        component: lazy(() => importView("Banners", "Detail")),
      },
    ],
  },
  {
    path: `/promotions`,
    component: lazy(() => importView("Promotions", "routes")),
    routes: [
      {
        path: `/promotions/all`,
        component: lazy(() => importView("Promotions", "Promotions")),
      },
      {
        path: `/promotions/create`,
        component: lazy(() => importView("Promotions", "Create")),
      },
      {
        path: `/promotions/edit/:id`,
        component: lazy(() => importView("Promotions", "Edit")),
      },
      {
        path: `/promotions/addProductPromotion`,
        component: lazy(() => importView("Promotions", "CreateProductPromotion")),
      },
    ],
  },
  {
    path: `/users`,
    component: lazy(() => importView("Users", "routes")),
    routes: [
      {
        path: `/users/all`,
        component: lazy(() => importView("Users", "Users")),
      },
      {
        path: `/users/create`,
        component: lazy(() => importView("Users", "Create")),
      },
      {
        path: `/users/edit/:id`,
        component: lazy(() => importView("Users", "Edit")),
      },
      {
        path: `/users/detail/:id`,
        component: lazy(() => importView("Users", "Detail")),
      },
    ],
  },
];
