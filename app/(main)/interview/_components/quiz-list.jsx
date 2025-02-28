"use client"

import { AlertDialogHeader } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import QuizResult from './quiz-result'

const QuizList = ({assessments}) => {

	const router = useRouter()
	const [ selectedQuiz, setSelectedQuiz ] = useState(null)
	const [isSmallScreen, setIsSmallScreen] = useState(false);

	useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 640); // Tailwind 'sm' breakpoint is 640px
        };

        handleResize(); // Check initial size
        window.addEventListener("resize", handleResize);
        
        return () => window.removeEventListener("resize", handleResize);
    }, []);

	return (
	<>
		<Card className='w-[90%] mx-auto mt-10 rounded-2xl font-exo'>
			<CardHeader className='flex flex-row items-center justify-between'>
				<div>
					<CardTitle className='text-sm'>Recent Quizes</CardTitle>
					<CardDescription className='text-xs'>Review your past quiz perfomances</CardDescription>
				</div>
				<Button 
					onClick={() => router.push('/interview/mock')}
					className='hidden md:block'
				>
					Start New Quiz
				</Button>
			</CardHeader>
			<div className='flex md:hidden flex-row items-center justify-end mb-6 mx-6'>
				<Button 
					onClick={() => router.push('/interview/mock')}
					className='block md:hidden'
				>
					Start New Quiz
				</Button>
			</div>
			<CardContent>
				<div className='space-y-4'>
				{
					assessments.map((assessment, index) => (
						<div 
							key={index}
							className='group hover:cursor-pointer'
							onClick={() => setSelectedQuiz(assessment)}
						>
							<Card 
								className='group-hover:border-white duration-200 group-hover:bg-muted/25 ease-in-out'
							>
								<CardHeader>
									
									<CardTitle className='flex flex-row items-center justify-between'>
										<div>Quiz {index + 1}</div>
										<div className='text-xs text-muted-foreground'>Date: {format(new Date(assessment.createdAt), 'MMMM dd, yyyy HH:mm')}</div>
									</CardTitle>
									<CardDescription className='flex flex-row  justify-between'>
										<div>Score: {assessment.quizScore.toFixed(1)}%</div>
									</CardDescription>
								</CardHeader>
								<CardContent>
									<p className='px-2 text-sm text-muted-foreground'>
									{
										isSmallScreen ? 
										assessment.improvementTip.slice(0, 100) + '...' :
										assessment.improvementTip
									}
									</p>
								</CardContent>
							</Card>
						</div>
					))
				}
				</div>
			</CardContent>
		</Card>

		{/* dialog */}
		<Dialog 
			open={!!selectedQuiz}
			onOpenChange={() => setSelectedQuiz(null)}
		>
			<DialogContent className='w-[90%] rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto hiddenScrollbar'>
				<DialogHeader>
					<DialogTitle></DialogTitle>

				</DialogHeader>
				<QuizResult 
					result={selectedQuiz}
					onStartNew={() => router.push('/interview/mock')}
					hideStartNew
				/>
			</DialogContent>
		</Dialog>
	</>
	)
}

export default QuizList
