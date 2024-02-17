"use client";
import "./page.css";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { FaShoppingCart } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import { FaStar, FaFilter } from "react-icons/fa";

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [productsData, setProductsData] = useState({});
  useEffect(() => {
    const authToken = Cookies.get("Auth_token");
    if (authToken) {
      fetch("https://dummyjson.com/auth/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.username != "kminchelle" || res.message === "invalid token") {
            router.push("/");
          } else {
            setIsLoading(false);
            setUserData(res);
          }
        });
    } else {
      router.push("/");
    }
    fetch("https://dummyjson.com/products")
      .then((res) => res.json())
      .then((data) => setProductsData(data));
  }, []);
  console.log(productsData);
  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="homepage-container">
          <div className="homepage">
            <div className="sidebar">
              <div className="sidebar-top">
                <FaFilter />
                <h1 className="sidebar-heading">Filter</h1>
              </div>

              <p className="price-range-text">Price range</p>
              <div className="filter-range">
                <label className="filter-label">
                  <input type="radio" name="price" className="filter-input" />
                  Rs. 100 - Rs. 200
                </label>
                <label className="filter-label">
                  <input type="radio" name="price" className="filter-input" />
                  Rs. 201 - Rs. 300
                </label>
                <label className="filter-label">
                  <input type="radio" name="price" className="filter-input" />
                  Rs. 301 - Rs. 400
                </label>
                <label className="filter-label">
                  <input type="radio" name="price" className="filter-input" />
                  Rs. 401 - Rs. 500
                </label>
              </div>
            </div>
            <div className="homepage-right">
              <div className="homepage-navbar">
                <h1 className="navbar-heading">Products</h1>
                <div className="navbar-right">
                  <label className="navbar-label">
                    <IoSearchOutline />
                    <input className="navbar-input" />
                  </label>
                  <p>|</p>
                  <div className="user-info">
                    <FaShoppingCart />
                    <p className="user-info">{userData?.firstName}</p>
                    <img src={userData?.image} className="user-image" />
                  </div>
                </div>
              </div>
              <div className="product-list-container">
                <div className="product-list">
                  {productsData?.products.map(
                    ({
                      id,
                      title,
                      price,
                      images,
                      discountPercentage,
                      brand,
                      rating,
                    }) => (
                      <a className="products">
                        <img src={images[0]} className="products-image" />
                        <div className="products-description">
                          <p className="products-title">{title}</p>
                          <div className="products-description-bottom">
                            <p>{discountPercentage}% off</p>
                            <div className="products-rating">
                              <FaStar className="star-icon" />
                              <p>{rating}</p>
                            </div>

                            <p>
                              Rs. <b>{price}</b>
                            </p>
                          </div>
                        </div>
                      </a>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
