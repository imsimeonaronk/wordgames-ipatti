export function lsSetItem(key:string,value:string){
    localStorage.setItem(key,value);
}

export function lsGetItem(key:string){
    return localStorage.getItem(key);
}

export function lsRemoveItem(key:string){
    localStorage.removeItem(key);
}