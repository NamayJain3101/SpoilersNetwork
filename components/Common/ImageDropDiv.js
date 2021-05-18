import React from 'react'
import { Form, Header, Icon, Image, Segment } from 'semantic-ui-react'

const ImageDropDiv = ({ highlighted, setHighlighted, inputRef, handleChange, mediaPreview, setMediaPreview, setMedia }) => {
    return (
        <React.Fragment>
            <Form.Field>
                <Segment placeholder basic secondary>
                    <input
                        style={{ display: "none" }}
                        type="file"
                        accept="image/*"
                        onChange={handleChange}
                        name="media"
                        ref={inputRef}
                    />
                    <div
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
                        {mediaPreview === null ? (
                            <React.Fragment>
                                <Segment
                                    color={highlighted ? "green" : "yellow"}
                                    placeholder
                                    basic
                                >
                                    <Header icon>
                                        <Icon
                                            name="file"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => inputRef.current.click()}
                                        />
                                        Drag n Drop or Click to Upload Image
                                    </Header>
                                </Segment>
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                <Segment color="green" placeholder basic>
                                    <Image
                                        src={mediaPreview}
                                        size="medium"
                                        centered
                                        style={{ cursor: "pointer" }}
                                        onClick={() => inputRef.current.click()}
                                    />
                                </Segment>
                            </React.Fragment>
                        )}
                    </div>
                </Segment>
            </Form.Field>
        </React.Fragment>
    )
}

export default ImageDropDiv
