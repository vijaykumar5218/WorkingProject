"use strict";(self.webpackChunkmobile=self.webpackChunkmobile||[]).push([[2925,2810],{38454:(x,h,n)=>{n.r(h),n.d(h,{LogoutPageModule:()=>U});var c=n(88692),p=n(69900),a=n(61074),d=n(54963),i=n(8239),y=n(2398),s=n.t({signIn:"Sign In"},2),C=n(94184),t=n(66985),l=n(78805),m=n(52810);const S={logoutContent:"myvoyage/public/content/section/Logout"};var P=n(67992),M=n(4014);let L=(()=>{class o{constructor(e,r){this.baseService=e,this.utilityService=r,this.endPoints=S,this.endPoints=this.utilityService.appendBaseUrlToEndpoints(S)}getLogoutContent(){var e=this;return(0,i.Z)(function*(){const r=yield e.baseService.get(e.endPoints.logoutContent,!1);return JSON.parse(r.SessionTimeoutContent)})()}}return o.\u0275fac=function(e){return new(e||o)(t.LFG(P.bQ),t.LFG(M.O))},o.\u0275prov=t.Yz7({token:o,factory:o.\u0275fac,providedIn:"root"}),o})();var O=n(88532);function b(o,g){if(1&o){const e=t.EpF();t.TgZ(0,"ion-grid",1)(1,"ion-row")(2,"ion-col"),t._UZ(3,"img",2),t.qZA()(),t.TgZ(4,"ion-row")(5,"ion-col"),t._UZ(6,"img",3),t.qZA()(),t.TgZ(7,"ion-row")(8,"ion-col")(9,"ion-text",4),t._uU(10),t.qZA()()(),t.TgZ(11,"ion-row")(12,"ion-col")(13,"ion-text",5),t._uU(14),t.qZA()()(),t.TgZ(15,"ion-row")(16,"ion-col")(17,"ion-text",6),t._uU(18),t.qZA()()(),t.TgZ(19,"ion-row",1)(20,"ion-col",1)(21,"ion-button",7),t.NdJ("click",function(){t.CHM(e);const v=t.oxw();return t.KtG(v.signInClicked())}),t._uU(22),t.qZA()()()()}if(2&o){const e=t.oxw();t.xp6(6),t.s9C("src",null==e.logoutContent?null:e.logoutContent.image_url,t.LSH),t.xp6(4),t.hij(" ",null==e.logoutContent?null:e.logoutContent.timeOutMessage," "),t.xp6(4),t.hij(" ",null==e.logoutContent?null:e.logoutContent.timeOutMessage1," "),t.xp6(4),t.hij(" ",null==e.logoutContent?null:e.logoutContent.timeOutMessage2," "),t.xp6(4),t.hij(" ",e.pageText.signIn," ")}}const Z=[{path:"",component:(()=>{class o{constructor(e,r,v,T,A,I){this.authService=e,this.headerFooterService=r,this.logoutService=v,this.baseService=T,this.loadingController=A,this.landingService=I,this.pageText=s,this.reloading=!1}ngOnInit(){var e=this;return(0,i.Z)(function*(){e.authService.authenticationChange$.subscribe(e.authenticationChanged.bind(e)),e.logoutContent=yield e.logoutService.getLogoutContent()})()}authenticationChanged(e){var r=this;return(0,i.Z)(function*(){if(e.auth&&!e.attested){const v=yield r.loadingController.create({translucent:!0});v.present(),"Y"===(yield r.landingService.checkMyvoyageAccess()).enableMyVoyage?r.baseService.navigateByUrl("home"):r.baseService.navigateByUrl("no-access"),v.dismiss()}})()}ionViewWillEnter(){this.reloading=this.authService.reloading}ionViewDidEnter(){var e=this;return(0,i.Z)(function*(){e.headerFooterService.publishType({type:C.n.none},{type:y.v.none})})()}signInClicked(){var e=this;return(0,i.Z)(function*(){e.authService.openLogin()})()}}return o.\u0275fac=function(e){return new(e||o)(t.Y36(l.$),t.Y36(m.J),t.Y36(L),t.Y36(P.bQ),t.Y36(a.HT),t.Y36(O.U))},o.\u0275cmp=t.Xpm({type:o,selectors:[["app-logout"]],decls:1,vars:1,consts:[["class","p-0",4,"ngIf"],[1,"p-0"],["src","assets/icon/myVoyageNew.svg","alt","myvoyage logo",1,"logo"],["alt","lock",1,"lock-img",3,"src"],[1,"title"],[1,"desc1"],[1,"desc2"],["size","small","id","sign-in-button","name","submit","shape","round","expand","block","type","submit","color","btncolor",1,"sign-in",3,"click"]],template:function(e,r){1&e&&t.YNc(0,b,23,5,"ion-grid",0),2&e&&t.Q6J("ngIf",!r.reloading)},dependencies:[c.O5,a.YG,a.wI,a.jY,a.Nd,a.yW],styles:["[_nghost-%COMP%]{background-color:var(--primary-colors-voya-white)}[_nghost-%COMP%]   .logo[_ngcontent-%COMP%]{display:block;margin:126px auto 35.7px;width:292px;height:89.3px}[_nghost-%COMP%]   .lock-img[_ngcontent-%COMP%]{display:block;margin:auto;width:183px;height:184px}[_nghost-%COMP%]   ion-text[_ngcontent-%COMP%]{display:block;margin:0 auto 12px;width:281px;font-size:16px;line-height:1.25;letter-spacing:.08px;text-align:left;color:var(--primary-colors-voya-black)}[_nghost-%COMP%]   ion-text.title[_ngcontent-%COMP%]{font-weight:700;letter-spacing:.02px;text-align:center}[_nghost-%COMP%]   .sign-in[_ngcontent-%COMP%]{margin-top:22px}"]}),o})()}];let F=(()=>{class o{}return o.\u0275fac=function(e){return new(e||o)},o.\u0275mod=t.oAB({type:o}),o.\u0275inj=t.cJS({imports:[d.Bz.forChild(Z),d.Bz]}),o})(),U=(()=>{class o{}return o.\u0275fac=function(e){return new(e||o)},o.\u0275mod=t.oAB({type:o}),o.\u0275inj=t.cJS({imports:[c.ez,p.u5,a.Pc,F]}),o})()},57431:(x,h,n)=>{n.d(h,{k:()=>u});var c=n(8239);const p=JSON.parse('{"youMustUse":"You must use the username to log into this site. If you do not remember your Username, you can reset it by logging into my.voya.com.","systemUnavailable":"System Unavailable"}');var a=n.t(p,2),d=n(66985),i=n(61074),y=n(54963);let u=(()=>{class s{constructor(t,l){this.alertController=t,this.router=l,this.pageText=a}presentAlert(t){var l=this;return(0,c.Z)(function*(){const m=t.link||"",f=yield l.alertController.create({cssClass:t.cssClass||"alert-window",header:t.header||l.pageText.systemUnavailable,subHeader:t.subHeader||"",message:t.message||l.pageText.youMustUse,buttons:t.buttons||["OK"],backdropDismiss:void 0===t?.backdropDismiss||t.backdropDismiss});yield f.present(),""!==m?yield f.onDidDismiss().then(()=>{l.router.navigateByUrl(""+m)}):yield f.onDidDismiss()})()}createAndPresent(t){var l=this;return(0,c.Z)(function*(){return(yield l.alertController.create(t)).present()})()}}return s.\u0275fac=function(t){return new(t||s)(d.LFG(i.Br),d.LFG(y.F0))},s.\u0275prov=d.Yz7({token:s,factory:s.\u0275fac,providedIn:"root"}),s})()},52810:(x,h,n)=>{n.d(h,{J:()=>d});var c=n(66985),p=n(1747),a=n(89128);let d=(()=>{class i{constructor(u,s){this.headerTypeService=u,this.footerTypeService=s}publishType(u,s){this.headerTypeService.publish(u),this.footerTypeService.publish(s)}}return i.\u0275fac=function(u){return new(u||i)(c.LFG(p.v),c.LFG(a.c))},i.\u0275prov=c.Yz7({token:i,factory:i.\u0275fac,providedIn:"root"}),i})()}}]);