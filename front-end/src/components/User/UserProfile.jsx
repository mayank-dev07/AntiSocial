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
} from "@chakra-ui/react";
import { AlignJustify, LogOut } from "lucide-react";
import {
  isLoggedIn,
  logoutUser,
  getUserProfile,
  updateUserProfile,
} from "../../axios/request";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useStore from "../../zustand/zustan";
import { url } from "../../axios/imageurl";

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
  const fileRef = useRef(false);
  const [image, setImage] = useState(null);
  const { user } = useStore();

  const successNotify = (message) => {
    toast.success(message, {
      theme: "dark",
    });
  };
  // useEffect(() => {
  //   console.log(props);
  //   console.log(user);
  // }, [props, user]);

  const updateProfile = async (e) => {
    e.preventDefault();
    // console.log(update);

    try {
      const formData = new FormData();
      formData.append("username", update.username);
      formData.append("name", update.name);
      formData.append("email", update.email);
      formData.append("bio", update.bio);
      formData.append("profilepic", update.profilepic);
      formData.append("id", user._id);

      const { res, err } = await updateUserProfile(formData);
      if (res.status === 200) {
        if (update.username) {
          navigate(`/home/profile/${update.username}`);
        }
        console.log(res);
        successNotify(res.data.message);
        onClose();
        setTimeout(() => {
          props.fun();
        }, 2000);
      } else {
        console.log(err);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handelImgChange = (e) => {
    const file = e.target.files[0];
    setUpdate({
      ...update,
      [e.target.name]: file,
    });
    setImage(URL.createObjectURL(file));
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
              src={`${url + props?.props?.profilepic}`}
              size={{ base: "lg", md: "xl" }}
            />
          </Box>
        </Flex>
        <Flex w={"full"}>
          <Text fontSize={{ base: 14, md: 18 }}>{props?.props?.bio}</Text>
        </Flex>
        <Flex justifyContent={"space-between"} alignItems={"center"} w={"full"}>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={{ base: 14, md: 16 }}>
              {props?.props?.followers?.length} followers
            </Text>
            <Box w={1} h={1} bg={"#ffffff"} borderRadius={"full"}></Box>
            <Text fontSize={{ base: 14, md: 16 }}>
              {props?.props?.following?.length} following
            </Text>
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
        <ModalContent>
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
                      src={
                        image ||
                        `http://localhost:8000/${props?.props?.profilepic}`
                      }
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
    </>
  );
};

export default UserProfile;
