import React, { useState } from "react";
import { Flex, Text, Avatar } from "@chakra-ui/react";
import { url } from "../../axios/imageurl";

const Likes = (props) => {
  // //console.log(props);
  return (
    <>
      <Flex w={"full"} gap={5}>
        <Flex direction={"column"} alignItems={"center"}>
          <Avatar
            name={props?.props?.name}
            src={`${props?.props?.profilepic}`}
            size={{ base: "md", md: "lg" }}
          />
        </Flex>
        <Flex w={"full"} direction={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex direction={"column"}>
              <Text fontWeight={"bold"}>{props?.props?.name}</Text>
              <Text fontWeight={"semi-bold"}>@{props?.props?.username}</Text>
            </Flex>
            <Flex>
              {/* <Text fontSize={"small"} paddingX={2}>
                {props?.props?.createdAt &&
                  `${formatDistanceToNow(new Date(props?.props?.createdAt))} ago
                         `}
              </Text> */}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default Likes;
