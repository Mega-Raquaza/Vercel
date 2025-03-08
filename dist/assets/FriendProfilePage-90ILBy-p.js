import{b as j,r,A as b,u as N,j as e,L as v,a as w}from"./index-D4ATXNzv.js";const A="http://localhost:5000",$=()=>{var o;const{userId:a}=j();r.useContext(b);const[s,x]=r.useState(null),[i,m]=r.useState([]),[h,u]=r.useState(!0),[c,g]=r.useState(""),f=N(),y=async()=>{try{const t=await w.get(`${A}/api/profile/${a}`,{headers:{Authorization:`Bearer ${localStorage.getItem("accessToken")}`},withCredentials:!0});x(t.data.profile),m(t.data.queries)}catch(t){console.error(t),g("Error fetching profile")}finally{u(!1)}};if(r.useEffect(()=>{y()},[a]),h)return e.jsx("div",{className:"min-h-screen flex items-center justify-center text-white",children:"Loading..."});if(c)return e.jsx("div",{className:"min-h-screen flex items-center justify-center text-red-500",children:c});if(!s)return e.jsx("div",{className:"min-h-screen flex items-center justify-center text-white",children:"Profile not found."});const p=s.friends?s.friends.filter(t=>t.status==="accepted").length:0,n={legendary:5,mythical:4,rare:3,uncommon:2,common:1,loser:0},d=s.claimedAchievements&&Array.isArray(s.claimedAchievements)?[...s.claimedAchievements].sort((t,l)=>n[l.rarity]-n[t.rarity]):[];return e.jsxs("div",{className:"min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4",children:[e.jsxs("div",{className:"max-w-3xl mx-auto bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 mb-8",children:[e.jsxs("div",{className:"flex flex-col md:flex-row items-center gap-6",children:[e.jsx("img",{src:((o=s.userDetails)==null?void 0:o.profilePicture)||"https://via.placeholder.com/150",alt:"Profile",className:"w-28 h-28 rounded-full object-cover border-4 border-purple-500"}),e.jsxs("div",{className:"flex-1 text-center md:text-left",children:[e.jsx("h2",{className:"text-3xl font-bold text-white",children:s.username}),e.jsx("p",{className:"text-gray-300",children:s.email}),e.jsxs("div",{className:"flex justify-center md:justify-start mt-4 space-x-6",children:[e.jsxs("div",{className:"text-center",children:[e.jsx("span",{className:"font-bold text-white",children:s.aura}),e.jsx("p",{className:"text-xs text-gray-400",children:"Aura"})]}),e.jsxs("div",{className:"text-center",children:[e.jsx("span",{className:"font-bold text-white",children:s.medals}),e.jsx("p",{className:"text-xs text-gray-400",children:"Medals"})]}),e.jsxs("div",{className:"text-center",children:[e.jsx("span",{className:"font-bold text-white",children:p}),e.jsx("p",{className:"text-xs text-gray-400",children:"Friends"})]}),e.jsxs("div",{className:"text-center",children:[e.jsx("span",{className:"font-bold text-white",children:s.league}),e.jsx("p",{className:"text-xs text-gray-400",children:"League"})]})]}),e.jsx("div",{className:"mt-4",children:e.jsx("button",{onClick:()=>f(`/chat/${a}`),className:"px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition",children:"Chat"})})]})]}),s.userDetails&&e.jsxs("div",{className:"mt-8 border-t border-gray-700 pt-6 text-center md:text-left",children:[e.jsxs("h3",{className:"text-2xl font-bold text-white",children:[s.userDetails.firstName," ",s.userDetails.lastName]}),e.jsx("p",{className:"mt-2 text-base text-gray-300",children:s.userDetails.description})]})]}),d.length>0&&e.jsxs("div",{className:"max-w-3xl mx-auto bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700 mb-8",children:[e.jsx("h2",{className:"text-3xl font-bold mb-8 text-center text-white",children:"Achievements"}),e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8",children:d.map((t,l)=>e.jsxs("div",{className:"p-6 bg-gray-700 rounded-xl border-2 border-gray-600 shadow-md hover:shadow-2xl transition-transform transform hover:scale-105",children:[e.jsx("div",{className:"flex justify-center mb-4",children:e.jsx("i",{className:`${t.icon} text-5xl ${t.rarity==="legendary"?"text-yellow-500":t.rarity==="mythical"?"text-purple-500":t.rarity==="rare"?"text-blue-500":t.rarity==="uncommon"?"text-indigo-500":t.rarity==="common"?"text-gray-300":"text-red-500"}`})}),e.jsx("h3",{className:"text-xl font-semibold text-center text-white mb-2",children:t.title}),e.jsx("p",{className:"text-center text-sm text-gray-300",children:t.description})]},l))})]}),e.jsxs("div",{className:"max-w-3xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 mt-8",children:[e.jsxs("h2",{className:"text-2xl font-bold mb-6 text-center text-white",children:["Queries by ",s.username]}),i.length===0?e.jsx("p",{className:"text-center text-gray-400",children:"No queries posted yet."}):e.jsx("div",{className:"space-y-4",children:i.map(t=>e.jsx(v,{to:`/query/${t._id}`,className:"block p-4 bg-gray-700 rounded-lg border border-gray-600 hover:bg-gray-600 transition-colors",children:e.jsx("h3",{className:"text-lg font-semibold text-blue-300",children:t.title})},t._id))})]})]})};export{$ as default};
