"use client"

import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import React from 'react'
import Logo from './logo'
import Link from 'next/link'
import { ChevronDown, FileText, GraduationCap, LayoutDashboard, PenBox, StarsIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import { checkUserPreviouslyInOrNot } from '@/actions/user'
import { useState, useEffect } from 'react';

const ActualHeader = ({userExists}) => {

    const [userAuthorizedForDashboard, setUserAuthorizedForDashboard] = useState()
    const router = useRouter()
    
    const fetchUsetAuthorization = async () => {
        const response = await checkUserPreviouslyInOrNot()
        console.log(response)
        setUserAuthorizedForDashboard(response);
    }

    useEffect(() => {
        fetchUsetAuthorization()
    }, [userExists])

    return (
    <>
        <header className='fixed top-0 z-30 flex flex-row justify-between h-[55px] sm:h-[60px] w-full bg-background/80 backdrop-blur-xl px-2 md:px-6 items-center'>

            {/* Logo */}
            <Link 
                href="/"
                className='flex flex-row items-center justify-center h-full w-[190px] sm:w-[250px] '
            >
                <Logo />
            </Link>

            {/* Navigation */}
            <nav className='flex flex-row items-center gap-4'>
                <div className='flex flex-row flex-shrink-0 gap-4 w-auto items-center'>
                    <SignedIn>
                        <Button 
                            variant="outline"
                            className=' h-[35px] w-[35px] sm:h-[40px] sm:w-[40px] lg:w-auto flex flex-row items-center justify-center rounded-xl'
                            onClick={() => {
                                if( userExists ) {
                                    if( checkUserPreviouslyInOrNot() ) {
                                        router.push('/dashboard')
                                    } else {
                                        router.push('/onboarding')
                                    }
                                }
                            }}
                        >
                            <LayoutDashboard className=' w-3 h-3 sm:w-4 sm:h-4'/>
                            <span className='hidden lg:block'>Industy Insights</span>
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className='w-auto px-2 md:px-4 lg:w-auto h-[35px] sm:h-[40px] flex flex-row items-center justify-center rounded-xl'>
                                    <StarsIcon className='w-3 h-3 sm:w-4 sm:h-4'/>
                                    <span className='hidden lg:block'>Growth Tools</span>
                                    <ChevronDown className='w-3 h-3 sm:w-4 sm:h-4' />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className='rounded-xl p-1.5 bg-[#090909] mt-1 mr-10'>
                                <DropdownMenuItem className='px-4 py-2 rounded-[8px]'>
                                    <Link 
                                        href={'/resume'}
                                        className='flex flex-row items-center gap-3'
                                    >
                                        <FileText className='w-4 h-4'/>
                                        <span>Build Resume</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className='px-4 py-2 rounded-[8px]'>
                                    <Link 
                                        href={'/ai-cover-letter'}
                                        className='flex flex-row items-center gap-3'
                                    >
                                        <PenBox className='w-4 h-4'/>
                                        <span>Cover Letter</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className='px-4 py-2 rounded-[8px]'>
                                    <Link 
                                        href={'/interview'}
                                        className='flex flex-row items-center gap-3'
                                    >
                                        <GraduationCap className='w-4 h-4'/>
                                        <span>Interview Prep</span>
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SignedIn>
                </div>

                <div className='flex items-center'>
                    <SignedOut>
                        <SignInButton> 
                            <Button variant='outline'>
                                Sign In
                            </Button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <UserButton 
                            appearance={{
                                elements: {
                                    avatarBox: "h-7 w-7 sm:w-9 sm:h-9",
                                    userButtonPopoverCard: "shadow-xl",
                                    userPreviewMainIdentifier:"font-semibold"
                                }
                            }}
                        />
                    </SignedIn>
                </div>
            </nav>
        </header>
    </>
    )
}

export default ActualHeader
