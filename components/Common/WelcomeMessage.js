import { useRouter } from 'next/router'
import { Divider, Icon, Message } from 'semantic-ui-react'
import Link from 'next/link'
import React from 'react'

export const HeaderMessage = () => {
    const router = useRouter()
    const signupRoute = router.pathname === "/signup"

    return (
        <Message
            attached
            color="teal"
            header={signupRoute ? "Get Started" : "Welcome Back"}
            icon={signupRoute ? "settings" : "privacy"}
            content={signupRoute ? "Create new account" : "Login with email and password"}
        />
    )
}

export const FooterMessage = () => {
    const router = useRouter()
    const signupRoute = router.pathname === "/signup"

    return (
        signupRoute ? (
            <React.Fragment>
                <Message attached="bottom" warning>
                    <Icon name="help" />
                    Existing User ? {" "}
                    <Link href="/login">Login Here Instead</Link>
                </Message>
                <Divider hidden />
            </React.Fragment>
        ) : (
            <React.Fragment>
                <Message attached="bottom" info>
                    <Icon name="lock" />
                    <Link href="/reset">Forgot Password</Link>
                </Message>
                <Message attached="bottom" warning>
                    <Icon name="help" />
                        New User ? {" "}
                    <Link href="/signup">Sign Up Here</Link>
                </Message>
            </React.Fragment>
        )
    )
}