import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>

        <div>
            <img src={assets.logo} className='mb-5 w-32' alt="Obliq Logo" />
            <p className='w-full md:w-2/3 text-gray-600'>
              Obliq celebrates the timeless beauty of nature through handcrafted bamboo crafts, elegant furniture, and authentic pottery from Tripura. We honor sustainable traditions while enriching your living spaces with unique, eco-friendly artistry.
            </p>
        </div>

        <div>
            <p className='text-xl font-medium mb-5'>COMPANY</p>
            <ul className='flex flex-col gap-1 text-gray-600 cursor-pointer'>
                <li>Home</li>
                <li>About Us</li>
                <li>Delivery</li>
                <li>Privacy Policy</li>
            </ul>
        </div>

        <div>
            <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <li>33, Old Office Tilla, Sabroom, Tripura</li>
                <li>Phone: 03812 326455</li>
                <li>Email: support@obliq.in</li>
            </ul>
        </div>

      </div>

      <div>
          <hr />
          <p className='py-5 text-sm text-center'>© 2025 Obliq. All Rights Reserved.</p>
      </div>

    </div>
  )
}

export default Footer

