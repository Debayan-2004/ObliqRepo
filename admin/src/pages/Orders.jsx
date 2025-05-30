import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([])
  const [showDelivered, setShowDelivered] = useState(false)

  const fetchAllOrders = async () => {
    if (!token) {
      return null;
    }

    try {
      const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } })
      if (response.data.success) {
        setOrders(response.data.orders.reverse())
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(backendUrl + '/api/order/status', 
        { orderId, status: event.target.value }, 
        { headers: { token } }
      )
      if (response.data.success) {
        await fetchAllOrders()
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || error.message)
    }
  }

  // Modified method to ask for confirmation before removing delivered orders
  const removeDeliveredOrders = () => {
    const deliveredCount = orders.filter(order => order.status === 'Delivered').length;
    
    if (deliveredCount === 0) {
      toast.info('No delivered orders to remove');
      return;
    }

    if (window.confirm(`Are you sure you want to remove ${deliveredCount} delivered order(s) from view?`)) {
      setOrders(orders.filter(order => order.status !== 'Delivered'))
      toast.success(`${deliveredCount} delivered order(s) removed from view`);
    } else {
      toast.info('Removal cancelled');
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, [token])

  const filteredOrders = showDelivered 
    ? orders 
    : orders.filter(order => order.status !== 'Delivered')

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3>Order Page</h3>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowDelivered(!showDelivered)}
            className="p-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            {showDelivered ? 'Hide Delivered' : 'Show Delivered'}
          </button>
          {showDelivered && (
            <button 
              onClick={removeDeliveredOrders}
              className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Remove Delivered
            </button>
          )}
        </div>
      </div>
      <div>
        {filteredOrders.map((order, index) => (
          <div className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700' key={index}>
            <img className='w-12' src={assets.parcel_icon} alt="" />
            <div>
              <div>
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return <p className='py-0.5' key={index}> {item.name} x {item.quantity} <span> {item.size} </span> </p>
                  }
                  else {
                    return <p className='py-0.5' key={index}> {item.name} x {item.quantity} <span> {item.size} </span> ,</p>
                  }
                })}
              </div>
              <p className='mt-3 mb-2 font-medium'>{order.address.firstName + " " + order.address.lastName}</p>
              <div>
                <p>{order.address.street + ","}</p>
                <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
              </div>
              <p>{order.address.phone}</p>
            </div>
            <div>
              <p className='text-sm sm:text-[15px]'>Items : {order.items.length}</p>
              <p className='mt-3'>Method : {order.paymentMethod}</p>
              <p>Payment : {order.payment ? 'Done' : 'Pending'}</p>
              <p>Date : {new Date(order.date).toLocaleDateString()}</p>
            </div>
            <p className='text-sm sm:text-[15px]'>{currency}{order.amount}</p>
            <select 
              onChange={(event) => statusHandler(event, order._id)} 
              value={order.status} 
              className='p-2 font-semibold'
            >
              <option value="Order Placed">Order Placed</option>
              <option value="Packing">Packing</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
        {filteredOrders.length === 0 && (
          <p className="text-center py-8 text-gray-500">No orders to display</p>
        )}
      </div>
    </div>
  )
}

export default Orders