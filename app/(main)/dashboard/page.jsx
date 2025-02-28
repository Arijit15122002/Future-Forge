import { getIndustryInsight } from '@/actions/dashboard'
import { getUserOnboardingStatus } from '@/actions/user'
import { redirect } from 'next/navigation'
import React from 'react'
import DashboardView from './_components/dashboard-view'

const IndustryInsight = async () => {

    const { isOnboarded } = await getUserOnboardingStatus()
        
    if( !isOnboarded ) {
        redirect('/onboarding')
    }

    const insight = await getIndustryInsight()

    return (
    <div className='mx-auto'>
        <DashboardView insight={insight} />
    </div>
    )
}

export default IndustryInsight