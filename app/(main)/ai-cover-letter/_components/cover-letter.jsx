'use client'

import { getAllCoverLetters } from '@/actions/cover-letter'
import React, { useState, useEffect } from 'react'
import CoverLetterCard from './cover-letter-card'

const CoverLetterTray = ({coverLetters, setCoverLetters}) => {
    return (
    <>
    {
        coverLetters.length > 0 ? 
        <div className='flex flex-col gap-4 w-[90%] xl:w-[80%] mx-auto'>
        {
            coverLetters?.map((letter, index) => (
                <div key={index}>
                    <CoverLetterCard 
                        index={index}
                        letter={letter}
                        setCoverLetters={setCoverLetters}
                    />
                </div>
            ))
        }
        </div> : ''
    }
    </>
    )
}

export default CoverLetterTray
