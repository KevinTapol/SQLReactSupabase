#Create React App with Supabase SQL backend

- npx create-react-app .
- npm i @supabase/supabase-js
- npm install -D tailwindcss
- npx tailwindcss init

*in tailwind.config.js content: ["./src/**/*.{js,jsx,ts,tsx}",]*

*in index.css*  
@tailwind base;  
@tailwind components;  
@tailwind utilities;  

***under src folder create a js file for supabase client connection***