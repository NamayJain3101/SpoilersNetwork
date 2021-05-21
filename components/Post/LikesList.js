import axios from 'axios'
import Cookies from 'js-cookie'
import Link from 'next/link'
import React, { useState } from 'react'
import { Image, List, Popup } from 'semantic-ui-react'
import baseUrl from '../../utils/baseUrl'
import catchErrors from '../../utils/catchErrors'
import { LikesPlaceHolder } from '../Layout/PlaceHolderGroup'

const LikesList = ({ postId, trigger }) => {
    const [likesList, setLikesList] = useState([])
    const [loading, setLoading] = useState(false)

    const getLikesList = async () => {
        setLoading(true)
        try {
            const res = await axios.get(`${baseUrl}/api/posts/like/${postId}`, {
                headers: {
                    Authorization: Cookies.get("token")
                }
            })
            setLikesList(res.data)
        } catch (err) {
            console.log(err)
            alert(catchErrors(err))
        }
        setLoading(false)
    }

    return (
        <React.Fragment>
            <Popup
                on="click"
                onClose={() => setLikesList([])}
                onOpen={() => getLikesList()}
                popperDependencies={[likesList]}
                trigger={trigger}
                wide
            >
                {loading ? <LikesPlaceHolder /> : (
                    <React.Fragment>
                        {likesList.length > 0 && (
                            <div
                                style={{
                                    overflow: "auto",
                                    maxHeight: "15rem",
                                    height: "15rem",
                                    minWidth: "210px"
                                }}
                            >
                                <List selection size="large">
                                    {likesList.map(like => {
                                        return (
                                            <List.Item key={like._id} style={{ display: "flex", alignItems: "center" }}>
                                                <Image avatar src={like.user.profilePicUrl} />
                                                <List.Content>
                                                    <Link href={`/${like.user.username}`}>
                                                        <List.Header as="a" content={like.user.name} />
                                                    </Link>
                                                </List.Content>
                                            </List.Item>
                                        )
                                    })}
                                </List>
                            </div>
                        )}
                    </React.Fragment>
                )}
            </Popup>
        </React.Fragment>
    )
}

export default LikesList
