
import React from 'react'
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Quiz from '../_components/quiz';

const MockInterviewPage = () => {
    return (
    <div>
        <div className='font-exo'>
            <Link href={'/interview'}>
                <div className='max-w-[250px] flex flex-wrap gap-2 px-4 py-1.5 ml-6 items-center bg-black rounded-lg text-sm'>
                    <ArrowLeft className='h-4 w-4'/>
                    Back to interview Preparation
                </div>
            </Link>

            <div className='text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-b from-[#ababab] via-white to-[#ababab] text-transparent bg-clip-text font-exo pt-1 pb-3 px-6 md:px-8 lg:px-10 mt-10'>Mock Interview</div>

            <div className='text-sm text-[#777777] px-6 md:px-8 lg:px-10'>Test your knowledge with industry-specific questions</div>
        </div>

        <Quiz />
    </div>
    )
}

export default MockInterviewPage
