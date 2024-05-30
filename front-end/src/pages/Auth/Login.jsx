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
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { loginApi, isLoggedIn } from "../../axios/request";

const initialState = {
  // username: "",
  email: "",
  password: "",
};

const validEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
const validPassword = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [login, setLogin] = useState(initialState);

  useEffect(() => {
    const log = async () => {
      const { res, err } = await isLoggedIn();
      //console.log(res, err);
      if (res?.status == 200) {
        navigate(`/home/${res.data.name}`);
      }
    };

    log();
  }, []);

  const errorNotify = (error) => {
    toast.error(error, {
      theme: "dark",
    });
  };

  const handelChange = (e) => {
    setLogin({
      ...login,
      [e.target.name]: e.target.value,
    });
  };

  const loginUser = async () => {
    //console.log(login);
    if (
      // !login.username ||
      !login.email ||
      !login.password
    ) {
      return errorNotify("Enter all details");
    }
    if (!login.email.match(validEmail)) {
      return errorNotify("Enter valid Email");
    } else if (!login.password.match(validPassword)) {
      return errorNotify(
        "Password must contain min 8 letters,a symbol,a upper and lower case letters and a number"
      );
    } else {
      const { res, err } = await loginApi(login);
      if (res?.status == 201) {
        navigate(`/home/${res.data.name}`);
      } else {
        errorNotify(err?.response?.data?.message);
      }
    }
  };

  return (
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
            Login
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
            {/* <FormControl id="username" isRequired>
              <FormLabel>Username </FormLabel>
              <Input
                type="username"
                name="username"
                value={login.username}
                onChange={handelChange}
              />
            </FormControl> */}
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                name="email"
                value={login.email}
                onChange={handelChange}
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={login.password}
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
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
                onClick={loginUser}
              >
                Login
              </Button>
            </Stack>
            <Stack pt={6}>
              <Flex w={"full"} justifyContent={"center"} gap={3}>
                Create Account?
                <Link to={"/signup"}>
                  <Text color={"blue.300"}>Signup</Text>
                </Link>
              </Flex>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
