import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { signUpApi } from "../../axios/request";

const initialState = {
  name: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const validEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
const validPassword = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

export default function Signup() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signUp, setSignUp] = useState(initialState);

  const errorNotify = (error) => {
    toast.error(error, {
      theme: "dark",
    });
  };

  const handelChange = (e) => {
    setSignUp({
      ...signUp,
      [e.target.name]: e.target.value,
    });
  };

  const submitSignup = async () => {
    if (
      !signUp.name ||
      !signUp.username ||
      !signUp.email ||
      !signUp.password ||
      !signUp.confirmPassword
    ) {
      return errorNotify("Enter all details");
    }
    if (!signUp.email.match(validEmail)) {
      return errorNotify("Enter valid Email");
    } else if (!signUp.password.match(validPassword)) {
      return errorNotify(
        "Password must contain min 8 letters,a symbol,a upper and lower case letters and a number"
      );
    } else if (signUp.password !== signUp.confirmPassword) {
      return errorNotify("Password does not match");
    } else {
      if (
        signUp.email.match(validEmail) &&
        signUp.password.match(validPassword) &&
        signUp.password === signUp.confirmPassword
      ) {
        const { res, err } = await signUpApi(signUp);
        if (res?.status == 201) {
          navigate(`/home/${res.data.name}`);
          setSignUp(initialState);
        }
        if (err) {
          errorNotify(err?.response?.data?.message);
        }
      } else {
        //console.log("error");
      }
    }
  };

  return (
    <>
      <Box
        minW={{ base: "80%", lg: "50%" }}
        zIndex={30}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Stack
          spacing={8}
          py={12}
          px={2}
          minW={{ base: "100%", md: "70%", lg: "60%" }}
        >
          <Stack align={"center"}>
            <Heading fontSize={"4xl"} textAlign={"center"}>
              Sign up
            </Heading>
            {/* <Text fontSize={"lg"} color={"gray.600"}>
              to enjoy all of our cool features ✌️
            </Text> */}
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <Stack spacing={4}>
              <FormControl id="name" isRequired>
                <FormLabel>Name </FormLabel>
                <Input
                  type="name"
                  name="name"
                  value={signUp.name}
                  onChange={handelChange}
                />
              </FormControl>{" "}
              <FormControl id="username" isRequired>
                <FormLabel>Username </FormLabel>
                <Input
                  type="username"
                  name="username"
                  value={signUp.username}
                  onChange={handelChange}
                />
              </FormControl>
              <FormControl id="email" isRequired>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={signUp.email}
                  onChange={handelChange}
                />
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={signUp.password}
                    onChange={handelChange}
                  />
                  <InputRightElement h={"full"}>
                    <Box
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }
                    >
                      {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </Box>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <FormControl id="Confirm Password" isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    onChange={handelChange}
                    value={signUp.confirmPassword}
                  />
                  <InputRightElement h={"full"}>
                    <Box
                      onClick={() =>
                        setShowConfirmPassword(
                          (showConfirmPassword) => !showConfirmPassword
                        )
                      }
                    >
                      {showConfirmPassword ? (
                        <Eye size={20} />
                      ) : (
                        <EyeOff size={20} />
                      )}
                    </Box>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Stack spacing={10} pt={2}>
                <Button
                  loadingText="Submitting"
                  size="lg"
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                  onClick={submitSignup}
                >
                  Sign up
                </Button>
              </Stack>
              <Stack pt={6}>
                <Flex w={"full"} justifyContent={"center"} gap={3}>
                  Already a user?
                  <Link to={"/login"}>
                    <Text color={"blue.300"}>Login</Text>
                  </Link>
                </Flex>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </>
  );
}
