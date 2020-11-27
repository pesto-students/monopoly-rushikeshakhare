import React from "react";
import { Route, HashRouter } from "react-router-dom";
import { StartScreen, GameScreen } from "./screens";

const RouteConfiguration = () => {
  return (
    <HashRouter>
      <Route exact path={"/"} component={StartScreen} />
      <Route exact path={"/game"} component={GameScreen} />
    </HashRouter>
  );
};

export default RouteConfiguration;
