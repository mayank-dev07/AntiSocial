import { Avatar, Box, Button, Divider, Flex, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
// import useStore from "../../zustand/zustan";
import { url } from "../../axios/imageurl";
import { MessageCircleMore } from "lucide-react";

const FollowedUser = (props) => {
  // useEffect(() => {
  //   //console.log(props);
  // }, [props]);

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
          <Box display={"flex"} alignItems={"center"} gap={5}>
            <Avatar
              cursor={"pointer"}
              size={{ base: "sm", md: "md" }}
              name={props?.props?.name}
              src={`${props?.props?.profilepic}`}
            />
            <Box>
              <Text fontSize={{ base: 14, md: 18 }} fontWeight={"bold"}>
                {props?.props?.name}
              </Text>
              <Text fontSize={{ base: 14, md: 16 }}>
                @{props?.props?.username}
              </Text>
            </Box>
          </Box>
          <MessageCircleMore />
        </Flex>
        <Divider orientation="horizontal" w={"full"} marginY={2} />
      </Flex>
    </>
  );
};

export default FollowedUser;
