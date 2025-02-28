import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { format, formatDistanceToNow } from 'date-fns'
import { Brain, BriefcaseIcon, LineChart, TrendingDown, TrendingUp } from 'lucide-react'
import React from 'react'
import SalaryBarChart from './bar-chart'

const DashboardView = ({insight}) => {

    const salaryData = insight.salaryRanges.map((range) => ({
        name: range.role,
        min: range.min / 1000,
        max: range.max / 1000,
        median: range.median / 1000
    }))

    const getDemandLevelColor = (level) => {
        switch ( level.toLowerCase() ) {
            case 'high':
                return 'bg-green-500'
            case 'medium':
                return 'bg-yellow-500'
            case 'low':
                return 'bg-red-500'
            default:
                return 'bg-gray-500'
        }
    }

    const getMarketOutlookInfo = (outlook) => {

        if( !outlook ) return { icon: LineChart, color:'text-green-500'}

        switch ( outlook.toLowerCase() ) {
            case 'positive':
                return { icon: TrendingUp, color:'text-green-500'}
            case 'neutral':
                return { icon: LineChart, color:'text-yellow-500'}
            case 'negative':
                return { icon: TrendingDown, color:'text-red-500'}
            default:
                return { icon: LineChart, color:'text-green-500'}
        }
    }

    const OutlookIcon = getMarketOutlookInfo(insight.marketOutLook).icon
    const OutlookColor = getMarketOutlookInfo(insight.marketOutLook).color

    const lastUpdateDate = format(new Date(insight.lastUpdated), 'dd/MM/yyyy')
    const nextUpdateDistance = formatDistanceToNow(
        new Date(insight.nextUpdate),
        { addSuffix: true }
    )

    return (
    <div className='font-exo'>
        <div className='px-6 md:px-8 py-2'>
            <Badge variant='outline'>Last updated: {lastUpdateDate}</Badge>
        </div>

        <div className='grid grid-cols-2 max-w-full md:grid-cols-2 md:max-w-[750px] lg:grid-cols-4 lg:max-w-[1500px] gap-4 px-6 md:px-8 py-2 mx-auto'>

            <Card className='rounded-3xl max-h-[130px] sm:max-h-[150px] max-w-[350px] flex flex-col justify-center'>
                <div className='flex flex-row items-start gap-4 pb-1 sm:pb-3 justify-between px-6 pt-5'>
                    <CardTitle className='text-[0.7rem] md:text-sm '>Market Outlook</CardTitle>
                    <OutlookIcon className={`${OutlookColor} w-4 h-4 md:w-6 md:h-6`} />
                </div>
                <CardContent>
                    <div className='text-xl font-bold'>{insight.marketOutLook}</div>
                    <p className='text-xs text-muted-foreground'>Next update {nextUpdateDistance}</p>
                </CardContent>
            </Card>

            <Card className='rounded-3xl max-h-[120px] sm:max-h-[150px] max-w-[350px] flex flex-col justify-center'>
                <div className='flex flex-row items-center gap-4 pb-1 sm:pb-3 justify-between px-6 pt-5'>
                    <CardTitle className='text-[0.7rem] md:text-sm '>Industry Growth</CardTitle>
                    <TrendingUp className={`$text-muted-foreground w-4 h-4 md:w-6 md:h-6`} />
                </div>
                <CardContent>
                    <div className='text-xl font-bold'>{insight.growthRate.toFixed(1)}%</div>
                    <Progress value={insight.growthRate} className='mt-2' />
                </CardContent>
            </Card>

            <Card className='rounded-3xl max-h-[110px] sm:max-h-[150px] max-w-[350px] flex flex-col  justify-center'>
                <div className='flex flex-row items-center gap-4 pb-1 sm:pb-3 justify-between px-6 pt-5'>
                    <CardTitle className='text-[0.7rem] md:text-sm '>Demand Level</CardTitle>
                    <BriefcaseIcon className={`${OutlookColor} w-4 h-4 md:w-6 md:h-6 text-muted-foreground`} />
                </div>
                <CardContent>
                    <div className='text-xl font-bold'>{insight.demandLevel}</div>
                    <div className={`h-2 w-[90%] rounded-full mt-2 ${getDemandLevelColor(insight.demandLevel)}`} />
                </CardContent>
            </Card>

            <Card className='rounded-3xl hidden md:block'>
                <div className='flex flex-row items-center gap-4 pb-2 sm:pb-3 justify-between px-6 pt-7'>
                    <CardTitle className='text-[0.7rem] md:text-sm '>Preferred Top Skills</CardTitle>
                    <Brain className='text-muted-foreground w-4 h-4 md:w-6 md:h-6' />
                </div>
                <CardContent>
                    <div className='text-sm md:text-2xl'>
                    {
                        insight.topSkills.map((skill, index) => (
                            <Badge 
                                key={index}
                                variant="secondary"
                                className='mr-2 font-normal'
                            >
                                {skill}
                            </Badge>
                        ))
                    }
                    </div>
                </CardContent>
            </Card>

        </div>

        <div className='w-full px-6 mt-2 mb-4'>
            <Card className='rounded-3xl flex flex-col md:hidden w-full mx-auto'>
                <div className='flex flex-row items-center gap-4 pb-2 sm:pb-3 justify-between px-6 pt-5'>
                    <CardTitle className='text-[0.7rem] md:text-sm '>Preferred Top Skills</CardTitle>
                    <Brain className='text-muted-foreground w-4 h-4 md:w-6 md:h-6 ' />
                </div>
                <CardContent>
                    <div className='text-2xl font-bold'>
                    {
                        insight.topSkills.map((skill, index) => (
                            <Badge 
                                key={index}
                                variant="secondary"
                                className='mr-2'
                            >
                                {skill}
                            </Badge>
                        ))
                    }
                    </div>
                </CardContent>
            </Card>
        </div>

        <Card className='mx-auto w-[90%] h-[280px] sm:h-[300px] md:h-[320px] lg:h-[340px] xl:h-[380px]'>
            <CardHeader>
                <CardTitle className=''>Salary Ranges</CardTitle>
                <CardDescription className='pt-1 text-xs'>Displaying minimum, median and maximum salaries (in thousands)</CardDescription>
            </CardHeader>
            <CardContent>
                <div className='h-[180px] sm:h-[200px] md:h-[220px] lg:h-[240px] xl:h-[280px]'>
                    <SalaryBarChart data={salaryData} />
                </div>
            </CardContent>
        </Card>

        <div className='mt-8 flex flex-col sm:flex-row gap-4 w-[90%] mx-auto'>
            <Card className='w-full'>
                <CardHeader className='flex flex-col gap-2'>
                    <CardTitle className=''>Key Industry Trends</CardTitle>
                    <CardDescription>Current Trends shaping the Industry</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className='space-y-3 text-[0.8rem]'>
                    {
                        insight.keyTrends.map((trend, index) => (
                            <li key={index} className='flex flex-row items-center gap-2'>
                                <div className='h-1.5 w-1.5 rounded-full bg-white'/>
                                <span>{trend}</span>
                            </li>
                        ))
                    }
                    </ul>
                </CardContent>
            </Card>

            <Card className='w-full'>
                <CardHeader className='flex flex-col gap-2'>
                    <CardTitle className=''>Recommended Skills</CardTitle>
                    <CardDescription>Skills to be considered to develop</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='flex flex-wrap gap-2'>
                    {
                        insight.recommendedSkills.map((skill, index) => (
                            <div key={index} className='px-3 py-1.5 bg-black text-[0.8rem] rounded-lg'>{skill}</div>
                        ))
                    }
                    </div>
                </CardContent>
            </Card>
        </div>

    </div>
    )
}

export default DashboardView