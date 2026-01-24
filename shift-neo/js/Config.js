export const Config = {
    width: 1920,
    height: 1080,
    duration: 45,
    gravity: 12,
    truckSpeed: 1.5,
    truckFriction: 0.92,
    truckScale: 0.3,
    truckMaxSpeed: 25,
    truckTilt: 0.15,
    wheelSpinRate: 0.02,
    streakThreshold: 3,
    baseScore: 150,
    prizeScore: 1000,
    parallax: {
        tunnel: 0.12
    },
    partScale: 0.5,
    hazardScale: 0.12,
    hazardBackdropColor: 0xff2f01,
    hazardBackdropRadius: 0.38,
    ambient: {
        dustInterval: 45,
        dustLimit: 30
    },
    spawnRates: {
        start: 90,
        mid: 70,
        end: 55
    }
};

const partPalette = 0xffd400;

export const GameAssets = {
    truck: 'assets/dumper_optimized.png',
    truckWheel: 'assets/tire_optimized.png',
    background: 'assets/bg_tunnel.jpg',
    goodParts: [
        { texture: 'assets/part_0.png', label: 'Turbo Core', score: 150, weight: 1.2, particleColor: partPalette },
        { texture: 'assets/part_1.png', label: 'Precision Hub', score: 150, weight: 1.1, particleColor: partPalette },
        { texture: 'assets/part_2.png', label: 'Hydraulic Seal', score: 150, weight: 1.3, particleColor: partPalette },
        { texture: 'assets/part_3.png', label: 'Fuel Injector', score: 150, weight: 0.9, particleColor: partPalette },
        { texture: 'assets/part_4.png', label: 'Ceramic Brake', score: 150, weight: 1.0, particleColor: partPalette },
        { texture: 'assets/part_5.png', label: 'Bearing Crown', score: 150, weight: 1.4, particleColor: partPalette },
        { texture: 'assets/part_6.png', label: 'Transmission Disc', score: 150, weight: 1.0, particleColor: partPalette },
        { texture: 'assets/part_7.png', label: 'Charge Cooler', score: 150, weight: 0.8, particleColor: partPalette },
        { texture: 'assets/part_8.png', label: 'Stator Gear', score: 150, weight: 1.2, particleColor: partPalette }
    ],
    badParts: [
        {
            texture: 'assets/rock.png',
            label: 'Rockfall',
            damage: -120,
            weight: 1.2,
            particleColor: 0xff2f01,
            type: 'bad',
            scale: 0.12
        }
    ]
};

