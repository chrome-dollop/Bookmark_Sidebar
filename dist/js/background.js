/*! (c) Philipp König under GPL-3.0 */
(e=>{"use strict";window.AnalyticsHelper=function(t){let a=[],i=!1,n={dev:"100595538-3",live:"100595538-2"};this.init=(()=>new Promise(e=>{window.GoogleAnalyticsObject="ga",window.ga=window.ga||function(){(window.ga.q=window.ga.q||[]).push(arguments)},window.ga.l=+new Date;let a=document.createElement("script");a.async=1,a.src="https://www.google-analytics.com/analytics.js";let i=document.getElementsByTagName("script")[0];i.parentNode.insertBefore(a,i),window.ga("create","UA-"+n[t.isDev?"dev":"live"],"auto"),window.ga("set","checkProtocolTask",null),window.ga("set","transport","beacon"),e()})),this.trackEvent=(e=>new Promise(t=>{r({hitType:"event",eventCategory:e.category,eventAction:e.action,eventLabel:e.label,eventValue:e.value||1},e.always||!1),t()})),this.trackPageView=(e=>new Promise(t=>{r({hitType:"pageview",page:e.page},e.always||!1),t()})),this.trackUserData=(()=>{let e=chrome.runtime.getManifest(),a="not_set",i=t.helper.model.shareUserdata();if(!0===i?a="allowed":!1===i&&(a="not_allowed"),this.trackEvent({category:"extension",action:"user",label:"share_"+a,always:!0}),this.trackEvent({category:"extension",action:"version",label:e.version,always:!0}),!0===i){let e=t.helper.model.getData("installationDate");e&&this.trackEvent({category:"extension",action:"installationDate",label:new Date(e).toISOString().slice(0,10)}),t.helper.bookmarkApi.func.getSubTree(0).then(e=>{let t=0,a=e=>{for(let i=0;i<e.length;i++){let n=e[i];n.url?t++:n.children&&a(n.children)}};e&&e[0]&&e[0].children&&e[0].children.length>0&&a(e[0].children),this.trackEvent({category:"extension",action:"bookmarks",label:"amount",value:t})});let a=["behaviour","appearance"],i=(e,t)=>{Object.keys(t).forEach(a=>{"object"==typeof t[a]?i(e+"_"+a,t[a]):("string"!=typeof t[a]&&(t[a]=JSON.stringify(t[a])),this.trackEvent({category:"configuration",action:e+"_"+a,label:t[a]}))})};chrome.storage.sync.get(a,e=>{a.forEach(t=>{"object"==typeof e[t]&&i(t,e[t])})})}});let r=(e,n)=>{!0!==t.helper.model.shareUserdata()&&!0!==n||(a.push(e),!1===i&&o())},o=()=>{i=!0,e.delay(1e3).then(()=>{if(a.length>0&&window.ga&&window.ga.loaded){let e=a.shift();window.ga("send",e),o()}else i=!1})}},window.BookmarkApi=function(e){this.func={},this.init=(()=>new Promise(e=>{["get","getSubTree","removeTree"].forEach(e=>{this.func[e]=(a=>t(e,[""+a]))}),["update","move"].forEach(e=>{this.func[e]=((a,i)=>t(e,[""+a,i]))}),["create","search"].forEach(e=>{this.func[e]=(a=>t(e,[a]))}),e()}));let t=(t,a)=>new Promise((i,n)=>{chrome.bookmarks[t](...a,a=>{let r=chrome.runtime.lastError;void 0===r?-1!==["update","move","create","removeTree"].indexOf(t)?Promise.all([e.helper.cache.remove({name:"html"}),e.helper.entries.update()]).then(()=>{i(a)}):i(a):n(r.message)})})},window.CacheHelper=function(e){this.set=(e=>new Promise(t=>{try{chrome.storage.local.set({["cache_"+e.name]:e.val},()=>{t()})}catch(e){t()}})),this.get=(e=>new Promise(t=>{chrome.storage.local.get(["cache_"+e.name],a=>{t({val:a["cache_"+e.name]})})})),this.remove=(e=>new Promise(t=>{chrome.storage.local.remove(["cache_"+e.name],()=>{t()})}))},window.EntriesHelper=function(t){let a={},i={},n={},r={},o=[],s=[],l=!1,h=!1;this.update=(()=>new Promise(d=>{!1===l?(l=!0,Promise.all([t.helper.bookmarkApi.func.getSubTree(0),t.helper.viewAmount.getAll()]).then(e=>{r=e[1];let t=[];e[0]&&e[0][0]&&e[0][0].children&&(t=e[0][0].children),chrome.storage.local.get(["utility"],e=>{o=e.utility?e.utility.hiddenEntries||[]:[],s=e.utility?e.utility.pinnedEntries||[]:[],i={bookmarks:{},directories:{},pinned:{}},n={bookmarks:{visible:0,hidden:0},directories:{visible:0,hidden:0},pinned:{visible:0,hidden:0}},c(t),a={entries:i,amounts:n},l=!1,d()})})):!1===h?(h=!0,e.delay(5e3).then(()=>{h=!1,this.update()}),d()):d()})),this.getEntries=(()=>new Promise(e=>{e(a)}));let c=(e,t=[],a=!1)=>{e.forEach(e=>{let i=[...t];"0"!==e.parentId&&i.push(e.parentId),e.hidden=a||!0===o[e.id],e.parents=i,e.views={startDate:+new Date(Math.max(e.dateAdded,r.counterStartDate)),total:0},e.url?m(e):e.children&&d(e)})},d=e=>{e.childrenAmount={bookmarks:0,directories:0,total:0},e.parents.forEach(e=>{i.directories[e].childrenAmount.directories++}),i.directories[e.id]=e,c(e.children,e.parents,e.hidden),e.isDir=!0,e.childrenAmount.total=e.childrenAmount.bookmarks+e.childrenAmount.directories,e.views.perMonth=Math.round(e.views.total/p(e.views.startDate)*100)/100,n.directories[e.hidden?"hidden":"visible"]++},m=e=>{let t=0,a=0;if(r.viewAmounts[e.id]&&(t=r.viewAmounts[e.id].c,a=r.viewAmounts[e.id].d||0),e.views.total=t,e.views.lastView=a,e.views.perMonth=Math.round(t/p(e.views.startDate)*100)/100,e.parents.forEach(e=>{i.directories[e]&&(i.directories[e].childrenAmount.bookmarks++,i.directories[e].views.total+=t,i.directories[e].views.lastView=Math.max(i.directories[e].views.lastView||0,a))}),e.pinned=!1,i.bookmarks[e.id]=e,n.bookmarks[e.hidden?"hidden":"visible"]++,s[e.id]){e.pinned=!0;let t=Object.assign({},e);t.index=s[e.id].index,delete t.parents,delete t.parentId,i.pinned[e.id]=t,n.pinned[e.hidden?"hidden":"visible"]++}},p=e=>Math.max(1,Math.round((+new Date-e)/2627999942.4))},window.IconHelper=function(t){let a={},i=null;this.init=(()=>new Promise(e=>{chrome.storage.sync.get(["appearance"],a=>{let i="bookmark",n="rgb(85,85,85)";a&&a.appearance&&a.appearance.styles&&(a.appearance.styles.iconShape&&(i=a.appearance.styles.iconShape),a.appearance.styles.iconColor&&(n=a.appearance.styles.iconColor)),"logo"!==i&&this.set({name:i,color:n}),t.isDev&&(chrome.browserAction.setBadgeBackgroundColor({color:[245,197,37,255]}),chrome.browserAction.setBadgeText({text:"X"})),e()})})),this.set=(t=>new Promise(n=>{let r=t.onlyCurrentTab||!1;if(i&&!r&&i===t.name+"_"+t.color)n();else{let o=document.createElement("canvas");o.width=128,o.height=128;let s=o.getContext("2d");new Promise(i=>{a[t.name]?i(a[t.name]):e.xhr(chrome.extension.getURL("img/icon/menu/icon-"+t.name+".svg")).then(e=>{let n=e.responseText;a[t.name]="data:image/svg+xml;charset=utf-8,"+n,i(a[t.name])})}).then(e=>{e=e.replace(/\#000/g,t.color);let a=new Image;a.onload=(()=>{s.drawImage(a,0,0,128,128),chrome.browserAction.setIcon({imageData:s.getImageData(0,0,128,128),tabId:r&&t.tabInfo?t.tabInfo.id:null}),r||(i=t.name+"_"+t.color),n()}),a.src=e})}}))},window.ImageHelper=function(t){let a={},i=!1;this.init=(()=>new Promise(e=>{chrome.storage.local.get(["imageCache"],t=>{a=t.imageCache||{},e()})})),this.getThumbnail=(a=>new Promise(i=>{let o=n("thumb",a.url);o?i({img:o}):e.xhr(t.urls.thumbnail,{method:"POST",timeout:1e4,data:{url:a.url,lang:chrome.i18n.getUILanguage()}}).then(e=>{let t=e.responseText;t&&t.length>0?(r("thumb",a.url,t),i({img:t})):i({img:null})},()=>{i({img:null})})})),this.getFavicon=(e=>new Promise(t=>{let a=new Image;a.onload=function(){let e=document.createElement("canvas");e.width=this.width,e.height=this.height,e.getContext("2d").drawImage(this,0,0);let a=e.toDataURL("image/png");t({img:a})},a.src="chrome://favicon/size/16@2x/"+e.url}));let n=(e,t)=>a[e+"_"+t]?a[e+"_"+t].d:null,r=(e,t,n)=>{if(a[e+"_"+t]={t:+new Date,d:n},!1===i){i=!0;let e=+new Date;return Object.keys(a).forEach(t=>{e-a[t].t>6048e5&&delete a[t]}),new Promise(e=>{chrome.storage.local.set({imageCache:a},()=>{i=!1,e()})})}}},window.LanguageHelper=function(t){let a={af:"Afrikaans",ar:"Arabic",hy:"Armenian",be:"Belarusian",bg:"Bulgarian",ca:"Catalan","zh-CN":"Chinese (Simplified)","zh-TW":"Chinese (Traditional)",hr:"Croatian",cs:"Czech",da:"Danish",nl:"Dutch",en:"English",eo:"Esperanto",et:"Estonian",tl:"Filipino",fi:"Finnish",fr:"French",de:"German",el:"Greek",iw:"Hebrew",hi:"Hindi",hu:"Hungarian",is:"Icelandic",id:"Indonesian",it:"Italian",ja:"Japanese",ko:"Korean",lv:"Latvian",lt:"Lithuanian",no:"Norwegian",fa:"Persian",pl:"Polish",pt:"Portuguese",ro:"Romanian",ru:"Russian",sr:"Serbian",sk:"Slovak",sl:"Slovenian",es:"Spanish",sw:"Swahili",sv:"Swedish",ta:"Tamil",th:"Thai",tr:"Turkish",uk:"Ukrainian",vi:"Vietnamese"},i={};this.getAll=(()=>new Promise(e=>{n().then(t=>{e({infos:t})})})),this.getVars=(t=>new Promise(a=>{if(t.lang){let n=void 0===t.cache||!0===t.cache;if(i[t.lang]&&n)a({langVars:i[t.lang]});else{let r=r=>{let o=r.langVars;e.xhr(chrome.extension.getURL("_locales/"+t.lang+"/messages.json")).then(e=>{let r=JSON.parse(e.responseText);Object.assign(o,r),n&&(i[t.lang]=o),a({langVars:o})})};t.defaultLang&&t.defaultLang!==t.lang?this.getVars({lang:t.defaultLang,cache:!1}).then(r):r({langVars:{}})}}}));let n=()=>new Promise(t=>{chrome.storage.local.get(["languageInfos"],i=>{if(i&&i.languageInfos&&(+new Date-i.languageInfos.updated)/36e5<8)t(i.languageInfos.infos);else{let i=Object.keys(a).length,n=0,r={};Object.keys(a).forEach(o=>{r[o]={name:o,label:a[o],available:!1};let s=()=>{++n===i&&(chrome.storage.local.set({languageInfos:{infos:r,updated:+new Date}}),t(r))};e.xhr(chrome.extension.getURL("_locales/"+o+"/messages.json"),{method:"HEAD"}).then(()=>{r[o].available=!0,s()},s)})}})})},window.ModelHelper=function(e){let t=null,a={};this.init=(()=>new Promise(n=>{chrome.storage.sync.get(["model","shareUserdata"],r=>{a=r.model||{},t=void 0===r.shareUserdata?null:r.shareUserdata,void 0===a.installationDate&&(a.installationDate=+new Date);let o=+(new Date).setHours(0,0,0,0);void 0!==a.lastTrackDate&&a.lastTrackDate===o||(a.lastTrackDate=o,e.helper.analytics.trackUserData()),i().then(n)})})),this.shareUserdata=(()=>t),this.setData=((e,t)=>new Promise(n=>{a[e]=t,i().then(n)})),this.getData=(e=>a[e]||null);let i=()=>new Promise(e=>{Object.getOwnPropertyNames(a).length>0&&chrome.storage.sync.set({model:a},()=>{e()})})},window.NewtabHelper=function(e){let t={};this.init=(()=>new Promise(e=>{this.updateConfig().then(()=>{a(),e()})})),this.updateConfig=(()=>new Promise(e=>{chrome.storage.sync.get(["newtab"],a=>{t=void 0===a.newtab?{}:a.newtab,e()})}));let a=async()=>{chrome.tabs.onCreated.addListener(e=>{if(e.url&&"chrome://newtab/"===e.url&&void 0!==t.override&&!0===t.override){let a="create";0===e.index?a="update":chrome.tabs.remove(e.id),t.website&&t.website.length>0?n(a):i(a)}})},i=e=>{chrome.tabs[e]({url:chrome.extension.getURL("html/newtab.html"),active:!0})},n=e=>{chrome.tabs[e]({url:r(t.website,"bs_nt",1),active:!0})},r=(e,t,a)=>{let i=new RegExp("([?&])"+t+"=.*?(&|#|$)","i");if(e.match(i))return e.replace(i,"$1"+t+"="+a+"$2");{let i="";return-1!==e.indexOf("#")&&(i=e.replace(/.*#/,"#"),e=e.replace(/#.*/,"")),e+(-1!==e.indexOf("?")?"&":"?")+t+"="+a+i}}},window.PortHelper=function(t){let a=e=>new Promise(a=>{chrome.storage.sync.set({shareUserdata:e.share},()=>{t.helper.model.init().then(a)})}),i=()=>new Promise(a=>{e.xhr(t.urls.checkStatus,{method:"HEAD",timeout:5e3}).then(()=>{a({status:"available"})},()=>{a({status:"unavailable"})})}),n=()=>new Promise(e=>{let a=!1,i=t.helper.model.getData("installationDate");null===t.helper.model.shareUserdata()&&(+new Date-i)/864e5>5&&(a=!0),e({showMask:a})}),r=a=>new Promise(i=>{a.abort&&!0===a.abort?e.cancelXhr(t.urls.updateUrls):e.xhr(t.urls.updateUrls,{method:"POST",data:{urlList:a.urls,ua:navigator.userAgent,lang:chrome.i18n.getUILanguage()}}).then(e=>{let t=JSON.parse(e.responseText);i(t)},()=>{i({error:!0})})}),o=e=>new Promise(a=>{let i={title:e.title};e.url&&(i.url=e.url),t.helper.bookmarkApi.func.update(e.id,i).then(()=>{a({updated:e.id})},e=>{a({error:e})})}),s=e=>new Promise(a=>{let i={parentId:e.parentId,index:e.index||0,title:e.title,url:e.url?e.url:null};t.helper.bookmarkApi.func.create(i).then(()=>{a({created:e.id})},e=>{a({error:e})})}),l=e=>new Promise(a=>{t.helper.bookmarkApi.func.removeTree(e.id).then(()=>{a({deleted:e.id})})}),h=e=>new Promise(a=>{let i={parentId:""+e.parentId,index:e.index};t.helper.bookmarkApi.func.move(e.id,i).then(()=>{a({moved:e.id})})}),c=e=>new Promise(a=>{t.helper.bookmarkApi.func.getSubTree(e.id).then(e=>{a({bookmarks:e})})}),d=e=>new Promise(a=>{t.helper.bookmarkApi.func.search(e.searchVal).then(e=>{a({bookmarks:e})})}),m=e=>new Promise(a=>{if(t.helper.viewAmount.addByEntry(e),e.newTab&&!0===e.newTab){let i=(i=null)=>{chrome.tabs.query({active:!0,currentWindow:!0},n=>{chrome.tabs.create({url:e.href,active:void 0===e.active||!!e.active,index:null===i?n[0].index+1:i,openerTabId:n[0].id},e=>{t.helper.model.setData("openedByExtension",e.id).then(a)})})};"afterLast"===e.position?chrome.tabs.query({},e=>{i(e[e.length-1].index+1)}):"beforeFirst"===e.position?i(0):i()}else e.incognito&&!0===e.incognito?(chrome.windows.create({url:e.href,state:"maximized",incognito:!0}),a()):chrome.tabs.query({active:!0,currentWindow:!0},i=>{chrome.tabs.update(i[0].id,{url:e.href},e=>{t.helper.model.setData("openedByExtension",e.id).then(a)})})});this.init=(()=>new Promise(e=>{let p={checkUrls:r,bookmarks:c,searchBookmarks:d,moveBookmark:h,updateBookmark:o,createBookmark:s,deleteBookmark:l,reload:t.reload,reinitialize:t.reinitialize,shareUserdata:a,shareUserdataMask:n,languageInfos:t.helper.language.getAll,langvars:t.helper.language.getVars,favicon:t.helper.image.getFavicon,thumbnail:t.helper.image.getThumbnail,openLink:m,getCache:t.helper.cache.get,setCache:t.helper.cache.set,removeCache:t.helper.cache.remove,websiteStatus:i,trackPageView:t.helper.analytics.trackPageView,trackEvent:t.helper.analytics.trackEvent,updateIcon:t.helper.icon.set,reloadIcon:t.helper.icon.init,addViewAmount:t.helper.viewAmount.addByUrl,viewAmounts:t.helper.viewAmount.getAll,updateEntries:t.helper.entries.update,entries:t.helper.entries.getEntries};chrome.runtime.onConnect.addListener(e=>{e.name&&"background"===e.name&&e.onMessage.addListener((t,a)=>{p[t.type]&&(t.tabInfo=a.sender.tab,p[t.type](t).then(a=>{e.postMessage({uid:t.uid,result:a})}))})}),e()}))},window.UpgradeHelper=function(e){this.init=(()=>new Promise(e=>{t(),e()}));let t=()=>{chrome.runtime.onUpdateAvailable.addListener(()=>{chrome.runtime.reload()}),chrome.runtime.onInstalled.addListener(t=>{if("install"===t.reason)chrome.tabs.create({url:chrome.extension.getURL("html/intro.html")}),e.reinitialize();else if("update"===t.reason){chrome.storage.local.remove(["languageInfos"]);let i=chrome.runtime.getManifest().version;t.previousVersion!==i&&e.helper.analytics.trackEvent({category:"extension",action:"update",label:t.previousVersion+" -> "+i,always:!0});let n=t.previousVersion.split("."),r=i.split(".");n[0]!==r[0]||n[1]!==r[1]?a(i).then(()=>{e.reinitialize()}):e.reinitialize()}})},a=t=>new Promise(a=>{let i=0,n=()=>{++i>=3&&a()};chrome.storage.sync.get(["model"],a=>{void 0===a.model||void 0!==a.model.updateNotification&&a.model.updateNotification===t||e.helper.model.setData("updateNotification",t).then(()=>{chrome.tabs.create({url:chrome.extension.getURL("html/changelog.html")})})}),chrome.storage.sync.get(null,e=>{void 0===e.behaviour&&(e.behaviour={}),void 0===e.appearance&&(e.appearance={}),void 0===e.newtab&&(e.newtab={}),chrome.storage.sync.remove(["utility","nt_notice"]),["sidebarPosition","language"].forEach(t=>{void 0===e.behaviour[t]&&void 0!==e.appearance[t]&&(e.behaviour[t]=e.appearance[t]),delete e.appearance[t]}),void 0!==e.behaviour.initialOpenOnNewTab&&(e.newtab.initialOpen=e.behaviour.initialOpenOnNewTab),void 0!==e.behaviour.replaceNewTab&&(e.newtab.override=e.behaviour.replaceNewTab),void 0!==e.behaviour.rememberState&&"all"===e.behaviour.rememberState&&(e.behaviour.rememberState="openStatesAndPos"),void 0===e.appearance.iconShape&&(e.appearance.iconShape="logo"),void 0!==e.utility&&chrome.storage.local.set({utility:e.utility}),delete e.behaviour.scrollSensitivity,void 0===e.appearance.styles&&(e.appearance.styles={}),void 0!==e.appearance.styles.fontFamily&&"Roboto"===e.appearance.styles.fontFamily&&(e.appearance.styles.fontFamily="default"),void 0===e.appearance.styles.directoriesIconSize&&void 0!==e.appearance.styles.bookmarksIconSize&&(e.appearance.styles.directoriesIconSize=e.appearance.styles.bookmarksIconSize),chrome.storage.sync.remove(["clickCounter"]),chrome.storage.sync.set({behaviour:e.behaviour},n),chrome.storage.sync.set({newtab:e.newtab},n),chrome.storage.sync.set({appearance:e.appearance},n)})})},window.ViewAmountHelper=function(e){this.getAll=(()=>new Promise(a=>{t().then(t=>{a({viewAmounts:t,counterStartDate:e.helper.model.getData("installationDate")})})})),this.addByUrl=(t=>new Promise(a=>{null===e.helper.model.getData("openedByExtension")&&e.helper.bookmarkApi.func.search({url:t.url}).then(e=>{e.some(e=>e.url===t.url&&(this.addByEntry(e),!0)),a()}),e.helper.model.setData("openedByExtension",null)})),this.addByEntry=(a=>{a.id&&t().then(t=>{void 0===t[a.id]&&(t[a.id]={c:0}),"object"!=typeof t[a.id]&&(t[a.id]={c:t[a.id]}),t[a.id].c++,t[a.id].d=+new Date,delete t["node_"+a.id],chrome.storage.local.set({clickCounter:t},()=>{e.helper.entries.update()})})});let t=()=>new Promise(e=>{chrome.storage.local.get(["clickCounter"],t=>{let a={};void 0!==t.clickCounter&&(a=t.clickCounter),e(a)})})};(new function(){let e=!1;this.urls={checkStatus:"https://extensions.blockbyte.de/",updateUrls:"https://extensions.blockbyte.de/ajax/updateUrls",uninstall:"https://extensions.blockbyte.de/bs/uninstall",thumbnail:"https://4v1.de/t"},this.dev=!1;let t=null;this.reload=(e=>new Promise(a=>{Promise.all([this.helper.newtab.updateConfig(),this.helper.cache.remove({name:"html"}),this.helper.entries.update()]).then(()=>{chrome.tabs.query({},i=>{i.forEach(a=>{chrome.tabs.sendMessage(a.id,{action:"reload",scrollTop:e.scrollTop||!1,reinitialized:t,type:e.type})}),a()})})})),this.reinitialize=(()=>new Promise(e=>{let a=chrome.runtime.getManifest();t=+new Date;let i={css:"insertCSS",js:"executeScript"};Promise.all([this.helper.newtab.updateConfig(),this.helper.cache.remove({name:"html"}),this.helper.entries.update()]).then(()=>{chrome.tabs.query({},t=>{t.forEach(e=>{void 0!==e.url&&(e.url.startsWith("chrome://")||e.url.startsWith("chrome-extension://"))||Object.entries(i).forEach(([t,i])=>{a.content_scripts[0][t].forEach(t=>{chrome.tabs[i](e.id,{file:t},function(){chrome.runtime.lastError})})})}),e()})})}));let a=async()=>{chrome.browserAction.onClicked.addListener(()=>{chrome.tabs.query({active:!0,currentWindow:!0},e=>{chrome.tabs.sendMessage(e[0].id,{action:"toggleSidebar"})})}),chrome.bookmarks.onImportBegan.addListener(()=>{e=!0}),chrome.bookmarks.onImportEnded.addListener(()=>{e=!1,this.reload({type:"Created"})}),["Changed","Created","Removed"].forEach(t=>{chrome.bookmarks["on"+t].addListener(()=>{!1!==e&&"Created"===t||this.reload({type:t})})})},i=()=>{this.helper={model:new window.ModelHelper(this),bookmarkApi:new window.BookmarkApi(this),language:new window.LanguageHelper(this),upgrade:new window.UpgradeHelper(this),viewAmount:new window.ViewAmountHelper(this),newtab:new window.NewtabHelper(this),entries:new window.EntriesHelper(this),image:new window.ImageHelper(this),port:new window.PortHelper(this),icon:new window.IconHelper(this),cache:new window.CacheHelper(this),analytics:new window.AnalyticsHelper(this)}};this.run=(()=>{let e=chrome.runtime.getManifest();this.isDev="Dev"===e.version_name||!("update_url"in e),!1===this.isDev&&chrome.runtime.setUninstallURL(this.urls.uninstall),i();let t=+new Date;Promise.all([this.helper.model.init(),this.helper.icon.init(),this.helper.newtab.init(),this.helper.analytics.init(),this.helper.image.init(),this.helper.bookmarkApi.init()]).then(()=>Promise.all([a(),this.helper.port.init(),this.helper.upgrade.init(),this.helper.entries.update()])).then(()=>{console.log("LOADED",+new Date-t)})})}).run()})(jsu);