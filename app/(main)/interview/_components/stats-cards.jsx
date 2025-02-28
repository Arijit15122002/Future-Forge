import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Trophy } from 'lucide-react';
import React from 'react'

const StatsCards = ({assessments}) => {

    const getAverageScore = () => {
        if( !assessments?.length ) return 0;
        const total = assessments.reduce((sum, assessment) => sum + assessment.quizScore, 0);
        return ( total / assessments.length ).toFixed(1);
    }

    const getLatestAssessment = () => {
        if( !assessments?.length ) return null;
        return assessments[0];
    }

    const getTotalQuestions = () => {
        if( !assessments?.length ) return 0;
        return assessments.reduce((sum, assessment) => sum + assessment.questions.length, 0);
    }

    return (
    <div className='flex flex-row items-center justify-center mt-10'>
        <div className='w-full md:w-[90%] mx-auto flex-col items-center md:grid gap-4 md:grid-cols-3 hidden'>
        
            <Card className='w-[70%] mx-auto rounded-2xl md:w-full max-h-[150px]'>
                <CardHeader className='flex flex-row items-center justify-between pb-3'>
                    <CardTitle className='text-sm font-light'>Average Score</CardTitle>
                    <Trophy className={`w-4 h-4 text-muted-foreground`} />
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-bold'>{getAverageScore()}%</div>
                    <p className='text-xs text-muted-foreground'>Across all Assessments</p>
                </CardContent>
            </Card>

            <Card className='w-[70%] mx-auto rounded-2xl md:w-full max-h-[150px]'>
                <CardHeader className='flex flex-row items-center justify-between pb-3'>
                    <CardTitle className='text-sm font-light'>Questions Practice</CardTitle>
                    <Brain className={`w-4 h-4 text-muted-foreground`} />
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-bold'>{getTotalQuestions()}</div>
                    <p className='text-xs text-muted-foreground'>Total Questions</p>
                </CardContent>
            </Card>

            <Card className='w-[70%] mx-auto rounded-2xl md:w-full max-h-[150px]'>
                <CardHeader className='flex flex-row items-center justify-between pb-3'>
                    <CardTitle className='text-sm font-light'>Latest Score</CardTitle>
                    <Trophy className={`w-4 h-4 text-muted-foreground`} />
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-bold'>{getLatestAssessment()?.quizScore.toFixed(1) || 0}%</div>
                    <p className='text-xs text-muted-foreground'>Most recent Quiz</p>
                </CardContent>
            </Card>

        </div>

        <div className='flex md:hidden flex-col gap-2 items-center justify-center'>
            <div className='w-[100%] flex flex-row gap-2 items-center justify-between'>
                <Card className='mx-auto rounded-3xl md:w-full'>
                    <div className='flex flex-row items-center justify-between px-4 pt-5 pb-3'>
                        <CardTitle className='text-sm font-light'>Average Score</CardTitle>
                        <Trophy className={`w-4 h-4 text-muted-foreground`} />
                    </div>
                    <CardContent>
                        <div className='text-2xl font-bold'>{getAverageScore()}%</div>
                        <p className='text-xs text-muted-foreground'>Across all Assessments</p>
                    </CardContent>
                </Card>

                <Card className='mx-auto rounded-3xl md:w-full'>
                    <div className='flex flex-row items-center justify-between px-4 pt-5 pb-3'>
                        <CardTitle className='text-sm font-light'>Questions Practice</CardTitle>
                        <Brain className={`w-4 h-4 text-muted-foreground`} />
                    </div>
                    <CardContent>
                        <div className='text-2xl font-bold'>{getTotalQuestions()}</div>
                        <p className='text-xs text-muted-foreground'>Total Questions</p>
                    </CardContent>
                </Card>
            </div>
            <Card className='w-[100%] mx-auto rounded-3xl md:w-full'>
                <div className='flex flex-row items-center justify-between px-4 pt-5 pb-3'>
                    <CardTitle className='text-sm font-light'>Latest Score</CardTitle>
                    <Trophy className={`w-4 h-4 text-muted-foreground`} />
                </div>
                <CardContent>
                    <div className='text-2xl font-bold'>{getLatestAssessment()?.quizScore.toFixed(1) || 0}%</div>
                    <p className='text-xs text-muted-foreground'>Most recent Quiz</p>
                </CardContent>
            </Card>
        </div>

    </div>
    )
}

export default StatsCards
