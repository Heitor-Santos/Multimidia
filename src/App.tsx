import React from 'react';
import ReactDOM from "react-dom";

import logo from './logo.svg';
import './App.css';
// @ts-ignore
import CircularMenu from "react-disc-menu";
import { useState } from 'react';
import * as Tone from 'tone'
import { useEffect } from 'react';
const synth = new Tone.Synth().toDestination();

function App() {
  const notasMusicais = ['A','B','C','D','E','F','G']
  const coresNotas = ['#FF0000','#FF7F00','#FFFF00','#00FF00','#0000FF','#2E2B5F','#8B00FF']
  const [nivel,setNivel] = useState(2);
  const [score,setScore] = useState(0);
  useEffect(()=>{
    if(score>0&&score%100==0){
      setNivel(nivel+1);
    }
  },[score])
  return (
    <>
    <CircularMenu cutout={0.25} id="disco">
       {notasMusicais.slice(0,nivel+1).map((elem,index)=>
          <button style={{backgroundColor:coresNotas[index]}} onClick={() => synth.triggerAttackRelease(`${elem}4`, "8n")}>
            <span>{elem}</span>
          </button>)
        }
     </CircularMenu>
     <button onClick={()=>setNivel(nivel+1)}>Aumentar Nível</button>
     </>
  );
}

export default App;