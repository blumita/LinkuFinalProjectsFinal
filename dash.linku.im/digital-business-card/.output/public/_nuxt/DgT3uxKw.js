import{a as V,j as Y}from"#entry";import{_ as B}from"./CgleJCdt.js";import{y as F,r as z,d as v,j as E,H as O,I as U,x as l,q as n,p as r,k as d,l as g,u as f,M as b,Q as k,R as $}from"./Ct89Yiyn.js";import"./CU4qPF7-.js";import"./ngrFHoWO.js";const H={class:"min-h-screen bg-background"},q={class:"fixed top-0 left-0 right-0 w-full bg-background/95 backdrop-blur-lg border-b border-border z-50",style:{position:"fixed !important",top:"0px !important",left:"0px !important",right:"0px !important","z-index":"50 !important",width:"100% !important"}},G={class:"flex items-center justify-between px-4 py-3",style:{"pointer-events":"auto !important"}},Q={class:"pt-[60px] px-4 py-3"},W={key:0,class:"mb-6"},J={class:"bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-2xl text-white"},K={class:"grid grid-cols-2 gap-4"},X={class:"text-xl font-bold"},Z={class:"text-xl font-bold"},tt={key:1,class:"mb-6"},et={class:"flex items-center gap-3 overflow-x-auto pb-2"},nt={key:2,class:"space-y-4"},st={class:"space-y-3"},ot={key:3,class:"space-y-4"},rt={class:"text-sm font-medium text-muted-foreground px-2"},it={class:"space-y-3"},at={class:"flex items-center justify-between mb-3"},lt={class:"flex items-center gap-3 flex-1"},dt={class:"flex-1"},ut={class:"text-sm text-muted-foreground"},pt={class:"text-left"},ft={class:"font-bold text-lg text-foreground"},ct={class:"flex items-center justify-between pt-3 border-t border-border/20"},mt={class:"flex items-center gap-4 text-xs text-muted-foreground"},gt={key:0},xt={key:1},vt={class:"flex items-center gap-3"},bt=["onClick"],yt={key:4,class:"text-center py-12"},Tt=F({__name:"index",setup(wt){const{$axios:C}=V(),c=z(!0),p=z([]),u=z("all"),M=v(()=>{const e=new Date,t=e.getMonth(),s=e.getFullYear();return u.value==="all"?p.value:p.value.filter(o=>{const i=o.createdAt||o.created_at||o.date;if(!i)return!1;const a=new Date(i);if(isNaN(a.getTime()))return!1;const m=a.getMonth(),w=a.getFullYear();if(u.value==="thisMonth")return m===t&&w===s;if(u.value==="lastMonth"){const h=t===0?11:t-1,P=t===0?s-1:s;return m===h&&w===P}else if(u.value==="lastThreeMonths"){const h=new Date(e);return h.setMonth(t-3),a>=h}return!0})}),N=v(()=>{const e={};return M.value.forEach(t=>{const s=j(t.createdAt||t.created_at||t.date);e[s]||(e[s]=[]),e[s].push(t)}),e}),S=v(()=>{const e=new Date,t=e.getMonth(),s=e.getFullYear();return p.value.filter(o=>{if(!x(o.status))return!1;const i=o.createdAt||o.created_at||o.date;if(!i)return!1;const a=new Date(i);return isNaN(a.getTime())?!1:a.getMonth()===t&&a.getFullYear()===s}).reduce((o,i)=>o+(i.amount||0),0)}),_=e=>{const t=e.planTitle||e.plan||"",s=e.startDate?"تمدید":"خرید";let o=t.trim();if(o.match(/(\d+)\s*(ماه|ماهه)/)){const i=o.match(/(\d+)\s*(ماه|ماهه)/);if(i){const a=i[1];return a==="۱"||a==="1"?`${s} اشتراک ماهانه`:`${s} اشتراک ${a} ماهه`}}if(o.includes("ماهه"))return o.includes("۱")||o.includes("1")||o==="ماهه"?`${s} اشتراک ماهانه`:`${s} اشتراک ${o}`;if(e.planDuration){const i=e.planDuration;return i.includes("۱")||i.includes("1")||i.includes("یک")?`${s} اشتراک ماهانه`:`${s} اشتراک ${i}`}return t?`${s} اشتراک ${t}`:`${s} اشتراک ماهانه`},T=e=>{if(!e)return"-";const t=e.toString().toLowerCase(),s={zarinpal:"زرین‌پال","zarrin pal":"زرین‌پال",zarrinpal:"زرین‌پال",idpay:"آیدی‌پی",mellat:"بانک ملت",parsian:"بانک پاسارگاد",saman:"بانک سامان",melli:"بانک ملی",saderat:"بانک صادرات",card:"کارت بانکی",wallet:"کیف پول",bank:"انتقال بانکی"};for(const[o,i]of Object.entries(s))if(t.includes(o))return i;return e.toString()},y=e=>!e&&e!==0?"0":e.toLocaleString("fa-IR"),j=e=>{try{if(!e)return"—";const t=s=>{const o=["۰","۱","۲","۳","۴","۵","۶","۷","۸","۹"];return s.replace(/\d/g,i=>o[parseInt(i)])};if(typeof e=="string"){const s=e.trim();if(s.includes("/")&&/^\d{4}\/\d{1,2}\/\d{1,2}$/.test(s))return t(s);if(s.includes("-")||s.includes("T")){const i=new Date(s);if(!isNaN(i.getTime()))return t(i.toLocaleDateString("fa-IR"))}const o=new Date(s);if(!isNaN(o.getTime()))return t(o.toLocaleDateString("fa-IR"))}return e instanceof Date&&!isNaN(e.getTime())?t(e.toLocaleDateString("fa-IR")):"—"}catch{return"—"}},x=e=>{if(!e)return!1;const t=e?.toString().toLowerCase();return["موفق","successful","success","completed","paid","تکمیل شده","پرداخت شده","confirmed","تایید شده","done","انجام شده","verified","تایید شده","ok","200","true","1"].some(o=>t?.includes(o))},D=v(()=>p.value.filter(e=>x(e.status)).reduce((e,t)=>e+(t.amount||0),0)),I=v(()=>p.value.filter(e=>x(e.status)).length);v(()=>{const e=I.value;return e===0?0:Math.round(D.value/e)});const R=async()=>{c.value=!0;try{const t=await C.get("transactions/list");t.data?.data?p.value=t.data.data:Array.isArray(t.data)&&(p.value=t.data)}catch{}finally{c.value=!1}},A=async e=>{try{const t=x(e.status),s=document.createElement("iframe");s.style.position="fixed",s.style.top="-9999px",s.style.width="500px",s.style.height="450px",s.style.visibility="hidden",document.body.appendChild(s);const o=s.contentWindow.document;o.open(),o.write(L(e,t)),o.close(),s.onload=async()=>{setTimeout(async()=>{try{const i=(await Y(async()=>{const{default:w}=await import("./B0tyYwQk.js");return{default:w}},[],import.meta.url)).default,a=await i(s.contentDocument.body,{backgroundColor:"#ffffff",useCORS:!0,allowTaint:!0,scale:2,logging:!1}),m=document.createElement("a");m.download=`receipt_${e.referenceId||e.ref||e.id}.png`,m.href=a.toDataURL("image/png"),m.click(),document.body.removeChild(s)}catch{document.body.removeChild(s)}},500)}}catch{alert("خطا در دانلود رسید. لطفاً دوباره تلاش کنید.")}},L=(e,t)=>{const s=window.location.origin+"/logo/logo.png",o=i=>i.replace(/اشتراک\s*ماهانه|ماهانه/gi,"یکماهه");return`
    <html dir="rtl">
      <head>
        <meta charset="UTF-8">
        <link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazir-Matn-font-face.css" rel="stylesheet" type="text/css" />
        <style>
          @font-face {
            font-family: 'IRANSans';
            src: url('https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/fonts/webfonts/Vazirmatn-Regular.woff2') format('woff2');
            font-weight: normal;
            font-style: normal;
          }
          @font-face {
            font-family: 'IRANSans';
            src: url('https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/fonts/webfonts/Vazirmatn-Bold.woff2') format('woff2');
            font-weight: bold;
            font-style: normal;
          }
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            margin: 0;
            padding: 0;
            background: transparent;
            font-family: 'IRANSans', 'Vazirmatn', Tahoma, Arial, sans-serif;
            direction: rtl;
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
            height: 28px;
            width: auto;
          }
          .icon {
            width: 48px;
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }
          .icon svg {
            width: 48px;
            height: 48px;
          }
          .stamp {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-15deg);
            font-size: 28px;
            font-weight: bold;
            color: ${t?"#22c55e":"#ef4444"};
            opacity: 0.1;
            z-index: 0;
            white-space: nowrap;
          }
          h2 {
            text-align: center;
            font-size: 18px;
            margin: 0;
            font-weight: bold;
            color: #1e293b;
            z-index: 1;
            position: relative;
          }
          .amount {
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            color: #1e293b;
            margin: 16px 0;
            z-index: 1;
            position: relative;
            direction: ltr;
            display: flex;
            width: 100%;
            align-items: baseline;
            justify-content: center;
            gap: 6px;
          }
          .currency {
            font-size: 16px;
            margin-left: 0;
            color: #6b7280;
          }
          .price {
            font-size: 28px;
            font-weight: 800;
            color: #1e293b;
            direction: ltr;
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
            align-items: center;
          }
          .row span:first-child {
            font-weight: 500;
          }
          .row span:last-child {
            font-weight: 600;
            text-align: right;
            direction: rtl;
          }
          .total-row {
            border-top: 1px solid #ddd !important;
            padding-top: 12px !important;
            margin-top: 12px !important;
            background: #f8fafc !important;
            padding: 12px !important;
            margin: 12px -12px 0 -12px !important;
            border-radius: 8px !important;
            font-size: 16px !important;
            font-weight: bold !important;
            color: #1e293b !important;
          }
          .total-amount {
            direction: ltr !important;
            text-align: right !important;
            display: inline-flex;
            align-items: baseline;
            gap: 6px;
          }
          .total-amount .currency {
            margin-left: 4px;
            font-size: 14px;
          }
          .total-amount .price {
            font-size: 16px;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="stamp">${t?"پرداخت شده":"پرداخت ناموفق"}</div>

          <div class="header">
            <img src="${s}" alt="لینکو" class="logo" crossorigin="anonymous" />
            <div class="icon">
              ${t?'<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#22c55e"/><path d="M8 12.5l2.5 2.5L16 9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>':'<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#ef4444"/><path d="M9 9l6 6M15 9l-6 6" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>'}
            </div>
          </div>

          <h2>${t?"پرداخت با موفقیت انجام شد":"پرداخت انجام نشد"}</h2>
          <div class="amount">
            <span class="currency">تومان</span>
            <span class="price">${y(e.amount)}</span>
          </div>

          <div class="table">
            <div class="row">
              <span>نوع اشتراک:</span>
              <span>${o(e.planTitle||e.plan||e.title||e.description||"اشتراک")}</span>
            </div>
            <div class="row">
              <span>کد تراکنش:</span>
              <span>${e.referenceId||e.ref||e.tracking_code||e.id||"نامشخص"}</span>
            </div>
            <div class="row">
              <span>روش پرداخت:</span>
              <span>${T(e.paymentMethod||e.method||e.gateway)}</span>
            </div>
            <div class="row">
              <span>تاریخ:</span>
              <span>${j(e.createdAt||e.created_at||e.date)}</span>
            </div>
            ${e.time?`<div class="row">
              <span>ساعت:</span>
              <span>${e.time}</span>
            </div>`:""}
            <div class="row total-row">
              <span>مبلغ کل:</span>
              <span class="total-amount">
                <span class="currency">تومان</span>
                <span class="price">${y(e.amount)}</span>
              </span>
            </div>
          </div>
        </div>
      </body>
    </html>
  `};return E(()=>{R()}),(e,t)=>{const s=B;return l(),O(s,null,{default:U(()=>[n("div",H,[n("div",q,[n("div",G,[n("button",{onClick:t[0]||(t[0]=o=>e.$router.back()),class:"w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors",style:{"pointer-events":"auto !important",position:"relative !important"}},[...t[5]||(t[5]=[n("i",{class:"ti ti-arrow-right text-foreground text-lg"},null,-1)])]),t[6]||(t[6]=r()),t[7]||(t[7]=n("h1",{class:"text-lg font-semibold text-foreground",style:{"pointer-events":"auto !important"}},`\r
            تاریخچه پرداخت‌ها\r
          `,-1)),t[8]||(t[8]=r()),t[9]||(t[9]=n("div",{class:"w-10 h-10 flex items-center justify-center",style:{"pointer-events":"auto !important"}},null,-1))])]),t[38]||(t[38]=r()),n("div",Q,[!c.value&&p.value.length>0?(l(),d("div",W,[n("div",J,[t[15]||(t[15]=n("div",{class:"flex items-center justify-between mb-4"},[n("h3",{class:"text-lg font-bold"},"خلاصه پرداخت‌ها"),r(),n("i",{class:"ti ti-chart-line text-2xl"})],-1)),t[16]||(t[16]=r()),n("div",K,[n("div",null,[t[10]||(t[10]=n("p",{class:"text-sm opacity-80 mb-1"},"کل پرداخت‌ها",-1)),t[11]||(t[11]=r()),n("p",X,f(y(D.value))+" تومان",1)]),t[14]||(t[14]=r()),n("div",null,[t[12]||(t[12]=n("p",{class:"text-sm opacity-80 mb-1"},"این ماه",-1)),t[13]||(t[13]=r()),n("p",Z,f(y(S.value))+" تومان",1)])])])])):g("",!0),t[34]||(t[34]=r()),!c.value&&p.value.length>0?(l(),d("div",tt,[n("div",et,[n("button",{onClick:t[1]||(t[1]=o=>u.value="all"),class:b([u.value==="all"?"bg-primary text-white":"bg-muted text-muted-foreground hover:bg-muted/80","flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all"])},`\r
              همه\r
            `,2),t[17]||(t[17]=r()),n("button",{onClick:t[2]||(t[2]=o=>u.value="thisMonth"),class:b([u.value==="thisMonth"?"bg-primary text-white":"bg-muted text-muted-foreground hover:bg-muted/80","flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all"])},`\r
              این ماه\r
            `,2),t[18]||(t[18]=r()),n("button",{onClick:t[3]||(t[3]=o=>u.value="lastMonth"),class:b([u.value==="lastMonth"?"bg-primary text-white":"bg-muted text-muted-foreground hover:bg-muted/80","flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all"])},`\r
              ماه گذشته\r
            `,2),t[19]||(t[19]=r()),n("button",{onClick:t[4]||(t[4]=o=>u.value="lastThreeMonths"),class:b([u.value==="lastThreeMonths"?"bg-primary text-white":"bg-muted text-muted-foreground hover:bg-muted/80","flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all"])},`\r
              سه ماه اخیر\r
            `,2)])])):g("",!0),t[35]||(t[35]=r()),c.value?(l(),d("div",nt,[(l(),d(k,null,$(3,o=>n("div",{key:o,class:"space-y-3"},[t[21]||(t[21]=n("div",{class:"h-5 bg-muted rounded w-24 px-2 animate-pulse"},null,-1)),t[22]||(t[22]=r()),n("div",st,[(l(),d(k,null,$(2,i=>n("div",{key:i,class:"bg-card border border-border/20 p-4 rounded-xl animate-pulse"},[...t[20]||(t[20]=[n("div",{class:"flex items-center justify-between mb-3"},[n("div",{class:"flex items-center gap-3 flex-1"},[n("div",{class:"w-12 h-12 bg-muted rounded-xl"}),r(),n("div",{class:"flex-1 space-y-2"},[n("div",{class:"h-4 bg-muted rounded w-36"}),r(),n("div",{class:"h-3 bg-muted rounded w-28"})])]),r(),n("div",{class:"text-left"},[n("div",{class:"h-6 bg-muted rounded w-24"})])],-1),r(),n("div",{class:"flex items-center justify-between pt-3 border-t border-border/20"},[n("div",{class:"flex items-center gap-4"},[n("div",{class:"h-3 bg-muted rounded w-16"}),r(),n("div",{class:"h-3 bg-muted rounded w-20"}),r(),n("div",{class:"h-3 bg-muted rounded w-24"})]),r(),n("div",{class:"h-3 bg-muted rounded w-20"})],-1)])])),64))])])),64))])):g("",!0),t[36]||(t[36]=r()),!c.value&&M.value.length>0?(l(),d("div",ot,[(l(!0),d(k,null,$(N.value,(o,i)=>(l(),d("div",{key:i,class:"space-y-3"},[n("h4",rt,f(i),1),t[32]||(t[32]=r()),n("div",it,[(l(!0),d(k,null,$(o,a=>(l(),d("div",{key:a.id,class:"bg-card border border-border/20 p-4 rounded-xl hover:bg-card/80 transition-colors"},[n("div",at,[n("div",lt,[n("div",{class:b(["w-12 h-12 rounded-xl flex items-center justify-center",x(a.status)?"bg-green-500/10":"bg-red-500/10"])},[n("i",{class:b(["text-xl",x(a.status)?"ti ti-check text-green-500":"ti ti-x text-red-500"])},null,2)],2),t[25]||(t[25]=r()),n("div",dt,[t[23]||(t[23]=n("h5",{class:"font-medium text-foreground mb-1"},"پرداخت اشتراک پریمیوم",-1)),t[24]||(t[24]=r()),n("p",ut,f(_(a)),1)])]),t[26]||(t[26]=r()),n("div",pt,[n("p",ft,f(y(a.amount))+" تومان",1)])]),t[31]||(t[31]=r()),n("div",ct,[n("div",mt,[a.time?(l(),d("span",gt,f(a.time),1)):g("",!0),t[27]||(t[27]=r()),n("span",null,f(T(a.paymentMethod||a.method||a.gateway)),1),t[28]||(t[28]=r()),a.referenceId||a.ref||a.tracking_code?(l(),d("span",xt,"شناسه: "+f(a.referenceId||a.ref||a.tracking_code),1)):g("",!0)]),t[30]||(t[30]=r()),n("div",vt,[n("button",{onClick:m=>A(a),class:"flex items-center gap-1 text-muted-foreground text-sm font-medium hover:text-foreground transition-colors",title:"دانلود رسید"},[...t[29]||(t[29]=[n("i",{class:"ti ti-download text-base"},null,-1),r(),n("span",null,"دانلود رسید",-1)])],8,bt)])])]))),128))])]))),128))])):g("",!0),t[37]||(t[37]=r()),!c.value&&M.value.length===0?(l(),d("div",yt,[...t[33]||(t[33]=[n("div",{class:"w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4"},[n("i",{class:"ti ti-wallet text-primary text-2xl opacity-50"})],-1),r(),n("h3",{class:"text-foreground font-medium mb-2"},"هیچ تراکنشی یافت نشد",-1),r(),n("p",{class:"text-muted-foreground text-sm"},"تاکنون تراکنش مالی ثبت نشده است",-1)])])):g("",!0)])])]),_:1})}}});export{Tt as default};
