import{j as q,a as Q}from"#entry";import{r as v,d as C,j as W,k as l,x as a,q as e,p as s,F as G,l as g,N as L,V as H,W as N,u as i,Q as P,R as T,M as h,I as J,O as K,T as X}from"./Ct89Yiyn.js";import{m as Z}from"./Dmv2tsM1.js";import{_}from"./DlAUqK2U.js";const tt=()=>({formatPrice:u=>Math.floor(u).toLocaleString("fa-IR"),toPersian:u=>{const n=["۰","۱","۲","۳","۴","۵","۶","۷","۸","۹"];return u.toString().replace(/[0-9]/g,d=>n[parseInt(d)])},toEnglishDigits:u=>{const n="۰۱۲۳۴۵۶۷۸۹";return u.replace(/[۰-۹]/g,d=>n.indexOf(d).toString())}}),et={class:"bg-secondary border border-border rounded-xl p-4 mb-6"},st={class:"grid md:grid-cols-3 gap-4"},rt={class:"relative"},ot={class:"relative"},it={class:"relative"},nt={key:0,class:"mt-3 flex items-center justify-between text-sm"},lt={class:"text-primary opacity-70"},at={key:0,class:"bg-secondary border border-border rounded-xl overflow-hidden"},dt={class:"overflow-x-auto"},pt={class:"w-full"},ut={key:1,class:"bg-secondary border border-border rounded-xl overflow-hidden"},mt={class:"overflow-x-auto"},xt={class:"w-full"},bt={class:"px-4 py-4 text-sm text-primary whitespace-nowrap"},yt={class:"flex items-center gap-2"},vt={class:"font-medium"},ft={key:0,class:"text-xs text-green-600"},ct={class:"px-4 py-4 text-sm whitespace-nowrap"},gt={class:"font-bold text-green-600"},wt={class:"px-4 py-4 text-sm text-primary font-mono whitespace-nowrap"},kt={class:"px-4 py-4 text-sm text-primary whitespace-nowrap"},ht={class:"flex items-center gap-2"},Dt={class:"px-4 py-4 text-sm text-primary whitespace-nowrap"},jt={class:"px-4 py-4 text-sm whitespace-nowrap"},Ct={class:"px-4 py-4 text-sm text-center whitespace-nowrap"},$t={class:"flex items-center justify-center gap-2"},Mt=["onClick"],Vt=["onClick"],St={key:0,class:"border-t border-border px-4 py-3 flex items-center justify-between"},Lt={class:"text-sm text-primary opacity-70"},Pt={class:"flex items-center gap-2"},Tt=["disabled"],zt={class:"flex items-center gap-1"},Ft=["onClick"],Et=["disabled"],Nt={key:2,class:"flex flex-col items-center justify-center py-16 text-center bg-secondary border border-border rounded-xl"},Yt={class:"text-lg font-bold text-primary mb-2"},It={class:"text-sm text-primary opacity-60 max-w-sm"},Ot={class:"relative bg-secondary rounded-2xl shadow-xl p-6 w-full max-w-md z-50 border border-border"},Bt={class:"space-y-3"},Rt={class:"flex justify-between py-2 border-b border-border"},Ut={class:"font-medium text-primary"},At={class:"flex justify-between py-2 border-b border-border"},qt={class:"font-bold text-green-600"},Qt={class:"flex justify-between py-2 border-b border-border"},Wt={class:"font-mono text-primary"},Gt={class:"flex justify-between py-2 border-b border-border"},Ht={class:"text-primary"},Jt={class:"flex justify-between py-2 border-b border-border"},Kt={class:"text-primary"},Xt={key:0,class:"flex justify-between py-2 border-b border-border"},Zt={class:"text-primary"},_t={key:1,class:"flex justify-between py-2 border-b border-border"},te={class:"text-primary"},ee={class:"flex justify-between py-2"},se={class:"mt-6 flex gap-3"},re={__name:"index",setup(Y){let D=null;const w=v([]),u=v(!0),n=v(null),d=v(""),x=v("all"),b=v("all"),p=v(1),k=v(10),f=C(()=>{let o=w.value;if(d.value){const t=d.value.toLowerCase();o=o.filter(r=>r.plan.toLowerCase().includes(t)||r.ref.toLowerCase().includes(t)||r.method.toLowerCase().includes(t))}return x.value!=="all"&&(o=o.filter(t=>t.status===x.value)),b.value!=="all"&&(o=o.filter(t=>t.method===b.value)),o}),I=C(()=>{const o=(p.value-1)*k.value,t=o+k.value;return f.value.slice(o,t)}),$=C(()=>Math.ceil(f.value.length/k.value)),O=C(()=>{const o=[];let r=Math.max(1,p.value-Math.floor(2.5)),y=Math.min($.value,r+5-1);y-r+1<5&&(r=Math.max(1,y-5+1));for(let m=r;m<=y;m++)o.push(m);return o}),z=()=>{d.value="",x.value="all",b.value="all",p.value=1},B=o=>{n.value=o},M=()=>{n.value=null};function F(o){return o.replace(/[۰-۹]/g,t=>"۰۱۲۳۴۵۶۷۸۹".indexOf(t)).replace(/[٠-٩]/g,t=>"٠١٢٣٤٥٦٧٨٩".indexOf(t))}function c(o){const t=Z(o,"YYYY/MM/DD");return t.isValid()?F(t.format("jYYYY/jMM/jDD")):F(o.replace(/\s*/g,""))}W(async()=>{D=(await q(()=>import("./B0tyYwQk.js"),[],import.meta.url)).default,u.value=!0;try{w.value=await U()}catch{}finally{u.value=!1}});function E(o){if(!D)return;const t=document.createElement("iframe");t.style.position="fixed",t.style.top="-9999px",t.style.width="500px",t.style.height="450px",t.style.visibility="hidden",document.body.appendChild(t);const r=Math.round(o.amount*.1),y=o.amount+r,m=o.status==="موفق",V=t.contentWindow.document;V.open(),V.write(`
    <html dir="rtl">
      <head>
        <style>
          @font-face {
            font-family: 'ShabnamFd';
            src: url('/fonts/Shabnam-FD.woff2') format('woff2');
          }
          body {
            margin: 0;
            padding: 0;
            background: transparent;
            font-family: 'ShabnamFd', Tahoma, sans-serif;
          }
          .receipt {
            width: 420px;
            margin: 24px auto;
            padding: 24px;
            background: #fff;
            border-radius: 16px;
            box-shadow: 0 0 10px rgba(0,0,0,0.05);
            position: relative;
            overflow: hidden;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #ddd;
            padding-bottom: 16px;
            margin-bottom: 16px;
          }
          .logo {
            height: 32px;
          }
          .icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: ${m?"#22c55e":"#ef4444"};
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .icon svg {
            width: 24px;
            height: 24px;
          }
          .stamp {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-15deg);
            font-size: 28px;
            font-weight: bold;
            color: ${m?"#22c55e":"#ef4444"};
            opacity: 0.1;
            z-index: 0;
          }
          h2 {
            text-align: center;
            font-size: 18px;
            margin: 0;
            font-weight: bold;
            color: #1e293b;
          }
          .amount {
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            color: #1e293b;
            margin: 16px 0;
          }
          .table {
            font-size: 14px;
            z-index: 1;
            position: relative;
          }
          .row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            color: #374151;
          }
          .row span:first-child {
            font-weight: 500;
          }
          .footer {
            margin-top: 24px;
            font-size: 12px;
            color: #6b7280;
            text-align: center;
            border-top: 1px solid #eee;
            padding-top: 12px;
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="stamp">${m?"پرداخت شده":"پرداخت ناموفق"}</div>

          <div class="header">
            <img src="/logo/logo.png" class="logo" />
            <div class="icon">
              ${m?'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5"/></svg>':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'}
            </div>
          </div>

          <h2>${m?"پرداخت با موفقیت انجام شد":"پرداخت انجام نشد"}</h2>
          <div class="amount">${o.amount.toLocaleString()} تومان</div>

          <div class="table">
            <div class="row"><span>نوع اشتراک:</span><span>${o.plan}</span></div>
            <div class="row"><span>کد تراکنش:</span><span>${o.ref}</span></div>
            <div class="row"><span>روش پرداخت:</span><span>${o.method}</span></div>
            <div class="row"><span>تاریخ:</span><span>${c(o.date)}</span></div>
            ${o.startDate?`<div class="row"><span>تاریخ شروع اشتراک:</span><span>${c(o.startDate)}</span></div>`:""}
            ${o.endDate?`<div class="row"><span>تاریخ پایان اشتراک:</span><span>${c(o.endDate)}</span></div>`:""}            <div class="row"><span><strong>مبلغ کل:</strong></span><span><strong>${y.toLocaleString()} تومان</strong></span></div>
          </div>

          <div class="footer">
            لینکو : <strong>linku.im</strong><br/>
            ساده، هوشمند، همیشه همراه 🎯
          </div>
        </div>
      </body>
    </html>
  `),V.close(),t.onload=()=>{D(t.contentDocument.body,{backgroundColor:null,useCORS:!0,scale:2}).then(A=>{const S=document.createElement("a");S.download=`receipt_${o.ref}.png`,S.href=A.toDataURL("image/png"),S.click(),document.body.removeChild(t)})}}const{$axios:R}=Q(),{toPersian:j}=tt();async function U(){try{return(await R.get("transactions/list")).data.data.map(t=>({...t,plan:j(t.plan),amount:j(t.amount),ref:j(t.ref),startDate:t.startDate,endDate:t.endDate,date:t.date,discount:j(t.discount),status:t.status==="success"?"موفق":"ناموفق"}))}catch{return[]}}return(o,t)=>(a(),l("div",null,[t[86]||(t[86]=e("h2",{class:"text-2xl font-bold text-primary mb-6 flex items-center gap-2"},[e("i",{class:"ti ti-credit-card text-xl"}),s(`\r
      گزارش پرداخت‌ها\r
    `)],-1)),t[87]||(t[87]=s()),e("div",et,[e("div",st,[e("div",rt,[t[6]||(t[6]=e("i",{class:"ti ti-search absolute right-3 top-1/2 -translate-y-1/2 text-primary opacity-50"},null,-1)),t[7]||(t[7]=s()),L(e("input",{"onUpdate:modelValue":t[0]||(t[0]=r=>d.value=r),type:"text",placeholder:"جستجو در کد تراکنش، پلن...",class:"w-full pr-10 pl-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-primary text-primary"},null,512),[[H,d.value]])]),t[18]||(t[18]=s()),e("div",ot,[t[9]||(t[9]=e("i",{class:"ti ti-filter absolute right-3 top-1/2 -translate-y-1/2 text-primary opacity-50"},null,-1)),t[10]||(t[10]=s()),L(e("select",{"onUpdate:modelValue":t[1]||(t[1]=r=>x.value=r),class:"w-full pr-10 pl-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-primary text-primary appearance-none cursor-pointer"},[...t[8]||(t[8]=[e("option",{value:"all"},"همه وضعیت‌ها",-1),s(),e("option",{value:"موفق"},"موفق",-1),s(),e("option",{value:"ناموفق"},"ناموفق",-1)])],512),[[N,x.value]]),t[11]||(t[11]=s()),t[12]||(t[12]=e("i",{class:"ti ti-chevron-down absolute left-3 top-1/2 -translate-y-1/2 text-primary opacity-50 pointer-events-none"},null,-1))]),t[19]||(t[19]=s()),e("div",it,[t[14]||(t[14]=e("i",{class:"ti ti-credit-card absolute right-3 top-1/2 -translate-y-1/2 text-primary opacity-50"},null,-1)),t[15]||(t[15]=s()),L(e("select",{"onUpdate:modelValue":t[2]||(t[2]=r=>b.value=r),class:"w-full pr-10 pl-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-primary text-primary appearance-none cursor-pointer"},[...t[13]||(t[13]=[e("option",{value:"all"},"همه روش‌ها",-1),s(),e("option",{value:"درگاه بانکی"},"درگاه بانکی",-1),s(),e("option",{value:"کارت به کارت"},"کارت به کارت",-1),s(),e("option",{value:"کیف پول"},"کیف پول",-1)])],512),[[N,b.value]]),t[16]||(t[16]=s()),t[17]||(t[17]=e("i",{class:"ti ti-chevron-down absolute left-3 top-1/2 -translate-y-1/2 text-primary opacity-50 pointer-events-none"},null,-1))])]),t[23]||(t[23]=s()),f.value.length!==w.value.length&&!u.value?(a(),l("div",nt,[e("span",lt,[t[20]||(t[20]=e("i",{class:"ti ti-info-circle"},null,-1)),s(" "+i(f.value.length)+" مورد از "+i(w.value.length)+` تراکنش نمایش داده می‌شود\r
        `,1)]),t[22]||(t[22]=s()),e("button",{onClick:z,class:"text-accent hover:underline flex items-center gap-1"},[...t[21]||(t[21]=[e("i",{class:"ti ti-x text-xs"},null,-1),s(`\r
          پاک کردن فیلترها\r
        `,-1)])])])):g("",!0)]),t[88]||(t[88]=s()),u.value?(a(),l("div",at,[e("div",dt,[e("table",pt,[t[25]||(t[25]=e("thead",{class:"bg-primary border-b border-border"},[e("tr",null,[e("th",{class:"px-4 py-3 text-right text-sm font-medium text-primary"},[e("div",{class:"h-4 bg-primary rounded w-16 animate-pulse"})]),s(),e("th",{class:"px-4 py-3 text-right text-sm font-medium text-primary"},[e("div",{class:"h-4 bg-primary rounded w-20 animate-pulse"})]),s(),e("th",{class:"px-4 py-3 text-right text-sm font-medium text-primary"},[e("div",{class:"h-4 bg-primary rounded w-24 animate-pulse"})]),s(),e("th",{class:"px-4 py-3 text-right text-sm font-medium text-primary"},[e("div",{class:"h-4 bg-primary rounded w-20 animate-pulse"})]),s(),e("th",{class:"px-4 py-3 text-right text-sm font-medium text-primary"},[e("div",{class:"h-4 bg-primary rounded w-16 animate-pulse"})]),s(),e("th",{class:"px-4 py-3 text-right text-sm font-medium text-primary"},[e("div",{class:"h-4 bg-primary rounded w-20 animate-pulse"})]),s(),e("th",{class:"px-4 py-3 text-center text-sm font-medium text-primary"},[e("div",{class:"h-4 bg-primary rounded w-16 animate-pulse mx-auto"})])])],-1)),t[26]||(t[26]=s()),e("tbody",null,[(a(),l(P,null,T(5,r=>e("tr",{key:r,class:"border-b border-border"},[...t[24]||(t[24]=[e("td",{class:"px-4 py-4"},[e("div",{class:"h-4 bg-primary rounded w-full animate-pulse"})],-1),s(),e("td",{class:"px-4 py-4"},[e("div",{class:"h-4 bg-primary rounded w-full animate-pulse"})],-1),s(),e("td",{class:"px-4 py-4"},[e("div",{class:"h-4 bg-primary rounded w-full animate-pulse"})],-1),s(),e("td",{class:"px-4 py-4"},[e("div",{class:"h-4 bg-primary rounded w-full animate-pulse"})],-1),s(),e("td",{class:"px-4 py-4"},[e("div",{class:"h-4 bg-primary rounded w-full animate-pulse"})],-1),s(),e("td",{class:"px-4 py-4"},[e("div",{class:"h-4 bg-primary rounded w-full animate-pulse"})],-1),s(),e("td",{class:"px-4 py-4"},[e("div",{class:"h-8 bg-primary rounded w-20 animate-pulse mx-auto"})],-1)])])),64))])])])])):f.value.length?(a(),l("div",ut,[e("div",mt,[e("table",xt,[t[42]||(t[42]=e("thead",{class:"bg-primary border-b border-border"},[e("tr",null,[e("th",{class:"px-4 py-3 text-right text-sm font-medium text-primary whitespace-nowrap"},[e("div",{class:"flex items-center gap-2"},[e("i",{class:"ti ti-package text-base"}),s(`\r
                  نوع اشتراک\r
                `)])]),s(),e("th",{class:"px-4 py-3 text-right text-sm font-medium text-primary whitespace-nowrap"},[e("div",{class:"flex items-center gap-2"},[e("i",{class:"ti ti-coin text-base"}),s(`\r
                  مبلغ\r
                `)])]),s(),e("th",{class:"px-4 py-3 text-right text-sm font-medium text-primary whitespace-nowrap"},[e("div",{class:"flex items-center gap-2"},[e("i",{class:"ti ti-receipt text-base"}),s(`\r
                  کد تراکنش\r
                `)])]),s(),e("th",{class:"px-4 py-3 text-right text-sm font-medium text-primary whitespace-nowrap"},[e("div",{class:"flex items-center gap-2"},[e("i",{class:"ti ti-credit-card text-base"}),s(`\r
                  روش پرداخت\r
                `)])]),s(),e("th",{class:"px-4 py-3 text-right text-sm font-medium text-primary whitespace-nowrap"},[e("div",{class:"flex items-center gap-2"},[e("i",{class:"ti ti-calendar text-base"}),s(`\r
                  تاریخ\r
                `)])]),s(),e("th",{class:"px-4 py-3 text-right text-sm font-medium text-primary whitespace-nowrap"},[e("div",{class:"flex items-center gap-2"},[e("i",{class:"ti ti-info-circle text-base"}),s(`\r
                  وضعیت\r
                `)])]),s(),e("th",{class:"px-4 py-3 text-center text-sm font-medium text-primary whitespace-nowrap"},`\r
                عملیات\r
              `)])],-1)),t[43]||(t[43]=s()),e("tbody",null,[(a(!0),l(P,null,T(I.value,r=>(a(),l("tr",{key:r.id,class:"border-b border-border hover:bg-primary transition-colors"},[e("td",bt,[e("div",yt,[t[28]||(t[28]=e("div",{class:"w-8 h-8 rounded-lg bg-accent flex items-center justify-center"},[e("i",{class:"ti ti-crown text-white text-sm"})],-1)),t[29]||(t[29]=s()),e("div",null,[e("div",vt,i(r.plan),1),t[27]||(t[27]=s()),r.discount?(a(),l("div",ft,i(r.discount)+" تخفیف",1)):g("",!0)])])]),t[36]||(t[36]=s()),e("td",ct,[e("span",gt,i(r.amount.toLocaleString()),1),t[30]||(t[30]=s()),t[31]||(t[31]=e("span",{class:"text-primary opacity-60 mr-1"},"تومان",-1))]),t[37]||(t[37]=s()),e("td",wt,i(r.ref),1),t[38]||(t[38]=s()),e("td",kt,[e("div",ht,[t[32]||(t[32]=e("i",{class:"ti ti-credit-card text-base opacity-60"},null,-1)),s(" "+i(r.method),1)])]),t[39]||(t[39]=s()),e("td",Dt,i(c(r.date)),1),t[40]||(t[40]=s()),e("td",jt,[e("span",{class:h(["inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium",r.status==="موفق"?"bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400":"bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"])},[e("i",{class:h(["ti",r.status==="موفق"?"ti-circle-check":"ti-alert-triangle"])},null,2),s(" "+i(r.status),1)],2)]),t[41]||(t[41]=s()),e("td",Ct,[e("div",$t,[e("button",{onClick:y=>B(r),class:"w-8 h-8 rounded-lg border border-border hover:bg-primary transition-colors flex items-center justify-center group",title:"مشاهده جزئیات"},[...t[33]||(t[33]=[e("i",{class:"ti ti-eye text-base text-primary group-hover:text-accent"},null,-1)])],8,Mt),t[35]||(t[35]=s()),e("button",{onClick:y=>E(r),class:"w-8 h-8 rounded-lg border border-border hover:bg-primary transition-colors flex items-center justify-center group",title:"دانلود رسید"},[...t[34]||(t[34]=[e("i",{class:"ti ti-download text-base text-primary group-hover:text-accent"},null,-1)])],8,Vt)])])]))),128))])])]),t[49]||(t[49]=s()),$.value>1?(a(),l("div",St,[e("div",Lt,`\r
          نمایش `+i((p.value-1)*k.value+1)+" تا "+i(Math.min(p.value*k.value,f.value.length))+" از "+i(f.value.length)+` مورد\r
        `,1),t[48]||(t[48]=s()),e("div",Pt,[e("button",{onClick:t[3]||(t[3]=r=>p.value--),disabled:p.value===1,class:"px-3 py-1.5 border border-border rounded-lg text-sm text-primary hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"},[...t[44]||(t[44]=[e("i",{class:"ti ti-chevron-right"},null,-1)])],8,Tt),t[46]||(t[46]=s()),e("div",zt,[(a(!0),l(P,null,T(O.value,r=>(a(),l("button",{key:r,onClick:y=>p.value=r,class:h(["w-8 h-8 rounded-lg text-sm transition-colors",p.value===r?"accent-bg accent-text font-medium":"border border-border text-primary hover:bg-primary"])},i(r),11,Ft))),128))]),t[47]||(t[47]=s()),e("button",{onClick:t[4]||(t[4]=r=>p.value++),disabled:p.value===$.value,class:"px-3 py-1.5 border border-border rounded-lg text-sm text-primary hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"},[...t[45]||(t[45]=[e("i",{class:"ti ti-chevron-left"},null,-1)])],8,Et)])])):g("",!0)])):(a(),l("div",Nt,[t[50]||(t[50]=e("div",{class:"w-24 h-24 rounded-full bg-primary flex items-center justify-center mb-4"},[e("i",{class:"ti ti-wallet-off text-5xl text-primary opacity-30"})],-1)),t[51]||(t[51]=s()),e("h3",Yt,i(d.value||x.value!=="all"||b.value!=="all"?"نتیجه‌ای یافت نشد":"هیچ تراکنشی یافت نشد"),1),t[52]||(t[52]=s()),e("p",It,i(d.value||x.value!=="all"||b.value!=="all"?"با فیلترهای انتخابی هیچ تراکنشی یافت نشد. لطفا فیلترهای دیگری را امتحان کنید.":"تاکنون هیچ تراکنش پرداختی ثبت نشده است. پس از خرید اشتراک، تراکنش‌های شما در اینجا نمایش داده می‌شود."),1),t[53]||(t[53]=s()),d.value||x.value!=="all"||b.value!=="all"?(a(),l("button",{key:0,onClick:z,class:"mt-4 px-4 py-2 accent-bg accent-text rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"},`\r
        پاک کردن فیلترها\r
      `)):g("",!0)])),t[89]||(t[89]=s()),G(X,{name:"fade"},{default:J(()=>[n.value?(a(),l("div",{key:0,class:"fixed inset-0 z-50 flex items-center justify-center p-4",onClick:K(M,["self"])},[t[84]||(t[84]=e("div",{class:"absolute inset-0 bg-black/80 backdrop-blur-sm"},null,-1)),t[85]||(t[85]=s()),e("div",Ot,[e("button",{onClick:M,class:"absolute top-4 left-4 w-8 h-8 rounded-full hover:bg-primary transition-colors flex items-center justify-center"},[...t[54]||(t[54]=[e("i",{class:"ti ti-x text-xl text-primary"},null,-1)])]),t[80]||(t[80]=s()),t[81]||(t[81]=e("h3",{class:"text-xl font-bold text-primary mb-4 flex items-center gap-2"},[e("i",{class:"ti ti-receipt text-2xl"}),s(`\r
            جزئیات تراکنش\r
          `)],-1)),t[82]||(t[82]=s()),e("div",Bt,[e("div",Rt,[t[55]||(t[55]=e("span",{class:"text-primary opacity-70"},"نوع اشتراک:",-1)),t[56]||(t[56]=s()),e("span",Ut,i(n.value.plan),1)]),t[71]||(t[71]=s()),e("div",At,[t[57]||(t[57]=e("span",{class:"text-primary opacity-70"},"مبلغ:",-1)),t[58]||(t[58]=s()),e("span",qt,i(n.value.amount.toLocaleString())+" تومان",1)]),t[72]||(t[72]=s()),e("div",Qt,[t[59]||(t[59]=e("span",{class:"text-primary opacity-70"},"کد تراکنش:",-1)),t[60]||(t[60]=s()),e("span",Wt,i(n.value.ref),1)]),t[73]||(t[73]=s()),e("div",Gt,[t[61]||(t[61]=e("span",{class:"text-primary opacity-70"},"روش پرداخت:",-1)),t[62]||(t[62]=s()),e("span",Ht,i(n.value.method),1)]),t[74]||(t[74]=s()),e("div",Jt,[t[63]||(t[63]=e("span",{class:"text-primary opacity-70"},"تاریخ:",-1)),t[64]||(t[64]=s()),e("span",Kt,i(c(n.value.date)),1)]),t[75]||(t[75]=s()),n.value.startDate?(a(),l("div",Xt,[t[65]||(t[65]=e("span",{class:"text-primary opacity-70"},"تاریخ شروع:",-1)),t[66]||(t[66]=s()),e("span",Zt,i(c(n.value.startDate)),1)])):g("",!0),t[76]||(t[76]=s()),n.value.endDate?(a(),l("div",_t,[t[67]||(t[67]=e("span",{class:"text-primary opacity-70"},"تاریخ پایان:",-1)),t[68]||(t[68]=s()),e("span",te,i(c(n.value.endDate)),1)])):g("",!0),t[77]||(t[77]=s()),e("div",ee,[t[69]||(t[69]=e("span",{class:"text-primary opacity-70"},"وضعیت:",-1)),t[70]||(t[70]=s()),e("span",{class:h(["inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium",n.value.status==="موفق"?"bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400":"bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"])},[e("i",{class:h(["ti",n.value.status==="موفق"?"ti-circle-check":"ti-alert-triangle"])},null,2),s(" "+i(n.value.status),1)],2)])]),t[83]||(t[83]=s()),e("div",se,[e("button",{onClick:t[5]||(t[5]=r=>E(n.value)),class:"flex-1 px-4 py-2.5 accent-bg accent-text rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"},[...t[78]||(t[78]=[e("i",{class:"ti ti-download"},null,-1),s(`\r
              دانلود رسید\r
            `,-1)])]),t[79]||(t[79]=s()),e("button",{onClick:M,class:"px-4 py-2.5 border border-border rounded-lg text-primary hover:bg-primary transition-colors"},`\r
              بستن\r
            `)])])])):g("",!0)]),_:1})]))}},ae=_(re,[["__scopeId","data-v-7e71c2c5"]]);export{ae as T};
