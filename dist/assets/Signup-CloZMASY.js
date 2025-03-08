import{r as t,u as p,j as e,a as h}from"./index-D4ATXNzv.js";import{L as f,y as u}from"./ReactToastify-NZiw_AEL.js";const b="http://localhost:5000",v=()=>{const[a,c]=t.useState(""),[r,d]=t.useState(""),[n,g]=t.useState(""),[o,l]=t.useState(""),m=p(),x=async s=>{s.preventDefault(),l("");try{const i=await h.post(`${b}/api/auth/signup`,{username:a,email:r,password:n},{withCredentials:!0});u.success("Signup successful! Please login."),m("/login")}catch(i){console.error("Signup failed:",i),l("Signup failed. Please try again."),u.error("Signup failed. Please try again.")}};return e.jsxs("div",{className:"flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",children:[e.jsx(f,{position:"top-right",autoClose:3e3}),e.jsxs("div",{className:"w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg transform transition duration-300 hover:scale-105",children:[e.jsx("h2",{className:"text-2xl font-bold text-center text-white",children:"Sign Up"}),o&&e.jsx("div",{className:"p-2 text-sm text-red-400 bg-red-800 rounded",children:o}),e.jsxs("form",{onSubmit:x,className:"space-y-4",children:[e.jsxs("div",{className:"flex flex-col",children:[e.jsx("label",{className:"mb-1 font-medium text-gray-300",children:"Username"}),e.jsx("input",{type:"text",className:"px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-white transition",value:a,onChange:s=>c(s.target.value),placeholder:"Username",required:!0})]}),e.jsxs("div",{className:"flex flex-col",children:[e.jsx("label",{className:"mb-1 font-medium text-gray-300",children:"Email"}),e.jsx("input",{type:"email",className:"px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-white transition",value:r,onChange:s=>d(s.target.value),placeholder:"Email",required:!0})]}),e.jsxs("div",{className:"flex flex-col",children:[e.jsx("label",{className:"mb-1 font-medium text-gray-300",children:"Password"}),e.jsx("input",{type:"password",className:"px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-white transition",value:n,onChange:s=>g(s.target.value),placeholder:"Password",required:!0})]}),e.jsx("button",{type:"submit",className:"w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors",children:"Sign Up"})]})]})]})};export{v as default};
