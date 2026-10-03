'use client';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, useReducedMotion, type MotionValue, type SpringOptions } from 'framer-motion';
import { Children, cloneElement, createContext, useContext, useEffect, useRef, useState, isValidElement, type ReactNode, type MouseEvent } from 'react';
import { cn } from '@/lib/utils';
type DockContextType = { mouseX: MotionValue<number>; spring: SpringOptions; magnification: number; distance: number };
const DockContext=createContext<DockContextType|undefined>(undefined);
function useDock(){const context=useContext(DockContext);if(!context)throw Error('DockItem requires Dock');return context;}
type DockProps={children:ReactNode;className?:string;distance?:number;panelHeight?:number;magnification?:number;spring?:SpringOptions};
export function Dock({children,className,distance=150,panelHeight=64,magnification=80,spring={mass:0.1,stiffness:150,damping:12}}:DockProps){
  const mouseX=useMotionValue(Infinity),hover=useMotionValue(0);
  const reduced=useReducedMotion();
  const heightRow=useTransform(hover,[0,1],[panelHeight,Math.max(128,magnification*1.5+4)]);
  const height=useSpring(heightRow,spring);
  return <motion.div className="apete-dock-shell" style={{height:reduced?panelHeight:height}}>
    <motion.nav aria-label="Navegação principal" className={cn('apete-dock-panel',className)} style={{height:panelHeight}}
      onPointerMove={event=>{if(event.pointerType==='mouse'&&!reduced){hover.set(1);mouseX.set(event.clientX);}}}
      onPointerLeave={()=>{hover.set(0);mouseX.set(Infinity);}}>
      <DockContext.Provider value={{mouseX,spring,distance,magnification}}>{children}</DockContext.Provider>
    </motion.nav>
  </motion.div>;
}
type Injected={width?:MotionValue<number>;isHovered?:MotionValue<number>};
type DockItemProps={children:ReactNode;className?:string;href:string;label:string;active?:boolean;onClick?:(event:MouseEvent<HTMLAnchorElement>)=>void};
export function DockItem({children,className,href,label,active,onClick}:DockItemProps){
  const ref=useRef<HTMLAnchorElement>(null);
  const {distance,magnification,mouseX,spring}=useDock();
  const hovered=useMotionValue(0);
  const reduced=useReducedMotion();
  const delta=useTransform(mouseX,value=>{const rect=ref.current?.getBoundingClientRect();return rect?value-rect.x-rect.width/2:Infinity;});
  const widthTransform=useTransform(delta,[-distance,0,distance],[44,magnification,44]);
  const width=useSpring(widthTransform,spring);
  return <motion.a ref={ref} href={href} aria-label={label} aria-current={active?'page':undefined} onClick={onClick}
    className={cn('apete-dock-item',className)} style={{width:reduced?44:width,height:reduced?44:width}}
    onPointerEnter={event=>{if(event.pointerType==='mouse')hovered.set(1);}}
    onPointerLeave={()=>hovered.set(0)} onFocus={()=>hovered.set(1)} onBlur={()=>hovered.set(0)}>
    {Children.map(children,child=>isValidElement<Injected>(child)?cloneElement(child,{width,isHovered:hovered}):child)}
  </motion.a>;
}
export function DockLabel({children,className,isHovered}: {children:ReactNode;className?:string}&Injected){
  const [visible,setVisible]=useState(false);
  useEffect(()=>{if(!isHovered)return;return isHovered.on('change',value=>setVisible(value===1));},[isHovered]);
  return <><span className="apete-dock-caption">{children}</span><AnimatePresence>{visible&&<motion.span
    initial={{opacity:0,y:0}} animate={{opacity:1,y:-8}} exit={{opacity:0,y:0}} transition={{duration:.2}}
    className={cn('apete-dock-tooltip',className)} aria-hidden="true">{children}</motion.span>}</AnimatePresence></>;
}
export function DockIcon({children,className,width}: {children:ReactNode;className?:string}&Injected){
  const fallback=useMotionValue(44);
  const iconWidth=useTransform(width||fallback,value=>value/2);
  return <motion.span style={{width:iconWidth}} className={cn('apete-dock-icon',className)}>{children}</motion.span>;
}
