"use strict";(self.webpackChunkmobile=self.webpackChunkmobile||[]).push([[7023],{7023:(et,H,D)=>{D.r(H),D.d(H,{iosTransitionAnimation:()=>tt,shadow:()=>h});var o=D(67864),J=D(51285);const k=s=>document.querySelector(`${s}.ion-cloned-element`),h=s=>s.shadowRoot||s,G=s=>{const r="ION-TABS"===s.tagName?s:s.querySelector("ion-tabs"),c="ion-content ion-header:not(.header-collapse-condense-inactive) ion-title.title-large";if(null!=r){const e=r.querySelector("ion-tab:not(.tab-hidden), .ion-page:not(.ion-page-hidden)");return null!=e?e.querySelector(c):null}return s.querySelector(c)},U=(s,r)=>{const c="ION-TABS"===s.tagName?s:s.querySelector("ion-tabs");let e=[];if(null!=c){const t=c.querySelector("ion-tab:not(.tab-hidden), .ion-page:not(.ion-page-hidden)");null!=t&&(e=t.querySelectorAll("ion-buttons"))}else e=s.querySelectorAll("ion-buttons");for(const t of e){const p=t.closest("ion-header"),i=p&&!p.classList.contains("header-collapse-condense-inactive"),u=t.querySelector("ion-back-button"),l=t.classList.contains("buttons-collapse"),y="start"===t.slot||""===t.slot;if(null!==u&&y&&(l&&i&&r||!l))return u}return null},z=(s,r,c,e,t,p,i,u,l)=>{var y,E;const _=r?`calc(100% - ${t.right+4}px)`:t.left-4+"px",f=r?"right":"left",T=r?"left":"right",R=r?"right":"left",O=(null===(y=p.textContent)||void 0===y?void 0:y.trim())===(null===(E=u.textContent)||void 0===E?void 0:E.trim()),S=(l.height-Z)/i.height,X=O?`scale(${l.width/i.width}, ${S})`:`scale(${S})`,M="scale(1)",x=h(e).querySelector("ion-icon").getBoundingClientRect(),n=r?x.width/2-(x.right-t.right)+"px":t.left-x.width/2+"px",g=r?`-${window.innerWidth-t.right}px`:`${t.left}px`,$=`${l.top}px`,C=`${t.top}px`,I=c?[{offset:0,transform:`translate3d(${g}, ${C}, 0)`},{offset:1,transform:`translate3d(${n}, ${$}, 0)`}]:[{offset:0,transform:`translate3d(${n}, ${$}, 0)`},{offset:1,transform:`translate3d(${g}, ${C}, 0)`}],A=c?[{offset:0,opacity:1,transform:M},{offset:1,opacity:0,transform:X}]:[{offset:0,opacity:0,transform:X},{offset:1,opacity:1,transform:M}],N=c?[{offset:0,opacity:1,transform:"scale(1)"},{offset:.2,opacity:0,transform:"scale(0.6)"},{offset:1,opacity:0,transform:"scale(0.6)"}]:[{offset:0,opacity:0,transform:"scale(0.6)"},{offset:.6,opacity:0,transform:"scale(0.6)"},{offset:1,opacity:1,transform:"scale(1)"}],L=(0,o.c)(),q=(0,o.c)(),w=(0,o.c)(),m=k("ion-back-button"),P=h(m).querySelector(".button-text"),Y=h(m).querySelector("ion-icon");m.text=e.text,m.mode=e.mode,m.icon=e.icon,m.color=e.color,m.disabled=e.disabled,m.style.setProperty("display","block"),m.style.setProperty("position","fixed"),q.addElement(Y),L.addElement(P),w.addElement(m),w.beforeStyles({position:"absolute",top:"0px",[R]:"0px"}).keyframes(I),L.beforeStyles({"transform-origin":`${f} top`}).beforeAddWrite(()=>{e.style.setProperty("display","none"),m.style.setProperty(f,_)}).afterAddWrite(()=>{e.style.setProperty("display",""),m.style.setProperty("display","none"),m.style.removeProperty(f)}).keyframes(A),q.beforeStyles({"transform-origin":`${T} center`}).keyframes(N),s.addAnimation([L,q,w])},j=(s,r,c,e,t,p,i,u)=>{var l,y;const E=r?"right":"left",_=r?`calc(100% - ${t.right}px)`:`${t.left}px`,T=`${t.top}px`,O=r?`-${window.innerWidth-u.right-8}px`:u.x-8+"px",S=u.y-2+"px",X=(null===(l=i.textContent)||void 0===l?void 0:l.trim())===(null===(y=e.textContent)||void 0===y?void 0:y.trim()),W=u.height/(p.height-Z),x="scale(1)",n=X?`scale(${u.width/p.width}, ${W})`:`scale(${W})`,C=c?[{offset:0,opacity:0,transform:`translate3d(${O}, ${S}, 0) ${n}`},{offset:.1,opacity:0},{offset:1,opacity:1,transform:`translate3d(0px, ${T}, 0) ${x}`}]:[{offset:0,opacity:.99,transform:`translate3d(0px, ${T}, 0) ${x}`},{offset:.6,opacity:0},{offset:1,opacity:0,transform:`translate3d(${O}, ${S}, 0) ${n}`}],a=k("ion-title"),d=(0,o.c)();a.innerText=e.innerText,a.size=e.size,a.color=e.color,d.addElement(a),d.beforeStyles({"transform-origin":`${E} top`,height:`${t.height}px`,display:"",position:"relative",[E]:_}).beforeAddWrite(()=>{e.style.setProperty("opacity","0")}).afterAddWrite(()=>{e.style.setProperty("opacity",""),a.style.setProperty("display","none")}).keyframes(C),s.addAnimation(d)},tt=(s,r)=>{var c;try{const e="cubic-bezier(0.32,0.72,0,1)",t="opacity",p="transform",i="0%",l="rtl"===s.ownerDocument.dir,y=l?"-99.5%":"99.5%",E=l?"33%":"-33%",_=r.enteringEl,f=r.leavingEl,T="back"===r.direction,R=_.querySelector(":scope > ion-content"),O=_.querySelectorAll(":scope > ion-header > *:not(ion-toolbar), :scope > ion-footer > *"),v=_.querySelectorAll(":scope > ion-header > ion-toolbar"),S=(0,o.c)(),X=(0,o.c)();if(S.addElement(_).duration((null!==(c=r.duration)&&void 0!==c?c:0)||540).easing(r.easing||e).fill("both").beforeRemoveClass("ion-page-invisible"),f&&null!=s){const n=(0,o.c)();n.addElement(s),S.addAnimation(n)}if(R||0!==v.length||0!==O.length?(X.addElement(R),X.addElement(O)):X.addElement(_.querySelector(":scope > .ion-page, :scope > ion-nav, :scope > ion-tabs")),S.addAnimation(X),T?X.beforeClearStyles([t]).fromTo("transform",`translateX(${E})`,`translateX(${i})`).fromTo(t,.8,1):X.beforeClearStyles([t]).fromTo("transform",`translateX(${y})`,`translateX(${i})`),R){const n=h(R).querySelector(".transition-effect");if(n){const g=n.querySelector(".transition-cover"),$=n.querySelector(".transition-shadow"),C=(0,o.c)(),a=(0,o.c)(),d=(0,o.c)();C.addElement(n).beforeStyles({opacity:"1",display:"block"}).afterStyles({opacity:"",display:""}),a.addElement(g).beforeClearStyles([t]).fromTo(t,0,.1),d.addElement($).beforeClearStyles([t]).fromTo(t,.03,.7),C.addAnimation([a,d]),X.addAnimation([C])}}const M=_.querySelector("ion-header.header-collapse-condense"),{forward:W,backward:x}=((s,r,c,e,t)=>{const p=U(e,c),i=G(t),u=G(e),l=U(t,c),y=null!==p&&null!==i&&!c,E=null!==u&&null!==l&&c;if(y){const _=i.getBoundingClientRect(),f=p.getBoundingClientRect(),T=h(p).querySelector(".button-text"),R=T.getBoundingClientRect(),v=h(i).querySelector(".toolbar-title").getBoundingClientRect();j(s,r,c,i,_,v,T,R),z(s,r,c,p,f,T,R,i,v)}else if(E){const _=u.getBoundingClientRect(),f=l.getBoundingClientRect(),T=h(l).querySelector(".button-text"),R=T.getBoundingClientRect(),v=h(u).querySelector(".toolbar-title").getBoundingClientRect();j(s,r,c,u,_,v,T,R),z(s,r,c,l,f,T,R,u,v)}return{forward:y,backward:E}})(S,l,T,_,f);if(v.forEach(n=>{const g=(0,o.c)();g.addElement(n),S.addAnimation(g);const $=(0,o.c)();$.addElement(n.querySelector("ion-title"));const C=(0,o.c)(),a=Array.from(n.querySelectorAll("ion-buttons,[menuToggle]")),d=n.closest("ion-header"),I=d?.classList.contains("header-collapse-condense-inactive");let b;b=a.filter(T?N=>{const L=N.classList.contains("buttons-collapse");return L&&!I||!L}:N=>!N.classList.contains("buttons-collapse")),C.addElement(b);const B=(0,o.c)();B.addElement(n.querySelectorAll(":scope > *:not(ion-title):not(ion-buttons):not([menuToggle])"));const A=(0,o.c)();A.addElement(h(n).querySelector(".toolbar-background"));const F=(0,o.c)(),K=n.querySelector("ion-back-button");if(K&&F.addElement(K),g.addAnimation([$,C,B,A,F]),C.fromTo(t,.01,1),B.fromTo(t,.01,1),T)I||$.fromTo("transform",`translateX(${E})`,`translateX(${i})`).fromTo(t,.01,1),B.fromTo("transform",`translateX(${E})`,`translateX(${i})`),F.fromTo(t,.01,1);else if(M||$.fromTo("transform",`translateX(${y})`,`translateX(${i})`).fromTo(t,.01,1),B.fromTo("transform",`translateX(${y})`,`translateX(${i})`),A.beforeClearStyles([t,"transform"]),d?.translucent?A.fromTo("transform",l?"translateX(-100%)":"translateX(100%)","translateX(0px)"):A.fromTo(t,.01,"var(--opacity)"),W||F.fromTo(t,.01,1),K&&!W){const L=(0,o.c)();L.addElement(h(K).querySelector(".button-text")).fromTo("transform",l?"translateX(-100px)":"translateX(100px)","translateX(0px)"),g.addAnimation(L)}}),f){const n=(0,o.c)(),g=f.querySelector(":scope > ion-content"),$=f.querySelectorAll(":scope > ion-header > ion-toolbar"),C=f.querySelectorAll(":scope > ion-header > *:not(ion-toolbar), :scope > ion-footer > *");if(g||0!==$.length||0!==C.length?(n.addElement(g),n.addElement(C)):n.addElement(f.querySelector(":scope > .ion-page, :scope > ion-nav, :scope > ion-tabs")),S.addAnimation(n),T){n.beforeClearStyles([t]).fromTo("transform",`translateX(${i})`,l?"translateX(-100%)":"translateX(100%)");const a=(0,J.g)(f);S.afterAddWrite(()=>{"normal"===S.getDirection()&&a.style.setProperty("display","none")})}else n.fromTo("transform",`translateX(${i})`,`translateX(${E})`).fromTo(t,1,.8);if(g){const a=h(g).querySelector(".transition-effect");if(a){const d=a.querySelector(".transition-cover"),I=a.querySelector(".transition-shadow"),b=(0,o.c)(),B=(0,o.c)(),A=(0,o.c)();b.addElement(a).beforeStyles({opacity:"1",display:"block"}).afterStyles({opacity:"",display:""}),B.addElement(d).beforeClearStyles([t]).fromTo(t,.1,0),A.addElement(I).beforeClearStyles([t]).fromTo(t,.7,.03),b.addAnimation([B,A]),n.addAnimation([b])}}$.forEach(a=>{const d=(0,o.c)();d.addElement(a);const I=(0,o.c)();I.addElement(a.querySelector("ion-title"));const b=(0,o.c)(),B=a.querySelectorAll("ion-buttons,[menuToggle]"),A=a.closest("ion-header"),F=A?.classList.contains("header-collapse-condense-inactive"),K=Array.from(B).filter(P=>{const Y=P.classList.contains("buttons-collapse");return Y&&!F||!Y});b.addElement(K);const N=(0,o.c)(),L=a.querySelectorAll(":scope > *:not(ion-title):not(ion-buttons):not([menuToggle])");L.length>0&&N.addElement(L);const q=(0,o.c)();q.addElement(h(a).querySelector(".toolbar-background"));const w=(0,o.c)(),m=a.querySelector("ion-back-button");if(m&&w.addElement(m),d.addAnimation([I,b,N,w,q]),S.addAnimation(d),w.fromTo(t,.99,0),b.fromTo(t,.99,0),N.fromTo(t,.99,0),T){if(F||I.fromTo("transform",`translateX(${i})`,l?"translateX(-100%)":"translateX(100%)").fromTo(t,.99,0),N.fromTo("transform",`translateX(${i})`,l?"translateX(-100%)":"translateX(100%)"),q.beforeClearStyles([t,"transform"]),A?.translucent?q.fromTo("transform","translateX(0px)",l?"translateX(-100%)":"translateX(100%)"):q.fromTo(t,"var(--opacity)",0),m&&!x){const Y=(0,o.c)();Y.addElement(h(m).querySelector(".button-text")).fromTo("transform",`translateX(${i})`,`translateX(${(l?-124:124)+"px"})`),d.addAnimation(Y)}}else F||I.fromTo("transform",`translateX(${i})`,`translateX(${E})`).fromTo(t,.99,0).afterClearStyles([p,t]),N.fromTo("transform",`translateX(${i})`,`translateX(${E})`).afterClearStyles([p,t]),w.afterClearStyles([t]),I.afterClearStyles([t]),b.afterClearStyles([t])})}return S}catch(e){throw e}},Z=10}}]);