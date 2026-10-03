/* Shared by the browser, Worker and tests. Dates are absolute UTC instants. */
(() => {
 const isActive=(product,now=Date.now())=>{
  const start=Date.parse(product.offer?.startsAt),end=Date.parse(product.offer?.endsAt);
  const discount=product.discountPrice??product.price;
  return product.lastBatch===true&&product.oldPrice>discount&&Number.isFinite(start)&&Number.isFinite(end)&&start<end&&start<=now&&now<end;
 };
 const project=(product,now=Date.now())=>{
  const discountPrice=product.discountPrice??product.price;
  const offerActive=isActive(product,now);
  return {...product,discountPrice,offerActive,price:product.lastBatch&&product.oldPrice>discountPrice&&!offerActive?product.oldPrice:discountPrice};
 };
 globalThis.APETE_OFFERS=Object.freeze({isActive,project});
})();
