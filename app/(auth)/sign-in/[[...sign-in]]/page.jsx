import { SignIn } from '@clerk/nextjs';
import React from 'react'

const Page = () => {
    return <SignIn forceRedirectUrl='/onboarding' />
};

export default Page;