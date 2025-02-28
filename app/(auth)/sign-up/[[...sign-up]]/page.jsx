import { SignUp } from '@clerk/nextjs';
import React from 'react'

const Page = () => {
    return <SignUp forceRedirectUrl='/onboarding' />
  };
  
  export default Page;