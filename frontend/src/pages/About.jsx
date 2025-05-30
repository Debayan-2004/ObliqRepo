import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  return (
    <div>

      <div className='text-2xl text-center pt-8 border-t'>
          <Title text1={'ABOUT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
          <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
          <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
              <p>Obliq was born from a love for nature and the artistry of the human hand. Nestled amidst the lush landscapes of Tripura, we celebrate the heritage of traditional craftsmanship and eco-friendly living.</p>
              <p>Our carefully curated collection includes exquisite bamboo crafts and furniture, as well as timeless pottery pieces, each telling a story of earth, skill, and culture. Every item is handcrafted by artisans who infuse their work with love, precision, and respect for natural materials.</p>
              <b className='text-gray-800'>Our Aim</b>
              <p>At Obliq, we aim to bring you closer to nature with creations that merge elegance with sustainability. We believe in honoring artisanal skills, uplifting local communities, and offering products that don’t just adorn your spaces, but also contribute to a better world.</p>
          </div>
      </div>

      <div className=' text-xl py-4'>
          <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Authenticity & Sustainability:</b>
            <p className=' text-gray-600'>Every product is crafted from natural, renewable materials, ensuring minimal environmental impact while celebrating traditional art forms.</p>
          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Crafted by Skilled Hands:</b>
            <p className=' text-gray-600'>Our artisans pour generations of knowledge and skill into every piece, ensuring uniqueness and unmatched quality.</p>
          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Meaningful Connections:</b>
            <p className=' text-gray-600'>When you choose Obliq, you embrace a story of sustainability, culture, and craftsmanship — creating a space that resonates with purpose and beauty.</p>
          </div>
      </div>

      <NewsletterBox/>
      
    </div>
  )
}

export default About

