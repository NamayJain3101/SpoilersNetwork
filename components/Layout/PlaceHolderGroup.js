import React from "react";
import {
  Placeholder,
  Divider,
  List,
  Button,
  Card,
  Container,
  Icon,
  Message
} from "semantic-ui-react";
import { range } from "lodash";

export const PlaceHolderPosts = () =>
  range(1, 3).map((item, index) => (
    <React.Fragment key={index}>
      <Placeholder key={item} fluid>
        <Placeholder.Header image>
          <Placeholder.Line />
          <Placeholder.Line />
        </Placeholder.Header>
        <Placeholder.Paragraph>
          <Placeholder.Line />
          <Placeholder.Line />
          <Placeholder.Line />
          <Placeholder.Line />
        </Placeholder.Paragraph>
      </Placeholder>
      <Divider hidden />
    </React.Fragment>
  ));

export const PlaceHolderSuggestions = () => (
  <React.Fragment>
    <List.Item>
      <Card color="red">
        <Placeholder>
          <Placeholder.Image square />
        </Placeholder>
        <Card.Content>
          <Placeholder>
            <Placeholder.Header>
              <Placeholder.Line length="medium" />
            </Placeholder.Header>
          </Placeholder>
        </Card.Content>

        <Card.Content extra>
          <Button
            disabled
            circular
            size="small"
            icon="add user"
            content="Follow"
            color="twitter"
          />
        </Card.Content>
      </Card>
    </List.Item>
  </React.Fragment>
);

export const PlaceHolderNotifications = () =>
  range(1, 10).map((item, index) => (
    <React.Fragment key={index}>
      <Placeholder key={item}>
        <Placeholder.Header image>
          <Placeholder.Line />
          <Placeholder.Line />
        </Placeholder.Header>
      </Placeholder>
      <Divider hidden />
    </React.Fragment>
  ));

export const EndMessage = ({ header, message }) => (
  <Container textAlign="center">
    <Message
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        margin: "0 1rem",
        width: "auto"
      }}
      icon={{
        name: "meh",
        style: {
          marginBottom: "1rem",
          marginRight: "0",
        }
      }}
      info
      header={header}
      content={message}
    />
    <Divider hidden />
  </Container>
);

export const LikesPlaceHolder = () =>
  range(1, 6).map(item => (
    <Placeholder key={item} style={{ minWidth: "200px" }}>
      <Placeholder.Header image>
        <Placeholder.Line length="full" />
      </Placeholder.Header>
    </Placeholder>
  ));
