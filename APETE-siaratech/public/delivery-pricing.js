/* Cent-based arithmetic shared by checkout and catalogue projections. */
(() => {
  function quote(store, distance, mode = 'delivery') {
    if (mode === 'pickup') return { ready:true, fee:0, distanceKm:null };
    const base = store.deliveryBaseFee ?? store.fee ?? 0;
    const rate = store.feePerKm ?? 0;
    const minimum = store.minimumFee ?? 0;
    if (![base,rate,minimum].every(n=>Number.isSafeInteger(n)&&n>=0)) return {ready:false,reason:'invalid_delivery_rate'};
    if (!rate) return {ready:true,fee:Math.max(base,minimum),distanceKm:null};
    const value = String(distance ?? '').trim().replace(',', '.');
    if (!value) return {ready:false,reason:'distance_required'};
    if (!/^\d+(\.\d{1,2})?$/.test(value) || Number(value)>200) return {ready:false,reason:'invalid_delivery_distance'};
    const hundredths = Math.round(Number(value)*100);
    return {ready:true,fee:Math.max(minimum,base+Math.floor((rate*hundredths+50)/100)),distanceKm:hundredths/100};
  }
  const isRegional = store => store.deliveryBaseFee===200 && store.feePerKm===100 && store.minimumFee===500;
  globalThis.APETE_DELIVERY = {quote,isRegional};
})();
