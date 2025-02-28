import React from 'react'

const ShowPiece = () => {
    return (
    <div className='h-full w-full bg-gradient-to-tr from-[#5438ee] to-[#8810c4] relative overflow-hidden'>
        <img src="/showcase/hexagon.png" alt="" className='h-[150px] w-[150px] left-0 absolute z-50'/>
        <div className='z-10 h-[250px] w-[250px] rounded-full absolute bg-gradient-to-br from-[#4786f5] to-[#8810c4] top-[-50px] right-[-50px] blur-xl'/>
        <div className='z-10 h-[250px] w-[250px] rounded-full absolute bg-gradient-to-br from-[#4786f5] to-[#c778ee] top-[60px] -left-[60px] blur-xl'/>

        <div className='absolute z-50 font-comfortaa text-5xl pt-20 px-4 font-bold '>
            Accuracy
        </div>
        <div className='absolute z-20 bottom-[-80px] right-[60px] h-[200px] w-[200px] rounded-full bg-gradient-to-b from-[#5438ee] to-[#8810c4]'>
            <div className='z-50 font-kanit text-9xl font-semibold'>
                95%
            </div>
        </div>
    </div>
    )
}

export default ShowPiece
