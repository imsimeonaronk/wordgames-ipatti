import { FireBase } from "../../service/Firebase";
import { lsGetItem, lsRemoveItem, lsSetItem } from "../../utils/LocalStorage";
import { Gvar } from "./Gvar";

// Generate Task number
export function GenerateTaskNumber(taskLength:number){
    const playedTask = lsGetItem(`Game-${Gvar.GameData.Id}-level`);
    let currentTask = 1;
    if(!playedTask){
        const totalTask = Array.from({length: taskLength},(_,i)=> i+1);
        const filtered = totalTask.filter((n:any) => n!= currentTask);
        lsSetItem(`Game-${Gvar.GameData.Id}-level`,JSON.stringify(filtered));
    }else{
        const savedTask = JSON.parse(playedTask);
        currentTask = savedTask.splice(0,1)[0];
        const filtered = savedTask.filter((n:any) => n!= currentTask);
        lsSetItem(`Game-${Gvar.GameData.Id}-level`,JSON.stringify(filtered));
        if(!currentTask){ // Loop if there is no task left
            lsRemoveItem(`Game-${Gvar.GameData.Id}-level`);
            currentTask = GenerateTaskNumber(taskLength);
        }
    }
    return currentTask
}

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