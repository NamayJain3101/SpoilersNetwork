import React, { useEffect, useRef, useState } from 'react'
import { Button, Divider, Form, Message, Segment } from 'semantic-ui-react'
import CommonInputs from '../components/Common/CommonInputs'
import ImageDropDiv from '../components/Common/ImageDropDiv'
import { FooterMessage, HeaderMessage } from '../components/Common/WelcomeMessage'
import { regexUserName, registerUser } from '../utils/authUser'
import axios from 'axios'
import baseUrl from '../utils/baseUrl'
import uploadPic from '../utils/uploadPicToCloudinary'

let cancel

const Signup = () => {
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        bio: "",
        facebook: "",
        youtube: "",
        twitter: "",
        instagram: ""
    })

    const { name, email, password, bio } = user

    const [showSocialLinks, setShowSocialLinks] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [errorMsg, setErrorMsg] = useState(null)
    const [username, setUsername] = useState("")
    const [usernameLoading, setUsernameLoading] = useState(false)
    const [usernameFocus, setUsernameFocus] = useState(false)
    const [usernameAvailable, setUsernameAvailable] = useState(false)
    const [formLoading, setFormLoading] = useState(false)
    const [submitDisabled, setSubmitDisabled] = useState(true)

    const [media, setMedia] = useState(null)
    const [mediaPreview, setMediaPreview] = useState(null)
    const [highlighted, setHighlighted] = useState(false)
    const inputRef = useRef()

    useEffect(() => {
        const isUser = Object.values({ name, email, password, bio }).every(item => Boolean(item))
        if (isUser) {
            setSubmitDisabled(false)
        } else {
            setSubmitDisabled(true)
        }
    }, [user])

    const checkUsername = async () => {
        setUsernameLoading(true)
        try {
            cancel && cancel()
            const CancelToken = axios.CancelToken
            const res = await axios.get(`${baseUrl}/api/signup/${username}`, {
                cancelToken: new CancelToken(canceler => {
                    cancel = canceler
                })
            })
            if (res.data === "available") {
                setUsernameAvailable(true)
                setUser(user => ({ ...user, username }))
                setErrorMsg(null)
            }
        } catch (err) {
            setErrorMsg("Username not available")
            setUsernameAvailable(false)
        }
        setUsernameLoading(false)
    }

    useEffect(() => {
        if (usernameFocus) {
            usernameAvailable === "" ? setUsernameAvailable(false) : checkUsername()
        }
    }, [username, usernameFocus])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormLoading(true)
        let profilePicUrl
        if (media !== null) {
            profilePicUrl = await uploadPic(media)
        }
        if (media !== null && !profilePicUrl) {
            setFormLoading(false)
            return setErrorMsg("Error Uploading Image")
        }
        await registerUser(user, profilePicUrl, setErrorMsg, setFormLoading)
    }

    const handleChange = (e) => {
        const { name, value, files } = e.target
        if (name === "media") {
            setMedia(files[0])
            setMediaPreview(URL.createObjectURL(files[0]))
        }
        setUser(user => ({ ...user, [name]: value }))
    }

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
                    <ImageDropDiv
                        mediaPreview={mediaPreview}
                        setMediaPreview={setMediaPreview}
                        setMedia={setMedia}
                        highlighted={highlighted}
                        setHighlighted={setHighlighted}
                        inputRef={inputRef}
                        handleChange={handleChange}
                    />
                    <Form.Input
                        label="Name"
                        placeholder="Name"
                        name="name"
                        value={name}
                        onChange={handleChange}
                        fluid
                        icon="user"
                        iconPosition="left"
                        required
                    />
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
                    <Form.Input
                        loading={usernameLoading}
                        error={!usernameAvailable && usernameFocus}
                        label="Username"
                        placeholder="Username"
                        value={username}
                        onBlur={() => setUsernameFocus(true)}
                        onChange={(e) => {
                            setUsernameFocus(true)
                            setUsername(e.target.value)
                            if (regexUserName.test(e.target.value)) {
                                setUsernameAvailable(true)
                            } else {
                                setUsernameAvailable(false)
                            }
                        }}
                        fluid
                        icon={usernameAvailable ? "check" : "close"}
                        iconPosition="left"
                        required
                    />
                    <CommonInputs
                        user={user}
                        handleChange={handleChange}
                        showSocialLinks={showSocialLinks}
                        setShowSocialLinks={setShowSocialLinks}
                    />
                    <Divider hidden />
                    <Button icon="signup" content="Sign Up" type="submit" color="orange" disabled={submitDisabled || !usernameAvailable} />
                </Segment>
            </Form>
            <FooterMessage />
        </React.Fragment>
    )
}

export default Signup
