import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {
    const [method, setMethod] = useState('cod');
    const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: ''
    })
    const [errors, setErrors] = useState({})

    const validateTripuraPincode = (pincode) => {
        // Tripura pincodes start with 79 and are 6 digits
        return /^79\d{4}$/.test(pincode);
    }

    const validateForm = () => {
        const newErrors = {}
        
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
        if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Valid email is required'
        if (!formData.street.trim()) newErrors.street = 'Street address is required'
        if (!formData.city.trim()) newErrors.city = 'City is required'
        if (!formData.zipcode) newErrors.zipcode = 'Pincode is required'
        else if (!validateTripuraPincode(formData.zipcode)) newErrors.zipcode = 'Enter a valid Tripura pincode (starts with 79)'
        if (!formData.country.trim()) newErrors.country = 'Country is required'
        if (!formData.phone) newErrors.phone = 'Phone number is required'
        else if (formData.phone.length < 10) newErrors.phone = 'Valid phone number is required'
        
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const onChangeHandler = (event) => {
        const { name, value } = event.target
        
        // Special handling for zipcode and phone
        if (name === 'zipcode') {
            // Limit to 6 digits and only numbers
            if (value.length <= 6 && /^\d*$/.test(value)) {
                setFormData(data => ({ ...data, [name]: value }))
            }
            return
        }
        
        if (name === 'phone') {
            // Limit to 10 digits and only numbers
            if (value.length <= 10 && /^\d*$/.test(value)) {
                setFormData(data => ({ ...data, [name]: value }))
            }
            return
        }
        
        setFormData(data => ({ ...data, [name]: value }))
    }

    const initPay = (order) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: 'Order Payment',
            description: 'Order Payment',
            order_id: order.id,
            receipt: order.receipt,
            handler: async (response) => {
                try {
                    const { data } = await axios.post(
                        `${backendUrl}/api/order/verifyRazorpay`,
                        response,
                        { headers: { token } }
                    )
                    if (data.success) {
                        navigate('/orders')
                        setCartItems({})
                    }
                } catch (error) {
                    console.error(error)
                    toast.error(error.response?.data?.message || 'Payment verification failed')
                }
            },
            theme: {
                color: '#3399cc'
            }
        }
        const rzp = new window.Razorpay(options)
        rzp.open()
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault()
        
        if (!validateForm()) {
            toast.error('Please fix the form errors')
            return
        }

        try {
            let orderItems = []

            // Prepare order items from cart
            for (const productId in cartItems) {
                for (const size in cartItems[productId]) {
                    if (cartItems[productId][size] > 0) {
                        const productInfo = products.find(p => p._id === productId)
                        if (productInfo) {
                            orderItems.push({
                                ...productInfo,
                                size,
                                quantity: cartItems[productId][size]
                            })
                        }
                    }
                }
            }

            const orderData = {
                address: formData,
                items: orderItems,
                amount: getCartAmount() + delivery_fee,
                paymentMethod: method
            }

            switch (method) {
                case 'cod':
                    const { data } = await axios.post(
                        `${backendUrl}/api/order/place`,
                        orderData,
                        { headers: { token } }
                    )
                    if (data.success) {
                        setCartItems({})
                        navigate('/orders', { state: { orderSuccess: true } })
                    } else {
                        toast.error(data.message)
                    }
                    break

                case 'stripe':
                    const stripeResponse = await axios.post(
                        `${backendUrl}/api/order/stripe`,
                        orderData,
                        { headers: { token } }
                    )
                    if (stripeResponse.data.success) {
                        window.location.href = stripeResponse.data.session_url
                    } else {
                        toast.error(stripeResponse.data.message)
                    }
                    break

                case 'razorpay':
                    const razorpayResponse = await axios.post(
                        `${backendUrl}/api/order/razorpay`,
                        orderData,
                        { headers: { token } }
                    )
                    if (razorpayResponse.data.success) {
                        initPay(razorpayResponse.data.order)
                    } else {
                        toast.error(razorpayResponse.data.message)
                    }
                    break

                default:
                    toast.error('Please select a payment method')
                    break
            }
        } catch (error) {
            console.error(error)
            toast.error(error.response?.data?.message || 'Order placement failed')
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
            {/* Left Side - Delivery Information */}
            <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
                <div className='text-xl sm:text-2xl my-3'>
                    <Title text1={'DELIVERY'} text2={'INFORMATION'} />
                </div>

                <div className='flex gap-3'>
                    <div className='w-full'>
                        <input 
                            required 
                            onChange={onChangeHandler} 
                            name='firstName' 
                            value={formData.firstName} 
                            className={`border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded py-1.5 px-3.5 w-full`} 
                            type="text" 
                            placeholder='First name' 
                        />
                        {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                    </div>
                    <div className='w-full'>
                        <input 
                            required 
                            onChange={onChangeHandler} 
                            name='lastName' 
                            value={formData.lastName} 
                            className={`border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded py-1.5 px-3.5 w-full`} 
                            type="text" 
                            placeholder='Last name' 
                        />
                        {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                    </div>
                </div>

                <div>
                    <input 
                        required 
                        onChange={onChangeHandler} 
                        name='email' 
                        value={formData.email} 
                        className={`border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded py-1.5 px-3.5 w-full`} 
                        type="email" 
                        placeholder='Email address' 
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                    <input 
                        required 
                        onChange={onChangeHandler} 
                        name='street' 
                        value={formData.street} 
                        className={`border ${errors.street ? 'border-red-500' : 'border-gray-300'} rounded py-1.5 px-3.5 w-full`} 
                        type="text" 
                        placeholder='Street' 
                    />
                    {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}
                </div>

                <div className='flex gap-3'>
                    <div className='w-full'>
                        <input 
                            required 
                            onChange={onChangeHandler} 
                            name='city' 
                            value={formData.city} 
                            className={`border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded py-1.5 px-3.5 w-full`} 
                            type="text" 
                            placeholder='City' 
                        />
                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                    </div>
                    <div className='w-full'>
                        <input 
                            onChange={onChangeHandler} 
                            name='state' 
                            value={formData.state} 
                            className='border border-gray-300 rounded py-1.5 px-3.5 w-full' 
                            type="text" 
                            placeholder='State' 
                        />
                    </div>
                </div>

                <div className='flex gap-3'>
                    <div className='w-full'>
                        <input 
                            required 
                            onChange={onChangeHandler} 
                            name='zipcode' 
                            value={formData.zipcode} 
                            className={`border ${errors.zipcode ? 'border-red-500' : 'border-gray-300'} rounded py-1.5 px-3.5 w-full`} 
                            type="text" 
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder='Pincode' 
                            maxLength={6}
                        />
                        {errors.zipcode && <p className="text-red-500 text-xs mt-1">{errors.zipcode}</p>}
                    </div>
                    <div className='w-full'>
                        <input 
                            required 
                            onChange={onChangeHandler} 
                            name='country' 
                            value={formData.country} 
                            className={`border ${errors.country ? 'border-red-500' : 'border-gray-300'} rounded py-1.5 px-3.5 w-full`} 
                            type="text" 
                            placeholder='Country' 
                        />
                        {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                    </div>
                </div>

                <div>
                    <input 
                        required 
                        onChange={onChangeHandler} 
                        name='phone' 
                        value={formData.phone} 
                        className={`border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded py-1.5 px-3.5 w-full`} 
                        type="text" 
                        inputMode="tel"
                        pattern="[0-9]*"
                        placeholder='Phone number' 
                        maxLength={10}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
            </div>

            {/* Right Side - Payment Information */}
            <div className='mt-8'>
                <div className='mt-8 min-w-80'>
                    <CartTotal />
                </div>

                <div className='mt-12'>
                    <Title text1={'PAYMENT'} text2={'METHOD'} />
                    
                    <div className='flex gap-3 flex-col lg:flex-row'>
                        <div 
                            onClick={() => setMethod('stripe')} 
                            className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${method === 'stripe' ? 'border-green-400' : ''}`}
                        >
                            <div className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`}></div>
                            <img className='h-5 mx-4' src={assets.stripe_logo} alt="Stripe" />
                        </div>
                        <div 
                            onClick={() => setMethod('razorpay')} 
                            className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${method === 'razorpay' ? 'border-green-400' : ''}`}
                        >
                            <div className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-400' : ''}`}></div>
                            <img className='h-5 mx-4' src={assets.razorpay_logo} alt="Razorpay" />
                        </div>
                        <div 
                            onClick={() => setMethod('cod')} 
                            className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${method === 'cod' ? 'border-green-400' : ''}`}
                        >
                            <div className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></div>
                            <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
                        </div>
                    </div>

                    <div className='w-full text-end mt-8'>
                        <button 
                            type='submit' 
                            className='bg-black text-white px-16 py-3 text-sm hover:bg-gray-800 transition-colors'
                        >
                            PLACE ORDER
                        </button>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default PlaceOrder
