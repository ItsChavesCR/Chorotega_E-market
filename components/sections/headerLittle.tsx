import React from 'react'
import Image from 'next/image'
import { Store } from 'lucide-react'
import Link from 'next/link'

export const HeaderLittle = () => {
  return (
    <>
      <header className='bg-[#e2e2e297] w-full h-32 flex items-center justify-between shadow-md'>
        <Link href="/auth/login" className=''> 
        <Image
          src="/Chorotega.svg"
          alt="Chorotega eMarket Logo"
          width={48}
          height={48}
          className="h-32 w-28 ml-12"
          />
          </Link>
        
      </header>
    </>
  )
}