"use strict";(self.webpackChunkmobile=self.webpackChunkmobile||[]).push([[5668,2839],{91193:(p,u,t)=>{t.d(u,{q:()=>r});var n=t(14813);const i=JSON.parse('{"retry":"Retry","widgetError":"Failed to load widget"}');var l=t.t(i,2),e=t(66985),o=t(48472),a=t(4014),_=t(65536),d=t(88692),M=t(61074);function O(c,C){if(1&c&&e._UZ(0,"div",2),2&c){const g=e.oxw();e.s9C("id",g.tagName),e.Q6J("ngClass",g.isWeb?"web-mx-widget-component":"mobile-mx-widget-component")}}function s(c,C){if(1&c){const g=e.EpF();e.TgZ(0,"div",3)(1,"ion-text"),e._uU(2),e.qZA(),e.TgZ(3,"ion-button",4),e.NdJ("click",function(){e.CHM(g);const h=e.oxw();return e.KtG(h.refreshWidget())}),e._uU(4),e.qZA()()}if(2&c){const g=e.oxw();e.xp6(2),e.Oqu(g.content.widgetError),e.xp6(2),e.hij(" ",g.content.retry," ")}}let r=(()=>{class c{constructor(g,P,h){this.mxService=g,this.sharedUtilityService=P,this.platformService=h,this.subAccount=!1,this.hasError=!1,this.content=l,this.widgetTimeout=0,this.platformSubscription=new n.w0}ngOnInit(){this.refreshWidget(),this.isWeb=this.sharedUtilityService.getIsWeb(),this.platformSubscription.add(this.platformService.onResume$.subscribe(this.onResume.bind(this))),this.platformSubscription.add(this.platformService.onPause$.subscribe(this.onPause.bind(this)))}onResume(){(new Date).getTime()>this.widgetTimeout&&this.refreshWidget()}onPause(){this.widgetTimeout=(new Date).getTime()+84e4}refreshWidget(){this.hasError=!1,this.mxService.displayWidget(this.widgetType,{id:this.tagName,height:this.height,autoload:!1},this.subAccount).then(g=>{this.hasError=!g})}ngOnDestroy(){this.platformSubscription.unsubscribe()}}return c.\u0275fac=function(g){return new(g||c)(e.Y36(o.C),e.Y36(a.O),e.Y36(_.m))},c.\u0275cmp=e.Xpm({type:c,selectors:[["app-mx-widget"]],inputs:{tagName:"tagName",widgetType:"widgetType",height:"height",subAccount:"subAccount"},decls:2,vars:2,consts:[[3,"id","ngClass",4,"ngIf"],["class","error-window",4,"ngIf"],[3,"id","ngClass"],[1,"error-window"],["size","small","fill","clear","color","btncolor",3,"click"]],template:function(g,P){1&g&&(e.YNc(0,O,1,2,"div",0),e.YNc(1,s,5,2,"div",1)),2&g&&(e.Q6J("ngIf",!P.hasError),e.xp6(1),e.Q6J("ngIf",P.hasError))},dependencies:[d.mk,d.O5,M.YG,M.yW],styles:["#mx-manage-accounts[_ngcontent-%COMP%], [id*=-mx-account-transactions][_ngcontent-%COMP%]{height:100%;padding-bottom:20px}.error-window[_ngcontent-%COMP%]{display:flex;flex-direction:column;padding:60px}.error-window[_ngcontent-%COMP%]   ion-text[_ngcontent-%COMP%]{font-size:18px;margin-bottom:20px}.error-window[_ngcontent-%COMP%]   ion-button[_ngcontent-%COMP%], .error-window[_ngcontent-%COMP%]   ion-text[_ngcontent-%COMP%]{margin:auto}"]}),c})()},56502:(p,u,t)=>{t.d(u,{Y:()=>e});var n=t(88692),i=t(61074),l=t(66985);let e=(()=>{class o{}return o.\u0275fac=function(_){return new(_||o)},o.\u0275mod=l.oAB({type:o}),o.\u0275inj=l.cJS({imports:[n.ez,i.Pc]}),o})()},39237:(p,u,t)=>{t.d(u,{s:()=>e});var n=t(88692),i=t(91659),l=t(66985);let e=(()=>{class o{}return o.\u0275fac=function(_){return new(_||o)},o.\u0275mod=l.oAB({type:o}),o.\u0275inj=l.cJS({imports:[n.ez,i.n]}),o})()},91659:(p,u,t)=>{t.d(u,{n:()=>o});var n=t(88692),i=t(69900),l=t(61074),e=t(66985);let o=(()=>{class a{}return a.\u0275fac=function(d){return new(d||a)},a.\u0275mod=e.oAB({type:a}),a.\u0275inj=e.cJS({imports:[n.ez,i.u5,l.Pc]}),a})()},71638:(p,u,t)=>{t.d(u,{y:()=>e});var n=t(66985),i=t(88692);const l=function(o,a){return{"margin-bottom":o,"margin-top":a}};let e=(()=>{class o{}return o.\u0275fac=function(_){return new(_||o)},o.\u0275cmp=n.Xpm({type:o,selectors:[["journeys-line"]],inputs:{element:"element"},decls:2,vars:4,consts:[[3,"ngStyle"]],template:function(_,d){1&_&&(n.TgZ(0,"div",0),n._UZ(1,"hr"),n.qZA()),2&_&&n.Q6J("ngStyle",n.WLB(1,l,d.element.marginBottom,d.element.marginTop))},dependencies:[i.PC],styles:["hr[_ngcontent-%COMP%]{border-top:1px solid var(--secondary-colors-medium-gray-3);size:3px;width:100%}"]}),o})()},65519:(p,u,t)=>{t.d(u,{o:()=>O});var n=t(66985),i=t(4014),l=t(88692);const e=["img"],o=["div"];function a(s,m){if(1&s&&(n.TgZ(0,"span",0),n._uU(1),n.ALo(2,"currency"),n.qZA()),2&s){const r=n.oxw();n.Q6J("ngClass",r.value.length>4?"font-size-60":"font-size-80"),n.xp6(1),n.Oqu(n.gM2(2,2,r.value.replace("$",""),"USD","symbol","1.0-0"))}}const _=function(s){return{"font-size":s}};function d(s,m){if(1&s&&(n.TgZ(0,"span",3),n._uU(1),n.qZA()),2&s){const r=n.oxw();n.Q6J("ngStyle",n.VKq(2,_,r.fontSize)),n.xp6(1),n.Oqu(r.value)}}const M=function(s,m,r){return{width:s,top:m,left:r}};let O=(()=>{class s{constructor(r){this.utilityService=r}ngOnInit(){this.isWeb=this.utilityService.getIsWeb()}}return s.\u0275fac=function(r){return new(r||s)(n.Y36(i.O))},s.\u0275cmp=n.Xpm({type:s,selectors:[["journeys-steps-step-image-with-value"]],viewQuery:function(r,c){if(1&r&&(n.Gf(e,5),n.Gf(o,5)),2&r){let C;n.iGM(C=n.CRH())&&(c.imageEl=C.first),n.iGM(C=n.CRH())&&(c.divEl=C.first)}},inputs:{imageUrl:"imageUrl",value:"value",top:"top",left:"left",fontSize:"fontSize"},decls:8,vars:9,consts:[[3,"ngClass"],["alt",""],["img",""],[3,"ngStyle"],["div",""],[3,"ngClass",4,"ngIf","ngIfElse"],["notDollar",""]],template:function(r,c){if(1&r&&(n.TgZ(0,"div",0),n._UZ(1,"img",1,2),n.TgZ(3,"div",3,4),n.YNc(5,a,3,7,"span",5),n.YNc(6,d,2,4,"ng-template",null,6,n.W1O),n.qZA()()),2&r){const C=n.MAs(7);let g;n.Q6J("ngClass",c.isWeb?"web-outer-container":"mobile-outer-container"),n.xp6(1),n.uIk("src",c.imageUrl,n.LSH),n.xp6(2),n.Q6J("ngStyle",n.kEZ(5,M,(null==c.imageEl||null==c.imageEl.nativeElement?null:c.imageEl.nativeElement.offsetWidth)-(null==c.divEl||null==c.divEl.nativeElement?null:c.divEl.nativeElement.offsetLeft)+"px",c.top,c.left)),n.xp6(2),n.Q6J("ngIf",null==c.value||null==(g=c.value.toString())?null:g.includes("$"))("ngIfElse",C)}},dependencies:[l.mk,l.O5,l.PC,l.H9],styles:["[_nghost-%COMP%]{display:block;margin-bottom:35px}[_nghost-%COMP%]   div.web-outer-container[_ngcontent-%COMP%], [_nghost-%COMP%]   .mobile-outer-container[_ngcontent-%COMP%]{position:relative;text-align:center;margin:auto}@media screen and (min-width: 550px){[_nghost-%COMP%]   div.web-outer-container[_ngcontent-%COMP%], [_nghost-%COMP%]   .mobile-outer-container[_ngcontent-%COMP%]{width:420px;height:250px}}@media screen and (max-width: 550px){[_nghost-%COMP%]   div.web-outer-container[_ngcontent-%COMP%], [_nghost-%COMP%]   .mobile-outer-container[_ngcontent-%COMP%]{width:100%}}[_nghost-%COMP%]   div.web-outer-container[_ngcontent-%COMP%]   img[_ngcontent-%COMP%], [_nghost-%COMP%]   .mobile-outer-container[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{margin:auto;width:100%}[_nghost-%COMP%]   div.web-outer-container[_ngcontent-%COMP%]   div[_ngcontent-%COMP%], [_nghost-%COMP%]   .mobile-outer-container[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{position:absolute;top:20px;left:-6%}[_nghost-%COMP%]   div.web-outer-container[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], [_nghost-%COMP%]   .mobile-outer-container[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{font-weight:700;color:var(--primary-colors-voya-dark-blue)}@media screen and (min-width: 550px){[_nghost-%COMP%]   div.web-outer-container[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], [_nghost-%COMP%]   .mobile-outer-container[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{font-size:100px}[_nghost-%COMP%]   div.web-outer-container[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]   span.font-size-60[_ngcontent-%COMP%], [_nghost-%COMP%]   .mobile-outer-container[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]   span.font-size-60[_ngcontent-%COMP%]{font-size:60px}[_nghost-%COMP%]   div.web-outer-container[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]   span.font-size-80[_ngcontent-%COMP%], [_nghost-%COMP%]   .mobile-outer-container[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]   span.font-size-80[_ngcontent-%COMP%]{font-size:80px}}@media screen and (max-width: 550px){[_nghost-%COMP%]   div.web-outer-container[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], [_nghost-%COMP%]   .mobile-outer-container[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{font-size:18vw}[_nghost-%COMP%]   div.web-outer-container[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]   span.font-size-60[_ngcontent-%COMP%], [_nghost-%COMP%]   .mobile-outer-container[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]   span.font-size-60[_ngcontent-%COMP%]{font-size:40px}[_nghost-%COMP%]   div.web-outer-container[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]   span.font-size-80[_ngcontent-%COMP%], [_nghost-%COMP%]   .mobile-outer-container[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]   span.font-size-80[_ngcontent-%COMP%]{font-size:80px}}"]}),s})()},56755:(p,u,t)=>{t.d(u,{V:()=>d});var n=t(66985),i=t(54963),l=t(4014),e=t(91193),o=t(61074),a=t(88692);function _(M,O){if(1&M){const s=n.EpF();n.TgZ(0,"ion-button",2),n.NdJ("click",function(){n.CHM(s);const r=n.oxw();return n.KtG(r.viewMoreClicked())}),n._uU(1),n.qZA()}if(2&M){const s=n.oxw();n.Q6J("id","journeyMxWidgetViewMore"+s.element.idSuffix),n.xp6(1),n.hij(" ",s.element.label,"\n")}}let d=(()=>{class M{constructor(s,m){this.router=s,this.utilityService=m}viewMoreClicked(){this.utilityService.getIsWeb()?this.router.navigateByUrl(this.element.weblink):this.router.navigateByUrl(this.element.link)}ngOnInit(){this.randomStr=Date.now().toString()}}return M.\u0275fac=function(s){return new(s||M)(n.Y36(i.F0),n.Y36(l.O))},M.\u0275cmp=n.Xpm({type:M,selectors:[["journeys-steps-step-mx-widget"]],inputs:{element:"element"},decls:2,vars:4,consts:[[3,"widgetType","height","tagName"],["size","small","class","font-18","shape","round","expand","block","color","btncolor","fill","outline",3,"id","click",4,"ngIf"],["size","small","shape","round","expand","block","color","btncolor","fill","outline",1,"font-18",3,"id","click"]],template:function(s,m){1&s&&(n._UZ(0,"app-mx-widget",0),n.YNc(1,_,2,2,"ion-button",1)),2&s&&(n.Q6J("widgetType",m.element.widgetType)("height","400px")("tagName","journeyMxWidget"+m.element.idSuffix+m.randomStr),n.xp6(1),n.Q6J("ngIf",m.element.showWidgetButton))},dependencies:[e.q,o.YG,a.O5],styles:["ion-button[_ngcontent-%COMP%]{color:var(--primary-colors-voya-dark-blue);width:148px;height:40px;font-size:16px;font-weight:600;margin:0 auto 15px}"]}),M})()},50661:(p,u,t)=>{t.d(u,{s:()=>o});var n=t(88692),i=t(69900),l=t(61074),e=t(66985);let o=(()=>{class a{}return a.\u0275fac=function(d){return new(d||a)},a.\u0275mod=e.oAB({type:a}),a.\u0275inj=e.cJS({imports:[n.ez,l.Pc,i.u5]}),a})()},46400:(p,u,t)=>{t.d(u,{u:()=>e});var n=t(61074),i=t(88692),l=t(66985);let e=(()=>{class o{}return o.\u0275fac=function(_){return new(_||o)},o.\u0275mod=l.oAB({type:o}),o.\u0275inj=l.cJS({imports:[n.Pc,i.ez]}),o})()},55813:(p,u,t)=>{t.d(u,{l:()=>n});var n=(()=>{return(i=n||(n={})).CONNECT="connect_widget",i.FINSTRONG="finstrong_widget",i.FINSTRONG_MINI="mini_finstrong_widget",i.MANAGE_ACCOUNT="connections_widget",i.PULSE="pulse_widget",i.NET_WORTH="net_worth_widget",i.NET_WORTH_MINI="mini_net_worth_widget",i.TRANSACTIONS="transactions_widget",i.PULSE_CAROUSEL_MINI="mini_pulse_carousel_widget",i.MINI_SPENDING_WIDGET="mini_spending_widget",i.MINI_BUDGET_WIDGET="mini_budgets_widget",i.SPENDING_WIDGET="spending_widget",i.BUDGET_WIDGET="budgets_widget",n;var i})()},5666:p=>{p.exports=JSON.parse('{"managedBy":"This account is professionally managed for you.","accBalance":"Your account balance","vestedBalance":"Vested balance","vestedAmt":"$87,483.00","Gainloss":"Account Balance Change since January 1, ","gainAmt":"+$5,464.33","Rateofreturn":"Rate of return (Year to date)","rateAmt":"+4.56%","Loanamount":"Loan 1 amount","Loan":"Loan","plan":"Plan","elections":"2022 Benefit Elections","Amount":"Amount","loanAmt":"$1,234.34","Dividends":"Dividends (Year to date)","dividentAmt":"$203.97 (2%)","Contribution":"Contribution per paycheck","contribAmt":"$150.33(3%)","Employercontribution":"Employer contribution per paycheck","EmployerAmt":"$150.33(3%)","Year":"Year to date contribution","yearAmt":"7,435.50","asOf":"As of ","cannotHSA":"You cannot open HSA accounts","last90Days":"Last 90 Days","viewmore":"View More","noTransactions":"You have no transactions for the last 90 days.","close":"Close","goToMatch":"Take me to the match","notThisTime":"No, not at this time","summary":"Summary","resources":"Resources","steps":"Steps","overview":"Overview","insights":"Insights","transactions":"Transactions","addAccount":"Add Account","manageAccounts":"Manage Linked Accounts","outsideAccounts":"Outside Accounts","accountsConnected":"2 Accounts Connected","accountsLinkedToast":"Your accounts have been successfully linked!","accountsUnLinkedToast":"Your accounts have been successfully unlinked!","cashBalance":"Cash Balance","availableAmount":"Available amount","electionAmount":"Election amount","electionAmountEmp":"Election amount (employer)","investedAmount":"Invested Amount","electedContrib":"Elected contribution (per plan year)","ytdContrib":"Year-to-Date Contributions","empContribPlanYear":"Employer Contribution (per plan year)","empContribYTD":"Year-to-Date Contributions (employer)","wellnessContrib":"Wellness Contribution (employer)","hsaTitle":"Health Savings Account","availableBalance":"Available amount","election_Amount":"Elected amount","election_Amount_Employer":"Elected amount (employer)"}')}}]);