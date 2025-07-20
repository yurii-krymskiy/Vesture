import { useEffect, useState, type ReactNode } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { ShopContext, type ProductType } from "./ShopContext";

const ShopContextProvider = (props: { children: ReactNode }) => {
  const currency = '$';
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  type CartItemsType = {
    [itemId: number]: {
      [size: string]: number;
    };
  };

  const [cartItems, setCartItems] = useState<CartItemsType>({});


  const [products, setProducts] = useState<ProductType[]>([]);
  const [token, setToken] = useState('')
  const navigate = useNavigate();


  const addToCart = async (itemId: number, size: number) => {
    if (!size) {
      toast.error('Select Product Size');
      return;
    }

    const cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      }
      else {
        cartData[itemId][size] = 1;
      }
    }
    else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }
    setCartItems(cartData);

    if (token) {
      try {

        await axios.post(backendUrl + '/api/cart/add', { itemId, size }, { headers: { token } })

      } catch (error: unknown) {
        console.log(error)
        toast.error((error && typeof error === 'object' && 'message' in error) ? (error as { message: string }).message : 'An error occurred')
      }
    }
  }

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {
          console.log(error);

        }
      }
    }
    return totalCount;
  }

  const updateQuantity = async (itemId: number, size: number, quantity: number) => {

    const cartData = structuredClone(cartItems);

    cartData[itemId][size] = quantity;

    setCartItems(cartData)

    if (token) {
      try {

        await axios.post(backendUrl + '/api/cart/update', { itemId, size, quantity }, { headers: { token } })

      } catch (error: unknown) {
        console.log(error)
        toast.error((error && typeof error === 'object' && 'message' in error) ? (error as { message: string }).message : 'An error occurred')
      }
    }

  }

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      const itemInfo = products.find((product) => product._id === items);
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0 && itemInfo) {
            totalAmount += itemInfo.price * cartItems[items][item];
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    return totalAmount;
  }

  const getProductsData = async () => {
    try {

      const response = await axios.get(backendUrl + '/api/product/list')
      if (response.data.success) {
        setProducts(response.data.products.reverse())
      } else {
        toast.error(response.data.message)
      }

    } catch (error: unknown) {
      console.log(error)
      toast.error((error && typeof error === 'object' && 'message' in error) ? (error as { message: string }).message : 'An error occurred')
    }
  }

  const getUserCart = async (token: string) => {
    try {

      const response = await axios.post(backendUrl + '/api/cart/get', {}, { headers: { token } })
      if (response.data.success) {
        setCartItems(response.data.cartData)
      }
    } catch (error: unknown) {
      console.log(error)
      toast.error((error && typeof error === 'object' && 'message' in error) ? (error as { message: string }).message : 'An error occurred')
    }
  }

  useEffect(() => {
    getProductsData()
  }, [])

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!token && storedToken) {
      setToken(storedToken || '');
      getUserCart(storedToken);
    }
    if (token) {
      getUserCart(token)
    }
  }, [token])

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    setCartItems,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    setToken,
    token
  }

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  )
}

export default ShopContextProvider;