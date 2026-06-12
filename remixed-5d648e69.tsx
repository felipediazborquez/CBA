import { useState } from "react";

const C = {
  bg:"#f8f7f4",surface:"#ffffff",border:"#e2e0db",
  text1:"#1c1c1c",text2:"#555",text3:"#999",accent:"#1a5276",
};
const scoreColor = v => v>=4.5?"#c0392b":v>=3.5?"#d35400":v>=2.5?"#b7860a":"#1e8449";
const scoreBg    = v => v>=4.5?"#fdecea":v>=3.5?"#fff3e0":v>=2.5?"#fffde7":"#e9f7ef";
const W = {clima:0.4,enso:0.2,combustible:0.2,logistica:0.2};

const PRODUCTOS_RAW = [
  {cat:"Cereales",prod:"Pan corriente a granel",gasto:10239,cal:666,clima:5,enso:4,combustible:5,logistica:4,pesoCBA:5,ya:true,evidencia:"alta",fuentes:["CR2","INIA","ODEPA"],nota:"Producto de mayor peso calórico (666 kcal/día). CR2: hasta 52% cultivos trigo afectados bajo RCP8.5. NOAA 11-jun-2026: El Niño declarado. ODEPA: molienda y distribución 100% diésel"},
  {cat:"Cereales",prod:"Harina de trigo blanca",gasto:628,cal:79,clima:5,enso:4,combustible:5,logistica:4,pesoCBA:3,ya:true,evidencia:"alta",fuentes:["CR2","INIA","ODEPA","ARClim"],nota:"CR2: megasequía sin precedente en milenio. ARClim: amenaza alta desde O'Higgins a Araucanía."},
  {cat:"Cereales",prod:"Arroz",gasto:1061,cal:115,clima:5,enso:4,combustible:3,logistica:4,pesoCBA:4,ya:true,evidencia:"alta",fuentes:["CR2","INIA","NOAA"],nota:"NOAA 11-jun-2026: Niño 1+2 costero +2,1°C. CR2: déficit hídrico para riego."},
  {cat:"Cereales",prod:"Espaguetis",gasto:462,cal:28,clima:5,enso:4,combustible:3,logistica:3,pesoCBA:2,ya:true,evidencia:"alta",fuentes:["CR2","ODEPA"],nota:"Derivado directo de trigo. ARClim/CR2: misma cadena de riesgo que harina."},
  {cat:"Cereales",prod:"Otras pastas secas",gasto:528,cal:24,clima:5,enso:4,combustible:3,logistica:3,pesoCBA:2,ya:true,evidencia:"alta",fuentes:["CR2","ODEPA"],nota:"Derivado de trigo. Riesgo climático y ENSO equivalente a espaguetis"},
  {cat:"Cereales",prod:"Pan especial a granel",gasto:618,cal:22,clima:5,enso:4,combustible:5,logistica:4,pesoCBA:3,ya:true,evidencia:"alta",fuentes:["CR2","INIA"],nota:"Misma cadena de riesgo que pan corriente."},
  {cat:"Cereales",prod:"Pan envasado",gasto:408,cal:11,clima:5,enso:3,combustible:5,logistica:4,pesoCBA:2,ya:true,evidencia:"media",fuentes:["CR2","ODEPA"],nota:"Derivado industrial de trigo. Distribución nacional con camiones diésel"},
  {cat:"Cereales",prod:"Galletas no identificadas",gasto:391,cal:9,clima:3,enso:2,combustible:3,logistica:2,pesoCBA:2,ya:false,evidencia:"media",fuentes:["ODEPA"],nota:"Derivado cereal; riesgo moderado indirecto vía cadena triguera"},
  {cat:"Cereales",prod:"Cereales para el desayuno",gasto:263,cal:6,clima:3,enso:3,combustible:3,logistica:3,pesoCBA:1,ya:false,evidencia:"media",fuentes:["INIA","NOAA"],nota:"Derivado de maíz/trigo/avena."},
  {cat:"Cereales",prod:"Galletas dulces con relleno",gasto:328,cal:9,clima:3,enso:2,combustible:3,logistica:2,pesoCBA:1,ya:false,evidencia:"baja",fuentes:["ODEPA"],nota:"Derivado de trigo y azúcar."},
  {cat:"Cereales",prod:"Snacks, chips y frituras de cereal",gasto:225,cal:5,clima:3,enso:2,combustible:3,logistica:3,pesoCBA:1,ya:false,evidencia:"baja",fuentes:["ODEPA"],nota:"Derivado de maíz/trigo; riesgo moderado indirecto"},
  {cat:"Carnes",prod:"Trutro de pollo",gasto:2045,cal:28,clima:3,enso:2,combustible:3,logistica:4,pesoCBA:4,ya:false,evidencia:"media",fuentes:["INIA","ODEPA"],nota:"Mayor peso calórico del grupo avícola. INIA: riesgo principal vía maíz forrajero."},
  {cat:"Carnes",prod:"Carne vacuno molida",gasto:1803,cal:9,clima:5,enso:3,combustible:5,logistica:5,pesoCBA:4,ya:true,evidencia:"alta",fuentes:["ARClim","CR2","INIA","ODEPA"],nota:"ARClim: amenaza alta secano costero. CR2: pastizales degradados por megasequía."},
  {cat:"Carnes",prod:"Otros cortes vacuno",gasto:1758,cal:14,clima:5,enso:3,combustible:5,logistica:5,pesoCBA:4,ya:true,evidencia:"alta",fuentes:["ARClim","CR2","ODEPA"],nota:"ARClim: ganadería extensiva bajo megasequía."},
  {cat:"Carnes",prod:"Pechuga de pollo",gasto:1407,cal:11,clima:3,enso:2,combustible:3,logistica:4,pesoCBA:3,ya:false,evidencia:"media",fuentes:["INIA","ODEPA"],nota:"INIA: riesgo indirecto vía maíz."},
  {cat:"Carnes",prod:"Carne vacuno posta",gasto:1107,cal:6,clima:5,enso:3,combustible:5,logistica:5,pesoCBA:3,ya:true,evidencia:"alta",fuentes:["ARClim","CR2","ODEPA"],nota:"ARClim: amenaza alta. CR2: megasequía."},
  {cat:"Carnes",prod:"Cecinas fiambres no identificados",gasto:628,cal:7,clima:3,enso:1,combustible:3,logistica:3,pesoCBA:2,ya:false,evidencia:"baja",fuentes:["ODEPA"],nota:"Derivados procesados de carne; riesgo moderado indirecto"},
  {cat:"Carnes",prod:"Carne cerdo chuleta",gasto:759,cal:7,clima:3,enso:2,combustible:3,logistica:3,pesoCBA:2,ya:false,evidencia:"media",fuentes:["INIA","ODEPA"],nota:"INIA: riesgo indirecto vía maíz forrajero."},
  {cat:"Carnes",prod:"Vienesas tradicionales",gasto:267,cal:9,clima:3,enso:1,combustible:3,logistica:3,pesoCBA:1,ya:false,evidencia:"baja",fuentes:["ODEPA"],nota:"Producto procesado; riesgo climático indirecto vía cadena porcina"},
  {cat:"Pesca",prod:"Jurel en conserva",gasto:261,cal:5,clima:5,enso:5,combustible:5,logistica:4,pesoCBA:3,ya:true,evidencia:"alta",fuentes:["ARClim","IFOP","NOAA"],nota:"IFOP 2026: El Niño activo impacta jurel en macrozona norte."},
  {cat:"Pesca",prod:"Atún en conserva",gasto:591,cal:4,clima:4,enso:4,combustible:5,logistica:5,pesoCBA:2,ya:true,evidencia:"alta",fuentes:["ARClim","IFOP","NOAA"],nota:"NOAA 11-jun: Niño 1+2 costero +2,1°C."},
  {cat:"Lácteos y huevos",prod:"Huevos de gallina frescos",gasto:2273,cal:31,clima:3,enso:2,combustible:3,logistica:3,pesoCBA:4,ya:false,evidencia:"media",fuentes:["INIA","ODEPA"],nota:"INIA: avicultura en galpones; riesgo indirecto vía maíz."},
  {cat:"Lácteos y huevos",prod:"Leche líquida entera",gasto:1031,cal:21,clima:3,enso:4,combustible:5,logistica:5,pesoCBA:3,ya:false,evidencia:"alta",fuentes:["ARClim","INIA","NOAA"],nota:"ARClim CI lechería: amenaza media Los Lagos y Araucanía."},
  {cat:"Lácteos y huevos",prod:"Queso gouda",gasto:1446,cal:21,clima:3,enso:2,combustible:4,logistica:4,pesoCBA:3,ya:false,evidencia:"media",fuentes:["ARClim","INIA"],nota:"ARClim CI lechería. Cadena de frío con diésel"},
  {cat:"Lácteos y huevos",prod:"Yogur batido",gasto:1106,cal:13,clima:3,enso:2,combustible:4,logistica:4,pesoCBA:3,ya:false,evidencia:"media",fuentes:["INIA","ODEPA"],nota:"Derivado lácteo; hereda riesgo de leche base"},
  {cat:"Lácteos y huevos",prod:"Leche en polvo",gasto:614,cal:16,clima:3,enso:3,combustible:5,logistica:5,pesoCBA:2,ya:false,evidencia:"media",fuentes:["INIA","ODEPA"],nota:"INIA: sequía sur afecta producción lechera."},
  {cat:"Grasas y aceites",prod:"Aceites vegetales",gasto:1564,cal:197,clima:5,enso:4,combustible:5,logistica:5,pesoCBA:5,ya:true,evidencia:"alta",fuentes:["ARClim","ODEPA","NOAA"],nota:"NOAA 11-jun: 63% prob. muy intenso nov-2026 impacta producción oleaginosa."},
  {cat:"Grasas y aceites",prod:"Mantequillas",gasto:693,cal:20,clima:3,enso:2,combustible:4,logistica:4,pesoCBA:2,ya:false,evidencia:"media",fuentes:["ODEPA"],nota:"Derivado lácteo. Cadena de frío con diésel"},
  {cat:"Grasas y aceites",prod:"Margarinas",gasto:407,cal:11,clima:2,enso:2,combustible:3,logistica:3,pesoCBA:1,ya:false,evidencia:"media",fuentes:["ODEPA"],nota:"Derivado de aceites vegetales importados."},
  {cat:"Frutas",prod:"Paltas frescas",gasto:1647,cal:19,clima:5,enso:2,combustible:3,logistica:3,pesoCBA:4,ya:true,evidencia:"alta",fuentes:["ARClim","CR2"],nota:"ARClim CI hídrico: Petorca riesgo muy alto. CR2: emergencia hídrica permanente."},
  {cat:"Frutas",prod:"Limones y limas frescos",gasto:633,cal:3,clima:5,enso:4,combustible:2,logistica:2,pesoCBA:2,ya:true,evidencia:"alta",fuentes:["ARClim","ODEPA","NOAA"],nota:"ARClim: zona productora Coquimbo-Valparaíso en riesgo alto."},
  {cat:"Frutas",prod:"Plátanos frescos",gasto:891,cal:14,clima:4,enso:5,combustible:5,logistica:5,pesoCBA:3,ya:true,evidencia:"alta",fuentes:["ODEPA","NOAA"],nota:"100% importado. NOAA: Niño 1+2 +2,1°C afecta Ecuador/Colombia."},
  {cat:"Frutas",prod:"Manzanas frescas",gasto:420,cal:5,clima:3,enso:3,combustible:3,logistica:2,pesoCBA:2,ya:false,evidencia:"media",fuentes:["ARClim","CR2"],nota:"ARClim CI fruticultura: reducción horas frío al 2050."},
  {cat:"Frutas",prod:"Naranjas frescas",gasto:304,cal:4,clima:3,enso:4,combustible:3,logistica:3,pesoCBA:1,ya:false,evidencia:"media",fuentes:["NOAA","ODEPA"],nota:"NOAA: Niño costero afecta zona productora. Importada desde Argentina/Perú"},
  {cat:"Verduras",prod:"Papas de guarda",gasto:1200,cal:55,clima:5,enso:5,combustible:5,logistica:4,pesoCBA:5,ya:true,evidencia:"alta",fuentes:["ARClim","INIA","ODEPA","NOAA"],nota:"ARClim CI papa: Osorno, Chiloé, Llanquihue riesgo alto."},
  {cat:"Verduras",prod:"Tomates frescos",gasto:890,cal:4,clima:5,enso:4,combustible:3,logistica:2,pesoCBA:4,ya:true,evidencia:"alta",fuentes:["ARClim","ODEPA","NOAA"],nota:"ARClim CI hortalizas: amenaza alta Coquimbo–O'Higgins."},
  {cat:"Verduras",prod:"Cebollas frescas",gasto:420,cal:3,clima:3,enso:3,combustible:3,logistica:2,pesoCBA:2,ya:false,evidencia:"media",fuentes:["ARClim","ODEPA"],nota:"ARClim: amenaza media O'Higgins."},
  {cat:"Verduras",prod:"Zanahorias frescas",gasto:350,cal:4,clima:3,enso:3,combustible:3,logistica:2,pesoCBA:2,ya:false,evidencia:"media",fuentes:["INIA","ODEPA"],nota:"INIA: riesgo moderado Maule."},
  {cat:"Verduras",prod:"Porotos frescos o secos",gasto:480,cal:12,clima:3,enso:1,combustible:1,logistica:1,pesoCBA:2,ya:false,evidencia:"media",fuentes:["ARClim","INIA"],nota:"Leguminosas más resilientes."},
  {cat:"Verduras",prod:"Lentejas",gasto:420,cal:10,clima:2,enso:1,combustible:2,logistica:2,pesoCBA:2,ya:false,evidencia:"media",fuentes:["ODEPA"],nota:"Leguminosa importada. Bajo riesgo relativo."},
  {cat:"Verduras",prod:"Choclo fresco o congelado",gasto:380,cal:8,clima:3,enso:3,combustible:3,logistica:3,pesoCBA:2,ya:false,evidencia:"media",fuentes:["NOAA","ARClim"],nota:"NOAA: El Niño activo afecta producción de maíz."},
  {cat:"Azúcar y dulces",prod:"Azúcar blanca o rubia",gasto:520,cal:35,clima:4,enso:4,combustible:3,logistica:3,pesoCBA:3,ya:true,evidencia:"alta",fuentes:["ODEPA","NOAA"],nota:"NOAA 11-jun: 63% prob. muy intenso nov-2026 impacta producción cañera."},
  {cat:"Azúcar y dulces",prod:"Mermeladas y jaleas",gasto:210,cal:5,clima:3,enso:2,combustible:2,logistica:2,pesoCBA:1,ya:false,evidencia:"baja",fuentes:["ODEPA"],nota:"Derivado de frutas y azúcar."},
  {cat:"Condimentos",prod:"Salsa de tomate envasada",gasto:350,cal:5,clima:4,enso:3,combustible:3,logistica:2,pesoCBA:2,ya:false,evidencia:"media",fuentes:["ODEPA"],nota:"Derivado de tomate industrializado."},
  {cat:"Condimentos",prod:"Mayonesa",gasto:280,cal:8,clima:3,enso:2,combustible:3,logistica:2,pesoCBA:1,ya:false,evidencia:"baja",fuentes:["ODEPA"],nota:"Derivado de aceites vegetales y huevo."},
  {cat:"Condimentos",prod:"Sal fina o gruesa",gasto:60,cal:0,clima:1,enso:1,combustible:1,logistica:1,pesoCBA:1,ya:false,evidencia:"baja",fuentes:["ODEPA"],nota:"Producción nacional estable."},
  {cat:"Bebidas",prod:"Café o sucedáneo",gasto:420,cal:2,clima:5,enso:5,combustible:5,logistica:5,pesoCBA:2,ya:true,evidencia:"alta",fuentes:["ODEPA","NOAA"],nota:"NOAA 11-jun: El Niño afecta Colombia, Vietnam, Etiopía. 63% prob. muy intenso."},
  {cat:"Bebidas",prod:"Té o hierba",gasto:310,cal:2,clima:5,enso:4,combustible:5,logistica:5,pesoCBA:1,ya:true,evidencia:"alta",fuentes:["ODEPA","NOAA"],nota:"NOAA 11-jun: El Niño 63% prob. muy intenso. Zonas de cultivo asiáticas afectadas."},
  {cat:"Bebidas",prod:"Bebidas gaseosas",gasto:620,cal:12,clima:2,enso:1,combustible:3,logistica:2,pesoCBA:2,ya:false,evidencia:"baja",fuentes:["ODEPA"],nota:"Dependencia hídrica industrial; embotellado local."},
  {cat:"Bebidas",prod:"Agua mineral o purificada",gasto:380,cal:0,clima:5,enso:2,combustible:2,logistica:2,pesoCBA:1,ya:true,evidencia:"alta",fuentes:["ARClim","CR2"],nota:"ARClim CI hídrico: 288 de 345 comunas con riesgo alto."},
  {cat:"Bebidas",prod:"Jugos y néctares envasados",gasto:340,cal:8,clima:3,enso:3,combustible:3,logistica:2,pesoCBA:1,ya:false,evidencia:"media",fuentes:["ODEPA"],nota:"Derivado de frutas; hereda riesgo de cadena frutícola."},
  {cat:"Comidas preparadas",prod:"Alimentos en restaurantes y similares",gasto:2800,cal:65,clima:3,enso:2,combustible:5,logistica:5,pesoCBA:5,ya:true,evidencia:"alta",fuentes:["ODEPA"],nota:"Mayor gasto de la canasta ($2.800/mes). Bencinazo impacta cadena completa."},
];

const withIndex = PRODUCTOS_RAW.map(p => {
  const indice = +(W.clima*p.clima+W.enso*p.enso+W.combustible*p.combustible+W.logistica*p.logistica).toFixed(2);
  const impacto = +(indice*p.pesoCBA/5).toFixed(2);
  return {...p,indice,impacto};
});

// ─── COMPONENTES ────────────────────────────────────────────────────────────
function ScorePill({v}){
  return(
    <span style={{display:"inline-block",padding:"2px 8px",borderRadius:12,fontSize:12,
      fontWeight:700,background:scoreBg(v),color:scoreColor(v),minWidth:28,textAlign:"center"}}>
      {v.toFixed?v.toFixed(1):v}
    </span>
  );
}

function EvidBadge({e}){
  const s={alta:{bg:"#1a5276",c:"#fff"},media:{bg:"#d5e8f7",c:"#1a5276"},baja:{bg:"#f0f0f0",c:"#888"}};
  return(
    <span style={{fontSize:9,padding:"2px 7px",borderRadius:8,fontWeight:700,
      background:s[e].bg,color:s[e].c,textTransform:"uppercase",letterSpacing:".04em"}}>
      {e}
    </span>
  );
}

const COL_TIPS = {
  "Producto":{desc:"Nombre del alimento según la CBA oficial, informe abril 2026.",vals:[]},
  "IV-CBA":{desc:"Índice global del producto (1–5). Promedio ponderado de los 4 factores de riesgo.",vals:[
    {v:"1",t:"Sin vulnerabilidad relevante."},
    {v:"2",t:"Baja sensibilidad. Algún factor puede afectarlo levemente."},
    {v:"3",t:"Vulnerabilidad moderada. Al menos un factor significativo."},
    {v:"4",t:"Alta vulnerabilidad. Exposición clara a sequía, ENSO o combustible."},
    {v:"5",t:"Vulnerabilidad crítica. Expuesto severamente a múltiples factores simultáneos."},
  ]},
  "Clima":{desc:"Sensibilidad del cultivo a sequía, calor extremo o lluvias irregulares.",vals:[
    {v:"1",t:"Muy resistente. No depende de lluvia ni temperatura estable."},
    {v:"2",t:"Levemente sensible. Tolera déficit hídrico moderado."},
    {v:"3",t:"Sensible. Requiere riego regular; sequías afectan rendimiento."},
    {v:"4",t:"Muy sensible. Zona con megasequía documentada (CR2)."},
    {v:"5",t:"Crítico. ARClim identifica amenaza alta en su zona de producción."},
  ]},
  "ENSO":{desc:"Sensibilidad al fenómeno El Niño/La Niña. NOAA declaró El Niño el 11-jun-2026.",vals:[
    {v:"1",t:"Sin relación con ENSO."},
    {v:"2",t:"Relación débil o indirecta."},
    {v:"3",t:"Sensibilidad moderada. ENSO altera temporadas en zona de cultivo."},
    {v:"4",t:"Alta sensibilidad. ENSO reduce oferta de forma consistente."},
    {v:"5",t:"Impacto directo. Zona productora coincide con anomalía ENSO activa."},
  ]},
  "Combust.":{desc:"Dependencia del precio del diésel. Bencinazo mar-2026: $580/lt.",vals:[
    {v:"1",t:"Sin dependencia relevante."},
    {v:"2",t:"Baja dependencia. Transporte de corta distancia."},
    {v:"3",t:"Dependencia moderada. Maquinaria agrícola o transporte regional."},
    {v:"4",t:"Alta dependencia. Cadena de frío extensa o flota pesquera intensiva."},
    {v:"5",t:"Crítico. 100% de la cadena depende del precio del diésel."},
  ]},
  "Logíst.":{desc:"Complejidad de la cadena: transporte refrigerado, larga distancia o importación.",vals:[
    {v:"1",t:"Producción local, sin cadena de frío."},
    {v:"2",t:"Distribución regional simple."},
    {v:"3",t:"Cadena nacional con algún eslabón refrigerado."},
    {v:"4",t:"Cadena frigorífica extensa o producto importado."},
    {v:"5",t:"100% importado con logística marítima o cadena fría desde zona austral."},
  ]},
  "Evidencia":{desc:"Solidez de la evidencia científica que respalda los puntajes.",vals:[
    {v:"Alta",t:"Respaldada por estudios específicos con datos cuantitativos."},
    {v:"Media",t:"Evidencia indirecta o por cadena de impacto."},
    {v:"Baja",t:"Riesgo estimado sin estudio específico."},
  ]},
  "Impacto en bolsillo":{desc:"¿Qué tan duro golpea al presupuesto familiar si sube de precio? Fórmula: IV-CBA × peso en canasta ÷ 5, normalizado 1–5.",vals:[
    {v:"1",t:"Bajo riesgo y bajo peso en canasta. Alza no afecta significativamente el gasto."},
    {v:"2",t:"Riesgo o peso moderado. Alza parcialmente absorbible."},
    {v:"3",t:"Producto relevante con riesgo real. Alza visible en presupuesto mensual."},
    {v:"4",t:"Alto consumo y alto riesgo. Perturbación golpea fuerte el gasto familiar."},
    {v:"5",t:"Impacto máximo. Producto crítico (alto gasto + altas calorías) y muy vulnerable."},
  ]},
};

function ColHeader({name,active,dir,onSort}){
  const tip = COL_TIPS[name];
  const [open,setOpen] = useState(false);
  const arrow = active?(dir==="desc"?"▼":"▲"):"⇅";
  return(
    <th onClick={()=>onSort&&onSort()}
      style={{padding:"8px 10px",fontSize:10,fontWeight:700,color:"#444",textAlign:"left",
        borderBottom:`1px solid ${C.border}`,whiteSpace:"nowrap",position:"relative",
        userSelect:"none",cursor:"pointer",background:"#f0f4f8"}}>
      <span style={{display:"inline-flex",alignItems:"center",gap:4}}>
        <span style={{color:active?C.accent:C.text3,fontWeight:active?800:400,fontSize:10}}>{arrow}</span>
        {name}
        {tip&&(
          <span onClick={e=>{e.stopPropagation();setOpen(o=>!o);}}
            style={{color:open?C.accent:C.text3,fontWeight:800,fontSize:11,cursor:"pointer"}}>ⓘ</span>
        )}
      </span>
      {open&&tip&&(
        <div onClick={e=>e.stopPropagation()}
          style={{position:"absolute",top:"110%",left:0,zIndex:99,width:260,
            background:"#fff",border:`1px solid ${C.accent}`,borderRadius:8,padding:"10px 12px",
            boxShadow:"0 4px 16px rgba(0,0,0,.13)",fontSize:11,color:C.text1,lineHeight:1.6,fontWeight:400}}>
          <div style={{fontWeight:700,color:C.accent,marginBottom:tip.vals.length?6:0}}>{tip.desc}</div>
          {tip.vals.map(r=>(
            <div key={r.v} style={{display:"flex",gap:7,marginBottom:4,alignItems:"flex-start"}}>
              <span style={{minWidth:18,fontWeight:800,color:scoreColor(parseFloat(r.v)||2),fontSize:11}}>{r.v}</span>
              <span style={{color:C.text2,fontSize:10,lineHeight:1.5}}>{r.t}</span>
            </div>
          ))}
          <div onClick={()=>setOpen(false)} style={{marginTop:6,fontSize:10,color:C.accent,cursor:"pointer",textAlign:"right"}}>cerrar ✕</div>
        </div>
      )}
    </th>
  );
}

function Leyenda(){
  const anchors=[{v:1,prod:"Sal"},{v:2,prod:"Lentejas"},{v:2.9,prod:"Leche"},{v:3.8,prod:"Huevos"},{v:4.8,prod:"Aceite/Pan"}];
  return(
    <div style={{border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 16px",marginBottom:20,background:C.surface}}>
      <div style={{fontSize:11,fontWeight:700,color:C.text2,marginBottom:10}}>📏 ¿Qué significa el número? — Escala 1 a 5</div>
      <div style={{position:"relative",marginBottom:32}}>
        <div style={{height:10,borderRadius:5,background:"linear-gradient(to right,#1e8449,#b7860a,#d35400,#c0392b)"}}/>
        {anchors.map(a=>{
          const pct=((a.v-1)/4)*100;
          return(
            <div key={a.prod} style={{position:"absolute",top:0,left:`${pct}%`,transform:"translateX(-50%)",textAlign:"center"}}>
              <div style={{width:2,height:10,background:"#fff",margin:"0 auto"}}/>
              <div style={{fontSize:9,fontWeight:700,color:scoreColor(a.v),marginTop:14,whiteSpace:"nowrap",lineHeight:1.3}}>
                {a.v}<br/><span style={{fontWeight:400,color:C.text3}}>{a.prod}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:8}}>
        {[
          {c:"#1e8449",bg:"#e9f7ef",lbl:"1–2 · Bajo",txt:"Poco expuesto. Aguanta bien sequía, ENSO o alzas de combustible."},
          {c:"#b7860a",bg:"#fffbe6",lbl:"2–3 · Moderado",txt:"Sensibilidad indirecta. Un shock puede afectarlo pero no de forma inmediata."},
          {c:"#d35400",bg:"#fff3e0",lbl:"3–4 · Alto",txt:"Exposición real a uno o más factores. Requiere monitoreo activo."},
          {c:"#c0392b",bg:"#fdecea",lbl:"4–5 · Crítico",txt:"Alta exposición simultánea a sequía, El Niño y combustible."},
        ].map(n=>(
          <div key={n.lbl} style={{background:n.bg,borderRadius:8,padding:"8px 10px"}}>
            <div style={{fontWeight:700,fontSize:11,color:n.c,marginBottom:3}}>{n.lbl}</div>
            <div style={{fontSize:10,color:C.text1,lineHeight:1.5}}>{n.txt}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
function Dashboard(){
  const top10=[...withIndex].sort((a,b)=>b.impacto-a.impacto).slice(0,10);
  const ivCBA=+(withIndex.reduce((s,p)=>s+p.indice*p.gasto,0)/withIndex.reduce((s,p)=>s+p.gasto,0)).toFixed(2);
  const maxImpacto=Math.max(...withIndex.map(d=>d.impacto));
  return(
    <div>
      <Leyenda/>
      <div style={{background:"#1a5276",color:"#fff",borderRadius:12,padding:"20px 24px",marginBottom:20}}>
        <div style={{fontSize:11,opacity:.7,letterSpacing:".08em",textTransform:"uppercase",marginBottom:4}}>Índice de Vulnerabilidad — Canasta Básica Alimentaria</div>
        <div style={{display:"flex",alignItems:"baseline",gap:10}}>
          <span style={{fontSize:52,fontWeight:800,lineHeight:1}}>{ivCBA}</span>
          <span style={{fontSize:18,opacity:.7}}>/5</span>
          <div style={{marginLeft:8}}>
            <div style={{fontSize:13,fontWeight:600}}>IV-CBA ponderado</div>
            <div style={{fontSize:11,opacity:.7}}>Abril 2026 · {withIndex.length} productos · CBA $90.384/persona</div>
          </div>
        </div>
        <div style={{marginTop:12,fontSize:11,opacity:.8,lineHeight:1.6,borderTop:"1px solid rgba(255,255,255,.2)",paddingTop:12}}>
          ⚠️ Este índice no predice precios futuros. Identifica vulnerabilidades relativas usando evidencia de CR2, INIA, ODEPA, NOAA, IFOP y ARClim.
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:10,marginBottom:20}}>
        {[
          {n:withIndex.filter(p=>p.indice>=4).length,l:"Riesgo muy alto (≥4)",c:"#c0392b"},
          {n:withIndex.filter(p=>p.indice>=3&&p.indice<4).length,l:"Riesgo alto (3–4)",c:"#d35400"},
          {n:withIndex.filter(p=>p.ya).length,l:"Impacto ya presente",c:"#8e44ad"},
          {n:withIndex.filter(p=>p.evidencia==="alta").length,l:"Evidencia alta",c:"#1a5276"},
        ].map(s=>(
          <div key={s.l} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 14px",textAlign:"center"}}>
            <div style={{fontSize:28,fontWeight:800,color:s.c}}>{s.n}</div>
            <div style={{fontSize:10,color:C.text2,marginTop:2,lineHeight:1.4}}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}>
        <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`,fontWeight:700,fontSize:13}}>
          📊 Top 10 — Mayor impacto sobre la CBA
          <span style={{fontWeight:400,color:C.text3,fontSize:11,marginLeft:8}}>(IV-CBA × peso en canasta)</span>
        </div>
        {top10.map((p,i)=>(
          <div key={p.prod} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 16px",borderBottom:i<9?`1px solid ${C.border}`:"none"}}>
            <span style={{fontSize:15,fontWeight:800,color:C.text3,width:22,textAlign:"right"}}>{i+1}</span>
            <div style={{flex:1}}>
              <div style={{fontWeight:600,fontSize:13}}>{p.prod}</div>
              <div style={{fontSize:10,color:C.text3}}>{p.cat}</div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:100,height:8,background:"#f0f0f0",borderRadius:4,overflow:"hidden"}}>
                <div style={{width:`${(p.impacto/maxImpacto)*100}%`,height:"100%",background:scoreColor(p.indice),borderRadius:4}}/>
              </div>
              <span style={{fontSize:13,fontWeight:800,color:scoreColor(p.indice),minWidth:32}}>{p.impacto.toFixed(1)}</span>
              <EvidBadge e={p.evidencia}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PRODUCTOS ───────────────────────────────────────────────────────────────
const SCEN_MULT = {normal:{c:1,e:1,b:1},enso_fuerte:{c:1,e:1.3,b:1},sequia:{c:1.3,e:1,b:1},bencina:{c:1,e:1,b:1.4}};
const SCEN_OPTS = [
  {id:"normal",   lbl:"📋 Base",            desc:"Condiciones actuales"},
  {id:"enso_fuerte",lbl:"🌊 El Niño intenso",desc:"Multiplicador ENSO +30%"},
  {id:"sequia",   lbl:"🏜️ Sequía severa",   desc:"Multiplicador clima +30%"},
  {id:"bencina",  lbl:"⛽ Alza combustible", desc:"Multiplicador combustible +40%"},
];
const SORT_KEYS = {
  "Producto":"prod","IV-CBA":"indiceScen","Clima":"clima","ENSO":"enso",
  "Combust.":"combustible","Logíst.":"logistica","Evidencia":"evidencia","Impacto en bolsillo":"impacto",
};
const EVID_ORD = {alta:3,media:2,baja:1};

function Productos({search}){
  const [scen,setScen]     = useState("normal");
  const [openRow,setOpenRow] = useState(null);
  const [sortCol,setSortCol] = useState("Impacto en bolsillo");
  const [sortDir,setSortDir] = useState("desc");

  const handleSort = col => {
    if(sortCol===col) setSortDir(d=>d==="desc"?"asc":"desc");
    else { setSortCol(col); setSortDir("desc"); }
  };

  const sm = SCEN_MULT[scen] || SCEN_MULT.normal;

  const visible = withIndex
    .filter(p => p.prod.toLowerCase().includes((search||"").toLowerCase()))
    .map(p => ({
      ...p,
      indiceScen: +(W.clima*Math.min(5,p.clima*sm.c)+W.enso*Math.min(5,p.enso*sm.e)+
        W.combustible*Math.min(5,p.combustible*sm.b)+W.logistica*p.logistica).toFixed(2),
    }))
    .sort((a,b) => {
      const k = SORT_KEYS[sortCol];
      if(!k) return 0;
      if(sortCol==="Producto") return sortDir==="desc"?b[k].localeCompare(a[k]):a[k].localeCompare(b[k]);
      if(sortCol==="Evidencia") return sortDir==="desc"?EVID_ORD[b[k]]-EVID_ORD[a[k]]:EVID_ORD[a[k]]-EVID_ORD[b[k]];
      return sortDir==="desc"?b[k]-a[k]:a[k]-b[k];
    });

  const COLS = ["IV-CBA","Clima","ENSO","Combust.","Logíst.","Evidencia","Impacto en bolsillo"];

  return(
    <div>
      <Leyenda/>

      {/* Tabla */}
      <div style={{border:`1px solid ${C.border}`,borderRadius:10,overflow:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",minWidth:700}}>
          <thead>
            <tr>
              <ColHeader name="Producto" active={sortCol==="Producto"} dir={sortDir} onSort={()=>handleSort("Producto")}/>
              {COLS.map(h=>(
                <ColHeader key={h} name={h} active={sortCol===h} dir={sortDir} onSort={()=>handleSort(h)}/>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((p,i)=>(
              <>
                <tr key={p.prod} onClick={()=>setOpenRow(openRow===p.prod?null:p.prod)}
                  style={{cursor:"pointer",borderBottom:`1px solid ${C.border}`,
                    background:openRow===p.prod?"#f0f6ff":i%2===0?C.surface:"#fafafa"}}>
                  <td style={{padding:"8px 10px",minWidth:160}}>
                    <div style={{fontWeight:600,fontSize:12}}>{p.prod}</div>
                    <div style={{fontSize:10,color:C.text3}}>{p.cat} · ${p.gasto.toLocaleString("es-CL")}/mes · {p.cal} kcal</div>
                  </td>
                  <td style={{padding:"8px 10px"}}><ScorePill v={p.indiceScen}/></td>
                  <td style={{padding:"8px 10px"}}><ScorePill v={p.clima}/></td>
                  <td style={{padding:"8px 10px"}}><ScorePill v={p.enso}/></td>
                  <td style={{padding:"8px 10px"}}><ScorePill v={p.combustible}/></td>
                  <td style={{padding:"8px 10px"}}><ScorePill v={p.logistica}/></td>
                  <td style={{padding:"8px 10px"}}><EvidBadge e={p.evidencia}/></td>
                  <td style={{padding:"8px 10px"}}>
                    <div style={{display:"flex",alignItems:"baseline",gap:2}}>
                      <span style={{fontWeight:800,color:scoreColor(p.impacto),fontSize:13}}>{p.impacto.toFixed(1)}</span>
                      <span style={{fontSize:9,color:C.text3}}>/5</span>
                    </div>
                    <div style={{fontSize:9,color:C.text3,marginTop:1}}>
                      peso en canasta: <span style={{fontWeight:700,color:C.text2}}>{p.pesoCBA<=2?"bajo":p.pesoCBA===3?"medio":"alto"}</span>
                    </div>
                  </td>
                </tr>
                {openRow===p.prod&&(
                  <tr key={`${p.prod}-d`} style={{background:"#f0f4f8"}}>
                    <td colSpan={8} style={{padding:"10px 14px",fontSize:11,color:C.text2,borderBottom:`1px solid ${C.border}`}}>
                      <strong>📋 Evidencia:</strong> {p.nota}<br/>
                      <strong>Fuentes:</strong> {p.fuentes.join(" · ")}
                      {p.ya&&<span style={{marginLeft:8,fontSize:10,background:"#fdecea",color:"#c0392b",padding:"1px 6px",borderRadius:8,fontWeight:600}}>⚡ Impacto ya presente</span>}
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── METODOLOGÍA ─────────────────────────────────────────────────────────────
function Metodologia(){
  return(
    <div style={{maxWidth:680}}>
      <h2 style={{fontSize:16,fontWeight:700,marginBottom:16,color:C.accent}}>Construcción del Índice IV-CBA</h2>
      <div style={{background:"#eef4fb",border:"1px solid #c3d9f0",borderRadius:10,padding:"16px 18px",marginBottom:20}}>
        <div style={{fontFamily:"monospace",fontSize:13,lineHeight:2}}>
          <strong>IV-CBA</strong> = 0.4·Clima + 0.2·ENSO + 0.2·Combustibles + 0.2·Logística<br/>
          <strong>Impacto en bolsillo</strong> = IV-CBA × Peso en canasta ÷ 5<br/>
          <strong>Escala</strong>: 1 (bajo) — 5 (muy alto)
        </div>
      </div>
      {[
        {dim:"Clima (40%)",desc:"Sensibilidad del cultivo o especie a sequía, aumento de temperatura y eventos extremos. Basado en ARClim (RCP8.5), alertas del INIA y proyecciones CR2.",fuentes:["ARClim","CR2","INIA"]},
        {dim:"ENSO (20%)",desc:"Sensibilidad al fenómeno El Niño/La Niña. NOAA declaró El Niño el 11-jun-2026 con índice Niño 1+2 en +2,1°C y 63% prob. de evento muy intenso en nov-2026.",fuentes:["NOAA","IFOP","CR2"]},
        {dim:"Combustibles (20%)",desc:"Dependencia energética directa de la cadena productiva y distribución. El bencinazo de marzo 2026 subió el diésel a $580/lt.",fuentes:["ODEPA","ENAP"]},
        {dim:"Logística (20%)",desc:"Dependencia de cadena de frío, transporte de larga distancia o importaciones. Productos 100% importados o con cadenas frigoríficas extensas reciben puntajes altos.",fuentes:["ODEPA","FAO"]},
      ].map(d=>(
        <div key={d.dim} style={{marginBottom:16,paddingBottom:16,borderBottom:`1px solid ${C.border}`}}>
          <div style={{fontWeight:700,fontSize:13,color:C.accent,marginBottom:4}}>{d.dim}</div>
          <div style={{fontSize:12,color:C.text2,lineHeight:1.6,marginBottom:6}}>{d.desc}</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {d.fuentes.map(f=>(<span key={f} style={{fontSize:10,background:"#eef4fb",color:C.accent,padding:"2px 7px",borderRadius:8,fontWeight:600}}>{f}</span>))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App(){
  const [tab,setTab]       = useState("dashboard");
  const [search,setSearch] = useState("");

  return(
    <div style={{fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",background:C.bg,minHeight:"100vh",padding:14,color:C.text1}}>
      <div style={{marginBottom:16}}>
        <div style={{fontSize:11,letterSpacing:".1em",textTransform:"uppercase",color:C.accent,fontWeight:700,marginBottom:2}}>Política Pública · Chile 2026</div>
        <h1 style={{fontSize:17,fontWeight:800,margin:0,lineHeight:1.2}}>Índice de Vulnerabilidad<br/>Canasta Básica de Alimentos</h1>
        <div style={{fontSize:10,color:C.text3,marginTop:4}}>
          {withIndex.length} productos · ARClim, CR2, INIA, ODEPA, NOAA, IFOP · NOAA declaró El Niño el 11-jun-2026
        </div>
      </div>
      <div style={{display:"flex",gap:4,marginBottom:16,borderBottom:`2px solid ${C.border}`}}>
        {[{id:"dashboard",lbl:"📊 Dashboard"},{id:"productos",lbl:"📋 Productos"},{id:"metodologia",lbl:"📐 Metodología"}].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            style={{fontSize:12,padding:"7px 12px",border:"none",cursor:"pointer",background:"transparent",
              fontWeight:tab===t.id?700:400,color:tab===t.id?C.accent:C.text2,
              borderBottom:tab===t.id?`2px solid ${C.accent}`:"2px solid transparent",marginBottom:-2}}>
            {t.lbl}
          </button>
        ))}
      </div>
      {tab==="productos"&&(
        <input value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="🔍 Buscar producto..."
          style={{width:"100%",padding:"6px 10px",border:`1px solid ${C.border}`,borderRadius:8,
            fontSize:12,marginBottom:12,background:C.surface,outline:"none"}}/>
      )}
      {tab==="dashboard"  && <Dashboard/>}
      {tab==="productos"  && <Productos search={search}/>}
      {tab==="metodologia"&& <Metodologia/>}
    </div>
  );
}
