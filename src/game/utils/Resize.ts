import { Gvar } from "./Gvar";

export const ResizePhaserGame = (isNativeApp: boolean) => {
    const w = window.innerWidth
    const h = window.innerHeight

    // smooth scaling
    const smooth = Gvar.isDesktop ? 2.0 : 1.5;
    Gvar.defaultWidth = w;
    Gvar.defaultHeight = h;
    
    Gvar.scaleRatio = 1;
    if(Gvar.istablet() || Gvar.isDesktop)
        Gvar.scaleRatio = 0.68;

    const width = Gvar.defaultWidth
    const height = Gvar.defaultHeight

    const maxWidth = w * window.devicePixelRatio;
    const maxHeight = h * window.devicePixelRatio;

    const scale = Math.min(w / width, h / height)
    const newWidth = Math.min(w / scale, maxWidth)
    const newHeight = Math.min(h / scale, maxHeight)

    //Update size
    Gvar.width = Math.round(newWidth * smooth);
    Gvar.height = Math.round(newHeight * smooth);

    Gvar.centerX = Gvar.width * 0.5;
    Gvar.centerY = Gvar.height * 0.5;

    // resize the game
    window.Game!.scale.resize(Gvar.width, Gvar.height);

    // scale the width and height of the css
    window.Game!.canvas.style.width = Math.round(newWidth * scale) + 'px';
    window.Game!.canvas.style.height = Math.round(newHeight * scale) + 'px';

    // center the game with css margin
    window.Game!.canvas.style.paddingTop = Math.round( (h - Math.round(newHeight * scale)) / 2 ) + 'px';
    window.Game!.canvas.style.paddingLeft = Math.round( (w - Math.round(newWidth * scale)) / 2 ) + 'px';
};
