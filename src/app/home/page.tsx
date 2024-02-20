"use client";
import "./page.css";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { FaShoppingCart } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import Sidebar from "../components/Sidebar/Sidebar";
import LoadingPage from "../components/LoadingPage/Loadingpage";
import ProductCard from "../components/ProductCard/ProductCard";
import { initialData, initialUserData } from "../Common/Constants";
import { UserData, Product, ProductsData } from "../Common/types";

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserData>(initialUserData);
  const [productsData, setProductsData] = useState<ProductsData>(initialData);
  const [userSearchInput, setUserSearchInput] = useState("");
  const [productsInCart, setProductsInCart] = useState<Product[]>([]);
  const [priceFilter, setPriceFilter] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const searchTerm = e.target.value;
    setUserSearchInput(searchTerm);
  }

  function addToCart(product: Product) {
    setProductsInCart([...productsInCart, product]);
  }
  const removeFromCart = (productId: number) => {
    setProductsInCart(
      productsInCart.filter((product) => product.id !== productId)
    );
  };

  function getCartTotal() {
    return productsInCart.reduce((total, product) => total + product?.price, 0);
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedPrice = e.target.value;
    setPriceFilter(selectedPrice);
  };

  const filterProducts = () => {
    let tempProducts: Product[] = productsData.products;
    if (userSearchInput) {
      tempProducts = productsData?.products.filter((product) => {
        return product.title
          .toLowerCase()
          .includes(userSearchInput.toLocaleLowerCase());
      });
    }

    if (priceFilter) {
      if (priceFilter === "over1000") {
        tempProducts = tempProducts.filter((product) => product.price > 1000);
      } else {
        const [min, max] = priceFilter.split("-");
        tempProducts = tempProducts.filter((product) => {
          return product.price > Number(min) && product.price < Number(max);
        });
      }
    }
    setFilteredProducts(tempProducts);
  };

  useEffect(() => {
    filterProducts();
  }, [userSearchInput, priceFilter]);

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
          if (res.message === "invalid token") {
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
      .then((data) => {
        setProductsData(data);
        setFilteredProducts(data?.products);
      });
  }, []);

  return (
    <>
      {isLoading ? (
        <LoadingPage />
      ) : (
        <div className="homepage-container">
          <div className="homepage">
            <Sidebar
              priceFilter={priceFilter}
              handleFilterChange={handleFilterChange}
            />
            <div className="homepage-right">
              <div className="homepage-navbar">
                <h1 className="navbar-heading">Products</h1>
                <div className="navbar-right">
                  <label className="navbar-label">
                    <IoSearchOutline />
                    <input
                      className="navbar-input"
                      onChange={handleChange}
                      type="search"
                      value={userSearchInput}
                    />
                  </label>
                  <p className="navbar-divider">|</p>
                  <div className="user-info">
                    <div className="cart">
                      <div className="cart-icon-1">
                        <FaShoppingCart />
                      </div>
                      |
                      <div className="cart-info">
                        <p className="cart-count">
                          {productsInCart.length} items
                        </p>
                        <p className="cart-total">Rs. {getCartTotal()}</p>
                      </div>
                    </div>

                    <p className="user-info">{userData?.firstName}</p>
                    <img
                      src={userData?.image}
                      className="user-image"
                      alt="Image of the user"
                    />
                  </div>
                </div>
              </div>
              <ProductCard
                filteredProducts={filteredProducts}
                productsInCart={productsInCart}
                removeFromCart={removeFromCart}
                addToCart={addToCart}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
