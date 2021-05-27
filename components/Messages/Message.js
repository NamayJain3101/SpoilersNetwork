import React, { useState } from 'react'
import { Image, Popup } from 'semantic-ui-react'
import { calculateTime } from '../../utils/calculateTime'

const Message = ({ message, user, deleteMsg, bannerProfilePic, divRef }) => {
    const [deleteIcon, setDeleteIcon] = useState(false)
    const ifYouSender = message.sender === user._id

    return (
        <React.Fragment>
            <div className="bubbleWrapper" ref={divRef}>
                <div className={ifYouSender ? "inlineContainer own" : "inlineContainer"} style={{ cursor: "pointer" }} onClick={() => ifYouSender && setDeleteIcon(!deleteIcon)}>
                    <img className="inlineIcon" src={ifYouSender ? user.profilePicUrl : bannerProfilePic} alt="Message" />
                    <div className={ifYouSender ? "ownBubble own" : "otherBubble other"}>
                        {message.msg}
                    </div>
                    {deleteIcon && (
                        <Popup
                            trigger={
                                <Image
                                    src="/deleteIcon.svg"
                                    size="mini"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => deleteMsg(message._id)}
                                />
                            }
                            content="Delete for yourself"
                            position="top right"
                        />
                    )}
                </div>
                <span className={ifYouSender ? "own" : "other"}>
                    {calculateTime(message.date)}
                </span>
            </div>
        </React.Fragment>
    )
}

export default Message
