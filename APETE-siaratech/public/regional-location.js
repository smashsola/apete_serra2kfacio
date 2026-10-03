'use strict';
(function(root){
  function requestPosition(geolocation,{timeoutMs=10000,setTimer=setTimeout,clearTimer=clearTimeout}={}){
    return new Promise((resolve,reject)=>{
      let settled=false;
      const finish=(callback,value)=>{if(settled)return;settled=true;clearTimer(timer);callback(value);};
      const timer=setTimer(()=>finish(reject,{code:3}),timeoutMs);
      const started=Date.now();
      let retried=false;
      const retry=()=>{
        if(settled||retried)return;
        retried=true;
        const remaining=Math.max(1,timeoutMs-(Date.now()-started));
        request(true,remaining,0);
      };
      const request=(precise,timeout,maximumAge)=>{
        try{
          geolocation.getCurrentPosition(position=>{
            if(settled)return;
            const accuracy=position?.coords?.accuracy;
            if(!Number.isFinite(accuracy)||accuracy<0||accuracy>5000){
              if(!precise)retry();
              else finish(reject,{code:2});
              return;
            }
            finish(resolve,position);
          },error=>{
            if(settled)return;
            if((error.code===2||error.code===3)&&!precise)retry();
            else finish(reject,error);
          },{enableHighAccuracy:precise,timeout,maximumAge});
        }catch(error){finish(reject,error);}
      };
      request(false,Math.min(2000,timeoutMs),120000);
    });
  }
  function nearestCity(coords,centers){
    const {latitude,longitude,accuracy}=coords||{};
    if(!Number.isFinite(latitude)||!Number.isFinite(longitude)||Math.abs(latitude)>90||Math.abs(longitude)>180||!Number.isFinite(accuracy)||accuracy<0||accuracy>15000)return null;
    const rad=value=>value*Math.PI/180;
    const matches=Object.entries(centers).map(([city,[lat,lon]])=>{
      const a=Math.sin(rad(lat-latitude)/2)**2+Math.cos(rad(latitude))*Math.cos(rad(lat))*Math.sin(rad(lon-longitude)/2)**2;
      return {city,distance:6371*2*Math.asin(Math.min(1,Math.sqrt(a)))};
    }).sort((a,b)=>a.distance-b.distance);
    return matches[0]?.distance<=70?matches[0]:null;
  }
  root.APETE_LOCATION=Object.freeze({requestPosition,nearestCity});
})(globalThis);
