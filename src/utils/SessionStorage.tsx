export function ssSetItem(key:string,value:string){
    sessionStorage.setItem(key,value);
}

export function ssGetItem(key:string){
    return sessionStorage.getItem(key);
}


export function ssRemoveItem(key:string){
    sessionStorage.removeItem(key);
}