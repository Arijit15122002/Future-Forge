"use client"

import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle, Briefcase, Code, Download, Edit, Github, GraduationCap, Loader2, LucideGithub, LucideHome, Monitor, PlusCircle, Save } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { resumeSchema } from '../../lib/schema'
import useFetch from '@/hooks/use-fetch'
import { improveSkillsWithAI, saveResume } from '@/actions/resume'
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea'
import EntryForm from './entry-form'
import { entriesToMarkdown } from '../../lib/helper'
import ResumePreview from './resume-preview'
import { toast } from 'sonner'

const ResumeBuilder = ({initialContent}) => {

    const [ activeTab, setActiveTab ] = useState('editForm');
    const [ resumeMode, setResumeMode ] = useState('previewResume');
    const [skillObject, setSkillObject] = useState({});
    const [ skillsLoading, setSkillsLoading ] = useState(false);

    const scrollToTheTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    const {
        control,
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(resumeSchema),
        defaultValues: {
            contactInfo: {},
            summary: "",
            skills: "",
            experience: [],
            education: [],
            projects: [],
        },
    });

    const formValues = watch();
    const skills = watch('skills');
    console.log(formValues);
    
    useEffect(() => {
        onAddingSkills(formValues?.skills)
    }, [])

    const {
        loading: isSaving,
        fn: saveResumeFn,
        data: saveResult,
        error: saveError,
    } = useFetch(saveResume)

    useEffect(() => {
        if( initialContent ) setActiveTab('previewResume');
    }, [initialContent])

    const onAddingSkills = async () => {
        if( !skills ) {
            toast.error('Please Enter the skills');
        }
        try {
            setSkillsLoading(true)
            const response = await improveSkillsWithAI(skills)
            const skill = JSON.parse(response.replace("```json", "").replace("```", "").trim())
            setSkillObject(skill)
            console.log(skillObject)
        } catch (error) {
            console.log(error.message)
        } finally {
            setSkillsLoading(false)
        }
    }

    const onSubmit = async (data) => {

    }

    const getContactMarkdown = () => {

    }

    useEffect(() => {
        if (activeTab === 'previewResume') {
            document.body.style.overflow = 'hidden'; // Disable scrolling
        } else {
            document.body.style.overflow = 'auto'; // Enable scrolling when preview is closed
        }
    
        return () => {
            document.body.style.overflow = 'auto'; // Cleanup on unmount
        };
    }, [activeTab]);

    return (
    <>
        <div className='overflow-y-hidden'>
            <div className=' flex flex-row items-center justify-between'>
                <div className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-b from-[#ababab] via-white to-[#ababab] text-transparent bg-clip-text font-exo pt-1 pb-3 px-6 md:px-8 lg:px-10">
                    Resume Builder
                </div>

                <div className={`flex flex-row items-center gap-4 pr-6 xl:pr-8`}>
                    {/* <Button variant='destructive'>
                        <Save className='h-4 w-4' />
                        <span className='hidden md:inline'>Save</span>
                    </Button> */}

                    <Button 
                        variant=''
                        onClick={() => {
                            setActiveTab('previewResume')
                        }}
                        className='w-[30px] h-[30px] md:w-auto md:h-auto rounded-lg'
                    >
                        <Download className='h-4 w-4' />
                        <span className='hidden md:inline'>Download PDF</span>
                    </Button>
                </div>
            </div>  

            <div className='flex flex-row justify-start'>
                <div className={`${activeTab === 'previewResume' ? 'z-0 lg:z-50' : 'z-0'} flex flex-row gap-1.5 p-1.5 bg-[#050505] rounded-lg mx-10`}>
                    <div 
                        className={`${activeTab === 'editForm' ? 'bg-[#232323]' : 'bg-inherit'} text-sm md:text-md px-4 py-0.5 hover:bg-[#232323] rounded-[6px] duration-200 ease-in-out cursor-pointer`}
                        onClick={() => {
                            setActiveTab('editForm')
                        }}
                    >
                        Form
                    </div>
                    <div 
                        className={`${activeTab === 'previewResume' ? 'bg-[#232323]' : 'bg-inherit'} text-sm md:text-md px-4 py-0.5 hover:bg-[#232323] rounded-[6px] duration-200 ease-in-out cursor-pointer`}
                        onClick={() => {
                            scrollToTheTop()
                            setActiveTab('previewResume')
                        }}
                    >
                        Resume
                    </div>
                </div>
            </div>
            
            <div className='w-[90%] mx-auto'>
                <form 
                    className="mt-10 bg-[#101010] p-6 rounded-xl border-[1px] border-[#555555]" 
                    onSubmit={handleSubmit}
                >
                    {/* contact details */}
                    <div className='space-y-8'>
                        <div className='text-lg font-bold'>Contact Information: </div>
                        <div className='flex flex-col sm:flex-row gap-8 mt-4'>
                            <div className='w-full space-y-2'>
                                <label className="text-sm font-exo text-[#cdcdcd] flex flex-row items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                                    <span className='mt-0.5'>Email</span>
                                </label>

                                <Input
                                    {...register("contactInfo.email")}
                                    type="email"
                                    placeholder="your@email.com"
                                    error={errors.contactInfo?.email}
                                    className='text-[0.8rem] md:text-[0.9rem]'
                                />
                                {errors.contactInfo?.email && (
                                    <p className="text-sm text-red-500">
                                    {errors.contactInfo.email.message}
                                    </p>
                                )}
                            </div>
                            <div className='w-full space-y-2'>
                                <label className="text-sm font-exo text-[#cdcdcd] flex flex-row items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-phone"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                                    <span className='mt-0.5'>Mobile Number</span>
                                </label>
                                
                                <Input
                                    {...register("contactInfo.mobile")}
                                    type="tel"
                                    placeholder="+1 234 567 8900"
                                    className='text-[0.8rem] md:text-[0.9rem]'
                                />
                                {errors.contactInfo?.mobile && (
                                    <p className="text-sm text-red-500">
                                    {errors.contactInfo.mobile.message}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className='flex flex-col sm:flex-row gap-8 mt-4'>
                            <div className='w-full space-y-2'>
                                <label className="text-sm font-exo text-[#cdcdcd] flex flex-row items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                                    <span className='mt-0.5'>LinkedIn URL</span>
                                </label>
                                <Input
                                    {...register("contactInfo.linkedin")}
                                    type="url"
                                    placeholder="https://linkedin.com/in/your-profile"
                                    className='text-[0.8rem] md:text-[0.9rem]'
                                />
                                {errors.contactInfo?.linkedin && (
                                    <p className="text-sm text-red-500">
                                    {errors.contactInfo.linkedin.message}
                                    </p>
                                )}
                            </div>
                            <div className='w-full space-y-2'>
                                <label className="text-sm font-exo text-[#cdcdcd] flex flex-row items-center gap-2">
                                    <LucideHome className='h-4 w-4' />
                                    <span className='mt-0.5'>Address</span>
                                </label>
                                <Input
                                    {...register("contactInfo.address")}
                                    type="text"
                                    placeholder="your address"
                                    className='text-[0.8rem] md:text-[0.9rem]'
                                />
                                {errors.contactInfo?.address && (
                                    <p className="text-sm text-red-500">
                                    {errors.contactInfo.address.message}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className='flex flex-col sm:flex-row gap-8 mt-4'>
                            <div className='w-full space-y-2'>
                                <label className="text-sm font-exo text-[#cdcdcd] flex flex-row items-center gap-2">
                                    <LucideGithub className='h-4 w-4' />
                                    <span className='mt-0.5'>GitHub</span>
                                </label>
                                <Input
                                    {...register("contactInfo.github")}
                                    type="url"
                                    placeholder="https://github.com/in/your-profile"
                                    className='text-[0.8rem] md:text-[0.9rem]'
                                />
                                {errors.contactInfo?.github && (
                                    <p className="text-sm text-red-500">
                                    {errors.contactInfo.github.message}
                                    </p>
                                )}
                            </div>
                            <div className='w-full hidden md:flex' />
                        </div>
                    </div>

                    {/* professional summary */}
                    <div className='mt-8'>
                        <div className='text-sm font-exo text-[#cdcdcd] py-2 flex flex-row items-center  gap-2'>
                            <Briefcase className='h-4 w-4' />
                            <span className='mt-0.5'>Professional Summary</span>
                        </div>
                        <Controller
                            name="summary"
                            control={control}
                            render={({ field }) => (
                            <Textarea
                                {...field}
                                className='h-20 md:h-32 text-[0.8rem] md:text-[0.9rem]'
                                placeholder="Describe your Professional Summary..."
                                error={errors.skills}
                            />
                            )}
                        />
                        {
                            errors.summary && 
                            <p className='text-sm text-red-500'>{errors.summary?.message}</p>
                        }
                    </div>

                    {/* education */}
                    <div className='mt-8'>
                        <div className='text-sm font-exo text-[#cdcdcd] py-2 flex flex-row items-center  gap-2'>
                            <GraduationCap className='h-4 w-4' />
                            <span className='mt-0.5'>Education</span>
                        </div>
                        <Controller
                            name="education"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <EntryForm
                                        type='Education'
                                        entries={field.value}
                                        onChange={field.onChange}
                                    />
                                </>
                            )}
                        />
                        {
                            errors.education && 
                            <p className='text-sm text-red-500'>{errors.education?.message}</p>
                        }
                    </div>

                    {/* skills */}
                    <div className='mt-8'>
                        <div className='text-sm font-exo text-[#cdcdcd] py-2 flex flex-row items-center  gap-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bug-off"><path d="M15 7.13V6a3 3 0 0 0-5.14-2.1L8 2"/><path d="M14.12 3.88 16 2"/><path d="M22 13h-4v-2a4 4 0 0 0-4-4h-1.3"/><path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"/><path d="m2 2 20 20"/><path d="M7.7 7.7A4 4 0 0 0 6 11v3a6 6 0 0 0 11.13 3.13"/><path d="M12 20v-8"/><path d="M6 13H2"/><path d="M3 21c0-2.1 1.7-3.9 3.8-4"/></svg>
                            <span className='mt-0.5'>Skills</span>
                        </div>
                        <Controller
                            name="skills"
                            control={control}
                            render={({ field }) => (
                            <Textarea
                                {...field}
                                className='h-20 md:h-32 text-[0.8rem] md:text-[0.9rem]'
                                placeholder="List your key skills..."
                                error={errors.skills}
                            />
                            )}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            className='w-full mt-4 text-[#bcbcbc] text-md'
                            onClick={onAddingSkills}
                        >
                        {
                            skillsLoading ? <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                <span className='-mb-0.5'>Saving Skills</span>
                            </> : <>
                                <Save className="h-4 w-4" />
                                <span className='text-[0.8rem] md:text-[0.9rem] -mb-0.5'>Save Skills</span>
                            </>
                        }
                        </Button>
                    </div>

                    {/* work experience */}
                    <div className='mt-8'>
                        <div className='text-sm font-exo text-[#cdcdcd] py-2 flex flex-row items-center  gap-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-folder-kanban"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/><path d="M8 10v4"/><path d="M12 10v2"/><path d="M16 10v6"/></svg>
                            <span className='mt-0.5'>Work Experience</span>
                        </div>
                        <Controller
                            name="experience"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <EntryForm
                                        type='Experience'
                                        entries={field.value}
                                        onChange={field.onChange}
                                    />
                                </>
                            )}
                        />
                        {
                            errors.experience && 
                            <p className='text-sm text-red-500'>{errors.experience?.message}</p>
                        }
                    </div>

                    {/* projects */}
                    <div className='mt-8'>
                        <div className='text-sm font-exo text-[#cdcdcd] py-2 flex flex-row items-center  gap-2'>
                            <Code className='h-4 w-4' />
                            <span className='mt-0.5'>Projects</span>
                        </div>
                        <Controller
                            name="projects"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <EntryForm
                                        type='Project'
                                        entries={field.value}
                                        onChange={field.onChange}
                                    />
                                </>
                            )}
                        />
                        {
                            errors.projects && 
                            <p className='text-sm text-red-500'>{errors.projects?.message}</p>
                        }
                    </div>

                </form>
            </div>

        </div>

        <div className={`fixed ${activeTab === 'previewResume' ? 'left-0 top-0 w-full h-full scale-100 flex items-center justify-center translate-y-0 opacity-100 duration-300' : 'scale-0 translate-y-[100%] opacity-0 duration-200'} ease-in-out z-40 backdrop-blur-sm`}>
            
            <div 
                className='absolute h-8 w-8 bg-[#ffffff] shadow-md rounded-xl top-3 right-3 md:top-10 md:right-10 flex items-center justify-center cursor-pointer z-10'
                onClick={() => {
                    setActiveTab('editForm')
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </div>

            <ResumePreview 
                formValues={formValues} 
                skillObject={skillObject}
            />

        </div>
    </>
    )
}

export default ResumeBuilder
