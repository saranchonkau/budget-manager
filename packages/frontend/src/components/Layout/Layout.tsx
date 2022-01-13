import React from "react";
import classes from "./Layout.module.css";

interface Props {
  children?: React.ReactNode;
}

function Layout(props: Props) {
  return (
    <div className={classes.layout}>
      <main className={classes.main}>{props.children}</main>
    </div>
  );
}

export default Layout;
