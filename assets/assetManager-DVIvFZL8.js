import{B as $e,g as He,C as Ie,o as B,c as U,m as x,i as xe,a as Q,G as Xe,a2 as Ze,ao as pe,I as me,J as fe,q as he,e as be,am as Qe,x as ge,h as A,b as J,n as H,p as X,ap as Z,aq as et,r as C,ar as tt,al as g,s as T}from"./index-BDQFbiVB.js";import{a as nt,s as rt,g as it,b as at,c as st,E as _,m as P,r as ut,d as ye,t as ve,e as ot}from"./bankIcons-Bf2o7MFZ.js";var lt=`
    .p-skeleton {
        display: block;
        overflow: hidden;
        background: dt('skeleton.background');
        border-radius: dt('skeleton.border.radius');
    }

    .p-skeleton::after {
        content: '';
        animation: p-skeleton-animation 1.2s infinite;
        height: 100%;
        left: 0;
        position: absolute;
        right: 0;
        top: 0;
        transform: translateX(-100%);
        z-index: 1;
        background: linear-gradient(90deg, rgba(255, 255, 255, 0), dt('skeleton.animation.background'), rgba(255, 255, 255, 0));
    }

    [dir='rtl'] .p-skeleton::after {
        animation-name: p-skeleton-animation-rtl;
    }

    .p-skeleton-circle {
        border-radius: 50%;
    }

    .p-skeleton-animation-none::after {
        animation: none;
    }

    @keyframes p-skeleton-animation {
        from {
            transform: translateX(-100%);
        }
        to {
            transform: translateX(100%);
        }
    }

    @keyframes p-skeleton-animation-rtl {
        from {
            transform: translateX(100%);
        }
        to {
            transform: translateX(-100%);
        }
    }
`,ct={root:{position:"relative"}},dt={root:function(e){var n=e.props;return["p-skeleton p-component",{"p-skeleton-circle":n.shape==="circle","p-skeleton-animation-none":n.animation==="none"}]}},pt=$e.extend({name:"skeleton",style:lt,classes:dt,inlineStyles:ct}),mt={name:"BaseSkeleton",extends:He,props:{shape:{type:String,default:"rectangle"},size:{type:String,default:null},width:{type:String,default:"100%"},height:{type:String,default:"1rem"},borderRadius:{type:String,default:null},animation:{type:String,default:"wave"}},style:pt,provide:function(){return{$pcSkeleton:this,$parentInstance:this}}};function z(t){"@babel/helpers - typeof";return z=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(e){return typeof e}:function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},z(t)}function ft(t,e,n){return(e=ht(e))in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function ht(t){var e=bt(t,"string");return z(e)=="symbol"?e:e+""}function bt(t,e){if(z(t)!="object"||!t)return t;var n=t[Symbol.toPrimitive];if(n!==void 0){var r=n.call(t,e);if(z(r)!="object")return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}var gt={name:"Skeleton",extends:mt,inheritAttrs:!1,computed:{containerStyle:function(){return this.size?{width:this.size,height:this.size,borderRadius:this.borderRadius}:{width:this.width,height:this.height,borderRadius:this.borderRadius}},dataP:function(){return Ie(ft({},this.shape,this.shape))}}},yt=["data-p"];function vt(t,e,n,r,u,a){return B(),U("div",x({class:t.cx("root"),style:[t.sx("root"),a.containerStyle],"aria-hidden":"true"},t.ptmi("root"),{"data-p":a.dataP}),null,16,yt)}gt.render=vt;var Ce={name:"AngleDownIcon",extends:xe};function wt(t){return xt(t)||It(t)||$t(t)||St()}function St(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function $t(t,e){if(t){if(typeof t=="string")return te(t,e);var n={}.toString.call(t).slice(8,-1);return n==="Object"&&t.constructor&&(n=t.constructor.name),n==="Map"||n==="Set"?Array.from(t):n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?te(t,e):void 0}}function It(t){if(typeof Symbol<"u"&&t[Symbol.iterator]!=null||t["@@iterator"]!=null)return Array.from(t)}function xt(t){if(Array.isArray(t))return te(t)}function te(t,e){(e==null||e>t.length)&&(e=t.length);for(var n=0,r=Array(e);n<e;n++)r[n]=t[n];return r}function Ct(t,e,n,r,u,a){return B(),U("svg",x({width:"14",height:"14",viewBox:"0 0 14 14",fill:"none",xmlns:"http://www.w3.org/2000/svg"},t.pti()),wt(e[0]||(e[0]=[Q("path",{d:"M3.58659 4.5007C3.68513 4.50023 3.78277 4.51945 3.87379 4.55723C3.9648 4.59501 4.04735 4.65058 4.11659 4.7207L7.11659 7.7207L10.1166 4.7207C10.2619 4.65055 10.4259 4.62911 10.5843 4.65956C10.7427 4.69002 10.8871 4.77074 10.996 4.88976C11.1049 5.00877 11.1726 5.15973 11.1889 5.32022C11.2052 5.48072 11.1693 5.6422 11.0866 5.7807L7.58659 9.2807C7.44597 9.42115 7.25534 9.50004 7.05659 9.50004C6.85784 9.50004 6.66722 9.42115 6.52659 9.2807L3.02659 5.7807C2.88614 5.64007 2.80725 5.44945 2.80725 5.2507C2.80725 5.05195 2.88614 4.86132 3.02659 4.7207C3.09932 4.64685 3.18675 4.58911 3.28322 4.55121C3.37969 4.51331 3.48305 4.4961 3.58659 4.5007Z",fill:"currentColor"},null,-1)])),16)}Ce.render=Ct;var De={name:"AngleUpIcon",extends:xe};function Dt(t){return Tt(t)||Mt(t)||kt(t)||Bt()}function Bt(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function kt(t,e){if(t){if(typeof t=="string")return ne(t,e);var n={}.toString.call(t).slice(8,-1);return n==="Object"&&t.constructor&&(n=t.constructor.name),n==="Map"||n==="Set"?Array.from(t):n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?ne(t,e):void 0}}function Mt(t){if(typeof Symbol<"u"&&t[Symbol.iterator]!=null||t["@@iterator"]!=null)return Array.from(t)}function Tt(t){if(Array.isArray(t))return ne(t)}function ne(t,e){(e==null||e>t.length)&&(e=t.length);for(var n=0,r=Array(e);n<e;n++)r[n]=t[n];return r}function Pt(t,e,n,r,u,a){return B(),U("svg",x({width:"14",height:"14",viewBox:"0 0 14 14",fill:"none",xmlns:"http://www.w3.org/2000/svg"},t.pti()),Dt(e[0]||(e[0]=[Q("path",{d:"M10.4134 9.49931C10.3148 9.49977 10.2172 9.48055 10.1262 9.44278C10.0352 9.405 9.95263 9.34942 9.88338 9.27931L6.88338 6.27931L3.88338 9.27931C3.73811 9.34946 3.57409 9.3709 3.41567 9.34044C3.25724 9.30999 3.11286 9.22926 3.00395 9.11025C2.89504 8.99124 2.82741 8.84028 2.8111 8.67978C2.79478 8.51928 2.83065 8.35781 2.91338 8.21931L6.41338 4.71931C6.55401 4.57886 6.74463 4.49997 6.94338 4.49997C7.14213 4.49997 7.33276 4.57886 7.47338 4.71931L10.9734 8.21931C11.1138 8.35994 11.1927 8.55056 11.1927 8.74931C11.1927 8.94806 11.1138 9.13868 10.9734 9.27931C10.9007 9.35315 10.8132 9.41089 10.7168 9.44879C10.6203 9.48669 10.5169 9.5039 10.4134 9.49931Z",fill:"currentColor"},null,-1)])),16)}De.render=Pt;var At=`
    .p-inputnumber {
        display: inline-flex;
        position: relative;
    }

    .p-inputnumber-button {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 auto;
        cursor: pointer;
        background: dt('inputnumber.button.background');
        color: dt('inputnumber.button.color');
        width: dt('inputnumber.button.width');
        transition:
            background dt('inputnumber.transition.duration'),
            color dt('inputnumber.transition.duration'),
            border-color dt('inputnumber.transition.duration'),
            outline-color dt('inputnumber.transition.duration');
    }

    .p-inputnumber-button:disabled {
        cursor: auto;
    }

    .p-inputnumber-button:not(:disabled):hover {
        background: dt('inputnumber.button.hover.background');
        color: dt('inputnumber.button.hover.color');
    }

    .p-inputnumber-button:not(:disabled):active {
        background: dt('inputnumber.button.active.background');
        color: dt('inputnumber.button.active.color');
    }

    .p-inputnumber-stacked .p-inputnumber-button {
        position: relative;
        flex: 1 1 auto;
        border: 0 none;
    }

    .p-inputnumber-stacked .p-inputnumber-button-group {
        display: flex;
        flex-direction: column;
        position: absolute;
        inset-block-start: 1px;
        inset-inline-end: 1px;
        height: calc(100% - 2px);
        z-index: 1;
    }

    .p-inputnumber-stacked .p-inputnumber-increment-button {
        padding: 0;
        border-start-end-radius: calc(dt('inputnumber.button.border.radius') - 1px);
    }

    .p-inputnumber-stacked .p-inputnumber-decrement-button {
        padding: 0;
        border-end-end-radius: calc(dt('inputnumber.button.border.radius') - 1px);
    }

    .p-inputnumber-stacked .p-inputnumber-input {
        padding-inline-end: calc(dt('inputnumber.button.width') + dt('form.field.padding.x'));
    }

    .p-inputnumber-horizontal .p-inputnumber-button {
        border: 1px solid dt('inputnumber.button.border.color');
    }

    .p-inputnumber-horizontal .p-inputnumber-button:hover {
        border-color: dt('inputnumber.button.hover.border.color');
    }

    .p-inputnumber-horizontal .p-inputnumber-button:active {
        border-color: dt('inputnumber.button.active.border.color');
    }

    .p-inputnumber-horizontal .p-inputnumber-increment-button {
        order: 3;
        border-start-end-radius: dt('inputnumber.button.border.radius');
        border-end-end-radius: dt('inputnumber.button.border.radius');
        border-inline-start: 0 none;
    }

    .p-inputnumber-horizontal .p-inputnumber-input {
        order: 2;
        border-radius: 0;
    }

    .p-inputnumber-horizontal .p-inputnumber-decrement-button {
        order: 1;
        border-start-start-radius: dt('inputnumber.button.border.radius');
        border-end-start-radius: dt('inputnumber.button.border.radius');
        border-inline-end: 0 none;
    }

    .p-floatlabel:has(.p-inputnumber-horizontal) label {
        margin-inline-start: dt('inputnumber.button.width');
    }

    .p-inputnumber-vertical {
        flex-direction: column;
    }

    .p-inputnumber-vertical .p-inputnumber-button {
        border: 1px solid dt('inputnumber.button.border.color');
        padding: dt('inputnumber.button.vertical.padding');
    }

    .p-inputnumber-vertical .p-inputnumber-button:hover {
        border-color: dt('inputnumber.button.hover.border.color');
    }

    .p-inputnumber-vertical .p-inputnumber-button:active {
        border-color: dt('inputnumber.button.active.border.color');
    }

    .p-inputnumber-vertical .p-inputnumber-increment-button {
        order: 1;
        border-start-start-radius: dt('inputnumber.button.border.radius');
        border-start-end-radius: dt('inputnumber.button.border.radius');
        width: 100%;
        border-block-end: 0 none;
    }

    .p-inputnumber-vertical .p-inputnumber-input {
        order: 2;
        border-radius: 0;
        text-align: center;
    }

    .p-inputnumber-vertical .p-inputnumber-decrement-button {
        order: 3;
        border-end-start-radius: dt('inputnumber.button.border.radius');
        border-end-end-radius: dt('inputnumber.button.border.radius');
        width: 100%;
        border-block-start: 0 none;
    }

    .p-inputnumber-input {
        flex: 1 1 auto;
    }

    .p-inputnumber-fluid {
        width: 100%;
    }

    .p-inputnumber-fluid .p-inputnumber-input {
        width: 1%;
    }

    .p-inputnumber-fluid.p-inputnumber-vertical .p-inputnumber-input {
        width: 100%;
    }

    .p-inputnumber:has(.p-inputtext-sm) .p-inputnumber-button .p-icon {
        font-size: dt('form.field.sm.font.size');
        width: dt('form.field.sm.font.size');
        height: dt('form.field.sm.font.size');
    }

    .p-inputnumber:has(.p-inputtext-lg) .p-inputnumber-button .p-icon {
        font-size: dt('form.field.lg.font.size');
        width: dt('form.field.lg.font.size');
        height: dt('form.field.lg.font.size');
    }

    .p-inputnumber-clear-icon {
        position: absolute;
        top: 50%;
        margin-top: -0.5rem;
        cursor: pointer;
        inset-inline-end: dt('form.field.padding.x');
        color: dt('form.field.icon.color');
    }

    .p-inputnumber:has(.p-inputnumber-clear-icon) .p-inputnumber-input {
        padding-inline-end: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .p-inputnumber-stacked .p-inputnumber-clear-icon {
        inset-inline-end: calc(dt('inputnumber.button.width') + dt('form.field.padding.x'));
    }

    .p-inputnumber-stacked:has(.p-inputnumber-clear-icon) .p-inputnumber-input {
        padding-inline-end: calc(dt('inputnumber.button.width') + (dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .p-inputnumber-horizontal .p-inputnumber-clear-icon {
        inset-inline-end: calc(dt('inputnumber.button.width') + dt('form.field.padding.x'));
    }
`,Et={root:function(e){var n=e.instance,r=e.props;return["p-inputnumber p-component p-inputwrapper",{"p-invalid":n.$invalid,"p-inputwrapper-filled":n.$filled||r.allowEmpty===!1,"p-inputwrapper-focus":n.focused,"p-inputnumber-stacked":r.showButtons&&r.buttonLayout==="stacked","p-inputnumber-horizontal":r.showButtons&&r.buttonLayout==="horizontal","p-inputnumber-vertical":r.showButtons&&r.buttonLayout==="vertical","p-inputnumber-fluid":n.$fluid}]},pcInputText:"p-inputnumber-input",clearIcon:"p-inputnumber-clear-icon",buttonGroup:"p-inputnumber-button-group",incrementButton:function(e){var n=e.instance,r=e.props;return["p-inputnumber-button p-inputnumber-increment-button",{"p-disabled":r.showButtons&&r.max!==null&&n.maxBoundry()}]},decrementButton:function(e){var n=e.instance,r=e.props;return["p-inputnumber-button p-inputnumber-decrement-button",{"p-disabled":r.showButtons&&r.min!==null&&n.minBoundry()}]}},Rt=$e.extend({name:"inputnumber",style:At,classes:Et}),Lt={name:"BaseInputNumber",extends:rt,props:{format:{type:Boolean,default:!0},showButtons:{type:Boolean,default:!1},buttonLayout:{type:String,default:"stacked"},incrementButtonClass:{type:String,default:null},decrementButtonClass:{type:String,default:null},incrementButtonIcon:{type:String,default:void 0},incrementIcon:{type:String,default:void 0},decrementButtonIcon:{type:String,default:void 0},decrementIcon:{type:String,default:void 0},locale:{type:String,default:void 0},localeMatcher:{type:String,default:void 0},mode:{type:String,default:"decimal"},prefix:{type:String,default:null},suffix:{type:String,default:null},currency:{type:String,default:void 0},currencyDisplay:{type:String,default:void 0},useGrouping:{type:Boolean,default:!0},minFractionDigits:{type:Number,default:void 0},maxFractionDigits:{type:Number,default:void 0},roundingMode:{type:String,default:"halfExpand",validator:function(e){return["ceil","floor","expand","trunc","halfCeil","halfFloor","halfExpand","halfTrunc","halfEven"].includes(e)}},min:{type:Number,default:null},max:{type:Number,default:null},step:{type:Number,default:1},allowEmpty:{type:Boolean,default:!0},highlightOnFocus:{type:Boolean,default:!1},showClear:{type:Boolean,default:!1},readonly:{type:Boolean,default:!1},placeholder:{type:String,default:null},inputId:{type:String,default:null},inputClass:{type:[String,Object],default:null},inputStyle:{type:Object,default:null},ariaLabelledby:{type:String,default:null},ariaLabel:{type:String,default:null},required:{type:Boolean,default:!1}},style:Rt,provide:function(){return{$pcInputNumber:this,$parentInstance:this}}};function K(t){"@babel/helpers - typeof";return K=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(e){return typeof e}:function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},K(t)}function we(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter(function(u){return Object.getOwnPropertyDescriptor(t,u).enumerable})),n.push.apply(n,r)}return n}function Se(t){for(var e=1;e<arguments.length;e++){var n=arguments[e]!=null?arguments[e]:{};e%2?we(Object(n),!0).forEach(function(r){re(t,r,n[r])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):we(Object(n)).forEach(function(r){Object.defineProperty(t,r,Object.getOwnPropertyDescriptor(n,r))})}return t}function re(t,e,n){return(e=Ut(e))in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function Ut(t){var e=Vt(t,"string");return K(e)=="symbol"?e:e+""}function Vt(t,e){if(K(t)!="object"||!t)return t;var n=t[Symbol.toPrimitive];if(n!==void 0){var r=n.call(t,e);if(K(r)!="object")return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}function Ft(t){return jt(t)||_t(t)||Ot(t)||Nt()}function Nt(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function Ot(t,e){if(t){if(typeof t=="string")return ie(t,e);var n={}.toString.call(t).slice(8,-1);return n==="Object"&&t.constructor&&(n=t.constructor.name),n==="Map"||n==="Set"?Array.from(t):n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?ie(t,e):void 0}}function _t(t){if(typeof Symbol<"u"&&t[Symbol.iterator]!=null||t["@@iterator"]!=null)return Array.from(t)}function jt(t){if(Array.isArray(t))return ie(t)}function ie(t,e){(e==null||e>t.length)&&(e=t.length);for(var n=0,r=Array(e);n<e;n++)r[n]=t[n];return r}var zt={name:"InputNumber",extends:Lt,inheritAttrs:!1,emits:["input","focus","blur"],inject:{$pcFluid:{default:null}},numberFormat:null,_numeral:null,_decimal:null,_group:null,_minusSign:null,_currency:null,_suffix:null,_prefix:null,_index:null,groupChar:"",isSpecialChar:null,prefixChar:null,suffixChar:null,timer:null,data:function(){return{d_modelValue:this.d_value,focused:!1}},watch:{d_value:{immediate:!0,handler:function(e){var n;this.d_modelValue=e,(n=this.$refs.clearIcon)!==null&&n!==void 0&&(n=n.$el)!==null&&n!==void 0&&n.style&&(this.$refs.clearIcon.$el.style.display=me(e)?"none":"block")}},locale:function(e,n){this.updateConstructParser(e,n)},localeMatcher:function(e,n){this.updateConstructParser(e,n)},mode:function(e,n){this.updateConstructParser(e,n)},currency:function(e,n){this.updateConstructParser(e,n)},currencyDisplay:function(e,n){this.updateConstructParser(e,n)},useGrouping:function(e,n){this.updateConstructParser(e,n)},minFractionDigits:function(e,n){this.updateConstructParser(e,n)},maxFractionDigits:function(e,n){this.updateConstructParser(e,n)},suffix:function(e,n){this.updateConstructParser(e,n)},prefix:function(e,n){this.updateConstructParser(e,n)}},created:function(){this.constructParser()},mounted:function(){var e;(e=this.$refs.clearIcon)!==null&&e!==void 0&&(e=e.$el)!==null&&e!==void 0&&e.style&&(this.$refs.clearIcon.$el.style.display=this.$filled?"block":"none")},methods:{getOptions:function(){return{localeMatcher:this.localeMatcher,style:this.mode,currency:this.currency,currencyDisplay:this.currencyDisplay,useGrouping:this.useGrouping,minimumFractionDigits:this.minFractionDigits,maximumFractionDigits:this.maxFractionDigits,roundingMode:this.roundingMode}},constructParser:function(){this.numberFormat=new Intl.NumberFormat(this.locale,this.getOptions());var e=Ft(new Intl.NumberFormat(this.locale,{useGrouping:!1}).format(9876543210)).reverse(),n=new Map(e.map(function(r,u){return[r,u]}));this._numeral=new RegExp("[".concat(e.join(""),"]"),"g"),this._group=this.getGroupingExpression(),this._minusSign=this.getMinusSignExpression(),this._currency=this.getCurrencyExpression(),this._decimal=this.getDecimalExpression(),this._suffix=this.getSuffixExpression(),this._prefix=this.getPrefixExpression(),this._index=function(r){return n.get(r)}},updateConstructParser:function(e,n){e!==n&&this.constructParser()},escapeRegExp:function(e){return e.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&")},getDecimalExpression:function(){var e=new Intl.NumberFormat(this.locale,Se(Se({},this.getOptions()),{},{useGrouping:!1}));return new RegExp("[".concat(e.format(1.1).replace(this._currency,"").trim().replace(this._numeral,""),"]"),"g")},getGroupingExpression:function(){var e=new Intl.NumberFormat(this.locale,{useGrouping:!0});return this.groupChar=e.format(1e6).trim().replace(this._numeral,"").charAt(0),new RegExp("[".concat(this.groupChar,"]"),"g")},getMinusSignExpression:function(){var e=new Intl.NumberFormat(this.locale,{useGrouping:!1});return new RegExp("[".concat(e.format(-1).trim().replace(this._numeral,""),"]"),"g")},getCurrencyExpression:function(){if(this.currency){var e=new Intl.NumberFormat(this.locale,{style:"currency",currency:this.currency,currencyDisplay:this.currencyDisplay,minimumFractionDigits:0,maximumFractionDigits:0,roundingMode:this.roundingMode});return new RegExp("[".concat(e.format(1).replace(/\s/g,"").replace(this._numeral,"").replace(this._group,""),"]"),"g")}return new RegExp("[]","g")},getPrefixExpression:function(){if(this.prefix)this.prefixChar=this.prefix;else{var e=new Intl.NumberFormat(this.locale,{style:this.mode,currency:this.currency,currencyDisplay:this.currencyDisplay});this.prefixChar=e.format(1).split("1")[0]}return new RegExp("".concat(this.escapeRegExp(this.prefixChar||"")),"g")},getSuffixExpression:function(){if(this.suffix)this.suffixChar=this.suffix;else{var e=new Intl.NumberFormat(this.locale,{style:this.mode,currency:this.currency,currencyDisplay:this.currencyDisplay,minimumFractionDigits:0,maximumFractionDigits:0,roundingMode:this.roundingMode});this.suffixChar=e.format(1).split("1")[1]}return new RegExp("".concat(this.escapeRegExp(this.suffixChar||"")),"g")},formatValue:function(e){if(e!=null){if(e==="-")return e;if(this.format){var n=new Intl.NumberFormat(this.locale,this.getOptions()),r=n.format(e);return this.prefix&&(r=this.prefix+r),this.suffix&&(r=r+this.suffix),r}return e.toString()}return""},parseValue:function(e){var n=e.replace(this._suffix,"").replace(this._prefix,"").trim().replace(/\s/g,"").replace(this._currency,"").replace(this._group,"").replace(this._minusSign,"-").replace(this._decimal,".").replace(this._numeral,this._index);if(n){if(n==="-")return n;var r=+n;return isNaN(r)?null:r}return null},repeat:function(e,n,r){var u=this;if(!this.readonly){var a=n||500;this.clearTimer(),this.timer=setTimeout(function(){u.repeat(e,40,r)},a),this.spin(e,r)}},addWithPrecision:function(e,n){var r=e.toString(),u=n.toString(),a=r.includes(".")?r.split(".")[1].length:0,l=u.includes(".")?u.split(".")[1].length:0,p=Math.max(a,l),v=Math.pow(10,p);return Math.round((e+n)*v)/v},spin:function(e,n){if(this.$refs.input){var r=this.step*n,u=this.parseValue(this.$refs.input.$el.value)||0,a=this.validateValue(this.addWithPrecision(u,r));this.updateInput(a,null,"spin"),this.updateModel(e,a),this.handleOnInput(e,u,a)}},onUpButtonMouseDown:function(e){this.disabled||(this.$refs.input.$el.focus(),this.repeat(e,null,1),e.preventDefault())},onUpButtonMouseUp:function(){this.disabled||this.clearTimer()},onUpButtonMouseLeave:function(){this.disabled||this.clearTimer()},onUpButtonKeyUp:function(){this.disabled||this.clearTimer()},onUpButtonKeyDown:function(e){(e.code==="Space"||e.code==="Enter"||e.code==="NumpadEnter")&&this.repeat(e,null,1)},onDownButtonMouseDown:function(e){this.disabled||(this.$refs.input.$el.focus(),this.repeat(e,null,-1),e.preventDefault())},onDownButtonMouseUp:function(){this.disabled||this.clearTimer()},onDownButtonMouseLeave:function(){this.disabled||this.clearTimer()},onDownButtonKeyUp:function(){this.disabled||this.clearTimer()},onDownButtonKeyDown:function(e){(e.code==="Space"||e.code==="Enter"||e.code==="NumpadEnter")&&this.repeat(e,null,-1)},onUserInput:function(){this.isSpecialChar&&(this.$refs.input.$el.value=this.lastValue),this.isSpecialChar=!1},onInputKeyDown:function(e){if(!this.readonly&&!e.isComposing){if(e.altKey||e.ctrlKey||e.metaKey){this.isSpecialChar=!0,this.lastValue=this.$refs.input.$el.value;return}this.lastValue=e.target.value;var n=e.target.selectionStart,r=e.target.selectionEnd,u=r-n,a=e.target.value,l=null,p=e.code||e.key;switch(p){case"ArrowUp":this.spin(e,1),e.preventDefault();break;case"ArrowDown":this.spin(e,-1),e.preventDefault();break;case"ArrowLeft":if(u>1){var v=this.isNumeralChar(a.charAt(n))?n+1:n+2;this.$refs.input.$el.setSelectionRange(v,v)}else this.isNumeralChar(a.charAt(n-1))||e.preventDefault();break;case"ArrowRight":if(u>1){var b=r-1;this.$refs.input.$el.setSelectionRange(b,b)}else this.isNumeralChar(a.charAt(n))||e.preventDefault();break;case"Tab":case"Enter":case"NumpadEnter":l=this.validateValue(this.parseValue(a)),this.$refs.input.$el.value=this.formatValue(l),this.$refs.input.$el.setAttribute("aria-valuenow",l),this.updateModel(e,l);break;case"Backspace":{if(e.preventDefault(),n===r){n>=a.length&&this.suffixChar!==null&&(n=a.length-this.suffixChar.length,this.$refs.input.$el.setSelectionRange(n,n));var k=a.charAt(n-1),y=this.getDecimalCharIndexes(a),m=y.decimalCharIndex,h=y.decimalCharIndexWithoutPrefix;if(this.isNumeralChar(k)){var w=this.getDecimalLength(a);if(this._group.test(k))this._group.lastIndex=0,l=a.slice(0,n-2)+a.slice(n-1);else if(this._decimal.test(k))this._decimal.lastIndex=0,w?this.$refs.input.$el.setSelectionRange(n-1,n-1):l=a.slice(0,n-1)+a.slice(n);else if(m>0&&n>m){var S=this.isDecimalMode()&&(this.minFractionDigits||0)<w?"":"0";l=a.slice(0,n-1)+S+a.slice(n)}else h===1?(l=a.slice(0,n-1)+"0"+a.slice(n),l=this.parseValue(l)>0?l:""):l=a.slice(0,n-1)+a.slice(n)}this.updateValue(e,l,null,"delete-single")}else l=this.deleteRange(a,n,r),this.updateValue(e,l,null,"delete-range");break}case"Delete":if(e.preventDefault(),n===r){var $=a.charAt(n),D=this.getDecimalCharIndexes(a),V=D.decimalCharIndex,F=D.decimalCharIndexWithoutPrefix;if(this.isNumeralChar($)){var N=this.getDecimalLength(a);if(this._group.test($))this._group.lastIndex=0,l=a.slice(0,n)+a.slice(n+2);else if(this._decimal.test($))this._decimal.lastIndex=0,N?this.$refs.input.$el.setSelectionRange(n+1,n+1):l=a.slice(0,n)+a.slice(n+1);else if(V>0&&n>V){var j=this.isDecimalMode()&&(this.minFractionDigits||0)<N?"":"0";l=a.slice(0,n)+j+a.slice(n+1)}else F===1?(l=a.slice(0,n)+"0"+a.slice(n+1),l=this.parseValue(l)>0?l:""):l=a.slice(0,n)+a.slice(n+1)}this.updateValue(e,l,null,"delete-back-single")}else l=this.deleteRange(a,n,r),this.updateValue(e,l,null,"delete-range");break;case"Home":e.preventDefault(),fe(this.min)&&this.updateModel(e,this.min);break;case"End":e.preventDefault(),fe(this.max)&&this.updateModel(e,this.max);break}}},onInputKeyPress:function(e){if(!this.readonly){var n=e.key,r=this.isDecimalSign(n),u=this.isMinusSign(n);e.code!=="Enter"&&e.preventDefault(),(Number(n)>=0&&Number(n)<=9||u||r)&&this.insert(e,n,{isDecimalSign:r,isMinusSign:u})}},onPaste:function(e){if(!this.readonly){e.preventDefault();var n=(e.clipboardData||window.clipboardData).getData("Text");if(!(this.inputId==="integeronly"&&/[^\d-]/.test(n))&&n){var r=this.parseValue(n);r!=null&&this.insert(e,r.toString())}}},onClearClick:function(e){this.updateModel(e,null),this.$refs.input.$el.focus()},allowMinusSign:function(){return this.min===null||this.min<0},isMinusSign:function(e){return this._minusSign.test(e)||e==="-"?(this._minusSign.lastIndex=0,!0):!1},isDecimalSign:function(e){var n;return(n=this.locale)!==null&&n!==void 0&&n.includes("fr")&&[".",","].includes(e)||this._decimal.test(e)?(this._decimal.lastIndex=0,!0):!1},isDecimalMode:function(){return this.mode==="decimal"},getDecimalCharIndexes:function(e){var n=e.search(this._decimal);this._decimal.lastIndex=0;var r=e.replace(this._prefix,"").trim().replace(/\s/g,"").replace(this._currency,""),u=r.search(this._decimal);return this._decimal.lastIndex=0,{decimalCharIndex:n,decimalCharIndexWithoutPrefix:u}},getCharIndexes:function(e){var n=e.search(this._decimal);this._decimal.lastIndex=0;var r=e.search(this._minusSign);this._minusSign.lastIndex=0;var u=e.search(this._suffix);this._suffix.lastIndex=0;var a=e.search(this._currency);return this._currency.lastIndex=0,{decimalCharIndex:n,minusCharIndex:r,suffixCharIndex:u,currencyCharIndex:a}},insert:function(e,n){var r=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{isDecimalSign:!1,isMinusSign:!1},u=n.search(this._minusSign);if(this._minusSign.lastIndex=0,!(!this.allowMinusSign()&&u!==-1)){var a=this.$refs.input.$el.selectionStart,l=this.$refs.input.$el.selectionEnd,p=this.$refs.input.$el.value.trim(),v=this.getCharIndexes(p),b=v.decimalCharIndex,k=v.minusCharIndex,y=v.suffixCharIndex,m=v.currencyCharIndex,h;if(r.isMinusSign){var w=k===-1;(a===0||a===m+1)&&(h=p,(w||l!==0)&&(h=this.insertText(p,n,0,l)),this.updateValue(e,h,n,"insert"))}else if(r.isDecimalSign)b>0&&a===b?this.updateValue(e,p,n,"insert"):b>a&&b<l?(h=this.insertText(p,n,a,l),this.updateValue(e,h,n,"insert")):b===-1&&this.maxFractionDigits&&(h=this.insertText(p,n,a,l),this.updateValue(e,h,n,"insert"));else{var S=this.numberFormat.resolvedOptions().maximumFractionDigits,$=a!==l?"range-insert":"insert";if(b>0&&a>b){if(a+n.length-(b+1)<=S){var D=m>=a?m-1:y>=a?y:p.length;h=p.slice(0,a)+n+p.slice(a+n.length,D)+p.slice(D),this.updateValue(e,h,n,$)}}else h=this.insertText(p,n,a,l),this.updateValue(e,h,n,$)}}},insertText:function(e,n,r,u){var a=n==="."?n:n.split(".");if(a.length===2){var l=e.slice(r,u).search(this._decimal);return this._decimal.lastIndex=0,l>0?e.slice(0,r)+this.formatValue(n)+e.slice(u):this.formatValue(n)||e}else return u-r===e.length?this.formatValue(n):r===0?n+e.slice(u):u===e.length?e.slice(0,r)+n:e.slice(0,r)+n+e.slice(u)},deleteRange:function(e,n,r){var u;return r-n===e.length?u="":n===0?u=e.slice(r):r===e.length?u=e.slice(0,n):u=e.slice(0,n)+e.slice(r),u},initCursor:function(){var e=this.$refs.input.$el.selectionStart,n=this.$refs.input.$el.value,r=n.length,u=null,a=(this.prefixChar||"").length;n=n.replace(this._prefix,""),e=e-a;var l=n.charAt(e);if(this.isNumeralChar(l))return e+a;for(var p=e-1;p>=0;)if(l=n.charAt(p),this.isNumeralChar(l)){u=p+a;break}else p--;if(u!==null)this.$refs.input.$el.setSelectionRange(u+1,u+1);else{for(p=e;p<r;)if(l=n.charAt(p),this.isNumeralChar(l)){u=p+a;break}else p++;u!==null&&this.$refs.input.$el.setSelectionRange(u,u)}return u||0},onInputClick:function(){var e=this.$refs.input.$el.value;!this.readonly&&e!==pe()&&this.initCursor()},isNumeralChar:function(e){return e.length===1&&(this._numeral.test(e)||this._decimal.test(e)||this._group.test(e)||this._minusSign.test(e))?(this.resetRegex(),!0):!1},resetRegex:function(){this._numeral.lastIndex=0,this._decimal.lastIndex=0,this._group.lastIndex=0,this._minusSign.lastIndex=0},updateValue:function(e,n,r,u){var a=this.$refs.input.$el.value,l=null;n!=null&&(l=this.parseValue(n),l=!l&&!this.allowEmpty?0:l,this.updateInput(l,r,u,n),this.handleOnInput(e,a,l))},handleOnInput:function(e,n,r){if(this.isValueChanged(n,r)){var u,a;this.$emit("input",{originalEvent:e,value:r,formattedValue:n}),(u=(a=this.formField).onInput)===null||u===void 0||u.call(a,{originalEvent:e,value:r})}},isValueChanged:function(e,n){if(n===null&&e!==null)return!0;if(n!=null){var r=typeof e=="string"?this.parseValue(e):e;return n!==r}return!1},validateValue:function(e){return e==="-"||e==null?null:this.min!=null&&e<this.min?this.min:this.max!=null&&e>this.max?this.max:e},updateInput:function(e,n,r,u){var a;n=n||"";var l=this.$refs.input.$el.value,p=this.formatValue(e),v=l.length;if(p!==u&&(p=this.concatValues(p,u)),v===0){this.$refs.input.$el.value=p,this.$refs.input.$el.setSelectionRange(0,0);var b=this.initCursor(),k=b+n.length;this.$refs.input.$el.setSelectionRange(k,k)}else{var y=this.$refs.input.$el.selectionStart,m=this.$refs.input.$el.selectionEnd;this.$refs.input.$el.value=p;var h=p.length;if(r==="range-insert"){var w=this.parseValue((l||"").slice(0,y)),S=w!==null?w.toString():"",$=S.split("").join("(".concat(this.groupChar,")?")),D=new RegExp($,"g");D.test(p);var V=n.split("").join("(".concat(this.groupChar,")?")),F=new RegExp(V,"g");F.test(p.slice(D.lastIndex)),m=D.lastIndex+F.lastIndex,this.$refs.input.$el.setSelectionRange(m,m)}else if(h===v)r==="insert"||r==="delete-back-single"?this.$refs.input.$el.setSelectionRange(m+1,m+1):r==="delete-single"?this.$refs.input.$el.setSelectionRange(m-1,m-1):(r==="delete-range"||r==="spin")&&this.$refs.input.$el.setSelectionRange(m,m);else if(r==="delete-back-single"){var N=l.charAt(m-1),j=l.charAt(m),W=v-h,G=this._group.test(j);G&&W===1?m+=1:!G&&this.isNumeralChar(N)&&(m+=-1*W+1),this._group.lastIndex=0,this.$refs.input.$el.setSelectionRange(m,m)}else if(l==="-"&&r==="insert"){this.$refs.input.$el.setSelectionRange(0,0);var M=this.initCursor(),O=M+n.length+1;this.$refs.input.$el.setSelectionRange(O,O)}else m=m+(h-v),this.$refs.input.$el.setSelectionRange(m,m)}this.$refs.input.$el.setAttribute("aria-valuenow",e),(a=this.$refs.clearIcon)!==null&&a!==void 0&&(a=a.$el)!==null&&a!==void 0&&a.style&&(this.$refs.clearIcon.$el.style.display=me(p)?"none":"block")},concatValues:function(e,n){if(e&&n){var r=n.search(this._decimal);return this._decimal.lastIndex=0,this.suffixChar?r!==-1?e.replace(this.suffixChar,"").split(this._decimal)[0]+n.replace(this.suffixChar,"").slice(r)+this.suffixChar:e:r!==-1?e.split(this._decimal)[0]+n.slice(r):e}return e},getDecimalLength:function(e){if(e){var n=e.split(this._decimal);if(n.length===2)return n[1].replace(this._suffix,"").trim().replace(/\s/g,"").replace(this._currency,"").length}return 0},updateModel:function(e,n){this.writeValue(n,e)},onInputFocus:function(e){this.focused=!0,!this.disabled&&!this.readonly&&this.$refs.input.$el.value!==pe()&&this.highlightOnFocus&&e.target.select(),this.$emit("focus",e)},onInputBlur:function(e){var n,r;this.focused=!1;var u=e.target,a=this.validateValue(this.parseValue(u.value));this.$emit("blur",{originalEvent:e,value:u.value}),(n=(r=this.formField).onBlur)===null||n===void 0||n.call(r,e),u.value=this.formatValue(a),u.setAttribute("aria-valuenow",a),this.updateModel(e,a),!this.disabled&&!this.readonly&&this.highlightOnFocus&&Ze()},clearTimer:function(){this.timer&&clearTimeout(this.timer)},maxBoundry:function(){return this.d_value>=this.max},minBoundry:function(){return this.d_value<=this.min}},computed:{upButtonListeners:function(){var e=this;return{mousedown:function(r){return e.onUpButtonMouseDown(r)},mouseup:function(r){return e.onUpButtonMouseUp(r)},mouseleave:function(r){return e.onUpButtonMouseLeave(r)},keydown:function(r){return e.onUpButtonKeyDown(r)},keyup:function(r){return e.onUpButtonKeyUp(r)}}},downButtonListeners:function(){var e=this;return{mousedown:function(r){return e.onDownButtonMouseDown(r)},mouseup:function(r){return e.onDownButtonMouseUp(r)},mouseleave:function(r){return e.onDownButtonMouseLeave(r)},keydown:function(r){return e.onDownButtonKeyDown(r)},keyup:function(r){return e.onDownButtonKeyUp(r)}}},formattedValue:function(){var e=!this.d_value&&!this.allowEmpty?0:this.d_value;return this.formatValue(e)},getFormatter:function(){return this.numberFormat},dataP:function(){return Ie(re(re({invalid:this.$invalid,fluid:this.$fluid,filled:this.$variant==="filled"},this.size,this.size),this.buttonLayout,this.showButtons&&this.buttonLayout))}},components:{InputText:nt,AngleUpIcon:De,AngleDownIcon:Ce,TimesIcon:Xe}},Kt=["data-p"],Wt=["data-p"],Gt=["disabled","data-p"],Yt=["disabled","data-p"],qt=["disabled","data-p"],Jt=["disabled","data-p"];function Ht(t,e,n,r,u,a){var l=he("InputText"),p=he("TimesIcon");return B(),U("span",x({class:t.cx("root")},t.ptmi("root"),{"data-p":a.dataP}),[be(l,{ref:"input",id:t.inputId,name:t.$formName,role:"spinbutton",class:ge([t.cx("pcInputText"),t.inputClass]),style:Qe(t.inputStyle),defaultValue:a.formattedValue,"aria-valuemin":t.min,"aria-valuemax":t.max,"aria-valuenow":t.d_value,inputmode:t.mode==="decimal"&&!t.minFractionDigits?"numeric":"decimal",disabled:t.disabled,readonly:t.readonly,placeholder:t.placeholder,"aria-labelledby":t.ariaLabelledby,"aria-label":t.ariaLabel,required:t.required,size:t.size,invalid:t.invalid,variant:t.variant,onInput:a.onUserInput,onKeydown:a.onInputKeyDown,onKeypress:a.onInputKeyPress,onPaste:a.onPaste,onClick:a.onInputClick,onFocus:a.onInputFocus,onBlur:a.onInputBlur,pt:t.ptm("pcInputText"),unstyled:t.unstyled,"data-p":a.dataP},null,8,["id","name","class","style","defaultValue","aria-valuemin","aria-valuemax","aria-valuenow","inputmode","disabled","readonly","placeholder","aria-labelledby","aria-label","required","size","invalid","variant","onInput","onKeydown","onKeypress","onPaste","onClick","onFocus","onBlur","pt","unstyled","data-p"]),t.showClear&&t.buttonLayout!=="vertical"?A(t.$slots,"clearicon",{key:0,class:ge(t.cx("clearIcon")),clearCallback:a.onClearClick},function(){return[be(p,x({ref:"clearIcon",class:[t.cx("clearIcon")],onClick:a.onClearClick},t.ptm("clearIcon")),null,16,["class","onClick"])]}):J("",!0),t.showButtons&&t.buttonLayout==="stacked"?(B(),U("span",x({key:1,class:t.cx("buttonGroup")},t.ptm("buttonGroup"),{"data-p":a.dataP}),[A(t.$slots,"incrementbutton",{listeners:a.upButtonListeners},function(){return[Q("button",x({class:[t.cx("incrementButton"),t.incrementButtonClass]},Z(a.upButtonListeners),{disabled:t.disabled,tabindex:-1,"aria-hidden":"true",type:"button"},t.ptm("incrementButton"),{"data-p":a.dataP}),[A(t.$slots,t.$slots.incrementicon?"incrementicon":"incrementbuttonicon",{},function(){return[(B(),H(X(t.incrementIcon||t.incrementButtonIcon?"span":"AngleUpIcon"),x({class:[t.incrementIcon,t.incrementButtonIcon]},t.ptm("incrementIcon"),{"data-pc-section":"incrementicon"}),null,16,["class"]))]})],16,Gt)]}),A(t.$slots,"decrementbutton",{listeners:a.downButtonListeners},function(){return[Q("button",x({class:[t.cx("decrementButton"),t.decrementButtonClass]},Z(a.downButtonListeners),{disabled:t.disabled,tabindex:-1,"aria-hidden":"true",type:"button"},t.ptm("decrementButton"),{"data-p":a.dataP}),[A(t.$slots,t.$slots.decrementicon?"decrementicon":"decrementbuttonicon",{},function(){return[(B(),H(X(t.decrementIcon||t.decrementButtonIcon?"span":"AngleDownIcon"),x({class:[t.decrementIcon,t.decrementButtonIcon]},t.ptm("decrementIcon"),{"data-pc-section":"decrementicon"}),null,16,["class"]))]})],16,Yt)]})],16,Wt)):J("",!0),A(t.$slots,"incrementbutton",{listeners:a.upButtonListeners},function(){return[t.showButtons&&t.buttonLayout!=="stacked"?(B(),U("button",x({key:0,class:[t.cx("incrementButton"),t.incrementButtonClass]},Z(a.upButtonListeners),{disabled:t.disabled,tabindex:-1,"aria-hidden":"true",type:"button"},t.ptm("incrementButton"),{"data-p":a.dataP}),[A(t.$slots,t.$slots.incrementicon?"incrementicon":"incrementbuttonicon",{},function(){return[(B(),H(X(t.incrementIcon||t.incrementButtonIcon?"span":"AngleUpIcon"),x({class:[t.incrementIcon,t.incrementButtonIcon]},t.ptm("incrementIcon"),{"data-pc-section":"incrementicon"}),null,16,["class"]))]})],16,qt)):J("",!0)]}),A(t.$slots,"decrementbutton",{listeners:a.downButtonListeners},function(){return[t.showButtons&&t.buttonLayout!=="stacked"?(B(),U("button",x({key:0,class:[t.cx("decrementButton"),t.decrementButtonClass]},Z(a.downButtonListeners),{disabled:t.disabled,tabindex:-1,"aria-hidden":"true",type:"button"},t.ptm("decrementButton"),{"data-p":a.dataP}),[A(t.$slots,t.$slots.decrementicon?"decrementicon":"decrementbuttonicon",{},function(){return[(B(),H(X(t.decrementIcon||t.decrementButtonIcon?"span":"AngleDownIcon"),x({class:[t.decrementIcon,t.decrementButtonIcon]},t.ptm("decrementIcon"),{"data-pc-section":"decrementicon"}),null,16,["class"]))]})],16,Jt)):J("",!0)]})],16,Kt)}zt.render=Ht;const Qt=et("assetManager",()=>{const t=C([]),e=C([]),n=C(!1),r=C({USD:31.25,JPY:.21}),u=C(!1),a=C(""),l=C(""),p="open.er-api.com";let v=!1;const b=C(it()),k=g(()=>{const i=new Set(e.value.map(s=>s.month));return i.add(b.value),[...i].sort((s,o)=>s.localeCompare(o))}),y=g(()=>k.value.filter(i=>i<=b.value)),m=C(b.value),h=C([]),w=C(_),S=C(b.value),$=C({name:"",category:"",type:"asset",currency:"TWD"}),D=g(()=>{const i=new Map;for(const s of e.value){const o=i.get(s.accountId)??[];o.push(s),i.set(s.accountId,o)}for(const s of i.values())s.sort((o,c)=>o.month.localeCompare(c.month));return i}),V=g(()=>new Map(t.value.map(i=>[i.id,i]))),F=g(()=>[...y.value].reverse().map(i=>({label:i,value:i}))),N=g(()=>t.value.map(i=>({label:i.name,value:i.id,iconUrl:ut(i.name)}))),j=[{label:"TWD",value:"TWD"},{label:"USD",value:"USD"},{label:"JPY",value:"JPY"}],W=[{label:"正資產",value:"asset"},{label:"負資產",value:"liability"}],G=g(()=>[...new Set(t.value.map(s=>s.category))].map(s=>({label:s,value:s}))),M=g(()=>{const i=new Set(h.value);return t.value.filter(s=>i.has(s.id))}),O=g(()=>M.value.length!==1?null:M.value[0]),ee=g(()=>{const i=y.value.indexOf(m.value);return i<=0?null:y.value[i-1]});tt(y,i=>{if(!i.length){m.value=b.value,w.value=_,S.value=b.value;return}m.value=R(m.value),w.value=R(w.value),S.value=R(S.value),P(w.value)>P(S.value)&&(w.value=R(_),S.value=R(b.value)),i.includes(m.value)||(m.value=i[i.length-1])},{immediate:!0});function E(i,s){const o=D.value.get(i)??[],c=P(s);let d=0;for(const f of o){if(P(f.month)<=c){d=f.amount;continue}break}return d}function Be(i){return i==="TWD"?1:r.value[i]}function L(i,s){return i*Be(s)}function ke(i){return i.name}async function Me(){const{data:i,error:s}=await T.from("accounts").select("*").order("sort_order",{ascending:!0}).order("created_at",{ascending:!0});if(s){console.error("Error fetching accounts:",s);return}i&&(t.value=i,h.value.length===0&&(h.value=t.value.map(o=>o.id)))}async function ae(){const{data:i,error:s}=await T.from("monthly_records").select("account_id, month, amount");if(s){console.error("Error fetching records:",s);return}i&&(e.value=i.map(o=>({accountId:o.account_id,month:o.month,amount:Number(o.amount)})))}async function se(){v||(n.value=!0,await Promise.all([Me(),ae(),ue()]),n.value=!1,v=!0)}async function ue(){var i,s;if(u.value)return{type:"error",message:"匯率更新中，請稍候"};u.value=!0,a.value="";try{const o=await fetch("https://open.er-api.com/v6/latest/TWD",{cache:"no-store"});if(!o.ok)throw new Error(`HTTP ${o.status}`);const c=await o.json(),d=(i=c.rates)==null?void 0:i.USD,f=(s=c.rates)==null?void 0:s.JPY;if(!d||!f)throw new Error("回傳資料不完整");const I=1/d,Y=1/f;if(!Number.isFinite(I)||!Number.isFinite(Y))throw new Error("匯率格式錯誤");return r.value={USD:I,JPY:Y},l.value=c.time_last_update_utc??new Date().toISOString(),{type:"success",message:"匯率已更新"}}catch(o){return a.value=o instanceof Error?o.message:"無法更新匯率",{type:"error",message:`匯率更新失敗：${a.value}`}}finally{u.value=!1}}const Te=g(()=>l.value?new Intl.DateTimeFormat("zh-TW",{dateStyle:"medium",timeStyle:"short"}).format(new Date(l.value)):"-"),Pe=g(()=>{const i=r.value.USD.toFixed(2),s=r.value.JPY.toFixed(4);return`USD ${i} / JPY ${s}`}),Ae=g(()=>{const i={TWD:{key:"TWD",currency:"TWD",asset:0,liability:0,net:0},USD:{key:"USD",currency:"USD",asset:0,liability:0,net:0},JPY:{key:"JPY",currency:"JPY",asset:0,liability:0,net:0}};for(const s of M.value){const o=E(s.id,m.value),c=i[s.currency];s.type==="asset"?c.asset+=o:c.liability+=o,c.net=c.asset-c.liability}return Object.values(i)}),Ee=g(()=>{let i=0;for(const s of M.value){const o=E(s.id,m.value),c=s.type==="asset"?o:-o;i+=L(c,s.currency)}return i}),oe=g(()=>{if(y.value.length===0)return[];const i=P(w.value),s=P(S.value),o=Math.min(i,s),c=Math.max(i,s);return y.value.filter(d=>{const f=P(d);return f>=o&&f<=c})}),Re=g(()=>y.value[0]??b.value),Le=g(()=>y.value[y.value.length-1]??b.value),Ue=g(()=>ye(_)),le=g(()=>Date.now());function R(i){const s=P(i),o=P(_),c=P(b.value);return s<o?_:s>c?b.value:i}const Ve=g({get(){if(!w.value||!S.value)return null;const i=ye(w.value),s=Math.min(ot(S.value),le.value);return[i,s]},set(i){if(!i)return;const[s,o]=i;w.value=R(ve(s)),S.value=R(ve(o))}});function Fe(i){return i<Ue.value||i>le.value}const ce=g(()=>oe.value.map(i=>{const s=M.value.map(c=>{const d=E(c.id,i),f=c.type==="asset"?d:-d,I=L(f,c.currency);return{accountId:c.id,accountName:c.name,type:c.type,currency:c.currency,amount:d,signedTwd:I}}).sort((c,d)=>Math.abs(d.signedTwd)-Math.abs(c.signedTwd)),o=s.reduce((c,d)=>c+d.signedTwd,0);return{key:i,month:i,totalTwd:o,breakdown:s}})),Ne=g(()=>ce.value.map(({key:i,month:s,totalTwd:o})=>({key:i,month:s,totalTwd:o}))),Oe=g(()=>{const i=[];let s=0;for(const o of y.value){let c=0,d=0;for(const q of M.value){const de=E(q.id,o);q.type==="asset"?c+=L(de,q.currency):d+=L(de,q.currency)}const f=c-d,I=i.length===0?0:f-s,Y=i.length===0||s===0?null:I/s*100;i.push({key:o,month:o,assetTwd:c,liabilityTwd:d,netTwd:f,delta:I,pct:Y}),s=f}return i}),_e=g(()=>M.value.map(i=>{const s=E(i.id,m.value),o=ee.value?E(i.id,ee.value):0,c=s-o,d=o===0?null:c/o*100,f=i.type==="asset"?1:-1;return{key:i.id,accountName:i.name,category:i.category,type:i.type,currency:i.currency,current:s,delta:c,deltaTwd:L(c,i.currency),pct:d,netImpactTwd:L(s*f,i.currency)}})),je=g(()=>{if(!O.value)return[];const i=[];let s=0;for(const o of y.value){const c=E(O.value.id,o),d=i.length===0?0:c-s,f=i.length===0||s===0?null:d/s*100;i.push({key:o,month:o,amount:c,delta:d,pct:f}),s=c}return i});async function ze(){if(!$.value.name.trim())return{type:"error",message:"請先填入帳戶名稱。"};const{data:{user:i}}=await T.auth.getUser();if(!i)return{type:"error",message:"請先登入才能新增帳戶。"};const s=t.value.length>0?Math.max(...t.value.map(I=>I.sort_order||0)):0,o={user_id:i.id,name:$.value.name.trim(),category:$.value.category.trim()||"未分類",currency:$.value.currency,type:$.value.type,sort_order:s+1},{data:c,error:d}=await T.from("accounts").insert(o).select().single();if(d||!c)return{type:"error",message:`新增失敗: ${d==null?void 0:d.message}`};const f=c;return t.value.push(f),h.value=[...h.value,f.id],$.value={name:"",category:"",type:"asset",currency:"TWD"},{type:"success",message:`已新增帳戶：${f.name}`}}async function Ke(i,s){if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(i))return{type:"error",message:"月份格式錯誤，請用 YYYY-MM。"};if(s.length===0)return{type:"error",message:"目前沒有可儲存的帳戶資料。"};const{data:{user:o}}=await T.auth.getUser();if(!o)return{type:"error",message:"請先登入。"};const c=s.map(f=>({user_id:o.id,account_id:f.accountId,month:i,amount:Math.max(0,f.amount)})),{error:d}=await T.from("monthly_records").upsert(c,{onConflict:"account_id, month"});return d?{type:"error",message:`儲存失敗: ${d.message}`}:(await ae(),m.value=R(i),{type:"success",message:`已儲存 ${i} 的資料。`})}function We(){h.value=t.value.map(i=>i.id)}function Ge(){const i=y.value.length>0?y.value[y.value.length-1]:b.value;m.value=i}async function Ye(i,s){const o=t.value.find(I=>I.id===i);if(!o)return{type:"error",message:"找不到帳戶。"};const c={};s.name!==void 0&&(c.name=s.name.trim()),s.category!==void 0&&(c.category=s.category.trim()),s.currency!==void 0&&(c.currency=s.currency);const{error:d}=await T.from("accounts").update(c).eq("id",i);if(d)return{type:"error",message:`更新失敗: ${d.message}`};const f=t.value.findIndex(I=>I.id===i);return f>=0&&(t.value[f]={...t.value[f],...c}),{type:"success",message:`已更新帳戶：${c.name??o.name}`}}async function qe(i,s){const o=[...t.value];if(i<0||i>=o.length||s<0||s>=o.length||i===s)return{type:"success",message:"無需變更"};const[c]=o.splice(i,1);o.splice(s,0,c),t.value=o;const d=o.map((f,I)=>({id:f.id,sort_order:I}));try{return await Promise.all(d.map(f=>T.from("accounts").update({sort_order:f.sort_order}).eq("id",f.id))),{type:"success",message:"排序已更新"}}catch(f){return console.error("Sorting error:",f),{type:"error",message:"排序儲存失敗"}}}async function Je(i){const s=t.value.find(d=>d.id===i);if(!s)return{type:"error",message:"找不到要刪除的帳戶。"};const{error:o}=await T.from("monthly_records").delete().eq("account_id",i);if(o)return{type:"error",message:`刪除關聯紀錄失敗: ${o.message}`};const{error:c}=await T.from("accounts").delete().eq("id",i);return c?{type:"error",message:`刪除帳戶失敗: ${c.message}`}:(t.value=t.value.filter(d=>d.id!==i),h.value=h.value.filter(d=>d!==i),e.value=e.value.filter(d=>d.accountId!==i),{type:"success",message:`已刪除帳戶：${s.name}`})}return v||se(),{accounts:t,records:e,isLoading:n,fxRates:r,fxLoading:u,fxError:a,fxUpdatedAt:l,fxUpdatedLabel:Te,fxDisplayLabel:Pe,fxSource:p,months:y,selectedMonth:m,selectedAccountIds:h,rangeStartMonth:w,rangeEndMonth:S,minMonth:Re,maxMonth:Le,monthRangeValue:Ve,newAccount:$,monthOptions:F,accountOptions:N,currencyOptions:j,accountTypeOptions:W,categoryOptions:G,selectedAccounts:M,selectedAccount:O,previousMonth:ee,selectedRangeMonths:oe,currencySummaryRows:Ae,selectedNetTwd:Ee,combinedWaterPoints:Ne,combinedWaterPointDetails:ce,trendRows:Oe,accountSnapshotRows:_e,singleAccountTrendRows:je,accountMap:V,amountAtMonth:E,toTwd:L,formatCurrency:st,formatPct:at,accountDisplayName:ke,isMonthOutOfRange:Fe,refreshFxRates:ue,addAccount:ze,bulkUpsertMonthlyRecords:Ke,selectAllAccounts:We,selectLatestMonth:Ge,updateAccountById:Ye,reorderAccount:qe,deleteAccount:Je,initData:se}});export{gt as a,zt as s,Qt as u};
