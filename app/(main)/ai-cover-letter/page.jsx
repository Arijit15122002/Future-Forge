'use client'

import React, { useState, useEffect } from 'react'
import CoverLetterTray from './_components/cover-letter'
import { Button } from '@/components/ui/button'
import CreateLetter from './_components/create-letter'
import { getAllCoverLetters } from '@/actions/cover-letter'

const AiCoverLetter = () => {
    const [letterFormModalOpen, setLetterFormModalOpen] = useState(false)
    const [isClosing, setIsClosing] = useState(false);
    const [coverLetters, setCoverLetters] = useState([])
    console.log(coverLetters)
    const [count, setCount] = useState(coverLetters?.length);
    const [lettersLoading, setLettersLoading] = useState(false);

    const closeModal = () => {
        setIsClosing(true);
        setTimeout(() => {
            setLetterFormModalOpen(false);
            setIsClosing(false);
        }, 500); // Matches transition duration
    };

    useEffect(() => {
        if (letterFormModalOpen) {
            document.body.style.overflow = 'hidden'; // Disable scrolling
        } else {
            document.body.style.overflow = 'auto'; // Enable scrolling
        }
        return () => {
            document.body.style.overflow = 'auto'; // Cleanup on unmount
        };
    }, [letterFormModalOpen]);

    const fetchCoverLetters = async () => {
        setLettersLoading(true);
        try {
            const response = await getAllCoverLetters()
            if( response?.success ) {
                setCoverLetters(response?.coverLetters);
                setCount(response?.coverLetters?.length);
                setLettersLoading(false);
            }
        } catch (error) {
            console.log('Error: ', error.message)
            throw new Error(error.message)
        }
    }

    useEffect(() => {
        fetchCoverLetters();
    }, [count])

    return (
        <>
            <div className='font-exo'>
                <div>
                    <div className='flex flex-row justify-between items-center'>
                        <div className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-b from-[#ababab] via-white to-[#ababab] text-transparent bg-clip-text font-exo pt-1 pb-3 px-6 md:px-8 lg:px-10">
                            Cover Letter
                        </div>
                        <Button
                            onClick={() => {
                                setLetterFormModalOpen(true);
                            }}
                            className='hidden md:block mx-6 md:mx-8 lg:mx-10'
                        >
                            Create Cover Letter
                        </Button>
                    </div>
                    <div className='text-muted-foreground text-sm px-6 md:px-8 lg:px-10'>Create your Cover Letter with AI</div>
                </div>
                
                <div className='w-full flex md:hidden flex-row items-center justify-end mt-6'>
                    <Button
                        onClick={() => {
                            setLetterFormModalOpen(true);
                        }}
                        className=' mx-6 md:mx-8 lg:mx-10'
                    >
                        Create Cover Letter
                    </Button>
                </div>

                <div className='mt-10'>
                {
                    lettersLoading ? 
                    <>
                        <div className='flex flex-col gap-4 w-[90%] xl:w-[80%] mx-auto'>
                            <div className='w-full h-[200px] rounded-3xl animate-pulse bg-muted'/>
                            <div className='w-full h-[200px] rounded-3xl animate-pulse bg-muted'/>
                            <div className='w-full h-[200px] rounded-3xl animate-pulse bg-muted'/>
                            <div className='w-full h-[200px] rounded-3xl animate-pulse bg-muted'/>
                            <div className='w-full h-[200px] rounded-3xl animate-pulse bg-muted'/>
                        </div>
                    </> : 
                    <>
                    {
                        coverLetters?.length > 0 ? 
                        <CoverLetterTray 
                            coverLetters={coverLetters}
                            setCoverLetters={setCoverLetters}
                        /> : 
                        <div>

                        </div>
                    }
                    </>
                }
                </div>
            </div>

            {/* Modal is always present in the DOM */}
            <div 
                className={`w-full fixed top-0 left-0 flex flex-col items-center justify-center duration-500 backdrop-blur-xl ease-[cubic-bezier(0.25,1,0.5,1)] ${
                    letterFormModalOpen && !isClosing
                        ? 'h-full z-40 translate-y-0 opacity-100 bg-muted/20'
                        : 'h-full z-40 translate-y-full opacity-0 pointer-events-none'
                }`}
            >
                {/* Close Button */}
                <div 
                    className='absolute h-8 w-8 bg-[#ffffff] shadow-md rounded-xl top-3 right-3 md:top-10 md:right-10 flex items-center justify-center cursor-pointer z-10'
                    onClick={(e) => {
                        e.stopPropagation();
                        closeModal();
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18"/>
                        <path d="m6 6 12 12"/>
                    </svg>
                </div>

                <CreateLetter 
                    setLetterFormModalOpen={setLetterFormModalOpen}
                    setCount={setCount}    
                />
            </div>
        </>
    )
}

export default AiCoverLetter
