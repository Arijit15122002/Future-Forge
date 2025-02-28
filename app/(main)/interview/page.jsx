import React from 'react'
import StatsCards from './_components/stats-cards'
import PerformanceChart from './_components/performance-chart'
import QuizList from './_components/quiz-list'
import { getAssessments } from '@/actions/interview'

const InterviewPage = async () => {

    const assessments = await getAssessments()

    return (
    <div>
        <div className='text-5xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-b from-[#ababab] via-white to-[#ababab] text-transparent bg-clip-text font-exo pt-1 pb-3 px-6 md:px-8 lg:px-10 mt-10'>Interview Preparation</div>
        
        <p className='px-6 md:px-8 lg:px-10 text-xs text-muted-foreground'>Review past interviews, refine your weaknesses, and ace your next one!</p>

        <div>
            <StatsCards assessments={assessments} />
            <PerformanceChart assessments={assessments} />
            <QuizList assessments={assessments} />
        </div>
    </div>
    )
}

export default InterviewPage
