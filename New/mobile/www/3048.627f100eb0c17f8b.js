"use strict";(self.webpackChunkmobile=self.webpackChunkmobile||[]).push([[3048],{76493:(x,h,s)=>{s.d(h,{n:()=>S});var t=s(66985),c=s(61074),g=s(88692),C=s(8239),n=s(71249),y=s(61368),p=s(78517),v=s(54963),m=s(4014),P=s(24831);function O(u,d){if(1&u&&t._UZ(0,"journeys-status",4),2&u){const r=t.oxw();t.Q6J("status",r.status)}}function J(u,d){if(1&u&&t._UZ(0,"img",5),2&u){const r=t.oxw();t.Q6J("alt",r.journeyContent.landingPage.comingSoonAltText)}}let T=(()=>{class u{constructor(r,a,M,_){this.journeyService=r,this.router=a,this.sharedUtilityService=M,this.loadingController=_,this.status=n.q.notStarted,this.isComingSoon=!1,this.journeyContent=y}ngOnInit(){this.isComingSoon=this.journeyService.isComingSoon(this.journey),this.isComingSoon?this.content=this.journey.parsedComingSoonContent:(this.status=this.journeyService.getJourneyStatus(this.journey.steps),this.content=this.journey.parsedLandingAndOverviewContent),this.isWeb=this.sharedUtilityService.getIsWeb()}handleJourneyClick(){var r=this;return(0,C.Z)(function*(){if(!r.isComingSoon){if(!r.isWeb){const a=yield r.loadingController.create({translucent:!0});a.present(),yield r.journeyService.setStepContent(r.journey),r.journeyService.setCurrentJourney(r.journey),a.dismiss()}r.status===n.q.inProgress?r.isWeb?r.router.navigate(["/journeys/journey/"+r.journey.journeyID+"/steps"],{queryParams:{journeyType:r.idPrefix}}):r.router.navigateByUrl("/journeys/journey/"+r.journey.journeyID+"/steps"):r.isWeb?r.router.navigate(["/journeys/journey/"+r.journey.journeyID+"/overview"],{queryParams:{journeyType:r.idPrefix,fromJourneys:!0}}):r.router.navigate(["/journeys/journey/"+r.journey.journeyID+"/overview",{fromJourneys:!0}])}})()}}return u.\u0275fac=function(r){return new(r||u)(t.Y36(p.W),t.Y36(v.F0),t.Y36(m.O),t.Y36(c.HT))},u.\u0275cmp=t.Xpm({type:u,selectors:[["journeys-journey"]],inputs:{journey:"journey",idPrefix:"idPrefix"},decls:10,vars:7,consts:[[3,"id","click"],[3,"status",4,"ngIf"],["src","assets/icon/journeys/comingsoon.svg",3,"alt",4,"ngIf"],[3,"src","alt"],[3,"status"],["src","assets/icon/journeys/comingsoon.svg",3,"alt"]],template:function(r,a){1&r&&(t.TgZ(0,"ion-card",0),t.NdJ("click",function(){return a.handleJourneyClick()}),t.TgZ(1,"ion-card-header"),t._uU(2),t.YNc(3,O,1,1,"journeys-status",1),t.YNc(4,J,1,1,"img",2),t.qZA(),t.TgZ(5,"ion-card-content")(6,"div")(7,"ion-text"),t._uU(8),t.qZA(),t._UZ(9,"img",3),t.qZA()()()),2&r&&(t.Q6J("id",a.idPrefix+"JourneyCard"+(null==a.journey?null:a.journey.journeyID)),t.xp6(2),t.Oqu(null==a.content||null==a.content.intro?null:a.content.intro.header),t.xp6(1),t.Q6J("ngIf",!a.isComingSoon),t.xp6(1),t.Q6J("ngIf",a.isComingSoon),t.xp6(4),t.Oqu(null==a.content||null==a.content.intro?null:a.content.intro.message),t.xp6(1),t.Q6J("src",null==a.content||null==a.content.intro?null:a.content.intro.imgUrl,t.LSH)("alt",(null==a.content||null==a.content.intro?null:a.content.intro.altText)||""))},dependencies:[c.PM,c.FN,c.Zi,c.yW,g.O5,P.P],styles:["ion-card[_ngcontent-%COMP%]{--color: var(--primary-colors-voya-black);font-size:16px;border-radius:var(--card-border-radius);box-shadow:var(--card-box-shadow);margin:20px 0}ion-card[_ngcontent-%COMP%]   ion-card-header[_ngcontent-%COMP%]{font-weight:700;display:flex;flex-direction:row;justify-content:space-between;align-items:center}ion-card[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{display:flex}ion-card[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]   ion-text[_ngcontent-%COMP%]{width:66%;margin-right:3%;font-size:16px}ion-card[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:31%;height:100%}"]}),u})();function b(u,d){if(1&u&&t._UZ(0,"journeys-journey",1),2&u){const r=d.$implicit,a=t.oxw();t.Q6J("journey",r)("idPrefix",a.idPrefix)}}let S=(()=>{class u{}return u.\u0275fac=function(r){return new(r||u)},u.\u0275cmp=t.Xpm({type:u,selectors:[["journeys-list"]],inputs:{headerText:"headerText",journeys:"journeys",idPrefix:"idPrefix"},decls:4,vars:2,consts:[[3,"journey","idPrefix",4,"ngFor","ngForOf"],[3,"journey","idPrefix"]],template:function(r,a){1&r&&(t.TgZ(0,"div")(1,"ion-text"),t._uU(2),t.qZA(),t.YNc(3,b,1,2,"journeys-journey",0),t.qZA()),2&r&&(t.xp6(2),t.Oqu(a.headerText),t.xp6(1),t.Q6J("ngForOf",a.journeys))},dependencies:[c.yW,g.sg,T],styles:["div[_ngcontent-%COMP%]{margin-top:20px}div[_ngcontent-%COMP%]   ion-text[_ngcontent-%COMP%]{font-size:18px;font-weight:700;color:var(--primary-colors-voya-black)}"]}),u})()},24831:(x,h,s)=>{s.d(h,{P:()=>n});var t=s(71249),c=s(66985),g=s(88692);const C=function(y,p){return{"in-progress":y,completed:p}};let n=(()=>{class y{constructor(){this.status=t.q.notStarted,this.statusEnum=t.q}}return y.\u0275fac=function(v){return new(v||y)},y.\u0275cmp=c.Xpm({type:y,selectors:[["journeys-status"]],inputs:{status:"status"},decls:4,vars:5,consts:[[3,"ngClass"]],template:function(v,m){1&v&&(c.TgZ(0,"div"),c._UZ(1,"div",0),c.TgZ(2,"span"),c._uU(3),c.qZA()()),2&v&&(c.xp6(1),c.Q6J("ngClass",c.WLB(2,C,m.status===m.statusEnum.inProgress,m.status===m.statusEnum.completed)),c.xp6(2),c.Oqu(m.status))},dependencies:[g.mk],styles:["div[_ngcontent-%COMP%]{white-space:nowrap;display:flex;align-items:center}div[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{width:12px;height:12px;background-color:var(--secondary-colors-error-red);display:inline-block;border-radius:6px;margin-right:5px}div[_ngcontent-%COMP%]   div.in-progress[_ngcontent-%COMP%]{background-color:var(--secondary-colors-warning-yellow)}div[_ngcontent-%COMP%]   div.completed[_ngcontent-%COMP%]{background-color:var(--secondary-colors-green)}div[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{font-size:14px;font-weight:700;color:var(--primary-colors-voya-black)}"]}),y})()},88007:(x,h,s)=>{s.d(h,{u:()=>C});var t=s(88692),c=s(61074),g=s(66985);let C=(()=>{class n{}return n.\u0275fac=function(p){return new(p||n)},n.\u0275mod=g.oAB({type:n}),n.\u0275inj=g.cJS({imports:[t.ez,c.Pc]}),n})()},43048:(x,h,s)=>{s.r(h),s.d(h,{JourneysModule:()=>N});var t=s(88692),c=s(54963),g=s(8239),C=s(57445),n=s(66985),y=s(78517);let p=(()=>{class e{constructor(o){this.journeyService=o}canActivate(o){var i=this;return(0,g.Z)(function*(){return yield i.setData(parseInt(o.params.id)),!0})()}setData(o){var i=this;return(0,g.Z)(function*(){const f=yield(0,C.z)(i.journeyService.fetchJourneys()),j=f.all.findIndex(D=>D.journeyID===o);-1!=j&&(yield i.journeyService.setStepContent(f.all[j]),i.journeyService.setCurrentJourney(f.all[j]))})()}}return e.\u0275fac=function(o){return new(o||e)(n.LFG(y.W))},e.\u0275prov=n.Yz7({token:e,factory:e.\u0275fac,providedIn:"root"}),e})();var v=s(61368),m=s(2398),P=s(14813),O=s(17108),J=s(94184),T=s(52810),b=s(4014),S=s(89128),u=s(15536),d=s(61074);let r=(()=>{class e{constructor(o){this.modal=o,this.compWindow=window}closeDialogClicked(){this.modal.dismiss(),this.compWindow.location.reload()}}return e.\u0275fac=function(o){return new(o||e)(n.Y36(d.IN))},e.\u0275cmp=n.Xpm({type:e,selectors:[["app-lang-disclaimer-modal"]],inputs:{message:"message",buttonText:"buttonText"},decls:5,vars:2,consts:[[1,"message",3,"innerHTML"],["id","ok-btn","shape","round","expand","block",1,"cancel-button","OneLinkNoTx",3,"click"]],template:function(o,i){1&o&&(n.TgZ(0,"ion-card")(1,"ion-card-content"),n._UZ(2,"div",0),n.TgZ(3,"ion-button",1),n.NdJ("click",function(){return i.closeDialogClicked()}),n._uU(4),n.qZA()()()),2&o&&(n.xp6(2),n.Q6J("innerHTML",i.message,n.oJD),n.xp6(2),n.hij(" ",i.buttonText," "))},dependencies:[d.YG,d.PM,d.FN],styles:[".cancel-button[_ngcontent-%COMP%]{font-size:16px;line-height:1.56;font-weight:600;text-align:center;display:block;--box-shadow: none;--background-activated: none;--background-hover: none;--color: var(--ion-color-white);border-radius:20px;width:148px;height:40px;margin:15px auto;--background: var(--v-colors__primary);cursor:pointer}.message[_ngcontent-%COMP%]{margin-top:39px;font-size:18px;font-weight:400;line-height:21.92px;text-align:center;color:var(--primary-colors-voya-black)}"]}),e})();const a=function(e){return{"dashboard-footer":e}};function M(e,l){if(1&e){const o=n.EpF();n.TgZ(0,"voya-global-footer",1),n.NdJ("voya-global-footer-spanish-modal",function(f){n.CHM(o);const j=n.oxw();return n.KtG(j.handleSpanishModalEvent(f))}),n.ALo(1,"async"),n.qZA()}if(2&e){const o=n.oxw();n.Q6J("ngClass",n.VKq(3,a,n.lcZ(1,1,o.workplaceEnabled$)))}}let _=(()=>{class e{constructor(o,i){this.accessService=o,this.modalController=i}ngOnInit(){this.workplaceEnabled$=this.accessService.isMyWorkplaceDashboardEnabled()}ngAfterViewInit(){this.isReady=!0}handleSpanishModalEvent(o){var i=this;return(0,g.Z)(function*(){return(yield i.modalController.create({component:r,cssClass:"modal-not-fullscreen",componentProps:{message:o.detail.description,buttonText:o.detail.buttonText},backdropDismiss:!1})).present()})()}}return e.\u0275fac=function(o){return new(o||e)(n.Y36(u.v),n.Y36(d.IN))},e.\u0275cmp=n.Xpm({type:e,selectors:[["app-footer-desktop"]],decls:1,vars:1,consts:[["isMyVoyage","","useMyvoyageLinks","","sendSpanishModalEvent","",3,"ngClass","voya-global-footer-spanish-modal",4,"ngIf"],["isMyVoyage","","useMyvoyageLinks","","sendSpanishModalEvent","",3,"ngClass","voya-global-footer-spanish-modal"]],template:function(o,i){1&o&&n.YNc(0,M,2,5,"voya-global-footer",0),2&o&&n.Q6J("ngIf",i.isReady)},dependencies:[t.mk,t.O5,t.Ov],styles:["voya-global-footer[_ngcontent-%COMP%]{display:block;padding-top:0}"]}),e})();var Z=s(76493);function I(e,l){if(1&e&&(n.TgZ(0,"ul")(1,"li",2),n._uU(2),n.qZA()()),2&e){const o=l.$implicit;n.xp6(2),n.Oqu(o)}}function F(e,l){if(1&e&&n._UZ(0,"journeys-list",10),2&e){const o=n.oxw().ngIf,i=n.oxw();n.s9C("headerText",(null==o||null==o.recommended?null:o.recommended.length)>1?i.content.landingPage.recommendedJourneysHeader:i.content.landingPage.recommendedJourneysHeader.slice(0,i.content.landingPage.recommendedJourneysHeader.length-1)),n.Q6J("journeys",null==o?null:o.recommended)}}function E(e,l){if(1&e&&n._UZ(0,"journeys-list",11),2&e){const o=n.oxw().ngIf,i=n.oxw();n.Q6J("headerText",i.content.landingPage.allJourneysHeader)("journeys",null==o?null:o.all)}}function A(e,l){1&e&&n._UZ(0,"app-footer-desktop",12)}function L(e,l){if(1&e&&(n.ynx(0),n.YNc(1,F,1,2,"journeys-list",7),n.YNc(2,E,1,2,"journeys-list",8),n.YNc(3,A,1,0,"app-footer-desktop",9),n.BQk()),2&e){const o=l.ngIf,i=n.oxw();n.xp6(1),n.Q6J("ngIf",(null==o?null:o.recommended)&&o.recommended.length>0),n.xp6(1),n.Q6J("ngIf",(null==o?null:o.all)&&o.all.length>0),n.xp6(1),n.Q6J("ngIf",i.myWorkplaceDashboardEnabled&&i.isWeb)}}const W=[{path:"",component:(()=>{class e{constructor(o,i,f,j,D){this.headerFooterType=o,this.journeyService=i,this.sharedUtilityService=f,this.footerTypeService=j,this.accessService=D,this.content=v,this.subscription=new P.w0,this.actionOption={headername:this.content.landingPage.navHeader,btnright:!0,buttonRight:{name:"",link:"notification"}},this.isWeb=this.sharedUtilityService.getIsWeb(),this.subscription.add((0,O.D)(this.accessService.checkWorkplaceAccess()).subscribe(B=>{this.myWorkplaceDashboardEnabled=B.myWorkplaceDashboardEnabled}))}ionViewWillEnter(){var o=this;return(0,g.Z)(function*(){o.journeys$=o.journeyService.fetchJourneys(),o.isWeb?o.footerTypeService.publish({type:m.v.tabsnav,selectedTab:"journeys-list"}):o.headerFooterType.publishType({type:J.n.navbar,actionOption:o.actionOption},{type:m.v.tabsnav,selectedTab:"journeys"})})()}ionViewWillLeave(){this.journeys$=void 0}}return e.\u0275fac=function(o){return new(o||e)(n.Y36(T.J),n.Y36(y.W),n.Y36(b.O),n.Y36(S.c),n.Y36(u.v))},e.\u0275cmp=n.Xpm({type:e,selectors:[["app-journeys"]],decls:9,vars:6,consts:[[3,"ngClass"],[1,"intro"],[1,"desc"],["src","assets/icon/journeys/wandering_in_nature.svg","alt","",1,"image"],[1,"bullet"],[4,"ngFor","ngForOf"],[4,"ngIf"],["idPrefix","recommended",3,"headerText","journeys",4,"ngIf"],["class","journeys-list-all","idPrefix","all",3,"headerText","journeys",4,"ngIf"],["class","small-device-dashboard-footer",4,"ngIf"],["idPrefix","recommended",3,"headerText","journeys"],["idPrefix","all",1,"journeys-list-all",3,"headerText","journeys"],[1,"small-device-dashboard-footer"]],template:function(o,i){1&o&&(n.TgZ(0,"div",0)(1,"ion-row",1)(2,"div",2),n._UZ(3,"img",3),n._uU(4),n.TgZ(5,"div",4),n.YNc(6,I,3,1,"ul",5),n.qZA()()(),n.YNc(7,L,4,3,"ng-container",6),n.ALo(8,"async"),n.qZA()),2&o&&(n.Q6J("ngClass",i.isWeb?"intro-web":"intro-mobile"),n.xp6(4),n.hij(" ",i.content.landingPage.desc," "),n.xp6(2),n.Q6J("ngForOf",i.content.landingPage.descPoints),n.xp6(1),n.Q6J("ngIf",n.lcZ(8,4,i.journeys$)))},dependencies:[d.Nd,t.mk,t.sg,t.O5,_,Z.n,t.Ov],styles:["[_nghost-%COMP%]{background-color:var(--white);padding:8% 20px 0}[_nghost-%COMP%]   .intro-web[_ngcontent-%COMP%]{margin:90px 0 140px}[_nghost-%COMP%]   .intro[_ngcontent-%COMP%]   .desc[_ngcontent-%COMP%]{color:var(--primary-colors-voya-black);font-size:18px}[_nghost-%COMP%]   .intro[_ngcontent-%COMP%]   .bullet[_ngcontent-%COMP%]{margin-top:12px;margin-left:23px}[_nghost-%COMP%]   .intro[_ngcontent-%COMP%]   .image[_ngcontent-%COMP%]{shape-outside:circle(45%);float:right;width:40%;shape-margin:3px}"]}),e})()},{path:"journey/:id",loadChildren:()=>s.e(7593).then(s.bind(s,7593)).then(e=>e.JourneyModule),canActivate:[p]},{path:"contact-a-coach",loadChildren:()=>s.e(8592).then(s.bind(s,21912)).then(e=>e.ContactACoachPageModule)}];let U=(()=>{class e{}return e.\u0275fac=function(o){return new(o||e)},e.\u0275mod=n.oAB({type:e}),e.\u0275inj=n.cJS({imports:[c.Bz.forChild(W),c.Bz]}),e})();var w=s(88007),k=s(69900);let Y=(()=>{class e{}return e.\u0275fac=function(o){return new(o||e)},e.\u0275mod=n.oAB({type:e}),e.\u0275inj=n.cJS({imports:[t.ez,d.Pc]}),e})(),Q=(()=>{class e{}return e.\u0275fac=function(o){return new(o||e)},e.\u0275mod=n.oAB({type:e}),e.\u0275inj=n.cJS({imports:[t.ez,k.u5,d.Pc,Y]}),e})(),N=(()=>{class e{}return e.\u0275fac=function(o){return new(o||e)},e.\u0275mod=n.oAB({type:e}),e.\u0275inj=n.cJS({imports:[d.Pc,t.ez,U,w.u,Q]}),e})()}}]);