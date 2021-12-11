import axios from "axios";

let currentUni= "";
let currentCourse = "";

export const fetchCourseData = async ({queryKey}) => {
  const [_, uniId] = queryKey;
  var postData = JSON.stringify({
    "uniId": uniId.toString()
  });

  const { data } = await axios.post(`http://localhost:4000/courses`, postData, {
    crossdomain: true,
    headers:{
      "Content-Type": "application/json"
    }
  });
  console.log("in fetch calls: ", data)
  return data;
};

export const fetchSingleCourse = async ({queryKey}) => {
  const [_, courseId] = queryKey;
  
  const { data } = await axios.get(`http://localhost:4000/courses/${courseId}`,  {
    crossdomain: true,
  });
  console.log("in fetch calls: ", data)
  return data;
};

export const fetchUniData = async () => {
  const { data } = await axios.get(`http://localhost:4000/unis`, {
    crossdomain: true,
  });
  return data;
};

export const subscribeToCourse = (currentUserID, courseID) => {
  let returnData = null;
  const reqOptions = {
    method: "POST",
    headers: { "Content-Type": "application.json" },
    body: JSON.stringify({ userID: currentUserID, courseID: courseID }),
  };
  fetch("http://localhost:4000/unis/:uni", reqOptions)
    .then((res) => res.json())
    .then((data) => (returnData = data));

  return returnData;
};

export const likeDislikeFile = (currentUserID, fileID, likeStatus) => {
  let returnData = null;
  const reqOptions = {
    method: "POST",
    headers: { "Content-Type": "application.json" },
    body: JSON.stringify({
      userID: currentUserID,
      fileID: fileID,
      likeStatus: likeStatus,
    }),
  };
  fetch("http://localhost:4000/unis/:uni/:course", reqOptions)
    .then((res) => res.json())
    .then((data) => (returnData = data));

  return returnData;
};