import axios from 'axios'
import Cookies from 'js-cookie'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Button, Image, List } from 'semantic-ui-react'
import baseUrl from '../../utils/baseUrl'
import { followUser, unfollowUser } from '../../utils/profileActions'
import { ErrorMessage, NoFollowData } from '../Layout/NoData'
import Spinner from '../Layout/Spinner'

const Followers = ({ user, loggedUserFollowStats, setLoggedUserFollowStats, profileUserId }) => {
    const [followers, setFollowers] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [followError, setFollowError] = useState(null)
    const [followLoading, setFollowLoading] = useState(false)

    const getFollowers = async () => {
        setLoading(true)
        try {
            const res = await axios.get(`${baseUrl}/api/profile/followers/${profileUserId}`, {
                headers: {
                    Authorization: Cookies.get("token")
                }
            })
            setFollowers(res.data)
        } catch (err) {
            console.log(err)
            setError("Error Loading Followers")
        }
        setLoading(false)
    }

    useEffect(() => {
        getFollowers()
    }, [])

    useEffect(() => {
        getFollowers()
    }, [profileUserId])

    return (
        <React.Fragment>
            {followError && <ErrorMessage header="Error" content={followError} />}
            {loading ? <Spinner /> : error ? <ErrorMessage header="Error" content={error} /> : (
                followers.length > 0 ? (
                    followers.map(profileFollower => {
                        const isFollowing = loggedUserFollowStats.following.length > 0 && loggedUserFollowStats.following.filter(
                            follow => follow.user === profileFollower.user._id
                        ).length > 0
                        return (
                            <React.Fragment key={profileFollower.user._id}>
                                <List divided verticalAlign="middle">
                                    <List.Item>
                                        <List.Content floated="right">
                                            {profileFollower.user._id !== user._id && (
                                                <Button
                                                    color={isFollowing ? 'instagram' : 'twitter'}
                                                    content={isFollowing ? 'Following' : 'Follow'}
                                                    icon={isFollowing ? 'check' : 'add user'}
                                                    disabled={followLoading}
                                                    onClick={
                                                        async () => {
                                                            setFollowLoading(true)
                                                            if (isFollowing) {
                                                                await unfollowUser(profileFollower.user._id, setLoggedUserFollowStats, setFollowError)
                                                            } else {
                                                                await followUser(profileFollower.user._id, setLoggedUserFollowStats, setFollowError)
                                                            }
                                                            setFollowLoading(false)
                                                        }
                                                    }
                                                />
                                            )}
                                        </List.Content>
                                        <Image avatar src={profileFollower.user.profilePicUrl} />
                                        <List.Content>
                                            <Link href={`/${profileFollower.user.username}`}>
                                                <a>{profileFollower.user.name}</a>
                                            </Link>
                                        </List.Content>
                                    </List.Item>
                                </List>
                            </React.Fragment>
                        )
                    })
                ) : (
                    <React.Fragment>
                        <NoFollowData followersComponent={true} />
                    </React.Fragment>
                )
            )}
        </React.Fragment>
    )
}

export default Followers
