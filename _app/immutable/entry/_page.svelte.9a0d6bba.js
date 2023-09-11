//js
import{S as Ve,i as Ke,s as ze,f as O,v as ce,m as F,o as B,n as ve,l as p,I as de,e as L,h as P,j as D,z as H,d as W,k as U,A as Z,J as Xe,p as m,q as ie,C as We,K as Ue,E as oe,F as se,L as le,G as fe,M as re,t as J,w as ke,N as Ce,b as j,H as ue,O as Ge,B as we,P as je,Q as xe,R as et}from"../chunks/index.eeb75380.js";import{c as ye,e as tt,s as nt,l as lt,M as at,r as rt,a as it,b as ge}from"../chunks/MapTooltip.svelte_svelte_type_style_lang.df127e42.js";import{b as Re,s as ot}from"../chunks/utils.eb6832fa.js";const st=`#define GLSLIFY 1
#ifndef PI
#define PI 3.141592653589793
#endif

float backOut_1(float t) {
  float f = t < 0.5
    ? 2.0 * t
    : 1.0 - (2.0 * t - 1.0);

  float g = pow(f, 3.0) - f * sin(f * PI);

  return t < 0.5
    ? 0.5 * g
    : 0.5 * (1.0 - g) + 0.5;
}

#ifndef PI
#define PI 3.141592653589793
#endif

float backIn(float t) {
  return pow(t, 3.0) - t * sin(t * PI);
}

#ifndef PI
#define PI 3.141592653589793
#endif

float backOut_0(float t) {
  float f = 1.0 - t;
  return 1.0 - (pow(f, 3.0) - f * sin(f * PI));
}

#ifndef PI
#define PI 3.141592653589793
#endif

float bounceOut(float t) {
  const float a = 4.0 / 11.0;
  const float b = 8.0 / 11.0;
  const float c = 9.0 / 10.0;

  const float ca = 4356.0 / 361.0;
  const float cb = 35442.0 / 1805.0;
  const float cc = 16061.0 / 1805.0;

  float t2 = t * t;

  return t < a
    ? 7.5625 * t2
    : t < b
      ? 9.075 * t2 - 9.9 * t + 3.4
      : t < c
        ? ca * t2 - cb * t + cc
        : 10.8 * t * t - 20.52 * t + 10.72;
}

float bounceInOut(float t) {
  return t < 0.5
    ? 0.5 * (1.0 - bounceOut(1.0 - t * 2.0))
    : 0.5 * bounceOut(t * 2.0 - 1.0) + 0.5;
}

float bounceIn(float t) {
  return 1.0 - bounceOut(1.0 - t);
}

float circularInOut(float t) {
  return t < 0.5
    ? 0.5 * (1.0 - sqrt(1.0 - 4.0 * t * t))
    : 0.5 * (sqrt((3.0 - 2.0 * t) * (2.0 * t - 1.0)) + 1.0);
}

float circularIn(float t) {
  return 1.0 - sqrt(1.0 - t * t);
}

float circularOut(float t) {
  return sqrt((2.0 - t) * t);
}

float cubicInOut(float t) {
  return t < 0.5
    ? 4.0 * t * t * t
    : 0.5 * pow(2.0 * t - 2.0, 3.0) + 1.0;
}

float cubicIn(float t) {
  return t * t * t;
}

float cubicOut(float t) {
  float f = t - 1.0;
  return f * f * f + 1.0;
}

#ifndef HALF_PI
#define HALF_PI 1.5707963267948966
#endif

float elasticInOut(float t) {
  return t < 0.5
    ? 0.5 * sin(+13.0 * HALF_PI * 2.0 * t) * pow(2.0, 10.0 * (2.0 * t - 1.0))
    : 0.5 * sin(-13.0 * HALF_PI * ((2.0 * t - 1.0) + 1.0)) * pow(2.0, -10.0 * (2.0 * t - 1.0)) + 1.0;
}

#ifndef HALF_PI
#define HALF_PI 1.5707963267948966
#endif

float elasticIn(float t) {
  return sin(13.0 * t * HALF_PI) * pow(2.0, 10.0 * (t - 1.0));
}

#ifndef HALF_PI
#define HALF_PI 1.5707963267948966
#endif

float elasticOut(float t) {
  return sin(-13.0 * (t + 1.0) * HALF_PI) * pow(2.0, -10.0 * t) + 1.0;
}

float exponentialInOut(float t) {
  return t == 0.0 || t == 1.0
    ? t
    : t < 0.5
      ? +0.5 * pow(2.0, (20.0 * t) - 10.0)
      : -0.5 * pow(2.0, 10.0 - (t * 20.0)) + 1.0;
}

float exponentialIn(float t) {
  return t == 0.0 ? t : pow(2.0, 10.0 * (t - 1.0));
}

float exponentialOut(float t) {
  return t == 1.0 ? t : 1.0 - pow(2.0, -10.0 * t);
}

float linear(float t) {
  return t;
}

float quadraticInOut(float t) {
  float p = 2.0 * t * t;
  return t < 0.5 ? p : -p + (4.0 * t) - 1.0;
}

float quadraticIn(float t) {
  return t * t;
}

float quadraticOut(float t) {
  return -t * (t - 2.0);
}

float quarticInOut(float t) {
  return t < 0.5
    ? +8.0 * pow(t, 4.0)
    : -8.0 * pow(t - 1.0, 4.0) + 1.0;
}

float quarticIn(float t) {
  return pow(t, 4.0);
}

float quarticOut(float t) {
  return pow(t - 1.0, 3.0) * (1.0 - t) + 1.0;
}

float qinticInOut(float t) {
  return t < 0.5
    ? +16.0 * pow(t, 5.0)
    : -0.5 * pow(2.0 * t - 2.0, 5.0) + 1.0;
}

float qinticIn(float t) {
  return pow(t, 5.0);
}

float qinticOut(float t) {
  return 1.0 - (pow(t - 1.0, 5.0));
}

#ifndef PI
#define PI 3.141592653589793
#endif

float sineInOut(float t) {
  return -0.5 * (cos(PI * t) - 1.0);
}

#ifndef HALF_PI
#define HALF_PI 1.5707963267948966
#endif

float sineIn(float t) {
  return sin((t - 1.0) * HALF_PI) + 1.0;
}

#ifndef HALF_PI
#define HALF_PI 1.5707963267948966
#endif

float sineOut(float t) {
  return sin(t * HALF_PI);
}`;var ft=[["quad-","quadratic-"],["circ-","circular-"],["expo-","exponential-"],["quart-","quartic-"],["quint-","quintic-"]],ut=function(t){return ye(t)},ct=function(t){return ft.forEach(function(e){t=t.replace(e[0],e[1])}),ye(t)},ht=function(t){return tt[ye(t)]},_t=function(t){return st};const be={getEasingFunction:ht,getEasingName:ut,getShaderEasings:_t,getGLSLEasingName:ct};var me="_rtb",Ze=function(t,e){return me+"_"+e+"_previous_"+t},pt=function(t,e){return me+"_"+e+"_current_"+t},Je=function(t,e){return me+"_"+e+"_next_"+t},Qe=function(t,e){return me+"_"+e+"_t_"+t},dt=function(t,e,a,l){var n=be.getGLSLEasingName(l),o=be.getShaderEasings();e=nt(e);var r=Ze(t,a),u=Je(t,a),s=pt(t,a),v=Qe(t,a),g=new RegExp(";([^;]*"+t+"[^;]*;)"),b=e.match(g);if(!b||b.length<2)return e;var f=b[1],i=f.replace(t,r),_=f.replace(t,u),h=`
`+f.replace(t,s).replace("attribute","").replace("uniform","").trim(),y=`
uniform float `+v+";",I=i+_+h+y;if(e=e.replace(f,I),g=new RegExp("main\\s*\\(\\s*\\)\\s*{"),b=e.match(g),b&&b.length){var N=s+" = mix("+r+", "+u+", "+n+"("+v+"));";e=e.replace(b[0],b[0]+`
  `+N)}return g=new RegExp("\\b"+t+"\\b","g"),e=e.replace(g,s),e=o+`
`+e,e},Ie=function(t,e){this.data=t,this.previousData=t,this.defaultOptions=Object.assign({},{duration:750,ease:"quad-in-out"},e||{}),this.options={...this.defaultOptions}};function gt(t){var e=function(a){if(a.uniforms=a.uniforms||{},a.attributes=a.attributes||{},a.vert=a.vert||"",a.frag=a.frag||"",!a.vert||!a.frag)throw new Error("Must provide vert and frag shaders!");var l={uniforms:[],attributes:[]},n={uniforms:{},attributes:{}},o={uniforms:{},attributes:{}},r={uniforms:{},attributes:{}},u={uniforms:{},attributes:{}},s={uniforms:{},attributes:{}},v=function(f,i=null){var _=r[this.type][this.key];if(i&&(this.options=Object.assign({},this.defaultOptions,i)),console.log("buffer update",i,this.defaultOptions,this.options),_<1){var h=be.getEasingFunction(this.options.ease)(_),y=this.previousData;this.previousData=this.data.map(function(I,N){return I.map(function(d,M){return lt(y[N][M],d,h)})})}else this.previousData=this.data;this.data=f,n[this.type][this.key].previous({usage:"dynamic",data:this.previousData}),n[this.type][this.key].next({usage:"dynamic",data:f}),u[this.type][this.key]=!0},g=function(f){Object.keys(a[f]||{}).filter(function(i){return a[f][i]instanceof Ie}).map(function(i){l[f].push(i);var _=a[f][i];_.type=f,_.key=i,_.update=v,o[f][i]=_,r[f][i]=1,u[f][i]=!1,n[f][i]={previous:t.buffer({usage:"dynamic",data:_.data}),next:t.buffer({usage:"dynamic",data:_.data})}})};g("attributes"),g("uniforms");var b=function(f){l[f].forEach(function(i){var _=o[f][i];a.vert=dt(i,a.vert||"",f,_.options.ease),delete a.attributes[i],a[f][Ze(i,f)]=n[f][i].previous,a[f][Je(i,f)]=n[f][i].next,a.uniforms[Qe(i,f)]=function(h,y,I){u[f][i]&&(r[f][i]=0,s[f][i]=h.time);var N=s[f][i],d=r[f][i];return d<1&&(d=Math.min(1,1e3*(h.time-N)/_.options.duration)),r[f][i]=d,u[f][i]=!1,d}})};return b("attributes"),b("uniforms"),t(a)};return e.buffer=function(a,l){return new Ie(a,l)},e}function Ee(t,e,a){const l=t.slice();return l[16]=e[a],l}function Le(t,e,a){const l=t.slice();return l[19]=e[a],l[21]=a,l}function Pe(t,e,a){const l=t.slice();return l[19]=e[a],l[21]=a,l}function qe(t,e,a){const l=t.slice();return l[16]=e[a],l[21]=a,l}function De(t){let e,a=t[9],l=[];for(let n=0;n<a.length;n+=1)l[n]=Se(qe(t,a,n));return{c(){e=L("ul");for(let n=0;n<l.length;n+=1)l[n].c();this.h()},l(n){e=P(n,"UL",{class:!0});var o=D(e);for(let r=0;r<l.length;r+=1)l[r].l(o);o.forEach(p),this.h()},h(){H(e,"class","legend-block svelte-v05hvd")},m(n,o){B(n,e,o);for(let r=0;r<l.length;r+=1)l[r]&&l[r].m(e,null)},p(n,o){if(o&576){a=n[9];let r;for(r=0;r<a.length;r+=1){const u=qe(n,a,r);l[r]?l[r].p(u,o):(l[r]=Se(u),l[r].c(),l[r].m(e,null))}for(;r<l.length;r+=1)l[r].d(1);l.length=a.length}},d(n){n&&p(e),de(l,n)}}}function Se(t){let e,a,l,n,o=t[16]+"",r,u;return{c(){e=L("li"),a=L("div"),l=O(),n=L("span"),r=W(o),u=O(),this.h()},l(s){e=P(s,"LI",{class:!0});var v=D(e);a=P(v,"DIV",{class:!0}),D(a).forEach(p),l=F(v),n=P(v,"SPAN",{class:!0});var g=D(n);r=U(g,o),g.forEach(p),u=F(v),v.forEach(p),this.h()},h(){H(a,"class","legend-vis "+(t[21]==0?"bar":"marker")+" svelte-v05hvd"),Z(a,"height","1rem"),Z(a,"width",t[21]==0?"1rem":t[6]+"px"),H(n,"class",Xe(t[21]==0?"bold":"brackets")+" svelte-v05hvd"),H(e,"class","svelte-v05hvd")},m(s,v){B(s,e,v),m(e,a),m(e,l),m(e,n),m(n,r),m(e,u)},p(s,v){v&64&&Z(a,"width",s[21]==0?"1rem":s[6]+"px"),v&512&&o!==(o=s[16]+"")&&ie(r,o)},d(s){s&&p(e)}}}function Ne(t){let e,a=t[3](t[19][t[0]])+"",l,n;return{c(){e=L("span"),l=W(a),n=W(t[4]),this.h()},l(o){e=P(o,"SPAN",{class:!0});var r=D(e);l=U(r,a),n=U(r,t[4]),r.forEach(p),this.h()},h(){H(e,"class","label "+(t[21]==0?"bold":"sml brackets")+" svelte-v05hvd")},m(o,r){B(o,e,r),m(e,l),m(e,n)},p(o,r){r&137&&a!==(a=o[3](o[19][o[0]])+"")&&ie(l,a),r&16&&ie(n,o[4])},d(o){o&&p(e)}}}function mt(t){let e,a=`calc(${t[8](t[19][t[0]])}% - ${t[6]/2}px)`,l=`${t[6]}px`;return{c(){e=L("div"),this.h()},l(n){e=P(n,"DIV",{class:!0}),D(e).forEach(p),this.h()},h(){H(e,"class","marker svelte-v05hvd"),Z(e,"left",a),Z(e,"border-left-width",l)},m(n,o){B(n,e,o)},p(n,o){o&449&&a!==(a=`calc(${n[8](n[19][n[0]])}% - ${n[6]/2}px)`)&&Z(e,"left",a),o&64&&l!==(l=`${n[6]}px`)&&Z(e,"border-left-width",l)},d(n){n&&p(e)}}}function vt(t){let e,a=`${t[8](t[19][t[0]])}%`;return{c(){e=L("div"),this.h()},l(l){e=P(l,"DIV",{class:!0}),D(e).forEach(p),this.h()},h(){H(e,"class","bar svelte-v05hvd"),Z(e,"left","0"),Z(e,"width",a),Z(e,"background-color",typeof t[19][t[1]]=="number"?t[2][t[19][t[1]]]:null)},m(l,n){B(l,e,n)},p(l,n){n&385&&a!==(a=`${l[8](l[19][l[0]])}%`)&&Z(e,"width",a),n&134&&Z(e,"background-color",typeof l[19][l[1]]=="number"?l[2][l[19][l[1]]]:null)},d(l){l&&p(e)}}}function Ae(t){let e;function a(o,r){return o[21]==0?vt:mt}let n=a(t)(t);return{c(){n.c(),e=ce()},l(o){n.l(o),e=ce()},m(o,r){n.m(o,r),B(o,e,r)},p(o,r){n.p(o,r)},d(o){n.d(o),o&&p(e)}}}function Be(t){let e,a=t[10](t[16].label)+"",l,n,o,r,u,s=`${t[5]}px`,v=t[16].values,g=[];for(let i=0;i<v.length;i+=1)g[i]=Ne(Pe(t,v,i));let b=t[16].values,f=[];for(let i=0;i<b.length;i+=1)f[i]=Ae(Le(t,b,i));return{c(){e=L("div"),l=W(a),n=O();for(let i=0;i<g.length;i+=1)g[i].c();o=O(),r=L("div");for(let i=0;i<f.length;i+=1)f[i].c();u=O(),this.h()},l(i){e=P(i,"DIV",{class:!0});var _=D(e);l=U(_,a),n=F(_);for(let y=0;y<g.length;y+=1)g[y].l(_);_.forEach(p),o=F(i),r=P(i,"DIV",{class:!0});var h=D(r);for(let y=0;y<f.length;y+=1)f[y].l(h);u=F(h),h.forEach(p),this.h()},h(){H(e,"class","label-group svelte-v05hvd"),H(r,"class","bar-group svelte-v05hvd"),Z(r,"height",s)},m(i,_){B(i,e,_),m(e,l),m(e,n);for(let h=0;h<g.length;h+=1)g[h]&&g[h].m(e,null);B(i,o,_),B(i,r,_);for(let h=0;h<f.length;h+=1)f[h]&&f[h].m(r,null);m(r,u)},p(i,_){if(_&128&&a!==(a=i[10](i[16].label)+"")&&ie(l,a),_&153){v=i[16].values;let h;for(h=0;h<v.length;h+=1){const y=Pe(i,v,h);g[h]?g[h].p(y,_):(g[h]=Ne(y),g[h].c(),g[h].m(e,null))}for(;h<g.length;h+=1)g[h].d(1);g.length=v.length}if(_&455){b=i[16].values;let h;for(h=0;h<b.length;h+=1){const y=Le(i,b,h);f[h]?f[h].p(y,_):(f[h]=Ae(y),f[h].c(),f[h].m(r,u))}for(;h<f.length;h+=1)f[h].d(1);f.length=b.length}_&32&&s!==(s=`${i[5]}px`)&&Z(r,"height",s)},d(i){i&&p(e),de(g,i),i&&p(o),i&&p(r),de(f,i)}}}function bt(t){let e,a,l=t[9][1]&&De(t),n=t[7],o=[];for(let r=0;r<n.length;r+=1)o[r]=Be(Ee(t,n,r));return{c(){l&&l.c(),e=O();for(let r=0;r<o.length;r+=1)o[r].c();a=ce()},l(r){l&&l.l(r),e=F(r);for(let u=0;u<o.length;u+=1)o[u].l(r);a=ce()},m(r,u){l&&l.m(r,u),B(r,e,u);for(let s=0;s<o.length;s+=1)o[s]&&o[s].m(r,u);B(r,a,u)},p(r,[u]){if(r[9][1]?l?l.p(r,u):(l=De(r),l.c(),l.m(e.parentNode,e)):l&&(l.d(1),l=null),u&1535){n=r[7];let s;for(s=0;s<n.length;s+=1){const v=Ee(r,n,s);o[s]?o[s].p(v,u):(o[s]=Be(v),o[s].c(),o[s].m(a.parentNode,a))}for(;s<o.length;s+=1)o[s].d(1);o.length=n.length}},i:ve,o:ve,d(r){l&&l.d(r),r&&p(e),de(o,r),r&&p(a)}}}function kt(t,e,a){let l,n,o,r,{data:u}=e,{xKey:s="value"}=e,{yKey:v="category"}=e,{zKey:g="group"}=e,{colorKey:b="color"}=e,{colors:f=["white","#888","#444"]}=e,{formatTick:i=d=>d.toLocaleString()}=e,{suffix:_=""}=e,{barHeight:h=20}=e,{markerWidth:y=3}=e;function I(d,M){let $={};for(const E of d)$[E[M]]||($[E[M]]={label:E[M],values:[]}),$[E[M]].values.push(E);let z=[];for(const E in $)z.push($[E]);return z}const N=d=>d.charAt(0).toUpperCase()+d.slice(1);return t.$$set=d=>{"data"in d&&a(11,u=d.data),"xKey"in d&&a(0,s=d.xKey),"yKey"in d&&a(12,v=d.yKey),"zKey"in d&&a(13,g=d.zKey),"colorKey"in d&&a(1,b=d.colorKey),"colors"in d&&a(2,f=d.colors),"formatTick"in d&&a(3,i=d.formatTick),"suffix"in d&&a(4,_=d.suffix),"barHeight"in d&&a(5,h=d.barHeight),"markerWidth"in d&&a(6,y=d.markerWidth)},t.$$.update=()=>{t.$$.dirty&2049&&a(14,l=[0,Math.max(...u.map(d=>d[s]))]),t.$$.dirty&10240&&a(9,n=u.map(d=>d[g]).filter((d,M,$)=>$.indexOf(d)===M)),t.$$.dirty&16384&&a(8,o=d=>d/l[1]*100),t.$$.dirty&6144&&a(7,r=I(u,v))},[s,b,f,i,_,h,y,r,o,n,N,u,v,g,l]}class Ye extends Ve{constructor(e){super(),Ke(this,e,kt,bt,ze,{data:11,xKey:0,yKey:12,zKey:13,colorKey:1,colors:2,formatTick:3,suffix:4,barHeight:5,markerWidth:6})}}function Te(t,e,a){const l=t.slice();return l[41]=e[a],l}function He(t,e,a){const l=t.slice();return l[44]=e[a],l}function Oe(t){let e,a,l,n;return{c(){e=L("button"),a=W("Deselect"),this.h()},l(o){e=P(o,"BUTTON",{class:!0});var r=D(e);a=U(r,"Deselect"),r.forEach(p),this.h()},h(){H(e,"class","btn-link svelte-1egxxhq")},m(o,r){B(o,e,r),m(e,a),l||(n=re(e,"click",t[13]),l=!0)},p:ve,d(o){o&&p(e),l=!1,n()}}}function wt(t){let e,a;function l(...n){return t[23](t[44],...n)}return e=new Ye({props:{data:[{category:"Works from home",value:t[8][t[44]].home,color:0},{category:`Lives within ${t[9][t[44]].areanm}`,value:t[8][t[44]].within,color:0},...[1,2,3,4,5].map(l),{category:"Lives in another location",value:t[8][t[44]].fromother,color:2}]}}),{c(){oe(e.$$.fragment)},l(n){se(e.$$.fragment,n)},m(n,o){fe(e,n,o),a=!0},p(n,o){t=n;const r={};o[0]&6&&(r.data=[{category:"Works from home",value:t[8][t[44]].home,color:0},{category:`Lives within ${t[9][t[44]].areanm}`,value:t[8][t[44]].within,color:0},...[1,2,3,4,5].map(l),{category:"Lives in another location",value:t[8][t[44]].fromother,color:2}]),e.$set(r)},i(n){a||(J(e.$$.fragment,n),a=!0)},o(n){j(e.$$.fragment,n),a=!1},d(n){ue(e,n)}}}function yt(t){let e,a;function l(...n){return t[22](t[44],...n)}return e=new Ye({props:{data:[{category:"Works from home",value:t[8][t[44]].home,color:0},{category:`Works within ${t[9][t[44]].areanm}`,value:t[8][t[44]].within,color:0},...[1,2,3,4,5].map(l),{category:"Works in another location",value:t[8][t[44]].toother,color:2}]}}),{c(){oe(e.$$.fragment)},l(n){se(e.$$.fragment,n)},m(n,o){fe(e,n,o),a=!0},p(n,o){t=n;const r={};o[0]&6&&(r.data=[{category:"Works from home",value:t[8][t[44]].home,color:0},{category:`Works within ${t[9][t[44]].areanm}`,value:t[8][t[44]].within,color:0},...[1,2,3,4,5].map(l),{category:"Works in another location",value:t[8][t[44]].toother,color:2}]),e.$set(r)},i(n){a||(J(e.$$.fragment,n),a=!0)},o(n){j(e.$$.fragment,n),a=!1},d(n){ue(e,n)}}}function Fe(t){let e,a=t[9][t[44]].areanm+"",l,n,o,r,u,s,v=t[8][t[44]].resident.toLocaleString()+"",g,b,f,i,_,h=t[8][t[44]].workday.toLocaleString()+"",y,I,N,d=(t[8][t[44]].workday-t[8][t[44]].resident).toLocaleString("en-GB",{signDisplay:"exceptZero"})+"",M,$,z,E,K,X,ee,te,G,A,Q,V,pe,C=t[44]===t[1]&&Oe(t);const w=[yt,wt],q=[];function Y(c,S){return c[6]==="from"?0:1}return E=Y(t),K=q[E]=w[E](t),{c(){e=L("div"),l=W(a),n=O(),C&&C.c(),o=O(),r=L("button"),u=W(`Resident population
				`),s=L("div"),g=W(v),b=O(),f=L("button"),i=W(`Workday population
				`),_=L("div"),y=W(h),I=O(),N=L("div"),M=W(d),$=O(),z=L("div"),K.c(),X=O(),ee=L("div"),te=L("label"),G=L("input"),A=W(`
					Highlight points for this area on map`),this.h()},l(c){e=P(c,"DIV",{class:!0});var S=D(e);l=U(S,a),n=F(S),C&&C.l(S),S.forEach(p),o=F(c),r=P(c,"BUTTON",{class:!0});var ne=D(r);u=U(ne,`Resident population
				`),s=P(ne,"DIV",{class:!0});var ae=D(s);g=U(ae,v),ae.forEach(p),ne.forEach(p),b=F(c),f=P(c,"BUTTON",{class:!0});var x=D(f);i=U(x,`Workday population
				`),_=P(x,"DIV",{class:!0});var he=D(_);y=U(he,h),he.forEach(p),I=F(x),N=P(x,"DIV",{class:!0});var _e=D(N);M=U(_e,d),_e.forEach(p),x.forEach(p),$=F(c),z=P(c,"DIV",{});var k=D(z);K.l(k),k.forEach(p),X=F(c),ee=P(c,"DIV",{});var T=D(ee);te=P(T,"LABEL",{});var R=D(te);G=P(R,"INPUT",{type:!0}),A=U(R,`
					Highlight points for this area on map`),R.forEach(p),T.forEach(p),this.h()},h(){H(e,"class","big-text svelte-1egxxhq"),Z(e,"grid-column","span 2"),H(s,"class","big-text svelte-1egxxhq"),H(r,"class","svelte-1egxxhq"),le(r,"btn-active",t[6]==="from"),H(_,"class","big-text svelte-1egxxhq"),H(N,"class","small-text svelte-1egxxhq"),H(f,"class","svelte-1egxxhq"),le(f,"btn-active",t[6]==="to"),Z(z,"grid-column","span 2"),H(G,"type","checkbox"),Z(ee,"grid-column","span 2")},m(c,S){B(c,e,S),m(e,l),m(e,n),C&&C.m(e,null),B(c,o,S),B(c,r,S),m(r,u),m(r,s),m(s,g),B(c,b,S),B(c,f,S),m(f,i),m(f,_),m(_,y),m(f,I),m(f,N),m(N,M),B(c,$,S),B(c,z,S),q[E].m(z,null),B(c,X,S),B(c,ee,S),m(ee,te),m(te,G),G.checked=t[7],m(te,A),Q=!0,V||(pe=[re(r,"click",t[20]),re(f,"click",t[21]),re(G,"change",t[24]),re(G,"change",t[25])],V=!0)},p(c,S){(!Q||S[0]&6)&&a!==(a=c[9][c[44]].areanm+"")&&ie(l,a),c[44]===c[1]?C?C.p(c,S):(C=Oe(c),C.c(),C.m(e,null)):C&&(C.d(1),C=null),(!Q||S[0]&6)&&v!==(v=c[8][c[44]].resident.toLocaleString()+"")&&ie(g,v),(!Q||S[0]&64)&&le(r,"btn-active",c[6]==="from"),(!Q||S[0]&6)&&h!==(h=c[8][c[44]].workday.toLocaleString()+"")&&ie(y,h),(!Q||S[0]&6)&&d!==(d=(c[8][c[44]].workday-c[8][c[44]].resident).toLocaleString("en-GB",{signDisplay:"exceptZero"})+"")&&ie(M,d),(!Q||S[0]&64)&&le(f,"btn-active",c[6]==="to");let ne=E;E=Y(c),E===ne?q[E].p(c,S):(we(),j(q[ne],1,1,()=>{q[ne]=null}),ke(),K=q[E],K?K.p(c,S):(K=q[E]=w[E](c),K.c()),J(K,1),K.m(z,null)),S[0]&128&&(G.checked=c[7])},i(c){Q||(J(K),Q=!0)},o(c){j(K),Q=!1},d(c){c&&p(e),C&&C.d(),c&&p(o),c&&p(r),c&&p(b),c&&p(f),c&&p($),c&&p(z),q[E].d(),c&&p(X),c&&p(ee),V=!1,Ge(pe)}}}function Me(t){let e,a,l,n,o,r,u,s,v,g,b,f,i,_,h,y;return{c(){e=L("div"),a=W("2011 Census travel to work data"),l=O(),n=L("div"),o=L("p"),r=W("Using this experimental tool, you can:"),u=O(),s=L("ul"),v=L("li"),g=W('animate commutes on a map, by clicking "place of work".'),b=O(),f=L("li"),i=W("see commutes for individual area, by hovering or clicking an area on the map."),_=O(),h=L("p"),y=W("Note: The data in this tool is from 2011, not the latest 2021 census."),this.h()},l(I){e=P(I,"DIV",{class:!0});var N=D(e);a=U(N,"2011 Census travel to work data"),N.forEach(p),l=F(I),n=P(I,"DIV",{});var d=D(n);o=P(d,"P",{});var M=D(o);r=U(M,"Using this experimental tool, you can:"),M.forEach(p),u=F(d),s=P(d,"UL",{});var $=D(s);v=P($,"LI",{});var z=D(v);g=U(z,'animate commutes on a map, by clicking "place of work".'),z.forEach(p),b=F($),f=P($,"LI",{});var E=D(f);i=U(E,"see commutes for individual area, by hovering or clicking an area on the map."),E.forEach(p),$.forEach(p),_=F(d),h=P(d,"P",{});var K=D(h);y=U(K,"Note: The data in this tool is from 2011, not the latest 2021 census."),K.forEach(p),d.forEach(p),this.h()},h(){H(e,"class","big-text svelte-1egxxhq"),Z(e,"grid-column","span 2"),Z(n,"grid-column","span 2")},m(I,N){B(I,e,N),m(e,a),B(I,l,N),B(I,n,N),m(n,o),m(o,r),m(n,u),m(n,s),m(s,v),m(v,g),m(s,b),m(s,f),m(f,i),m(n,_),m(n,h),m(h,y)},d(I){I&&p(e),I&&p(l),I&&p(n)}}}function It(t){let e,a,l=t[10],n=[];for(let r=0;r<l.length;r+=1)n[r]=$e(Te(t,l,r));const o=r=>j(n[r],1,1,()=>{n[r]=null});return{c(){for(let r=0;r<n.length;r+=1)n[r].c();e=ce()},l(r){for(let u=0;u<n.length;u+=1)n[u].l(r);e=ce()},m(r,u){for(let s=0;s<n.length;s+=1)n[s]&&n[s].m(r,u);B(r,e,u),a=!0},p(r,u){if(u[0]&5150){l=r[10];let s;for(s=0;s<l.length;s+=1){const v=Te(r,l,s);n[s]?(n[s].p(v,u),J(n[s],1)):(n[s]=$e(v),n[s].c(),J(n[s],1),n[s].m(e.parentNode,e))}for(we(),s=l.length;s<n.length;s+=1)o(s);ke()}},i(r){if(!a){for(let u=0;u<l.length;u+=1)J(n[u]);a=!0}},o(r){n=n.filter(Boolean);for(let u=0;u<n.length;u+=1)j(n[u]);a=!1},d(r){de(n,r),r&&p(e)}}}function Et(t){let e,a,l,n,o,r,u,s,v,g;function b(i){t[28](i)}let f={id:t[41].key+"-fill",type:"fill",paint:{"fill-color":"rgba(0,0,0,0)"},order:"water",hover:!0,select:!0,selected:t[1],highlight:!0,highlighted:t[3],visible:t[4]===t[41].key};return t[2]!==void 0&&(f.hovered=t[2]),e=new ge({props:f}),We.push(()=>Ue(e,"hovered",b)),e.$on("select",t[12]),n=new ge({props:{id:t[41].key+"-line",type:"line",paint:{"line-color":"#555","line-width":.5},order:"place_other",visible:t[4]===t[41].key}}),r=new ge({props:{id:t[41].key+"-highlighted",type:"line",paint:{"line-color":["case",["==",["feature-state","highlighted"],!0],"#aaa","rgba(0,0,0,0)"],"line-width":1},order:"place_other",visible:t[4]===t[41].key}}),s=new ge({props:{id:t[41].key+"-selected",type:"line",paint:{"line-color":["case",["==",["feature-state","selected"],!0],"white",["==",["feature-state","hovered"],!0],"white","rgba(0,0,0,0)"],"line-width":["case",["==",["feature-state","selected"],!0],2.5,1]},order:"place_other",visible:t[4]===t[41].key}}),{c(){oe(e.$$.fragment),l=O(),oe(n.$$.fragment),o=O(),oe(r.$$.fragment),u=O(),oe(s.$$.fragment),v=O()},l(i){se(e.$$.fragment,i),l=F(i),se(n.$$.fragment,i),o=F(i),se(r.$$.fragment,i),u=F(i),se(s.$$.fragment,i),v=F(i)},m(i,_){fe(e,i,_),B(i,l,_),fe(n,i,_),B(i,o,_),fe(r,i,_),B(i,u,_),fe(s,i,_),B(i,v,_),g=!0},p(i,_){const h={};_[0]&2&&(h.selected=i[1]),_[0]&8&&(h.highlighted=i[3]),_[0]&16&&(h.visible=i[4]===i[41].key),!a&&_[0]&4&&(a=!0,h.hovered=i[2],Ce(()=>a=!1)),e.$set(h);const y={};_[0]&16&&(y.visible=i[4]===i[41].key),n.$set(y);const I={};_[0]&16&&(I.visible=i[4]===i[41].key),r.$set(I);const N={};_[0]&16&&(N.visible=i[4]===i[41].key),s.$set(N)},i(i){g||(J(e.$$.fragment,i),J(n.$$.fragment,i),J(r.$$.fragment,i),J(s.$$.fragment,i),g=!0)},o(i){j(e.$$.fragment,i),j(n.$$.fragment,i),j(r.$$.fragment,i),j(s.$$.fragment,i),g=!1},d(i){ue(e,i),i&&p(l),ue(n,i),i&&p(o),ue(r,i),i&&p(u),ue(s,i),i&&p(v)}}}function $e(t){let e,a;const l=[{id:t[41].key},{type:t[41].type},{promoteId:"areacd"},t[41].props];let n={$$slots:{default:[Et]},$$scope:{ctx:t}};for(let o=0;o<l.length;o+=1)n=je(n,l[o]);return e=new it({props:n}),{c(){oe(e.$$.fragment)},l(o){se(e.$$.fragment,o)},m(o,r){fe(e,o,r),a=!0},p(o,r){const u=r[0]&1024?xe(l,[{id:o[41].key},{type:o[41].type},l[2],et(o[41].props)]):{};r[0]&30|r[1]&65536&&(u.$$scope={dirty:r,ctx:o}),e.$set(u)},i(o){a||(J(e.$$.fragment,o),a=!0)},o(o){j(e.$$.fragment,o),a=!1},d(o){ue(e,o)}}}function Lt(t){let e,a,l=t[10][1].props.data&&It(t);return{c(){l&&l.c(),e=ce()},l(n){l&&l.l(n),e=ce()},m(n,o){l&&l.m(n,o),B(n,e,o),a=!0},p(n,o){n[10][1].props.data&&l.p(n,o)},i(n){a||(J(l),a=!0)},o(n){j(l),a=!1},d(n){l&&l.d(n),n&&p(e)}}}function Pt(t){let e,a,l,n,o,r,u,s,v,g,b,f,i,_,h,y,I,N,d,M,$,z,E,K,X,ee,te,G=t[2]?[t[2]]:t[1]?[t[1]]:[],A=[];for(let w=0;w<G.length;w+=1)A[w]=Fe(He(t,G,w));const Q=w=>j(A[w],1,1,()=>{A[w]=null});let V=!t[1]&&!t[2]&&Me();function pe(w){t[29](w)}let C={style:"https://bothness.github.io/ons-basemaps/data/style-dark.json",location:{bounds:Re.ew},options:{antialias:!0},minzoom:6,controls:!0,$$slots:{default:[Lt]},$$scope:{ctx:t}};return t[0]!==void 0&&(C.map=t[0]),E=new at({props:C}),We.push(()=>Ue(E,"map",pe)),E.$on("load",t[11]),{c(){e=L("main"),a=L("div"),l=L("div"),n=L("button"),o=W("Local authorities"),r=O(),u=L("button"),s=W("Neighbourhoods"),v=O();for(let w=0;w<A.length;w+=1)A[w].c();g=O(),V&&V.c(),b=O(),f=L("div"),i=L("div"),_=L("button"),h=W("Place of residence"),y=O(),I=L("button"),N=W("Place of work"),d=O(),M=L("span"),$=W("1 dot = 100 working people"),z=O(),oe(E.$$.fragment),this.h()},l(w){e=P(w,"MAIN",{class:!0});var q=D(e);a=P(q,"DIV",{class:!0});var Y=D(a);l=P(Y,"DIV",{class:!0});var c=D(l);n=P(c,"BUTTON",{class:!0});var S=D(n);o=U(S,"Local authorities"),S.forEach(p),r=F(c),u=P(c,"BUTTON",{class:!0});var ne=D(u);s=U(ne,"Neighbourhoods"),ne.forEach(p),v=F(c);for(let T=0;T<A.length;T+=1)A[T].l(c);g=F(c),V&&V.l(c),c.forEach(p),Y.forEach(p),b=F(q),f=P(q,"DIV",{class:!0});var ae=D(f);i=P(ae,"DIV",{class:!0});var x=D(i);_=P(x,"BUTTON",{class:!0});var he=D(_);h=U(he,"Place of residence"),he.forEach(p),y=F(x),I=P(x,"BUTTON",{class:!0});var _e=D(I);N=U(_e,"Place of work"),_e.forEach(p),d=F(x),M=P(x,"SPAN",{class:!0});var k=D(M);$=U(k,"1 dot = 100 working people"),k.forEach(p),x.forEach(p),z=F(ae),se(E.$$.fragment,ae),ae.forEach(p),q.forEach(p),this.h()},h(){H(n,"class","svelte-1egxxhq"),le(n,"btn-active",t[4]==="lad"),H(u,"class","svelte-1egxxhq"),le(u,"btn-active",t[4]==="msoa"),H(l,"class","grid svelte-1egxxhq"),H(a,"class","info svelte-1egxxhq"),H(_,"class","svelte-1egxxhq"),le(_,"btn-active",t[5]==="from"),H(I,"class","svelte-1egxxhq"),le(I,"btn-active",t[5]==="to"),H(M,"class","svelte-1egxxhq"),H(i,"class","map-legend svelte-1egxxhq"),H(f,"class","map svelte-1egxxhq"),H(e,"class","container svelte-1egxxhq")},m(w,q){B(w,e,q),m(e,a),m(a,l),m(l,n),m(n,o),m(l,r),m(l,u),m(u,s),m(l,v);for(let Y=0;Y<A.length;Y+=1)A[Y]&&A[Y].m(l,null);m(l,g),V&&V.m(l,null),m(e,b),m(e,f),m(f,i),m(i,_),m(_,h),m(i,y),m(i,I),m(I,N),m(i,d),m(i,M),m(M,$),m(f,z),fe(E,f,null),X=!0,ee||(te=[re(n,"click",t[18]),re(u,"click",t[19]),re(_,"click",t[26]),re(I,"click",t[27])],ee=!0)},p(w,q){if((!X||q[0]&16)&&le(n,"btn-active",w[4]==="lad"),(!X||q[0]&16)&&le(u,"btn-active",w[4]==="msoa"),q[0]&74694){G=w[2]?[w[2]]:w[1]?[w[1]]:[];let c;for(c=0;c<G.length;c+=1){const S=He(w,G,c);A[c]?(A[c].p(S,q),J(A[c],1)):(A[c]=Fe(S),A[c].c(),J(A[c],1),A[c].m(l,g))}for(we(),c=G.length;c<A.length;c+=1)Q(c);ke()}!w[1]&&!w[2]?V||(V=Me(),V.c(),V.m(l,null)):V&&(V.d(1),V=null),(!X||q[0]&32)&&le(_,"btn-active",w[5]==="from"),(!X||q[0]&32)&&le(I,"btn-active",w[5]==="to");const Y={};q[0]&30|q[1]&65536&&(Y.$$scope={dirty:q,ctx:w}),!K&&q[0]&1&&(K=!0,Y.map=w[0],Ce(()=>K=!1)),E.$set(Y)},i(w){if(!X){for(let q=0;q<G.length;q+=1)J(A[q]);J(E.$$.fragment,w),X=!0}},o(w){A=A.filter(Boolean);for(let q=0;q<A.length;q+=1)j(A[q]);j(E.$$.fragment,w),X=!1},d(w){w&&p(e),de(A,w),V&&V.d(),ue(E),ee=!1,Ge(te)}}}function qt(t,e,a){return[1,2,3,4,5].map(l=>t[e][`${a==="to"?"from":"to"}${l}cd`])}function Dt(t,e,a){let{data:l}=e;const{areadata:n,metadata:o,sources:r,points:u}=l,s=u.array.length,v=ot([5,14],[.5,4]);let g,b,f,i,_,h,y,I,N,d,M,$="lad",z="from",E="from",K=!0;function X(k){const T=[Math.min(...k.map(R=>R.xmin)),Math.min(...k.map(R=>R.ymin)),Math.max(...k.map(R=>R.xmax)),Math.max(...k.map(R=>R.ymax))];g.fitBounds(T,{padding:50})}async function ee(){const k=T=>(h=rt(T),y=gt(h),N=y.buffer(u.from,{duration:5e3,ease:"linear"}),d=h.buffer(Array.from({length:s},()=>.7)),{render:y({vert:`
      uniform mat4 uMatrix;
      uniform float pointSize;
      precision lowp float;
      attribute vec2 position;
			attribute float opacity;
			varying float fragOpacity;

      void main() {
        gl_PointSize = pointSize;
        gl_Position = uMatrix * vec4(position, 0, 1);
				fragOpacity = opacity;
      }
        `,frag:`
      precision lowp float;
			varying float fragOpacity;

      void main() {
        if (length(gl_PointCoord.xy - 0.5) > 0.5) {
          discard;
        }
        gl_FragColor = vec4(0.145, 0.627, 0.8, fragOpacity);
      }
      `,attributes:{position:N,opacity:d},uniforms:{pointSize:h.prop("pointSize")||2,uMatrix:h.prop("uMatrix")},blend:{enable:!0,func:{srcRGB:"src alpha",srcAlpha:"src alpha",dstRGB:"one minus src alpha",dstAlpha:"one minus src alpha"}},depth:{enable:!1},count:s,primitive:"points"})});g.addLayer({id:"custom_layer",type:"custom",onAdd:(T,R)=>{I=k(R),h.frame(()=>{T&&_&&T.triggerRepaint()})},render(T,R){M=R,_=g.getZoom(),I.render({uMatrix:M,pointSize:v(_)*window.devicePixelRatio})}},"place_suburb")}function te(k){var R;const T=typeof k=="string"?k:(R=k==null?void 0:k.detail)==null?void 0:R.id;T&&(a(1,b=T),V())}function G(k){a(1,b=null),a(3,i=[]),d({data:Array.from({length:u.array.length},()=>.7)}),k&&g.fitBounds(Re.ew)}function A(k,T){z!==k&&(N.update(u[k],T?{duration:T}:null),a(5,z=k))}function Q(k){$!==k&&(a(4,$=k),b&&k==="lad"?te(o[b].parentcd):G())}function V(k=E){b&&(d({data:K?u.array.map(T=>T[`${k}_${$}`]===b?1:.1):Array.from({length:u.array.length},()=>.7)}),a(3,i=qt(n,b,k)),a(6,E=k),X([o[b],...i.map(T=>o[T])]))}const pe=()=>Q("lad"),C=()=>Q("msoa"),w=()=>V("from"),q=()=>V("to"),Y=(k,T)=>({category:`Works in ${o[n[k][`to${T}cd`]].areanm}`,value:n[k][`to${T}`],color:1}),c=(k,T)=>({category:`Lives in ${o[n[k][`from${T}cd`]].areanm}`,value:n[k][`from${T}`],color:1});function S(){K=this.checked,a(7,K)}const ne=()=>V(),ae=()=>A("from"),x=()=>A("to");function he(k){f=k,a(2,f)}function _e(k){g=k,a(0,g)}return t.$$set=k=>{"data"in k&&a(17,l=k.data)},[g,b,f,i,$,z,E,K,n,o,r,ee,te,G,A,Q,V,l,pe,C,w,q,Y,c,S,ne,ae,x,he,_e]}class Bt extends Ve{constructor(e){super(),Ke(this,e,Dt,Pt,ze,{data:17},null,[-1,-1])}}export{Bt as default};
