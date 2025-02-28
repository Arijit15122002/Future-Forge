'use client'

import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Loader2, Trash, Trash2, View } from 'lucide-react'
import { toast } from 'sonner'
import { deleteCoverLetter as deleteCoverLetterAPI } from '@/actions/cover-letter'
import jsPDF from 'jspdf'
import { motion } from 'framer-motion'

const CoverLetterCard = ({index, letter, setCoverLetters}) => {

    const [deletedCoverLetter, setDeletedCoverLetter] = useState(false);
    const [letterViewModalOpen, setLetterViewModalOpen] = useState(false);
    const [deletionConfirmationModalOpen, setDeletionConfirmationModalOpen] = useState(false)
    const [currentLetterId, setCurrentLetterId] = useState(null);
    const [deletionLoading, setDeletionLoading] = useState(false);

    const deleteCoverLetter = async (id) => {

        setDeletionLoading(true);
        try {
            const response = await deleteCoverLetterAPI(id)
            if( response?.success ) {
                toast.success('Cover Letter Deleted Successfully');
                setDeletedCoverLetter(true);
                setCoverLetters(prevCoverLetters => prevCoverLetters.filter(coverLetter => coverLetter.id !== id));
                setCurrentLetterId(null)
                setDeletionConfirmationModalOpen(false)
                setDeletionLoading(false);
            }
        } catch (error) {
            console.log('Error: ', error.message)
            throw new Error(error.message)
        }
    }

    const downloadCoverLetter = () => {
        const content = letter.content; 
        if (!content) return;
    
        const text = content.trim(); // Extract plain text while preserving line breaks
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
    
        const marginLeft = 10;
        const marginTop = 20;
        const maxWidth = 180; // Ensure proper text wrapping
        const lineHeight = 8; // Line spacing
        let yPosition = marginTop; // Y-position starts at marginTop
    
        pdf.setFont("times", "normal");
        pdf.setFontSize(12);
    
        // Split text into paragraphs based on double line breaks
        const paragraphs = text.split(/\n\s*\n/); // Split at blank lines to preserve paragraph breaks
    
        paragraphs.forEach((paragraph, index) => {
            const lines = pdf.splitTextToSize(paragraph, maxWidth); // Auto-wrap text
            lines.forEach((line) => {
                pdf.text(line, marginLeft, yPosition);
                yPosition += lineHeight; // Move cursor down for the next line
            });
    
            yPosition += lineHeight; // Add extra space between paragraphs
        });
    
        pdf.save('Cover_Letter.pdf');
    }

    return (
    <>
        <Card
            className={`${deletedCoverLetter ? 'w-0 h-0 translate-x-[-100%] blur-xl opacity-0 duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]' : 'w-full h-auto scale-100 translate-x-0 blur-none opacity-100'} font-exo`}
        >
            <CardHeader>
                <div className='flex flex-row items-center justify-start gap-2'>
                    <CardTitle>{letter.companyName}</CardTitle>
                    <div 
                        className='p-1 rounded-md hover:bg-muted-foreground/20 active:scale-95 active:bg-muted-foreground/40 cursor-pointer duration-200 ease-in-out'
                        onClick={() => {
                            setLetterViewModalOpen(true);
                        }}
                    >
                        <img src='/cover-letter/redirect.png' alt="" className='w-3 h-3'/>
                    </div>
                </div>
                <CardDescription>as {letter.jobTitle}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className='text-[0.8rem] md:text-[0.9rem] text-muted-foreground px-4'>
                    {letter.content.split(',')[1].trim().substring(0, 500)}...
                </p>
            </CardContent>
            <CardFooter
                className='w-full flex flex-row gap-4 items-center justify-end'
            >
                <div
                    onClick={() => {
                        downloadCoverLetter()
                    }}
                    className='p-3 bg-gradient-to-br hover:bg-gradient-to-tl from-[#2b00ff] to-[#c619cf] text-white rounded-xl cursor-pointer duration-200 ease-in-out'
                >
                    <Download className='w-4 h-4'/>
                </div>
                <div
                    onClick={() => {
                        setCurrentLetterId(letter.id)
                        setDeletionConfirmationModalOpen(true)
                    }}
                    className='bg-white hover:bg-gradient-to-b hover:from-red-500 p-3 hover:to-red-700 text-black hover:text-white rounded-xl duration-200 ease-in-out cursor-pointer'
                >
                    <Trash2 className='w-4 h-4' />
                </div>
            </CardFooter>
        </Card>


        {/* Letter View Modal */}
        <div className={`w-full fixed top-0 left-0 flex flex-col items-center justify-center duration-300 backdrop-blur-lg ease-[cubic-bezier(0.25,1,0.5,1)] ${letterViewModalOpen ? 'h-full z-40 translate-y-0 opacity-100 bg-muted/20' : 'h-full z-40 translate-y-full opacity-0 pointer-events-none'}`}>
            <div className='w-[90%] xl:w-[80%] max-h-[95%] md:min-w-[500px] text-[0.8rem] md:text-[0.9rem] p-3 md:p-6 border-[#434343] border-[1px] bg-background text-white rounded-xl relative'>
                <div 
                    className='absolute h-8 w-8 bg-[#ffffff] shadow-md rounded-xl top-3 right-3 md:top-6 md:right-6 xl:top-10 xl:right-10 flex items-center justify-center cursor-pointer z-10'
                    onClick={(e) => {
                        e.stopPropagation();
                        setLetterViewModalOpen(false)
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18"/>
                        <path d="m6 6 12 12"/>
                    </svg>
                </div>
                <pre 
                    className='w-[90%] font-ptSerif ' 
                    style={{ whiteSpace: 'pre-wrap' }}
                >
                    {letter.content}
                </pre>
            </div>
        </div>

        {/* Deletion confirmation modal */}
        <div className={`w-full fixed top-0 left-0 flex flex-col items-center justify-center duration-300 backdrop-blur-lg ease-[cubic-bezier(0.25,1,0.5,1)] ${deletionConfirmationModalOpen ? 'h-full z-20 translate-x-0 opacity-100 bg-muted/20' : 'h-full z-40 translate-x-full opacity-0 pointer-events-none'}`}>
            <div className='w-[80%] h-[400px] rounded-3xl bg-background border-[1px] flex flex-col justify-center items-center'>
                <img src="/cover-letter-card/bin.png" alt="" className='w-56 h-56'/>
                <div className='text-center text-md'>sure you want to</div>
                <div className='text-center text-xl'>Delete Cover Letter!</div>

                <div className='flex flex-row items-center justify-center gap-6 my-8'>
                    <motion.div
                        className="px-6 py-1.5 rounded-2xl bg-white text-black cursor-pointer"
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                            setCurrentLetterId(null)
                            setDeletionConfirmationModalOpen(false)
                        }}
                    >
                        Cancel
                    </motion.div>
                    <motion.div
                        className="px-6 py-1.5 rounded-2xl bg-gradient-to-br from-[#2b00ff] to-[#f200ff] text-white cursor-pointer"
                        whileTap={{
                            scale: 0.85,
                            filter: "blur(4px)",  
                            opacity: 0,  
                            transition: { duration: 0.4 }
                        }}
                        onClick={() => {
                            deleteCoverLetter(currentLetterId)
                        }}
                    >
                    {
                        !deletionLoading ? 
                        <>Delete</> : 
                        <div className='flex flex-row gap-1 items-center'>
                            <Loader2 className='h-4 w-4 -mt-0.5 animate-spin' />
                            <span>Deleting...</span> 
                        </div>
                    }
                    </motion.div>
                </div>
            </div>
        </div>
    </>
    )
}

export default CoverLetterCard