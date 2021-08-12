import React from 'react';
import ReactDOM from "react-dom";

import logo from './logo.svg';
import './App.css';
// @ts-ignore
import CircularMenu from "react-disc-menu";
import { useState } from 'react';
import * as Tone from 'tone'
import { useEffect } from 'react';
import { Sequence } from 'tone';
const synth = new Tone.Synth().toDestination();

function App() {
  const notasMusicais = ['A','B','C','D','E','F','G']
  const coresNotas = ['#FF0000','#FF7F00','#FFFF00','#00FF00','#0000FF','#2E2B5F','#8B00FF']
  const [nivel,setNivel] = useState(2);
  const [score,setScore] = useState(0);
  const [seq, setSeq] = useState([] as any);
  const [seqTocada, setSeqTocada] = useState([] as any);
  const [points, setPoints] = useState(0);;

  useEffect(()=>{
    if(score>0&&score%100==0){
      setNivel(nivel+1);
    }
  },[score])

  useEffect(() => {
    console.log(seq);
  }, [seq])

  useEffect(() => {
    console.log(seqTocada);
  }, [seqTocada])

  useEffect(() => {
     console.log(score);
  }, [score])

  useEffect(() => {
    if(seq.length == seqTocada.length){
      for(let i = 0; seq.length; i++){
        if(seq[i] != seqTocada[i]) console.log("errou a sequencia")
      }

      setScore(score + 10);
    }
  }, [seq, seqTocada])

  useEffect(() => {
    console.log(points);
  }, [points])

  return (
    <>
    <CircularMenu cutout={0.25} id="disco">
       {notasMusicais.slice(0,nivel+1).map((elem,index)=>
          <button style={{backgroundColor:coresNotas[index]}} onClick={
              () => {
                synth.triggerAttackRelease(`${elem}4`, "8n")
                addNewNote(elem);
              }
            }>
            <span>{elem}</span>
          </button>)
        }
     </CircularMenu>
     <button onClick={()=>setNivel(Math.min(6,nivel+1))}>Aumentar Nível</button>
     <button onClick={()=>setNivel(Math.max(0, nivel-1))}>Diminuir Nível</button>
     <button onClick={() => {
          setSeq(tocarSequencia(notasMusicais.slice(0, nivel+1)))
        }
      }>Tocar Sequência</button>
      <p>Pontos: {points}</p>
     </>
  );

  function addNewNote(note: any) {
    setSeqTocada([...seqTocada, note]);
    if(seqTocada.length === nivel + 1) {
      for(let i = 0; i < seqTocada.length; i++) {
        if(seqTocada[i] !== seq[i])
          return;
      }
      setPoints(points + 10);
    }
  }
}

function tocarSequencia(notas: any){
  let positions = notas.length;
  let seqNotas = [];

  for(let i = 0; i < positions; i++){
    let nota = notas[Math.floor(Math.random() * positions)];
    seqNotas.push(nota);
  }

  let index = 0;

  const synthPart = new Tone.Sequence(
    function(time, note) {
      synth.triggerAttackRelease(`${note}4`, 0.5);

      index++;

      if(index == seqNotas.length) {
        synthPart.stop();
      }
    }, seqNotas, "2n"
  ) 

  Tone.Transport.start();
  synthPart.start();

  return seqNotas;
}

export default App;
