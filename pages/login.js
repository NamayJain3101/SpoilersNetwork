import Cookies from 'js-cookie'
import React, { useEffect, useRef, useState } from 'react'
import { Button, Divider, Form, Message, Segment } from 'semantic-ui-react'
import { FooterMessage, HeaderMessage } from '../components/Common/WelcomeMessage'
import { loginUser } from '../utils/authUser'

const Login = () => {
    const [user, setUser] = useState({
        email: "",
        password: "",
    })

    const { email, password } = user

    const [showPassword, setShowPassword] = useState(false)
    const [errorMsg, setErrorMsg] = useState(null)
    const [formLoading, setFormLoading] = useState(false)
    const [submitDisabled, setSubmitDisabled] = useState(true)

    useEffect(() => {
        const isUser = Object.values({ password, email }).every(item => Boolean(item))
        if (isUser) {
            setSubmitDisabled(false)
        } else {
            setSubmitDisabled(true)
        }
    }, [user])

    const handleChange = (e) => {
        const { name, value } = e.target
        setUser(user => ({ ...user, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormLoading(true)
        await loginUser(user, setErrorMsg, setFormLoading)
    }

    useEffect(() => {
        document.title = "Welcome Back"
        const userEmail = Cookies.get("userEmail")
        if (userEmail) {
            setUser(user => ({ ...user, email: userEmail }))
        }
    }, [])

    return (
        <React.Fragment>
            <HeaderMessage />
            <Form
                loading={formLoading}
                error={errorMsg !== null}
                onSubmit={handleSubmit}
            >
                <Message
                    error
                    header="Oops!"
                    content={errorMsg}
                    onDismiss={() => setErrorMsg(null)}
                />
                <Segment>
                    <Form.Input
                        label="Email"
                        placeholder="Email"
                        name="email"
                        value={email}
                        onChange={handleChange}
                        fluid
                        icon="envelope"
                        iconPosition="left"
                        type="email"
                        required
                    />
                    <Form.Input
                        label="Password"
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={handleChange}
                        fluid
                        type={showPassword ? "text" : "password"}
                        icon={{
                            name: "eye",
                            circular: true,
                            link: true,
                            onClick: () => setShowPassword(!showPassword)
                        }}
                        iconPosition="left"
                        required
                    />
                    <Divider hidden />
                    <Button
                        icon="signup"
                        content="Login"
                        type="submit"
                        color="orange"
                        disabled={submitDisabled}
                    />
                </Segment>
            </Form>
            <FooterMessage />
        </React.Fragment>
    )
}

export default Login
