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

  const postTextChange = (e) => {
    setPost({
      ...post,
      [e.target.name]: e.target.value,
    });
  };

  const createPost = async (e) => {
    e.preventDefault();
    console.log(post);
    try {
      const formData = new FormData();
      formData.append("postedBy", user?._id);
      formData.append("text", post.text);
      formData.append("img", post.Img);

      console.log(formData);
      const { res, err } = await addPost(formData);
      console.log(res);
      if (res?.status == 200) {
        successNotify(res.data.message);
        onClose();
        setPost({ text: "" });
        setPostImg("");
        isLog();
      }
      console.log(err);
    } catch (error) {
      console.error("Error updating profile:", error);
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
    console.log(file);
    setPost({
      ...post,
      [e.target.name]: file,
    });
    setPostImg(URL.createObjectURL(file));
  };

  return (
    <>
      <Tooltip hasArrow label="Add Post" bg="black" color="white" rounded={5}>
        <SquarePlus color="white" cursor={"pointer"} onClick={onOpen} />
      </Tooltip>

      {/* Modal  */}

      <Modal isOpen={isOpen} onClose={onClose} isCentered size={"3xl"}>
        <ModalOverlay />
        <ModalContent>
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
            <form onSubmit={createPost} encType="multipart/form-data">
              <Input
                placeholder="Caption"
                onChange={postTextChange}
                value={post.text}
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
                    accept="image/jpeg"
                    name="Img"
                    isRequired
                    hidden
                    ref={fileRef}
                    onChange={handelImgChange}
                  ></Input>
                </Button>
              </Flex>
              <Divider orientation="horizontal" paddingY={2} />
              <Flex w={"full"} justifyContent={"center"} pt={4}>
                <Button type="submit">Add</Button>
              </Flex>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Create;