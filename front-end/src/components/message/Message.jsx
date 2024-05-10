import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import useStore from "../../zustand/zustan";
import { url } from "../../axios/imageurl";
import { Check, CheckCheck } from "lucide-react";

const Message = (props) => {
  const { user } = useStore();

  return (
    <>
      {props.props.sender._id == user._id ? (
        <>
          <Flex gap={2} justifyContent={"end"}>
            <Flex maxW={"60%"} bg={"blue.900"} borderRadius={8} p={3} gap={2}>
              <Text>{props?.props?.text}</Text>
              {/* <Flex justifyContent={"center"} alignItems={"center"}>
                {props?.props?.seen ? (
                  <CheckCheck size={18} color={"skyblue"} />
                ) : (
                  <Check size={18} color={"skyblue"} />
                )}
              </Flex> */}
            </Flex>
            <Avatar
              src={`${url + props?.props?.sender?.profilepic}`}
              w={8}
              h={8}
            ></Avatar>
          </Flex>
        </>
      ) : (
        <>
          <Flex gap={2}>
            <Avatar
              src={`${url + props?.props?.sender?.profilepic}`}
              w={8}
              h={8}
            ></Avatar>
            <Text maxW={"60%"} bg={"blue.600"} borderRadius={8} p={3}>
              {props?.props?.text}
            </Text>
          </Flex>
        </>
      )}
    </>
  );
};

export default Message;
