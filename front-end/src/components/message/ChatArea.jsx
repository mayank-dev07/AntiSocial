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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Container,
  Image,
} from "@chakra-ui/react";
import Message from "./Message.jsx";
import { ImagePlus, MessageSquareQuote, Send } from "lucide-react";
import { getMessages, sendMessages } from "../../axios/request.js";
import { useSocket } from "../../context/SocketContext.jsx";
import { toast } from "react-toastify";

const ChatArea = (props) => {
  const [message, setMessage] = useState([]);
  const [data, setData] = useState({ id: "", message: "" });
  const Ref = useRef(null);
  const { socket } = useSocket();
  const fileRef = useRef(false);
  // const { user } = useStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [image, setImage] = useState();
  const [imageMessage, setImageMessage] = useState({
    id: "",
    message: "",
    Img: "",
  });

  useEffect(() => {
    socket?.on("newMessage", (message) => {
      if (props?.props?.conversationId === message.conversationId) {
        setMessage((prev) => [...prev, message]);
      }
      props.fun();
    });

    return () => socket?.off("newMessage");
  }, [socket, message]);

  const successNotify = (message) => {
    toast.success(message, {
      theme: "dark",
    });
  };

  const errorNotify = (message) => {
    toast.error(message, {
      theme: "dark",
    });
  };

  const infoNotify = (message) => {
    toast.info(message, {
      theme: "dark",
    });
  };

  const postTextChange = (e) => {
    setPost({
      ...post,
      [e.target.name]: e.target.value,
    });
  };

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
        // //console.log(res.data);
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
    if (data.message === "") {
      return infoNotify("Please write a message");
    }
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
  };

  const imageTextChange = (e, id) => {
    setImageMessage({
      ...imageMessage,
      [e.target.name]: e.target.value,
      id: id,
    });
  };

  const handelImgChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImage(reader.result);
        setImageMessage({
          ...imageMessage,
          [e.target.name]: reader.result,
        });
      };

      reader.readAsDataURL(file);
    }
  };

  const sendImage = async () => {
    if (imageMessage.text === "") {
      return infoNotify("Please write a message");
    }
    if (imageMessage.Img === "") {
      return infoNotify("Please add an image");
    }
    const { res, err } = await sendMessages(imageMessage);
    if (res?.status === 201) {
      onClose();
      setData({ id: "", message: "" });
      if (props?.props?.participants !== undefined) {
        getMessage(props.props.participants[0]._id);
      } else {
        getMessage(props?.props?._id);
      }
      props.fun();
    }
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
                  props?.props?.participants
                    ? props?.props?.participants[0]?.profilepic
                    : props?.props?.profilepic
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
                {/* <Button
                  borderLeftRadius={0}
                  borderRightRadius={3.3}
                  border="1px solid #000000"
                  bg={"black"}
                  _hover={{
                    bg: "black",
                  }}
                  type="submit"
                > */}
                <ImagePlus onClick={onOpen} cursor={"pointer"} />
                {/* </Button> */}
              </InputRightAddon>
              <InputRightAddon border="none" bg={"black"}>
                <Button
                  px={0}
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
              </InputRightAddon>{" "}
            </InputGroup>
          </form>

          <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent bg={"gray.900"}>
              <ModalHeader>Send Image</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <form encType="multipart/form-data">
                  {props?.props?.participants ? (
                    <Input
                      placeholder="Comment..."
                      onChange={(e) =>
                        imageTextChange(e, props?.props?.participants[0]._id)
                      }
                      value={imageMessage.text}
                      isRequired
                      name="message"
                      _focus={{
                        outline: "none",
                        border: "0px",
                      }}
                    ></Input>
                  ) : (
                    <Input
                      placeholder="Comment..."
                      onChange={(e) => imageTextChange(e, props?.props?._id)}
                      value={imageMessage.text}
                      isRequired
                      name="message"
                      _focus={{
                        outline: "none",
                        border: "0px",
                      }}
                    ></Input>
                  )}

                  <Container
                    display={"flex"}
                    justifyContent={"center"}
                    paddingTop={4}
                  >
                    <Box w={"full"} display={"flex"} justifyContent={"center"}>
                      {/* {image && <Image src={image} alt="image" />} */}
                      <Image src={image}></Image>
                    </Box>
                  </Container>
                  <Flex w={"full"} justifyContent={"center"}>
                    <Button
                      bg={"transparent"}
                      color={"white"}
                      py={1}
                      borderColor={"grey"}
                      variant="ghost"
                      onClick={() => fileRef.current.click()}
                    >
                      <Flex
                        gap={8}
                        justifyContent={"center"}
                        alignItems={"center"}
                      >
                        <Text>{image ? "Replace Image" : "Add Image"}</Text>
                        <ImagePlus />
                      </Flex>
                      <Input
                        type="file"
                        accept="image/jpeg"
                        name="Img"
                        // isRequired
                        hidden
                        ref={fileRef}
                        onChange={handelImgChange}
                      ></Input>
                    </Button>
                  </Flex>
                  <Divider orientation="horizontal" paddingY={2} />
                  <Flex w={"full"} justifyContent={"center"} pt={4}>
                    <Button type="button" onClick={sendImage}>
                      Send
                    </Button>
                  </Flex>
                </form>
              </ModalBody>
            </ModalContent>
          </Modal>
        </>
      )}
    </Flex>
  );
};

export default ChatArea;
