/*
* @file Embed.jsx
* @description〈一句话功能简述〉
* @author jansora
* @date 2020-07-27 19:44
*/
import React, {useState, useEffect} from 'react';
import {parse} from "qs";

const Embed = () => {
  const args = parse(window.location.href.split('?')[1]);
  const [embed] =  useState(args.embed ? args.embed === "true" : false)
  return embed
}
export default Embed;
