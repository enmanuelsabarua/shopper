import { useEffect, useState } from 'react';
import './ListProduct.css';
import cross_icon from '../../assets/cross_icon.png';

const ListProduct = () => {

  const [allproducts, setAllProducts] = useState([]);

  const fetchInfo = async () => {
    await fetch('https://shopper-production.up.railway.app/allproducts')
      .then(res => res.json())
      .then(data => setAllProducts(data));
  }

  useEffect(() => {
    fetchInfo();
  }, []);

  const removeProduct = async id => {
    await fetch('https://shopper-production.up.railway.app/removeproduct', {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ id })
    });
    await fetchInfo();
  }

  return (
    <div className='list-product'>
      <h1>All Products List</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allproducts.map((product, index) => {
          return (
            <div key={index} >
              <div className='listproduct-format-main listproduct-format'>
                <img src={product.image} alt="Product" className='listproduct-product-icon' />
                <p>{product.name}</p>
                <p>${product.old_price}</p>
                <p>${product.new_price}</p>
                <p>{product.category}</p>
                <img onClick={() => removeProduct(product.id)} className='listproduct-remove-icon' src={cross_icon} alt="Remove icon" />
              </div>
              <hr />
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default ListProduct;