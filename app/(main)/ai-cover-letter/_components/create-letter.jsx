'use client'

import { generateCoverLetter, saveCoverLetter } from '@/actions/cover-letter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import jsPDF from 'jspdf'
import { Download, Loader2, Save, Sparkles } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

const CreateLetter = ({setLetterFormModalOpen, setCount}) => {

    const [loading, setLoading] = useState(false)
    const [emptyFields, setEmptyFields] = useState(false)
    const [hasCheckedOnce, setHasCheckedOnce] = useState(false);
    const [letterViewModalOpen, setLetterViewModalOpen] = useState(false)
    const [formValues, setFormValues] = useState({
        content: '',
        jobDescription: '',
        companyName: '',
        jobTitle: '',
        skills: ''
    })
    const[saving, setSaving] = useState(false)

    const checkFormValues = () => {
        if (!formValues.companyName || !formValues.jobTitle || !formValues.jobDescription || !formValues.skills) {
            setEmptyFields(true);
            if (!hasCheckedOnce) setHasCheckedOnce(true);
        } else {
            setEmptyFields(false);
        }
        return (!emptyFields)
    }

    useEffect(() => {
        if (hasCheckedOnce) {
            checkFormValues();
        }
    }, [formValues, hasCheckedOnce]);

    const generateLetterWithAI = async () => {
        try {
            setLoading(true)
            const response = await generateCoverLetter(formValues)
            if( response ) {
                console.log(response)
                setFormValues(prevValues => ({ ...prevValues, content: response }))
            }
        } catch (error) {
            console.log('Error: ', error.message)
            throw new Error(error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if( formValues.content !== '' ) {
            setLetterViewModalOpen(true);
        }
    }, [formValues, letterViewModalOpen])

    const saveToDatabase = async () => {
        try {
            setSaving(true);
            console.log("Form Values: ", formValues); // Debugging Step 1
    
            const letter = await saveCoverLetter(formValues);
            console.log("Response from Backend: ", letter); // Debugging Step 2
    
            if (letter?.success) {
                toast.success('Cover Letter Saved Successfully');
                setCount(prevCount => prevCount + 1);
                setLetterFormModalOpen(false);
            } else {
                toast.error('Failed to save cover letter');
            }
        } catch (error) {
            console.log('Error: ', error.message); // Debugging Step 3
            toast.error(error.message);
        } finally {
            setSaving(false);
        }
    };
    

    const downloadAsPDF = () => {
        const content = document.getElementById('letter-content'); 
        if (!content) return;
    
        const text = content.innerText.trim(); // Extract plain text while preserving line breaks
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
    };

    return (
    <>
        <div className={`w-full flex flex-col items-center justify-center duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] 
                ${!letterViewModalOpen 
                    ? 'h-full translate-y-0 opacity-100 backdrop-blur-2xl bg-muted/50' 
                    : 'h-0 translate-y-[-100%] opacity-0 backdrop-blur-none pointer-events-none'}`}>
            <div className='ml-10 text-5xl md:text-6xl font-bold bg-gradient-to-b from-[#cdcdcd] via-white to-[#cdcdcd] text-transparent bg-clip-text font-exo pt-1 pb-3 px-6 md:px-8 lg:px-10'>
                Create Cover Letter
            </div>
            <form 
                className='w-[85%] max-w-[700px]'
            >
                <div className='flex flex-col gap-8 mt-10'>

                    <div className='w-full flex flex-col sm:flex-row gap-8'>
                        <div className='w-full '>
                            <div className='text-[#cdcdcd] px-2'>Enter the Company Name:</div>
                            <Input 
                                type="text"
                                placeholder="Company Name"
                                onChange={(e) => setFormValues({...formValues, companyName: e.target.value})}
                                className='w-full bg-background rounded-lg text-[0.9rem] mt-2'
                            />
                            {
                                emptyFields && !formValues.companyName &&
                                <div className='text-red-400 text-sm px-2'>Please enter a company name</div>
                            }
                        </div>
                        <div className='w-full '>
                            <div className='text-[#cdcdcd] px-2'>Enter the Designation:</div>
                            <Input 
                                type="text"
                                placeholder="Designation"
                                onChange={(e) => setFormValues({...formValues, jobTitle: e.target.value})}
                                className='w-full bg-background rounded-lg text-[0.9rem] mt-2'
                            />
                            {
                                emptyFields && !formValues.jobTitle &&
                                <div className='text-red-400 text-sm px-2'>Please enter a job title</div>
                            }
                        </div>
                    </div>

                    <div className='space-y-1'>
                        <div className='text-[#cdcdcd] px-2'>Your Skills:</div>
                        <Input 
                            type="text"
                            placeholder="Your Preferred Skills..."
                            onChange={(e) => setFormValues({...formValues, skills: e.target.value})}
                            className='w-full bg-background rounded-lg text-[0.9rem] mt-2'
                        />
                        {
                            emptyFields && !formValues.skills &&
                            <div className='text-red-400 text-sm px-2'>Please enter your skills</div>
                        }
                    </div>

                    <div className=''>
                        <div className='text-[#cdcdcd] px-2'>Enter the Job Description: </div>
                        <Textarea 
                            type="text"
                            name="jobDescription"
                            onChange={(e) => setFormValues({...formValues, jobDescription: e.target.value})}
                            placeholder="Job Description"
                            className='w-full rounded-lg bg-background text-[0.9rem] mt-2'
                        />
                        {
                            emptyFields && !formValues.jobDescription &&    
                            <div className='text-red-400 text-sm px-2'>Please enter a job description</div>
                        }
                    </div>
                </div>
            </form>

            <Button
                className='w-[80%] max-w-[600px] my-10'
                onClick={() => {
                    if( checkFormValues() ) {
                        generateLetterWithAI()
                    }
                }}
            >
            {
                loading ? 
                <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    <span>Generating Cover Letter...</span>
                </> : 
                <>
                    <Sparkles className='mr-2 h-4 w-4' />
                    <span>Generate Cover Letter with AI</span>
                </>
            }
            </Button>
        </div>

        <div 
            className={`w-full flex flex-col items-center justify-center duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] 
                ${letterViewModalOpen 
                    ? 'h-full translate-y-0 opacity-100 backdrop-blur-2xl bg-muted/50' 
                    : 'h-0 translate-y-full opacity-0 backdrop-blur-none pointer-events-none'}`}
        >
            {/* Modal Content */}
            <div className='w-[90%] p-6 bg-[#111111] text-[0.9rem] rounded-xl border-[1px] border-[#777777] relative'>
                <pre 
                    id='letter-content'
                    className='w-[90%] font-ptSerif ' 
                    style={{ whiteSpace: 'pre-wrap' }}
                >
                    {formValues.content}
                </pre>
                <div className='absolute flex flex-row gap-4 bottom-6 right-6'>
                    <Button
                        onClick={() => {
                            downloadAsPDF()
                        }}
                    >
                        <Download className='h-4 w-4' />
                        <span>Download</span>
                    </Button>

                    <Button
                        onClick={() => {
                            saveToDatabase()
                        }}
                    >
                    {
                        saving ? 
                        <>
                            <Loader2 className='h-4 w-4 animate-spin' />
                            <span>Saving...</span>
                        </> : 
                        <>
                            <Save className='h-4 w-4' />
                            <span>Save</span>
                        </>
                    }
                    </Button>
                </div>

            </div>
        </div>
    </>
    )
}

export default CreateLetter
