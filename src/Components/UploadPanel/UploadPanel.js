import React, { useState } from "react";
// import classes from "./Upload.module.css";
import { storage, database } from "../../firebase/index";
import Card from "../Card/Card";

function UploadPanel(props) {
  const [images, setImages] = useState([]);
  const [progress, setProgress] = useState(0);
  const [rawCaptionData, setRawCaptionData] = useState(null);
  const [parsedData, setParsedData] = useState([]);

  function captionChangeHandler(e) {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      //console.log(reader.result);
      setRawCaptionData(reader.result);
    };
  }
  function uploadCaptionClickHandler() {
    const parsedDataLocal = processRawCaptionData(rawCaptionData);
    setParsedData(parsedDataLocal);
    console.log("Uploaded");
  }
  // helper function to process the raw data from caption.txt
  function processRawCaptionData(data, delim = ",") {
    const firstRow = data.slice(0, data.indexOf("\n")).split("\n");
    let rows = data.slice(data.indexOf("\n") + 1).split("\n");
    rows = [...firstRow, ...rows];

    const objKeys = ["imgName", "amharic", "tibetan"];

    const parsedArray = rows.map((row) => {
      const rowElem = row.split(delim);
      let obj = {};
      const object = objKeys.reduce((obj, objKey, index) => {
        obj[objKey] = rowElem[index];
        return obj;
      }, obj);
      return object;
    });
    return parsedArray;
  }
  function changeHandler(e) {
    for (const img of e.target.files) {
      setImages((previousState) => {
        return [...previousState, img];
      });
    }
  }
  // helper function to extract image name
  function cleanImageName(img) {
    return img.slice(0, img.length - 4);
  }
  function uploadClickHandler() {
    images.forEach((img) => {
      const cleanImgName = cleanImageName(img.name);
      let amharicName = "";
      let tibetanName = "";
      parsedData.forEach((data) => {
        if (cleanImageName(data.imgName) === cleanImgName) {
          amharicName = data.amharic;
          tibetanName = data.tibetan;
        }
      });
      console.log(amharicName);
      console.log(tibetanName);
      const uploadTask = storage.ref(`images/${img.name}`).put(img);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const uploadProgress =
            Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(uploadProgress);
        },
        (error) => {
          console.log("error");
        },
        async () => {
          const url = await storage
            .ref("images")
            .child(img.name)
            .getDownloadURL();

          database.ref(`Imgs/${cleanImgName}`).set({
            english: cleanImgName,
            link: url,
            amharic: amharicName,
            tibetan: tibetanName,
          });
        }
      );
    });
  }

  return (
    <Card>
      <h1>Upload file here</h1>
      <label htmlFor="file-upload"></label>
      <input
        type="file"
        id="file-upload"
        onChange={changeHandler}
        multiple
        accept="image/*"
      />
      <button onClick={uploadClickHandler}>Upload</button>
      <div>
        <progress value={progress} max={`100`}></progress>
      </div>
      <h2>Upload updated caption</h2>
      <label htmlFor="caption-upload">Upload Caption here: </label>
      <input
        type="file"
        id="caption-upload"
        onChange={captionChangeHandler}
        accept=".txt"
      />
      <button onClick={uploadCaptionClickHandler}>Upload Caption</button>
    </Card>
  );
}

export default UploadPanel;
