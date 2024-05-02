import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightAddon,
  InputRightElement,
  Stack,
  Text,
} from "@chakra-ui/react";
import { MessageSquareQuote, Search, Send, SendHorizonal } from "lucide-react";
import React, { useEffect, useState } from "react";
import FollowedUser from "../../components/User/FollowedUser";
import { getAllUser, getConversations, getMessages } from "../../axios/request";
import useStore from "../../zustand/zustan";
import ConversationUser from "../../components/User/ConversationUser";
import ChatArea from "../../components/message/ChatArea";

const Chat = () => {
  const [users, setUsers] = useState(null);
  const [allConvo, setAllConversations] = useState([]);
  const [convo, setConversations] = useState();
  const [search, setSearch] = useState("");
  const [originalUsers, setOriginalUsers] = useState([]);
  const { user } = useStore();

  const handelChange = (e) => {
    setSearch(e.target.value);
  };

  const getAll = async () => {
    const { res, err } = await getAllUser();
    if (res?.status == 200) {
      // console.log(res);
      // setUsers(res.data);
      setOriginalUsers(res.data);
    }
  };

  const conversations = async () => {
    const { res, err } = await getConversations();
    // console.log(res);
    if (res.status == 200) {
      setAllConversations(res.data);
      // setAllConversations(res.data);
    }
    // console.log(err);
  };

  useEffect(() => {
    getAll();
    conversations();
  }, []);

  const setConvo = (item) => {
    // console.log(item.participants[0]._id);
    setConversations(item);
  };

  const searchUser = () => {
    // console.log(search);
    const filteredUsers = originalUsers.filter((item) =>
      item.name.startsWith(search)
    );

    if (filteredUsers) {
      setUsers(filteredUsers);
    }

    setSearch("");
    // console.log(user);
    if (!search) {
      setUsers(null);
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
                  placeholder="Search user"
                  name="search"
                  value={search}
                  onChange={handelChange}
                />
                <InputRightAddon p={0} border="none" bg={"black"}>
                  <Button
                    size="md"
                    borderLeftRadius={0}
                    borderRightRadius={3.3}
                    border="1px solid #000000"
                    bg={"black"}
                    _hover={{
                      bg: "black",
                    }}
                    onClick={searchUser}
                  >
                    Search
                  </Button>
                </InputRightAddon>
              </InputGroup>

              <Stack>
                {allConvo.length === 0 ? (
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
                {allConvo.map((item, index) => (
                  <Box key={index} onClick={() => setConvo(item)} w={"full"}>
                    <ConversationUser props={item} />
                  </Box>
                ))}
              </Stack>
              <Stack>
                {users && users?.length === 0 && (
                  <>
                    <Text textAlign={"center"} fontSize={"xl"}>
                      User not found
                    </Text>
                  </>
                )}

                {users?.length !== 0 && users?.length != null && (
                  <Text
                    textAlign={"center"}
                    fontSize={"lg"}
                    fontWeight={"bold"}
                    pt={12}
                  >
                    All Users
                  </Text>
                )}
                {users?.map((item, index) => {
                  if (item.followers.includes(user._id)) {
                    return (
                      <Box
                        key={index}
                        onClick={() => setConvo(item)}
                        w={"full"}
                      >
                        <FollowedUser key={index} props={item} />
                        {/* <ConversationUser props={item} /> */}
                      </Box>
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
    </>
  );
};

export default Chat;
