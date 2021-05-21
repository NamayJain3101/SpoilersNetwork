import React, { createRef } from "react";
import HeadTags from "./HeadTags";
import Navbar from "./Navbar";
import { Container, Grid, Ref, Segment, Sticky, Visibility } from "semantic-ui-react";
import Router from 'next/router'
import nProgress from "nprogress";
import SideMenu from "./SideMenu";
import Search from "./Search";

const Layout = ({ children, user }) => {

	const contextRef = createRef()

	Router.onRouteChangeStart = () => nProgress.start()
	Router.onRouteChangeComplete = () => nProgress.done()
	Router.onRouteChangeError = () => nProgress.done()
	return (
		<React.Fragment>
			<HeadTags />

			{user ? (
				<React.Fragment>
					<div style={{ marginLeft: "1rem", marginRight: "1rem" }}>
						<Ref innerRef={contextRef}>
							<Grid>
								<Grid.Column floated="left" width={2}>
									<Sticky context={contextRef}>
										<SideMenu user={user} />
									</Sticky>
								</Grid.Column>
								<Grid.Column style={{ marginTop: "1rem" }} width={10}>
									<Visibility context={contextRef}>
										{children}
									</Visibility>
								</Grid.Column>
								<Grid.Column floated="left" width={4}>
									<Sticky context={contextRef}>
										<Segment basic>
											<Search />
										</Segment>
									</Sticky>
								</Grid.Column>
							</Grid>
						</Ref>
					</div>
				</React.Fragment>
			) : (
				<React.Fragment>
					<Navbar />
					<Container style={{ paddingTop: "1rem" }} text>
						{children}
					</Container>
				</React.Fragment>
			)}
		</React.Fragment>
	);
}

export default Layout;
