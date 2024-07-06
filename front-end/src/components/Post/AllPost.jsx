import React, { useEffect, useState } from "react";
import {
  Divider,
  Image,
  Box,
  Flex,
  Text,
  Avatar,
  AvatarGroup,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Input,
  Container,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { MessageCircle, Repeat, Trash2 } from "lucide-react";
import { url } from "../../axios/imageurl";
import { addComment, addPost, deletefeed, likePost } from "../../axios/request";
import useStore from "../../zustand/zustan";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";

const AllPost = (props) => {
  const navigate = useNavigate();
  const { user } = useStore();
  const routePost = (value) => {
    navigate(`/home/${user?.name}/post/${value}`);
  };
  const { isOpen, onOpen, onClose } = useDisclosure();
  const trashModal = useDisclosure();
  const repeatModal = useDisclosure();
  const [post, setPost] = useState({});
  const [deletePostId, setDeletePostId] = useState("");
  const [comment, setComment] = useState({ text: "", id: "" });

  const successNotify = (message) => {
    toast.success(message, {
      theme: "dark",
    });
  };

  const likeUnlike = async (id) => {
    const { res, err } = await likePost(id);
    if (res?.status == 200) {
      props.fun();
    }
  };

  const postCommentChange = (id, e) => {
    setComment({
      ...comment,
      [e.target.name]: e.target.value,
      id: id,
      profilepic: user?.profilepic,
    });
  };

  const addCommentText = async (e) => {
    e.preventDefault();
    const { res, err } = await addComment(comment);
    if (res?.status == 200) {
      onClose();
      setComment({ text: "", id: "" });
      props.fun();
    }
  };

  const createPost = async () => {
    const newPost = { ...post, postedBy: user?._id };
    try {
      const { res, err } = await addPost(newPost);
      if (res?.status == 200) {
        successNotify("This post is re-posted by you");
        repeatModal.onClose();
      }
    } catch (error) {}
  };

  const handleTrash = (id) => {
    setDeletePostId(id);
    trashModal.onOpen();
  };

  const handleRepeat = (post) => {
    setPost(post);
    repeatModal.onOpen();
  };

  const deletePost = async (id) => {
    const { res, err } = await deletefeed(id);
    if (res.status == 200) {
      successNotify(res.data.message);
      setDeletePostId("");
      trashModal.onClose();
    }
    props.fun();
  };

  return (
    <>
      <Flex w={"full"} gap={5} marginY={12}>
        <Flex direction={"column"} alignItems={"center"}>
          <Avatar
            name={props?.data?.postedBy?.username}
            src={`${props?.data?.postedBy?.profilepic}`}
            size={{ base: "sm", md: "md" }}
            cursor={"pointer"}
            onClick={() => {
              navigate(`/home/profile/${props?.data?.postedBy?.username}`);
            }}
          />
        </Flex>
        <Flex w={"full"} direction={"column"} gap={2}>
          <Box onClick={() => routePost(props?.data?._id)} cursor={"pointer"}>
            <Flex justifyContent={"space-between"} w={"full"}>
              <Text
                fontWeight={"bold"}
                onClick={() => {
                  navigate(`/home/profile/${props?.data?.postedBy?.username}`);
                }}
              >
                {props?.data?.postedBy?.username}
              </Text>
              <Flex>
                <Text fontSize={"small"} paddingX={2}>
                  {formatDistanceToNow(new Date(props?.data?.createdAt))} ago
                </Text>
              </Flex>
            </Flex>

            {props?.data?.img && (
              <Box
                borderRadius={5}
                my={4}
                overflow={"hidden"}
                display={"flex"}
                justifyContent={"center"}
              >
                <Image
                  src={`${props?.data?.img}`}
                  alt="post image"
                  w={"fit-content"}
                  maxH={"60vh"}
                />
              </Box>
            )}
            <Text>{props?.data?.text}</Text>
          </Box>

          <Flex gap={4} alignItems={"center"} paddingY={4}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill={props?.data?.likes.includes(user?._id) ? "red" : "none"}
              stroke={
                props?.data?.likes.includes(user?._id) ? "red" : "currentcolor"
              }
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-heart"
              onClick={() => likeUnlike(props?.data?._id)}
              cursor={"pointer"}
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            <MessageCircle cursor={"pointer"} onClick={onOpen} />
            {props?.data?.postedBy._id !== user?._id ? (
              <Repeat
                cursor={"pointer"}
                onClick={(e) => handleRepeat(props?.data)}
              />
            ) : (
              <Trash2
                cursor={"pointer"}
                onClick={() => handleTrash(props?.data?._id)}
              />
            )}
          </Flex>
          <Flex gap={2} alignItems={"center"}>
            <Text color={"darkgrey"}>{props?.data?.likes?.length} Likes</Text>
            <Box
              w={"1px"}
              h={"1px"}
              border={"1px solid gray"}
              borderRadius={"full"}
            ></Box>
            <Text color={"darkgrey"}>
              {props?.data?.replies?.length} Replies
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Divider orientation="horizontal" w={"full"} />

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
                onClick={() => createPost()}
                bg={"blue.500"}
                _hover={{ bg: "blue.600" }}
              >
                Re-Post
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent bg={"gray.900"}>
          <ModalHeader>Comment on the post</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={addCommentText} encType="multipart/form-data">
              <Input
                placeholder="Comment..."
                onChange={(e) => postCommentChange(props?.data?._id, e)}
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
    </>
  );
};

export default AllPost;
