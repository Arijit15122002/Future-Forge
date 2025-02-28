"use client"

import React, { useEffect, useState } from 'react'
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const PerformanceChart = ({assessments}) => {

    const [ chartData, setChartData ] = useState([])

    useEffect(() => {
        if( assessments ) {
            const formattedData = assessments.map((assessment) => ({
                date: format(new Date(assessment.createdAt), 'yyyy-MM-dd'),
                score: assessment.quizScore
            }))

            setChartData(formattedData)
        }
    }, [assessments])

    return (
    <div>
        <Card className='w-[90%] mx-auto mt-10'>
            <CardHeader>
                <CardTitle className='text-3xl md:text-4xl font-bold bg-gradient-to-b from-[#ababab] via-white to-[#ababab] text-transparent bg-clip-text font-exo'>Performance Trend</CardTitle>
                <CardDescription>Your quiz scores over time</CardDescription>
            </CardHeader>
            <CardContent>
                <div className='h-[200px] md:h-[300px] text-[0.8rem] md:text-[0.9rem]'>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={chartData}
                        >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip content={({ active, payload}) => {
                            if( active && payload?.length ) {
                                return (
                                    <div className="bg-background border rounded-xl p-2 shadow-md">
                                        <p className='text-sm font-medium'>
                                            Score: {payload[0].value}%
                                        </p>
                                        <p className='text-xs text-muted-foreground'>
                                            {payload[0].payload.date}
                                        </p>
                                    </div>
                                )
                            }
                        }} />
                        <Line 
                            dataKey="score" 
                            type="monotone"
                            stroke="#ffffff" 
                            strokeWidth={2}
                        />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    </div>
    )
}

export default PerformanceChart
