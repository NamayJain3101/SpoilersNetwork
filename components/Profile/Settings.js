import React, { useEffect, useRef, useState } from 'react'
import { Button, Checkbox, Divider, Form, List, Message } from 'semantic-ui-react'
import { toggleMessagePopup, updatePassword } from '../../utils/profileActions'

const Settings = ({ newMessagePopup }) => {
    const [showUpdatePassword, setShowUpdatePassword] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(null)

    const [showMessageSettings, setShowMessageSettings] = useState(false)
    const [popupSettings, setPopupSettings] = useState(newMessagePopup)

    const isFirstRun = useRef(true)

    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false
            return
        }
    }, [popupSettings])

    useEffect(() => {
        success && setShowUpdatePassword(false)
        success && setTimeout(() => {
            setSuccess(false)
        }, 3000)
    }, [success])

    return (
        <React.Fragment>
            {success && (
                <React.Fragment>
                    <Message
                        style={{
                            margin: "0 1rem",
                            width: "auto"
                        }}
                        icon="check circle"
                        header="Updated Successfully"
                        success
                    />
                    <Divider hidden />
                </React.Fragment>
            )}
            <List size="huge" animated style={{ margin: "0 1rem" }}>
                <List.Item>
                    <List.Icon name="user secret" size="large" verticalAlign="middle" />
                    <List.Content>
                        <List.Header
                            as="a"
                            onClick={() => setShowUpdatePassword(!showUpdatePassword)}
                            content="Update Password"
                        />
                    </List.Content>
                    {showUpdatePassword && <UpdatePassword setSuccess={setSuccess} setShowUpdatePassword={setShowUpdatePassword} />}
                </List.Item>
                <Divider hidden />
                <Divider />
                <Divider hidden />
                <List.Item>
                    <List.Icon name="paper plane outline" size="large" verticalAlign="middle" />
                    <List.Content>
                        <List.Header
                            as="a"
                            onClick={() => setShowMessageSettings(!showMessageSettings)}
                            content="Show New Message Popup"
                        />
                    </List.Content>
                    {showMessageSettings && (
                        <React.Fragment>
                            <div style={{ marginTop: "1rem" }}>
                                Control whether a Popup should appear when there is a new Message!!
                            </div>
                            <Divider />
                            <Checkbox
                                checked={popupSettings}
                                toggle
                                onChange={() => toggleMessagePopup(popupSettings, setPopupSettings, setSuccess, setError)}
                            />
                            {error !== null && (
                                <Message
                                    error
                                    icon="meh"
                                    header="Oops!"
                                    content={errorMsg}
                                    onDismiss={() => setError(null)}
                                />
                            )}
                        </React.Fragment>
                    )}
                </List.Item>
            </List>
        </React.Fragment>
    )
}

const UpdatePassword = ({ setSuccess, setShowUpdatePassword }) => {
    const [userPasswords, setUserPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })
    const [showTypedPassword, setShowTypedPassword] = useState({
        currentPasswordField: false,
        newPasswordField: false,
        confirmPasswordField: false,
    })
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState(null)

    const { currentPassword, newPassword, confirmPassword } = userPasswords
    const { currentPasswordField, newPasswordField, confirmPasswordField } = showTypedPassword

    const handleChange = (e) => {
        const { name, value } = e.target
        setUserPasswords(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        await updatePassword(setSuccess, userPasswords, setErrorMsg)
        setLoading(false)
    }

    useEffect(() => {
        errorMsg !== null && setTimeout(() => {
            setErrorMsg(null)
        }, 5000)
    }, [errorMsg])

    return (
        <React.Fragment>
            <Form
                error={errorMsg !== null}
                loading={loading}
                onSubmit={handleSubmit}
            >
                <List.List>
                    <List.Item>
                        <Form.Input
                            fluid
                            icon={{
                                name: "eye",
                                circular: true,
                                link: true,
                                onClick: () => setShowTypedPassword(prev => ({
                                    ...prev,
                                    currentPasswordField: !currentPasswordField
                                }))
                            }}
                            type={currentPasswordField ? "text" : "password"}
                            iconPosition="left"
                            label="Current Password"
                            placeholder="Enter Current Password"
                            name="currentPassword"
                            onChange={handleChange}
                            value={currentPassword}
                        />
                        <Form.Input
                            fluid
                            icon={{
                                name: "eye",
                                circular: true,
                                link: true,
                                onClick: () => setShowTypedPassword(prev => ({
                                    ...prev,
                                    newPasswordField: !newPasswordField
                                }))
                            }}
                            type={newPasswordField ? "text" : "password"}
                            iconPosition="left"
                            label="New Password"
                            placeholder="Enter New Password"
                            name="newPassword"
                            onChange={handleChange}
                            value={newPassword}
                        />
                        <Button
                            disabled={loading || newPassword === "" || currentPassword === ""}
                            compact
                            icon="configure"
                            type="submit"
                            color="teal"
                            content="Update"
                        />
                        <Button
                            disabled={loading}
                            compact
                            icon="cancel"
                            color="youtube"
                            content="Cancel"
                            onClick={() => setShowUpdatePassword(false)}
                        />
                        <Divider hidden />
                        {errorMsg !== null && (
                            <Message
                                error
                                icon="meh"
                                header="Oops!"
                                content={errorMsg}
                                onDismiss={() => setErrorMsg(null)}
                            />
                        )}
                    </List.Item>
                </List.List>
            </Form>
        </React.Fragment>
    )
}

export default Settings
