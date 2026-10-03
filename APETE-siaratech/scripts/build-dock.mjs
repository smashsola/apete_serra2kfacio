import { build } from 'esbuild';
import postcss from 'postcss';
import tailwindcss from '@tailwindcss/postcss';
import fs from 'node:fs/promises';
await build({entryPoints:['src/dock.tsx'],outfile:'public/navigation-dock.js',bundle:true,minify:true,format:'esm',target:['es2022'],jsx:'automatic',define:{'process.env.NODE_ENV':'"production"'},tsconfig:'tsconfig.json'});
await build({entryPoints:['src/header-dock.ts'],outfile:'public/header-dock.js',bundle:true,minify:true,format:'esm',target:['es2022'],define:{'process.env.NODE_ENV':'"production"'},tsconfig:'tsconfig.json'});
const source=await fs.readFile('src/dock.css','utf8');
const result=await postcss([tailwindcss({optimize:true})]).process(source,{from:'src/dock.css',to:'public/navigation-dock.css'});
await fs.writeFile('public/navigation-dock.css',result.css);
