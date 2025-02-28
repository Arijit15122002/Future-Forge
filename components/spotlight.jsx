"use client"

import React, { useEffect, useRef } from 'react'
import Link from 'next/link';
import { Button } from './ui/button';
import { features } from '@/data/features';
import { howItWorks } from '@/data/howItWorks';
import { testimonial } from '@/data/testimonial';
import { faqs } from '@/data/faqs';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './ui/accordion';
import { ArrowRight } from 'lucide-react';
import ShowPiece from './showpiece';

const SpotLight = () => {

    return (
    <>
    <section>
        <div className='h-screen flex flex-row items-center justify-center'>
            <div className=''>
                <div className='flex flex-col items-center justify-center'>
                    <div className='text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold flex flex-col gap-2 font-exo sm:px-4 md:px-8 lg:px-10 bg-gradient-to-b from-[#999999] via-[#dedede] to-[#999999] text-transparent bg-clip-text tracking-tighter md:tracking-normal'>
                        <h1>Your <span className='bg-gradient-to-br from-[#2b00ff] to-[#f200ff] text-transparent bg-clip-text text-6xl md:text-7xl lg:text-8xl'>AI</span> strategist for </h1>
                        <h1>unstoppable career success.</h1>
                    </div>
                    <p className='text-center w-[400px] mt-10 text-[#999999] font-exo'>
                        Accelerate your career with tailored guidance, expert interview prep, and AI-driven job success tools.
                    </p>
                </div>

                <div className='w-full h-auto flex flex-row gap-6 items-center justify-center mt-10'>
                    <Link href="/dashboard">
                        <Button 
                            size="lg"
                            className="bg-gradient-to-r from-[#2b00ff] to-[#aa00ff] text-white px-8 py-1 hover:scale-110 duration-200 ease-in-out"
                        >GET STARTED</Button>
                    </Link>
                </div>
            </div>
        </div>
        
        <div className='h-auto'>

            {/* AI mobile component  */}
            <div className='w-[95%] h-[250px] bg-inherit rounded-xl mx-auto flex flex-col items-center justify-center sm:hidden overflow-hidden'>
                <ShowPiece/>
            </div>

            {/* AI home wall */}
            <div className='w-[90%] max-w-[1300px] max-h-[500px] mx-auto hidden sm:flex items-center justify-center'>
                <div 
                    className='relative w-[90%] h-[280px] sm:h-[350px] md:h-[400px] xl:h-[450px] flex items-center justify-center rounded-xl overflow-hidden'
                >
                    <img src="/spotlight/AI_wallpaper.jpg" alt="" className='w-full h-full object-cover object-center'/>
                    <div className='absolute bottom-4 right-4 text-[#060606] font-exo '>
                        <div><span className='text-2xl font-extrabold text-white'>where </span><span className='text-5xl font-bold'>Innovation</span></div>
                        <div className='mr-6'><span className='text-3xl font-extrabold'>meets </span><span className='text-5xl font-bold text-[#bcb826] font-kanit'>Intelligence</span></div>
                    </div>
                </div>
            </div>

            {/* Features showcasing */}
            <section className='h-auto my-28 md:my-36'>
                <div className='text-center text-xl md:text-2xl font-bold font-exo px-2'>Poweful Ai features for your career growth </div>

                <div className='flex justify-center items-center w-[90%] mx-auto'>
                    <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-10 xl:gap-14 mt-10'>
                    {
                        features.map((feature, index) => (
                            <div 
                                key={index} 
                                className='flex flex-col gap-1 items-center border-2 border-[#999999] rounded-xl h-[170px] w-[170px] sm:h-[200px] sm:w-[200px] cursor-pointer hover:border-white hover:scale-105 duration-200 ease-in-out'
                            >
                                <div className='mt-4'>{feature.icon}</div>
                                <div className='font-semibold text-center text-[0.9rem] mt-1'>{feature.title}</div>
                                <div className='font-kanit text-[0.8rem] text-[#999999] text-center px-2 tracking-tighter'>{feature.description}</div>
                            </div>
                        ))
                    }
                    </div>
                </div>
            </section>

            {/* Statistics */}
            <section className='h-auto py-10 md:py-24 bg-muted/50 flex justify-center items-center'>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-x-10 gap-y-6 md:gap-x-10 lg:gap-x-20'>

                    <div className='flex flex-col items-center justify-center space-y-2'>
                        <div className='text-4xl md:text-5xl font-bold'>50+</div>
                        <div className='text-[0.9rem] text-[#999999]'>Industries Covered</div>
                    </div>
                    <div className='flex flex-col items-center justify-center space-y-2'>
                        <div className='text-4xl md:text-5xl font-bold'>1000+</div>
                        <div className='text-[0.9rem] text-[#999999]'>Interview Questions</div>
                    </div>
                    <div className='flex flex-col items-center justify-center space-y-2'>
                        <div className=' text-5xl sm:text-4xl bg-gradient-to-br from-[#2b00ff] to-[#f200ff] text-transparent bg-clip-text md:text-5xl font-bold'>95%</div>
                        <div className='text-[0.9rem] text-[#ffffff]'>Success Rate</div>
                    </div>
                    <div className='flex flex-col items-center justify-center space-y-2'>
                        <div className='text-4xl md:text-5xl font-bold'>24/7</div>
                        <div className='text-[0.9rem] text-[#999999]'>AI Support</div>
                    </div>

                </div>
            </section>

            {/* How It Works */}
            <section className='h-auto my-24 md:my-36 flex flex-col justify-center items-center'>
                <div className='text-center text-2xl md:text-3xl font-semibold font-exo'>How it works </div>
                <p className='text-center text-[0.9rem] text-[#999999] mt-4'>Four simple steps to unlock your career potential.</p>

                <div className='w-[90%] max-w-[1200px] grid grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-4 sm:gap-y-6 sm:gap-x-8 md:gap-x-6 mt-10'>
                {
                    howItWorks.map((item, index) => (
                        <div 
                            key={index} 
                            className='flex flex-col gap-1 items-center' 
                        >
                            <div className='w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center bg-muted/50 rounded-full'>{item.icon}</div>
                            <div className='font-semibold text-center mt-1 md:text-lg'>{item.title}</div>
                            <div className='font-kanit  text-[#999999] text-[0.9rem] text-center tracking-tighter px-4'>{item.description}</div>
                        </div>
                    ))
                }
                </div>
            </section>

            {/* Users FeedBack */}
            <section className='h-auto py-24 md:py-36 bg-muted/50'>
                <div className='text-center text-xl md:text-2xl font-bold font-exo'>What our users say -  </div>

                <div className='flex justify-center items-center'>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10 mt-10 mx-4'>
                    {
                        testimonial.map((item, index) => (
                            <div 
                                key={index} 
                                className='flex flex-col bg-gradient-to-tl from-[#29197c] via-[#111111]/70 to-[#111111]/70 to-[30%] rounded-2xl p-8 max-w-[400px]'
                            >
                                <div className='flex flex-row items-center'>
                                    <div className='w-[60px] h-[60px] rounded-full object-cover object-center'>
                                        <img 
                                            src={item.image} 
                                            className='w-[60px] h-[60px] rounded-full object-cover object-center'
                                            alt="" 
                                        />
                                    </div>
                                    <div className='ml-4'>
                                        <div className='font-semibold'>{item.author}</div>
                                        <div className='text-[0.8rem] text-[#999999]'>{item.role}</div>
                                        <div className='text-[0.8rem] text-[#999999]'>{item.company}</div>
                                    </div>
                                </div>

                                <blockquote className='relative'>
                                    <div className='mt-4 italic text-[0.9rem] text-[#999999]'>
                                        <span className='text-white absolute text-2xl -left-2.5 top-2'>&quot;</span>
                                        {item.quote} 
                                        <span className='text-white absolute text-2xl -bottom-1'>&quot;</span>
                                    </div>
                                </blockquote>
                            </div>
                        ))
                    }
                    </div>
                </div>
            </section>
            
            {/* FAQ zone */}
            <section className='h-auto py-24 md:py-36'>
                <div className='text-center text-xl md:text-2xl font-bold '>Frequently Asked Questions</div>
                <p className='mt-6 text-center text-[#999999] text-[0.9rem] px-2'>Find answers to frequently asked questions about our platform</p>

                <div className='w-[90%] mx-auto flex items-center justify-center mt-24'>
                    <Accordion
                        type='single'
                        collapsible 
                        className='w-[90%] max-w-[700px]'
                    >
                    {
                        faqs.map((item, index) => (
                            <AccordionItem 
                                key={index}
                                value={`item-${index}`}
                            > 
                                <AccordionTrigger>{item.question}</AccordionTrigger>
                                <AccordionContent className='font-exo text-[0.8rem]'>{item.answer}</AccordionContent>
                            </AccordionItem>
                        ))
                    }
                    </Accordion>
                </div>
            </section>

            {/* Start your journey */}
            <section className='h-auto py-20 md:py-24 bg-gradient-to-b from-[#ababab] via-[#ffffff] to-[#ababab]'>
                <div className='text-4xl lg:text-5xl text-center text-[#232323] font-bold tracking-tighter '>Ready to Accelerate Your Career?</div>

                <p className='text-center text-[0.9rem] text-[#555555] mt-4 px-6'>Join thousands of professionals who are already on their way to success.</p>

                <Link href="/dashboard">
                    <div className=' mt-8 flex flex-row items-center justify-center text-[0.9rem] py-2 bg-[#232323] w-[250px] hover:scale-110 hover:shadow-[0_0_15px_rgba(0,0,0,0.9)] duration-200 ease-in-out mx-auto rounded-lg'>
                        <div>Start Your Journey Today </div>
                        <ArrowRight className='ml-2 h-4 w-4' />
                    </div>
                </Link>

            </section>

        </div>
    </section>
    </>
    )
}

export default SpotLight
