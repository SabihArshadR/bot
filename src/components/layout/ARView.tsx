"use client";

import React, { useEffect, useState, useRef } from "react";
import Loading from "@/components/layout/Loading";
import CustomButton from "../ui/Button";
import { useLocale, useTranslations } from "next-intl";

const AScene = (props: any) => React.createElement("a-scene", props);
const ACamera = (props: any) => React.createElement("a-camera", props);
const AEntity = (props: any) => React.createElement("a-entity", props);
const ACircle = (props: any) => React.createElement("a-circle", props);
const ARing = (props: any) => React.createElement("a-ring", props);

const subtitle1c = [
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

const subtitle2c = [
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

const subtitle3c = [
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

const subtitle4c = [
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

const subtitle5c = [
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

const subtitle1f = [
  {
    time: 0,
    text: "Bonjour ! Je suis le Géant des montagnes de Bot et nous sommes à la gare, un lieu qui a toujours été synonyme de chemins, d’arrivées et d’adieux.",
  },
  {
    time: 10,
    text: "Mais pendant la guerre civile espagnole, cet espace a vécu des jours de peur, de précipitation et de décisions difficiles.",
  },
  {
    time: 17,
    text: "Au cours de la première semaine d’avril 1938, le front est arrivé en Terra Alta. Le 2 avril, Bot fut occupé par des soldats italiens de la Division Littorio, alliés de Franco.",
  },
  {
    time: 28,
    text: "Avant leur entrée dans le village, de nombreuses familles ont fui par crainte de représailles. Parmi elles, le maire et d’autres habitants engagés aux côtés de la République.",
  },
  {
    time: 37,
    text: "Certains ne reviendraient jamais : l’un d’eux, par exemple, mourut assassiné au camp de concentration de Gusen en 1941.",
  },
  {
    time: 45,
    text: "Le séjour des Italiens fut bref, mais la guerre laissa une empreinte profonde. Plus de 130 soldats morts lors des combats du Baix Ebre furent enterrés au cimetière de Bot.",
  },
  {
    time: 54,
    text: "Lorsque le front se stabilisa sur l’Èbre, le village joua un rôle clé à l’arrière, et le train devint un élément fondamental.",
  },
  {
    time: 61,
    text: "La ligne ferroviaire de la Val de Zafán, attendue depuis le XIXe siècle, fut prolongée jusqu’à Pinell de Brai afin de faciliter le déplacement rapide des troupes et du matériel.",
  },
  {
    time: 71,
    text: "Conçue à l’origine pour relier l’Aragon au port des Alfacs et favoriser la commercialisation des produits agricoles et du charbon de Teruel, elle finit par avoir un usage militaire.",
  },
  {
    time: 80,
    text: "La voie, parallèle à l’Èbre, servait également à renforcer la défense du territoire.",
  },
  {
    time: 86,
    text: "À l’aube du 25 juillet 1938, au début de la bataille de l’Èbre, la gare de Bot redevint un lieu stratégique.",
  },
  {
    time: 93,
    text: "Peu de soldats s’y trouvaient, principalement des ingénieurs chargés du service ferroviaire, mais ce jour-là ils prirent une décision urgente :",
  },
  {
    time: 100,
    text: "ils démontèrent puis replacèrent un tronçon de voie afin de la rendre inutilisable et freiner l’avancée de l’Armée de l’Èbre, qui avait déjà pris la gare de Pinell de Brai.",
  },
  {
    time: 109,
    text: "Les jours suivants furent marqués par une tension constante. Des soldats républicains arrivèrent jusqu’aux portes du village et des échanges de tirs eurent lieu.",
  },
  {
    time: 116,
    text: "Depuis l’ermitage de Sant Josep, on tirait également en direction de la gare.",
  },
  {
    time: 120,
    text: "Avec l’arrivée de renforts franquistes, les attaques cessèrent, mais Bot se remplit de troupes, de matériel de guerre, de cuisines de campagne, d’hôpitaux et de services.",
  },
  {
    time: 130,
    text: "Même le passage souterrain de la gare servit de poste de commandement.",
  },
  {
    time: 134,
    text: "Le 2 septembre 1938, le village subit l’un des bombardements les plus violents : six avions « Katiuska » et douze chasseurs attaquèrent la gare et le centre ancien.",
  },
  {
    time: 143,
    text: "Des habitants et des cheminots périrent, et les pertes militaires furent nombreuses aux abords du village.",
  },
  {
    time: 148,
    text: "Face à cette situation, le conseil municipal dut se réunir en session permanente pour répondre aux urgences.",
  },
  {
    time: 154,
    text: "Aujourd’hui, ce train ne circule plus. Après des décennies de service, la ligne fut définitivement fermée dans les années 1970.",
  },
  {
    time: 162,
    text: "Mais le tracé n’a pas disparu : depuis 2000, l’ancienne voie est devenue une voie verte permettant de marcher ou de faire du vélo à travers tunnels et viaducs, transformant un espace de guerre en un espace de mémoire et de paix.",
  },
  {
    time: 173,
    text: "J’ai maintenant besoin de votre aide. Cherchez en réalité augmentée les pains de campagne que vous trouverez autour de vous.",
  },
  {
    time: 179,
    text: "Lorsque vous les aurez trouvés, je vous poserai une question. Si vous répondez correctement, nous récupérerons un élément de la Dansada.",
  },
  {
    time: 186,
    text: "Je vous attends à la prochaine étape !",
  },
];

const subtitle2f = [
  {
    time: 0,
    text: "Bonjour ! Je voudrais maintenant vous raconter autre chose qui s’est passée ici lorsque la bataille de l’Èbre a commencé :",
  },
  {
    time: 8,
    text: "En quelques jours, Bot est devenu un lieu clé de l’arrière-front, c’est-à-dire juste derrière la ligne de combat.",
  },
  {
    time: 15,
    text: "Pour soigner les blessés, jusqu’à trois hôpitaux furent installés dans le village, équipés pour pratiquer des opérations, ainsi qu’un poste de secours où les soldats étaient accueillis, recevaient les premiers soins puis étaient répartis vers différents espaces.",
  },
  {
    time: 29,
    text: "Ceux qui étaient trop gravement blessés pour être transférés restaient hospitalisés à Bot.",
  },
  {
    time: 34,
    text: "Selon les souvenirs d’habitants et les travaux d’historiens, deux hôpitaux se trouvaient dans la rue Freixes (dans la maison Freixes et dans un ancien local aujourd’hui disparu, à l’emplacement actuel du marché municipal).",
  },
  {
    time: 45,
    text: "Un autre hôpital était situé dans la rue Major, dans la maison Paladella. Les étages de la maison furent aménagés pour y installer de nombreux lits dans de grandes salles, avec une salle d’opération.",
  },
  {
    time: 56,
    text: "Des infirmières y travaillaient, ainsi que des femmes du village qui aidaient à nettoyer et désinfecter le matériel, faire les lits ou préparer les repas.",
  },
  {
    time: 65,
    text: "Au fur et à mesure que la bataille avançait, des milliers de blessés arrivèrent et le travail s’intensifia considérablement, surtout à partir du 3 septembre 1938, lorsqu’une nouvelle offensive commença.",
  },
  {
    time: 76,
    text: "Sur la place du village, on voyait souvent des ambulances entrer et sortir pour transporter les patients d’un endroit à un autre.",
  },
  {
    time: 84,
    text: "Cette histoire apparaît même dans un roman : El monarca de las sombras de Javier Cercas, où l’hôpital de la maison Paladella est mentionné.",
  },
  {
    time: 91,
    text: "Et au milieu de tout cela, de nombreux habitants restés au village aidèrent comme ils le pouvaient, par exemple en cousant des vêtements ; on raconte que certains militaires allemands payaient avec d’anciens billets de leur pays.",
  },
  {
    time: 102,
    text: "À présent, vous devez m’aider ! Cherchez en réalité augmentée les huiliers que vous trouverez autour de vous.",
  },
  {
    time: 109,
    text: "Lorsque vous les aurez trouvés, je vous poserai une question et, si vous répondez correctement, vous gagnerez un élément de la Dansada.",
  },
  {
    time: 115,
    text: "À la prochaine étape !",
  },
];

const subtitle3f = [
  {
    time: 0,
    text: "Bonjour ! Je voudrais maintenant vous raconter une partie de l’histoire qui s’est déroulée dans le village avant l’arrivée du front.",
  },
  {
    time: 7,
    text: "À l’été 1936, au début de la guerre civile espagnole, la Catalogne ne tomba pas sous le coup d’État militaire, mais une période de profonds changements commença.",
  },
  {
    time: 17,
    text: "Dans de nombreux villages, y compris ici à Bot, des personnes et des collectifs se déclarant antifascistes prirent des décisions rapides pour survivre et réorganiser la vie quotidienne.",
  },
  {
    time: 28,
    text: "À Bot, certains biens furent confisqués : maisons, terres, moulins à huile, caves et étables appartenant à des propriétaires considérés comme de droite.",
  },
  {
    time: 37,
    text: "Une partie de ces ressources passa aux mains de collectivités de travailleurs, qui les utilisèrent pour garantir nourriture et travail en une période très difficile.",
  },
  {
    time: 45,
    text: "Même les pierres restantes de travaux réalisés à l’église furent réutilisées pour construire une étable.",
  },
  {
    time: 51,
    text: "Ces mois laissèrent aussi de profondes blessures. L’église paroissiale fut pillée et transformée, et l’ermitage de Sant Josep, à la périphérie du village, fut incendié.",
  },
  {
    time: 61,
    text: "Mais le plus dur fut l’arrestation de nombreux habitants :",
  },
  {
    time: 64,
    text: "une quarantaine furent emprisonnés et treize d’entre eux exécutés sans jugement. Ils moururent en différents lieux, loin du village, durant les mois d’août et septembre 1936.",
  },
  {
    time: 74,
    text: "Des années plus tard, sous la dictature, ces morts furent commémorés d’un seul point de vue, et pendant des décennies une grande plaque avec une croix domina la façade de l’église.",
  },
  {
    time: 84,
    text: "Cette plaque fut retirée en 2010 lors de la restauration de l’édifice.",
  },
  {
    time: 88,
    text: "Avec le temps, un nouveau conseil municipal fut formé avec des représentants de partis et de syndicats antifascistes.",
  },
  {
    time: 95,
    text: "Face à la pénurie, le village dut inventer des solutions pratiques : faute de petite monnaie, la mairie imprima des billets municipaux pour permettre l’achat et la vente de denrées alimentaires.",
  },
  {
    time: 105,
    text: "Ils existaient en différentes valeurs, d’une peseta jusqu’à dix centimes.",
  },
  {
    time: 120,
    text: "La guerre amena aussi des personnes venues d’ailleurs. Bot accueillit des familles réfugiées d’autres régions, tandis que de nombreux habitants en âge de combattre furent appelés au front.",
  },
  {
    time: 120,
    text: "Certains s’engagèrent volontairement, d’autres y furent contraints. Au total, vingt-six habitants ou résidents de Bot moururent au combat, dans un camp ou dans l’autre.",
  },
  {
    time: 130,
    text: "Lorsque le village fut occupé par les franquistes en avril 1938, une nouvelle période de peur commença. Sous les nouvelles autorités, de nombreux habitants de gauche furent arrêtés, jugés ou emprisonnés.",
  },
  {
    time: 141,
    text: "Certains furent fusillés, d’autres condamnés à la prison, et d’autres encore libérés faute de preuves. Au total, plus d’une centaine d’habitants de Bot subirent la répression.",
  },
  {
    time: 152,
    text: "Beaucoup de familles choisirent de fuir. Après la défaite républicaine, certains habitants traversèrent la frontière vers la France.",
  },
  {
    time: 159,
    text: "Là-bas, des femmes et des enfants vécurent dans des camps de concentration dans des conditions très dures. Et ceux qui revenaient n’étaient souvent pas bien accueillis : certains subirent des humiliations publiques et furent stigmatisés pendant des années.",
  },
  {
    time: 171,
    text: "C’est une histoire difficile, mais elle fait partie du parcours du village. La comprendre est aussi une manière de préserver la mémoire.",
  },
  {
    time: 179,
    text: "J’ai maintenant besoin de votre aide. Cherchez en réalité augmentée les amandes que vous trouverez autour de vous.",
  },
  {
    time: 185,
    text: "Lorsque vous les aurez trouvées, je vous poserai une question et, si vous répondez correctement, vous gagnerez un élément de la Dansada.",
  },
  {
    time: 191,
    text: "À la prochaine étape !",
  },
];

const subtitle4f = [
  {
    time: 0,
    text: "Bonjour ! Nous nous trouvons maintenant dans un lieu où le silence pèse différemment, car sous cette terre se cachent de nombreuses histoires de la guerre.",
  },
  {
    time: 8,
    text: "En 1938, le cimetière de Bot devint un lieu d’inhumation de soldats franquistes.",
  },
  {
    time: 14,
    text: "Lorsque le village fut occupé le 2 avril et que les combats s’intensifièrent dans la région de Paüls et Xerta, de nombreux soldats tombés au combat furent enterrés ici.",
  },
  {
    time: 23,
    text: "La plupart étaient italiens, envoyés par Mussolini pour soutenir Franco, bien qu’il y eût aussi quelques Espagnols.",
  },
  {
    time: 30,
    text: "Pendant un temps, ce fut le cimetière de la région comptant le plus grand nombre de soldats fascistes enterrés.",
  },
  {
    time: 35,
    text: "Les soldats étaient inhumés simplement, enveloppés dans un drap et sans cercueil. Une croix en bois portant leur nom, leur grade et leur unité était placée au-dessus de chaque tombe.",
  },
  {
    time: 45,
    text: "Plus tard, certaines de ces croix furent remplacées par des pierres tombales. Une grande croix monumentale fut également érigée, et leurs compagnons leur rendirent hommage à plusieurs reprises.",
  },
  {
    time: 55,
    text: "Des photographies de ces cérémonies ont été conservées.",
  },
  {
    time: 58,
    text: "Après la guerre, les corps des soldats italiens furent transférés à Saragosse, où un mausolée fut construit pour les regrouper.",
  },
  {
    time: 65,
    text: "Malgré cela, de nombreuses pierres tombales subsistent encore dans le cimetière de Bot, certaines à moitié enfouies le long d’une allée.",
  },
  {
    time: 71,
    text: "Au début de la bataille de l’Èbre, le 25 juillet 1938, Bot se retrouva juste derrière le front. Le village se remplit d’hôpitaux, de services militaires et de soldats.",
  },
  {
    time: 81,
    text: "Les morts arrivaient en charrette jusqu’au cimetière, et l’espace vint rapidement à manquer. On aménagea alors un grand terrain agricole derrière le cimetière pour en faire une nouvelle nécropole militaire.",
  },
  {
    time: 91,
    text: "Près de mille cinq cents soldats y furent enterrés, la plupart morts lors des contre-offensives de l’automne.",
  },
  {
    time: 96,
    text: "On y trouvait des soldats espagnols de différents camps ainsi qu’un groupe de mercenaires marocains.",
  },
  {
    time: 101,
    text: "Les corps étaient déposés dans de longues fosses, avec une petite bouteille placée entre les jambes contenant leur nom. Au-dessus, une petite croix en bois.",
  },
  {
    time: 109,
    text: "Cet espace resta intact pendant de nombreuses années, entouré de fil de fer. Mais au printemps 1959, tout changea.",
  },
  {
    time: 116,
    text: "La dictature franquiste ordonna l’exhumation des restes pour les transférer au Valle de los Caídos, un grand monument funéraire construit par Franco.",
  },
  {
    time: 124,
    text: "De nombreux habitants du village furent contraints de participer aux fouilles.",
  },
  {
    time: 127,
    text: "En retirant les ossements, on trouvait souvent des objets personnels comme des montres, des chaînes ou des chapelets.",
  },
  {
    time: 133,
    text: "Au total, plus de mille soldats furent transférés. Aujourd’hui, cet endroit n’est plus qu’un terrain d’amandiers abandonnés.",
  },
  {
    time: 140,
    text: "Parmi les enterrés figuraient aussi des requetés catalans, soldats carlistes combattant aux côtés de Franco.",
  },
  {
    time: 146,
    text: "Les restes de certains d’entre eux ne furent pas transférés mais plus tard conduits au monastère de Montserrat.",
  },
  {
    time: 151,
    text: "L’un de ces soldats, habitant de Bot, fut inhumé dans le caveau familial, où il repose encore.",
  },
  {
    time: 156,
    text: "Concernant les soldats marocains, tout n’est pas clair. Certains historiens pensent qu’ils furent également transférés, tandis que d’autres estiment que non, car seuls des soldats espagnols et catholiques étaient envoyés au Valle de los Caídos.",
  },
  {
    time: 168,
    text: "Ce que l’on sait, c’est qu’ils furent enterrés dans une zone séparée.",
  },
  {
    time: 172,
    text: "Aujourd’hui, à l’intérieur du cimetière, un monolithe rend hommage à toutes les victimes de la guerre civile. Il ne parle pas de camps, mais de personnes. Et c’est ce silence qu’il faut savoir écouter.",
  },
  {
    time: 182,
    text: "J’ai maintenant besoin de votre aide. Cherchez en réalité augmentée les grappes de raisin autour de vous.",
  },
  {
    time: 187,
    text: "Lorsque vous les aurez trouvées, je vous poserai une question et, si vous répondez correctement, vous gagnerez un élément de la Dansada.",
  },
  {
    time: 194,
    text: "Je vous attends à la dernière étape !",
  },
];

const subtitle5f = [
  {
    time: 0,
    text: "Bonjour ! Nous sommes arrivés à la dernière étape. Nous marchons le long d’un tronçon de voie ferrée qui semble paisible, mais qui cache une histoire très dure.",
  },
  {
    time: 9,
    text: "Ici, le train n’a pas seulement transporté des soldats et des marchandises : il a aussi transporté la souffrance.",
  },
  {
    time: 16,
    text: "Lorsque les troupes franquistes occupèrent la rive droite de l’Èbre au printemps 1938, le chemin de fer de la Val de Zafán devint une priorité militaire.",
  },
  {
    time: 25,
    text: "Il fallait le prolonger le plus loin possible pour contrôler le territoire.",
  },
  {
    time: 29,
    text: "En quelques mois, la ligne fut étendue jusqu’à Valljunquera puis jusqu’à Pinell de Brai, en passant par Bot.",
  },
  {
    time: 36,
    text: "Pour cela, le régime franquiste ne fit pas appel à des ouvriers libres. Il fit venir des prisonniers républicains depuis les camps de concentration.",
  },
  {
    time: 44,
    text: "Il s’agissait de soldats vaincus, contraints de travailler dans des unités appelées Bataillons de travailleurs.",
  },
  {
    time: 50,
    text: "Plusieurs de ces bataillons furent envoyés sur la ligne de la Val de Zafán pour poser les rails, déplacer des pierres et ouvrir des chemins dans des conditions très dures.",
  },
  {
    time: 58,
    text: "Il faut savoir qu’une grande partie du tracé avait déjà été construite avant la guerre. Pendant des années, des ouvriers avaient creusé des tunnels et bâti des viaducs dans un paysage difficile, malgré des problèmes financiers, des grèves et des licenciements.",
  },
  {
    time: 72,
    text: "Mais la guerre accéléra tout, et le travail forcé remplaça le travail libre.",
  },
  {
    time: 76,
    text: "Pendant la bataille de l’Èbre, le train joua un rôle essentiel. Lorsque la gare de Pinell de Brai passa aux mains des républicains, le front se fixa entre ce point et Bot.",
  },
  {
    time: 86,
    text: "Des combats eurent même lieu à l’intérieur des tunnels.",
  },
  {
    time: 90,
    text: "Pendant ce temps, la gare de Bot recevait d’énormes quantités de matériel de guerre : armes, munitions et provisions.",
  },
  {
    time: 97,
    text: "Chaque jour arrivaient d’immenses convois chargés de milliers de tonnes. Les blessés les moins graves étaient également évacués par train vers l’Aragon.",
  },
  {
    time: 105,
    text: "Après la bataille, les travaux reprirent avec encore davantage de main-d’œuvre forcée.",
  },
  {
    time: 110,
    text: "Les prisonniers durent ouvrir des carrières, transporter des pierres, poser des rails et reconstruire des viaducs endommagés.",
  },
  {
    time: 117,
    text: "Plus tard, les Bataillons de travailleurs furent remplacés par d’autres unités disciplinaires composées de soldats considérés comme peu fidèles au régime.",
  },
  {
    time: 125,
    text: "Entre 1938 et 1942, des milliers de prisonniers travaillèrent ici dans des conditions extrêmement difficiles : exposés aux intempéries, avec peu de nourriture, peu de repos et des punitions constantes.",
  },
  {
    time: 138,
    text: "Malgré cela, le contact régulier avec les habitants donna parfois lieu à des relations humaines inattendues, voire à des histoires d’amour. Si vous observez attentivement, vous pourrez encore voir aujourd’hui des traces de ces années.",
  },
  {
    time: 151,
    text: "De l’autre côté de la rivière Canaletes se trouve une cavité rocheuse où fut construit un dépôt d’explosifs.",
  },
  {
    time: 157,
    text: "À l’entrée de certains tunnels, on peut encore apercevoir des impacts de balles, souvenirs des combats de la guerre.",
  },
  {
    time: 163,
    text: "Ce chemin paisible fut autrefois un lieu de travail forcé et de guerre. Le parcourir aujourd’hui est aussi une manière de se souvenir.",
  },
  {
    time: 172,
    text: "J’ai maintenant besoin de votre aide. Cherchez en réalité augmentée les saucisses autour de vous.",
  },
  {
    time: 177,
    text: "Lorsque vous les aurez trouvées, je vous poserai une question et, si vous répondez correctement, vous gagnerez le dernier élément de la Dansada, qui lui permettra de résonner à nouveau et me laissera enfin retourner à mon repos.",
  },
  {
    time: 187,
    text: "En avant !",
  },
];

const subtitle1e = [
  {
    time: 0,
    text: "Hello! I am the Giant of the mountains of Bot, and we are now at the railway station — a place that has always been a symbol of journeys, arrivals, and farewells.",
  },
  {
    time: 10,
    text: "But during the Spanish Civil War, this space witnessed days of fear, urgency, and difficult decisions.",
  },
  {
    time: 17,
    text: "In the first week of April 1938, the front reached Terra Alta. On April 2, Bot was occupied by Italian soldiers of the Littorio Division, allies of Franco.",
  },
  {
    time: 29,
    text: "Before they entered the village, many families fled for fear of reprisals. Among them were the mayor and other residents committed to the Republic.",
  },
  {
    time: 38,
    text: "Some would never return: one of them, for example, would later be murdered in the Gusen concentration camp in 1941.",
  },
  {
    time: 47,
    text: "The Italians’ stay was brief, but the war left a deep mark. More than 130 soldiers killed in the fighting in the Baix Ebre were buried in Bot’s cemetery.",
  },
  {
    time: 59,
    text: "When the front stabilized along the Ebro River, the village took on a key role in the rearguard, and the railway became essential.",
  },
  {
    time: 67,
    text: "The Val de Zafán railway line, long awaited since the 19th century, was extended to Pinell de Brai to enable the rapid movement of troops and supplies.",
  },
  {
    time: 77,
    text: "Originally designed to connect Aragón with the port of Els Alfacs and support the trade of agricultural goods and coal from Teruel, the railway ended up serving military purposes.",
  },
  {
    time: 89,
    text: "Running parallel to the Ebro, it also strengthened territorial defense.",
  },
  {
    time: 95,
    text: "In the early hours of July 25, 1938, at the start of the Battle of the Ebro, Bot station once again became a key location.",
  },
  {
    time: 105,
    text: "There were few soldiers there, mainly engineers responsible for railway operations, but that same day they made an urgent decision:",
  },
  {
    time: 114,
    text: "they dismantled and reassembled a section of track to render it unusable and slow the advance of the Army of the Ebro, which had already taken the Pinell de Brai station.",
  },
  {
    time: 125,
    text: "The following days were filled with constant tension. Some Republican soldiers reached the village gates, and there were exchanges of gunfire.",
  },
  {
    time: 133,
    text: "Shots were also fired from the hermitage of Sant Josep toward the station.",
  },
  {
    time: 139,
    text: "When Francoist reinforcements arrived, the attacks ceased, but Bot became filled with troops, war supplies, field kitchens, hospitals, and services.",
  },
  {
    time: 149,
    text: "Even the underground passage at the station was used as a command post.",
  },
  {
    time: 154,
    text: "On September 2, 1938, the village suffered one of its harshest bombings: six “Katiuska” aircraft and twelve fighter planes attacked the station and the old town.",
  },
  {
    time: 166,
    text: "Local residents and railway workers were killed, and military casualties were numerous on the outskirts of the village.",
  },
  {
    time: 174,
    text: "Faced with this situation, the Town Council met in permanent session to address all urgent needs.",
  },
  {
    time: 180,
    text: "Today, that train no longer runs. After decades of service, the line was permanently closed in the 1970s.",
  },
  {
    time: 189,
    text: "But the route has not disappeared: since 2000, the former railway has become a greenway, allowing people to walk or cycle through tunnels and over viaducts — transforming a space of war into a space of memory and peace.",
  },
  {
    time: 207,
    text: "Now I need your help. Use augmented reality to find the traditional country loaves you will discover around you.",
  },
  {
    time: 215,
    text: "When you find them, I will ask you a question. If you answer correctly, we will recover an element of the Dansada.",
  },
  {
    time: 224,
    text: "I will see you at the next stop!",
  },
];

const subtitle2e = [
  {
    time: 0,
    text: "Hello! Now I want to tell you about something else that happened here when the Battle of the Ebro began:",
  },
  {
    time: 6,
    text: "within just a few days, Bot became a key rearguard location, meaning just behind the front line.",
  },
  {
    time: 14,
    text: "To care for the wounded, up to three hospitals were set up in the village, equipped to perform surgeries, as well as a first-aid post where soldiers were received, given initial treatment, and then distributed to different facilities.",
  },
  {
    time: 27,
    text: "Those who were too seriously injured to be moved remained hospitalized in Bot.",
  },
  {
    time: 33,
    text: "According to local residents and researchers, two hospitals were located on Freixes Street (in the Freixes house and in an old building that no longer exists, where the municipal market now stands).",
  },
  {
    time: 45,
    text: "Another hospital was on Major Street, in the Paladella house. The floors of the house were adapted to accommodate many beds in large rooms, including an operating room.",
  },
  {
    time: 57,
    text: "Nurses worked there, along with local women who helped with tasks such as cleaning and disinfecting equipment, making beds, and preparing meals.",
  },
  {
    time: 66,
    text: "As the battle progressed, thousands of wounded soldiers arrived and the workload intensified greatly, especially from September 3, 1938 onward, when a new offensive began.",
  },
  {
    time: 77,
    text: "In the village square, ambulances could often be seen coming and going, transporting patients from one place to another.",
  },
  {
    time: 85,
    text: "This story even appears in a novel: El monarca de las sombras by Javier Cercas, which mentions the hospital in the Paladella house.",
  },
  {
    time: 95,
    text: "Amid all this, many villagers who remained in Bot helped as they could — for example, sewing clothes; it is said that some German soldiers paid with old banknotes from their country.",
  },
  {
    time: 108,
    text: "Now you must help me! Use augmented reality to find the oil cruets you will discover around you.",
  },
  {
    time: 115,
    text: "Once you succeed, I will ask you a question and, if you answer correctly, you will earn an element of the Dansada.",
  },
  {
    time: 122,
    text: "See you at the next stop!",
  },
];

const subtitle3e = [
  {
    time: 0,
    text: "Hello! Now I would like to tell you about a part of the story that took place in the village before the front line arrived.",
  },
  {
    time: 8,
    text: "In the summer of 1936, at the beginning of the Spanish Civil War, Catalonia did not fall under the military uprising, but a time of profound change began.",
  },
  {
    time: 18,
    text: "In many villages — including here in Bot — people and groups who declared themselves antifascist made rapid decisions to survive and reorganize daily life.",
  },
  {
    time: 29,
    text: "In Bot, some properties were confiscated: houses, farmland, olive mills, wineries, and livestock buildings that belonged to owners considered right-wing.",
  },
  {
    time: 40,
    text: "Part of these resources were taken over by workers’ collectives, who used them to ensure food and employment during a very difficult time.",
  },
  {
    time: 49,
    text: "Even leftover stone from construction work at the church was reused to build a livestock shelter.",
  },
  {
    time: 55,
    text: "Those months also left deep wounds. The parish church was looted and altered, and the hermitage of Sant Josep, on the outskirts of the village, was set on fire.",
  },
  {
    time: 66,
    text: "But the hardest blow was the arrest of many residents:",
  },
  {
    time: 70,
    text: "around forty were imprisoned and thirteen of them were executed without trial. They died in different places, far from the village, during August and September 1936.",
  },
  {
    time: 82,
    text: "Years later, during the dictatorship, these deaths were remembered from only one perspective, and for decades a large plaque with a cross stood on the church façade.",
  },
  {
    time: 93,
    text: "This plaque was removed in 2010, when the building was restored.",
  },
  {
    time: 98,
    text: "Over time, a new town council was formed with representatives from antifascist parties and trade unions.",
  },
  {
    time: 105,
    text: "In the midst of scarcity, the village had to invent practical solutions: because small coins were lacking, the Town Council printed municipal banknotes to allow people to buy and sell food.",
  },
  {
    time: 118,
    text: "They were issued in different values, from one peseta down to ten cents.",
  },
  {
    time: 124,
    text: "The war also brought people from elsewhere. Bot welcomed refugee families from other regions, while many local men of military age were called to fight.",
  },
  {
    time: 133,
    text: "Some volunteered, others were compelled. In total, twenty-six residents of Bot died at the front, on one side or the other.",
  },
  {
    time: 143,
    text: "When the village was occupied by Francoist forces in April 1938, a new period of fear began. Under the new authorities, many left-wing residents were arrested, tried, or imprisoned.",
  },
  {
    time: 156,
    text: "Some were executed, others sentenced to prison, and some released for lack of evidence. Altogether, more than one hundred people from Bot suffered repression.",
  },
  {
    time: 168,
    text: "Many families chose to flee. After the Republican defeat, some residents crossed the border into France.",
  },
  {
    time: 175,
    text: "There, women and children lived in concentration camps under very harsh conditions. Those who returned were often not welcomed: some suffered public humiliation and were stigmatized for years.",
  },
  {
    time: 189,
    text: "It is a difficult story, but it is part of the village’s journey. Understanding it is also a way of caring for memory.",
  },
  {
    time: 198,
    text: "Now I need your help. Use augmented reality to find the almonds you will discover around you.",
  },
  {
    time: 204,
    text: "Once you succeed, I will ask you a question and, if you answer correctly, you will earn an element of the Dansada.",
  },
  {
    time: 213,
    text: "See you at the next stop!",
  },
];

const subtitle4e = [
  {
    time: 0,
    text: "Hello! Now we are in a place where the silence feels heavier, because beneath this ground lie many stories of the war.",
  },
  {
    time: 9,
    text: "During 1938, the cemetery of Bot became a burial site for Francoist soldiers.",
  },
  {
    time: 15,
    text: "When the village was occupied on April 2 and fighting intensified in the area of Paüls and Xerta, many fallen soldiers were buried here.",
  },
  {
    time: 24,
    text: "Most were Italians, sent by Mussolini to assist Franco, although there were also some Spaniards.",
  },
  {
    time: 30,
    text: "For a time, this was the cemetery in the region with the highest number of fascist soldiers buried.",
  },
  {
    time: 37,
    text: "The soldiers were buried simply, wrapped in a sheet and without a coffin. A wooden cross was placed above each grave with their name, rank, and unit.",
  },
  {
    time: 47,
    text: "Later, some of these crosses were replaced with headstones. A large monumental cross was also erected, and on several occasions their comrades paid tribute to them.",
  },
  {
    time: 58,
    text: "Photographs of those ceremonies have been preserved.",
  },
  {
    time: 62,
    text: "After the war ended, the bodies of the Italian soldiers were transferred to Zaragoza, where a mausoleum was built to gather them together.",
  },
  {
    time: 70,
    text: "Even so, many of their headstones remain in the cemetery of Bot, some half buried along one of the pathways.",
  },
  {
    time: 78,
    text: "With the beginning of the Battle of the Ebro on July 25, 1938, Bot found itself just behind the front line. The village filled with hospitals, military services, and soldiers.",
  },
  {
    time: 91,
    text: "The dead were brought by cart to the cemetery, and soon there was no more space. For this reason, a large agricultural field behind the cemetery was designated as a new military necropolis.",
  },
  {
    time: 104,
    text: "Around fifteen hundred soldiers were buried there, most of them killed during the autumn counteroffensives.",
  },
  {
    time: 111,
    text: "They included Spanish soldiers from different sides as well as a group of Moroccan mercenaries.",
  },
  {
    time: 117,
    text: "The bodies were placed in long trenches, with a small bottle between their legs containing their name. Above them stood a small wooden cross.",
  },
  {
    time: 126,
    text: "This area remained untouched for many years, enclosed with wire fencing. But in the spring of 1959 everything changed.",
  },
  {
    time: 137,
    text: "The Francoist dictatorship ordered the exhumation of the remains to transfer them to the Valley of the Fallen, a large funerary monument built by Franco.",
  },
  {
    time: 147,
    text: "Many local residents were forced to take part in the excavations.",
  },
  {
    time: 151,
    text: "As bones were removed, personal objects such as watches, chains, or rosaries were often found.",
  },
  {
    time: 158,
    text: "In total, more than one thousand soldiers were transferred. Today, that place is simply a field of abandoned almond trees.",
  },
  {
    time: 168,
    text: "Among those buried were also some Catalan requetés, Carlist soldiers who fought with Franco.",
  },
  {
    time: 175,
    text: "The remains of some of them were not transferred but later taken to the monastery of Montserrat.",
  },
  {
    time: 182,
    text: "One of the soldiers, a resident of Bot, was buried in the family pantheon, where he still rests.",
  },
  {
    time: 188,
    text: "As for the Moroccan soldiers, not everything is clear. Some historians believe they were also transferred, while others think they were not, since only Spanish and Catholic soldiers were taken to the Valley of the Fallen.",
  },
  {
    time: 202,
    text: "What is known is that they were buried in a separate area.",
  },
  {
    time: 207,
    text: "Today, inside the cemetery, there is a monolith that commemorates all the victims of the Civil War. It does not speak of sides, but of people. And that is the silence we must listen to.",
  },
  {
    time: 222,
    text: "Now I need your help. Use augmented reality to find the grape clusters around you.",
  },
  {
    time: 229,
    text: "When you succeed, I will ask you a question and, if you answer correctly, you will earn an element of the Dansada.",
  },
  {
    time: 237,
    text: "I will see you at the final stop!",
  },
];

const subtitle5e = [
  {
    time: 0,
    text: "Hello! We have reached the final stop. We are walking along a stretch of railway that seems peaceful, but it hides a very harsh story.",
  },
  {
    time: 9,
    text: "Here, the train did not only carry soldiers and goods — it also carried suffering.",
  },
  {
    time: 15,
    text: "When Francoist troops occupied the right bank of the Ebro in the spring of 1938, the Val de Zafán railway became a military priority.",
  },
  {
    time: 25,
    text: "It needed to be extended as far as possible to control the territory.",
  },
  {
    time: 29,
    text: "In just a few months, the line was prolonged to Valljunquera and then to Pinell de Brai, passing through Bot.",
  },
  {
    time: 36,
    text: "To achieve this, the Franco regime did not hire free workers. Instead, it brought Republican prisoners from concentration camps.",
  },
  {
    time: 45,
    text: "They were defeated soldiers, forced to work in units known as Workers’ Battalions.",
  },
  {
    time: 52,
    text: "Several of these battalions were sent to the Val de Zafán line, tasked with laying tracks, moving stones, and opening paths under extremely harsh conditions.",
  },
  {
    time: 62,
    text: "It is important to note that much of the railway had already been built before the war. For years, workers had dug tunnels and constructed viaducts across a difficult landscape, facing financial problems, strikes, and dismissals.",
  },
  {
    time: 77,
    text: "But the war accelerated everything, and forced labor replaced free labor.",
  },
  {
    time: 83,
    text: "During the Battle of the Ebro, the railway played a crucial role. When the station of Pinell de Brai fell into Republican hands, the front line was established between that point and Bot.",
  },
  {
    time: 95,
    text: "There were even fights inside the tunnels.",
  },
  {
    time: 99,
    text: "Meanwhile, the station of Bot received enormous quantities of war material: weapons, ammunition, and supplies.",
  },
  {
    time: 107,
    text: "Each day, massive convoys arrived carrying thousands of tons. The less severely wounded were also evacuated by train toward Aragón.",
  },
  {
    time: 118,
    text: "After the battle ended, work on the line resumed with even more forced labor.",
  },
  {
    time: 123,
    text: "Prisoners had to open quarries, carry stones, lay rails, and rebuild damaged viaducts.",
  },
  {
    time: 130,
    text: "Later, the Workers’ Battalions were replaced by other punishment units composed of soldiers considered disloyal to the regime.",
  },
  {
    time: 138,
    text: "Between 1938 and 1942, thousands of prisoners worked here in extremely harsh conditions: exposed to the elements, with little food, minimal rest, and constant punishment.",
  },
  {
    time: 152,
    text: "Even so, continuous contact with the local population sometimes led to unexpected human connections, even love stories. If you look closely, traces of those years can still be seen today.",
  },
  {
    time: 168,
    text: "On the other side of the Canaletes River there is a rock shelter where a powder magazine was built to store explosives.",
  },
  {
    time: 175,
    text: "At the entrance of some tunnels, bullet marks can still be seen — reminders of the fighting that took place during the war.",
  },
  {
    time: 183,
    text: "This peaceful path was once a place of forced labor and war. Walking it today is also a way of remembering.",
  },
  {
    time: 193,
    text: "Now I need your help. Use augmented reality to find the sausages in the surrounding area.",
  },
  {
    time: 201,
    text: "When you succeed, I will ask you a question and, if you answer correctly, you will earn the final element of the Dansada, allowing it to sound again and letting me finally return to my rest.",
  },
  {
    time: 214,
    text: "Go ahead!",
  },
];

const subtitle1s = [
  {
    time: 0,
    text: "¡Hola! Soy el Gigante de las montañas de Bot y estamos en la estación, un lugar que siempre ha sido sinónimo de caminos, de llegadas y despedidas.",
  },
  {
    time: 9,
    text: "Pero durante la Guerra Civil, este espacio vivió días de miedo, prisas y decisiones difíciles.",
  },
  {
    time: 15,
    text: "En la primera semana de abril de 1938, el frente llegó a la Terra Alta. El 2 de abril, Bot fue ocupado por soldados italianos de la División Littorio, aliados de Franco.",
  },
  {
    time: 27,
    text: "Antes de que entraran en el pueblo, muchas familias huyeron por miedo a represalias. Entre ellas, el alcalde y otros vecinos comprometidos con la República.",
  },
  {
    time: 36,
    text: "Algunos no regresarían jamás: uno de ellos, por ejemplo, acabaría muriendo asesinado en el campo de concentración de Gusen en 1941.",
  },
  {
    time: 45,
    text: "La estancia de los italianos fue breve, pero el paso de la guerra dejó una huella profunda. En el cementerio de Bot se enterraron más de 130 soldados muertos en los combates del Baix Ebre.",
  },
  {
    time: 57,
    text: "Cuando el frente se estabilizó en el río Ebro, el pueblo adquirió un papel clave en la retaguardia, y el tren se convirtió en una pieza fundamental.",
  },
  {
    time: 66,
    text: "La línea ferroviaria del Val de Zafán, largamente esperada desde el siglo XIX, se prolongó hasta Pinell de Brai para facilitar el movimiento rápido de tropas y material.",
  },
  {
    time: 76,
    text: "Aquella obra ferroviaria, pensada inicialmente para unir Aragón con el puerto de los Alfaques y ayudar a vender productos agrícolas y el carbón de Teruel, terminó teniendo un uso militar.",
  },
  {
    time: 87,
    text: "La vía, paralela al Ebro, también servía para reforzar la defensa del territorio.",
  },
  {
    time: 92,
    text: "En la madrugada del 25 de julio de 1938, con el inicio de la batalla del Ebro, la estación de Bot volvió a ser protagonista.",
  },
  {
    time: 101,
    text: "Había pocos soldados, sobre todo ingenieros encargados del servicio del tren, pero ese mismo día tomaron una decisión urgente:",
  },
  {
    time: 108,
    text: "levantaron y volvieron a colocar un tramo de vía para dejarla inutilizada y frenar el avance del Ejército del Ebro, que ya había tomado la estación de Pinell de Brai.",
  },
  {
    time: 117,
    text: "Los días siguientes fueron de tensión constante. Algunos soldados republicanos llegaron hasta las puertas del pueblo y hubo intercambios de disparos.",
  },
  {
    time: 127,
    text: "Desde la ermita de Sant Josep también se disparaba hacia la estación.",
  },
  {
    time: 130,
    text: "Con la llegada de refuerzos franquistas, los ataques se detuvieron, pero Bot empezó a llenarse de tropas, material de guerra, cocinas de campaña, hospitales y servicios.",
  },
  {
    time: 141,
    text: "Incluso el paso subterráneo de la estación se utilizó como puesto de mando.",
  },
  {
    time: 145,
    text: "El 2 de septiembre de 1938, el pueblo sufrió uno de los bombardeos más duros: seis aviones “Katiuska” y doce cazas atacaron la estación y el casco antiguo.",
  },
  {
    time: 157,
    text: "Murieron vecinos y trabajadores del ferrocarril, y en las afueras del pueblo las bajas militares fueron numerosas.",
  },
  {
    time: 163,
    text: "Ante esta situación, el Ayuntamiento tuvo que reunirse en sesión permanente para dar respuesta a todas las necesidades.",
  },
  {
    time: 170,
    text: "Hoy, aquel tren ya no circula. Tras décadas de servicio, la línea se cerró definitivamente en los años setenta.",
  },
  {
    time: 178,
    text: "Pero el camino no se ha perdido: desde el año 2000, el antiguo trazado es una vía verde que permite caminar y recorrer en bicicleta túneles y viaductos, transformando un espacio de guerra en un espacio de memoria y paz.",
  },
  {
    time: 191,
    text: "Ahora necesito vuestra ayuda. Buscad con la realidad aumentada los panes de payés que encontraréis en el entorno.",
  },
  {
    time: 198,
    text: "Cuando los encontréis, os haré una pregunta. Si la respondéis correctamente, recuperaremos un elemento de la Dansada.",
  },
  {
    time: 205,
    text: "¡Os espero en la próxima parada!",
  },
];

const subtitle2s = [
  {
    time: 0,
    text: "¡Hola! Ahora quiero contaros otra cosa que ocurrió aquí cuando comenzó la batalla del Ebro:",
  },
  {
    time: 6,
    text: "en pocos días, Bot se convirtió en un lugar clave de la retaguardia, es decir, justo detrás del frente.",
  },
  {
    time: 13,
    text: "Para atender a los heridos, en el pueblo se instalaron hasta tres hospitales, equipados para realizar operaciones, y también un puesto de socorro donde recibían a los soldados, les hacían las primeras curas y los distribuían hacia los distintos espacios.",
  },
  {
    time: 27,
    text: "Los que estaban demasiado graves para ser trasladados permanecían hospitalizados en Bot.",
  },
  {
    time: 30,
    text: "Dos hospitales, según recuerdan vecinos e investigadores, estaban en la calle Freixes (en la casa Freixes y en un antiguo local que hoy ya no existe, donde ahora se encuentra el mercado municipal).",
  },
  {
    time: 42,
    text: "Otro hospital estaba en la calle Mayor, en la casa Paladella. Allí adaptaron las plantas de la vivienda para colocar numerosas camas en habitaciones grandes, con una sala de operaciones.",
  },
  {
    time: 52,
    text: "Trabajaban enfermeras y también mujeres del pueblo, que ayudaban en tareas como limpiar y desinfectar material, hacer las camas o preparar comidas.",
  },
  {
    time: 60,
    text: "A medida que la batalla avanzaba, llegaron miles de heridos y el trabajo se intensificó enormemente, sobre todo a partir del 3 de septiembre de 1938, cuando comenzó una nueva ofensiva.",
  },
  {
    time: 72,
    text: "En la plaza del pueblo se veían a menudo ambulancias entrando y saliendo para trasladar a los pacientes de un lugar a otro.",
  },
  {
    time: 79,
    text: "Esta historia incluso aparece en una novela: El monarca de las sombras, de Javier Cercas, donde se menciona el hospital de la casa Paladella.",
  },
  {
    time: 86,
    text: "Y, en medio de todo ello, muchos vecinos que permanecieron en el pueblo ayudaron como pudieron, por ejemplo cosiendo ropa; dicen que algunos militares alemanes pagaban con billetes antiguos de su país.",
  },
  {
    time: 98,
    text: "¡Ahora debéis ayudarme! Buscad con la realidad aumentada las aceiteras que encontraréis en el entorno.",
  },
  {
    time: 104,
    text: "Cuando lo logréis, os haré una pregunta y, si acertáis, ganaréis un elemento de la Dansada.",
  },
  {
    time: 109,
    text: "¡Nos vemos en la próxima parada!",
  },
];

const subtitle3s = [
  {
    time: 0,
    text: "¡Hola! Ahora quiero contaros una parte de la historia que ocurrió en el pueblo antes de que llegara el frente.",
  },
  {
    time: 7,
    text: "En el verano de 1936, con el inicio de la Guerra Civil, Cataluña no cayó bajo el golpe militar, pero comenzó un tiempo de grandes cambios.",
  },
  {
    time: 16,
    text: "En muchos pueblos, también aquí en Bot, personas y colectivos que se declaraban antifascistas tomaron decisiones rápidas para sobrevivir y reorganizar la vida cotidiana.",
  },
  {
    time: 25,
    text: "En Bot, algunos bienes fueron confiscados: casas, fincas, molinos de aceite, bodegas y corrales que pertenecían a propietarios considerados de derechas.",
  },
  {
    time: 35,
    text: "Parte de estos recursos pasaron a manos de colectividades de trabajadores, que los utilizaron para asegurar alimento y trabajo en un momento muy difícil.",
  },
  {
    time: 43,
    text: "Incluso la piedra sobrante de unas obras en la iglesia se reutilizó para construir un corral.",
  },
  {
    time: 48,
    text: "Aquellos meses también dejaron heridas profundas. La iglesia parroquial fue saqueada y modificada, y la ermita de Sant Josep, en las afueras del pueblo, fue incendiada.",
  },
  {
    time: 58,
    text: "Pero lo más duro fue la detención de muchos vecinos:",
  },
  {
    time: 61,
    text: "Alrededor de cuarenta fueron encarcelados y trece de ellos asesinados sin juicio. Murieron en distintos lugares, lejos del pueblo, durante los meses de agosto y septiembre de 1936.",
  },
  {
    time: 73,
    text: "Años más tarde, durante la dictadura, estas muertes fueron recordadas desde una sola mirada, y durante décadas una gran placa con una cruz presidió la fachada de la iglesia.",
  },
  {
    time: 82,
    text: "Esta placa fue retirada en 2010, cuando se rehabilitó el templo.",
  },
  {
    time: 87,
    text: "Con el paso del tiempo se formó un nuevo ayuntamiento con representantes de partidos y sindicatos antifascistas.",
  },
  {
    time: 93,
    text: "En medio de la escasez, el pueblo tuvo que inventar soluciones prácticas: como faltaba moneda pequeña, el Ayuntamiento imprimió billetes municipales para poder comprar y vender alimentos.",
  },
  {
    time: 103,
    text: "Los había de distintos valores, desde una peseta hasta diez céntimos.",
  },
  {
    time: 107,
    text: "La guerra también trajo gente de fuera. Bot acogió familias refugiadas de otras zonas, mientras muchos vecinos en edad militar fueron llamados a luchar.",
  },
  {
    time: 116,
    text: "Algunos lo hicieron de manera voluntaria, otros obligados. En total, veintiséis vecinos o residentes de Bot murieron en el frente, en un bando o en el otro.",
  },
  {
    time: 126,
    text: "Cuando el pueblo fue ocupado por los franquistas en abril de 1938, comenzó una nueva etapa de miedo. Con las nuevas autoridades, muchos vecinos de izquierdas fueron detenidos, juzgados o encarcelados.",
  },
  {
    time: 139,
    text: "Algunos fueron fusilados, otros condenados a prisión, y algunos quedaron en libertad por falta de pruebas. En total, más de un centenar de habitantes de Bot sufrieron la represión.",
  },
  {
    time: 150,
    text: "Muchas familias optaron por huir. Tras la derrota republicana, algunos vecinos cruzaron la frontera hacia Francia.",
  },
  {
    time: 157,
    text: "Allí, mujeres y niños vivieron en campos de concentración en condiciones muy duras. Y quienes regresaban a menudo no eran bien recibidos: algunos sufrían humillaciones públicas y fueron señalados durante años.",
  },
  {
    time: 169,
    text: "Es una historia difícil, pero forma parte del camino del pueblo. Y comprenderla también es una forma de cuidar la memoria.",
  },
  {
    time: 176,
    text: "Ahora necesito vuestra ayuda. Buscad con la realidad aumentada las almendras que encontraréis en el entorno.",
  },
  {
    time: 183,
    text: "Cuando lo logréis, os haré una pregunta y, si acertáis, ganaréis un elemento de la Dansada.",
  },
  {
    time: 188,
    text: "¡Nos vemos en la próxima parada!",
  },
];

const subtitle4s = [
  {
    time: 0,
    text: "¡Hola! Ahora estamos en un lugar donde el silencio pesa de una manera diferente, porque bajo esta tierra se esconden muchas historias de la guerra.",
  },
  {
    time: 10,
    text: "Durante el año 1938, el cementerio de Bot se convirtió en lugar de enterramiento de soldados franquistas.",
  },
  {
    time: 17,
    text: "Cuando el pueblo fue ocupado el 2 de abril y los combates se intensificaron en la zona de Paüls y Xerta, muchos soldados caídos fueron enterrados aquí.",
  },
  {
    time: 25,
    text: "La mayoría eran italianos, enviados por Mussolini para ayudar a Franco, aunque también había algunos españoles.",
  },
  {
    time: 32,
    text: "Durante un tiempo, este fue el cementerio de la zona con más soldados fascistas enterrados.",
  },
  {
    time: 37,
    text: "Los soldados eran sepultados de forma sencilla, envueltos en una sábana y sin ataúd. Sobre cada tumba se colocaba una cruz de madera con su nombre, graduación y unidad.",
  },
  {
    time: 47,
    text: "Más adelante, algunas de estas cruces fueron sustituidas por lápidas. También se levantó una gran cruz monumental, y en varias ocasiones sus compañeros les rindieron homenaje.",
  },
  {
    time: 57,
    text: "De aquellos actos se conservan fotografías.",
  },
  {
    time: 60,
    text: "Cuando terminó la guerra, los cuerpos de los soldados italianos fueron trasladados a Zaragoza, donde se construyó un mausoleo para reunirlos a todos.",
  },
  {
    time: 68,
    text: "Aun así, en el cementerio de Bot todavía se conservan muchas de sus lápidas, algunas medio enterradas en uno de los pasillos.",
  },
  {
    time: 76,
    text: "Con el inicio de la batalla del Ebro, el 25 de julio de 1938, Bot quedó justo detrás del frente. El pueblo se llenó de hospitales, servicios militares y soldados.",
  },
  {
    time: 87,
    text: "Los muertos llegaban en carros hasta el cementerio, y pronto ya no cabían. Por ello, se habilitó una gran finca agrícola detrás del camposanto como nueva necrópolis militar.",
  },
  {
    time: 97,
    text: "Allí fueron enterrados cerca de mil quinientos soldados, la mayoría muertos durante las contraofensivas del otoño.",
  },
  {
    time: 104,
    text: "Había soldados españoles de distintos bandos y también un grupo de mercenarios marroquíes.",
  },
  {
    time: 109,
    text: "Los cuerpos se colocaban en largas zanjas, con una pequeña botella entre las piernas donde se introducía el nombre. Encima, una pequeña cruz de madera.",
  },
  {
    time: 117,
    text: "Este espacio permaneció intacto durante muchos años, cerrado con alambre. Pero en la primavera de 1959 todo cambió.",
  },
  {
    time: 127,
    text: "La dictadura franquista ordenó exhumar los restos para trasladarlos al Valle de los Caídos, un gran monumento funerario construido por Franco.",
  },
  {
    time: 134,
    text: "En el pueblo, muchos vecinos fueron obligados a participar en las excavaciones.",
  },
  {
    time: 139,
    text: "Mientras retiraban huesos, a menudo aparecían objetos personales como relojes, cadenas o rosarios.",
  },
  {
    time: 145,
    text: "En total, más de mil soldados fueron trasladados. Hoy, aquel lugar es solo una finca con almendros abandonados.",
  },
  {
    time: 153,
    text: "Entre los enterrados también había algunos requetés catalanes, soldados carlistas que luchaban con Franco.",
  },
  {
    time: 159,
    text: "Los restos de algunos de ellos no fueron trasladados, sino llevados más tarde al monasterio de Montserrat.",
  },
  {
    time: 164,
    text: "Uno de los soldados, vecino de Bot, fue enterrado en el panteón familiar, donde todavía descansa.",
  },
  {
    time: 170,
    text: "Sobre los soldados marroquíes no todo está claro. Algunos historiadores piensan que también fueron trasladados, pero otros creen que no, porque al Valle de los Caídos solo se llevaban soldados españoles y católicos.",
  },
  {
    time: 183,
    text: "Lo que sí se sabe es que fueron enterrados en una zona separada.",
  },
  {
    time: 186,
    text: "Hoy, dentro del cementerio, hay un monolito que recuerda a todas las víctimas de la Guerra Civil. No habla de bandos, sino de personas. Y ese es el silencio que debemos escuchar.",
  },
  {
    time: 197,
    text: "Ahora necesito vuestra ayuda. Buscad con la realidad aumentada los racimos de uva que hay en el entorno.",
  },
  {
    time: 204,
    text: "Cuando lo logréis, os haré una pregunta y, si acertáis, ganaréis un elemento de la Dansada.",
  },
  {
    time: 209,
    text: "¡Os espero en la última parada!",
  },
];

const subtitle5s = [
  {
    time: 0,
    text: "¡Hola! Hemos llegado a la última parada. Caminamos por un tramo de vía que parece tranquilo, pero que esconde una historia muy dura.",
  },
  {
    time: 9,
    text: "Aquí, el tren no solo transportó soldados y mercancías: también trajo sufrimiento.",
  },
  {
    time: 14,
    text: "Cuando las tropas franquistas ocuparon la margen derecha del Ebro, en la primavera de 1938, el ferrocarril del Val de Zafán se convirtió en una prioridad militar.",
  },
  {
    time: 24,
    text: "Había que hacerlo llegar lo más lejos posible para controlar el territorio.",
  },
  {
    time: 28,
    text: "Por eso, en pocos meses, la línea se prolongó hasta Valljunquera y después hasta Pinell de Brai, pasando por Bot.",
  },
  {
    time: 35,
    text: "Para ello, el régimen franquista no contrató trabajadores libres. Trajo prisioneros republicanos desde los campos de concentración.",
  },
  {
    time: 43,
    text: "Eran soldados derrotados, obligados a trabajar en unidades llamadas Batallones de Trabajadores.",
  },
  {
    time: 49,
    text: "Al Val de Zafán llegaron varios de estos batallones, encargados de extender vías, mover piedras y abrir caminos en condiciones muy duras.",
  },
  {
    time: 57,
    text: "Hay que saber que gran parte del trazado ya se había construido antes de la guerra. Durante años, muchos obreros habían abierto túneles y levantado viaductos en un paisaje difícil, con problemas económicos, huelgas y despidos.",
  },
  {
    time: 70,
    text: "Pero la guerra lo aceleró todo, y el trabajo forzado sustituyó al trabajo libre.",
  },
  {
    time: 75,
    text: "Durante la batalla del Ebro, el tren desempeñó un papel clave. Cuando la estación de Pinell de Brai quedó en manos republicanas, el frente se fijó entre ese punto y Bot.",
  },
  {
    time: 85,
    text: "Hubo combates incluso dentro de los túneles.",
  },
  {
    time: 88,
    text: "Mientras tanto, la estación de Bot recibía una enorme cantidad de material de guerra: armas, munición y provisiones.",
  },
  {
    time: 44,
    text: "Cada día llegaban convoyes inmensos, cargados con miles de toneladas. Los heridos menos graves también eran evacuados en tren hacia Aragón.",
  },
  {
    time: 103,
    text: "Cuando la batalla terminó, los trabajos en la línea se reanudaron con aún más mano de obra forzada.",
  },
  {
    time: 108,
    text: "Los prisioneros tuvieron que abrir canteras, cargar piedras, colocar raíles y reconstruir viaductos dañados.",
  },
  {
    time: 115,
    text: "Más adelante, los Batallones de Trabajadores fueron sustituidos por otras unidades de castigo formadas por soldados considerados desafectos al régimen.",
  },
  {
    time: 123,
    text: "Entre 1938 y 1942, miles de presos trabajaron aquí en condiciones muy duras: a la intemperie, con poca comida, escaso descanso y castigos constantes.",
  },
  {
    time: 135,
    text: "Aun así, el contacto continuo con el pueblo hizo que, en ocasiones, surgieran relaciones humanas inesperadas, incluso historias de amor. Si os fijáis bien, todavía hoy pueden verse las huellas de aquellos años.",
  },
  {
    time: 148,
    text: "Al otro lado del río Canaletes hay una balma donde se construyó un polvorín para guardar explosivos.",
  },
  {
    time: 154,
    text: "Y en la entrada de algunos túneles todavía se observan marcas de bala, recuerdo de los combates vividos durante la guerra.",
  },
  {
    time: 160,
    text: "Este camino tranquilo fue, durante un tiempo, un lugar de trabajo forzado y de guerra. Caminarlo hoy también es una forma de recordarlo.",
  },
  {
    time: 169,
    text: "Ahora necesito vuestra ayuda. Buscad con la realidad aumentada las salchichas que hay en el entorno.",
  },
  {
    time: 174,
    text: "Cuando lo logréis, os haré una pregunta y, si acertáis, ganaréis el último elemento de la Dansada que hará que vuelva a sonar y que yo pueda volver a descansar.",
  },
  {
    time: 184,
    text: "¡Adelante!",
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
      // rotation={`-10 ${deviceOrientation.alpha + userRotationY} 0`}
      rotation={`-10 ${userRotationY} 0`}
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
  const [activeSubtitle, setActiveSubtitle] = useState<{ text: string } | null>(null,);
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
  const [deviceOrientation, setDeviceOrientation] = useState({
    alpha: 0,
    beta: 0,
    gamma: 0,
  });
  const [userRotationY, setUserRotationY] = useState(0);
  const [userScale, setUserScale] = useState(0.5);

  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState(0);
  const subtitleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const subtitleTimeouts = useRef<NodeJS.Timeout[]>([]);

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

  const updateSubtitle = (currentTime: number, subtitles: any[]) => {
  if (!subtitles || subtitles.length === 0) return;

  // 1. Find the correct index
  let newIndex = 0;
  for (let i = 0; i < subtitles.length; i++) {
    // If current time is past this subtitle's start time, it's a candidate
    if (currentTime >= subtitles[i].time) {
      newIndex = i;
    } else {
      // Since subtitles are usually chronological, we can stop once 
      // we find a subtitle that hasn't started yet
      break;
    }
  }

  // 2. Force index 0 if we are at the very beginning of the audio
  if (currentTime < subtitles[0].time) {
    newIndex = 0;
  }

  // 3. Update state only if the index actually changed
  // This prevents the "disappearing" act when scrubbing back to 0:00
  if (currentSubtitleIndex !== newIndex || activeSubtitle === null) {
    setCurrentSubtitleIndex(newIndex);
    setActiveSubtitle(subtitles[newIndex]);
    setShowSubtitleButton(true);
  }
};

  const toggleSubtitles = () => {
    const newShowSubtitles = !showSubtitles;
    setShowSubtitles(newShowSubtitles);

    if (newShowSubtitles && audioRef.current) {
      const currentTime = audioRef.current.currentTime;
      setActiveSubtitle(null);
      subtitleTimeoutRef.current && clearTimeout(subtitleTimeoutRef.current);

      const currentSubtitleIndex = getCurrentSubtitles().findIndex(
        (item, index) =>
          currentTime >= item.time &&
          (index === getCurrentSubtitles().length - 1 ||
            currentTime < getCurrentSubtitles()[index + 1].time),
      );

      if (currentSubtitleIndex !== -1) {
        setActiveSubtitle(getCurrentSubtitles()[currentSubtitleIndex]);
      }

      getCurrentSubtitles().forEach((item) => {
        if (item.time > currentTime) {
          const timeout = setTimeout(
            () => {
              setActiveSubtitle(item);
            },
            (item.time - currentTime) * 1000,
          );
          subtitleTimeouts.current.push(timeout);
        }
      });
    } else {
      setActiveSubtitle(null);
      subtitleTimeoutRef.current && clearTimeout(subtitleTimeoutRef.current);
    }
  };

  const locale = useLocale();

  const getCurrentSubtitles = () => {
    // Define a mapping from locale to the appropriate subtitles
    const localeMap = {
      ca: [
        subtitle1c,
        subtitle2c,
        subtitle3c,
        subtitle4c,
        subtitle5c,
      ],
      es: [
        subtitle1s,
        subtitle2s,
        subtitle3s,
        subtitle4s,
        subtitle5s,
      ],
      fr: [
        subtitle1f,
        subtitle2f,
        subtitle3f,
        subtitle4f,
        subtitle5f,
      ],
      en: [
        subtitle1e,
        subtitle2e,
        subtitle3e,
        subtitle4e,
        subtitle5e,
      ],
    };

    // Default to English if locale is not found
    const localeKey =
      locale in localeMap ? (locale as keyof typeof localeMap) : "en";
    const subtitlesArray = localeMap[localeKey] || [];

    // Return the appropriate subtitles array based on the current POI (from prop)
    // from is 1-based, so we subtract 1 to get the correct index
    return from >= 1 && from <= subtitlesArray.length
      ? subtitlesArray[from - 1]
      : [];
  };

  const startAnimationAndAudio = async () => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(audioUrl);
        audioRef.current.preload = "auto";
        audioRef.current.volume = 1.0;
        setShowSubtitleButton(true);
        setShowSubtitles(true); // Ensure subtitles are shown when audio starts

        // Set the first subtitle explicitly when audio starts
        const currentSubtitles = getCurrentSubtitles();
        if (currentSubtitles.length > 0) {
          setActiveSubtitle(currentSubtitles[0]);
          setCurrentSubtitleIndex(0);
        }

        // Set up timeupdate event for subtitles
        audioRef.current.ontimeupdate = () => {
          if (audioRef.current) {
            const currentTime = audioRef.current.currentTime;
            // Get the correct subtitle array based on the current POI
            const currentSubtitles = getCurrentSubtitles();
            updateSubtitle(currentTime, currentSubtitles);
          }
        };

        audioRef.current.onended = () => {
          setActiveSubtitle(null);
          setCurrentSubtitleIndex(0);
          stopAnimationAndAudio();
          setTimeout(() => handleBackFromAR(), 100);
        };
      }
      await audioRef.current.play();
      isPlayingRef.current = true;
      setIsPlayingState(true);
    } catch {
      setShowAudioPopup(true);
    }
  };

  // const bgMusicRef = useRef<HTMLAudioElement | null>(null);

  const stopAnimationAndAudio = () => {
    cleanupResources();
  };

  const handleBackFromAR = () => {
    cleanupResources();
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

   const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlayingState) {
      audioRef.current.pause();
      setIsPlayingState(false);
    } else {
      audioRef.current.play();
      setIsPlayingState(true);
    }
  };

  const skip = (seconds: number) => {
    if (!audioRef.current) return;
    // This moves the audio time, which automatically updates subtitles and animation
    audioRef.current.currentTime = Math.max(
      0,
      Math.min(
        audioRef.current.duration,
        audioRef.current.currentTime + seconds,
      ),
    );
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

  // Cleanup function to properly reset state and clean up resources
  const cleanupResources = () => {
    // Clear all timeouts
    if (subtitleTimeoutRef.current) {
      clearTimeout(subtitleTimeoutRef.current);
      subtitleTimeoutRef.current = null;
    }

    // Clear all subtitle timeouts
    subtitleTimeouts.current.forEach((timeout) => clearTimeout(timeout));
    subtitleTimeouts.current = [];

    // Pause and clean up audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    // Reset animation state
    isPlayingRef.current = false;
    setIsPlayingState(false);
    setActiveSubtitle(null);
    setCurrentSubtitleIndex(0);
    setShowSubtitleButton(false);
  };

  useEffect(() => {
    // Clean up resources when component unmounts
    return () => {
      cleanupResources();
    };
  }, []);

  useEffect(() => {
    if (!permissionGranted) return;
    if (!linkLoad) {
      setScriptsLoaded(true);
      return;
    }

    const scriptClass = "poi-page-script";

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
            {activeSubtitle.text}
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
      {avatarPos && (
        <div className="fixed bottom-40 left-1/2 -translate-x-1/2 z-[2147483649] flex items-center gap-6 bg-black/60 backdrop-blur-md px-6 py-1 rounded-full border border-white/20">
          {/* Rewind 5s */}
          <button
            onClick={() => skip(-5)}
            className="text-white active:scale-90 transition-transform"
          >
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.5 5V19L3 12L12.5 5ZM21 5V19L11.5 12L21 5Z" />
            </svg>
          </button>

          {/* Play / Pause */}
          <button
            onClick={togglePlay}
            className="text-white bg-white/20 p-3 rounded-full active:scale-95 transition-all"
          >
            {isPlayingState ? (
              <svg
                width="30"
                height="30"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg
                width="30"
                height="30"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Advance 5s */}
          <button
            onClick={() => skip(5)}
            className="text-white active:scale-90 transition-transform"
          >
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.5 5V19L21 12L11.5 5ZM2 5V19L11.5 12L2 5Z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default Page;
