import React, { useState } from 'react'
import { calculateTime } from '../../utils/calculateTime'
import Link from 'next/link'
import { Divider, Form, Icon, Image, List, Modal, Segment } from 'semantic-ui-react'

const MessageNotificationModal = ({ socket, setNewMsgModal, newMsgModal, newMsgRecieved, user }) => {
    const [text, setText] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("submit")
        if (socket) {
            socket.emit("sendMsgFromNotification", {
                userId: user._id,
                messageSendToUserId: newMsgRecieved.sender,
                msg: text
            });
            socket.on("msgSentFromNotification", () => {
                setNewMsgModal(false);
            });
        }
    }

    return (
        <React.Fragment>
            <Modal
                size="small"
                open={newMsgModal}
                onClose={() => setNewMsgModal(false)}
                closeIcon
                closeOnDimmerClick
            >
                <Modal.Header content={`New Message from ${newMsgRecieved.senderName}`} />
                <Modal.Content>
                    <div className="bubbleWrapper">
                        <div className="inlineContainer">
                            <Image className="inlineIcon" src={newMsgRecieved.senderProfilePic} />
                            <div className="otherBubble other">
                                {newMsgRecieved.msg}
                            </div>
                        </div>
                        <span className="other">{calculateTime(newMsgRecieved.date)}</span>
                    </div>
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
                    <div style={{ marginTop: "1rem" }}>
                        <Link href={`/messages?message=${newMsgRecieved.sender}`}>
                            <a>View All Messages</a>
                        </Link>
                        <Divider />
                        <Instructions username={user.username} />
                    </div>
                </Modal.Content>
            </Modal>
        </React.Fragment>
    )
}

const Instructions = ({ username }) => (
    <List>
        <List.Item>
            <Icon name="help" />
            <List.Content>
                <List.Header>
                    If you do not like this popup to appear when you receive a new message:
                </List.Header>
            </List.Content>
        </List.Item>

        <List.Item>
            <Icon name="hand point right" />
            <List.Content>
                You can disable it by going to
                <Link href={`/${username}`}>
                    <a> Account </a>
                </Link>
                Page and clicking on Settings Tab.
            </List.Content>
        </List.Item>

        <List.Item>
            <Icon name="hand point right" />
            Inside the menu,there is an setting named: Show New Message Popup?
        </List.Item>

        <List.Item>
            <Icon name="hand point right" />
            Just toggle the setting to disable/enable the Message Popup to appear.
        </List.Item>
    </List>
);

export default MessageNotificationModal
