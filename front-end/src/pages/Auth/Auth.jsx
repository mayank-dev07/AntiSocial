import {
  Box,
  Flex,
  useBreakpointValue,
  Icon,
  Stack,
  Heading,
  Text,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/login");
  }, []);

  return (
    <Box position={"relative"}>
      <Flex
        minH={"100vh"}
        w={"full"}
        justifyContent={"center"}
        alignItems={"center"}
        direction={{ base: "column", lg: "row" }}
        // paddingY={{ base: 10, lg: 0 }}
      >
        <Box
          minW={{ base: "100%", lg: "50%" }}
          h={"full"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Stack
            spacing={{ base: 10, md: 20 }}
            maxW={"80%"}
            textAlign={"center"}
          >
            <Heading
              lineHeight={1.1}
              fontSize={{ base: "3xl", sm: "4xl", md: "4xl", lg: "4xl" }}
            >
              Are you Anti-Social?
              <Text
                as={"span"}
                bgGradient="linear(to-r, red.400,pink.400)"
                bgClip="text"
              >
                <br />
                <br />
                <br />
              </Text>{" "}
              Get in where you fit in and then focus on that platform
            </Heading>
          </Stack>
        </Box>
        <Outlet />
      </Flex>
      {/* <Blur
        position={"absolute"}
        top={-10}
        left={-10}
        style={{ filter: "blur(70px)" }}
      /> */}
      {/* <Blur
        position={"absolute"}
        bottom={0}
        right={0}
        style={{ filter: "blur(70px)", transform: "rotate(180deg)" }}
      /> */}
    </Box>
  );
}
