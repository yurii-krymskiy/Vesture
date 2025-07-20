import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { currency } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

type OrderItem = {
  name: string;
  quantity: number;
  size: string;
}

type Address = {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  phone: string;
}

type Order = {
  _id: string;
  items: OrderItem[];
  address: Address;
  paymentMethod: string;
  payment: boolean;
  date: string;
  amount: number;
  status: string;
}

const Orders = ({ token }: { token: string | null }) => {
  const [orders, setOrders] = useState<Order[]>([])

  const fetchAllOrders = async () => {
    if (!token) return;

    try {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + '/api/order/list',
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        setOrders(response.data.orders.reverse())
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("An unexpected error occurred")
      }
    }
  }

  const statusHandler = async (
    event: React.ChangeEvent<HTMLSelectElement>,
    orderId: string
  ) => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + '/api/order/status',
        { orderId, status: event.target.value },
        { headers: { token } }
      );

      if (response.data.success) {
        await fetchAllOrders();
      }
    } catch (error) {
      console.log(error)
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("An unexpected error occurred")
      }
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, [token])

  return (
    <div>
      <h3>Order Page</h3>
      <div>
        {orders.map((order) => (
          <div
            key={order._id}
            className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700"
          >
            <img className="w-12" src={assets.parcel_icon} alt="" />
            <div>
              <div>
                {order.items.map((item, idx) => (
                  <p className="py-0.5" key={idx}>
                    {item.name} x {item.quantity} <span>{item.size}</span>
                    {idx !== order.items.length - 1 ? ',' : ''}
                  </p>
                ))}
              </div>
              <p className="mt-3 mb-2 font-medium">
                {order.address.firstName + " " + order.address.lastName}
              </p>
              <div>
                <p>{order.address.street + ","}</p>
                <p>
                  {order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}
                </p>
              </div>
              <p>{order.address.phone}</p>
            </div>
            <div>
              <p className="text-sm sm:text-[15px]">Items: {order.items.length}</p>
              <p className="mt-3">Method: {order.paymentMethod}</p>
              <p>Payment: {order.payment ? 'Done' : 'Pending'}</p>
              <p>Date: {new Date(order.date).toLocaleDateString()}</p>
            </div>
            <p className="text-sm sm:text-[15px]">
              {currency}
              {order.amount}
            </p>
            <select
              onChange={(event) => statusHandler(event, order._id)}
              value={order.status}
              className="p-2 font-semibold"
            >
              <option value="Order Placed">Order Placed</option>
              <option value="Packing">Packing</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders
