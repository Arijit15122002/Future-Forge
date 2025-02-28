'use client'

import { fetchCurrentUserName } from '@/actions/user'
import { Download, Loader2, LucideHome, Phone } from 'lucide-react'
import React, { useState, useEffect, useRef } from 'react'
import ContentEditable from 'react-contenteditable'
// import html2pdf from 'html2pdf.js/dist/html2pdf.min.js';
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const ResumePreview = ({ formValues, skillObject }) => {
    const [editableContent, setEditableContent] = useState({
        ...formValues,
        name: ''
    })
    const [editableSkillObject, setEditableSkillObject] = useState({...skillObject})
    const resumeRef = useRef(null)
    const [scale, setScale] = useState(0.6)

    useEffect(() => {
        const handleResize = () => {
            setScale(window.innerWidth < 640 ? 0.5 : 0.6); // Tailwind 'sm' breakpoint is 640px
        };

        handleResize(); // Set initial value based on current screen size
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        setEditableContent(prevContent => ({
            ...formValues,
            name: prevContent.name // Preserve the name field
        }));
        setEditableSkillObject(
            Object.fromEntries(
                Object.entries(skillObject).filter(([_, skillsArray]) => skillsArray.length > 0)
            )
        );
    }, [formValues, skillObject])

    useEffect(() => {
        const fetchUserName = async () => {
            const userName = await fetchCurrentUserName()
            console.log(userName)
            setEditableContent(prevContent => ({ ...prevContent, name: userName }));
        }
        fetchUserName()
    }, [])

    useEffect(() => {
        const handleZoom = (event) => {
            if (event.ctrlKey) { // Detect Ctrl + Scroll (Zoom Gesture)
                event.preventDefault()
                setScale((prevScale) => {
                    let newScale = event.deltaY < 0 ? prevScale + 0.1 : prevScale - 0.1 // Increase or decrease scale
                    return Math.min(Math.max(newScale, 0.5), 2) // Limit scale between 0.5x and 2x
                })
            }
        }

        window.addEventListener("wheel", handleZoom, { passive: false }) // Prevent default zooming
        return () => window.removeEventListener("wheel", handleZoom)
    }, [])

    console.log("Editable Content-",editableContent)

    const handleSkillChange = (category, newCategoryName) => {
        if (newCategoryName.trim() === "") {
            const updatedSkills = { ...editableSkillObject };
            delete updatedSkills[category]; // Remove category
            setEditableSkillObject(updatedSkills);
        } else {
            // Store the existing skills
            const existingSkills = editableSkillObject[category] || [];
            
            // Remove old category and update with new name
            const updatedSkills = { ...editableSkillObject };
            delete updatedSkills[category];
            updatedSkills[newCategoryName] = existingSkills; // Assign skills safely
            
            setEditableSkillObject(updatedSkills);
        }
    };
    

    // converting it into resume-preview into a pdf and download it 
    const generatePDF = async () => {
        const resumeElement = resumeRef.current;
        if (!resumeElement) return;

        try {
            // Capture the element as an image
            const canvas = await html2canvas(resumeElement, {
                scale: 3, // Higher scale for better quality
                useCORS: true, // Helps with loading external images
            });

            const imgData = canvas.toDataURL("image/png"); // Convert canvas to image

            // Create a new PDF instance
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
            });

            // Calculate image dimensions to fit in A4
            const imgWidth = 210; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width; // Scale height accordingly

            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
            pdf.save("resume.pdf"); // Save the PDF

        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };
    

    return (
        <div className='flex flex-row items-center justify-center '>
            <div 
                ref={resumeRef}
                className='bg-[#f5f5f5] text-black rounded-md w-[794px] h-[1123px] transform'
                style={{
                    transform: `scale(${scale})`,
                    transformOrigin: "center"
                }}
            >
                {
                    !editableContent.name ? 
                    <>
                    {/* Loader */}
                    <div className='min-h-[700px] min-w-[585px] flex flex-row gap-1 items-center justify-center font-serif tracking-wide '>
                        <Loader2 className='w-4 h-4 animate-spin' />
                        <span className='font-kanit'>Loading...</span>
                    </div>
                    </> : 
                    <>
                    {/* Name */}
                    <div className='mt-6 pb-1.5 flex flex-row items-center'>
                        <ContentEditable
                            html={editableContent.name?.toUpperCase() || ''}
                            onChange={(e) => setEditableContent({ ...editableContent, name: e.target.value })}
                            className='w-full text-center text-3xl font-semibold focus:outline-none focus:border-t-0 focus:border-l-0 focus:border-r-0 focus:border-b-[1px] focus:border-black font-ptSerif'
                        />
                    </div>

                    {/* Contact Info */}
                    <div className='flex flex-row items-center justify-center gap-3'>
                    {
                        editableContent?.contactInfo?.mobile ? 
                        <div className='flex flex-row items-center gap-1'>
                            <ContentEditable
                                html={editableContent.contactInfo.mobile || ''}
                                onChange={(e) => setEditableContent({ ...editableContent, contactInfo: { ...editableContent.contactInfo, mobile: e.target.value } })}
                                className='w-full text-center focus:outline-none focus:border-t-0 focus:border-l-0 focus:border-r-0 focus:border-b-[1px] focus:border-black font-ptSerif text-[0.9rem]'
                            />
                        </div> : 
                        <>
                        </>
                    }

                    {
                        editableContent?.contactInfo?.address ? 
                        <div className='flex flex-row items-center gap-2'>
                            <ContentEditable
                                html={editableContent.contactInfo.address || ''}
                                onChange={(e) => setEditableContent({ ...editableContent, contactInfo: { ...editableContent.contactInfo, address: e.target.value } })}
                                className='w-full text-center focus:outline-none focus:border-t-0 focus:border-l-0 focus:border-r-0 focus:border-b-[1px] focus:border-black font-ptSerif text-[0.9rem]'
                            />
                        </div> : 
                        <>
                        </>
                    }
                    </div>

                    <div className='flex flex-row items-center justify-center gap-2 pb-3'>
                    {/* Mail */}
                    {   
                        editableContent?.contactInfo?.email ? 
                        <div className='flex flex-row items-center gap-1 text-[0.9rem]'>
                            <div className="font-ptSerif">Mail:</div>
                            <a href={editableContent.contactInfo?.email}>
                                <ContentEditable
                                    html={editableContent.contactInfo.email || ''}
                                    onChange={(e) => setEditableContent({ ...editableContent, contactInfo: { ...editableContent.contactInfo, mail: e.target.value } })}
                                    className='w-full text-center text-blue-600 focus:outline-none focus:border-t-0 focus:border-l-0 focus:border-r-0 focus:border-b-[1px] focus:border-black font-ptSerif'
                                />
                            </a>
                        </div> : 
                        <>
                        </>
                    }

                    {/* LinkedIn */}
                    {
                        editableContent?.contactInfo?.linkedin ? 
                        <div className='flex flex-row items-center gap-1 text-[0.9rem]'>
                            <div className="font-ptSerif">LinkedIn:</div>
                            <a href={editableContent.contactInfo?.linkedin}>
                                <ContentEditable
                                    html={editableContent.contactInfo.linkedin?.split('/').filter(Boolean).pop() || ''}
                                    // onChange={(e) => setEditableContent({ ...editableContent, contactInfo: { ...editableContent.contactInfo, linkedin: e.target.value } })}
                                    className='w-full text-center text-blue-600 focus:outline-none focus:border-t-0 focus:border-l-0 focus:border-r-0 focus:border-b-[1px] focus:border-black font-ptSerif'
                                />
                            </a>
                        </div> : 
                        <>
                        </>
                    }

                    {/* Github */}
                    {
                        editableContent?.contactInfo?.github ? 
                        <div className='flex flex-row items-center gap-1 text-[0.9rem]'>
                            <div className="font-ptSerif">Github:</div>
                            <a href={editableContent.contactInfo?.github}>
                                <ContentEditable
                                    html={editableContent.contactInfo.github?.split('/').filter(Boolean).pop() || ''}
                                    // onChange={(e) => setEditableContent({ ...editableContent, contactInfo: { ...editableContent.contactInfo, github: e.target.value } })}
                                    className='w-full text-center text-blue-600 focus:outline-none focus:border-t-0 focus:border-l-0 focus:border-r-0 focus:border-b-[1px] focus:border-black font-ptSerif'
                                />
                            </a>
                        </div> : 
                        <>
                        </>
                    }

                    </div>


                    <div className='w-[90%] mx-auto font-ptSerif'>
                    {/* Education */}
                    {
                        editableContent?.education.length > 0 ?
                        <div className='pb-2'>
                            <div className='w-full flex flex-row items-end text-[1.25rem] font-bold h-[35px]'>
                                <div className=''>EDUCATION</div>
                            </div>
                            <div className=''>
                                <div className='text-[1.1rem] flex flex-row items-center justify-between'>
                                    <div className=' font-semibold'>{editableContent.education[0]?.organization}</div>
                                    <div className='text-[0.9rem]'>{editableContent.education[0]?.startDate} - {editableContent.education[0]?.endDate}</div>
                                </div>
                                <div className=''>{editableContent.education[0]?.title}</div>
                                <div className='text-[0.9rem]'>DGPA {editableContent.education[0]?.performance}</div>
                            </div>
                        </div> : <></>
                    }

                    {/* Skills */}
                    {
                        editableContent?.skills && skillObject ? 
                        <div className='pb-2'>
                            <div className='w-full flex flex-row items-end text-[1.25rem] font-bold h-[35px]'>
                                <div className=''>SKILLS</div>
                            </div>
                            <div>
                            {
                                Object.entries(editableSkillObject).map(([category, skillsArray]) => (
                                    <div className='flex flex-row items-center gap-2'>
                                        <span className='font-semibold'>
                                        <ContentEditable
                                            html={`${category}: `}
                                            onChange={(e) => handleSkillChange(category, e.target.value)}
                                            className="font-semibold focus:outline-none"
                                        /></span>
                                        <span className=''>
                                        <ContentEditable
                                            html={skillsArray.join(", ")}
                                            onChange={(e) => {
                                                setEditableSkillObject((prev) => ({
                                                    ...prev,
                                                    [category]: e.target.value.split(",").map(skill => skill.trim())
                                                }));
                                            }}
                                            className="focus:outline-none"
                                        />
                                        </span>
                                    </div>
                                ))
                            }
                            </div>
                        </div> : <></>
                    }

                    {/* Projects */}
                    {
                        editableContent?.projects.length > 0 ?
                        <div className='pb-2'>
                            <div className='w-full flex flex-row items-end text-[1.25rem] font-bold h-[35px]'>
                                <div className=''>PROJECTS</div>
                            </div>
                            <div className='mt-0.5 space-y-2'>
                            {
                                editableContent.projects.map((project, index) => (
                                    <div className=''>
                                        <div className='w-full flex flex-row items-start justify-between'>
                                            <div className='w-[70%] flex flex-row items-start gap-2'>
                                                <div className='font-semibold'>{project?.title}</div><div className=''>-</div><div className='text-[0.9rem]'>{project?.organization}</div>
                                            </div>
                                            <div className='text-[0.9rem]'>{project?.startDate} - {project?.endDate ? project.endDate : "Ongoing"}</div>
                                        </div>
                                        <div className='w-full my-1'>{project.description}</div>
                                        <div className=''>
                                            <span>Experience it here: </span><span><a href={project.performance} className='text-blue-700'>{project.title}</a></span>
                                        </div>
                                    </div>
                                ))
                            }
                            </div>
                        </div> : <></>
                    }
                    </div>

                    </>
                }

                <div 
                    className='absolute -top-20 md:top-3 left-3 p-2 rounded-xl bg-white shadow-md shadow-black/50 hover:shadow-lg hover:shadow-black/50 hover:-translate-y-1 hover:scale-105 transition-all duration-150 ease-in-out cursor-pointer'
                    onClick={() => {
                        generatePDF()
                    }}
                >
                    <Download className='h-8 w-8' />
                    <span>Download</span>
                </div>
            </div>
        </div>
    )
}

export default ResumePreview