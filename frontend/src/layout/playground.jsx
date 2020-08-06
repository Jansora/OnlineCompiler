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
import { parse } from 'qs';

import {stringify} from "qs"
import Embed from "../component/Embed";

import initSqlJs from "sql.js";
import RenderSqlResult from "./renderSqlResult";


const client = axios.create(
  {
    baseURL: "/playground/",
  }
);

const copyToClipboard = (content='拷贝的内容') => {
  let textArea = document.createElement("textarea");
  textArea.value = content;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy')
      ? console.log('上传成功, 已拷贝到剪贴板')
      : console.log('上传失败') ;
  } catch (err) {
    console.error('上传成功, 拷贝到剪贴板时执行异常', err);
  }
  document.body.removeChild(textArea);
}

const getDefaultValue = (language) => {

  const hello = `"hello, world!"`;
  if(language === "python") return `print(${hello})`
  if(language === "java") return `import java.util.Collections;

public class Clazz {
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
  if(language === "node") return `console.log(${hello})`
  if(language === "sql") return `DROP TABLE IF EXISTS employees;
CREATE TABLE employees( id          integer,  name    text,
                          designation text,     manager integer,
                          hired_on    date,     salary  integer,
                          commission  float,    dept    integer);

INSERT INTO employees VALUES (1,'JOHNSON','ADMIN',6,'1990-12-17',18000,NULL,4);
INSERT INTO employees VALUES (2,'HARDING','MANAGER',9,'1998-02-02',52000,300,3);
INSERT INTO employees VALUES (3,'TAFT','SALES I',2,'1996-01-02',25000,500,3);
INSERT INTO employees VALUES (4,'HOOVER','SALES I',2,'1990-04-02',27000,NULL,3);
INSERT INTO employees VALUES (5,'LINCOLN','TECH',6,'1994-06-23',22500,1400,4);
INSERT INTO employees VALUES (6,'GARFIELD','MANAGER',9,'1993-05-01',54000,NULL,4);
INSERT INTO employees VALUES (7,'POLK','TECH',6,'1997-09-22',25000,NULL,4);
INSERT INTO employees VALUES (8,'GRANT','ENGINEER',10,'1997-03-30',32000,NULL,2);
INSERT INTO employees VALUES (9,'JACKSON','CEO',NULL,'1990-01-01',75000,NULL,4);
INSERT INTO employees VALUES (10,'FILLMORE','MANAGER',9,'1994-08-09',56000,NULL,2);
INSERT INTO employees VALUES (11,'ADAMS','ENGINEER',10,'1996-03-15',34000,NULL,2);
INSERT INTO employees VALUES (12,'WASHINGTON','ADMIN',6,'1998-04-16',18000,NULL,4);
INSERT INTO employees VALUES (13,'MONROE','ENGINEER',10,'2000-12-03',30000,NULL,2);
INSERT INTO employees VALUES (14,'ROOSEVELT','CPA',9,'1995-10-12',35000,NULL,1);

SELECT designation,COUNT(*) AS nbr, (AVG(salary)) AS avg_salary FROM employees GROUP BY designation ORDER BY avg_salary DESC;
SELECT name,hired_on FROM employees ORDER BY hired_on;
  
  `

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
    const embed = Embed()
    const [db, setDb] = useState(null)
    const [code, setCode] = useState("")
    const [result, setResult] = useState("")
    const [toggle, setToggle] = useState(false)
    const [loading, setLoading] = useState(false)
    const [shareValue, setShareValue] = useState(null)


    const [args] =  useState(parse(window.location.href.split('?')[1]))


    useEffect(() => {
      setToggle(true)
      setCode(getDefaultValue(language))
      setTimeout(() => setToggle(false), 100)
    }, [language]);

    useEffect(() => {
      if(args.language && args.share) {
        initShare(args)
      }

    }, [args])

    useEffect(() => {
      if(language === "sql" && db == null) {
        initSqlJs(
          {
            locateFile: file => `https://cdn.bootcdn.net/ajax/libs/sql.js/1.3.0/dist/${file}`
          }
        )
          .then(SQL => setDb(new SQL.Database()))
          .catch(err => console.error(err));
      }
    }, [language, db])

    const initShare = (path) => {
      client.get(`share?share=${args.share}&language=${args.language}`)
        .then(response =>  {
          const { data } = response;
          if (data.status){
            setCode(data.data)
          } else {
            setCode(data.message)
          }
        }).catch( e => {
        setResult("网络错误或服务器异常...")
      }).finally(()=> {
        setLoading(false)
      })
    }
    const share = () => {
      client.post('share', stringify({code, language}))
        .then(response =>  {
          const { data } = response;
          if (data.status){
            origin = window.location.origin
            const url = `${origin}/${language}?share=${data.data}&language=${language}&embed=true`
            copyToClipboard(url)
            setShareValue(url)
          } else {
          }
        }).catch( e => {
        setResult("网络错误或服务器异常...")
      }).finally(()=> {
        setLoading(false)
      })
    }

    const compiler = () => {
      setLoading(true)
      if(language === "sql") {
        if(db) {
          setResult(db.exec(code))
        }
        setLoading(false)
        return ;
      }
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
    if (embed) {
      return (
        <Grid columns="equal" style={{marginTop: 0}}>
            {
              !toggle &&
              <CodeEditor
                force={false}
                id={"code-editor-template"}
                language={language === "node" ? "javascript" : language}
                value={code}
                onChange={setCode}
                style={{height: 400}}
                // options={{readOnly}}
              />
            }

          {

            <Header as="h3" style={{margin: "5px 0"}} size="tiny">
              <Button color="violet" basic size="tiny" onClick={compiler} style={{marginLeft: 10}}>运行</Button>
              <Button color="green" basic size="tiny" onClick={share}>分享</Button>
              {
                shareValue &&
                <Button as="a" color="green" size="tiny" target="_blank"
                        href={shareValue}
                >分享成功, 已拷贝到剪贴板,点击在新窗口打开
                </Button>
              }

              <Loader active={loading} inverted content="解析中..."/>

              <div style={{margin: '8px 3px', whiteSpace: "pre-wrap"}}>
                输出:
                {
                  language === "sql" ? RenderSqlResult(result) : result
                }
              </div>
            </Header>
          }

        </Grid>
      )
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
                language={language === "node" ? "javascript" : language}
                value={code}
                onChange={setCode}
                style={{height: 500}}
                // options={{readOnly}}
              />
            }

          </Grid.Column>
          <Grid.Column width={8}>
            <Header as="h3" style={{marginBottom: 6}}>
              <Button color="violet" basic size="tiny" onClick={compiler}>运行</Button>
              <Button color="green" basic size="tiny" onClick={share}>分享</Button>
              {
                shareValue &&
                <Button as="a" color="green" size="tiny" target="_blank"
                        href={shareValue}
                >分享成功, 已拷贝到剪贴板,点击在新窗口打开
                </Button>

              }

            </Header>
            {
              language !== "sql" && <Loader active={loading} inverted content="解析中..."/>
            }
            {
              !toggle && language !== "sql" &&
              <CodeEditor
                force={true}
                id={"code-editor-template"}
                language={language}
                value={result}
                // onChange={setR}
                style={{height: 500}}
                options={{readOnly: true}}
              />
            }
            {
              language === "sql" && RenderSqlResult(result)
            }
          </Grid.Column>
        </Grid>

    )
}

export default Playground;
