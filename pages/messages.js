import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { parseCookies } from 'nookies'
import baseUrl from '../utils/baseUrl'
import { NoMessages } from '../components/Layout/NoData'
import { useRouter } from 'next/router'
import { Comment, Divider, Grid, Header, Segment } from 'semantic-ui-react'
import ChatListSearch from '../components/Chats/ChatListSearch'
import Chat from '../components/Chats/Chat'
import io from 'socket.io-client'
import Banner from '../components/Messages/Banner'
import Message from '../components/Messages/Message'
import MessageInputField from '../components/Messages/MessageInputField'
import { getUserInfo } from '../utils/getUserInfo'
import { newMsgSound } from '../utils/newMsgSound'
import Cookies from 'js-cookie'

const scrollDivToBottom = (divRef) => {
    divRef.current !== null && divRef.current.scrollIntoView({ behaviour: "smooth" })
}

const Messages = ({ chatsData, errorLoading, user }) => {
    const [chats, setChats] = useState(chatsData)
    const router = useRouter()

    const socket = useRef()

    const [connectedUsers, setConnectedUsers] = useState([])
    const [messages, setMessages] = useState([])
    const [bannerData, setBannerData] = useState({ name: "", profilePicUrl: "" })
    const openChatId = useRef("")

    const divRef = useRef()

    // Connecttion
    useEffect(() => {
        document.title = "Messages"
        if (!socket.current) {
            socket.current = io(baseUrl)
        }
        if (socket.current) {
            socket.current.emit('join', { userId: user._id })
            socket.current.on("connectedUsers", ({ users }) => {
                if (users.length > 0) {
                    setConnectedUsers(users)
                }
            })
            if (chats.length > 0 && !router.query.message) {
                router.push(`/messages?message=${chats[0].messagesWith}`, undefined, {
                    shallow: true
                })
            }
        }
        return () => {
            if (socket.current) {
                socket.current.emit('disconnect')
                socket.current.off()
            }
        }
    }, [])

    // Load Messages
    useEffect(() => {
        const loadMessages = () => {
            socket.current.emit("loadMessages", { userId: user._id, messagesWith: router.query.message })
            socket.current.on("messagesLoaded", ({ chat }) => {
                setMessages(chat.messages)
                setBannerData({
                    name: chat.messagesWith.name,
                    profilePicUrl: chat.messagesWith.profilePicUrl
                })
                openChatId.current = chat.messagesWith._id
                divRef.current && scrollDivToBottom(divRef)
            })
            socket.current.on("noChatFound", async () => {
                const { name, profilePicUrl } = await getUserInfo(router.query.message)
                setBannerData({ name, profilePicUrl })
                setMessages([])
                openChatId.current = router.query.message
            })
        }
        if (socket.current && router.query.message) {
            loadMessages()
        }
    }, [router.query.message])

    const sendMessage = (msg) => {
        if (socket.current) {
            socket.current.emit("sendNewMsg", {
                userId: user._id,
                messageSendToUserId: openChatId.current,
                msg
            })
        }
    }

    // Confirming msg is sent and recieving a message
    useEffect(() => {
        if (socket.current) {
            socket.current.on("msgSent", ({ newMsg }) => {
                if (newMsg.reciever === openChatId.current) {
                    setMessages(prev => ([
                        ...prev,
                        newMsg
                    ]))
                    setChats(prev => {
                        const prevChat = prev.find(chat => chat.messagesWith === newMsg.reciever)
                        prevChat.lastMessage = newMsg.msg
                        prevChat.date = newMsg.date

                        return [...prev]
                    })
                }
            })
            socket.current.on("newMsgRecieved", async ({ newMsg }) => {
                let senderName
                if (newMsg.sender === openChatId.current) {
                    setMessages(prev => ([
                        ...prev,
                        newMsg
                    ]))
                    setChats(prev => {
                        const prevChat = prev.find(chat => chat.messagesWith === newMsg.sender)
                        prevChat.lastMessage = newMsg.msg
                        prevChat.date = newMsg.date
                        senderName = prevChat.name
                        return [...prev]
                    })
                } else {
                    const ifPreviouslyMessaged = chats.filter(chat => chat.messagesWith === newMsg.sender).length > 0
                    if (ifPreviouslyMessaged) {
                        setChats(prev => {
                            const prevChat = prev.find(chat => chat.messagesWith === newMsg.sender)
                            prevChat.lastMessage = newMsg.msg
                            prevChat.date = newMsg.date
                            senderName = prevChat.name
                            return [...prev]
                        })
                    } else {
                        const { name, profilePicUrl } = await getUserInfo(newMsg.sender)
                        senderName = name
                        const newChat = {
                            messagesWith: newMsg.sender,
                            name,
                            profilePicUrl,
                            lastMessage: newMsg.msg,
                            date: newMsg.date
                        }
                        setChats(prev => [newChat, ...prev])
                    }
                }
                newMsgSound(senderName)
            })
        }
    }, [])

    useEffect(() => {
        if (messages.length > 0) {
            scrollDivToBottom(divRef)
        }
    }, [messages])

    // useEffect(() => {
    //     if (document.title !== "Messages" && document.visibilityState === 'visible') {
    //         setTimeout(() => {
    //             document.title = "Messages"
    //         }, 2000)
    //     }
    // }, [document.title, document.visibilityState])

    const deleteMsg = (msgId) => {
        if (socket.current) {
            socket.current.emit("deleteMsg", {
                userId: user._id,
                messagesWith: openChatId.current,
                msgId
            })
            socket.current.on("msgDeleted", () => {
                setMessages(prev => prev.filter(msg => msg._id !== msgId))
            })
        }
    }

    const deleteChat = async (messagesWith) => {
        try {
            await axios.delete(`${baseUrl}/api/chats/${messagesWith}`, {
                headers: {
                    Authorization: Cookies.get("token")
                }
            })
            setChats(prev => prev.filter(chat => chat.messagesWith !== messagesWith))
            router.push(`/messages`, undefined, {
                shallow: true
            })
        } catch (err) {
            console.log(err)
        }
    }

    if (errorLoading) {
        return <NoMessages />
    }

    return (
        <div>
            <Segment padded basic size="large" style={{ marginTop: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Header
                        icon="home"
                        content="Go Back"
                        onClick={() => router.push('/')}
                        style={{ cursor: "pointer" }}
                    />
                    <div
                        style={{
                            marginBottom: "1rem"
                        }}
                    >
                        <ChatListSearch chats={chats} setChats={setChats} />
                    </div>
                </div>
                <Divider hidden />
                {chats.length > 0 ? (
                    <React.Fragment>
                        <Grid stackable>
                            <Grid.Column width={4}>
                                <Comment.Group size="big">
                                    <Segment
                                        raised
                                        style={{
                                            overflow: "auto",
                                            maxHeight: "32rem"
                                        }}
                                    >
                                        {chats.map((chat, index) => {
                                            return (
                                                <Chat
                                                    key={index}
                                                    chat={chat}
                                                    setChats={setChats}
                                                    connectedUsers={connectedUsers}
                                                    deleteChat={deleteChat}
                                                />
                                            )
                                        })}
                                    </Segment>
                                </Comment.Group>
                            </Grid.Column>
                            <Grid.Column width={12}>
                                {router.query.message && (
                                    <React.Fragment>
                                        <div
                                            style={{
                                                overflow: "auto",
                                                overflowX: "hidden",
                                                maxHeight: "35rem",
                                                height: "35rem",
                                                backgroundColor: "whitesmoke"
                                            }}
                                        >
                                            <React.Fragment>
                                                <div style={{ position: "sticky", top: "0" }}>
                                                    <Banner bannerData={bannerData} />
                                                </div>
                                                {messages.length > 0 && (
                                                    <React.Fragment>
                                                        {messages.map((message, index) => {
                                                            return (
                                                                <Message
                                                                    key={index}
                                                                    message={message}
                                                                    user={user}
                                                                    divRef={divRef}
                                                                    bannerProfilePic={bannerData.profilePicUrl}
                                                                    deleteMsg={deleteMsg}
                                                                />
                                                            )
                                                        })}
                                                    </React.Fragment>
                                                )}
                                            </React.Fragment>
                                        </div>
                                        <MessageInputField sendMessage={sendMessage} />
                                    </React.Fragment>
                                )}
                            </Grid.Column>
                        </Grid>
                    </React.Fragment>
                ) : <NoMessages />}
            </Segment>
        </div>
    )
}

Messages.getInitialProps = async (ctx) => {
    try {
        const { token } = parseCookies(ctx)
        const res = await axios.get(`${baseUrl}/api/chats`, {
            headers: {
                Authorization: token
            }
        })
        return { chatsData: res.data }
    } catch (err) {
        console.log(err)
        return { errorLoading: true }
    }
}

export default Messages
