import{B as $e,g as Re,C as Ie,o as v,c as L,m as h,i as xe,a as Z,G as Le,a2 as Ue,ao as pe,I as me,J as fe,q as he,e as be,am as Ve,x as ge,h as C,b as G,n as Y,p as q,ap as J,aq as Fe,r as b,ar as Ne,s as I,al as l}from"./index-DNPpUHP_.js";import{a as Oe,s as _e,g as je,b as ze,c as Ke,m as $,E as V,r as We,d as Ce,t as ye,e as Ge}from"./bankIcons-KrxKzxqz.js";var Ye=`
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
`,qe={root:{position:"relative"}},Je={root:function(t){var n=t.props;return["p-skeleton p-component",{"p-skeleton-circle":n.shape==="circle","p-skeleton-animation-none":n.animation==="none"}]}},He=$e.extend({name:"skeleton",style:Ye,classes:Je,inlineStyles:qe}),Xe={name:"BaseSkeleton",extends:Re,props:{shape:{type:String,default:"rectangle"},size:{type:String,default:null},width:{type:String,default:"100%"},height:{type:String,default:"1rem"},borderRadius:{type:String,default:null},animation:{type:String,default:"wave"}},style:He,provide:function(){return{$pcSkeleton:this,$parentInstance:this}}};function O(e){"@babel/helpers - typeof";return O=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(t){return typeof t}:function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},O(e)}function Ze(e,t,n){return(t=Qe(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function Qe(e){var t=et(e,"string");return O(t)=="symbol"?t:t+""}function et(e,t){if(O(e)!="object"||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t);if(O(r)!="object")return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}var tt={name:"Skeleton",extends:Xe,inheritAttrs:!1,computed:{containerStyle:function(){return this.size?{width:this.size,height:this.size,borderRadius:this.borderRadius}:{width:this.width,height:this.height,borderRadius:this.borderRadius}},dataP:function(){return Ie(Ze({},this.shape,this.shape))}}},nt=["data-p"];function rt(e,t,n,r,a,i){return v(),L("div",h({class:e.cx("root"),style:[e.sx("root"),i.containerStyle],"aria-hidden":"true"},e.ptmi("root"),{"data-p":i.dataP}),null,16,nt)}tt.render=rt;var De={name:"AngleDownIcon",extends:xe};function it(e){return ot(e)||ut(e)||st(e)||at()}function at(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function st(e,t){if(e){if(typeof e=="string")return te(e,t);var n={}.toString.call(e).slice(8,-1);return n==="Object"&&e.constructor&&(n=e.constructor.name),n==="Map"||n==="Set"?Array.from(e):n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?te(e,t):void 0}}function ut(e){if(typeof Symbol<"u"&&e[Symbol.iterator]!=null||e["@@iterator"]!=null)return Array.from(e)}function ot(e){if(Array.isArray(e))return te(e)}function te(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function lt(e,t,n,r,a,i){return v(),L("svg",h({width:"14",height:"14",viewBox:"0 0 14 14",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e.pti()),it(t[0]||(t[0]=[Z("path",{d:"M3.58659 4.5007C3.68513 4.50023 3.78277 4.51945 3.87379 4.55723C3.9648 4.59501 4.04735 4.65058 4.11659 4.7207L7.11659 7.7207L10.1166 4.7207C10.2619 4.65055 10.4259 4.62911 10.5843 4.65956C10.7427 4.69002 10.8871 4.77074 10.996 4.88976C11.1049 5.00877 11.1726 5.15973 11.1889 5.32022C11.2052 5.48072 11.1693 5.6422 11.0866 5.7807L7.58659 9.2807C7.44597 9.42115 7.25534 9.50004 7.05659 9.50004C6.85784 9.50004 6.66722 9.42115 6.52659 9.2807L3.02659 5.7807C2.88614 5.64007 2.80725 5.44945 2.80725 5.2507C2.80725 5.05195 2.88614 4.86132 3.02659 4.7207C3.09932 4.64685 3.18675 4.58911 3.28322 4.55121C3.37969 4.51331 3.48305 4.4961 3.58659 4.5007Z",fill:"currentColor"},null,-1)])),16)}De.render=lt;var Be={name:"AngleUpIcon",extends:xe};function ct(e){return ft(e)||mt(e)||pt(e)||dt()}function dt(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function pt(e,t){if(e){if(typeof e=="string")return ne(e,t);var n={}.toString.call(e).slice(8,-1);return n==="Object"&&e.constructor&&(n=e.constructor.name),n==="Map"||n==="Set"?Array.from(e):n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?ne(e,t):void 0}}function mt(e){if(typeof Symbol<"u"&&e[Symbol.iterator]!=null||e["@@iterator"]!=null)return Array.from(e)}function ft(e){if(Array.isArray(e))return ne(e)}function ne(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function ht(e,t,n,r,a,i){return v(),L("svg",h({width:"14",height:"14",viewBox:"0 0 14 14",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e.pti()),ct(t[0]||(t[0]=[Z("path",{d:"M10.4134 9.49931C10.3148 9.49977 10.2172 9.48055 10.1262 9.44278C10.0352 9.405 9.95263 9.34942 9.88338 9.27931L6.88338 6.27931L3.88338 9.27931C3.73811 9.34946 3.57409 9.3709 3.41567 9.34044C3.25724 9.30999 3.11286 9.22926 3.00395 9.11025C2.89504 8.99124 2.82741 8.84028 2.8111 8.67978C2.79478 8.51928 2.83065 8.35781 2.91338 8.21931L6.41338 4.71931C6.55401 4.57886 6.74463 4.49997 6.94338 4.49997C7.14213 4.49997 7.33276 4.57886 7.47338 4.71931L10.9734 8.21931C11.1138 8.35994 11.1927 8.55056 11.1927 8.74931C11.1927 8.94806 11.1138 9.13868 10.9734 9.27931C10.9007 9.35315 10.8132 9.41089 10.7168 9.44879C10.6203 9.48669 10.5169 9.5039 10.4134 9.49931Z",fill:"currentColor"},null,-1)])),16)}Be.render=ht;var bt=`
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
`,gt={root:function(t){var n=t.instance,r=t.props;return["p-inputnumber p-component p-inputwrapper",{"p-invalid":n.$invalid,"p-inputwrapper-filled":n.$filled||r.allowEmpty===!1,"p-inputwrapper-focus":n.focused,"p-inputnumber-stacked":r.showButtons&&r.buttonLayout==="stacked","p-inputnumber-horizontal":r.showButtons&&r.buttonLayout==="horizontal","p-inputnumber-vertical":r.showButtons&&r.buttonLayout==="vertical","p-inputnumber-fluid":n.$fluid}]},pcInputText:"p-inputnumber-input",clearIcon:"p-inputnumber-clear-icon",buttonGroup:"p-inputnumber-button-group",incrementButton:function(t){var n=t.instance,r=t.props;return["p-inputnumber-button p-inputnumber-increment-button",{"p-disabled":r.showButtons&&r.max!==null&&n.maxBoundry()}]},decrementButton:function(t){var n=t.instance,r=t.props;return["p-inputnumber-button p-inputnumber-decrement-button",{"p-disabled":r.showButtons&&r.min!==null&&n.minBoundry()}]}},yt=$e.extend({name:"inputnumber",style:bt,classes:gt}),vt={name:"BaseInputNumber",extends:_e,props:{format:{type:Boolean,default:!0},showButtons:{type:Boolean,default:!1},buttonLayout:{type:String,default:"stacked"},incrementButtonClass:{type:String,default:null},decrementButtonClass:{type:String,default:null},incrementButtonIcon:{type:String,default:void 0},incrementIcon:{type:String,default:void 0},decrementButtonIcon:{type:String,default:void 0},decrementIcon:{type:String,default:void 0},locale:{type:String,default:void 0},localeMatcher:{type:String,default:void 0},mode:{type:String,default:"decimal"},prefix:{type:String,default:null},suffix:{type:String,default:null},currency:{type:String,default:void 0},currencyDisplay:{type:String,default:void 0},useGrouping:{type:Boolean,default:!0},minFractionDigits:{type:Number,default:void 0},maxFractionDigits:{type:Number,default:void 0},roundingMode:{type:String,default:"halfExpand",validator:function(t){return["ceil","floor","expand","trunc","halfCeil","halfFloor","halfExpand","halfTrunc","halfEven"].includes(t)}},min:{type:Number,default:null},max:{type:Number,default:null},step:{type:Number,default:1},allowEmpty:{type:Boolean,default:!0},highlightOnFocus:{type:Boolean,default:!1},showClear:{type:Boolean,default:!1},readonly:{type:Boolean,default:!1},placeholder:{type:String,default:null},inputId:{type:String,default:null},inputClass:{type:[String,Object],default:null},inputStyle:{type:Object,default:null},ariaLabelledby:{type:String,default:null},ariaLabel:{type:String,default:null},required:{type:Boolean,default:!1}},style:yt,provide:function(){return{$pcInputNumber:this,$parentInstance:this}}};function _(e){"@babel/helpers - typeof";return _=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(t){return typeof t}:function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},_(e)}function ve(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable})),n.push.apply(n,r)}return n}function we(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]!=null?arguments[t]:{};t%2?ve(Object(n),!0).forEach(function(r){re(e,r,n[r])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):ve(Object(n)).forEach(function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))})}return e}function re(e,t,n){return(t=wt(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function wt(e){var t=St(e,"string");return _(t)=="symbol"?t:t+""}function St(e,t){if(_(e)!="object"||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t);if(_(r)!="object")return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}function $t(e){return Dt(e)||Ct(e)||xt(e)||It()}function It(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function xt(e,t){if(e){if(typeof e=="string")return ie(e,t);var n={}.toString.call(e).slice(8,-1);return n==="Object"&&e.constructor&&(n=e.constructor.name),n==="Map"||n==="Set"?Array.from(e):n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?ie(e,t):void 0}}function Ct(e){if(typeof Symbol<"u"&&e[Symbol.iterator]!=null||e["@@iterator"]!=null)return Array.from(e)}function Dt(e){if(Array.isArray(e))return ie(e)}function ie(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}var Bt={name:"InputNumber",extends:vt,inheritAttrs:!1,emits:["input","focus","blur"],inject:{$pcFluid:{default:null}},numberFormat:null,_numeral:null,_decimal:null,_group:null,_minusSign:null,_currency:null,_suffix:null,_prefix:null,_index:null,groupChar:"",isSpecialChar:null,prefixChar:null,suffixChar:null,timer:null,data:function(){return{d_modelValue:this.d_value,focused:!1}},watch:{d_value:{immediate:!0,handler:function(t){var n;this.d_modelValue=t,(n=this.$refs.clearIcon)!==null&&n!==void 0&&(n=n.$el)!==null&&n!==void 0&&n.style&&(this.$refs.clearIcon.$el.style.display=me(t)?"none":"block")}},locale:function(t,n){this.updateConstructParser(t,n)},localeMatcher:function(t,n){this.updateConstructParser(t,n)},mode:function(t,n){this.updateConstructParser(t,n)},currency:function(t,n){this.updateConstructParser(t,n)},currencyDisplay:function(t,n){this.updateConstructParser(t,n)},useGrouping:function(t,n){this.updateConstructParser(t,n)},minFractionDigits:function(t,n){this.updateConstructParser(t,n)},maxFractionDigits:function(t,n){this.updateConstructParser(t,n)},suffix:function(t,n){this.updateConstructParser(t,n)},prefix:function(t,n){this.updateConstructParser(t,n)}},created:function(){this.constructParser()},mounted:function(){var t;(t=this.$refs.clearIcon)!==null&&t!==void 0&&(t=t.$el)!==null&&t!==void 0&&t.style&&(this.$refs.clearIcon.$el.style.display=this.$filled?"block":"none")},methods:{getOptions:function(){return{localeMatcher:this.localeMatcher,style:this.mode,currency:this.currency,currencyDisplay:this.currencyDisplay,useGrouping:this.useGrouping,minimumFractionDigits:this.minFractionDigits,maximumFractionDigits:this.maxFractionDigits,roundingMode:this.roundingMode}},constructParser:function(){this.numberFormat=new Intl.NumberFormat(this.locale,this.getOptions());var t=$t(new Intl.NumberFormat(this.locale,{useGrouping:!1}).format(9876543210)).reverse(),n=new Map(t.map(function(r,a){return[r,a]}));this._numeral=new RegExp("[".concat(t.join(""),"]"),"g"),this._group=this.getGroupingExpression(),this._minusSign=this.getMinusSignExpression(),this._currency=this.getCurrencyExpression(),this._decimal=this.getDecimalExpression(),this._suffix=this.getSuffixExpression(),this._prefix=this.getPrefixExpression(),this._index=function(r){return n.get(r)}},updateConstructParser:function(t,n){t!==n&&this.constructParser()},escapeRegExp:function(t){return t.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&")},getDecimalExpression:function(){var t=new Intl.NumberFormat(this.locale,we(we({},this.getOptions()),{},{useGrouping:!1}));return new RegExp("[".concat(t.format(1.1).replace(this._currency,"").trim().replace(this._numeral,""),"]"),"g")},getGroupingExpression:function(){var t=new Intl.NumberFormat(this.locale,{useGrouping:!0});return this.groupChar=t.format(1e6).trim().replace(this._numeral,"").charAt(0),new RegExp("[".concat(this.groupChar,"]"),"g")},getMinusSignExpression:function(){var t=new Intl.NumberFormat(this.locale,{useGrouping:!1});return new RegExp("[".concat(t.format(-1).trim().replace(this._numeral,""),"]"),"g")},getCurrencyExpression:function(){if(this.currency){var t=new Intl.NumberFormat(this.locale,{style:"currency",currency:this.currency,currencyDisplay:this.currencyDisplay,minimumFractionDigits:0,maximumFractionDigits:0,roundingMode:this.roundingMode});return new RegExp("[".concat(t.format(1).replace(/\s/g,"").replace(this._numeral,"").replace(this._group,""),"]"),"g")}return new RegExp("[]","g")},getPrefixExpression:function(){if(this.prefix)this.prefixChar=this.prefix;else{var t=new Intl.NumberFormat(this.locale,{style:this.mode,currency:this.currency,currencyDisplay:this.currencyDisplay});this.prefixChar=t.format(1).split("1")[0]}return new RegExp("".concat(this.escapeRegExp(this.prefixChar||"")),"g")},getSuffixExpression:function(){if(this.suffix)this.suffixChar=this.suffix;else{var t=new Intl.NumberFormat(this.locale,{style:this.mode,currency:this.currency,currencyDisplay:this.currencyDisplay,minimumFractionDigits:0,maximumFractionDigits:0,roundingMode:this.roundingMode});this.suffixChar=t.format(1).split("1")[1]}return new RegExp("".concat(this.escapeRegExp(this.suffixChar||"")),"g")},formatValue:function(t){if(t!=null){if(t==="-")return t;if(this.format){var n=new Intl.NumberFormat(this.locale,this.getOptions()),r=n.format(t);return this.prefix&&(r=this.prefix+r),this.suffix&&(r=r+this.suffix),r}return t.toString()}return""},parseValue:function(t){var n=t.replace(this._suffix,"").replace(this._prefix,"").trim().replace(/\s/g,"").replace(this._currency,"").replace(this._group,"").replace(this._minusSign,"-").replace(this._decimal,".").replace(this._numeral,this._index);if(n){if(n==="-")return n;var r=+n;return isNaN(r)?null:r}return null},repeat:function(t,n,r){var a=this;if(!this.readonly){var i=n||500;this.clearTimer(),this.timer=setTimeout(function(){a.repeat(t,40,r)},i),this.spin(t,r)}},addWithPrecision:function(t,n){var r=t.toString(),a=n.toString(),i=r.includes(".")?r.split(".")[1].length:0,s=a.includes(".")?a.split(".")[1].length:0,u=Math.max(i,s),c=Math.pow(10,u);return Math.round((t+n)*c)/c},spin:function(t,n){if(this.$refs.input){var r=this.step*n,a=this.parseValue(this.$refs.input.$el.value)||0,i=this.validateValue(this.addWithPrecision(a,r));this.updateInput(i,null,"spin"),this.updateModel(t,i),this.handleOnInput(t,a,i)}},onUpButtonMouseDown:function(t){this.disabled||(this.$refs.input.$el.focus(),this.repeat(t,null,1),t.preventDefault())},onUpButtonMouseUp:function(){this.disabled||this.clearTimer()},onUpButtonMouseLeave:function(){this.disabled||this.clearTimer()},onUpButtonKeyUp:function(){this.disabled||this.clearTimer()},onUpButtonKeyDown:function(t){(t.code==="Space"||t.code==="Enter"||t.code==="NumpadEnter")&&this.repeat(t,null,1)},onDownButtonMouseDown:function(t){this.disabled||(this.$refs.input.$el.focus(),this.repeat(t,null,-1),t.preventDefault())},onDownButtonMouseUp:function(){this.disabled||this.clearTimer()},onDownButtonMouseLeave:function(){this.disabled||this.clearTimer()},onDownButtonKeyUp:function(){this.disabled||this.clearTimer()},onDownButtonKeyDown:function(t){(t.code==="Space"||t.code==="Enter"||t.code==="NumpadEnter")&&this.repeat(t,null,-1)},onUserInput:function(){this.isSpecialChar&&(this.$refs.input.$el.value=this.lastValue),this.isSpecialChar=!1},onInputKeyDown:function(t){if(!this.readonly&&!t.isComposing){if(t.altKey||t.ctrlKey||t.metaKey){this.isSpecialChar=!0,this.lastValue=this.$refs.input.$el.value;return}this.lastValue=t.target.value;var n=t.target.selectionStart,r=t.target.selectionEnd,a=r-n,i=t.target.value,s=null,u=t.code||t.key;switch(u){case"ArrowUp":this.spin(t,1),t.preventDefault();break;case"ArrowDown":this.spin(t,-1),t.preventDefault();break;case"ArrowLeft":if(a>1){var c=this.isNumeralChar(i.charAt(n))?n+1:n+2;this.$refs.input.$el.setSelectionRange(c,c)}else this.isNumeralChar(i.charAt(n-1))||t.preventDefault();break;case"ArrowRight":if(a>1){var m=r-1;this.$refs.input.$el.setSelectionRange(m,m)}else this.isNumeralChar(i.charAt(n))||t.preventDefault();break;case"Tab":case"Enter":case"NumpadEnter":s=this.validateValue(this.parseValue(i)),this.$refs.input.$el.value=this.formatValue(s),this.$refs.input.$el.setAttribute("aria-valuenow",s),this.updateModel(t,s);break;case"Backspace":{if(t.preventDefault(),n===r){n>=i.length&&this.suffixChar!==null&&(n=i.length-this.suffixChar.length,this.$refs.input.$el.setSelectionRange(n,n));var B=i.charAt(n-1),A=this.getDecimalCharIndexes(i),o=A.decimalCharIndex,p=A.decimalCharIndexWithoutPrefix;if(this.isNumeralChar(B)){var E=this.getDecimalLength(i);if(this._group.test(B))this._group.lastIndex=0,s=i.slice(0,n-2)+i.slice(n-1);else if(this._decimal.test(B))this._decimal.lastIndex=0,E?this.$refs.input.$el.setSelectionRange(n-1,n-1):s=i.slice(0,n-1)+i.slice(n);else if(o>0&&n>o){var N=this.isDecimalMode()&&(this.minFractionDigits||0)<E?"":"0";s=i.slice(0,n-1)+N+i.slice(n)}else p===1?(s=i.slice(0,n-1)+"0"+i.slice(n),s=this.parseValue(s)>0?s:""):s=i.slice(0,n-1)+i.slice(n)}this.updateValue(t,s,null,"delete-single")}else s=this.deleteRange(i,n,r),this.updateValue(t,s,null,"delete-range");break}case"Delete":if(t.preventDefault(),n===r){var k=i.charAt(n),x=this.getDecimalCharIndexes(i),z=x.decimalCharIndex,K=x.decimalCharIndexWithoutPrefix;if(this.isNumeralChar(k)){var W=this.getDecimalLength(i);if(this._group.test(k))this._group.lastIndex=0,s=i.slice(0,n)+i.slice(n+2);else if(this._decimal.test(k))this._decimal.lastIndex=0,W?this.$refs.input.$el.setSelectionRange(n+1,n+1):s=i.slice(0,n)+i.slice(n+1);else if(z>0&&n>z){var ee=this.isDecimalMode()&&(this.minFractionDigits||0)<W?"":"0";s=i.slice(0,n)+ee+i.slice(n+1)}else K===1?(s=i.slice(0,n)+"0"+i.slice(n+1),s=this.parseValue(s)>0?s:""):s=i.slice(0,n)+i.slice(n+1)}this.updateValue(t,s,null,"delete-back-single")}else s=this.deleteRange(i,n,r),this.updateValue(t,s,null,"delete-range");break;case"Home":t.preventDefault(),fe(this.min)&&this.updateModel(t,this.min);break;case"End":t.preventDefault(),fe(this.max)&&this.updateModel(t,this.max);break}}},onInputKeyPress:function(t){if(!this.readonly){var n=t.key,r=this.isDecimalSign(n),a=this.isMinusSign(n);t.code!=="Enter"&&t.preventDefault(),(Number(n)>=0&&Number(n)<=9||a||r)&&this.insert(t,n,{isDecimalSign:r,isMinusSign:a})}},onPaste:function(t){if(!this.readonly){t.preventDefault();var n=(t.clipboardData||window.clipboardData).getData("Text");if(!(this.inputId==="integeronly"&&/[^\d-]/.test(n))&&n){var r=this.parseValue(n);r!=null&&this.insert(t,r.toString())}}},onClearClick:function(t){this.updateModel(t,null),this.$refs.input.$el.focus()},allowMinusSign:function(){return this.min===null||this.min<0},isMinusSign:function(t){return this._minusSign.test(t)||t==="-"?(this._minusSign.lastIndex=0,!0):!1},isDecimalSign:function(t){var n;return(n=this.locale)!==null&&n!==void 0&&n.includes("fr")&&[".",","].includes(t)||this._decimal.test(t)?(this._decimal.lastIndex=0,!0):!1},isDecimalMode:function(){return this.mode==="decimal"},getDecimalCharIndexes:function(t){var n=t.search(this._decimal);this._decimal.lastIndex=0;var r=t.replace(this._prefix,"").trim().replace(/\s/g,"").replace(this._currency,""),a=r.search(this._decimal);return this._decimal.lastIndex=0,{decimalCharIndex:n,decimalCharIndexWithoutPrefix:a}},getCharIndexes:function(t){var n=t.search(this._decimal);this._decimal.lastIndex=0;var r=t.search(this._minusSign);this._minusSign.lastIndex=0;var a=t.search(this._suffix);this._suffix.lastIndex=0;var i=t.search(this._currency);return this._currency.lastIndex=0,{decimalCharIndex:n,minusCharIndex:r,suffixCharIndex:a,currencyCharIndex:i}},insert:function(t,n){var r=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{isDecimalSign:!1,isMinusSign:!1},a=n.search(this._minusSign);if(this._minusSign.lastIndex=0,!(!this.allowMinusSign()&&a!==-1)){var i=this.$refs.input.$el.selectionStart,s=this.$refs.input.$el.selectionEnd,u=this.$refs.input.$el.value.trim(),c=this.getCharIndexes(u),m=c.decimalCharIndex,B=c.minusCharIndex,A=c.suffixCharIndex,o=c.currencyCharIndex,p;if(r.isMinusSign){var E=B===-1;(i===0||i===o+1)&&(p=u,(E||s!==0)&&(p=this.insertText(u,n,0,s)),this.updateValue(t,p,n,"insert"))}else if(r.isDecimalSign)m>0&&i===m?this.updateValue(t,u,n,"insert"):m>i&&m<s?(p=this.insertText(u,n,i,s),this.updateValue(t,p,n,"insert")):m===-1&&this.maxFractionDigits&&(p=this.insertText(u,n,i,s),this.updateValue(t,p,n,"insert"));else{var N=this.numberFormat.resolvedOptions().maximumFractionDigits,k=i!==s?"range-insert":"insert";if(m>0&&i>m){if(i+n.length-(m+1)<=N){var x=o>=i?o-1:A>=i?A:u.length;p=u.slice(0,i)+n+u.slice(i+n.length,x)+u.slice(x),this.updateValue(t,p,n,k)}}else p=this.insertText(u,n,i,s),this.updateValue(t,p,n,k)}}},insertText:function(t,n,r,a){var i=n==="."?n:n.split(".");if(i.length===2){var s=t.slice(r,a).search(this._decimal);return this._decimal.lastIndex=0,s>0?t.slice(0,r)+this.formatValue(n)+t.slice(a):this.formatValue(n)||t}else return a-r===t.length?this.formatValue(n):r===0?n+t.slice(a):a===t.length?t.slice(0,r)+n:t.slice(0,r)+n+t.slice(a)},deleteRange:function(t,n,r){var a;return r-n===t.length?a="":n===0?a=t.slice(r):r===t.length?a=t.slice(0,n):a=t.slice(0,n)+t.slice(r),a},initCursor:function(){var t=this.$refs.input.$el.selectionStart,n=this.$refs.input.$el.value,r=n.length,a=null,i=(this.prefixChar||"").length;n=n.replace(this._prefix,""),t=t-i;var s=n.charAt(t);if(this.isNumeralChar(s))return t+i;for(var u=t-1;u>=0;)if(s=n.charAt(u),this.isNumeralChar(s)){a=u+i;break}else u--;if(a!==null)this.$refs.input.$el.setSelectionRange(a+1,a+1);else{for(u=t;u<r;)if(s=n.charAt(u),this.isNumeralChar(s)){a=u+i;break}else u++;a!==null&&this.$refs.input.$el.setSelectionRange(a,a)}return a||0},onInputClick:function(){var t=this.$refs.input.$el.value;!this.readonly&&t!==pe()&&this.initCursor()},isNumeralChar:function(t){return t.length===1&&(this._numeral.test(t)||this._decimal.test(t)||this._group.test(t)||this._minusSign.test(t))?(this.resetRegex(),!0):!1},resetRegex:function(){this._numeral.lastIndex=0,this._decimal.lastIndex=0,this._group.lastIndex=0,this._minusSign.lastIndex=0},updateValue:function(t,n,r,a){var i=this.$refs.input.$el.value,s=null;n!=null&&(s=this.parseValue(n),s=!s&&!this.allowEmpty?0:s,this.updateInput(s,r,a,n),this.handleOnInput(t,i,s))},handleOnInput:function(t,n,r){if(this.isValueChanged(n,r)){var a,i;this.$emit("input",{originalEvent:t,value:r,formattedValue:n}),(a=(i=this.formField).onInput)===null||a===void 0||a.call(i,{originalEvent:t,value:r})}},isValueChanged:function(t,n){if(n===null&&t!==null)return!0;if(n!=null){var r=typeof t=="string"?this.parseValue(t):t;return n!==r}return!1},validateValue:function(t){return t==="-"||t==null?null:this.min!=null&&t<this.min?this.min:this.max!=null&&t>this.max?this.max:t},updateInput:function(t,n,r,a){var i;n=n||"";var s=this.$refs.input.$el.value,u=this.formatValue(t),c=s.length;if(u!==a&&(u=this.concatValues(u,a)),c===0){this.$refs.input.$el.value=u,this.$refs.input.$el.setSelectionRange(0,0);var m=this.initCursor(),B=m+n.length;this.$refs.input.$el.setSelectionRange(B,B)}else{var A=this.$refs.input.$el.selectionStart,o=this.$refs.input.$el.selectionEnd;this.$refs.input.$el.value=u;var p=u.length;if(r==="range-insert"){var E=this.parseValue((s||"").slice(0,A)),N=E!==null?E.toString():"",k=N.split("").join("(".concat(this.groupChar,")?")),x=new RegExp(k,"g");x.test(u);var z=n.split("").join("(".concat(this.groupChar,")?")),K=new RegExp(z,"g");K.test(u.slice(x.lastIndex)),o=x.lastIndex+K.lastIndex,this.$refs.input.$el.setSelectionRange(o,o)}else if(p===c)r==="insert"||r==="delete-back-single"?this.$refs.input.$el.setSelectionRange(o+1,o+1):r==="delete-single"?this.$refs.input.$el.setSelectionRange(o-1,o-1):(r==="delete-range"||r==="spin")&&this.$refs.input.$el.setSelectionRange(o,o);else if(r==="delete-back-single"){var W=s.charAt(o-1),ee=s.charAt(o),le=c-p,ce=this._group.test(ee);ce&&le===1?o+=1:!ce&&this.isNumeralChar(W)&&(o+=-1*le+1),this._group.lastIndex=0,this.$refs.input.$el.setSelectionRange(o,o)}else if(s==="-"&&r==="insert"){this.$refs.input.$el.setSelectionRange(0,0);var Ee=this.initCursor(),de=Ee+n.length+1;this.$refs.input.$el.setSelectionRange(de,de)}else o=o+(p-c),this.$refs.input.$el.setSelectionRange(o,o)}this.$refs.input.$el.setAttribute("aria-valuenow",t),(i=this.$refs.clearIcon)!==null&&i!==void 0&&(i=i.$el)!==null&&i!==void 0&&i.style&&(this.$refs.clearIcon.$el.style.display=me(u)?"none":"block")},concatValues:function(t,n){if(t&&n){var r=n.search(this._decimal);return this._decimal.lastIndex=0,this.suffixChar?r!==-1?t.replace(this.suffixChar,"").split(this._decimal)[0]+n.replace(this.suffixChar,"").slice(r)+this.suffixChar:t:r!==-1?t.split(this._decimal)[0]+n.slice(r):t}return t},getDecimalLength:function(t){if(t){var n=t.split(this._decimal);if(n.length===2)return n[1].replace(this._suffix,"").trim().replace(/\s/g,"").replace(this._currency,"").length}return 0},updateModel:function(t,n){this.writeValue(n,t)},onInputFocus:function(t){this.focused=!0,!this.disabled&&!this.readonly&&this.$refs.input.$el.value!==pe()&&this.highlightOnFocus&&t.target.select(),this.$emit("focus",t)},onInputBlur:function(t){var n,r;this.focused=!1;var a=t.target,i=this.validateValue(this.parseValue(a.value));this.$emit("blur",{originalEvent:t,value:a.value}),(n=(r=this.formField).onBlur)===null||n===void 0||n.call(r,t),a.value=this.formatValue(i),a.setAttribute("aria-valuenow",i),this.updateModel(t,i),!this.disabled&&!this.readonly&&this.highlightOnFocus&&Ue()},clearTimer:function(){this.timer&&clearTimeout(this.timer)},maxBoundry:function(){return this.d_value>=this.max},minBoundry:function(){return this.d_value<=this.min}},computed:{upButtonListeners:function(){var t=this;return{mousedown:function(r){return t.onUpButtonMouseDown(r)},mouseup:function(r){return t.onUpButtonMouseUp(r)},mouseleave:function(r){return t.onUpButtonMouseLeave(r)},keydown:function(r){return t.onUpButtonKeyDown(r)},keyup:function(r){return t.onUpButtonKeyUp(r)}}},downButtonListeners:function(){var t=this;return{mousedown:function(r){return t.onDownButtonMouseDown(r)},mouseup:function(r){return t.onDownButtonMouseUp(r)},mouseleave:function(r){return t.onDownButtonMouseLeave(r)},keydown:function(r){return t.onDownButtonKeyDown(r)},keyup:function(r){return t.onDownButtonKeyUp(r)}}},formattedValue:function(){var t=!this.d_value&&!this.allowEmpty?0:this.d_value;return this.formatValue(t)},getFormatter:function(){return this.numberFormat},dataP:function(){return Ie(re(re({invalid:this.$invalid,fluid:this.$fluid,filled:this.$variant==="filled"},this.size,this.size),this.buttonLayout,this.showButtons&&this.buttonLayout))}},components:{InputText:Oe,AngleUpIcon:Be,AngleDownIcon:De,TimesIcon:Le}},kt=["data-p"],Mt=["data-p"],Tt=["disabled","data-p"],Pt=["disabled","data-p"],At=["disabled","data-p"],Et=["disabled","data-p"];function Rt(e,t,n,r,a,i){var s=he("InputText"),u=he("TimesIcon");return v(),L("span",h({class:e.cx("root")},e.ptmi("root"),{"data-p":i.dataP}),[be(s,{ref:"input",id:e.inputId,name:e.$formName,role:"spinbutton",class:ge([e.cx("pcInputText"),e.inputClass]),style:Ve(e.inputStyle),defaultValue:i.formattedValue,"aria-valuemin":e.min,"aria-valuemax":e.max,"aria-valuenow":e.d_value,inputmode:e.mode==="decimal"&&!e.minFractionDigits?"numeric":"decimal",disabled:e.disabled,readonly:e.readonly,placeholder:e.placeholder,"aria-labelledby":e.ariaLabelledby,"aria-label":e.ariaLabel,required:e.required,size:e.size,invalid:e.invalid,variant:e.variant,onInput:i.onUserInput,onKeydown:i.onInputKeyDown,onKeypress:i.onInputKeyPress,onPaste:i.onPaste,onClick:i.onInputClick,onFocus:i.onInputFocus,onBlur:i.onInputBlur,pt:e.ptm("pcInputText"),unstyled:e.unstyled,"data-p":i.dataP},null,8,["id","name","class","style","defaultValue","aria-valuemin","aria-valuemax","aria-valuenow","inputmode","disabled","readonly","placeholder","aria-labelledby","aria-label","required","size","invalid","variant","onInput","onKeydown","onKeypress","onPaste","onClick","onFocus","onBlur","pt","unstyled","data-p"]),e.showClear&&e.buttonLayout!=="vertical"?C(e.$slots,"clearicon",{key:0,class:ge(e.cx("clearIcon")),clearCallback:i.onClearClick},function(){return[be(u,h({ref:"clearIcon",class:[e.cx("clearIcon")],onClick:i.onClearClick},e.ptm("clearIcon")),null,16,["class","onClick"])]}):G("",!0),e.showButtons&&e.buttonLayout==="stacked"?(v(),L("span",h({key:1,class:e.cx("buttonGroup")},e.ptm("buttonGroup"),{"data-p":i.dataP}),[C(e.$slots,"incrementbutton",{listeners:i.upButtonListeners},function(){return[Z("button",h({class:[e.cx("incrementButton"),e.incrementButtonClass]},J(i.upButtonListeners),{disabled:e.disabled,tabindex:-1,"aria-hidden":"true",type:"button"},e.ptm("incrementButton"),{"data-p":i.dataP}),[C(e.$slots,e.$slots.incrementicon?"incrementicon":"incrementbuttonicon",{},function(){return[(v(),Y(q(e.incrementIcon||e.incrementButtonIcon?"span":"AngleUpIcon"),h({class:[e.incrementIcon,e.incrementButtonIcon]},e.ptm("incrementIcon"),{"data-pc-section":"incrementicon"}),null,16,["class"]))]})],16,Tt)]}),C(e.$slots,"decrementbutton",{listeners:i.downButtonListeners},function(){return[Z("button",h({class:[e.cx("decrementButton"),e.decrementButtonClass]},J(i.downButtonListeners),{disabled:e.disabled,tabindex:-1,"aria-hidden":"true",type:"button"},e.ptm("decrementButton"),{"data-p":i.dataP}),[C(e.$slots,e.$slots.decrementicon?"decrementicon":"decrementbuttonicon",{},function(){return[(v(),Y(q(e.decrementIcon||e.decrementButtonIcon?"span":"AngleDownIcon"),h({class:[e.decrementIcon,e.decrementButtonIcon]},e.ptm("decrementIcon"),{"data-pc-section":"decrementicon"}),null,16,["class"]))]})],16,Pt)]})],16,Mt)):G("",!0),C(e.$slots,"incrementbutton",{listeners:i.upButtonListeners},function(){return[e.showButtons&&e.buttonLayout!=="stacked"?(v(),L("button",h({key:0,class:[e.cx("incrementButton"),e.incrementButtonClass]},J(i.upButtonListeners),{disabled:e.disabled,tabindex:-1,"aria-hidden":"true",type:"button"},e.ptm("incrementButton"),{"data-p":i.dataP}),[C(e.$slots,e.$slots.incrementicon?"incrementicon":"incrementbuttonicon",{},function(){return[(v(),Y(q(e.incrementIcon||e.incrementButtonIcon?"span":"AngleUpIcon"),h({class:[e.incrementIcon,e.incrementButtonIcon]},e.ptm("incrementIcon"),{"data-pc-section":"incrementicon"}),null,16,["class"]))]})],16,At)):G("",!0)]}),C(e.$slots,"decrementbutton",{listeners:i.downButtonListeners},function(){return[e.showButtons&&e.buttonLayout!=="stacked"?(v(),L("button",h({key:0,class:[e.cx("decrementButton"),e.decrementButtonClass]},J(i.downButtonListeners),{disabled:e.disabled,tabindex:-1,"aria-hidden":"true",type:"button"},e.ptm("decrementButton"),{"data-p":i.dataP}),[C(e.$slots,e.$slots.decrementicon?"decrementicon":"decrementbuttonicon",{},function(){return[(v(),Y(q(e.decrementIcon||e.decrementButtonIcon?"span":"AngleDownIcon"),h({class:[e.decrementIcon,e.decrementButtonIcon]},e.ptm("decrementIcon"),{"data-pc-section":"decrementicon"}),null,16,["class"]))]})],16,Et)):G("",!0)]})],16,kt)}Bt.render=Rt;const d=b([]),F=b([]),ae=b(!1),j=b({USD:31.25,JPY:.21}),H=b(!1),X=b(""),Q=b(""),Lt="open.er-api.com";let se=!1;const y=b(je()),Ut=l(()=>{const e=new Set(F.value.map(t=>t.month));return e.add(y.value),[...e].sort((t,n)=>t.localeCompare(n))}),f=l(()=>Ut.value.filter(e=>e<=y.value)),g=b(y.value),D=b([]),w=b(V),S=b(y.value),R=b({name:"",category:"",type:"asset",currency:"TWD"}),Vt=l(()=>{const e=new Map;for(const t of F.value){const n=e.get(t.accountId)??[];n.push(t),e.set(t.accountId,n)}for(const t of e.values())t.sort((n,r)=>n.month.localeCompare(r.month));return e}),Ft=l(()=>new Map(d.value.map(e=>[e.id,e]))),Nt=l(()=>[...f.value].reverse().map(e=>({label:e,value:e}))),Ot=l(()=>d.value.map(e=>({label:e.name,value:e.id,iconUrl:We(e.name)}))),_t=[{label:"TWD",value:"TWD"},{label:"USD",value:"USD"},{label:"JPY",value:"JPY"}],jt=[{label:"正資產",value:"asset"},{label:"負資產",value:"liability"}],zt=l(()=>[...new Set(d.value.map(t=>t.category))].map(t=>({label:t,value:t}))),T=l(()=>{const e=new Set(D.value);return d.value.filter(t=>e.has(t.id))}),ue=l(()=>T.value.length!==1?null:T.value[0]),oe=l(()=>{const e=f.value.indexOf(g.value);return e<=0?null:f.value[e-1]});Ne(f,e=>{if(!e.length){g.value=y.value,w.value=V,S.value=y.value;return}g.value=M(g.value),w.value=M(w.value),S.value=M(S.value),$(w.value)>$(S.value)&&(w.value=M(V),S.value=M(y.value)),e.includes(g.value)||(g.value=e[e.length-1])},{immediate:!0});function P(e,t){const n=Vt.value.get(e)??[],r=$(t);let a=0;for(const i of n){if($(i.month)<=r){a=i.amount;continue}break}return a}function Kt(e){return e==="TWD"?1:j.value[e]}function U(e,t){return e*Kt(t)}function Wt(e){return e.name}async function Gt(){const{data:e,error:t}=await I.from("accounts").select("*").order("sort_order",{ascending:!0}).order("created_at",{ascending:!0});if(t){console.error("Error fetching accounts:",t);return}e&&(d.value=e,D.value.length===0&&(D.value=d.value.map(n=>n.id)))}async function ke(){const{data:e,error:t}=await I.from("monthly_records").select("account_id, month, amount");if(t){console.error("Error fetching records:",t);return}e&&(F.value=e.map(n=>({accountId:n.account_id,month:n.month,amount:Number(n.amount)})))}async function Se(){se||(ae.value=!0,await Promise.all([Gt(),ke(),Me()]),ae.value=!1,se=!0)}async function Me(){var e,t;if(H.value)return{type:"error",message:"匯率更新中，請稍候"};H.value=!0,X.value="";try{const n=await fetch("https://open.er-api.com/v6/latest/TWD",{cache:"no-store"});if(!n.ok)throw new Error(`HTTP ${n.status}`);const r=await n.json(),a=(e=r.rates)==null?void 0:e.USD,i=(t=r.rates)==null?void 0:t.JPY;if(!a||!i)throw new Error("回傳資料不完整");const s=1/a,u=1/i;if(!Number.isFinite(s)||!Number.isFinite(u))throw new Error("匯率格式錯誤");return j.value={USD:s,JPY:u},Q.value=r.time_last_update_utc??new Date().toISOString(),{type:"success",message:"匯率已更新"}}catch(n){return X.value=n instanceof Error?n.message:"無法更新匯率",{type:"error",message:`匯率更新失敗：${X.value}`}}finally{H.value=!1}}const Yt=l(()=>Q.value?new Intl.DateTimeFormat("zh-TW",{dateStyle:"medium",timeStyle:"short"}).format(new Date(Q.value)):"-"),qt=l(()=>{const e=j.value.USD.toFixed(2),t=j.value.JPY.toFixed(4);return`USD ${e} / JPY ${t}`}),Jt=l(()=>{const e={TWD:{key:"TWD",currency:"TWD",asset:0,liability:0,net:0},USD:{key:"USD",currency:"USD",asset:0,liability:0,net:0},JPY:{key:"JPY",currency:"JPY",asset:0,liability:0,net:0}};for(const t of T.value){const n=P(t.id,g.value),r=e[t.currency];t.type==="asset"?r.asset+=n:r.liability+=n,r.net=r.asset-r.liability}return Object.values(e)}),Ht=l(()=>{let e=0;for(const t of T.value){const n=P(t.id,g.value),r=t.type==="asset"?n:-n;e+=U(r,t.currency)}return e}),Te=l(()=>{if(f.value.length===0)return[];const e=$(w.value),t=$(S.value),n=Math.min(e,t),r=Math.max(e,t);return f.value.filter(a=>{const i=$(a);return i>=n&&i<=r})}),Xt=l(()=>f.value[0]??y.value),Zt=l(()=>f.value[f.value.length-1]??y.value),Qt=l(()=>Ce(V)),Pe=l(()=>Date.now());function M(e){const t=$(e),n=$(V),r=$(y.value);return t<n?V:t>r?y.value:e}const en=l({get(){if(!w.value||!S.value)return null;const e=Ce(w.value),t=Math.min(Ge(S.value),Pe.value);return[e,t]},set(e){if(!e)return;const[t,n]=e;w.value=M(ye(t)),S.value=M(ye(n))}});function tn(e){return e<Qt.value||e>Pe.value}const Ae=l(()=>Te.value.map(e=>{const t=T.value.map(r=>{const a=P(r.id,e),i=r.type==="asset"?a:-a,s=U(i,r.currency);return{accountId:r.id,accountName:r.name,type:r.type,currency:r.currency,amount:a,signedTwd:s}}).sort((r,a)=>Math.abs(a.signedTwd)-Math.abs(r.signedTwd)),n=t.reduce((r,a)=>r+a.signedTwd,0);return{key:e,month:e,totalTwd:n,breakdown:t}})),nn=l(()=>Ae.value.map(({key:e,month:t,totalTwd:n})=>({key:e,month:t,totalTwd:n}))),rn=l(()=>{const e=[];let t=0;for(const n of f.value){let r=0,a=0;for(const c of T.value){const m=P(c.id,n);c.type==="asset"?r+=U(m,c.currency):a+=U(m,c.currency)}const i=r-a,s=e.length===0?0:i-t,u=e.length===0||t===0?null:s/t*100;e.push({key:n,month:n,assetTwd:r,liabilityTwd:a,netTwd:i,delta:s,pct:u}),t=i}return e}),an=l(()=>T.value.map(e=>{const t=P(e.id,g.value),n=oe.value?P(e.id,oe.value):0,r=t-n,a=n===0?null:r/n*100,i=e.type==="asset"?1:-1;return{key:e.id,accountName:e.name,category:e.category,type:e.type,currency:e.currency,current:t,delta:r,deltaTwd:U(r,e.currency),pct:a,netImpactTwd:U(t*i,e.currency)}})),sn=l(()=>{if(!ue.value)return[];const e=[];let t=0;for(const n of f.value){const r=P(ue.value.id,n),a=e.length===0?0:r-t,i=e.length===0||t===0?null:a/t*100;e.push({key:n,month:n,amount:r,delta:a,pct:i}),t=r}return e});async function un(){if(!R.value.name.trim())return{type:"error",message:"請先填入帳戶名稱。"};const{data:{user:e}}=await I.auth.getUser();if(!e)return{type:"error",message:"請先登入才能新增帳戶。"};const t=d.value.length>0?Math.max(...d.value.map(s=>s.sort_order||0)):0,n={user_id:e.id,name:R.value.name.trim(),category:R.value.category.trim()||"未分類",currency:R.value.currency,type:R.value.type,sort_order:t+1},{data:r,error:a}=await I.from("accounts").insert(n).select().single();if(a||!r)return{type:"error",message:`新增失敗: ${a==null?void 0:a.message}`};const i=r;return d.value.push(i),D.value=[...D.value,i.id],R.value={name:"",category:"",type:"asset",currency:"TWD"},{type:"success",message:`已新增帳戶：${i.name}`}}async function on(e,t){if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(e))return{type:"error",message:"月份格式錯誤，請用 YYYY-MM。"};if(t.length===0)return{type:"error",message:"目前沒有可儲存的帳戶資料。"};const{data:{user:n}}=await I.auth.getUser();if(!n)return{type:"error",message:"請先登入。"};const r=t.map(i=>({user_id:n.id,account_id:i.accountId,month:e,amount:Math.max(0,i.amount)})),{error:a}=await I.from("monthly_records").upsert(r,{onConflict:"account_id, month"});return a?{type:"error",message:`儲存失敗: ${a.message}`}:(await ke(),g.value=M(e),{type:"success",message:`已儲存 ${e} 的資料。`})}function ln(){D.value=d.value.map(e=>e.id)}function cn(){const e=f.value.length>0?f.value[f.value.length-1]:y.value;g.value=e}async function dn(e,t){const n=d.value.find(s=>s.id===e);if(!n)return{type:"error",message:"找不到帳戶。"};const r={};t.name!==void 0&&(r.name=t.name.trim()),t.category!==void 0&&(r.category=t.category.trim()),t.currency!==void 0&&(r.currency=t.currency);const{error:a}=await I.from("accounts").update(r).eq("id",e);if(a)return{type:"error",message:`更新失敗: ${a.message}`};const i=d.value.findIndex(s=>s.id===e);return i>=0&&(d.value[i]={...d.value[i],...r}),{type:"success",message:`已更新帳戶：${r.name??n.name}`}}async function pn(e,t){const n=[...d.value];if(e<0||e>=n.length||t<0||t>=n.length||e===t)return{type:"success",message:"無需變更"};const[r]=n.splice(e,1);n.splice(t,0,r),d.value=n;const a=n.map((i,s)=>({id:i.id,sort_order:s}));try{return await Promise.all(a.map(i=>I.from("accounts").update({sort_order:i.sort_order}).eq("id",i.id))),{type:"success",message:"排序已更新"}}catch(i){return console.error("Sorting error:",i),{type:"error",message:"排序儲存失敗"}}}async function mn(e){const t=d.value.find(a=>a.id===e);if(!t)return{type:"error",message:"找不到要刪除的帳戶。"};const{error:n}=await I.from("monthly_records").delete().eq("account_id",e);if(n)return{type:"error",message:`刪除關聯紀錄失敗: ${n.message}`};const{error:r}=await I.from("accounts").delete().eq("id",e);return r?{type:"error",message:`刪除帳戶失敗: ${r.message}`}:(d.value=d.value.filter(a=>a.id!==e),D.value=D.value.filter(a=>a!==e),F.value=F.value.filter(a=>a.accountId!==e),{type:"success",message:`已刪除帳戶：${t.name}`})}const bn=Fe("assetManager",()=>(se||Se(),{accounts:d,records:F,isLoading:ae,fxRates:j,fxLoading:H,fxError:X,fxUpdatedAt:Q,fxUpdatedLabel:Yt,fxDisplayLabel:qt,fxSource:Lt,months:f,selectedMonth:g,selectedAccountIds:D,rangeStartMonth:w,rangeEndMonth:S,minMonth:Xt,maxMonth:Zt,monthRangeValue:en,newAccount:R,monthOptions:Nt,accountOptions:Ot,currencyOptions:_t,accountTypeOptions:jt,categoryOptions:zt,selectedAccounts:T,selectedAccount:ue,previousMonth:oe,selectedRangeMonths:Te,currencySummaryRows:Jt,selectedNetTwd:Ht,combinedWaterPoints:nn,combinedWaterPointDetails:Ae,trendRows:rn,accountSnapshotRows:an,singleAccountTrendRows:sn,accountMap:Ft,amountAtMonth:P,toTwd:U,formatCurrency:Ke,formatPct:ze,accountDisplayName:Wt,isMonthOutOfRange:tn,refreshFxRates:Me,addAccount:un,bulkUpsertMonthlyRecords:on,selectAllAccounts:ln,selectLatestMonth:cn,updateAccountById:dn,reorderAccount:pn,deleteAccount:mn,initData:Se}));export{tt as a,Bt as s,bn as u};
