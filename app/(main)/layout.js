import React from 'react'

const MainLayout = ({children}) => {

     //Redirect to onboarding if the  user is loggedIn

    return (
        <>
        <div className='mx-auto pt-16 mb-20'>
            {children}
        </div>
        </>
    )
}

export default MainLayout