import React, { useState } from 'react'
import { Form, Segment } from 'semantic-ui-react'

const MessageInputField = ({ sendMessage }) => {
    const [text, setText] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        sendMessage(text)
        setText("")
    }

    return (
        <React.Fragment>
            <div
                style={{
                    position: "sticky",
                    bottom: "0"
                }}
            >
                <Segment secondary color="teal" attached="bottom">
                    <Form reply onSubmit={handleSubmit}>
                        <Form.Input
                            size="large"
                            placeholder="Type Something"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            action={{
                                color: "blue",
                                icon: "telegram plane",
                                disabled: text === "",
                                loading: loading
                            }}
                        />
                    </Form>
                </Segment>
            </div>
        </React.Fragment>
    )
}

export default MessageInputField
