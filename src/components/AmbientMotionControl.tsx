'use client';
import {MotionIcon} from './icons';
import {useSyncExternalStore} from 'react';
import {ambientMotionEnabled,setAmbientMotionEnabled,subscribeAmbientMotion} from '@/lib/ambient-motion';
export default function AmbientMotionControl({enableLabel,disableLabel}:{enableLabel:string;disableLabel:string;description:string}){
 const systemReduced=useSyncExternalStore(subscribeAmbientMotion,()=>matchMedia('(prefers-reduced-motion:reduce)').matches,()=>false);
 const enabled=useSyncExternalStore(subscribeAmbientMotion,ambientMotionEnabled,()=>false);
 if(!systemReduced)return null;
 return <button className="ambient-motion-choice" aria-pressed={enabled} aria-label={enabled?disableLabel:enableLabel} title={enabled?disableLabel:enableLabel} onClick={()=>setAmbientMotionEnabled(!enabled)}><MotionIcon paused={!enabled}/>{enabled?disableLabel:enableLabel}</button>;
}
