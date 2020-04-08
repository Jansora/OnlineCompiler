/*
* @file GlobalStyles.jsx
* @description〈一句话功能简述〉
* @author jansora
* @date 2020-02-04 10:21
*/
import styled , {createGlobalStyle} from "styled-components";

const GlobalStyle = createGlobalStyle`
    body{
     
      height: 100vh;
      width: 100vw;
      margin: 0;
      overflow: auto;
      overflow-x: hidden;
      //width: 100%;
      // overflow: hidden;
      scroll-behavior: smooth;
      color: #595959;
      font-family: Chinese Quote,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Helvetica Neue,Helvetica,Arial,sans-serif;
      a{
        //color: var(--primary-color);
        color: rgba(0,0,0, 0.87);
        text-decoration: none !important;
      }
      a:hover, a:checked, a:active{
          color: var(--primary-color);

        //color: var(--primary-active-color);
      }
      ::selection {
        background-color: var(--primary-color);
        color: white;
      }
      //p, span, a {
      //  color: #383838;
      //}
    }

    ::-webkit-scrollbar {
      width: 6px;
      height: 5px;
      border: 3px;
    }
    ::-webkit-scrollbar-thumb {
      width:6px;
      background-color: var(--primary-color) !important;
      -webkit-border-radius: 2px;
      outline: 1px solid  var(--primary-color);
      outline-offset: -2px;
      border: 3px solid  var(--primary-color);
    }
    ::-webkit-scrollbar-track {
      display: none;
    }

    body::-webkit-scrollbar {
        //display: none;

    }
    
    #root {
      height: 100%;
      width: 100%;
    }
    .active {
      color: var(--primary-color) !important;
    }

`;

export const PrimarySpan = styled.span`
   color: var(--primary-color);
`

export const StyledDescription = styled.span`
  color: grey;
  font-size: .75rem;
  height: 20px;
  line-height: 20px;
  margin: 4px 16px 12px;
  opacity: .9;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`



export default GlobalStyle;
