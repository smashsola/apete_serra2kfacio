import { createRoot } from 'react-dom/client';
import { useEffect,useState } from 'react';
import { Home,UtensilsCrossed,Store,Sparkles,Flame } from 'lucide-react';
import { Dock,DockIcon,DockItem,DockLabel } from '@/components/ui/dock';
const items=[{page:'inicio',label:'Início',icon:Home},{page:'estabelecimentos',label:'Lojas',icon:Store},{page:'cardapio',label:'Cardápio',icon:UtensilsCrossed},{page:'fornada',label:'Fornada',icon:Flame},{page:'sabia',label:'Sabiá',icon:Sparkles}];
function NavigationDock(){
 const [page,setPage]=useState(location.hash.slice(1)||'inicio');
 const [typing,setTyping]=useState(false);
 useEffect(()=>{
  const navigate=(event:Event)=>setPage((event as CustomEvent<string>).detail);
  const hash=()=>setPage(location.hash.slice(1)||'inicio');
  const focus=(event:FocusEvent)=>setTyping(event.target instanceof HTMLElement&&event.target.matches('input,textarea,select,[contenteditable="true"]'));
  const blur=()=>setTyping(false);
  window.addEventListener('apete:page',navigate);window.addEventListener('hashchange',hash);document.addEventListener('focusin',focus);document.addEventListener('focusout',blur);
  return()=>{window.removeEventListener('apete:page',navigate);window.removeEventListener('hashchange',hash);document.removeEventListener('focusin',focus);document.removeEventListener('focusout',blur);};
 },[]);
 const merchant=page.startsWith('comerciante')||page==='admin';
 return <div className={`apete-dock-position${typing?' is-typing':''}${merchant?' is-hidden':''}`}>
  <Dock panelHeight={66} magnification={72} distance={120}>{items.map(item=><DockItem key={item.page} href={'#'+item.page} label={item.label} active={page===item.page} onClick={event=>{
   if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
   event.preventDefault();window.dispatchEvent(new CustomEvent('apete:navigate',{detail:item.page}));
  }}><DockLabel>{item.label}</DockLabel><DockIcon><item.icon aria-hidden="true"/></DockIcon></DockItem>)}</Dock>
 </div>;
}
const container=document.getElementById('navigation-dock');
if(container)createRoot(container).render(<NavigationDock/>);
