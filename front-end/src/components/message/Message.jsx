import { Avatar, Flex, Text } from "@chakra-ui/react";
import React from "react";

const Message = ({ ownMessage }) => {
  return (
    <>
      {ownMessage ? (
        <>
          <Flex gap={2} justifyContent={"end"}>
            <Text maxW={"60%"} bg={"blue.900"} borderRadius={8} p={3}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis
            </Text>
            <Avatar src="" w={8} h={8}></Avatar>
          </Flex>
        </>
      ) : (
        <>
          <Flex gap={2}>
            <Avatar src="" w={8} h={8}></Avatar>
            <Text maxW={"60%"} bg={"blue.600"} borderRadius={8} p={3}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis e.
            </Text>
          </Flex>
        </>
      )}
    </>
  );
};

export default Message;
