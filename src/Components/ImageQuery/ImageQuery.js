import React, { useState } from "react";
import axios from "axios";
import Button from "../Button/Button";
import classes from "./ImageQuery.module.css";

function ImageQuery() {
  const [imgName, setImgName] = useState();
  const [queryImage, setQueryImage] = useState();
  const [isQIUploaded, setIsQIUploaded] = useState(false);

  function changeHandler(e) {
    setImgName(e.target.files[0].name);
    setQueryImage(e.target.files[0]);
  }
  async function postQueryImage(fd) {
    // const response = await axios({
    //   method: "POST",
    //   url: "/api/query_img",
    //   data: {
    //     query_img: "queryImage",
    //   },
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
    const response = await axios.post("/api/query_img", fd);
    console.log(response);
    return response;
  }
  function uploadClickHandler() {
    const fd = new FormData();
    fd.append("query_img", queryImage, queryImage.name);
    postQueryImage(fd).then((response) => {
      if (response) {
        setIsQIUploaded(true);
      }
    });
  }
  return (
    <div className={classes["image-retrieval"]}>
      <div>
        <label htmlFor="file-upload" className={classes["image-upload"]}>
          Choose Picture
        </label>
        <input
          type="text"
          className={classes["readonly-input"]}
          value={imgName}
          placeholder="No image chosen"
          readOnly
        />
        <input
          type="file"
          id="file-upload"
          onChange={changeHandler}
          accept="image/*"
        />
      </div>
      <Button onClick={uploadClickHandler}>Search LingoGym</Button>
      {isQIUploaded && <p>Successfully Submited</p>}
    </div>
  );
}

export default ImageQuery;
