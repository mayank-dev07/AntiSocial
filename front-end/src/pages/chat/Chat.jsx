import {
  Box,
  Button,
  Container,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightAddon,
  Stack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import FollowedUser from "../../components/User/FollowedUser";
import { getAllUser, getConversations } from "../../axios/request";
import useStore from "../../zustand/zustan";
import ConversationUser from "../../components/User/ConversationUser";
import ChatArea from "../../components/message/ChatArea";
import { useSocket } from "../../context/SocketContext";

const Chat = () => {
  const [users, setUsers] = useState(null);
  const [allConvo, setAllConversations] = useState([]);
  const [filteredConvo, setFilteredConvo] = useState([]);
  const [convo, setConversations] = useState();
  const [search, setSearch] = useState("");
  const [originalUsers, setOriginalUsers] = useState([]);
  const { user } = useStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [width, setWidth] = useState(window.innerWidth);
  const { onlineUsers } = useSocket();

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [width]);

  const handleChange = (e) => {
    const searchValue = e.target.value;
    setSearch(searchValue);

    if (searchValue) {
      const filteredUsers = originalUsers.filter((item) =>
        item.username.toLowerCase().startsWith(searchValue.toLowerCase())
      );
      setUsers(filteredUsers);

      const filteredConversations = allConvo.filter((item) =>
        item.participants[0].username
          .toLowerCase()
          .startsWith(searchValue.toLowerCase())
      );
      setFilteredConvo(filteredConversations);
    } else {
      setUsers(null);
      setFilteredConvo(allConvo);
    }
  };

  const getAll = async () => {
    const { res, err } = await getAllUser();
    if (res?.status == 200) {
      setOriginalUsers(res.data);
    }
  };

  const conversations = async () => {
    const { res, err } = await getConversations();
    if (res.status == 200) {
      setAllConversations(res.data);
      setFilteredConvo(res.data);
    }
  };

  useEffect(() => {
    getAll();
    conversations();
  }, []);

  const setConvo = (item) => {
    setConversations(item);
  };

  const showMessage = (item) => {
    setConvo(item);
    if (width <= 991) {
      onOpen();
    }
  };

  return (
    <>
      <Flex w={"100%"} maxH={"95vh"}>
        <Container maxW={{ base: "90%", xl: "80%" }}>
          <Flex gap={{ base: 2, lg: 8 }} py={{ base: 12, md: 10 }} h={"full"}>
            <Flex
              w={{ base: "100%", lg: "30%" }}
              overflowY={"scroll"}
              h={"88vh"}
              direction={"column"}
            >
              <InputGroup
                borderRadius={5}
                size="lg"
                bg={"black"}
                paddingBottom={4}
              >
                <InputLeftElement pointerEvents="none" children={<Search />} />
                <Input
                  variant="outlined"
                  type="text"
                  placeholder="Search user or conversation"
                  name="search"
                  value={search}
                  onChange={handleChange}
                />
              </InputGroup>

              <Stack>
                {filteredConvo.length === 0 ? (
                  <Text
                    textAlign={"center"}
                    fontSize={"xl"}
                    fontWeight={"bold"}
                    py={8}
                  >
                    No conversation found
                  </Text>
                ) : (
                  <Text
                    textAlign={"center"}
                    fontSize={"xl"}
                    fontWeight={"bold"}
                    pt={5}
                  >
                    All Conversations
                  </Text>
                )}
                {filteredConvo.map((item, index) => (
                  <Box key={index} onClick={() => showMessage(item)} w={"full"}>
                    <ConversationUser
                      props={item}
                      isOnline={onlineUsers.includes(item.participants[0]._id)}
                    />
                  </Box>
                ))}
              </Stack>
              <Stack>
                {users && users.length === 0 && (
                  <Text textAlign={"center"} fontSize={"xl"}>
                    User not found
                  </Text>
                )}

                {users?.map((item, index) => {
                  if (item.followers.includes(user._id)) {
                    return (
                      <>
                        <Text
                          textAlign={"center"}
                          fontSize={"lg"}
                          fontWeight={"bold"}
                          pt={12}
                        >
                          All Users
                        </Text>
                        <Box
                          key={index}
                          onClick={() => showMessage(item)}
                          w={"full"}
                        >
                          <FollowedUser key={index} props={item} />
                        </Box>
                      </>
                    );
                  }
                })}
              </Stack>
            </Flex>
            <Flex w={"70%"} display={{ base: "none", lg: "flex" }}>
              <ChatArea props={convo} fun={conversations} />
            </Flex>
          </Flex>
        </Container>
      </Flex>

      <Modal
        onClose={onClose}
        isOpen={isOpen}
        scrollBehavior={"inside"}
        size={"xxl"}
      >
        <ModalOverlay />
        <ModalContent bg={"gray.900"}>
          <ModalHeader>Message</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ChatArea props={convo} fun={conversations} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Chat;
