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
import { getAllUser } from "../../axios/request";
import useStore from "../../zustand/zustan";
import Message from "../../components/message/Message";

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [originalUsers, setOriginalUsers] = useState([]);
  const { user } = useStore();

  const handelChange = (e) => {
    setSearch(e.target.value);
  };

  const getAll = async () => {
    const { res, err } = await getAllUser();
    if (res?.status == 200) {
      console.log(res);
      setUsers(res.data);
      setOriginalUsers(res.data); // Set original users here
    }
  };
  useEffect(() => {
    getAll();
  }, []);

  useEffect(() => {
    console.log(users);
  }, [users]);

  const searchUser = () => {
    console.log(search);
    const filteredUsers = originalUsers.filter((item) =>
      item.name.startsWith(search)
    );
    setUsers(filteredUsers);
    setSearch("");
    if (!search) setUsers(originalUsers);
  };

  return (
    <>
      <Flex w={"100%"} maxH={"95vh"}>
        <Container maxW={{ base: "90%", lg: "80%" }}>
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
                      bg: "gray.900",
                    }}
                    onClick={searchUser}
                  >
                    Search
                  </Button>
                </InputRightAddon>
              </InputGroup>
              <Stack>
                {users.length === 0 && (
                  <Text textAlign={"center"} fontSize={"xl"}>
                    User not found
                  </Text>
                )}
                {users.map((item, index) => {
                  if (item.followers.includes(user._id)) {
                    return <FollowedUser key={index} props={item} />;
                  }
                })}
              </Stack>
            </Flex>
            <Flex w={"70%"} display={{ base: "none", lg: "flex" }}>
              <Flex
                // justifyContent={"center"}
                // alignItems={"center"}
                w={"full"}
                gap={6}
                bg={"gray.900"}
                borderRadius={8}
                direction={"column"}
                position={"relative"}
              >
                <Flex direction={"column"} w={"full"}>
                  <Box display={"flex"} gap={5} p={3}>
                    <Avatar
                      cursor={"pointer"}
                      size={{ base: "sm", md: "md" }}
                      //   name={item.name}
                      //   src={`${url + item?.profilepic}`}
                      //   onClick={() => {
                      //     navigate(`/home/profile/${item?.username}`);
                      //   }}
                    />
                    <Box>
                      <Text fontSize={{ base: 14, md: 18 }} fontWeight={"bold"}>
                        {"item?.name"}
                      </Text>
                      <Text fontSize={{ base: 14, md: 16 }}>
                        " @{"item?.username"}"
                      </Text>
                    </Box>
                  </Box>
                  <Divider orientation="horizontal"></Divider>
                </Flex>

                {/* <Flex
                  alignItems={"center"}
                  justifyContent={"center"}
                  w={"full"}
                >
                  <MessageSquareQuote size={100} />
                  <Text fontSize={"lg"}>
                    Select chat to start conversation!
                  </Text>
                </Flex> */}

                <Flex
                  direction={"column"}
                  h={"76%"}
                  overflowY={"scroll"}
                  px={4}
                  w={"full"}
                  gap={4}
                >
                  <Message ownMessage={true} />
                  <Message ownMessage={false} />
                  <Message ownMessage={false} />
                  <Message ownMessage={false} />
                  <Message ownMessage={true} /> <Message ownMessage={true} />
                  <Message ownMessage={false} />
                  <Message ownMessage={false} />
                  <Message ownMessage={false} />
                  <Message ownMessage={true} /> <Message ownMessage={true} />
                  <Message ownMessage={false} />
                  <Message ownMessage={false} />
                  <Message ownMessage={false} />
                  <Message ownMessage={true} /> <Message ownMessage={true} />
                  <Message ownMessage={false} />
                  <Message ownMessage={false} />
                  <Message ownMessage={false} />
                  <Message ownMessage={true} /> <Message ownMessage={true} />
                  <Message ownMessage={false} />
                  <Message ownMessage={false} />
                  <Message ownMessage={false} />
                  <Message ownMessage={true} /> <Message ownMessage={true} />
                  <Message ownMessage={false} />
                  <Message ownMessage={false} />
                  <Message ownMessage={false} />
                  <Message ownMessage={true} />
                </Flex>

                <InputGroup
                  borderRadius={5}
                  size="lg"
                  paddingBottom={4}
                  //   position={"absolute"}
                  //   bottom={0}
                  px={5}
                >
                  {/* <InputLeftElement
                    pointerEvents="none"
                    children={<Search />}
                  /> */}
                  <Input
                    variant="outlined"
                    type="text"
                    placeholder="Message..."
                    // name="search"
                    // value={search}
                    // onChange={handelChange}
                  />
                  <InputRightAddon border="none" bg={"black"}>
                    <Button
                      //   size="md"
                      borderLeftRadius={0}
                      borderRightRadius={3.3}
                      border="1px solid #000000"
                      bg={"black"}
                      _hover={{
                        bg: "black",
                      }}
                      //   onClick={searchUser}
                    >
                      <Send />
                    </Button>
                  </InputRightAddon>
                </InputGroup>
              </Flex>
            </Flex>
          </Flex>
        </Container>
      </Flex>
    </>
  );
};

export default Chat;
