"use client"

import { generateQuiz, saveQuizResult } from '@/actions/interview'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import useFetch from '@/hooks/use-fetch'
import React, { useEffect, useState } from 'react'
import Loader from '@/components/loader/loader'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import QuizResult from './quiz-result'

const Quiz = () => {

    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [answers, setAnswers] = useState([])
    const [showExplanation, setShowExplanation] = useState(false)

    const {
        loading: generatingQuiz,
        fn: generateQuizFn,
        data: quizData,
    } = useFetch(generateQuiz)

    const {
        loading: savingResult,
        fn: saveQuizResultFn,
        data: resultData,
        setData: setResultData,
    } = useFetch(saveQuizResult)

    console.log(resultData)

    useEffect(() => {
        if( quizData ) {
            setAnswers(new Array(quizData.length).fill(null))
        }
    }, [quizData])

    const handleAnswer = (answer) => {
        const newAnswers = [...answers]
        newAnswers[currentQuestion] = answer
        setAnswers(newAnswers)
    }

    const handleNext = () => {
        if( currentQuestion < quizData.length - 1 ) {
            setCurrentQuestion(currentQuestion + 1)
            setShowExplanation(false)
        } else {
            finishQuiz()
        }
    }

    const calculateScore = () => {
        let correct = 0
        answers.forEach((answer, index) => {
            if( answer === quizData[index].correctAnswer ) {
                correct++
            }
        })
        return ( correct / quizData.length ) * 100
    }

    const finishQuiz = async () => {
        const score = calculateScore();

         
        try {
            await saveQuizResultFn(quizData, answers, score)
            toast.success("Quiz submitted successfully");
        } catch (error) {
            toast.error(error.message || "Failed to save quiz results");
        }
    }

    const startNewQuiz = () => {
        setCurrentQuestion(0)
        setAnswers([])
        setShowExplanation(false)
        generateQuizFn()
        setResultData(null)
    }

    if( generatingQuiz ) {
        return <div className='mt-10 w-[90%] mx-auto h-[200px] bg-[#050505] rounded-xl border-[2] border-[#555555]'>
            <Loader />
        </div>
    }

    if( resultData ) {
        return (
            <div className='mx-auto w-[80%]'>
                <QuizResult result={resultData} onStartNew={startNewQuiz} />
            </div>
        )
    }

    if( !quizData ) {
        return (
            <Card className='w-[90%] mx-auto mt-10 font-exo'>
                <CardHeader className='flex flex-col gap-2'>
                    <CardTitle className='font-semibold text-lg'>Ready to test your knowledge?</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className='text-muted-foreground text-sm'>This quiz contains 10 questions specific to your industry and skills. Take your time and choose the best answer for each question.</p>
                </CardContent>
                <CardFooter className='flex flex-row items-center justify-end'>
                    <Button
                        onClick={generateQuizFn}
                        className='rounded-xl'
                    >Start Quiz</Button>
                </CardFooter>
            </Card>
        )
    }

    const question = quizData[currentQuestion]

    return (
    <div>
        <Card className='w-[90%] mx-auto mt-10 font-exo'>
            <CardHeader className='flex flex-col gap-2'>
                <CardTitle className='text-sm text-muted-foreground'>Question { currentQuestion + 1 } of {quizData.length} </CardTitle>
            </CardHeader>
            <CardContent>
                <p className='text-lg font-medium font-kanit'>{question.question}</p>

                <RadioGroup 
                    className='mt-4 px-4 py-3 rounded-xl'
                    value={answers[currentQuestion]}
                    onValueChange={handleAnswer}
                >
                    {question.options.map((option, index) => (
                        <div key={index} className="flex flex-row items-center space-x-2 py-1">
                            <RadioGroupItem value={option} id={`option-${index}`} />
                            <Label htmlFor={`option-${index}`} className='mt-0.5 '>{option}</Label>
                        </div>
                    ))}
                </RadioGroup>

                {
                    showExplanation &&
                    <div className='mt-4 px-4 py-3 rounded-xl'>
                        <p className='text-sm font-medium text-muted-foreground'><span className='text-white'>Explanation: </span>{question.explanation}</p>
                    </div>
                }
            </CardContent>
            <CardFooter>
                {
                    !showExplanation && 
                    <Button
                        onClick={() => setShowExplanation(true)}
                        className='rounded-xl'
                        variant='outline'
                        disabled={!answers[currentQuestion]}
                    >Show Explanation</Button>
                }

                    <Button
                        onClick={handleNext}
                        className='rounded-xl ml-auto'
                        variant='outline'
                        disabled={!answers[currentQuestion] || savingResult}
                    >
                        {
                            savingResult ? 
                            <>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />Finishing...
                            </> : 
                            <>
                                {
                                    currentQuestion < quizData.length - 1 ? 
                                    'Next Question' :
                                    'Finish Quiz'
                                }
                            </>
                        }
                        
                    </Button>
            </CardFooter>
        </Card>
    </div>
    )
}

export default Quiz