"use client"
import React from 'react'

const Loader = () => {
    return (
    <div className='w-full h-full flex items-center justify-center bg-background'>
        <div className='w-[30px] h-[30px] rounded-full bg-gradient-to-br from-[#2b00ff] to-[#aa00ff] flex items-end justify-end animate-spin
                shadow-[0_0_20px_#2b00ff]  '>
            <div className='w-[28px] h-[28px] rounded-full bg-background'>

            </div>
        </div>
    </div>
    )
}

export default Loader
