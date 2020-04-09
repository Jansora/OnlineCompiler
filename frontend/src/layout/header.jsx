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
              <NavLink to="/javascript">Javascript</NavLink>
            </StyledHeaderLeft>
        </StyledHeader>
    )
}

export default Header;
