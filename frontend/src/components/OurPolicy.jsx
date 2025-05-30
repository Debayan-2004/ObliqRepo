import React from 'react'
import { assets } from '../assets/assets'

const OurPolicy = () => {
  return (
    <div className='flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700'>
      
      <div>
        <img src={assets.exchange_icon} className='w-12 m-auto mb-5' alt="Easy Exchange Policy Icon" />
        <p className=' font-semibold'>Seamless Exchange Policy</p>
        <p className=' text-gray-400'>Effortless exchanges to ensure your satisfaction with every handcrafted piece.</p>
      </div>
      <div>
        <img src={assets.quality_icon} className='w-12 m-auto mb-5' alt="7 Days Return Policy Icon" />
        <p className=' font-semibold'>7-Day Return Guarantee</p>
        <p className=' text-gray-400'>Return your product within 7 days if it doesn't meet your expectations.</p>
      </div>
      <div>
        <img src={assets.support_img} className='w-12 m-auto mb-5' alt="Customer Support Icon" />
        <p className=' font-semibold'>Dedicated Customer Support</p>
        <p className=' text-gray-400'>Our friendly team is available 24/7 to assist you with all your needs.</p>
      </div>

    </div>
  )
}

export default OurPolicy