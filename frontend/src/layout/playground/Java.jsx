/*
* @file Java.jsx
* @description〈一句话功能简述〉
* @author jansora
* @date 2020-04-08 19:14
*/
import React, {useState, useEffect} from 'react';
import CodeEditor from "../../component/code-editor/CodeEditor";
import {Button, Grid, Header} from "semantic-ui-react";

const Java = () => {
  const [code, setCode] = useState("edit some code here")
  const [result, setResult] = useState("")
  const language = "java"

  return (
    <Grid columns="equal" container style={{marginTop: 30}}>
      <Grid.Column width={8}>
        <Header as="h3">编码区</Header>
        <CodeEditor
          force={false}
          id={"code-editor-template"}
          language={language}
          value={code}
          onChange={setCode}
          style={{height: 300}}
          // options={{readOnly}}
        />
      </Grid.Column>
      <Grid.Column width={8}>
        <Header as="h3" style={{marginBottom: 7}}>
          <Button color="violet" basic size="tiny">运行</Button>
        </Header>
        <CodeEditor
          force={true}
          id={"code-render-view"}
          language={language}
          value={result}
          // onChange={setR}
          style={{height: 300}}
          options={{readOnly: true}}
        />
      </Grid.Column>
    </Grid>

  )
}
export default Java;
