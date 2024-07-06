import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { ImagePlus, SquarePlus, X } from "lucide-react";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";

import useStore from "../../zustand/zustan";
import { addPost, getUserProfile, isLoggedIn } from "../../axios/request";

const Create = () => {
  const { user, setUser } = useStore();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [postImg, setPostImg] = useState("");
  const [post, setPost] = useState({
    text: "",
    Img: "",
  });
  const fileRef = useRef(false);

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
  const createPost = async (e) => {
    e.preventDefault();

    const newPost = { ...post, postedBy: user?._id };

    try {
      if (newPost.text === "") {
        return infoNotify("Please write a caption");
      }
      if (newPost.Img === "") {
        return infoNotify("Please add an image");
      } else {
        const { res, err } = await addPost(newPost);
        if (res?.status == 200) {
          successNotify(res.data.message);
          onClose();
          setPost({ text: "" });
          setPostImg("");
          isLog();
        }
        if (err) {
          console.log(err);
          errorNotify(err.response.data.message);
        }
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const isLog = async () => {
    const { res, err } = await isLoggedIn();
    if (err) {
      navigate("/");
    } else {
      const { profile, err } = await getUserProfile(res?.data?.username);
      setUser(profile.data);
    }
  };

  const handelImgChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setPostImg(reader.result);
        setPost({
          ...post,
          [e.target.name]: reader.result,
        });
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Tooltip hasArrow label="Add Post" bg="black" color="white" rounded={5}>
        <SquarePlus color="white" cursor={"pointer"} onClick={onOpen} />
      </Tooltip>

      <Modal isOpen={isOpen} onClose={onClose} isCentered size={"3xl"}>
        <ModalOverlay />
        <ModalContent bg={"gray.900"}>
          <ModalHeader>
            <Flex
              w={"full"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Text>Add Post</Text>
              <X onClick={onClose} cursor={"pointer"} />
            </Flex>
          </ModalHeader>
          <Divider orientation="horizontal" />

          <ModalBody>
            <form onSubmit={createPost}>
              <Flex>
                <Text py={4} fontSize={16} fontWeight={"semibold"}>
                  Add a caption for your post
                </Text>
              </Flex>
              <Input
                placeholder="Caption"
                onChange={postTextChange}
                value={post.text}
                name="text"
                _focus={{
                  outline: "none",
                  border: "0px",
                }}
              ></Input>

              <Flex w={"full"}>
                <Text
                  pt={6}
                  fontSize={16}
                  fontWeight={"semibold"}
                  w={"full"}
                  textAlign={"center"}
                >
                  Select a Image for your post
                </Text>
              </Flex>
              <Container
                display={"flex"}
                justifyContent={"center"}
                paddingY={4}
              >
                <Box w={"full"} display={"flex"} justifyContent={"center"}>
                  {postImg && <Image src={postImg} alt="Dan Abramov" />}
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
                  <Flex gap={8} justifyContent={"center"} alignItems={"center"}>
                    <Text>{!postImg ? "Add Image" : "Replace Image"}</Text>
                    <ImagePlus />
                  </Flex>
                  <Input
                    type="file"
                    name="Img"
                    hidden
                    accept="image/*, .jpg, .jpeg, .png"
                    ref={fileRef}
                    onChange={handelImgChange}
                  ></Input>
                </Button>
              </Flex>
              <Divider orientation="horizontal" paddingY={2} />
              <Flex w={"full"} justifyContent={"center"} pt={4}>
                <Button type="submit">Add Post</Button>
              </Flex>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Create;
