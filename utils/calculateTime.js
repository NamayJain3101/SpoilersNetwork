import moment from 'moment'
import React from 'react'
import Moment from 'react-moment'

export const calculateTime = (createdAt) => {
    const today = moment(Date.now())
    const postDate = moment(createdAt)

    const diffInHrs = today.diff(postDate, "hours")
    if (diffInHrs < 24) {
        return (
            <React.Fragment>
                Today <Moment format="hh:mm A">{createdAt}</Moment>
            </React.Fragment>
        )
    } else if (diffInHrs > 24 && diffInHrs < 36) {
        return (
            <React.Fragment>
                Yesterday <Moment format="hh:mm A">{createdAt}</Moment>
            </React.Fragment>
        )
    } else if (diffInHrs > 36) {
        return (
            <React.Fragment>
                <Moment format="DD/MM/YYYY hh:mm A">{createdAt}</Moment>
            </React.Fragment>
        )
    }
}