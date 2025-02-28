"use client"
import React from 'react'

const Loader = () => {
    return (
    <div className='w-[100%] h-[100%] flex items-center justify-center '>
        <div className='w-[60px] h-[60px] rounded-full bg-gradient-to-br from-[#2b00ff] to-[#aa00ff] flex items-end justify-end animate-spin
                shadow-[0_0_20px_#2b00ff]  '>
            <div className='w-[58px] h-[58px] rounded-full bg-[#050505]'>

            </div>
        </div>
    </div>
    )
}

export default Loader
