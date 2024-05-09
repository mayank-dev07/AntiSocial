import { Avatar, Flex, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import useStore from "../../zustand/zustan";
import { url } from "../../axios/imageurl";

const Message = (props) => {
  const { user } = useStore();

  useEffect(() => {
    console.log(props);
    // console.log(props.props.sender._id);
    // console.log(user._id);
  }, [props]);
  return (
    <>
      {props.props.sender._id == user._id ? (
        <>
          <Flex gap={2} justifyContent={"end"}>
            <Text maxW={"60%"} bg={"blue.900"} borderRadius={8} p={3}>
              {props?.props?.text}
            </Text>
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
