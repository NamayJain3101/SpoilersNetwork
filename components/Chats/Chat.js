import React from 'react'
import { useRouter } from 'next/router'
import { calculateTime } from '../../utils/calculateTime'
import { Comment, Divider, Icon, Image, List } from 'semantic-ui-react'

const Chat = ({ chat, setChats, deleteChat, connectedUsers }) => {
    const router = useRouter()

    const isOnline = connectedUsers.length > 0 && (
        connectedUsers.filter(user => user.userId === chat.messagesWith).length > 0
    )

    return (
        <React.Fragment>
            <List selection>
                <List.Item
                    active={router.query.message === chat.messagesWith}
                    onClick={() => router.push(`/messages?message=${chat.messagesWith}`, undefined, {
                        shallow: true
                    })}
                >
                    <Comment>
                        <Comment.Avatar src={chat.profilePicUrl} />
                        <Comment.Content>
                            <Comment.Author as="a">
                                {chat.name} {isOnline && (
                                    <Icon
                                        name="circle"
                                        size="small"
                                        color="green"
                                    />
                                )}
                            </Comment.Author>
                            <Comment.Metadata>
                                <div>{calculateTime(chat.date)}</div>
                                <div style={{
                                    position: "absolute",
                                    right: "1rem",
                                    cursor: "pointer"
                                }}>
                                    <Image
                                        src={`/deleteIcon.svg`}
                                        verticalAlign="middle"
                                        size="mini"
                                        onClick={() => deleteChat(chat.messagesWith)}
                                    />
                                </div>
                            </Comment.Metadata>
                            <Comment.Text>
                                {chat.lastMessage.length > 20 ? `${chat.lastMessage.substring(0, 20)}...` : chat.lastMessage}
                            </Comment.Text>
                        </Comment.Content>
                    </Comment>
                </List.Item>
            </List>
            <Divider />
        </React.Fragment>
    )
}

export default Chat
