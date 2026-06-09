// data.js - High performance toy database client for 20,000+ items

const CATEGORY_MAP = {
    "Traditional Indian": ["Wooden Toys", "Handmade Dolls", "Festive Crafts", "Puppets"],
    "STEM & Learning": ["Robotics", "Science Kits", "Math Puzzles", "Building Blocks"],
    "Dolls & Plush": ["Action Figures", "Plush Animals", "Fashion Dolls", "Collectible Figures"],
    "Vehicles & RC": ["Remote Control", "Diecast Cars", "Train Sets", "Planes & Drones"],
    "Board Games": ["Strategy Games", "Ancient Indian Games", "Family Games", "Puzzles"],
    "Outdoor & Active": ["Sports Gear", "Kites & Flying", "Ride-ons", "Water Toys"],
    "Creative Arts": ["Painting Kits", "Clay & Playdoh", "DIY Crafts", "Musical Toys"]
};

const BRANDS = ["KhelIndia", "ToyUtsav Originals", "SmartKids", "VedicToys", "ElectroBot", "Channapatna Craft", "FunTime", "GigaBlocks", "Kondapalli Art", "FlyHigh"];
const AGE_GROUPS = ["0-2 Years", "3-4 Years", "5-7 Years", "8-11 Years", "12+ Years"];

const TOY_ADJECTIVES = ["Premium", "Deluxe", "Eco-friendly", "Classic", "Interactive", "Vibrant", "Smart", "Educational", "Handcrafted", "Super", "Mini", "Giant", "Glowing", "Magnetic", "DIY"];
const TOY_NOUNS = {
    "Wooden Toys": ["Rocking Horse", "Stacking Rings", "Push Cart", "Spinning Top", "Pull-Along Elephant", "Alphabet Blocks", "Rattle Set", "Balancing Board"],
    "Handmade Dolls": ["Kathputli Doll", "Kondapalli Dancer", "Traditional Bride Doll", "Raja-Rani Set", "Cotton Rag Doll", "Village Puppet"],
    "Festive Crafts": ["Clay Diya Painting Kit", "Paper Lantern Craft", "Rangoli Stencil Kit", "Festival Puzzle", "Dussehra Clay Set"],
    "Puppets": ["Finger Puppet Set", "Shadow Puppets", "Glove Puppet Theatre", "String Puppet Monkey", "Animal Puppet Hand"],
    "Robotics": ["Coding Rover", "Spider-Bot Kit", "Solar Powered Crawler", "Arm Mechanical Kit", "Gesture Control Robot", "Line Follower Car"],
    "Science Kits": ["Microscope Explorer", "Crystal Growing Kit", "Chemistry Lab Set", "Electricity Discovery", "Weather Station Kit", "Space Rocket Launcher"],
    "Math Puzzles": ["Sudoku Board", "Fraction Circles", "Geometry Math Board", "Pattern Matching Blocks", "Number Balance Scale"],
    "Building Blocks": ["Architecture Blocks", "Magnetic Tiles", "Fort Building Kit", "Wooden Logs Builder", "Eco-brick House"],
    "Action Figures": ["Super Hero Figure", "Robot Warrior", "Mythical Commander", "Dinosaur Beast", "Space Astronaut", "Samurai Knight"],
    "Plush Animals": ["Royal Bengal Tiger", "Cute Panda Plush", "Soft Teddy Bear", "Fluffy Peacock", "Baby Elephant Cushion", "Snuggle Monkey"],
    "Fashion Dolls": ["Prestige Fashion Doll", "Glamour Wardrobe Doll", "Hair Styling Doll", "Mini Princess Set", "Career Costume Doll"],
    "Collectible Figures": ["Miniature Animal Kingdom", "Fantasy Dragon Set", "Super Cars Miniatures", "Chibi Hero Collection"],
    "Remote Control": ["RC Monster Truck", "High-speed Racing Buggy", "RC Quadcopter Drone", "Amphibious RC Car", "Stunt Drift Racer"],
    "Diecast Cars": ["Metal Racing GT", "Indian Police Jeep", "Double Decker Bus", "Classic Vintage Roadster", "Fire Engine Truck"],
    "Train Sets": ["Steam Locomotive Set", "Bullet Train Express", "Wooden Railway Track", "Magnetic Train Linkers", "Metro Subway Set"],
    "Planes & Drones": ["Stunt Aeroplane", "Indoor Mini Drone", "Cargo Transport Plane", "Glider Aircraft", "RC Helicopter"],
    "Strategy Games": ["Chess Master Board", "Checkers Classic", "Vedic Strategy Game", "Conqueror Island Board", "Ancient Warfare Strategy"],
    "Ancient Indian Games": ["Pachisi (Ludo Ancestor)", "Chaupar Premium Cloth", "Moksha Patam (Snakes & Ladders)", "Aadu Puli Aattam (Goat & Tiger)", "Pallanguzhi Wooden Board"],
    "Family Games": ["Trivia Challenge", "Word Building Card Game", "Tower Collapse Blocks", "Charades Party Pack", "Guess the Character"],
    "Puzzles": ["1000pcs Taj Mahal Jigsaw", "3D Globe Puzzle", "Wooden Maze Board", "Brain Teaser Metal Ring", "Shape sorter Puzzle Box"],
    "Sports Gear": ["Junior Cricket Kit", "Badminton Rackets Set", "Mini Football & Goal", "Adjustable Basketball Hoop", "Archery Target Set"],
    "Kites & Flying": ["Fighter Kites Pack", "Giant Octopus Kite", "Boomerang Sport Pack", "Flying Saucer Disc", "Wind glider Kite"],
    "Ride-ons": ["Balance Bicycle", "Three-wheel Kick Scooter", "Foot-to-Floor Car", "Rocking Unicorn Ride", "Pedal Go-Kart"],
    "Water Toys": ["Water Water Blaster", "Floating Pirate Ship", "Wind-up Swimming Turtle", "Inflatable Mini Pool Set", "Bubble Blower Wand"],
    "Painting Kits": ["Canvas Painting Board Set", "Watercolor Painting Studio", "Glass Colors Craft", "Face Paint Kit", "Acrylic Art Easel"],
    "Clay & Playdoh": ["Scented Modeling Clay", "Playdoh Ice Cream Factory", "Pottery Wheel Studio", "Sand Castle Kinetic Kit", "Clay Sculpting Tools"],
    "DIY Crafts": ["Friendship Bracelet Maker", "Paper Quilling Studio", "Origami Fold Kit", "Bead Jewelry Designer", "Knit & Stitch Craft Box"],
    "Musical Toys": ["Xylophone Melodies", "Mini Acoustic Guitar", "Electronic Keyboard Piano", "Bongo Drums Set", "Wooden Flute & Rattle"]
};

// Seeded random number generator
function createSeededRandom(seed) {
    let s = seed;
    return function() {
        s = (s * 9301 + 49297) % 233280;
        return s / 233280;
    };
}

// Generate the 20,000+ dataset
function generateToysDatabase() {
    const toys = [];
    const random = createSeededRandom(42);

    // 1. Featured Premium Collection Toys
    const featuredToys = [
        {
            id: "feat-1",
            title: "Traditional Wooden Channapatna Rocking Horse",
            category: "Traditional Indian",
            subcategory: "Wooden Toys",
            price: 1899,
            rating: 4.9,
            reviewsCount: 342,
            ageGroup: "3-4 Years",
            brand: "Channapatna Craft",
            image: "assets/channapatna_toy.png",
            description: "Handcrafted by local artisans in Karnataka using non-toxic natural lacquer dyes. This premium rocking horse showcases the 200-year-old Channapatna woodcraft heritage. Features smooth finishes, safe edges, and extreme durability, perfect for developmental milestones.",
            featured: true,
            has3D: true,
            modelId: "royal_elephant", // Map to elegant 3D model
            isNew: true,
            tags: ["wooden", "handmade", "traditional", "indian", "horse", "channapatna"]
        },
        {
            id: "feat-2",
            title: "High-Speed Off-Road Remote Control Sports Car",
            category: "Vehicles & RC",
            subcategory: "Remote Control",
            price: 3499,
            rating: 4.8,
            reviewsCount: 189,
            ageGroup: "8-11 Years",
            brand: "FlyHigh",
            image: "assets/rc_car.png",
            description: "Conquer any terrain with this off-road remote control sports car. Features glowing LED headlights, independent shock-absorbing suspension, high-grip rubber tires, and a durable crash-resistant frame. Delivers high-speed thrills with long battery life.",
            featured: true,
            has3D: true,
            modelId: "rc_car", // 3D model ID
            isNew: true,
            tags: ["rc", "car", "remote control", "vehicle", "sports car", "off-road", "speed"]
        },
        {
            id: "feat-3",
            title: "3 Wheel Kick Scooter, Foldable with LED Wheels & Adjustable Height",
            category: "Outdoor & Active",
            subcategory: "Ride-ons",
            price: 2899,
            rating: 4.7,
            reviewsCount: 154,
            ageGroup: "5-7 Years",
            brand: "FunTime",
            image: "assets/kick_scooter.png",
            description: "A premium folding kick scooter equipped with three glowing LED polyurethane wheels that light up automatically when riding. Includes a 3-level adjustable height handlebar, extra wide anti-slip deck, and a quick-stop rear foot brake for maximum safety.",
            featured: true,
            has3D: true,
            modelId: "kick_scooter", // 3D model ID
            isNew: false,
            tags: ["scooter", "ride-on", "outdoor", "led", "foldable", "adjustable", "kick scooter"]
        },
        {
            id: "feat-4",
            title: "42-Piece Luxury Kitchen Set, Smoky Steam, Music & Real Water Tap",
            category: "Creative Arts",
            subcategory: "DIY Crafts",
            price: 3999,
            rating: 4.9,
            reviewsCount: 265,
            ageGroup: "3-4 Years",
            brand: "SmartKids",
            image: "assets/kitchen_set.png",
            description: "Give your child the actual feel of kitchen roleplay! This 42-piece luxury playset features a cooking stove with actual smoky steam effects (using safe water mist), interactive musical buttons, oven doors, and a real circulating water tap. Complete with play food, utensils, and cookware.",
            featured: true,
            has3D: false, // No 3D model for this one, showcases detailed image
            isNew: true,
            tags: ["kitchen", "playset", "cooking", "steam", "water tap", "music", "pretend play"]
        }
    ];

    toys.push(...featuredToys);

    // 2. Generate 20,000 additional toys procedurally
    const categories = Object.keys(CATEGORY_MAP);
    const targetSize = 20050; // Total dataset size

    for (let i = 1; i <= targetSize - featuredToys.length; i++) {
        const category = categories[Math.floor(random() * categories.length)];
        const subcategories = CATEGORY_MAP[category];
        const subcategory = subcategories[Math.floor(random() * subcategories.length)];
        
        const nouns = TOY_NOUNS[subcategory] || ["Toy Set", "Playset", "Creative Game"];
        const noun = nouns[Math.floor(random() * nouns.length)];
        const adj1 = TOY_ADJECTIVES[Math.floor(random() * TOY_ADJECTIVES.length)];
        const adj2 = TOY_ADJECTIVES[Math.floor(random() * TOY_ADJECTIVES.length)];
        const brand = BRANDS[Math.floor(random() * BRANDS.length)];
        
        const title = adj1 === adj2 ? `${adj1} ${brand} ${noun}` : `${adj1} ${adj2} ${noun}`;
        
        let price = 299;
        if (category === "STEM & Learning" || category === "Vehicles & RC") {
            price = Math.floor(random() * 85) * 100 + 999;
        } else if (category === "Board Games" || category === "Traditional Indian") {
            price = Math.floor(random() * 25) * 100 + 499;
        } else {
            price = Math.floor(random() * 15) * 100 + 299;
        }

        const rating = parseFloat((4.0 + random() * 1.0).toFixed(1));
        const reviewsCount = Math.floor(random() * 1200) + 5;
        const ageGroup = AGE_GROUPS[Math.floor(random() * AGE_GROUPS.length)];
        
        const descTemplates = [
            `Spark joy and creativity with this beautiful ${title}. Specially designed to promote motor skills and imaginative play.`,
            `The perfect ${title} for kids. Crafted with ultra-safe, high-quality materials and tested to meet premium standards.`,
            `Ignite imagination with the ultimate ${title} by ${brand}. Features interactive elements, bright colors, and durable builds for endless fun.`,
            `An engaging ${title} that supports early learning and coordination. A fantastic addition to any toy collection.`
        ];
        const description = descTemplates[Math.floor(random() * descTemplates.length)];

        // Assign 3D models to ~3% of toys for catalog richness
        const has3D = random() < 0.04;
        let modelId = null;
        if (has3D) {
            const models = ["rc_car", "kick_scooter", "royal_elephant"];
            modelId = models[Math.floor(random() * models.length)];
        }

        // Image fallbacks
        let image = ""; 
        if (category === "Vehicles & RC" && subcategory === "Remote Control") {
            image = "assets/rc_car.png";
        } else if (category === "Outdoor & Active" && subcategory === "Ride-ons") {
            image = "assets/kick_scooter.png";
        } else if (category === "Traditional Indian" && random() < 0.5) {
            image = "assets/channapatna_toy.png";
        }

        const tags = [
            category.toLowerCase(),
            subcategory.toLowerCase(),
            brand.toLowerCase(),
            ageGroup.toLowerCase().replace(" ", ""),
            ...noun.toLowerCase().split(" "),
            ...title.toLowerCase().split(" ").slice(0, 3)
        ];

        toys.push({
            id: `toy-${i}`,
            title,
            category,
            subcategory,
            price,
            rating,
            reviewsCount,
            ageGroup,
            brand,
            image,
            description,
            featured: false,
            has3D,
            modelId,
            isNew: random() < 0.15,
            tags
        });
    }

    return toys;
}

let TOYS_DATABASE = [];

function initDatabase() {
    TOYS_DATABASE = generateToysDatabase();
}

function queryToys(filters = {}) {
    const {
        search = "",
        category = "",
        subcategory = "",
        ageGroups = [],
        priceMin = 0,
        priceMax = Infinity,
        ratings = 0,
        sortBy = "featured",
        page = 1,
        limit = 30
    } = filters;

    let result = [...TOYS_DATABASE];

    if (search.trim() !== "") {
        const queryTerms = search.toLowerCase().trim().split(/\s+/);
        result = result.filter(toy => {
            const titleLow = toy.title.toLowerCase();
            const brandLow = toy.brand.toLowerCase();
            const descLow = toy.description.toLowerCase();
            
            return queryTerms.every(term => 
                titleLow.includes(term) || 
                brandLow.includes(term) ||
                descLow.includes(term) ||
                toy.category.toLowerCase().includes(term) ||
                toy.subcategory.toLowerCase().includes(term)
            );
        });
    }

    if (category) {
        result = result.filter(toy => toy.category === category);
    }

    if (subcategory) {
        result = result.filter(toy => toy.subcategory === subcategory);
    }

    if (ageGroups && ageGroups.length > 0) {
        result = result.filter(toy => ageGroups.includes(toy.ageGroup));
    }

    if (priceMin > 0 || priceMax < Infinity) {
        result = result.filter(toy => toy.price >= priceMin && toy.price <= priceMax);
    }

    if (ratings > 0) {
        result = result.filter(toy => toy.rating >= ratings);
    }

    if (sortBy === "price-asc") {
        result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
        result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
        result.sort((a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount);
    } else if (sortBy === "name") {
        result.sort((a, b) => a.title.localeCompare(b.title));
    } else {
        result.sort((a, b) => {
            if (a.featured !== b.featured) return b.featured ? 1 : -1;
            if (a.isNew !== b.isNew) return b.isNew ? 1 : -1;
            return b.reviewsCount - a.reviewsCount;
        });
    }

    const totalCount = result.length;
    const startIndex = (page - 1) * limit;
    const paginatedItems = result.slice(startIndex, startIndex + limit);

    return {
        items: paginatedItems,
        totalCount,
        hasMore: startIndex + limit < totalCount
    };
}

function getFacetCounts() {
    const facets = {
        categories: {},
        ageGroups: {},
        priceRange: { min: Infinity, max: -Infinity }
    };

    TOYS_DATABASE.forEach(toy => {
        facets.categories[toy.category] = (facets.categories[toy.category] || 0) + 1;
        facets.ageGroups[toy.ageGroup] = (facets.ageGroups[toy.ageGroup] || 0) + 1;

        if (toy.price < facets.priceRange.min) facets.priceRange.min = toy.price;
        if (toy.price > facets.priceRange.max) facets.priceRange.max = toy.price;
    });

    return facets;
}

initDatabase();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CATEGORY_MAP, BRANDS, AGE_GROUPS, queryToys, getFacetCounts, initDatabase, TOYS_DATABASE };
} else {
    window.ToyDatabase = { CATEGORY_MAP, BRANDS, AGE_GROUPS, queryToys, getFacetCounts, database: TOYS_DATABASE };
}
