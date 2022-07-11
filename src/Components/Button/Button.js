import React from "react";
import classes from "./Button.module.css";
function Button(props) {
  return (
    <button onClick={props.onClick} className={classes["bttns"]}>
      {props.children}
    </button>
  );
}

export default Button;
