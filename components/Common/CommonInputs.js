import React from 'react'
import { Button, Divider, Form, Message, TextArea } from 'semantic-ui-react'

const CommonInputs = ({
    user: { bio, facebook, instagram, youtube, twitter },
    handleChange,
    showSocialLinks,
    setShowSocialLinks
}) => {
    return (
        <React.Fragment>
            <Form.Field
                control={TextArea}
                name="bio"
                value={bio}
                onChange={handleChange}
                placeholder="Bio"
                icon="info"
            />
            <Button
                content="Add Social Links"
                color="red"
                icon="at"
                type="button"
                onClick={() => setShowSocialLinks(!showSocialLinks)}
            />
            {showSocialLinks && (
                <React.Fragment>
                    <Divider />
                    <Form.Input
                        icon="facebook f"
                        iconPosition="left"
                        name="facebook"
                        placeholder="Facebook"
                        value={facebook}
                        onChange={handleChange}
                    />
                    <Form.Input
                        icon="twitter"
                        iconPosition="left"
                        name="twitter"
                        placeholder="Twitter"
                        value={twitter}
                        onChange={handleChange}
                    />
                    <Form.Input
                        icon="instagram"
                        iconPosition="left"
                        name="instagram"
                        placeholder="Instagram"
                        value={instagram}
                        onChange={handleChange}
                    />
                    <Form.Input
                        icon="youtube"
                        iconPosition="left"
                        name="youtube"
                        placeholder="Youtube"
                        value={youtube}
                        onChange={handleChange}
                    />
                    <Message icon="attention" info size="small" header="Social Media links are optional" />
                </React.Fragment>
            )}
        </React.Fragment>
    )
}

export default CommonInputs
