import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Container, Tooltip } from "@chakra-ui/react";
import { Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  BellRing,
  CircleUserRound,
  HomeIcon,
  MessagesSquare,
  Search,
  Settings,
  SquarePlus,
} from "lucide-react";
import useStore from "../zustand/zustan";
import { getUserProfile, isLoggedIn } from "../axios/request";
import Create from "../pages/createPost/Create";
import Loader from "./loader/Loader";

const Layout = () => {
  const navigate = useNavigate();
  const { user, setUser } = useStore();

  const isLog = async () => {
    const { res, err } = await isLoggedIn();
    if (err) {
      navigate("/");
    } else {
      const { profile, err } = await getUserProfile(res?.data?.username);
      setUser(profile.data);
    }
  };

  useEffect(() => {
    isLog();
  }, []);

  return (
    <>
      {/* <Container maxW={"900px"} className="bg-black" minH={"100vh"}> */}
      {/* <Flex justifyContent={"center"} paddingY={{ base: 3, md: 5 }}>
          header
        </Flex> */}
      {/* <Loader /> */}
      <Outlet />
      <Flex
        justifyContent={"center"}
        alignItems={"center"}
        color={"black"}
        backgroundColor={"black"}
        position={"fixed"}
        w={"full"}
        bottom={0}
        h={"60px"}
        gap={{ base: 8, md: 16 }}
      >
        <Tooltip hasArrow label="Home" bg="black" color="white" rounded={5}>
          <HomeIcon
            color="white"
            cursor={"pointer"}
            onClick={() => navigate(`/home/${user.name}`)}
          />
        </Tooltip>
        <Tooltip hasArrow label="Search" bg="black" color="white" rounded={5}>
          <Search
            color="white"
            cursor={"pointer"}
            onClick={() => navigate("/home/search")}
          />
        </Tooltip>
        <Create />
        <Tooltip hasArrow label="Message" bg="black" color="white" rounded={5}>
          <MessagesSquare
            color="white"
            cursor={"pointer"}
            onClick={() => navigate(`/home/${user?.username}/chats`)}
          />
        </Tooltip>
        {/* <Tooltip
          hasArrow
          label="Notification"
          bg="black"
          color="white"
          rounded={5}
        >
          <BellRing color="white" cursor={"pointer"} />
        </Tooltip> */}
        <Tooltip hasArrow label="Profile" bg="black" color="white" rounded={5}>
          <CircleUserRound
            color="white"
            cursor={"pointer"}
            onClick={() => navigate(`/home/profile/${user?.username}`)}
          />
        </Tooltip>
      </Flex>
    </>
  );
};

export default Layout;
