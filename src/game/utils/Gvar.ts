export const Gvar:any = {
    LoggedUser: {name:""},
    debug: false,
    orientation: "landscape",
    sceneMoveDelay: 500,
    GameData: {
        Id: 0,
    },
    platformData: {},
    fontPadding:{
        "noto-tamil":[0,0.35,0,0.35]
    },
    fileextension:(str:any)=>{
        if(str && str != ""){
            let n = str.lastIndexOf(".");
            return (n > -1 ? str.substr(0, n) : str);
        }else{
            return "";
        }
    },
    filenamesuffix:(filename: string, suffix: string): string=>{
        const dotIndex = filename.lastIndexOf('.');
        if (dotIndex === -1) return filename + suffix; // No extension case
        const name = filename.slice(0, dotIndex);
        const ext = filename.slice(dotIndex);
        return `${name}${suffix}${ext}`;
    },
    numberfromstring:(text:string)=>{
        return parseInt(text.replace(/[^0-9]/g, ''));
    },
    istablet:()=>{
        const userAgent = navigator.userAgent.toLowerCase();
        const isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(userAgent);
        return isTablet;
    },
    consolelog:(message:string)=>{
        if(Gvar.debug){
            console.log(message)
        }
    },
    getradius:(fw:number,fh:number,cratio:number = 0.15)=>{
        let radius = Math.sqrt(Math.pow(fw,2)+Math.pow(fh,2)) / 2;
        let corner = Math.floor(radius * cratio);
        return [radius, corner];
    },
    setfontpading:function(type:string,txt:any,fsize:number){
        const padding = this.fontPadding[type];
        if(padding){
            txt.setPadding(fsize * padding[0], fsize * padding[1], fsize * padding[2], fsize * padding[3]);
        }
    },
}