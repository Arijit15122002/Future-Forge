import React from "react"

const AuthLayout = ({ children }) => {
    return (
        <div className="w-full min-h-screen pt-[100px] pb-[100px] flex flex-row items-center justify-center">
            {children}
        </div>
    )
}

export default AuthLayout