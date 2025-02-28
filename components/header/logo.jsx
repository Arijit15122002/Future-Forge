import React from 'react'

export default function Logo() {
    return (
    <div className='relative flex flex-row h-full justify-center items-center gap-2'>
        <div className='font-pacifico text-2xl sm:text-3xl bg-gradient-to-b from-[#cdcdcd] via-white to-[#cdcdcd] pb-1 text-transparent bg-clip-text'>future</div>
        <div 
            className='flex flex-row font-comfortaa text-2xl sm:text-3xl bg-gradient-to-br from-[#4000ff] to-[#cc00ff] text-transparent bg-clip-text'
            style={{
                filter: "drop-shadow(0px 0px 5px rgba(64, 0, 255, 0.8))"
            }}    
        >
            <div className='mt-[5px] font-extrabold tracking-tighter'>Forge</div>
        </div>
        <div className='absolute top-2.5 -right-2 sm:top-2 sm:-right-2'>
            <img src="/logo/ai.png" alt="" className='w-[12px] h-[12px] sm:w-[15px] sm:h-[15px]'/>
        </div>
    </div>
    )
}
