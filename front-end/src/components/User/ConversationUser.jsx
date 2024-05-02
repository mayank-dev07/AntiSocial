import { Avatar, Box, Button, Divider, Flex, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { url } from "../../axios/imageurl";
import { CheckCheck, MessageCircleMore } from "lucide-react";
import useStore from "../../zustand/zustan";

const ConversationUser = (props) => {
  const { user } = useStore();

  useEffect(() => {
    console.log(props);
  }, [props]);

  return (
    <>
      <Flex direction={"column"} cursor={"pointer"}>
        <Flex
          paddingY={4}
          w={"full"}
          justifyContent={"space-between"}
          paddingX={{ base: 0, md: 8 }}
          alignItems={"center"}
        >
          {props?.props?.participants.map(
            (item, index) => (
              // item._id !== user._id && (
              <Box display={"flex"} alignItems={"center"} gap={5} key={index}>
                <Avatar
                  cursor={"pointer"}
                  size={{ base: "sm", md: "sm", xl: "md" }}
                  name={props?.props?.name}
                  src={`${url + item.profilepic}`}
                  // onClick={() => {
                  //   navigate(`/home/profile/${item?.username}`);
                  // }}
                />
                <Box>
                  <Text
                    key={index}
                    fontSize={{ base: 14, md: 18 }}
                    fontWeight={"bold"}
                  >
                    {item.username}
                  </Text>
                  <Flex>
                    {props?.props?.lastMessage.sender == user._id && (
                      <Flex paddingRight={3}>
                        <CheckCheck />
                      </Flex>
                    )}
                    <Text>
                      {props?.props?.lastMessage?.text.length > 10
                        ? props?.props?.lastMessage?.text.substring(0, 10) +
                          "..."
                        : props?.props?.lastMessage?.text}
                    </Text>
                  </Flex>
                </Box>
              </Box>
            )
            // )
          )}
          <MessageCircleMore />
        </Flex>
        <Divider orientation="horizontal" w={"full"} marginY={2} />
      </Flex>
    </>
  );
};

export default ConversationUser;
