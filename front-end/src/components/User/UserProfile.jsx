import React, { useEffect, useRef, useState } from "react";
import {
  VStack,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Portal,
  Modal,
  ModalOverlay,
  ModalContent,
  useDisclosure,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import { AlignJustify, LogOut } from "lucide-react";
import {
  isLoggedIn,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getAllUser,
} from "../../axios/request";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useStore from "../../zustand/zustan";
import { url } from "../../axios/imageurl";
import FollowedUser from "./FollowedUser";
// import FollowedUser from "./FollowedUser";
// import Followings from "../followings/Followings";

const updateprofile = {
  username: "",
  name: "",
  email: "",
  bio: "",
  profilepic: "",
};

const UserProfile = (props) => {
  const navigate = useNavigate();
  const [update, setUpdate] = useState(updateprofile);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const followingModal = useDisclosure();
  const followerModal = useDisclosure();
  const fileRef = useRef(false);
  const [image, setImage] = useState(null);
  const { user, setUser } = useStore();
  const [allUsers, setAllUsers] = useState([]);

  const successNotify = (message) => {
    toast.success(message, {
      theme: "dark",
    });
  };

  const infoNotify = (message) => {
    toast.info(message, {
      theme: "dark",
    });
  };

  const message = (message) => {
    return () => {
      infoNotify(message);
    };
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    const updatedProfile = { ...update, id: user._id };

    const { res, err } = await updateUserProfile(updatedProfile);
    if (res.status === 200) {
      if (update.username) {
        navigate(`/home/profile/${update.username}`);
      }
      successNotify(res.data.message);
      onClose();
      setTimeout(() => {
        props.fun();
      }, 2000);
    } else {
      console.log(err);
    }
  };

  const handelImgChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImage(reader.result);
        setUpdate({
          ...update,
          [e.target.name]: reader.result,
        });
      };

      reader.readAsDataURL(file);
    }
  };

  const handelChange = (e) => {
    setUpdate({
      ...update,
      [e.target.name]: e.target.value,
    });
  };

  const logout = async () => {
    const { res } = await logoutUser();
    if (res.status == 200) {
      navigate("/");
      setUser({});
    }
  };

  const followingUsers = () => {
    getAll();
    followingModal.onOpen();
  };

  const followerUsers = () => {
    getAll();
    followerModal.onOpen();
  };

  const getAll = async () => {
    const { res, err } = await getAllUser();
    if (res?.status == 200) {
      setAllUsers(res.data);
    }
  };

  return (
    <>
      <VStack spacing={{ base: 6, md: 8 }} paddingX={2} paddingY={8}>
        <Flex justify={"space-between"} w={"full"} alignItems={"center"}>
          <Box>
            <Text fontSize={{ base: 20, md: 32 }} fontWeight={"bold"}>
              {props?.props?.name}
            </Text>
            <Text fontSize={{ base: 16, md: 20 }}>
              @{props?.props?.username}
            </Text>
          </Box>
          <Box>
            <Avatar
              name={`${props?.props?.name}`}
              src={`${props?.props?.profilepic}`}
              size={{ base: "lg", md: "xl" }}
            />
          </Box>
        </Flex>
        <Flex w={"full"}>
          <Text fontSize={{ base: 14, md: 18 }}>{props?.props?.bio}</Text>
        </Flex>
        <Flex justifyContent={"space-between"} alignItems={"center"} w={"full"}>
          <Flex gap={2} alignItems={"center"}>
            {props?.props?.followers?.length > 0 ? (
              <Box onClick={followerUsers} cursor={"pointer"}>
                <Text fontSize={{ base: 14, md: 16 }}>
                  {props?.props?.followers?.length} followers
                </Text>
              </Box>
            ) : (
              <Box
                onClick={message("You have no followers")}
                cursor={"pointer"}
              >
                <Text fontSize={{ base: 14, md: 16 }}>
                  {props?.props?.followers?.length} followers
                </Text>
              </Box>
            )}
            <Box w={1} h={1} bg={"#ffffff"} borderRadius={"full"}></Box>
            {props?.props?.following?.length > 0 ? (
              <Box onClick={followingUsers} cursor={"pointer"}>
                <Text fontSize={{ base: 14, md: 16 }}>
                  {props?.props?.following?.length} following
                </Text>
              </Box>
            ) : (
              <Box
                onClick={message("You have no following users")}
                cursor={"pointer"}
              >
                <Text fontSize={{ base: 14, md: 16 }}>
                  {props?.props?.following?.length} following
                </Text>
              </Box>
            )}
          </Flex>
          {props?.props?._id == user._id && (
            <Flex>
              <Menu>
                <MenuButton>
                  <AlignJustify />
                </MenuButton>
                <Portal>
                  <MenuList bg={"black"} w={"min-content"}>
                    <MenuItem bg={"black"} onClick={onOpen}>
                      Update Profile
                    </MenuItem>

                    <MenuItem bg={"black"}>
                      <Flex
                        justifyContent={"space-between"}
                        alignItems={"center"}
                        w={"full"}
                        onClick={logout}
                      >
                        <Text>Logout</Text>
                        <LogOut size={18} />
                      </Flex>
                    </MenuItem>
                  </MenuList>
                </Portal>
              </Menu>
            </Flex>
          )}
        </Flex>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={"gray.900"}>
          <Stack
            spacing={4}
            w={"full"}
            h={"full"}
            bg={useColorModeValue("white", "black")}
            boxShadow={"lg"}
            p={6}
          >
            <Heading
              lineHeight={1.1}
              fontSize={{ base: "2xl", sm: "3xl" }}
              textAlign={"center"}
              paddingY={4}
            >
              User Profile
            </Heading>
            <form onSubmit={updateProfile} encType="multipart/form-data">
              <FormControl id="userName">
                <Stack direction={["column", "row"]} spacing={6}>
                  <Center>
                    <Avatar
                      size="xl"
                      src={image || url + `${props?.props?.profilepic}`}
                    ></Avatar>
                  </Center>
                  <Center w="full">
                    <Button
                      bg={"black"}
                      color={"white"}
                      borderWidth={1}
                      borderColor={"gray.800"}
                      _hover={{
                        bg: "gray.900",
                      }}
                      onClick={() => fileRef.current.click()}
                    >
                      Change Profile Image
                      <Input
                        type="file"
                        accept="image/jpeg"
                        name="profilepic"
                        hidden
                        ref={fileRef}
                        onChange={handelImgChange}
                      ></Input>
                    </Button>
                  </Center>
                </Stack>
              </FormControl>
              <Box paddingY={8}>
                <FormControl id="username">
                  <FormLabel>User name</FormLabel>
                  <Input
                    placeholder={props?.props?.username}
                    _placeholder={{ color: "gray.500" }}
                    type="text"
                    name="username"
                    onChange={handelChange}
                  />
                </FormControl>
                <FormControl id="name">
                  <FormLabel>Name</FormLabel>
                  <Input
                    placeholder={props?.props?.name}
                    _placeholder={{ color: "gray.500" }}
                    type="text"
                    name="name"
                    onChange={handelChange}
                  />
                </FormControl>
                <FormControl id="bio">
                  <FormLabel>Bio</FormLabel>
                  <Input
                    placeholder={
                      props?.props?.bio ? props?.props?.bio : "Your Bio"
                    }
                    _placeholder={{ color: "gray.500" }}
                    type="text"
                    name="bio"
                    onChange={handelChange}
                  />
                </FormControl>
                <FormControl id="email">
                  <FormLabel>Email address</FormLabel>
                  <Input
                    placeholder={props?.props?.email}
                    _placeholder={{ color: "gray.500" }}
                    type="email"
                    name="email"
                    onChange={handelChange}
                  />
                </FormControl>
              </Box>
              <Stack spacing={6} direction={["column", "row"]}>
                <Button
                  bg={"red.400"}
                  color={"white"}
                  w="full"
                  _hover={{
                    bg: "red.500",
                  }}
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  bg={"blue.400"}
                  color={"white"}
                  w="full"
                  _hover={{
                    bg: "blue.500",
                  }}
                  type="submit"
                >
                  Submit
                </Button>
              </Stack>
            </form>
          </Stack>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={followingModal.isOpen}
        onClose={followingModal.onClose}
        isCentered
        size={"xl"}
        maxh={"70vh"}
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent bg={"gray.900"}>
          <ModalHeader>Followings</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex
              w={"full"}
              direction={"column"}
              justifyContent={"center"}
              gap={4}
              py={4}
            >
              {allUsers?.map((item, index) => {
                if (item.followers.includes(props?.props?._id)) {
                  return <FollowedUser key={index} props={item} />;
                }
              })}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={followerModal.isOpen}
        onClose={followerModal.onClose}
        isCentered
        size={"xl"}
        maxh={"70vh"}
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent bg={"gray.900"}>
          <ModalHeader>Followers</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex
              w={"full"}
              direction={"column"}
              justifyContent={"center"}
              gap={4}
              py={4}
            >
              {allUsers?.map((item, index) => {
                if (item.following.includes(props?.props?._id)) {
                  return <FollowedUser key={index} props={item} />;
                }
              })}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UserProfile;
