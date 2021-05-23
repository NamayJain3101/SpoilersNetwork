import React, { useRef, useState } from 'react'
import { uploadPic } from '../../utils/uploadPicToCloudinary'
import ImageDropDiv from '../Common/ImageDropDiv'
import CommonInputs from '../Common/CommonInputs'
import { Button, Divider, Form, Message } from 'semantic-ui-react'
import { updateProfile } from '../../utils/profileActions'

const UpdateProfile = ({ profile }) => {
    const [userProfile, setUserProfile] = useState({
        profilePicUrl: profile.user.profilePicUrl,
        bio: profile.bio,
        facebook: (profile.social && profile.social.facebook) || "",
        instagram: (profile.social && profile.social.instagram) || "",
        youtube: (profile.social && profile.social.youtube) || "",
        twitter: (profile.social && profile.social.twitter) || "",
    })
    const [media, setMedia] = useState(null)
    const [mediaPreview, setMediaPreview] = useState(null)
    const [errorMsg, setErrorMsg] = useState(null)
    const [loading, setLoading] = useState(false)
    const [showSocialLinks, setShowSocialLinks] = useState(false)
    const [highlighted, setHighlighted] = useState(false)
    const inputRef = useRef()

    const handleChange = (e) => {
        const { name, value, files } = e.target
        if (name === "media") {
            setMedia(files[0])
            setMediaPreview(URL.createObjectURL(files[0]))
        }
        setUserProfile(user => ({ ...user, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        let profilePicUrl
        if (media !== null) {
            const res = await uploadPic(media)
            profilePicUrl = res.url
        }
        if (media !== null && !profilePicUrl) {
            setLoading(false)
            return setErrorMsg("Error Uploading Image")
        }
        await updateProfile(userProfile, setLoading, setErrorMsg, profilePicUrl)
    }

    return (
        <React.Fragment>
            <Form
                error={errorMsg !== null}
                loading={loading}
                onSubmit={handleSubmit}
                style={{ margin: "0 1rem" }}
            >
                {errorMsg !== null && (
                    <React.Fragment>
                        <Message
                            error
                            onDismiss={() => setErrorMsg(null)}
                            content={errorMsg !== null && errorMsg}
                            header="Oops"
                            attached
                        />
                        <Divider hidden />
                    </React.Fragment>
                )}
                <ImageDropDiv
                    inputRef={inputRef}
                    highlighted={highlighted}
                    setHighlighted={setHighlighted}
                    handleChange={handleChange}
                    mediaPreview={mediaPreview}
                    setMediaPreview={setMediaPreview}
                    setMedia={setMedia}
                    profilePicUrl={userProfile.profilePicUrl}
                />
                <CommonInputs
                    user={userProfile}
                    handleChange={handleChange}
                    showSocialLinks={showSocialLinks}
                    setShowSocialLinks={setShowSocialLinks}
                />
                <Divider hidden />
                <Button
                    color="blue"
                    disabled={profile.bio === "" || loading || errorMsg}
                    icon="pencil alternate"
                    content="Update Profile"
                    type="submit"
                />
                <Divider hidden />
            </Form>
        </React.Fragment>
    )
}

export default UpdateProfile
