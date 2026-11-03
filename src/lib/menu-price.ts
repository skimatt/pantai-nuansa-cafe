import {formatPrice} from './format';
export function parseOwnerPrice(value:string){
 const match=/^(\d+)K(?: - (\d+)K)?( \/ ons)?$/.exec(value);
 if(!match)throw new Error('Unsupported owner price');
 const price=Number(match[1])*1000,priceMax=match[2]?Number(match[2])*1000:undefined;
 if(priceMax!==undefined&&priceMax<price)throw new Error('Invalid owner price range');
 return {price,priceMax,priceUnit:match[3]?'ons' as const:undefined};
}
export function formatMenuPrice(item:{price:number|null;priceMax?:number;priceUnit?:'ons'},currency='IDR'){
 return formatPrice(item.price,currency)+(item.priceMax!==undefined?`–${formatPrice(item.priceMax,currency)}`:'')+(item.priceUnit==='ons'?' / ons':'');
}
