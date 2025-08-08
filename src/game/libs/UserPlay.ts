import { FireBase } from "../../service/Firebase";
import { lsGetItem, lsRemoveItem, lsSetItem } from "../../utils/LocalStorage";
import { Gvar } from "../utils/Gvar";

// Update score
export function UpdateScore(){
    if(!Gvar.LoggedUser.name) return;
    FireBase.submitScore(Gvar.LoggedUser.name,1);
}

// Store user first visit
export function CheckFirstVisit(){
    if(!Gvar.LoggedUser.name) return;
    const stored = lsGetItem("firstVisit");
    if (!stored) {
        lsSetItem("firstVisit", new Date().toISOString());
    }
}

export function ResetFirstVisit(){
    lsRemoveItem("firstVisit");
}

// Prompt login window to user
export function ShouldPromptLogin():boolean{
    const stored = localStorage.getItem("firstVisit");
    if (!stored) return false;
    if (Gvar.LoggedUser.name) return false;
    const daysSinceFirstVisit =(new Date().getTime() - new Date(stored).getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceFirstVisit >= 3;
};