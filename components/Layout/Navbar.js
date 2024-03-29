import React from "react";
import { Container, Icon, Menu } from 'semantic-ui-react'
import { useRouter } from 'next/router'
import Link from 'next/link'

const Navbar = () => {
  const router = useRouter()
  const isActive = route => router.pathname === route
  return (
    <Menu fluid borderless>
      <Container text style={{ justifyContent: "center" }}>
        <Link href="/login">
          <Menu.Item header active={isActive('/login')}>
            <Icon size="large" name="sign in" />
            Login
          </Menu.Item>
        </Link>
        <Link href="/signup">
          <Menu.Item header active={isActive('/signup')}>
            <Icon size="large" name="signup" />
            Sign Up
          </Menu.Item>
        </Link>
      </Container>
    </Menu>
  );
}

export default Navbar;
