(()=>{var e={};e.id=365,e.ids=[365],e.modules={10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},19121:e=>{"use strict";e.exports=require("next/dist/server/app-render/action-async-storage.external.js")},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},12412:e=>{"use strict";e.exports=require("assert")},79428:e=>{"use strict";e.exports=require("buffer")},55511:e=>{"use strict";e.exports=require("crypto")},94735:e=>{"use strict";e.exports=require("events")},29021:e=>{"use strict";e.exports=require("fs")},81630:e=>{"use strict";e.exports=require("http")},55591:e=>{"use strict";e.exports=require("https")},91645:e=>{"use strict";e.exports=require("net")},21820:e=>{"use strict";e.exports=require("os")},33873:e=>{"use strict";e.exports=require("path")},11997:e=>{"use strict";e.exports=require("punycode")},27910:e=>{"use strict";e.exports=require("stream")},34631:e=>{"use strict";e.exports=require("tls")},83997:e=>{"use strict";e.exports=require("tty")},79551:e=>{"use strict";e.exports=require("url")},28354:e=>{"use strict";e.exports=require("util")},74075:e=>{"use strict";e.exports=require("zlib")},14783:(e,t,r)=>{"use strict";r.r(t),r.d(t,{GlobalError:()=>n.a,__next_app__:()=>p,pages:()=>l,routeModule:()=>d,tree:()=>c});var s=r(70260),i=r(28203),a=r(25155),n=r.n(a),o=r(67292),u={};for(let e in o)0>["default","tree","pages","GlobalError","__next_app__","routeModule"].indexOf(e)&&(u[e]=()=>o[e]);r.d(t,u);let c=["",{children:["auth",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(r.bind(r,10406)),"/Users/austincumberlander/Desktop/coding/projects/react/ai-note-taking-app/client/src/app/auth/page.tsx"]}]},{metadata:{icon:[async e=>(await Promise.resolve().then(r.bind(r,70440))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}]},{layout:[()=>Promise.resolve().then(r.bind(r,71354)),"/Users/austincumberlander/Desktop/coding/projects/react/ai-note-taking-app/client/src/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(r.t.bind(r,19937,23)),"next/dist/client/components/not-found-error"],forbidden:[()=>Promise.resolve().then(r.t.bind(r,69116,23)),"next/dist/client/components/forbidden-error"],unauthorized:[()=>Promise.resolve().then(r.t.bind(r,41485,23)),"next/dist/client/components/unauthorized-error"],metadata:{icon:[async e=>(await Promise.resolve().then(r.bind(r,70440))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}],l=["/Users/austincumberlander/Desktop/coding/projects/react/ai-note-taking-app/client/src/app/auth/page.tsx"],p={require:r,loadChunk:()=>Promise.resolve()},d=new s.AppPageRouteModule({definition:{kind:i.RouteKind.APP_PAGE,page:"/auth/page",pathname:"/auth",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:c}})},78843:(e,t,r)=>{Promise.resolve().then(r.bind(r,10406))},38931:(e,t,r)=>{Promise.resolve().then(r.bind(r,77050))},77050:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>p});var s=r(45512),i=r(58009),a=r(22330),n=r(44258),o=r(79334),u=r(27806),c=r(51007),l=r(92200);function p(){(0,n.W)();let e=(0,o.useRouter)(),{user:t,loading:r,setUser:p,createUser:d}=(0,c.k)(),[x,m]=(0,i.useState)(!1),[g,h]=(0,i.useState)("");if(r)return(0,s.jsx)("div",{className:"flex items-center justify-center h-screen",children:(0,s.jsx)(u.cq,{color:"#249fe4",size:"large",text:"Loading...",textColor:""})});let f=async()=>{m(!0),h("");try{let t=localStorage.getItem("guestUserId");if(t){let e=await (0,l.l2)(t);e.data&&null!==e.data||await d(t,!0),p({id:t})}else{let e=await (0,a.B4)();e&&e.id&&(localStorage.setItem("guestUserId",e.id),await d(e.id,!0),p({id:e.id}))}e.push("/")}catch(e){console.error("Guest sign-in error:",e),h(e.message||"Failed to sign in as guest")}finally{m(!1)}};return(0,s.jsx)("div",{className:"flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-blue-300 p-6",children:(0,s.jsxs)("div",{className:"bg-white shadow-lg rounded-lg p-8 w-full max-w-md",children:[(0,s.jsx)("h2",{className:"text-2xl font-bold text-center text-gray-800 mb-6",children:"Welcome to WhisprNotes"}),(0,s.jsx)("p",{className:"text-center text-gray-600 mb-6",children:"Sign in as a guest to start creating notes right away. No account required!"}),(0,s.jsx)("button",{onClick:f,className:"w-full p-3 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-gray-400",disabled:x,children:x?"Processing...":"Continue as Guest"}),g&&(0,s.jsx)("p",{className:"mt-4 text-red-500 text-center",children:g})]})})}},44258:(e,t,r)=>{"use strict";r.d(t,{W:()=>i}),r(58009),r(55842);var s=r(51007);function i(){let{user:e,loading:t,setUser:r,setLoading:i,createUser:a}=(0,s.k)();return{user:e,loading:t}}r(92200)},10406:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>s});let s=(0,r(46760).registerClientReference)(function(){throw Error("Attempted to call the default export of \"/Users/austincumberlander/Desktop/coding/projects/react/ai-note-taking-app/client/src/app/auth/page.tsx\" from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/Users/austincumberlander/Desktop/coding/projects/react/ai-note-taking-app/client/src/app/auth/page.tsx","default")},70440:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>i});var s=r(88077);let i=async e=>[{type:"image/x-icon",sizes:"16x16",url:(0,s.fillMetadataSegment)(".",await e.params,"favicon.ico")+""}]}};var t=require("../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[638,827,960,226],()=>r(14783));module.exports=s})();