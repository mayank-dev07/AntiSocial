import axiosInstance from "./axiosInstance";

export const signUpApi = async (values) => {
  try {
    const res = await axiosInstance.post("user/signup", values);
    return { res: res, err: null };
  } catch (err) {
    return { res: null, err: err };
  }
};

export const loginApi = async (values) => {
  try {
    const res = await axiosInstance.post("user/login", values);
    return { res: res, err: null };
  } catch (err) {
    return { res: null, err: err };
  }
};

export const isLoggedIn = async () => {
  try {
    const res = await axiosInstance.get("user/isLoggedIn");
    return { res: res, err: null };
  } catch (err) {
    return { res: null, err: err };
  }
};

export const logoutUser = async () => {
  try {
    const res = await axiosInstance.get("user/logout");
    return { res: res, err: null };
  } catch (err) {
    return { res: null, err: err };
  }
};

export const getUserProfile = async (value) => {
  try {
    const res = await axiosInstance.get(`user/profile/${value}`);
    return { profile: res, err: null };
  } catch (err) {
    return { profile: null, err: err };
  }
};

export const updateUserProfile = async (value) => {
  try {
    const res = await axiosInstance.post("user/update", value);
    return { res: res, err: null };
  } catch (err) {
    return { res: null, err: err };
  }
};

export const getAllUser = async () => {
  try {
    const res = await axiosInstance.get("user/getAll");
    return { res: res, err: null };
  } catch (err) {
    return { res: null, err: err };
  }
};

export const followUnFollow = async (value) => {
  try {
    const res = await axiosInstance.get(`user/follow/${value}`);
    return { res: res, err: null };
  } catch (err) {
    return { res: null, err: err };
  }
};

export const getPost = async (value) => {
  try {
    const res = await axiosInstance.get(`post/${value}`);
    return { res: res, err: null };
  } catch (err) {
    return { res: null, err: err };
  }
};

export const getUserPost = async (value) => {
  try {
    const res = await axiosInstance.get(`post/user/${value}`);
    return { res: res, err: null };
  } catch (err) {
    return { res: null, err: err };
  }
};

export const getFeeds = async () => {
  try {
    const res = await axiosInstance.get("post/feed");
    return { res: res, err: null };
  } catch (err) {
    return { res: null, err: err };
  }
};

export const likePost = async (value) => {
  try {
    const res = await axiosInstance.get(`post/like/${value}`);
    return { res: res, err: null };
  } catch (err) {
    return { res: null, err: err };
  }
};

export const addPost = async (value) => {
  try {
    // //console.log(value);
    const res = await axiosInstance.post("post/create", value);
    return { res: res, err: null };
  } catch (err) {
    return { res: null, err: err };
  }
};

export const addComment = async (value) => {
  try {
    // //console.log(value);
    const res = await axiosInstance.post("post/reply", value);
    return { res: res, err: null };
  } catch (err) {
    return { res: null, err: err };
  }
};

export const deletefeed = async (value) => {
  try {
    // //console.log(value);
    const res = await axiosInstance.delete(`post/${value}`);
    return { res: res, err: null };
  } catch (err) {
    return { res: null, err: err };
  }
};

export const getConversations = async () => {
  try {
    const res = await axiosInstance.get("message/conversation");
    return { res: res, err: null };
  } catch (err) {
    return { res: null, err: err };
  }
};

export const getMessages = async (value) => {
  try {
    const res = await axiosInstance.get(`message/${value}`);
    return { res: res, err: null };
  } catch (err) {
    return { res: null, err: err };
  }
};

export const sendMessages = async (value) => {
  try {
    const res = await axiosInstance.post("message/", value);
    return { res: res, err: null };
  } catch (err) {
    return { res: null, err: err };
  }
};
