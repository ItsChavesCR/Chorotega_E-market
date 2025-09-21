import React from 'react'
import Image from 'next/image'
import { Store } from 'lucide-react'

export const Header = () => {
  return (
    <>
      <header className='bg-[#F5F0E5] w-full h-32 flex items-center justify-between shadow-md'>
        <Image
          src="/Chorotega.svg"
          alt="Chorotega eMarket Logo"
          width={48}
          height={48}
          className="h-32 w-28 ml-12"
        />
        <div className='flex justify-center mr-12 gap-2 bg-[#326931] text-white px-6 py-3 rounded-md hover:bg-[#255224] cursor-pointer'>
            <Store className='size-7' />
          <p className='text-lg font-semibold'>Únete</p>
        </div>
      </header>
    </>
  )
}