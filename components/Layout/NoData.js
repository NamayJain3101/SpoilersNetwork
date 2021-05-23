import Link from "next/link";
import { Message, Button } from "semantic-ui-react";

export const NoProfilePosts = () => (
  <React.Fragment>
    <Message
      style={{
        margin: "0 1rem",
        width: "auto"
      }}
      info
      icon="meh"
      header="Sorry"
      content="User has not posted anything yet!"
    />
    <Link href="/">
      <Button style={{ margin: "1rem" }} icon="long arrow alternate left" content="Go Back" as="a" />
    </Link>
  </React.Fragment>
);

export const NoFollowData = ({ followersComponent, followingComponent }) => (
  <React.Fragment>
    {followersComponent && (
      <Message
        style={{
          margin: "0 1rem",
          width: "auto"
        }}
        icon="user outline"
        info content="User does not have followers"
      />
    )}

    {followingComponent && (
      <Message
        style={{
          margin: "0 1rem",
          width: "auto"
        }}
        icon="user outline"
        info
        content="User does not follow any users"
      />
    )}
  </React.Fragment>
);

export const NoMessages = () => (
  <Message
    style={{
      margin: "0 1rem",
      width: "auto"
    }}
    info
    icon="telegram plane"
    header="Sorry"
    content="You have not messaged anyone yet.Search above to message someone!"
  />
);

export const NoPosts = () => (
  <Message
    style={{
      margin: "0 1rem",
      width: "auto"
    }}
    info
    icon="meh"
    header="Hey!"
    content="No Posts. Make sure you have followed someone."
  />
);

export const NoProfile = () => (
  <Message
    style={{
      margin: "0 1rem",
      width: "auto"
    }}
    info
    icon="meh"
    header="Hey!"
    content="No Profile Found."
  />
);

export const NoSocialMediaLinks = () => (
  <Message
    style={{ maxWidth: "300px" }}
    info
    icon="meh"
    header="Hey!"
    content="No Social Account Connected"
  />
);

export const ErrorMessage = ({ header, content }) => (
  <Message
    style={{
      margin: "0 1rem",
      width: "auto"
    }}
    error
    icon="meh"
    header={header}
    content={content}
  />
);

export const NoNotifications = () => (
  <Message
    style={{
      margin: "0 1rem",
      width: "auto"
    }}
    content="No Notifications"
    icon="smile"
    info />
);

export const NoPostFound = () => (
  <Message
    style={{
      margin: "0 1rem",
      width: "auto"
    }}
    info
    icon="meh"
    header="Hey!"
    content="No Post Found."
  />
);
