import React, { useContext } from 'react'
import { ShopContext, type ProductType } from '../context/ShopContext'
import { Link } from 'react-router-dom'

const ProductItem = ({ product }: { product: ProductType }) => {
  const { currency } = useContext(ShopContext);
  return (
    <Link
      onClick={() => scrollTo(0, 0)}
      className='text-gray-700 cursor-pointer'
      to={`/product/${product._id}`}
    >
      <div className='overflow-hidden'>
        <img className='hover:scale-110 transition' src={product.image[0]} alt="" />
      </div>
      <p className='pt-3 pb-1 text-sm'>{product.name}</p>
      <p className='text-sm font-medium'>{currency}{product.price}</p>
    </Link>
  );
};


export default ProductItem
