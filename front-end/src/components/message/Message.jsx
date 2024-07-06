import { Avatar, Flex, Image, Text } from "@chakra-ui/react";
import React from "react";
import useStore from "../../zustand/zustan";

const Message = (props) => {
  const { user } = useStore();
  return (
    <>
      {props.props.sender._id == user._id ? (
        <>
          <Flex gap={2} justifyContent={"end"}>
            <Flex
              maxW={"60%"}
              bg={"blue.900"}
              borderRadius={8}
              p={3}
              gap={2}
              direction={"column"}
            >
              {props?.props?.Img && (
                <Image src={`${props?.props?.Img}`} w={"auto"} h={100} />
              )}
              <Text>{props?.props?.text}</Text>
            </Flex>
            <Avatar
              src={`${props?.props?.sender?.profilepic}`}
              w={8}
              h={8}
            ></Avatar>
          </Flex>
        </>
      ) : (
        <>
          <Flex gap={2}>
            <Avatar
              src={`${props?.props?.sender?.profilepic}`}
              w={8}
              h={8}
            ></Avatar>
            <Flex
              maxW={"60%"}
              bg={"blue.900"}
              borderRadius={8}
              p={3}
              gap={2}
              direction={"column"}
            >
              {props?.props?.Img && (
                <Image src={`${props?.props?.Img}`} w={"auto"} h={100} />
              )}
              <Text>{props?.props?.text}</Text>
            </Flex>
          </Flex>
        </>
      )}
    </>
  );
};

export default Message;
