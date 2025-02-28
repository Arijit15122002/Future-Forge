import { z } from "zod";

export const onboardingSchema = z.object({
    industry: z.string({
        required_error: "Please select an industry"
    }),
    subIndustry: z.string({
        required_error: "Please select a sub industry"
    }), 
    bio: z.string().max(500).optional(),
    experience: z
        .string()
        .transform((val) => parseInt(val, 10))
        .pipe(
            z
            .number()
            .min(0, "Experience must be at least 0 years")
            .max(50, "Experience must be at most 50 years")
    ),
    skills: z.string().min(1, { message: "At least one skill is required" }).transform((val) => 
        val
            ? val
                .split(",")
                .map(skill => skill.trim())
                .filter(Boolean)
            : undefined
    )

})

export const contactSchema = z.object({
    email: z.string().email("Invalid email address"),
    mobile: z.string().optional(),
    address: z.string().optional(),
    linkedIn: z.string().optional(),
    github: z.string().optional()
})

export const entrySchema = z.object({
    educationType: z.string().optional(),
    title: z.string().min(1, { message: "Title is required" }),
    organization: z.string().min(1, { message: "Organization is required" }),
    startDate: z.string().min(1, { message: "Start date is required" }),
    endDate: z.string().optional(),
    description: z.string().optional(),
    current: z.boolean().default(false),
    performance: z.string().optional(),
}).refine((data) => {
        if( !data.current && !data.endDate ) {
            return false;
        } 
        return true;
    },
    {
        message: "End date is required if not current",
        path: ["endDate"], 
    }
)

export async function resumeSchema() {
    return z.object({
        contactInfo: contactSchema,
        summary: z.string().min(1, { message: "Professional summary is required" }),
        skills: z.string().min(1, "At least one skill is required"),
        experience: z.array(entrySchema),
        education: z.array(entrySchema),
        projects: z.array(entrySchema),
        certifications: z.array(entrySchema).optional(),
        languages: z.array(entrySchema).optional(),
    });
}
