'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'
import { entrySchema } from '../../lib/schema'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Loader2, PlusCircle, Sparkles, X } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import useFetch from '@/hooks/use-fetch'
import { improveWithAI } from '@/actions/resume'
import { toast } from 'sonner'
import { format, parse } from 'date-fns'

const formatDisplayDate = (dateString) => {
    if( !dateString ) return "";
    const date = parse(dateString, 'yyyy-MM', new Date())
    return format(date, 'MMM yyyy')
}

const EntryForm = ({ type, entries, onChange }) => {

    const [isAdding, setIsAdding] = React.useState(false)
    
    const {
        register,
        handleSubmit: handleValidation,
        formState: { errors },
        reset,
        watch,
        setValue,
    } = useForm({
        resolver: zodResolver(entrySchema),
        defaultValues: {
            educationType: "",
            title: "",
            organization: "",
            startDate: "",
            endDate: "",
            description: "",
            current: false,
            performance: undefined,
        },
    });

    const current = watch('current')
    const educationType = watch('educationType');
    const performance = watch('performance')

    const handleAdd = handleValidation((data) => {
        
        try {
            const formattedEntry = {
                ...data,
                startDate: formatDisplayDate(data.startDate),
                endDate: data.current ? '' : formatDisplayDate(data.endDate),
                performance: data.performance ? Number(data.performance) : undefined,
            }
    
            onChange([...entries, formattedEntry])
            reset()
            setIsAdding(false)
        } catch (error) {
            console.log(error.message)
            throw error
        }
     })

    const { 
        loading: isImproving,
        fn: improveWithAIFn,
        data: improvedContent,
        error: improveError,
     } = useFetch(improveWithAI)

     const handleDelete = (index) => {
        const newEntries = entries.filter((_, i) => i !== index)
        onChange(newEntries)
     }

     const handleImproveDescription = async () => {
        const description = watch('description')
        if( !description ) {
            toast.error('Please enter the description')
            return;
        }

        await improveWithAIFn({
            current: description,
            type: type.toLowerCase(),
        })
     }

     useEffect(() => {
        if( improvedContent && !isImproving ) {
            setValue('description', improvedContent)
            toast.success('Description improved successfully');
        }

        if(  improveError ) {
            toast.error(improveError.message || 'Failed to improve description');
        }
     }, [improvedContent, improveError, isImproving])

    return (
    <div>
        <div className='space-y-4'>
        {
            Array.isArray(entries) && entries.map((item, index) => (
                <Card key={index}>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium font-exo'>
                            {item.title} @ {item.organization}
                        </CardTitle>
                        <Button
                            variant='outline'
                            size='icon'
                            type='button'
                            onClick={() => handleDelete(index)}
                        >
                            <X className='w-4 h-4' />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <p className='text-[0.8rem] text-muted-foreground mt-2'>
                        {
                            item.current ? 
                            `${item.startDate} - Present` : 
                            `${item.startDate} -${item.endDate}`
                        }
                        </p>
                        <p className='mt-2 text-[0.85rem] whitespace-pre-wrap'>{item.description}</p>
                    </CardContent>
                </Card>

            ))
        }
        </div>
    {
        isAdding && (
            <Card className={`${entries.length > 0 ? 'mt-4' : ''}`}>
                <CardHeader className='flex flex-row items-center justify-between'>
                    <CardTitle className='font-exo font-normal text-sm md:text-md'>Add {type}</CardTitle>
                    <div className={`${type === 'Education' ? 'hidden md:flex flex-row items-center gap-3' : 'hidden'}`}>
                        <div className='flex flex-row items-center gap-1'>
                            <Input 
                                type='radio'
                                className='h-3.5 w-3.5'
                                {...register('educationType')}
                                value="school"
                            />
                            <label htmlFor="educationType" className='text-[0.8rem] md:text-[0.9rem] text-muted-foreground'>HighSchool</label>
                        </div>
                        <div className='flex flex-row items-center gap-1'>
                            <Input 
                                type='radio'
                                className='h-3.5 w-3.5'
                                {...register('educationType')}
                                value="university"
                            />
                            <label htmlFor="educationType" className='text-[0.8rem] md:text-[0.9rem] text-muted-foreground'>University</label>
                        </div>
                    </div>
                </CardHeader>
                <div className={`${type === 'Education' ? 'w-full flex md:hidden flex-row items-center justify-end gap-3 -mt-5 mb-4 pr-2' : 'hidden'}`}>
                    <div className='flex flex-row items-center gap-1'>
                        <Input 
                            type='radio'
                            className='h-3.5 w-3.5'
                            {...register('educationType')}
                            value="school"
                        />
                        <label htmlFor="educationType" className='text-[0.8rem] md:text-[0.9rem] text-muted-foreground'>HighSchool</label>
                    </div>
                    <div className='flex flex-row items-center gap-1'>
                        <Input 
                            type='radio'
                            className='h-3.5 w-3.5'
                            {...register('educationType')}
                            value="university"
                        />
                        <label htmlFor="educationType" className='text-[0.8rem] md:text-[0.9rem] text-muted-foreground'>University</label>
                    </div>
                </div>
                <CardContent>
                    <div className='flex flex-col md:flex-row gap-6'>
                        <div className='w-full space-y-2'>
                            <Input 
                                className='text-[0.8rem] md:text-[0.9rem]'
                                placeholder={
                                    type === 'Education' ? 'Degree Name' : 
                                    type === 'Experience' ? 'Designation' : 
                                    type === 'Project' ? 'Project Title' : ''
                                }
                                {...register('title')}
                                error={errors.title}
                            />
                            {
                                errors.title && (
                                    <p className='text-[0.8rem] md:text-[0.9rem] text-red-500'>{errors.title.message}</p>
                                )
                            }
                        </div>

                        <div className='w-full space-y-2'>
                            <Input 
                                className='text-[0.8rem] md:text-[0.9rem]'
                                placeholder={
                                    type === 'Education' ? 'Institution Name' : 
                                    type === 'Experience' ? 'Organization Name' : 
                                    type === 'Project' ? 'Tech Stack' : ''
                                }
                                {...register('organization')}
                                error={errors.organization}
                            />
                            {
                                errors.organization && (
                                    <p className='text-[0.8rem] md:text-[0.9rem] text-red-500'>{errors.organization.message}</p>
                                )
                            }
                        </div>
                    </div>

                    <div className='flex flex-col md:flex-row gap-6 mt-6 '>
                        <div className='w-full flex flex-row gap-4 items-center space-y-2'>
                            <span className='text-[0.8rem] md:text-[0.9rem] text-muted-foreground flex-shrink-0 mt-1'>Start Date</span>
                            <Input
                                type='month'
                                placeholder='Start Date'
                                {...register('startDate')}
                                error={errors.startDate}
                                className='text-[0.8rem] md:text-[0.9rem]'
                            />
                            {
                                errors.startDate && (
                                    <p className='text-[0.8rem] md:text-[0.9rem] text-red-500'>{errors.startDate.message}</p>
                                )
                            }
                        </div>

                        <div className='w-full flex flex-row gap-4 items-center space-y-2'>
                            <span className='text-[0.8rem] md:text-[0.9rem] text-muted-foreground flex-shrink-0 mt-1'>End Date</span>
                            <Input
                                type='month'
                                placeholder='End Date'
                                {...register('endDate')}
                                disabled={current}
                                error={errors.startDate}
                            />
                            {
                                errors.endDate && (
                                    <p className='text-[0.8rem] md:text-[0.9rem] text-red-500'>{errors.endDate.message}</p>
                                )
                            }
                        </div>
                    </div>

                    <div className='flex flex-row items-center justify-between mt-6'>
                        <div className='flex flex-row items-center gap-2'>
                            <Input
                                type='checkbox'
                                id='current'
                                {...register('current')}
                                onChange={(e) => {
                                    setValue("current", e.target.checked);
                                    if( e.target.checked ) {
                                        setValue("endDate", '');
                                    }
                                }}
                                className='h-3.5 w-3.5'
                            />
                            <label htmlFor='current' className='text-[0.8rem] md:text-[0.9rem] text-muted-foreground'>Current {type}</label>
                        </div>
                        <div className={`hidden md:flex flex-row items-center gap-2`}>
                            <label htmlFor="performance" className='text-[0.8rem] md:text-[0.9rem] text-muted-foreground flex-shrink-0'>
                            {
                                type === 'Experience' ? 'Experience' : 
                                type === 'Education' ? 
                                educationType === 'school' ? 'Percentage' : 'DGPA' : 
                                type === 'Project' ? 'Hosted Link' : ''
                            }
                            </label>
                            <Input 
                                type='text'
                                className='text-[0.8rem] md:text-[0.9rem]'
                                {...register('performance')}
                                placeholder={
                                    type === 'Education'
                                        ? educationType === 'school'
                                            ? 'Enter Percentage'
                                            : 'Enter DGPA'
                                        : 
                                        type === 'Experience'
                                        ? 'Enter Experience'
                                        : ''
                                }
                            />
                            <label htmlFor="" className='text-[0.8rem] md:text-[0.9rem] text-muted-foreground'>
                            {
                                type === 'Experience' ? 'Years' : 
                                type === 'Education' ? educationType === 'school' ? '%' : '' : ''
                            }
                            </label>
                        </div>
                    </div>

                    <div className={`flex md:hidden flex-row items-center justify-end gap-2 mt-6`}>
                        <label htmlFor="performance" className='text-[0.8rem] md:text-[0.9rem] text-muted-foreground flex-shrink-0'>
                        {
                            type === 'Experience' ? 'Experience' : 
                            type === 'Education' ? 
                            educationType === 'school' ? 'Percentage' : 'DGPA' : 
                            type === 'Project' ? 'Hosted Link' : ''
                        }
                        </label>
                        <Input 
                            type='text'
                            className='text-[0.8rem] md:text-[0.9rem]'
                            {...register('performance')}
                            placeholder={
                                type === 'Education'
                                    ? educationType === 'school'
                                        ? 'Enter Percentage'
                                        : 'Enter DGPA'
                                    : 
                                    type === 'Experience'
                                    ? 'in yrs'
                                    : ''
                            }
                        />
                        <label htmlFor="" className='text-[0.8rem] md:text-[0.9rem] text-muted-foreground'>
                        {
                            type === 'Experience' ? '' : 
                            type === 'Education' ? educationType === 'school' ? '%' : '' : ''
                        }
                        </label>
                    </div>

                    <div className={`${type === 'Education' ? 'hidden' : ''} mt-6`}>
                        <Textarea 
                            placeholder={`Description of your ${type.toLowerCase()}...`}
                            className='text-[0.8rem] md:text-[0.9rem] h-32 hiddenScrollbar'
                            {...register('description')}
                        />
                        {/* {
                            errors.description && (
                                <p className='text-sm text-red-500'>{errors.description.message}</p>
                            )
                        } */}
                    </div>

                    <div className='mt-4'>
                        <Button 
                            type='button'
                            onClick={handleImproveDescription}
                            disabled={isImproving || !watch('description')}
                            className={`${type === 'Education' ? 'hidden' : ''} ${isImproving ? 'bg-white text-[#232323]' : !watch('description') ? 'bg-[#343434] text-white' : 'bg-gradient-to-br from-[#001aff] to-[#aa00ff] text-white'} font-exo`}
                        >
                            {
                                isImproving ? (
                                    <>
                                        <Loader2 className='h-4 w-4 animate-spin' /> Improving...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className='h-4 w-4' /> Improve with AI
                                    </>
                                )
                            }
                        </Button>
                    </div>
                </CardContent>
                <CardFooter className='text-[0.8rem] md:text-[0.9rem] flex flex-row items-center justify-end gap-4'>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={() => {
                            setIsAdding(false)
                            reset()
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        type='button'
                        onClick={handleAdd}
                    >
                        <PlusCircle className='h-4 w-4' />
                        Add Entry
                    </Button>
                </CardFooter>
            </Card>

        )
    }

    {
        !isAdding && (
            <Button 
            className={`${entries.length > 0 ? 'mt-6' : ''} w-full text-[#cdcdcd]`}
                variant="outline"
                onClick={() => setIsAdding(true)}
            >
                <PlusCircle className='h-4 w-4'/>
                <span className='text-[0.8rem] md:text-[0.9rem] mt-0.5'>Add {type}</span>
            </Button>
        )
    }
    </div>
    )
}

export default EntryForm