import React, { useEffect, useState } from "react";
import {
  Flex,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
} from "@chakra-ui/react";
import AllPost from "../Post/AllPost";
import { getPost } from "../../axios/request";

const UserHome = (props) => {
  const [posts, setPosts] = useState();

  const getThePost = async () => {
    const { res, err } = await getPost(props?.props?._id);
    console.log(res);
    if (res?.status == 200) {
      setPosts(res?.data);
    }
  };

  useEffect(() => {
    getThePost();
  }, [props?.props]);

  return (
    <Flex w={"full"}>
      <Tabs isFitted variant="enclosed" w={"full"}>
        <TabList>
          <Tab>
            <Text fontWeight={"bold"}> Posts</Text>
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            {posts?.length >= 0 ? (
              <>
                {posts?.map((item, index) => (
                  <Box key={index}>
                    <AllPost data={item} fun={getThePost} />
                  </Box>
                ))}
              </>
            ) : (
              <Flex justifyContent={"center"} alignItems={"center"} w={"full"}>
                <Text>No Posts To Show</Text>
              </Flex>
            )}
          </TabPanel>
          {/* <TabPanel>
            <Flex
              justifyContent={"center"}
              alignItems={"center"}
              w={"full"}
              paddingY={32}
            >
              <Text fontSize={{ base: 20, md: 28 }}>No Replies To Show</Text>
            </Flex>
          </TabPanel> */}
        </TabPanels>
      </Tabs>
    </Flex>
  );
};

export default UserHome;
