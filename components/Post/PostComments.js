import Link from 'next/link'
import React, { useState } from 'react'
import { Comment, Image } from 'semantic-ui-react'
import { calculateTime } from '../../utils/calculateTime'
import { deleteComment } from '../../utils/postActions'

const PostComments = ({ comment, postId, user, setComments }) => {
    const [disabled, setDisabled] = useState(false)


    return (
        <React.Fragment>
            <Comment.Group>
                <Comment>
                    <Comment.Avatar src={comment.user.profilePicUrl} />
                    <Comment.Content style={{ display: "flex", justifyContent: "space-between" }}>
                        <div>
                            <Link href={`/${comment.user.username}`}>
                                <Comment.Author as="a" style={{ color: "#4183c4" }}>
                                    {comment.user.name}
                                </Comment.Author>
                            </Link>
                            <Comment.Metadata>
                                <div>{calculateTime(comment.date)}</div>
                            </Comment.Metadata>
                            <Comment.Text>{comment.text}</Comment.Text>
                        </div>
                        <Comment.Actions>
                            <Comment.Action>
                                {(user.role === "root" || comment.user._id === user._id) && (
                                    <Image
                                        src="/deleteIcon.svg"
                                        style={{ cursor: "pointer", marginLeft: "2rem" }}
                                        size="mini"
                                        disabled={disabled}
                                        onClick={() => {
                                            setDisabled(true)
                                            deleteComment(postId, comment._id, setComments)
                                            setDisabled(false)
                                        }}
                                    />
                                )}
                            </Comment.Action>
                        </Comment.Actions>
                    </Comment.Content>
                </Comment>
            </Comment.Group>
        </React.Fragment>
    )
}

export default PostComments
