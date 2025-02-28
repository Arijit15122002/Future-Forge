"use client"

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { onboardingSchema } from '../../lib/schema'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import useFetch from '@/hooks/use-fetch'
import { updateUser } from '@/actions/user'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

const OnboardingForm = ({industries}) => {

    const [ selectedIndustry, setSelectedIndustry ] = useState(null)
    const router = useRouter()

    const { 
        loading: updateLoading,
        fn: updateUsersFn,
        data: updateResult,
     } = useFetch(updateUser)

    const { 
        register, 
        handleSubmit, 
        formState: { errors },
        setValue,
        watch,
    } = useForm({
        resolver: zodResolver(onboardingSchema)
    })

    const onSubmit = async (values) => {
        try {
            const formattedIndustry = `${values.industry} - ${values.subIndustry.toLowerCase().replace(/ /g, "-")}`

            await updateUsersFn({
                ...values,
                industry: formattedIndustry
            })
        } catch (error) {
            console.log("Onboarding error: ", error.message);
        }
    }

    useEffect(() => {
        console.log(updateResult)
        if( updateResult?.success && !updateLoading ) {
            toast.success("Profile updated successfully")
            router.push("/dashboard")
            router.refresh()
        }
    }, [updateResult, updateLoading])

    return (
    <div className='flex items-center justify-center'>
        <Card className='w-[90%] max-w-lg mt-10 bg-background'>
            <CardHeader>
                <CardTitle className='mb-2 text-3xl md:text-4xl font-bold  bg-gradient-to-b from-[#cdcdcd] via-white to-[#cdcdcd] text-transparent bg-clip-text'>Complete your Profile</CardTitle>
                <CardDescription className='text-[0.8rem]'>Select your industry to get personalized career insights & recommendation</CardDescription>
            </CardHeader>
            <CardContent>
                <form 
                    action=""
                    className='flex flex-col gap-8'
                    onSubmit={handleSubmit(onSubmit)}
                >

                    {/* Industry Section */}
                    <div className='flex flex-col gap-3 px-3'>
                        <Label htmlFor="industry">Industry</Label>
                        <Select 
                            onValueChange={(value) => {
                                setValue("industry", value)
                                setSelectedIndustry(
                                    industries.find((ind) => ind.id === value)
                                )
                                setValue("subIndustry", "")
                            }}
                        >
                            <SelectTrigger className="" id='Industry'>
                                <SelectValue placeholder="Select an Industry" />
                            </SelectTrigger>
                            <SelectContent className='rounded-xl'>
                            {
                                industries.map((ind) => (
                                    <SelectItem 
                                        key={ind.id} 
                                        value={ind.id}
                                        className='rounded-[8px]'
                                    >
                                        {ind.name}
                                    </SelectItem>
                                ))
                            }
                            </SelectContent>
                        </Select>
                        {
                            errors.industry && (
                                <p className='text-[0.8rem] text-red-500 font-kanit -mt-2'>{errors.industry.message}</p>
                            )
                        }
                    </div>

                    {/* Specialization Section */}
                    { selectedIndustry && <div className='flex flex-col gap-3 px-3'>
                        <Label htmlFor="subIndustry">Speicialization</Label>
                        <Select 
                            onValueChange={(value) => {
                                setValue("subIndustry", value)
                            }}
                        >
                            <SelectTrigger className="" id='subIndustry'>
                                <SelectValue placeholder="Select an Industry" />
                            </SelectTrigger>
                            <SelectContent className='rounded-xl'>
                            {
                                selectedIndustry?.subIndustries.map((ind) => (
                                    <SelectItem 
                                        key={ind} 
                                        value={ind}
                                        className='rounded-[8px]'
                                    >
                                        {ind}
                                    </SelectItem>
                                ))
                            }
                            </SelectContent>
                        </Select>
                        {
                            errors.subIndustry && (
                                <p className='text-[0.8rem] text-red-500 font-kanit -mt-2'>{errors.subIndustry.message}</p>
                            )
                        }
                    </div>}

                    {/* Experience Section */}
                    <div className='flex flex-col gap-3 px-3'>
                        <Label htmlFor="industry">Years of Experience</Label>
                        <Input 
                            id="experience"
                            type="number"
                            min="0"
                            max="50"
                            placeholder="Enter your experience in years"
                            className='text-[0.9rem]'
                            {...register("experience")}
                        />
                        {
                            errors.experience && (
                                <p className='text-[0.8rem] text-red-500 font-kanit -mt-2'>{errors.experience.message}</p>
                            )
                        }
                    </div>

                    {/* Skills Section */}
                    <div className='flex flex-col gap-3 px-3'>
                        <Label htmlFor="skills">Skills</Label>
                        <Input 
                            id="skills"
                            type="text"
                            placeholder="e.g., Java, Python, Project Management"
                            className='text-[0.9rem]'
                            {...register("skills")}
                        />

                        <p className='text-muted-foreground text-[0.8rem] -mt-1'>Separate your skills with a commas</p>

                        {
                            errors.skills && (
                                <p className='text-[0.8rem] text-red-500 font-kanit -mt-2'>{errors.skills.message}</p>
                            )
                        }
                    </div>

                    {/* Bio Section */}
                    <div className='flex flex-col gap-3 px-3'>
                        <Label htmlFor="bio">Professional Bio</Label>
                        <Textarea 
                            id="bio"
                            type="text"
                            placeholder="Tell us about your professional background and experience"
                            className='text-[0.9rem]'
                            {...register("bio")}
                        />

                        {
                            errors.bio && (
                                <p className='text-[0.8rem] text-red-500 font-kanit -mt-2'>{errors.bio.message}</p>
                            )
                        }
                    </div>

                    {/* Submit Form */}
                    <Button 
                        className='w-full' 
                        type='submit'
                        disable={updateLoading}
                    >
                    {
                        updateLoading ? 
                        <>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />Saving...
                        </> : 
                        <>
                            Complete Profile
                        </>
                    }
                    </Button>

                </form>
            </CardContent>
        </Card>

    </div>
    )
}

export default OnboardingForm
