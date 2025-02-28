'use server'

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server"
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash"
})

export const generateCoverLetter = async (formValues) => {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId
        },
        include: {
            industryInsight: true
        }
    })
    if (!user) throw new Error("User not found")

    const { jobDescription, skills, companyName, jobTitle } = formValues

    if (!jobDescription || !companyName || !jobTitle || !skills) {
        throw new Error("Missing required fields")
    }

    const prompt = `
        You are a professional career consultant and resume writer. Your task is to generate a highly professional and tailored cover letter for a job application. 

        - Job Title: ${jobTitle} 
        - Company Name: ${companyName} 
        - Job Description: ${jobDescription} 
        - Applicant Skills: ${skills}

        Follow these guidelines:
        - Research the company to add personalization.
        - Write a formal yet engaging cover letter (Max: 350 words).
        - Highlight relevant experience and skills, specifically using the skills provided.
        - Avoid generic phrases; keep it professional.

        Format it like this:

        Dear Hiring Manager at ${companyName},

        I am excited to apply for the position of ${jobTitle} at ${companyName}. With a strong background in ${skills}, I am eager to bring my expertise to your team and contribute to [company’s mission or goal].

        [Body: Highlight skills and experience matching the job description, emphasizing value to the company. Be sure to include the applicant skills]

        I would welcome the opportunity to discuss how my background aligns with your needs. Please feel free to contact me at your convenience.

        Sincerely,
        ${user.name}

        **Important: Only provide the cover letter text as shown in the format above. Do not include any additional text, greetings, or explanations. Preserve all line breaks and formatting.**
    `;

    try {
        const result = await model.generateContent(prompt)
        const coverLetterText = result.response.text();
        console.log(coverLetterText);
        return coverLetterText;
    } catch (error) {
        console.log("Error generating cover letter: ", error.message)
        throw new Error("Failed to generate cover letter");
    }
}

export const saveCoverLetter = async(formValues) => {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")
    
    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId
        },
        include: {
            industryInsight: true
        }
    })
    if (!user) throw new Error("User not found")

    const { content, jobDescription, companyName, jobTitle } = formValues

    if (!content || !jobDescription || !companyName || !jobTitle) {
        console.log("Missing required fields")
        throw new Error("Missing required fields")
    }

    try {
        const newCoverLetter = await db.coverLetter.create({
            data: {
                userId: user.id,  // Link it to the user
                content,
                jobDescription,
                companyName,
                jobTitle
            }
        });
    
        return {
            success: true,
            coverLetter: newCoverLetter
        };
    } catch (error) {
        console.log("Error saving cover letter: ", error.message);
        throw new Error("Failed to save cover letter");
    }
}


export const getAllCoverLetters = async () => {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")
    
    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId
        },
        include: {
            industryInsight: true
        }
    })
    if (!user) throw new Error("User not found")

    try {
        const coverLetters = await db.coverLetter.findMany({
            where: {
                userId: user.id,  // Link it to the user
            },
            orderBy: {
                createdAt: 'desc' // Order by newest first
            }
        })

        return {
            success: true,
            coverLetters
        }
    } catch (error) {
        console.log('Error while fetching all the cover letters: ', error.message)
        throw new Error(error.message)
    }
}

export const deleteCoverLetter = async(id) => {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")
    
    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId
        },
        include: {
            industryInsight: true
        }
    })
    if (!user) throw new Error("User not found")

    try {
        const deletedCoverLetter = await db.coverLetter.delete({
            where: {
                id
            }
        })
        return {
            success: true,
            deletedCoverLetter
        }
    } catch {
        console.log("Error while deleting cover letter: ", error.message)
        throw new Error(error.message)
    }
}