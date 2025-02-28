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
            {children}
        </Suspense>
    </div>
    )
}

export default Layout
