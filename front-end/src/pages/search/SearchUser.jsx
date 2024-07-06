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
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  followUnFollow,
  getAllUser,
  getUserProfile,
  isLoggedIn,
} from "../../axios/request";
import { url } from "../../axios/imageurl";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useStore from "../../zustand/zustan";

const SearchUser = () => {
  const [users, setUsers] = useState([]);
  const [id, setId] = useState([]);
  const [search, setSearch] = useState({ search: "" });
  const navigate = useNavigate();
  const { user } = useStore();

  const getAll = async () => {
    const { res, err } = await getAllUser();
    if (res?.status == 200) {
      setUsers(res.data);
    }
  };

  const getP = async () => {
    const { res, err } = await isLoggedIn();
    if (err) {
      navigate("/");
    } else {
      const { profile, err } = await getUserProfile(res?.data?.username);
      setId(profile?.data?._id);
    }
  };

  useEffect(() => {
    getAll();
    getP();
  }, []);

  const followUser = async (id) => {
    const { res, err } = await followUnFollow(id);
    if (res?.status == 200) {
      getAll();
    }
    //console.log(err);
  };

  const handelChange = (e) => {
    const { name, value } = e.target;
    setSearch((prevSearch) => ({ ...prevSearch, [name]: value }));

    if (value) {
      setUsers((prevUsers) =>
        prevUsers.filter((item) => item.name.startsWith(value))
      );
    } else {
      getAll();
    }
  };

  const clearSearch = () => {
    setSearch({ search: "" });
    getAll();
  };

  return (
    <>
      <Container maxW={"700px"} paddingY={12}>
        <InputGroup borderRadius={5} size="lg" bg={"black"}>
          <InputLeftElement pointerEvents="none" children={<Search />} />
          <Input
            variant="unstyled"
            type="text"
            placeholder="Search user"
            name="search"
            value={search.search}
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
              onClick={clearSearch}
            >
              Clear
            </Button>
          </InputRightAddon>
        </InputGroup>

        <Flex
          justifyContent={"center"}
          alignItems={"center"}
          direction={"column"}
          paddingY={{ base: 8, md: 12 }}
        >
          <Stack w={"full"}>
            {(users?.length === 0 ||
              (users?.length === 1 && users[0]?._id === user?._id)) && (
              <Text textAlign={"center"} fontSize={"xl"}>
                User not found
              </Text>
            )}
            {users.map(
              (item, index) =>
                item._id !== id && (
                  <Flex key={index} direction={"column"}>
                    <Flex
                      paddingY={4}
                      w={"full"}
                      justifyContent={"space-between"}
                      paddingX={{ base: 0, md: 8 }}
                      alignItems={"center"}
                    >
                      <Box display={"flex"} alignItems={"center"} gap={5}>
                        <Avatar
                          cursor={"pointer"}
                          size={{ base: "sm", md: "md" }}
                          name={item.name}
                          src={`${item?.profilepic}`}
                          onClick={() => {
                            navigate(`/home/profile/${item?.username}`);
                          }}
                        />
                        <Box>
                          <Text
                            fontSize={{ base: 14, md: 18 }}
                            fontWeight={"bold"}
                          >
                            {item?.name}
                          </Text>
                          <Text fontSize={{ base: 14, md: 16 }}>
                            @{item?.username}
                          </Text>
                        </Box>
                      </Box>
                      <Button
                        onClick={() => followUser(item._id)}
                        fontSize={{ base: 14, md: 16 }}
                      >
                        {item.followers.includes(id) ? "Following" : "Follow"}
                      </Button>
                    </Flex>
                    <Divider orientation="horizontal" w={"full"} marginY={2} />
                  </Flex>
                )
            )}
          </Stack>
        </Flex>
      </Container>
    </>
  );
};

export default SearchUser;
