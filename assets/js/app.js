const {
  useState,
  useEffect,
  useContext,
  createContext,
  useRef,
  useCallback
} = React;
const D = "'Barlow Condensed',sans-serif";
const B = "'Barlow',sans-serif";
const AMBER = '#FFB81C';
const WG = '#25D366';
const WA = txt => `https://wa.me/919821037990?text=${encodeURIComponent(txt)}`;
const EMAIL = 'parts@partstrading.com';
const BRANDS_NAV = [{
  name: 'Volvo',
  slug: 'volvo'
}, {
  name: 'Scania',
  slug: 'scania'
}, {
  name: 'Komatsu',
  slug: 'komatsu'
}, {
  name: 'CAT',
  slug: 'cat'
}, {
  name: 'Hitachi',
  slug: 'hitachi'
}, {
  name: 'Hyundai',
  slug: 'hyundai'
}, {
  name: 'BEML',
  slug: 'beml'
}, {
  name: 'LiuGong',
  slug: 'liugong'
}];
const CATS_NAV = ['Engine Parts', 'Hydraulic Parts', 'Filters', 'Electrical Parts', 'Transmission Parts', 'Undercarriage', 'Brake Parts', 'Cooling System', 'Exhaust & Turbo', 'Seals & O-Rings', 'Cab & Body Parts', 'Bearing & Bushing', 'Fuel System', 'Drive & Swing Parts', 'Ground Engaging Tools', 'Hardware & Fasteners', 'Suspension & Chassis', 'Gearbox & Differential', 'Steering Parts'];
const CATS_NAV_URLS = {
  'Engine Parts': '/volvo/engine-parts/',
  'Hydraulic Parts': '/volvo/hydraulic-parts/',
  'Filters': '/volvo/filters/',
  'Electrical Parts': '/volvo/electrical-parts/',
  'Transmission Parts': '/volvo/transmission-parts/',
  'Undercarriage': '/volvo/undercarriage/',
  'Brake Parts': '/volvo/brake-parts/',
  'Cooling System': '/volvo/cooling-system/',
  'Exhaust & Turbo': '/volvo/exhaust-turbo/',
  'Seals & O-Rings': '/volvo/seals-orings/',
  'Cab & Body Parts': '/volvo/cab-body-parts/',
  'Bearing & Bushing': '/volvo/bearing-bushing/',
  'Fuel System': '/volvo/fuel-system/',
  'Drive & Swing Parts': '/komatsu/drive-swing-parts/',
  'Ground Engaging Tools': '/komatsu/ground-engaging-tools/',
  'Hardware & Fasteners': '/volvo/hardware-fasteners/',
  'Suspension & Chassis': '/volvo/suspension-chassis/',
  'Gearbox & Differential': '/volvo/gearbox-differential/',
  'Steering Parts': '/volvo/steering-parts/'
};
const DARK_T = {
  bg: '#050505',
  bgCard: '#0F0F0F',
  bgSection: '#080808',
  bgAlt: '#0C0C0C',
  text: '#F0ECE6',
  textMuted: '#ABABAB',
  accent: '#FFB81C',
  accentDark: '#050505',
  border: 'rgba(255,255,255,0.055)',
  navBg: 'rgba(5,5,5,0.97)',
  navText: '#F0ECE6',
  heroOverlay: 'rgba(0,0,0,0.76)',
  statsBg: '#FFB81C',
  statsText: '#050505',
  statsMuted: 'rgba(0,0,0,0.5)',
  brandsBg: '#080808',
  tagBg: 'rgba(255,184,28,0.09)',
  tagText: '#FFB81C',
  inputBg: 'rgba(255,255,255,0.06)',
  inputBorder: 'rgba(255,255,255,0.1)',
  footerBg: '#020202'
};
const LIGHT_T = {
  bg: '#F7F7F7',
  bgCard: '#FFFFFF',
  bgSection: '#EFEFEF',
  bgAlt: '#E8E8E8',
  text: '#111111',
  textMuted: '#666666',
  accent: '#E8A000',
  accentDark: '#111111',
  border: 'rgba(0,0,0,0.09)',
  navBg: 'rgba(255,255,255,0.97)',
  navText: '#111111',
  heroOverlay: 'rgba(0,0,0,0.74)',
  statsBg: '#111111',
  statsText: '#FFCD11',
  statsMuted: 'rgba(255,255,255,0.5)',
  brandsBg: '#EEEEEE',
  tagBg: 'rgba(232,160,0,0.10)',
  tagText: '#8A4A00',
  inputBg: 'rgba(0,0,0,0.04)',
  inputBorder: 'rgba(0,0,0,0.13)',
  footerBg: '#111111'
};
const ALL_BRANDS = [{
  name: 'Volvo',
  models: ['EC140', 'EC210', 'EC240', 'EC290', 'EC330', 'EC360', 'EC460', 'EC480', 'EC700', 'FH12', 'FH13', 'FH16', 'FH400', 'FH440', 'FH460', 'FH480', 'FH500', 'FH520', 'FH540', 'FM9', 'FM10', 'FM12', 'FM13', 'FM340', 'FM370', 'FM400', 'FM410', 'FM440', 'FM460', 'FM480', 'FMX330', 'FMX370', 'FMX410', 'FMX440', 'FMX460', 'FMX480', 'FMX500', 'FMX540', 'L60', 'L90', 'L110', 'L120', 'L150', 'L180', 'L220', 'L350', 'A25', 'A30', 'A35', 'A40', 'A45', 'A60']
}, {
  name: 'Scania',
  models: ['R340', 'R360', 'R370', 'R380', 'R400', 'R410', 'R420', 'R440', 'R450', 'R460', 'R480', 'R500', 'R520', 'R540', 'R580', 'R620', 'R650', 'R730', 'R770', 'S500', 'S520', 'S540', 'S580', 'S650', 'S730', 'S770', 'G340', 'G360', 'G380', 'G400', 'G420', 'G440', 'G460', 'G480', 'G500', 'P230', 'P280', 'P310', 'P340', 'P380', 'P410', 'P440', 'P480', 'P500']
}, {
  name: 'Komatsu',
  models: ['PC200', 'PC210', 'PC220', 'PC290', 'PC350', 'PC390', 'PC450', 'PC490', 'PC750', 'PC800', 'PC850', 'WA320', 'WA380', 'WA470', 'WA500', 'WA600', 'WA700', 'WA900', 'D37', 'D39', 'D51', 'D61', 'D65E', 'D65EX-15', 'D65PX-15', 'D85ESS', 'D85EX-15', 'D85PX-15', 'D155', 'D155A-6', 'D155AX-6', 'D275A-5', 'D375A-5', 'D475A-5', 'GD555-3', 'GD605', 'GD655-3', 'GD705', 'GD785', 'GD825A-2', 'HD465', 'HD465-7', 'HD605', 'HD785', 'HD785-5', 'HD1500', 'HD1500-7']
}, {
  name: 'CAT',
  models: ['312', '315', '318', '320', '321', '323', '325', '329', '330', '336', '340', '345', '349', '365', '374', '385', '390', '120H', '120M', '12M', '140H', '140M', '14M', '160M', '16M', '24M', '725', '730', '735', '740', '745', '770', '772', '773', '773E', '773F', '775F', '777', '777C', '777D', '777F', '785', '785C', '789', '789C', '793', '793C', '793F', '797F', '814F', '824C', '834G', '924', '930', '938', '950', '966', '972', '980', '988', '990', '994', '6015', '6020', '6030']
}, {
  name: 'Hitachi',
  models: ['ZX55', 'ZX75', 'ZX95', 'ZX135', 'ZX155', 'ZX200', 'ZX250', 'ZX300', 'ZX350', 'ZX450', 'ZX500', 'EX1200', 'EX1900', 'EX2500', 'ZW150', 'ZW180', 'ZW220', 'ZW250']
}, {
  name: 'Hyundai',
  models: ['R55', 'R80', 'R110', 'R130', 'R150', 'R170', 'R200', 'R220', 'R250', 'R300', 'R350', 'R450', 'HL730', 'HL740', 'HL750', 'HL760']
}, {
  name: 'BEML',
  models: ['BC160', 'BC180', 'BC260', 'BD50', 'BD50T', 'BD80', 'BD110', 'BD155', 'BD260', 'BE100', 'BE110', 'BE200', 'BE220', 'BE300', 'BE600', 'BE650', 'BE700', 'BE750', 'BE1000', 'BE1400', 'BG555', 'BG605', 'BG685', 'BG705', 'BH35', 'BH50', 'BH60', 'BH75', 'BH85', 'BH120', 'BH170', 'BL520', 'BL530', 'BL750', 'WL30', 'WL40', 'WL50']
}, {
  name: 'LiuGong',
  models: ['835', '855', '856', '877', '906', '915', '925', '936', '946', '956', '966', '976', 'D31', 'D41', 'D51']
}];
const ACTIVITY = [{
  flag: '🇮🇳',
  name: 'Rajesh M.',
  loc: 'Mumbai',
  part: 'Volvo FH16 Injector Kit',
  ago: '2 min ago'
}, {
  flag: '🇷🇺',
  name: 'Dmitri V.',
  loc: 'Moscow',
  part: 'Komatsu PC300 Hydraulic Pump',
  ago: '4 min ago'
}, {
  flag: '🇦🇪',
  name: 'Ahmad H.',
  loc: 'Dubai',
  part: 'CAT 777G Brake Pads (x4)',
  ago: '7 min ago'
}, {
  flag: '🇮🇩',
  name: 'Budi S.',
  loc: 'Jakarta',
  part: 'Scania R580 Clutch Kit',
  ago: '11 min ago'
}, {
  flag: '🇿🇦',
  name: 'Johan V.',
  loc: 'Johannesburg',
  part: 'Hitachi ZX300 Track Rollers',
  ago: '14 min ago'
}, {
  flag: '🇮🇳',
  name: 'Suresh P.',
  loc: 'Chennai',
  part: 'Komatsu D85 Final Drive',
  ago: '18 min ago'
}, {
  flag: '🇰🇪',
  name: 'James O.',
  loc: 'Nairobi',
  part: 'CAT 336 Hydraulic Hose Set',
  ago: '22 min ago'
}, {
  flag: '🇳🇬',
  name: 'Emeka A.',
  loc: 'Lagos',
  part: 'Volvo EC210 Engine Filter Kit',
  ago: '26 min ago'
}, {
  flag: '🇲🇾',
  name: 'Azrul K.',
  loc: 'Kuala Lumpur',
  part: 'Scania DC13 Turbocharger',
  ago: '31 min ago'
}, {
  flag: '🇧🇩',
  name: 'Rafiq H.',
  loc: 'Dhaka',
  part: 'Komatsu PC200 Swing Motor',
  ago: '35 min ago'
}, {
  flag: '🇺🇿',
  name: 'Timur N.',
  loc: 'Tashkent',
  part: 'Volvo A40 Axle Shaft',
  ago: '38 min ago'
}, {
  flag: '🇮🇳',
  name: 'Pradeep K.',
  loc: 'Hyderabad',
  part: 'CAT 320 Boom Cylinder Seal Kit',
  ago: '42 min ago'
}, {
  flag: '🇹🇿',
  name: 'David M.',
  loc: 'Dar es Salaam',
  part: 'Hitachi EX1200 Bucket Pin Set',
  ago: '47 min ago'
}, {
  flag: '🇵🇰',
  name: 'Tariq A.',
  loc: 'Karachi',
  part: 'Scania R440 Gearbox Oil Pump',
  ago: '51 min ago'
}, {
  flag: '🇷🇺',
  name: 'Sergei P.',
  loc: 'Novosibirsk',
  part: 'Komatsu D155 Track Shoe Assembly',
  ago: '55 min ago'
}, {
  flag: '🇮🇳',
  name: 'Arjun S.',
  loc: 'Pune',
  part: 'Volvo EC290 Hydraulic Pump',
  ago: '1 hr ago'
}, {
  flag: '🇿🇲',
  name: 'Chanda B.',
  loc: 'Lusaka',
  part: 'CAT 773 Brake Accumulator',
  ago: '1 hr ago'
}, {
  flag: '🇦🇺',
  name: 'Kyle R.',
  loc: 'Perth',
  part: 'Komatsu WA500 Transmission Kit',
  ago: '1 hr ago'
}, {
  flag: '🇵🇭',
  name: 'Ramon D.',
  loc: 'Manila',
  part: 'Volvo D13 Piston Ring Set',
  ago: '1 hr ago'
}, {
  flag: '🇦🇪',
  name: 'Khalid M.',
  loc: 'Abu Dhabi',
  part: 'CAT 390 Swing Bearing',
  ago: '2 hrs ago'
}, {
  flag: '🇮🇳',
  name: 'Vinod T.',
  loc: 'Kolkata',
  part: 'Scania P440 Air Dryer Cartridge',
  ago: '2 hrs ago'
}, {
  flag: '🇲🇳',
  name: 'Gantulga D.',
  loc: 'Ulaanbaatar',
  part: 'Hitachi ZX450 Final Drive',
  ago: '2 hrs ago'
}, {
  flag: '🇲🇿',
  name: 'Armando F.',
  loc: 'Maputo',
  part: 'Komatsu PC800 Engine Liner Kit',
  ago: '2 hrs ago'
}, {
  flag: '🇻🇳',
  name: 'Nguyen T.',
  loc: 'Ho Chi Minh City',
  part: 'Volvo FH13 Water Pump',
  ago: '2 hrs ago'
}, {
  flag: '🇷🇺',
  name: 'Alexei M.',
  loc: 'Kemerovo',
  part: 'CAT 785 Wheel Motor Assembly',
  ago: '3 hrs ago'
}, {
  flag: '🇮🇳',
  name: 'Mohan R.',
  loc: 'Bhubaneswar',
  part: 'Komatsu HD785 Suspension Cylinder',
  ago: '3 hrs ago'
}, {
  flag: '🇸🇬',
  name: 'Wei L.',
  loc: 'Singapore',
  part: 'Scania R730 Cylinder Head Gasket',
  ago: '3 hrs ago'
}, {
  flag: '🇬🇭',
  name: 'Kwame A.',
  loc: 'Accra',
  part: 'CAT 140M Grader Circle Drive',
  ago: '3 hrs ago'
}, {
  flag: '🇮🇩',
  name: 'Hendra W.',
  loc: 'Balikpapan',
  part: 'Hitachi ZX200 Arm Cylinder Seal',
  ago: '4 hrs ago'
}, {
  flag: '🇮🇳',
  name: 'Sanjay B.',
  loc: 'Nagpur',
  part: 'Volvo L120 Torque Converter',
  ago: '4 hrs ago'
}, {
  flag: '🇰🇿',
  name: 'Marat S.',
  loc: 'Almaty',
  part: 'Komatsu GD825 Motor Grader Blade',
  ago: '4 hrs ago'
}, {
  flag: '🇲🇲',
  name: 'Kyaw T.',
  loc: 'Yangon',
  part: 'CAT 329 Boom Pin & Bushing Set',
  ago: '4 hrs ago'
}, {
  flag: '🇪🇬',
  name: 'Khaled F.',
  loc: 'Cairo',
  part: 'Scania G440 Clutch Pressure Plate',
  ago: '5 hrs ago'
}, {
  flag: '🇿🇦',
  name: 'Pieter B.',
  loc: 'Rustenburg',
  part: 'Hitachi EX1900 Hydraulic Cylinder',
  ago: '5 hrs ago'
}, {
  flag: '🇮🇳',
  name: 'Deepak J.',
  loc: 'Raipur',
  part: 'Komatsu PC490 Travel Motor',
  ago: '5 hrs ago'
}, {
  flag: '🇱🇰',
  name: 'Nimal P.',
  loc: 'Colombo',
  part: 'Volvo FMX440 Rear Axle Shaft',
  ago: '5 hrs ago'
}, {
  flag: '🇷🇺',
  name: 'Viktor Z.',
  loc: 'Krasnoyarsk',
  part: 'CAT 793F Tyre Pressure Sensor',
  ago: '6 hrs ago'
}, {
  flag: '🇮🇩',
  name: 'Agus R.',
  loc: 'Samarinda',
  part: 'Komatsu PC750 Engine Oil Cooler',
  ago: '6 hrs ago'
}, {
  flag: '🇳🇬',
  name: 'Chukwu O.',
  loc: 'Port Harcourt',
  part: 'Scania FMS Turbocharger Kit',
  ago: '6 hrs ago'
}, {
  flag: '🇮🇳',
  name: 'Ramesh N.',
  loc: 'Dhanbad',
  part: 'CAT 336 Excavator Bucket Pins',
  ago: '7 hrs ago'
}];
const COUNTRIES = [{
  flag: '🇮🇳',
  name: 'India',
  code: 'IN'
}, {
  flag: '🇺🇸',
  name: 'United States',
  code: 'US'
}, {
  flag: '🇬🇧',
  name: 'United Kingdom',
  code: 'GB'
}, {
  flag: '🇷🇺',
  name: 'Russia',
  code: 'RU'
}, {
  flag: '🇦🇪',
  name: 'UAE',
  code: 'AE'
}, {
  flag: '🇩🇪',
  name: 'Germany',
  code: 'DE'
}, {
  flag: '🇨🇦',
  name: 'Canada',
  code: 'CA'
}, {
  flag: '🇫🇷',
  name: 'France',
  code: 'FR'
}, {
  flag: '🇦🇺',
  name: 'Australia',
  code: 'AU'
}, {
  flag: '🇮🇩',
  name: 'Indonesia',
  code: 'ID'
}, {
  flag: '🇿🇦',
  name: 'South Africa',
  code: 'ZA'
}, {
  flag: '🇳🇬',
  name: 'Nigeria',
  code: 'NG'
}, {
  flag: '🇰🇪',
  name: 'Kenya',
  code: 'KE'
}, {
  flag: '🇬🇭',
  name: 'Ghana',
  code: 'GH'
}, {
  flag: '🇪🇬',
  name: 'Egypt',
  code: 'EG'
}, {
  flag: '🇸🇦',
  name: 'Saudi Arabia',
  code: 'SA'
}, {
  flag: '🇶🇦',
  name: 'Qatar',
  code: 'QA'
}, {
  flag: '🇸🇬',
  name: 'Singapore',
  code: 'SG'
}, {
  flag: '🇲🇾',
  name: 'Malaysia',
  code: 'MY'
}, {
  flag: '🇧🇩',
  name: 'Bangladesh',
  code: 'BD'
}, {
  flag: '🇵🇰',
  name: 'Pakistan',
  code: 'PK'
}, {
  flag: '🇱🇰',
  name: 'Sri Lanka',
  code: 'LK'
}, {
  flag: '🇹🇿',
  name: 'Tanzania',
  code: 'TZ'
}, {
  flag: '🇲🇿',
  name: 'Mozambique',
  code: 'MZ'
}, {
  flag: '🇲🇲',
  name: 'Myanmar',
  code: 'MM'
}, {
  flag: '🇧🇷',
  name: 'Brazil',
  code: 'BR'
}, {
  flag: '🇨🇱',
  name: 'Chile',
  code: 'CL'
}, {
  flag: '🇵🇭',
  name: 'Philippines',
  code: 'PH'
}, {
  flag: '🇻🇳',
  name: 'Vietnam',
  code: 'VN'
}, {
  flag: '🇯🇵',
  name: 'Japan',
  code: 'JP'
}, {
  flag: '🇲🇳',
  name: 'Mongolia',
  code: 'MN'
}, {
  flag: '🇺🇿',
  name: 'Uzbekistan',
  code: 'UZ'
}, {
  flag: '🇰🇿',
  name: 'Kazakhstan',
  code: 'KZ'
}];
const STATS = [{
  raw: 70000,
  display: '75,000+',
  label: 'Parts in Stock'
}, {
  raw: 70,
  display: '70+',
  label: 'Years Trusted'
}, {
  raw: 16,
  display: '16+',
  label: 'Equipment Brands'
}, {
  raw: 50,
  display: '50+',
  label: 'Countries Served'
}];
const CATS = [{
  name: 'Engine Parts',
  count: '15,600+',
  desc: 'Pistons, liners, bearings & rebuild kits',
  href: '/volvo/engine-parts/'
}, {
  name: 'Hydraulic Parts',
  count: '4,700+',
  desc: 'Pumps, motors, cylinders & hoses',
  href: '/komatsu/hydraulic-parts/'
}, {
  name: 'Electrical',
  count: '1,300+',
  desc: 'Alternators, starters, ECUs & sensors',
  href: '/volvo/electrical-parts/'
}, {
  name: 'Filters',
  count: '1,400+',
  desc: 'OEM & aftermarket — all brands',
  href: '/volvo/filters/'
}, {
  name: 'Undercarriage',
  count: '3,600+',
  desc: 'Track shoes, rollers, sprockets & chains',
  href: '/komatsu/undercarriage/'
}, {
  name: 'Transmission',
  count: '1,100+',
  desc: 'Gearboxes, clutch packs & converters',
  href: '/volvo/transmission-parts/'
}, {
  name: 'Brake Systems',
  count: '1,000+',
  desc: 'Pads, discs, calipers & air systems',
  href: '/volvo/brake-parts/'
}, {
  name: 'Cooling System',
  count: '1,300+',
  desc: 'Radiators, thermostats & water pumps',
  href: '/volvo/cooling-system/'
}];
const TESTIMONIALS = [{
  name: 'Rajesh Mehta',
  role: 'Fleet Manager',
  loc: 'Maharashtra, India',
  flag: '🇮🇳',
  text: 'PTC has been our trusted partner for 15+ years. When a machine goes down, I call PTC first. Same-day dispatch from Mumbai has saved us lakhs in downtime.'
}, {
  name: 'Ivan Petrov',
  role: 'Mining Operations Director',
  loc: 'Kemerovo, Russia',
  flag: '🇷🇺',
  text: 'Reliable Komatsu and Scania parts shipped reliably to Russia. Quality is always OEM standard. PTC understands the urgency of mining operations.'
}, {
  name: 'Ahmad Hassan',
  role: 'VP Procurement',
  loc: 'Dubai, UAE',
  flag: '🇦🇪',
  text: "We've sourced CAT and Hitachi parts from PTC for 8 years. Their pricing, packaging, and speed for international shipping is unmatched."
}];
const BLOG = [{
  tag: 'Volvo',
  title: 'Volvo D13 Engine: Common Problems & Fixes',
  date: 'Mar 2025',
  read: '8 min',
  href: '/blog/volvo-d13-engine-common-problems-and-fixes.html',
  cover: 'assets/images/blog/volvo-injector.jpg'
}, {
  tag: 'Komatsu',
  title: 'Komatsu Hydraulic Pump Failure: Signs & Solutions',
  date: 'Jan 2025',
  read: '7 min',
  href: '/blog/komatsu-hydraulic-pump-failure-symptoms.html',
  cover: 'assets/images/blog/komatsu-pump.jpg'
}, {
  tag: 'Scania',
  title: 'Scania PDE vs HPI Injectors — Full Comparison',
  date: 'Feb 2025',
  read: '6 min',
  href: '/blog/scania-pde-vs-hpi-injectors-explained.html',
  cover: 'assets/images/blog/scania-injector.jpg'
}];

// ── HOOKS ─────────────────────────────────────────────────────────────────────
function useInView(options = {}) {
  const ref = useRef();
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setInView(true);
        obs.disconnect();
      }
    }, options);
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}
function useCounter(target, inView, duration = 1800) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(ease * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target]);
  return val;
}
function useDispatchCountdown() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const ist = new Date(now.toLocaleString('en-US', {
        timeZone: 'Asia/Kolkata'
      }));
      const cutoff = new Date(ist);
      cutoff.setHours(15, 0, 0, 0);
      if (ist >= cutoff) {
        setTime('Tomorrow at 9 AM');
        return;
      }
      const diff = cutoff - ist;
      const h = Math.floor(diff / 3600000);
      const m = Math.floor(diff % 3600000 / 60000);
      setTime(`${h}h ${m}m`);
    };
    calc();
    const id = setInterval(calc, 30000);
    return () => clearInterval(id);
  }, []);
  return time;
}
function useIsMobile(bp = 768) {
  const [m, setM] = useState(typeof window !== 'undefined' && window.innerWidth <= bp);
  useEffect(() => {
    const h = () => setM(window.innerWidth <= bp);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, [bp]);
  return m;
}

// ── GEO ──────────────────────────────────────────────────────────────────────
const GeoCtx = createContext(null);
const useGeo = () => useContext(GeoCtx);

// ── THEME CONTEXT ────────────────────────────────────────────────────────────
const ThemeCtx = createContext({
  T: DARK_T,
  AMBER: '#FFB81C',
  isDark: true,
  toggle: () => {},
  isMobile: false
});
const useTheme = () => useContext(ThemeCtx);

// Regions with low WhatsApp penetration — email shown first in contact form
const EMAIL_FIRST = new Set(['US', 'CA', 'GB', 'DE', 'FR', 'JP', 'KR', 'IT', 'ES', 'NL', 'SE', 'NO', 'DK', 'FI', 'CH', 'AT', 'BE', 'NZ', 'IE', 'PT', 'GR', 'CZ', 'PL', 'HU', 'AU']);
// Gulf countries
const GULF = new Set(['AE', 'SA', 'KW', 'QA', 'BH', 'OM', 'YE', 'IQ', 'JO']);
const geoShipping = geo => {
  if (!geo || !geo.country) return null;
  const c = geo.country;
  if (c === 'IN') return {
    est: '1–2 days',
    via: 'domestic courier'
  };
  if (GULF.has(c)) return {
    est: '3–5 days',
    via: 'DHL Express'
  };
  const map = {
    'AS': {
      est: '4–8 days',
      via: 'DHL / FedEx'
    },
    'EU': {
      est: '6–9 days',
      via: 'DHL / FedEx'
    },
    'AF': {
      est: '5–10 days',
      via: 'DHL / FedEx'
    },
    'NA': {
      est: '7–12 days',
      via: 'FedEx / DHL'
    },
    'SA': {
      est: '9–14 days',
      via: 'DHL / freight'
    },
    'OC': {
      est: '7–10 days',
      via: 'DHL / FedEx'
    }
  };
  return map[geo.continent] || {
    est: '5–12 days',
    via: 'DHL / FedEx'
  };
};

// 3 PM IST = 09:30 UTC — returns local equivalent string e.g. "5:00 AM EST"
const localCutoff = timezone => {
  if (!timezone) return '';
  try {
    const d = new Date();
    d.setUTCHours(9, 30, 0, 0);
    return d.toLocaleTimeString('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZoneName: 'short'
    });
  } catch (e) {
    return '';
  }
};

// ── SHARED ────────────────────────────────────────────────────────────────────
const Label = ({
  children,
  center = false
}) => {
  const {
    AMBER
  } = useTheme();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 12,
      justifyContent: center ? 'center' : 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 24,
      height: 2,
      background: AMBER
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: D,
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: AMBER
    }
  }, children), center && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 24,
      height: 2,
      background: AMBER
    }
  }));
};

// ── ANNOUNCEMENT BAR ──────────────────────────────────────────────────────────
function AnnouncementBar() {
  const {
    AMBER
  } = useTheme();
  const geo = useGeo();
  const ship = geoShipping(geo);
  const shippingItem = ship && geo ? geo.country === 'IN' ? `India domestic: ${ship.est} · same-day dispatch available` : `Ships to ${geo.countryName} in ${ship.est} via ${ship.via}` : 'Shipping to 50+ countries worldwide';
  const items = ['Order before 3 PM IST — ships same day', shippingItem, '75,000+ parts ready to dispatch, Mumbai', 'WhatsApp · Email · SWIFT & UPI accepted', 'Est. 1956 — 70 years of trusted supply'];
  const all = [...items, ...items];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: AMBER,
      overflow: 'hidden',
      padding: '9px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "act-inner",
    style: {
      display: 'flex',
      gap: 64,
      width: 'max-content',
      alignItems: 'center'
    }
  }, all.map((item, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      fontFamily: B,
      fontSize: 13,
      fontWeight: 600,
      color: '#050505',
      whiteSpace: 'nowrap'
    }
  }, item))));
}

// ── NAV ────────────────────────────────────────────────────────────────────────
function Nav({
  onSearchOpen
}) {
  const {
    T,
    AMBER,
    isDark,
    toggle
  } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [bOpen, setBOpen] = useState(false);
  const [cOpen, setCOpen] = useState(false);
  const bT = useRef(null);
  const cT = useRef(null);
  const [mOpen, setMOpen] = React.useState(false);
  React.useEffect(() => { document.body.style.overflow = mOpen ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [mOpen]);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h, {
      passive: true
    });
    return () => window.removeEventListener('scroll', h);
  }, []);
  const ob = () => {
    clearTimeout(bT.current);
    setBOpen(true);
  };
  const cb = () => {
    bT.current = setTimeout(() => setBOpen(false), 160);
  };
  const oc = () => {
    clearTimeout(cT.current);
    setCOpen(true);
  };
  const cc = () => {
    cT.current = setTimeout(() => setCOpen(false), 160);
  };
  const lnk = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: B,
    fontSize: 13,
    fontWeight: 500,
    color: T.navText,
    padding: '0 13px',
    height: 68,
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    textDecoration: 'none',
    opacity: 0.75,
    transition: 'opacity 0.18s',
    whiteSpace: 'nowrap'
  };
  const chev = open => /*#__PURE__*/React.createElement("svg", {
    width: "8",
    height: "5",
    viewBox: "0 0 8 5",
    fill: "none",
    style: {
      transform: open ? 'rotate(180deg)' : 'none',
      transition: 'transform 0.2s',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 1l3 3 3-3",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round"
  }));
  return /*#__PURE__*/React.createElement("nav", {
    "aria-label": "Main navigation",
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: scrolled ? T.navBg : 'rgba(5,5,5,0.9)',
      backdropFilter: 'blur(28px)',
      borderBottom: `1px solid ${scrolled ? T.border : 'transparent'}`,
      transition: 'all 0.3s'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1360,
      margin: '0 auto',
      padding: '0 32px',
      height: 68,
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "/",
    "aria-label": "Parts Trading Company \u2014 Home",
    style: {
      marginRight: 32,
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/images/ptc-logo.png",
    alt: "Parts Trading Company",
    style: {
      height: 48,
      width: 'auto'
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "desktop-nav-links",
    style: {
      display: 'flex',
      alignItems: 'center',
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "/",
    style: {
      ...lnk,
      textDecoration: 'none',
      opacity: 0.6,
      display: 'flex',
      alignItems: 'center',
      gap: 5
    },
    onMouseEnter: e => e.currentTarget.style.opacity = 1,
    onMouseLeave: e => e.currentTarget.style.opacity = 0.6
  }, /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.2"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "9 22 9 12 15 12 15 22"
  })), "Home"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    },
    onMouseEnter: ob,
    onMouseLeave: cb
  }, /*#__PURE__*/React.createElement("button", {
    style: lnk,
    onMouseEnter: e => e.currentTarget.style.opacity = 1,
    onMouseLeave: e => e.currentTarget.style.opacity = 0.75
  }, "By Brand ", chev(bOpen)), bOpen && /*#__PURE__*/React.createElement("div", {
    className: "mega-anim",
    style: {
      position: 'absolute',
      top: '100%',
      left: -16,
      background: '#080808',
      border: `1px solid ${T.border}`,
      borderTop: `2px solid ${AMBER}`,
      borderRadius: '0 0 16px 16px',
      padding: 18,
      width: 360,
      boxShadow: '0 40px 80px rgba(0,0,0,0.97)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: B,
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: '0.15em',
      color: T.textMuted,
      textTransform: 'uppercase',
      marginBottom: 12
    }
  }, "Browse by Brand"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 5
    }
  }, BRANDS_NAV.map(br => /*#__PURE__*/React.createElement("a", {
    key: br.name,
    href: `/${br.slug}/`,
    style: {
      display: 'flex',
      alignItems: 'center',
      padding: '9px 11px',
      borderRadius: 8,
      border: `1px solid ${T.border}`,
      background: 'rgba(255,255,255,0.025)',
      textDecoration: 'none',
      color: T.navText,
      fontFamily: B,
      fontSize: 12,
      fontWeight: 600,
      transition: 'all 0.18s'
    },
    onMouseEnter: e => {
      e.currentTarget.style.borderColor = AMBER;
      e.currentTarget.style.color = AMBER;
      e.currentTarget.style.background = 'rgba(255,184,28,0.08)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.borderColor = T.border;
      e.currentTarget.style.color = T.navText;
      e.currentTarget.style.background = 'rgba(255,255,255,0.025)';
    }
  }, br.name))))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    },
    onMouseEnter: oc,
    onMouseLeave: cc
  }, /*#__PURE__*/React.createElement("button", {
    style: lnk,
    onMouseEnter: e => e.currentTarget.style.opacity = 1,
    onMouseLeave: e => e.currentTarget.style.opacity = 0.75
  }, "By Category ", chev(cOpen)), cOpen && /*#__PURE__*/React.createElement("div", {
    className: "mega-anim",
    style: {
      position: 'absolute',
      top: '100%',
      left: -16,
      background: '#080808',
      border: `1px solid ${T.border}`,
      borderTop: `2px solid ${AMBER}`,
      borderRadius: '0 0 16px 16px',
      padding: 18,
      width: 510,
      boxShadow: '0 40px 80px rgba(0,0,0,0.97)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: B,
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: '0.15em',
      color: T.textMuted,
      textTransform: 'uppercase',
      marginBottom: 12
    }
  }, "Browse by Category"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 4
    }
  }, CATS_NAV.map(cat => /*#__PURE__*/React.createElement("a", {
    key: cat,
    href: CATS_NAV_URLS[cat] || '/',
    style: {
      display: 'block',
      padding: '7px 10px',
      borderRadius: 6,
      border: `1px solid ${T.border}`,
      background: 'rgba(255,255,255,0.018)',
      textDecoration: 'none',
      color: T.text,
      fontFamily: B,
      fontSize: 11,
      fontWeight: 500,
      transition: 'all 0.15s'
    },
    onMouseEnter: e => {
      e.currentTarget.style.color = AMBER;
      e.currentTarget.style.borderColor = 'rgba(255,184,28,0.3)';
      e.currentTarget.style.background = 'rgba(255,184,28,0.08)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.color = T.text;
      e.currentTarget.style.borderColor = T.border;
      e.currentTarget.style.background = 'rgba(255,255,255,0.018)';
    }
  }, cat))))), /*#__PURE__*/React.createElement("a", {
    href: "/blog/",
    style: {
      ...lnk,
      textDecoration: 'none'
    },
    onMouseEnter: e => e.currentTarget.style.opacity = 1,
    onMouseLeave: e => e.currentTarget.style.opacity = 0.75
  }, "Blog"), /*#__PURE__*/React.createElement("a", {
    href: "/about.html",
    style: {
      ...lnk,
      textDecoration: 'none'
    },
    onMouseEnter: e => e.currentTarget.style.opacity = 1,
    onMouseLeave: e => e.currentTarget.style.opacity = 0.75
  }, "About")), /*#__PURE__*/React.createElement("div", {
    style: {display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0}
  },
  /*#__PURE__*/React.createElement("button", {
    onClick: onSearchOpen, "aria-label": "Search parts",
    style: {display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', transition: 'all 0.2s'},
    onMouseEnter: e => { e.currentTarget.style.borderColor = AMBER; e.currentTarget.style.color = AMBER; e.currentTarget.style.background = 'rgba(255,184,28,0.1)'; },
    onMouseLeave: e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }
  }, /*#__PURE__*/React.createElement("svg", {width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.3"}, /*#__PURE__*/React.createElement("circle", {cx: "11", cy: "11", r: "8"}), /*#__PURE__*/React.createElement("path", {d: "m21 21-4.35-4.35"}))),
  /*#__PURE__*/React.createElement("a", {
    href: WA('Hi, I need a quote for heavy equipment spare parts. Please help.'),
    target: "_blank", rel: "noopener noreferrer", className: "desktop-nav-links",
    style: {display: 'inline-flex', alignItems: 'center', gap: 7, background: WG, color: '#fff', textDecoration: 'none', padding: '8px 16px', borderRadius: 8, fontFamily: B, fontWeight: 700, fontSize: 13, transition: 'opacity 0.2s', boxShadow: '0 2px 14px rgba(37,211,102,0.3)'},
    onMouseEnter: e => e.currentTarget.style.opacity = '0.85', onMouseLeave: e => e.currentTarget.style.opacity = '1'
  }, /*#__PURE__*/React.createElement(WASvg, {s: 13}), " WhatsApp"),
  /*#__PURE__*/React.createElement("a", {
    href: "#contact", className: "desktop-nav-links",
    style: {background: AMBER, color: '#050505', textDecoration: 'none', padding: '8px 18px', borderRadius: 8, fontFamily: D, fontWeight: 700, fontSize: 13, letterSpacing: '0.06em', textTransform: 'uppercase', transition: 'opacity 0.2s'},
    onMouseEnter: e => e.currentTarget.style.opacity = '0.82', onMouseLeave: e => e.currentTarget.style.opacity = '1'
  }, "Get Quote"),
  /*#__PURE__*/React.createElement("button", {
    onClick: () => setMOpen(o => !o), "aria-label": mOpen ? "Close menu" : "Open menu",
    "aria-expanded": mOpen, className: "mobile-menu-btn",
    style: {display: 'none', alignItems: 'center', justifyContent: 'center', width: 38, height: 38, borderRadius: 8, border: `1px solid ${mOpen ? AMBER : 'rgba(255,255,255,0.14)'}`, background: mOpen ? 'rgba(255,184,28,0.1)' : 'rgba(255,255,255,0.06)', color: mOpen ? AMBER : 'rgba(255,255,255,0.75)', cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0}
  }, mOpen
    ? /*#__PURE__*/React.createElement("svg", {width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5"}, /*#__PURE__*/React.createElement("path", {d: "M18 6 6 18M6 6l12 12"}))
    : /*#__PURE__*/React.createElement("svg", {width: "20", height: "14", viewBox: "0 0 24 16", fill: "none", stroke: "currentColor", strokeWidth: "2.4"}, /*#__PURE__*/React.createElement("path", {d: "M0 1h24M0 8h24M0 15h24"}))
  ))),
  mOpen && /*#__PURE__*/React.createElement(React.Fragment, null,
    /*#__PURE__*/React.createElement("div", {
      onClick: () => setMOpen(false),
      style: {position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)'}
    }),
    /*#__PURE__*/React.createElement("div", {
      style: {position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(300px,100vw)', zIndex: 1101, background: '#080808', borderLeft: '1px solid rgba(255,255,255,0.07)', overflowY: 'auto', display: 'flex', flexDirection: 'column', boxShadow: '-24px 0 80px rgba(0,0,0,0.9)'}
    },
      /*#__PURE__*/React.createElement("div", {style: {display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0}},
        /*#__PURE__*/React.createElement("a", {href: "/", style: {display: 'flex', alignItems: 'center'}},
          /*#__PURE__*/React.createElement("img", {src: "assets/images/ptc-logo.png", alt: "PTC", style: {height: 32, width: 'auto'}})
        ),
        /*#__PURE__*/React.createElement("button", {
          onClick: () => setMOpen(false), "aria-label": "Close menu",
          style: {width: 34, height: 34, borderRadius: 8, border: '1px solid rgba(255,255,255,0.09)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}
        }, /*#__PURE__*/React.createElement("svg", {width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5"}, /*#__PURE__*/React.createElement("path", {d: "M18 6 6 18M6 6l12 12"})))
      ),
      /*#__PURE__*/React.createElement("div", {style: {flex: 1, overflowY: 'auto'}},
        ['Home', 'Blog', 'About'].map(name => {
          const hrefs = {Home: '/', Blog: '/blog/', About: '/about.html'};
          return /*#__PURE__*/React.createElement("a", {key: name, href: hrefs[name], onClick: () => setMOpen(false), style: {display: 'flex', alignItems: 'center', padding: '14px 18px', color: 'rgba(255,255,255,0.82)', textDecoration: 'none', fontFamily: "'Inter',sans-serif", fontSize: 15, fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.04)'}}, name);
        }),
        /*#__PURE__*/React.createElement("div", {style: {padding: '18px 18px 8px'}},
          /*#__PURE__*/React.createElement("div", {style: {fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', marginBottom: 10}}, "Shop by Brand"),
          /*#__PURE__*/React.createElement("div", {style: {display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6}},
            BRANDS_NAV.map(br => /*#__PURE__*/React.createElement("a", {
              key: br.name, href: `/${br.slug}/`, onClick: () => setMOpen(false),
              style: {display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 6px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.025)', textDecoration: 'none', color: 'rgba(255,255,255,0.78)', fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 600, textAlign: 'center'}
            }, br.name))
          )
        )
      ),
      /*#__PURE__*/React.createElement("div", {style: {padding: '14px 18px 44px', display: 'flex', flexDirection: 'column', gap: 10, borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0}},
        /*#__PURE__*/React.createElement("a", {
          href: WA('Hi, I need a quote for heavy equipment spare parts. Please help.'),
          target: "_blank", rel: "noopener",
          style: {display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: '#25D366', color: '#fff', textDecoration: 'none', padding: '14px', borderRadius: 12, fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 16, letterSpacing: '0.05em'}
        }, /*#__PURE__*/React.createElement(WASvg, {s: 17}), "WhatsApp Us"),
        /*#__PURE__*/React.createElement("a", {
          href: "#contact", onClick: () => setMOpen(false),
          style: {display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFB81C', color: '#050505', textDecoration: 'none', padding: '14px', borderRadius: 12, fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 16, letterSpacing: '0.05em'}
        }, "Get Quote")
      )
    )
  ));
}

// ── HERO SEARCH ───────────────────────────────────────────────────────────────
const POPULAR_SEARCHES = [{
  label: 'EC210 Seal Kit',
  fill: 'EC210 seal'
}, {
  label: 'D13 Injector',
  fill: 'D13 injector'
}, {
  label: 'FH16 Alternator',
  fill: 'FH16 alternator'
}, {
  label: 'R580 Clutch Kit',
  fill: 'R580 clutch'
}, {
  label: 'Komatsu Filter',
  fill: 'komatsu filter'
}, {
  label: 'Track Roller',
  fill: 'track roller'
}, {
  label: 'Excavator Seal',
  fill: 'excavator seal'
}, {
  label: 'Hitachi Seal Kit',
  fill: 'hitachi seal'
}];
const WASvg = ({
  s = 14
}) => /*#__PURE__*/React.createElement("svg", {
  width: s,
  height: s,
  viewBox: "0 0 24 24",
  fill: "white",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("path", {
  d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
}));
// Lazy-load the product search index (1.1MB gzipped) only when the user
// actually interacts with search, instead of on every page load. The
// polling loop below (dbLoaded) already handles the async-arrival case
// gracefully, so this is a pure loading-trigger change, not a behavior
// change to the search UI itself.
let _searchDbRequested = false;
function ensureSearchDBLoaded() {
  if (_searchDbRequested) return;
  if (window.productSearchDB && window.productSearchDB.length > 0) return;
  _searchDbRequested = true;
  const s = document.createElement('script');
  s.src = '/assets/js/search-db.js';
  document.head.appendChild(s);
}
function HeroSearch({
  onSearchMode
}) {
  const {
    T,
    AMBER
  } = useTheme();
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [sm, setSm] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [brand, setBrand] = useState('All');
  const [dbLoaded, setDbLoaded] = useState(!!(window.productSearchDB && window.productSearchDB.length > 0));
  const [pos, setPos] = useState({
    top: 0,
    left: 0,
    width: 800
  });
  const inputRef = useRef();
  const barRef = useRef();
  const brands = ['All', 'Volvo', 'Scania', 'Komatsu', 'CAT', 'Hitachi', 'Sany', 'JCB'];
  useEffect(() => {
    if (dbLoaded) return;
    const t = setInterval(() => {
      if (window.productSearchDB && window.productSearchDB.length > 0) {
        setDbLoaded(true);
        clearInterval(t);
      }
    }, 300);
    return () => clearInterval(t);
  }, []);
  const doSearch = (query, b) => {
    if (query.length < 2) return [];
    const lq = query.toLowerCase();
    const words = lq.split(/\s+/).filter(w => w.length > 1);
    const matchEntry = (part, desc, brand) => {
      const combined = `${part} ${desc} ${brand}`.toLowerCase();
      return words.every(w => combined.includes(w));
    };
    if (window.productSearchDB && window.productSearchDB.length > 0) {
      return window.productSearchDB.filter(p => {
        const mq = matchEntry(p.part || '', p.desc || '', p.brand || '');
        const mb = b === 'All' || (p.brand || '').toLowerCase() === b.toLowerCase();
        return mq && mb;
      }).slice(0, 6);
    }
    return [];
  };
  useEffect(() => {
    setResults(doSearch(q, brand));
    setActiveIdx(-1);
  }, [q, brand, dbLoaded]);
  const calcPos = () => {
    if (!barRef.current) return;
    const r = barRef.current.getBoundingClientRect();
    setPos({
      top: r.bottom + 8,
      left: r.left,
      width: r.width
    });
  };
  const enter = () => {
    ensureSearchDBLoaded();
    setSm(true);
    onSearchMode(true);
    calcPos();
  };
  const exit = () => {
    setSm(false);
    onSearchMode(false);
    setQ('');
    setResults([]);
    setActiveIdx(-1);
    if (inputRef.current) inputRef.current.focus();
  };

  // Focus trap — runs when panel opens, scoped to the portal container
  useEffect(() => {
    if (!sm) return;
    const FOCUSABLE = 'a[href],button:not([disabled]),input,textarea,select,[tabindex]:not([tabindex="-1"])';
    const trap = e => {
      if (e.key !== 'Tab') return;
      const portal = document.getElementById('search-portal');
      if (!portal) return;
      const nodes = Array.from(portal.querySelectorAll(FOCUSABLE)).filter(el => {
        const s = window.getComputedStyle(el);
        return s.display !== 'none' && s.visibility !== 'hidden';
      });
      if (!nodes.length) return;
      const first = nodes[0],
        last = nodes[nodes.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', trap);
    return () => document.removeEventListener('keydown', trap);
  }, [sm]);

  // ESC key
  useEffect(() => {
    const fn = e => {
      if (e.key === 'Escape' && sm) exit();
    };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, [sm]);

  // Click outside
  useEffect(() => {
    if (!sm) return;
    const fn = e => {
      const p = document.getElementById('search-portal');
      if (p && p.contains(e.target)) return;
      if (barRef.current && barRef.current.contains(e.target)) return;
      exit();
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, [sm]);

  // Reposition on scroll/resize
  useEffect(() => {
    if (!sm) return;
    window.addEventListener('scroll', calcPos, {
      passive: true
    });
    window.addEventListener('resize', calcPos);
    return () => {
      window.removeEventListener('scroll', calcPos);
      window.removeEventListener('resize', calcPos);
    };
  }, [sm]);

  // Keyboard navigation
  const handleKey = e => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(i => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      if (activeIdx >= 0 && results[activeIdx]) {
        const r = results[activeIdx];
        window.location.href = r.url || `/search?q=${encodeURIComponent(q)}`;
      } else if (results.length > 0) {
        const r = results[0];
        window.location.href = r.url || `/search?q=${encodeURIComponent(q)}`;
      } else if (q) {
        window.location.href = `/search?q=${encodeURIComponent(q)}`;
      }
    }
  };

  // Panel content — shared between desktop and mobile
  const PanelContent = () => {
    if (q.length < 2) return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '22px 22px 18px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: D,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.25)',
        marginBottom: 14
      }
    }, "Popular Searches"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8
      }
    }, POPULAR_SEARCHES.map(p => /*#__PURE__*/React.createElement("button", {
      key: p.label,
      onClick: () => {
        setQ(p.fill);
        if (inputRef.current) inputRef.current.focus();
      },
      style: {
        fontFamily: B,
        fontSize: 13,
        fontWeight: 600,
        color: AMBER,
        background: 'rgba(255,184,28,0.08)',
        border: '1px solid rgba(255,184,28,0.18)',
        padding: '7px 14px',
        borderRadius: 20,
        cursor: 'pointer',
        transition: 'background 0.2s'
      },
      onMouseEnter: e => e.currentTarget.style.background = 'rgba(255,184,28,0.18)',
      onMouseLeave: e => e.currentTarget.style.background = 'rgba(255,184,28,0.08)'
    }, p.label))), /*#__PURE__*/React.createElement("div", {
      style: {
        borderTop: '1px solid rgba(255,255,255,0.05)',
        marginTop: 18,
        paddingTop: 14,
        display: 'flex',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: B,
        fontSize: 12,
        color: 'rgba(255,255,255,0.2)'
      }
    }, "75,000+ parts indexed"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: B,
        fontSize: 12,
        color: 'rgba(255,255,255,0.2)'
      }
    }, "Press ESC to close")));
    if (results.length === 0 && !dbLoaded) return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '28px 24px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 16,
        height: 16,
        border: '2px solid rgba(255,184,28,0.3)',
        borderTopColor: AMBER,
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
        flexShrink: 0
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: B,
        fontSize: 13,
        color: 'rgba(255,255,255,0.4)'
      }
    }, "Loading 75,000+ parts\u2026"));
    if (results.length === 0) return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '28px 24px 24px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: D,
        fontWeight: 800,
        fontSize: 18,
        color: '#fff',
        marginBottom: 10
      }
    }, "No match found"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontFamily: B,
        fontSize: 14,
        color: 'rgba(255,255,255,0.4)',
        lineHeight: 1.75,
        marginBottom: 22
      }
    }, "Our full database has 75,000+ parts. Send this part number on WhatsApp \u2014 we confirm in under 60 minutes."), /*#__PURE__*/React.createElement("a", {
      href: WA(`Hi, I need: ${q}. Do you have it in stock? Please confirm price and availability.`),
      target: "_blank",
      rel: "noopener noreferrer",
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        background: WG,
        color: '#fff',
        textDecoration: 'none',
        padding: '13px 24px',
        borderRadius: 9,
        fontFamily: D,
        fontWeight: 800,
        fontSize: 15,
        letterSpacing: '0.05em',
        textTransform: 'uppercase'
      }
    }, /*#__PURE__*/React.createElement(WASvg, {
      s: 16
    }), "Ask on WhatsApp \u2014 \"", q, "\""));
    return /*#__PURE__*/React.createElement(React.Fragment, null, results.map((r, i) => /*#__PURE__*/React.createElement("a", {
      key: r.part,
      href: r.url || WA(`Hi, I need part ${r.part} — ${r.desc} (${r.brand}). Please confirm stock and price.`),
      target: r.url ? '_self' : '_blank',
      rel: "noopener noreferrer",
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        gap: 12,
        background: activeIdx === i ? 'rgba(255,184,28,0.06)' : 'transparent',
        transition: 'background 0.1s',
        cursor: 'pointer',
        textDecoration: 'none'
      },
      onMouseEnter: () => setActiveIdx(i),
      onMouseLeave: () => setActiveIdx(-1)
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        minWidth: 0,
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        alignItems: 'center',
        marginBottom: 3,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'monospace',
        fontWeight: 700,
        fontSize: 15,
        color: AMBER,
        letterSpacing: '0.02em'
      }
    }, r.part), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: B,
        fontSize: 11,
        color: 'rgba(255,255,255,0.35)',
        background: 'rgba(255,255,255,0.05)',
        padding: '2px 8px',
        borderRadius: 4
      }
    }, r.brand), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: B,
        fontSize: 11,
        color: 'rgba(255,255,255,0.35)',
        background: 'rgba(255,255,255,0.05)',
        padding: '2px 8px',
        borderRadius: 4
      }
    }, r.cat)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: B,
        fontSize: 13,
        color: 'rgba(255,255,255,0.5)',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }, r.desc)), r.url ? /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        color: AMBER,
        fontFamily: D,
        fontWeight: 700,
        fontSize: 12,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        flexShrink: 0
      }
    }, "View Part ", /*#__PURE__*/React.createElement("svg", {
      width: "12",
      height: "12",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2.5"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M5 12h14M12 5l7 7-7 7"
    }))) : /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        background: WG,
        color: '#fff',
        padding: '8px 14px',
        borderRadius: 7,
        fontFamily: D,
        fontWeight: 700,
        fontSize: 12,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement(WASvg, {
      s: 12
    }), " WhatsApp"))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '10px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        background: 'rgba(255,255,255,0.015)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: B,
        fontSize: 11,
        color: 'rgba(255,255,255,0.2)'
      }
    }, "\u2191\u2193 navigate \xB7 Enter to open \xB7 ESC to close"), /*#__PURE__*/React.createElement("a", {
      href: q ? `/search?q=${encodeURIComponent(q)}` : '/search',
      style: {
        fontFamily: B,
        fontSize: 12,
        color: AMBER,
        textDecoration: 'none',
        fontWeight: 700
      }
    }, "Search all 75K+ \u2192")));
  };
  const portalEl = document.getElementById('search-portal');
  return /*#__PURE__*/React.createElement("div", {
    ref: barRef,
    style: {
      width: '100%',
      maxWidth: 800,
      margin: '0 auto',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginBottom: 14,
      justifyContent: 'center',
      flexWrap: 'wrap'
    }
  }, brands.map(b => /*#__PURE__*/React.createElement("button", {
    key: b,
    onClick: () => setBrand(b),
    style: {
      fontFamily: B,
      fontSize: 12,
      fontWeight: 700,
      padding: '5px 16px',
      borderRadius: 20,
      border: `1px solid ${brand === b ? AMBER : 'rgba(255,255,255,0.15)'}`,
      cursor: 'pointer',
      transition: 'all 0.2s',
      background: brand === b ? AMBER : 'transparent',
      color: brand === b ? '#050505' : 'rgba(255,255,255,0.65)',
      letterSpacing: '0.04em'
    }
  }, b))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      background: 'rgba(255,255,255,0.07)',
      backdropFilter: 'blur(24px)',
      borderRadius: 12,
      border: `1.5px solid ${sm ? AMBER : 'rgba(255,255,255,0.12)'}`,
      transition: 'border-color 0.25s,box-shadow 0.25s',
      overflow: 'hidden',
      boxShadow: sm ? '0 0 0 3px rgba(255,184,28,0.15)' : undefined
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 20,
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
      zIndex: 2
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: sm ? AMBER : 'rgba(255,255,255,0.4)',
    strokeWidth: "2.5",
    strokeLinecap: "round",
    "aria-hidden": "true",
    style: {
      transition: 'stroke 0.25s'
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m21 21-4.35-4.35"
  }))), /*#__PURE__*/React.createElement("label", {
    htmlFor: "hero-search",
    style: {
      position: 'absolute',
      width: 1,
      height: 1,
      overflow: 'hidden',
      clip: 'rect(0,0,0,0)'
    }
  }, "Search by part number or description"), /*#__PURE__*/React.createElement("input", {
    id: "hero-search",
    ref: inputRef,
    type: "search",
    value: q,
    onChange: e => setQ(e.target.value),
    onFocus: enter,
    onKeyDown: handleKey,
    placeholder: "Part number or description — e.g. VOE20450734",
    style: {
      flex: 1,
      padding: '18px 18px 18px 54px',
      fontSize: 16,
      fontFamily: B,
      fontWeight: 500,
      background: 'transparent',
      border: 'none',
      color: '#fff',
      outline: 'none'
    }
  }), sm ? /*#__PURE__*/React.createElement("button", {
    onClick: exit,
    style: {
      padding: '0 22px',
      background: 'rgba(255,255,255,0.04)',
      color: 'rgba(255,255,255,0.45)',
      border: 'none',
      borderLeft: '1px solid rgba(255,255,255,0.08)',
      fontFamily: B,
      fontSize: 13,
      fontWeight: 700,
      cursor: 'pointer',
      flexShrink: 0,
      letterSpacing: '0.1em'
    }
  }, "ESC") : /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (!q) return;
      if (results.length > 0) {
        const first = results[0];
        window.location.href = first.url || `/search?q=${encodeURIComponent(q)}`;
      } else {
        window.location.href = `/search?q=${encodeURIComponent(q)}`;
      }
    },
    style: {
      padding: '0 32px',
      background: WG,
      color: '#fff',
      border: 'none',
      fontFamily: D,
      fontWeight: 800,
      fontSize: 16,
      letterSpacing: '0.07em',
      textTransform: 'uppercase',
      cursor: 'pointer',
      flexShrink: 0,
      transition: 'opacity 0.2s'
    },
    onMouseEnter: e => e.currentTarget.style.opacity = '0.85',
    onMouseLeave: e => e.currentTarget.style.opacity = '1',
    "aria-label": "Search parts"
  }, "Search")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: 10,
      padding: '0 4px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: B,
      fontSize: 11.5,
      color: 'rgba(255,255,255,0.28)'
    }
  }, "75,000+ parts indexed \xB7 Type to search"), sm ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: B,
      fontSize: 11.5,
      color: AMBER,
      opacity: 0.65
    }
  }, "\u2191\u2193 navigate \xB7 Enter to select \xB7 ESC to close") : /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: B,
      fontSize: 11.5,
      color: 'rgba(255,255,255,0.28)'
    }
  }, "No result? WhatsApp us \u2192")), sm && portalEl && ReactDOM.createPortal(/*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Search results",
    className: "search-desktop-panel",
    style: {
      position: 'fixed',
      top: pos.top,
      left: pos.left,
      width: pos.width,
      zIndex: 9100,
      background: '#0d0d0d',
      border: `1px solid ${AMBER}`,
      borderTop: `2px solid ${AMBER}`,
      borderRadius: 14,
      boxShadow: '0 32px 100px rgba(0,0,0,0.9)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(PanelContent, null)), /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Search results",
    className: "search-mobile-panel",
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 9100,
      background: '#080808',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 16px 12px',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      position: 'relative',
      display: 'flex',
      background: 'rgba(255,255,255,0.07)',
      borderRadius: 10,
      border: `1.5px solid ${AMBER}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 14,
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: AMBER,
    strokeWidth: "2.5",
    strokeLinecap: "round",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m21 21-4.35-4.35"
  }))), /*#__PURE__*/React.createElement("input", {
    value: q,
    onChange: e => setQ(e.target.value),
    onKeyDown: handleKey,
    placeholder: "Part number or description\u2026",
    style: {
      flex: 1,
      padding: '13px 13px 13px 40px',
      fontSize: 16,
      fontFamily: B,
      background: 'transparent',
      border: 'none',
      color: '#fff',
      outline: 'none'
    }
  })), /*#__PURE__*/React.createElement("button", {
    onClick: exit,
    "aria-label": "Close search",
    style: {
      width: 40,
      height: 40,
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.1)',
      color: 'rgba(255,255,255,0.6)',
      fontSize: 18,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      marginTop: 12,
      overflowX: 'auto',
      paddingBottom: 4
    }
  }, brands.map(b => /*#__PURE__*/React.createElement("button", {
    key: b,
    onClick: () => setBrand(b),
    style: {
      fontFamily: B,
      fontSize: 11,
      fontWeight: 700,
      padding: '4px 14px',
      borderRadius: 16,
      border: `1px solid ${brand === b ? AMBER : 'rgba(255,255,255,0.1)'}`,
      cursor: 'pointer',
      background: brand === b ? AMBER : 'transparent',
      color: brand === b ? '#050505' : 'rgba(255,255,255,0.55)',
      whiteSpace: 'nowrap',
      flexShrink: 0
    }
  }, b)))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto'
    }
  }, /*#__PURE__*/React.createElement(PanelContent, null)))), portalEl));
}

// ── HERO ──────────────────────────────────────────────────────────────────────
function Hero() {
  const {
    T,
    AMBER,
    isMobile
  } = useTheme();
  const countdown = useDispatchCountdown();
  const [sm, setSm] = useState(false);
  const geo = useGeo();
  const localTime = geo ? localCutoff(geo.timezone) : '';
  return /*#__PURE__*/React.createElement("header", {
    id: "home",
    style: {
      position: 'relative',
      minHeight: isMobile ? '100svh' : '96vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "noise",
    style: {
      position: 'absolute',
      inset: 0,
      backgroundImage: 'url(assets/images/team-warehouse.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center 40%'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: sm ? 'rgba(0,0,0,0.88)' : T.heroOverlay,
      transition: 'background 0.4s'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      backgroundImage: 'linear-gradient(rgba(255,184,28,0.03) 1px, transparent 1px),linear-gradient(90deg,rgba(255,184,28,0.03) 1px,transparent 1px)',
      backgroundSize: '80px 80px',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 2,
      maxWidth: 1360,
      margin: '0 auto',
      padding: isMobile ? '100px 20px 48px' : '80px 32px 60px',
      width: '100%',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "fu1",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      background: 'rgba(255,184,28,0.1)',
      border: '1px solid rgba(255,184,28,0.25)',
      borderRadius: 24,
      padding: '6px 20px',
      marginBottom: 32
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "pulse",
    style: {
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: AMBER,
      display: 'inline-block'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: AMBER,
      fontSize: 12,
      fontFamily: D,
      fontWeight: 700,
      letterSpacing: '0.2em',
      textTransform: 'uppercase'
    }
  }, "Est. 1956 \xB7 Mumbai \xB7 Open Now")), /*#__PURE__*/React.createElement("h1", {
    className: "fu2",
    style: {
      fontFamily: D,
      fontWeight: 900,
      fontSize: 'clamp(52px,9.5vw,120px)',
      lineHeight: 0.9,
      color: '#fff',
      letterSpacing: '-0.02em',
      marginBottom: 14,
      textTransform: 'uppercase'
    }
  }, "Heavy Equipment", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      color: AMBER,
      textShadow: `0 0 80px rgba(255,184,28,0.4)`
    }
  }, "Parts. Today.")), /*#__PURE__*/React.createElement("p", {
    className: "fu3",
    style: {
      fontFamily: B,
      fontSize: 18,
      color: 'rgba(255,255,255,0.6)',
      lineHeight: 1.65,
      marginBottom: 48,
      maxWidth: 520,
      margin: '0 auto 48px'
    }
  }, "75,000+ OEM & aftermarket parts for Volvo, Scania, Komatsu, CAT & 16 more brands. Dispatched from Mumbai today \u2014 Dubai in 3 days, Nairobi in 6, anywhere in the world."), /*#__PURE__*/React.createElement("div", {
    className: "fu4",
    style: {
      maxWidth: 820,
      margin: '0 auto 40px'
    }
  }, /*#__PURE__*/React.createElement(HeroSearch, {
    onSearchMode: setSm
  })), /*#__PURE__*/React.createElement("div", {
    className: "fu4",
    style: {
      display: 'flex',
      justifyContent: 'center',
      gap: 14,
      flexWrap: 'wrap',
      marginBottom: 60,
      opacity: sm ? 0 : 1,
      pointerEvents: sm ? 'none' : 'auto',
      transition: 'opacity 0.3s ease'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "https://wa.me/919821037990",
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      background: WG,
      color: '#fff',
      textDecoration: 'none',
      padding: '14px 28px',
      borderRadius: 10,
      fontFamily: D,
      fontWeight: 800,
      fontSize: 16,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      boxShadow: '0 8px 32px rgba(37,211,102,0.3)',
      transition: 'transform 0.2s'
    },
    onMouseEnter: e => e.currentTarget.style.transform = 'translateY(-2px)',
    onMouseLeave: e => e.currentTarget.style.transform = 'none'
  }, /*#__PURE__*/React.createElement("svg", {
    width: "19",
    height: "19",
    viewBox: "0 0 24 24",
    fill: "white",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
  })), "WhatsApp \u2014 Reply in <1 Hour"), /*#__PURE__*/React.createElement("a", {
    href: "#models",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      background: 'transparent',
      color: 'rgba(255,255,255,0.8)',
      textDecoration: 'none',
      padding: '14px 28px',
      borderRadius: 10,
      border: '1.5px solid rgba(255,255,255,0.2)',
      fontFamily: D,
      fontWeight: 700,
      fontSize: 16,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      transition: 'all 0.2s'
    },
    onMouseEnter: e => {
      e.currentTarget.style.borderColor = AMBER;
      e.currentTarget.style.color = AMBER;
    },
    onMouseLeave: e => {
      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
      e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
    }
  }, "Browse by Model \u2193")), /*#__PURE__*/React.createElement("div", {
    className: "dispatch-glow",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: isMobile ? 6 : 20,
      background: 'rgba(255,255,255,0.05)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 40,
      padding: isMobile ? '10px 16px' : '10px 28px',
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'center',
      opacity: sm ? 0 : (countdown ? 1 : 0),
      visibility: countdown ? 'visible' : 'hidden',
      transition: 'opacity 0.3s',
      minHeight: 44
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "pulse",
    style: {
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: AMBER,
      display: 'inline-block'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: B,
      fontSize: 13,
      color: 'rgba(255,255,255,0.7)',
      fontWeight: 500
    }
  }, "Same-day dispatch closes in"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: D,
      fontWeight: 800,
      fontSize: 17,
      color: AMBER,
      letterSpacing: '0.04em'
    }
  }, countdown), localTime && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: B,
      fontSize: 12,
      color: 'rgba(255,255,255,0.4)'
    }
  }, "\xB7 ", localTime, " your time")), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      height: 20,
      background: 'rgba(255,255,255,0.1)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: B,
      fontSize: 13,
      color: 'rgba(255,255,255,0.5)'
    }
  }, "\uD83D\uDCE6 Orders before 3 PM IST ship today"))));
}

// ── TRUST STRIP ───────────────────────────────────────────────────────────────
function TrustStrip() {
  const {
    T,
    AMBER,
    isMobile
  } = useTheme();
  const geo = useGeo();
  const ship = geoShipping(geo);
  const lastItem = ship && geo ? {
    label: geo.country === 'IN' ? 'Domestic Delivery' : `Ships to ${geo.countryName}`,
    sub: geo.country === 'IN' ? '1–2 days · same-day available' : `${ship.est} · ${ship.via}`
  } : {
    label: '50+ Countries',
    sub: 'Global freight daily'
  };
  const items = [{
    label: 'Est. 1956',
    sub: '70+ years in business'
  }, {
    label: 'Export Certified',
    sub: 'Full customs documentation'
  }, {
    label: 'DHL · FedEx',
    sub: 'Global freight partners'
  }, {
    label: 'SWIFT · UPI',
    sub: 'International payments'
  }, {
    label: 'OEM Verified',
    sub: 'Genuine & aftermarket'
  }, lastItem];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#0A0A0A',
      overflowX: isMobile ? 'visible' : 'auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: isMobile ? {
      maxWidth: 1360,
      margin: '0 auto',
      padding: '4px 0',
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)'
    } : {
      maxWidth: 1360,
      margin: '0 auto',
      padding: '0 32px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'stretch',
      minWidth: 'max-content'
    }
  }, items.map((item, i) => /*#__PURE__*/React.createElement("div", {
    key: item.label,
    style: isMobile ? {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 3,
      padding: '14px 8px',
      textAlign: 'center',
      borderRight: i % 3 !== 2 ? `1px solid ${T.border}` : 'none',
      borderBottom: i < 3 ? `1px solid ${T.border}` : 'none'
    } : {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '15px 28px',
      flexShrink: 0,
      borderRight: i < items.length - 1 ? `1px solid ${T.border}` : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: D,
      fontSize: isMobile ? 10 : 12,
      fontWeight: 700,
      letterSpacing: '0.1em',
      color: 'rgba(255,255,255,0.7)',
      textTransform: 'uppercase'
    }
  }, item.label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: B,
      fontSize: 10,
      color: T.textMuted,
      marginTop: 1
    }
  }, item.sub))))));
}

// ── LIVE ACTIVITY ─────────────────────────────────────────────────────────────
function LiveActivity() {
  const {
    T,
    AMBER
  } = useTheme();
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % ACTIVITY.length), 3500);
    return () => clearInterval(id);
  }, []);
  const cur = ACTIVITY[idx];
  return /*#__PURE__*/React.createElement("div", {
    "aria-live": "polite",
    "aria-atomic": "true",
    style: {
      background: T.bgAlt,
      borderTop: `1px solid ${T.border}`,
      padding: '14px 32px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1360,
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "pulse",
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: AMBER,
      display: 'inline-block',
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: B,
      fontSize: 13,
      color: T.textMuted,
      fontWeight: 500
    }
  }, "Recent orders:"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18
    },
    "aria-hidden": "true"
  }, cur.flag), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: B,
      fontSize: 13,
      color: T.text,
      fontWeight: 600
    }
  }, cur.name, " from ", cur.loc), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: B,
      fontSize: 13,
      color: T.textMuted
    }
  }, "ordered"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: D,
      fontSize: 14,
      color: T.accent,
      fontWeight: 700
    }
  }, cur.part), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: B,
      fontSize: 12,
      color: T.textMuted
    }
  }, "\u2014 ", cur.ago))), /*#__PURE__*/React.createElement("a", {
    href: "https://wa.me/919821037990",
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      fontFamily: D,
      fontSize: 13,
      color: T.accent,
      textDecoration: 'none',
      fontWeight: 700,
      letterSpacing: '0.05em',
      border: `1px solid ${T.border}`,
      padding: '6px 16px',
      borderRadius: 20,
      transition: 'border-color 0.2s'
    },
    onMouseEnter: e => e.currentTarget.style.borderColor = T.accent,
    onMouseLeave: e => e.currentTarget.style.borderColor = T.border
  }, "Order yours \u2192")));
}

// ── STATS ─────────────────────────────────────────────────────────────────────
function StatCounter({
  raw,
  display,
  label
}) {
  const {
    T,
    isDark
  } = useTheme();
  const [ref, inView] = useInView({
    threshold: 0.3
  });
  const val = useCounter(raw, inView);
  const shown = inView ? val >= raw ? display : `${val.toLocaleString()}+` : display;
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      textAlign: 'center',
      padding: '12px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: inView ? 'count-in' : '',
    style: {
      fontFamily: D,
      fontWeight: 900,
      fontSize: 'clamp(36px,5vw,56px)',
      color: T.statsText,
      lineHeight: 1,
      letterSpacing: '0.04em'
    }
  }, shown), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: B,
      fontSize: 11.5,
      color: T.statsMuted,
      marginTop: 5,
      fontWeight: 700,
      letterSpacing: '0.14em',
      textTransform: 'uppercase'
    }
  }, label));
}
function StatsBar() {
  const {
    T,
    isMobile
  } = useTheme();
  return /*#__PURE__*/React.createElement("section", {
    "aria-label": "Key statistics",
    style: {
      background: T.statsBg
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1360,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)',
      padding: isMobile ? '0 16px' : '0 32px'
    }
  }, STATS.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: s.label,
    style: {
      borderRight: isMobile ? i % 2 === 0 ? '1px solid rgba(0,0,0,0.1)' : undefined : i < 3 ? '1px solid rgba(0,0,0,0.1)' : undefined,
      borderBottom: isMobile && i < 2 ? '1px solid rgba(0,0,0,0.1)' : undefined
    }
  }, /*#__PURE__*/React.createElement(StatCounter, s)))));
}

// ── HOW IT WORKS ──────────────────────────────────────────────────────────────
function HowItWorks() {
  const {
    T,
    AMBER,
    isMobile
  } = useTheme();
  const steps = [{
    n: '01',
    title: 'Search or WhatsApp',
    desc: 'Type your part number into the search bar, or send us a WhatsApp message with your equipment model and part number.'
  }, {
    n: '02',
    title: 'Confirm in Under 1 Hour',
    desc: 'Our expert team checks stock, confirms price, and sends you a formal quotation — within 60 minutes on business days.'
  }, {
    n: '03',
    title: 'Parts Shipped Same Day',
    desc: 'Order before 3 PM IST. We dispatch from our Mumbai warehouse the same day, to anywhere in the world.'
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: T.bg,
      padding: isMobile ? '64px 20px' : '96px 32px',
      borderTop: `1px solid ${T.border}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1360,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: isMobile ? 40 : 64
    }
  }, /*#__PURE__*/React.createElement(Label, null, "How to Order"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: D,
      fontWeight: 900,
      fontSize: 'clamp(32px,4.5vw,60px)',
      color: T.text,
      lineHeight: 0.95,
      letterSpacing: '-0.02em',
      textTransform: 'uppercase'
    }
  }, "Part in Hand.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      color: AMBER
    }
  }, "In 3 Steps."))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)',
      gap: isMobile ? 12 : 2,
      maxWidth: 1100,
      margin: '0 auto'
    }
  }, steps.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.n,
    className: "card-shine",
    style: {
      background: T.bgCard,
      padding: isMobile ? '28px 24px' : '44px 40px',
      border: `1px solid ${T.border}`,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: D,
      fontWeight: 900,
      fontSize: 80,
      color: 'rgba(255,184,28,0.06)',
      lineHeight: 1,
      position: 'absolute',
      top: 20,
      right: 28,
      letterSpacing: '-0.04em',
      userSelect: 'none'
    },
    "aria-hidden": "true"
  }, s.n), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 44,
      height: 44,
      borderRadius: '50%',
      background: T.accent,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: D,
      fontWeight: 900,
      fontSize: 18,
      color: T.accentDark
    }
  }, s.n)), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: D,
      fontWeight: 800,
      fontSize: 22,
      color: T.text,
      marginBottom: 12,
      textTransform: 'uppercase',
      letterSpacing: '0.01em'
    }
  }, s.title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: B,
      fontSize: 15,
      color: T.textMuted,
      lineHeight: 1.7
    }
  }, s.desc)))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginTop: 48
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "https://wa.me/919821037990",
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      background: WG,
      color: '#fff',
      textDecoration: 'none',
      padding: '16px 40px',
      borderRadius: 10,
      fontFamily: D,
      fontWeight: 800,
      fontSize: 17,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      boxShadow: '0 8px 32px rgba(37,211,102,0.25)',
      transition: 'transform 0.2s'
    },
    onMouseEnter: e => e.currentTarget.style.transform = 'translateY(-2px)',
    onMouseLeave: e => e.currentTarget.style.transform = 'none'
  }, /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "white",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
  })), "Start on WhatsApp Now"))));
}

// ── POPULAR PARTS ─────────────────────────────────────────────────────────────
const POPULAR_PARTS = [{
  brand: 'Volvo',
  part: '20604855',
  name: 'Hydraulic Pump',
  cat: 'Hydraulic Parts',
  url: '/volvo/hydraulic-parts/20604855.html'
}, {
  brand: 'Komatsu',
  part: '708-1U-00163',
  name: 'Hydraulic Pump',
  cat: 'Hydraulic Parts',
  url: '/komatsu/hydraulic-parts/708-1u-00163.html'
}, {
  brand: 'CAT',
  part: '573-8033',
  name: 'Fuel Injector',
  cat: 'Fuel System',
  url: '/cat/fuel-system/573-8033.html'
}, {
  brand: 'Scania',
  part: '2398368',
  name: 'Alternator',
  cat: 'Electrical Parts',
  url: '/scania/spare-parts/2398368.html'
}, {
  brand: 'Hitachi',
  part: '4684348',
  name: 'Oil Filter',
  cat: 'Filters',
  url: '/hitachi/filters/4684348.html'
}, {
  brand: 'Volvo',
  part: '4031649',
  name: 'Turbocharger',
  cat: 'Exhaust & Turbo',
  url: '/volvo/exhaust-turbo/4031649.html'
}, {
  brand: 'Komatsu',
  part: 'AF1791',
  name: 'Air Filter Inner',
  cat: 'Filters',
  url: '/komatsu/filters/AF1791.html'
}, {
  brand: 'CAT',
  part: '1R0735',
  name: 'Oil Filter Element',
  cat: 'Filters',
  url: '/cat/filters/1R0735.html'
}, {
  brand: 'Hitachi',
  part: '4181672',
  name: 'Turbocharger',
  cat: 'Exhaust & Turbo',
  url: '/hitachi/exhaust-turbo/4181672-4427493.html'
}, {
  brand: 'Scania',
  part: '1457711',
  name: 'Hydraulic Pump Steering',
  cat: 'Hydraulic Parts',
  url: '/scania/hydraulic-parts/1457711.html'
}, {
  brand: 'Volvo',
  part: '84425617',
  name: 'Air Filter',
  cat: 'Filters',
  url: '/volvo/filters/84425617.html'
}, {
  brand: 'Komatsu',
  part: '600-861-6111',
  name: 'Alternator',
  cat: 'Electrical Parts',
  url: '/komatsu/electrical-parts/600-861-6111.html'
}];
function PopularParts() {
  const {
    T,
    AMBER,
    isMobile
  } = useTheme();
  return /*#__PURE__*/React.createElement("section", {
    "aria-labelledby": "popular-heading",
    style: {
      background: T.bgSection,
      padding: isMobile ? '56px 16px' : '80px 32px',
      borderTop: `1px solid ${T.border}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1360,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: 36,
      flexWrap: 'wrap',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "In Stock Now"), /*#__PURE__*/React.createElement("h2", {
    id: "popular-heading",
    style: {
      fontFamily: D,
      fontWeight: 900,
      fontSize: 'clamp(26px,3.5vw,46px)',
      color: T.text,
      lineHeight: 0.95,
      letterSpacing: '-0.02em',
      textTransform: 'uppercase'
    }
  }, "Most Searched", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      color: AMBER
    }
  }, "Parts"))), /*#__PURE__*/React.createElement("a", {
    href: "/search",
    style: {
      fontFamily: D,
      fontWeight: 700,
      fontSize: 13,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: AMBER,
      textDecoration: 'none',
      opacity: 0.8,
      transition: 'opacity 0.2s'
    },
    onMouseEnter: e => e.currentTarget.style.opacity = '1',
    onMouseLeave: e => e.currentTarget.style.opacity = '0.8'
  }, "Search all 75,000+ parts \u2192")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(auto-fill,minmax(220px,1fr))',
      gap: 10
    }
  }, POPULAR_PARTS.map((p, i) => /*#__PURE__*/React.createElement("a", {
    key: i,
    href: p.url,
    style: {
      background: T.bgCard,
      border: `1px solid ${T.border}`,
      borderRadius: 10,
      padding: '16px 18px',
      textDecoration: 'none',
      transition: 'all 0.2s',
      display: 'block'
    },
    onMouseEnter: e => {
      e.currentTarget.style.borderColor = AMBER;
      e.currentTarget.style.transform = 'translateY(-2px)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.borderColor = T.border;
      e.currentTarget.style.transform = 'none';
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: D,
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
      color: AMBER,
      marginBottom: 6,
      opacity: 0.7
    }
  }, p.brand), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: D,
      fontWeight: 800,
      fontSize: 15,
      color: T.text,
      letterSpacing: '0.02em',
      marginBottom: 4
    }
  }, p.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: B,
      fontSize: 12,
      color: T.textMuted,
      marginBottom: 8
    }
  }, "#", p.part), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-block',
      fontFamily: B,
      fontSize: 11,
      fontWeight: 600,
      color: AMBER,
      background: 'rgba(255,184,28,0.09)',
      border: '1px solid rgba(255,184,28,0.2)',
      borderRadius: 4,
      padding: '2px 8px',
      letterSpacing: '0.03em'
    }
  }, p.cat))))));
}

// ── BRAND TICKER ─────────────────────────────────────────────────────────────
function BrandGrid() {
  const {
    T,
    AMBER
  } = useTheme();
  const brands = [{
    name: 'Komatsu',
    count: '26,000+ Parts'
  }, {
    name: 'CAT',
    count: '22,000+ Parts'
  }, {
    name: 'Hitachi',
    count: '3,500+ Parts'
  }, {
    name: 'Scania',
    count: '3,300+ Parts'
  }, {
    name: 'Kobelco',
    count: '821+ Parts'
  }, {
    name: 'Volvo',
    count: '12,000+ Parts'
  }, {
    name: 'Epiroc',
    count: 'Mining'
  }, {
    name: 'Sandvik',
    count: 'Mining'
  }, {
    name: 'Atlas Copco',
    count: 'Mining'
  }, {
    name: 'Normet',
    count: 'Mining'
  }, {
    name: 'JCB',
    count: 'OEM'
  }, {
    name: 'Doosan',
    count: 'OEM'
  }, {
    name: 'Liebherr',
    count: 'OEM'
  }, {
    name: 'Wirtgen',
    count: 'OEM'
  }, {
    name: 'BEML',
    count: 'OEM'
  }, {
    name: 'MAHLE',
    count: 'OEM'
  }, {
    name: 'Garrett',
    count: 'OEM'
  }, {
    name: 'HELLA',
    count: 'OEM'
  }];
  const all = [...brands, ...brands];
  return /*#__PURE__*/React.createElement("section", {
    id: "brands",
    "aria-label": "Brands we supply",
    style: {
      background: T.brandsBg,
      padding: '48px 0',
      borderTop: `1px solid ${T.border}`,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: B,
      fontSize: 11,
      color: T.textMuted,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      textAlign: 'center',
      fontWeight: 700,
      marginBottom: 28
    }
  }, "OEM & Aftermarket Parts for Leading Brands"), /*#__PURE__*/React.createElement("div", {
    style: {
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ticker-inner",
    style: {
      display: 'flex',
      gap: 0,
      alignItems: 'center',
      width: 'max-content'
    }
  }, all.map((b, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 48px',
      display: 'flex',
      alignItems: 'baseline',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: D,
      fontWeight: 900,
      fontSize: 22,
      letterSpacing: '-0.01em',
      color: T.text,
      textTransform: 'uppercase'
    }
  }, b.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: B,
      fontSize: 12,
      fontWeight: 600,
      color: T.textMuted,
      letterSpacing: '0.04em'
    }
  }, b.count)), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      height: 18,
      background: T.border,
      flexShrink: 0
    }
  }))))));
}

// ── CATEGORIES ────────────────────────────────────────────────────────────────

const CAT_BRANDS = {
  'Engine Parts': [{
    b: 'Komatsu',
    s: 'komatsu',
    n: '8,731'
  }, {
    b: 'CAT',
    s: 'cat',
    n: '9,611'
  }, {
    b: 'Volvo',
    s: 'volvo',
    n: '3,545'
  }, {
    b: 'Hitachi',
    s: 'hitachi',
    n: '767'
  }, {
    b: 'Scania',
    s: 'scania',
    n: '567'
  }],
  'Hydraulic Parts': [{
    b: 'Komatsu',
    s: 'komatsu',
    n: '5,020'
  }, {
    b: 'CAT',
    s: 'cat',
    n: '2,315'
  }, {
    b: 'Volvo',
    s: 'volvo',
    n: '2,118'
  }, {
    b: 'Hitachi',
    s: 'hitachi',
    n: '331'
  }, {
    b: 'Scania',
    s: 'scania',
    n: '343'
  }],
  'Electrical': [{
    b: 'Volvo',
    s: 'volvo',
    n: '822'
  }, {
    b: 'CAT',
    s: 'cat',
    n: '918'
  }, {
    b: 'Komatsu',
    s: 'komatsu',
    n: '258'
  }, {
    b: 'Hitachi',
    s: 'hitachi',
    n: '121'
  }, {
    b: 'Scania',
    s: 'scania',
    n: '99'
  }],
  'Filters': [{
    b: 'Komatsu',
    s: 'komatsu',
    n: '517'
  }, {
    b: 'CAT',
    s: 'cat',
    n: '732'
  }, {
    b: 'Volvo',
    s: 'volvo',
    n: '478'
  }, {
    b: 'Hitachi',
    s: 'hitachi',
    n: '115'
  }, {
    b: 'Scania',
    s: 'scania',
    n: '120'
  }],
  'Undercarriage': [{
    b: 'Komatsu',
    s: 'komatsu',
    n: '5,386'
  }, {
    b: 'CAT',
    s: 'cat',
    n: '447'
  }, {
    b: 'Volvo',
    s: 'volvo',
    n: '191'
  }, {
    b: 'Hitachi',
    s: 'hitachi',
    n: '158'
  }],
  'Transmission': [{
    b: 'Komatsu',
    s: 'komatsu',
    n: '1,082'
  }, {
    b: 'Volvo',
    s: 'volvo',
    n: '79'
  }, {
    b: 'Hitachi',
    s: 'hitachi',
    n: '146'
  }, {
    b: 'Scania',
    s: 'scania',
    n: '196'
  }, {
    b: 'CAT',
    s: 'cat',
    n: '81'
  }],
  'Brake Systems': [{
    b: 'Komatsu',
    s: 'komatsu',
    n: '382'
  }, {
    b: 'CAT',
    s: 'cat',
    n: '543'
  }, {
    b: 'Volvo',
    s: 'volvo',
    n: '347'
  }, {
    b: 'Scania',
    s: 'scania',
    n: '45'
  }, {
    b: 'Hitachi',
    s: 'hitachi',
    n: '9'
  }],
  'Cooling System': [{
    b: 'Komatsu',
    s: 'komatsu',
    n: '508'
  }, {
    b: 'CAT',
    s: 'cat',
    n: '625'
  }, {
    b: 'Volvo',
    s: 'volvo',
    n: '59'
  }, {
    b: 'Hitachi',
    s: 'hitachi',
    n: '148'
  }]
};
function CatCard({
  cat
}) {
  const {
    T,
    AMBER
  } = useTheme();
  const [flipped, setFlipped] = useState(false);
  const brands = CAT_BRANDS[cat.name] || [];
  const catSlug = {
    'Engine Parts': 'engine-parts',
    'Hydraulic Parts': 'hydraulic-parts',
    'Electrical': 'electrical-parts',
    'Filters': 'filters',
    'Undercarriage': 'undercarriage',
    'Transmission': 'transmission-parts',
    'Brake Systems': 'brake-parts',
    'Cooling System': 'cooling-system'
  }[cat.name] || 'spare-parts';
  return /*#__PURE__*/React.createElement("div", {
    onClick: () => setFlipped(f => !f),
    style: {
      perspective: '1000px',
      cursor: 'pointer',
      minHeight: 180
    },
    role: "button",
    "aria-pressed": flipped,
    "aria-label": `${cat.name} — click to see brands`
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-shine",
    style: {
      position: 'relative',
      width: '100%',
      height: '100%',
      minHeight: 180,
      transformStyle: 'preserve-3d',
      transition: 'transform 0.55s cubic-bezier(0.4,0,0.2,1)',
      transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      backfaceVisibility: 'hidden',
      WebkitBackfaceVisibility: 'hidden',
      background: T.bgCard,
      padding: '32px',
      border: `1px solid ${T.border}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: D,
      fontWeight: 900,
      fontSize: 38,
      color: AMBER,
      lineHeight: 1,
      marginBottom: 12,
      letterSpacing: '-0.02em'
    }
  }, cat.count), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: D,
      fontWeight: 800,
      fontSize: 18,
      color: T.text,
      marginBottom: 8,
      textTransform: 'uppercase',
      letterSpacing: '0.01em'
    }
  }, cat.name), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: B,
      fontSize: 13.5,
      color: T.textMuted,
      lineHeight: 1.65,
      marginBottom: 16
    }
  }, cat.desc), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: D,
      fontSize: 11,
      fontWeight: 700,
      color: T.accent,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      opacity: 0.7
    }
  }, "TAP TO SEE BRANDS \u2192")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      backfaceVisibility: 'hidden',
      WebkitBackfaceVisibility: 'hidden',
      transform: 'rotateY(180deg)',
      background: '#0d0d0d',
      padding: '24px 28px',
      border: `1px solid ${AMBER}33`,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: D,
      fontWeight: 800,
      fontSize: 11,
      color: AMBER,
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
      marginBottom: 16,
      opacity: 0.85
    }
  }, cat.name, " \u2014 BY BRAND"), brands.map(br => /*#__PURE__*/React.createElement("a", {
    key: br.b,
    href: `/${br.s}/${catSlug}/`,
    onClick: e => e.stopPropagation(),
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '9px 0',
      borderBottom: `1px solid ${T.border}`,
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: D,
      fontWeight: 700,
      fontSize: 15,
      color: T.text,
      textTransform: 'uppercase',
      letterSpacing: '0.02em'
    }
  }, br.b), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: B,
      fontSize: 12,
      color: AMBER,
      fontWeight: 600
    }
  }, br.n, " parts \u2192")))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: D,
      fontSize: 11,
      fontWeight: 700,
      color: T.textMuted,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      marginTop: 12,
      opacity: 0.5
    }
  }, "TAP TO FLIP BACK"))));
}
function ProductCategories() {
  const {
    T,
    AMBER,
    isMobile
  } = useTheme();
  return /*#__PURE__*/React.createElement("section", {
    id: "products",
    "aria-labelledby": "products-heading",
    style: {
      background: T.bgSection,
      padding: isMobile ? '56px 16px' : '96px 32px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1360,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: 52,
      flexWrap: 'wrap',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Parts Catalog"), /*#__PURE__*/React.createElement("h2", {
    id: "products-heading",
    style: {
      fontFamily: D,
      fontWeight: 900,
      fontSize: 'clamp(30px,4.5vw,58px)',
      color: T.text,
      lineHeight: 0.95,
      letterSpacing: '-0.02em',
      textTransform: 'uppercase'
    }
  }, "75,000+ Parts", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      color: AMBER
    }
  }, "19 Categories"))), /*#__PURE__*/React.createElement("a", {
    href: WA('Hi, I want to request the full parts catalog. Please share details.'),
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      fontFamily: B,
      fontSize: 14,
      color: T.accent,
      textDecoration: 'none',
      fontWeight: 700,
      borderBottom: `2px solid ${T.accent}`,
      paddingBottom: 2,
      flexShrink: 0
    }
  }, "Request full catalog \u2192")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))',
      gap: 1
    }
  }, CATS.map(cat => /*#__PURE__*/React.createElement(CatCard, {
    key: cat.name,
    cat: cat
  })))));
}

// ── EQUIPMENT MODELS ──────────────────────────────────────────────────────────
function ModelChip({
  brand,
  model
}) {
  const {
    T,
    AMBER
  } = useTheme();
  const [hov, setHov] = useState(false);
  return /*#__PURE__*/React.createElement("a", {
    href: WA(`Hi, I need spare parts for ${brand} ${model}. Please advise on availability and pricing.`),
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      display: 'block',
      fontFamily: B,
      fontSize: 13.5,
      fontWeight: 600,
      color: hov ? T.accent : T.text,
      textDecoration: 'none',
      padding: '11px 14px',
      borderRadius: 8,
      background: T.bgSection,
      border: `1px solid ${hov ? T.accent : T.border}`,
      transition: 'all 0.18s'
    },
    onMouseEnter: () => setHov(true),
    onMouseLeave: () => setHov(false)
  }, brand, " ", model);
}
function EquipmentModels() {
  const {
    T,
    AMBER,
    isMobile
  } = useTheme();
  const [active, setActive] = useState(0);
  const [ms, setMs] = useState('');
  const cur = ALL_BRANDS[active];
  const filtered = ms ? cur.models.filter(m => m.toLowerCase().includes(ms.toLowerCase())) : cur.models;
  const total = ALL_BRANDS.reduce((a, b) => a + b.models.length, 0);
  return /*#__PURE__*/React.createElement("section", {
    id: "models",
    "aria-labelledby": "models-heading",
    style: {
      background: T.bg,
      padding: isMobile ? '56px 16px' : '96px 32px',
      borderTop: `1px solid ${T.border}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1360,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: 48,
      flexWrap: 'wrap',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Equipment Models"), /*#__PURE__*/React.createElement("h2", {
    id: "models-heading",
    style: {
      fontFamily: D,
      fontWeight: 900,
      fontSize: 'clamp(30px,4.5vw,58px)',
      color: T.text,
      lineHeight: 0.95,
      letterSpacing: '-0.02em',
      textTransform: 'uppercase'
    }
  }, "Browse by", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      color: AMBER
    }
  }, "Your Model"))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: D,
      fontWeight: 900,
      fontSize: 44,
      color: T.accent,
      lineHeight: 1,
      letterSpacing: '-0.03em'
    }
  }, total, "+"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: B,
      fontSize: 12,
      color: T.textMuted,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      fontWeight: 600
    }
  }, "Models Indexed"))), /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    "aria-label": "Select brand",
    style: {
      display: 'flex',
      gap: 6,
      marginBottom: 20,
      flexWrap: 'wrap'
    }
  }, ALL_BRANDS.map((b, i) => /*#__PURE__*/React.createElement("button", {
    key: b.name,
    id: `tab-${b.name.toLowerCase()}`,
    role: "tab",
    "aria-selected": active === i,
    "aria-controls": `tabpanel-${b.name.toLowerCase()}`,
    onClick: () => {
      setActive(i);
      setMs('');
    },
    style: {
      fontFamily: D,
      fontWeight: 800,
      fontSize: 13,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      padding: '9px 20px',
      borderRadius: 8,
      cursor: 'pointer',
      border: 'none',
      transition: 'all 0.2s',
      background: active === i ? T.accent : T.bgCard,
      color: active === i ? T.accentDark : T.textMuted,
      boxShadow: active === i ? '0 4px 20px rgba(255,184,28,0.25)' : 'none'
    }
  }, b.name, /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 6,
      fontSize: 11,
      opacity: 0.6
    }
  }, "(", b.models.length, ")")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      marginBottom: 16,
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    style: {
      position: 'absolute',
      left: 12,
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none'
    },
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: T.textMuted,
    strokeWidth: "2.5",
    strokeLinecap: "round",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m21 21-4.35-4.35"
  })), /*#__PURE__*/React.createElement("label", {
    htmlFor: "model-filter",
    style: {
      position: 'absolute',
      width: 1,
      height: 1,
      overflow: 'hidden',
      clip: 'rect(0,0,0,0)'
    }
  }, "Filter models"), /*#__PURE__*/React.createElement("input", {
    id: "model-filter",
    type: "search",
    value: ms,
    onChange: e => setMs(e.target.value),
    placeholder: `Filter ${cur.name} models…`,
    style: {
      padding: '10px 14px 10px 36px',
      background: T.bgCard,
      border: `1px solid ${T.border}`,
      borderRadius: 8,
      color: T.text,
      fontFamily: B,
      fontSize: 14,
      outline: 'none',
      transition: 'border-color 0.2s',
      width: isMobile ? '100%' : 240
    },
    onFocus: e => e.target.style.borderColor = T.accent,
    onBlur: e => e.target.style.borderColor = T.border
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: B,
      fontSize: 13,
      color: T.textMuted
    }
  }, filtered.length, " models shown")), /*#__PURE__*/React.createElement("div", {
    id: `tabpanel-${cur.name.toLowerCase()}`,
    role: "tabpanel",
    "aria-labelledby": `tab-${cur.name.toLowerCase()}`,
    style: {
      background: T.bgCard,
      border: `1px solid ${T.border}`,
      borderRadius: 14,
      padding: '28px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill,minmax(175px,1fr))',
      gap: 8
    }
  }, filtered.map(model => /*#__PURE__*/React.createElement(ModelChip, {
    key: model,
    brand: cur.name,
    model: model
  })), filtered.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: '1/-1',
      padding: 20,
      textAlign: 'center',
      fontFamily: B,
      fontSize: 14,
      color: T.textMuted
    }
  }, "No models match \"", ms, "\""), /*#__PURE__*/React.createElement("a", {
    href: WA(`Hi, I need spare parts for ${cur.name}. Please help me find the right model.`),
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: D,
      fontWeight: 800,
      fontSize: 13,
      color: T.accent,
      textDecoration: 'none',
      padding: '13px 16px',
      borderRadius: 9,
      border: `2px dashed ${T.accent}`,
      opacity: 0.6,
      transition: 'opacity 0.2s',
      letterSpacing: '0.06em',
      textTransform: 'uppercase'
    },
    onMouseEnter: e => e.currentTarget.style.opacity = '1',
    onMouseLeave: e => e.currentTarget.style.opacity = '0.6'
  }, "+ All ", cur.name, " models"))));
}

// ── GLOBAL REACH ──────────────────────────────────────────────────────────────
function GlobalReach() {
  const {
    T,
    AMBER,
    isMobile
  } = useTheme();
  const geo = useGeo();
  const ship = geoShipping(geo);
  const homeCard = geo && COUNTRIES.find(c => c.code === geo.country);
  return /*#__PURE__*/React.createElement("section", {
    "aria-labelledby": "reach-heading",
    style: {
      background: T.bgCard,
      padding: isMobile ? '56px 16px' : '96px 32px',
      borderTop: `1px solid ${T.border}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1360,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: 56
    }
  }, /*#__PURE__*/React.createElement(Label, {
    center: true
  }, "Global Reach"), /*#__PURE__*/React.createElement("h2", {
    id: "reach-heading",
    style: {
      fontFamily: D,
      fontWeight: 900,
      fontSize: 'clamp(30px,4.5vw,58px)',
      color: T.text,
      lineHeight: 0.95,
      letterSpacing: '-0.02em',
      textTransform: 'uppercase',
      marginBottom: 16
    }
  }, homeCard && geo.country !== 'IN' ? /*#__PURE__*/React.createElement(React.Fragment, null, "Shipping to", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      color: AMBER
    }
  }, homeCard.name, " ", homeCard.flag)) : /*#__PURE__*/React.createElement(React.Fragment, null, "Shipped to", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      color: AMBER
    }
  }, "50+ Countries"))), ship && geo && geo.country !== 'IN' ? /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: B,
      fontSize: 16,
      color: T.textMuted,
      maxWidth: 480,
      margin: '0 auto',
      lineHeight: 1.7
    }
  }, "Your order ships from Mumbai to ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: T.text
    }
  }, geo.countryName), " in ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: AMBER
    }
  }, ship.est), " via ", ship.via, ". Full customs documentation included.") : /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: B,
      fontSize: 16,
      color: T.textMuted,
      maxWidth: 480,
      margin: '0 auto',
      lineHeight: 1.7
    }
  }, "Full customs documentation, reliable freight partners, and 70 years of international export experience.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill,minmax(120px,1fr))',
      gap: 10,
      marginBottom: 48
    }
  }, COUNTRIES.map(c => {
    const isHome = geo && c.code === geo.country;
    return /*#__PURE__*/React.createElement("div", {
      key: c.name,
      className: "card-shine",
      style: {
        background: isHome ? 'rgba(255,184,28,0.06)' : T.bg,
        border: `1px solid ${isHome ? AMBER : T.border}`,
        borderRadius: 10,
        padding: '14px 12px',
        textAlign: 'center',
        transition: 'all 0.2s',
        cursor: 'default',
        boxShadow: isHome ? '0 0 16px rgba(255,184,28,0.15)' : 'none'
      },
      onMouseEnter: e => {
        if (!isHome) {
          e.currentTarget.style.borderColor = T.accent;
          e.currentTarget.style.transform = 'translateY(-2px)';
        }
      },
      onMouseLeave: e => {
        if (!isHome) {
          e.currentTarget.style.borderColor = T.border;
          e.currentTarget.style.transform = 'none';
        }
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 26,
        marginBottom: 5
      },
      "aria-hidden": "true"
    }, c.flag), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: B,
        fontSize: 11,
        fontWeight: 600,
        color: isHome ? AMBER : T.text
      }
    }, c.name), isHome && /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: D,
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: AMBER,
        marginTop: 3,
        opacity: 0.8
      }
    }, "Your Location"));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      justifyContent: 'center',
      flexWrap: 'wrap'
    }
  }, ['Full customs documentation', 'SWIFT & wire transfer accepted', 'DHL, FedEx & freight forwarders', 'Multi-language support', 'Consolidated shipments available'].map(item => /*#__PURE__*/React.createElement("div", {
    key: item,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      background: T.bgSection,
      border: `1px solid ${T.border}`,
      padding: '9px 18px',
      borderRadius: 24
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: AMBER,
      fontSize: 14
    },
    "aria-hidden": "true"
  }, "\u2713"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: B,
      fontSize: 13,
      color: T.textMuted,
      fontWeight: 500
    }
  }, item))))));
}

// ── TESTIMONIALS ─────────────────────────────────────────────────────────────
function Testimonials() {
  const {
    T,
    AMBER,
    isMobile
  } = useTheme();
  return /*#__PURE__*/React.createElement("section", {
    "aria-labelledby": "testimonials-heading",
    style: {
      background: T.bgSection,
      padding: isMobile ? '56px 16px' : '96px 32px',
      borderTop: `1px solid ${T.border}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1360,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: 56,
      flexWrap: 'wrap',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Customer Stories"), /*#__PURE__*/React.createElement("h2", {
    id: "testimonials-heading",
    style: {
      fontFamily: D,
      fontWeight: 900,
      fontSize: 'clamp(30px,4.5vw,58px)',
      color: T.text,
      lineHeight: 0.95,
      letterSpacing: '-0.02em',
      textTransform: 'uppercase'
    }
  }, "Trusted", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      color: AMBER
    }
  }, "Worldwide"))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 3,
      marginBottom: 4,
      justifyContent: 'flex-end'
    },
    "aria-label": "5 stars"
  }, [1, 2, 3, 4, 5].map(s => /*#__PURE__*/React.createElement("span", {
    key: s,
    style: {
      color: AMBER,
      fontSize: 22
    },
    "aria-hidden": "true"
  }, "\u2605"))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: B,
      fontSize: 13,
      color: T.textMuted
    }
  }, "4.8 / 5 from 250+ international buyers"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))',
      gap: 16
    }
  }, TESTIMONIALS.map((r, i) => /*#__PURE__*/React.createElement("article", {
    key: r.name,
    className: "card-shine",
    style: {
      background: T.bgCard,
      border: `1px solid ${T.border}`,
      borderRadius: 16,
      padding: '36px',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.25s'
    }
  }, i === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 3,
      background: `linear-gradient(90deg,${AMBER},rgba(255,184,28,0.3))`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: D,
      fontWeight: 900,
      fontSize: 72,
      color: 'rgba(255,184,28,0.06)',
      lineHeight: 0.8,
      position: 'absolute',
      top: 16,
      right: 24,
      userSelect: 'none',
      pointerEvents: 'none'
    },
    "aria-hidden": "true"
  }, "\""), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 3,
      marginBottom: 20
    },
    "aria-label": "5 stars"
  }, [1, 2, 3, 4, 5].map(s => /*#__PURE__*/React.createElement("span", {
    key: s,
    style: {
      color: AMBER,
      fontSize: 14
    },
    "aria-hidden": "true"
  }, "\u2605"))), /*#__PURE__*/React.createElement("blockquote", {
    style: {
      fontFamily: B,
      fontSize: 15.5,
      color: T.text,
      lineHeight: 1.8,
      marginBottom: 28,
      fontStyle: 'italic',
      position: 'relative',
      zIndex: 1
    }
  }, "\"", r.text, "\""), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 44,
      height: 44,
      borderRadius: '50%',
      background: T.accent,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    },
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: D,
      fontWeight: 900,
      fontSize: 18,
      color: T.accentDark
    }
  }, r.name[0])), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: D,
      fontWeight: 800,
      fontSize: 15,
      color: T.text,
      marginBottom: 2
    }
  }, r.name, " ", /*#__PURE__*/React.createElement("span", {
    "aria-label": r.loc
  }, r.flag)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: B,
      fontSize: 12,
      color: T.textMuted
    }
  }, r.role, " \xB7 ", r.loc))))))));
}

// ── BLOG ──────────────────────────────────────────────────────────────────────
function BlogPreview() {
  const {
    T,
    AMBER,
    isMobile
  } = useTheme();
  return /*#__PURE__*/React.createElement("section", {
    "aria-labelledby": "blog-heading",
    style: {
      background: T.bg,
      padding: isMobile ? '56px 16px' : '96px 32px',
      borderTop: `1px solid ${T.border}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1360,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: 52,
      flexWrap: 'wrap',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Technical Knowledge"), /*#__PURE__*/React.createElement("h2", {
    id: "blog-heading",
    style: {
      fontFamily: D,
      fontWeight: 900,
      fontSize: 'clamp(30px,4.5vw,58px)',
      color: T.text,
      lineHeight: 0.95,
      letterSpacing: '-0.02em',
      textTransform: 'uppercase'
    }
  }, "Engineer's", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      color: AMBER
    }
  }, "Guides"))), /*#__PURE__*/React.createElement("a", {
    href: "/blog/index.html",
    style: {
      fontFamily: B,
      fontSize: 14,
      color: T.accent,
      textDecoration: 'none',
      fontWeight: 700,
      borderBottom: `2px solid ${T.accent}`,
      paddingBottom: 2
    }
  }, "All articles \u2192")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))',
      gap: 16
    }
  }, BLOG.map(post => {
    const [hov, setHov] = useState(false);
    return /*#__PURE__*/React.createElement("article", {
      key: post.title,
      className: "card-shine",
      style: {
        background: T.bgCard,
        border: `1px solid ${hov ? T.accent : T.border}`,
        borderRadius: 14,
        overflow: 'hidden',
        transition: 'all 0.25s',
        transform: hov ? 'translateY(-4px)' : 'none',
        cursor: 'pointer'
      },
      onMouseEnter: () => setHov(true),
      onMouseLeave: () => setHov(false)
    }, /*#__PURE__*/React.createElement("a", {
      href: post.href,
      style: {
        textDecoration: 'none',
        display: 'block'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: 200,
        backgroundImage: `url(${post.cover})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.35)'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '26px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-block',
        background: T.tagBg,
        color: T.tagText,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        padding: '4px 10px',
        borderRadius: 4,
        marginBottom: 12,
        fontFamily: D
      }
    }, post.tag), /*#__PURE__*/React.createElement("h3", {
      style: {
        fontFamily: D,
        fontWeight: 800,
        fontSize: 19,
        color: T.text,
        lineHeight: 1.3,
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: '0.01em'
      }
    }, post.title), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: B,
        fontSize: 12,
        color: T.textMuted
      }
    }, post.date, " \xB7 ", post.read, " read"))));
  }))));
}

// ── WHATSAPP CTA ──────────────────────────────────────────────────────────────
function WhatsAppCTA() {
  const {
    isMobile
  } = useTheme();
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: '#075E54',
      padding: isMobile ? '64px 20px' : '100px 32px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)',
      backgroundSize: '60px 60px',
      pointerEvents: 'none'
    },
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 1,
      maxWidth: 640,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: D,
      fontWeight: 900,
      fontSize: 'clamp(36px,6vw,72px)',
      color: '#fff',
      marginBottom: 16,
      lineHeight: 0.9,
      textTransform: 'uppercase',
      letterSpacing: '-0.02em'
    }
  }, "Need a Part", /*#__PURE__*/React.createElement("br", null), "Right Now?", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      color: AMBER
    }
  }, "We Reply Fast.")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: B,
      fontSize: 17,
      color: 'rgba(255,255,255,0.75)',
      marginBottom: 44,
      lineHeight: 1.7
    }
  }, "Send your part number or equipment model on WhatsApp. Price & availability confirmed in under 60 minutes."), /*#__PURE__*/React.createElement("a", {
    href: "https://wa.me/919821037990",
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: isMobile ? 10 : 14,
      background: WG,
      color: '#fff',
      textDecoration: 'none',
      padding: isMobile ? '16px 28px' : '20px 48px',
      borderRadius: 12,
      fontFamily: D,
      fontWeight: 900,
      fontSize: isMobile ? 16 : 20,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      boxShadow: '0 16px 48px rgba(0,0,0,0.25)',
      transition: 'all 0.25s'
    },
    onMouseEnter: e => {
      e.currentTarget.style.transform = 'translateY(-3px)';
      e.currentTarget.style.boxShadow = '0 24px 64px rgba(0,0,0,0.35)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = 'none';
      e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.25)';
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "white",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
  })), "+91 98210 37990"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: B,
      fontSize: 13,
      color: 'rgba(255,255,255,0.3)',
      marginTop: 20
    }
  }, "Mon\u2013Sat, 9 AM \u2013 6 PM IST \xB7 Multilingual team \xB7 SWIFT & UPI accepted")));
}

// ── CONTACT ───────────────────────────────────────────────────────────────────
function Contact() {
  const {
    T,
    AMBER,
    isMobile
  } = useTheme();
  const geo = useGeo();
  const emailFirst = geo && EMAIL_FIRST.has(geo.country);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    brand: '',
    part: ''
  });
  const u = k => e => setForm({
    ...form,
    [k]: e.target.value
  });
  const iS = {
    width: '100%',
    padding: '13px 16px',
    background: T.inputBg,
    border: `1px solid ${T.inputBorder}`,
    borderRadius: 9,
    color: T.text,
    fontFamily: B,
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 0.2s'
  };
  const lS = {
    display: 'block',
    fontFamily: D,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: T.textMuted,
    marginBottom: 7
  };
  const buildBody = () => `Name: ${form.name || 'N/A'}\nEquipment: ${form.brand || 'N/A'}\nPart: ${form.part || 'N/A'}\nPhone: ${form.phone || 'N/A'}`;
  const sendEmail = () => window.open(`mailto:parts@partstrading.com?subject=Parts Enquiry — ${form.brand || 'Heavy Equipment'}&body=${encodeURIComponent(buildBody())}`);
  const sendWA = () => window.open(WA(`Hi, my name is ${form.name || 'Customer'}. I need: ${form.part || 'parts'} for ${form.brand || 'my equipment'}. Email: ${form.email || 'N/A'}. Phone: ${form.phone || 'N/A'}.`), '_blank');
  return /*#__PURE__*/React.createElement("section", {
    id: "contact",
    "aria-labelledby": "contact-heading",
    style: {
      background: T.bgSection,
      padding: isMobile ? '56px 20px' : '96px 32px',
      borderTop: `1px solid ${T.border}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1360,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      gap: isMobile ? 40 : 80,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Get in Touch"), /*#__PURE__*/React.createElement("h2", {
    id: "contact-heading",
    style: {
      fontFamily: D,
      fontWeight: 900,
      fontSize: 'clamp(30px,4vw,56px)',
      color: T.text,
      lineHeight: 0.95,
      letterSpacing: '-0.02em',
      textTransform: 'uppercase',
      marginBottom: 24
    }
  }, "Request a", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      color: AMBER
    }
  }, "Quote Today")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: B,
      fontSize: 16,
      color: T.textMuted,
      lineHeight: 1.75,
      marginBottom: 44
    }
  }, emailFirst ? 'Share your part number by email — we respond within 2 business hours with availability and pricing.' : 'Share your equipment model and part number. We respond within 2 hours. WhatsApp is the fastest channel.'), [{
    icon: '📍',
    label: 'Address',
    val: 'Vijay Chambers, Grant Road East, Mumbai 400004, India'
  }, {
    icon: '📞',
    label: 'Phone',
    val: '+91 98210 37990'
  }, {
    icon: '✉️',
    label: 'Email',
    val: 'parts@partstrading.com'
  }, {
    icon: '🕐',
    label: 'Hours',
    val: 'Mon–Sat, 9 AM – 6 PM IST'
  }].map(item => /*#__PURE__*/React.createElement("div", {
    key: item.label,
    style: {
      display: 'flex',
      gap: 16,
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 22,
      flexShrink: 0,
      marginTop: 1
    },
    "aria-hidden": "true"
  }, item.icon), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: D,
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: T.textMuted,
      marginBottom: 3
    }
  }, item.label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: B,
      fontSize: 15,
      color: T.text,
      lineHeight: 1.5
    }
  }, item.val))))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: T.bgCard,
      borderRadius: 20,
      padding: isMobile ? '24px 20px' : '44px',
      border: `1px solid ${T.border}`,
      boxShadow: '0 24px 80px rgba(0,0,0,0.4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 14,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    htmlFor: "f-name",
    style: lS
  }, "Your Name"), /*#__PURE__*/React.createElement("input", {
    id: "f-name",
    type: "text",
    value: form.name,
    onChange: u('name'),
    placeholder: "Your full name",
    style: iS,
    onFocus: e => e.target.style.borderColor = AMBER,
    onBlur: e => e.target.style.borderColor = T.inputBorder
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    htmlFor: "f-phone",
    style: lS
  }, "Phone (with country code)"), /*#__PURE__*/React.createElement("input", {
    id: "f-phone",
    type: "tel",
    value: form.phone,
    onChange: u('phone'),
    placeholder: "+1 / +44 / +91 \u2026",
    style: iS,
    onFocus: e => e.target.style.borderColor = AMBER,
    onBlur: e => e.target.style.borderColor = T.inputBorder
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "f-email",
    style: lS
  }, "Email"), /*#__PURE__*/React.createElement("input", {
    id: "f-email",
    type: "email",
    value: form.email,
    onChange: u('email'),
    placeholder: "you@company.com",
    style: iS,
    onFocus: e => e.target.style.borderColor = AMBER,
    onBlur: e => e.target.style.borderColor = T.inputBorder
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "f-brand",
    style: lS
  }, "Equipment Brand / Model"), /*#__PURE__*/React.createElement("input", {
    id: "f-brand",
    type: "text",
    value: form.brand,
    onChange: u('brand'),
    placeholder: "e.g. Volvo EC300, Scania R440, Komatsu PC200",
    style: iS,
    onFocus: e => e.target.style.borderColor = AMBER,
    onBlur: e => e.target.style.borderColor = T.inputBorder
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "f-part",
    style: lS
  }, "Part Number / Description"), /*#__PURE__*/React.createElement("textarea", {
    id: "f-part",
    value: form.part,
    onChange: u('part'),
    rows: 4,
    placeholder: "Enter part number or describe what you need\u2026",
    style: {
      ...iS,
      resize: 'vertical'
    },
    onFocus: e => e.target.style.borderColor = AMBER,
    onBlur: e => e.target.style.borderColor = T.inputBorder
  })), /*#__PURE__*/React.createElement("button", {
    onClick: emailFirst ? sendEmail : sendWA,
    style: {
      width: '100%',
      background: T.accent,
      color: T.accentDark,
      padding: '16px 0',
      border: 'none',
      borderRadius: 10,
      fontFamily: D,
      fontWeight: 900,
      fontSize: 17,
      cursor: 'pointer',
      letterSpacing: '0.07em',
      textTransform: 'uppercase',
      transition: 'all 0.2s',
      boxShadow: '0 8px 32px rgba(255,184,28,0.2)',
      marginBottom: 10
    },
    onMouseEnter: e => {
      e.currentTarget.style.opacity = '0.88';
      e.currentTarget.style.transform = 'translateY(-1px)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.opacity = '1';
      e.currentTarget.style.transform = 'none';
    }
  }, emailFirst ? 'Send Email Enquiry →' : 'Send Enquiry on WhatsApp →'), /*#__PURE__*/React.createElement("button", {
    onClick: emailFirst ? sendWA : sendEmail,
    style: {
      width: '100%',
      background: 'transparent',
      color: T.textMuted,
      padding: '12px 0',
      border: `1px solid ${T.border}`,
      borderRadius: 10,
      fontFamily: B,
      fontWeight: 600,
      fontSize: 14,
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    onMouseEnter: e => {
      e.currentTarget.style.borderColor = AMBER;
      e.currentTarget.style.color = AMBER;
    },
    onMouseLeave: e => {
      e.currentTarget.style.borderColor = T.border;
      e.currentTarget.style.color = T.textMuted;
    }
  }, emailFirst ? 'Or send on WhatsApp →' : 'Or send by email →'), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: B,
      fontSize: 11.5,
      color: T.textMuted,
      textAlign: 'center',
      marginTop: 12
    }
  }, emailFirst ? 'Opens your email client with details pre-filled' : 'Opens WhatsApp with your details pre-filled'))));
}

// ── FOOTER ────────────────────────────────────────────────────────────────────
const FOOTER_COLS = [{
  h: 'Browse Brands',
  links: [['Volvo Parts', '/volvo/'], ['Scania Parts', '/scania/'], ['Komatsu Parts', '/komatsu/'], ['CAT Parts', '/cat/'], ['Hitachi Parts', '/hitachi/'], ['Sany Parts', '/sany/'], ['JCB Parts', '/jcb/'], ['All Brands', '/']]
}, {
  h: 'Part Categories',
  links: [['Engine Parts', '/volvo/engine-parts/'], ['Hydraulic Parts', '/volvo/hydraulic-parts/'], ['Filters', '/volvo/filters/'], ['Undercarriage', '/komatsu/undercarriage/'], ['Transmission', '/volvo/transmission-parts/'], ['All Categories', '/volvo/']]
}, {
  h: 'Company',
  links: [['About PTC', '/about.html'], ['Blog & Guides', '/blog/'], ['Parts Interchange Lookup', '/parts-interchange-lookup.html'], ['Contact Us', '/contact.html'], ['Int\'l Shipping', '/deliveries.html'], ['Get a Quote', '/get-a-quote.html']]
}];
function Footer() {
  const {
    T,
    AMBER,
    isMobile
  } = useTheme();
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: T.footerBg,
      padding: isMobile ? '40px 20px 24px' : '56px 32px 32px',
      borderTop: `1px solid ${T.border}`
    },
    role: "contentinfo"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1360,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : '2fr 1fr 1fr 1fr',
      gap: isMobile ? 28 : 48,
      marginBottom: isMobile ? 32 : 48
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
    src: "assets/images/ptc-logo.png",
    alt: "Parts Trading Company",
    style: {
      height: 34,
      width: 'auto',
      marginBottom: 18
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: B,
      fontSize: 13,
      color: T.textMuted,
      lineHeight: 1.75,
      maxWidth: 270,
      marginBottom: 20
    }
  }, "Globally trusted supplier of OEM & aftermarket heavy equipment spare parts. Established 1956. Shipping to 50+ countries."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "https://wa.me/919821037990",
    target: "_blank",
    rel: "noopener noreferrer",
    "aria-label": "WhatsApp PTC",
    style: {
      width: 34,
      height: 34,
      borderRadius: '50%',
      background: WG,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textDecoration: 'none',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "white",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
  }))), /*#__PURE__*/React.createElement("a", {
    href: "mailto:parts@partstrading.com",
    "aria-label": "Email PTC",
    style: {
      width: 34,
      height: 34,
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.05)',
      border: `1px solid ${T.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textDecoration: 'none',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(255,255,255,0.45)",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "4",
    width: "20",
    height: "16",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
  }))), /*#__PURE__*/React.createElement("a", {
    href: "tel:+919821037990",
    "aria-label": "Call PTC",
    style: {
      width: 34,
      height: 34,
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.05)',
      border: `1px solid ${T.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textDecoration: 'none',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(255,255,255,0.45)",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.07 6.07l1.86-1.86a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
  }))), /*#__PURE__*/React.createElement("a", {
    href: "https://www.instagram.com/partstradingco",
    target: "_blank",
    rel: "noopener noreferrer",
    "aria-label": "PTC on Instagram",
    style: {
      width: 34,
      height: 34,
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.05)',
      border: `1px solid ${T.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textDecoration: 'none',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(255,255,255,0.45)",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "2",
    width: "20",
    height: "20",
    rx: "5",
    ry: "5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "17.5",
    y1: "6.5",
    x2: "17.51",
    y2: "6.5"
  }))), /*#__PURE__*/React.createElement("a", {
    href: "https://www.linkedin.com/company/81588687/",
    target: "_blank",
    rel: "noopener noreferrer",
    "aria-label": "PTC on LinkedIn",
    style: {
      width: 34,
      height: 34,
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.05)',
      border: `1px solid ${T.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textDecoration: 'none',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "rgba(255,255,255,0.45)",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "9",
    width: "4",
    height: "12"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "4",
    cy: "4",
    r: "2"
  }))))), FOOTER_COLS.map(col => /*#__PURE__*/React.createElement("div", {
    key: col.h
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: D,
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: '0.14em',
      color: AMBER,
      textTransform: 'uppercase',
      marginBottom: 16
    }
  }, col.h), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 11
    }
  }, col.links.map(([l, h]) => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: h,
    style: {
      fontFamily: B,
      fontSize: 13,
      color: T.textMuted,
      textDecoration: 'none',
      transition: 'color 0.18s'
    },
    onMouseEnter: e => e.currentTarget.style.color = AMBER,
    onMouseLeave: e => e.currentTarget.style.color = T.textMuted
  }, l)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: T.border,
      marginBottom: 22
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: B,
      fontSize: 11,
      color: 'rgba(255,255,255,0.15)'
    }
  }, "\xA9 2026 Parts Trading Company \xB7 All rights reserved"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: B,
      fontSize: 11,
      color: 'rgba(255,255,255,0.15)'
    }
  }, "Vijay Chambers, Grant Road East, Mumbai 400004, India")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: B,
      fontSize: 10,
      color: 'rgba(255,255,255,0.28)',
      lineHeight: 1.6
    }
  }, "Part numbers, brand names, and OEM references on this website are used solely for identification and compatibility purposes. Parts Trading Company is an independent aftermarket supplier and is not affiliated with, endorsed by, or sponsored by Volvo CE, Komatsu, Caterpillar, Scania, Hitachi, or any other OEM. All trademarks and registered trademarks are the property of their respective owners."))));
}

// ── WA FLOAT PILL ─────────────────────────────────────────────────────────────
function WAFloatPill() {
  const {isMobile} = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [hov, setHov] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 300);
    window.addEventListener('scroll', h, {
      passive: true
    });
    return () => window.removeEventListener('scroll', h);
  }, []);
  if (isMobile) return null;
  return /*#__PURE__*/React.createElement("a", {
    href: "https://wa.me/919821037990",
    target: "_blank",
    rel: "noopener noreferrer",
    "aria-label": "Chat on WhatsApp",
    onMouseEnter: () => setHov(true),
    onMouseLeave: () => setHov(false),
    style: {
      position: 'fixed',
      bottom: 32,
      right: 32,
      zIndex: 997,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      background: hov ? '#1a1a1a' : '#111',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 40,
      padding: '11px 20px 11px 14px',
      textDecoration: 'none',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      opacity: scrolled ? 1 : 0,
      transform: scrolled ? 'translateY(0)' : 'translateY(12px)',
      transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
      pointerEvents: scrolled ? 'auto' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 28,
      height: 28,
      borderRadius: '50%',
      background: WG,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "white",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: B,
      fontSize: 13,
      fontWeight: 700,
      color: hov ? '#fff' : 'rgba(255,255,255,0.7)',
      letterSpacing: '0.02em',
      transition: 'color 0.2s'
    }
  }, "WhatsApp Us"));
}

// ── MOBILE STICKY BAR ─────────────────────────────────────────────────────────
function MobileStickyBar() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 998,
      background: 'rgba(5,5,5,0.97)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      padding: '12px 16px',
      display: 'none',
      gap: 10
    },
    className: "mobile-sticky"
  }, /*#__PURE__*/React.createElement("a", {
    href: "https://wa.me/919821037990",
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      background: WG,
      color: '#fff',
      textDecoration: 'none',
      padding: '13px',
      borderRadius: 10,
      fontFamily: D,
      fontWeight: 800,
      fontSize: 15,
      letterSpacing: '0.05em'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "white",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
  })), "WhatsApp Now"), /*#__PURE__*/React.createElement("a", {
    href: "#contact",
    style: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: AMBER,
      color: '#050505',
      textDecoration: 'none',
      padding: '13px',
      borderRadius: 10,
      fontFamily: D,
      fontWeight: 800,
      fontSize: 15,
      letterSpacing: '0.05em'
    }
  }, "Get Quote"));
}

// ── OPERATIONS STRIP ──────────────────────────────────────────────────────────
const OPS_SHOTS = [{
  img: 'assets/images/warehouse-shelves.jpg',
  label: '75,000+ parts. Mumbai.',
  caption: 'Floor-to-ceiling stock across 8 part categories — available for same-day dispatch.'
}, {
  img: 'assets/images/team-counter.jpg',
  label: 'Expert team. Real knowledge.',
  caption: 'Our team has been matching parts to machines for decades. No call centres.'
}, {
  img: 'assets/images/dispatch.jpg',
  label: 'Shipped worldwide, every day.',
  caption: 'PTC-branded crates with full customs documentation — dispatched across 50+ countries daily.'
}, {
  img: 'assets/images/packing.jpg',
  label: 'Crated for international freight.',
  caption: 'Every part packed to withstand long-haul freight — hydraulics, engines, undercarriage.'
}];
function OperationsStrip() {
  const {
    T,
    AMBER,
    isMobile
  } = useTheme();
  return /*#__PURE__*/React.createElement("section", {
    "aria-label": "Our operations",
    style: {
      background: T.bg,
      borderTop: `1px solid ${T.border}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1360,
      margin: '0 auto',
      padding: isMobile ? '56px 20px 32px' : '96px 32px 52px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: 48,
      flexWrap: 'wrap',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Behind Every Order"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: D,
      fontWeight: 900,
      fontSize: 'clamp(28px,4vw,52px)',
      color: T.text,
      lineHeight: 0.95,
      letterSpacing: '-0.02em',
      textTransform: 'uppercase'
    }
  }, "This Is What", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      color: AMBER
    }
  }, "We Actually Do."))), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: B,
      fontSize: 15,
      color: T.textMuted,
      maxWidth: 360,
      lineHeight: 1.75
    }
  }, "Not a marketplace. Not a broker. A real warehouse, a real team, and decades of getting the right part to the right place, fast."))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)',
      gap: 2
    }
  }, OPS_SHOTS.map((s, i) => {
    const [hov, setHov] = useState(false);
    const [ref, inView] = useInView({
      threshold: 0.1
    });
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      ref: ref,
      onMouseEnter: () => setHov(true),
      onMouseLeave: () => setHov(false),
      style: {
        position: 'relative',
        overflow: 'hidden',
        height: isMobile ? 260 : 480,
        cursor: 'default',
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : 'translateY(24px)',
        transition: `opacity 0.6s ${i * 0.1}s ease, transform 0.6s ${i * 0.1}s ease`
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${s.img})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transform: hov ? 'scale(1.04)' : 'scale(1)',
        transition: 'transform 0.6s cubic-bezier(0.4,0,0.2,1)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: hov ? 'rgba(0,0,0,0.55)' : 'rgba(0,0,0,0.45)',
        transition: 'background 0.4s'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '28px 24px',
        background: 'linear-gradient(transparent,rgba(0,0,0,0.85))'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: D,
        fontWeight: 800,
        fontSize: 15,
        color: AMBER,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        marginBottom: 8
      }
    }, s.label), /*#__PURE__*/React.createElement("p", {
      style: {
        fontFamily: B,
        fontSize: 13,
        color: 'rgba(255,255,255,0.65)',
        lineHeight: 1.6,
        maxHeight: hov ? 80 : 0,
        overflow: 'hidden',
        transition: 'max-height 0.4s ease',
        opacity: hov ? 1 : 0
      }
    }, s.caption)));
  })));
}

// ── INDUSTRIES ────────────────────────────────────────────────────────────────
const INDUSTRIES = [{
  id: 'mining',
  name: 'Mining &\nExtraction',
  img: 'assets/images/industries/mining.jpg',
  gradient: 'linear-gradient(135deg,#1a0f00 0%,#0d0800 100%)',
  accent: '#FFB81C',
  desc: 'Open-pit, underground, and coal — when a machine stops, production stops. One of India\'s few dedicated underground mining parts suppliers: Epiroc, Sandvik, Atlas Copco, and Normet alongside the full surface fleet.',
  parts: ['Final drives & track assemblies', 'Hydraulic pump & motor rebuilds', 'Rock drill & LHD drivetrain parts', 'Dump truck brake & suspension'],
  brands: 'Komatsu · CAT · Hitachi · Epiroc · Sandvik + more'
}, {
  id: 'construction',
  name: 'Construction\n& Infrastructure',
  img: 'assets/images/industries/construction.jpg',
  gradient: 'linear-gradient(135deg,#001a0d 0%,#000d06 100%)',
  accent: '#FFB81C',
  desc: 'Site timelines don\'t flex. From excavator slew rings to loader transmission packs, we supply the components that keep infrastructure projects on schedule across South Asia and Africa.',
  parts: ['Excavator boom & arm cylinder seals', 'Wheel loader transmission kits', 'Compactor drum & vibratory parts', 'Crane slew ring & swing motor'],
  brands: 'Volvo · CAT · Komatsu · LiuGong · Hyundai'
}, {
  id: 'road',
  name: 'Road Building\n& Quarrying',
  img: 'assets/images/industries/road.jpg',
  gradient: 'linear-gradient(135deg,#0d0d1a 0%,#06060d 100%)',
  accent: '#FFB81C',
  desc: 'Motor graders, pavers, and compactors take punishing daily loads. We carry the specialist parts for road-building equipment that most suppliers don\'t stock — including circle drives, screed components, and roller bearings.',
  parts: ['Motor grader circle & blade parts', 'Paver screed & auger components', 'Compactor roller drum bearings', 'Rock drill & breaker tooling'],
  brands: 'CAT · Volvo · BEML · Komatsu · Sandvik'
}, {
  id: 'haulage',
  name: 'Haulage &\nFleet Operations',
  img: 'assets/images/industries/haulage.jpg',
  gradient: 'linear-gradient(135deg,#1a1000 0%,#0d0800 100%)',
  accent: '#FFB81C',
  desc: 'Long-haul fleet managers across India, Russia, and East Africa rely on PTC for engine, drivetrain, and braking parts. OEM and aftermarket available. Bulk orders dispatched same day.',
  parts: ['Engine overhaul & gasket kits', 'Clutch & gearbox assemblies', 'Fuel injection & turbocharger', 'Air brake & suspension parts'],
  brands: 'Scania · Volvo · Cummins · HELLA · Garrett'
}, {
  id: 'underground',
  name: 'Underground\nMining',
  img: 'assets/images/industries/underground.jpg',
  gradient: 'linear-gradient(135deg,#0a0a0a 0%,#050505 100%)',
  accent: '#FFB81C',
  desc: 'One of India\'s few dedicated underground mining parts suppliers. Rock drills, LHDs, shotcrete machines, and roof bolters — we stock the specialist components that keep drives and stopes running.',
  parts: ['Rock drill consumables & shanks', 'LHD drivetrain & hydraulics', 'Shotcrete pump & mixer parts', 'Roof bolter & feeder components'],
  brands: 'Epiroc · Sandvik · Atlas Copco · Normet + more'
}, {
  id: 'marine',
  name: 'Marine &\nOffshore',
  img: 'assets/images/industries/marine.jpg',
  gradient: 'linear-gradient(135deg,#000d1a 0%,#000608 100%)',
  accent: '#FFB81C',
  desc: 'Vessel downtime costs thousands per hour. We supply engine, gearbox, and auxiliary system parts for commercial marine — fishing fleets, offshore support vessels, barges, and port equipment.',
  parts: ['Marine diesel engine overhaul kits', 'Gearbox & propulsion shaft parts', 'Auxiliary generator components', 'Deck & winch hydraulic parts'],
  brands: 'Volvo Penta · Cummins · Caterpillar · HELLA + more'
}];
function IndustryCard({
  ind,
  index
}) {
  const {
    T,
    AMBER,
    isMobile
  } = useTheme();
  const [hov, setHov] = useState(false);
  const [ref, inView] = useInView({
    threshold: 0.15
  });
  const isEven = index % 2 === 0;
  return /*#__PURE__*/React.createElement("article", {
    ref: ref,
    onMouseEnter: () => setHov(true),
    onMouseLeave: () => setHov(false),
    style: {
      position: 'relative',
      overflow: 'hidden',
      background: ind.gradient,
      backgroundImage: `url(${ind.img}), ${ind.gradient}`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      opacity: inView ? 1 : 0,
      transform: inView ? 'none' : `translateY(40px)`,
      transition: `opacity 0.7s ${index * 0.12}s ease, transform 0.7s ${index * 0.12}s ease`,
      minHeight: isMobile ? 360 : 540,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      cursor: 'default'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: hov ? 'rgba(0,0,0,0.72)' : 'rgba(0,0,0,0.82)',
      transition: 'background 0.4s ease'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 3,
      background: AMBER,
      transform: hov ? 'scaleX(1)' : 'scaleX(0)',
      transformOrigin: 'left',
      transition: 'transform 0.4s ease'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 1,
      padding: '40px 36px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: D,
      fontWeight: 900,
      fontSize: 'clamp(32px,3.5vw,52px)',
      color: '#fff',
      lineHeight: 0.95,
      letterSpacing: '-0.02em',
      textTransform: 'uppercase',
      marginBottom: 20,
      whiteSpace: 'pre-line'
    }
  }, ind.name), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: B,
      fontSize: 14,
      color: 'rgba(255,255,255,0.55)',
      lineHeight: 1.75,
      marginBottom: 24,
      maxWidth: 320,
      transition: 'opacity 0.3s',
      opacity: hov ? 1 : 0.7
    }
  }, ind.desc), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      marginBottom: 24
    }
  }, ind.parts.map(p => /*#__PURE__*/React.createElement("li", {
    key: p,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      fontFamily: B,
      fontSize: 13,
      color: 'rgba(255,255,255,0.65)',
      marginBottom: 8,
      fontWeight: 500
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 4,
      height: 4,
      borderRadius: '50%',
      background: AMBER,
      flexShrink: 0,
      display: 'inline-block'
    }
  }), p))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: D,
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: AMBER,
      marginBottom: 20,
      opacity: 0.7
    }
  }, ind.brands), /*#__PURE__*/React.createElement("a", {
    href: WA(`Hi, I need parts for ${ind.name.replace('\n', ' ')} equipment. Can you help?`),
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      background: hov ? AMBER : 'transparent',
      color: hov ? '#050505' : 'rgba(255,255,255,0.8)',
      border: `1px solid ${hov ? AMBER : 'rgba(255,255,255,0.25)'}`,
      textDecoration: 'none',
      padding: '11px 22px',
      borderRadius: 8,
      fontFamily: D,
      fontWeight: 800,
      fontSize: 14,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      transition: 'all 0.3s ease'
    }
  }, "Enquire Now \u2192")));
}
function Industries() {
  const {
    T,
    AMBER,
    isMobile
  } = useTheme();
  return /*#__PURE__*/React.createElement("section", {
    id: "industries",
    "aria-labelledby": "industries-heading",
    style: {
      background: T.bg,
      borderTop: `1px solid ${T.border}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1360,
      margin: '0 auto',
      padding: isMobile ? '56px 20px 32px' : '96px 32px 52px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: 52,
      flexWrap: 'wrap',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Industries We Serve"), /*#__PURE__*/React.createElement("h2", {
    id: "industries-heading",
    style: {
      fontFamily: D,
      fontWeight: 900,
      fontSize: 'clamp(30px,4.5vw,58px)',
      color: T.text,
      lineHeight: 0.95,
      letterSpacing: '-0.02em',
      textTransform: 'uppercase'
    }
  }, "Built for the", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      color: AMBER
    }
  }, "World's Hardest Jobs"))), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: B,
      fontSize: 15,
      color: T.textMuted,
      maxWidth: 400,
      lineHeight: 1.7
    }
  }, "From open-pit mines in Jharkhand to road projects across East Africa \u2014 if heavy equipment runs there, we supply the parts."))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)'
    }
  }, INDUSTRIES.map((ind, i) => /*#__PURE__*/React.createElement(IndustryCard, {
    key: ind.id,
    ind: ind,
    index: i
  }))));
}

// ── CASE STUDIES ──────────────────────────────────────────────────────────────
const CASE_STUDIES = [{
  tag: 'Mining · Jharkhand, India',
  flag: '🇮🇳',
  headline: '47 parts. 3 machines. Back online in 72 hours.',
  equipment: 'Komatsu PC800 · HD785 dump trucks',
  challenge: 'A coal mining operator faced simultaneous hydraulic failures across three excavators during peak production season. Standard lead time from OEM channels was 3–4 weeks.',
  result: 'PTC supplied 47 line items — hydraulic pumps, cylinder seal kits, and swing motor components — from in-stock inventory. All three machines resumed operations within 72 hours of the initial call.',
  metric: '72 hrs',
  metricLabel: 'Total turnaround'
}, {
  tag: 'Fleet Operations · Dubai, UAE',
  flag: '🇦🇪',
  headline: 'A standing supply agreement that outlasted three procurement managers.',
  equipment: 'Scania R580 · Volvo FH16 · CAT 777G',
  challenge: 'A regional logistics group managing 200+ heavy vehicles needed a single reliable source for Scania, Volvo, and CAT parts across three countries — without the delays and quality inconsistencies of spot buying.',
  result: 'PTC established a monthly consolidated shipment schedule. Parts arrive pre-sorted by fleet and vehicle. The client has not used a secondary supplier in over five years.',
  metric: '5+ years',
  metricLabel: 'Uninterrupted supply'
}, {
  tag: 'Road Construction · Nairobi, Kenya',
  flag: '🇰🇪',
  headline: 'Motor grader circle drive. Sourced and shipped in 4 days.',
  equipment: 'CAT 140M Motor Grader',
  challenge: 'A road infrastructure contractor had a CAT 140M grader down mid-project with a failed circle drive assembly — a specialist component most suppliers list as 6–8 weeks lead time.',
  result: 'PTC confirmed availability within 2 hours, issued a proforma invoice the same afternoon, and dispatched via DHL Express to Nairobi. Part cleared customs and was fitted on day four.',
  metric: '4 days',
  metricLabel: 'Nairobi, door to door'
}];
const CASE_STUDY_URLS = ['/blog/case-study-jharkhand-komatsu-mining.html', '/blog/case-study-dubai-fleet-scania-volvo.html', '/blog/case-study-nairobi-cat-grader.html'];
function CaseStudyCard({
  cs,
  index
}) {
  const {
    T,
    AMBER
  } = useTheme();
  const [ref, inView] = useInView({
    threshold: 0.2
  });
  return /*#__PURE__*/React.createElement("article", {
    ref: ref,
    style: {
      background: T.bgCard,
      border: `1px solid ${T.border}`,
      borderRadius: 2,
      padding: '44px 40px',
      position: 'relative',
      overflow: 'hidden',
      opacity: inView ? 1 : 0,
      transform: inView ? 'none' : 'translateY(32px)',
      transition: `opacity 0.7s ${index * 0.15}s ease, transform 0.7s ${index * 0.15}s ease`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 3,
      background: `linear-gradient(90deg,${AMBER},rgba(255,184,28,0.2))`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 28
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16
    },
    "aria-hidden": "true"
  }, cs.flag), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: D,
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: T.textMuted
    }
  }, cs.tag)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: D,
      fontWeight: 900,
      fontSize: 'clamp(44px,5vw,64px)',
      color: AMBER,
      lineHeight: 1,
      letterSpacing: '-0.03em'
    }
  }, cs.metric), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: B,
      fontSize: 12,
      color: T.textMuted,
      fontWeight: 600,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      marginTop: 4
    }
  }, cs.metricLabel)), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: D,
      fontWeight: 800,
      fontSize: 'clamp(18px,2vw,24px)',
      color: T.text,
      lineHeight: 1.2,
      marginBottom: 16,
      textTransform: 'uppercase',
      letterSpacing: '0.01em'
    }
  }, cs.headline), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: D,
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: AMBER,
      marginBottom: 20,
      opacity: 0.6
    }
  }, cs.equipment), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: D,
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: T.textMuted,
      marginBottom: 6
    }
  }, "The Situation"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: B,
      fontSize: 14,
      color: T.textMuted,
      lineHeight: 1.75
    }
  }, cs.challenge)), /*#__PURE__*/React.createElement("div", {
    style: {
      borderLeft: `2px solid ${AMBER}`,
      paddingLeft: 16,
      marginBottom: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: D,
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: AMBER,
      marginBottom: 6
    }
  }, "What Happened"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: B,
      fontSize: 14,
      color: T.text,
      lineHeight: 1.75
    }
  }, cs.result)), /*#__PURE__*/React.createElement("a", {
    href: CASE_STUDY_URLS[index],
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontFamily: D,
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: AMBER,
      textDecoration: 'none',
      opacity: 0.75,
      transition: 'opacity 0.2s'
    },
    onMouseEnter: e => e.currentTarget.style.opacity = '1',
    onMouseLeave: e => e.currentTarget.style.opacity = '0.75'
  }, "Read full case study ", /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 12h14M12 5l7 7-7 7"
  }))));
}
function CaseStudies() {
  const {
    T,
    AMBER,
    isMobile
  } = useTheme();
  return /*#__PURE__*/React.createElement("section", {
    "aria-labelledby": "cases-heading",
    style: {
      background: T.bgSection,
      padding: isMobile ? '56px 16px' : '96px 32px',
      borderTop: `1px solid ${T.border}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1360,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: 56,
      flexWrap: 'wrap',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Field Proven"), /*#__PURE__*/React.createElement("h2", {
    id: "cases-heading",
    style: {
      fontFamily: D,
      fontWeight: 900,
      fontSize: 'clamp(30px,4.5vw,58px)',
      color: T.text,
      lineHeight: 0.95,
      letterSpacing: '-0.02em',
      textTransform: 'uppercase'
    }
  }, "When Machines", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      color: AMBER
    }
  }, "Can't Wait"))), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: B,
      fontSize: 15,
      color: T.textMuted,
      maxWidth: 380,
      lineHeight: 1.7
    }
  }, "Real situations. Real timelines. No embellishment \u2014 just what happens when you call PTC with an urgent requirement.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))',
      gap: 2
    }
  }, CASE_STUDIES.map((cs, i) => /*#__PURE__*/React.createElement(CaseStudyCard, {
    key: i,
    cs: cs,
    index: i
  })))));
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
const FAQS = [{
  q: 'Do you supply OEM or aftermarket parts?',
  a: 'Both. OEM parts are genuine manufacturer-sourced components. Our aftermarket parts meet or exceed OEM specifications and come from trusted manufacturers — MAHLE, Garrett, HELLA, Dayco, and others. Every part is clearly labelled. You always know exactly what you\'re getting.'
}, {
  q: 'How long does international shipping take?',
  a: 'Most orders ship within 24–48 hours of payment confirmation. Typical transit times by region: Gulf & Middle East 3–5 days · Southeast Asia 4–8 days · Africa 5–10 days · Europe 6–9 days · North America (USA, Canada) 7–12 days · Russia & Central Asia 7–14 days · South America 9–14 days · Australia & New Zealand 7–10 days. We ship via DHL, FedEx, and specialist freight forwarders for heavy consignments.'
}, {
  q: 'What payment methods do you accept?',
  a: 'SWIFT international wire transfer, UPI (India), and in select cases PayPal or credit card. A proforma invoice is issued before any payment. For established clients with a track record, we offer credit terms.'
}, {
  q: 'Can I get a formal quotation or proforma invoice?',
  a: 'Yes — send part numbers via WhatsApp or the contact form. We respond with a formal quotation within 60 minutes on business days (Mon–Sat, 9 AM–6 PM IST), including availability, price, and estimated shipping cost to your country.'
}, {
  q: 'Is there a minimum order value?',
  a: 'No minimum for Indian buyers. For international orders, we recommend a minimum of USD 200 to keep shipping costs proportionate — but we evaluate every enquiry individually. Many of our long-term international clients started with a single small order.'
}, {
  q: 'How do I find my correct part number?',
  a: 'Check your equipment\'s parts manual, the component itself (most carry a stamped number), or your machine\'s service record. If you can\'t locate it, send your equipment model and serial number on WhatsApp — our team will identify the correct part.'
}, {
  q: 'What if the part is incorrect or doesn\'t fit?',
  a: 'We stand behind every order. If a part is incorrect due to an error on our side, we replace or refund it. This is why we always confirm part details with you before taking payment — it protects both sides.'
}, {
  q: 'Do you handle customs documentation for exports?',
  a: 'Yes. We have 70 years of export experience. We provide commercial invoices, packing lists, certificates of origin, and country-specific compliance paperwork for every international shipment. We regularly supply to Russia, Nigeria, Bangladesh, Myanmar, and other tightly regulated markets.'
}, {
  q: 'Can I visit your warehouse in Mumbai?',
  a: 'Yes. We\'re at Vijay Chambers, Grant Road East, Mumbai 400004. Open Mon–Sat, 9 AM–6 PM IST. We recommend calling ahead so your enquiry is ready when you arrive.'
}, {
  q: 'How do repeat orders work?',
  a: 'The easiest way is WhatsApp — send your previous order reference or part numbers and we\'ll turn it around immediately. Many international clients maintain a standing parts list with us for scheduled monthly dispatch.'
}];
function FAQItem({
  faq,
  index
}) {
  const {
    T,
    AMBER
  } = useTheme();
  const [open, setOpen] = useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderBottom: `1px solid ${T.border}`,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpen(o => !o),
    "aria-expanded": open,
    style: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '24px 0',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      gap: 24,
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: D,
      fontWeight: 700,
      fontSize: 'clamp(16px,2vw,20px)',
      color: open ? AMBER : T.text,
      letterSpacing: '0.01em',
      lineHeight: 1.3,
      transition: 'color 0.25s',
      textTransform: 'uppercase'
    }
  }, faq.q), /*#__PURE__*/React.createElement("span", {
    style: {
      flexShrink: 0,
      width: 28,
      height: 28,
      borderRadius: '50%',
      border: `1px solid ${open ? AMBER : T.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.25s',
      background: open ? AMBER : 'transparent'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 12 12",
    fill: "none",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2 4.5L6 8.5L10 4.5",
    stroke: open ? '#050505' : T.textMuted,
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      transform: open ? 'rotate(180deg)' : 'none',
      transformOrigin: 'center',
      transition: 'transform 0.25s'
    }
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxHeight: open ? 400 : 0,
      overflow: 'hidden',
      transition: 'max-height 0.4s cubic-bezier(0.4,0,0.2,1)'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: B,
      fontSize: 15,
      color: T.textMuted,
      lineHeight: 1.8,
      paddingBottom: 24,
      maxWidth: 760
    }
  }, faq.a)));
}
function FAQ() {
  const {
    T,
    AMBER,
    isMobile
  } = useTheme();
  return /*#__PURE__*/React.createElement("section", {
    id: "faq",
    "aria-labelledby": "faq-heading",
    style: {
      background: T.bg,
      padding: isMobile ? '56px 20px' : '96px 32px',
      borderTop: `1px solid ${T.border}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1360,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 2fr',
      gap: isMobile ? 32 : 80,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: isMobile ? 'static' : 'sticky',
      top: 120
    }
  }, /*#__PURE__*/React.createElement(Label, null, "FAQ"), /*#__PURE__*/React.createElement("h2", {
    id: "faq-heading",
    style: {
      fontFamily: D,
      fontWeight: 900,
      fontSize: 'clamp(30px,3.5vw,52px)',
      color: T.text,
      lineHeight: 0.95,
      letterSpacing: '-0.02em',
      textTransform: 'uppercase',
      marginBottom: 24
    }
  }, "Questions", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      color: AMBER
    }
  }, "Answered.")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: B,
      fontSize: 15,
      color: T.textMuted,
      lineHeight: 1.75,
      marginBottom: 36
    }
  }, "Anything not covered here \u2014 ask us directly. We respond to every serious enquiry."), /*#__PURE__*/React.createElement("a", {
    href: WA('Hi, I have a question about ordering parts from PTC.'),
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      background: WG,
      color: '#fff',
      textDecoration: 'none',
      padding: '12px 24px',
      borderRadius: 8,
      fontFamily: D,
      fontWeight: 800,
      fontSize: 14,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      transition: 'opacity 0.2s'
    },
    onMouseEnter: e => e.currentTarget.style.opacity = '0.85',
    onMouseLeave: e => e.currentTarget.style.opacity = '1'
  }, /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "white",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
  })), "Ask on WhatsApp")), /*#__PURE__*/React.createElement("div", null, FAQS.map((faq, i) => /*#__PURE__*/React.createElement(FAQItem, {
    key: i,
    faq: faq,
    index: i
  })))));
}

// ── APP ────────────────────────────────────────────────────────────────────────
function App() {
  const [geo, setGeo] = useState(null);
  const openSearch = useCallback(() => {
    ensureSearchDBLoaded();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    setTimeout(() => document.querySelector('input[type="search"]')?.focus(), 350);
  }, []);
  const [isDark, setIsDark] = useState(true);
  const T = isDark ? DARK_T : LIGHT_T;
  const AMBER = isDark ? '#FFB81C' : '#E8A000';
  const toggle = useCallback(() => setIsDark(d => !d), []);
  const isMobile = useIsMobile();
  useEffect(() => {
    document.body.style.background = T.bg;
    document.documentElement.style.setProperty('--sb-thumb', T.accent);
    document.documentElement.style.setProperty('--sb-track', isDark ? '#080808' : '#EFEFEF');
  }, [isDark]);
  useEffect(() => {
    fetch('https://ipapi.co/json/?fields=country_code,country_name,timezone,continent_code').then(r => r.json()).then(d => setGeo({
      country: d.country_code || '',
      countryName: d.country_name || '',
      timezone: d.timezone || '',
      continent: d.continent_code || ''
    })).catch(() => {});
  }, []);
  return /*#__PURE__*/React.createElement(ThemeCtx.Provider, {
    value: {
      T,
      AMBER,
      isDark,
      toggle,
      isMobile
    }
  }, /*#__PURE__*/React.createElement(GeoCtx.Provider, {
    value: geo
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: T.bg,
      minHeight: '100vh',
      transition: 'background 0.35s ease'
    }
  }, /*#__PURE__*/React.createElement(AnnouncementBar, null), /*#__PURE__*/React.createElement(Nav, {
    onSearchOpen: openSearch
  }), /*#__PURE__*/React.createElement("main", {
    id: "main-content"
  }, /*#__PURE__*/React.createElement(Hero, null), /*#__PURE__*/React.createElement(StatsBar, null), /*#__PURE__*/React.createElement(TrustStrip, null), /*#__PURE__*/React.createElement(LiveActivity, null), /*#__PURE__*/React.createElement(BrandGrid, null), /*#__PURE__*/React.createElement(HowItWorks, null), /*#__PURE__*/React.createElement(OperationsStrip, null), /*#__PURE__*/React.createElement(Industries, null), /*#__PURE__*/React.createElement(ProductCategories, null), /*#__PURE__*/React.createElement(PopularParts, null), /*#__PURE__*/React.createElement(EquipmentModels, null), /*#__PURE__*/React.createElement(GlobalReach, null), /*#__PURE__*/React.createElement(CaseStudies, null), /*#__PURE__*/React.createElement(Testimonials, null), /*#__PURE__*/React.createElement(BlogPreview, null), /*#__PURE__*/React.createElement(FAQ, null), /*#__PURE__*/React.createElement(WhatsAppCTA, null), /*#__PURE__*/React.createElement(Contact, null)), /*#__PURE__*/React.createElement(Footer, null), /*#__PURE__*/React.createElement(MobileStickyBar, null), /*#__PURE__*/React.createElement(WAFloatPill, null))));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));