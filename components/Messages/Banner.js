import React from 'react'
import { Grid, Image, Segment } from 'semantic-ui-react'

const Banner = ({ bannerData }) => {
    const { name, profilePicUrl } = bannerData

    return (
        <React.Fragment>
            <Segment color="teal" attached="top" style={{ border: "3px solid #d4d4d5" }}>
                <Grid>
                    <Grid.Column floated="left" width={14}>
                        <h4>
                            <Image avatar circular src={profilePicUrl} alt={name} />
                            {" "}
                            {name}
                        </h4>
                    </Grid.Column>
                </Grid>
            </Segment>
        </React.Fragment>
    )
}

export default Banner
