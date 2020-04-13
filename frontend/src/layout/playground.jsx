/*
* @file playground.jsx
* @author jansora
* @date 2020/2/5
*/


import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom"
import {Button, Grid, Header, Loader} from "semantic-ui-react";
import CodeEditor from "../component/code-editor/CodeEditor";
import axios from 'axios';

import {stringify} from "qs"
const client = axios.create(
  {
    baseURL: "/playground/",
  }
);

const getDefaultValue = (language) => {

  const hello = `"hello, world!"`;
  if(language === "python") return `print(${hello})`
  if(language === "java") return `import java.util.Collections;

public class Demo {
  public static void main(String[] args) {
    System.out.println(Collections.singletonList("hello, world!"));
  }
}
  
  `
  if (language === "go") return `package main

import (
\t"fmt"
)

func main() {
\tfmt.Println("Hello, playground")
}
`
  if(language === "javascript") return `console.log(${hello})`
  return "edit some code here....";
}
const FormatInitConsole = `
let everything = []
if (console.everything === undefined)
{
    console.everything = true;

    console.defaultLog = console.log.bind(console);
    console.log = function(){
        everything.push({"type":"console.log", "datetime":Date().toLocaleString().split(" ")[4], "value":Array.from(arguments)});
        console.defaultLog.apply(console, arguments);
    }
    console.defaultError = console.error.bind(console);
    console.error = function(){
        everything.push({"type":"console.error", "datetime":Date().toLocaleString().split(" ")[4], "value":Array.from(arguments)});
        console.defaultError.apply(console, arguments);
    }
    console.defaultWarn = console.warn.bind(console);
    console.warn = function(){
        everything.push({"type":"console.warn", "datetime":Date().toLocaleString().split(" ")[4], "value":Array.from(arguments)});
        console.defaultWarn.apply(console, arguments);
    }
    console.defaultDebug = console.debug.bind(console);
    console.debug = function(){
        everything.push({"type":"console.debug", "datetime":Date().toLocaleString().split(" ")[4], "value":Array.from(arguments)});
        console.defaultDebug.apply(console, arguments);
    }
}`
const FormatClearConsole = `
console.everything = undefined
console.log = console.defaultLog
console.error = console.defaultError
console.warn = console.defaultWarn
console.debug = console.defaultDebug
`
const Playground = (props) => {

    const { language } = useParams();

    const [code, setCode] = useState("")
    const [result, setResult] = useState("")
    const [toggle, setToggle] = useState(false)
    const [loading, setLoading] = useState(false)


    useEffect(() => {
      setToggle(true)
      setCode(getDefaultValue(language))
      compiler()
      setTimeout(() => setToggle(false), 100)
    }, [language]);

    const compiler = () => {
      setLoading(true)
      if(language === "javascript") {
        try {
          // console.log(eval(code))
          const ret = new Function(`
          "use strict";
          ${FormatInitConsole}
          ${code}
          ${FormatClearConsole}
          return(everything)
          `)()

          if(ret && ret.length > 0) {

            const res = ret.map(r => `${r.datetime} ${r.value.join("\n")}`).join("\n")
            return setResult(res)
          }
          // setResult(eval(code))
          // setResult(Function(`"use strict";return(${code})`)())
        } catch (e) {
          // alert(e)
          if (e instanceof SyntaxError) {
            setResult(e.message);
          }
          if (e instanceof TypeError) {
            setResult(e.message);
          }
          // setResult(e)
        } finally
        {
          setLoading(false)
        }
        return
      }
      client.post('compiler', stringify({language, code}))
        .then(response =>  {
          const { data } = response;
          if (data.status){
            setResult(data.data)
          } else {
            setResult(data.message)
          }
        }).catch( e => {
          setResult("网络错误或服务器异常...")
      }).finally(()=> {
        setLoading(false)
      })

    }

    return (
        <Grid columns="equal" style={{marginTop: 30, height: "100%"}}>
          <Grid.Column width={8}>
            <Header as="h3">编码区</Header>
            {
              !toggle &&
              <CodeEditor
                force={false}
                id={"code-editor-template"}
                language={language}
                value={code}
                onChange={setCode}
                style={{height: 600}}
                // options={{readOnly}}
              />
            }

          </Grid.Column>
          <Grid.Column width={8}>
            <Header as="h3" style={{marginBottom: 6}}>
              <Button color="violet" basic size="tiny" onClick={compiler}>运行</Button>
            </Header>
            {
              <Loader active={loading} inverted content="解析中..."/>
            }
            {
              !toggle &&
              <CodeEditor
                force={true}
                id={"code-editor-template"}
                language={language}
                value={result}
                // onChange={setR}
                style={{height: 600}}
                options={{readOnly: true}}
              />
            }

          </Grid.Column>
        </Grid>

    )
}

export default Playground;
