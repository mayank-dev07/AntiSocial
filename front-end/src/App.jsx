import Auth from "./pages/Auth/Auth";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Layout from "./components/Layout";
import HomePage from "./pages/Home/HomePage";
import SearchUser from "./pages/search/SearchUser";
import Profile from "./pages/profile/Profile";
import PostPage from "./components/Post/PostPage";
import Chat from "./pages/chat/Chat";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./index.css";
import Loader from "./components/loader/Loader";
// import { useLocation } from "react-router-dom";
// import { useEffect, useLayoutEffect } from "react";
// import useStore from "./zustand/zustan";

function App() {
  // const { setPathName } = useStore();
  // const location = useLocation();
  // const pathname = location.pathname;

  // useLayoutEffect(() => {
  //   const array = pathname.split("/");
  //   const path = array[array.length - 1];
  //   setPathName(path);
  //   // //console.log(path);
  // }, [pathname]);

  return (
    <>
      <div className="w-1/2 md:w-full h-full">
        <Loader />
      </div>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Auth />}>
          <Route path="/login" index element={<Login />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
        </Route>
        <Route path="/home" element={<Layout />}>
          <Route path=":username" element={<HomePage />} />
          <Route path="/home/search" element={<SearchUser />} />
          <Route path="/home/profile/:username" element={<Profile />} />
          <Route path=":username/post/:id" element={<PostPage />} />
          <Route path=":username/chats" element={<Chat />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
