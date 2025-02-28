"use client"

import React from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Rectangle } from "recharts"

const SalaryBarChart = ({data}) => {
    return (
    <div className="text-[0.8rem] md:text-[0.9rem]">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
                <defs>
                    {/* Gradient for Min Salary */}
                    <linearGradient id="minGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#086375" stopOpacity={1} />
                        <stop offset="100%" stopColor="#0a9396" stopOpacity={0.8} />
                    </linearGradient>

                    {/* Gradient for Median Salary */}
                    <linearGradient id="medianGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1DD3B0" stopOpacity={1} />
                        <stop offset="100%" stopColor="#00a896" stopOpacity={0.8} />
                    </linearGradient>

                    {/* Gradient for Max Salary */}
                    <linearGradient id="maxGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#AFFC41" stopOpacity={1} />
                        <stop offset="100%" stopColor="#9ef01a" stopOpacity={0.8} />
                    </linearGradient>
                </defs>
                {/* <CartesianGrid strokeDasharray="3, 3" /> */}
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={({ active, payload, label }) => {
                    if( active && payload && payload.length ) {
                        return (
                            <div className="bg-background border rounded-lg p-2 shadow-md">
                                <p className="font-exo font-medium px-3 py-1">{label}</p>
                                {
                                    payload.map((item) => (
                                        <p 
                                            key={item.name}
                                            className="text-xs px-2 py-1"
                                        >
                                            {item.name}: ${item.value}K
                                        </p>
                                    ))
                                }
                            </div>
                        )
                    }
                    return null
                }} />
                <Bar dataKey="min" fill="#50514F" radius={[8, 8, 0, 0]} activeBar={<Rectangle fill="#69B578" />} />
                <Bar dataKey="median" fill="#CBD4C2" radius={[8, 8, 0, 0]} activeBar={<Rectangle fill="#3A7D44" />} />
                <Bar dataKey="max" fill="#FFFCFF" radius={[8, 8, 0, 0]} activeBar={<Rectangle fill="#254D32" />} />
            </BarChart>
        </ResponsiveContainer>
    </div>
    )
}

export default SalaryBarChart   