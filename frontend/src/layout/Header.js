import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import apiCart from '../api/apiCart';  // Import hàm getCart từ apiCart
import apiProduct from '../api/apiProduct';  // Import hàm getCart từ apiCart
import apiProductPromotion from '../api/apiProductPromotion'; // Import API để lấy khuyến mãi
import '../assets/css/Header.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Link } from 'react-router-dom';
import apiMenu from '../api/apiMenu';

function Header() {
    const { user, logout } = useUser();
    const [cartCount, setCartCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [allPromotions, setAllPromotions] = useState([]); // State để lưu khuyến mãi
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [menus, setMenus] = useState([]);

    useEffect(() => {
        if (user) {
            const fetchCart = async () => {
                try {
                    const cartData = await apiCart.getCart(user.id);
                    // Đếm số lượng sản phẩm dựa trên số lượng các productVariantId
                    const totalVariants = cartData.cartItems.length;
                    setCartCount(totalVariants);  // Cập nhật số lượng sản phẩm trong giỏ hàng
                } catch (error) {
                    console.error('Error fetching cart data:', error);
                }
            };
            fetchCart();
        }
    }, [user]);

    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const menuData = await apiMenu.getAllMenus();
                const activeMenus = menuData.filter(menu => menu.status === 1);
                setMenus(activeMenus);
            } catch (error) {
                console.error('Error fetching menu data:', error);
            }
        };
        fetchMenus();
    }, []);

    // Hàm tìm kiếm
    useEffect(() => {
        const fetchSearchResults = async () => {
            if (searchQuery) {
                try {
                    // Kiểm tra nếu allProducts chưa được tải
                    if (allProducts.length === 0) {
                        const productsData = await apiProduct.getAllProducts();
                        setAllProducts(productsData);
                    }

                    // Lấy tất cả khuyến mãi
                    if (allPromotions.length === 0) {
                        const promotionsData = await apiProductPromotion.getAllProductPromotions();
                        setAllPromotions(promotionsData);
                    }

                    const filteredResults = allProducts.filter((product) =>
                        product.name.toLowerCase().includes(searchQuery.toLowerCase())
                    );

                    // Thêm thông tin khuyến mãi vào sản phẩm
                    const resultsWithPromotions = filteredResults.map(product => {
                        const variant = product.productVariants[0]; // Giả sử biến thể đầu tiên là chính
                        const promotion = allPromotions.find(promotion =>
                            promotion.productVariantId === variant.id &&
                            promotion.priceSale > 0 &&
                            promotion.isActive
                        );
                        return { ...product, promotion };
                    });

                    setSearchResults(resultsWithPromotions);
                    setShowSearchResults(true); // Hiển thị kết quả tìm kiếm
                } catch (error) {
                    console.error('Lỗi khi tìm kiếm sản phẩm:', error);
                }
            } else {
                setSearchResults([]); // Xóa kết quả tìm kiếm khi không có truy vấn
                setShowSearchResults(false); // Ẩn kết quả tìm kiếm
            }
        };

        fetchSearchResults();
    }, [searchQuery, allProducts, allPromotions]);


    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setShowSearchResults(true); // Hiển thị kết quả tìm kiếm khi có truy vấn
    };

    const formatCurrency = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (event.target.closest('.search-form') === null) {
                setShowSearchResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="header-container">
            <nav className="navbar navbar-expand-lg main-nav">
                <div className="container-fluid main-nav-container">
                    <div className="collapse navbar-collapse justify-content-center" id="navbarNavDropdown">
                        <ul className="navbar-nav">
                            {menus.map(menu => (
                                <li key={menu.name} className="nav-item">
                                    <Link className="nav-link" to={menu.link}>{menu.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </nav>

            <nav className="navbar navbar-expand-lg secondary-nav">
                <div className="container-fluid">
                    <Link to="/" className="navbar-brand" href="#">
                        <img className="header-logo" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR97EalX9J7VxKi6io8BFRo15hNeQ460aQShw&s" alt="Logo" />
                    </Link>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <form className="search-form" role="search">
                            <input
                                className="form-control me-2"
                                type="search"
                                placeholder="Nhập từ khóa cần tìm"
                                aria-label="Search"
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                            {searchQuery && searchResults.length > 0 && (
                                <div className="search-results">
                                    <ul>
                                        <h5 className="product-note">Sản phẩm gợi ý</h5>
                                        {searchResults.map((product) => (
                                            <li key={product.id}>
                                                <Link
                                                    to={`/chi-tiet-san-pham/${product.slug}`}
                                                    onClick={() => {
                                                        setSearchQuery(''); // Xóa truy vấn tìm kiếm
                                                        setShowSearchResults(false); // Ẩn kết quả tìm kiếm
                                                    }}
                                                >
                                                    <div className="search-result-item">
                                                        {product.galleries.length > 0 ? (
                                                            <img
                                                                src={product.galleries[0].imageGallery}
                                                                alt={product.name}
                                                                style={{ width: '65px', height: '70px' }}
                                                            />
                                                        ) : (
                                                            <img
                                                                src="https://via.placeholder.com/50"
                                                                alt="Placeholder"
                                                                style={{ width: '65px', height: '70px' }}
                                                            />
                                                        )}
                                                        <div>
                                                            <div><h6>{product.name}</h6></div>
                                                            {product.promotion ? (
                                                               <span className="price-info">
                                                               <span className="promotion-price">{formatCurrency(product.promotion.priceSale)}</span>
                                                               <span className="separator">-</span>
                                                               <span className="product-pricetimkiem">{formatCurrency(product.productVariants[0]?.price)}</span>
                                                           </span>
                                                           
                                                            ) : (
                                                                <div className="product-only">
                                                                    {formatCurrency(product.productVariants[0]?.price)}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </Link>
                                            </li>
                                        ))}

                                    </ul>
                                </div>
                            )}
                        </form>
                        <ul className="navbar-nav navbar-nav-right">
                            {user ? (
                                <li className="nav-item">
                                    <div className="nav-link" onMouseEnter={() => document.querySelector('.logout-menu').style.display = 'block'} onMouseLeave={() => document.querySelector('.logout-menu').style.display = 'none'}>
                                        <span>Chào, {user.name}!</span>
                                        <div className="logout-menu">
                                            <div className="logout-item" onClick={logout}>Đăng xuất</div>
                                        </div>
                                    </div>
                                </li>
                            ) : (
                                <li className="nav-item">
                                    <Link className="nav-link" to={"/login"}>Đăng nhập / Đăng kí</Link>
                                </li>
                            )}
                            <li className="nav-item d-flex align-items-center">
                                <Link className="nav-link d-flex align-items-center" to={`/cart`}>
                                    <img src="https://cdn-icons-png.flaticon.com/128/3737/3737151.png" style={{ width: '30px', marginRight: '8px' }} alt="Giỏ hàng" />
                                    <div className="cart-info">
                                        <p className="cart-description">Giỏ hàng của bạn</p>
                                        <p className="cart-count"> ({cartCount}) sản phẩm</p>
                                    </div>
                                </Link>
                            </li>
                            <li className="">
                                <Link className="" to={`/profile`}>
                                    <img src="https://cdn-icons-png.flaticon.com/128/16842/16842358.png" style={{ width: '40px', float: 'right',marginTop: '15px'}} alt="Giỏ hàng" />
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Header;
