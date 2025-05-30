import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const Contact = () => {
  return (
    <div>
      
      <div className='text-center text-2xl pt-10 border-t'>
          <Title text1={'CONTACT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img className='w-full md:max-w-[480px]' src={assets.contact_img} alt="" />
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-xl text-gray-600'>Our Studio</p>
          <p className='text-gray-500'>33, Old Office Tilla<br />Sabroom, Tripura, India</p>
          <p className='text-gray-500'>Tel: 03812326455<br />Email: support@obliq.in</p>
          <p className='font-semibold text-xl text-gray-600'>Join the Obliq Family</p>
          <p className='text-gray-500'>Learn more about our artisans, our story, and how you can be part of our journey.</p>
          <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>Explore More</button>
        </div>
      </div>

      <NewsletterBox/>
    </div>
  )
}

export default Contact

