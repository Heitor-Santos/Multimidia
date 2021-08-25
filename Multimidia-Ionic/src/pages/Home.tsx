import { IonButton, IonContent, IonFooter, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar, useIonAlert } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
// @ts-ignore
import CircularMenu from "react-disc-menu";
import { useState } from 'react';
import * as Tone from 'tone'
import { useEffect } from 'react';
import { Sequence } from 'tone';
import { playOutline, arrowUpOutline, arrowDownOutline } from 'ionicons/icons';
import './Home.css';

const synth = new Tone.Synth().toDestination();

const Home: React.FC = () => {
  const [nivel, setNivel] = useState(1);
  const notasMusicais = ['C', 'D', 'F', 'E', 'G', 'A', 'B']
  const coresNotas = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#2E2B5F', '#8B00FF']
  const songsNotes = ['C', 'C', 'D', 'C', 'F', 'E', 'C', 'C', 'D', 'C', 'G', 'F', 'A']
  const [notesSet, setNotesSet] = useState(new Set());
  const [newNote, setNewNote] = useState(false);
  // let [ax, setAx] = useState(2);
  const [seq, setSeq] = useState([] as any);
  const [seqTocada, setSeqTocada] = useState([] as any);
  const [points, setPoints] = useState(0);
  const [present] = useIonAlert();
  // if(songsNotes.length>seqTocada.length && !notasMusicais.slice(0,nivel).find(el=>el==songsNotes[seqTocada.length])){
  //    setNivel(nivel+1)
  //}
  useEffect(() => {
    addNewNote();
  }, [seqTocada])

  function setLevel() {
    if (nivel + 1< notesSet.size)
      setNivel(nivel + 1);
  }

  useEffect(() => {
    if (((points > 0 && points % 30 == 0)) && nivel < 6) {
      setNivel(nivel + 1);
    }
  }, [points])
  function addNewNote() {
    if (seqTocada.length === seq.length && seqTocada.length != 0) {
      for (let i = 0; i < seqTocada.length; i++) {
        if (seq[i] != seqTocada[i]) {
          setSeqTocada([])
          setSeq([])
          present({
            cssClass: 'my-custom-class',
            header: 'Buááá',
            message: 'Você errou :(',
            buttons: [
              { text: 'Ok', handler: (d) => console.log('ok pressed') },
            ],
            onDidDismiss: (e) => console.log('did dismiss'),
          })
          return false;
        }
      }

      setPoints(points + 10)
      setSeqTocada([])

      return true;
    }
  }

  function tocarSequencia(notas: any) {
    Tone.start()

    let positions = notas.length;
    let seqNotas = [...seq];

    let nota;

    if (seqNotas.length !== 0) {
      nota = seqNotas.length > songsNotes.length ? notas[Math.floor(Math.random() * positions)] : songsNotes[seqNotas.length];
      seqNotas.push(nota);
      notesSet.add(nota)
    } else {
      for (let i = 0; i < positions; i++) {
        nota = seqNotas.length > songsNotes.length ? notas[Math.floor(Math.random() * positions)] : songsNotes[seqNotas.length];
        seqNotas.push(nota);
        notesSet.add(nota)
      }
    }
    setNewNote(false);
    let ax = 0;
    for (let i = 0; i < seqNotas.length; i++) {
      notesSet.add(seqNotas[i]);
    }
    console.log(seqNotas);
    if (notesSet.size > ax) {
      setNewNote(true);
    }
    setLevel();
    let index = 0;

    const synthPart = new Tone.Sequence(
      function (time, note) {
        synth.triggerAttackRelease(`${note}4`, 0.5);

        index++;

        if (index == seqNotas.length) {
          synthPart.stop();
        }
      }, seqNotas, "2n"
    )

    Tone.Transport.start();
    synthPart.start();

    return seqNotas;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>CInatra!</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div id="tela">
          <p>{points}</p>
          <div id='disc-box'>
            <CircularMenu cutout={0.25} id="disco">
              {notasMusicais.slice(0, nivel + 1).map((elem, index) =>
                <button style={{ backgroundColor: coresNotas[index] }} onClick={
                  () => {
                    synth.triggerAttackRelease(`${elem}4`, "8n")
                    setSeqTocada([...seqTocada, elem]);
                  }
                }>
                  <span>{elem}</span>
                </button>)
              }
            </CircularMenu>
          </div>
          <div style={{ bottom: 6, position: 'fixed', width: '100%' }} id="tela">
            <div id="div-bts">
              <IonButton onClick={() => {
                setSeq(tocarSequencia(notasMusicais.slice(0, nivel + 1)))
              }
              }>
                <IonIcon slot="icon-only" icon={playOutline} />
              </IonButton>
            </div>
            <div id='div-bts'>
              <div id='level'>
                <IonButton id='level-bt' onClick={() => setNivel(Math.min(6, nivel + 1))}>
                  <IonIcon slot="icon-only" icon={arrowUpOutline} />
                </IonButton>
                <IonButton id='level-bt' onClick={() => {
                  if (nivel >= 2) setNivel(Math.max(0, nivel - 1))
                }
                }>
                  <IonIcon slot="icon-only" icon={arrowDownOutline} />
                </IonButton>
              </div>
            </div>
          </div>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
