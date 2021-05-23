import axios from 'axios'
import Cookies from 'js-cookie'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Button, Image, List } from 'semantic-ui-react'
import baseUrl from '../../utils/baseUrl'
import { followUser, unfollowUser } from '../../utils/profileActions'
import { ErrorMessage, NoFollowData } from '../Layout/NoData'
import Spinner from '../Layout/Spinner'

const Following = ({ user, loggedUserFollowStats, setLoggedUserFollowStats, profileUserId }) => {
    const [following, setFollowing] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [followError, setFollowError] = useState(null)
    const [followLoading, setFollowLoading] = useState(false)

    const getFollowing = async () => {
        setLoading(true)
        try {
            const res = await axios.get(`${baseUrl}/api/profile/following/${profileUserId}`, {
                headers: {
                    Authorization: Cookies.get("token")
                }
            })
            setFollowing(res.data)
        } catch (err) {
            console.log(err)
            setError("Error Loading Following")
        }
        setLoading(false)
    }

    useEffect(() => {
        getFollowing()
    }, [])

    useEffect(() => {
        getFollowing()
    }, [profileUserId, loggedUserFollowStats])

    return (
        <React.Fragment>
            {followError && <ErrorMessage header="Error" content={followError} />}
            {loading ? <Spinner /> : error ? <ErrorMessage header="Error" content={error} /> : (
                following.length > 0 ? (
                    following.map(profileFollowing => {
                        const isFollowing = loggedUserFollowStats.following.length > 0 && loggedUserFollowStats.following.filter(
                            follow => follow.user === profileFollowing.user._id
                        ).length > 0
                        return (
                            <React.Fragment key={profileFollowing.user._id}>
                                <List divided verticalAlign="middle">
                                    <List.Item>
                                        <List.Content floated="right">
                                            {profileFollowing.user._id !== user._id && (
                                                <Button
                                                    color={isFollowing ? 'instagram' : 'twitter'}
                                                    content={isFollowing ? 'Following' : 'Unfollow'}
                                                    icon={isFollowing ? 'check' : 'add user'}
                                                    disabled={followLoading}
                                                    onClick={
                                                        async () => {
                                                            setFollowLoading(true)
                                                            if (isFollowing) {
                                                                await unfollowUser(profileFollowing.user._id, setLoggedUserFollowStats, setFollowError)
                                                            } else {
                                                                await followUser(profileFollowing.user._id, setLoggedUserFollowStats, setFollowError)
                                                            }
                                                            setFollowLoading(false)
                                                        }
                                                    }
                                                />
                                            )}
                                        </List.Content>
                                        <Image avatar src={profileFollowing.user.profilePicUrl} />
                                        <List.Content>
                                            <Link href={`/${profileFollowing.user.username}`}>
                                                <a>{profileFollowing.user.name}</a>
                                            </Link>
                                        </List.Content>
                                    </List.Item>
                                </List>
                            </React.Fragment>
                        )
                    })
                ) : (
                    <React.Fragment>
                        <NoFollowData followingComponent={true} />
                    </React.Fragment>
                )
            )}
        </React.Fragment>
    )
}

export default Following
