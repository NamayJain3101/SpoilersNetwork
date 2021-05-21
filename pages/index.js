import React, { useEffect, useState } from 'react'
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

const Index = ({ user, userFollowStats, postsData, errorLoading }) => {
    const [posts, setPosts] = useState(postsData)
    const [showToaster, setShowToaster] = useState(false)

    const [hasMore, setHasMore] = useState(true)
    const [pageNo, setPageNo] = useState(2)

    useEffect(() => {
        document.title = `Welcome, ${user.name.split(" ")[0]}`
    }, [])

    useEffect(() => {
        showToaster && setTimeout(() => {
            setShowToaster(false)
        }, [3000])
    }, [showToaster])

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
            {showToaster && <PostDeleteToastr />}
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
