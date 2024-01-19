"use strict";(self.webpackChunkmobile=self.webpackChunkmobile||[]).push([[7593],{7593:(J,c,t)=>{t.r(c),t.d(c,{JourneyModule:()=>f});var a=t(88692),h=t(54963),g=t(61368),y=t(94184),n=t(66985),v=t(78517),m=t(1747),l=t(61074);const b=function(o){return{selectedRipple:o}};function C(o,i){if(1&o){const e=n.EpF();n.TgZ(0,"ion-tab-button",4),n.NdJ("click",function(){const u=n.CHM(e).$implicit,r=n.oxw();return n.KtG(r.handleClick(u.link))}),n.TgZ(1,"ion-label"),n._uU(2),n.qZA()()}if(2&o){const e=i.$implicit,s=n.oxw();n.Q6J("ngClass",n.VKq(3,b,s.selectedTab===e.link))("tab",e.link),n.xp6(2),n.Oqu(e.label)}}const p=[{path:"",component:(()=>{class o{constructor(e,s){this.journeyService=e,this.headerType=s,this.content=g,this.tabs=[],this.selectedTab="steps"}ngOnInit(){this.tabs=this.journeyService.fetchTabs(["overview","steps","resources"]),this.selectedTabSubscription=this.journeyService.getSelectedTab$().subscribe(e=>{this.selectedTab=e})}ionViewWillEnter(){this.journey=this.journeyService.getCurrentJourney(),this.headerType.publish({type:y.n.navbar,actionOption:{headername:this.journey.parsedLandingAndOverviewContent.intro.header,btnright:!0,buttonRight:{name:"",link:"notification"},btnleft:!0,buttonLeft:{name:"",link:"journeys"}}}),this.propagateToActiveTab("ionViewWillEnter")}handleClick(e){this.selectedTab=e}ionViewWillLeave(){this.propagateToActiveTab("ionViewWillLeave"),this.journeyService.publishLeaveJourney()}tabChange(e){this.activeTab=e.outlet.activatedView.element}ionViewDidEnter(){this.propagateToActiveTab("ionViewDidEnter")}propagateToActiveTab(e){this.activeTab&&this.activeTab.dispatchEvent(new CustomEvent(e))}ngOnDestroy(){this.selectedTabSubscription.unsubscribe()}}return o.\u0275fac=function(e){return new(e||o)(n.Y36(v.W),n.Y36(m.v))},o.\u0275cmp=n.Xpm({type:o,selectors:[["journeys-journey-shared"]],decls:4,vars:1,consts:[[3,"ionTabsDidChange"],["ionTabs",""],["slot","top"],["class","lightgrey",3,"ngClass","tab","click",4,"ngFor","ngForOf"],[1,"lightgrey",3,"ngClass","tab","click"]],template:function(e,s){if(1&e){const d=n.EpF();n.TgZ(0,"ion-tabs",0,1),n.NdJ("ionTabsDidChange",function(){n.CHM(d);const r=n.MAs(1);return n.KtG(s.tabChange(r))}),n.TgZ(2,"ion-tab-bar",2),n.YNc(3,C,3,5,"ion-tab-button",3),n.qZA()()}2&e&&(n.xp6(3),n.Q6J("ngForOf",s.tabs))},dependencies:[l.Q$,l.yq,l.ZU,l.UN,a.mk,a.sg],styles:["ion-tab-bar[_ngcontent-%COMP%]{padding-top:0;background-color:var(--primary-colors-voya-white)}ion-tab-bar[_ngcontent-%COMP%]   ion-label[_ngcontent-%COMP%]{color:var(--toggle-txt-color);font-size:16px;font-weight:700;font-stretch:normal;font-style:normal;line-height:1.25;letter-spacing:-.5px;height:20px;background-color:var(--primary-colors-voya-white)}ion-tab-bar[_ngcontent-%COMP%]   ion-tab-button.selected[_ngcontent-%COMP%]{box-shadow:0 -4px 0 -1px var(--toggle-txt-color) inset}ion-tab-bar[_ngcontent-%COMP%]   ion-tab-button.selectedRipple[_ngcontent-%COMP%]{box-shadow:0 -4px 0 -1px var(--ripple-color) inset}"]}),o})(),children:[{path:"overview",loadChildren:()=>Promise.all([t.e(3887),t.e(5059),t.e(6347),t.e(7606),t.e(2286),t.e(6439),t.e(2941),t.e(5668),t.e(8592),t.e(6295)]).then(t.bind(t,46295)).then(o=>o.OverviewModule)},{path:"steps",loadChildren:()=>Promise.all([t.e(3887),t.e(5059),t.e(6347),t.e(3288),t.e(2286),t.e(6439),t.e(1282),t.e(2941),t.e(5668),t.e(8592),t.e(3706)]).then(t.bind(t,23706)).then(o=>o.StepsModule)},{path:"resources",loadChildren:()=>Promise.all([t.e(3887),t.e(5059),t.e(6347),t.e(2286),t.e(8592),t.e(3482)]).then(t.bind(t,86533)).then(o=>o.ResourcesModule)}]}];let T=(()=>{class o{}return o.\u0275fac=function(e){return new(e||o)},o.\u0275mod=n.oAB({type:o}),o.\u0275inj=n.cJS({imports:[h.Bz.forChild(p),h.Bz]}),o})(),f=(()=>{class o{}return o.\u0275fac=function(e){return new(e||o)},o.\u0275mod=n.oAB({type:o}),o.\u0275inj=n.cJS({imports:[l.Pc,a.ez,T]}),o})()}}]);