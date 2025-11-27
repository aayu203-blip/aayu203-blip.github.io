export const Config = {
    width: 1920,
    height: 1080,
    duration: 45,
    gravity: 12,
    truckSpeed: 1.5,
    truckFriction: 0.92,
    truckScale: 0.6,
    truckMaxSpeed: 25,
    truckTilt: 0.15,
    wheelSpinRate: 0.02,
    wheelSpinRate: 0.02,
    streakThreshold: 3,
    lives: 3,
    parallax: {
        tunnel: 0.12
    },
    partScale: 0.55,
    hazardScale: 0.48,
    hazardBackdropColor: 0xff2f01,
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
    truck: 'assets/dumper.png',
    background: 'assets/bg_tunnel.jpg',
    goodParts: [
        { texture: 'assets/part_0.png', label: 'Turbo Core', score: 60, weight: 1.2, particleColor: partPalette },
        { texture: 'assets/part_1.png', label: 'Precision Hub', score: 55, weight: 1.1, particleColor: partPalette },
        { texture: 'assets/part_2.png', label: 'Hydraulic Seal', score: 40, weight: 1.3, particleColor: partPalette },
        { texture: 'assets/part_3.png', label: 'Fuel Injector', score: 65, weight: 0.9, particleColor: partPalette },
        { texture: 'assets/part_4.png', label: 'Ceramic Brake', score: 70, weight: 1.0, particleColor: partPalette },
        { texture: 'assets/part_5.png', label: 'Bearing Crown', score: 45, weight: 1.4, particleColor: partPalette },
        { texture: 'assets/part_6.png', label: 'Transmission Disc', score: 55, weight: 1.0, particleColor: partPalette },
        { texture: 'assets/part_7.png', label: 'Charge Cooler', score: 80, weight: 0.8, particleColor: partPalette },
        { texture: 'assets/part_8.png', label: 'Stator Gear', score: 50, weight: 1.2, particleColor: partPalette }
    ],
    badParts: [
        { texture: 'assets/rock.png', label: 'Rockfall', damage: -120, weight: 1.4, particleColor: 0xff2f01, type: 'bad' },
        { texture: 'assets/beam.png', label: 'Bent Beam', damage: -90, weight: 0.9, particleColor: 0xff6200, type: 'bad' }
    ]
};

