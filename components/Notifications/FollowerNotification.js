import React, { useState } from 'react'
import { Button, Divider, Feed } from 'semantic-ui-react'
import { calculateTime } from '../../utils/calculateTime'
import Link from 'next/link'
import { followUser, unfollowUser } from '../../utils/profileActions'

const FollowerNotification = ({ loggedUserFollowStats, setLoggedUserFollowStats, notification, setFollowError }) => {
    const [disabled, setDisabled] = useState(false)
    const isFollowing = loggedUserFollowStats.following.length > 0 && (
        loggedUserFollowStats.following.filter(follow => {
            return follow.user === notification.user._id
        }).length > 0
    )

    return (
        <React.Fragment>
            <Feed.Event>
                <Feed.Label image={notification.user.profilePicUrl} />
                <Feed.Content style={{ position: "relative" }}>
                    <Feed.Summary>
                        <React.Fragment>
                            <Link href={`${notification.user.username}`}>
                                <Feed.User as="a">{notification.user.name}</Feed.User>
                            </Link>
                            {" "} started following you {" "}
                            <Feed.Date>{calculateTime(notification.date)}</Feed.Date>
                        </React.Fragment>
                    </Feed.Summary>
                    <div
                        style={{
                            position: "absolute",
                            right: "0.5rem",
                            top: "50%",
                            transform: "translateY(-50%)"
                        }}
                    >
                        <Button
                            size="small"
                            compact
                            icon={isFollowing ? "check circle" : "add user"}
                            color={isFollowing ? "instagram" : "twitter"}
                            onClick={async () => {
                                setDisabled(true)
                                isFollowing
                                    ? await unfollowUser(notification.user._id, setLoggedUserFollowStats, setFollowError)
                                    : await followUser(notification.user._id, setLoggedUserFollowStats, setFollowError)
                                setDisabled(false)
                            }}
                            disabled={disabled}
                        />
                    </div>
                </Feed.Content>
            </Feed.Event>
            <Divider />
        </React.Fragment>
    )
}

export default FollowerNotification
