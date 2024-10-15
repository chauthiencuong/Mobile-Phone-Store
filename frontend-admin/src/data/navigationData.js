import {
  Dashboard,
  PeopleAlt,
  MenuBook,
  ImportContacts,
  PostAdd,
  Storefront,
  Category,
  AddBox
} from "@material-ui/icons";

export const mainNavigation = [
  {
    name: "Admin",
    icon: Dashboard,
    url: `/dashboard`,
  },
  {
    name: "Bài viết",
    icon: ImportContacts,
    url: `/posts`,
    navigationData: [
      {
        name: "Tất cả bài viết",
        icon: MenuBook,
        url: `/posts/all`,
      },
      {
        name: "Thêm mới bài viết",
        icon: PostAdd,
        url: `/posts/create`,
      },
    ],
  },
  {
    name: "Menu",
    icon: ImportContacts,
    url: `/menus`,
    navigationData: [
      {
        name: "Tất cả menu",
        icon: MenuBook,
        url: `/menus/all`,
      },
      {
        name: "Thêm mới menu",
        icon: PostAdd,
        url: `/menus/create`,
      },
    ],
  },
  {
    name: "Orders",
    icon: ImportContacts,
    url: `/orders`,
    navigationData: [
      {
        name: "Quản lý đơn hàng",
        icon: MenuBook,
        url: `/orders/all`,
      },
    ],
  },
  {
    name: "Sản phẩm",
    icon: Storefront,
    url: `/products`,
    navigationData: [
      {
        name: "Tất cả sản phẩm",
        icon: Category,
        url: `/products/all`,
      },
      {
        name: "Sản phẩm khuyến mại",
        icon: Category,
        url: `/products/promotion`,
      },
      {
        name: "Thêm mới sản phẩm",
        icon: AddBox,
        url: `/products/create`,
      },
    ],
  },
  {
    name: "Khuyến mại",
    icon: Storefront,
    url: `/promotions`,
    navigationData: [
      {
        name: "Tất cả khuyến mại",
        icon: Category,
        url: `/promotions/all`,
      },
      {
        name: "Thêm mới khuyến mại",
        icon: AddBox,
        url: `/promotions/create`,
      },
      {
        name: "Áp dụng khuyến mại",
        icon: AddBox,
        url: `/promotions/addProductPromotion`,
      },
    ],
  },
  {
    name: "Danh mục",
    icon: Storefront,
    url: `/categories`,
    navigationData: [
      {
        name: "Tất cả danh mục",
        icon: Category,
        url: `/categories/all`,
      },
      {
        name: "Thêm mới danh mục",
        icon: AddBox,
        url: `/categories/create`,
      },
      {
        url: `/categories/edit/:id`,
      },
    ],
  },
  {
    name: "Thương hiệu",
    icon: Storefront,
    url: `/brands`,
    navigationData: [
      {
        name: "Tất cả thương hiệu",
        icon: Category,
        url: `/brands/all`,
      },
      {
        name: "Thêm mới thương hiệu",
        icon: AddBox,
        url: `/brands/create`,
      },
      {
        url: `/brands/edit/:id`,
      },
    ],
  },
  {
    name: "Banner",
    icon: Storefront,
    url: `/banners`,
    navigationData: [
      {
        name: "Tất cả banner",
        icon: Category,
        url: `/banners/all`,
      },
      {
        name: "Thêm mới banner",
        icon: AddBox,
        url: `/banners/create`,
      },
      {
        url: `/banners/edit/:id`,
      },
    ],
  },
  {
    name: "User",
    icon: PeopleAlt,
    url: `/users`,
    navigationData: [
      {
        name: "Tất cả người dùng",
        icon: Category,
        url: `/users/all`,
      },
      {
        name: "Thêm mới",
        icon: AddBox,
        url: `/users/create`,
      },
    ],
  },
];
