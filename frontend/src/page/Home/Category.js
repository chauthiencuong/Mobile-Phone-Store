import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../../assets/css/Category.css';
import apiCategory from '../../api/apiCategory';

function Category() {
    const [categories, setCategories] = useState([]);
    const [expandedCategoryId, setExpandedCategoryId] = useState(null);
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await apiCategory.getAllCategories();
                setCategories(data);
                console.log(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const parentCategories = categories.filter(category => category.status === 1 && category.parent_id === 0);

    const handleProductClick = (slug) => {
        navigate(`/${slug}`); 
    };

    const handleMouseEnter = (categoryId) => {
        setExpandedCategoryId(categoryId);
    };

    const handleMouseLeave = () => {
        setExpandedCategoryId(null);
    };

    const hasChildren = (parentId) => {
        return categories.some(category => category.status === 1 && category.parent_id === parentId);
    };

    return (
        <div className="menu-container1">
            <ul className="list-group list-group-flush">
                {parentCategories.length > 0 ? (
                    parentCategories.map(parentCategory => (
                        <li 
                            key={parentCategory.id} 
                            className="list-group-item d-flex align-items-center position-relative"
                            onMouseEnter={() => handleMouseEnter(parentCategory.id)}
                            onMouseLeave={handleMouseLeave}
                        >
                            <a 
                                href="#" 
                                className="d-flex align-items-center"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleProductClick(parentCategory.slug);
                                }}
                            >
                                <img 
                                    src={parentCategory.imageCategory} 
                                    alt={parentCategory.name} 
                                    style={{ width: '35px', height: '35px' }}
                                />
                                <span style={{ marginLeft: '20px' }}>{parentCategory.name}</span>
                            </a>
                            {expandedCategoryId === parentCategory.id && hasChildren(parentCategory.id) && (
                                <ul className="list-group list-group-flush submenu">
                                    {categories
                                        .filter(childCategory => childCategory.status === 1 && childCategory.parent_id === parentCategory.id)
                                        .map(childCategory => (
                                            <li 
                                                key={childCategory.id} 
                                                className="list-group-item d-flex align-items-center"
                                                onClick={() => handleProductClick(childCategory.slug)}
                                            >
                                                <span style={{ marginLeft: '20px' }}>{childCategory.name}</span>
                                            </li>
                                        ))}
                                </ul>
                            )}
                        </li>
                    ))
                ) : (
                    <li className="list-group-item">No categories available</li>
                )}
            </ul>
        </div>
    );
}

export default Category;
