import{r,A as b,j as e,L as x}from"./index-D4ATXNzv.js";import{g as f}from"./quizService-DCckhlDd.js";const y=()=>{const{user:s}=r.useContext(b),[l,o]=r.useState([]),[n,u]=r.useState([]),[m,c]=r.useState([]),[g,h]=r.useState([]);return r.useEffect(()=>{(async()=>{try{const t=await f();o(t.data);const p=new Date,z=t.data.filter(i=>(p-new Date(i.createdAt))/(1e3*60*60)<24);if(u(z),s){const i=s.quizHistory.map(a=>a.quizId);h(t.data.filter(a=>i.includes(a._id))),c(t.data.filter(a=>!i.includes(a._id)))}else c(t.data)}catch(t){console.error("Error fetching quizzes:",t)}})()},[s]),e.jsxs("div",{className:"max-w-7xl mx-auto p-4 sm:p-6 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",children:[e.jsx("h1",{className:"text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500",children:"Quizzes"}),e.jsx(d,{title:"✨ New Quizzes",quizzes:n,gradient:"from-orange-600 to-pink-600"}),e.jsx(d,{title:"🚀 Unanswered Quizzes",quizzes:m,gradient:"from-blue-600 to-purple-600"}),e.jsx(d,{title:"✅ Answered Quizzes",quizzes:g,gradient:"from-green-600 to-teal-600"}),e.jsx("div",{className:"flex justify-center mt-12",children:e.jsx(x,{to:"/leaderboard",className:"px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-500 hover:to-blue-500 transition-all font-bold text-lg shadow-lg",children:"🏆 View Leaderboard"})})]})},d=({title:s,quizzes:l,gradient:o})=>e.jsxs("section",{className:"mb-12",children:[e.jsx("h2",{className:`text-2xl font-bold mb-6 p-2 bg-gradient-to-r ${o} text-white rounded-lg inline-block`,children:s}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",children:l.length>0?l.map(n=>e.jsx(j,{quiz:n},n._id)):e.jsx("div",{className:"col-span-full p-6 bg-gray-800 rounded-lg border border-dashed border-gray-700",children:e.jsx("p",{className:"text-gray-400 text-center",children:"No quizzes available."})})})]}),j=({quiz:s})=>e.jsx("div",{className:"group p-6 bg-gray-800 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl",children:e.jsxs("div",{className:"flex flex-col h-full",children:[e.jsx("h3",{className:"text-xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400",children:s.title}),e.jsx("p",{className:"text-gray-300 mb-4 flex-1",children:s.description}),e.jsxs("div",{className:"space-y-2 mb-6",children:[e.jsxs("div",{className:"flex items-center text-sm text-gray-400",children:[e.jsx("span",{className:"mr-2",children:"📝"}),e.jsxs("span",{children:[s.questions.length," Questions"]})]}),e.jsxs("div",{className:"flex items-center text-sm text-gray-400",children:[e.jsx("span",{className:"mr-2",children:"⏳"}),e.jsxs("span",{children:[s.questions.length*15," seconds"]})]})]}),e.jsx(x,{to:`/quiz/${s._id}`,className:"w-full px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-500 hover:to-blue-500 transition-all font-semibold text-center shadow-md",children:"Start Quiz"})]})});export{y as default};
