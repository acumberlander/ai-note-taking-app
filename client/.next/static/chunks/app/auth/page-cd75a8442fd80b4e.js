(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[365],{42605:(e,t,s)=>{Promise.resolve().then(s.bind(s,73052))},73052:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>u});var a=s(95155),l=s(12115),r=s(50080),i=s(30408),n=s(76046),c=s(95742),d=s(1277),o=s(31574);function u(){(0,i.W)();let e=(0,n.useRouter)(),{user:t,loading:s,setUser:u,createUser:g}=(0,d.k)(),[x,h]=(0,l.useState)(!1),[m,b]=(0,l.useState)("");if(s)return(0,a.jsx)("div",{className:"flex items-center justify-center h-screen",children:(0,a.jsx)(c.cq,{color:"#249fe4",size:"large",text:"Loading...",textColor:""})});let f=async()=>{h(!0),b("");try{let t=localStorage.getItem("guestUserId");if(t){let e=await (0,o.l2)(t);e.data&&null!==e.data||await g(t,!0),u({id:t})}else{let e=await (0,r.B4)();e&&e.id&&(localStorage.setItem("guestUserId",e.id),await g(e.id,!0),u({id:e.id}))}e.push("/")}catch(e){console.error("Guest sign-in error:",e),b(e.message||"Failed to sign in as guest")}finally{h(!1)}};return(0,a.jsx)("div",{className:"flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-blue-300 p-6",children:(0,a.jsxs)("div",{className:"bg-white shadow-lg rounded-lg p-8 w-full max-w-md",children:[(0,a.jsx)("h2",{className:"text-2xl font-bold text-center text-gray-800 mb-6",children:"Welcome to WhisprNotes"}),(0,a.jsx)("p",{className:"text-center text-gray-600 mb-6",children:"Sign in as a guest to start creating notes right away. No account required!"}),(0,a.jsx)("button",{onClick:f,className:"w-full p-3 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-gray-400",disabled:x,children:x?"Processing...":"Continue as Guest"}),m&&(0,a.jsx)("p",{className:"mt-4 text-red-500 text-center",children:m})]})})}}},e=>{var t=t=>e(e.s=t);e.O(0,[869,742,408,441,517,358],()=>t(42605)),_N_E=e.O()}]);