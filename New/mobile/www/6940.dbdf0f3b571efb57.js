"use strict";(self.webpackChunkmobile=self.webpackChunkmobile||[]).push([[6940],{26940:(x,u,e)=>{e.r(u),e.d(u,{AddAccountsPageModule:()=>f});var t=e(88692),g=e(69900),v=e(61074),h=e(54963),m=e(66371),s=e(66985);const A=[{path:"",component:m.h}];let p=(()=>{class n{}return n.\u0275fac=function(d){return new(d||n)},n.\u0275mod=s.oAB({type:n}),n.\u0275inj=s.cJS({imports:[h.Bz.forChild(A),h.Bz]}),n})();var y=e(56502);let f=(()=>{class n{}return n.\u0275fac=function(d){return new(d||n)},n.\u0275mod=s.oAB({type:n}),n.\u0275inj=s.cJS({imports:[t.ez,g.u5,v.Pc,p,y.Y]}),n})()},66371:(x,u,e)=>{e.d(u,{h:()=>T});var t=e(66985),g=e(2398);const v=JSON.parse('{"header":"Add Accounts","back":"Back","cancelLink":"X Cancel"}');var h=e(55813),m=e(14813),s=e(94184),A=e(52810),p=e(48472),y=e(4014),f=e(54963),n=e(78517),r=e(61074),d=e(61040),M=e(88692),S=e(91193);const C=["container"];function P(c,l){if(1&c){const i=t.EpF();t.TgZ(0,"div")(1,"a",4),t.NdJ("click",function(){t.CHM(i);const a=t.oxw();return t.KtG(a.closeModal())}),t._uU(2),t.qZA()()}if(2&c){const i=t.oxw();t.xp6(2),t.Oqu(i.pageText.cancelLink)}}let T=(()=>{class c{constructor(i,o,a,O,R,I,b){this.headerFooterService=i,this.mxService=o,this.sharedUtilityService=a,this.activatedRoute=O,this.journeyService=R,this.modalController=I,this.accountService=b,this.widgetType=h.l,this.pageText=v,this.subscription=new m.w0,this.backRoute="/account/summary",this.isWeb=this.sharedUtilityService.getIsWeb()}ngOnInit(){this.height=this.contentView.nativeElement.offsetHeight?this.contentView.nativeElement.offsetHeight+30+"px":"750px",this.preInitHeight&&(this.height=this.preInitHeight);const i=this.activatedRoute.queryParams.subscribe(o=>{o.backRoute&&(this.backRoute=o.backRoute)});this.subscription.add(i)}ionViewWillEnter(){this.isWeb||this.headerFooterService.publishType({type:s.n.navbar,actionOption:{headername:this.pageText.header,btnleft:!0,buttonLeft:{name:this.pageText.back,link:this.backRoute}}},{type:g.v.none})}ngAfterViewInit(){this.mxService.addMXWindowEventListener()}closeModal(){this.mxService.getIsMxUserByMyvoyageAccess(!0),this.sharedUtilityService.setSuppressHeaderFooter(!1),this.modalController.dismiss()}ionViewWillLeave(){this.journeyService.setRefreshMxAccount("true"),this.mxService.getMxMemberConnect(!0),this.mxService.getMxAccountConnect(!0),this.accountService.getAggregatedAccounts(this.mxService.getUserAccountUpdate()),this.mxService.removeMXWindowEventListener(),this.mxService.getIsMxUserByMyvoyageAccess(!0)}ngOnDestroy(){this.subscription.unsubscribe()}}return c.\u0275fac=function(i){return new(i||c)(t.Y36(A.J),t.Y36(p.C),t.Y36(y.O),t.Y36(f.gz),t.Y36(n.W),t.Y36(r.IN),t.Y36(d.B))},c.\u0275cmp=t.Xpm({type:c,selectors:[["app-add-accounts"]],viewQuery:function(i,o){if(1&i&&t.Gf(C,7,t.SBq),2&i){let a;t.iGM(a=t.CRH())&&(o.contentView=a.first)}},inputs:{showCancel:"showCancel",preInitHeight:"preInitHeight"},decls:4,vars:4,consts:[[1,"container"],["container",""],[4,"ngIf"],["id","add-accounts-button",3,"widgetType","height","tagName"],["href","#","id","cancel-link",3,"click"]],template:function(i,o){1&i&&(t.TgZ(0,"div",0,1),t.YNc(2,P,3,1,"div",2),t._UZ(3,"app-mx-widget",3),t.qZA()),2&i&&(t.xp6(2),t.Q6J("ngIf",o.showCancel),t.xp6(1),t.Q6J("widgetType",o.widgetType.CONNECT)("height",o.height)("tagName","mx-add-accounts"))},dependencies:[M.O5,S.q],styles:["[_nghost-%COMP%]{background-color:var(--primary-colors-voya-white);overflow:hidden}[_nghost-%COMP%]   .container[_ngcontent-%COMP%]{height:100%}[_nghost-%COMP%]   .container[_ngcontent-%COMP%]   #cancel-link[_ngcontent-%COMP%]{float:right;color:var(--primary-colors-voya-dark-blue)}"]}),c})()}}]);