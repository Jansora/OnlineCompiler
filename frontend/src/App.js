import React from 'react';

import Playground from "./layout/playground";

import {Route, Switch} from 'react-router-dom'

import Header from "./layout/header";
import styled from "styled-components";

const Layout = styled.main`
  padding-top: var(--header-height);
  height: 100%;
  width: 100%;
  margin: 0 50px;
`;

const App = () => {
  return (
    <React.Fragment>
        <Header/>
        <Layout>
          <Switch>
              <Route path="/:language" component={Playground} exact={false}/>
          </Switch>
        </Layout>

    </React.Fragment>
  );
}

export default App;
