/*
* @file header.jsx
* @author jansora
* @date 2020/2/4
*/


/*
* @file header.jsx
* @description〈一句话功能简述〉
* @author jansora
* @date 2020-02-04 10:21
*/

import styled from "styled-components";

export const StyledHeader = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  background: white;
  z-index: 1000;
  height: var(--header-height);
  padding: 0 16px;
  box-shadow: 0 0 8px 0 rgba(0,0,0,.1);
  line-height: var(--header-height);

`;

export const StyledHeaderLeft = styled.div`
  float: left;

  a{
    color: #363636 !important; 
    padding: 0 10px;
  }

  a.active{
    font-weight: bold;
    color: var(--primary-color) !important;
  }
`;

export const StyledHeaderRight = styled.div`
  float: right;
  a {
    line-height: 50px;
  }
  i {
  font-size: 16px !important;
    color: var(--primary-color);
  }
  span.ant-avatar.ant-avatar-circle{
    background: var(--primary-color);
    margin-top: -4px;
    span.ant-avatar-string {
        color: white;
    }
  }
`;


export const StyledProductsWrapper = styled.div`
  width: 320px;
  padding: 16px;
  
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

export const StyledProductsItem = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;

    height: 92px;
    width: 92px;
    margin-top: 4px;
    transition: margin-top 218ms ease-in-out;
    a {
    
        display: flex;
        cursor: pointer;

          height: 50px;
          width: 50px;
          i {
            font-size: 40px;
          } 
    }
    span {
        margin-bottom: 10px;
    }
    &:hover {
      margin-top: 0;
    }
    
`;


