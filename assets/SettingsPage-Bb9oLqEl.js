import{u as Z,a as ee,c as m}from"./assetManager-DsD9b--p.js";import{B as te,s as le,z as ie,o as r,c as d,m as N,v as ae,b as w,d as ne,av as se,aB as oe,aq as re,an as o,ar as a,aF as de,h as ue,a as i,G as c,n as ve,as as pe,F as D,p as U,l as V,aw as O,at as W,r as x,au as I,t as f}from"./index-Cf5U-FQo.js";import{s as P}from"./index-B0FwlP2u.js";import{b as R}from"./index-DHSJZZZ9.js";var ce=`
    .p-divider-horizontal {
        display: flex;
        width: 100%;
        position: relative;
        align-items: center;
        margin: dt('divider.horizontal.margin');
        padding: dt('divider.horizontal.padding');
    }

    .p-divider-horizontal:before {
        position: absolute;
        display: block;
        inset-block-start: 50%;
        inset-inline-start: 0;
        width: 100%;
        content: '';
        border-block-start: 1px solid dt('divider.border.color');
    }

    .p-divider-horizontal .p-divider-content {
        padding: dt('divider.horizontal.content.padding');
    }

    .p-divider-vertical {
        min-height: 100%;
        display: flex;
        position: relative;
        justify-content: center;
        margin: dt('divider.vertical.margin');
        padding: dt('divider.vertical.padding');
    }

    .p-divider-vertical:before {
        position: absolute;
        display: block;
        inset-block-start: 0;
        inset-inline-start: 50%;
        height: 100%;
        content: '';
        border-inline-start: 1px solid dt('divider.border.color');
    }

    .p-divider.p-divider-vertical .p-divider-content {
        padding: dt('divider.vertical.content.padding');
    }

    .p-divider-content {
        z-index: 1;
        background: dt('divider.content.background');
        color: dt('divider.content.color');
    }

    .p-divider-solid.p-divider-horizontal:before {
        border-block-start-style: solid;
    }

    .p-divider-solid.p-divider-vertical:before {
        border-inline-start-style: solid;
    }

    .p-divider-dashed.p-divider-horizontal:before {
        border-block-start-style: dashed;
    }

    .p-divider-dashed.p-divider-vertical:before {
        border-inline-start-style: dashed;
    }

    .p-divider-dotted.p-divider-horizontal:before {
        border-block-start-style: dotted;
    }

    .p-divider-dotted.p-divider-vertical:before {
        border-inline-start-style: dotted;
    }

    .p-divider-left:dir(rtl),
    .p-divider-right:dir(rtl) {
        flex-direction: row-reverse;
    }
`,fe={root:function(s){var l=s.props;return{justifyContent:l.layout==="horizontal"?l.align==="center"||l.align===null?"center":l.align==="left"?"flex-start":l.align==="right"?"flex-end":null:null,alignItems:l.layout==="vertical"?l.align==="center"||l.align===null?"center":l.align==="top"?"flex-start":l.align==="bottom"?"flex-end":null:null}}},me={root:function(s){var l=s.props;return["p-divider p-component","p-divider-"+l.layout,"p-divider-"+l.type,{"p-divider-left":l.layout==="horizontal"&&(!l.align||l.align==="left")},{"p-divider-center":l.layout==="horizontal"&&l.align==="center"},{"p-divider-right":l.layout==="horizontal"&&l.align==="right"},{"p-divider-top":l.layout==="vertical"&&l.align==="top"},{"p-divider-center":l.layout==="vertical"&&(!l.align||l.align==="center")},{"p-divider-bottom":l.layout==="vertical"&&l.align==="bottom"}]},content:"p-divider-content"},xe=te.extend({name:"divider",style:ce,classes:me,inlineStyles:fe}),ye={name:"BaseDivider",extends:le,props:{align:{type:String,default:null},layout:{type:String,default:"horizontal"},type:{type:String,default:"solid"}},style:xe,provide:function(){return{$pcDivider:this,$parentInstance:this}}};function k(n){"@babel/helpers - typeof";return k=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(s){return typeof s}:function(s){return s&&typeof Symbol=="function"&&s.constructor===Symbol&&s!==Symbol.prototype?"symbol":typeof s},k(n)}function A(n,s,l){return(s=be(s))in n?Object.defineProperty(n,s,{value:l,enumerable:!0,configurable:!0,writable:!0}):n[s]=l,n}function be(n){var s=ge(n,"string");return k(s)=="symbol"?s:s+""}function ge(n,s){if(k(n)!="object"||!n)return n;var l=n[Symbol.toPrimitive];if(l!==void 0){var y=l.call(n,s);if(k(y)!="object")return y;throw new TypeError("@@toPrimitive must return a primitive value.")}return(s==="string"?String:Number)(n)}var q={name:"Divider",extends:ye,inheritAttrs:!1,computed:{dataP:function(){return ie(A(A(A({},this.align,this.align),this.layout,this.layout),this.type,this.type))}}},he=["aria-orientation","data-p"],ke=["data-p"];function Ve(n,s,l,y,z,b){return r(),d("div",N({class:n.cx("root"),style:n.sx("root"),role:"separator","aria-orientation":n.layout,"data-p":b.dataP},n.ptmi("root")),[n.$slots.default?(r(),d("div",N({key:0,class:n.cx("content"),"data-p":b.dataP},n.ptm("content")),[ae(n.$slots,"default")],16,ke)):w("",!0)],16,he)}q.render=Ve;const we={class:"max-w-2xl mx-auto px-4 pt-6 pb-24"},ze={key:0,class:"flex flex-col gap-2"},Se={key:1,class:"text-center text-sm text-[var(--text-sub)] py-6 border border-dashed border-[var(--line-soft)] rounded-xl"},$e={key:2,class:"flex flex-col gap-2"},_e={class:"flex-1 min-w-0"},Ce={class:"text-sm font-bold text-[var(--text-main)] truncate"},De={class:"flex items-center gap-1.5 mt-0.5"},Ue={class:"text-[11px] text-[var(--text-sub)]"},Pe={key:0,class:"text-[11px] text-[var(--text-sub)]"},Ae={class:"flex gap-1"},je={key:0,class:"text-center text-sm text-[var(--text-sub)] py-6 border border-dashed border-[var(--line-soft)] rounded-xl"},Be={key:1,class:"flex flex-col gap-2"},Te={class:"flex-1 min-w-0"},Ee={class:"text-sm font-bold text-[var(--text-main)] truncate"},Le={class:"flex items-center gap-1.5 mt-0.5"},Fe={class:"text-[11px] text-[var(--text-sub)]"},Ne={key:0,class:"text-[11px] text-[var(--text-sub)]"},Oe={class:"flex gap-1"},We={class:"flex flex-col gap-3.5 py-2"},Ie={class:"flex flex-col gap-1"},Re={class:"flex flex-col gap-1"},qe={class:"flex flex-col gap-1"},Je={class:"flex flex-col gap-1"},Ye={class:"flex flex-col gap-1"},Ge={key:0,class:"flex flex-col gap-3.5 py-2"},Ke={class:"flex flex-col gap-1"},Me={class:"flex flex-col gap-1"},He={class:"flex flex-col gap-1"},Qe={class:"flex flex-col gap-1"},lt=ne({__name:"SettingsPage",setup(n){const{isDesktop:s}=Z(),l=se(),y=oe(),z=ee(),{isLoading:b,accounts:j,newAccount:J}=re(z),{addAccount:Y,updateAccount:G,deleteAccount:K,accountDisplayName:S}=z,B=W(()=>j.value.filter(p=>p.type==="asset")),T=W(()=>j.value.filter(p=>p.type==="liability")),M=[{label:"資產",value:"asset"},{label:"負債",value:"liability"}],E=[{label:"TWD",value:"TWD"},{label:"USD",value:"USD"},{label:"JPY",value:"JPY"},{label:"EUR",value:"EUR"}],g=x(!1),u=x({name:"",type:"asset",currency:"TWD",category:"",alias:""}),$=x(!1);function H(){u.value={name:"",type:"asset",currency:"TWD",category:"",alias:""},g.value=!0}async function Q(){if(!u.value.name.trim()){l.add({severity:"warn",summary:"請填寫帳戶名稱",life:2e3});return}$.value=!0;try{Object.assign(J.value,u.value),await Y(),l.add({severity:"success",summary:"帳戶新增成功",life:2e3}),g.value=!1}catch{l.add({severity:"error",summary:"新增失敗",life:3e3})}finally{$.value=!1}}const h=x(!1),v=x({}),_=x(!1);function L(p){v.value={...p},h.value=!0}async function X(){var p;if(!((p=v.value.name)!=null&&p.trim())){l.add({severity:"warn",summary:"請填寫帳戶名稱",life:2e3});return}_.value=!0;try{await G(v.value),l.add({severity:"success",summary:"更新成功",life:2e3}),h.value=!1}catch{l.add({severity:"error",summary:"更新失敗",life:3e3})}finally{_.value=!1}}function F(p){y.require({message:`確定要刪除「${S(p)}」？`,header:"刪除帳戶",icon:"pi pi-exclamation-triangle",acceptLabel:"確定刪除",rejectLabel:"取消",acceptClass:"p-button-danger",accept:async()=>{try{await K(p.id),l.add({severity:"success",summary:"已刪除",life:2e3})}catch{l.add({severity:"error",summary:"刪除失敗",life:3e3})}}})}return(p,e)=>(r(),d("div",we,[o(a(de)),(r(),ue(pe,{defer:"",to:"#app-header-slot",disabled:!a(s)},[i("div",{class:ve(a(s)?"flex items-center justify-between w-full":"flex items-center justify-between mb-6")},[e[13]||(e[13]=i("h1",{class:"text-2xl font-extrabold text-[var(--text-main)] m-0"},"設定",-1)),o(a(c),{label:"新增帳戶",icon:"pi pi-plus",size:"small",onClick:H})],2)],8,["disabled"])),i("section",null,[e[14]||(e[14]=i("div",{class:"text-xs font-bold text-[var(--text-sub)] uppercase tracking-wider mb-2"},"資產帳戶",-1)),a(b)?(r(),d("div",ze,[(r(),d(D,null,U(3,t=>i("div",{key:t,class:"h-16 rounded-xl bg-[var(--line-soft)] animate-pulse"})),64))])):B.value.length?(r(),d("div",$e,[(r(!0),d(D,null,U(B.value,t=>(r(),d("div",{key:t.id,class:"flex items-center gap-3 bg-[var(--surface)] border border-[var(--line-soft)] rounded-xl px-3.5 py-3 shadow-sm"},[i("div",{class:"w-9 h-9 rounded-[10px] flex items-center justify-center text-white font-extrabold text-sm shrink-0",style:I({background:t.color??"#0f766e"})},f(t.name.charAt(0)),5),i("div",_e,[i("div",Ce,f(a(S)(t)),1),i("div",De,[o(a(R),{value:"資產",severity:"success",class:"text-[10px] py-0 px-1.5"}),i("span",Ue,f(t.currency),1),t.category?(r(),d("span",Pe,"· "+f(t.category),1)):w("",!0)])]),i("div",Ae,[o(a(c),{icon:"pi pi-pencil",rounded:"",text:"",severity:"secondary",size:"small",onClick:C=>L(t)},null,8,["onClick"]),o(a(c),{icon:"pi pi-trash",rounded:"",text:"",severity:"danger",size:"small",onClick:C=>F(t)},null,8,["onClick"])])]))),128))])):(r(),d("div",Se," 尚無資產帳戶，點擊「新增帳戶」開始 "))]),o(a(q)),i("section",null,[e[15]||(e[15]=i("div",{class:"text-xs font-bold text-[var(--text-sub)] uppercase tracking-wider mb-2"},"負債帳戶",-1)),!a(b)&&!T.value.length?(r(),d("div",je," 尚無負債帳戶 ")):(r(),d("div",Be,[(r(!0),d(D,null,U(T.value,t=>(r(),d("div",{key:t.id,class:"flex items-center gap-3 bg-[var(--surface)] border border-[var(--line-soft)] rounded-xl px-3.5 py-3 shadow-sm"},[i("div",{class:"w-9 h-9 rounded-[10px] flex items-center justify-center text-white font-extrabold text-sm shrink-0",style:I({background:t.color??"#dc2626"})},f(t.name.charAt(0)),5),i("div",Te,[i("div",Ee,f(a(S)(t)),1),i("div",Le,[o(a(R),{value:"負債",severity:"warn",class:"text-[10px] py-0 px-1.5"}),i("span",Fe,f(t.currency),1),t.category?(r(),d("span",Ne,"· "+f(t.category),1)):w("",!0)])]),i("div",Oe,[o(a(c),{icon:"pi pi-pencil",rounded:"",text:"",severity:"secondary",size:"small",onClick:C=>L(t)},null,8,["onClick"]),o(a(c),{icon:"pi pi-trash",rounded:"",text:"",severity:"danger",size:"small",onClick:C=>F(t)},null,8,["onClick"])])]))),128))]))]),o(a(O),{visible:g.value,"onUpdate:visible":e[6]||(e[6]=t=>g.value=t),header:"新增帳戶",modal:"",draggable:!1,style:{width:"min(400px,92vw)"}},{footer:V(()=>[o(a(c),{label:"取消",text:"",severity:"secondary",onClick:e[5]||(e[5]=t=>g.value=!1)}),o(a(c),{label:"新增",loading:$.value,onClick:Q},null,8,["loading"])]),default:V(()=>[i("div",We,[i("div",Ie,[e[16]||(e[16]=i("label",{class:"text-xs font-semibold text-[var(--text-sub)]"},"帳戶名稱 *",-1)),o(a(m),{modelValue:u.value.name,"onUpdate:modelValue":e[0]||(e[0]=t=>u.value.name=t),placeholder:"例：國泰主帳",fluid:""},null,8,["modelValue"])]),i("div",Re,[e[17]||(e[17]=i("label",{class:"text-xs font-semibold text-[var(--text-sub)]"},"別名",-1)),o(a(m),{modelValue:u.value.alias,"onUpdate:modelValue":e[1]||(e[1]=t=>u.value.alias=t),placeholder:"選填",fluid:""},null,8,["modelValue"])]),i("div",qe,[e[18]||(e[18]=i("label",{class:"text-xs font-semibold text-[var(--text-sub)]"},"類型",-1)),o(a(P),{modelValue:u.value.type,"onUpdate:modelValue":e[2]||(e[2]=t=>u.value.type=t),options:M,optionLabel:"label",optionValue:"value",fluid:""},null,8,["modelValue"])]),i("div",Je,[e[19]||(e[19]=i("label",{class:"text-xs font-semibold text-[var(--text-sub)]"},"幣別",-1)),o(a(P),{modelValue:u.value.currency,"onUpdate:modelValue":e[3]||(e[3]=t=>u.value.currency=t),options:E,optionLabel:"label",optionValue:"value",fluid:""},null,8,["modelValue"])]),i("div",Ye,[e[20]||(e[20]=i("label",{class:"text-xs font-semibold text-[var(--text-sub)]"},"分類",-1)),o(a(m),{modelValue:u.value.category,"onUpdate:modelValue":e[4]||(e[4]=t=>u.value.category=t),placeholder:"例：生活費、投資",fluid:""},null,8,["modelValue"])])])]),_:1},8,["visible"]),o(a(O),{visible:h.value,"onUpdate:visible":e[12]||(e[12]=t=>h.value=t),header:"編輯帳戶",modal:"",draggable:!1,style:{width:"min(400px,92vw)"}},{footer:V(()=>[o(a(c),{label:"取消",text:"",severity:"secondary",onClick:e[11]||(e[11]=t=>h.value=!1)}),o(a(c),{label:"儲存",loading:_.value,onClick:X},null,8,["loading"])]),default:V(()=>[v.value.id?(r(),d("div",Ge,[i("div",Ke,[e[21]||(e[21]=i("label",{class:"text-xs font-semibold text-[var(--text-sub)]"},"帳戶名稱 *",-1)),o(a(m),{modelValue:v.value.name,"onUpdate:modelValue":e[7]||(e[7]=t=>v.value.name=t),fluid:""},null,8,["modelValue"])]),i("div",Me,[e[22]||(e[22]=i("label",{class:"text-xs font-semibold text-[var(--text-sub)]"},"別名",-1)),o(a(m),{modelValue:v.value.alias,"onUpdate:modelValue":e[8]||(e[8]=t=>v.value.alias=t),fluid:""},null,8,["modelValue"])]),i("div",He,[e[23]||(e[23]=i("label",{class:"text-xs font-semibold text-[var(--text-sub)]"},"幣別",-1)),o(a(P),{modelValue:v.value.currency,"onUpdate:modelValue":e[9]||(e[9]=t=>v.value.currency=t),options:E,optionLabel:"label",optionValue:"value",fluid:""},null,8,["modelValue"])]),i("div",Qe,[e[24]||(e[24]=i("label",{class:"text-xs font-semibold text-[var(--text-sub)]"},"分類",-1)),o(a(m),{modelValue:v.value.category,"onUpdate:modelValue":e[10]||(e[10]=t=>v.value.category=t),fluid:""},null,8,["modelValue"])])])):w("",!0)]),_:1},8,["visible"])]))}});export{lt as default};
