import axios from 'axios'
import { parseCookies } from 'nookies'
import React, { useEffect, useState } from 'react'
import baseUrl from '../utils/baseUrl'
import { ErrorMessage, NoNotifications } from '../components/Layout/NoData'
import Cookies from 'js-cookie'
import { Container, Divider, Feed, Segment } from 'semantic-ui-react'
import LikedNotification from '../components/Notifications/LikedNotification'
import CommentNotification from '../components/Notifications/CommentNotification'
import FollowerNotification from '../components/Notifications/FollowerNotification'

const Notifications = ({ notifications, errorLoading, userFollowStats }) => {
    const [loggedUserFollowStats, setLoggedUserFollowStats] = useState(userFollowStats)
    const [followError, setFollowError] = useState(null)

    if (errorLoading) {
        return <NoNotifications />
    }

    useEffect(() => {
        const notificationsRead = async () => {
            try {
                await axios.post(`${baseUrl}/api/notifications`, {}, {
                    headers: {
                        Authorization: Cookies.get("token")
                    }
                })
            } catch (err) {
                console.log(err)
            }
        }
        notificationsRead();
    }, [])

    return (
        <React.Fragment>
            {followError !== null && (
                <ErrorMessage header="Oops!!" content={followError} />
            )}
            <Container style={{ marginTop: "1.5rem" }}>
                {notifications.length > 0 ? (
                    <React.Fragment>
                        <Segment color="teal" raised>
                            <div
                                style={{
                                    maxHeight: "40rem",
                                    overflow: "auto",
                                    height: "40rem",
                                    position: "relative",
                                    width: "100%"
                                }}
                            >
                                <Feed size="small">
                                    {notifications.map(notification => {
                                        return (
                                            <React.Fragment key={notification._id}>
                                                {notification.type === "newLike" && notification.post !== null && <LikedNotification notification={notification} />}
                                                {notification.type === "newComment" && notification.post !== null && <CommentNotification notification={notification} />}
                                                {notification.type === "newFollower" && (
                                                    <FollowerNotification
                                                        loggedUserFollowStats={loggedUserFollowStats}
                                                        setLoggedUserFollowStats={setLoggedUserFollowStats}
                                                        notification={notification}
                                                        setFollowError={setFollowError}
                                                    />
                                                )}
                                            </React.Fragment>
                                        )
                                    })}
                                </Feed>
                            </div>
                        </Segment>
                    </React.Fragment>
                ) : (
                    <NoNotifications />
                )}
                <Divider hidden />
            </Container>
        </React.Fragment>
    )
}

Notifications.getInitialProps = async (ctx) => {
    try {
        const { token } = parseCookies(ctx)
        const res = await axios.get(`${baseUrl}/api/notifications`, {
            headers: {
                Authorization: token
            }
        })
        return { notifications: res.data }
    } catch (err) {
        console.log(err)
        return { errorLoading: true }
    }
}

export default Notifications
