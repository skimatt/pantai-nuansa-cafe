export function formatPrice(price:number|null,currency='IDR'){
 return price===null?'':new Intl.NumberFormat('id-ID',{style:'currency',currency,maximumFractionDigits:0}).format(price).replace(/\u00a0/g,'');
}
export function formatPhone(phone:string|null){
 return phone?.replace(/^\+62/,'0').replace(/^(\d{4})(\d{4})(\d{4})$/,'$1 $2 $3')??'';
}
