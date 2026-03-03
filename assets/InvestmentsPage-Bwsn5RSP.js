import{a as we,s as q}from"./index-6c_bES-t.js";import{s as xe}from"./index-CsjMO-_Q.js";import{s as J}from"./index-DB-3GGBi.js";import{b as Oe,c as ke,s as Ie,a as he}from"./index-CJaj_QDb.js";import{B as se,C as _,o as c,c as m,a,m as f,y as I,aq as Se,g as Ce,l as j,n as oe,b as v,t as h,J as Q,R as Me,G as Le,H as Te,ar as ne,a0 as De,$ as P,E as Ke,ac as Ve,as as Fe,K as Pe,ae as Ae,ad as ie,X as Ee,I as Be,L as z,p as E,j as Re,am as $e,v as L,e as O,F as B,x as U,w as K,ah as ze,q as _e,f as W,k as je,d as Ue,at as We,u as M,r as D,al as X}from"./index-DkF0F3VN.js";import{a as Ne,s as Ge,C as He,O as qe}from"./index-agXsRhLH.js";const Je=[{id:"inv-1",symbol:"AAPL",market:"US",name:"Apple Inc.",shares:10.5,loaned_shares:0,cost_basis:170.5,current_price:185.3,currency:"USD"},{id:"inv-2",symbol:"2330.TW",market:"TW",name:"台積電",shares:2e3,loaned_shares:1e3,cost_basis:550,current_price:880,currency:"TWD"}];var Xe=`
    .p-toggleswitch {
        display: inline-block;
        width: dt('toggleswitch.width');
        height: dt('toggleswitch.height');
    }

    .p-toggleswitch-input {
        cursor: pointer;
        appearance: none;
        position: absolute;
        top: 0;
        inset-inline-start: 0;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        opacity: 0;
        z-index: 1;
        outline: 0 none;
        border-radius: dt('toggleswitch.border.radius');
    }

    .p-toggleswitch-slider {
        cursor: pointer;
        width: 100%;
        height: 100%;
        border-width: dt('toggleswitch.border.width');
        border-style: solid;
        border-color: dt('toggleswitch.border.color');
        background: dt('toggleswitch.background');
        transition:
            background dt('toggleswitch.transition.duration'),
            color dt('toggleswitch.transition.duration'),
            border-color dt('toggleswitch.transition.duration'),
            outline-color dt('toggleswitch.transition.duration'),
            box-shadow dt('toggleswitch.transition.duration');
        border-radius: dt('toggleswitch.border.radius');
        outline-color: transparent;
        box-shadow: dt('toggleswitch.shadow');
    }

    .p-toggleswitch-handle {
        position: absolute;
        top: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: dt('toggleswitch.handle.background');
        color: dt('toggleswitch.handle.color');
        width: dt('toggleswitch.handle.size');
        height: dt('toggleswitch.handle.size');
        inset-inline-start: dt('toggleswitch.gap');
        margin-block-start: calc(-1 * calc(dt('toggleswitch.handle.size') / 2));
        border-radius: dt('toggleswitch.handle.border.radius');
        transition:
            background dt('toggleswitch.transition.duration'),
            color dt('toggleswitch.transition.duration'),
            inset-inline-start dt('toggleswitch.slide.duration'),
            box-shadow dt('toggleswitch.slide.duration');
    }

    .p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-slider {
        background: dt('toggleswitch.checked.background');
        border-color: dt('toggleswitch.checked.border.color');
    }

    .p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-handle {
        background: dt('toggleswitch.handle.checked.background');
        color: dt('toggleswitch.handle.checked.color');
        inset-inline-start: calc(dt('toggleswitch.width') - calc(dt('toggleswitch.handle.size') + dt('toggleswitch.gap')));
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover) .p-toggleswitch-slider {
        background: dt('toggleswitch.hover.background');
        border-color: dt('toggleswitch.hover.border.color');
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover) .p-toggleswitch-handle {
        background: dt('toggleswitch.handle.hover.background');
        color: dt('toggleswitch.handle.hover.color');
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover).p-toggleswitch-checked .p-toggleswitch-slider {
        background: dt('toggleswitch.checked.hover.background');
        border-color: dt('toggleswitch.checked.hover.border.color');
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover).p-toggleswitch-checked .p-toggleswitch-handle {
        background: dt('toggleswitch.handle.checked.hover.background');
        color: dt('toggleswitch.handle.checked.hover.color');
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:focus-visible) .p-toggleswitch-slider {
        box-shadow: dt('toggleswitch.focus.ring.shadow');
        outline: dt('toggleswitch.focus.ring.width') dt('toggleswitch.focus.ring.style') dt('toggleswitch.focus.ring.color');
        outline-offset: dt('toggleswitch.focus.ring.offset');
    }

    .p-toggleswitch.p-invalid > .p-toggleswitch-slider {
        border-color: dt('toggleswitch.invalid.border.color');
    }

    .p-toggleswitch.p-disabled {
        opacity: 1;
    }

    .p-toggleswitch.p-disabled .p-toggleswitch-slider {
        background: dt('toggleswitch.disabled.background');
    }

    .p-toggleswitch.p-disabled .p-toggleswitch-handle {
        background: dt('toggleswitch.handle.disabled.background');
    }
`,Ye={root:{position:"relative"}},Qe={root:function(e){var n=e.instance,o=e.props;return["p-toggleswitch p-component",{"p-toggleswitch-checked":n.checked,"p-disabled":o.disabled,"p-invalid":n.$invalid}]},input:"p-toggleswitch-input",slider:"p-toggleswitch-slider",handle:"p-toggleswitch-handle"},Ze=se.extend({name:"toggleswitch",style:Xe,classes:Qe,inlineStyles:Ye}),et={name:"BaseToggleSwitch",extends:Oe,props:{trueValue:{type:null,default:!0},falseValue:{type:null,default:!1},readonly:{type:Boolean,default:!1},tabindex:{type:Number,default:null},inputId:{type:String,default:null},inputClass:{type:[String,Object],default:null},inputStyle:{type:Object,default:null},ariaLabelledby:{type:String,default:null},ariaLabel:{type:String,default:null}},style:Ze,provide:function(){return{$pcToggleSwitch:this,$parentInstance:this}}},fe={name:"ToggleSwitch",extends:et,inheritAttrs:!1,emits:["change","focus","blur"],methods:{getPTOptions:function(e){var n=e==="root"?this.ptmi:this.ptm;return n(e,{context:{checked:this.checked,disabled:this.disabled}})},onChange:function(e){if(!this.disabled&&!this.readonly){var n=this.checked?this.falseValue:this.trueValue;this.writeValue(n,e),this.$emit("change",e)}},onFocus:function(e){this.$emit("focus",e)},onBlur:function(e){var n,o;this.$emit("blur",e),(n=(o=this.formField).onBlur)===null||n===void 0||n.call(o,e)}},computed:{checked:function(){return this.d_value===this.trueValue},dataP:function(){return _({checked:this.checked,disabled:this.disabled,invalid:this.$invalid})}}},tt=["data-p-checked","data-p-disabled","data-p"],nt=["id","checked","tabindex","disabled","readonly","aria-checked","aria-labelledby","aria-label","aria-invalid"],it=["data-p"],ot=["data-p"];function lt(t,e,n,o,r,i){return c(),m("div",f({class:t.cx("root"),style:t.sx("root")},i.getPTOptions("root"),{"data-p-checked":i.checked,"data-p-disabled":t.disabled,"data-p":i.dataP}),[a("input",f({id:t.inputId,type:"checkbox",role:"switch",class:[t.cx("input"),t.inputClass],style:t.inputStyle,checked:i.checked,tabindex:t.tabindex,disabled:t.disabled,readonly:t.readonly,"aria-checked":i.checked,"aria-labelledby":t.ariaLabelledby,"aria-label":t.ariaLabel,"aria-invalid":t.invalid||void 0,onFocus:e[0]||(e[0]=function(){return i.onFocus&&i.onFocus.apply(i,arguments)}),onBlur:e[1]||(e[1]=function(){return i.onBlur&&i.onBlur.apply(i,arguments)}),onChange:e[2]||(e[2]=function(){return i.onChange&&i.onChange.apply(i,arguments)})},i.getPTOptions("input")),null,16,nt),a("div",f({class:t.cx("slider")},i.getPTOptions("slider"),{"data-p":i.dataP}),[a("div",f({class:t.cx("handle")},i.getPTOptions("handle"),{"data-p":i.dataP}),[I(t.$slots,"handle",{checked:i.checked})],16,ot)],16,it)],16,tt)}fe.render=lt;var st=`
    .p-chip {
        display: inline-flex;
        align-items: center;
        background: dt('chip.background');
        color: dt('chip.color');
        border-radius: dt('chip.border.radius');
        padding-block: dt('chip.padding.y');
        padding-inline: dt('chip.padding.x');
        gap: dt('chip.gap');
    }

    .p-chip-icon {
        color: dt('chip.icon.color');
        font-size: dt('chip.icon.size');
        width: dt('chip.icon.size');
        height: dt('chip.icon.size');
    }

    .p-chip-image {
        border-radius: 50%;
        width: dt('chip.image.width');
        height: dt('chip.image.height');
        margin-inline-start: calc(-1 * dt('chip.padding.y'));
    }

    .p-chip:has(.p-chip-remove-icon) {
        padding-inline-end: dt('chip.padding.y');
    }

    .p-chip:has(.p-chip-image) {
        padding-block-start: calc(dt('chip.padding.y') / 2);
        padding-block-end: calc(dt('chip.padding.y') / 2);
    }

    .p-chip-remove-icon {
        cursor: pointer;
        font-size: dt('chip.remove.icon.size');
        width: dt('chip.remove.icon.size');
        height: dt('chip.remove.icon.size');
        color: dt('chip.remove.icon.color');
        border-radius: 50%;
        transition:
            outline-color dt('chip.transition.duration'),
            box-shadow dt('chip.transition.duration');
        outline-color: transparent;
    }

    .p-chip-remove-icon:focus-visible {
        box-shadow: dt('chip.remove.icon.focus.ring.shadow');
        outline: dt('chip.remove.icon.focus.ring.width') dt('chip.remove.icon.focus.ring.style') dt('chip.remove.icon.focus.ring.color');
        outline-offset: dt('chip.remove.icon.focus.ring.offset');
    }
`,at={root:"p-chip p-component",image:"p-chip-image",icon:"p-chip-icon",label:"p-chip-label",removeIcon:"p-chip-remove-icon"},rt=se.extend({name:"chip",style:st,classes:at}),dt={name:"BaseChip",extends:Ce,props:{label:{type:[String,Number],default:null},icon:{type:String,default:null},image:{type:String,default:null},removable:{type:Boolean,default:!1},removeIcon:{type:String,default:void 0}},style:rt,provide:function(){return{$pcChip:this,$parentInstance:this}}},me={name:"Chip",extends:dt,inheritAttrs:!1,emits:["remove"],data:function(){return{visible:!0}},methods:{onKeydown:function(e){(e.key==="Enter"||e.key==="Backspace")&&this.close(e)},close:function(e){this.visible=!1,this.$emit("remove",e)}},computed:{dataP:function(){return _({removable:this.removable})}},components:{TimesCircleIcon:Se}},ut=["aria-label","data-p"],ct=["src"];function pt(t,e,n,o,r,i){return r.visible?(c(),m("div",f({key:0,class:t.cx("root"),"aria-label":t.label},t.ptmi("root"),{"data-p":i.dataP}),[I(t.$slots,"default",{},function(){return[t.image?(c(),m("img",f({key:0,src:t.image},t.ptm("image"),{class:t.cx("image")}),null,16,ct)):t.$slots.icon?(c(),j(oe(t.$slots.icon),f({key:1,class:t.cx("icon")},t.ptm("icon")),null,16,["class"])):t.icon?(c(),m("span",f({key:2,class:[t.cx("icon"),t.icon]},t.ptm("icon")),null,16)):v("",!0),t.label!==null?(c(),m("div",f({key:3,class:t.cx("label")},t.ptm("label")),h(t.label),17)):v("",!0)]}),t.removable?I(t.$slots,"removeicon",{key:0,removeCallback:i.close,keydownCallback:i.onKeydown},function(){return[(c(),j(oe(t.removeIcon?"span":"TimesCircleIcon"),f({class:[t.cx("removeIcon"),t.removeIcon],onClick:i.close,onKeydown:i.onKeydown},t.ptm("removeIcon")),null,16,["class","onClick","onKeydown"]))]}):v("",!0)],16,ut)):v("",!0)}me.render=pt;var ht=`
    .p-autocomplete {
        display: inline-flex;
    }

    .p-autocomplete-loader {
        position: absolute;
        top: 50%;
        margin-top: -0.5rem;
        inset-inline-end: dt('autocomplete.padding.x');
    }

    .p-autocomplete:has(.p-autocomplete-dropdown) .p-autocomplete-loader {
        inset-inline-end: calc(dt('autocomplete.dropdown.width') + dt('autocomplete.padding.x'));
    }

    .p-autocomplete:has(.p-autocomplete-dropdown) .p-autocomplete-input {
        flex: 1 1 auto;
        width: 1%;
    }

    .p-autocomplete:has(.p-autocomplete-dropdown) .p-autocomplete-input,
    .p-autocomplete:has(.p-autocomplete-dropdown) .p-autocomplete-input-multiple {
        border-start-end-radius: 0;
        border-end-end-radius: 0;
    }

    .p-autocomplete-dropdown {
        cursor: pointer;
        display: inline-flex;
        user-select: none;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        position: relative;
        width: dt('autocomplete.dropdown.width');
        border-start-end-radius: dt('autocomplete.dropdown.border.radius');
        border-end-end-radius: dt('autocomplete.dropdown.border.radius');
        background: dt('autocomplete.dropdown.background');
        border: 1px solid dt('autocomplete.dropdown.border.color');
        border-inline-start: 0 none;
        color: dt('autocomplete.dropdown.color');
        transition:
            background dt('autocomplete.transition.duration'),
            color dt('autocomplete.transition.duration'),
            border-color dt('autocomplete.transition.duration'),
            outline-color dt('autocomplete.transition.duration'),
            box-shadow dt('autocomplete.transition.duration');
        outline-color: transparent;
    }

    .p-autocomplete-dropdown:not(:disabled):hover {
        background: dt('autocomplete.dropdown.hover.background');
        border-color: dt('autocomplete.dropdown.hover.border.color');
        color: dt('autocomplete.dropdown.hover.color');
    }

    .p-autocomplete-dropdown:not(:disabled):active {
        background: dt('autocomplete.dropdown.active.background');
        border-color: dt('autocomplete.dropdown.active.border.color');
        color: dt('autocomplete.dropdown.active.color');
    }

    .p-autocomplete-dropdown:focus-visible {
        box-shadow: dt('autocomplete.dropdown.focus.ring.shadow');
        outline: dt('autocomplete.dropdown.focus.ring.width') dt('autocomplete.dropdown.focus.ring.style') dt('autocomplete.dropdown.focus.ring.color');
        outline-offset: dt('autocomplete.dropdown.focus.ring.offset');
    }

    .p-autocomplete-overlay {
        position: absolute;
        top: 0;
        left: 0;
        background: dt('autocomplete.overlay.background');
        color: dt('autocomplete.overlay.color');
        border: 1px solid dt('autocomplete.overlay.border.color');
        border-radius: dt('autocomplete.overlay.border.radius');
        box-shadow: dt('autocomplete.overlay.shadow');
        min-width: 100%;
    }

    .p-autocomplete-list-container {
        overflow: auto;
    }

    .p-autocomplete-list {
        margin: 0;
        list-style-type: none;
        display: flex;
        flex-direction: column;
        gap: dt('autocomplete.list.gap');
        padding: dt('autocomplete.list.padding');
    }

    .p-autocomplete-option {
        cursor: pointer;
        white-space: nowrap;
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        padding: dt('autocomplete.option.padding');
        border: 0 none;
        color: dt('autocomplete.option.color');
        background: transparent;
        transition:
            background dt('autocomplete.transition.duration'),
            color dt('autocomplete.transition.duration'),
            border-color dt('autocomplete.transition.duration');
        border-radius: dt('autocomplete.option.border.radius');
    }

    .p-autocomplete-option:not(.p-autocomplete-option-selected):not(.p-disabled).p-focus {
        background: dt('autocomplete.option.focus.background');
        color: dt('autocomplete.option.focus.color');
    }

    .p-autocomplete-option:not(.p-autocomplete-option-selected):not(.p-disabled):hover {
        background: dt('autocomplete.option.focus.background');
        color: dt('autocomplete.option.focus.color');
    }

    .p-autocomplete-option-selected {
        background: dt('autocomplete.option.selected.background');
        color: dt('autocomplete.option.selected.color');
    }

    .p-autocomplete-option-selected.p-focus {
        background: dt('autocomplete.option.selected.focus.background');
        color: dt('autocomplete.option.selected.focus.color');
    }

    .p-autocomplete-option-group {
        margin: 0;
        padding: dt('autocomplete.option.group.padding');
        color: dt('autocomplete.option.group.color');
        background: dt('autocomplete.option.group.background');
        font-weight: dt('autocomplete.option.group.font.weight');
    }

    .p-autocomplete-input-multiple {
        margin: 0;
        list-style-type: none;
        cursor: text;
        overflow: hidden;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        padding: calc(dt('autocomplete.padding.y') / 2) dt('autocomplete.padding.x');
        gap: calc(dt('autocomplete.padding.y') / 2);
        color: dt('autocomplete.color');
        background: dt('autocomplete.background');
        border: 1px solid dt('autocomplete.border.color');
        border-radius: dt('autocomplete.border.radius');
        width: 100%;
        transition:
            background dt('autocomplete.transition.duration'),
            color dt('autocomplete.transition.duration'),
            border-color dt('autocomplete.transition.duration'),
            outline-color dt('autocomplete.transition.duration'),
            box-shadow dt('autocomplete.transition.duration');
        outline-color: transparent;
        box-shadow: dt('autocomplete.shadow');
    }

    .p-autocomplete-input-multiple.p-disabled {
        opacity: 1;
        background: dt('autocomplete.disabled.background');
        color: dt('autocomplete.disabled.color');
    }

    .p-autocomplete-input-multiple:not(.p-disabled):hover {
        border-color: dt('autocomplete.hover.border.color');
    }

    .p-autocomplete.p-focus .p-autocomplete-input-multiple:not(.p-disabled) {
        border-color: dt('autocomplete.focus.border.color');
        box-shadow: dt('autocomplete.focus.ring.shadow');
        outline: dt('autocomplete.focus.ring.width') dt('autocomplete.focus.ring.style') dt('autocomplete.focus.ring.color');
        outline-offset: dt('autocomplete.focus.ring.offset');
    }

    .p-autocomplete.p-invalid .p-autocomplete-input-multiple {
        border-color: dt('autocomplete.invalid.border.color');
    }

    .p-variant-filled.p-autocomplete-input-multiple {
        background: dt('autocomplete.filled.background');
    }

    .p-autocomplete-input-multiple.p-variant-filled:not(.p-disabled):hover {
        background: dt('autocomplete.filled.hover.background');
    }

    .p-autocomplete.p-focus .p-autocomplete-input-multiple.p-variant-filled:not(.p-disabled) {
        background: dt('autocomplete.filled.focus.background');
    }

    .p-autocomplete-chip.p-chip {
        padding-block-start: calc(dt('autocomplete.padding.y') / 2);
        padding-block-end: calc(dt('autocomplete.padding.y') / 2);
        border-radius: dt('autocomplete.chip.border.radius');
    }

    .p-autocomplete-input-multiple:has(.p-autocomplete-chip) {
        padding-inline-start: calc(dt('autocomplete.padding.y') / 2);
        padding-inline-end: calc(dt('autocomplete.padding.y') / 2);
    }

    .p-autocomplete-chip-item.p-focus .p-autocomplete-chip {
        background: dt('autocomplete.chip.focus.background');
        color: dt('autocomplete.chip.focus.color');
    }

    .p-autocomplete-input-chip {
        flex: 1 1 auto;
        display: inline-flex;
        padding-block-start: calc(dt('autocomplete.padding.y') / 2);
        padding-block-end: calc(dt('autocomplete.padding.y') / 2);
    }

    .p-autocomplete-input-chip input {
        border: 0 none;
        outline: 0 none;
        background: transparent;
        margin: 0;
        padding: 0;
        box-shadow: none;
        border-radius: 0;
        width: 100%;
        font-family: inherit;
        font-feature-settings: inherit;
        font-size: 1rem;
        color: inherit;
    }

    .p-autocomplete-input-chip input::placeholder {
        color: dt('autocomplete.placeholder.color');
    }

    .p-autocomplete.p-invalid .p-autocomplete-input-chip input::placeholder {
        color: dt('autocomplete.invalid.placeholder.color');
    }

    .p-autocomplete-empty-message {
        padding: dt('autocomplete.empty.message.padding');
    }

    .p-autocomplete-fluid {
        display: flex;
    }

    .p-autocomplete-fluid:has(.p-autocomplete-dropdown) .p-autocomplete-input {
        width: 1%;
    }

    .p-autocomplete:has(.p-inputtext-sm) .p-autocomplete-dropdown {
        width: dt('autocomplete.dropdown.sm.width');
    }

    .p-autocomplete:has(.p-inputtext-sm) .p-autocomplete-dropdown .p-icon {
        font-size: dt('form.field.sm.font.size');
        width: dt('form.field.sm.font.size');
        height: dt('form.field.sm.font.size');
    }

    .p-autocomplete:has(.p-inputtext-lg) .p-autocomplete-dropdown {
        width: dt('autocomplete.dropdown.lg.width');
    }

    .p-autocomplete:has(.p-inputtext-lg) .p-autocomplete-dropdown .p-icon {
        font-size: dt('form.field.lg.font.size');
        width: dt('form.field.lg.font.size');
        height: dt('form.field.lg.font.size');
    }

    .p-autocomplete-clear-icon {
        position: absolute;
        top: 50%;
        margin-top: -0.5rem;
        cursor: pointer;
        color: dt('form.field.icon.color');
        inset-inline-end: dt('autocomplete.padding.x');
    }

    .p-autocomplete:has(.p-autocomplete-dropdown) .p-autocomplete-clear-icon {
        inset-inline-end: calc(dt('autocomplete.padding.x') + dt('autocomplete.dropdown.width'));
    }

    .p-autocomplete:has(.p-autocomplete-clear-icon) .p-autocomplete-input {
        padding-inline-end: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .p-inputgroup .p-autocomplete-dropdown {
        border-radius: 0;
    }

    .p-inputgroup > .p-autocomplete:last-child:has(.p-autocomplete-dropdown) > .p-autocomplete-input {
        border-start-end-radius: 0;
        border-end-end-radius: 0;
    }

    .p-inputgroup > .p-autocomplete:last-child .p-autocomplete-dropdown {
        border-start-end-radius: dt('autocomplete.dropdown.border.radius');
        border-end-end-radius: dt('autocomplete.dropdown.border.radius');
    }
`,ft={root:{position:"relative"}},mt={root:function(e){var n=e.instance;return["p-autocomplete p-component p-inputwrapper",{"p-invalid":n.$invalid,"p-focus":n.focused,"p-inputwrapper-filled":n.$filled||Q(n.inputValue),"p-inputwrapper-focus":n.focused,"p-autocomplete-open":n.overlayVisible,"p-autocomplete-fluid":n.$fluid,"p-autocomplete-clearable":n.isClearIconVisible}]},pcInputText:"p-autocomplete-input",inputMultiple:function(e){var n=e.instance,o=e.props;return["p-autocomplete-input-multiple",{"p-variant-filled":n.$variant==="filled","p-disabled":o.disabled}]},clearIcon:"p-autocomplete-clear-icon",chipItem:function(e){var n=e.instance,o=e.i;return["p-autocomplete-chip-item",{"p-focus":n.focusedMultipleOptionIndex===o}]},pcChip:"p-autocomplete-chip",chipIcon:"p-autocomplete-chip-icon",inputChip:"p-autocomplete-input-chip",loader:"p-autocomplete-loader",dropdown:"p-autocomplete-dropdown",overlay:"p-autocomplete-overlay p-component",listContainer:"p-autocomplete-list-container",list:"p-autocomplete-list",optionGroup:"p-autocomplete-option-group",option:function(e){var n=e.instance,o=e.option,r=e.i,i=e.getItemOptions;return["p-autocomplete-option",{"p-autocomplete-option-selected":n.isSelected(o),"p-focus":n.focusedOptionIndex===n.getOptionIndex(r,i),"p-disabled":n.isOptionDisabled(o)}]},emptyMessage:"p-autocomplete-empty-message"},gt=se.extend({name:"autocomplete",style:ht,classes:mt,inlineStyles:ft}),bt={name:"BaseAutoComplete",extends:Ie,props:{suggestions:{type:Array,default:null},optionLabel:null,optionDisabled:null,optionGroupLabel:null,optionGroupChildren:null,scrollHeight:{type:String,default:"14rem"},dropdown:{type:Boolean,default:!1},dropdownMode:{type:String,default:"blank"},multiple:{type:Boolean,default:!1},loading:{type:Boolean,default:!1},placeholder:{type:String,default:null},dataKey:{type:String,default:null},minLength:{type:Number,default:1},delay:{type:Number,default:300},appendTo:{type:[String,Object],default:"body"},forceSelection:{type:Boolean,default:!1},completeOnFocus:{type:Boolean,default:!1},showClear:{type:Boolean,default:!1},inputId:{type:String,default:null},inputStyle:{type:Object,default:null},inputClass:{type:[String,Object],default:null},panelStyle:{type:Object,default:null},panelClass:{type:[String,Object],default:null},overlayStyle:{type:Object,default:null},overlayClass:{type:[String,Object],default:null},dropdownIcon:{type:String,default:null},dropdownClass:{type:[String,Object],default:null},loader:{type:String,default:null},loadingIcon:{type:String,default:null},removeTokenIcon:{type:String,default:null},chipIcon:{type:String,default:null},virtualScrollerOptions:{type:Object,default:null},autoOptionFocus:{type:Boolean,default:!1},selectOnFocus:{type:Boolean,default:!1},focusOnHover:{type:Boolean,default:!0},searchLocale:{type:String,default:void 0},searchMessage:{type:String,default:null},selectionMessage:{type:String,default:null},emptySelectionMessage:{type:String,default:null},emptySearchMessage:{type:String,default:null},showEmptyMessage:{type:Boolean,default:!0},tabindex:{type:Number,default:0},typeahead:{type:Boolean,default:!0},ariaLabel:{type:String,default:null},ariaLabelledby:{type:String,default:null}},style:gt,provide:function(){return{$pcAutoComplete:this,$parentInstance:this}}};function de(t,e,n){return(e=vt(e))in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function vt(t){var e=yt(t,"string");return R(e)=="symbol"?e:e+""}function yt(t,e){if(R(t)!="object"||!t)return t;var n=t[Symbol.toPrimitive];if(n!==void 0){var o=n.call(t,e);if(R(o)!="object")return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}function R(t){"@babel/helpers - typeof";return R=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(e){return typeof e}:function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},R(t)}function Y(t){return kt(t)||Ot(t)||xt(t)||wt()}function wt(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function xt(t,e){if(t){if(typeof t=="string")return le(t,e);var n={}.toString.call(t).slice(8,-1);return n==="Object"&&t.constructor&&(n=t.constructor.name),n==="Map"||n==="Set"?Array.from(t):n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?le(t,e):void 0}}function Ot(t){if(typeof Symbol<"u"&&t[Symbol.iterator]!=null||t["@@iterator"]!=null)return Array.from(t)}function kt(t){if(Array.isArray(t))return le(t)}function le(t,e){(e==null||e>t.length)&&(e=t.length);for(var n=0,o=Array(e);n<e;n++)o[n]=t[n];return o}var ge={name:"AutoComplete",extends:bt,inheritAttrs:!1,emits:["change","focus","blur","item-select","item-unselect","option-select","option-unselect","dropdown-click","clear","complete","before-show","before-hide","show","hide"],inject:{$pcFluid:{default:null}},outsideClickListener:null,resizeListener:null,scrollHandler:null,overlay:null,virtualScroller:null,searchTimeout:null,dirty:!1,startRangeIndex:-1,data:function(){return{clicked:!1,focused:!1,focusedOptionIndex:-1,focusedMultipleOptionIndex:-1,overlayVisible:!1,searching:!1}},watch:{suggestions:function(){this.searching&&(this.show(),this.focusedOptionIndex=this.overlayVisible&&this.autoOptionFocus?this.findFirstFocusedOptionIndex():-1,this.searching=!1,!this.showEmptyMessage&&this.visibleOptions.length===0&&this.hide()),this.autoUpdateModel()}},mounted:function(){this.autoUpdateModel()},updated:function(){this.overlayVisible&&this.alignOverlay()},beforeUnmount:function(){this.unbindOutsideClickListener(),this.unbindResizeListener(),this.scrollHandler&&(this.scrollHandler.destroy(),this.scrollHandler=null),this.overlay&&(ie.clear(this.overlay),this.overlay=null)},methods:{getOptionIndex:function(e,n){return this.virtualScrollerDisabled?e:n&&n(e).index},getOptionLabel:function(e){return this.optionLabel?z(e,this.optionLabel):e},getOptionValue:function(e){return e},getOptionRenderKey:function(e,n){return(this.dataKey?z(e,this.dataKey):this.getOptionLabel(e))+"_"+n},getPTOptions:function(e,n,o,r){return this.ptm(r,{context:{option:e,index:o,selected:this.isSelected(e),focused:this.focusedOptionIndex===this.getOptionIndex(o,n),disabled:this.isOptionDisabled(e)}})},isOptionDisabled:function(e){return this.optionDisabled?z(e,this.optionDisabled):!1},isOptionGroup:function(e){return this.optionGroupLabel&&e.optionGroup&&e.group},getOptionGroupLabel:function(e){return z(e,this.optionGroupLabel)},getOptionGroupChildren:function(e){return z(e,this.optionGroupChildren)},getAriaPosInset:function(e){var n=this;return(this.optionGroupLabel?e-this.visibleOptions.slice(0,e).filter(function(o){return n.isOptionGroup(o)}).length:e)+1},show:function(e){this.$emit("before-show"),this.dirty=!0,this.overlayVisible=!0,this.focusedOptionIndex=this.focusedOptionIndex!==-1?this.focusedOptionIndex:this.autoOptionFocus?this.findFirstFocusedOptionIndex():-1,e&&P(this.multiple?this.$refs.focusInput:this.$refs.focusInput.$el)},hide:function(e){var n=this,o=function(){var i;n.$emit("before-hide"),n.dirty=e,n.overlayVisible=!1,n.clicked=!1,n.focusedOptionIndex=-1,e&&P(n.multiple?n.$refs.focusInput:(i=n.$refs.focusInput)===null||i===void 0?void 0:i.$el)};setTimeout(function(){o()},0)},onFocus:function(e){this.disabled||(!this.dirty&&this.completeOnFocus&&this.search(e,e.target.value,"focus"),this.dirty=!0,this.focused=!0,this.overlayVisible&&(this.focusedOptionIndex=this.focusedOptionIndex!==-1?this.focusedOptionIndex:this.overlayVisible&&this.autoOptionFocus?this.findFirstFocusedOptionIndex():-1,this.scrollInView(this.focusedOptionIndex)),this.$emit("focus",e))},onBlur:function(e){var n,o;this.dirty=!1,this.focused=!1,this.focusedOptionIndex=-1,this.$emit("blur",e),(n=(o=this.formField).onBlur)===null||n===void 0||n.call(o)},onKeyDown:function(e){if(this.disabled){e.preventDefault();return}switch(e.code){case"ArrowDown":this.onArrowDownKey(e);break;case"ArrowUp":this.onArrowUpKey(e);break;case"ArrowLeft":this.onArrowLeftKey(e);break;case"ArrowRight":this.onArrowRightKey(e);break;case"Home":this.onHomeKey(e);break;case"End":this.onEndKey(e);break;case"PageDown":this.onPageDownKey(e);break;case"PageUp":this.onPageUpKey(e);break;case"Enter":case"NumpadEnter":this.onEnterKey(e);break;case"Space":this.onSpaceKey(e);break;case"Escape":this.onEscapeKey(e);break;case"Tab":this.onTabKey(e);break;case"ShiftLeft":case"ShiftRight":this.onShiftKey(e);break;case"Backspace":this.onBackspaceKey(e);break}this.clicked=!1},onInput:function(e){var n=this;if(this.typeahead){this.searchTimeout&&clearTimeout(this.searchTimeout);var o=e.target.value;this.multiple||this.updateModel(e,o),o.length===0?(this.searching=!1,this.hide(),this.$emit("clear")):o.length>=this.minLength?(this.focusedOptionIndex=-1,this.searchTimeout=setTimeout(function(){n.search(e,o,"input")},this.delay)):(this.searching=!1,this.hide())}},onChange:function(e){var n=this;if(this.forceSelection){var o=!1;if(this.visibleOptions&&!this.multiple){var r,i=this.multiple?this.$refs.focusInput.value:(r=this.$refs.focusInput)===null||r===void 0||(r=r.$el)===null||r===void 0?void 0:r.value,g=this.visibleOptions.find(function(V){return n.isOptionMatched(V,i||"")});g!==void 0&&(o=!0,!this.isSelected(g)&&this.onOptionSelect(e,g))}if(!o){if(this.multiple)this.$refs.focusInput.value="";else{var u,d=(u=this.$refs.focusInput)===null||u===void 0?void 0:u.$el;d&&(d.value="")}this.$emit("clear"),!this.multiple&&this.updateModel(e,null)}}},onMultipleContainerFocus:function(){this.disabled||(this.focused=!0)},onMultipleContainerBlur:function(){this.focusedMultipleOptionIndex=-1,this.focused=!1},onMultipleContainerKeyDown:function(e){if(this.disabled){e.preventDefault();return}switch(e.code){case"ArrowLeft":this.onArrowLeftKeyOnMultiple(e);break;case"ArrowRight":this.onArrowRightKeyOnMultiple(e);break;case"Backspace":this.onBackspaceKeyOnMultiple(e);break}},onContainerClick:function(e){this.clicked=!0,!(this.disabled||this.searching||this.loading||this.isDropdownClicked(e))&&(!this.overlay||!this.overlay.contains(e.target))&&P(this.multiple?this.$refs.focusInput:this.$refs.focusInput.$el)},onDropdownClick:function(e){var n=void 0;if(this.overlayVisible)this.hide(!0);else{var o=this.multiple?this.$refs.focusInput:this.$refs.focusInput.$el;P(o),n=o.value,this.dropdownMode==="blank"?this.search(e,"","dropdown"):this.dropdownMode==="current"&&this.search(e,n,"dropdown")}this.$emit("dropdown-click",{originalEvent:e,query:n})},onOptionSelect:function(e,n){var o=arguments.length>2&&arguments[2]!==void 0?arguments[2]:!0,r=this.getOptionValue(n);this.multiple?(this.$refs.focusInput.value="",this.isSelected(n)||this.updateModel(e,[].concat(Y(this.d_value||[]),[r]))):this.updateModel(e,r),this.$emit("item-select",{originalEvent:e,value:n}),this.$emit("option-select",{originalEvent:e,value:n}),o&&this.hide(!0)},onOptionMouseMove:function(e,n){this.focusOnHover&&this.changeFocusedOptionIndex(e,n)},onOptionSelectRange:function(e){var n=this,o=arguments.length>1&&arguments[1]!==void 0?arguments[1]:-1,r=arguments.length>2&&arguments[2]!==void 0?arguments[2]:-1;if(o===-1&&(o=this.findNearestSelectedOptionIndex(r,!0)),r===-1&&(r=this.findNearestSelectedOptionIndex(o)),o!==-1&&r!==-1){var i=Math.min(o,r),g=Math.max(o,r),u=this.visibleOptions.slice(i,g+1).filter(function(d){return n.isValidOption(d)}).filter(function(d){return!n.isSelected(d)}).map(function(d){return n.getOptionValue(d)});this.updateModel(e,[].concat(Y(this.d_value||[]),Y(u)))}},onClearClick:function(e){this.updateModel(e,null)},onOverlayClick:function(e){qe.emit("overlay-click",{originalEvent:e,target:this.$el})},onOverlayKeyDown:function(e){switch(e.code){case"Escape":this.onEscapeKey(e);break}},onArrowDownKey:function(e){if(this.overlayVisible){var n=this.focusedOptionIndex!==-1?this.findNextOptionIndex(this.focusedOptionIndex):this.clicked?this.findFirstOptionIndex():this.findFirstFocusedOptionIndex();this.multiple&&e.shiftKey&&this.onOptionSelectRange(e,this.startRangeIndex,n),this.changeFocusedOptionIndex(e,n),e.preventDefault()}},onArrowUpKey:function(e){if(this.overlayVisible)if(e.altKey)this.focusedOptionIndex!==-1&&this.onOptionSelect(e,this.visibleOptions[this.focusedOptionIndex]),this.overlayVisible&&this.hide(),e.preventDefault();else{var n=this.focusedOptionIndex!==-1?this.findPrevOptionIndex(this.focusedOptionIndex):this.clicked?this.findLastOptionIndex():this.findLastFocusedOptionIndex();this.multiple&&e.shiftKey&&this.onOptionSelectRange(e,n,this.startRangeIndex),this.changeFocusedOptionIndex(e,n),e.preventDefault()}},onArrowLeftKey:function(e){var n=e.currentTarget;this.focusedOptionIndex=-1,this.multiple&&(Be(n.value)&&this.$filled?(P(this.$refs.multiContainer),this.focusedMultipleOptionIndex=this.d_value.length):e.stopPropagation())},onArrowRightKey:function(e){this.focusedOptionIndex=-1,this.multiple&&e.stopPropagation()},onHomeKey:function(e){var n=e.currentTarget,o=n.value.length,r=e.metaKey||e.ctrlKey,i=this.findFirstOptionIndex();this.multiple&&e.shiftKey&&r&&this.onOptionSelectRange(e,i,this.startRangeIndex),n.setSelectionRange(0,e.shiftKey?o:0),this.focusedOptionIndex=-1,e.preventDefault()},onEndKey:function(e){var n=e.currentTarget,o=n.value.length,r=e.metaKey||e.ctrlKey,i=this.findLastOptionIndex();this.multiple&&e.shiftKey&&r&&this.onOptionSelectRange(e,this.startRangeIndex,i),n.setSelectionRange(e.shiftKey?0:o,o),this.focusedOptionIndex=-1,e.preventDefault()},onPageUpKey:function(e){this.scrollInView(0),e.preventDefault()},onPageDownKey:function(e){this.scrollInView(this.visibleOptions.length-1),e.preventDefault()},onEnterKey:function(e){this.typeahead?this.overlayVisible?(this.focusedOptionIndex!==-1&&(this.multiple&&e.shiftKey?(this.onOptionSelectRange(e,this.focusedOptionIndex),e.preventDefault()):this.onOptionSelect(e,this.visibleOptions[this.focusedOptionIndex])),this.hide()):(this.focusedOptionIndex=-1,this.onArrowDownKey(e)):this.multiple&&(e.target.value.trim()&&(this.updateModel(e,[].concat(Y(this.d_value||[]),[e.target.value.trim()])),this.$refs.focusInput.value=""),e.preventDefault())},onSpaceKey:function(e){!this.autoOptionFocus&&this.focusedOptionIndex!==-1&&this.onEnterKey(e)},onEscapeKey:function(e){this.overlayVisible&&this.hide(!0),e.preventDefault()},onTabKey:function(e){this.focusedOptionIndex!==-1&&this.onOptionSelect(e,this.visibleOptions[this.focusedOptionIndex]),this.overlayVisible&&this.hide()},onShiftKey:function(){this.startRangeIndex=this.focusedOptionIndex},onBackspaceKey:function(e){if(this.multiple){if(Q(this.d_value)&&!this.$refs.focusInput.value){var n=this.d_value[this.d_value.length-1],o=this.d_value.slice(0,-1);this.writeValue(o,e),this.$emit("item-unselect",{originalEvent:e,value:n}),this.$emit("option-unselect",{originalEvent:e,value:n})}e.stopPropagation()}},onArrowLeftKeyOnMultiple:function(){this.focusedMultipleOptionIndex=this.focusedMultipleOptionIndex<1?0:this.focusedMultipleOptionIndex-1},onArrowRightKeyOnMultiple:function(){this.focusedMultipleOptionIndex++,this.focusedMultipleOptionIndex>this.d_value.length-1&&(this.focusedMultipleOptionIndex=-1,P(this.$refs.focusInput))},onBackspaceKeyOnMultiple:function(e){this.focusedMultipleOptionIndex!==-1&&this.removeOption(e,this.focusedMultipleOptionIndex)},onOverlayEnter:function(e){ie.set("overlay",e,this.$primevue.config.zIndex.overlay),Ee(e,{position:"absolute",top:"0"}),this.alignOverlay(),this.$attrSelector&&e.setAttribute(this.$attrSelector,"")},onOverlayAfterEnter:function(){this.bindOutsideClickListener(),this.bindScrollListener(),this.bindResizeListener(),this.$emit("show")},onOverlayLeave:function(){this.unbindOutsideClickListener(),this.unbindScrollListener(),this.unbindResizeListener(),this.$emit("hide"),this.overlay=null},onOverlayAfterLeave:function(e){ie.clear(e)},alignOverlay:function(){var e=this.multiple?this.$refs.multiContainer:this.$refs.focusInput.$el;this.appendTo==="self"?Fe(this.overlay,e):(this.overlay.style.minWidth=Pe(e)+"px",Ae(this.overlay,e))},bindOutsideClickListener:function(){var e=this;this.outsideClickListener||(this.outsideClickListener=function(n){e.overlayVisible&&e.overlay&&e.isOutsideClicked(n)&&e.hide()},document.addEventListener("click",this.outsideClickListener,!0))},unbindOutsideClickListener:function(){this.outsideClickListener&&(document.removeEventListener("click",this.outsideClickListener,!0),this.outsideClickListener=null)},bindScrollListener:function(){var e=this;this.scrollHandler||(this.scrollHandler=new He(this.$refs.container,function(){e.overlayVisible&&e.hide()})),this.scrollHandler.bindScrollListener()},unbindScrollListener:function(){this.scrollHandler&&this.scrollHandler.unbindScrollListener()},bindResizeListener:function(){var e=this;this.resizeListener||(this.resizeListener=function(){e.overlayVisible&&!Ve()&&e.hide()},window.addEventListener("resize",this.resizeListener))},unbindResizeListener:function(){this.resizeListener&&(window.removeEventListener("resize",this.resizeListener),this.resizeListener=null)},isOutsideClicked:function(e){return!this.overlay.contains(e.target)&&!this.isInputClicked(e)&&!this.isDropdownClicked(e)},isInputClicked:function(e){return this.multiple?e.target===this.$refs.multiContainer||this.$refs.multiContainer.contains(e.target):e.target===this.$refs.focusInput.$el},isDropdownClicked:function(e){return this.$refs.dropdownButton?e.target===this.$refs.dropdownButton||this.$refs.dropdownButton.contains(e.target):!1},isOptionMatched:function(e,n){var o;return this.isValidOption(e)&&((o=this.getOptionLabel(e))===null||o===void 0?void 0:o.toLocaleLowerCase(this.searchLocale))===n.toLocaleLowerCase(this.searchLocale)},isValidOption:function(e){return Q(e)&&!(this.isOptionDisabled(e)||this.isOptionGroup(e))},isValidSelectedOption:function(e){return this.isValidOption(e)&&this.isSelected(e)},isEquals:function(e,n){return Ke(e,n,this.equalityKey)},isSelected:function(e){var n=this,o=this.getOptionValue(e);return this.multiple?(this.d_value||[]).some(function(r){return n.isEquals(r,o)}):this.isEquals(this.d_value,this.getOptionValue(e))},findFirstOptionIndex:function(){var e=this;return this.visibleOptions.findIndex(function(n){return e.isValidOption(n)})},findLastOptionIndex:function(){var e=this;return ne(this.visibleOptions,function(n){return e.isValidOption(n)})},findNextOptionIndex:function(e){var n=this,o=e<this.visibleOptions.length-1?this.visibleOptions.slice(e+1).findIndex(function(r){return n.isValidOption(r)}):-1;return o>-1?o+e+1:e},findPrevOptionIndex:function(e){var n=this,o=e>0?ne(this.visibleOptions.slice(0,e),function(r){return n.isValidOption(r)}):-1;return o>-1?o:e},findSelectedOptionIndex:function(){var e=this;return this.$filled?this.visibleOptions.findIndex(function(n){return e.isValidSelectedOption(n)}):-1},findFirstFocusedOptionIndex:function(){var e=this.findSelectedOptionIndex();return e<0?this.findFirstOptionIndex():e},findLastFocusedOptionIndex:function(){var e=this.findSelectedOptionIndex();return e<0?this.findLastOptionIndex():e},search:function(e,n,o){n!=null&&(o==="input"&&n.trim().length===0||(this.searching=!0,this.$emit("complete",{originalEvent:e,query:n})))},removeOption:function(e,n){var o=this,r=this.d_value[n],i=this.d_value.filter(function(g,u){return u!==n}).map(function(g){return o.getOptionValue(g)});this.updateModel(e,i),this.$emit("item-unselect",{originalEvent:e,value:r}),this.$emit("option-unselect",{originalEvent:e,value:r}),this.dirty=!0,P(this.multiple?this.$refs.focusInput:this.$refs.focusInput.$el)},changeFocusedOptionIndex:function(e,n){this.focusedOptionIndex!==n&&(this.focusedOptionIndex=n,this.scrollInView(),this.selectOnFocus&&this.onOptionSelect(e,this.visibleOptions[n],!1))},scrollInView:function(){var e=this,n=arguments.length>0&&arguments[0]!==void 0?arguments[0]:-1;this.$nextTick(function(){var o=n!==-1?"".concat(e.$id,"_").concat(n):e.focusedOptionId,r=De(e.list,'li[id="'.concat(o,'"]'));r?r.scrollIntoView&&r.scrollIntoView({block:"nearest",inline:"start"}):e.virtualScrollerDisabled||e.virtualScroller&&e.virtualScroller.scrollToIndex(n!==-1?n:e.focusedOptionIndex)})},autoUpdateModel:function(){this.selectOnFocus&&this.autoOptionFocus&&!this.$filled&&(this.focusedOptionIndex=this.findFirstFocusedOptionIndex(),this.onOptionSelect(null,this.visibleOptions[this.focusedOptionIndex],!1))},updateModel:function(e,n){this.writeValue(n,e),this.$emit("change",{originalEvent:e,value:n})},flatOptions:function(e){var n=this;return(e||[]).reduce(function(o,r,i){o.push({optionGroup:r,group:!0,index:i});var g=n.getOptionGroupChildren(r);return g&&g.forEach(function(u){return o.push(u)}),o},[])},overlayRef:function(e){this.overlay=e},listRef:function(e,n){this.list=e,n&&n(e)},virtualScrollerRef:function(e){this.virtualScroller=e},findNextSelectedOptionIndex:function(e){var n=this,o=this.$filled&&e<this.visibleOptions.length-1?this.visibleOptions.slice(e+1).findIndex(function(r){return n.isValidSelectedOption(r)}):-1;return o>-1?o+e+1:-1},findPrevSelectedOptionIndex:function(e){var n=this,o=this.$filled&&e>0?ne(this.visibleOptions.slice(0,e),function(r){return n.isValidSelectedOption(r)}):-1;return o>-1?o:-1},findNearestSelectedOptionIndex:function(e){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1,o=-1;return this.$filled&&(n?(o=this.findPrevSelectedOptionIndex(e),o=o===-1?this.findNextSelectedOptionIndex(e):o):(o=this.findNextSelectedOptionIndex(e),o=o===-1?this.findPrevSelectedOptionIndex(e):o)),o>-1?o:e}},computed:{visibleOptions:function(){return this.optionGroupLabel?this.flatOptions(this.suggestions):this.suggestions||[]},inputValue:function(){if(this.$filled)if(R(this.d_value)==="object"){var e=this.getOptionLabel(this.d_value);return e??this.d_value}else return this.d_value;else return""},hasSelectedOption:function(){return this.$filled},equalityKey:function(){return this.dataKey},searchResultMessageText:function(){return Q(this.visibleOptions)&&this.overlayVisible?this.searchMessageText.replaceAll("{0}",this.visibleOptions.length):this.emptySearchMessageText},searchMessageText:function(){return this.searchMessage||this.$primevue.config.locale.searchMessage||""},emptySearchMessageText:function(){return this.emptySearchMessage||this.$primevue.config.locale.emptySearchMessage||""},selectionMessageText:function(){return this.selectionMessage||this.$primevue.config.locale.selectionMessage||""},emptySelectionMessageText:function(){return this.emptySelectionMessage||this.$primevue.config.locale.emptySelectionMessage||""},selectedMessageText:function(){return this.$filled?this.selectionMessageText.replaceAll("{0}",this.multiple?this.d_value.length:"1"):this.emptySelectionMessageText},listAriaLabel:function(){return this.$primevue.config.locale.aria?this.$primevue.config.locale.aria.listLabel:void 0},focusedOptionId:function(){return this.focusedOptionIndex!==-1?"".concat(this.$id,"_").concat(this.focusedOptionIndex):null},focusedMultipleOptionId:function(){return this.focusedMultipleOptionIndex!==-1?"".concat(this.$id,"_multiple_option_").concat(this.focusedMultipleOptionIndex):null},isClearIconVisible:function(){return this.showClear&&this.$filled&&!this.disabled&&!this.loading},ariaSetSize:function(){var e=this;return this.visibleOptions.filter(function(n){return!e.isOptionGroup(n)}).length},virtualScrollerDisabled:function(){return!this.virtualScrollerOptions},panelId:function(){return this.$id+"_panel"},containerDataP:function(){return _({fluid:this.$fluid})},overlayDataP:function(){return _(de({},"portal-"+this.appendTo,"portal-"+this.appendTo))},inputMultipleDataP:function(){return _(de({invalid:this.$invalid,disabled:this.disabled,focus:this.focused,fluid:this.$fluid,filled:this.$variant==="filled",empty:!this.$filled},this.size,this.size))}},components:{InputText:ke,VirtualScroller:Ge,Portal:Te,Chip:me,ChevronDownIcon:Ne,SpinnerIcon:we,TimesIcon:Le},directives:{ripple:Me}};function N(t){"@babel/helpers - typeof";return N=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(e){return typeof e}:function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},N(t)}function ue(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);e&&(o=o.filter(function(r){return Object.getOwnPropertyDescriptor(t,r).enumerable})),n.push.apply(n,o)}return n}function ce(t){for(var e=1;e<arguments.length;e++){var n=arguments[e]!=null?arguments[e]:{};e%2?ue(Object(n),!0).forEach(function(o){It(t,o,n[o])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):ue(Object(n)).forEach(function(o){Object.defineProperty(t,o,Object.getOwnPropertyDescriptor(n,o))})}return t}function It(t,e,n){return(e=St(e))in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function St(t){var e=Ct(t,"string");return N(e)=="symbol"?e:e+""}function Ct(t,e){if(N(t)!="object"||!t)return t;var n=t[Symbol.toPrimitive];if(n!==void 0){var o=n.call(t,e);if(N(o)!="object")return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}var Mt=["data-p"],Lt=["aria-activedescendant","data-p-has-dropdown","data-p"],Tt=["id","aria-label","aria-setsize","aria-posinset"],Dt=["id","placeholder","tabindex","disabled","aria-label","aria-labelledby","aria-expanded","aria-controls","aria-activedescendant","aria-invalid"],Kt=["data-p-has-dropdown"],Vt=["disabled","aria-expanded","aria-controls"],Ft=["id","data-p"],Pt=["id","aria-label"],At=["id"],Et=["id","aria-label","aria-selected","aria-disabled","aria-setsize","aria-posinset","onClick","onMousemove","data-p-selected","data-p-focused","data-p-disabled"];function Bt(t,e,n,o,r,i){var g=E("InputText"),u=E("TimesIcon"),d=E("Chip"),V=E("SpinnerIcon"),Z=E("VirtualScroller"),G=E("Portal"),ee=Re("ripple");return c(),m("div",f({ref:"container",class:t.cx("root"),style:t.sx("root"),onClick:e[11]||(e[11]=function(){return i.onContainerClick&&i.onContainerClick.apply(i,arguments)}),"data-p":i.containerDataP},t.ptmi("root")),[t.multiple?v("",!0):(c(),j(g,{key:0,ref:"focusInput",id:t.inputId,type:"text",name:t.$formName,class:L([t.cx("pcInputText"),t.inputClass]),style:$e(t.inputStyle),defaultValue:i.inputValue,placeholder:t.placeholder,tabindex:t.disabled?-1:t.tabindex,fluid:t.$fluid,disabled:t.disabled,size:t.size,invalid:t.invalid,variant:t.variant,autocomplete:"off",role:"combobox","aria-label":t.ariaLabel,"aria-labelledby":t.ariaLabelledby,"aria-haspopup":"listbox","aria-autocomplete":"list","aria-expanded":r.overlayVisible,"aria-controls":r.overlayVisible?i.panelId:void 0,"aria-activedescendant":r.focused?i.focusedOptionId:void 0,onFocus:i.onFocus,onBlur:i.onBlur,onKeydown:i.onKeyDown,onInput:i.onInput,onChange:i.onChange,unstyled:t.unstyled,"data-p-has-dropdown":t.dropdown,pt:t.ptm("pcInputText")},null,8,["id","name","class","style","defaultValue","placeholder","tabindex","fluid","disabled","size","invalid","variant","aria-label","aria-labelledby","aria-expanded","aria-controls","aria-activedescendant","onFocus","onBlur","onKeydown","onInput","onChange","unstyled","data-p-has-dropdown","pt"])),i.isClearIconVisible?I(t.$slots,"clearicon",{key:1,class:L(t.cx("clearIcon")),clearCallback:i.onClearClick},function(){return[O(u,f({class:[t.cx("clearIcon")],onClick:i.onClearClick},t.ptm("clearIcon")),null,16,["class","onClick"])]}):v("",!0),t.multiple?(c(),m("ul",f({key:2,ref:"multiContainer",class:t.cx("inputMultiple"),tabindex:"-1",role:"listbox","aria-orientation":"horizontal","aria-activedescendant":r.focused?i.focusedMultipleOptionId:void 0,onFocus:e[5]||(e[5]=function(){return i.onMultipleContainerFocus&&i.onMultipleContainerFocus.apply(i,arguments)}),onBlur:e[6]||(e[6]=function(){return i.onMultipleContainerBlur&&i.onMultipleContainerBlur.apply(i,arguments)}),onKeydown:e[7]||(e[7]=function(){return i.onMultipleContainerKeyDown&&i.onMultipleContainerKeyDown.apply(i,arguments)}),"data-p-has-dropdown":t.dropdown,"data-p":i.inputMultipleDataP},t.ptm("inputMultiple")),[(c(!0),m(B,null,U(t.d_value,function(x,y){return c(),m("li",f({key:"".concat(y,"_").concat(i.getOptionLabel(x)),id:t.$id+"_multiple_option_"+y,class:t.cx("chipItem",{i:y}),role:"option","aria-label":i.getOptionLabel(x),"aria-selected":!0,"aria-setsize":t.d_value.length,"aria-posinset":y+1},{ref_for:!0},t.ptm("chipItem")),[I(t.$slots,"chip",f({class:t.cx("pcChip"),value:x,index:y,removeCallback:function(w){return i.removeOption(w,y)}},{ref_for:!0},t.ptm("pcChip")),function(){return[O(d,{class:L(t.cx("pcChip")),label:i.getOptionLabel(x),removeIcon:t.chipIcon||t.removeTokenIcon,removable:"",unstyled:t.unstyled,onRemove:function(w){return i.removeOption(w,y)},"data-p-focused":r.focusedMultipleOptionIndex===y,pt:t.ptm("pcChip")},{removeicon:K(function(){return[I(t.$slots,t.$slots.chipicon?"chipicon":"removetokenicon",{class:L(t.cx("chipIcon")),index:y,removeCallback:function(w){return i.removeOption(w,y)}})]}),_:2},1032,["class","label","removeIcon","unstyled","onRemove","data-p-focused","pt"])]})],16,Tt)}),128)),a("li",f({class:t.cx("inputChip"),role:"option"},t.ptm("inputChip")),[a("input",f({ref:"focusInput",id:t.inputId,type:"text",style:t.inputStyle,class:t.inputClass,placeholder:t.placeholder,tabindex:t.disabled?-1:t.tabindex,disabled:t.disabled,autocomplete:"off",role:"combobox","aria-label":t.ariaLabel,"aria-labelledby":t.ariaLabelledby,"aria-haspopup":"listbox","aria-autocomplete":"list","aria-expanded":r.overlayVisible,"aria-controls":t.$id+"_list","aria-activedescendant":r.focused?i.focusedOptionId:void 0,"aria-invalid":t.invalid||void 0,onFocus:e[0]||(e[0]=function(){return i.onFocus&&i.onFocus.apply(i,arguments)}),onBlur:e[1]||(e[1]=function(){return i.onBlur&&i.onBlur.apply(i,arguments)}),onKeydown:e[2]||(e[2]=function(){return i.onKeyDown&&i.onKeyDown.apply(i,arguments)}),onInput:e[3]||(e[3]=function(){return i.onInput&&i.onInput.apply(i,arguments)}),onChange:e[4]||(e[4]=function(){return i.onChange&&i.onChange.apply(i,arguments)})},t.ptm("input")),null,16,Dt)],16)],16,Lt)):v("",!0),r.searching||t.loading?I(t.$slots,t.$slots.loader?"loader":"loadingicon",{key:3,class:L(t.cx("loader"))},function(){return[t.loader||t.loadingIcon?(c(),m("i",f({key:0,class:["pi-spin",t.cx("loader"),t.loader,t.loadingIcon],"aria-hidden":"true","data-p-has-dropdown":t.dropdown},t.ptm("loader")),null,16,Kt)):t.loading?(c(),j(V,f({key:1,class:t.cx("loader"),spin:"","aria-hidden":"true","data-p-has-dropdown":t.dropdown},t.ptm("loader")),null,16,["class","data-p-has-dropdown"])):v("",!0)]}):v("",!0),I(t.$slots,t.$slots.dropdown?"dropdown":"dropdownbutton",{toggleCallback:function(y){return i.onDropdownClick(y)}},function(){return[t.dropdown?(c(),m("button",f({key:0,ref:"dropdownButton",type:"button",class:[t.cx("dropdown"),t.dropdownClass],disabled:t.disabled,"aria-haspopup":"listbox","aria-expanded":r.overlayVisible,"aria-controls":i.panelId,onClick:e[8]||(e[8]=function(){return i.onDropdownClick&&i.onDropdownClick.apply(i,arguments)})},t.ptm("dropdown")),[I(t.$slots,"dropdownicon",{class:L(t.dropdownIcon)},function(){return[(c(),j(oe(t.dropdownIcon?"span":"ChevronDownIcon"),f({class:t.dropdownIcon},t.ptm("dropdownIcon")),null,16,["class"]))]})],16,Vt)):v("",!0)]}),t.typeahead?(c(),m("span",f({key:4,role:"status","aria-live":"polite",class:"p-hidden-accessible"},t.ptm("hiddenSearchResult"),{"data-p-hidden-accessible":!0}),h(i.searchResultMessageText),17)):v("",!0),O(G,{appendTo:t.appendTo},{default:K(function(){return[O(ze,f({name:"p-anchored-overlay",onEnter:i.onOverlayEnter,onAfterEnter:i.onOverlayAfterEnter,onLeave:i.onOverlayLeave,onAfterLeave:i.onOverlayAfterLeave},t.ptm("transition")),{default:K(function(){return[r.overlayVisible?(c(),m("div",f({key:0,ref:i.overlayRef,id:i.panelId,class:[t.cx("overlay"),t.panelClass,t.overlayClass],style:ce(ce({},t.panelStyle),t.overlayStyle),onClick:e[9]||(e[9]=function(){return i.onOverlayClick&&i.onOverlayClick.apply(i,arguments)}),onKeydown:e[10]||(e[10]=function(){return i.onOverlayKeyDown&&i.onOverlayKeyDown.apply(i,arguments)}),"data-p":i.overlayDataP},t.ptm("overlay")),[I(t.$slots,"header",{value:t.d_value,suggestions:i.visibleOptions}),a("div",f({class:t.cx("listContainer"),style:{"max-height":i.virtualScrollerDisabled?t.scrollHeight:""}},t.ptm("listContainer")),[O(Z,f({ref:i.virtualScrollerRef},t.virtualScrollerOptions,{style:{height:t.scrollHeight},items:i.visibleOptions,tabindex:-1,disabled:i.virtualScrollerDisabled,pt:t.ptm("virtualScroller")}),_e({content:K(function(x){var y=x.styleClass,A=x.contentRef,w=x.items,C=x.getItemOptions,H=x.contentStyle,k=x.itemSize;return[a("ul",f({ref:function(S){return i.listRef(S,A)},id:t.$id+"_list",class:[t.cx("list"),y],style:H,role:"listbox","aria-label":i.listAriaLabel},t.ptm("list")),[(c(!0),m(B,null,U(w,function(b,S){return c(),m(B,{key:i.getOptionRenderKey(b,i.getOptionIndex(S,C))},[i.isOptionGroup(b)?(c(),m("li",f({key:0,id:t.$id+"_"+i.getOptionIndex(S,C),style:{height:k?k+"px":void 0},class:t.cx("optionGroup"),role:"option"},{ref_for:!0},t.ptm("optionGroup")),[I(t.$slots,"optiongroup",{option:b.optionGroup,index:i.getOptionIndex(S,C)},function(){return[W(h(i.getOptionGroupLabel(b.optionGroup)),1)]})],16,At)):je((c(),m("li",f({key:1,id:t.$id+"_"+i.getOptionIndex(S,C),style:{height:k?k+"px":void 0},class:t.cx("option",{option:b,i:S,getItemOptions:C}),role:"option","aria-label":i.getOptionLabel(b),"aria-selected":i.isSelected(b),"aria-disabled":i.isOptionDisabled(b),"aria-setsize":i.ariaSetSize,"aria-posinset":i.getAriaPosInset(i.getOptionIndex(S,C)),onClick:function(F){return i.onOptionSelect(F,b)},onMousemove:function(F){return i.onOptionMouseMove(F,i.getOptionIndex(S,C))},"data-p-selected":i.isSelected(b),"data-p-focused":r.focusedOptionIndex===i.getOptionIndex(S,C),"data-p-disabled":i.isOptionDisabled(b)},{ref_for:!0},i.getPTOptions(b,C,S,"option")),[I(t.$slots,"option",{option:b,index:i.getOptionIndex(S,C)},function(){return[W(h(i.getOptionLabel(b)),1)]})],16,Et)),[[ee]])],64)}),128)),t.showEmptyMessage&&(!w||w&&w.length===0)?(c(),m("li",f({key:0,class:t.cx("emptyMessage"),role:"option"},t.ptm("emptyMessage")),[I(t.$slots,"empty",{},function(){return[W(h(i.searchResultMessageText),1)]})],16)):v("",!0)],16,Pt)]}),_:2},[t.$slots.loader?{name:"loader",fn:K(function(x){var y=x.options;return[I(t.$slots,"loader",{options:y})]}),key:"0"}:void 0]),1040,["style","items","disabled","pt"])],16),I(t.$slots,"footer",{value:t.d_value,suggestions:i.visibleOptions}),a("span",f({role:"status","aria-live":"polite",class:"p-hidden-accessible"},t.ptm("hiddenSelectedMessage"),{"data-p-hidden-accessible":!0}),h(i.selectedMessageText),17)],16,Ft)):v("",!0)]}),_:3},16,["onEnter","onAfterEnter","onLeave","onAfterLeave"])]}),_:3},8,["appendTo"])],16,Mt)}ge.render=Bt;async function Rt(t,e){if(!t||t.trim().length<1)return[];const o=`https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(t.trim())}&quotesCount=20&newsCount=0`,r=`https://api.allorigins.win/get?url=${encodeURIComponent(o)}`;try{const i=await he.get(r);if(!i.data||!i.data.contents)return[];const g=JSON.parse(i.data.contents);return g.quotes&&Array.isArray(g.quotes)?g.quotes.filter(u=>u.quoteType==="EQUITY"||u.quoteType==="ETF").filter(u=>e==="TW"?u.symbol.endsWith(".TW")||u.symbol.endsWith(".TWO")||u.exchange==="TAI"||u.exchange==="TWO":e==="US"?!u.symbol.includes("."):!0).map(u=>({symbol:u.symbol,name:u.shortname||u.longname||u.symbol,exch:u.exchDisp||u.exchange||""})):[]}catch(i){return console.error("[stockApi] Search error:",i),[]}}async function be(t){var r,i;let e=t.trim().toUpperCase();/^\d{4}$/.test(e)&&(e+=".TW");const n=`https://query1.finance.yahoo.com/v8/finance/chart/${e}`,o=`https://api.allorigins.win/get?url=${encodeURIComponent(n)}`;try{const g=await he.get(o);if(!g.data||!g.data.contents)return console.warn(`[stockApi] Network response was empty for ${e}`),null;const u=JSON.parse(g.data.contents),d=(i=(r=u==null?void 0:u.chart)==null?void 0:r.result)==null?void 0:i[0];return d&&d.meta&&d.meta.regularMarketPrice?d.meta.regularMarketPrice:null}catch(g){return console.error(`[stockApi] Error fetching price for ${e}:`,g),null}}async function $t(t){const e={},n=t.map(async o=>{const r=await be(o);r!==null&&(e[o]=r)});return await Promise.allSettled(n),e}const zt={class:"max-w-5xl mx-auto px-4 pt-4 sm:pt-6 pb-24 relative"},_t={class:"flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4 sticky top-0 lg:top-[80px] z-[50] bg-[var(--app-bg)]/95 backdrop-blur-md py-3 -mx-4 px-4 sm:mx-0 sm:px-4 sm:py-4 sm:rounded-b-2xl transition-all"},jt={class:"flex items-center gap-3"},Ut={class:"flex items-center gap-3 bg-[var(--surface)] px-4 py-2 rounded-xl shadow-sm border border-[var(--line-soft)]"},Wt={class:"grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"},Nt={class:"apollo-card flex flex-col justify-between h-[130px]"},Gt={class:"flex justify-between items-start"},Ht={class:"flex flex-col gap-1.5"},qt={class:"text-[26px] font-black tabular-nums tracking-tight text-[var(--text-main)]"},Jt={class:"apollo-card flex flex-col justify-between h-[130px]"},Xt={class:"flex justify-between items-start"},Yt={class:"flex flex-col gap-1.5"},Qt={class:"grid grid-cols-1 lg:grid-cols-2 gap-8"},Zt={key:0},en={class:"flex flex-col gap-3"},tn=["onClick"],nn={class:"flex items-center gap-3 min-w-0 mb-3 sm:mb-0"},on={class:"w-10 h-10 rounded-[12px] flex items-center justify-center text-white text-[16px] font-black shrink-0 shadow-sm bg-blue-600"},ln={class:"flex flex-col min-w-0"},sn={class:"text-[14px] sm:text-[15px] font-bold text-[var(--text-main)] truncate max-w-[150px]"},an={class:"text-[11px] sm:text-[13px] text-[var(--text-sub)] font-semibold mt-0.5"},rn={key:0,class:"text-orange-500 ml-1"},dn={class:"flex flex-col items-end shrink-0 ml-2"},un={class:"text-[15px] sm:text-[18px] font-black tabular-nums text-[var(--text-main)]"},cn={key:1},pn={class:"flex flex-col gap-3"},hn=["onClick"],fn={class:"flex items-center gap-3 min-w-0 mb-3 sm:mb-0"},mn={class:"w-10 h-10 rounded-[12px] flex items-center justify-center text-white text-[16px] font-black shrink-0 shadow-sm bg-purple-600"},gn={class:"flex flex-col min-w-0"},bn={class:"text-[14px] sm:text-[15px] font-bold text-[var(--text-main)] truncate max-w-[150px]"},vn={class:"text-[11px] sm:text-[13px] text-[var(--text-sub)] font-semibold mt-0.5"},yn={key:0,class:"text-orange-500 ml-1"},wn={class:"flex flex-col items-end shrink-0 ml-2"},xn={class:"text-[15px] sm:text-[18px] font-black tabular-nums text-[var(--text-main)]"},On={class:"flex flex-col gap-1.5"},kn={class:"flex bg-slate-100 p-1 rounded-lg border border-slate-200"},In=["onClick"],Sn={class:"flex flex-col gap-5 pt-2"},Cn={class:"flex flex-col gap-1.5 relative"},Mn={class:"relative w-full"},Ln={class:"flex flex-col gap-0.5 max-w-full min-w-0 pr-2"},Tn={class:"flex justify-between items-center w-full gap-2 min-w-0"},Dn={class:"font-bold text-sm truncate shrink min-w-0"},Kn={class:"text-[10px] text-slate-500 font-medium shrink-0 bg-slate-100 px-1.5 py-0.5 rounded"},Vn={class:"text-[11px] text-slate-400 font-mono truncate"},Fn={key:0,class:"pi pi-spinner animate-spin absolute right-3 top-[18px] -translate-y-[18px] text-gray-400"},Pn={class:"grid grid-cols-2 gap-4"},An={class:"flex flex-col gap-1.5"},En={class:"flex flex-col gap-1.5"},Bn={class:"text-[13px] font-bold text-[var(--text-sub)]"},Rn={class:"grid grid-cols-2 gap-4"},$n={class:"flex flex-col gap-1.5"},zn={class:"text-[13px] font-bold text-[var(--text-sub)]"},_n={class:"flex flex-col gap-1.5"},jn={class:"text-[13px] font-bold text-[var(--text-sub)]"},Un={class:"bg-gray-50 border border-gray-200 rounded-lg px-3 py-[9px] w-full text-right font-bold text-gray-700 select-none"},Wn={key:0,class:"flex flex-col gap-1.5 bg-orange-50/50 p-3 rounded-lg border border-orange-100"},Nn={class:"flex justify-end gap-2 pt-4"},pe=32,Qn=Ue({__name:"InvestmentsPage",setup(t){const e=D(!0),n=D([...Je]),o=D(!1),r=D(!1),i=D(!1),g=D(!1),u=D([]),d=D({id:"",symbol:"",market:"TW",name:"",shares:null,loaned_shares:null,cost_basis:null,current_price:null,currency:"TWD"});let V=null;async function Z(p){const s=p.query;V&&clearTimeout(V),V=setTimeout(async()=>{const l=await Rt(s,d.value.market);u.value=l},500)}const G=[{label:"台股 (TW)",value:"TW",currency:"TWD"},{label:"美股 (US)",value:"US",currency:"USD"}];function ee(){r.value=!1,i.value=!1,d.value={id:"inv-"+Date.now(),symbol:"",market:"TW",name:"",shares:null,loaned_shares:null,cost_basis:null,current_price:null,currency:"TWD"},o.value=!0}function x(p){r.value=!0,i.value=(p.loaned_shares||0)>0,d.value={...p,symbol:{symbol:p.symbol,name:p.name}},o.value=!0}function y(){const p=G.find(s=>s.value===d.value.market);p&&(d.value.currency=p.currency),d.value.symbol="",d.value.name="",d.value.shares=null,d.value.loaned_shares=null,d.value.cost_basis=null,d.value.current_price=null,i.value=!1,u.value=[]}function A(){const p=d.value.shares||0;if((d.value.loaned_shares||0)>p){alert("借出股數不能大於持有股數");return}let l="",T="";typeof d.value.symbol=="object"&&d.value.symbol!==null?(l=d.value.symbol.symbol,T=d.value.symbol.name):l=d.value.symbol;const te={...d.value,symbol:l,name:T||l};if(r.value){const re=n.value.findIndex(ye=>ye.id===te.id);re!==-1&&(n.value[re]=te)}else n.value.push(te);o.value=!1}const w=(p,s="TWD")=>new Intl.NumberFormat(s==="TWD"?"zh-TW":"en-US",{style:"currency",currency:s,maximumFractionDigits:s==="TWD"?0:2}).format(p),C=X(()=>n.value.filter(p=>p.market==="TW")),H=X(()=>n.value.filter(p=>p.market==="US"));function k(p){const s=p.shares||0,l=p.loaned_shares||0;return(e.value?s:s-l)*(p.current_price||0)}function b(p){const s=p.shares||0,l=p.loaned_shares||0;return(e.value?s:s-l)*(p.cost_basis||0)}const S=X(()=>n.value.reduce((p,s)=>{let l=k(s);return s.currency==="USD"&&(l*=pe),p+l},0)),$=X(()=>n.value.reduce((p,s)=>{let l=k(s)-b(s);return s.currency==="USD"&&(l*=pe),p+l},0)),F=D(!1);async function ae(){F.value=!0;try{const p=n.value.map(l=>l.symbol),s=await $t(p);n.value.forEach(l=>{s[l.symbol]!==void 0&&(l.current_price=s[l.symbol])})}finally{F.value=!1}}async function ve(p){const s=p.value;if(!s||!s.symbol)return;const l=s.symbol.trim();l.endsWith(".TW")||/^\d{4}$/.test(l)?(d.value.market="TW",d.value.currency="TWD"):(d.value.market="US",d.value.currency="USD"),g.value=!0;try{const T=await be(l);T!==null&&(d.value.current_price=T)}finally{g.value=!1}}return We(()=>{ae()}),(p,s)=>(c(),m("div",zt,[a("div",_t,[a("div",jt,[s[14]||(s[14]=a("h1",{class:"text-2xl font-bold text-[var(--text-main)] m-0"},"投資組合",-1)),O(M(q),{icon:"pi pi-sync",rounded:"",text:"",class:L(["!w-8 !h-8 text-[var(--text-sub)] hover:bg-[var(--line-soft)]",{"animate-spin":F.value}]),onClick:ae,title:"更新最新報價"},null,8,["class"]),O(M(q),{icon:"pi pi-plus",rounded:"",text:"",class:"!w-8 !h-8 text-[var(--text-sub)] hover:bg-[var(--line-soft)]",onClick:ee,title:"新增投資"})]),a("div",Ut,[s[15]||(s[15]=a("span",{class:"text-sm font-semibold text-[var(--text-sub)]"},"包含借券金額",-1)),O(M(fe),{modelValue:e.value,"onUpdate:modelValue":s[0]||(s[0]=l=>e.value=l)},null,8,["modelValue"])])]),a("div",Wt,[a("div",Nt,[a("div",Gt,[a("div",Ht,[s[16]||(s[16]=a("span",{class:"text-[13px] font-bold text-[var(--text-main)]"},"總投資現值 (TWD)",-1)),a("span",qt,h(w(S.value,"TWD")),1)]),s[17]||(s[17]=a("div",{class:"w-10 h-10 rounded-xl bg-[var(--primary-soft)] flex items-center justify-center text-[var(--primary)]"},[a("i",{class:"pi pi-chart-line text-lg"})],-1))])]),a("div",Jt,[a("div",Xt,[a("div",Yt,[s[18]||(s[18]=a("span",{class:"text-[13px] font-bold text-[var(--text-main)]"},"未實現損益 (TWD)",-1)),a("span",{class:L(["text-[26px] font-black tabular-nums tracking-tight",$.value>=0?"text-[var(--positive)]":"text-[var(--negative)]"])},h($.value>=0?"+":"")+h(w($.value,"TWD")),3)]),s[19]||(s[19]=a("div",{class:"w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500"},[a("i",{class:"pi pi-dollar text-lg"})],-1))])])]),a("div",Qt,[C.value.length?(c(),m("section",Zt,[s[20]||(s[20]=a("div",{class:"flex items-center gap-2 mb-4 px-1"},[a("div",{class:"w-1.5 h-5 bg-blue-500 rounded-full"}),a("h2",{class:"text-lg font-bold text-[var(--text-main)] m-0"}," 台股 (TW) ")],-1)),a("div",en,[(c(!0),m(B,null,U(C.value,l=>(c(),m("div",{key:l.id,class:"apollo-card !p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between cursor-pointer hover:-translate-y-[1px] hover:border-[var(--primary)] transition-all",onClick:T=>x(l)},[a("div",nn,[a("div",on,h(l.symbol.charAt(0)),1),a("div",ln,[a("span",sn,h(l.name||l.symbol),1),a("span",an,[W(h(l.shares)+" 股 ",1),(l.loaned_shares||0)>0?(c(),m("span",rn,"(借出 "+h(l.loaned_shares)+")",1)):v("",!0)])])]),a("div",dn,[a("span",un,h(w(k(l),l.currency)),1),a("span",{class:L(["text-[12px] sm:text-[13px] font-bold tabular-nums",k(l)-b(l)>=0?"text-[var(--positive)]":"text-[var(--negative)]"])},h(k(l)-b(l)>0?"+":"")+h(w(k(l)-b(l),l.currency)),3)])],8,tn))),128))])])):v("",!0),H.value.length?(c(),m("section",cn,[s[21]||(s[21]=a("div",{class:"flex items-center gap-2 mb-4 px-1"},[a("div",{class:"w-1.5 h-5 bg-purple-500 rounded-full"}),a("h2",{class:"text-lg font-bold text-[var(--text-main)] m-0"}," 美股 (US) ")],-1)),a("div",pn,[(c(!0),m(B,null,U(H.value,l=>(c(),m("div",{key:l.id,class:"apollo-card !p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between cursor-pointer hover:-translate-y-[1px] hover:border-[var(--primary)] transition-all",onClick:T=>x(l)},[a("div",fn,[a("div",mn,h(l.symbol.charAt(0)),1),a("div",gn,[a("span",bn,h(l.name||l.symbol),1),a("span",vn,[W(h(l.shares)+" 股 ",1),(l.loaned_shares||0)>0?(c(),m("span",yn,"(借出 "+h(l.loaned_shares)+")",1)):v("",!0)])])]),a("div",wn,[a("span",xn,h(w(k(l),l.currency)),1),a("span",{class:L(["text-[12px] sm:text-[13px] font-bold tabular-nums",k(l)-b(l)>=0?"text-[var(--positive)]":"text-[var(--negative)]"])},h(k(l)-b(l)>0?"+":"")+h(w(k(l)-b(l),l.currency)),3)])],8,hn))),128))])])):v("",!0)]),O(M(xe),{visible:o.value,"onUpdate:visible":s[13]||(s[13]=l=>o.value=l),header:r.value?"編輯投資":"新增投資",modal:"",draggable:!1,style:{width:"90vw",maxWidth:"400px"}},{footer:K(()=>[a("div",Nn,[O(M(q),{label:"取消",severity:"secondary",text:"",onClick:s[12]||(s[12]=l=>o.value=!1)}),O(M(q),{label:"儲存",severity:"primary",onClick:A})])]),default:K(()=>[a("div",On,[a("div",kn,[(c(),m(B,null,U(G,l=>a("button",{key:l.value,type:"button",class:L(["flex-1 py-1.5 text-[13px] font-bold rounded-md transition-all",d.value.market===l.value?"bg-white text-[var(--primary)] shadow-sm":"text-slate-500 hover:text-slate-700"]),onClick:T=>{d.value.market=l.value,y()}},h(l.label),11,In)),64))])]),a("div",Sn,[a("div",Cn,[s[22]||(s[22]=a("label",{class:"text-[13px] font-bold text-[var(--text-sub)]"},"股票名稱或代號",-1)),a("div",Mn,[O(M(ge),{modelValue:d.value.symbol,"onUpdate:modelValue":s[1]||(s[1]=l=>d.value.symbol=l),suggestions:u.value,onComplete:Z,onItemSelect:ve,optionLabel:"symbol",placeholder:"e.g. AAPL / 0050 / 台積電",inputClass:"w-full !rounded-lg pr-8",class:"w-full",appendTo:"body",pt:{panel:{class:"w-full !max-w-[360px] overflow-hidden"}},emptyMessage:"找不到符合的項目"},{option:K(l=>[a("div",Ln,[a("div",Tn,[a("span",Dn,h(l.option.name),1),a("span",Kn,h(l.option.exch),1)]),a("span",Vn,h(l.option.symbol),1)])]),_:1},8,["modelValue","suggestions"]),g.value?(c(),m("i",Fn)):v("",!0)])]),a("div",Pn,[a("div",An,[s[23]||(s[23]=a("label",{class:"text-[13px] font-bold text-[var(--text-sub)]"},"股數",-1)),O(M(J),{modelValue:d.value.shares,"onUpdate:modelValue":s[2]||(s[2]=l=>d.value.shares=l),class:"w-full",inputClass:"w-full !rounded-lg",minFractionDigits:0,maxFractionDigits:4,placeholder:"0",onFocus:s[3]||(s[3]=l=>d.value.shares===0?d.value.shares=null:null),onBlur:s[4]||(s[4]=l=>d.value.shares===null?d.value.shares=0:null)},null,8,["modelValue"])]),a("div",En,[a("label",Bn,"成本 ("+h(d.value.currency)+")",1),O(M(J),{modelValue:d.value.cost_basis,"onUpdate:modelValue":s[5]||(s[5]=l=>d.value.cost_basis=l),class:"w-full",inputClass:"w-full !rounded-lg",minFractionDigits:0,maxFractionDigits:4,placeholder:"0",onFocus:s[6]||(s[6]=l=>d.value.cost_basis===0?d.value.cost_basis=null:null),onBlur:s[7]||(s[7]=l=>d.value.cost_basis===null?d.value.cost_basis=0:null)},null,8,["modelValue"])])]),a("div",Rn,[a("div",$n,[a("label",zn,"目前市價 ("+h(d.value.currency)+")",1),O(M(J),{modelValue:d.value.current_price,"onUpdate:modelValue":s[8]||(s[8]=l=>d.value.current_price=l),class:"w-full",inputClass:"w-full !rounded-lg bg-gray-50 text-gray-500 border-gray-200",minFractionDigits:0,maxFractionDigits:4,disabled:""},null,8,["modelValue"])]),a("div",_n,[a("label",jn,"現在市值 ("+h(d.value.currency)+")",1),a("div",Un,h(w((d.value.shares||0)*(d.value.current_price||0),d.value.currency)),1)])]),i.value?(c(),m("div",Wn,[s[24]||(s[24]=a("label",{class:"text-[13px] font-bold text-orange-700"},"已借出股數",-1)),O(M(J),{modelValue:d.value.loaned_shares,"onUpdate:modelValue":s[9]||(s[9]=l=>d.value.loaned_shares=l),class:"w-full",inputClass:"w-full !rounded-lg !border-orange-200 focus:!border-orange-400",minFractionDigits:0,maxFractionDigits:0,placeholder:"0",onFocus:s[10]||(s[10]=l=>d.value.loaned_shares===0?d.value.loaned_shares=null:null),onBlur:s[11]||(s[11]=l=>d.value.loaned_shares===null?d.value.loaned_shares=0:null)},null,8,["modelValue"])])):v("",!0)])]),_:1},8,["visible","header"])]))}});export{Qn as default};
