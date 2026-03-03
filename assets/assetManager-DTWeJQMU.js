import{ax as En,aN as Tn,r as N,e as Dn,o as X,c as dt,a as An,m as J,B as ne,H as Fe,I as Qt,s as oe,z as gt,v as mt,q as On,t as Be,R as _n,j as fe,g as $n,w as Nn,h as Lt,l as Fn,b as Ht,n as he,i as Bn,aO as Mn,aP as Zn,aq as k,aw as T}from"./index-CwuuWMbN.js";function Ci(){const t=N(typeof window<"u"?window.innerWidth>=1024:!0);function e(){t.value=window.innerWidth>=1024}return En(()=>window.addEventListener("resize",e)),Tn(()=>window.removeEventListener("resize",e)),{isDesktop:t}}var Me={name:"SpinnerIcon",extends:Dn};function zn(t){return Hn(t)||Ln(t)||Un(t)||jn()}function jn(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function Un(t,e){if(t){if(typeof t=="string")return Kt(t,e);var n={}.toString.call(t).slice(8,-1);return n==="Object"&&t.constructor&&(n=t.constructor.name),n==="Map"||n==="Set"?Array.from(t):n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?Kt(t,e):void 0}}function Ln(t){if(typeof Symbol<"u"&&t[Symbol.iterator]!=null||t["@@iterator"]!=null)return Array.from(t)}function Hn(t){if(Array.isArray(t))return Kt(t)}function Kt(t,e){(e==null||e>t.length)&&(e=t.length);for(var n=0,o=Array(e);n<e;n++)o[n]=t[n];return o}function Jn(t,e,n,o,r,i){return X(),dt("svg",J({width:"14",height:"14",viewBox:"0 0 14 14",fill:"none",xmlns:"http://www.w3.org/2000/svg"},t.pti()),zn(e[0]||(e[0]=[An("path",{d:"M6.99701 14C5.85441 13.999 4.72939 13.7186 3.72012 13.1832C2.71084 12.6478 1.84795 11.8737 1.20673 10.9284C0.565504 9.98305 0.165424 8.89526 0.041387 7.75989C-0.0826496 6.62453 0.073125 5.47607 0.495122 4.4147C0.917119 3.35333 1.59252 2.4113 2.46241 1.67077C3.33229 0.930247 4.37024 0.413729 5.4857 0.166275C6.60117 -0.0811796 7.76026 -0.0520535 8.86188 0.251112C9.9635 0.554278 10.9742 1.12227 11.8057 1.90555C11.915 2.01493 11.9764 2.16319 11.9764 2.31778C11.9764 2.47236 11.915 2.62062 11.8057 2.73C11.7521 2.78503 11.688 2.82877 11.6171 2.85864C11.5463 2.8885 11.4702 2.90389 11.3933 2.90389C11.3165 2.90389 11.2404 2.8885 11.1695 2.85864C11.0987 2.82877 11.0346 2.78503 10.9809 2.73C9.9998 1.81273 8.73246 1.26138 7.39226 1.16876C6.05206 1.07615 4.72086 1.44794 3.62279 2.22152C2.52471 2.99511 1.72683 4.12325 1.36345 5.41602C1.00008 6.70879 1.09342 8.08723 1.62775 9.31926C2.16209 10.5513 3.10478 11.5617 4.29713 12.1803C5.48947 12.7989 6.85865 12.988 8.17414 12.7157C9.48963 12.4435 10.6711 11.7264 11.5196 10.6854C12.3681 9.64432 12.8319 8.34282 12.8328 7C12.8328 6.84529 12.8943 6.69692 13.0038 6.58752C13.1132 6.47812 13.2616 6.41667 13.4164 6.41667C13.5712 6.41667 13.7196 6.47812 13.8291 6.58752C13.9385 6.69692 14 6.84529 14 7C14 8.85651 13.2622 10.637 11.9489 11.9497C10.6356 13.2625 8.85432 14 6.99701 14Z",fill:"currentColor"},null,-1)])),16)}Me.render=Jn;var Wn=`
    .p-badge {
        display: inline-flex;
        border-radius: dt('badge.border.radius');
        align-items: center;
        justify-content: center;
        padding: dt('badge.padding');
        background: dt('badge.primary.background');
        color: dt('badge.primary.color');
        font-size: dt('badge.font.size');
        font-weight: dt('badge.font.weight');
        min-width: dt('badge.min.width');
        height: dt('badge.height');
    }

    .p-badge-dot {
        width: dt('badge.dot.size');
        min-width: dt('badge.dot.size');
        height: dt('badge.dot.size');
        border-radius: 50%;
        padding: 0;
    }

    .p-badge-circle {
        padding: 0;
        border-radius: 50%;
    }

    .p-badge-secondary {
        background: dt('badge.secondary.background');
        color: dt('badge.secondary.color');
    }

    .p-badge-success {
        background: dt('badge.success.background');
        color: dt('badge.success.color');
    }

    .p-badge-info {
        background: dt('badge.info.background');
        color: dt('badge.info.color');
    }

    .p-badge-warn {
        background: dt('badge.warn.background');
        color: dt('badge.warn.color');
    }

    .p-badge-danger {
        background: dt('badge.danger.background');
        color: dt('badge.danger.color');
    }

    .p-badge-contrast {
        background: dt('badge.contrast.background');
        color: dt('badge.contrast.color');
    }

    .p-badge-sm {
        font-size: dt('badge.sm.font.size');
        min-width: dt('badge.sm.min.width');
        height: dt('badge.sm.height');
    }

    .p-badge-lg {
        font-size: dt('badge.lg.font.size');
        min-width: dt('badge.lg.min.width');
        height: dt('badge.lg.height');
    }

    .p-badge-xl {
        font-size: dt('badge.xl.font.size');
        min-width: dt('badge.xl.min.width');
        height: dt('badge.xl.height');
    }
`,Vn={root:function(e){var n=e.props,o=e.instance;return["p-badge p-component",{"p-badge-circle":Qt(n.value)&&String(n.value).length===1,"p-badge-dot":Fe(n.value)&&!o.$slots.default,"p-badge-sm":n.size==="small","p-badge-lg":n.size==="large","p-badge-xl":n.size==="xlarge","p-badge-info":n.severity==="info","p-badge-success":n.severity==="success","p-badge-warn":n.severity==="warn","p-badge-danger":n.severity==="danger","p-badge-secondary":n.severity==="secondary","p-badge-contrast":n.severity==="contrast"}]}},Gn=ne.extend({name:"badge",style:Wn,classes:Vn}),qn={name:"BaseBadge",extends:oe,props:{value:{type:[String,Number],default:null},severity:{type:String,default:null},size:{type:String,default:null}},style:Gn,provide:function(){return{$pcBadge:this,$parentInstance:this}}};function yt(t){"@babel/helpers - typeof";return yt=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(e){return typeof e}:function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},yt(t)}function me(t,e,n){return(e=Qn(e))in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function Qn(t){var e=Kn(t,"string");return yt(e)=="symbol"?e:e+""}function Kn(t,e){if(yt(t)!="object"||!t)return t;var n=t[Symbol.toPrimitive];if(n!==void 0){var o=n.call(t,e);if(yt(o)!="object")return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}var Ze={name:"Badge",extends:qn,inheritAttrs:!1,computed:{dataP:function(){return gt(me(me({circle:this.value!=null&&String(this.value).length===1,empty:this.value==null&&!this.$slots.default},this.severity,this.severity),this.size,this.size))}}},Xn=["data-p"];function Yn(t,e,n,o,r,i){return X(),dt("span",J({class:t.cx("root"),"data-p":i.dataP},t.ptmi("root")),[mt(t.$slots,"default",{},function(){return[On(Be(t.value),1)]})],16,Xn)}Ze.render=Yn;var to=`
    .p-button {
        display: inline-flex;
        cursor: pointer;
        user-select: none;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        position: relative;
        color: dt('button.primary.color');
        background: dt('button.primary.background');
        border: 1px solid dt('button.primary.border.color');
        padding: dt('button.padding.y') dt('button.padding.x');
        font-size: 1rem;
        font-family: inherit;
        font-feature-settings: inherit;
        transition:
            background dt('button.transition.duration'),
            color dt('button.transition.duration'),
            border-color dt('button.transition.duration'),
            outline-color dt('button.transition.duration'),
            box-shadow dt('button.transition.duration');
        border-radius: dt('button.border.radius');
        outline-color: transparent;
        gap: dt('button.gap');
    }

    .p-button:disabled {
        cursor: default;
    }

    .p-button-icon-right {
        order: 1;
    }

    .p-button-icon-right:dir(rtl) {
        order: -1;
    }

    .p-button:not(.p-button-vertical) .p-button-icon:not(.p-button-icon-right):dir(rtl) {
        order: 1;
    }

    .p-button-icon-bottom {
        order: 2;
    }

    .p-button-icon-only {
        width: dt('button.icon.only.width');
        padding-inline-start: 0;
        padding-inline-end: 0;
        gap: 0;
    }

    .p-button-icon-only.p-button-rounded {
        border-radius: 50%;
        height: dt('button.icon.only.width');
    }

    .p-button-icon-only .p-button-label {
        visibility: hidden;
        width: 0;
    }

    .p-button-icon-only::after {
        content: " ";
        visibility: hidden;
        width: 0;
    }

    .p-button-sm {
        font-size: dt('button.sm.font.size');
        padding: dt('button.sm.padding.y') dt('button.sm.padding.x');
    }

    .p-button-sm .p-button-icon {
        font-size: dt('button.sm.font.size');
    }

    .p-button-sm.p-button-icon-only {
        width: dt('button.sm.icon.only.width');
    }

    .p-button-sm.p-button-icon-only.p-button-rounded {
        height: dt('button.sm.icon.only.width');
    }

    .p-button-lg {
        font-size: dt('button.lg.font.size');
        padding: dt('button.lg.padding.y') dt('button.lg.padding.x');
    }

    .p-button-lg .p-button-icon {
        font-size: dt('button.lg.font.size');
    }

    .p-button-lg.p-button-icon-only {
        width: dt('button.lg.icon.only.width');
    }

    .p-button-lg.p-button-icon-only.p-button-rounded {
        height: dt('button.lg.icon.only.width');
    }

    .p-button-vertical {
        flex-direction: column;
    }

    .p-button-label {
        font-weight: dt('button.label.font.weight');
    }

    .p-button-fluid {
        width: 100%;
    }

    .p-button-fluid.p-button-icon-only {
        width: dt('button.icon.only.width');
    }

    .p-button:not(:disabled):hover {
        background: dt('button.primary.hover.background');
        border: 1px solid dt('button.primary.hover.border.color');
        color: dt('button.primary.hover.color');
    }

    .p-button:not(:disabled):active {
        background: dt('button.primary.active.background');
        border: 1px solid dt('button.primary.active.border.color');
        color: dt('button.primary.active.color');
    }

    .p-button:focus-visible {
        box-shadow: dt('button.primary.focus.ring.shadow');
        outline: dt('button.focus.ring.width') dt('button.focus.ring.style') dt('button.primary.focus.ring.color');
        outline-offset: dt('button.focus.ring.offset');
    }

    .p-button .p-badge {
        min-width: dt('button.badge.size');
        height: dt('button.badge.size');
        line-height: dt('button.badge.size');
    }

    .p-button-raised {
        box-shadow: dt('button.raised.shadow');
    }

    .p-button-rounded {
        border-radius: dt('button.rounded.border.radius');
    }

    .p-button-secondary {
        background: dt('button.secondary.background');
        border: 1px solid dt('button.secondary.border.color');
        color: dt('button.secondary.color');
    }

    .p-button-secondary:not(:disabled):hover {
        background: dt('button.secondary.hover.background');
        border: 1px solid dt('button.secondary.hover.border.color');
        color: dt('button.secondary.hover.color');
    }

    .p-button-secondary:not(:disabled):active {
        background: dt('button.secondary.active.background');
        border: 1px solid dt('button.secondary.active.border.color');
        color: dt('button.secondary.active.color');
    }

    .p-button-secondary:focus-visible {
        outline-color: dt('button.secondary.focus.ring.color');
        box-shadow: dt('button.secondary.focus.ring.shadow');
    }

    .p-button-success {
        background: dt('button.success.background');
        border: 1px solid dt('button.success.border.color');
        color: dt('button.success.color');
    }

    .p-button-success:not(:disabled):hover {
        background: dt('button.success.hover.background');
        border: 1px solid dt('button.success.hover.border.color');
        color: dt('button.success.hover.color');
    }

    .p-button-success:not(:disabled):active {
        background: dt('button.success.active.background');
        border: 1px solid dt('button.success.active.border.color');
        color: dt('button.success.active.color');
    }

    .p-button-success:focus-visible {
        outline-color: dt('button.success.focus.ring.color');
        box-shadow: dt('button.success.focus.ring.shadow');
    }

    .p-button-info {
        background: dt('button.info.background');
        border: 1px solid dt('button.info.border.color');
        color: dt('button.info.color');
    }

    .p-button-info:not(:disabled):hover {
        background: dt('button.info.hover.background');
        border: 1px solid dt('button.info.hover.border.color');
        color: dt('button.info.hover.color');
    }

    .p-button-info:not(:disabled):active {
        background: dt('button.info.active.background');
        border: 1px solid dt('button.info.active.border.color');
        color: dt('button.info.active.color');
    }

    .p-button-info:focus-visible {
        outline-color: dt('button.info.focus.ring.color');
        box-shadow: dt('button.info.focus.ring.shadow');
    }

    .p-button-warn {
        background: dt('button.warn.background');
        border: 1px solid dt('button.warn.border.color');
        color: dt('button.warn.color');
    }

    .p-button-warn:not(:disabled):hover {
        background: dt('button.warn.hover.background');
        border: 1px solid dt('button.warn.hover.border.color');
        color: dt('button.warn.hover.color');
    }

    .p-button-warn:not(:disabled):active {
        background: dt('button.warn.active.background');
        border: 1px solid dt('button.warn.active.border.color');
        color: dt('button.warn.active.color');
    }

    .p-button-warn:focus-visible {
        outline-color: dt('button.warn.focus.ring.color');
        box-shadow: dt('button.warn.focus.ring.shadow');
    }

    .p-button-help {
        background: dt('button.help.background');
        border: 1px solid dt('button.help.border.color');
        color: dt('button.help.color');
    }

    .p-button-help:not(:disabled):hover {
        background: dt('button.help.hover.background');
        border: 1px solid dt('button.help.hover.border.color');
        color: dt('button.help.hover.color');
    }

    .p-button-help:not(:disabled):active {
        background: dt('button.help.active.background');
        border: 1px solid dt('button.help.active.border.color');
        color: dt('button.help.active.color');
    }

    .p-button-help:focus-visible {
        outline-color: dt('button.help.focus.ring.color');
        box-shadow: dt('button.help.focus.ring.shadow');
    }

    .p-button-danger {
        background: dt('button.danger.background');
        border: 1px solid dt('button.danger.border.color');
        color: dt('button.danger.color');
    }

    .p-button-danger:not(:disabled):hover {
        background: dt('button.danger.hover.background');
        border: 1px solid dt('button.danger.hover.border.color');
        color: dt('button.danger.hover.color');
    }

    .p-button-danger:not(:disabled):active {
        background: dt('button.danger.active.background');
        border: 1px solid dt('button.danger.active.border.color');
        color: dt('button.danger.active.color');
    }

    .p-button-danger:focus-visible {
        outline-color: dt('button.danger.focus.ring.color');
        box-shadow: dt('button.danger.focus.ring.shadow');
    }

    .p-button-contrast {
        background: dt('button.contrast.background');
        border: 1px solid dt('button.contrast.border.color');
        color: dt('button.contrast.color');
    }

    .p-button-contrast:not(:disabled):hover {
        background: dt('button.contrast.hover.background');
        border: 1px solid dt('button.contrast.hover.border.color');
        color: dt('button.contrast.hover.color');
    }

    .p-button-contrast:not(:disabled):active {
        background: dt('button.contrast.active.background');
        border: 1px solid dt('button.contrast.active.border.color');
        color: dt('button.contrast.active.color');
    }

    .p-button-contrast:focus-visible {
        outline-color: dt('button.contrast.focus.ring.color');
        box-shadow: dt('button.contrast.focus.ring.shadow');
    }

    .p-button-outlined {
        background: transparent;
        border-color: dt('button.outlined.primary.border.color');
        color: dt('button.outlined.primary.color');
    }

    .p-button-outlined:not(:disabled):hover {
        background: dt('button.outlined.primary.hover.background');
        border-color: dt('button.outlined.primary.border.color');
        color: dt('button.outlined.primary.color');
    }

    .p-button-outlined:not(:disabled):active {
        background: dt('button.outlined.primary.active.background');
        border-color: dt('button.outlined.primary.border.color');
        color: dt('button.outlined.primary.color');
    }

    .p-button-outlined.p-button-secondary {
        border-color: dt('button.outlined.secondary.border.color');
        color: dt('button.outlined.secondary.color');
    }

    .p-button-outlined.p-button-secondary:not(:disabled):hover {
        background: dt('button.outlined.secondary.hover.background');
        border-color: dt('button.outlined.secondary.border.color');
        color: dt('button.outlined.secondary.color');
    }

    .p-button-outlined.p-button-secondary:not(:disabled):active {
        background: dt('button.outlined.secondary.active.background');
        border-color: dt('button.outlined.secondary.border.color');
        color: dt('button.outlined.secondary.color');
    }

    .p-button-outlined.p-button-success {
        border-color: dt('button.outlined.success.border.color');
        color: dt('button.outlined.success.color');
    }

    .p-button-outlined.p-button-success:not(:disabled):hover {
        background: dt('button.outlined.success.hover.background');
        border-color: dt('button.outlined.success.border.color');
        color: dt('button.outlined.success.color');
    }

    .p-button-outlined.p-button-success:not(:disabled):active {
        background: dt('button.outlined.success.active.background');
        border-color: dt('button.outlined.success.border.color');
        color: dt('button.outlined.success.color');
    }

    .p-button-outlined.p-button-info {
        border-color: dt('button.outlined.info.border.color');
        color: dt('button.outlined.info.color');
    }

    .p-button-outlined.p-button-info:not(:disabled):hover {
        background: dt('button.outlined.info.hover.background');
        border-color: dt('button.outlined.info.border.color');
        color: dt('button.outlined.info.color');
    }

    .p-button-outlined.p-button-info:not(:disabled):active {
        background: dt('button.outlined.info.active.background');
        border-color: dt('button.outlined.info.border.color');
        color: dt('button.outlined.info.color');
    }

    .p-button-outlined.p-button-warn {
        border-color: dt('button.outlined.warn.border.color');
        color: dt('button.outlined.warn.color');
    }

    .p-button-outlined.p-button-warn:not(:disabled):hover {
        background: dt('button.outlined.warn.hover.background');
        border-color: dt('button.outlined.warn.border.color');
        color: dt('button.outlined.warn.color');
    }

    .p-button-outlined.p-button-warn:not(:disabled):active {
        background: dt('button.outlined.warn.active.background');
        border-color: dt('button.outlined.warn.border.color');
        color: dt('button.outlined.warn.color');
    }

    .p-button-outlined.p-button-help {
        border-color: dt('button.outlined.help.border.color');
        color: dt('button.outlined.help.color');
    }

    .p-button-outlined.p-button-help:not(:disabled):hover {
        background: dt('button.outlined.help.hover.background');
        border-color: dt('button.outlined.help.border.color');
        color: dt('button.outlined.help.color');
    }

    .p-button-outlined.p-button-help:not(:disabled):active {
        background: dt('button.outlined.help.active.background');
        border-color: dt('button.outlined.help.border.color');
        color: dt('button.outlined.help.color');
    }

    .p-button-outlined.p-button-danger {
        border-color: dt('button.outlined.danger.border.color');
        color: dt('button.outlined.danger.color');
    }

    .p-button-outlined.p-button-danger:not(:disabled):hover {
        background: dt('button.outlined.danger.hover.background');
        border-color: dt('button.outlined.danger.border.color');
        color: dt('button.outlined.danger.color');
    }

    .p-button-outlined.p-button-danger:not(:disabled):active {
        background: dt('button.outlined.danger.active.background');
        border-color: dt('button.outlined.danger.border.color');
        color: dt('button.outlined.danger.color');
    }

    .p-button-outlined.p-button-contrast {
        border-color: dt('button.outlined.contrast.border.color');
        color: dt('button.outlined.contrast.color');
    }

    .p-button-outlined.p-button-contrast:not(:disabled):hover {
        background: dt('button.outlined.contrast.hover.background');
        border-color: dt('button.outlined.contrast.border.color');
        color: dt('button.outlined.contrast.color');
    }

    .p-button-outlined.p-button-contrast:not(:disabled):active {
        background: dt('button.outlined.contrast.active.background');
        border-color: dt('button.outlined.contrast.border.color');
        color: dt('button.outlined.contrast.color');
    }

    .p-button-outlined.p-button-plain {
        border-color: dt('button.outlined.plain.border.color');
        color: dt('button.outlined.plain.color');
    }

    .p-button-outlined.p-button-plain:not(:disabled):hover {
        background: dt('button.outlined.plain.hover.background');
        border-color: dt('button.outlined.plain.border.color');
        color: dt('button.outlined.plain.color');
    }

    .p-button-outlined.p-button-plain:not(:disabled):active {
        background: dt('button.outlined.plain.active.background');
        border-color: dt('button.outlined.plain.border.color');
        color: dt('button.outlined.plain.color');
    }

    .p-button-text {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.primary.color');
    }

    .p-button-text:not(:disabled):hover {
        background: dt('button.text.primary.hover.background');
        border-color: transparent;
        color: dt('button.text.primary.color');
    }

    .p-button-text:not(:disabled):active {
        background: dt('button.text.primary.active.background');
        border-color: transparent;
        color: dt('button.text.primary.color');
    }

    .p-button-text.p-button-secondary {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.secondary.color');
    }

    .p-button-text.p-button-secondary:not(:disabled):hover {
        background: dt('button.text.secondary.hover.background');
        border-color: transparent;
        color: dt('button.text.secondary.color');
    }

    .p-button-text.p-button-secondary:not(:disabled):active {
        background: dt('button.text.secondary.active.background');
        border-color: transparent;
        color: dt('button.text.secondary.color');
    }

    .p-button-text.p-button-success {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.success.color');
    }

    .p-button-text.p-button-success:not(:disabled):hover {
        background: dt('button.text.success.hover.background');
        border-color: transparent;
        color: dt('button.text.success.color');
    }

    .p-button-text.p-button-success:not(:disabled):active {
        background: dt('button.text.success.active.background');
        border-color: transparent;
        color: dt('button.text.success.color');
    }

    .p-button-text.p-button-info {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.info.color');
    }

    .p-button-text.p-button-info:not(:disabled):hover {
        background: dt('button.text.info.hover.background');
        border-color: transparent;
        color: dt('button.text.info.color');
    }

    .p-button-text.p-button-info:not(:disabled):active {
        background: dt('button.text.info.active.background');
        border-color: transparent;
        color: dt('button.text.info.color');
    }

    .p-button-text.p-button-warn {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.warn.color');
    }

    .p-button-text.p-button-warn:not(:disabled):hover {
        background: dt('button.text.warn.hover.background');
        border-color: transparent;
        color: dt('button.text.warn.color');
    }

    .p-button-text.p-button-warn:not(:disabled):active {
        background: dt('button.text.warn.active.background');
        border-color: transparent;
        color: dt('button.text.warn.color');
    }

    .p-button-text.p-button-help {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.help.color');
    }

    .p-button-text.p-button-help:not(:disabled):hover {
        background: dt('button.text.help.hover.background');
        border-color: transparent;
        color: dt('button.text.help.color');
    }

    .p-button-text.p-button-help:not(:disabled):active {
        background: dt('button.text.help.active.background');
        border-color: transparent;
        color: dt('button.text.help.color');
    }

    .p-button-text.p-button-danger {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.danger.color');
    }

    .p-button-text.p-button-danger:not(:disabled):hover {
        background: dt('button.text.danger.hover.background');
        border-color: transparent;
        color: dt('button.text.danger.color');
    }

    .p-button-text.p-button-danger:not(:disabled):active {
        background: dt('button.text.danger.active.background');
        border-color: transparent;
        color: dt('button.text.danger.color');
    }

    .p-button-text.p-button-contrast {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.contrast.color');
    }

    .p-button-text.p-button-contrast:not(:disabled):hover {
        background: dt('button.text.contrast.hover.background');
        border-color: transparent;
        color: dt('button.text.contrast.color');
    }

    .p-button-text.p-button-contrast:not(:disabled):active {
        background: dt('button.text.contrast.active.background');
        border-color: transparent;
        color: dt('button.text.contrast.color');
    }

    .p-button-text.p-button-plain {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.plain.color');
    }

    .p-button-text.p-button-plain:not(:disabled):hover {
        background: dt('button.text.plain.hover.background');
        border-color: transparent;
        color: dt('button.text.plain.color');
    }

    .p-button-text.p-button-plain:not(:disabled):active {
        background: dt('button.text.plain.active.background');
        border-color: transparent;
        color: dt('button.text.plain.color');
    }

    .p-button-link {
        background: transparent;
        border-color: transparent;
        color: dt('button.link.color');
    }

    .p-button-link:not(:disabled):hover {
        background: transparent;
        border-color: transparent;
        color: dt('button.link.hover.color');
    }

    .p-button-link:not(:disabled):hover .p-button-label {
        text-decoration: underline;
    }

    .p-button-link:not(:disabled):active {
        background: transparent;
        border-color: transparent;
        color: dt('button.link.active.color');
    }
`;function vt(t){"@babel/helpers - typeof";return vt=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(e){return typeof e}:function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},vt(t)}function q(t,e,n){return(e=eo(e))in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function eo(t){var e=no(t,"string");return vt(e)=="symbol"?e:e+""}function no(t,e){if(vt(t)!="object"||!t)return t;var n=t[Symbol.toPrimitive];if(n!==void 0){var o=n.call(t,e);if(vt(o)!="object")return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}var oo={root:function(e){var n=e.instance,o=e.props;return["p-button p-component",q(q(q(q(q(q(q(q(q({"p-button-icon-only":n.hasIcon&&!o.label&&!o.badge,"p-button-vertical":(o.iconPos==="top"||o.iconPos==="bottom")&&o.label,"p-button-loading":o.loading,"p-button-link":o.link||o.variant==="link"},"p-button-".concat(o.severity),o.severity),"p-button-raised",o.raised),"p-button-rounded",o.rounded),"p-button-text",o.text||o.variant==="text"),"p-button-outlined",o.outlined||o.variant==="outlined"),"p-button-sm",o.size==="small"),"p-button-lg",o.size==="large"),"p-button-plain",o.plain),"p-button-fluid",n.hasFluid)]},loadingIcon:"p-button-loading-icon",icon:function(e){var n=e.props;return["p-button-icon",q({},"p-button-icon-".concat(n.iconPos),n.label)]},label:"p-button-label"},ro=ne.extend({name:"button",style:to,classes:oo}),io={name:"BaseButton",extends:oe,props:{label:{type:String,default:null},icon:{type:String,default:null},iconPos:{type:String,default:"left"},iconClass:{type:[String,Object],default:null},badge:{type:String,default:null},badgeClass:{type:[String,Object],default:null},badgeSeverity:{type:String,default:"secondary"},loading:{type:Boolean,default:!1},loadingIcon:{type:String,default:void 0},as:{type:[String,Object],default:"BUTTON"},asChild:{type:Boolean,default:!1},link:{type:Boolean,default:!1},severity:{type:String,default:null},raised:{type:Boolean,default:!1},rounded:{type:Boolean,default:!1},text:{type:Boolean,default:!1},outlined:{type:Boolean,default:!1},size:{type:String,default:null},variant:{type:String,default:null},plain:{type:Boolean,default:!1},fluid:{type:Boolean,default:null}},style:ro,provide:function(){return{$pcButton:this,$parentInstance:this}}};function wt(t){"@babel/helpers - typeof";return wt=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(e){return typeof e}:function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},wt(t)}function M(t,e,n){return(e=so(e))in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function so(t){var e=ao(t,"string");return wt(e)=="symbol"?e:e+""}function ao(t,e){if(wt(t)!="object"||!t)return t;var n=t[Symbol.toPrimitive];if(n!==void 0){var o=n.call(t,e);if(wt(o)!="object")return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}var uo={name:"Button",extends:io,inheritAttrs:!1,inject:{$pcFluid:{default:null}},methods:{getPTOptions:function(e){var n=e==="root"?this.ptmi:this.ptm;return n(e,{context:{disabled:this.disabled}})}},computed:{disabled:function(){return this.$attrs.disabled||this.$attrs.disabled===""||this.loading},defaultAriaLabel:function(){return this.label?this.label+(this.badge?" "+this.badge:""):this.$attrs.ariaLabel},hasIcon:function(){return this.icon||this.$slots.icon},attrs:function(){return J(this.asAttrs,this.a11yAttrs,this.getPTOptions("root"))},asAttrs:function(){return this.as==="BUTTON"?{type:"button",disabled:this.disabled}:void 0},a11yAttrs:function(){return{"aria-label":this.defaultAriaLabel,"data-pc-name":"button","data-p-disabled":this.disabled,"data-p-severity":this.severity}},hasFluid:function(){return Fe(this.fluid)?!!this.$pcFluid:this.fluid},dataP:function(){return gt(M(M(M(M(M(M(M(M(M(M({},this.size,this.size),"icon-only",this.hasIcon&&!this.label&&!this.badge),"loading",this.loading),"fluid",this.hasFluid),"rounded",this.rounded),"raised",this.raised),"outlined",this.outlined||this.variant==="outlined"),"text",this.text||this.variant==="text"),"link",this.link||this.variant==="link"),"vertical",(this.iconPos==="top"||this.iconPos==="bottom")&&this.label))},dataIconP:function(){return gt(M(M({},this.iconPos,this.iconPos),this.size,this.size))},dataLabelP:function(){return gt(M(M({},this.size,this.size),"icon-only",this.hasIcon&&!this.label&&!this.badge))}},components:{SpinnerIcon:Me,Badge:Ze},directives:{ripple:_n}},lo=["data-p"],co=["data-p"];function bo(t,e,n,o,r,i){var s=fe("SpinnerIcon"),l=fe("Badge"),g=$n("ripple");return t.asChild?mt(t.$slots,"default",{key:1,class:he(t.cx("root")),a11yAttrs:i.a11yAttrs}):Nn((X(),Lt(Bn(t.as),J({key:0,class:t.cx("root"),"data-p":i.dataP},i.attrs),{default:Fn(function(){return[mt(t.$slots,"default",{},function(){return[t.loading?mt(t.$slots,"loadingicon",J({key:0,class:[t.cx("loadingIcon"),t.cx("icon")]},t.ptm("loadingIcon")),function(){return[t.loadingIcon?(X(),dt("span",J({key:0,class:[t.cx("loadingIcon"),t.cx("icon"),t.loadingIcon]},t.ptm("loadingIcon")),null,16)):(X(),Lt(s,J({key:1,class:[t.cx("loadingIcon"),t.cx("icon")],spin:""},t.ptm("loadingIcon")),null,16,["class"]))]}):mt(t.$slots,"icon",J({key:1,class:[t.cx("icon")]},t.ptm("icon")),function(){return[t.icon?(X(),dt("span",J({key:0,class:[t.cx("icon"),t.icon,t.iconClass],"data-p":i.dataIconP},t.ptm("icon")),null,16,lo)):Ht("",!0)]}),t.label?(X(),dt("span",J({key:2,class:t.cx("label")},t.ptm("label"),{"data-p":i.dataLabelP}),Be(t.label),17,co)):Ht("",!0),t.badge?(X(),Lt(l,{key:3,value:t.badge,class:he(t.badgeClass),severity:t.badgeSeverity,unstyled:t.unstyled,pt:t.ptm("pcBadge")},null,8,["value","class","severity","unstyled","pt"])):Ht("",!0)]})]}),_:3},16,["class","data-p"])),[[g]])}uo.render=bo;var po={name:"BaseEditableHolder",extends:oe,emits:["update:modelValue","value-change"],props:{modelValue:{type:null,default:void 0},defaultValue:{type:null,default:void 0},name:{type:String,default:void 0},invalid:{type:Boolean,default:void 0},disabled:{type:Boolean,default:!1},formControl:{type:Object,default:void 0}},inject:{$parentInstance:{default:void 0},$pcForm:{default:void 0},$pcFormField:{default:void 0}},data:function(){return{d_value:this.defaultValue!==void 0?this.defaultValue:this.modelValue}},watch:{modelValue:{deep:!0,handler:function(e){this.d_value=e}},defaultValue:function(e){this.d_value=e},$formName:{immediate:!0,handler:function(e){var n,o;this.formField=((n=this.$pcForm)===null||n===void 0||(o=n.register)===null||o===void 0?void 0:o.call(n,e,this.$formControl))||{}}},$formControl:{immediate:!0,handler:function(e){var n,o;this.formField=((n=this.$pcForm)===null||n===void 0||(o=n.register)===null||o===void 0?void 0:o.call(n,this.$formName,e))||{}}},$formDefaultValue:{immediate:!0,handler:function(e){this.d_value!==e&&(this.d_value=e)}},$formValue:{immediate:!1,handler:function(e){var n;(n=this.$pcForm)!==null&&n!==void 0&&n.getFieldState(this.$formName)&&e!==this.d_value&&(this.d_value=e)}}},formField:{},methods:{writeValue:function(e,n){var o,r;this.controlled&&(this.d_value=e,this.$emit("update:modelValue",e)),this.$emit("value-change",e),(o=(r=this.formField).onChange)===null||o===void 0||o.call(r,{originalEvent:n,value:e})},findNonEmpty:function(){for(var e=arguments.length,n=new Array(e),o=0;o<e;o++)n[o]=arguments[o];return n.find(Qt)}},computed:{$filled:function(){return Qt(this.d_value)},$invalid:function(){var e,n;return!this.$formNovalidate&&this.findNonEmpty(this.invalid,(e=this.$pcFormField)===null||e===void 0||(e=e.$field)===null||e===void 0?void 0:e.invalid,(n=this.$pcForm)===null||n===void 0||(n=n.getFieldState(this.$formName))===null||n===void 0?void 0:n.invalid)},$formName:function(){var e;return this.$formNovalidate?void 0:this.name||((e=this.$formControl)===null||e===void 0?void 0:e.name)},$formControl:function(){var e;return this.formControl||((e=this.$pcFormField)===null||e===void 0?void 0:e.formControl)},$formNovalidate:function(){var e;return(e=this.$formControl)===null||e===void 0?void 0:e.novalidate},$formDefaultValue:function(){var e,n;return this.findNonEmpty(this.d_value,(e=this.$pcFormField)===null||e===void 0?void 0:e.initialValue,(n=this.$pcForm)===null||n===void 0||(n=n.initialValues)===null||n===void 0?void 0:n[this.$formName])},$formValue:function(){var e,n;return this.findNonEmpty((e=this.$pcFormField)===null||e===void 0||(e=e.$field)===null||e===void 0?void 0:e.value,(n=this.$pcForm)===null||n===void 0||(n=n.getFieldState(this.$formName))===null||n===void 0?void 0:n.value)},controlled:function(){return this.$inProps.hasOwnProperty("modelValue")||!this.$inProps.hasOwnProperty("modelValue")&&!this.$inProps.hasOwnProperty("defaultValue")},filled:function(){return this.$filled}}},fo={name:"BaseInput",extends:po,props:{size:{type:String,default:null},fluid:{type:Boolean,default:null},variant:{type:String,default:null}},inject:{$parentInstance:{default:void 0},$pcFluid:{default:void 0}},computed:{$variant:function(){var e;return(e=this.variant)!==null&&e!==void 0?e:this.$primevue.config.inputStyle||this.$primevue.config.inputVariant},$fluid:function(){var e;return(e=this.fluid)!==null&&e!==void 0?e:!!this.$pcFluid},hasFluid:function(){return this.$fluid}}},ho=`
    .p-inputtext {
        font-family: inherit;
        font-feature-settings: inherit;
        font-size: 1rem;
        color: dt('inputtext.color');
        background: dt('inputtext.background');
        padding-block: dt('inputtext.padding.y');
        padding-inline: dt('inputtext.padding.x');
        border: 1px solid dt('inputtext.border.color');
        transition:
            background dt('inputtext.transition.duration'),
            color dt('inputtext.transition.duration'),
            border-color dt('inputtext.transition.duration'),
            outline-color dt('inputtext.transition.duration'),
            box-shadow dt('inputtext.transition.duration');
        appearance: none;
        border-radius: dt('inputtext.border.radius');
        outline-color: transparent;
        box-shadow: dt('inputtext.shadow');
    }

    .p-inputtext:enabled:hover {
        border-color: dt('inputtext.hover.border.color');
    }

    .p-inputtext:enabled:focus {
        border-color: dt('inputtext.focus.border.color');
        box-shadow: dt('inputtext.focus.ring.shadow');
        outline: dt('inputtext.focus.ring.width') dt('inputtext.focus.ring.style') dt('inputtext.focus.ring.color');
        outline-offset: dt('inputtext.focus.ring.offset');
    }

    .p-inputtext.p-invalid {
        border-color: dt('inputtext.invalid.border.color');
    }

    .p-inputtext.p-variant-filled {
        background: dt('inputtext.filled.background');
    }

    .p-inputtext.p-variant-filled:enabled:hover {
        background: dt('inputtext.filled.hover.background');
    }

    .p-inputtext.p-variant-filled:enabled:focus {
        background: dt('inputtext.filled.focus.background');
    }

    .p-inputtext:disabled {
        opacity: 1;
        background: dt('inputtext.disabled.background');
        color: dt('inputtext.disabled.color');
    }

    .p-inputtext::placeholder {
        color: dt('inputtext.placeholder.color');
    }

    .p-inputtext.p-invalid::placeholder {
        color: dt('inputtext.invalid.placeholder.color');
    }

    .p-inputtext-sm {
        font-size: dt('inputtext.sm.font.size');
        padding-block: dt('inputtext.sm.padding.y');
        padding-inline: dt('inputtext.sm.padding.x');
    }

    .p-inputtext-lg {
        font-size: dt('inputtext.lg.font.size');
        padding-block: dt('inputtext.lg.padding.y');
        padding-inline: dt('inputtext.lg.padding.x');
    }

    .p-inputtext-fluid {
        width: 100%;
    }
`,mo={root:function(e){var n=e.instance,o=e.props;return["p-inputtext p-component",{"p-filled":n.$filled,"p-inputtext-sm p-inputfield-sm":o.size==="small","p-inputtext-lg p-inputfield-lg":o.size==="large","p-invalid":n.$invalid,"p-variant-filled":n.$variant==="filled","p-inputtext-fluid":n.$fluid}]}},go=ne.extend({name:"inputtext",style:ho,classes:mo}),yo={name:"BaseInputText",extends:fo,style:go,provide:function(){return{$pcInputText:this,$parentInstance:this}}};function It(t){"@babel/helpers - typeof";return It=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(e){return typeof e}:function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},It(t)}function vo(t,e,n){return(e=wo(e))in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function wo(t){var e=Io(t,"string");return It(e)=="symbol"?e:e+""}function Io(t,e){if(It(t)!="object"||!t)return t;var n=t[Symbol.toPrimitive];if(n!==void 0){var o=n.call(t,e);if(It(o)!="object")return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}var xo={name:"InputText",extends:yo,inheritAttrs:!1,methods:{onInput:function(e){this.writeValue(e.target.value,e)}},computed:{attrs:function(){return J(this.ptmi("root",{context:{filled:this.$filled,disabled:this.disabled}}),this.formField)},dataP:function(){return gt(vo({invalid:this.$invalid,fluid:this.$fluid,filled:this.$variant==="filled"},this.size,this.size))}}},So=["value","name","disabled","aria-invalid","data-p"];function Co(t,e,n,o,r,i){return X(),dt("input",J({type:"text",class:t.cx("root"),value:t.d_value,name:t.name,disabled:t.disabled,"aria-invalid":t.$invalid||void 0,"data-p":i.dataP,onInput:e[0]||(e[0]=function(){return i.onInput&&i.onInput.apply(i,arguments)})},i.attrs),null,16,So)}xo.render=Co;const Ri=["#0ea5e9","#f97316","#10b981","#8b5cf6","#f59e0b","#3b82f6","#14b8a6","#e11d48","#06b6d4","#84cc16"],lt="2020-01",Ro={TWD:"zh-TW",USD:"en-US",JPY:"ja-JP"},ko=new Intl.NumberFormat("zh-TW",{style:"currency",currency:"TWD",minimumFractionDigits:0,maximumFractionDigits:0});function Po(t,e){return new Intl.NumberFormat(Ro[e],{style:"currency",currency:e,minimumFractionDigits:0,maximumFractionDigits:0}).format(Math.round(t))}function ki(t){return ko.format(Math.round(t))}function Eo(t){return t===null?"N/A":`${Math.round(t)}%`}function To(){const t=new Date,e=t.getFullYear(),n=`${t.getMonth()+1}`.padStart(2,"0");return`${e}-${n}`}function Q(t){const[e,n]=t.split("-").map(o=>Number(o));return e*100+n}function ge(t){const[e,n]=t.split("-").map(o=>Number(o));return new Date(e,n-1,1).getTime()}function Do(t){const[e,n]=t.split("-").map(o=>Number(o));return new Date(e,n,0,23,59,59,999).getTime()}function ye(t){const e=new Date(t),n=e.getFullYear(),o=`${e.getMonth()+1}`.padStart(2,"0");return`${n}-${o}`}const Ao="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDQ4IDQ4IiBmaWxsPSJub25lIj4KICA8cmVjdCB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHJ4PSIxMiIgZmlsbD0iIzBGMTcyQSIvPgogIDx0ZXh0IHg9IjI0IiB5PSIzMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTIiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiI+Q0FUPC90ZXh0Pgo8L3N2Zz4K",Oo="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDQ4IDQ4IiBmaWxsPSJub25lIj4KICA8cmVjdCB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHJ4PSIxMiIgZmlsbD0iIzFFM0E1RiIvPgogIDx0ZXh0IHg9IjI0IiB5PSIzMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTIiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiI+Q0hCPC90ZXh0Pgo8L3N2Zz4K",_o="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDQ4IDQ4IiBmaWxsPSJub25lIj4KICA8cmVjdCB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHJ4PSIxMiIgZmlsbD0iIzFFNDBBRiIvPgogIDx0ZXh0IHg9IjI0IiB5PSIzMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTEiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiI+Q1RCQzwvdGV4dD4KPC9zdmc+Cg==",$o="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDQ4IDQ4IiBmaWxsPSJub25lIj4KICA8cmVjdCB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHJ4PSIxMiIgZmlsbD0iIzY0NzQ4QiIvPgogIDx0ZXh0IHg9IjI0IiB5PSIzMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiI+Qks8L3RleHQ+Cjwvc3ZnPgo=",No="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDQ4IDQ4IiBmaWxsPSJub25lIj4KICA8cmVjdCB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHJ4PSIxMiIgZmlsbD0iIzBGNzY2RSIvPgogIDx0ZXh0IHg9IjI0IiB5PSIzMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTIiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiI+RVM8L3RleHQ+Cjwvc3ZnPgo=",Fo="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDQ4IDQ4IiBmaWxsPSJub25lIj4KICA8cmVjdCB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHJ4PSIxMiIgZmlsbD0iIzFENEVEOCIvPgogIDx0ZXh0IHg9IjI0IiB5PSIzMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTMiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiI+RlQ8L3RleHQ+Cjwvc3ZnPgo=",Bo="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDQ4IDQ4IiBmaWxsPSJub25lIj4KICA8cmVjdCB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHJ4PSIxMiIgZmlsbD0iIzAwNkIzRiIvPgogIDx0ZXh0IHg9IjI0IiB5PSIzMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTIiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiI+RkJOPC90ZXh0Pgo8L3N2Zz4K",Mo="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDQ4IDQ4IiBmaWxsPSJub25lIj4KICA8cmVjdCB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHJ4PSIxMiIgZmlsbD0iIzAzNjlBMSIvPgogIDx0ZXh0IHg9IjI0IiB5PSIzMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTIiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiI+TlhUPC90ZXh0Pgo8L3N2Zz4K",Zo="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDQ4IDQ4IiBmaWxsPSJub25lIj4KICA8cmVjdCB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHJ4PSIxMiIgZmlsbD0iI0I5MUMxQyIvPgogIDx0ZXh0IHg9IjI0IiB5PSIzMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTIiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiI+TE48L3RleHQ+Cjwvc3ZnPgo=",zo="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDQ4IDQ4IiBmaWxsPSJub25lIj4KICA8cmVjdCB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHJ4PSIxMiIgZmlsbD0iIzE2QTM0QSIvPgogIDx0ZXh0IHg9IjI0IiB5PSIzMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTMiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiI+UE88L3RleHQ+Cjwvc3ZnPgo=",jo="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDQ4IDQ4IiBmaWxsPSJub25lIj4KICA8cmVjdCB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHJ4PSIxMiIgZmlsbD0iI0VBNTgwQyIvPgogIDx0ZXh0IHg9IjI0IiB5PSIzMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTIiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiI+VFM8L3RleHQ+Cjwvc3ZnPgo=",Uo=Object.assign({"../../../assets/banks/cathay.svg":Ao,"../../../assets/banks/chang-hwa.svg":Oo,"../../../assets/banks/ctbc.svg":_o,"../../../assets/banks/default.svg":$o,"../../../assets/banks/esun.svg":No,"../../../assets/banks/firstrade.svg":Fo,"../../../assets/banks/fubon.svg":Bo,"../../../assets/banks/future.svg":Mo,"../../../assets/banks/loan.svg":Zo,"../../../assets/banks/post-office.svg":zo,"../../../assets/banks/taishin.svg":jo}),Jt=Object.fromEntries(Object.entries(Uo).map(([t,e])=>[(t.split("/").pop()??"").replace(".svg",""),e])),Lo=[{pattern:/郵局|post/i,key:"post-office"},{pattern:/中信|中國信託|ctbc/i,key:"ctbc"},{pattern:/台新/i,key:"taishin"},{pattern:/玉山|esun/i,key:"esun"},{pattern:/彰銀|彰化|chang/i,key:"chang-hwa"},{pattern:/國泰|cathay/i,key:"cathay"},{pattern:/將來|future/i,key:"future"},{pattern:/富邦|fubon/i,key:"fubon"},{pattern:/firstrade|ft\s|ft$/i,key:"firstrade"},{pattern:/信貸|貸款|loan/i,key:"loan"}];function Ho(t){for(const e of Lo)if(e.pattern.test(t))return Jt[e.key]??Jt.default;return Jt.default}function ze(t,e){return function(){return t.apply(e,arguments)}}const{toString:Jo}=Object.prototype,{getPrototypeOf:re}=Object,{iterator:Bt,toStringTag:je}=Symbol,Mt=(t=>e=>{const n=Jo.call(e);return t[n]||(t[n]=n.slice(8,-1).toLowerCase())})(Object.create(null)),V=t=>(t=t.toLowerCase(),e=>Mt(e)===t),Zt=t=>e=>typeof e===t,{isArray:bt}=Array,ct=Zt("undefined");function xt(t){return t!==null&&!ct(t)&&t.constructor!==null&&!ct(t.constructor)&&Z(t.constructor.isBuffer)&&t.constructor.isBuffer(t)}const Ue=V("ArrayBuffer");function Wo(t){let e;return typeof ArrayBuffer<"u"&&ArrayBuffer.isView?e=ArrayBuffer.isView(t):e=t&&t.buffer&&Ue(t.buffer),e}const Vo=Zt("string"),Z=Zt("function"),Le=Zt("number"),St=t=>t!==null&&typeof t=="object",Go=t=>t===!0||t===!1,_t=t=>{if(Mt(t)!=="object")return!1;const e=re(t);return(e===null||e===Object.prototype||Object.getPrototypeOf(e)===null)&&!(je in t)&&!(Bt in t)},qo=t=>{if(!St(t)||xt(t))return!1;try{return Object.keys(t).length===0&&Object.getPrototypeOf(t)===Object.prototype}catch{return!1}},Qo=V("Date"),Ko=V("File"),Xo=t=>!!(t&&typeof t.uri<"u"),Yo=t=>t&&typeof t.getParts<"u",tr=V("Blob"),er=V("FileList"),nr=t=>St(t)&&Z(t.pipe);function or(){return typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{}}const ve=or(),we=typeof ve.FormData<"u"?ve.FormData:void 0,rr=t=>{let e;return t&&(we&&t instanceof we||Z(t.append)&&((e=Mt(t))==="formdata"||e==="object"&&Z(t.toString)&&t.toString()==="[object FormData]"))},ir=V("URLSearchParams"),[sr,ar,ur,lr]=["ReadableStream","Request","Response","Headers"].map(V),dr=t=>t.trim?t.trim():t.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,"");function Ct(t,e,{allOwnKeys:n=!1}={}){if(t===null||typeof t>"u")return;let o,r;if(typeof t!="object"&&(t=[t]),bt(t))for(o=0,r=t.length;o<r;o++)e.call(null,t[o],o,t);else{if(xt(t))return;const i=n?Object.getOwnPropertyNames(t):Object.keys(t),s=i.length;let l;for(o=0;o<s;o++)l=i[o],e.call(null,t[l],l,t)}}function He(t,e){if(xt(t))return null;e=e.toLowerCase();const n=Object.keys(t);let o=n.length,r;for(;o-- >0;)if(r=n[o],e===r.toLowerCase())return r;return null}const ot=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:global,Je=t=>!ct(t)&&t!==ot;function Xt(){const{caseless:t,skipUndefined:e}=Je(this)&&this||{},n={},o=(r,i)=>{if(i==="__proto__"||i==="constructor"||i==="prototype")return;const s=t&&He(n,i)||i;_t(n[s])&&_t(r)?n[s]=Xt(n[s],r):_t(r)?n[s]=Xt({},r):bt(r)?n[s]=r.slice():(!e||!ct(r))&&(n[s]=r)};for(let r=0,i=arguments.length;r<i;r++)arguments[r]&&Ct(arguments[r],o);return n}const cr=(t,e,n,{allOwnKeys:o}={})=>(Ct(e,(r,i)=>{n&&Z(r)?Object.defineProperty(t,i,{value:ze(r,n),writable:!0,enumerable:!0,configurable:!0}):Object.defineProperty(t,i,{value:r,writable:!0,enumerable:!0,configurable:!0})},{allOwnKeys:o}),t),br=t=>(t.charCodeAt(0)===65279&&(t=t.slice(1)),t),pr=(t,e,n,o)=>{t.prototype=Object.create(e.prototype,o),Object.defineProperty(t.prototype,"constructor",{value:t,writable:!0,enumerable:!1,configurable:!0}),Object.defineProperty(t,"super",{value:e.prototype}),n&&Object.assign(t.prototype,n)},fr=(t,e,n,o)=>{let r,i,s;const l={};if(e=e||{},t==null)return e;do{for(r=Object.getOwnPropertyNames(t),i=r.length;i-- >0;)s=r[i],(!o||o(s,t,e))&&!l[s]&&(e[s]=t[s],l[s]=!0);t=n!==!1&&re(t)}while(t&&(!n||n(t,e))&&t!==Object.prototype);return e},hr=(t,e,n)=>{t=String(t),(n===void 0||n>t.length)&&(n=t.length),n-=e.length;const o=t.indexOf(e,n);return o!==-1&&o===n},mr=t=>{if(!t)return null;if(bt(t))return t;let e=t.length;if(!Le(e))return null;const n=new Array(e);for(;e-- >0;)n[e]=t[e];return n},gr=(t=>e=>t&&e instanceof t)(typeof Uint8Array<"u"&&re(Uint8Array)),yr=(t,e)=>{const o=(t&&t[Bt]).call(t);let r;for(;(r=o.next())&&!r.done;){const i=r.value;e.call(t,i[0],i[1])}},vr=(t,e)=>{let n;const o=[];for(;(n=t.exec(e))!==null;)o.push(n);return o},wr=V("HTMLFormElement"),Ir=t=>t.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g,function(n,o,r){return o.toUpperCase()+r}),Ie=(({hasOwnProperty:t})=>(e,n)=>t.call(e,n))(Object.prototype),xr=V("RegExp"),We=(t,e)=>{const n=Object.getOwnPropertyDescriptors(t),o={};Ct(n,(r,i)=>{let s;(s=e(r,i,t))!==!1&&(o[i]=s||r)}),Object.defineProperties(t,o)},Sr=t=>{We(t,(e,n)=>{if(Z(t)&&["arguments","caller","callee"].indexOf(n)!==-1)return!1;const o=t[n];if(Z(o)){if(e.enumerable=!1,"writable"in e){e.writable=!1;return}e.set||(e.set=()=>{throw Error("Can not rewrite read-only method '"+n+"'")})}})},Cr=(t,e)=>{const n={},o=r=>{r.forEach(i=>{n[i]=!0})};return bt(t)?o(t):o(String(t).split(e)),n},Rr=()=>{},kr=(t,e)=>t!=null&&Number.isFinite(t=+t)?t:e;function Pr(t){return!!(t&&Z(t.append)&&t[je]==="FormData"&&t[Bt])}const Er=t=>{const e=new Array(10),n=(o,r)=>{if(St(o)){if(e.indexOf(o)>=0)return;if(xt(o))return o;if(!("toJSON"in o)){e[r]=o;const i=bt(o)?[]:{};return Ct(o,(s,l)=>{const g=n(s,r+1);!ct(g)&&(i[l]=g)}),e[r]=void 0,i}}return o};return n(t,0)},Tr=V("AsyncFunction"),Dr=t=>t&&(St(t)||Z(t))&&Z(t.then)&&Z(t.catch),Ve=((t,e)=>t?setImmediate:e?((n,o)=>(ot.addEventListener("message",({source:r,data:i})=>{r===ot&&i===n&&o.length&&o.shift()()},!1),r=>{o.push(r),ot.postMessage(n,"*")}))(`axios@${Math.random()}`,[]):n=>setTimeout(n))(typeof setImmediate=="function",Z(ot.postMessage)),Ar=typeof queueMicrotask<"u"?queueMicrotask.bind(ot):typeof process<"u"&&process.nextTick||Ve,Or=t=>t!=null&&Z(t[Bt]),u={isArray:bt,isArrayBuffer:Ue,isBuffer:xt,isFormData:rr,isArrayBufferView:Wo,isString:Vo,isNumber:Le,isBoolean:Go,isObject:St,isPlainObject:_t,isEmptyObject:qo,isReadableStream:sr,isRequest:ar,isResponse:ur,isHeaders:lr,isUndefined:ct,isDate:Qo,isFile:Ko,isReactNativeBlob:Xo,isReactNative:Yo,isBlob:tr,isRegExp:xr,isFunction:Z,isStream:nr,isURLSearchParams:ir,isTypedArray:gr,isFileList:er,forEach:Ct,merge:Xt,extend:cr,trim:dr,stripBOM:br,inherits:pr,toFlatObject:fr,kindOf:Mt,kindOfTest:V,endsWith:hr,toArray:mr,forEachEntry:yr,matchAll:vr,isHTMLForm:wr,hasOwnProperty:Ie,hasOwnProp:Ie,reduceDescriptors:We,freezeMethods:Sr,toObjectSet:Cr,toCamelCase:Ir,noop:Rr,toFiniteNumber:kr,findKey:He,global:ot,isContextDefined:Je,isSpecCompliantForm:Pr,toJSONObject:Er,isAsyncFn:Tr,isThenable:Dr,setImmediate:Ve,asap:Ar,isIterable:Or};let I=class Ge extends Error{static from(e,n,o,r,i,s){const l=new Ge(e.message,n||e.code,o,r,i);return l.cause=e,l.name=e.name,e.status!=null&&l.status==null&&(l.status=e.status),s&&Object.assign(l,s),l}constructor(e,n,o,r,i){super(e),Object.defineProperty(this,"message",{value:e,enumerable:!0,writable:!0,configurable:!0}),this.name="AxiosError",this.isAxiosError=!0,n&&(this.code=n),o&&(this.config=o),r&&(this.request=r),i&&(this.response=i,this.status=i.status)}toJSON(){return{message:this.message,name:this.name,description:this.description,number:this.number,fileName:this.fileName,lineNumber:this.lineNumber,columnNumber:this.columnNumber,stack:this.stack,config:u.toJSONObject(this.config),code:this.code,status:this.status}}};I.ERR_BAD_OPTION_VALUE="ERR_BAD_OPTION_VALUE";I.ERR_BAD_OPTION="ERR_BAD_OPTION";I.ECONNABORTED="ECONNABORTED";I.ETIMEDOUT="ETIMEDOUT";I.ERR_NETWORK="ERR_NETWORK";I.ERR_FR_TOO_MANY_REDIRECTS="ERR_FR_TOO_MANY_REDIRECTS";I.ERR_DEPRECATED="ERR_DEPRECATED";I.ERR_BAD_RESPONSE="ERR_BAD_RESPONSE";I.ERR_BAD_REQUEST="ERR_BAD_REQUEST";I.ERR_CANCELED="ERR_CANCELED";I.ERR_NOT_SUPPORT="ERR_NOT_SUPPORT";I.ERR_INVALID_URL="ERR_INVALID_URL";const _r=null;function Yt(t){return u.isPlainObject(t)||u.isArray(t)}function qe(t){return u.endsWith(t,"[]")?t.slice(0,-2):t}function Wt(t,e,n){return t?t.concat(e).map(function(r,i){return r=qe(r),!n&&i?"["+r+"]":r}).join(n?".":""):e}function $r(t){return u.isArray(t)&&!t.some(Yt)}const Nr=u.toFlatObject(u,{},null,function(e){return/^is[A-Z]/.test(e)});function zt(t,e,n){if(!u.isObject(t))throw new TypeError("target must be an object");e=e||new FormData,n=u.toFlatObject(n,{metaTokens:!0,dots:!1,indexes:!1},!1,function(y,h){return!u.isUndefined(h[y])});const o=n.metaTokens,r=n.visitor||c,i=n.dots,s=n.indexes,g=(n.Blob||typeof Blob<"u"&&Blob)&&u.isSpecCompliantForm(e);if(!u.isFunction(r))throw new TypeError("visitor must be a function");function p(b){if(b===null)return"";if(u.isDate(b))return b.toISOString();if(u.isBoolean(b))return b.toString();if(!g&&u.isBlob(b))throw new I("Blob is not supported. Use a Buffer instead.");return u.isArrayBuffer(b)||u.isTypedArray(b)?g&&typeof Blob=="function"?new Blob([b]):Buffer.from(b):b}function c(b,y,h){let R=b;if(u.isReactNative(e)&&u.isReactNativeBlob(b))return e.append(Wt(h,y,i),p(b)),!1;if(b&&!h&&typeof b=="object"){if(u.endsWith(y,"{}"))y=o?y:y.slice(0,-2),b=JSON.stringify(b);else if(u.isArray(b)&&$r(b)||(u.isFileList(b)||u.endsWith(y,"[]"))&&(R=u.toArray(b)))return y=qe(y),R.forEach(function(E,D){!(u.isUndefined(E)||E===null)&&e.append(s===!0?Wt([y],D,i):s===null?y:y+"[]",p(E))}),!1}return Yt(b)?!0:(e.append(Wt(h,y,i),p(b)),!1)}const w=[],x=Object.assign(Nr,{defaultVisitor:c,convertValue:p,isVisitable:Yt});function C(b,y){if(!u.isUndefined(b)){if(w.indexOf(b)!==-1)throw Error("Circular reference detected in "+y.join("."));w.push(b),u.forEach(b,function(R,F){(!(u.isUndefined(R)||R===null)&&r.call(e,R,u.isString(F)?F.trim():F,y,x))===!0&&C(R,y?y.concat(F):[F])}),w.pop()}}if(!u.isObject(t))throw new TypeError("data must be an object");return C(t),e}function xe(t){const e={"!":"%21","'":"%27","(":"%28",")":"%29","~":"%7E","%20":"+","%00":"\0"};return encodeURIComponent(t).replace(/[!'()~]|%20|%00/g,function(o){return e[o]})}function ie(t,e){this._pairs=[],t&&zt(t,this,e)}const Qe=ie.prototype;Qe.append=function(e,n){this._pairs.push([e,n])};Qe.toString=function(e){const n=e?function(o){return e.call(this,o,xe)}:xe;return this._pairs.map(function(r){return n(r[0])+"="+n(r[1])},"").join("&")};function Fr(t){return encodeURIComponent(t).replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+")}function Ke(t,e,n){if(!e)return t;const o=n&&n.encode||Fr,r=u.isFunction(n)?{serialize:n}:n,i=r&&r.serialize;let s;if(i?s=i(e,r):s=u.isURLSearchParams(e)?e.toString():new ie(e,r).toString(o),s){const l=t.indexOf("#");l!==-1&&(t=t.slice(0,l)),t+=(t.indexOf("?")===-1?"?":"&")+s}return t}class Se{constructor(){this.handlers=[]}use(e,n,o){return this.handlers.push({fulfilled:e,rejected:n,synchronous:o?o.synchronous:!1,runWhen:o?o.runWhen:null}),this.handlers.length-1}eject(e){this.handlers[e]&&(this.handlers[e]=null)}clear(){this.handlers&&(this.handlers=[])}forEach(e){u.forEach(this.handlers,function(o){o!==null&&e(o)})}}const se={silentJSONParsing:!0,forcedJSONParsing:!0,clarifyTimeoutError:!1,legacyInterceptorReqResOrdering:!0},Br=typeof URLSearchParams<"u"?URLSearchParams:ie,Mr=typeof FormData<"u"?FormData:null,Zr=typeof Blob<"u"?Blob:null,zr={isBrowser:!0,classes:{URLSearchParams:Br,FormData:Mr,Blob:Zr},protocols:["http","https","file","blob","url","data"]},ae=typeof window<"u"&&typeof document<"u",te=typeof navigator=="object"&&navigator||void 0,jr=ae&&(!te||["ReactNative","NativeScript","NS"].indexOf(te.product)<0),Ur=typeof WorkerGlobalScope<"u"&&self instanceof WorkerGlobalScope&&typeof self.importScripts=="function",Lr=ae&&window.location.href||"http://localhost",Hr=Object.freeze(Object.defineProperty({__proto__:null,hasBrowserEnv:ae,hasStandardBrowserEnv:jr,hasStandardBrowserWebWorkerEnv:Ur,navigator:te,origin:Lr},Symbol.toStringTag,{value:"Module"})),O={...Hr,...zr};function Jr(t,e){return zt(t,new O.classes.URLSearchParams,{visitor:function(n,o,r,i){return O.isNode&&u.isBuffer(n)?(this.append(o,n.toString("base64")),!1):i.defaultVisitor.apply(this,arguments)},...e})}function Wr(t){return u.matchAll(/\w+|\[(\w*)]/g,t).map(e=>e[0]==="[]"?"":e[1]||e[0])}function Vr(t){const e={},n=Object.keys(t);let o;const r=n.length;let i;for(o=0;o<r;o++)i=n[o],e[i]=t[i];return e}function Xe(t){function e(n,o,r,i){let s=n[i++];if(s==="__proto__")return!0;const l=Number.isFinite(+s),g=i>=n.length;return s=!s&&u.isArray(r)?r.length:s,g?(u.hasOwnProp(r,s)?r[s]=[r[s],o]:r[s]=o,!l):((!r[s]||!u.isObject(r[s]))&&(r[s]=[]),e(n,o,r[s],i)&&u.isArray(r[s])&&(r[s]=Vr(r[s])),!l)}if(u.isFormData(t)&&u.isFunction(t.entries)){const n={};return u.forEachEntry(t,(o,r)=>{e(Wr(o),r,n,0)}),n}return null}function Gr(t,e,n){if(u.isString(t))try{return(e||JSON.parse)(t),u.trim(t)}catch(o){if(o.name!=="SyntaxError")throw o}return(n||JSON.stringify)(t)}const Rt={transitional:se,adapter:["xhr","http","fetch"],transformRequest:[function(e,n){const o=n.getContentType()||"",r=o.indexOf("application/json")>-1,i=u.isObject(e);if(i&&u.isHTMLForm(e)&&(e=new FormData(e)),u.isFormData(e))return r?JSON.stringify(Xe(e)):e;if(u.isArrayBuffer(e)||u.isBuffer(e)||u.isStream(e)||u.isFile(e)||u.isBlob(e)||u.isReadableStream(e))return e;if(u.isArrayBufferView(e))return e.buffer;if(u.isURLSearchParams(e))return n.setContentType("application/x-www-form-urlencoded;charset=utf-8",!1),e.toString();let l;if(i){if(o.indexOf("application/x-www-form-urlencoded")>-1)return Jr(e,this.formSerializer).toString();if((l=u.isFileList(e))||o.indexOf("multipart/form-data")>-1){const g=this.env&&this.env.FormData;return zt(l?{"files[]":e}:e,g&&new g,this.formSerializer)}}return i||r?(n.setContentType("application/json",!1),Gr(e)):e}],transformResponse:[function(e){const n=this.transitional||Rt.transitional,o=n&&n.forcedJSONParsing,r=this.responseType==="json";if(u.isResponse(e)||u.isReadableStream(e))return e;if(e&&u.isString(e)&&(o&&!this.responseType||r)){const s=!(n&&n.silentJSONParsing)&&r;try{return JSON.parse(e,this.parseReviver)}catch(l){if(s)throw l.name==="SyntaxError"?I.from(l,I.ERR_BAD_RESPONSE,this,null,this.response):l}}return e}],timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",maxContentLength:-1,maxBodyLength:-1,env:{FormData:O.classes.FormData,Blob:O.classes.Blob},validateStatus:function(e){return e>=200&&e<300},headers:{common:{Accept:"application/json, text/plain, */*","Content-Type":void 0}}};u.forEach(["delete","get","head","post","put","patch"],t=>{Rt.headers[t]={}});const qr=u.toObjectSet(["age","authorization","content-length","content-type","etag","expires","from","host","if-modified-since","if-unmodified-since","last-modified","location","max-forwards","proxy-authorization","referer","retry-after","user-agent"]),Qr=t=>{const e={};let n,o,r;return t&&t.split(`
`).forEach(function(s){r=s.indexOf(":"),n=s.substring(0,r).trim().toLowerCase(),o=s.substring(r+1).trim(),!(!n||e[n]&&qr[n])&&(n==="set-cookie"?e[n]?e[n].push(o):e[n]=[o]:e[n]=e[n]?e[n]+", "+o:o)}),e},Ce=Symbol("internals");function ht(t){return t&&String(t).trim().toLowerCase()}function $t(t){return t===!1||t==null?t:u.isArray(t)?t.map($t):String(t)}function Kr(t){const e=Object.create(null),n=/([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;let o;for(;o=n.exec(t);)e[o[1]]=o[2];return e}const Xr=t=>/^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(t.trim());function Vt(t,e,n,o,r){if(u.isFunction(o))return o.call(this,e,n);if(r&&(e=n),!!u.isString(e)){if(u.isString(o))return e.indexOf(o)!==-1;if(u.isRegExp(o))return o.test(e)}}function Yr(t){return t.trim().toLowerCase().replace(/([a-z\d])(\w*)/g,(e,n,o)=>n.toUpperCase()+o)}function ti(t,e){const n=u.toCamelCase(" "+e);["get","set","has"].forEach(o=>{Object.defineProperty(t,o+n,{value:function(r,i,s){return this[o].call(this,e,r,i,s)},configurable:!0})})}let z=class{constructor(e){e&&this.set(e)}set(e,n,o){const r=this;function i(l,g,p){const c=ht(g);if(!c)throw new Error("header name must be a non-empty string");const w=u.findKey(r,c);(!w||r[w]===void 0||p===!0||p===void 0&&r[w]!==!1)&&(r[w||g]=$t(l))}const s=(l,g)=>u.forEach(l,(p,c)=>i(p,c,g));if(u.isPlainObject(e)||e instanceof this.constructor)s(e,n);else if(u.isString(e)&&(e=e.trim())&&!Xr(e))s(Qr(e),n);else if(u.isObject(e)&&u.isIterable(e)){let l={},g,p;for(const c of e){if(!u.isArray(c))throw TypeError("Object iterator must return a key-value pair");l[p=c[0]]=(g=l[p])?u.isArray(g)?[...g,c[1]]:[g,c[1]]:c[1]}s(l,n)}else e!=null&&i(n,e,o);return this}get(e,n){if(e=ht(e),e){const o=u.findKey(this,e);if(o){const r=this[o];if(!n)return r;if(n===!0)return Kr(r);if(u.isFunction(n))return n.call(this,r,o);if(u.isRegExp(n))return n.exec(r);throw new TypeError("parser must be boolean|regexp|function")}}}has(e,n){if(e=ht(e),e){const o=u.findKey(this,e);return!!(o&&this[o]!==void 0&&(!n||Vt(this,this[o],o,n)))}return!1}delete(e,n){const o=this;let r=!1;function i(s){if(s=ht(s),s){const l=u.findKey(o,s);l&&(!n||Vt(o,o[l],l,n))&&(delete o[l],r=!0)}}return u.isArray(e)?e.forEach(i):i(e),r}clear(e){const n=Object.keys(this);let o=n.length,r=!1;for(;o--;){const i=n[o];(!e||Vt(this,this[i],i,e,!0))&&(delete this[i],r=!0)}return r}normalize(e){const n=this,o={};return u.forEach(this,(r,i)=>{const s=u.findKey(o,i);if(s){n[s]=$t(r),delete n[i];return}const l=e?Yr(i):String(i).trim();l!==i&&delete n[i],n[l]=$t(r),o[l]=!0}),this}concat(...e){return this.constructor.concat(this,...e)}toJSON(e){const n=Object.create(null);return u.forEach(this,(o,r)=>{o!=null&&o!==!1&&(n[r]=e&&u.isArray(o)?o.join(", "):o)}),n}[Symbol.iterator](){return Object.entries(this.toJSON())[Symbol.iterator]()}toString(){return Object.entries(this.toJSON()).map(([e,n])=>e+": "+n).join(`
`)}getSetCookie(){return this.get("set-cookie")||[]}get[Symbol.toStringTag](){return"AxiosHeaders"}static from(e){return e instanceof this?e:new this(e)}static concat(e,...n){const o=new this(e);return n.forEach(r=>o.set(r)),o}static accessor(e){const o=(this[Ce]=this[Ce]={accessors:{}}).accessors,r=this.prototype;function i(s){const l=ht(s);o[l]||(ti(r,s),o[l]=!0)}return u.isArray(e)?e.forEach(i):i(e),this}};z.accessor(["Content-Type","Content-Length","Accept","Accept-Encoding","User-Agent","Authorization"]);u.reduceDescriptors(z.prototype,({value:t},e)=>{let n=e[0].toUpperCase()+e.slice(1);return{get:()=>t,set(o){this[n]=o}}});u.freezeMethods(z);function Gt(t,e){const n=this||Rt,o=e||n,r=z.from(o.headers);let i=o.data;return u.forEach(t,function(l){i=l.call(n,i,r.normalize(),e?e.status:void 0)}),r.normalize(),i}function Ye(t){return!!(t&&t.__CANCEL__)}let kt=class extends I{constructor(e,n,o){super(e??"canceled",I.ERR_CANCELED,n,o),this.name="CanceledError",this.__CANCEL__=!0}};function tn(t,e,n){const o=n.config.validateStatus;!n.status||!o||o(n.status)?t(n):e(new I("Request failed with status code "+n.status,[I.ERR_BAD_REQUEST,I.ERR_BAD_RESPONSE][Math.floor(n.status/100)-4],n.config,n.request,n))}function ei(t){const e=/^([-+\w]{1,25})(:?\/\/|:)/.exec(t);return e&&e[1]||""}function ni(t,e){t=t||10;const n=new Array(t),o=new Array(t);let r=0,i=0,s;return e=e!==void 0?e:1e3,function(g){const p=Date.now(),c=o[i];s||(s=p),n[r]=g,o[r]=p;let w=i,x=0;for(;w!==r;)x+=n[w++],w=w%t;if(r=(r+1)%t,r===i&&(i=(i+1)%t),p-s<e)return;const C=c&&p-c;return C?Math.round(x*1e3/C):void 0}}function oi(t,e){let n=0,o=1e3/e,r,i;const s=(p,c=Date.now())=>{n=c,r=null,i&&(clearTimeout(i),i=null),t(...p)};return[(...p)=>{const c=Date.now(),w=c-n;w>=o?s(p,c):(r=p,i||(i=setTimeout(()=>{i=null,s(r)},o-w)))},()=>r&&s(r)]}const Ft=(t,e,n=3)=>{let o=0;const r=ni(50,250);return oi(i=>{const s=i.loaded,l=i.lengthComputable?i.total:void 0,g=s-o,p=r(g),c=s<=l;o=s;const w={loaded:s,total:l,progress:l?s/l:void 0,bytes:g,rate:p||void 0,estimated:p&&l&&c?(l-s)/p:void 0,event:i,lengthComputable:l!=null,[e?"download":"upload"]:!0};t(w)},n)},Re=(t,e)=>{const n=t!=null;return[o=>e[0]({lengthComputable:n,total:t,loaded:o}),e[1]]},ke=t=>(...e)=>u.asap(()=>t(...e)),ri=O.hasStandardBrowserEnv?((t,e)=>n=>(n=new URL(n,O.origin),t.protocol===n.protocol&&t.host===n.host&&(e||t.port===n.port)))(new URL(O.origin),O.navigator&&/(msie|trident)/i.test(O.navigator.userAgent)):()=>!0,ii=O.hasStandardBrowserEnv?{write(t,e,n,o,r,i,s){if(typeof document>"u")return;const l=[`${t}=${encodeURIComponent(e)}`];u.isNumber(n)&&l.push(`expires=${new Date(n).toUTCString()}`),u.isString(o)&&l.push(`path=${o}`),u.isString(r)&&l.push(`domain=${r}`),i===!0&&l.push("secure"),u.isString(s)&&l.push(`SameSite=${s}`),document.cookie=l.join("; ")},read(t){if(typeof document>"u")return null;const e=document.cookie.match(new RegExp("(?:^|; )"+t+"=([^;]*)"));return e?decodeURIComponent(e[1]):null},remove(t){this.write(t,"",Date.now()-864e5,"/")}}:{write(){},read(){return null},remove(){}};function si(t){return typeof t!="string"?!1:/^([a-z][a-z\d+\-.]*:)?\/\//i.test(t)}function ai(t,e){return e?t.replace(/\/?\/$/,"")+"/"+e.replace(/^\/+/,""):t}function en(t,e,n){let o=!si(e);return t&&(o||n==!1)?ai(t,e):e}const Pe=t=>t instanceof z?{...t}:t;function it(t,e){e=e||{};const n={};function o(p,c,w,x){return u.isPlainObject(p)&&u.isPlainObject(c)?u.merge.call({caseless:x},p,c):u.isPlainObject(c)?u.merge({},c):u.isArray(c)?c.slice():c}function r(p,c,w,x){if(u.isUndefined(c)){if(!u.isUndefined(p))return o(void 0,p,w,x)}else return o(p,c,w,x)}function i(p,c){if(!u.isUndefined(c))return o(void 0,c)}function s(p,c){if(u.isUndefined(c)){if(!u.isUndefined(p))return o(void 0,p)}else return o(void 0,c)}function l(p,c,w){if(w in e)return o(p,c);if(w in t)return o(void 0,p)}const g={url:i,method:i,data:i,baseURL:s,transformRequest:s,transformResponse:s,paramsSerializer:s,timeout:s,timeoutMessage:s,withCredentials:s,withXSRFToken:s,adapter:s,responseType:s,xsrfCookieName:s,xsrfHeaderName:s,onUploadProgress:s,onDownloadProgress:s,decompress:s,maxContentLength:s,maxBodyLength:s,beforeRedirect:s,transport:s,httpAgent:s,httpsAgent:s,cancelToken:s,socketPath:s,responseEncoding:s,validateStatus:l,headers:(p,c,w)=>r(Pe(p),Pe(c),w,!0)};return u.forEach(Object.keys({...t,...e}),function(c){if(c==="__proto__"||c==="constructor"||c==="prototype")return;const w=u.hasOwnProp(g,c)?g[c]:r,x=w(t[c],e[c],c);u.isUndefined(x)&&w!==l||(n[c]=x)}),n}const nn=t=>{const e=it({},t);let{data:n,withXSRFToken:o,xsrfHeaderName:r,xsrfCookieName:i,headers:s,auth:l}=e;if(e.headers=s=z.from(s),e.url=Ke(en(e.baseURL,e.url,e.allowAbsoluteUrls),t.params,t.paramsSerializer),l&&s.set("Authorization","Basic "+btoa((l.username||"")+":"+(l.password?unescape(encodeURIComponent(l.password)):""))),u.isFormData(n)){if(O.hasStandardBrowserEnv||O.hasStandardBrowserWebWorkerEnv)s.setContentType(void 0);else if(u.isFunction(n.getHeaders)){const g=n.getHeaders(),p=["content-type","content-length"];Object.entries(g).forEach(([c,w])=>{p.includes(c.toLowerCase())&&s.set(c,w)})}}if(O.hasStandardBrowserEnv&&(o&&u.isFunction(o)&&(o=o(e)),o||o!==!1&&ri(e.url))){const g=r&&i&&ii.read(i);g&&s.set(r,g)}return e},ui=typeof XMLHttpRequest<"u",li=ui&&function(t){return new Promise(function(n,o){const r=nn(t);let i=r.data;const s=z.from(r.headers).normalize();let{responseType:l,onUploadProgress:g,onDownloadProgress:p}=r,c,w,x,C,b;function y(){C&&C(),b&&b(),r.cancelToken&&r.cancelToken.unsubscribe(c),r.signal&&r.signal.removeEventListener("abort",c)}let h=new XMLHttpRequest;h.open(r.method.toUpperCase(),r.url,!0),h.timeout=r.timeout;function R(){if(!h)return;const E=z.from("getAllResponseHeaders"in h&&h.getAllResponseHeaders()),j={data:!l||l==="text"||l==="json"?h.responseText:h.response,status:h.status,statusText:h.statusText,headers:E,config:t,request:h};tn(function(B){n(B),y()},function(B){o(B),y()},j),h=null}"onloadend"in h?h.onloadend=R:h.onreadystatechange=function(){!h||h.readyState!==4||h.status===0&&!(h.responseURL&&h.responseURL.indexOf("file:")===0)||setTimeout(R)},h.onabort=function(){h&&(o(new I("Request aborted",I.ECONNABORTED,t,h)),h=null)},h.onerror=function(D){const j=D&&D.message?D.message:"Network Error",K=new I(j,I.ERR_NETWORK,t,h);K.event=D||null,o(K),h=null},h.ontimeout=function(){let D=r.timeout?"timeout of "+r.timeout+"ms exceeded":"timeout exceeded";const j=r.transitional||se;r.timeoutErrorMessage&&(D=r.timeoutErrorMessage),o(new I(D,j.clarifyTimeoutError?I.ETIMEDOUT:I.ECONNABORTED,t,h)),h=null},i===void 0&&s.setContentType(null),"setRequestHeader"in h&&u.forEach(s.toJSON(),function(D,j){h.setRequestHeader(j,D)}),u.isUndefined(r.withCredentials)||(h.withCredentials=!!r.withCredentials),l&&l!=="json"&&(h.responseType=r.responseType),p&&([x,b]=Ft(p,!0),h.addEventListener("progress",x)),g&&h.upload&&([w,C]=Ft(g),h.upload.addEventListener("progress",w),h.upload.addEventListener("loadend",C)),(r.cancelToken||r.signal)&&(c=E=>{h&&(o(!E||E.type?new kt(null,t,h):E),h.abort(),h=null)},r.cancelToken&&r.cancelToken.subscribe(c),r.signal&&(r.signal.aborted?c():r.signal.addEventListener("abort",c)));const F=ei(r.url);if(F&&O.protocols.indexOf(F)===-1){o(new I("Unsupported protocol "+F+":",I.ERR_BAD_REQUEST,t));return}h.send(i||null)})},di=(t,e)=>{const{length:n}=t=t?t.filter(Boolean):[];if(e||n){let o=new AbortController,r;const i=function(p){if(!r){r=!0,l();const c=p instanceof Error?p:this.reason;o.abort(c instanceof I?c:new kt(c instanceof Error?c.message:c))}};let s=e&&setTimeout(()=>{s=null,i(new I(`timeout of ${e}ms exceeded`,I.ETIMEDOUT))},e);const l=()=>{t&&(s&&clearTimeout(s),s=null,t.forEach(p=>{p.unsubscribe?p.unsubscribe(i):p.removeEventListener("abort",i)}),t=null)};t.forEach(p=>p.addEventListener("abort",i));const{signal:g}=o;return g.unsubscribe=()=>u.asap(l),g}},ci=function*(t,e){let n=t.byteLength;if(n<e){yield t;return}let o=0,r;for(;o<n;)r=o+e,yield t.slice(o,r),o=r},bi=async function*(t,e){for await(const n of pi(t))yield*ci(n,e)},pi=async function*(t){if(t[Symbol.asyncIterator]){yield*t;return}const e=t.getReader();try{for(;;){const{done:n,value:o}=await e.read();if(n)break;yield o}}finally{await e.cancel()}},Ee=(t,e,n,o)=>{const r=bi(t,e);let i=0,s,l=g=>{s||(s=!0,o&&o(g))};return new ReadableStream({async pull(g){try{const{done:p,value:c}=await r.next();if(p){l(),g.close();return}let w=c.byteLength;if(n){let x=i+=w;n(x)}g.enqueue(new Uint8Array(c))}catch(p){throw l(p),p}},cancel(g){return l(g),r.return()}},{highWaterMark:2})},Te=64*1024,{isFunction:Ot}=u,fi=(({Request:t,Response:e})=>({Request:t,Response:e}))(u.global),{ReadableStream:De,TextEncoder:Ae}=u.global,Oe=(t,...e)=>{try{return!!t(...e)}catch{return!1}},hi=t=>{t=u.merge.call({skipUndefined:!0},fi,t);const{fetch:e,Request:n,Response:o}=t,r=e?Ot(e):typeof fetch=="function",i=Ot(n),s=Ot(o);if(!r)return!1;const l=r&&Ot(De),g=r&&(typeof Ae=="function"?(b=>y=>b.encode(y))(new Ae):async b=>new Uint8Array(await new n(b).arrayBuffer())),p=i&&l&&Oe(()=>{let b=!1;const y=new n(O.origin,{body:new De,method:"POST",get duplex(){return b=!0,"half"}}).headers.has("Content-Type");return b&&!y}),c=s&&l&&Oe(()=>u.isReadableStream(new o("").body)),w={stream:c&&(b=>b.body)};r&&["text","arrayBuffer","blob","formData","stream"].forEach(b=>{!w[b]&&(w[b]=(y,h)=>{let R=y&&y[b];if(R)return R.call(y);throw new I(`Response type '${b}' is not supported`,I.ERR_NOT_SUPPORT,h)})});const x=async b=>{if(b==null)return 0;if(u.isBlob(b))return b.size;if(u.isSpecCompliantForm(b))return(await new n(O.origin,{method:"POST",body:b}).arrayBuffer()).byteLength;if(u.isArrayBufferView(b)||u.isArrayBuffer(b))return b.byteLength;if(u.isURLSearchParams(b)&&(b=b+""),u.isString(b))return(await g(b)).byteLength},C=async(b,y)=>{const h=u.toFiniteNumber(b.getContentLength());return h??x(y)};return async b=>{let{url:y,method:h,data:R,signal:F,cancelToken:E,timeout:D,onDownloadProgress:j,onUploadProgress:K,responseType:B,headers:pt,withCredentials:U="same-origin",fetchOptions:st}=nn(b),at=e||fetch;B=B?(B+"").toLowerCase():"text";let L=di([F,E&&E.toAbortSignal()],D),et=null;const _=L&&L.unsubscribe&&(()=>{L.unsubscribe()});let Pt;try{if(K&&p&&h!=="get"&&h!=="head"&&(Pt=await C(pt,R))!==0){let G=new n(y,{method:"POST",body:R,duplex:"half"}),Y;if(u.isFormData(R)&&(Y=G.headers.get("content-type"))&&pt.setContentType(Y),G.body){const[ut,nt]=Re(Pt,Ft(ke(K)));R=Ee(G.body,Te,ut,nt)}}u.isString(U)||(U=U?"include":"omit");const A=i&&"credentials"in n.prototype,ft={...st,signal:L,method:h.toUpperCase(),headers:pt.normalize().toJSON(),body:R,duplex:"half",credentials:A?U:void 0};et=i&&new n(y,ft);let W=await(i?at(et,st):at(y,ft));const Et=c&&(B==="stream"||B==="response");if(c&&(j||Et&&_)){const G={};["status","statusText","headers"].forEach(Tt=>{G[Tt]=W[Tt]});const Y=u.toFiniteNumber(W.headers.get("content-length")),[ut,nt]=j&&Re(Y,Ft(ke(j),!0))||[];W=new o(Ee(W.body,Te,ut,()=>{nt&&nt(),_&&_()}),G)}B=B||"text";let Ut=await w[u.findKey(w,B)||"text"](W,b);return!Et&&_&&_(),await new Promise((G,Y)=>{tn(G,Y,{data:Ut,headers:z.from(W.headers),status:W.status,statusText:W.statusText,config:b,request:et})})}catch(A){throw _&&_(),A&&A.name==="TypeError"&&/Load failed|fetch/i.test(A.message)?Object.assign(new I("Network Error",I.ERR_NETWORK,b,et,A&&A.response),{cause:A.cause||A}):I.from(A,A&&A.code,b,et,A&&A.response)}}},mi=new Map,on=t=>{let e=t&&t.env||{};const{fetch:n,Request:o,Response:r}=e,i=[o,r,n];let s=i.length,l=s,g,p,c=mi;for(;l--;)g=i[l],p=c.get(g),p===void 0&&c.set(g,p=l?new Map:hi(e)),c=p;return p};on();const ue={http:_r,xhr:li,fetch:{get:on}};u.forEach(ue,(t,e)=>{if(t){try{Object.defineProperty(t,"name",{value:e})}catch{}Object.defineProperty(t,"adapterName",{value:e})}});const _e=t=>`- ${t}`,gi=t=>u.isFunction(t)||t===null||t===!1;function yi(t,e){t=u.isArray(t)?t:[t];const{length:n}=t;let o,r;const i={};for(let s=0;s<n;s++){o=t[s];let l;if(r=o,!gi(o)&&(r=ue[(l=String(o)).toLowerCase()],r===void 0))throw new I(`Unknown adapter '${l}'`);if(r&&(u.isFunction(r)||(r=r.get(e))))break;i[l||"#"+s]=r}if(!r){const s=Object.entries(i).map(([g,p])=>`adapter ${g} `+(p===!1?"is not supported by the environment":"is not available in the build"));let l=n?s.length>1?`since :
`+s.map(_e).join(`
`):" "+_e(s[0]):"as no adapter specified";throw new I("There is no suitable adapter to dispatch the request "+l,"ERR_NOT_SUPPORT")}return r}const rn={getAdapter:yi,adapters:ue};function qt(t){if(t.cancelToken&&t.cancelToken.throwIfRequested(),t.signal&&t.signal.aborted)throw new kt(null,t)}function $e(t){return qt(t),t.headers=z.from(t.headers),t.data=Gt.call(t,t.transformRequest),["post","put","patch"].indexOf(t.method)!==-1&&t.headers.setContentType("application/x-www-form-urlencoded",!1),rn.getAdapter(t.adapter||Rt.adapter,t)(t).then(function(o){return qt(t),o.data=Gt.call(t,t.transformResponse,o),o.headers=z.from(o.headers),o},function(o){return Ye(o)||(qt(t),o&&o.response&&(o.response.data=Gt.call(t,t.transformResponse,o.response),o.response.headers=z.from(o.response.headers))),Promise.reject(o)})}const sn="1.13.6",jt={};["object","boolean","number","function","string","symbol"].forEach((t,e)=>{jt[t]=function(o){return typeof o===t||"a"+(e<1?"n ":" ")+t}});const Ne={};jt.transitional=function(e,n,o){function r(i,s){return"[Axios v"+sn+"] Transitional option '"+i+"'"+s+(o?". "+o:"")}return(i,s,l)=>{if(e===!1)throw new I(r(s," has been removed"+(n?" in "+n:"")),I.ERR_DEPRECATED);return n&&!Ne[s]&&(Ne[s]=!0,console.warn(r(s," has been deprecated since v"+n+" and will be removed in the near future"))),e?e(i,s,l):!0}};jt.spelling=function(e){return(n,o)=>(console.warn(`${o} is likely a misspelling of ${e}`),!0)};function vi(t,e,n){if(typeof t!="object")throw new I("options must be an object",I.ERR_BAD_OPTION_VALUE);const o=Object.keys(t);let r=o.length;for(;r-- >0;){const i=o[r],s=e[i];if(s){const l=t[i],g=l===void 0||s(l,i,t);if(g!==!0)throw new I("option "+i+" must be "+g,I.ERR_BAD_OPTION_VALUE);continue}if(n!==!0)throw new I("Unknown option "+i,I.ERR_BAD_OPTION)}}const Nt={assertOptions:vi,validators:jt},H=Nt.validators;let rt=class{constructor(e){this.defaults=e||{},this.interceptors={request:new Se,response:new Se}}async request(e,n){try{return await this._request(e,n)}catch(o){if(o instanceof Error){let r={};Error.captureStackTrace?Error.captureStackTrace(r):r=new Error;const i=r.stack?r.stack.replace(/^.+\n/,""):"";try{o.stack?i&&!String(o.stack).endsWith(i.replace(/^.+\n.+\n/,""))&&(o.stack+=`
`+i):o.stack=i}catch{}}throw o}}_request(e,n){typeof e=="string"?(n=n||{},n.url=e):n=e||{},n=it(this.defaults,n);const{transitional:o,paramsSerializer:r,headers:i}=n;o!==void 0&&Nt.assertOptions(o,{silentJSONParsing:H.transitional(H.boolean),forcedJSONParsing:H.transitional(H.boolean),clarifyTimeoutError:H.transitional(H.boolean),legacyInterceptorReqResOrdering:H.transitional(H.boolean)},!1),r!=null&&(u.isFunction(r)?n.paramsSerializer={serialize:r}:Nt.assertOptions(r,{encode:H.function,serialize:H.function},!0)),n.allowAbsoluteUrls!==void 0||(this.defaults.allowAbsoluteUrls!==void 0?n.allowAbsoluteUrls=this.defaults.allowAbsoluteUrls:n.allowAbsoluteUrls=!0),Nt.assertOptions(n,{baseUrl:H.spelling("baseURL"),withXsrfToken:H.spelling("withXSRFToken")},!0),n.method=(n.method||this.defaults.method||"get").toLowerCase();let s=i&&u.merge(i.common,i[n.method]);i&&u.forEach(["delete","get","head","post","put","patch","common"],b=>{delete i[b]}),n.headers=z.concat(s,i);const l=[];let g=!0;this.interceptors.request.forEach(function(y){if(typeof y.runWhen=="function"&&y.runWhen(n)===!1)return;g=g&&y.synchronous;const h=n.transitional||se;h&&h.legacyInterceptorReqResOrdering?l.unshift(y.fulfilled,y.rejected):l.push(y.fulfilled,y.rejected)});const p=[];this.interceptors.response.forEach(function(y){p.push(y.fulfilled,y.rejected)});let c,w=0,x;if(!g){const b=[$e.bind(this),void 0];for(b.unshift(...l),b.push(...p),x=b.length,c=Promise.resolve(n);w<x;)c=c.then(b[w++],b[w++]);return c}x=l.length;let C=n;for(;w<x;){const b=l[w++],y=l[w++];try{C=b(C)}catch(h){y.call(this,h);break}}try{c=$e.call(this,C)}catch(b){return Promise.reject(b)}for(w=0,x=p.length;w<x;)c=c.then(p[w++],p[w++]);return c}getUri(e){e=it(this.defaults,e);const n=en(e.baseURL,e.url,e.allowAbsoluteUrls);return Ke(n,e.params,e.paramsSerializer)}};u.forEach(["delete","get","head","options"],function(e){rt.prototype[e]=function(n,o){return this.request(it(o||{},{method:e,url:n,data:(o||{}).data}))}});u.forEach(["post","put","patch"],function(e){function n(o){return function(i,s,l){return this.request(it(l||{},{method:e,headers:o?{"Content-Type":"multipart/form-data"}:{},url:i,data:s}))}}rt.prototype[e]=n(),rt.prototype[e+"Form"]=n(!0)});let wi=class an{constructor(e){if(typeof e!="function")throw new TypeError("executor must be a function.");let n;this.promise=new Promise(function(i){n=i});const o=this;this.promise.then(r=>{if(!o._listeners)return;let i=o._listeners.length;for(;i-- >0;)o._listeners[i](r);o._listeners=null}),this.promise.then=r=>{let i;const s=new Promise(l=>{o.subscribe(l),i=l}).then(r);return s.cancel=function(){o.unsubscribe(i)},s},e(function(i,s,l){o.reason||(o.reason=new kt(i,s,l),n(o.reason))})}throwIfRequested(){if(this.reason)throw this.reason}subscribe(e){if(this.reason){e(this.reason);return}this._listeners?this._listeners.push(e):this._listeners=[e]}unsubscribe(e){if(!this._listeners)return;const n=this._listeners.indexOf(e);n!==-1&&this._listeners.splice(n,1)}toAbortSignal(){const e=new AbortController,n=o=>{e.abort(o)};return this.subscribe(n),e.signal.unsubscribe=()=>this.unsubscribe(n),e.signal}static source(){let e;return{token:new an(function(r){e=r}),cancel:e}}};function Ii(t){return function(n){return t.apply(null,n)}}function xi(t){return u.isObject(t)&&t.isAxiosError===!0}const ee={Continue:100,SwitchingProtocols:101,Processing:102,EarlyHints:103,Ok:200,Created:201,Accepted:202,NonAuthoritativeInformation:203,NoContent:204,ResetContent:205,PartialContent:206,MultiStatus:207,AlreadyReported:208,ImUsed:226,MultipleChoices:300,MovedPermanently:301,Found:302,SeeOther:303,NotModified:304,UseProxy:305,Unused:306,TemporaryRedirect:307,PermanentRedirect:308,BadRequest:400,Unauthorized:401,PaymentRequired:402,Forbidden:403,NotFound:404,MethodNotAllowed:405,NotAcceptable:406,ProxyAuthenticationRequired:407,RequestTimeout:408,Conflict:409,Gone:410,LengthRequired:411,PreconditionFailed:412,PayloadTooLarge:413,UriTooLong:414,UnsupportedMediaType:415,RangeNotSatisfiable:416,ExpectationFailed:417,ImATeapot:418,MisdirectedRequest:421,UnprocessableEntity:422,Locked:423,FailedDependency:424,TooEarly:425,UpgradeRequired:426,PreconditionRequired:428,TooManyRequests:429,RequestHeaderFieldsTooLarge:431,UnavailableForLegalReasons:451,InternalServerError:500,NotImplemented:501,BadGateway:502,ServiceUnavailable:503,GatewayTimeout:504,HttpVersionNotSupported:505,VariantAlsoNegotiates:506,InsufficientStorage:507,LoopDetected:508,NotExtended:510,NetworkAuthenticationRequired:511,WebServerIsDown:521,ConnectionTimedOut:522,OriginIsUnreachable:523,TimeoutOccurred:524,SslHandshakeFailed:525,InvalidSslCertificate:526};Object.entries(ee).forEach(([t,e])=>{ee[e]=t});function un(t){const e=new rt(t),n=ze(rt.prototype.request,e);return u.extend(n,rt.prototype,e,{allOwnKeys:!0}),u.extend(n,e,null,{allOwnKeys:!0}),n.create=function(r){return un(it(t,r))},n}const P=un(Rt);P.Axios=rt;P.CanceledError=kt;P.CancelToken=wi;P.isCancel=Ye;P.VERSION=sn;P.toFormData=zt;P.AxiosError=I;P.Cancel=P.CanceledError;P.all=function(e){return Promise.all(e)};P.spread=Ii;P.isAxiosError=xi;P.mergeConfig=it;P.AxiosHeaders=z;P.formToJSON=t=>Xe(u.isHTMLForm(t)?new FormData(t):t);P.getAdapter=rn.getAdapter;P.HttpStatusCode=ee;P.default=P;const{Axios:Di,AxiosError:Ai,CanceledError:Oi,isCancel:_i,CancelToken:$i,VERSION:Ni,all:Fi,Cancel:Bi,isAxiosError:Mi,spread:Zi,toFormData:zi,AxiosHeaders:ji,HttpStatusCode:Ui,formToJSON:Li,getAdapter:Hi,mergeConfig:Ji}=P,Wi=Mn("assetManager",()=>{const t=N([]),e=N([]),n=N([]),o=N(!1),r=N({USD:31.25,JPY:.21}),i=N(!1),s=N(""),l=N(""),g="open.er-api.com";let p=!1;const c=N(To()),w=k(()=>{const a=new Set(e.value.map(d=>d.month));return a.add(c.value),[...a].sort((d,m)=>d.localeCompare(m))}),x=k(()=>w.value.filter(a=>a<=c.value)),C=N(c.value),b=N([]),y=N(lt),h=N(c.value),R=N({name:"",category:"",type:"asset",currency:"TWD"}),F=k(()=>{const a=new Map;for(const d of e.value){const m=a.get(d.accountId)??[];m.push(d),a.set(d.accountId,m)}for(const d of a.values())d.sort((m,f)=>m.month.localeCompare(f.month));return a}),E=k(()=>new Map(t.value.map(a=>[a.id,a]))),D=k(()=>[...x.value].reverse().map(a=>({label:a,value:a}))),j=k(()=>t.value.map(a=>({label:a.name,value:a.id,iconUrl:Ho(a.name)}))),K=[{label:"TWD",value:"TWD"},{label:"USD",value:"USD"},{label:"JPY",value:"JPY"}],B=[{label:"正資產",value:"asset"},{label:"負資產",value:"liability"}],pt=k(()=>[...new Set(t.value.map(d=>d.category))].map(d=>({label:d,value:d}))),U=k(()=>{const a=new Set(b.value);return t.value.filter(d=>a.has(d.id))}),st=k(()=>U.value.length!==1?null:U.value[0]),at=k(()=>{const a=x.value.indexOf(C.value);return a<=0?null:x.value[a-1]});Zn(x,a=>{if(!a.length){C.value=c.value,y.value=lt,h.value=c.value;return}C.value=tt(C.value),y.value=tt(y.value),h.value=tt(h.value),Q(y.value)>Q(h.value)&&(y.value=tt(lt),h.value=tt(c.value)),a.includes(C.value)||(C.value=a[a.length-1])},{immediate:!0});function L(a,d){const m=F.value.get(a)??[],f=Q(d);let v=0;for(const S of m){if(Q(S.month)<=f){v=S.amount;continue}break}return v}function et(a){return a==="TWD"?1:r.value[a]}function _(a,d){return a*et(d)}function Pt(a){return a.name}async function A(){const{data:a,error:d}=await T.from("accounts").select("*").order("sort_order",{ascending:!0}).order("created_at",{ascending:!0});if(d){console.error("Error fetching accounts:",d);return}a&&(t.value=a,b.value.length===0&&(b.value=t.value.map(m=>m.id)))}async function ft(){const{data:a,error:d}=await T.from("monthly_records").select("account_id, month, amount");if(d){console.error("Error fetching records:",d);return}a&&(e.value=a.map(m=>({accountId:m.account_id,month:m.month,amount:Number(m.amount)})))}async function W(){const{data:{user:a}}=await T.auth.getUser();if(!a)return;const{data:d,error:m}=await T.from("holdings").select("*").order("sort_order");!m&&d&&(n.value=d.map(f=>({id:f.id,symbol:f.symbol,market:f.market,name:f.name,shares:f.shares,loaned_shares:f.loaned_shares,cost_basis:f.cost_basis,current_price:f.current_price,currency:f.currency})))}async function Et(a){const{data:{user:d}}=await T.auth.getUser();if(!d)return{type:"error",message:"請先登入。"};const{data:m,error:f}=await T.from("holdings").insert({user_id:d.id,symbol:a.symbol,market:a.market,name:a.name,shares:a.shares??0,loaned_shares:a.loaned_shares??0,cost_basis:a.cost_basis??0,current_price:a.current_price,currency:a.currency}).select().single();if(f||!m)return{type:"error",message:`新增失敗: ${f==null?void 0:f.message}`};const v=m;return n.value.push({id:v.id,symbol:v.symbol,market:v.market,name:v.name,shares:v.shares,loaned_shares:v.loaned_shares,cost_basis:v.cost_basis,current_price:v.current_price,currency:v.currency}),{type:"success",message:"已新增部位。"}}async function Ut(a,d){const{error:m}=await T.from("holdings").update(d).eq("id",a);if(m)return{type:"error",message:`更新失敗: ${m.message}`};const f=n.value.findIndex(v=>v.id===a);return f!==-1&&(n.value[f]={...n.value[f],...d}),{type:"success",message:"已更新部位。"}}async function G(a){const{error:d}=await T.from("holdings").delete().eq("id",a);return d?{type:"error",message:`刪除失敗: ${d.message}`}:(n.value=n.value.filter(m=>m.id!==a),{type:"success",message:"已刪除部位。"})}function Y(a){n.value.forEach(d=>{a[d.symbol]!==void 0&&(d.current_price=a[d.symbol])}),Promise.all(n.value.filter(d=>a[d.symbol]!==void 0).map(d=>T.from("holdings").update({current_price:a[d.symbol]}).eq("id",d.id)))}async function ut(){p||(o.value=!0,await Promise.all([A(),ft(),W(),nt()]),o.value=!1,p=!0)}async function nt(){var a,d;if(i.value)return{type:"error",message:"匯率更新中，請稍候"};i.value=!0,s.value="";try{const f=(await P.get("https://open.er-api.com/v6/latest/TWD")).data,v=(a=f.rates)==null?void 0:a.USD,S=(d=f.rates)==null?void 0:d.JPY;if(!v||!S)throw new Error("回傳資料不完整");const $=1/v,Dt=1/S;if(!Number.isFinite($)||!Number.isFinite(Dt))throw new Error("匯率格式錯誤");return r.value={USD:$,JPY:Dt},l.value=f.time_last_update_utc??new Date().toISOString(),{type:"success",message:"匯率已更新"}}catch(m){return s.value=m instanceof Error?m.message:"無法更新匯率",{type:"error",message:`匯率更新失敗：${s.value}`}}finally{i.value=!1}}const Tt=k(()=>l.value?new Intl.DateTimeFormat("zh-TW",{dateStyle:"medium",timeStyle:"short"}).format(new Date(l.value)):"-"),ln=k(()=>{const a=r.value.USD.toFixed(2),d=r.value.JPY.toFixed(4);return`USD ${a} / JPY ${d}`}),dn=k(()=>{const a={TWD:{key:"TWD",currency:"TWD",asset:0,liability:0,net:0},USD:{key:"USD",currency:"USD",asset:0,liability:0,net:0},JPY:{key:"JPY",currency:"JPY",asset:0,liability:0,net:0}};for(const d of U.value){const m=L(d.id,C.value),f=a[d.currency];d.type==="asset"?f.asset+=m:f.liability+=m,f.net=f.asset-f.liability}return Object.values(a)}),cn=k(()=>{let a=0;for(const d of U.value){const m=L(d.id,C.value),f=d.type==="asset"?m:-m;a+=_(f,d.currency)}return a}),le=k(()=>{if(x.value.length===0)return[];const a=Q(y.value),d=Q(h.value),m=Math.min(a,d),f=Math.max(a,d);return x.value.filter(v=>{const S=Q(v);return S>=m&&S<=f})}),bn=k(()=>x.value[0]??c.value),pn=k(()=>x.value[x.value.length-1]??c.value),fn=k(()=>ge(lt)),de=k(()=>Date.now());function tt(a){const d=Q(a),m=Q(lt),f=Q(c.value);return d<m?lt:d>f?c.value:a}const hn=k({get(){if(!y.value||!h.value)return null;const a=ge(y.value),d=Math.min(Do(h.value),de.value);return[a,d]},set(a){if(!a)return;const[d,m]=a;y.value=tt(ye(d)),h.value=tt(ye(m))}});function mn(a){return a<fn.value||a>de.value}const ce=k(()=>le.value.map(a=>{const d=U.value.map(f=>{const v=L(f.id,a),S=f.type==="asset"?v:-v,$=_(S,f.currency);return{accountId:f.id,accountName:f.name,type:f.type,currency:f.currency,amount:v,signedTwd:$}}).sort((f,v)=>Math.abs(v.signedTwd)-Math.abs(f.signedTwd)),m=d.reduce((f,v)=>f+v.signedTwd,0);return{key:a,month:a,totalTwd:m,breakdown:d}})),gn=k(()=>ce.value.map(({key:a,month:d,totalTwd:m})=>({key:a,month:d,totalTwd:m}))),yn=k(()=>{const a=[];let d=0;for(const m of x.value){let f=0,v=0;for(const At of U.value){const pe=L(At.id,m);At.type==="asset"?f+=_(pe,At.currency):v+=_(pe,At.currency)}const S=f-v,$=a.length===0?0:S-d,Dt=a.length===0||d===0?null:$/d*100;a.push({key:m,month:m,assetTwd:f,liabilityTwd:v,netTwd:S,delta:$,pct:Dt}),d=S}return a}),vn=k(()=>U.value.map(a=>{const d=L(a.id,C.value),m=at.value?L(a.id,at.value):0,f=d-m,v=m===0?null:f/m*100,S=a.type==="asset"?1:-1;return{key:a.id,accountName:a.name,category:a.category,type:a.type,currency:a.currency,current:d,delta:f,deltaTwd:_(f,a.currency),pct:v,netImpactTwd:_(d*S,a.currency)}})),wn=k(()=>{if(!st.value)return[];const a=[];let d=0;for(const m of x.value){const f=L(st.value.id,m),v=a.length===0?0:f-d,S=a.length===0||d===0?null:v/d*100;a.push({key:m,month:m,amount:f,delta:v,pct:S}),d=f}return a});async function In(){if(!R.value.name.trim())return{type:"error",message:"請先填入帳戶名稱。"};const{data:{user:a}}=await T.auth.getUser();if(!a)return{type:"error",message:"請先登入才能新增帳戶。"};const d=t.value.length>0?Math.max(...t.value.map($=>$.sort_order||0)):0,m={user_id:a.id,name:R.value.name.trim(),category:R.value.category.trim()||"未分類",currency:R.value.currency,type:R.value.type,sort_order:d+1},{data:f,error:v}=await T.from("accounts").insert(m).select().single();if(v||!f)return{type:"error",message:`新增失敗: ${v==null?void 0:v.message}`};const S=f;return t.value.push(S),b.value=[...b.value,S.id],R.value={name:"",category:"",type:"asset",currency:"TWD"},{type:"success",message:`已新增帳戶：${S.name}`}}async function xn(a,d){if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(a))return{type:"error",message:"月份格式錯誤，請用 YYYY-MM。"};if(d.length===0)return{type:"error",message:"目前沒有可儲存的帳戶資料。"};const{data:{user:m}}=await T.auth.getUser();if(!m)return{type:"error",message:"請先登入。"};const f=d.map(S=>({user_id:m.id,account_id:S.accountId,month:a,amount:Math.max(0,S.amount)})),{error:v}=await T.from("monthly_records").upsert(f,{onConflict:"account_id, month"});return v?{type:"error",message:`儲存失敗: ${v.message}`}:(await ft(),C.value=tt(a),{type:"success",message:`已儲存 ${a} 的資料。`})}function Sn(){b.value=t.value.map(a=>a.id)}function Cn(){const a=x.value.length>0?x.value[x.value.length-1]:c.value;C.value=a}async function be(a,d){const m=t.value.find($=>$.id===a);if(!m)return{type:"error",message:"找不到帳戶。"};const f={};d.name!==void 0&&(f.name=d.name.trim()),d.category!==void 0&&(f.category=d.category.trim()),d.currency!==void 0&&(f.currency=d.currency);const{error:v}=await T.from("accounts").update(f).eq("id",a);if(v)return{type:"error",message:`更新失敗: ${v.message}`};const S=t.value.findIndex($=>$.id===a);return S>=0&&(t.value[S]={...t.value[S],...f}),{type:"success",message:`已更新帳戶：${f.name??m.name}`}}async function Rn(a){const d=await be(a.id,{name:a.name,category:a.category,currency:a.currency});if(d.type==="error")throw new Error(d.message)}async function kn(a,d){const m=[...t.value];if(a<0||a>=m.length||d<0||d>=m.length||a===d)return{type:"success",message:"無需變更"};const[f]=m.splice(a,1);m.splice(d,0,f),t.value=m;const v=m.map((S,$)=>({id:S.id,sort_order:$}));try{return await Promise.all(v.map(S=>T.from("accounts").update({sort_order:S.sort_order}).eq("id",S.id))),{type:"success",message:"排序已更新"}}catch(S){return console.error("Sorting error:",S),{type:"error",message:"排序儲存失敗"}}}async function Pn(a){const d=t.value.find(v=>v.id===a);if(!d)return{type:"error",message:"找不到要刪除的帳戶。"};const{error:m}=await T.from("monthly_records").delete().eq("account_id",a);if(m)return{type:"error",message:`刪除關聯紀錄失敗: ${m.message}`};const{error:f}=await T.from("accounts").delete().eq("id",a);return f?{type:"error",message:`刪除帳戶失敗: ${f.message}`}:(t.value=t.value.filter(v=>v.id!==a),b.value=b.value.filter(v=>v!==a),e.value=e.value.filter(v=>v.accountId!==a),{type:"success",message:`已刪除帳戶：${d.name}`})}return p||ut(),{accounts:t,records:e,holdings:n,isLoading:o,fxRates:r,fxLoading:i,fxError:s,fxUpdatedAt:l,fxUpdatedLabel:Tt,fxDisplayLabel:ln,fxSource:g,months:x,selectedMonth:C,selectedAccountIds:b,rangeStartMonth:y,rangeEndMonth:h,minMonth:bn,maxMonth:pn,monthRangeValue:hn,newAccount:R,monthOptions:D,accountOptions:j,currencyOptions:K,accountTypeOptions:B,categoryOptions:pt,selectedAccounts:U,selectedAccount:st,previousMonth:at,selectedRangeMonths:le,currencySummaryRows:dn,selectedNetTwd:cn,combinedWaterPoints:gn,combinedWaterPointDetails:ce,trendRows:yn,accountSnapshotRows:vn,singleAccountTrendRows:wn,accountMap:E,amountAtMonth:L,toTwd:_,formatCurrency:Po,formatPct:Eo,accountDisplayName:Pt,isMonthOutOfRange:mn,refreshFxRates:nt,addAccount:In,bulkUpsertMonthlyRecords:xn,selectAllAccounts:Sn,selectLatestMonth:Cn,updateAccountById:be,updateAccount:Rn,reorderAccount:kn,deleteAccount:Pn,fetchHoldings:W,addHolding:Et,updateHolding:Ut,deleteHolding:G,batchCacheHoldingPrices:Y,initData:ut}});export{Ri as A,Me as a,uo as b,Ze as c,Wi as d,po as e,ki as f,xo as g,P as h,fo as s,Ci as u};
