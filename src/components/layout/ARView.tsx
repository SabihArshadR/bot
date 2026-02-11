"use client";

import React, { useEffect, useState, useRef } from "react";
import Loading from "@/components/layout/Loading";
import CustomButton from "../ui/Button";
import { useTranslations } from "next-intl";

const AScene = (props: any) => React.createElement("a-scene", props);
const ACamera = (props: any) => React.createElement("a-camera", props);
const AEntity = (props: any) => React.createElement("a-entity", props);
const ACircle = (props: any) => React.createElement("a-circle", props);
const ARing = (props: any) => React.createElement("a-ring", props);

const subtitle1 = [
  {
    time: 0,
    text: "Hola! Soc el gegant de les muntanyes de Bot i som a l’estació, un lloc que sempre ha estat sinònim de camins, d’arribades i de comiats.",
  },
  {
    time: 8,
    text: "Però durant la Guerra Civil, aquest espai va viure dies de por, presses i decisions difícils.",
  },
  {
    time: 14,
    text: "A la primera setmana d’abril de 1938, el front va arribar a la Terra Alta. El 2 d’abril, Bot va ser ocupat per soldats italians de la Divisió Littorio, aliats de Franco.",
  },
  {
    time: 25,
    text: "Abans que entressin al poble, moltes famílies van fugir per por de represàlies. Entre elles, l’alcalde i altres veïns compromesos amb la República.",
  },
  {
    time: 34,
    text: "Alguns no tornarien mai: un d’ells, per exemple, acabaria morint assassinat al camp de concentració de Gusen l’any 1941.",
  },
  {
    time: 42,
    text: "L’estada dels italians va ser breu, però el pas de la guerra va deixar una petjada profunda. Al cementiri de Bot s’hi van enterrar més de 130 soldats morts als combats del Baix Ebre.",
  },
  {
    time: 52,
    text: "Quan el front es va estabilitzar al riu Ebre, el poble va adquirir un paper clau a la rereguarda, i el tren va esdevenir una peça fonamental.",
  },
  {
    time: 60,
    text: "La línia ferroviària de la Val de Zafán, llargament esperada des del segle XIX, es va allargar fins a Pinell de Brai per facilitar el moviment ràpid de tropes i material.",
  },
  {
    time: 70,
    text: "Aquella obra ferroviària, pensada inicialment per unir Aragó amb el port dels Alfacs i ajudar a vendre productes del camp i el carbó de Terol, va acabar tenint un ús militar.",
  },
  {
    time: 79,
    text: "La via, paral·lela a l’Ebre, també servia per reforçar la defensa del territori.",
  },
  {
    time: 84,
    text: "La matinada del 25 de juliol de 1938, amb l’inici de la batalla de l’Ebre, l’estació de Bot va tornar a ser protagonista.",
  },
  {
    time: 92,
    text: "Hi havia pocs soldats, sobretot enginyers encarregats del servei del tren, però aquell mateix dia van prendre una decisió urgent:",
  },
  {
    time: 99,
    text: "van aixecar i tornar a col·locar un tram de via per deixar-la inutilitzada i frenar l’avanç de l’Exèrcit de l’Ebre, que ja havia pres l’estació de Pinell de Brai.",
  },
  {
    time: 109,
    text: "Els dies següents van ser de tensió constant. Alguns soldats republicans van arribar fins a les portes del poble i hi va haver intercanvis de trets.",
  },
  {
    time: 116,
    text: "Des de l’ermita de Sant Josep també es disparava cap a l’estació.",
  },
  {
    time: 119,
    text: "Amb l’arribada de reforços franquistes, els atacs es van aturar, però Bot va començar a omplir-se de tropes, material de guerra, cuines de campanya, hospitals i serveis.",
  },
  {
    time: 129,
    text: "Fins i tot el pas soterrat de l’estació es va fer servir com a lloc de comandament.",
  },
  {
    time: 134,
    text: "El 2 de setembre de 1938, el poble va patir un dels bombardejos més durs: sis avions “Katiuska” i dotze caces van atacar l’estació i el nucli antic.",
  },
  {
    time: 143,
    text: "Hi van morir veïns i treballadors del ferrocarril, i als afores del poble les baixes militars van ser nombroses.",
  },
  {
    time: 149,
    text: "Davant d’aquesta situació, l’Ajuntament va haver de reunir-se en sessió permanent per poder donar resposta a totes les necessitats.",
  },
  {
    time: 155,
    text: "Avui, aquell tren ja no circula. Després de dècades de servei, la línia es va tancar definitivament als anys setanta.",
  },
  {
    time: 161,
    text: "Però el camí no s’ha perdut: des de l’any 2000, l’antic traçat és una via verda que permet caminar i anar en bicicleta entre túnels i viaductes, convertint un espai de guerra en un espai de memòria i pau.",
  },
  {
    time: 174,
    text: "Ara necessito la vostra ajuda. Busqueu amb la realitat augmentada els pans de pagès que trobareu a l’entorn.",
  },
  {
    time: 180,
    text: "Quan els trobeu, us faré una pregunta. Si la responeu bé, recuperarem un element de la Dansada.",
  },
  {
    time: 186,
    text: "Vos espero a la propera parada!",
  },
];

const subtitle2 = [
  {
    time: 0,
    text: "Ara us vull explicar una altra cosa que va passar aquí quan va començar la batalla de l’Ebre:",
  },
  {
    time: 5,
    text: "en pocs dies, Bot es va convertir en un lloc clau de la rereguarda, és a dir, just darrere del front.",
  },
  {
    time: 11,
    text: "Per atendre els ferits, al poble s’hi van instal·lar fins a tres hospitals, amb equips per fer operacions, i també un punt de socors on rebien els soldats, els feien les primeres cures i els repartien cap als diferents espais.",
  },
  {
    time: 25,
    text: "Els qui estaven massa greus per ser traslladats es quedaven hospitalitzats a Bot.",
  },
  {
    time: 30,
    text: "Dos hospitals, segons recorden veïns i estudiosos, eren al carrer Freixes, a la casa Freixes i a un antic local que avui ja no existeix, on ara hi ha el mercat municipal.",
  },
  {
    time: 41,
    text: "Un altre hospital era al carrer Major, a la casa Paladella. Allà van adaptar les plantes de la casa per posar-hi molts llits en habitacions grans, amb una sala d’operacions.",
  },
  {
    time: 51,
    text: "Hi treballaven infermeres i també dones del poble, que ajudaven amb feines com netejar i desinfectar material, fer els llits o preparar àpats.",
  },
  {
    time: 61,
    text: "A mesura que la batalla avançava, van arribar milers de ferits i la feina es va intensificar molt, sobretot a partir del 3 de setembre de 1938, quan va començar una nova ofensiva.",
  },
  {
    time: 73,
    text: "A la plaça del poble, sovint s’hi veien ambulàncies entrant i sortint per portar els pacients d’un lloc a un altre.",
  },
  {
    time: 79,
    text: "Aquesta història fins i tot surt en una novel·la: El monarca de las sombras, de Javier Cercas, on apareix l’hospital de la casa Paladella.",
  },
  {
    time: 86,
    text: "I, enmig de tot plegat, molts veïns que es van quedar al poble també van ajudar com van poder, per exemple cosint roba; diuen que alguns militars alemanys pagaven amb bitllets antics del seu país.",
  },
  {
    time: 98,
    text: "Ara heu d’ajudar-me! Busqueu amb la realitat augmentada els setrills d’oli que trobareu a l’entorn.",
  },
  {
    time: 104,
    text: "Quan ho aconseguiu, us faré una pregunta i, si l’encerteu, guanyareu un element de la Dansada.",
  },
  {
    time: 109,
    text: "Ens veiem a la propera parada!",
  },
];

const subtitle3 = [
  {
    time: 0,
    text: "Hola! Ara us vull explicar una part de la història que va passar al poble abans que arribés el front.",
  },
  {
    time: 6,
    text: "L’estiu de 1936, amb l’inici de la Guerra Civil, Catalunya no va caure sota el cop militar, però va començar un temps de grans canvis.",
  },
  {
    time: 14,
    text: "A molts pobles, també aquí a Bot, persones i col·lectius que es declaraven antifeixistes van prendre decisions ràpides per sobreviure i reorganitzar la vida quotidiana.",
  },
  {
    time: 23,
    text: "A Bot, alguns béns van ser confiscats: cases, finques, molins d’oli, cellers i corrals que pertanyien a propietaris considerats de dretes.",
  },
  {
    time: 32,
    text: "Part d’aquests recursos van passar a mans de col·lectivitats de treballadors, que els van fer servir per assegurar menjar i feina en un moment molt difícil.",
  },
  {
    time: 38,
    text: "Fins i tot la pedra sobrant d’unes obres a l’església es va reutilitzar per construir un corral.",
  },
  {
    time: 44,
    text: "Aquells mesos també van deixar ferides profundes. L’església parroquial va ser saquejada i modificada, i l’ermita de Sant Josep, als afores del poble, va ser incendiada.",
  },
  {
    time: 53,
    text: "Però el més dur va ser la detenció de molts veïns:",
  },
  {
    time: 56,
    text: "una quarantena van ser empresonats i tretze d’ells assassinats sense judici. Van morir en diferents indrets, lluny del poble, durant els mesos d’agost i setembre de 1936.",
  },
  {
    time: 66,
    text: "Anys més tard, durant la dictadura, aquests morts van ser recordats només des d’una mirada, i durant dècades una gran placa amb una creu presidia la façana de l’església.",
  },
  {
    time: 76,
    text: "Aquesta placa es va retirar l’any 2010, quan es va rehabilitar el temple.",
  },
  {
    time: 81,
    text: "Amb el pas del temps, es va formar un nou ajuntament amb representants de partits i sindicats antifeixistes.",
  },
  {
    time: 88,
    text: "Enmig de l’escassetat, el poble va haver d’inventar solucions pràctiques: com que faltava moneda petita, l’Ajuntament va imprimir bitllets municipals per poder comprar i vendre aliments.",
  },
  {
    time: 97,
    text: "N’hi havia de diferents valors, des d’una pesseta fins a deu cèntims.",
  },
  {
    time: 100,
    text: "La guerra també va portar gent de fora. Bot va acollir famílies refugiades d’altres zones, mentre molts veïns en edat militar van ser cridats a lluitar.",
  },
  {
    time: 108,
    text: "Alguns ho van fer de manera voluntària, d’altres obligats. En total, vint-i-sis veïns o residents de Bot van morir al front, en un bàndol o en l’altre.",
  },
  {
    time: 116,
    text: "Quan el poble va ser ocupat pels franquistes l’abril de 1938, va començar una nova etapa de por. Amb les noves autoritats, molts veïns d’esquerres van ser detinguts, jutjats o empresonats.",
  },
  {
    time: 126,
    text: "Alguns van ser afusellats, altres condemnats a presó, i alguns van quedar lliures per manca de proves. En total, més d’un centenar de botencs van patir la repressió.",
  },
  {
    time: 136,
    text: "Moltes famílies van optar per fugir. Amb la derrota republicana, alguns veïns van travessar la frontera cap a França.",
  },
  {
    time: 142,
    text: "Allà, dones i infants van viure en camps de concentració en condicions molt dures. I els qui tornaven sovint no eren ben rebuts: alguns patien humiliacions públiques i eren assenyalats durant anys.",
  },
  {
    time: 154,
    text: "És una història difícil, però forma part del camí del poble. I entendre-la també és una manera de cuidar la memòria.",
  },
  {
    time: 159,
    text: "Ara necessito la vostra ajuda. Busqueu amb la realitat augmentada les ametlles que trobareu a l’entorn.",
  },
  {
    time: 165,
    text: "Quan ho aconseguiu, us faré una pregunta i, si l’encerteu, guanyareu un element de la Dansada.",
  },
  {
    time: 169,
    text: "Ens veiem a la propera parada!",
  },
];

const subtitle4 = [
  {
    time: 0,
    text: "Hola! Ara som en un lloc on el silenci pesa diferent, perquè sota aquesta terra s’hi amaguen moltes històries de la guerra.",
  },
  {
    time: 8,
    text: "Durant l’any 1938, el cementiri de Bot es va convertir en un lloc d’enterrament de soldats franquistes.",
  },
  {
    time: 15,
    text: "Quan el poble va ser ocupat el 2 d’abril i els combats es van intensificar a la zona de Paüls i Xerta, molts soldats caiguts van ser enterrats aquí.",
  },
  {
    time: 22,
    text: "La majoria eren italians, enviats per Mussolini per ajudar Franco, tot i que també n’hi havia alguns d’espanyols.",
  },
  {
    time: 28,
    text: "Durant un temps, aquest va ser el cementiri de la zona amb més soldats feixistes enterrats.",
  },
  {
    time: 33,
    text: "Els soldats eren sepultats de manera senzilla, embolicats amb un llençol i sense taüt. A sobre de cada tomba s’hi col·locava una creu de fusta amb el seu nom, la graduació i la unitat.",
  },
  {
    time: 44,
    text: "Més endavant, algunes d’aquestes creus es van substituir per làpides. També es va aixecar una gran creu monumental, i en diverses ocasions els seus companys els van retre homenatge.",
  },
  {
    time: 55,
    text: "D’aquells actes se n’han conservat fotografies.",
  },
  {
    time: 58,
    text: "Quan la guerra va acabar, els cossos dels soldats italians van ser traslladats a Saragossa, on es va construir un mausoleu per reunir-los tots.",
  },
  {
    time: 66,
    text: "Tot i això, al cementiri de Bot encara es conserven moltes de les seves làpides, algunes mig enterrades en un dels passadissos.",
  },
  {
    time: 74,
    text: "Amb l’inici de la batalla de l’Ebre, el 25 de juliol de 1938, Bot va quedar just darrere del front. El poble es va omplir d’hospitals, serveis militars i soldats.",
  },
  {
    time: 85,
    text: "Els morts arribaven en carros fins al cementiri, i aviat ja no hi cabien. Per això es va habilitar una gran finca agrícola darrere del fossar com a nova necròpoli militar.",
  },
  {
    time: 95,
    text: "Allà s’hi van enterrar prop de mil cinc-cents soldats, la majoria morts durant les contraofensives de la tardor.",
  },
  {
    time: 102,
    text: "Hi havia soldats espanyols de diferents bàndols i també un grup de mercenaris marroquins.",
  },
  {
    time: 106,
    text: "Els cossos es col·locaven en llargues rases, amb una petita ampolla entre les cames on s’hi posava el nom. A sobre, una creueta de fusta.",
  },
  {
    time: 115,
    text: "Aquest espai va quedar intacte durant molts anys, tancat amb filferro. Però la primavera de 1959 tot va canviar.",
  },
  {
    time: 122,
    text: "La dictadura franquista va ordenar exhumar les restes per portar-les al Valle de los Caídos, un gran monument funerari construït per Franco.",
  },
  {
    time: 129,
    text: "Al poble, molts veïns van ser obligats a participar en les excavacions.",
  },
  {
    time: 132,
    text: "Mentre retiraven ossos, sovint hi apareixien objectes personals com rellotges, cadenes o rosaris.",
  },
  {
    time: 138,
    text: "En total, més de mil soldats van ser traslladats. Avui, aquell lloc és només una finca amb ametllers abandonats.",
  },
  {
    time: 145,
    text: "Entre els enterrats també hi havia alguns requetès catalans, soldats carlistes que lluitaven amb Franco.",
  },
  {
    time: 150,
    text: "Les restes d’alguns d’ells no van ser traslladades, sinó portades més tard al monestir de Montserrat.",
  },
  {
    time: 155,
    text: "Un dels soldats, veí de Bot, va ser enterrat al panteó familiar, on encara descansa.",
  },
  {
    time: 160,
    text: "Sobre els soldats marroquins, no tot és clar. Alguns historiadors pensen que també van ser traslladats, però d’altres creuen que no, perquè al Valle de los Caídos només s’hi portaven soldats espanyols i catòlics.",
  },
  {
    time: 170,
    text: "El que sí se sap és que van ser enterrats en una zona separada.",
  },
  {
    time: 173,
    text: "Avui, dins el cementiri, hi ha un monòlit que recorda totes les víctimes de la Guerra Civil. No parla de bàndols, sinó de persones. I aquest és el silenci que cal escoltar.",
  },
  {
    time: 182,
    text: "Ara necessito la vostra ajuda. Busqueu amb la realitat augmentada els raïms que hi ha a l’entorn.",
  },
  {
    time: 188,
    text: "Quan ho aconseguiu, us faré una pregunta i, si l’encerteu, guanyareu un element de la Dansada.",
  },
];

const subtitle5 = [
  {
    time: 0,
    text: "Hola! Hem arribat a l’última parada. Caminem per un tram de via que sembla tranquil, però que amaga una història molt dura.",
  },
  {
    time: 8,
    text: "Aquí, el tren no només va portar soldats i mercaderies: també va portar patiment.",
  },
  {
    time: 14,
    text: "Quan les tropes franquistes van ocupar el marge dret de l’Ebre, la primavera de 1938, el ferrocarril de la Val de Zafán es va convertir en una prioritat militar.",
  },
  {
    time: 23,
    text: "Calia fer-lo arribar tan lluny com fos possible per controlar el territori.",
  },
  {
    time: 28,
    text: "Per això, en pocs mesos, la línia es va allargar fins a Valljunquera i després fins a Pinell de Brai, passant per Bot.",
  },
  {
    time: 35,
    text: "Per fer-ho, el règim franquista no va contractar treballadors lliures. Va portar presoners republicans des dels camps de concentració.",
  },
  {
    time: 42,
    text: "Eren soldats vençuts, obligats a treballar en unitats anomenades Batallons de Treballadors.",
  },
  {
    time: 47,
    text: "A la Val de Zafán n’hi van arribar diversos, i van ser els encarregats d’estendre vies, moure pedres i obrir camins.",
  },
  {
    time: 54,
    text: "Cal saber que gran part del traçat ja s’havia construït abans de la guerra. Durant anys, molts obrers havien obert túnels i aixecat viaductes enmig d’un paisatge difícil, amb problemes de diners, vagues i acomiadaments.",
  },
  {
    time: 66,
    text: "Però la guerra ho va accelerar tot, i el treball forçat va substituir la feina lliure.",
  },
  {
    time: 71,
    text: "Durant la batalla de l’Ebre, el tren va tenir un paper clau. Quan l’estació de Pinell de Brai va quedar en mans republicanes, el front es va fixar entre aquell punt i Bot.",
  },
  {
    time: 81,
    text: "Hi va haver combats fins i tot dins dels túnels.",
  },
  {
    time: 84,
    text: "Mentrestant, l’estació de Bot rebia una enorme quantitat de material de guerra: armes, munició, provisions.",
  },
  {
    time: 89,
    text: "Cada dia hi arribaven combois immensos, carregats amb milers de tones. Els ferits menys greus també eren evacuats en tren cap a l’Aragó.",
  },
  {
    time: 98,
    text: "Quan la batalla va acabar, els treballs a la línia es van reprendre amb encara més mà d’obra forçada.",
  },
  {
    time: 103,
    text: "Els presoners van haver d’obrir pedreres, carregar amb les pedres, col·locar rails i reconstruir viaductes malmesos.",
  },
  {
    time: 110,
    text: "Més endavant, els Batallons de Treballadors van ser substituïts per altres unitats de càstig formades per soldats considerats desafectes al règim.",
  },
  {
    time: 118,
    text: "Entre 1938 i 1942, milers de presos van treballar aquí en condicions molt dures: a la intempèrie, amb poc menjar, descans escàs i càstigs constants.",
  },
  {
    time: 130,
    text: "Tot i això, el contacte continu amb el poble va fer que, de vegades, naixessin relacions humanes inesperades, fins i tot històries d’amor. Si us hi fixeu bé, encara avui es poden veure les petjades d’aquells anys.",
  },
  {
    time: 141,
    text: "A l’altra banda del riu Canaletes hi ha una balma on es va construir un polvorí per guardar explosius.",
  },
  {
    time: 146,
    text: "I a l’entrada d’alguns túnels encara es veuen marques de bales, record dels combats viscuts durant la guerra.",
  },
  {
    time: 151,
    text: "Aquest camí tranquil va ser, durant un temps, un lloc de treball forçat i de guerra. I caminar-lo avui també és una manera de recordar-ho.",
  },
  {
    time: 158,
    text: "Ara necessito la vostra ajuda. Busqueu amb la realitat augmentada les salsitxes que hi ha a l’entorn.",
  },
  {
    time: 163,
    text: "Quan ho aconseguiu, us faré una pregunta i, si l’encerteu, guanyareu el darrer element de la Dansada que farà que torni a sonar i que pugui tornar a descansar.",
  },
  {
    time: 170,
    text: "Endavant!",
  },
];

const Marker = React.forwardRef((_, ref: any) => (
  <AEntity ref={ref} position="0 -0.9 -2">
    <ARing
      radius-inner="0.3"
      radius-outer="0.4"
      color="#4F46E5"
      opacity="0.8"
      rotation="-90 0 0"
    />
    <ACircle radius="0.3" color="#10B981" opacity="0.5" rotation="-90 0 0" />
  </AEntity>
));
Marker.displayName = "Marker";

interface AvatarProps {
  position: { x: number; y: number; z: number };
  isPlaying: boolean;
  deviceOrientation: { alpha: number; beta: number; gamma: number };
  userRotationY?: number;
  userScale?: number;
}

const Avatar = React.forwardRef((props: AvatarProps, forwardedRef: any) => {
  const localRef = useRef<any>(null);
  const avatarRef = forwardedRef || localRef;
  const {
    position,
    isPlaying,
    deviceOrientation,
    userRotationY = 0,
    userScale = 0.5,
  } = props;

  useEffect(() => {
    if (avatarRef.current) {
      const entity = avatarRef.current;
      const mesh = entity.getObject3D("mesh");

      const disableFrustumCulling = (m: any) => {
        m.traverse((obj: any) => {
          obj.frustumCulled = false;
        });
      };

      if (mesh) {
        disableFrustumCulling(mesh);
      } else {
        entity.addEventListener("model-loaded", (evt: any) => {
          disableFrustumCulling(evt.detail.model);
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AEntity
      ref={avatarRef}
      position={`${position.x} ${position.y} ${position.z}`}
      rotation={`-10 ${deviceOrientation.alpha + userRotationY} 0`}
      scale={`${userScale} ${userScale} ${userScale}`}
    >
      <AEntity
        light="type: point; color: #ffffff; intensity: 0; distance: 5; decay: 2"
        position="0 1 0"
      />
      <AEntity
        gltf-model="url(/models/ANIMACION_OK.glb)"
        animation-mixer={
          isPlaying
            ? // ? `clip: rig.001Action|CircleAction|eye.leftAction|eye.rightAction|eyelid_left_downAction|eyelid_left_upAction|eyelid_right_downAction|eyelid_right_upAction|tongueAction; useRegExp: true; loop: repeat; timeScale: 1`
              // : `clip: rig.001Action|CircleAction|eye.leftAction|eye.rightAction|eyelid_left_downAction|eyelid_left_upAction|eyelid_right_downAction|eyelid_right_upAction|tongueAction; useRegExp: true; loop: repeat; timeScale: 0`
              "clip: *; loop: repeat; timeScale: 1"
            : "clip: *; loop: repeat; timeScale: 0"
        }
      />
    </AEntity>
  );
});
Avatar.displayName = "Avatar";

const Page = ({
  setShowARView,
  handleClose,
  audioUrl,
  linkLoad,
  from,
}: any) => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [activeSubtitle, setActiveSubtitle] = useState("");
  const [showSubtitleButton, setShowSubtitleButton] = useState(false);
  const t = useTranslations("gameText");
  const t2 = useTranslations("intro");
  const [showMovementInstructions, setShowMovementInstructions] =
      useState(false);

  const [avatarPos, setAvatarPos] = useState<{
    x: number;
    y: number;
    z: number;
  } | null>(null);
  const [isPlayingState, setIsPlayingState] = useState(false);
  const [showAudioPopup, setShowAudioPopup] = useState(false);
  const [audioCompleted, setAudioCompleted] = useState(false);
  const [deviceOrientation, setDeviceOrientation] = useState({
    alpha: 0,
    beta: 0,
    gamma: 0,
  });
  const [userRotationY, setUserRotationY] = useState(0);
  const [userScale, setUserScale] = useState(0.5);

  const isPlayingRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const markerRef = useRef<any>(null);
  const avatarRef = useRef<any>(null);
  const gestureState = useRef<any>({});
  const orientationHandlerRef = useRef<any>(null);
  const dracoInitializedRef = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        stream.getTracks().forEach((track) => track.stop());
        setPermissionGranted(true);

        if (
          typeof DeviceOrientationEvent !== "undefined" &&
          // @ts-ignore
          typeof DeviceOrientationEvent.requestPermission === "function"
        ) {
          try {
            // @ts-ignore
            const permission = await DeviceOrientationEvent.requestPermission();
            if (permission === "granted") startOrientationTracking();
          } catch {
            /* ignore */
          }
        } else {
          startOrientationTracking();
        }
      } catch {
        setPermissionGranted(false);
      }
    })();

    return () => {
      if (orientationHandlerRef.current)
        window.removeEventListener(
          "deviceorientation",
          orientationHandlerRef.current,
        );
    };
  }, []);

  const startOrientationTracking = () => {
    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      setDeviceOrientation({
        alpha: event.alpha || 0,
        beta: event.beta || 0,
        gamma: event.gamma || 0,
      });
    };
    orientationHandlerRef.current = handleDeviceOrientation;
    window.addEventListener("deviceorientation", handleDeviceOrientation);
  };

  const isIOS = () =>
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !(window as any).MSStream;

  const updateSubtitle = (currentTime: number) => {
    if (!showSubtitles) {
      setActiveSubtitle("");
      return;
    }
    
    // Determine which subtitle set should be used for the current POI
    let index: number | undefined;

    // 1. If `from` is already a number, use it directly
    if (typeof from === "number") {
      index = from;
    } else {
      // 2. If `from` is a numeric string (e.g. "2"), convert it
      const maybeNum = Number(from);
      if (!isNaN(maybeNum)) {
        index = maybeNum;
      } else {
        /*
         * 3. Fallback: infer the POI index from the audio file name.
         *    Example pattern: "/audios/en/3.mp3"  -> index = 2 (zero-based)
         */
        if (typeof audioUrl === "string") {
          const match = audioUrl.match(/\/(\d+)\.mp3$/);
          if (match) {
            index = parseInt(match[1], 10) - 1; // audio files are 1-based
          }
        }
      }
    }

    // Map the resolved index to a subtitle array
    let currentSubtitleArray:
      | typeof subtitle1
      | typeof subtitle2
      | typeof subtitle3
      | typeof subtitle4
      | typeof subtitle5;

    switch (index) {
      case 0:
        currentSubtitleArray = subtitle1;
        break;
      case 1:
        currentSubtitleArray = subtitle2;
        break;
      case 2:
        currentSubtitleArray = subtitle3;
        break;
      case 3:
        currentSubtitleArray = subtitle4;
        break;
      case 4:
        currentSubtitleArray = subtitle5;
        break;
      default:
        currentSubtitleArray = subtitle1; // safe default
    }

    // Find the appropriate subtitle for the current time
    const currentSubtitle = [...currentSubtitleArray]
      .reverse()
      .find(s => currentTime >= s.time);
    setActiveSubtitle(currentSubtitle?.text || "");
  };

  const toggleSubtitles = () => {
    setShowSubtitles(!showSubtitles);
    if (!showSubtitles && audioRef.current) {
      updateSubtitle(audioRef.current.currentTime);
    } else {
      setActiveSubtitle("");
    }
  };

  const startAnimationAndAudio = async () => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(audioUrl);
        audioRef.current.preload = "auto";
        audioRef.current.ontimeupdate = () => {
          if (audioRef.current) {
            updateSubtitle(audioRef.current.currentTime);
          }
        };
        audioRef.current.onplay = () => {
          setShowSubtitleButton(true);
          if (showSubtitles) {
            updateSubtitle(audioRef.current?.currentTime || 0);
          }
        };
        audioRef.current.onended = () => {
          stopAnimationAndAudio();
          setAudioCompleted(true);
          setTimeout(() => handleBackFromAR(), 100);
        };
      }
      await audioRef.current.play();
      isPlayingRef.current = true;
      setIsPlayingState(true);
    } catch (err) {
      console.log("Playback failed:", err);
      setShowAudioPopup(true);
    }
  };

  const stopAnimationAndAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = "";
    }
    isPlayingRef.current = false;
    setIsPlayingState(false);
    setActiveSubtitle("");
    setShowSubtitleButton(false);
  };

  const handleBackFromAR = () => {
    stopAnimationAndAudio();
    setShowARView(false);
    handleClose();
  };

  const handleAllowAudio = () => {
    setShowAudioPopup(false);
    startAnimationAndAudio();
  };

  const placeAvatar = () => {
    if (markerRef.current) {
      const worldPos = new (window as any).THREE.Vector3();
      markerRef.current.object3D.getWorldPosition(worldPos);
      setAvatarPos({ x: worldPos.x, y: worldPos.y + 0.3, z: worldPos.z });
      startAnimationAndAudio();
      setShowMovementInstructions(true);
    }
  };

  const getTouchDistance = (t0: any, t1: any) => {
    const dx = t0.clientX - t1.clientX;
    const dy = t0.clientY - t1.clientY;
    return Math.hypot(dx, dy);
  };

  const getTouchMidpoint = (t0: any, t1: any) => ({
    x: (t0.clientX + t1.clientX) / 2,
    y: (t0.clientY + t1.clientY) / 2,
  });

  const onTouchStart = (e: React.TouchEvent) => {
    if (!avatarPos) return;
    e.stopPropagation();

    if (showMovementInstructions) {
      setShowMovementInstructions(false);
    }

    const touches = e.touches;
    gestureState.current.start = true;
    if (touches.length === 1) {
      gestureState.current.mode = "rotate";
      gestureState.current.startX = touches[0].clientX;
      gestureState.current.startRotationY = userRotationY;
    } else if (touches.length === 2) {
      gestureState.current.mode = "pinch";
      gestureState.current.startDist = getTouchDistance(touches[0], touches[1]);
      gestureState.current.startScale = userScale;
      gestureState.current.startMid = getTouchMidpoint(touches[0], touches[1]);
      gestureState.current.startPos = { ...avatarPos };
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!gestureState.current.start) return;
    e.preventDefault();
    const touches = e.touches;
    if (gestureState.current.mode === "rotate" && touches.length === 1) {
      const dx = touches[0].clientX - gestureState.current.startX;
      const deltaY = dx * 0.2;
      setUserRotationY(gestureState.current.startRotationY + deltaY);
    } else if (touches.length === 2) {
      const dist = getTouchDistance(touches[0], touches[1]);
      const scaleFactor = dist / gestureState.current.startDist;
      const newScale = Math.min(
        Math.max(gestureState.current.startScale * scaleFactor, 0.2),
        2,
      );
      setUserScale(newScale);

      const mid = getTouchMidpoint(touches[0], touches[1]);
      const dy = mid.y - gestureState.current.startMid.y;
      const dx = mid.x - gestureState.current.startMid.x;
      const panFactor = 0.0025 * (1 / Math.max(newScale, 0.2));

      setAvatarPos((p) =>
        p
          ? {
              x: gestureState.current.startPos.x - dx * panFactor,
              y: gestureState.current.startPos.y - dy * panFactor,
              z: gestureState.current.startPos.z,
            }
          : p,
      );
    }
  };

  const onTouchEnd = () => {
    gestureState.current.start = false;
    gestureState.current.mode = null;
  };

  // Cleanup function to stop audio and clean up resources
  useEffect(() => {
    return () => {
      // Stop and clean up audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.src = "";
        audioRef.current = null;
      }

      // Clean up device orientation listener
      if (orientationHandlerRef.current) {
        window.removeEventListener(
          "deviceorientation",
          orientationHandlerRef.current,
        );
      }

      // Reset animation state
      isPlayingRef.current = false;
      setIsPlayingState(false);
    };
  }, []);

  useEffect(() => {
    if (!permissionGranted) return;
    if (!linkLoad) {
      setScriptsLoaded(true);
      return;
    }

    const scriptClass = "poi-page-script";
    const addedScripts: HTMLScriptElement[] = [];

    const loadScript = (src: string) =>
      new Promise<void>((resolve, reject) => {
        if ((window as any)._loadedScripts?.[src]) return resolve();
        const existing = document.querySelector(`script[src="${src}"]`);
        if (existing) return resolve();

        const s = document.createElement("script");
        s.src = src;
        s.async = false;
        s.classList.add(scriptClass);
        s.dataset.pageScript = scriptClass;
        s.onload = () => {
          (window as any)._loadedScripts = {
            ...(window as any)._loadedScripts,
            [src]: true,
          };
          resolve();
        };
        s.onerror = () => reject();
        document.head.appendChild(s);
        addedScripts.push(s);
      });

    const setupDracoLoader = () => {
      if (
        !(window as any).AFRAME ||
        !(window as any).THREE ||
        dracoInitializedRef.current
      )
        return;
      const AFRAME = (window as any).AFRAME;
      const THREE = (window as any).THREE;
      try {
        const dracoLoader = new THREE.DRACOLoader();
        dracoLoader.setDecoderPath(
          "https://www.gstatic.com/draco/versioned/decoders/1.5.6/",
        );
        dracoLoader.preload();
        if (AFRAME.components["gltf-model"]) {
          const originalUpdate =
            AFRAME.components["gltf-model"].Component.prototype.update;
          AFRAME.components["gltf-model"].Component.prototype.update =
            function (oldData: any) {
              if (!this.loader) this.loader = new THREE.GLTFLoader();
              if (!this.loader.dracoLoader)
                this.loader.setDRACOLoader(dracoLoader);
              if (originalUpdate) return originalUpdate.call(this, oldData);
            };
        }
        dracoInitializedRef.current = true;
      } catch {
        /* ignore */
      }
    };

    const loadAll = async () => {
      try {
        if (!(window as any).AFRAME) {
          await loadScript("https://aframe.io/releases/1.3.0/aframe.min.js");
        }
        await new Promise((resolve) => {
          const check = () =>
            (window as any).AFRAME ? resolve(true) : setTimeout(check, 50);
          check();
        });

        if (isIOS()) {
          await loadScript(
            "https://cdn.jsdelivr.net/gh/AR-js-org/AR.js@3.4.5/aframe/build/aframe-ar.js",
          );
        } else {
          await loadScript(
            "https://cdn.jsdelivr.net/gh/AR-js-org/AR.js@3.4.5/aframe/build/aframe-ar-nft.min.js",
          );
        }

        await loadScript(
          "https://cdn.jsdelivr.net/npm/aframe-extras@7.6.0/dist/aframe-extras.min.js",
        );
        if (!(window as any).THREE) {
          await loadScript(
            "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js",
          );
        }
        await loadScript(
          "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/DRACOLoader.js",
        );
        setupDracoLoader();
        setScriptsLoaded(true);
      } catch {
        setScriptsLoaded(false);
      }
    };

    loadAll();
  }, [permissionGranted, linkLoad]);

  if (!permissionGranted) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-white w-full">
        <p>⚠️ {t("cameraPermission")}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {t("try_again")}
        </button>
      </div>
    );
  }

  if (!scriptsLoaded || !(window as any).AFRAME) return <Loading />;

  return (
    <div className="w-full h-screen relative">
      <AScene
        vr-mode-ui="enabled: false"
        embedded
        arjs="sourceType: webcam; videoTexture: true; facingMode: environment; debugUIEnabled: false"
        renderer="alpha: true; logarithmicDepthBuffer: true; precision: mediump; colorManagement: true; toneMapping: Linear " // colorManagement: true; toneMapping: Linear;
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <AEntity light="type: ambient; color: #ffffff; intensity: 1.5" />
        <AEntity
          light="type: directional; color: #ffffff; intensity: 1.5"
          position="1 1 1"
        />

        <ACamera position="0 0 0" look-controls="touchEnabled: false">
          {!avatarPos && <Marker ref={markerRef} />}
        </ACamera>

        {avatarPos && (
          <Avatar
            ref={avatarRef}
            position={avatarPos}
            isPlaying={isPlayingState}
            deviceOrientation={deviceOrientation}
            userRotationY={userRotationY}
            userScale={userScale}
          />
        )}
      </AScene>

      {avatarPos && (
        <div
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onTouchCancel={onTouchEnd}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2147483648,
            touchAction: "none",
            background: "transparent",
          }}
        />
      )}

      {!avatarPos && (
        <div
          className={`fixed bottom-10 w-full flex justify-center ${from == "intro" ? "left-0" : ""}`}
          style={{ zIndex: 2147483646 }}
        >
          <CustomButton
            onClick={placeAvatar}
            className="px-6 py-3 !w-[300px] text-white shadow-lg"
          >
            {t("place")}
          </CustomButton>
        </div>
      )}

      {showAudioPopup && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70"
          style={{ zIndex: 2147483647 }}
        >
          <div className="bg-white p-6 rounded-xl shadow-xl flex flex-col items-center gap-4">
            <p className="text-lg font-semibold text-center">
              🔊 {t("audioPermission")}
            </p>
            <CustomButton
              onClick={handleAllowAudio}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {t("audioAllow")}
            </CustomButton>
            <CustomButton
              onClick={() => setShowAudioPopup(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded"
            >
              {t("Cancel")}
            </CustomButton>
          </div>
        </div>
      )}
      {showSubtitleButton && (
        <div className="fixed top-6 right-4 z-[2147483647]">
          <button
            onClick={toggleSubtitles}
            className="px-3 py-2 text-[11px] bg-black/70 text-white rounded-lg transition-all duration-400 ease-in-out hover:brightness-150 active:brightness-150 active:-translate-y-[5px]"
          >
            {/* {showSubtitles ? "Amagar subtítols" : "Mostrar subtítols"} */}
            {t2(showSubtitles ? "sub1" : "sub2")}
          </button>
        </div>
      )}

      {activeSubtitle && showSubtitles && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%]">
          <div className="bg-black/70 text-white text-center px-4 py-5 rounded-lg text-[13px] leading-relaxed shadow-lg">
            {activeSubtitle}
          </div>
        </div>
      )}
      {showMovementInstructions && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[2147483647] w-[90%] max-w-md">
          <div className="bg-black/80 text-white text-center px-6 py-4 rounded-xl shadow-2xl border border-white/20">
            <p className="text-base font-medium mb-2">💡 {t2("info1")}</p>
            <p className="text-sm opacity-90">
              {t2("info2")} <br></br> {t2("info3")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
