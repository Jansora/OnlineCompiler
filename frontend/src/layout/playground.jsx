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


const Playground = (props) => {

    const [code, setCode] = useState("edit some code here")
    const [result, setResult] = useState("")
    const [toggle, setToggle] = useState(false)
    const [loading, setLoading] = useState(false)
    const { language } = useParams();

    useEffect(() => {
      setToggle(true)
      setTimeout(() => setToggle(false))
    }, [language]);

    const compiler = () => {
      setLoading(true)
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
        <Grid columns="equal" container style={{marginTop: 30}}>
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
                style={{height: 300}}
                // options={{readOnly}}
              />
            }

          </Grid.Column>
          <Grid.Column width={8}>
            <Header as="h3" style={{marginBottom: 7}}>
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
                style={{height: 300}}
                options={{readOnly: true}}
              />
            }

          </Grid.Column>
        </Grid>

    )
}

export default Playground;
