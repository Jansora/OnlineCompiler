import React from 'react';

import Playground from "./layout/playground";

import {Route, Switch, Redirect} from 'react-router-dom'

import Header from "./layout/header";
import styled from "styled-components";
import Embed from "./component/Embed";

const Layout = styled.main`
  padding-top: ${props => !props.embed ? 'var(--header-height)' : '0px'};
  height: calc(100% - var(--header-height));
  //width: 100%;
  margin: ${props => !props.embed ? '0 50px' : '0px'};;
`;

const App = () => {
  const embed = Embed()
  return (
    <React.Fragment>
      {!embed && <Header/>}
        <Layout embed={embed}>
          <Switch>
            <Redirect from="/" to={"/java"} exact />
              <Route path="/:language" component={Playground} exact={false}/>
          </Switch>
        </Layout>

    </React.Fragment>
  );
}

export default App;
