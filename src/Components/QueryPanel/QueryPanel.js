import React, { useState } from "react";
import Card from "../Card/Card";
import classes from "./QueryPanel.module.css";
import axios from "axios";
import Button from "../Button/Button";

function QueryPanel(props) {
  const [userInput, setUserInput] = useState("");
  const [data, setData] = useState(null);

  async function fetchData(data) {
    // const response = await axios.get(
    //   `https://cs5990sp22-default-rtdb.firebaseio.com/Imgs/${data}.json`
    // );
    const response = await axios.get(
      `https://cs5990sp22-default-rtdb.firebaseio.com/Imgs.json`
    );
    return response.data;
  }

  function onSubmitKeyWordHandler(e) {
    e.preventDefault();
    props.onSub();
    fetchData(userInput)
      .then((data) => {
        for (const key in data) {
          if (
            data[key].amharic === userInput ||
            data[key].tibetan === userInput ||
            data[key].english === userInput
          ) {
            setData(data[key]);
          }
        }
        console.log(data);
        console.log(userInput);
        // setData(data);
      })
      .catch((err) => {
        console.log("err");
      });
  }
  function inputChangeHandler(e) {
    setUserInput(e.target.value.toLowerCase());
  }
  // if (data) {
  //   console.log(data);
  // }
  return (
    <form
      className={classes["keyword-input"]}
      onSubmit={onSubmitKeyWordHandler}
    >
      <input
        type="text"
        placeholder="Search with Keywords"
        onChange={inputChangeHandler}
      />
      <Button>Search LingoGym</Button>
      {data && (
        <div className={classes["result-div"]}>
          <img src={data.link} alt={data.name} width="200" height="300"></img>
          <div>
            <p>{data.english}</p>
            <p>{data.amharic}</p>
            <p>{data.tibetan}</p>
          </div>
        </div>
      )}
    </form>
    // <Card>
    //   <h1>Retrieve pics here</h1>
    //   <form className={classes["form"]} onSubmit={submitHandler}>
    //     <label htmlFor="query"></label>
    //     <input
    //       type="text"
    //       id="query"
    //       placeholder="Search"
    //       autoComplete="off"
    //       onChange={inputChangeHandler}
    //     />
    //     <input type="submit" />
    //   </form>
    //   {!data && <div className={classes["img-placeholder"]}> 350 x 200</div>}
    //   {data && (
    //     <img src={data.link} alt={data.name} width="350" height="200"></img>
    //   )}
    // </Card>
  );
}

export default QueryPanel;
