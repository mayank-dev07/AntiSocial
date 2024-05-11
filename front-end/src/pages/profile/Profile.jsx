import React, { useEffect, useLayoutEffect, useState } from "react";
import UserProfile from "../../components/User/UserProfile";
import UserTabs from "../../components/User/UserTabs";
import { getUserProfile, isLoggedIn } from "../../axios/request";
import { Container } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";

const Profile = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const [profile, setProfile] = useState();
  const [use, setUse] = useState();

  useEffect(() => {
    setUse(pathname.split("/")[3]);
  }, [pathname]);

  const isLog = async () => {
    const { profile, err } = await getUserProfile(use);
    if (profile?.status == 200) {
      setProfile(profile?.data);
    }
  };

  useEffect(() => {
    console.log(use);
    isLog(use);
    setTimeout(() => {
      console.log();
    });
  }, [use]);

  return (
    <>
      <Container maxW={"900px"} className="bg-black" minH={"100vh"}>
        <UserProfile props={profile} fun={isLog} />
        <UserTabs props={profile} />
      </Container>
    </>
  );
};

export default Profile;
