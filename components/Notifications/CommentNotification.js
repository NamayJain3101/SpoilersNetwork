import React from 'react'
import { Divider, Feed } from 'semantic-ui-react'
import { calculateTime } from '../../utils/calculateTime'
import Link from 'next/link'

const CommentNotification = ({ notification }) => {
    return (
        <React.Fragment>
            <Feed.Event>
                <Feed.Label image={notification.user.profilePicUrl} />
                <Feed.Content>
                    <Feed.Summary>
                        <React.Fragment>
                            <Link href={`${notification.user.username}`}>
                                <Feed.User as="a">{notification.user.name}</Feed.User>
                            </Link>
                            {" "} commented on your {" "}
                            <Link href={`/post/${notification.post._id}`}>
                                <Feed.Content as="a">Post</Feed.Content>
                            </Link>
                            <Feed.Date>{calculateTime(notification.date)}</Feed.Date>
                        </React.Fragment>
                    </Feed.Summary>
                    {notification.post.picUrl && (
                        <Feed.Extra images>
                            <Link href={`/post/${notification.post._id}`}>
                                <a>
                                    <img src={notification.post.picUrl} alt="Notification" />
                                </a>
                            </Link>
                        </Feed.Extra>
                    )}
                    <Feed.Extra style={{ marginTop: "5px" }} text>
                        <strong>{notification.text}</strong>
                    </Feed.Extra>
                </Feed.Content>
            </Feed.Event>
            <Divider />
        </React.Fragment>
    )
}

export default CommentNotification
