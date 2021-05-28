import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Icon, List } from 'semantic-ui-react'
import { logoutUser } from '../../utils/authUser'

const SideMenu = ({ user: { unreadNotification, email, unreadMessage, username }, pc = true }) => {
    const router = useRouter()
    const isActive = (route) => router.pathname === route
    return (
        <React.Fragment>
            <List
                style={{ paddingTop: "1rem" }}
                size="big"
                verticalAlign="middle"
                selection
            >
                <Link href="/">
                    <List.Item style={{ display: "flex", justifyContent: "center" }} active={isActive("/")}>
                        <Icon name="home" size="large" color={isActive("/") && "teal"} />
                        {pc && (
                            <List.Content>
                                <List.Header content="Home" />
                            </List.Content>
                        )}
                    </List.Item>
                </Link>
                <br />
                <Link href="/messages">
                    <List.Item style={{ display: "flex", justifyContent: "center" }} active={isActive("/messages")}>
                        <Icon name={unreadMessage ? "hand point right" : "mail outline"} size="large" color={(isActive("/messages") && "teal") || (unreadMessage && "orange")} />
                        {pc && (
                            <List.Content>
                                <List.Header content="Messages" />
                            </List.Content>
                        )}
                    </List.Item>
                </Link>
                <br />
                <Link href="/notifications">
                    <List.Item style={{ display: "flex", justifyContent: "center" }} active={isActive("/notifications")}>
                        <Icon name={unreadNotification ? "hand point right" : "bell outline"} size="large" color={(isActive("/notifications") && "teal") || (unreadNotification && "orange")} />
                        {pc && (
                            <List.Content>
                                <List.Header content="Notifications" />
                            </List.Content>
                        )}
                    </List.Item>
                </Link>
                <br />
                <Link href={`/${username}`}>
                    <List.Item style={{ display: "flex", justifyContent: "center" }} active={router.query.username === username}>
                        <Icon name="user" size="large" color={router.query.username === username && "teal"} />
                        {pc && (
                            <List.Content>
                                <List.Header content="Account" />
                            </List.Content>
                        )}
                    </List.Item>
                </Link>
                <br />
                <List.Item style={{ display: "flex", justifyContent: "center" }} onClick={() => logoutUser(email)}>
                    <Icon name="log out" size="large" />
                    {pc && (
                        <List.Content>
                            <List.Header content="Logout" />
                        </List.Content>
                    )}
                </List.Item>
            </List>
        </React.Fragment>
    )
}

export default SideMenu
