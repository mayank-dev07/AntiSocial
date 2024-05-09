import React, { useEffect, useState, useRef } from "react";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Input,
  InputGroup,
  InputRightAddon,
  Text,
} from "@chakra-ui/react";
import Message from "./Message.jsx";
import { MessageSquareQuote, Send } from "lucide-react";
import { url } from "../../axios/imageurl";
import { getMessages, sendMessages } from "../../axios/request";
import { useSocket } from "../../context/SocketContext.jsx";

const ChatArea = (props) => {
  const [message, setMessage] = useState([]);
  const [data, setData] = useState({ id: "", message: "" });
  const Ref = useRef(null);
  const { socket } = useSocket();

  useEffect(() => {
    socket?.on("newMessage", (message) => {
      setMessage((prev) => [...prev, message]);
      props.fun();
    });

    return () => socket?.off("newMessage");
  }, [socket, message]);

  const scrollToBottom = () => {
    if (Ref.current) {
      Ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getMessage = async (id) => {
    if (id) {
      const { res, err } = await getMessages(id);
      if (res?.status === 200) {
        setMessage(res.data);
      } else {
        setMessage([]);
      }
      if (err) {
        setMessage([]);
      }
    }
  };

  useEffect(() => {
    if (props?.props?.participants !== undefined) {
      getMessage(props.props.participants[0]._id);
    } else {
      getMessage(props?.props?._id);
    }
  }, [props]);

  useEffect(() => {
    scrollToBottom();
  }, [message]);

  const handelChange = (e, id) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
      id: id,
    });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    const { res, err } = await sendMessages(data);
    if (res?.status === 201) {
      setData({ id: "", message: "" });
      if (props?.props?.participants !== undefined) {
        getMessage(props.props.participants[0]._id);
      } else {
        getMessage(props?.props?._id);
      }
      props.fun();
    }
    console.log(err);
  };

  return (
    <Flex
      w={"full"}
      gap={6}
      bg={"gray.900"}
      borderRadius={8}
      direction={"column"}
      position={"relative"}
    >
      {props?.props == null ? (
        <Flex
          alignItems={"center"}
          justifyContent={"center"}
          w={"full"}
          h={"full"}
          gap={8}
        >
          <MessageSquareQuote size={100} />
          <Text fontSize={"lg"}>Search User to start conversation!</Text>
        </Flex>
      ) : (
        <>
          <Flex direction={"column"} w={"full"}>
            <Box display={"flex"} gap={5} p={3}>
              <Avatar
                cursor={"pointer"}
                size={{ base: "sm", md: "md" }}
                name={
                  props?.props?.participants
                    ? props?.props?.participants[0]?.username
                    : props?.props?.username
                }
                src={`${
                  url +
                  `${
                    props?.props?.participants
                      ? props?.props?.participants[0]?.profilepic
                      : props?.props?.profilepic
                  }`
                }`}
              />
              <Box>
                <Text fontSize={{ base: 14, md: 18 }} fontWeight={"bold"}>
                  {props?.props?.participants
                    ? props?.props?.participants[0]?.name
                    : props?.props?.name}
                </Text>
                <Text fontSize={{ base: 14, md: 16 }}>
                  @
                  {props?.props?.participants
                    ? props?.props?.participants[0]?.username
                    : props?.props?.username}
                </Text>
              </Box>
            </Box>
            <Divider orientation="horizontal"></Divider>
          </Flex>

          <Flex
            direction={"column"}
            h={"76%"}
            overflowY={"scroll"}
            px={4}
            w={"full"}
            gap={4}
          >
            {message.map((item, index) => (
              <Message props={item} key={index} />
            ))}
            <div ref={Ref}></div>
          </Flex>
          <form action="" onSubmit={sendMessage}>
            <InputGroup borderRadius={5} size="lg" paddingBottom={4} px={5}>
              {props?.props?.participants ? (
                <Input
                  variant="outlined"
                  type="text"
                  placeholder="Message..."
                  name="message"
                  value={data.message}
                  onChange={(e) =>
                    handelChange(e, props?.props?.participants[0]._id)
                  }
                />
              ) : (
                <Input
                  variant="outlined"
                  type="text"
                  placeholder="Message..."
                  name="message"
                  value={data.message}
                  onChange={(e) => handelChange(e, props?.props?._id)}
                />
              )}
              <InputRightAddon border="none" bg={"black"}>
                <Button
                  borderLeftRadius={0}
                  borderRightRadius={3.3}
                  border="1px solid #000000"
                  bg={"black"}
                  _hover={{
                    bg: "black",
                  }}
                  type="submit"
                >
                  <Send />
                </Button>
              </InputRightAddon>
            </InputGroup>
          </form>
        </>
      )}
    </Flex>
  );
};

export default ChatArea;
