import React, { useState } from 'react'
import baseUrl from '../../utils/baseUrl'
import axios from "axios"
import { Image, List, Search } from 'semantic-ui-react'
import Cookies from 'js-cookie'
import { Router } from 'next/router'

let cancel

const SearchComponent = () => {
    const [text, setText] = useState("")
    const [loading, setLoading] = useState(false)
    const [results, setResults] = useState([])

    const handleChange = async (e) => {
        const { value } = e.target
        setText(value)
        setLoading(true)
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
        setLoading(false)
    }

    return (
        <React.Fragment>
            <Search
                // onBlur={(e) => {
                //     results.length > 0 && setText([])
                //     loading && setLoading(false)
                //     setText("")
                // }}
                loading={loading}
                value={text || ""}
                resultRenderer={ResultRenderer}
                results={results}
                onSearchChange={handleChange}
                minCharacters={1}
                onResultSelect={(e, data) => {
                    Router.push(`${data.result.username}`)
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

export default SearchComponent
