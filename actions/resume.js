'use server'

import { db } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash"
})

export async function saveResume(content) {
    const { userId } = await auth()
    if( !userId ) throw new Error("Unauthorized")

    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId
        },
        include: {
            industryInsight: true
        }
    })
    if( !user ) throw new Error("User not found")

    try {
        const resume = await db.resume.upsert({
            where: {
                userId: user.id
            },
            update: {
                content
            },
            create: {
                userId: user.id,
                content
            }
        })

        revalidatePath('/resume')
        return resume
    } catch (error) {
        console.log('Error saving resume: ', error.message)
        throw new Error('Failed to save resume')
    }
}

export async function getResume() {
    const { userId } = await auth()
    if( !userId ) throw new Error("Unauthorized")

    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId
        },
        include: {
            industryInsight: true
        }
    })
    if( !user ) throw new Error("User not found")

    return await db.resume.findUnique({
        where: {
            userId: user.id
        }
    })
}

export async function improveWithAI({ current, type }) {
    const { userId } = await auth()
    if( !userId ) throw new Error("Unauthorized")

    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId
        },
        include: {
            industryInsight: true
        }
    })
    if( !user ) throw new Error("User not found")

    const prompt = `
        As an expert resume writer, improve the following ${type} description for a ${user.industry} professional.
        Make it more impactful, quantifiable, and aligned with industry standards.
        Current content: "${current}"
    
        Requirements:
        1. Use action verbs
        2. Include metrics and results where possible
        3. Highlight relevant technical skills
        4. Keep it concise but detailed
        5. Focus on achievements over responsibilities
        6. Use industry-specific keywords
        7. Make it under 65 words
        
        Format the response as a single paragraph without any additional text or explanations.
    `;

    try {
        const result = await model.generateContent(prompt)
        const response = result.response
        const improvedContent = response.text().trim()

        return improvedContent;
    } catch (error) {
        console.log("Error occured in improvedWithAI: ", error.message)
        throw new Error("Failed to improve content")
    }

}


export async function improveSkillsWithAI(skillString) {
    const { userId } = await auth()
    if( !userId ) throw new Error("Unauthorized")

    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId
        },
        include: {
            industryInsight: true
        }
    })
    if( !user ) throw new Error("User not found")

    const prompt = `Classify the following skills into predefined categories and return the result as a JSON object.  If a skill can belong to multiple categories, assign it to the most relevant one based on context.  If the skill is not recognized, categorize it as "Other."
        Skills: ${skillString}

        Categories and Skill Mapping like this:
        * Programming Language: Java, Python, JavaScript, C++, C#, Kotlin, Go, Swift, Ruby, PHP
        * Web Development: React, Express, Node, MongoDB, Angular, Vue, HTML, CSS, JavaScript, Next.js, Gatsby
        * Database Management: MongoDB, MySQL, PostgreSQL, SQL Server, Oracle, Cassandra, Redis
        * Cloud Computing: AWS, Azure, GCP, Docker, Kubernetes, Serverless
        * Data Science: Python, R, SQL, Machine Learning, Deep Learning, AI
        * Mobile Development: Swift, Kotlin, React Native, Flutter, Ionic
        * DevOps: Docker, Kubernetes, CI/CD, Jenkins, Git
        * Design: UI/UX, Graphic Design, Figma, Sketch, Adobe XD
        * Project Management: Agile, Scrum, Kanban, Jira, Trello
        * Communication Skills: Written Communication, Verbal Communication, Public Speaking
        * Leadership Skills: Team Management, Mentoring, Delegation

        Output Format:
            {
            "Category1": ["skill1", "skill2", ...],
            "Category2": ["skill3", "skill4", ...],
            ...
            "Other": ["unrecognized_skill1", ...]
            }
        `;
    
    try {
        const result = await model.generateContent(prompt)
        const responseString = result.response.candidates[0].content.parts[0].text;
        return responseString
    } catch (error) {
        
    }
}