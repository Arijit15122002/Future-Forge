"use server"

import { db } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { generateAIInsight } from "./dashboard"

export async function updateUser(data) {
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
        const result = await db.$transaction(
            async (tx) => {

                //find if the industry exists
                let industryInsight = await tx.industryInsight.findUnique({
                    where: {
                        industry: data.industry
                    }
                })                

                //if the industry doesn't exist, create it
                if( !industryInsight ) {
                    const insight = await generateAIInsight(data.industry)
                    
                    industryInsight = await db.industryInsight.create({
                        data: {
                            industry: data.industry,
                            ...insight,
                            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                        }
                    })
                }

                //update the user
                const updatedUser = await tx.user.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        industry: data.industry,
                        experience: data.experience,
                        bio: data.bio,
                        skills: data.skills,
                    }
                })

                return { updatedUser, industryInsight }

            }, {timeout: 10000}
        )

        return {
            success: true,
            ...result
        }
        //find if the industry exists, else create the industry if it doesn't exist
        //update the user

    } catch (error) {
        console.log("Error updating user and industry: ", error.message)
        throw new Error("Failed to update profile");
    }
}

export async function getUserOnboardingStatus() {
    const { userId } = await auth()
    if( !userId ) throw new Error("Unauthorized")

    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId
        }
    })
    if( !user ) throw new Error("User not found")

    try {
        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId
            }, 
            select: {
                industry: true,
            }
        })

        return {
            isOnboarded: !!user?.industry
        }
    } catch (error) {
        console.log("Error checking onboarding status: ", error.message)
        throw new Error("Failed to check onboarding status");
    }
}

export async function fetchCurrentUserName() {
    const { userId } = await auth()
    
    try {    
        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId
            }, 
            select: {
                name: true,
            }
        })
        if( !user ) throw new Error("User not found")
        return user.name;  
    } catch (error) {
        console.log("Error fetching current user name: ", error.message)
        throw new Error("Failed to fetch current user name");
    }
}

// export const checkUserPreviouslyInOrNot = async () => {
//     const { userId } = await auth()

//     try {    
//         const user = await db.user.findUnique({
//             where: {
//                 clerkUserId: userId
//             }, 
//             select: {
//                 industryInsight: true,
//             }
//         })
        
//         return !!user?.industryInsight; 
//     } catch (error) {
//         console.log("Error fetching current user's ", error.message)
//         throw new Error("Failed to fetch current user name");
//     }
// }