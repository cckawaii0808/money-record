import{k as ot,b6 as Je,j as xe,v as ht,d as fe,x as l,K as R,M as S,J as Z,ac as bt,y as Oe,V as le,b7 as Zt,Y as Ve,m as $,$ as ne,b8 as Fe,q as it,b9 as rt,U as Be,aE as gt,L as H,aa as Ae,aC as pt,R as st,aq as Yt,as as Jt,ab as Xt,X as lt,H as U,ba as Qt,r as T,a2 as $e,bb as en,a3 as mt,ah as tn,bc as Ee,G as tt,bd as nn,be as on,aK as Xe,bf as dt,F as rn,a5 as ln,ad as an,bg as sn,bh as dn,bi as un,bj as cn,af as nt,aV as fn,aP as vn,bk as ut,C as Ke,z as at,bl as hn,bm as bn,bn as gn,bo as pn,bp as mn,I as q,a4 as wn,E as xn,aR as yn,ai as Cn}from"./index-GuCt2bA7.js";import{u as wt,V as Rn,d as Sn,e as Fn}from"./DatePicker-CVEbtD-t.js";import{g as On}from"./get-slot-Bk_rJcZu.js";function xt(e,n){n&&(ot(()=>{const{value:o}=e;o&&Je.registerHandler(o,n)}),xe(e,(o,a)=>{a&&Je.unregisterHandler(a)},{deep:!1}),ht(()=>{const{value:o}=e;o&&Je.unregisterHandler(o)}))}function ct(e){switch(typeof e){case"string":return e||void 0;case"number":return String(e);default:return}}function Qe(e){const n=e.filter(o=>o!==void 0);if(n.length!==0)return n.length===1?n[0]:o=>{e.forEach(a=>{a&&a(o)})}}const zn=fe({name:"Checkmark",render(){return l("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 16 16"},l("g",{fill:"none"},l("path",{d:"M14.046 3.486a.75.75 0 0 1-.032 1.06l-7.93 7.474a.85.85 0 0 1-1.188-.022l-2.68-2.72a.75.75 0 1 1 1.068-1.053l2.234 2.267l7.468-7.038a.75.75 0 0 1 1.06.032z",fill:"currentColor"})))}}),Tn=fe({name:"Empty",render(){return l("svg",{viewBox:"0 0 28 28",fill:"none",xmlns:"http://www.w3.org/2000/svg"},l("path",{d:"M26 7.5C26 11.0899 23.0899 14 19.5 14C15.9101 14 13 11.0899 13 7.5C13 3.91015 15.9101 1 19.5 1C23.0899 1 26 3.91015 26 7.5ZM16.8536 4.14645C16.6583 3.95118 16.3417 3.95118 16.1464 4.14645C15.9512 4.34171 15.9512 4.65829 16.1464 4.85355L18.7929 7.5L16.1464 10.1464C15.9512 10.3417 15.9512 10.6583 16.1464 10.8536C16.3417 11.0488 16.6583 11.0488 16.8536 10.8536L19.5 8.20711L22.1464 10.8536C22.3417 11.0488 22.6583 11.0488 22.8536 10.8536C23.0488 10.6583 23.0488 10.3417 22.8536 10.1464L20.2071 7.5L22.8536 4.85355C23.0488 4.65829 23.0488 4.34171 22.8536 4.14645C22.6583 3.95118 22.3417 3.95118 22.1464 4.14645L19.5 6.79289L16.8536 4.14645Z",fill:"currentColor"}),l("path",{d:"M25 22.75V12.5991C24.5572 13.0765 24.053 13.4961 23.5 13.8454V16H17.5L17.3982 16.0068C17.0322 16.0565 16.75 16.3703 16.75 16.75C16.75 18.2688 15.5188 19.5 14 19.5C12.4812 19.5 11.25 18.2688 11.25 16.75L11.2432 16.6482C11.1935 16.2822 10.8797 16 10.5 16H4.5V7.25C4.5 6.2835 5.2835 5.5 6.25 5.5H12.2696C12.4146 4.97463 12.6153 4.47237 12.865 4H6.25C4.45507 4 3 5.45507 3 7.25V22.75C3 24.5449 4.45507 26 6.25 26H21.75C23.5449 26 25 24.5449 25 22.75ZM4.5 22.75V17.5H9.81597L9.85751 17.7041C10.2905 19.5919 11.9808 21 14 21L14.215 20.9947C16.2095 20.8953 17.842 19.4209 18.184 17.5H23.5V22.75C23.5 23.7165 22.7165 24.5 21.75 24.5H6.25C5.2835 24.5 4.5 23.7165 4.5 22.75Z",fill:"currentColor"}))}}),kn=R("empty",`
 display: flex;
 flex-direction: column;
 align-items: center;
 font-size: var(--n-font-size);
`,[S("icon",`
 width: var(--n-icon-size);
 height: var(--n-icon-size);
 font-size: var(--n-icon-size);
 line-height: var(--n-icon-size);
 color: var(--n-icon-color);
 transition:
 color .3s var(--n-bezier);
 `,[Z("+",[S("description",`
 margin-top: 8px;
 `)])]),S("description",`
 transition: color .3s var(--n-bezier);
 color: var(--n-text-color);
 `),S("extra",`
 text-align: center;
 transition: color .3s var(--n-bezier);
 margin-top: 12px;
 color: var(--n-extra-text-color);
 `)]),Pn=Object.assign(Object.assign({},le.props),{description:String,showDescription:{type:Boolean,default:!0},showIcon:{type:Boolean,default:!0},size:{type:String,default:"medium"},renderIcon:Function}),Mn=fe({name:"Empty",props:Pn,slots:Object,setup(e){const{mergedClsPrefixRef:n,inlineThemeDisabled:o,mergedComponentPropsRef:a}=Oe(e),u=le("Empty","-empty",kn,Zt,e,n),{localeRef:h}=wt("Empty"),c=$(()=>{var b,y,p;return(b=e.description)!==null&&b!==void 0?b:(p=(y=a==null?void 0:a.value)===null||y===void 0?void 0:y.Empty)===null||p===void 0?void 0:p.description}),r=$(()=>{var b,y;return((y=(b=a==null?void 0:a.value)===null||b===void 0?void 0:b.Empty)===null||y===void 0?void 0:y.renderIcon)||(()=>l(Tn,null))}),C=$(()=>{const{size:b}=e,{common:{cubicBezierEaseInOut:y},self:{[ne("iconSize",b)]:p,[ne("fontSize",b)]:x,textColor:m,iconColor:E,extraTextColor:V}}=u.value;return{"--n-icon-size":p,"--n-font-size":x,"--n-bezier":y,"--n-text-color":m,"--n-icon-color":E,"--n-extra-text-color":V}}),F=o?Ve("empty",$(()=>{let b="";const{size:y}=e;return b+=y[0],b}),C,e):void 0;return{mergedClsPrefix:n,mergedRenderIcon:r,localizedDescription:$(()=>c.value||h.value.description),cssVars:o?void 0:C,themeClass:F==null?void 0:F.themeClass,onRender:F==null?void 0:F.onRender}},render(){const{$slots:e,mergedClsPrefix:n,onRender:o}=this;return o==null||o(),l("div",{class:[`${n}-empty`,this.themeClass],style:this.cssVars},this.showIcon?l("div",{class:`${n}-empty__icon`},e.icon?e.icon():l(bt,{clsPrefix:n},{default:this.mergedRenderIcon})):null,this.showDescription?l("div",{class:`${n}-empty__description`},e.default?e.default():this.localizedDescription):null,e.extra?l("div",{class:`${n}-empty__extra`},e.extra()):null)}}),ft=fe({name:"NBaseSelectGroupHeader",props:{clsPrefix:{type:String,required:!0},tmNode:{type:Object,required:!0}},setup(){const{renderLabelRef:e,renderOptionRef:n,labelFieldRef:o,nodePropsRef:a}=it(rt);return{labelField:o,nodeProps:a,renderLabel:e,renderOption:n}},render(){const{clsPrefix:e,renderLabel:n,renderOption:o,nodeProps:a,tmNode:{rawNode:u}}=this,h=a==null?void 0:a(u),c=n?n(u,!1):Fe(u[this.labelField],u,!1),r=l("div",Object.assign({},h,{class:[`${e}-base-select-group-header`,h==null?void 0:h.class]}),c);return u.render?u.render({node:r,option:u}):o?o({node:r,option:u,selected:!1}):r}});function _n(e,n){return l(gt,{name:"fade-in-scale-up-transition"},{default:()=>e?l(bt,{clsPrefix:n,class:`${n}-base-select-option__check`},{default:()=>l(zn)}):null})}const vt=fe({name:"NBaseSelectOption",props:{clsPrefix:{type:String,required:!0},tmNode:{type:Object,required:!0}},setup(e){const{valueRef:n,pendingTmNodeRef:o,multipleRef:a,valueSetRef:u,renderLabelRef:h,renderOptionRef:c,labelFieldRef:r,valueFieldRef:C,showCheckmarkRef:F,nodePropsRef:b,handleOptionClick:y,handleOptionMouseEnter:p}=it(rt),x=Be(()=>{const{value:_}=o;return _?e.tmNode.key===_.key:!1});function m(_){const{tmNode:g}=e;g.disabled||y(_,g)}function E(_){const{tmNode:g}=e;g.disabled||p(_,g)}function V(_){const{tmNode:g}=e,{value:O}=x;g.disabled||O||p(_,g)}return{multiple:a,isGrouped:Be(()=>{const{tmNode:_}=e,{parent:g}=_;return g&&g.rawNode.type==="group"}),showCheckmark:F,nodeProps:b,isPending:x,isSelected:Be(()=>{const{value:_}=n,{value:g}=a;if(_===null)return!1;const O=e.tmNode.rawNode[C.value];if(g){const{value:B}=u;return B.has(O)}else return _===O}),labelField:r,renderLabel:h,renderOption:c,handleMouseMove:V,handleMouseEnter:E,handleClick:m}},render(){const{clsPrefix:e,tmNode:{rawNode:n},isSelected:o,isPending:a,isGrouped:u,showCheckmark:h,nodeProps:c,renderOption:r,renderLabel:C,handleClick:F,handleMouseEnter:b,handleMouseMove:y}=this,p=_n(o,e),x=C?[C(n,o),h&&p]:[Fe(n[this.labelField],n,o),h&&p],m=c==null?void 0:c(n),E=l("div",Object.assign({},m,{class:[`${e}-base-select-option`,n.class,m==null?void 0:m.class,{[`${e}-base-select-option--disabled`]:n.disabled,[`${e}-base-select-option--selected`]:o,[`${e}-base-select-option--grouped`]:u,[`${e}-base-select-option--pending`]:a,[`${e}-base-select-option--show-checkmark`]:h}],style:[(m==null?void 0:m.style)||"",n.style||""],onClick:Qe([F,m==null?void 0:m.onClick]),onMouseenter:Qe([b,m==null?void 0:m.onMouseenter]),onMousemove:Qe([y,m==null?void 0:m.onMousemove])}),l("div",{class:`${e}-base-select-option__content`},x));return n.render?n.render({node:E,option:n,selected:o}):r?r({node:E,option:n,selected:o}):E}}),In=R("base-select-menu",`
 line-height: 1.5;
 outline: none;
 z-index: 0;
 position: relative;
 border-radius: var(--n-border-radius);
 transition:
 background-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
 background-color: var(--n-color);
`,[R("scrollbar",`
 max-height: var(--n-height);
 `),R("virtual-list",`
 max-height: var(--n-height);
 `),R("base-select-option",`
 min-height: var(--n-option-height);
 font-size: var(--n-option-font-size);
 display: flex;
 align-items: center;
 `,[S("content",`
 z-index: 1;
 white-space: nowrap;
 text-overflow: ellipsis;
 overflow: hidden;
 `)]),R("base-select-group-header",`
 min-height: var(--n-option-height);
 font-size: .93em;
 display: flex;
 align-items: center;
 `),R("base-select-menu-option-wrapper",`
 position: relative;
 width: 100%;
 `),S("loading, empty",`
 display: flex;
 padding: 12px 32px;
 flex: 1;
 justify-content: center;
 `),S("loading",`
 color: var(--n-loading-color);
 font-size: var(--n-loading-size);
 `),S("header",`
 padding: 8px var(--n-option-padding-left);
 font-size: var(--n-option-font-size);
 transition: 
 color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 border-bottom: 1px solid var(--n-action-divider-color);
 color: var(--n-action-text-color);
 `),S("action",`
 padding: 8px var(--n-option-padding-left);
 font-size: var(--n-option-font-size);
 transition: 
 color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 border-top: 1px solid var(--n-action-divider-color);
 color: var(--n-action-text-color);
 `),R("base-select-group-header",`
 position: relative;
 cursor: default;
 padding: var(--n-option-padding);
 color: var(--n-group-header-text-color);
 `),R("base-select-option",`
 cursor: pointer;
 position: relative;
 padding: var(--n-option-padding);
 transition:
 color .3s var(--n-bezier),
 opacity .3s var(--n-bezier);
 box-sizing: border-box;
 color: var(--n-option-text-color);
 opacity: 1;
 `,[H("show-checkmark",`
 padding-right: calc(var(--n-option-padding-right) + 20px);
 `),Z("&::before",`
 content: "";
 position: absolute;
 left: 4px;
 right: 4px;
 top: 0;
 bottom: 0;
 border-radius: var(--n-border-radius);
 transition: background-color .3s var(--n-bezier);
 `),Z("&:active",`
 color: var(--n-option-text-color-pressed);
 `),H("grouped",`
 padding-left: calc(var(--n-option-padding-left) * 1.5);
 `),H("pending",[Z("&::before",`
 background-color: var(--n-option-color-pending);
 `)]),H("selected",`
 color: var(--n-option-text-color-active);
 `,[Z("&::before",`
 background-color: var(--n-option-color-active);
 `),H("pending",[Z("&::before",`
 background-color: var(--n-option-color-active-pending);
 `)])]),H("disabled",`
 cursor: not-allowed;
 `,[Ae("selected",`
 color: var(--n-option-text-color-disabled);
 `),H("selected",`
 opacity: var(--n-option-opacity-disabled);
 `)]),S("check",`
 font-size: 16px;
 position: absolute;
 right: calc(var(--n-option-padding-right) - 4px);
 top: calc(50% - 7px);
 color: var(--n-option-check-color);
 transition: color .3s var(--n-bezier);
 `,[pt({enterScale:"0.5"})])])]),Bn=fe({name:"InternalSelectMenu",props:Object.assign(Object.assign({},le.props),{clsPrefix:{type:String,required:!0},scrollable:{type:Boolean,default:!0},treeMate:{type:Object,required:!0},multiple:Boolean,size:{type:String,default:"medium"},value:{type:[String,Number,Array],default:null},autoPending:Boolean,virtualScroll:{type:Boolean,default:!0},show:{type:Boolean,default:!0},labelField:{type:String,default:"label"},valueField:{type:String,default:"value"},loading:Boolean,focusable:Boolean,renderLabel:Function,renderOption:Function,nodeProps:Function,showCheckmark:{type:Boolean,default:!0},onMousedown:Function,onScroll:Function,onFocus:Function,onBlur:Function,onKeyup:Function,onKeydown:Function,onTabOut:Function,onMouseenter:Function,onMouseleave:Function,onResize:Function,resetMenuOnOptionsChange:{type:Boolean,default:!0},inlineThemeDisabled:Boolean,onToggle:Function}),setup(e){const{mergedClsPrefixRef:n,mergedRtlRef:o}=Oe(e),a=lt("InternalSelectMenu",o,n),u=le("InternalSelectMenu","-internal-select-menu",In,Qt,e,U(e,"clsPrefix")),h=T(null),c=T(null),r=T(null),C=$(()=>e.treeMate.getFlattenedNodes()),F=$(()=>en(C.value)),b=T(null);function y(){const{treeMate:s}=e;let f=null;const{value:N}=e;N===null?f=s.getFirstAvailableNode():(e.multiple?f=s.getNode((N||[])[(N||[]).length-1]):f=s.getNode(N),(!f||f.disabled)&&(f=s.getFirstAvailableNode())),Q(f||null)}function p(){const{value:s}=b;s&&!e.treeMate.getNode(s.key)&&(b.value=null)}let x;xe(()=>e.show,s=>{s?x=xe(()=>e.treeMate,()=>{e.resetMenuOnOptionsChange?(e.autoPending?y():p(),mt(de)):p()},{immediate:!0}):x==null||x()},{immediate:!0}),ht(()=>{x==null||x()});const m=$(()=>tn(u.value.self[ne("optionHeight",e.size)])),E=$(()=>Ee(u.value.self[ne("padding",e.size)])),V=$(()=>e.multiple&&Array.isArray(e.value)?new Set(e.value):new Set),_=$(()=>{const s=C.value;return s&&s.length===0});function g(s){const{onToggle:f}=e;f&&f(s)}function O(s){const{onScroll:f}=e;f&&f(s)}function B(s){var f;(f=r.value)===null||f===void 0||f.sync(),O(s)}function k(){var s;(s=r.value)===null||s===void 0||s.sync()}function D(){const{value:s}=b;return s||null}function K(s,f){f.disabled||Q(f,!1)}function ae(s,f){f.disabled||g(f)}function se(s){var f;$e(s,"action")||(f=e.onKeyup)===null||f===void 0||f.call(e,s)}function J(s){var f;$e(s,"action")||(f=e.onKeydown)===null||f===void 0||f.call(e,s)}function X(s){var f;(f=e.onMousedown)===null||f===void 0||f.call(e,s),!e.focusable&&s.preventDefault()}function ee(){const{value:s}=b;s&&Q(s.getNext({loop:!0}),!0)}function A(){const{value:s}=b;s&&Q(s.getPrev({loop:!0}),!0)}function Q(s,f=!1){b.value=s,f&&de()}function de(){var s,f;const N=b.value;if(!N)return;const ue=F.value(N.key);ue!==null&&(e.virtualScroll?(s=c.value)===null||s===void 0||s.scrollTo({index:ue}):(f=r.value)===null||f===void 0||f.scrollTo({index:ue,elSize:m.value}))}function oe(s){var f,N;!((f=h.value)===null||f===void 0)&&f.contains(s.target)&&((N=e.onFocus)===null||N===void 0||N.call(e,s))}function ge(s){var f,N;!((f=h.value)===null||f===void 0)&&f.contains(s.relatedTarget)||(N=e.onBlur)===null||N===void 0||N.call(e,s)}tt(rt,{handleOptionMouseEnter:K,handleOptionClick:ae,valueSetRef:V,pendingTmNodeRef:b,nodePropsRef:U(e,"nodeProps"),showCheckmarkRef:U(e,"showCheckmark"),multipleRef:U(e,"multiple"),valueRef:U(e,"value"),renderLabelRef:U(e,"renderLabel"),renderOptionRef:U(e,"renderOption"),labelFieldRef:U(e,"labelField"),valueFieldRef:U(e,"valueField")}),tt(nn,h),ot(()=>{const{value:s}=r;s&&s.sync()});const te=$(()=>{const{size:s}=e,{common:{cubicBezierEaseInOut:f},self:{height:N,borderRadius:ue,color:ye,groupHeaderTextColor:Ce,actionDividerColor:ce,optionTextColorPressed:Y,optionTextColor:Re,optionTextColorDisabled:he,optionTextColorActive:ze,optionOpacityDisabled:Te,optionCheckColor:ke,actionTextColor:Pe,optionColorPending:pe,optionColorActive:me,loadingColor:Me,loadingSize:_e,optionColorActivePending:Ie,[ne("optionFontSize",s)]:Se,[ne("optionHeight",s)]:we,[ne("optionPadding",s)]:G}}=u.value;return{"--n-height":N,"--n-action-divider-color":ce,"--n-action-text-color":Pe,"--n-bezier":f,"--n-border-radius":ue,"--n-color":ye,"--n-option-font-size":Se,"--n-group-header-text-color":Ce,"--n-option-check-color":ke,"--n-option-color-pending":pe,"--n-option-color-active":me,"--n-option-color-active-pending":Ie,"--n-option-height":we,"--n-option-opacity-disabled":Te,"--n-option-text-color":Re,"--n-option-text-color-active":ze,"--n-option-text-color-disabled":he,"--n-option-text-color-pressed":Y,"--n-option-padding":G,"--n-option-padding-left":Ee(G,"left"),"--n-option-padding-right":Ee(G,"right"),"--n-loading-color":Me,"--n-loading-size":_e}}),{inlineThemeDisabled:ve}=e,W=ve?Ve("internal-select-menu",$(()=>e.size[0]),te,e):void 0,ie={selfRef:h,next:ee,prev:A,getPendingTmNode:D};return xt(h,e.onResize),Object.assign({mergedTheme:u,mergedClsPrefix:n,rtlEnabled:a,virtualListRef:c,scrollbarRef:r,itemSize:m,padding:E,flattenedNodes:C,empty:_,virtualListContainer(){const{value:s}=c;return s==null?void 0:s.listElRef},virtualListContent(){const{value:s}=c;return s==null?void 0:s.itemsElRef},doScroll:O,handleFocusin:oe,handleFocusout:ge,handleKeyUp:se,handleKeyDown:J,handleMouseDown:X,handleVirtualListResize:k,handleVirtualListScroll:B,cssVars:ve?void 0:te,themeClass:W==null?void 0:W.themeClass,onRender:W==null?void 0:W.onRender},ie)},render(){const{$slots:e,virtualScroll:n,clsPrefix:o,mergedTheme:a,themeClass:u,onRender:h}=this;return h==null||h(),l("div",{ref:"selfRef",tabindex:this.focusable?0:-1,class:[`${o}-base-select-menu`,this.rtlEnabled&&`${o}-base-select-menu--rtl`,u,this.multiple&&`${o}-base-select-menu--multiple`],style:this.cssVars,onFocusin:this.handleFocusin,onFocusout:this.handleFocusout,onKeyup:this.handleKeyUp,onKeydown:this.handleKeyDown,onMousedown:this.handleMouseDown,onMouseenter:this.onMouseenter,onMouseleave:this.onMouseleave},st(e.header,c=>c&&l("div",{class:`${o}-base-select-menu__header`,"data-header":!0,key:"header"},c)),this.loading?l("div",{class:`${o}-base-select-menu__loading`},l(Yt,{clsPrefix:o,strokeWidth:20})):this.empty?l("div",{class:`${o}-base-select-menu__empty`,"data-empty":!0},Xt(e.empty,()=>[l(Mn,{theme:a.peers.Empty,themeOverrides:a.peerOverrides.Empty,size:this.size})])):l(Jt,{ref:"scrollbarRef",theme:a.peers.Scrollbar,themeOverrides:a.peerOverrides.Scrollbar,scrollable:this.scrollable,container:n?this.virtualListContainer:void 0,content:n?this.virtualListContent:void 0,onScroll:n?void 0:this.doScroll},{default:()=>n?l(Rn,{ref:"virtualListRef",class:`${o}-virtual-list`,items:this.flattenedNodes,itemSize:this.itemSize,showScrollbar:!1,paddingTop:this.padding.top,paddingBottom:this.padding.bottom,onResize:this.handleVirtualListResize,onScroll:this.handleVirtualListScroll,itemResizable:!0},{default:({item:c})=>c.isGroup?l(ft,{key:c.key,clsPrefix:o,tmNode:c}):c.ignored?null:l(vt,{clsPrefix:o,key:c.key,tmNode:c})}):l("div",{class:`${o}-base-select-menu-option-wrapper`,style:{paddingTop:this.padding.top,paddingBottom:this.padding.bottom}},this.flattenedNodes.map(c=>c.isGroup?l(ft,{key:c.key,clsPrefix:o,tmNode:c}):l(vt,{clsPrefix:o,key:c.key,tmNode:c})))}),st(e.action,c=>c&&[l("div",{class:`${o}-base-select-menu__action`,"data-action":!0,key:"action"},c),l(Sn,{onFocus:this.onTabOut,key:"focus-detector"})]))}}),$n=Z([R("base-selection",`
 --n-padding-single: var(--n-padding-single-top) var(--n-padding-single-right) var(--n-padding-single-bottom) var(--n-padding-single-left);
 --n-padding-multiple: var(--n-padding-multiple-top) var(--n-padding-multiple-right) var(--n-padding-multiple-bottom) var(--n-padding-multiple-left);
 position: relative;
 z-index: auto;
 box-shadow: none;
 width: 100%;
 max-width: 100%;
 display: inline-block;
 vertical-align: bottom;
 border-radius: var(--n-border-radius);
 min-height: var(--n-height);
 line-height: 1.5;
 font-size: var(--n-font-size);
 `,[R("base-loading",`
 color: var(--n-loading-color);
 `),R("base-selection-tags","min-height: var(--n-height);"),S("border, state-border",`
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 pointer-events: none;
 border: var(--n-border);
 border-radius: inherit;
 transition:
 box-shadow .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `),S("state-border",`
 z-index: 1;
 border-color: #0000;
 `),R("base-suffix",`
 cursor: pointer;
 position: absolute;
 top: 50%;
 transform: translateY(-50%);
 right: 10px;
 `,[S("arrow",`
 font-size: var(--n-arrow-size);
 color: var(--n-arrow-color);
 transition: color .3s var(--n-bezier);
 `)]),R("base-selection-overlay",`
 display: flex;
 align-items: center;
 white-space: nowrap;
 pointer-events: none;
 position: absolute;
 top: 0;
 right: 0;
 bottom: 0;
 left: 0;
 padding: var(--n-padding-single);
 transition: color .3s var(--n-bezier);
 `,[S("wrapper",`
 flex-basis: 0;
 flex-grow: 1;
 overflow: hidden;
 text-overflow: ellipsis;
 `)]),R("base-selection-placeholder",`
 color: var(--n-placeholder-color);
 `,[S("inner",`
 max-width: 100%;
 overflow: hidden;
 `)]),R("base-selection-tags",`
 cursor: pointer;
 outline: none;
 box-sizing: border-box;
 position: relative;
 z-index: auto;
 display: flex;
 padding: var(--n-padding-multiple);
 flex-wrap: wrap;
 align-items: center;
 width: 100%;
 vertical-align: bottom;
 background-color: var(--n-color);
 border-radius: inherit;
 transition:
 color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `),R("base-selection-label",`
 height: var(--n-height);
 display: inline-flex;
 width: 100%;
 vertical-align: bottom;
 cursor: pointer;
 outline: none;
 z-index: auto;
 box-sizing: border-box;
 position: relative;
 transition:
 color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 border-radius: inherit;
 background-color: var(--n-color);
 align-items: center;
 `,[R("base-selection-input",`
 font-size: inherit;
 line-height: inherit;
 outline: none;
 cursor: pointer;
 box-sizing: border-box;
 border:none;
 width: 100%;
 padding: var(--n-padding-single);
 background-color: #0000;
 color: var(--n-text-color);
 transition: color .3s var(--n-bezier);
 caret-color: var(--n-caret-color);
 `,[S("content",`
 text-overflow: ellipsis;
 overflow: hidden;
 white-space: nowrap; 
 `)]),S("render-label",`
 color: var(--n-text-color);
 `)]),Ae("disabled",[Z("&:hover",[S("state-border",`
 box-shadow: var(--n-box-shadow-hover);
 border: var(--n-border-hover);
 `)]),H("focus",[S("state-border",`
 box-shadow: var(--n-box-shadow-focus);
 border: var(--n-border-focus);
 `)]),H("active",[S("state-border",`
 box-shadow: var(--n-box-shadow-active);
 border: var(--n-border-active);
 `),R("base-selection-label","background-color: var(--n-color-active);"),R("base-selection-tags","background-color: var(--n-color-active);")])]),H("disabled","cursor: not-allowed;",[S("arrow",`
 color: var(--n-arrow-color-disabled);
 `),R("base-selection-label",`
 cursor: not-allowed;
 background-color: var(--n-color-disabled);
 `,[R("base-selection-input",`
 cursor: not-allowed;
 color: var(--n-text-color-disabled);
 `),S("render-label",`
 color: var(--n-text-color-disabled);
 `)]),R("base-selection-tags",`
 cursor: not-allowed;
 background-color: var(--n-color-disabled);
 `),R("base-selection-placeholder",`
 cursor: not-allowed;
 color: var(--n-placeholder-color-disabled);
 `)]),R("base-selection-input-tag",`
 height: calc(var(--n-height) - 6px);
 line-height: calc(var(--n-height) - 6px);
 outline: none;
 display: none;
 position: relative;
 margin-bottom: 3px;
 max-width: 100%;
 vertical-align: bottom;
 `,[S("input",`
 font-size: inherit;
 font-family: inherit;
 min-width: 1px;
 padding: 0;
 background-color: #0000;
 outline: none;
 border: none;
 max-width: 100%;
 overflow: hidden;
 width: 1em;
 line-height: inherit;
 cursor: pointer;
 color: var(--n-text-color);
 caret-color: var(--n-caret-color);
 `),S("mirror",`
 position: absolute;
 left: 0;
 top: 0;
 white-space: pre;
 visibility: hidden;
 user-select: none;
 -webkit-user-select: none;
 opacity: 0;
 `)]),["warning","error"].map(e=>H(`${e}-status`,[S("state-border",`border: var(--n-border-${e});`),Ae("disabled",[Z("&:hover",[S("state-border",`
 box-shadow: var(--n-box-shadow-hover-${e});
 border: var(--n-border-hover-${e});
 `)]),H("active",[S("state-border",`
 box-shadow: var(--n-box-shadow-active-${e});
 border: var(--n-border-active-${e});
 `),R("base-selection-label",`background-color: var(--n-color-active-${e});`),R("base-selection-tags",`background-color: var(--n-color-active-${e});`)]),H("focus",[S("state-border",`
 box-shadow: var(--n-box-shadow-focus-${e});
 border: var(--n-border-focus-${e});
 `)])])]))]),R("base-selection-popover",`
 margin-bottom: -3px;
 display: flex;
 flex-wrap: wrap;
 margin-right: -8px;
 `),R("base-selection-tag-wrapper",`
 max-width: 100%;
 display: inline-flex;
 padding: 0 7px 3px 0;
 `,[Z("&:last-child","padding-right: 0;"),R("tag",`
 font-size: 14px;
 max-width: 100%;
 `,[S("content",`
 line-height: 1.25;
 text-overflow: ellipsis;
 overflow: hidden;
 `)])])]),En=fe({name:"InternalSelection",props:Object.assign(Object.assign({},le.props),{clsPrefix:{type:String,required:!0},bordered:{type:Boolean,default:void 0},active:Boolean,pattern:{type:String,default:""},placeholder:String,selectedOption:{type:Object,default:null},selectedOptions:{type:Array,default:null},labelField:{type:String,default:"label"},valueField:{type:String,default:"value"},multiple:Boolean,filterable:Boolean,clearable:Boolean,disabled:Boolean,size:{type:String,default:"medium"},loading:Boolean,autofocus:Boolean,showArrow:{type:Boolean,default:!0},inputProps:Object,focused:Boolean,renderTag:Function,onKeydown:Function,onClick:Function,onBlur:Function,onFocus:Function,onDeleteOption:Function,maxTagCount:[String,Number],ellipsisTagPopoverProps:Object,onClear:Function,onPatternInput:Function,onPatternFocus:Function,onPatternBlur:Function,renderLabel:Function,status:String,inlineThemeDisabled:Boolean,ignoreComposition:{type:Boolean,default:!0},onResize:Function}),setup(e){const{mergedClsPrefixRef:n,mergedRtlRef:o}=Oe(e),a=lt("InternalSelection",o,n),u=T(null),h=T(null),c=T(null),r=T(null),C=T(null),F=T(null),b=T(null),y=T(null),p=T(null),x=T(null),m=T(!1),E=T(!1),V=T(!1),_=le("InternalSelection","-internal-selection",$n,sn,e,U(e,"clsPrefix")),g=$(()=>e.clearable&&!e.disabled&&(V.value||e.active)),O=$(()=>e.selectedOption?e.renderTag?e.renderTag({option:e.selectedOption,handleClose:()=>{}}):e.renderLabel?e.renderLabel(e.selectedOption,!0):Fe(e.selectedOption[e.labelField],e.selectedOption,!0):e.placeholder),B=$(()=>{const i=e.selectedOption;if(i)return i[e.labelField]}),k=$(()=>e.multiple?!!(Array.isArray(e.selectedOptions)&&e.selectedOptions.length):e.selectedOption!==null);function D(){var i;const{value:v}=u;if(v){const{value:L}=h;L&&(L.style.width=`${v.offsetWidth}px`,e.maxTagCount!=="responsive"&&((i=p.value)===null||i===void 0||i.sync({showAllItemsBeforeCalculate:!1})))}}function K(){const{value:i}=x;i&&(i.style.display="none")}function ae(){const{value:i}=x;i&&(i.style.display="inline-block")}xe(U(e,"active"),i=>{i||K()}),xe(U(e,"pattern"),()=>{e.multiple&&mt(D)});function se(i){const{onFocus:v}=e;v&&v(i)}function J(i){const{onBlur:v}=e;v&&v(i)}function X(i){const{onDeleteOption:v}=e;v&&v(i)}function ee(i){const{onClear:v}=e;v&&v(i)}function A(i){const{onPatternInput:v}=e;v&&v(i)}function Q(i){var v;(!i.relatedTarget||!(!((v=c.value)===null||v===void 0)&&v.contains(i.relatedTarget)))&&se(i)}function de(i){var v;!((v=c.value)===null||v===void 0)&&v.contains(i.relatedTarget)||J(i)}function oe(i){ee(i)}function ge(){V.value=!0}function te(){V.value=!1}function ve(i){!e.active||!e.filterable||i.target!==h.value&&i.preventDefault()}function W(i){X(i)}const ie=T(!1);function s(i){if(i.key==="Backspace"&&!ie.value&&!e.pattern.length){const{selectedOptions:v}=e;v!=null&&v.length&&W(v[v.length-1])}}let f=null;function N(i){const{value:v}=u;if(v){const L=i.target.value;v.textContent=L,D()}e.ignoreComposition&&ie.value?f=i:A(i)}function ue(){ie.value=!0}function ye(){ie.value=!1,e.ignoreComposition&&A(f),f=null}function Ce(i){var v;E.value=!0,(v=e.onPatternFocus)===null||v===void 0||v.call(e,i)}function ce(i){var v;E.value=!1,(v=e.onPatternBlur)===null||v===void 0||v.call(e,i)}function Y(){var i,v;if(e.filterable)E.value=!1,(i=F.value)===null||i===void 0||i.blur(),(v=h.value)===null||v===void 0||v.blur();else if(e.multiple){const{value:L}=r;L==null||L.blur()}else{const{value:L}=C;L==null||L.blur()}}function Re(){var i,v,L;e.filterable?(E.value=!1,(i=F.value)===null||i===void 0||i.focus()):e.multiple?(v=r.value)===null||v===void 0||v.focus():(L=C.value)===null||L===void 0||L.focus()}function he(){const{value:i}=h;i&&(ae(),i.focus())}function ze(){const{value:i}=h;i&&i.blur()}function Te(i){const{value:v}=b;v&&v.setTextContent(`+${i}`)}function ke(){const{value:i}=y;return i}function Pe(){return h.value}let pe=null;function me(){pe!==null&&window.clearTimeout(pe)}function Me(){e.active||(me(),pe=window.setTimeout(()=>{k.value&&(m.value=!0)},100))}function _e(){me()}function Ie(i){i||(me(),m.value=!1)}xe(k,i=>{i||(m.value=!1)}),ot(()=>{an(()=>{const i=F.value;i&&(e.disabled?i.removeAttribute("tabindex"):i.tabIndex=E.value?-1:0)})}),xt(c,e.onResize);const{inlineThemeDisabled:Se}=e,we=$(()=>{const{size:i}=e,{common:{cubicBezierEaseInOut:v},self:{fontWeight:L,borderRadius:Ge,color:qe,placeholderColor:De,textColor:Ne,paddingSingle:Le,paddingMultiple:Ze,caretColor:Ye,colorDisabled:je,textColorDisabled:be,placeholderColorDisabled:t,colorActive:d,boxShadowFocus:w,boxShadowActive:I,boxShadowHover:P,border:z,borderFocus:M,borderHover:j,borderActive:re,arrowColor:Rt,arrowColorDisabled:St,loadingColor:Ft,colorActiveWarning:Ot,boxShadowFocusWarning:zt,boxShadowActiveWarning:Tt,boxShadowHoverWarning:kt,borderWarning:Pt,borderFocusWarning:Mt,borderHoverWarning:_t,borderActiveWarning:It,colorActiveError:Bt,boxShadowFocusError:$t,boxShadowActiveError:Et,boxShadowHoverError:At,borderError:Vt,borderFocusError:Dt,borderHoverError:Nt,borderActiveError:Lt,clearColor:jt,clearColorHover:Ht,clearColorPressed:Ut,clearSize:Kt,arrowSize:Wt,[ne("height",i)]:Gt,[ne("fontSize",i)]:qt}}=_.value,He=Ee(Le),Ue=Ee(Ze);return{"--n-bezier":v,"--n-border":z,"--n-border-active":re,"--n-border-focus":M,"--n-border-hover":j,"--n-border-radius":Ge,"--n-box-shadow-active":I,"--n-box-shadow-focus":w,"--n-box-shadow-hover":P,"--n-caret-color":Ye,"--n-color":qe,"--n-color-active":d,"--n-color-disabled":je,"--n-font-size":qt,"--n-height":Gt,"--n-padding-single-top":He.top,"--n-padding-multiple-top":Ue.top,"--n-padding-single-right":He.right,"--n-padding-multiple-right":Ue.right,"--n-padding-single-left":He.left,"--n-padding-multiple-left":Ue.left,"--n-padding-single-bottom":He.bottom,"--n-padding-multiple-bottom":Ue.bottom,"--n-placeholder-color":De,"--n-placeholder-color-disabled":t,"--n-text-color":Ne,"--n-text-color-disabled":be,"--n-arrow-color":Rt,"--n-arrow-color-disabled":St,"--n-loading-color":Ft,"--n-color-active-warning":Ot,"--n-box-shadow-focus-warning":zt,"--n-box-shadow-active-warning":Tt,"--n-box-shadow-hover-warning":kt,"--n-border-warning":Pt,"--n-border-focus-warning":Mt,"--n-border-hover-warning":_t,"--n-border-active-warning":It,"--n-color-active-error":Bt,"--n-box-shadow-focus-error":$t,"--n-box-shadow-active-error":Et,"--n-box-shadow-hover-error":At,"--n-border-error":Vt,"--n-border-focus-error":Dt,"--n-border-hover-error":Nt,"--n-border-active-error":Lt,"--n-clear-size":Kt,"--n-clear-color":jt,"--n-clear-color-hover":Ht,"--n-clear-color-pressed":Ut,"--n-arrow-size":Wt,"--n-font-weight":L}}),G=Se?Ve("internal-selection",$(()=>e.size[0]),we,e):void 0;return{mergedTheme:_,mergedClearable:g,mergedClsPrefix:n,rtlEnabled:a,patternInputFocused:E,filterablePlaceholder:O,label:B,selected:k,showTagsPanel:m,isComposing:ie,counterRef:b,counterWrapperRef:y,patternInputMirrorRef:u,patternInputRef:h,selfRef:c,multipleElRef:r,singleElRef:C,patternInputWrapperRef:F,overflowRef:p,inputTagElRef:x,handleMouseDown:ve,handleFocusin:Q,handleClear:oe,handleMouseEnter:ge,handleMouseLeave:te,handleDeleteOption:W,handlePatternKeyDown:s,handlePatternInputInput:N,handlePatternInputBlur:ce,handlePatternInputFocus:Ce,handleMouseEnterCounter:Me,handleMouseLeaveCounter:_e,handleFocusout:de,handleCompositionEnd:ye,handleCompositionStart:ue,onPopoverUpdateShow:Ie,focus:Re,focusInput:he,blur:Y,blurInput:ze,updateCounter:Te,getCounter:ke,getTail:Pe,renderLabel:e.renderLabel,cssVars:Se?void 0:we,themeClass:G==null?void 0:G.themeClass,onRender:G==null?void 0:G.onRender}},render(){const{status:e,multiple:n,size:o,disabled:a,filterable:u,maxTagCount:h,bordered:c,clsPrefix:r,ellipsisTagPopoverProps:C,onRender:F,renderTag:b,renderLabel:y}=this;F==null||F();const p=h==="responsive",x=typeof h=="number",m=p||x,E=l(on,null,{default:()=>l(Fn,{clsPrefix:r,loading:this.loading,showArrow:this.showArrow,showClear:this.mergedClearable&&this.selected,onClear:this.handleClear},{default:()=>{var _,g;return(g=(_=this.$slots).arrow)===null||g===void 0?void 0:g.call(_)}})});let V;if(n){const{labelField:_}=this,g=A=>l("div",{class:`${r}-base-selection-tag-wrapper`,key:A.value},b?b({option:A,handleClose:()=>{this.handleDeleteOption(A)}}):l(Xe,{size:o,closable:!A.disabled,disabled:a,onClose:()=>{this.handleDeleteOption(A)},internalCloseIsButtonTag:!1,internalCloseFocusable:!1},{default:()=>y?y(A,!0):Fe(A[_],A,!0)})),O=()=>(x?this.selectedOptions.slice(0,h):this.selectedOptions).map(g),B=u?l("div",{class:`${r}-base-selection-input-tag`,ref:"inputTagElRef",key:"__input-tag__"},l("input",Object.assign({},this.inputProps,{ref:"patternInputRef",tabindex:-1,disabled:a,value:this.pattern,autofocus:this.autofocus,class:`${r}-base-selection-input-tag__input`,onBlur:this.handlePatternInputBlur,onFocus:this.handlePatternInputFocus,onKeydown:this.handlePatternKeyDown,onInput:this.handlePatternInputInput,onCompositionstart:this.handleCompositionStart,onCompositionend:this.handleCompositionEnd})),l("span",{ref:"patternInputMirrorRef",class:`${r}-base-selection-input-tag__mirror`},this.pattern)):null,k=p?()=>l("div",{class:`${r}-base-selection-tag-wrapper`,ref:"counterWrapperRef"},l(Xe,{size:o,ref:"counterRef",onMouseenter:this.handleMouseEnterCounter,onMouseleave:this.handleMouseLeaveCounter,disabled:a})):void 0;let D;if(x){const A=this.selectedOptions.length-h;A>0&&(D=l("div",{class:`${r}-base-selection-tag-wrapper`,key:"__counter__"},l(Xe,{size:o,ref:"counterRef",onMouseenter:this.handleMouseEnterCounter,disabled:a},{default:()=>`+${A}`})))}const K=p?u?l(dt,{ref:"overflowRef",updateCounter:this.updateCounter,getCounter:this.getCounter,getTail:this.getTail,style:{width:"100%",display:"flex",overflow:"hidden"}},{default:O,counter:k,tail:()=>B}):l(dt,{ref:"overflowRef",updateCounter:this.updateCounter,getCounter:this.getCounter,style:{width:"100%",display:"flex",overflow:"hidden"}},{default:O,counter:k}):x&&D?O().concat(D):O(),ae=m?()=>l("div",{class:`${r}-base-selection-popover`},p?O():this.selectedOptions.map(g)):void 0,se=m?Object.assign({show:this.showTagsPanel,trigger:"hover",overlap:!0,placement:"top",width:"trigger",onUpdateShow:this.onPopoverUpdateShow,theme:this.mergedTheme.peers.Popover,themeOverrides:this.mergedTheme.peerOverrides.Popover},C):null,X=(this.selected?!1:this.active?!this.pattern&&!this.isComposing:!0)?l("div",{class:`${r}-base-selection-placeholder ${r}-base-selection-overlay`},l("div",{class:`${r}-base-selection-placeholder__inner`},this.placeholder)):null,ee=u?l("div",{ref:"patternInputWrapperRef",class:`${r}-base-selection-tags`},K,p?null:B,E):l("div",{ref:"multipleElRef",class:`${r}-base-selection-tags`,tabindex:a?void 0:0},K,E);V=l(rn,null,m?l(ln,Object.assign({},se,{scrollable:!0,style:"max-height: calc(var(--v-target-height) * 6.6);"}),{trigger:()=>ee,default:ae}):ee,X)}else if(u){const _=this.pattern||this.isComposing,g=this.active?!_:!this.selected,O=this.active?!1:this.selected;V=l("div",{ref:"patternInputWrapperRef",class:`${r}-base-selection-label`,title:this.patternInputFocused?void 0:ct(this.label)},l("input",Object.assign({},this.inputProps,{ref:"patternInputRef",class:`${r}-base-selection-input`,value:this.active?this.pattern:"",placeholder:"",readonly:a,disabled:a,tabindex:-1,autofocus:this.autofocus,onFocus:this.handlePatternInputFocus,onBlur:this.handlePatternInputBlur,onInput:this.handlePatternInputInput,onCompositionstart:this.handleCompositionStart,onCompositionend:this.handleCompositionEnd})),O?l("div",{class:`${r}-base-selection-label__render-label ${r}-base-selection-overlay`,key:"input"},l("div",{class:`${r}-base-selection-overlay__wrapper`},b?b({option:this.selectedOption,handleClose:()=>{}}):y?y(this.selectedOption,!0):Fe(this.label,this.selectedOption,!0))):null,g?l("div",{class:`${r}-base-selection-placeholder ${r}-base-selection-overlay`,key:"placeholder"},l("div",{class:`${r}-base-selection-overlay__wrapper`},this.filterablePlaceholder)):null,E)}else V=l("div",{ref:"singleElRef",class:`${r}-base-selection-label`,tabindex:this.disabled?void 0:0},this.label!==void 0?l("div",{class:`${r}-base-selection-input`,title:ct(this.label),key:"input"},l("div",{class:`${r}-base-selection-input__content`},b?b({option:this.selectedOption,handleClose:()=>{}}):y?y(this.selectedOption,!0):Fe(this.label,this.selectedOption,!0))):l("div",{class:`${r}-base-selection-placeholder ${r}-base-selection-overlay`,key:"placeholder"},l("div",{class:`${r}-base-selection-placeholder__inner`},this.placeholder)),E);return l("div",{ref:"selfRef",class:[`${r}-base-selection`,this.rtlEnabled&&`${r}-base-selection--rtl`,this.themeClass,e&&`${r}-base-selection--${e}-status`,{[`${r}-base-selection--active`]:this.active,[`${r}-base-selection--selected`]:this.selected||this.active&&this.pattern,[`${r}-base-selection--disabled`]:this.disabled,[`${r}-base-selection--multiple`]:this.multiple,[`${r}-base-selection--focus`]:this.focused}],style:this.cssVars,onClick:this.onClick,onMouseenter:this.handleMouseEnter,onMouseleave:this.handleMouseLeave,onKeydown:this.onKeydown,onFocusin:this.handleFocusin,onFocusout:this.handleFocusout,onMousedown:this.handleMouseDown},V,c?l("div",{class:`${r}-base-selection__border`}):null,c?l("div",{class:`${r}-base-selection__state-border`}):null)}});function We(e){return e.type==="group"}function yt(e){return e.type==="ignored"}function et(e,n){try{return!!(1+n.toString().toLowerCase().indexOf(e.trim().toLowerCase()))}catch{return!1}}function An(e,n){return{getIsGroup:We,getIgnored:yt,getKey(a){return We(a)?a.name||a.key||"key-required":a[e]},getChildren(a){return a[n]}}}function Vn(e,n,o,a){if(!n)return e;function u(h){if(!Array.isArray(h))return[];const c=[];for(const r of h)if(We(r)){const C=u(r[a]);C.length&&c.push(Object.assign({},r,{[a]:C}))}else{if(yt(r))continue;n(o,r)&&c.push(r)}return c}return u(e)}function Dn(e,n,o){const a=new Map;return e.forEach(u=>{We(u)?u[o].forEach(h=>{a.set(h[n],h)}):a.set(u[n],u)}),a}const Nn=Z([R("select",`
 z-index: auto;
 outline: none;
 width: 100%;
 position: relative;
 font-weight: var(--n-font-weight);
 `),R("select-menu",`
 margin: 4px 0;
 box-shadow: var(--n-menu-box-shadow);
 `,[pt({originalTransition:"background-color .3s var(--n-bezier), box-shadow .3s var(--n-bezier)"})])]),Ln=Object.assign(Object.assign({},le.props),{to:nt.propTo,bordered:{type:Boolean,default:void 0},clearable:Boolean,clearFilterAfterSelect:{type:Boolean,default:!0},options:{type:Array,default:()=>[]},defaultValue:{type:[String,Number,Array],default:null},keyboard:{type:Boolean,default:!0},value:[String,Number,Array],placeholder:String,menuProps:Object,multiple:Boolean,size:String,menuSize:{type:String},filterable:Boolean,disabled:{type:Boolean,default:void 0},remote:Boolean,loading:Boolean,filter:Function,placement:{type:String,default:"bottom-start"},widthMode:{type:String,default:"trigger"},tag:Boolean,onCreate:Function,fallbackOption:{type:[Function,Boolean],default:void 0},show:{type:Boolean,default:void 0},showArrow:{type:Boolean,default:!0},maxTagCount:[Number,String],ellipsisTagPopoverProps:Object,consistentMenuWidth:{type:Boolean,default:!0},virtualScroll:{type:Boolean,default:!0},labelField:{type:String,default:"label"},valueField:{type:String,default:"value"},childrenField:{type:String,default:"children"},renderLabel:Function,renderOption:Function,renderTag:Function,"onUpdate:value":[Function,Array],inputProps:Object,nodeProps:Function,ignoreComposition:{type:Boolean,default:!0},showOnFocus:Boolean,onUpdateValue:[Function,Array],onBlur:[Function,Array],onClear:[Function,Array],onFocus:[Function,Array],onScroll:[Function,Array],onSearch:[Function,Array],onUpdateShow:[Function,Array],"onUpdate:show":[Function,Array],displayDirective:{type:String,default:"show"},resetMenuOnOptionsChange:{type:Boolean,default:!0},status:String,showCheckmark:{type:Boolean,default:!0},onChange:[Function,Array],items:Array}),qn=fe({name:"Select",props:Ln,slots:Object,setup(e){const{mergedClsPrefixRef:n,mergedBorderedRef:o,namespaceRef:a,inlineThemeDisabled:u}=Oe(e),h=le("Select","-select",Nn,bn,e,n),c=T(e.defaultValue),r=U(e,"value"),C=Ke(r,c),F=T(!1),b=T(""),y=mn(e,["items","options"]),p=T([]),x=T([]),m=$(()=>x.value.concat(p.value).concat(y.value)),E=$(()=>{const{filter:t}=e;if(t)return t;const{labelField:d,valueField:w}=e;return(I,P)=>{if(!P)return!1;const z=P[d];if(typeof z=="string")return et(I,z);const M=P[w];return typeof M=="string"?et(I,M):typeof M=="number"?et(I,String(M)):!1}}),V=$(()=>{if(e.remote)return y.value;{const{value:t}=m,{value:d}=b;return!d.length||!e.filterable?t:Vn(t,E.value,d,e.childrenField)}}),_=$(()=>{const{valueField:t,childrenField:d}=e,w=An(t,d);return wn(V.value,w)}),g=$(()=>Dn(m.value,e.valueField,e.childrenField)),O=T(!1),B=Ke(U(e,"show"),O),k=T(null),D=T(null),K=T(null),{localeRef:ae}=wt("Select"),se=$(()=>{var t;return(t=e.placeholder)!==null&&t!==void 0?t:ae.value.placeholder}),J=[],X=T(new Map),ee=$(()=>{const{fallbackOption:t}=e;if(t===void 0){const{labelField:d,valueField:w}=e;return I=>({[d]:String(I),[w]:I})}return t===!1?!1:d=>Object.assign(t(d),{value:d})});function A(t){const d=e.remote,{value:w}=X,{value:I}=g,{value:P}=ee,z=[];return t.forEach(M=>{if(I.has(M))z.push(I.get(M));else if(d&&w.has(M))z.push(w.get(M));else if(P){const j=P(M);j&&z.push(j)}}),z}const Q=$(()=>{if(e.multiple){const{value:t}=C;return Array.isArray(t)?A(t):[]}return null}),de=$(()=>{const{value:t}=C;return!e.multiple&&!Array.isArray(t)?t===null?null:A([t])[0]||null:null}),oe=at(e),{mergedSizeRef:ge,mergedDisabledRef:te,mergedStatusRef:ve}=oe;function W(t,d){const{onChange:w,"onUpdate:value":I,onUpdateValue:P}=e,{nTriggerFormChange:z,nTriggerFormInput:M}=oe;w&&q(w,t,d),P&&q(P,t,d),I&&q(I,t,d),c.value=t,z(),M()}function ie(t){const{onBlur:d}=e,{nTriggerFormBlur:w}=oe;d&&q(d,t),w()}function s(){const{onClear:t}=e;t&&q(t)}function f(t){const{onFocus:d,showOnFocus:w}=e,{nTriggerFormFocus:I}=oe;d&&q(d,t),I(),w&&ce()}function N(t){const{onSearch:d}=e;d&&q(d,t)}function ue(t){const{onScroll:d}=e;d&&q(d,t)}function ye(){var t;const{remote:d,multiple:w}=e;if(d){const{value:I}=X;if(w){const{valueField:P}=e;(t=Q.value)===null||t===void 0||t.forEach(z=>{I.set(z[P],z)})}else{const P=de.value;P&&I.set(P[e.valueField],P)}}}function Ce(t){const{onUpdateShow:d,"onUpdate:show":w}=e;d&&q(d,t),w&&q(w,t),O.value=t}function ce(){te.value||(Ce(!0),O.value=!0,e.filterable&&Le())}function Y(){Ce(!1)}function Re(){b.value="",x.value=J}const he=T(!1);function ze(){e.filterable&&(he.value=!0)}function Te(){e.filterable&&(he.value=!1,B.value||Re())}function ke(){te.value||(B.value?e.filterable?Le():Y():ce())}function Pe(t){var d,w;!((w=(d=K.value)===null||d===void 0?void 0:d.selfRef)===null||w===void 0)&&w.contains(t.relatedTarget)||(F.value=!1,ie(t),Y())}function pe(t){f(t),F.value=!0}function me(){F.value=!0}function Me(t){var d;!((d=k.value)===null||d===void 0)&&d.$el.contains(t.relatedTarget)||(F.value=!1,ie(t),Y())}function _e(){var t;(t=k.value)===null||t===void 0||t.focus(),Y()}function Ie(t){var d;B.value&&(!((d=k.value)===null||d===void 0)&&d.$el.contains(gn(t))||Y())}function Se(t){if(!Array.isArray(t))return[];if(ee.value)return Array.from(t);{const{remote:d}=e,{value:w}=g;if(d){const{value:I}=X;return t.filter(P=>w.has(P)||I.has(P))}else return t.filter(I=>w.has(I))}}function we(t){G(t.rawNode)}function G(t){if(te.value)return;const{tag:d,remote:w,clearFilterAfterSelect:I,valueField:P}=e;if(d&&!w){const{value:z}=x,M=z[0]||null;if(M){const j=p.value;j.length?j.push(M):p.value=[M],x.value=J}}if(w&&X.value.set(t[P],t),e.multiple){const z=Se(C.value),M=z.findIndex(j=>j===t[P]);if(~M){if(z.splice(M,1),d&&!w){const j=i(t[P]);~j&&(p.value.splice(j,1),I&&(b.value=""))}}else z.push(t[P]),I&&(b.value="");W(z,A(z))}else{if(d&&!w){const z=i(t[P]);~z?p.value=[p.value[z]]:p.value=J}Ne(),Y(),W(t[P],t)}}function i(t){return p.value.findIndex(w=>w[e.valueField]===t)}function v(t){B.value||ce();const{value:d}=t.target;b.value=d;const{tag:w,remote:I}=e;if(N(d),w&&!I){if(!d){x.value=J;return}const{onCreate:P}=e,z=P?P(d):{[e.labelField]:d,[e.valueField]:d},{valueField:M,labelField:j}=e;y.value.some(re=>re[M]===z[M]||re[j]===z[j])||p.value.some(re=>re[M]===z[M]||re[j]===z[j])?x.value=J:x.value=[z]}}function L(t){t.stopPropagation();const{multiple:d}=e;!d&&e.filterable&&Y(),s(),d?W([],[]):W(null,null)}function Ge(t){!$e(t,"action")&&!$e(t,"empty")&&!$e(t,"header")&&t.preventDefault()}function qe(t){ue(t)}function De(t){var d,w,I,P,z;if(!e.keyboard){t.preventDefault();return}switch(t.key){case" ":if(e.filterable)break;t.preventDefault();case"Enter":if(!(!((d=k.value)===null||d===void 0)&&d.isComposing)){if(B.value){const M=(w=K.value)===null||w===void 0?void 0:w.getPendingTmNode();M?we(M):e.filterable||(Y(),Ne())}else if(ce(),e.tag&&he.value){const M=x.value[0];if(M){const j=M[e.valueField],{value:re}=C;e.multiple&&Array.isArray(re)&&re.includes(j)||G(M)}}}t.preventDefault();break;case"ArrowUp":if(t.preventDefault(),e.loading)return;B.value&&((I=K.value)===null||I===void 0||I.prev());break;case"ArrowDown":if(t.preventDefault(),e.loading)return;B.value?(P=K.value)===null||P===void 0||P.next():ce();break;case"Escape":B.value&&(pn(t),Y()),(z=k.value)===null||z===void 0||z.focus();break}}function Ne(){var t;(t=k.value)===null||t===void 0||t.focus()}function Le(){var t;(t=k.value)===null||t===void 0||t.focusInput()}function Ze(){var t;B.value&&((t=D.value)===null||t===void 0||t.syncPosition())}ye(),xe(U(e,"options"),ye);const Ye={focus:()=>{var t;(t=k.value)===null||t===void 0||t.focus()},focusInput:()=>{var t;(t=k.value)===null||t===void 0||t.focusInput()},blur:()=>{var t;(t=k.value)===null||t===void 0||t.blur()},blurInput:()=>{var t;(t=k.value)===null||t===void 0||t.blurInput()}},je=$(()=>{const{self:{menuBoxShadow:t}}=h.value;return{"--n-menu-box-shadow":t}}),be=u?Ve("select",void 0,je,e):void 0;return Object.assign(Object.assign({},Ye),{mergedStatus:ve,mergedClsPrefix:n,mergedBordered:o,namespace:a,treeMate:_,isMounted:hn(),triggerRef:k,menuRef:K,pattern:b,uncontrolledShow:O,mergedShow:B,adjustedTo:nt(e),uncontrolledValue:c,mergedValue:C,followerRef:D,localizedPlaceholder:se,selectedOption:de,selectedOptions:Q,mergedSize:ge,mergedDisabled:te,focused:F,activeWithoutMenuOpen:he,inlineThemeDisabled:u,onTriggerInputFocus:ze,onTriggerInputBlur:Te,handleTriggerOrMenuResize:Ze,handleMenuFocus:me,handleMenuBlur:Me,handleMenuTabOut:_e,handleTriggerClick:ke,handleToggle:we,handleDeleteOption:G,handlePatternInput:v,handleClear:L,handleTriggerBlur:Pe,handleTriggerFocus:pe,handleKeydown:De,handleMenuAfterLeave:Re,handleMenuClickOutside:Ie,handleMenuScroll:qe,handleMenuKeydown:De,handleMenuMousedown:Ge,mergedTheme:h,cssVars:u?void 0:je,themeClass:be==null?void 0:be.themeClass,onRender:be==null?void 0:be.onRender})},render(){return l("div",{class:`${this.mergedClsPrefix}-select`},l(dn,null,{default:()=>[l(un,null,{default:()=>l(En,{ref:"triggerRef",inlineThemeDisabled:this.inlineThemeDisabled,status:this.mergedStatus,inputProps:this.inputProps,clsPrefix:this.mergedClsPrefix,showArrow:this.showArrow,maxTagCount:this.maxTagCount,ellipsisTagPopoverProps:this.ellipsisTagPopoverProps,bordered:this.mergedBordered,active:this.activeWithoutMenuOpen||this.mergedShow,pattern:this.pattern,placeholder:this.localizedPlaceholder,selectedOption:this.selectedOption,selectedOptions:this.selectedOptions,multiple:this.multiple,renderTag:this.renderTag,renderLabel:this.renderLabel,filterable:this.filterable,clearable:this.clearable,disabled:this.mergedDisabled,size:this.mergedSize,theme:this.mergedTheme.peers.InternalSelection,labelField:this.labelField,valueField:this.valueField,themeOverrides:this.mergedTheme.peerOverrides.InternalSelection,loading:this.loading,focused:this.focused,onClick:this.handleTriggerClick,onDeleteOption:this.handleDeleteOption,onPatternInput:this.handlePatternInput,onClear:this.handleClear,onBlur:this.handleTriggerBlur,onFocus:this.handleTriggerFocus,onKeydown:this.handleKeydown,onPatternBlur:this.onTriggerInputBlur,onPatternFocus:this.onTriggerInputFocus,onResize:this.handleTriggerOrMenuResize,ignoreComposition:this.ignoreComposition},{arrow:()=>{var e,n;return[(n=(e=this.$slots).arrow)===null||n===void 0?void 0:n.call(e)]}})}),l(cn,{ref:"followerRef",show:this.mergedShow,to:this.adjustedTo,teleportDisabled:this.adjustedTo===nt.tdkey,containerClass:this.namespace,width:this.consistentMenuWidth?"target":void 0,minWidth:"target",placement:this.placement},{default:()=>l(gt,{name:"fade-in-scale-up-transition",appear:this.isMounted,onAfterLeave:this.handleMenuAfterLeave},{default:()=>{var e,n,o;return this.mergedShow||this.displayDirective==="show"?((e=this.onRender)===null||e===void 0||e.call(this),fn(l(Bn,Object.assign({},this.menuProps,{ref:"menuRef",onResize:this.handleTriggerOrMenuResize,inlineThemeDisabled:this.inlineThemeDisabled,virtualScroll:this.consistentMenuWidth&&this.virtualScroll,class:[`${this.mergedClsPrefix}-select-menu`,this.themeClass,(n=this.menuProps)===null||n===void 0?void 0:n.class],clsPrefix:this.mergedClsPrefix,focusable:!0,labelField:this.labelField,valueField:this.valueField,autoPending:!0,nodeProps:this.nodeProps,theme:this.mergedTheme.peers.InternalSelectMenu,themeOverrides:this.mergedTheme.peerOverrides.InternalSelectMenu,treeMate:this.treeMate,multiple:this.multiple,size:this.menuSize,renderOption:this.renderOption,renderLabel:this.renderLabel,value:this.mergedValue,style:[(o=this.menuProps)===null||o===void 0?void 0:o.style,this.cssVars],onToggle:this.handleToggle,onScroll:this.handleMenuScroll,onFocus:this.handleMenuFocus,onBlur:this.handleMenuBlur,onKeydown:this.handleMenuKeydown,onTabOut:this.handleMenuTabOut,onMousedown:this.handleMenuMousedown,show:this.mergedShow,showCheckmark:this.showCheckmark,resetMenuOnOptionsChange:this.resetMenuOnOptionsChange}),{empty:()=>{var a,u;return[(u=(a=this.$slots).empty)===null||u===void 0?void 0:u.call(a)]},header:()=>{var a,u;return[(u=(a=this.$slots).header)===null||u===void 0?void 0:u.call(a)]},action:()=>{var a,u;return[(u=(a=this.$slots).action)===null||u===void 0?void 0:u.call(a)]}}),this.displayDirective==="show"?[[vn,this.mergedShow],[ut,this.handleMenuClickOutside,void 0,{capture:!0}]]:[[ut,this.handleMenuClickOutside,void 0,{capture:!0}]])):null}})})]}))}}),Zn={name:String,value:{type:[String,Number,Boolean],default:"on"},checked:{type:Boolean,default:void 0},defaultChecked:Boolean,disabled:{type:Boolean,default:void 0},label:String,size:String,onUpdateChecked:[Function,Array],"onUpdate:checked":[Function,Array],checkedValue:{type:Boolean,default:void 0}},Ct=xn("n-radio-group");function Yn(e){const n=it(Ct,null),o=at(e,{mergedSize(g){const{size:O}=e;if(O!==void 0)return O;if(n){const{mergedSizeRef:{value:B}}=n;if(B!==void 0)return B}return g?g.mergedSize.value:"medium"},mergedDisabled(g){return!!(e.disabled||n!=null&&n.disabledRef.value||g!=null&&g.disabled.value)}}),{mergedSizeRef:a,mergedDisabledRef:u}=o,h=T(null),c=T(null),r=T(e.defaultChecked),C=U(e,"checked"),F=Ke(C,r),b=Be(()=>n?n.valueRef.value===e.value:F.value),y=Be(()=>{const{name:g}=e;if(g!==void 0)return g;if(n)return n.nameRef.value}),p=T(!1);function x(){if(n){const{doUpdateValue:g}=n,{value:O}=e;q(g,O)}else{const{onUpdateChecked:g,"onUpdate:checked":O}=e,{nTriggerFormInput:B,nTriggerFormChange:k}=o;g&&q(g,!0),O&&q(O,!0),B(),k(),r.value=!0}}function m(){u.value||b.value||x()}function E(){m(),h.value&&(h.value.checked=b.value)}function V(){p.value=!1}function _(){p.value=!0}return{mergedClsPrefix:n?n.mergedClsPrefixRef:Oe(e).mergedClsPrefixRef,inputRef:h,labelRef:c,mergedName:y,mergedDisabled:u,renderSafeChecked:b,focus:p,mergedSize:a,handleRadioInputChange:E,handleRadioInputBlur:V,handleRadioInputFocus:_}}const jn=R("radio-group",`
 display: inline-block;
 font-size: var(--n-font-size);
`,[S("splitor",`
 display: inline-block;
 vertical-align: bottom;
 width: 1px;
 transition:
 background-color .3s var(--n-bezier),
 opacity .3s var(--n-bezier);
 background: var(--n-button-border-color);
 `,[H("checked",{backgroundColor:"var(--n-button-border-color-active)"}),H("disabled",{opacity:"var(--n-opacity-disabled)"})]),H("button-group",`
 white-space: nowrap;
 height: var(--n-height);
 line-height: var(--n-height);
 `,[R("radio-button",{height:"var(--n-height)",lineHeight:"var(--n-height)"}),S("splitor",{height:"var(--n-height)"})]),R("radio-button",`
 vertical-align: bottom;
 outline: none;
 position: relative;
 user-select: none;
 -webkit-user-select: none;
 display: inline-block;
 box-sizing: border-box;
 padding-left: 14px;
 padding-right: 14px;
 white-space: nowrap;
 transition:
 background-color .3s var(--n-bezier),
 opacity .3s var(--n-bezier),
 border-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 background: var(--n-button-color);
 color: var(--n-button-text-color);
 border-top: 1px solid var(--n-button-border-color);
 border-bottom: 1px solid var(--n-button-border-color);
 `,[R("radio-input",`
 pointer-events: none;
 position: absolute;
 border: 0;
 border-radius: inherit;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 opacity: 0;
 z-index: 1;
 `),S("state-border",`
 z-index: 1;
 pointer-events: none;
 position: absolute;
 box-shadow: var(--n-button-box-shadow);
 transition: box-shadow .3s var(--n-bezier);
 left: -1px;
 bottom: -1px;
 right: -1px;
 top: -1px;
 `),Z("&:first-child",`
 border-top-left-radius: var(--n-button-border-radius);
 border-bottom-left-radius: var(--n-button-border-radius);
 border-left: 1px solid var(--n-button-border-color);
 `,[S("state-border",`
 border-top-left-radius: var(--n-button-border-radius);
 border-bottom-left-radius: var(--n-button-border-radius);
 `)]),Z("&:last-child",`
 border-top-right-radius: var(--n-button-border-radius);
 border-bottom-right-radius: var(--n-button-border-radius);
 border-right: 1px solid var(--n-button-border-color);
 `,[S("state-border",`
 border-top-right-radius: var(--n-button-border-radius);
 border-bottom-right-radius: var(--n-button-border-radius);
 `)]),Ae("disabled",`
 cursor: pointer;
 `,[Z("&:hover",[S("state-border",`
 transition: box-shadow .3s var(--n-bezier);
 box-shadow: var(--n-button-box-shadow-hover);
 `),Ae("checked",{color:"var(--n-button-text-color-hover)"})]),H("focus",[Z("&:not(:active)",[S("state-border",{boxShadow:"var(--n-button-box-shadow-focus)"})])])]),H("checked",`
 background: var(--n-button-color-active);
 color: var(--n-button-text-color-active);
 border-color: var(--n-button-border-color-active);
 `),H("disabled",`
 cursor: not-allowed;
 opacity: var(--n-opacity-disabled);
 `)])]);function Hn(e,n,o){var a;const u=[];let h=!1;for(let c=0;c<e.length;++c){const r=e[c],C=(a=r.type)===null||a===void 0?void 0:a.name;C==="RadioButton"&&(h=!0);const F=r.props;if(C!=="RadioButton"){u.push(r);continue}if(c===0)u.push(r);else{const b=u[u.length-1].props,y=n===b.value,p=b.disabled,x=n===F.value,m=F.disabled,E=(y?2:0)+(p?0:1),V=(x?2:0)+(m?0:1),_={[`${o}-radio-group__splitor--disabled`]:p,[`${o}-radio-group__splitor--checked`]:y},g={[`${o}-radio-group__splitor--disabled`]:m,[`${o}-radio-group__splitor--checked`]:x},O=E<V?g:_;u.push(l("div",{class:[`${o}-radio-group__splitor`,O]}),r)}}return{children:u,isButtonGroup:h}}const Un=Object.assign(Object.assign({},le.props),{name:String,value:[String,Number,Boolean],defaultValue:{type:[String,Number,Boolean],default:null},size:String,disabled:{type:Boolean,default:void 0},"onUpdate:value":[Function,Array],onUpdateValue:[Function,Array]}),Jn=fe({name:"RadioGroup",props:Un,setup(e){const n=T(null),{mergedSizeRef:o,mergedDisabledRef:a,nTriggerFormChange:u,nTriggerFormInput:h,nTriggerFormBlur:c,nTriggerFormFocus:r}=at(e),{mergedClsPrefixRef:C,inlineThemeDisabled:F,mergedRtlRef:b}=Oe(e),y=le("Radio","-radio-group",jn,Cn,e,C),p=T(e.defaultValue),x=U(e,"value"),m=Ke(x,p);function E(k){const{onUpdateValue:D,"onUpdate:value":K}=e;D&&q(D,k),K&&q(K,k),p.value=k,u(),h()}function V(k){const{value:D}=n;D&&(D.contains(k.relatedTarget)||r())}function _(k){const{value:D}=n;D&&(D.contains(k.relatedTarget)||c())}tt(Ct,{mergedClsPrefixRef:C,nameRef:U(e,"name"),valueRef:m,disabledRef:a,mergedSizeRef:o,doUpdateValue:E});const g=lt("Radio",b,C),O=$(()=>{const{value:k}=o,{common:{cubicBezierEaseInOut:D},self:{buttonBorderColor:K,buttonBorderColorActive:ae,buttonBorderRadius:se,buttonBoxShadow:J,buttonBoxShadowFocus:X,buttonBoxShadowHover:ee,buttonColor:A,buttonColorActive:Q,buttonTextColor:de,buttonTextColorActive:oe,buttonTextColorHover:ge,opacityDisabled:te,[ne("buttonHeight",k)]:ve,[ne("fontSize",k)]:W}}=y.value;return{"--n-font-size":W,"--n-bezier":D,"--n-button-border-color":K,"--n-button-border-color-active":ae,"--n-button-border-radius":se,"--n-button-box-shadow":J,"--n-button-box-shadow-focus":X,"--n-button-box-shadow-hover":ee,"--n-button-color":A,"--n-button-color-active":Q,"--n-button-text-color":de,"--n-button-text-color-hover":ge,"--n-button-text-color-active":oe,"--n-height":ve,"--n-opacity-disabled":te}}),B=F?Ve("radio-group",$(()=>o.value[0]),O,e):void 0;return{selfElRef:n,rtlEnabled:g,mergedClsPrefix:C,mergedValue:m,handleFocusout:_,handleFocusin:V,cssVars:F?void 0:O,themeClass:B==null?void 0:B.themeClass,onRender:B==null?void 0:B.onRender}},render(){var e;const{mergedValue:n,mergedClsPrefix:o,handleFocusin:a,handleFocusout:u}=this,{children:h,isButtonGroup:c}=Hn(yn(On(this)),n,o);return(e=this.onRender)===null||e===void 0||e.call(this),l("div",{onFocusin:a,onFocusout:u,ref:"selfElRef",class:[`${o}-radio-group`,this.rtlEnabled&&`${o}-radio-group--rtl`,this.themeClass,c&&`${o}-radio-group--button-group`],style:this.cssVars},h)}});export{Bn as N,qn as a,Jn as b,An as c,Mn as d,Qe as m,Zn as r,Yn as s};
