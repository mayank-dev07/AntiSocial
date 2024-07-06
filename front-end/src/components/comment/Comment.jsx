import React from "react";
import { Flex, Text, Avatar } from "@chakra-ui/react";
import { formatDistanceToNow } from "date-fns";
import { url } from "../../axios/imageurl";

const Comment = (props) => {
  // //console.log(props);

  return (
    <>
      <Flex w={"full"} gap={5}>
        <Flex direction={"column"} alignItems={"center"}>
          <Avatar
            name={props?.props?.username}
            src={`${props?.props?.profilepic}`}
            size={{ base: "md", md: "lg" }}
          />
        </Flex>
        <Flex w={"full"} direction={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Text fontWeight={"bold"}>{props?.props?.username}</Text>
            <Flex>
              <Text fontSize={"small"} paddingX={2}>
                {props?.props?.createdAt &&
                  `${formatDistanceToNow(new Date(props?.props?.createdAt))} ago
                         `}
              </Text>
            </Flex>
          </Flex>
          <Text fontWeight={"semi-bold"}>{props?.props?.text}</Text>
        </Flex>
      </Flex>
    </>
  );
};

export default Comment;
