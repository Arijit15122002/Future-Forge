import React, { Suspense } from 'react'
import Loader from '@/components/loader/loader';

const Layout = ({children}) => {
    return (
    <div className='mt-6'>

        <Suspense 
            fallback={
                <div className="h-[calc(100vh-90px)] w-[100vw] bg-[#050505]">
                    <Loader />
                </div>
            }
        >
            <div className='text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-b from-[#ababab] via-white to-[#ababab] text-transparent bg-clip-text font-exo pt-1 pb-3 px-6 md:px-8 lg:px-10'>Industry Insights</div>
            {children}
        </Suspense>
    </div>
    )
}

export default Layout
