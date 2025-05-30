import React, { useState } from 'react'

const NewsletterBox = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const onSubmitHandler = (event) => {
    event.preventDefault();


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setMessage('Please enter a valid email address.');
      return;
    }


    setMessage('Thank you for subscribing! You will receive 20% off soon.');
    setEmail('');
  }

  return (
    <div className='text-center'>
      <p className='text-2xl font-medium text-gray-800'>Subscribe now & get 20% off</p>
      <p className='text-gray-400 mt-3'>
        Join our community to get exclusive offers and updates on our eco-friendly crafts.
      </p>
      <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3'>
        <input 
          className='w-full sm:flex-1 outline-none py-2 px-3' 
          type="email" 
          placeholder='Enter your email' 
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button 
          type='submit' 
          className='bg-black text-white text-xs px-10 py-4 hover:bg-gray-800 transition'
        >
          SUBSCRIBE
        </button>
      </form>
      {message && <p className='text-sm text-green-600 mt-2'>{message}</p>}
    </div>
  )
}

export default NewsletterBox

