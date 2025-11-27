export const Config = {
    width: 1920,
    height: 1080,
    duration: 45,
    gravity: 0.35,
    truckSpeed: 1.4,
    truckFriction: 0.92,
    truckMaxSpeed: 24,
    truckTilt: 0.12,
    streakThreshold: 3,
    baseScore: 80,
    hazardPenalty: 60,
    prizeTarget: 1000,
    spawn: {
        start: 95,
        mid: 70,
        end: 55
    },
    assets: {
        background: 'assets/background.jpg',
        truckBody: 'assets/truck.png',
        truckWheel: 'assets/truck_wheel.png'
    }
};

export const PARTS = [
    {
        name: 'Hydraulic Cylinder',
        description: 'Flow Stabilizer Cartridge',
        texture: 'assets/part_hydraulic_cylinder.png'
    },
    {
        name: 'Bucket Tooth Assembly',
        description: 'Excavation Interface',
        texture: 'assets/part_bucket_tooth.png'
    },
    {
        name: 'Fuel Filter Canister',
        description: 'Diesel Purification Module',
        texture: 'assets/part_fuel_filter.png'
    },
    {
        name: 'Planetary Ring Gear',
        description: 'Final Drive Array',
        texture: 'assets/part_planetary_ring.png'
    },
    {
        name: 'Clutch Disc',
        description: 'Torque Transfer Element',
        texture: 'assets/part_clutch_disc.png'
    },
    {
        name: 'Coil Spring',
        description: 'Suspension Energy Store',
        texture: 'assets/part_coil_spring.png'
    },
    {
        name: 'Bolt + Nut Assembly',
        description: 'Structural Fastener',
        texture: 'assets/part_bolt_nut.png'
    }
];

export const HAZARDS = [
    {
        name: 'Fault Cluster',
        texture: 'assets/hazard_rock_a.png'
    },
    {
        name: 'Fault Cluster',
        texture: 'assets/hazard_rock_b.png'
    },
    {
        name: 'Fault Cluster',
        texture: 'assets/hazard_rock_c.png'
    },
    {
        name: 'Fault Cluster',
        texture: 'assets/hazard_rock_d.png'
    }
];

export const TICKER_MESSAGES = [
    'Volvo engine assemblies on 24H standby · PTC Mumbai',
    'Komatsu hydraulic systems calibrated · PTC Gravity Line',
    'Scania braking solutions stocked · PTC Warehouse',
    'CAT drivetrain kits cleared for export · PTC Command'
];

