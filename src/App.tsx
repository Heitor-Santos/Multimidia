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
  const [seq, setSeq] = useState([] as any);
  const [seqTocada, setSeqTocada] = useState([] as any);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    addNewNote();
  }, [seqTocada])

  useEffect(() => {
    console.log(points);
    if((points > 0 && points % 30 == 0) && nivel < 6){
      setNivel(nivel+1);
    }
  }, [points])

  return (
    <>
    <CircularMenu cutout={0.25} id="disco">
       {notasMusicais.slice(0,nivel+1).map((elem,index)=>
          <button style={{backgroundColor:coresNotas[index]}} onClick={
              () => {
                synth.triggerAttackRelease(`${elem}4`, "2n")
                setSeqTocada([...seqTocada, elem]);
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

  function addNewNote() {
    if(seqTocada.length === seq.length && seqTocada.length != 0){
      for(let i = 0; i < seqTocada.length; i++){
        if(seq[i] != seqTocada[i]){
          setSeqTocada([])
          return false;
        }
      }

      setPoints(points + 10)
      setSeqTocada([])

      return true;
    }
  } 

  function tocarSequencia(notas: any){
    let positions = notas.length;
    let seqNotas = [...seq];

    let nota;
  
    if(seqNotas.length !== 0){
      nota = notas[Math.floor(Math.random() * positions)];
      seqNotas.push(nota);
    } else {
      for(let i = 0; i < positions; i++){
        nota = notas[Math.floor(Math.random() * positions)];
        seqNotas.push(nota);
      }
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
}



export default App;
