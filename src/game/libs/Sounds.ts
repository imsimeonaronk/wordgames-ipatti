import Phaser from "phaser";
import { Audiolist } from "../utils/AudioList";

export default class Sounds{

    private scene: any;
    private list: any;

    constructor(scene:Phaser.Scene){
        this.scene = scene;
        this.list = {};
    }

    public load(name: any){
        if(Audiolist[name]){
            if(this.list[name] == null || this.list[name] == undefined){
                this.list[name] = {}
                for(const key in Audiolist[name]){
                    this.list[name][key] = this.scene.sound.add(key,{
                        volume: Audiolist[name][key][1],
                        delay: Audiolist[name][key][3],
                        loop: Audiolist[name][key][2],
                    });
                }
            }
        }
    }

    public play(lname: any, fname: any, listener: any){
        if(this.list){
            if(this.list[lname] && this.list[lname][fname]){
                this.list[lname][fname].play();
                this.list[lname][fname].once('complete',()=>{
                    if(typeof listener == "function"){
                        listener();
                    }
                })
            }
        }
    }

    public stop(lname: any, fname: any){
        if(this.list){
            if(this.list[lname] && this.list[lname][fname]){
                this.list[lname][fname].stop();
            }
        }
    }

    public pause(lname: any, fname: any){
        if(this.list){
            if(this.list[lname] && this.list[lname][fname]){
                this.list[lname][fname].pause();
            }
        }
    }

    public resume(lname: any, fname: any){
        if(this.list){
            if(this.list[lname] && this.list[lname][fname]){
                this.list[lname][fname].resume();
            }
        }
    }

}