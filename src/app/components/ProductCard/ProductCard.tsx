import "./ProductCard.css"
import { FaStar } from "react-icons/fa";
import { FaSquareMinus } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import { Product } from "../../Common/types";

interface Props {
  filteredProducts: Product[];
  productsInCart: Product[];
  removeFromCart: (productId: number) => void;
  addToCart: (product: Product) => void;
}

export default function ProductCard({
  filteredProducts,
  productsInCart,
  removeFromCart,
  addToCart,
}: Props) {
  return (
    <div className="product-list-container">
      {filteredProducts.length == 0 ? (
        <p className="product-list">No product found ☹️</p>
      ) : (
        <div className="product-list">
          {filteredProducts?.map((product) => (
            <a className="products" key={product.id}>
              <img
                src={product.images[0]}
                className="products-image"
                alt="Image of the Product"
              />
              <div className="products-description">
                <div className="products-description-top">
                  <p className="products-title">{product.title}</p>
                  {productsInCart.find((item) => item.id === product.id) ? (
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="add-toCart-button"
                    >
                      <FaSquareMinus />
                    </button>
                  ) : (
                    <button
                      onClick={() => addToCart(product)}
                      className="add-toCart-button"
                    >
                      <FaShoppingCart />
                    </button>
                  )}
                </div>

                <div className="products-description-bottom">
                  <p>{product.discountPercentage}% off</p>
                  <div className="products-rating">
                    <FaStar className="star-icon" />
                    <p>{product.rating}</p>
                  </div>

                  <p>
                    Rs. <b>{product.price}</b>
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
