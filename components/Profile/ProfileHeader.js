import React, { useState } from 'react'
import { Button, Divider, Grid, Header, Image, List, Segment } from 'semantic-ui-react'
import { followUser, unfollowUser } from '../../utils/profileActions'
import { NoSocialMediaLinks } from '../Layout/NoData'

const ProfileHeader = ({ profile, ownAccount, loggedUserFollowStats, setLoggedUserFollowStats }) => {
    const [followError, setFollowError] = useState(null)
    const [followLoading, setFollowLoading] = useState(false)
    const isFollowing = loggedUserFollowStats.following.length > 0 && loggedUserFollowStats.following.filter(
        follow => follow.user === profile.user._id
    ).length > 0

    return (
        <React.Fragment>
            {followError && <ErrorMessage header="Error" content={followError} />}
            <Segment style={{ margin: "0 1rem" }}>
                <Grid stackable>
                    <Grid.Column width={11}>
                        <Grid.Row>
                            <Header
                                as="h2"
                                content={profile.user.name}
                                style={{ margin: "1rem 0" }}
                            />
                        </Grid.Row>
                        <Grid.Row stretched>
                            {profile.bio}
                            <Divider hidden />
                        </Grid.Row>
                        <Grid.Row stretched>
                            {profile.social ? (
                                <React.Fragment>
                                    <List>
                                        <List.Item>
                                            <List.Icon size="big" name="mail" />
                                            <List.Content verticalAlign="middle" header={profile.user.email} />
                                        </List.Item>
                                        {profile.social.facebook && (
                                            <List.Item>
                                                <List.Icon size="big" color="blue" name="facebook" />
                                                <List.Content verticalAlign="middle" header={profile.social.facebook} style={{ color: "blue" }} />
                                            </List.Item>
                                        )}
                                        {profile.social.instagram && (
                                            <List.Item>
                                                <List.Icon size="big" color="red" name="instagram" />
                                                <List.Content verticalAlign="middle" header={profile.social.instagram} style={{ color: "red" }} />
                                            </List.Item>
                                        )}
                                        {profile.social.twitter && (
                                            <List.Item>
                                                <List.Icon size="big" color="blue" name="twitter" />
                                                <List.Content verticalAlign="middle" header={profile.social.twitter} style={{ color: "blue" }} />
                                            </List.Item>
                                        )}
                                        {profile.social.youtube && (
                                            <List.Item>
                                                <List.Icon size="big" color="red" name="youtube" />
                                                <List.Content verticalAlign="middle" header={profile.social.youtube} style={{ color: "red" }} />
                                            </List.Item>
                                        )}
                                    </List>
                                </React.Fragment>
                            ) : <NoSocialMediaLinks />}
                            <Divider hidden />
                        </Grid.Row>
                    </Grid.Column>
                    <Grid.Column width={5} stretched style={{ textAlign: "center" }}>
                        <Grid.Row>
                            <Image src={profile.user.profilePicUrl} avatar size="large" />
                        </Grid.Row>
                        <br />
                        {!ownAccount && (
                            <Button
                                compact
                                loading={followLoading}
                                disabled={followLoading}
                                content={isFollowing ? "Following" : "Follow"}
                                icon={isFollowing ? "check circle" : "add user"}
                                color={isFollowing ? "instagram" : "twitter"}
                                onClick={
                                    async () => {
                                        setFollowLoading(true)
                                        if (isFollowing) {
                                            await unfollowUser(profile.user._id, setLoggedUserFollowStats, setFollowError)
                                        } else {
                                            await followUser(profile.user._id, setLoggedUserFollowStats, setFollowError)
                                        }
                                        setFollowLoading(false)
                                    }
                                }
                            />
                        )}
                    </Grid.Column>
                </Grid>
            </Segment>
        </React.Fragment>
    )
}

export default ProfileHeader
