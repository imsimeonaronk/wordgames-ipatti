import { Assets } from "./Assets";
import { Gvar } from "./Gvar";

class ExplodeParticle extends Phaser.GameObjects.Container{
    
    private particles: Phaser.GameObjects.Particles.ParticleEmitter | undefined;
    
    constructor(scene: Phaser.Scene){
        super(scene,0,0);
        scene.add.existing(this);
    }

    public init(){
        let particlesize = 0.12;
        if(Gvar.scaleRatio == 0.68)
            particlesize = 0.17;
        this.particles = this.scene.add.particles(0,0,Assets.Sprites.star[0],{
            frame: [
                'star-1.png', 'star-2.png'
            ],
            lifespan: 3000,
            speed: { min: 50, max: 200 },
            scale: { start: particlesize, end: 0 },
            rotate: { start: 0, end: 360 },
            gravityY: 600,
            emitting: false,
            duration: 2000,
            active: true
        });
        this.particles.stop();
        this.add(this.particles);
    }

    public explode(pointer: any){
        this.particles!.emitParticleAt(pointer.x, pointer.y, 20);
    }

    public clear(){
        this.particles?.stop();
        this.particles?.destroy();
    }

}

export default ExplodeParticle;