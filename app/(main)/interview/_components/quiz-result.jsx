import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Trophy, XCircle } from 'lucide-react';
import React from 'react'

const QuizResult = ({ result, hideStartNew = false, onStartNew }) => {
    
    if( !result ) return null;

    return (
    <div className='mt-10'>
        <div className='flex flex-row items-center gap-2 text-3xl gradient-title'>
            <Trophy className='h-10 w-10 text-yellow-500' />
            <p className='text-3xl font-semibold font-exo'>Quiz Results: </p>
        </div>

        <div className=''>
            <div className='text-xl mt-6 mb-2'><span className=' font-exo'>Efficiency: </span>{result.quizScore.toFixed(1)}%</div>
            <Progress value={result.quizScore} className='w-full mb-10' />

            {
                result.improvementTip && 
                <div className='p-1 rounded-3xl bg-white overflow-hidden space-y-4'>
                    <div className='font-medium font-exo p-3 bg-[#232323] shadow-[0_0_10px_rgba(0,0,0,1] rounded-[20px] text-white'>Improvement Tip: </div>
                    <p className='text-[#111111] pb-2 px-3 font-exo'>{result.improvementTip}</p>
                </div>
            }

            <div className='space-y-4'>
                <div className='text-xl mt-10 mb-6 font-semibold font-exo'>Question Review:</div>
                <div className='flex flex-col gap-4'>
                {
                    result.questions.map((question, index) => (
                        <div key={index} className='border rounded-3xl p-4 space-y-3 shadow-[0px_0px_10px_rgba(0,0,0,1)] font-exo'>
                            <div key={index} className='flex items-start justify-between gap-2'>
                                <p className=''>{question.question}</p>
                                {
                                    question.isCorrect ?
                                    <CheckCircle2 className='h-5 w-5 text-green-500 flex-shrink-0' /> : 
                                    <XCircle className='h-5 w-5 text-red-500 flex-shrink-0' />
                                }
                            </div>

                            <div className='text-sm text-muted-foreground'>
                                <p>Your Naswer: <span className={`${question.isCorrect ? 'text-green-500' : 'text-red-500'}`}>{question.userAnswer}</span></p>
                                {
                                    !question.isCorrect &&
                                    <p>Correct Answer: <span className='text-green-500'>{question.answer}</span></p>
                                }
                            </div>

                            <div className='text-sm text-muted-foreground'>
                                <p className='font-medium'>Explanation: </p>
                                <p>{question.explanation}</p>
                            </div>
                        </div>
                    ))
                }
                </div>
            </div>
        </div>

        {
            !hideStartNew &&
            <CardFooter>
                <Button onClick={onStartNew} className='w-full rounded-xl mt-6'>
                    Start New Quiz
                </Button>
            </CardFooter>
        }
    </div>
    )
}

export default QuizResult
