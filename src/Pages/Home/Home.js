import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import classes from "./Home.module.css";
import Button from "../../Components/Button/Button";
import ImageQuery from "../../Components/ImageQuery/ImageQuery";
import QueryPanel from "../../Components/QueryPanel/QueryPanel";
function Home() {
  const [showKeyWordForm, setShowKeyWordForm] = useState(false);
  const [showImageForm, setShowImageForm] = useState(false);
  const [showDescription, setShowDescription] = useState(true);
  function onClickKeywordHandler() {
    setShowKeyWordForm(true);
    setShowImageForm(false);
  }
  function onClickImageHandler() {
    setShowKeyWordForm(false);
    setShowImageForm(true);
  }
  function onSubmitKeyWordHandler() {
    setShowDescription(false);
  }

  return (
    <div>
      <nav>
        <ul className={classes["nav-header"]}>
          <li>About</li>
          <li>FAQ</li>
          <li>Library</li>
          <li>Search LingoGym</li>
        </ul>
      </nav>
      {showDescription && (
        <div className={classes["description"]}>
          <h3>Get Started with Lingo Gym</h3>
          <p>
            Search with keywords or images to learn English, Amharic and
            Tibetan. Input a keyword or an image to find its corresponding
            meaning in each of the languages
          </p>
        </div>
      )}
      <div className={classes["bttns"]}>
        {!showKeyWordForm && (
          <Button onClick={onClickKeywordHandler}>Search with Keyword</Button>
        )}
        {!showImageForm && (
          <Button onClick={onClickImageHandler}>Search with Image</Button>
        )}
      </div>

      {showKeyWordForm && (
        <QueryPanel onSub={onSubmitKeyWordHandler}></QueryPanel>
      )}
      {showImageForm && <ImageQuery></ImageQuery>}
    </div>
  );
}

export default Home;
