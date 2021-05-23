import React, { useState } from 'react'
import Link from 'next/link'
import PostComments from '../../components/Post/PostComments'
import CommentInputField from '../../components/Post/CommentInputField'
import { Button, Card, Container, Divider, Header, Icon, Image, Popup, Segment } from 'semantic-ui-react'
import { calculateTime } from '../../utils/calculateTime'
import { deletePost, likePost } from '../../utils/postActions'
import LikesList from '../../components/Post/LikesList'
import axios from 'axios'
import { ErrorMessage, NoPostFound } from '../../components/Layout/NoData'
import { parseCookies } from 'nookies'
import baseUrl from '../../utils/baseUrl'

const PostPage = ({ post, errorLoading, user }) => {
    const [likes, setLikes] = useState(post.likes)
    const [comments, setComments] = useState(post.comments)
    const [error, setError] = useState(null)

    const isLiked = likes.length > 0 && likes.filter(like => like.user === user._id).length > 0

    if (errorLoading) {
        return <NoPostFound />
    }

    return (
        <React.Fragment>
            {error && (
                <ErrorMessage header="Oops!" content={error} />
            )}
            <Container text>
                <Segment basic>
                    <Card color="teal" fluid>
                        {post.picUrl && (
                            <Image
                                src={post.picUrl}
                                alt="Post Image"
                                style={{ cursor: "pointer" }}
                                floated="left"
                                wrapped
                                ui={false}
                            />
                        )}
                        <Card.Content>
                            <Image
                                floated="left"
                                src={post.user.profilePicUrl}
                                avatar
                            />
                            {(user.role === "root" || post.user._id === user._id) && (
                                <React.Fragment>
                                    <Popup
                                        on="click"
                                        position="top right"
                                        trigger={
                                            <Image
                                                src="/deleteIcon.svg"
                                                style={{ cursor: "pointer" }}
                                                size="mini"
                                                floated="right"
                                            />
                                        }
                                    >
                                        <Header as="h4" content="Are you sure?" />
                                        <p>This action is reversible</p>
                                        <Button
                                            color="red"
                                            icon="trash"
                                            content="delete"
                                            onClick={() => deletePost(post._id, setPosts, setShowToaster, setError)}
                                        />
                                    </Popup>
                                </React.Fragment>
                            )}
                            <Card.Header>
                                <Link href={`/${post.user.username}`}>
                                    <a>{post.user.name}</a>
                                </Link>
                            </Card.Header>
                            <Card.Meta>
                                {calculateTime(post.createdAt)}
                            </Card.Meta>
                            {post.location && (
                                <Card.Meta content={post.location} />
                            )}
                            <Card.Description
                                style={{
                                    fontSize: "17px",
                                    letterSpacing: "1px",
                                    wordSpacing: "4px"
                                }}
                            >
                                {post.text}
                            </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <Icon
                                name={isLiked ? "heart" : "heart outline"}
                                color="red"
                                size="large"
                                style={{ cursor: "pointer" }}
                                onClick={() => likePost(post._id, user._id, setLikes, isLiked ? false : true)}
                            />
                            <LikesList
                                postId={post._id}
                                trigger={likes.length > 0 && (
                                    <span className="spanLikesList">
                                        {`${likes.length} ${likes.length === 1 ? "like" : "likes"}`}
                                    </span>
                                )}
                            />
                            <Icon
                                name={comments.length > 0 ? "comment" : "comment outline"}
                                color="blue"
                                size="large"
                                style={{ cursor: "pointer", marginLeft: "1rem" }}
                            />
                            {comments.length > 0 ? (
                                <span className="spanLikesList">
                                    {`${comments.length} ${comments.length === 1 ? "comment" : "comments"}`}
                                </span>
                            ) : (
                                <span className="spanLikesList">
                                    0 comments
                                </span>
                            )}
                            {comments.length > 0 && comments.map((comment, index) => {
                                return (
                                    <PostComments
                                        key={comment._id}
                                        comment={comment}
                                        postId={post._id}
                                        user={user}
                                        setComments={setComments}
                                    />
                                )
                            })}
                            <Divider hidden />
                            <CommentInputField user={user} postId={post._id} setComments={setComments} />
                        </Card.Content>
                    </Card>
                </Segment>
                <Divider hidden />
            </Container>
        </React.Fragment>
    )
}

PostPage.getInitialProps = async (ctx) => {
    try {
        const { postId } = ctx.query
        const { token } = parseCookies(ctx)
        const res = await axios.get(`${baseUrl}/api/posts/${postId}`, {
            headers: {
                Authorization: token
            }
        })
        return { post: res.data }
    } catch (err) {
        console.log(err)
        return { errorLoading: true }
    }
}

export default PostPage
