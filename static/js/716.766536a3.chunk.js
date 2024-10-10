"use strict";(self.webpackChunkcreed_helper=self.webpackChunkcreed_helper||[]).push([[716],{6609:(e,t,s)=>{s.d(t,{A:()=>h});s(5043);var n=s(831),r=s(1895),a=s(9157),o=s(8353),c=s(5299),l=s(6985),i=s(2019),d=s(579);const h=()=>{const e=(0,n.vc)(r.a),t=Object.values(e).map((e=>parseFloat(e))),s=t.reduce(((e,t)=>e+t),0),h=Object.entries(e).map((e=>{let[t,s]=e;return`${t}-${s}`})).join("_"),m={chart:{background:"transparent",toolbar:{show:!1},animations:{enabled:!0,easing:"easeinout",speed:800,animateGradually:{enabled:!0,delay:150}}},labels:Object.keys(e),colors:["#2de7e0","#b71515","#ffc107","#28a745","#573c9c"],legend:{show:!0,position:"bottom",fontSize:"14px",labels:{colors:["var(--body-color)"]},markers:{width:10,height:10,radius:5},itemMargin:{horizontal:10,vertical:5}},dataLabels:{enabled:!0,formatter:e=>e.toLocaleString(),dropShadow:{enabled:!1},style:{fontSize:"14px",fontWeight:"600",colors:["var(--body-color)"]},background:{enabled:!1}},tooltip:{theme:"dark",y:{formatter:e=>e.toLocaleString()},style:{fontSize:"14px"}},stroke:{show:!0,width:2,colors:["#fff"]},plotOptions:{pie:{expandOnClick:!0,donut:{size:"70%",labels:{show:!0,name:{show:!0,fontSize:"18px",fontWeight:"bold",color:"var(--body-color)"},value:{show:!0,fontSize:"22px",fontWeight:"bold",color:"var(--body-color)",formatter:e=>parseFloat(e).toLocaleString()},total:{show:!0,label:"Total",color:"var(--body-color)",fontSize:"18px",fontWeight:"bold",formatter:()=>s.toLocaleString()}}}}},responsive:[{breakpoint:768,options:{chart:{height:300},legend:{position:"bottom",fontSize:"12px"},dataLabels:{style:{fontSize:"12px"}},plotOptions:{pie:{donut:{labels:{name:{fontSize:"14px"},value:{fontSize:"16px"},total:{fontSize:"14px"}}}}}}}]};return(0,d.jsx)(a.A,{className:"pokechart-card shadow-lg p-3 mb-5 rounded",children:(0,d.jsxs)(o.A,{children:[(0,d.jsx)(c.A,{tag:"h3",className:"mb-3 text-center",children:"Box Value Summary"}),(0,d.jsx)(l.A,{className:"text-muted text-center mb-4",children:"Detailed breakdown of Pok\xe9mon categories"}),(0,d.jsx)("div",{className:"chart-container",children:(0,d.jsx)(i.A,{options:m,series:t,type:"donut",height:380},h)})]})})}},1895:(e,t,s)=>{s.d(t,{H:()=>r,a:()=>a});var n=s(831);const r=(0,n.eU)({key:"pokemonDetailsState",default:{uname:"",uid:"",totalRating:"",consideredPokemon:[],ignoredPokemon:[]}}),a=(0,n.eU)({key:"categorizedTotalsState",default:{Luminous:0,Cursed:0,Gold:0,Rainbow:0,Shadow:0}})},716:(e,t,s)=>{s.r(t),s.d(t,{default:()=>w});var n=s(5043),r=s(9157),a=s(8353),o=s(5299),c=s(6221),l=s(2327),i=s(2345),d=s(7550),h=s(7493),m=s(2679),u=s(6259),x=s(7426),p=s(2756),j=s(8268),f=s(4911),A=s(2640),g=s(1509),y=s(831),b=s(1895),k=s(6609),v=s(579);const w=()=>{const[e,t]=(0,n.useState)([{id:1,type:"Golden",name:"",cost:"",currency:"K"}]),[s,w]=(0,n.useState)(0),[S,N]=(0,n.useState)(""),[C,$]=(0,n.useState)({Golden:!1,Cursed:!1,Luminous:!1,Shadow:!1,Rainbow:!1,unbased:!1}),[L,z]=(0,n.useState)(!1),[E,O]=(0,n.useState)({Golden:20,Cursed:20,Luminous:20,Shadow:20,Rainbow:20}),[F,T]=(0,n.useState)([]),[G,R]=(0,n.useState)({type:"Golden",name:""}),[P,K]=(0,n.useState)(""),[M,I]=(0,n.useState)(!1),[U,W]=(0,n.useState)([]),[_,B]=(0,n.useState)([]),D=(0,n.useRef)({}),V=(0,y.lZ)(b.a),q=(e,s,n)=>{t((t=>t.map((t=>t.id===e?{...t,[s]:n}:t))))},H=async s=>{const n=e.find((e=>e.id===s));if(n&&""===n.cost.trim()){const{type:e,name:a}=n;if(""!==a.trim()){const n=`${e}${a}`;try{const e=await fetch(`https://pokemoncreed.net/ajax/pokedex.php?pokemon=${encodeURIComponent(n.toLowerCase())}`),r=(await e.json()).rating||"N/A";if("N/A"===r)return void K(`Rate for ${n} is not available.`);let a,o;r.includes("m")?(a=parseFloat(r.replace("m","")),o="M"):r.includes("k")?(a=parseFloat(r.replace("k","")),o="K"):(a=parseFloat(r),o=""),t((e=>e.map((e=>e.id===s?{...e,cost:a.toString(),currency:o}:e))))}catch(r){console.error("Error fetching cost:",r),K(`Error fetching cost for ${n}.`)}}}};(0,n.useEffect)((()=>{let t=0;e.forEach((e=>{let s=parseFloat(e.cost);isNaN(s)&&(s=0),"M"===e.currency?s*=1e6:"K"===e.currency&&(s*=1e3),t+=s})),w(t)}),[e]);const Q=e=>e>=1e6?(e/1e6).toFixed(2)+"M":e>=1e3?(e/1e3).toFixed(2)+"K":e.toString(),Z=async e=>{const t=D.current,s=e.map((async e=>t[e]?{[e]:t[e]}:fetch(`https://pokemoncreed.net/ajax/pokedex.php?pokemon=${encodeURIComponent(e)}`).then((e=>e.json())).then((s=>{const n=s.rating||"N/A";if("N/A"===n)return t[e]=0,{[e]:0};let r;return r=n.includes("m")?1e6*parseFloat(n.replace("m","")):n.includes("k")?1e3*parseFloat(n.replace("k","")):parseFloat(n),t[e]=r,{[e]:r}})).catch((s=>(console.error(`Error fetching rate for ${e}:`,s),t[e]=0,{[e]:0})))));return(await Promise.all(s)).reduce(((e,t)=>({...e,...t})),{})};return(0,v.jsx)(r.A,{className:"shadow-lg p-4 mb-5 rounded",children:(0,v.jsxs)(a.A,{children:[(0,v.jsx)(o.A,{tag:"h2",className:"mb-4 text-center",children:"Quick Trade"}),(0,v.jsxs)(c.A,{children:[(0,v.jsxs)(l.A,{form:!0,className:"align-items-center mb-4",children:[(0,v.jsx)(i.A,{md:6,children:(0,v.jsxs)(d.A,{children:[(0,v.jsx)(h.A,{for:"username",children:"User to Trade With:"}),(0,v.jsx)(m.A,{type:"text",name:"username",id:"username",placeholder:"Enter username",value:S,onChange:e=>N(e.target.value),required:!0})]})}),(0,v.jsx)(i.A,{md:6,className:"text-md-right",children:(0,v.jsx)(u.A,{color:"primary",onClick:async()=>{I(!0),K(""),W([]),B(e),await(async()=>{const t=e.map((async e=>{""===e.cost.trim()&&await H(e.id)}));await Promise.all(t)})();let t=0;e.forEach((e=>{let s=parseFloat(e.cost);isNaN(s)&&(s=0),"M"===e.currency?s*=1e6:"K"===e.currency&&(s*=1e3),t+=s})),w(t);try{const e=await fetch(`https://pokemoncreed.net/ajax/box.php?user=${S}`),t=await e.json();if(t.success){const e=t.data,n=e.name,r=Object.keys(C).filter((e=>C[e])),a={};F.forEach((e=>{const t=`${e.type.toLowerCase()}${e.name.toLowerCase()}`;a[t]=!0}));const o=["Cursed","Golden","Luminous","Rainbow","Shadow"];let c=[];if(e.pokemon.forEach((e=>{if("0"===e.loan){const t=e.name.toLowerCase(),s=o.find((e=>t.startsWith(e.toLowerCase())));if(s&&!r.includes(s)){const n=t.replace(s.toLowerCase(),""),r=`${s.toLowerCase()}${n}`;a[r]||C.unbased&&e.level>5||c.push({name:e.name,gender:e.gender,level:e.level,type:s})}}})),0===c.length)return K(`${n} has no available Pok\xe9mon for trading.`),void I(!1);const l=await Z(Array.from(new Set(c.map((e=>e.name.toLowerCase())))));c=c.map((e=>({...e,rate:l[e.name.toLowerCase()]||0}))),c=c.filter((e=>e.rate>0));let i=[];if(L){const e={},t=Object.keys(E);t.forEach((t=>{e[t]=c.filter((e=>e.type===t))}));const n={};for(const a of t){const e=E[a]/100;n[a]=s*e}let r=s;for(const s of t){let t=n[s],a=0;e[s].sort(((e,t)=>t.rate-e.rate));for(const n of e[s]){if(a>=t||r<=0)break;a+n.rate>t||(i.push(n),a+=n.rate,r-=n.rate)}}if(r>0){const e=c.filter((e=>!i.includes(e)));e.sort(((e,t)=>t.rate-e.rate));for(const t of e){if(r<=0)break;i.includes(t)||t.rate<=r&&(i.push(t),r-=t.rate)}}}else{let e=s,t=c.slice().sort(((e,t)=>t.rate-e.rate));for(const s of t){if(e<=0)break;s.rate<=e&&(i.push(s),e-=s.rate)}}const d=(e=>{const t={},s={Luminous:0,Cursed:0,Golden:0,Rainbow:0,Shadow:0};return e.forEach((e=>{const n=`${e.name} ${e.gender||""} - Level: ${e.level}`;t[n]?t[n].count+=1:t[n]={...e,count:1},void 0!==s[e.type]&&(s[e.type]+=e.rate)})),V(s),Object.entries(t).map((e=>{let[t,s]=e;const n=s.rate*s.count;return{...s,display:`${s.count}x ${s.name} ${s.gender?`(${s.gender})`:""} - Level: ${s.level} [${Q(n)}]`}}))})(i);W(d),K("Trade suggestions generated successfully.")}else K("Username not found!")}catch(n){console.error("Error fetching data:",n),K("An error occurred while fetching data.")}finally{I(!1)}},disabled:M,className:"mt-3 mt-md-0",children:M?(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(x.A,{size:"sm"})," Generating Suggestions..."]}):"Get Trade Suggestions"})})]}),(0,v.jsx)(r.A,{className:"mb-4",children:(0,v.jsxs)(a.A,{children:[(0,v.jsx)(o.A,{tag:"h4",className:"mb-3",children:"Trading For"}),e.map(((s,n)=>(0,v.jsxs)(l.A,{form:!0,className:"align-items-end",children:[(0,v.jsx)(i.A,{md:2,children:(0,v.jsxs)(d.A,{children:[(0,v.jsx)(h.A,{for:`type-${s.id}`,children:"Type"}),(0,v.jsxs)(m.A,{type:"select",id:`type-${s.id}`,value:s.type,onChange:e=>q(s.id,"type",e.target.value),children:[(0,v.jsx)("option",{children:"Golden"}),(0,v.jsx)("option",{children:"Cursed"}),(0,v.jsx)("option",{children:"Luminous"}),(0,v.jsx)("option",{children:"Shadow"}),(0,v.jsx)("option",{children:"Rainbow"})]})]})}),(0,v.jsx)(i.A,{md:3,children:(0,v.jsxs)(d.A,{children:[(0,v.jsx)(h.A,{for:`name-${s.id}`,children:"Name"}),(0,v.jsx)(m.A,{type:"text",id:`name-${s.id}`,value:s.name,onChange:e=>q(s.id,"name",e.target.value),onBlur:()=>H(s.id)})]})}),(0,v.jsx)(i.A,{md:2,children:(0,v.jsxs)(d.A,{children:[(0,v.jsx)(h.A,{for:`cost-${s.id}`,children:"Cost"}),(0,v.jsx)(m.A,{type:"text",id:`cost-${s.id}`,value:s.cost,onChange:e=>q(s.id,"cost",e.target.value)})]})}),(0,v.jsx)(i.A,{md:1,children:(0,v.jsxs)(d.A,{children:[(0,v.jsx)(h.A,{for:`currency-${s.id}`,children:"Currency"}),(0,v.jsxs)(m.A,{type:"select",id:`currency-${s.id}`,value:s.currency,onChange:e=>q(s.id,"currency",e.target.value),children:[(0,v.jsx)("option",{children:"K"}),(0,v.jsx)("option",{children:"M"})]})]})}),(0,v.jsx)(i.A,{md:1,children:e.length>1&&(0,v.jsx)(u.A,{color:"danger",size:"sm",onClick:()=>{return e=s.id,void t((t=>t.filter((t=>t.id!==e))));var e},className:"mt-2",children:"Remove"})})]},s.id))),(0,v.jsx)(u.A,{color:"success",size:"sm",onClick:()=>{t((e=>[...e,{id:e.length>0?e[e.length-1].id+1:1,type:"Golden",name:"",cost:"",currency:"K"}]))},className:"mt-3",children:"+ Add Item"}),(0,v.jsxs)("h5",{className:"mt-4",children:["Total Trading For Value: ",Q(s)]})]})}),(0,v.jsx)(r.A,{className:"mb-4",children:(0,v.jsxs)(a.A,{children:[(0,v.jsx)(o.A,{tag:"h4",children:"Exclude Options"}),(0,v.jsxs)(d.A,{children:[(0,v.jsx)(h.A,{children:"Exclude Types:"}),(0,v.jsxs)("div",{children:[Object.keys(C).map((e=>(0,v.jsx)(d.A,{check:!0,inline:!0,children:(0,v.jsxs)(h.A,{check:!0,children:[(0,v.jsx)(m.A,{type:"checkbox",checked:C[e],onChange:t=>((e,t)=>{$((s=>({...s,[e]:t}))),O((s=>{const n={...s};if(t){const t=n[e]||0;delete n[e];const s=Object.keys(n),r=s.reduce(((e,t)=>e+n[t]),0);s.forEach((e=>{n[e]+=n[e]/r*t}))}else{const t=Object.keys(n).reduce(((e,t)=>e+n[t]),0);n[e]=0,Object.keys(n).forEach((e=>{n[e]=n[e]/t*100}))}return n}))})(e,t.target.checked)})," ",e]})},e))),(0,v.jsx)(u.A,{id:"excludeInfo",color:"link",className:"text-info p-0 ml-2",size:"sm",children:(0,v.jsx)("i",{className:"fas fa-info-circle"})}),(0,v.jsx)(p.A,{placement:"right",target:"excludeInfo",children:"Exclude specific Pok\xe9mon types or unbased Pok\xe9mon."})]})]}),(0,v.jsxs)(d.A,{children:[(0,v.jsx)(h.A,{children:"Exclude Specific Pok\xe9mon:"}),(0,v.jsxs)(l.A,{form:!0,className:"align-items-end",children:[(0,v.jsx)(i.A,{md:2,children:(0,v.jsxs)(d.A,{children:[(0,v.jsx)(h.A,{for:"exclude-type",children:"Type"}),(0,v.jsxs)(m.A,{type:"select",id:"exclude-type",value:G.type,onChange:e=>R({...G,type:e.target.value}),children:[(0,v.jsx)("option",{children:"Golden"}),(0,v.jsx)("option",{children:"Cursed"}),(0,v.jsx)("option",{children:"Luminous"}),(0,v.jsx)("option",{children:"Shadow"}),(0,v.jsx)("option",{children:"Rainbow"})]})]})}),(0,v.jsx)(i.A,{md:3,children:(0,v.jsxs)(d.A,{children:[(0,v.jsx)(h.A,{for:"exclude-name",children:"Name"}),(0,v.jsx)(m.A,{type:"text",id:"exclude-name",value:G.name,onChange:e=>R({...G,name:e.target.value})})]})}),(0,v.jsx)(i.A,{md:2,children:(0,v.jsx)(u.A,{color:"primary",onClick:()=>{""!==G.name.trim()&&(T((e=>[...e,{...G}])),R({type:"Golden",name:""}))},children:"Add"})})]}),F.length>0&&(0,v.jsxs)("div",{className:"mt-3",children:[(0,v.jsx)(h.A,{children:"Excluded Pok\xe9mon:"}),(0,v.jsx)(j.A,{children:F.map(((e,t)=>(0,v.jsxs)(f.A,{className:"d-flex justify-content-between",children:[e.type," ",e.name,(0,v.jsx)(u.A,{size:"sm",color:"danger",onClick:()=>(e=>{T((t=>t.filter(((t,s)=>s!==e))))})(t),children:"Remove"})]},t)))})]})]})]})}),(0,v.jsx)(r.A,{className:"mb-4",children:(0,v.jsxs)(a.A,{children:[(0,v.jsxs)(d.A,{check:!0,children:[(0,v.jsxs)(h.A,{check:!0,children:[(0,v.jsx)(m.A,{type:"checkbox",checked:L,onChange:e=>z(e.target.checked)})," ","Use Percentage Allocation"]}),(0,v.jsx)(u.A,{id:"percentageInfo",color:"link",className:"text-info p-0 ml-2",size:"sm",children:(0,v.jsx)("i",{className:"fas fa-info-circle"})}),(0,v.jsx)(p.A,{placement:"right",target:"percentageInfo",children:"Allocate trade value based on percentages for each type."})]}),(0,v.jsx)(A.A,{isOpen:L,children:(0,v.jsxs)(d.A,{className:"mt-3",children:[(0,v.jsx)(h.A,{children:"Type Percentages:"}),Object.keys(E).map((e=>C[e]?null:(0,v.jsxs)(d.A,{children:[(0,v.jsxs)(h.A,{for:`slider-${e}`,children:[e,": ",Math.round(E[e]),"%"]}),(0,v.jsx)(m.A,{type:"range",id:`slider-${e}`,min:"0",max:"100",value:E[e],onChange:t=>((e,t)=>{(t=Number(t))<0&&(t=0),t>100&&(t=100),O((s=>{const n={...s},r=n[e],a=t-r;n[e]=t;const o=Object.keys(n).filter((t=>t!==e&&!C[t]));let c=o.reduce(((e,t)=>e+n[t]),0);o.forEach((e=>{const t=n[e]/c||0;n[e]-=t*a,n[e]<0&&(n[e]=0),n[e]>100&&(n[e]=100)}));const l=Object.values(n).reduce(((e,t)=>e+t),0);if(100!==l){const t=100-l;for(const s of Object.keys(n))if(s!==e&&!C[s]){n[s]+=t;break}}return n}))})(e,t.target.value)})]},e)))]})})]})})]}),P&&(0,v.jsx)(g.A,{color:"info",className:"mt-4",children:P}),_.length>0&&(0,v.jsx)(r.A,{className:"mt-4",children:(0,v.jsxs)(a.A,{children:[(0,v.jsx)(o.A,{tag:"h5",children:"Trading For"}),(0,v.jsx)(j.A,{flush:!0,children:_.map(((e,t)=>(0,v.jsxs)(f.A,{children:[e.type," ",e.name," -"," ",Q(parseFloat(e.cost)*("M"===e.currency?1e6:"K"===e.currency?1e3:1))]},t)))})]})}),U.length>0&&(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(r.A,{className:"mt-4",children:(0,v.jsxs)(a.A,{children:[(0,v.jsx)(o.A,{tag:"h5",children:"Trade Suggestions"}),(0,v.jsx)(j.A,{flush:!0,children:U.map(((e,t)=>(0,v.jsx)(f.A,{children:e.display},t)))})]})}),(0,v.jsx)(k.A,{})]})]})})}}}]);
//# sourceMappingURL=716.766536a3.chunk.js.map