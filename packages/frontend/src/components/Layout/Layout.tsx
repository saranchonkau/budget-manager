import React from "react";
import { Outlet } from "react-router-dom";
import classes from "./Layout.module.css";

function Layout() {
  return (
    <div className={classes.layout}>
      <main className={classes.main}>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
