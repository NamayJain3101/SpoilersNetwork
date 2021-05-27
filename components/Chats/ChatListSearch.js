import React, { useState } from 'react'
import baseUrl from '../../utils/baseUrl'
import axios from "axios"
import { Image, List, Search } from 'semantic-ui-react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'

let cancel

const ChatListSearch = ({ chats, setChats }) => {
    const router = useRouter()

    const [text, setText] = useState("")
    const [loading, setLoading] = useState(false)
    const [result, setResults] = useState([])

    const handleChange = async (e) => {
        const { value } = e.target
        setText(value)
        setLoading(true)
        if (value.length > 0) {
            try {
                cancel && cancel()
                const CancelToken = axios.CancelToken
                const token = Cookies.get("token")
                const res = await axios.get(`${baseUrl}/api/search/${value}`, {
                    headers: { Authorization: token },
                    cancelToken: new CancelToken(canceler => {
                        cancel = canceler
                    })
                })
                if (res.data.length === 0) {
                    setLoading(false)
                } else {
                    setResults(res.data)
                }
            } catch (err) {
                console.log(err)
            }
        }
        setLoading(false)
    }

    const addChat = (result) => {
        const alreadyInChat = chats.length > 0 && chats.filter(chat => chat.messagesWith === result._id).length > 0
        if (alreadyInChat) {
            return router.push(`/messages?message=${result._id}`)
        } else {
            const newChat = {
                messagesWith: result._id,
                name: result.name,
                profilePicUrl: result.profilePicUrl,
                lastMessage: "",
                date: Date.now()
            }
            setChats(chats => ([newChat, ...chats]))
            return router.push(`/messages?message=${result._id}`)
        }
    }

    return (
        <React.Fragment>
            <Search
                onBlur={(e) => {
                    result.length > 0 && setResults([])
                    loading && setLoading(false)
                    setText("")
                }}
                loading={loading}
                value={text || ""}
                resultRenderer={ResultRenderer}
                results={result}
                showNoResults
                onSearchChange={handleChange}
                minCharacters={1}
                onResultSelect={(e, data) => {
                    addChat(data.result)
                }}
            />
        </React.Fragment>
    )
}

const ResultRenderer = ({ _id, profilePicUrl, name }) => {
    return (
        <List key={_id}>
            <List.Item style={{ display: "flex", alignItems: "center", justifyContent: "start" }}>
                <Image src={profilePicUrl} alt="ProfilePic" avatar circular style={{ borderRadius: "50%" }} size="mini" />
                <List.Content header={name} as="a" style={{ margin: "0" }} />
            </List.Item>
        </List>
    )
}

export default ChatListSearch
