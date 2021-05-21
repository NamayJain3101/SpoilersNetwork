import Link from 'next/link'
import React from 'react'
import { Card, Divider, Grid, Icon, Image, Modal } from 'semantic-ui-react'
import { calculateTime } from '../../utils/calculateTime'
import { likePost } from '../../utils/postActions'
import CommentInputField from './CommentInputField'
import LikesList from './LikesList'
import PostComments from './PostComments'

const ImageModal = ({ post, user, isLiked, likes, setLikes, comments, setComments }) => {
    return (
        <React.Fragment>
            <Grid columns={2} stackable relaxed>
                <Grid.Column style={{ display: "flex", alignItems: "center" }}>
                    <Modal.Content image style={{ display: "flex", alignItems: "center" }}>
                        <Image bordered fluid size="large" src={post.picUrl} />
                    </Modal.Content>
                </Grid.Column>
                <Grid.Column>
                    <Card fluid>
                        <Card.Content>
                            <Image floated="left" avatar src={post.user.profilePicUrl} />
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
                            <Divider hidden />
                            <div
                                style={{
                                    overflow: "auto",
                                    height: comments.length > 2 ? "130px" : "90px",
                                    marginBottom: "1rem"
                                }}
                            >
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
                            </div>
                            <CommentInputField postId={post._id} user={user} setComments={setComments} />
                        </Card.Content>
                    </Card>
                </Grid.Column>
            </Grid>
        </React.Fragment>
    )
}

export default ImageModal
