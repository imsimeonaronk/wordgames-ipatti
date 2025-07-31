export const Gvar:any = {
    debug: true,
    orientation: "landscape",
    sceneMoveDelay: 500,
    GameData: {
        Id: 0,
    },
    platformData: {},
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
}