import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Image,
  Box,
  Flex,
  Text,
  Avatar,
  Container,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
  useDisclosure,
  Button,
  Input,
} from "@chakra-ui/react";

import { Ellipsis, MessageCircle, Send, Repeat, X, Trash2 } from "lucide-react";
import { url } from "../../axios/imageurl";
import Comment from "../comment/Comment";
import {
  addComment,
  addPost,
  deletefeed,
  getUserPost,
  likePost,
} from "../../axios/request";
import useStore from "../../zustand/zustan";
import { useNavigate, useLocation } from "react-router-dom";
import Likes from "../like/Likes";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";

const PostPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const { user } = useStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const trashModal = useDisclosure();
  const repeatModal = useDisclosure();

  const [deletePostId, setDeletePostId] = useState("");
  const [postId, setPostId] = useState();
  const [comment, setComment] = useState({ text: "", id: "" });
  const [post, setPost] = useState();

  useEffect(() => {
    setPostId(pathname.split("/")[4]);
  }, [pathname]);

  useEffect(() => {
    getOnePost();
  }, [postId]);

  const likeUnlike = async (id) => {
    const { res, err } = await likePost(id);
    if (res?.status == 200) {
      getOnePost();
    }
  };

  const getOnePost = async () => {
    const { res, err } = await getUserPost(postId);
    if (res?.status == 200) {
      setPost(res.data[0]);
    }
  };

  const postCommentChange = (e) => {
    setComment({
      ...comment,
      [e.target.name]: e.target.value,
      id: post?._id,
      profilepic: user?.profilepic,
    });
  };

  const addCommentText = async (e) => {
    e.preventDefault();
    const { res, err } = await addComment(comment);
    if (res?.status == 200) {
      onClose();
      setComment({ text: "", id: "" });
      getOnePost();
    }
  };

  const handleRepeat = (post) => {
    setPost(post); // Set the post state with the post data
    repeatModal.onOpen(); // Open the repeat modal
  };

  const createPost = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("postedBy", user?._id);
      formData.append("text", post.text);
      formData.append("img", post.img);

      const { res, err } = await addPost(formData);
      if (res?.status == 200) {
        successNotify("This post is re-posted by you");
        onClose();
      }
    } catch (error) {
      console.error("Error reposting:", error);
    }
  };

  const successNotify = (message) => {
    toast.success(message, {
      theme: "dark",
    });
  };

  const handleTrash = (id) => {
    setDeletePostId(id);
    trashModal.onOpen();
  };

  const deletePost = async (id) => {
    const { res, err } = await deletefeed(id);
    if (res.status == 200) {
      navigate(`/home/profile/${post?.postedBy?.username}`);
      successNotify(res.data.message);
      setDeletePostId("");
      trashModal.onClose();
    }
  };

  return (
    <>
      <Container maxW={{ base: "100%", lg: "70%" }} maxH={"100vh"}>
        <Flex
          justifyContent={"evenly"}
          alignItems={"center"}
          direction={{ base: "column", lg: "row" }}
          gap={{ base: 2, lg: 12 }}
          h={"100vh"}
        >
          <Flex
            w={{ base: "100%", md: "80%", lg: "60%" }}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Flex w={"full"} gap={5} paddingY={{ base: 6, md: 10 }}>
              <Flex w={"full"} direction={"column"} gap={2}>
                <Flex justifyContent={"space-between"} w={"full"}>
                  <Flex gap={4} alignItems={"center"}>
                    <Avatar
                      name={post?.postedBy?.username}
                      src={`${post?.postedBy?.profilepic}`}
                      size={{ base: "md", md: "lg" }}
                    />
                    <Text fontWeight={"bold"} fontSize={{ base: 18, md: 20 }}>
                      {post?.postedBy?.username}
                    </Text>
                  </Flex>
                  <Flex>
                    <Text fontSize={"small"} paddingX={2}>
                      {post?.createdAt &&
                        `${formatDistanceToNow(new Date(post?.createdAt))} ago
                          `}
                    </Text>
                  </Flex>
                </Flex>
                <Box cursor={"pointer"}>
                  <Text p={4}>{post?.text}</Text>
                  {post?.img && (
                    <Box
                      borderRadius={5}
                      my={4}
                      overflow={"hidden"}
                      display={"flex"}
                      justifyContent={"center"}
                    >
                      <Image
                        src={`${post?.img}`}
                        alt={`${post?.img}`}
                        w={"fit-content"}
                        maxH={{ base: "30vh", lg: "40vh" }}
                      />
                    </Box>
                  )}
                </Box>

                <Flex gap={4} alignItems={"center"} paddingY={4}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill={
                      post?.likes.some((element) => element._id == user?._id)
                        ? "red"
                        : "none"
                    }
                    stroke={
                      post?.likes.some((element) => element._id == user?._id)
                        ? "red"
                        : "currentcolor"
                    }
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-heart"
                    onClick={() => likeUnlike(post?._id)}
                    cursor={"pointer"}
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                  <MessageCircle cursor={"pointer"} onClick={onOpen} />
                  {post?.postedBy._id !== user?._id ? (
                    <Repeat
                      cursor={"pointer"}
                      onClick={() => handleRepeat(post)}
                    />
                  ) : (
                    <Trash2
                      cursor={"pointer"}
                      onClick={() => handleTrash(post?._id)}
                    />
                  )}
                </Flex>
                <Flex gap={2} alignItems={"center"}>
                  <Text color={"darkgrey"}>{post?.likes?.length} Likes</Text>
                  <Box
                    w={"1px"}
                    h={"1px"}
                    border={"1px solid gray"}
                    borderRadius={"full"}
                  ></Box>
                  <Text color={"darkgrey"}>
                    {post?.replies?.length} Replies
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </Flex>

          <Flex
            maxH={{ base: "full", lg: "70vh" }}
            w={{ base: "100%", lg: "40%" }}
            display={"block"}
            overflow={"auto"}
          >
            <Flex
              direction={"column"}
              gap={8}
              minH={{ base: "full", lg: "70vh" }}
            >
              <Tabs variant="enclosed">
                <TabList zIndex={10} w={{ base: "full" }} bg={"black"}>
                  <Tab w={"50%"}>Likes</Tab>
                  <Tab w={"50%"}>Comments</Tab>
                </TabList>
                <TabPanels paddingY={{ base: 10, lg: 12 }}>
                  <TabPanel display={"flex"} flexDirection={"column"} gap={8}>
                    {post?.likes?.map((item, index) => (
                      <Likes key={index} props={item} />
                    ))}
                    {post?.likes?.length == 0 && (
                      <>
                        <Flex
                          fontSize={20}
                          fontWeight={"bold"}
                          w={"full"}
                          h={{ base: "100%", lg: "70vh" }}
                          justifyContent={"center"}
                          alignItems={"center"}
                        >
                          <Text>No Likes to Show !</Text>
                        </Flex>
                      </>
                    )}
                  </TabPanel>
                  <TabPanel display={"flex"} flexDirection={"column"} gap={8}>
                    {post?.replies?.map((item, index) => (
                      <Comment key={index} props={item} />
                    ))}
                    {post?.replies?.length == 0 && (
                      <>
                        <Flex
                          fontSize={20}
                          fontWeight={"bold"}
                          w={"full"}
                          h={{ base: "100%", lg: "70vh" }}
                          justifyContent={"center"}
                          alignItems={"center"}
                        >
                          <Text>No Comments to Show !</Text>
                        </Flex>
                      </>
                    )}
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Flex>
          </Flex>
        </Flex>
      </Container>

      <Modal isOpen={trashModal.isOpen} onClose={trashModal.onClose} isCentered>
        <ModalOverlay />
        <ModalContent bg={"gray.900"}>
          <ModalHeader>Delete the post?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex
              direction={"column"}
              justifyContent={"center"}
              alignItems={"center"}
              gap={4}
            >
              <Text fontSize={20}>This action cannot be undone.</Text>
              <Button
                type="button"
                onClick={() => deletePost(deletePostId)}
                bg={"red.500"}
                _hover={{ bg: "red.600" }}
              >
                Delete Post
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent bg={"gray.700"}>
          <ModalHeader>Comment on the post</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={addCommentText} encType="multipart/form-data">
              <Input
                placeholder="Comment..."
                onChange={postCommentChange}
                value={comment.text}
                isRequired
                name="text"
                _focus={{
                  outline: "none",
                  border: "0px",
                }}
              ></Input>

              <Container
                display={"flex"}
                justifyContent={"center"}
                paddingTop={4}
              ></Container>

              <Flex w={"full"} justifyContent={"center"} pt={4}>
                <Button type="submit">Add Comment</Button>
              </Flex>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={repeatModal.isOpen}
        onClose={repeatModal.onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent bg={"gray.900"}>
          <ModalHeader>Repost this post?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex
              direction={"column"}
              justifyContent={"center"}
              alignItems={"center"}
              gap={4}
              py={4}
            >
              <Text fontSize={20}>This action cannot be undone.</Text>
              <Button
                type="button"
                onClick={(e) => createPost(e)}
                bg={"blue.500"}
                _hover={{ bg: "blue.600" }}
              >
                Re-Post
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PostPage;
