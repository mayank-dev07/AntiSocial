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
          <Tab cursor={"default"}>
            <Text fontWeight={"bold"}> Posts</Text>
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            {posts?.length > 0 ? (
              <>
                {posts?.map((item, index) => (
                  <Box key={index}>
                    <AllPost data={item} fun={getThePost} />
                  </Box>
                ))}
              </>
            ) : (
              <Flex justifyContent={"center"} alignItems={"center"} w={"full"}>
                <Text fontSize={20} py={12}>
                  No Posts To Show
                </Text>
              </Flex>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};

export default UserHome;
