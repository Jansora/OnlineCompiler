/*
* @file header.jsx
* @author jansora
* @date 2020/2/4
*/


import React from "react";
import {StyledHeader, StyledHeaderLeft} from "../styled/header";


import {NavLink} from "react-router-dom";
import {Button} from "semantic-ui-react";

const Header = (props) => {

    return (
        <StyledHeader>
            <StyledHeaderLeft>
              <NavLink to="/java">Java</NavLink>
              <NavLink to="/python">Python</NavLink>
              <NavLink to="/go">Golang</NavLink>
              <NavLink to="/javascript">Browser Javascript</NavLink>
              <NavLink to="/node">Nodejs</NavLink>
              <NavLink to="/sql">SQL(SQLite)</NavLink>

            </StyledHeaderLeft>
          <a target="_blank" rel='noopener noreferrer' href={"https://github.com/Jansora/OnlineCompiler"} style={{float: "right"}}>Github</a>
        </StyledHeader>
    )
}

export default Header;
