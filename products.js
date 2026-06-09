// products.js — Full Product Catalog Page Logic

// ========== DATA & STATE ==========
const CATEGORIES = {
  'Traditional Indian': {
    emoji: '🪆',
    subs: ['Channapatna Toys', 'Kondapalli Craft', 'Etikoppaka', 'Wooden Dolls', 'Rocking Horses', 'Clay Toys']
  },
  'Vehicles & RC': {
    emoji: '🏎️',
    subs: ['RC Cars', 'RC Trucks', 'RC Drones', 'Toy Trains', 'Die-cast Cars', 'Electric Ride-Ons']
  },
  'Outdoor & Active': {
    emoji: '🛴',
    subs: ['Kick Scooters', 'Bicycles', 'Sports Kits', 'Kites', 'Garden Toys', 'Hoverboards']
  },
  'STEM & Learning': {
    emoji: '🔬',
    subs: ['Science Kits', 'Coding Toys', 'Building Blocks', 'Robotics', 'Puzzles', 'Math Games']
  },
  'Dolls & Plush': {
    emoji: '🧸',
    subs: ['Barbie & Fashion', 'Stuffed Animals', 'Action Figures', 'Baby Dolls', 'Collectibles', 'Anime Figures']
  },
  'Creative Arts': {
    emoji: '🎨',
    subs: ['Kitchen Sets', 'Drawing & Craft', 'Musical Toys', 'Clay & Dough', 'Doctor Sets', 'Dress-up & Costumes']
  },
  'Board Games': {
    emoji: '🎲',
    subs: ['Strategy Games', 'Family Games', 'Card Games', 'Chess & Ludo', 'Memory Games', 'Party Games']
  },
  '3D Model Toys': {
    emoji: '🧊',
    subs: ['3D Heroes', '3D Animals', '3D Vehicles', '3D Fantasy', '3D Robots']
  }
};

const AGE_GROUPS = ['0–2 Years', '3–4 Years', '5–7 Years', '8–11 Years', '12+ Years'];

const TOY_IMAGES = {
  'Vehicles & RC': [
    'https://rukminim2.flixcart.com/image/312/312/xif0q/remote-control-toy/f/h/b/high-speed-rc-car-rechargeable-remote-control-car-with-led-original-imagynkgwfrgztpb.jpeg?q=70',
    'https://rukminim2.flixcart.com/image/312/312/xif0q/remote-control-toy/b/z/u/1-14-scale-rc-alloy-drift-car-2-4ghz-control-with-led-lights-original-imagvdkh8bww7gqf.jpeg?q=70',
    'https://rukminim2.flixcart.com/image/312/312/xif0q/remote-control-toy/b/z/p/1-16-scale-remote-control-car-with-usb-charging-cable-360-degree-original-imagvdkh9qhuhggz.jpeg?q=70'
  ],
  'Outdoor & Active': [
    'https://rukminim2.flixcart.com/image/312/312/xif0q/kids-scooty/v/p/f/scooter-for-kids-kick-scooter-3-wheel-scooter-for-kids-ledwheel-original-imagynkzj5zrgy6z.jpeg?q=70',
    'https://rukminim2.flixcart.com/image/312/312/xif0q/cycle/k/y/k/20t-cycle-geared-multi-speed-bicycle-for-kids-girls-boys-8-10-original-imagvdkhgkwry3fg.jpeg?q=70'
  ],
  'Creative Arts': [
    'https://rukminim2.flixcart.com/image/312/312/xif0q/role-play-toy/b/3/l/44-pcs-kitchen-set-toy-for-kids-big-kitchen-set-with-real-water-original-imagunr3z5efckvf.jpeg?q=70',
    'https://rukminim2.flixcart.com/image/312/312/xif0q/role-play-toy/x/e/g/doctor-set-play-set-for-kids-educational-toys-with-stethoscope-original-imagvdkh4yqdmxhg.jpeg?q=70'
  ],
  'STEM & Learning': [
    'https://rukminim2.flixcart.com/image/312/312/xif0q/building-block/c/l/0/100-pcs-building-blocks-stem-toys-learning-educational-toy-for-original-imagvdkh5wg3pzuh.jpeg?q=70',
    'https://rukminim2.flixcart.com/image/312/312/xif0q/toy/f/b/v/stem-educational-gear-building-set-kids-construction-toy-90-pcs-original-imagvdkhhm8ggghq.jpeg?q=70'
  ],
  'Dolls & Plush': [
    'https://rukminim2.flixcart.com/image/312/312/xif0q/stuffed-toy/b/c/c/teddy-bear-soft-toy-lovable-and-cute-soft-toy-for-kids-girls-original-imagvdkh7fzk2qgf.jpeg?q=70',
    'https://rukminim2.flixcart.com/image/312/312/xif0q/doll/x/m/t/barbie-fashionista-doll-for-kids-original-imagvdkhk6gghzqf.jpeg?q=70'
  ],
  'Traditional Indian': [
    'https://rukminim2.flixcart.com/image/312/312/xif0q/toy/c/i/k/traditional-wooden-rocking-horse-push-pull-toys-for-babies-kids-original-imagvdkhhg7u3hha.jpeg?q=70',
    'https://rukminim2.flixcart.com/image/312/312/xif0q/toy/j/t/g/traditional-wooden-channapatna-toy-set-for-kids-original-imagvdkhhxyqzhzf.jpeg?q=70'
  ],
  'Board Games': [
    'https://rukminim2.flixcart.com/image/312/312/xif0q/board-game/t/7/x/chess-set-standard-chess-set-with-wooden-chess-board-original-imagvdkhhkwugqhg.jpeg?q=70',
    'https://rukminim2.flixcart.com/image/312/312/xif0q/board-game/b/u/k/ludo-king-classic-board-game-for-kids-original-imagvdkhhtwmzgfy.jpeg?q=70',
    'https://rukminim2.flixcart.com/image/312/312/xif0q/board-game/u/j/a/sequence-classic-family-board-game-original-imagvdkh3zv9j2rd.jpeg?q=70',
    'https://rukminim2.flixcart.com/image/312/312/xif0q/card-game/u/y/s/uno-cards-game-original-imagvdkhg7tkxv4z.jpeg?q=70'
  ],
  '3D Model Toys': [
    'assets/rc_car.png',
    'assets/kick_scooter.png',
    'assets/channapatna_toy.png',
    'assets/royal_elephant.png',
    'assets/stem_robot.png'
  ]
};

// Demo images for every subcategory (uses real product photos with local fallbacks)
const SUBCATEGORY_IMAGES = {
  'Channapatna Toys': ['assets/channapatna_toy.png', 'assets/royal_elephant.png'],
  'Kondapalli Craft': ['https://rukminim2.flixcart.com/image/312/312/xif0q/toy/j/t/g/traditional-wooden-channapatna-toy-set-for-kids-original-imagvdkhhxyqzhzf.jpeg?q=70', 'assets/channapatna_toy.png'],
  'Etikoppaka': ['https://rukminim2.flixcart.com/image/312/312/xif0q/toy/c/i/k/traditional-wooden-rocking-horse-push-pull-toys-for-babies-kids-original-imagvdkhhg7u3hha.jpeg?q=70', 'assets/channapatna_toy.png'],
  'Wooden Dolls': ['assets/channapatna_toy.png', 'assets/royal_elephant.png'],
  'Rocking Horses': ['https://rukminim2.flixcart.com/image/312/312/xif0q/toy/c/i/k/traditional-wooden-rocking-horse-push-pull-toys-for-babies-kids-original-imagvdkhhg7u3hha.jpeg?q=70', 'assets/channapatna_toy.png'],
  'Clay Toys': ['https://rukminim2.flixcart.com/image/312/312/xif0q/toy/j/t/g/traditional-wooden-channapatna-toy-set-for-kids-original-imagvdkhhxyqzhzf.jpeg?q=70', 'assets/channapatna_toy.png'],

  'RC Cars': ['https://rukminim2.flixcart.com/image/312/312/xif0q/remote-control-toy/f/h/b/high-speed-rc-car-rechargeable-remote-control-car-with-led-original-imagynkgwfrgztpb.jpeg?q=70', 'assets/rc_car.png'],
  'RC Trucks': ['https://rukminim2.flixcart.com/image/312/312/xif0q/remote-control-toy/b/z/u/1-14-scale-rc-alloy-drift-car-2-4ghz-control-with-led-lights-original-imagvdkh8bww7gqf.jpeg?q=70', 'assets/rc_car.png'],
  'RC Drones': ['https://rukminim2.flixcart.com/image/312/312/xif0q/remote-control-toy/b/z/p/1-16-scale-remote-control-car-with-usb-charging-cable-360-degree-original-imagvdkh9qhuhggz.jpeg?q=70', 'assets/stem_robot.png'],
  'Toy Trains': ['https://rukminim2.flixcart.com/image/312/312/xif0q/board-game/t/7/x/chess-set-standard-chess-set-with-wooden-chess-board-original-imagvdkhhkwugqhg.jpeg?q=70', 'assets/rc_car.png'],
  'Die-cast Cars': ['https://rukminim2.flixcart.com/image/312/312/xif0q/remote-control-toy/f/h/b/high-speed-rc-car-rechargeable-remote-control-car-with-led-original-imagynkgwfrgztpb.jpeg?q=70', 'assets/rc_car.png'],
  'Electric Ride-Ons': ['https://rukminim2.flixcart.com/image/312/312/xif0q/kids-scooty/v/p/f/scooter-for-kids-kick-scooter-3-wheel-scooter-for-kids-ledwheel-original-imagynkzj5zrgy6z.jpeg?q=70', 'assets/kick_scooter.png'],

  'Kick Scooters': ['https://rukminim2.flixcart.com/image/312/312/xif0q/kids-scooty/v/p/f/scooter-for-kids-kick-scooter-3-wheel-scooter-for-kids-ledwheel-original-imagynkzj5zrgy6z.jpeg?q=70', 'assets/kick_scooter.png'],
  'Bicycles': ['https://rukminim2.flixcart.com/image/312/312/xif0q/cycle/k/y/k/20t-cycle-geared-multi-speed-bicycle-for-kids-girls-boys-8-10-original-imagvdkhgkwry3fg.jpeg?q=70', 'assets/kick_scooter.png'],
  'Sports Kits': ['https://rukminim2.flixcart.com/image/312/312/xif0q/cycle/k/y/k/20t-cycle-geared-multi-speed-bicycle-for-kids-girls-boys-8-10-original-imagvdkhgkwry3fg.jpeg?q=70', 'assets/kick_scooter.png'],
  'Kites': ['https://rukminim2.flixcart.com/image/312/312/xif0q/cycle/k/y/k/20t-cycle-geared-multi-speed-bicycle-for-kids-girls-boys-8-10-original-imagvdkhgkwry3fg.jpeg?q=70', 'assets/kick_scooter.png'],
  'Garden Toys': ['https://rukminim2.flixcart.com/image/312/312/xif0q/kids-scooty/v/p/f/scooter-for-kids-kick-scooter-3-wheel-scooter-for-kids-ledwheel-original-imagynkzj5zrgy6z.jpeg?q=70', 'assets/kick_scooter.png'],
  'Hoverboards': ['https://rukminim2.flixcart.com/image/312/312/xif0q/kids-scooty/v/p/f/scooter-for-kids-kick-scooter-3-wheel-scooter-for-kids-ledwheel-original-imagynkzj5zrgy6z.jpeg?q=70', 'assets/kick_scooter.png'],

  'Science Kits': ['https://rukminim2.flixcart.com/image/312/312/xif0q/building-block/c/l/0/100-pcs-building-blocks-stem-toys-learning-educational-toy-for-original-imagvdkh5wg3pzuh.jpeg?q=70', 'assets/stem_robot.png'],
  'Coding Toys': ['https://rukminim2.flixcart.com/image/312/312/xif0q/toy/f/b/v/stem-educational-gear-building-set-kids-construction-toy-90-pcs-original-imagvdkhhm8ggghq.jpeg?q=70', 'assets/stem_robot.png'],
  'Building Blocks': ['https://rukminim2.flixcart.com/image/312/312/xif0q/building-block/c/l/0/100-pcs-building-blocks-stem-toys-learning-educational-toy-for-original-imagvdkh5wg3pzuh.jpeg?q=70', 'assets/stem_robot.png'],
  'Robotics': ['https://rukminim2.flixcart.com/image/312/312/xif0q/toy/f/b/v/stem-educational-gear-building-set-kids-construction-toy-90-pcs-original-imagvdkhhm8ggghq.jpeg?q=70', 'assets/stem_robot.png'],
  'Puzzles': ['https://rukminim2.flixcart.com/image/312/312/xif0q/board-game/u/j/a/sequence-classic-family-board-game-original-imagvdkh3zv9j2rd.jpeg?q=70', 'assets/stem_robot.png'],
  'Math Games': ['https://rukminim2.flixcart.com/image/312/312/xif0q/building-block/c/l/0/100-pcs-building-blocks-stem-toys-learning-educational-toy-for-original-imagvdkh5wg3pzuh.jpeg?q=70', 'assets/stem_robot.png'],

  'Barbie & Fashion': ['https://rukminim2.flixcart.com/image/312/312/xif0q/doll/x/m/t/barbie-fashionista-doll-for-kids-original-imagvdkhk6gghzqf.jpeg?q=70', 'assets/channapatna_toy.png'],
  'Stuffed Animals': ['https://rukminim2.flixcart.com/image/312/312/xif0q/stuffed-toy/b/c/c/teddy-bear-soft-toy-lovable-and-cute-soft-toy-for-kids-girls-original-imagvdkh7fzk2qgf.jpeg?q=70', 'assets/channapatna_toy.png'],
  'Action Figures': ['https://rukminim2.flixcart.com/image/312/312/xif0q/doll/x/m/t/barbie-fashionista-doll-for-kids-original-imagvdkhk6gghzqf.jpeg?q=70', 'assets/stem_robot.png'],
  'Baby Dolls': ['https://rukminim2.flixcart.com/image/312/312/xif0q/stuffed-toy/b/c/c/teddy-bear-soft-toy-lovable-and-cute-soft-toy-for-kids-girls-original-imagvdkh7fzk2qgf.jpeg?q=70', 'assets/channapatna_toy.png'],
  'Collectibles': ['https://rukminim2.flixcart.com/image/312/312/xif0q/doll/x/m/t/barbie-fashionista-doll-for-kids-original-imagvdkhk6gghzqf.jpeg?q=70', 'assets/stem_robot.png'],
  'Anime Figures': ['https://rukminim2.flixcart.com/image/312/312/xif0q/doll/x/m/t/barbie-fashionista-doll-for-kids-original-imagvdkhk6gghzqf.jpeg?q=70', 'assets/stem_robot.png'],

  'Kitchen Sets': ['https://rukminim2.flixcart.com/image/312/312/xif0q/role-play-toy/b/3/l/44-pcs-kitchen-set-toy-for-kids-big-kitchen-set-with-real-water-original-imagunr3z5efckvf.jpeg?q=70', 'assets/kitchen_set.png'],
  'Drawing & Craft': ['https://rukminim2.flixcart.com/image/312/312/xif0q/role-play-toy/x/e/g/doctor-set-play-set-for-kids-educational-toys-with-stethoscope-original-imagvdkh4yqdmxhg.jpeg?q=70', 'assets/kitchen_set.png'],
  'Musical Toys': ['https://rukminim2.flixcart.com/image/312/312/xif0q/role-play-toy/b/3/l/44-pcs-kitchen-set-toy-for-kids-big-kitchen-set-with-real-water-original-imagunr3z5efckvf.jpeg?q=70', 'assets/kitchen_set.png'],
  'Clay & Dough': ['https://rukminim2.flixcart.com/image/312/312/xif0q/role-play-toy/x/e/g/doctor-set-play-set-for-kids-educational-toys-with-stethoscope-original-imagvdkh4yqdmxhg.jpeg?q=70', 'assets/kitchen_set.png'],
  'Doctor Sets': ['https://rukminim2.flixcart.com/image/312/312/xif0q/role-play-toy/x/e/g/doctor-set-play-set-for-kids-educational-toys-with-stethoscope-original-imagvdkh4yqdmxhg.jpeg?q=70', 'assets/kitchen_set.png'],
  'Dress-up & Costumes': ['https://rukminim2.flixcart.com/image/312/312/xif0q/role-play-toy/b/3/l/44-pcs-kitchen-set-toy-for-kids-big-kitchen-set-with-real-water-original-imagunr3z5efckvf.jpeg?q=70', 'assets/kitchen_set.png'],

  'Strategy Games': ['https://rukminim2.flixcart.com/image/312/312/xif0q/board-game/t/7/x/chess-set-standard-chess-set-with-wooden-chess-board-original-imagvdkhhkwugqhg.jpeg?q=70', 'assets/stem_robot.png'],
  'Family Games': ['https://rukminim2.flixcart.com/image/312/312/xif0q/board-game/b/u/k/ludo-king-classic-board-game-for-kids-original-imagvdkhhtwmzgfy.jpeg?q=70', 'assets/stem_robot.png'],
  'Card Games': ['https://rukminim2.flixcart.com/image/312/312/xif0q/card-game/u/y/s/uno-cards-game-original-imagvdkhg7tkxv4z.jpeg?q=70', 'assets/stem_robot.png'],
  'Chess & Ludo': ['https://rukminim2.flixcart.com/image/312/312/xif0q/board-game/t/7/x/chess-set-standard-chess-set-with-wooden-chess-board-original-imagvdkhhkwugqhg.jpeg?q=70', 'https://rukminim2.flixcart.com/image/312/312/xif0q/board-game/b/u/k/ludo-king-classic-board-game-for-kids-original-imagvdkhhtwmzgfy.jpeg?q=70'],
  'Memory Games': ['https://rukminim2.flixcart.com/image/312/312/xif0q/board-game/u/j/a/sequence-classic-family-board-game-original-imagvdkh3zv9j2rd.jpeg?q=70', 'assets/stem_robot.png'],
  'Party Games': ['https://rukminim2.flixcart.com/image/312/312/xif0q/card-game/u/y/s/uno-cards-game-original-imagvdkhg7tkxv4z.jpeg?q=70', 'assets/stem_robot.png'],

  '3D Heroes': ['assets/stem_robot.png', 'assets/rc_car.png'],
  '3D Animals': ['assets/royal_elephant.png', 'assets/channapatna_toy.png'],
  '3D Vehicles': ['assets/rc_car.png', 'assets/kick_scooter.png'],
  '3D Fantasy': ['assets/royal_elephant.png', 'assets/stem_robot.png'],
  '3D Robots': ['assets/stem_robot.png', 'assets/rc_car.png']
};

const GLB_MODELS = [
  '3d/Copilot3D-ea266e16-8976-4e77-9f32-0f6d354b5ca9.glb',
  '3d/Copilot3D-bb56c427-cf5d-4b45-9d83-dd5177b5f9b5.glb',
  '3d/Copilot3D-ba97fa7d-7e13-4797-8325-8b635ebf5a40.glb',
  '3d/Copilot3D-a988a5ff-11cf-48e2-959f-9144b183cdef.glb',
  '3d/Copilot3D-12d251fe-5c41-4db6-a3fc-959f398c14ac.glb'
];

const IS_FILE_MODE = window.location.protocol === 'file:';
const LOCAL_3D_PREVIEWS = [
  'assets/stem_robot.png',
  'assets/royal_elephant.png',
  'assets/rc_car.png',
  'assets/kick_scooter.png',
  'assets/channapatna_toy.png'
];

// Colors by category
const CAT_COLORS = {
  'Traditional Indian': '#ff9500',
  'Vehicles & RC': '#0099ff',
  'Outdoor & Active': '#00c853',
  'STEM & Learning': '#7c3aed',
  'Dolls & Plush': '#ff4081',
  'Creative Arts': '#ff9800',
  'Board Games': '#009688',
  '3D Model Toys': '#5b6bff'
};

let allToys = [];
let filteredToys = [];
let visibleCount = 0;
const PAGE_SIZE = 30;
let modelCardsBuilt = false;

// Active filter state
let activeFilters = {
  category: '',
  subcat: '',
  ageGroup: '',
  maxPrice: 9999,
  minRating: 0,
  search: ''
};

// Cart & Wishlist
let cart = JSON.parse(localStorage.getItem('cart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');

// ========== GENERATE TOY DATABASE ==========
function generateToys() {
  const toys = [];
  const catNames = Object.keys(CATEGORIES);
  
  const toyNames = {
    'Traditional Indian': [
      'Channapatna Wooden Spinning Top', 'Kondapalli Krishna Doll', 'Etikoppaka Lacquerware Toy',
      'Wooden Rocking Horse Handcrafted', 'Clay Diwali Golu Doll', 'Dhokra Metal Art Figure',
      'Bidriware Toy Elephant', 'Rajasthani Puppet Set', 'Varanasi Silk Doll', 'Madhubani Painted Toy',
      'Mysore Sandalwood Elephant', 'Thanjavur Dancing Doll', 'Camel Leather Toy Rajasthan',
      'Kashmiri Papier-Mâché Toy', 'Gond Tribal Art Toy'
    ],
    'Vehicles & RC': [
      'High-Speed Off-Road RC Car 4WD', 'Military RC Truck', 'RC Drift Car LED Edition',
      'Nitro RC Buggy Pro', 'RC Monster Truck Stunt Edition', 'Quadcopter Drone with Camera',
      'RC Helicopter 6-Axis Gyro', 'Electric Ride-On Jeep for Kids', 'Die-Cast Hot Wheels Pack',
      'Toy Train Set with Track', 'Airport Plane Playset', 'Digger Truck Construction Set',
      'Police RC Car with Siren', 'Formula 1 RC Racer', 'RC Amphibious Car Water & Land'
    ],
    'Outdoor & Active': [
      '3-Wheel LED Kick Scooter Foldable', 'BMX Bicycle for Kids 20T', 'Cricket Set Bat & Ball',
      'Football with Pump', 'Roller Skates Adjustable LED', 'Jump Rope Skipping Beaded',
      'Archery Bow & Arrow Foam Set', 'Badminton Set 4-Player', 'Basketball Hoop Indoor',
      'Kite Flying Festival Set', 'Garden Water Sprinkler Toy', 'Sand & Water Play Table',
      'Gymnastics Balance Beam', 'Hockey Stick & Ball', 'Frisbee Ultimate Pro'
    ],
    'STEM & Learning': [
      'Solar Robot Building Kit 12-in-1', 'Chemistry Experiment Kit 100 Projects',
      'Coding Robot Car for Beginners', '3D Magnetic Building Blocks 200pc',
      'Electronics Learning Circuit Board', 'Telescope for Kids 60x Zoom',
      'Microscope Kit with Slides', 'Hydraulic Engineering Set',
      'Math Learning Abacus Deluxe', 'Planetarium Projector Star', 'Snap Circuits Jr 100',
      'Origami Paper Art Kit', 'Crystal Growing Science Kit', 'Robotic Arm DIY Kit',
      'DNA Model Building Set'
    ],
    'Dolls & Plush': [
      'Barbie Dreamhouse Adventure Doll', 'Giant Teddy Bear 3 Feet', 'Stuffed Lion King Simba',
      'Action Figure Superheroes Pack 8', 'Baby Doll with Accessories Set',
      'Anime My Hero Academia Figure', 'Mermaid Tail Doll Sparkle',
      'Plush Panda Soft Toy 50cm', 'SpiderMan Web Shooter Figure',
      'LOL Surprise Doll Series', 'Squishmallow Unicorn Pillow', 'Rainbow Dash Pony',
      'Rapunzel Princess Doll with Hair', 'Walking Talking Baby Doll', 'Dinosaur Rex Plush'
    ],
    'Creative Arts': [
      '42-Piece Kitchen Set Real Water Tap', 'Doctor Medical Set 30pc', 'Drawing Board LED Glow',
      'Play-Doh Mega Creativity Set', 'Finger Painting Kit 24 Colors',
      'Mini Guitar Toy Musical Kids', 'Xylophone Rainbow Wooden',
      'Drum Set Electronic Kids 5pc', 'Sewing & Knitting Starter Set',
      'Stamp & Stencil Art Kit', 'Soap Making DIY Kit', 'Bead Jewelry Making Set',
      'Chef Apron Costume Set', 'Bubble Machine 2000 Bubbles/min', 'Magic Sand Kinetic 5 Colors'
    ],
    'Board Games': [
      'Scrabble Classic Word Game', 'Monopoly India Edition', 'Chess Set Rosewood Handcrafted',
      'Ludo Star Deluxe Board', 'Jenga Giant Stackable', 'Uno Card Game Original',
      'Pandemic Board Game', 'Sequence Family Game', 'Catan Board Game',
      'Pictionary Air Drawing', 'Blokus Strategy Tiles', 'Rubik\'s Cube 3x3 Speed',
      'Snakes & Ladders Gold', 'Carom Board Tournament Size', 'Ticket to Ride India'
    ],
    '3D Model Toys': [
      '3D Hero Action Figure', '3D Robo Titan', '3D Fantasy Dragon',
      '3D Sports Car Model', '3D Safari Animal', '3D Mech Defender',
      '3D Space Rider', '3D Dino Guardian', '3D Turbo Bike',
      '3D Jungle Beast', '3D Battle Bot', '3D Hover Racer',
      '3D Magic Creature', '3D Guardian Wolf', '3D Aero Jet Model'
    ]
  };

  let id = 1;
  catNames.forEach(cat => {
    const subs = CATEGORIES[cat].subs;
    const names = toyNames[cat];
    const count = Math.floor(20000 / catNames.length);

    for (let i = 0; i < count; i++) {
      const sub = subs[i % subs.length];
      const name = names[i % names.length];
      const ageIdx = i % AGE_GROUPS.length;
      const price = 299 + Math.floor(Math.random() * 9700);
      const rating = parseFloat((3.5 + Math.random() * 1.5).toFixed(1));
      const reviews = 10 + Math.floor(Math.random() * 500);
      const isNew = Math.random() < 0.12;
      const modelCategory = cat === '3D Model Toys';
      const is3D = modelCategory ? true : Math.random() < 0.08;
      const isFeatured = Math.random() < 0.05;
      const modelFile = modelCategory ? GLB_MODELS[i % GLB_MODELS.length] : '';

      const imgs = SUBCATEGORY_IMAGES[sub] || TOY_IMAGES[cat] || [];
      let img = imgs[i % imgs.length] || '';
      if (IS_FILE_MODE) {
        // In local file mode prefer local asset paths to avoid network dependency.
        const localImage = imgs.find((u) => u.startsWith('assets/')) || (TOY_IMAGES[cat] || []).find((u) => u.startsWith('assets/'));
        if (localImage) img = localImage;
      }

      toys.push({
        id: id++,
        name: name + (i > names.length - 1 ? ` v${Math.floor(i / names.length) + 1}` : ''),
        category: cat,
        subCategory: sub,
        ageGroup: AGE_GROUPS[ageIdx],
        price,
        rating,
        reviews,
        isNew,
        is3D,
        isFeatured,
        img,
        modelFile,
        emoji: CATEGORIES[cat].emoji,
        color: CAT_COLORS[cat],
        description: `Premium quality ${name.toLowerCase()} designed for ${AGE_GROUPS[ageIdx]} age group. Features safe, BIS-certified materials, vibrant colors and excellent durability. Perfect gift for any occasion.`,
        material: ['Plastic', 'Wood', 'Metal', 'Fabric', 'Rubber', 'Foam'][id % 6],
        brand: ['ToyUtsav', 'KhelIndia', 'SmartKids', 'FunTime', 'VedicToys', 'GigaBlocks'][id % 6]
      });
    }
  });

  // Shuffle for variety
  for (let i = toys.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [toys[i], toys[j]] = [toys[j], toys[i]];
  }

  return toys;
}

// ========== INIT ==========
function init() {
  allToys = generateToys();
  const catCountEl = document.getElementById('categoryCount');
  if (catCountEl) catCountEl.textContent = Object.keys(CATEGORIES).length;
  renderModelsLayer();
  buildSidebar();
  checkURLParams();
  applyFilters();
  setupEventListeners();
  updateCartBadge();
  updateWishlistBadge();
  renderCartPanel();
  renderWishlistPanel();
}

// ========== BUILD SIDEBAR ==========
function buildSidebar() {
  // Category list
  const catList = document.getElementById('categoryList');
  catList.innerHTML = `<li class="cat-filter-item ${!activeFilters.category ? 'active' : ''}" data-cat="">
    <span>🏪 All Categories</span>
    <span class="cat-pill">${allToys.length.toLocaleString()}</span>
  </li>`;

  Object.entries(CATEGORIES).forEach(([cat, data]) => {
    const count = allToys.filter(t => t.category === cat).length;
    const li = document.createElement('li');
    li.className = 'cat-filter-item' + (activeFilters.category === cat ? ' active' : '');
    li.dataset.cat = cat;
    li.innerHTML = `
      <span>${data.emoji} ${cat}</span>
      <span class="cat-pill">${count.toLocaleString()}</span>
    `;
    catList.appendChild(li);

    // Subcategories
    const subcatDiv = document.createElement('div');
    subcatDiv.className = 'subcats' + (activeFilters.category === cat ? ' open' : '');
    subcatDiv.dataset.parentCat = cat;
    data.subs.forEach(sub => {
      const s = document.createElement('div');
      s.className = 'subcat-item' + (activeFilters.subcat === sub ? ' active' : '');
      s.textContent = sub;
      s.dataset.sub = sub;
      subcatDiv.appendChild(s);
    });
    catList.appendChild(subcatDiv);
  });

  // Age filters
  const ageDiv = document.getElementById('ageGroupFilters');
  ageDiv.innerHTML = AGE_GROUPS.map(age =>
    `<label class="check-label">
      <input type="radio" name="ageGroup" value="${age}" ${activeFilters.ageGroup === age ? 'checked' : ''}>
      ${age}
    </label>`
  ).join('') + `<label class="check-label"><input type="radio" name="ageGroup" value="" ${!activeFilters.ageGroup ? 'checked' : ''}> All Ages</label>`;
}

// ========== URL PARAMS ==========
function checkURLParams() {
  let query = window.location.search;
  if (!query && window.location.href.includes('products.html?')) {
    query = '?' + window.location.href.split('products.html?')[1];
  }
  const params = new URLSearchParams(query);
  if (params.get('cat')) {
    const category = decodeURIComponent(params.get('cat'));
    if (Object.prototype.hasOwnProperty.call(CATEGORIES, category)) {
      activeFilters.category = category;
    }
  }
  if (params.get('age')) {
    const rawAge = decodeURIComponent(params.get('age'));
    const normalizedAge = rawAge.replace(/(\d+)-(\d+)/g, '$1–$2');
    if (AGE_GROUPS.includes(normalizedAge)) {
      activeFilters.ageGroup = normalizedAge;
    }
  }
  if (params.get('q')) {
    activeFilters.search = decodeURIComponent(params.get('q'));
    document.getElementById('searchBar').value = activeFilters.search;
  }
  buildSidebar();
}

function renderModelsLayer() {
  if (modelCardsBuilt) return;
  const modelsGrid = document.getElementById('modelsGrid');
  if (!modelsGrid) return;

  modelsGrid.innerHTML = '';
  GLB_MODELS.forEach((modelPath, idx) => {
    const sub = CATEGORIES['3D Model Toys'].subs[idx % CATEGORIES['3D Model Toys'].subs.length];
    const localPreview = LOCAL_3D_PREVIEWS[idx % LOCAL_3D_PREVIEWS.length];
    const card = document.createElement('article');
    card.className = 'model-card';
    if (IS_FILE_MODE) {
      card.innerHTML = `
        <div class="model-fallback-visual">
          <img src="${localPreview}" alt="3D Demo Model ${idx + 1}" loading="lazy" />
          <span class="spin-chip">ROTATE</span>
        </div>
        <div class="model-card-meta">
          <div class="model-card-title">3D Demo Model ${idx + 1}</div>
          <span class="model-card-sub">${sub}</span>
        </div>
      `;
    } else {
      card.innerHTML = `
        <model-viewer
          src="${modelPath}"
          alt="3D Demo Model ${idx + 1}"
          camera-controls
          auto-rotate
          shadow-intensity="1"
          interaction-prompt="none"
          rotation-per-second="28deg">
        </model-viewer>
        <div class="model-card-meta">
          <div class="model-card-title">3D Demo Model ${idx + 1}</div>
          <span class="model-card-sub">${sub}</span>
        </div>
      `;
    }
    modelsGrid.appendChild(card);
  });

  modelCardsBuilt = true;
}

// ========== APPLY FILTERS ==========
function applyFilters() {
  filteredToys = allToys.filter(toy => {
    if (activeFilters.category && toy.category !== activeFilters.category) return false;
    if (activeFilters.subcat && toy.subCategory !== activeFilters.subcat) return false;
    if (activeFilters.ageGroup && toy.ageGroup !== activeFilters.ageGroup) return false;
    if (toy.price > activeFilters.maxPrice) return false;
    if (toy.rating < activeFilters.minRating) return false;
    if (activeFilters.search) {
      const q = activeFilters.search.toLowerCase();
      if (!toy.name.toLowerCase().includes(q) &&
          !toy.category.toLowerCase().includes(q) &&
          !toy.subCategory.toLowerCase().includes(q) &&
          !toy.brand.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  // Sort
  const sort = document.getElementById('sortSelect')?.value || 'featured';
  if (sort === 'price-asc') filteredToys.sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') filteredToys.sort((a, b) => b.price - a.price);
  else if (sort === 'rating') filteredToys.sort((a, b) => b.rating - a.rating);
  else if (sort === 'name') filteredToys.sort((a, b) => a.name.localeCompare(b.name));

  document.getElementById('totalCount').textContent = filteredToys.length.toLocaleString();

  // Update active filter pills
  renderFilterPills();

  // Reset and render
  visibleCount = 0;
  document.getElementById('toysGrid').innerHTML = '';
  renderNextPage();
}

// ========== RENDER FILTER PILLS ==========
function renderFilterPills() {
  const container = document.getElementById('activeFilters');
  container.innerHTML = '';

  if (activeFilters.category) {
    addPill(container, activeFilters.category, () => {
      activeFilters.category = ''; activeFilters.subcat = ''; applyFilters(); buildSidebar();
    });
  }
  if (activeFilters.subcat) {
    addPill(container, activeFilters.subcat, () => {
      activeFilters.subcat = ''; applyFilters(); buildSidebar();
    });
  }
  if (activeFilters.ageGroup) {
    addPill(container, activeFilters.ageGroup, () => {
      activeFilters.ageGroup = ''; applyFilters(); buildSidebar();
    });
  }
  if (activeFilters.maxPrice < 9999) {
    addPill(container, `Under ₹${activeFilters.maxPrice}`, () => {
      activeFilters.maxPrice = 9999;
      document.getElementById('priceRange').value = 9999;
      document.getElementById('priceMaxLabel').textContent = '₹9,999';
      applyFilters();
    });
  }
  if (activeFilters.minRating > 0) {
    addPill(container, `⭐ ${activeFilters.minRating}+`, () => {
      activeFilters.minRating = 0; applyFilters();
    });
  }
  if (activeFilters.search) {
    addPill(container, `"${activeFilters.search}"`, () => {
      activeFilters.search = '';
      document.getElementById('searchBar').value = '';
      document.getElementById('searchClear').style.display = 'none';
      applyFilters();
    });
  }
}

function addPill(container, label, onRemove) {
  const pill = document.createElement('span');
  pill.className = 'filter-pill';
  pill.innerHTML = `${label} ✕`;
  pill.addEventListener('click', onRemove);
  container.appendChild(pill);
}

// ========== RENDER CARDS ==========
function renderNextPage() {
  const grid = document.getElementById('toysGrid');
  const slice = filteredToys.slice(visibleCount, visibleCount + PAGE_SIZE);
  const trigger = document.getElementById('infiniteScrollTrigger');

  if (slice.length === 0) {
    if (visibleCount === 0) {
      grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--text-light)">
        <span style="font-size:3rem;display:block;margin-bottom:12px">🔍</span>
        <strong style="font-size:1.1rem;display:block">No toys found</strong>
        <small>Try adjusting your filters or search term</small>
      </div>`;
    }
    trigger.style.display = 'none';
    return;
  }

  trigger.style.display = 'flex';

  slice.forEach((toy, i) => {
    const card = createCard(toy);
    grid.appendChild(card);

    // Staggered entrance animation
    requestAnimationFrame(() => {
      setTimeout(() => {
        card.classList.add('visible');
      }, i * 30);
    });
  });

  visibleCount += slice.length;

  if (visibleCount >= filteredToys.length) {
    trigger.style.display = 'none';
  }
}

function createCard(toy) {
  const card = document.createElement('div');
  card.className = 'prod-card';

  const isWished = wishlist.some(w => w.id === toy.id);

  card.innerHTML = `
    <div class="prod-img-wrap">
      ${toy.modelFile 
        ? `<model-viewer src="${toy.modelFile}" alt="${toy.name}" camera-controls auto-rotate interaction-prompt="none" shadow-intensity="1" style="width: 100%; height: 100%; background: #f8f8f8;"></model-viewer>`
        : toy.img
          ? `<img src="${toy.img}" alt="${toy.name}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
          : ''
      }
      <div class="prod-img-placeholder" style="${toy.modelFile || toy.img ? 'display:none' : 'display:flex'}; background:${toy.color}11">
        <span>${toy.emoji}</span>
        <small>${toy.brand}</small>
      </div>

      <div class="prod-badges">
        ${toy.isFeatured ? '<span class="prod-badge badge-feat">⭐ Top Pick</span>' : ''}
        ${toy.isNew ? '<span class="prod-badge badge-new">✦ New</span>' : ''}
        ${toy.is3D ? '<span class="prod-badge badge-3d">🎮 3D</span>' : ''}
      </div>

      <button class="prod-wish-btn ${isWished ? 'wished' : ''}" data-id="${toy.id}" title="Wishlist">
        ${isWished ? '❤️' : '🤍'}
      </button>
    </div>

    <div class="prod-info">
      <span class="prod-cat">${toy.subCategory}</span>
      <h3 class="prod-title">${toy.name}</h3>
      <div class="prod-rating">
        ⭐ ${toy.rating} <small>(${toy.reviews})</small>
      </div>
      <div class="prod-price-row">
        <span class="prod-price">₹${toy.price.toLocaleString('en-IN')}</span>
        <span class="prod-age">${toy.ageGroup}</span>
      </div>
    </div>
  `;

  // Click card → open modal
  card.addEventListener('click', (e) => {
    if (e.target.closest('.prod-wish-btn')) return;
    openModal(toy);
  });

  // Wishlist button
  card.querySelector('.prod-wish-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    toggleWishlist(toy);
    const btn = e.currentTarget;
    const isNowWished = wishlist.some(w => w.id === toy.id);
    btn.classList.toggle('wished', isNowWished);
    btn.textContent = isNowWished ? '❤️' : '🤍';
    showToast(isNowWished ? '❤️ Added to wishlist' : '🤍 Removed from wishlist');
  });

  return card;
}

// ========== MODAL ==========
function openModal(toy) {
  const modal = document.getElementById('productModal');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  document.getElementById('modalBreadcrumb').textContent = `${toy.category} / ${toy.subCategory}`;
  document.getElementById('modalTitle').textContent = toy.name;
  document.getElementById('modalRating').textContent = `⭐ ${toy.rating}`;
  document.getElementById('modalReviews').textContent = `(${toy.reviews} reviews)`;
  document.getElementById('modalDesc').textContent = toy.description;
  document.getElementById('modalPrice').textContent = `₹${toy.price.toLocaleString('en-IN')}`;

  // Image
  const img = document.getElementById('modalImg');
  const placeholder = document.getElementById('modalImgPlaceholder');

  if (toy.img) {
    img.src = toy.img;
    img.style.display = 'block';
    placeholder.style.display = 'none';
    img.onerror = () => {
      img.style.display = 'none';
      placeholder.style.display = 'flex';
      placeholder.querySelector('span').textContent = toy.emoji;
    };
  } else {
    img.style.display = 'none';
    placeholder.style.display = 'flex';
    placeholder.querySelector('span').textContent = toy.emoji;
    placeholder.style.background = toy.color + '22';
  }

  // Specs
  document.getElementById('modalSpecs').innerHTML = `
    <div class="spec-item"><span>Age Group</span><strong>${toy.ageGroup}</strong></div>
    <div class="spec-item"><span>Material</span><strong>${toy.material}</strong></div>
    <div class="spec-item"><span>Brand</span><strong>${toy.brand}</strong></div>
    <div class="spec-item"><span>Sub-Category</span><strong>${toy.subCategory}</strong></div>
    <div class="spec-item"><span>Rating</span><strong>⭐ ${toy.rating}/5</strong></div>
    <div class="spec-item"><span>Reviews</span><strong>${toy.reviews}</strong></div>
    ${toy.modelFile ? `<div class="spec-item"><span>3D Model File</span><strong>${toy.modelFile.split('/').pop()}</strong></div>` : ''}
  `;

  // Tags
  const tags = [toy.category, toy.subCategory, toy.ageGroup, toy.brand, toy.material];
  document.getElementById('modalTags').innerHTML = tags.map(t =>
    `<span class="tag-chip">${t}</span>`
  ).join('');

  // Cart/wish actions
  document.getElementById('modalAddCart').onclick = () => { addToCart(toy); closeModal(); };
  document.getElementById('modalAddWish').onclick = () => {
    toggleWishlist(toy);
    showToast(wishlist.some(w => w.id === toy.id) ? '❤️ Added to wishlist' : '🤍 Removed');
  };

  // 3D toggle for eligible toys
  const toggle3DBtn = document.getElementById('toggle3DBtn');
  const modalCanvas = document.getElementById('modalCanvas');
  toggle3DBtn.onclick = null;

  if (toy.is3D && toy.modelFile) {
    toggle3DBtn.style.display = 'block';
    toggle3DBtn.textContent = '🎮 View 3D Model';
    toggle3DBtn.onclick = () => {
      img.style.display = 'none';
      placeholder.style.display = 'none';
      modalCanvas.style.display = 'block';
      if (IS_FILE_MODE) {
        const localPreview = toy.img && toy.img.startsWith('assets/') ? toy.img : 'assets/stem_robot.png';
        modalCanvas.innerHTML = `
          <div class="model-fallback-visual modal-fallback">
            <img src="${localPreview}" alt="${toy.name}" loading="lazy" />
            <span class="spin-chip">ROTATE</span>
          </div>
        `;
      } else {
        modalCanvas.innerHTML = `
          <model-viewer
            src="${toy.modelFile}"
            alt="${toy.name}"
            camera-controls
            auto-rotate
            shadow-intensity="1"
            style="width:100%;height:340px;background:radial-gradient(circle at 30% 20%, #2b2a52, #121325)">
          </model-viewer>
        `;
      }
    };
  } else if (toy.is3D) {
    toggle3DBtn.style.display = 'block';
    toggle3DBtn.textContent = '🎮 Explore in 3D';
    toggle3DBtn.onclick = () => showToast('3D preview is not available for this item.');
  } else {
    toggle3DBtn.style.display = 'none';
  }
}

function closeModal() {
  document.getElementById('productModal').style.display = 'none';
  document.body.style.overflow = '';
  const modalCanvas = document.getElementById('modalCanvas');
  modalCanvas.style.display = 'none';
  modalCanvas.innerHTML = '';
  document.getElementById('modalImg').style.display = 'block';
  const toggle3DBtn = document.getElementById('toggle3DBtn');
  toggle3DBtn.textContent = '🎮 Explore in 3D';
  toggle3DBtn.onclick = null;
}

// ========== CART ==========
function addToCart(toy) {
  const existing = cart.find(c => c.id === toy.id);
  if (existing) {
    existing.qty = (existing.qty || 1) + 1;
  } else {
    cart.push({ ...toy, qty: 1 });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartBadge();
  renderCartPanel();
  showToast(`🛒 "${toy.name.substring(0, 25)}…" added to cart!`);
}

function removeFromCart(toyId) {
  cart = cart.filter(c => c.id !== toyId);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartBadge();
  renderCartPanel();
}

function updateCartBadge() {
  const total = cart.reduce((s, c) => s + (c.qty || 1), 0);
  const badge = document.getElementById('cartBadge');
  badge.style.display = total > 0 ? 'flex' : 'none';
  badge.textContent = total;
}

function renderCartPanel() {
  const list = document.getElementById('cartList');
  if (cart.length === 0) {
    list.innerHTML = `<div class="panel-empty"><span>🛒</span><strong>Your cart is empty</strong><p>Add some toys to get started!</p></div>`;
    document.getElementById('cartTotal').textContent = '₹0';
    return;
  }

  list.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    const qty = item.qty || 1;
    total += item.price * qty;
    const div = document.createElement('div');
    div.className = 'panel-item';
    div.innerHTML = `
      <div class="panel-item-thumb">
        ${item.img ? `<img src="${item.img}" alt="${item.name}" onerror="this.parentElement.textContent='${item.emoji}'">` : item.emoji}
      </div>
      <div class="panel-item-info">
        <div class="panel-item-name">${item.name}</div>
        <div class="panel-item-price">₹${(item.price * qty).toLocaleString('en-IN')} × ${qty}</div>
      </div>
      <button class="panel-remove" data-id="${item.id}">✕</button>
    `;
    div.querySelector('.panel-remove').addEventListener('click', () => removeFromCart(item.id));
    list.appendChild(div);
  });

  document.getElementById('cartTotal').textContent = `₹${total.toLocaleString('en-IN')}`;
}

// ========== WISHLIST ==========
function toggleWishlist(toy) {
  const idx = wishlist.findIndex(w => w.id === toy.id);
  if (idx >= 0) wishlist.splice(idx, 1);
  else wishlist.push(toy);
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  updateWishlistBadge();
  renderWishlistPanel();
}

function updateWishlistBadge() {
  const badge = document.getElementById('wishlistBadge');
  badge.style.display = wishlist.length > 0 ? 'flex' : 'none';
  badge.textContent = wishlist.length;
}

function renderWishlistPanel() {
  const list = document.getElementById('wishlistList');
  if (wishlist.length === 0) {
    list.innerHTML = `<div class="panel-empty"><span>❤️</span><strong>Nothing saved yet</strong><p>Tap the heart on any toy to save it here.</p></div>`;
    return;
  }

  list.innerHTML = '';
  wishlist.forEach(item => {
    const div = document.createElement('div');
    div.className = 'panel-item';
    div.innerHTML = `
      <div class="panel-item-thumb">
        ${item.img ? `<img src="${item.img}" alt="${item.name}" onerror="this.parentElement.textContent='${item.emoji}'">` : item.emoji}
      </div>
      <div class="panel-item-info">
        <div class="panel-item-name">${item.name}</div>
        <div class="panel-item-price">₹${item.price.toLocaleString('en-IN')}</div>
      </div>
      <button class="panel-remove" data-id="${item.id}">✕</button>
    `;
    div.querySelector('.panel-remove').addEventListener('click', () => {
      toggleWishlist(item);
    });
    list.appendChild(div);
  });
}

// ========== TOAST ==========
let toastTimeout;
function showToast(message) {
  let toast = document.getElementById('globalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  clearTimeout(toastTimeout);
  requestAnimationFrame(() => {
    toast.classList.add('show');
    toastTimeout = setTimeout(() => toast.classList.remove('show'), 2500);
  });
}

// ========== EVENT LISTENERS ==========
function setupEventListeners() {
  // Search bar
  const searchBar = document.getElementById('searchBar');
  const searchClear = document.getElementById('searchClear');
  let searchTimer;

  searchBar.addEventListener('input', () => {
    clearTimeout(searchTimer);
    const val = searchBar.value.trim();
    searchClear.style.display = val ? 'block' : 'none';
    searchTimer = setTimeout(() => {
      activeFilters.search = val;
      applyFilters();
    }, 400);
  });

  searchClear.addEventListener('click', () => {
    searchBar.value = '';
    searchClear.style.display = 'none';
    activeFilters.search = '';
    applyFilters();
  });

  // Category list
  document.getElementById('categoryList').addEventListener('click', (e) => {
    const item = e.target.closest('.cat-filter-item');
    const subItem = e.target.closest('.subcat-item');

    if (subItem) {
      activeFilters.subcat = subItem.dataset.sub === activeFilters.subcat ? '' : subItem.dataset.sub;
      document.querySelectorAll('.subcat-item').forEach(s => s.classList.remove('active'));
      if (activeFilters.subcat) subItem.classList.add('active');
      applyFilters();
      return;
    }

    if (item) {
      activeFilters.category = item.dataset.cat;
      activeFilters.subcat = '';
      document.querySelectorAll('.cat-filter-item').forEach(li => li.classList.remove('active'));
      item.classList.add('active');

      // Toggle subcats
      document.querySelectorAll('.subcats').forEach(sc => sc.classList.remove('open'));
      if (activeFilters.category) {
        const sc = document.querySelector(`.subcats[data-parent-cat="${activeFilters.category}"]`);
        if (sc) sc.classList.add('open');
      }
      applyFilters();
    }
  });

  // Age group radios
  document.getElementById('ageGroupFilters').addEventListener('change', (e) => {
    if (e.target.name === 'ageGroup') {
      activeFilters.ageGroup = e.target.value;
      applyFilters();
    }
  });

  // Price range
  document.getElementById('priceRange').addEventListener('input', (e) => {
    activeFilters.maxPrice = parseInt(e.target.value);
    document.getElementById('priceMaxLabel').textContent = `₹${activeFilters.maxPrice.toLocaleString('en-IN')}`;
  });
  document.getElementById('priceRange').addEventListener('change', () => applyFilters());

  // Rating filter
  document.querySelectorAll('input[name="rating"]').forEach(r => {
    r.addEventListener('change', () => {
      activeFilters.minRating = parseFloat(r.value);
      applyFilters();
    });
  });

  // Sort
  document.getElementById('sortSelect').addEventListener('change', applyFilters);

  // Reset
  document.getElementById('resetFilters').addEventListener('click', () => {
    activeFilters = { category: '', subcat: '', ageGroup: '', maxPrice: 9999, minRating: 0, search: '' };
    document.getElementById('searchBar').value = '';
    document.getElementById('searchClear').style.display = 'none';
    document.getElementById('priceRange').value = 9999;
    document.getElementById('priceMaxLabel').textContent = '₹9,999';
    document.querySelector('input[name="rating"][value="0"]').checked = true;
    document.querySelector('input[name="ageGroup"][value=""]').checked = true;
    buildSidebar();
    applyFilters();
  });

  // Modal close
  document.getElementById('closeModalBtn').addEventListener('click', closeModal);
  document.getElementById('productModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('productModal')) closeModal();
  });

  // Cart panel
  document.getElementById('cartBtn').addEventListener('click', () => openPanel('cartPanel'));
  document.getElementById('closeCartBtn').addEventListener('click', () => closePanel('cartPanel'));
  document.getElementById('checkoutBtn').addEventListener('click', () => {
    showToast('🎉 Thank you for your order! Our team will contact you soon.');
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    renderCartPanel();
    closePanel('cartPanel');
  });

  // Wishlist panel
  document.getElementById('wishlistBtn').addEventListener('click', () => openPanel('wishlistPanel'));
  document.getElementById('closeWishlistBtn').addEventListener('click', () => closePanel('wishlistPanel'));

  // Panel overlay
  document.getElementById('panelOverlay').addEventListener('click', () => {
    closePanel('cartPanel');
    closePanel('wishlistPanel');
  });

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closePanel('cartPanel');
      closePanel('wishlistPanel');
    }
  });

  // Infinite scroll
  const trigger = document.getElementById('infiniteScrollTrigger');
  const scrollObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && visibleCount < filteredToys.length) {
      renderNextPage();
    }
  }, { rootMargin: '200px' });
  if (trigger) scrollObserver.observe(trigger);
}

// ========== PANELS ==========
function openPanel(panelId) {
  document.getElementById(panelId).classList.add('open');
  document.getElementById('panelOverlay').classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closePanel(panelId) {
  document.getElementById(panelId).classList.remove('open');
  const anyOpen = document.querySelector('.side-panel.open');
  if (!anyOpen) {
    document.getElementById('panelOverlay').classList.remove('show');
    document.body.style.overflow = '';
  }
}

// ========== BOOT ==========
document.addEventListener('DOMContentLoaded', init);
