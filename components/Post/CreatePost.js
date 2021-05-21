import React, { useRef, useState } from 'react'
import { Button, Divider, Form, Icon, Image, Message } from 'semantic-ui-react'
import { submitNewPost } from '../../utils/postActions'
import { uploadPic } from '../../utils/uploadPicToCloudinary'

const CreatePost = ({ user, setPosts }) => {
    const [newPost, setNewPost] = useState({
        text: "",
        location: ""
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [highlighted, setHighlighted] = useState(false)
    const [media, setMedia] = useState(null)
    const [mediaPreview, setMediaPreview] = useState(null)

    const inputRef = useRef()

    const handleChange = (e) => {
        const { name, value, files } = e.target
        if (name === "media") {
            setMedia(files[0])
            setMediaPreview(URL.createObjectURL(files[0]))
        }
        setNewPost(post => ({
            ...post,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        let picUrl, publicId
        if (media !== null) {
            const res = await uploadPic(media)
            picUrl = res.url
            publicId = res.publicId
            if (!picUrl) {
                setLoading(false)
                return setError("Error Uploading Image")
            }
        }
        await submitNewPost(newPost.text, newPost.location, picUrl, publicId, setPosts, setNewPost, setError)
        setMediaPreview(null)
        setMedia(null)
        setLoading(false)
    }

    return (
        <React.Fragment>
            <Form error={error !== null} onSubmit={handleSubmit}>
                <Message
                    error
                    onDismiss={() => setError(null)}
                    content={error}
                    header="Oops!"
                />
                <Form.Group>
                    <Image src={user.profilePicUrl} avatar circular inline />
                    <Form.TextArea
                        placeholder="Whats Happening"
                        name="text"
                        value={newPost.text}
                        onChange={handleChange}
                        rows={4}
                        width={14}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Input
                        value={newPost.location}
                        name="location"
                        onChange={handleChange}
                        label="Add Location"
                        icon="map marker alternate"
                        placeholder="Want to add location"
                    />
                </Form.Group>
                <input
                    type="file"
                    ref={inputRef}
                    onChange={handleChange}
                    name="media"
                    style={{ display: "none" }}
                    accept="image/*"
                />
                <div
                    onClick={() => inputRef.current.click()}
                    style={{
                        textAlign: "center",
                        height: "150px",
                        width: "150px",
                        border: "dotted",
                        paddingTop: media === null && "60px",
                        cursor: 'pointer',
                        borderColor: highlighted ? "green" : "black"
                    }}
                    onDragOver={(e) => {
                        e.preventDefault()
                        setHighlighted(true)
                    }}
                    onDragLeave={(e) => {
                        e.preventDefault()
                        setHighlighted(false)
                    }}
                    onDrop={(e) => {
                        e.preventDefault()
                        setHighlighted(true)
                        const droppedFile = Array.from(e.dataTransfer.files)
                        setMedia(droppedFile[0])
                        setMediaPreview(URL.createObjectURL(droppedFile[0]))
                    }}
                >
                    {media === null ? (
                        <React.Fragment>
                            <Icon
                                name="plus"
                                size="big"
                            />
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <Image
                                src={mediaPreview}
                                alt="Post Image"
                                centered
                                size="medium"
                                style={{
                                    height: "150px",
                                    width: "150px"
                                }}
                            />
                        </React.Fragment>
                    )}
                </div>
                <Divider hidden />
                <Button
                    circular
                    disabled={newPost.text === "" || loading}
                    content={<strong>Post</strong>}
                    style={{
                        backgroundColor: "#1da1f2",
                        color: "white"
                    }}
                    icon="send"
                    loading={loading}
                />
            </Form>
            <Divider hidden />
            <Divider />
        </React.Fragment>
    )
}

export default CreatePost
