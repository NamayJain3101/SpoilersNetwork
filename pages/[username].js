import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import baseUrl from '../utils/baseUrl'
import { parseCookies } from 'nookies'
import { ErrorMessage, NoProfile, NoProfilePosts } from '../components/Layout/NoData'
import Cookies from 'js-cookie'
import { Divider, Grid } from 'semantic-ui-react'
import { EndMessage, PlaceHolderPosts } from '../components/Layout/PlaceHolderGroup'
import { PostDeleteToastr } from '../components/Layout/Toastr'
import CardPost from '../components/Post/CardPost'
import ProfileMenuTabs from '../components/Profile/ProfileMenuTabs'
import ProfileHeader from '../components/Profile/ProfileHeader'
import InfiniteScroll from 'react-infinite-scroll-component'
import Followers from '../components/Profile/Followers'
import Following from '../components/Profile/Following'
import UpdateProfile from '../components/Profile/UpdateProfile'
import Settings from '../components/Profile/Settings'

const ProfilePage = ({ profile, followersLength, followingLength, errorLoading, user, userFollowStats }) => {
    const router = useRouter()

    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [showToaster, setShowToaster] = useState(false)

    const [loggedUserFollowStats, setLoggedUserFollowStats] = useState(userFollowStats)
    const ownAccount = profile.user._id === user._id

    const [activeItem, setActiveItem] = useState('profile')
    const handleItemClick = (item) => {
        setActiveItem(item)
    }

    const [pageNo, setPageNo] = useState(2)
    const [hasMore, setHasMore] = useState(true)

    const fetchDataOnScroll = async () => {
        try {
            const { username } = router.query
            const res = await axios.get(`${baseUrl}/api/profile/posts/${username}`, {
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

    const getPosts = async () => {
        setLoading(true)
        try {
            const { username } = router.query
            const token = Cookies.get("token")
            const res = await axios.get(`${baseUrl}/api/profile/posts/${username}`, {
                headers: {
                    Authorization: token
                },
                params: { pageNo: 1 }
            })
            setPosts(res.data)
        } catch (err) {
            console.log(err)
            setError("Error Loading Posts")
        }
        setLoading(false)
    }

    useEffect(() => {
        getPosts()
        setActiveItem("profile")
    }, [router.query.username])

    useEffect(() => {
        showToaster && setTimeout(() => {
            setShowToaster(false)
        }, 3000)
    }, [showToaster])

    if (errorLoading) {
        return <NoProfile />
    }

    return (
        <React.Fragment>
            {showToaster && <PostDeleteToastr />}
            <Grid stackable>
                <Grid.Row>
                    <Grid.Column>
                        <ProfileMenuTabs
                            activeItem={activeItem}
                            handleItemClick={handleItemClick}
                            followersLength={followersLength}
                            followingLength={followingLength}
                            ownAccount={ownAccount}
                            loggedUserFollowStats={loggedUserFollowStats}
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        {activeItem === 'profile' && (
                            <React.Fragment>
                                <ProfileHeader
                                    profile={profile}
                                    ownAccount={ownAccount}
                                    loggedUserFollowStats={loggedUserFollowStats}
                                    setLoggedUserFollowStats={setLoggedUserFollowStats}
                                />
                                <Divider hidden />
                                {loading ? <PlaceHolderPosts /> : error ? (
                                    <React.Fragment>
                                        <ErrorMessage header="Error" content={error} />
                                    </React.Fragment>
                                ) : (posts.length > 0) ? (
                                    <InfiniteScroll
                                        hasMore={hasMore}
                                        next={() => fetchDataOnScroll()}
                                        loader={<PlaceHolderPosts />}
                                        endMessage={<EndMessage header="You have seen everything!!" message="No More Posts" />}
                                        dataLength={posts.length}
                                    >
                                        {posts.map(post => {
                                            return (
                                                <React.Fragment key={post._id}>
                                                    <CardPost
                                                        post={post}
                                                        user={user}
                                                        setPosts={setPosts}
                                                        setShowToaster={setShowToaster}
                                                    />
                                                </React.Fragment>
                                            )
                                        })}
                                    </InfiniteScroll>
                                ) : <NoProfilePosts />}
                            </React.Fragment>
                        )}
                        {activeItem === "followers" && (
                            <Followers
                                user={user}
                                loggedUserFollowStats={loggedUserFollowStats}
                                setLoggedUserFollowStats={setLoggedUserFollowStats}
                                profileUserId={profile.user._id}
                            />
                        )}
                        {activeItem === "following" && (
                            <Following
                                user={user}
                                loggedUserFollowStats={loggedUserFollowStats}
                                setLoggedUserFollowStats={setLoggedUserFollowStats}
                                profileUserId={profile.user._id}
                            />
                        )}
                        {activeItem === "updateProfile" && (
                            <UpdateProfile
                                profile={profile}
                            />
                        )}
                        {activeItem === "settings" && (
                            <Settings
                                newMessagePopup={user.newMessagePopup}
                            />
                        )}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </React.Fragment>
    )
}

ProfilePage.getInitialProps = async (ctx) => {
    try {
        const { username } = ctx.query
        const { token } = parseCookies(ctx)
        const res = await axios.get(`${baseUrl}/api/profile/${username}`, {
            headers: {
                Authorization: token
            },
            params: { pageNo: 1 }
        })
        const { profile, followersLength, followingLength } = res.data
        return {
            profile,
            followersLength,
            followingLength
        }
    } catch (err) {
        console.log(err)
        return { errorLoading: true }
    }
}

export default ProfilePage
