import Link from 'next/link'
import React from 'react'

const NotFound = () => {
    return (
        <div className='flex flex-col gap-3 items-center justify-center min-h-screen px-4 text-center'>
            <h1 className='text-6xl font-bold bg-gradient-to-b from-[#ababab] via-white to-[#ababab] text-transparent bg-clip-text font-exo'>404</h1>
            <div className='mt-6 text-xl font-semibold'>Page not Found</div>
            <p className='text-[0.8rem] text-[#777777] text-center'>Ooops! The page you  are looking for doesn't exist or has been removed...</p>
            <Link href='/'>
                <div className='mt-2 px-6 py-2 text-[0.9rem] bg-[#232323] border-[1px] border-[#434343] rounded-xl hover:bg-white hover:text-black duration-200 ease-in-out'>Return Home</div>
            </Link>  
        </div>
        )
    }

export default NotFound
