/*! (c) Philipp König under GPL-3.0 */
"use strict";!function(o){window.ModelHelper=function(o){var e=this,t={u:{openStates:{},hiddenEntries:{},scrollPos:{},entriesLocked:!1,sort:{name:"custom",dir:"ASC"},mostViewedPerMonth:!1,viewAsTree:!0},b:{pxTolerance:{windowed:20,maximized:1},openAction:"mousedown",newTab:"foreground",linkAction:"current",preventPageScroll:!1,dirAccordion:!1,rememberState:"all",rememberSearch:!0,dirOpenDuration:.5,openDelay:0,closeTimeout:1,initialOpenOnNewTab:!0},a:{sidebarPosition:"left",language:"default",showIndicator:!0,showIndicatorIcon:!0,showBookmarkIcons:!0,styles:{colorScheme:"rgb(27,130,241)",textColor:"rgb(102,102,102)",indicatorWidth:"40px",indicatorIconSize:"32px",indicatorIconColor:"rgb(255,255,255)",indicatorColor:"rgba(0,0,0,0.5)",sidebarWidth:"350px",sidebarMaskColor:"rgba(255,255,255,0.8)",bookmarksFontSize:"14px",bookmarksIconSize:"16px",bookmarksLineHeight:"40px",bookmarksDirIcon:"dir-1",bookmarksDirColor:"rgb(102,102,102)",bookmarksDirIndentation:"25px",bookmarksHorizontalPadding:"16px",overlayMaskColor:"rgba(0,0,0,0.5)",fontFamily:"default"}}},i={};this.init=function(o){var e=["utility","behaviour","appearance"];chrome.storage.sync.get(e,function(t){i=t,e.forEach(function(o){void 0===i[o]&&(i[o]={})}),"function"==typeof o&&o()})},this.getData=function(e){var n=e;"string"==typeof n&&(n=[n]);var r={};if(n.forEach(function(e){var n=e.split("/")[0],a=e.split("/")[1],c=null,s=null;switch(n){case"u":s=i.utility;break;case"b":s=i.behaviour;break;case"a":s=i.appearance}if(null!==s&&(void 0===s[a]?"rememberState"===a&&void 0!==s.rememberScroll?c=!1===s.rememberScroll?"openStates":"all":void 0!==t[n]&&void 0!==t[n][a]&&(c=t[n][a]):c=s[a]),"a/styles"===e){if(c=Object.assign({},t.a.styles,c),o.helper.font&&o.helper.font.isLoaded()){var l=o.helper.font.getFontInfo();c.fontFamily=l.name,Object.assign(c,l.fontWeights)}"ee"===c.colorScheme&&(c.colorScheme="#7b5fa4",c.isEE=!0)}"a/showIndicator"===e&&!0===c&&void 0!==i.behaviour.openAction&&"mousemove"===i.behaviour.openAction&&(c=!1),r[a]=c}),"string"==typeof e){var a=e.split("/")[1];r=r[a]}return r},this.setData=function(o,t){e.init(function(){Object.keys(o).forEach(function(e){var t=e.split("/")[0],n=e.split("/")[1],r=o[e];switch(t){case"u":i.utility[n]=r,i.utility;break;case"b":i.behaviour[n]=r;break;case"a":i.appearance[n]=r}});try{chrome.storage.sync.set(i,function(){"function"==typeof t&&t()})}catch(o){"function"==typeof t&&t()}})},this.call=function(o,e,t){"function"==typeof e&&(t=e,e={}),e.type=o,chrome.extension.sendMessage(e,function(o){"function"==typeof t&&t(o)})}}}(jsu);