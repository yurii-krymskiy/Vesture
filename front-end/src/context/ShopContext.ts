import { createContext } from "react";

type CartItemsType = {
  [itemId: number]: {
    [size: string]: number;
  };
};

type ProductType = {
  _id: string;
  price: number;
};

export type ShopContextType = {
  products: ProductType[];
  currency: string;
  delivery_fee: number;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  showSearch: boolean;
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
  cartItems: CartItemsType;
  addToCart: (itemId: number, size: number) => void;
  setCartItems: React.Dispatch<React.SetStateAction<CartItemsType>>;
  getCartCount: () => number;
  updateQuantity: (itemId: number, size: number, quantity: number) => void;
  getCartAmount: () => number;
  navigate: (path: string) => void;
  backendUrl: string;
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
};

export const ShopContext = createContext<ShopContextType>({} as ShopContextType);
