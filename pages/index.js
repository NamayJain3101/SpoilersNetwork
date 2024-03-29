import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import baseUrl from '../utils/baseUrl'
import { parseCookies } from 'nookies'
import { NoPosts } from '../components/Layout/NoData'
import { PostDeleteToastr } from '../components/Layout/Toastr'
import CreatePost from '../components/Post/CreatePost'
import CardPost from '../components/Post/CardPost'
import { Segment } from 'semantic-ui-react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { EndMessage, PlaceHolderPosts } from '../components/Layout/PlaceHolderGroup'
import Cookies from 'js-cookie'
import io from 'socket.io-client'
import { getUserInfo } from '../utils/getUserInfo'
import MessageNotificationModal from '../components/Messages/MessageNotificationModal'
import { newMsgSound } from '../utils/newMsgSound'
import NotificationPortal from '../components/Notifications/NotificationPortal'

const Index = ({ user, postsData, errorLoading }) => {
    const [posts, setPosts] = useState(postsData)
    const [showToaster, setShowToaster] = useState(false)

    const [hasMore, setHasMore] = useState(true)
    const [pageNo, setPageNo] = useState(2)

    const socket = useRef()

    const [newMsgRecieved, setNewMsgRecieved] = useState(null)
    const [newMsgModal, setNewMsgModal] = useState(false)

    const [newNotification, setNewNotification] = useState(null)
    const [notificationPopup, setNotificationPopup] = useState(false)

    useEffect(() => {
        document.title = `Welcome, ${user.name.split(" ")[0]}`
        if (!socket.current) {
            socket.current = io(baseUrl)
        }
        if (socket.current) {
            socket.current.emit("join", { userId: user._id })
            socket.current.on("newMsgRecieved", async ({ newMsg }) => {
                const { name, profilePicUrl } = await getUserInfo(newMsg.sender)
                if (user.newMessagePopup) {
                    setNewMsgRecieved({ ...newMsg, senderName: name, senderProfilePic: profilePicUrl })
                    setNewMsgModal(true)
                }
                newMsgSound(name)
            })
        }
        return () => {
            if (socket.current) {
                socket.current.emit("disconnect")
                socket.current.off()
            }
        }
    }, [])

    useEffect(() => {
        showToaster && setTimeout(() => {
            setShowToaster(false)
        }, [3000])
    }, [showToaster])

    useEffect(() => {
        if (socket.current) {
            socket.current.on("newNotificationRecieved", ({ name, username, profilePicUrl, postId }) => {
                setNewNotification({
                    name,
                    profilePicUrl,
                    username,
                    postId
                })
                setNotificationPopup(true)
            })
        }
    }, [])

    const fetchDataOnScroll = async () => {
        try {
            const res = await axios.get(`${baseUrl}/api/posts`, {
                headers: {
                    Authorization: Cookies.get("token")
                },
                params: { pageNo }
            })
            if (res.data.length === 0) {
                setHasMore(false)
            }
            setPosts(posts => ([...posts, ...res.data]))
            setPageNo(page => page + 1)
        } catch (err) {
            console.log(err)
            alert('Error Fetching Posts')
        }
    }

    return (
        <React.Fragment>
            {notificationPopup && newNotification !== null && (
                <NotificationPortal
                    newNotification={newNotification}
                    notificationPopup={notificationPopup}
                    setNotificationPopup={setNotificationPopup}
                />
            )}
            {showToaster && <PostDeleteToastr />}
            {newMsgModal && newMsgRecieved !== null && (
                <MessageNotificationModal
                    socket={socket.current}
                    setNewMsgModal={setNewMsgModal}
                    newMsgModal={newMsgModal}
                    newMsgRecieved={newMsgRecieved}
                    user={user}
                />
            )}
            <Segment>
                <CreatePost user={user} setPosts={setPosts} />
                {posts.length === 0 || errorLoading ? (
                    <NoPosts />
                ) : (
                    <InfiniteScroll
                        hasMore={hasMore}
                        next={() => fetchDataOnScroll()}
                        loader={<PlaceHolderPosts />}
                        endMessage={<EndMessage header="You have seen everything!!" message="No More Posts" />}
                        dataLength={posts.length}
                    >
                        {posts && posts.length > 0 && posts.map(post => {
                            return (
                                <CardPost
                                    key={post._id}
                                    socket={socket}
                                    post={post}
                                    user={user}
                                    setPosts={setPosts}
                                    setShowToaster={setShowToaster}
                                />
                            )
                        })}
                    </InfiniteScroll>
                )}
            </Segment>
        </React.Fragment>
    )
}

Index.getInitialProps = async (ctx) => {
    try {
        const { token } = parseCookies(ctx)
        const res = await axios.get(`${baseUrl}/api/posts`, {
            headers: {
                Authorization: token
            },
            params: { pageNo: 1 }
        })
        return { postsData: res.data }
    } catch (err) {
        console.log(err)
        return { errorLoading: true }
    }
}

export default Index
