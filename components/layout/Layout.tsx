import { use, useEffect, useState } from "react";
import {
  AppShell,
  Navbar,
  Header,
  Footer,
  Aside,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
  Avatar,
  Stack,
  Title,
  Button,
  Space,
} from "@mantine/core";
import Image from "next/image";
import logo from "../../public/logo.png";
import { useRouter } from "next/router";

const getCurrentPage = (pathname: string) => {
  if (pathname === "/") return "Home";
  if (pathname === "/Prestamos") return "Prestamos";
  if (pathname === "/MisPrestamos") return "MisPrestamos";
  return "Home";
};

export default function Layout({ children }: any) {
  const router = useRouter();
  const theme = useMantineTheme();
  const [currentPage, setCurrentPage] = useState("Home");

  useEffect(() => {
    setCurrentPage(getCurrentPage(window.location.pathname));
  }, []);

  const [opened, setOpened] = useState(false);
  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <Navbar
          p="md"
          hiddenBreakpoint="sm"
          hidden={!opened}
          width={{ sm: 110, lg: 170 }}
        >
          <Navbar.Section style={{ width: "100%" }}>
            <Button
              variant="subtle"
              fullWidth
              disabled={currentPage == "Home"}
              onClick={() => {
                router.push("/");
              }}
            >
              <Text>Home</Text>
            </Button>
          </Navbar.Section>
          <Navbar.Section style={{ width: "100%" }}>
            <Button
              variant="subtle"
              fullWidth
              disabled={currentPage == "Prestamos"}
              onClick={() => {
                router.push("/Prestamos");
              }}
            >
              <Text>Prestamos</Text>
            </Button>
          </Navbar.Section>
          <Navbar.Section style={{ width: "100%" }}>
            <Button
              variant="subtle"
              fullWidth
              disabled={currentPage == "MisPrestamos"}
              onClick={() => {
                router.push("/MisPrestamos");
              }}
            >
              <Text>Mis Prestamos</Text>
            </Button>
          </Navbar.Section>

          {/* Footer F */}

          <Navbar.Section style={{ width: "100%" }}>
            <Button variant="subtle" fullWidth>
              <Text>Log Out</Text>
            </Button>
          </Navbar.Section>
        </Navbar>
      }
      header={
        <Header height={{ base: 50, md: 70 }} p="md">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: "100%",
              justifyContent: "space-between",
              padding: "20px",
            }}
          >
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>
            <Image src={logo} alt="RoBorregos logo" width={80} height={60} />
            <Title>Almacén IoT</Title>

            <Avatar
              src="https://avatars.githubusercontent.com/u/65189646?v=4"
              alt="Ivan Romero"
            />
          </div>
        </Header>
      }
    >
      {children}
    </AppShell>
  );
}
