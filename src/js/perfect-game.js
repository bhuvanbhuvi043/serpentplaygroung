const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const ui = {
    homeScreen: document.getElementById('homeScreen'),
    gameSurface: document.getElementById('gameSurface'),
    stageCards: document.getElementById('stageCards'),
    stageList: document.getElementById('stageList'),
    continue: document.getElementById('continueButton'),
    home: document.getElementById('homeButton'),
    drawer: document.getElementById('sidePanel'),
    drawerButton: document.getElementById('drawerButton'),
    drawerScrim: document.getElementById('drawerScrim'),
    closeDrawer: document.getElementById('closeDrawerButton'),
    gameStageLabel: document.getElementById('gameStageLabel'),
    gameStageName: document.getElementById('gameStageName'),
    score: document.getElementById('scoreValue'),
    stars: document.getElementById('starValue'),
    target: document.getElementById('targetValue'),
    title: document.getElementById('stageTitle'),
    brief: document.getElementById('stageBrief'),
    questions: document.getElementById('questionList'),
    trail: document.getElementById('letterTrail'),
    progressLabel: document.getElementById('progressLabel'),
    progressPercent: document.getElementById('progressPercent'),
    progressFill: document.getElementById('progressFill'),
    currentWord: document.getElementById('currentWordValue'),
    letterBank: document.getElementById('letterBank'),
    overlay: document.getElementById('messageOverlay'),
    messageTitle: document.getElementById('messageTitle'),
    messageText: document.getElementById('messageText'),
    start: document.getElementById('startButton'),
    pause: document.getElementById('pauseButton'),
    replay: document.getElementById('replayButton'),
    next: document.getElementById('nextButton'),
    sound: document.getElementById('soundButton'),
    speed: document.getElementById('speedRange'),
    music: document.getElementById('bgMusic'),
};

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const tile = 30;
const cells = 20;

const backgrounds = [
    'assets/images/stage-3.jpg',
    'assets/images/photo-1628260412297-a3377e45006f.jpg',
    'assets/images/depositphotos_389158500-stock-photo-space-aircrafts-universe-fantasy-backdrop.jpg',
    'assets/images/stage5img.jpg',
    'assets/images/stage-2.jpg',
    'assets/images/stage-4.jpg',
    'assets/images/stage-1.avif',
    'assets/images/pexels-frans-van-heerden-1022692.jpg',
    'assets/images/pexels-tom-fisk-3765594.jpg',
    'assets/images/pexels-sebastiaan-stam-1480690.jpg',
];

const wordClues = {
    ARM: 'A body part between shoulder and hand is an ___.',
    ANIMAL: 'A living creature like a dog or tiger is an ___.',
    APPLE: 'A red or green fruit is an ___.',
    BAG: 'You carry books or things in a ___.',
    BALL: 'A round toy used in many games is a ___.',
    BANANA: 'A long yellow fruit is a ___.',
    BAT: 'A stick used to hit a ball is a ___.',
    BASKET: 'You can carry fruit or toys in a ___.',
    BEAR: 'A large furry wild animal is a ___.',
    BEACH: 'Sand beside the sea is a ___.',
    BED: 'You sleep on a ___.',
    BELL: 'A ringing object is a ___.',
    BERRY: 'A small juicy fruit can be a ___.',
    BIRD: 'An animal with wings and feathers is a ___.',
    BLACK: 'A very dark color is ___.',
    BLOOM: 'When a flower opens, it begins to ___.',
    BOAT: 'A vehicle that moves on water is a ___.',
    BOOK: 'You read pages inside a ___.',
    BOTTLE: 'A container for water or juice is a ___.',
    BOX: 'A square container is a ___.',
    BRAIN: 'The organ inside your head that thinks is the ___.',
    BREAD: 'A loaf is made from ___.',
    BRIDGE: 'A road over water can be a ___.',
    BRIGHT: 'A sunny room is very ___.',
    BROWN: 'The color of chocolate is often ___.',
    BRUSH: 'You clean teeth or hair with a ___.',
    BUNNY: 'A cute rabbit can be called a ___.',
    BUS: 'A large vehicle that carries many people is a ___.',
    BUTTER: 'A yellow spread used on bread is ___.',
    BUTTON: 'A small round fastener on clothes is a ___.',
    CAKE: 'A sweet food for birthdays is ___.',
    CAMERA: 'We take photos with a ___.',
    CANDLE: 'A wax stick with a flame is a ___.',
    CANDY: 'A small sweet treat is ___.',
    CAR: 'A road vehicle with four wheels is a ___.',
    CARPET: 'A soft floor covering is a ___.',
    CARROT: 'An orange vegetable loved in soup is a ___.',
    CASTLE: 'A king may live in a ___.',
    CAT: 'A small pet that says meow is a ___.',
    CHAIR: 'You sit on a ___.',
    CHEESE: 'A food made from milk is ___.',
    CIRCLE: 'A round shape is a ___.',
    CLOCK: 'A tool that shows time is a ___.',
    CLOUD: 'A white shape in the sky is a ___.',
    COAT: 'Warm clothing worn outside is a ___.',
    COOKIE: 'A small sweet baked snack is a ___.',
    CORN: 'A yellow grain that grows on a cob is ___.',
    COTTON: 'A soft white material from a plant is ___.',
    CROWN: 'A king or queen wears a ___.',
    CUP: 'You drink from a ___.',
    DANCE: 'Moving with music is to ___.',
    DANGER: 'Something unsafe can mean ___.',
    DESERT: 'A dry place with lots of sand is a ___.',
    DESK: 'A table for study or work is a ___.',
    DOCTOR: 'A person who helps sick people is a ___.',
    DOG: 'A loyal pet that barks is a ___.',
    DOOR: 'You open a ___ to enter a room.',
    DRAGON: 'A story creature that may breathe fire is a ___.',
    DREAM: 'A story in your sleep is a ___.',
    DRESS: 'A one-piece clothing item is a ___.',
    DRIVER: 'A person who controls a car is a ___.',
    DRUM: 'A musical instrument you beat is a ___.',
    DUCK: 'A bird that swims and quacks is a ___.',
    EAR: 'You hear sound with your ___.',
    EARTH: 'Our planet is called ___.',
    EGG: 'A baby bird can hatch from an ___.',
    ELEVEN: 'The number after ten is ___.',
    EYE: 'You see with your ___.',
    FAIRY: 'A tiny magic story person is a ___.',
    FAMILY: 'Parents, children, and relatives are ___.',
    FAN: 'A machine that moves air is a ___.',
    FARM: 'A place where crops and animals grow is a ___.',
    FARMER: 'A person who grows food on a farm is a ___.',
    FATHER: 'A male parent is a ___.',
    FIELD: 'An open area of grass or crops is a ___.',
    FINGER: 'A part of your hand is a ___.',
    FIRE: 'Hot flames are called ___.',
    FISH: 'An animal that swims in water is a ___.',
    FLAG: 'A cloth symbol for a country or team is a ___.',
    FLOWER: 'A rose is a kind of ___.',
    FOOT: 'You stand on your ___.',
    FOREST: 'Many trees together make a ___.',
    FOX: 'A clever wild animal with a bushy tail is a ___.',
    FRAME: 'A border around a picture is a ___.',
    FRIEND: 'Someone kind you like is a ___.',
    FROG: 'A green animal that jumps and croaks is a ___.',
    FRUIT: 'Apples, bananas, and mangoes are ___.',
    GARDEN: 'Flowers grow in a ___.',
    GIANT: 'A very large story person is a ___.',
    GLASS: 'A clear material used in windows is ___.',
    GLOVES: 'Clothing that covers the hands is ___.',
    GOAT: 'A farm animal with horns can be a ___.',
    GRASS: 'The green plant covering many lawns is ___.',
    GREEN: 'The color of grass is ___.',
    GUITAR: 'A string instrument played with hands is a ___.',
    HAMMER: 'A tool used to hit nails is a ___.',
    HAND: 'You hold things with your ___.',
    HAPPY: 'A joyful feeling is ___.',
    HAT: 'You wear a ___ on your head.',
    HEART: 'The organ that pumps blood is the ___.',
    HELMET: 'A hard hat for safety is a ___.',
    HEN: 'A female chicken is a ___.',
    HOME: 'The place where you live is your ___.',
    HONEY: 'A sweet food made by bees is ___.',
    HORSE: 'A large animal people can ride is a ___.',
    HOUSE: 'A building where people live is a ___.',
    HUNTER: 'A person who looks for wild animals is a ___.',
    INSECT: 'A small animal with six legs is an ___.',
    ISLAND: 'Land surrounded by water is an ___.',
    JACKET: 'A short coat is a ___.',
    JAM: 'A sweet fruit spread is ___.',
    JUICE: 'A drink made from fruit is ___.',
    JUNGLE: 'A thick wild forest is a ___.',
    KETTLE: 'A pot used to boil water is a ___.',
    KEY: 'You open a lock with a ___.',
    KING: 'A male ruler is a ___.',
    KITE: 'A toy that flies on a string is a ___.',
    KITTEN: 'A baby cat is a ___.',
    LADDER: 'You climb up using a ___.',
    LAKE: 'A large body of water surrounded by land is a ___.',
    LAMP: 'A lamp gives us ___.',
    LEG: 'You walk with your ___.',
    LEMON: 'A sour yellow fruit is a ___.',
    LETTER: 'A, B, and C are each a ___.',
    LIGHT: 'A lamp gives us ___.',
    LION: 'A big cat called king of animals is a ___.',
    LIP: 'A part of the mouth is a ___.',
    MAGIC: 'A wonder trick can feel like ___.',
    MAP: 'A drawing that shows places is a ___.',
    MARKET: 'A place to buy food is a ___.',
    MILK: 'A white drink from cows is ___.',
    MIRROR: 'You see your face in a ___.',
    MONEY: 'Coins and notes used to buy things are ___.',
    MONKEY: 'An animal that climbs and likes bananas is a ___.',
    MOON: 'At night, we can see the ___.',
    MOTHER: 'A female parent is a ___.',
    MOUSE: 'A small animal or computer pointer is a ___.',
    MUSIC: 'Songs and rhythm are ___.',
    NAPKIN: 'A cloth or paper used while eating is a ___.',
    NATURE: 'Plants, animals, sky, and land are ___.',
    NEEDLE: 'A sharp tool used for sewing is a ___.',
    NET: 'A mesh used to catch fish or balls is a ___.',
    NIGHT: 'The dark time after sunset is ___.',
    NURSE: 'A person who helps care for patients is a ___.',
    OCEAN: 'A very large sea is an ___.',
    OFFICE: 'A place where people work at desks is an ___.',
    ORANGE: 'A fruit and a color can both be ___.',
    ORIGIN: 'The beginning of something is its ___.',
    PAPER: 'You write or draw on ___.',
    PARROT: 'A colorful talking bird can be a ___.',
    PEACE: 'A calm time without fighting is ___.',
    PEN: 'You write with a ___.',
    PENCIL: 'A wooden tool used for writing is a ___.',
    PHONE: 'You call people with a ___.',
    PILLOW: 'A soft cushion for your head is a ___.',
    PIRATE: 'A sea robber in stories is a ___.',
    PIZZA: 'A round food with cheese on top is ___.',
    PLANE: 'A flying vehicle is a ___.',
    PLANET: 'Earth is a ___.',
    PLANT: 'A living thing with leaves is a ___.',
    POCKET: 'You keep small things in a ___.',
    POETRY: 'Writing made of poems is ___.',
    POT: 'A container used for cooking is a ___.',
    POTATO: 'A brown vegetable used for fries is a ___.',
    PUZZLE: 'A game with pieces to solve is a ___.',
    QUEEN: 'A female ruler is a ___.',
    RABBIT: 'A hopping animal with long ears is a ___.',
    RADIO: 'A device for listening to programs is a ___.',
    RAIN: 'Water falling from clouds is ___.',
    RED: 'The color of many apples is ___.',
    RIBBON: 'A long strip used for tying is a ___.',
    RING: 'Jewelry worn on a finger is a ___.',
    RIVER: 'A long flow of water is a ___.',
    ROAD: 'Cars travel on a ___.',
    ROCKET: 'A spacecraft that launches upward is a ___.',
    ROSE: 'A red flower with thorns can be a ___.',
    RULER: 'A tool used to measure lines is a ___.',
    RUN: 'To move quickly on feet is to ___.',
    SCHOOL: 'Children go to ___ to learn.',
    SHEEP: 'A woolly farm animal is a ___.',
    SHIP: 'A large boat is a ___.',
    SHIRT: 'Clothing worn on the upper body is a ___.',
    SHOE: 'You wear a ___ on your foot.',
    SILVER: 'A shiny gray metal color is ___.',
    SISTER: 'A girl with the same parents is a ___.',
    SMILE: 'A happy face has a ___.',
    SNAKE: 'A long animal with no legs is a ___.',
    SNOW: 'White frozen flakes are ___.',
    SOCK: 'You wear a ___ inside a shoe.',
    SPOON: 'A tool used to eat soup is a ___.',
    STAR: 'A bright point in the night sky is a ___.',
    STONE: 'A small hard rock is a ___.',
    STORY: 'A tale with events is a ___.',
    SUGAR: 'A sweet ingredient is ___.',
    SUMMER: 'The hot season is ___.',
    SUN: 'The bright star in the daytime sky is the ___.',
    TABLE: 'You eat or work at a ___.',
    TIGER: 'A striped big cat is a ___.',
    TOMATO: 'A red fruit often used in sauce is a ___.',
    TOWN: 'A small city can be called a ___.',
    TOY: 'A child plays with a ___.',
    TRAIN: 'A vehicle that runs on tracks is a ___.',
    TREE: 'A tall plant with branches is a ___.',
    TURTLE: 'An animal with a shell is a ___.',
    WALLET: 'You keep money and cards in a ___.',
    WATER: 'We drink ___ when we are thirsty.',
    WHEEL: 'A round part that helps vehicles move is a ___.',
    WHITE: 'The color of milk is ___.',
    WIND: 'Moving air is called ___.',
    WINDOW: 'You look outside through a ___.',
    WINTER: 'The cold season is ___.',
    WIZARD: 'A magic story person can be a ___.',
    WOLF: 'A wild animal like a dog is a ___.',
    WONDER: 'A feeling of amazement is ___.',
    WORLD: 'All the earth and its people are the ___.',
    YELLOW: 'The color of a banana is ___.',
    ZEBRA: 'A black and white striped animal is a ___.',
    END: 'The finish of something is the ___.',
    TEN: 'The number after nine is ___.',
    RAT: 'A small animal like a mouse is a ___.',
    ART: 'Drawing and painting are ___.',
    EAT: 'To take food into your mouth is to ___.',
    TEA: 'A warm drink made with leaves is ___.',
    HEAT: 'Warm temperature is ___.',
    TAR: 'A black sticky road material is ___.',
    ROD: 'A long thin stick is a ___.',
    OAR: 'A paddle used to row a boat is an ___.',
    PIN: 'A small sharp fastener is a ___.',
    INK: 'Colored liquid used for writing is ___.',
    KIN: 'Family or relatives are ___.',
    PAL: 'A friend can be called a ___.',
    OLD: 'Not new is ___.',
    COD: 'A kind of fish is ___.',
    COLD: 'Low temperature feels ___.',
    SAND: 'Tiny grains found on a beach are ___.',
    LAND: 'Ground, not water, is ___.',
    LANE: 'A narrow road path is a ___.',
    SEED: 'A plant can grow from a ___.',
    NEED: 'Something necessary is a ___.',
    DEER: 'A gentle animal with antlers is a ___.',
    READ: 'To look at words and understand them is to ___.',
    DEAR: 'Someone loved can be called ___.',
    DARE: 'A challenge can be a ___.',
    RACE: 'A speed contest is a ___.',
    CARE: 'Kind attention is ___.',
    ACRE: 'A unit for measuring land is an ___.',
    FACE: 'Eyes, nose, and mouth are on the ___.',
    NOTE: 'A short written message is a ___.',
    TONE: 'The sound quality of a voice is its ___.',
    BONE: 'A hard part inside the body is a ___.',
    ROBE: 'A loose piece of clothing is a ___.',
    SING: 'To make music with your voice is to ___.',
    SIGN: 'A symbol or board with meaning is a ___.',
    RISE: 'To move upward is to ___.',
    SIREN: 'A loud warning sound is a ___.',
    STAIR: 'One step in a staircase is a ___.',
    TAIL: 'The back part of some animals is a ___.',
    MAIL: 'Letters and parcels are ___.',
    MAIN: 'Most important means ___.',
    NAIL: 'A hard tip on a finger is a ___.',
    PALE: 'Light in color can be ___.',
    PEAL: 'A loud ringing sound is a ___.',
    DEAL: 'An agreement can be a ___.',
    LEAP: 'A big jump is a ___.',
    DUST: 'Fine dry powder is ___.',
    STUD: 'A small metal fastener is a ___.',
    RUST: 'Red-brown coating on old metal is ___.',
    TRUST: 'Belief that someone is honest is ___.',
};

const lessonStagePlans = [
    { name: 'End Net Ten', letters: 'ENDT', words: ['END', 'NET', 'TEN'] },
    { name: 'Cat Car Rat', letters: 'CATR', words: ['CAT', 'CAR', 'RAT', 'ART'] },
    { name: 'Hat Eat Tea', letters: 'HATE', words: ['HAT', 'EAT', 'TEA', 'HEAT'] },
    { name: 'Star Art Rat', letters: 'STAR', words: ['STAR', 'ART', 'RAT', 'TAR'] },
    { name: 'Road Rod Oar', letters: 'ROAD', words: ['ROAD', 'ROD', 'OAR'] },
    { name: 'Pink Ink Kin', letters: 'PINK', words: ['PINK', 'INK', 'KIN', 'NIP'] },
    { name: 'Lamp Map Pal', letters: 'LAMP', words: ['LAMP', 'MAP', 'PAL'] },
    { name: 'Cold Cod Old', letters: 'COLD', words: ['COLD', 'COD', 'OLD'] },
    { name: 'Bear Bar Ear', letters: 'BEAR', words: ['BEAR', 'BAR', 'EAR', 'ARE'] },
    { name: 'Fire Red Ear', letters: 'FIRED', words: ['FIRE', 'RED', 'DEER', 'RIDE', 'DIRE'] },
    { name: 'Train Rain Art', letters: 'TRAIN', words: ['TRAIN', 'RAIN', 'ART', 'TIN', 'RAT'] },
    { name: 'Plane Lane Pale', letters: 'PLANE', words: ['PLANE', 'LANE', 'PEN', 'NAP', 'PALE'] },
    { name: 'Water Tear Rate', letters: 'WATER', words: ['WATER', 'TEAR', 'RATE', 'EAT', 'TARE'] },
    { name: 'Smile Mile Lime', letters: 'SMILE', words: ['SMILE', 'MILE', 'LIME', 'SLIM', 'SIM'] },
    { name: 'House Shoe Hose', letters: 'HOUSE', words: ['HOUSE', 'SHOE', 'HOSE', 'USE', 'SHE'] },
    { name: 'Cloud Cold Loud', letters: 'CLOUD', words: ['CLOUD', 'COLD', 'LOUD', 'COD', 'OLD'] },
    { name: 'Beach Each Bee', letters: 'BEACH', words: ['BEACH', 'EACH', 'BEE', 'ACHE', 'CAB'] },
    { name: 'Heart Heat Ear', letters: 'HEART', words: ['HEART', 'HEAT', 'EAR', 'TEAR', 'HAT'] },
    { name: 'Music Sum Sim', letters: 'MUSIC', words: ['MUSIC', 'SUM', 'SIM', 'SIC', 'MIMIC'] },
    { name: 'Green Net Tree', letters: 'GRNET', words: ['GREEN', 'NET', 'TREE', 'TEN', 'ENTER'] },
    { name: 'Planet Plant Lane', letters: 'PLANET', words: ['PLANET', 'PLANT', 'LANE', 'TEN', 'NAP'] },
    { name: 'Market Make Team', letters: 'MARKET', words: ['MARKET', 'MAKE', 'TEAM', 'RATE', 'TAKE'] },
    { name: 'Garden Danger Read', letters: 'GARDEN', words: ['GARDEN', 'DANGER', 'READ', 'DEAR', 'RANG'] },
    { name: 'Castle Case Tale', letters: 'CASTLE', words: ['CASTLE', 'CASE', 'TALE', 'EAT', 'CAT'] },
    { name: 'Friend Find Ride', letters: 'FRIEND', words: ['FRIEND', 'FIND', 'RIDE', 'FINE', 'END'] },
    { name: 'Bridge Bird Ride', letters: 'BRIDGE', words: ['BRIDGE', 'BIRD', 'RIDE', 'GRID', 'DIG'] },
    { name: 'Flower Wolf Fowl', letters: 'FLOWER', words: ['FLOWER', 'WOLF', 'FOWL', 'LOW', 'ROW'] },
    { name: 'Orange Range Earn', letters: 'ORANGE', words: ['ORANGE', 'RANGE', 'EARN', 'NEAR', 'ROAR'] },
    { name: 'School Cool Shoe', letters: 'SCHOLE', words: ['SCHOOL', 'COOL', 'SHOE', 'HOLE', 'LOSE'] },
    { name: 'Bright Right Hit', letters: 'BRIGHT', words: ['BRIGHT', 'RIGHT', 'HIT', 'RIB', 'BIT'] },
    { name: 'Family Mail Fail', letters: 'FAMILY', words: ['FAMILY', 'MAIL', 'FAIL', 'YAM', 'MAY'] },
    { name: 'Window Down Now', letters: 'WINDOW', words: ['WINDOW', 'DOWN', 'OWN', 'NOW', 'NOD'] },
    { name: 'Camera Race Care', letters: 'CAMERA', words: ['CAMERA', 'RACE', 'CARE', 'ACRE', 'ARM'] },
    { name: 'Rocket Core Toe', letters: 'ROCKET', words: ['ROCKET', 'CORE', 'TOE', 'TREE', 'COT'] },
    { name: 'Puzzle Pull Zed', letters: 'PUZLED', words: ['PUZZLE', 'PULL', 'DUEL', 'LED', 'ZED'] },
    { name: 'Basket Bat Seat', letters: 'BASKET', words: ['BASKET', 'BAT', 'SEAT', 'TEA', 'EAT'] },
    { name: 'Bridge Grid Dig', letters: 'BRIDGE', words: ['BRIDGE', 'GRID', 'DIG', 'RIB', 'BID'] },
    { name: 'Button Bun Ton', letters: 'BUTON', words: ['BUTTON', 'BUN', 'TON', 'TUB', 'NUT'] },
    { name: 'Cotton Ton Toon', letters: 'COTON', words: ['COTTON', 'TON', 'COOT', 'TOON', 'CON'] },
    { name: 'Pocket Pot Toe', letters: 'POCKET', words: ['POCKET', 'POT', 'TOE', 'COP', 'TOP'] },
    { name: 'Monkey Key Money', letters: 'MONKEY', words: ['MONKEY', 'MONEY', 'KEY', 'YEN', 'ONE'] },
    { name: 'Nature Near Run', letters: 'NATURE', words: ['NATURE', 'NEAR', 'RUN', 'TUNE', 'TRUE'] },
    { name: 'Pirate Pair Rate', letters: 'PIRATE', words: ['PIRATE', 'PAIR', 'RATE', 'TEA', 'TAP'] },
    { name: 'Silver Live Rise', letters: 'SILVER', words: ['SILVER', 'LIVE', 'RISE', 'SIR', 'LIE'] },
    { name: 'Winter Net Tin', letters: 'WINTER', words: ['WINTER', 'NET', 'TIN', 'TEN', 'RENT'] },
    { name: 'Candle Land Lane', letters: 'CANDLE', words: ['CANDLE', 'LAND', 'LANE', 'DEAL', 'LEAN'] },
    { name: 'Carrot Cart Rat', letters: 'CAROT', words: ['CARROT', 'CART', 'RAT', 'ROOT', 'TAR'] },
    { name: 'Helmet Meet Them', letters: 'HELMET', words: ['HELMET', 'MEET', 'THEM', 'LET', 'HEM'] },
    { name: 'Master Word Mix', letters: 'TRUSTD', words: ['TRUST', 'RUST', 'DUST', 'STUD', 'RUT'] },
];

function makeQuestion(answer) {
    const clue = wordClues[answer] || `Find the word ___.`;
    const [before, after = ''] = clue.split('___');
    return { before, after, answer };
}

function lengthLabel(words) {
    const sizes = Array.from(new Set(words.map(word => word.length))).sort((a, b) => a - b);
    if (sizes.length === 1) {
        return `${sizes[0]}-letter`;
    }
    return `${sizes.join('/')} letter`;
}

function makeBrief(plan, index) {
    const count = plan.words.length;
    const label = `${plan.letters.length}-letter bank`;
    const bank = plan.letters.split('').join(' ');
    if (index < 7) {
        return `Use ${bank} to find ${count} words. The same letters return after every apple.`;
    }
    if (index < 28) {
        return `Use this ${label}: ${bank}. Find ${count} words while keeping the snake alive.`;
    }
    if (index < 44) {
        return `Use this ${label}: ${bank}. Longer finds mean a longer snake and sharper turns.`;
    }
    return `Use this ${label}: ${bank}. This review stage tests word memory and snake control together.`;
}

const stages = [
    {
        title: 'Stage 1',
        name: 'Hungry Snake',
        kind: 'alphabet',
        brief: 'Eat the alphabet from A to Z. The letters you eat travel along the snake body.',
        background: backgrounds[0],
        targets: alphabet,
        questions: [],
    },
    ...lessonStagePlans.map((plan, index) => ({
        title: `Stage ${index + 2}`,
        name: plan.name,
        kind: 'words',
        brief: makeBrief(plan, index),
        background: backgrounds[(index + 1) % backgrounds.length],
        letterBank: plan.letters.split(''),
        targets: plan.words,
        questions: plan.words.map(makeQuestion),
    })),
];

const images = new Map();
for (const stage of stages) {
    const img = new Image();
    img.src = stage.background;
    images.set(stage.background, img);
}

const game = {
    stageIndex: 0,
    running: false,
    paused: false,
    won: false,
    score: 0,
    wrong: 0,
    targetIndex: 0,
    letterIndex: 0,
    currentAttempt: '',
    foundWords: [],
    direction: { x: 1, y: 0 },
    nextDirection: { x: 1, y: 0 },
    snake: [],
    bodyLetters: [],
    apples: [],
    particles: [],
    touchCue: null,
    lastTick: 0,
    timer: null,
    muted: true,
    mood: 'ready',
    moodUntil: 0,
};

function currentStage() {
    return stages[game.stageIndex];
}

function currentTarget() {
    if (currentStage().kind === 'words') {
        return game.currentAttempt;
    }
    return currentStage().targets[game.targetIndex] || '';
}

function nextLetter() {
    if (currentStage().kind === 'words') {
        return '';
    }
    return currentTarget()[game.letterIndex] || '';
}

function resetGame(keepMessage = true) {
    game.running = false;
    game.paused = false;
    game.won = false;
    game.score = 0;
    game.wrong = 0;
    game.targetIndex = 0;
    game.letterIndex = 0;
    game.currentAttempt = '';
    game.foundWords = [];
    game.direction = { x: 1, y: 0 };
    game.nextDirection = { x: 1, y: 0 };
    game.snake = [
        { x: 5, y: 10 },
        { x: 4, y: 10 },
        { x: 3, y: 10 },
        { x: 2, y: 10 },
    ];
    game.bodyLetters = [];
    game.particles = [];
    game.touchCue = null;
    game.mood = 'ready';
    game.moodUntil = 0;
    makeApples();
    updateUi();
    draw();
    if (keepMessage) {
        showMessage('Ready', `${currentStage().title}: ${currentStage().name}`);
    }
}

function randomCell() {
    return {
        x: Math.floor(Math.random() * cells),
        y: Math.floor(Math.random() * cells),
    };
}

function isBlocked(cell, list = []) {
    return game.snake.some(part => part.x === cell.x && part.y === cell.y)
        || list.some(item => item.x === cell.x && item.y === cell.y);
}

function uniquePosition(existing) {
    let cell = randomCell();
    let guard = 0;
    while (isBlocked(cell, existing) && guard < 500) {
        cell = randomCell();
        guard++;
    }
    return cell;
}

function preferredCorrectPosition(existing) {
    const head = game.snake[0];
    const dir = game.nextDirection || game.direction;
    for (let distance = 3; distance <= 7; distance++) {
        const cell = {
            x: head.x + dir.x * distance,
            y: head.y + dir.y * distance,
        };
        if (cell.x >= 0 && cell.y >= 0 && cell.x < cells && cell.y < cells && !isBlocked(cell, existing)) {
            return cell;
        }
    }
    return uniquePosition(existing);
}

function makeApples() {
    if (currentStage().kind === 'words') {
        makeWordApples();
        return;
    }

    const correct = nextLetter();
    if (!correct) {
        game.apples = [];
        return;
    }
    const count = game.stageIndex < 1 ? 3 : game.stageIndex < 5 ? 4 : 5;
    const letters = new Set([correct]);
    while (letters.size < count) {
        const pool = currentTarget().split('').concat(alphabet);
        const letter = pool[Math.floor(Math.random() * pool.length)];
        if (letter && letter !== correct) {
            letters.add(letter);
        }
    }

    game.apples = [];
    const correctPosition = preferredCorrectPosition(game.apples);
    game.apples.push({
        x: correctPosition.x,
        y: correctPosition.y,
        letter: correct,
        correct: true,
        pulse: Math.random() * Math.PI * 2,
    });

    Array.from(letters)
        .filter(letter => letter !== correct)
        .sort(() => Math.random() - 0.5)
        .forEach(letter => {
            const pos = uniquePosition(game.apples);
            game.apples.push({
                x: pos.x,
                y: pos.y,
                letter,
                correct: false,
                pulse: Math.random() * Math.PI * 2,
            });
        });
}

function makeWordApples() {
    const stage = currentStage();
    const letters = stage.letterBank || [];
    game.apples = [];

    letters.forEach(letter => {
        const pos = uniquePosition(game.apples);
        game.apples.push({
            x: pos.x,
            y: pos.y,
            letter,
            correct: true,
            pulse: Math.random() * Math.PI * 2,
        });
    });
}

function startGame() {
    if (game.running && !game.paused) {
        return;
    }
    if (game.running && game.paused) {
        togglePause();
        return;
    }
    if (game.won) {
        resetGame(false);
    }
    game.running = true;
    game.paused = false;
    setMood('focus', 900);
    hideMessage();
    game.lastTick = performance.now();
    scheduleTick();
    updateUi();
}

function scheduleTick() {
    clearTimeout(game.timer);
    if (!game.running || game.paused) {
        return;
    }
    game.timer = setTimeout(step, Number(ui.speed.value));
}

function step() {
    game.direction = game.nextDirection;
    const head = game.snake[0];
    const newHead = {
        x: head.x + game.direction.x,
        y: head.y + game.direction.y,
    };

    if (newHead.x < 0 || newHead.y < 0 || newHead.x >= cells || newHead.y >= cells) {
        gameOver('The snake touched the wall.');
        return;
    }

    if (game.snake.some(part => part.x === newHead.x && part.y === newHead.y)) {
        gameOver('The snake bumped into itself.');
        return;
    }

    const appleIndex = game.apples.findIndex(apple => apple.x === newHead.x && apple.y === newHead.y);
    game.snake.unshift(newHead);

    if (appleIndex >= 0) {
        eatApple(game.apples[appleIndex]);
    } else {
        game.snake.pop();
    }

    draw();
    updateUi();
    if (game.running && !game.paused) {
        scheduleTick();
    }
}

function eatApple(apple) {
    if (currentStage().kind === 'words') {
        eatWordApple(apple);
        return;
    }

    if (!apple.correct) {
        game.wrong++;
        game.snake.pop();
        burst(apple, '#d93b30');
        setMood('wrong', 900);
        showMessage('Wrong apple', `Find ${nextLetter()} next.`);
        window.setTimeout(hideMessage, 700);
        makeApples();
        return;
    }

    game.score++;
    setMood('eat', 650);
    game.bodyLetters.unshift(apple.letter);
    if (game.bodyLetters.length > game.snake.length - 1) {
        game.bodyLetters.length = game.snake.length - 1;
    }
    burst(apple, '#e6a700');

    game.letterIndex++;
    if (game.letterIndex >= currentTarget().length) {
        completeTarget();
    } else {
        makeApples();
    }
}

function remainingWords() {
    return currentStage().targets.filter(word => !game.foundWords.includes(word));
}

function attemptState(attempt) {
    const remaining = remainingWords();
    if (remaining.includes(attempt)) {
        return 'complete';
    }
    if (remaining.some(word => word.startsWith(attempt))) {
        return 'prefix';
    }
    return 'invalid';
}

function eatWordApple(apple) {
    const proposed = `${game.currentAttempt}${apple.letter}`;
    const state = attemptState(proposed);

    if (state === 'invalid') {
        game.wrong++;
        game.snake.pop();
        game.currentAttempt = '';
        burst(apple, '#d93b30');
        setMood('wrong', 950);
        showMessage('Try another word', `${proposed} is not in this stage.`);
        window.setTimeout(hideMessage, 850);
        makeApples();
        return;
    }

    game.score++;
    game.currentAttempt = proposed;
    game.bodyLetters.unshift(apple.letter);
    if (game.bodyLetters.length > game.snake.length - 1) {
        game.bodyLetters.length = game.snake.length - 1;
    }
    burst(apple, state === 'complete' ? '#17a972' : '#e6a700');
    setMood(state === 'complete' ? 'win' : 'eat', state === 'complete' ? 800 : 650);

    if (state === 'complete') {
        completeWord(proposed);
        return;
    }

    makeApples();
}

function completeWord(word) {
    game.foundWords.push(word);
    game.targetIndex = game.foundWords.length;
    game.currentAttempt = '';

    if (game.foundWords.length >= currentStage().targets.length) {
        winStage();
        return;
    }

    makeApples();
    showMessage('Word found', `${word} complete. Find ${currentStage().targets.length - game.foundWords.length} more.`);
    updateUi();
    window.setTimeout(hideMessage, 900);
}

function completeTarget() {
    game.targetIndex++;
    game.letterIndex = 0;

    if (game.targetIndex >= currentStage().targets.length) {
        winStage();
        return;
    }

    makeApples();
    if (currentStage().questions.length) {
        showMessage('Word complete', `Next word: ${currentTarget()}`);
        window.setTimeout(hideMessage, 800);
    }
}

function winStage() {
    game.running = false;
    game.won = true;
    clearTimeout(game.timer);
    setMood('win', 2500);
    const stars = starCount();
    const key = `starsEarnedStage${game.stageIndex + 1}`;
    const oldStars = Number(localStorage.getItem(key)) || 0;
    localStorage.setItem(key, String(Math.max(oldStars, stars)));
    showMessage('Stage complete', `You earned ${stars} star${stars === 1 ? '' : 's'}.`);
    updateUi();
    updateStageCards();
    draw();
}

function gameOver(reason) {
    game.running = false;
    clearTimeout(game.timer);
    setMood('dead', 2500);
    showMessage('Game over', reason);
    draw();
}

function starCount() {
    if (game.wrong === 0) {
        return 3;
    }
    if (game.wrong <= 3) {
        return 2;
    }
    return 1;
}

function stageStars(index) {
    return Number(localStorage.getItem(`starsEarnedStage${index + 1}`)) || 0;
}

function isStageUnlocked(index) {
    return index === 0 || stageStars(index - 1) > 0;
}

function firstPlayableStage() {
    const firstIncomplete = stages.findIndex((stage, index) => isStageUnlocked(index) && stageStars(index) === 0);
    return firstIncomplete >= 0 ? firstIncomplete : 0;
}

function setMood(mood, duration = 800) {
    game.mood = mood;
    game.moodUntil = Date.now() + duration;
}

function activeMood() {
    if (Date.now() > game.moodUntil && !['dead', 'win', 'ready'].includes(game.mood)) {
        return 'happy';
    }
    return game.mood;
}

function burst(apple, color) {
    for (let i = 0; i < 16; i++) {
        game.particles.push({
            x: apple.x * tile + tile / 2,
            y: apple.y * tile + tile / 2,
            dx: (Math.random() - 0.5) * 7,
            dy: (Math.random() - 0.5) * 7,
            life: 18,
            color,
        });
    }
}

function draw() {
    drawBackground();
    drawGrid();
    drawApples();
    drawSnake();
    drawParticles();
    drawTouchCue();
}

function animationLoop() {
    draw();
    requestAnimationFrame(animationLoop);
}

function drawBackground() {
    const stage = currentStage();
    const img = images.get(stage.background);
    ctx.fillStyle = '#73cabf';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (img && img.complete && img.naturalWidth > 0) {
        ctx.save();
        ctx.globalAlpha = 0.32;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.restore();
    }
}

function drawGrid() {
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.16)';
    ctx.lineWidth = 1;
    for (let i = 1; i < cells; i++) {
        ctx.beginPath();
        ctx.moveTo(i * tile, 0);
        ctx.lineTo(i * tile, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * tile);
        ctx.lineTo(canvas.width, i * tile);
        ctx.stroke();
    }
    ctx.restore();
}

function drawApples() {
    for (const apple of game.apples) {
        const cx = apple.x * tile + tile / 2;
        const cy = apple.y * tile + tile / 2;
        const pulse = Math.sin(Date.now() / 180 + apple.pulse) * 1.6;
        const appleGradient = ctx.createRadialGradient(cx - 7, cy - 8, 3, cx, cy, tile * 0.48 + pulse);
        appleGradient.addColorStop(0, '#ffb3a7');
        appleGradient.addColorStop(0.3, '#ef4f42');
        appleGradient.addColorStop(1, '#a92222');
        ctx.save();
        ctx.shadowColor = apple.correct ? 'rgba(255, 226, 89, 0.36)' : 'rgba(0,0,0,0.25)';
        ctx.shadowBlur = apple.correct ? 13 : 8;
        ctx.shadowOffsetY = 3;
        ctx.fillStyle = appleGradient;
        ctx.beginPath();
        ctx.arc(cx - 5, cy + 2, tile * 0.33 + pulse, 0, Math.PI * 2);
        ctx.arc(cx + 5, cy + 2, tile * 0.33 + pulse, 0, Math.PI * 2);
        ctx.arc(cx, cy + 6, tile * 0.34 + pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(89, 12, 12, 0.42)';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(255,255,255,0.52)';
        ctx.beginPath();
        ctx.ellipse(cx - 7, cy - 6, 4.4, 8, 0.7, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#65401d';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx - 1, cy - 12);
        ctx.quadraticCurveTo(cx + 1, cy - 18, cx + 5, cy - 22);
        ctx.stroke();

        const leafGradient = ctx.createLinearGradient(cx + 4, cy - 20, cx + 15, cy - 13);
        leafGradient.addColorStop(0, '#76c95b');
        leafGradient.addColorStop(1, '#22733a');
        ctx.fillStyle = leafGradient;
        ctx.beginPath();
        ctx.ellipse(cx + 9, cy - 17, 8, 4.5, -0.45, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 248, 220, 0.93)';
        ctx.beginPath();
        ctx.arc(cx, cy + 3, 10.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#832020';
        ctx.font = '900 17px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(apple.letter, cx, cy + 4);
        ctx.restore();
    }
}

function directionAngle() {
    const dir = game.nextDirection || game.direction;
    return Math.atan2(dir.y, dir.x);
}

function drawSnake() {
    const points = game.snake.map(part => ({
        x: part.x * tile + tile / 2,
        y: part.y * tile + tile / 2,
    }));

    if (points.length > 1) {
        drawSnakePath(points, 'rgba(5, 36, 24, 0.42)', 34);
        drawSnakePath(points, activeMood() === 'dead' ? '#3f4957' : '#0b5734', 30);
        drawSnakePath(points, activeMood() === 'dead' ? '#657083' : '#38b466', 22);
        drawSnakePath(points, activeMood() === 'dead' ? 'rgba(217,225,236,0.36)' : 'rgba(194, 255, 190, 0.34)', 8);
    }

    for (let i = game.snake.length - 1; i >= 1; i--) {
        const point = points[i];
        const angle = segmentAngle(points, i);
        const letter = game.bodyLetters[i - 1] || '';
        ctx.save();
        ctx.translate(point.x, point.y);
        ctx.rotate(angle);
        ctx.fillStyle = i % 2 === 0 ? 'rgba(245,255,216,0.34)' : 'rgba(12,78,42,0.26)';
        ctx.beginPath();
        ctx.ellipse(-4, -6, 6.2, 3.5, -0.55, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(5, 78, 46, 0.22)';
        ctx.beginPath();
        ctx.ellipse(6, 5, 4.8, 2.5, -0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (letter) {
            ctx.save();
            ctx.fillStyle = 'rgba(255,255,255,0.78)';
            ctx.beginPath();
            ctx.arc(point.x, point.y + 1, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#062c1a';
            ctx.font = '900 17px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(letter, point.x, point.y + 1);
            ctx.restore();
        }
    }

    if (points.length > 2) {
        const tail = points[points.length - 1];
        const beforeTail = points[points.length - 2];
        const tailAngle = Math.atan2(tail.y - beforeTail.y, tail.x - beforeTail.x);
        ctx.save();
        ctx.translate(tail.x, tail.y);
        ctx.rotate(tailAngle);
        ctx.fillStyle = activeMood() === 'dead' ? '#657083' : '#21884e';
        ctx.beginPath();
        ctx.moveTo(-18, 0);
        ctx.quadraticCurveTo(-2, -10, 12, -3);
        ctx.quadraticCurveTo(3, 0, 12, 3);
        ctx.quadraticCurveTo(-2, 10, -18, 0);
        ctx.fill();
        ctx.restore();
    }

    const head = points[0];
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 12;
    const headGradient = ctx.createRadialGradient(head.x - 8, head.y - 10, 4, head.x, head.y, 22);
    if (activeMood() === 'dead') {
        headGradient.addColorStop(0, '#8892a3');
        headGradient.addColorStop(1, '#475162');
    } else {
        headGradient.addColorStop(0, '#5fe17a');
        headGradient.addColorStop(0.55, '#178146');
        headGradient.addColorStop(1, '#0b4d30');
    }
    ctx.fillStyle = headGradient;
    ctx.beginPath();
    ctx.ellipse(head.x, head.y, 21, 16, directionAngle(), 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(5, 36, 24, 0.34)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = 'rgba(220, 255, 205, 0.34)';
    ctx.beginPath();
    ctx.ellipse(head.x - 5, head.y - 7, 7, 4, directionAngle() - 0.35, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
    drawSnakeFace(head.x, head.y);
    ctx.restore();
}

function segmentAngle(points, index) {
    const prev = points[Math.max(0, index - 1)];
    const next = points[Math.min(points.length - 1, index + 1)];
    return Math.atan2(prev.y - next.y, prev.x - next.x);
}

function drawSnakePath(points, color, width) {
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(points[points.length - 1].x, points[points.length - 1].y);
    for (let i = points.length - 2; i >= 0; i--) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
    ctx.restore();
}

function drawSnakeFace(cx, cy) {
    const mood = activeMood();
    const angle = directionAngle();
    const forward = { x: Math.cos(angle), y: Math.sin(angle) };
    const side = { x: -forward.y, y: forward.x };
    const eyeA = {
        x: cx + forward.x * 6 + side.x * 5,
        y: cy + forward.y * 6 + side.y * 5,
    };
    const eyeB = {
        x: cx + forward.x * 6 - side.x * 5,
        y: cy + forward.y * 6 - side.y * 5,
    };

    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(eyeA.x, eyeA.y, 3.8, 0, Math.PI * 2);
    ctx.arc(eyeB.x, eyeB.y, 3.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0f172a';
    if (mood === 'dead') {
        drawX(eyeA.x, eyeA.y);
        drawX(eyeB.x, eyeB.y);
    } else {
        const pupilPush = mood === 'wrong' ? 1.5 : 0.6;
        ctx.beginPath();
        ctx.arc(eyeA.x + forward.x * pupilPush, eyeA.y + forward.y * pupilPush, 1.6, 0, Math.PI * 2);
        ctx.arc(eyeB.x + forward.x * pupilPush, eyeB.y + forward.y * pupilPush, 1.6, 0, Math.PI * 2);
        ctx.fill();
    }

    if (mood === 'wrong' || mood === 'focus') {
        ctx.strokeStyle = mood === 'wrong' ? '#4f1010' : '#0f3f2a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(eyeA.x - side.x * 2 - forward.x * 3, eyeA.y - side.y * 2 - forward.y * 3);
        ctx.lineTo(eyeA.x + side.x * 3 - forward.x * 5, eyeA.y + side.y * 3 - forward.y * 5);
        ctx.moveTo(eyeB.x + side.x * 2 - forward.x * 3, eyeB.y + side.y * 2 - forward.y * 3);
        ctx.lineTo(eyeB.x - side.x * 3 - forward.x * 5, eyeB.y - side.y * 3 - forward.y * 5);
        ctx.stroke();
    }

    const mouth = {
        x: cx + forward.x * 8,
        y: cy + forward.y * 8,
    };
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (mood === 'wrong') {
        ctx.arc(mouth.x, mouth.y, 5, Math.PI + 0.2, Math.PI * 2 - 0.2);
    } else if (mood === 'dead') {
        ctx.moveTo(mouth.x - side.x * 4, mouth.y - side.y * 4);
        ctx.lineTo(mouth.x + side.x * 4, mouth.y + side.y * 4);
    } else {
        ctx.arc(mouth.x, mouth.y - 2, 6, 0.15, Math.PI - 0.15);
    }
    ctx.stroke();

    if (mood === 'eat' || mood === 'focus' || mood === 'happy' || mood === 'win') {
        ctx.strokeStyle = mood === 'win' ? '#f8c436' : '#e31b5f';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx + forward.x * 15, cy + forward.y * 15);
        ctx.lineTo(cx + forward.x * 23 + side.x * 3, cy + forward.y * 23 + side.y * 3);
        ctx.moveTo(cx + forward.x * 23 + side.x * 3, cy + forward.y * 23 + side.y * 3);
        ctx.lineTo(cx + forward.x * 19 - side.x * 3, cy + forward.y * 19 - side.y * 3);
        ctx.stroke();
    }

    if (mood === 'win') {
        ctx.fillStyle = '#ffe56a';
        ctx.beginPath();
        ctx.arc(cx - side.x * 13 - forward.x * 5, cy - side.y * 13 - forward.y * 5, 2.4, 0, Math.PI * 2);
        ctx.arc(cx + side.x * 13 - forward.x * 5, cy + side.y * 13 - forward.y * 5, 2.4, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawX(x, y) {
    ctx.save();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - 3, y - 3);
    ctx.lineTo(x + 3, y + 3);
    ctx.moveTo(x + 3, y - 3);
    ctx.lineTo(x - 3, y + 3);
    ctx.stroke();
    ctx.restore();
}

function drawParticles() {
    game.particles = game.particles.filter(particle => particle.life > 0);
    for (const particle of game.particles) {
        particle.x += particle.dx;
        particle.y += particle.dy;
        particle.life--;
        ctx.save();
        ctx.globalAlpha = Math.max(0, particle.life / 18);
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function drawTouchCue() {
    if (!game.touchCue || game.touchCue.life <= 0) {
        return;
    }
    const cue = game.touchCue;
    cue.life--;
    const alpha = cue.life / 18;
    const arrows = {
        up: { x1: 0, y1: 12, x2: 0, y2: -14, ax1: -9, ay1: -4, ax2: 9, ay2: -4 },
        down: { x1: 0, y1: -12, x2: 0, y2: 14, ax1: -9, ay1: 4, ax2: 9, ay2: 4 },
        left: { x1: 12, y1: 0, x2: -14, y2: 0, ax1: -4, ay1: -9, ax2: -4, ay2: 9 },
        right: { x1: -12, y1: 0, x2: 14, y2: 0, ax1: 4, ay1: -9, ax2: 4, ay2: 9 },
    };
    const arrow = arrows[cue.direction];
    if (!arrow) {
        return;
    }
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = '#ffffff';
    ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cue.x, cue.y, 24 - alpha * 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cue.x + arrow.x1, cue.y + arrow.y1);
    ctx.lineTo(cue.x + arrow.x2, cue.y + arrow.y2);
    ctx.lineTo(cue.x + arrow.ax1, cue.y + arrow.ay1);
    ctx.moveTo(cue.x + arrow.x2, cue.y + arrow.y2);
    ctx.lineTo(cue.x + arrow.ax2, cue.y + arrow.ay2);
    ctx.stroke();
    ctx.restore();
}

function roundRect(x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

function updateUi() {
    const stage = currentStage();
    ui.title.textContent = `${stage.title}: ${stage.name}`;
    ui.brief.textContent = stage.brief;
    ui.gameStageLabel.textContent = stage.title;
    ui.gameStageName.textContent = stage.name;
    ui.score.textContent = String(game.score);
    ui.stars.textContent = String(stageStars(game.stageIndex) || (game.won ? starCount() : 0));
    ui.target.textContent = stage.kind === 'alphabet' ? (nextLetter() || 'Done') : `${game.foundWords.length}/${stage.targets.length}`;
    ui.next.disabled = game.stageIndex >= stages.length - 1 || !isStageUnlocked(game.stageIndex + 1);
    ui.start.disabled = game.running && !game.paused && !game.won;
    ui.start.textContent = game.running && game.paused ? 'Resume' : 'Start';
    ui.pause.disabled = !game.running || game.won;
    updateProgress();
    updateQuestions();
    updateLetters();
    updateLetterBank();
    updateStageButtons();
    updateStageCards();
}

function updateProgress() {
    const stage = currentStage();
    const total = stage.targets.length;
    const completed = stage.kind === 'alphabet' ? Math.min(game.targetIndex, total) : game.foundWords.length;
    const percent = total ? Math.round((completed / total) * 100) : 100;
    const label = stage.kind === 'alphabet' ? 'Letters' : 'Words';
    const current = stage.kind === 'alphabet'
        ? (nextLetter() || 'Done')
        : game.won
            ? 'Done'
            : game.currentAttempt || 'Build word';

    ui.progressLabel.textContent = `${label} ${completed}/${total}`;
    ui.progressPercent.textContent = `${percent}%`;
    ui.progressFill.style.width = `${percent}%`;
    ui.currentWord.textContent = current;
}

function updateQuestions() {
    const stage = currentStage();
    ui.questions.innerHTML = '';
    if (stage.kind === 'alphabet') {
        const item = document.createElement('li');
        item.textContent = nextLetter() ? `Eat ${nextLetter()} next, then continue A to Z.` : 'Alphabet complete.';
        ui.questions.appendChild(item);
        return;
    }

    if (!stage.questions.length) {
        const item = document.createElement('li');
        item.textContent = 'Find words from the letter bank.';
        ui.questions.appendChild(item);
        return;
    }

    stage.questions.forEach(question => {
        const item = document.createElement('li');
        const done = game.foundWords.includes(question.answer);
        item.className = done ? 'is-done' : '';
        const active = game.currentAttempt && question.answer.startsWith(game.currentAttempt);
        const shown = done
            ? question.answer
            : active
                ? game.currentAttempt.padEnd(question.answer.length, '_')
                : ''.padEnd(question.answer.length, '_');
        item.innerHTML = `${question.before}<span class="answer-slot">${shown}</span>${question.after}`;
        ui.questions.appendChild(item);
    });
}

function updateLetters() {
    ui.trail.innerHTML = '';
    game.bodyLetters.slice(0, 18).forEach(letter => {
        const chip = document.createElement('span');
        chip.className = 'letter-chip';
        chip.textContent = letter;
        ui.trail.appendChild(chip);
    });
}

function updateLetterBank() {
    ui.letterBank.innerHTML = '';
    const stage = currentStage();
    const letters = stage.kind === 'alphabet' ? alphabet.slice(game.targetIndex, game.targetIndex + 6) : stage.letterBank;
    letters.forEach(letter => {
        const chip = document.createElement('span');
        chip.textContent = letter;
        ui.letterBank.appendChild(chip);
    });
}

function updateStageButtons() {
    Array.from(ui.stageList.children).forEach((button, index) => {
        const locked = !isStageUnlocked(index);
        button.classList.toggle('is-active', index === game.stageIndex);
        button.classList.toggle('is-locked', locked);
        button.disabled = locked;
        const stars = stageStars(index);
        button.textContent = locked ? 'Lock' : stars ? `${index + 1} (${stars})` : String(index + 1);
    });
}

function updateStageCards() {
    Array.from(ui.stageCards.children).forEach((card, index) => {
        const locked = !isStageUnlocked(index);
        const stars = stageStars(index);
        card.classList.toggle('is-active', index === game.stageIndex);
        card.classList.toggle('is-complete', stars > 0);
        card.classList.toggle('is-locked', locked);
        card.disabled = locked;
        const status = card.querySelector('.stage-card-status');
        if (status) {
            status.textContent = locked ? 'Locked' : stars ? `${stars} star${stars === 1 ? '' : 's'}` : 'Ready';
        }
    });
}

function showMessage(title, text) {
    ui.messageTitle.textContent = title;
    ui.messageText.textContent = text;
    ui.overlay.classList.add('is-visible');
}

function hideMessage() {
    ui.overlay.classList.remove('is-visible');
}

function setDirection(name) {
    const directions = {
        up: { x: 0, y: -1 },
        down: { x: 0, y: 1 },
        left: { x: -1, y: 0 },
        right: { x: 1, y: 0 },
    };
    const next = directions[name];
    if (!next) {
        return false;
    }
    if (next.x + game.direction.x === 0 && next.y + game.direction.y === 0) {
        return false;
    }
    game.nextDirection = next;
    return true;
}

function directionFromTouch(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const head = game.snake[0];
    const headX = rect.left + ((head.x + 0.5) / cells) * rect.width;
    const headY = rect.top + ((head.y + 0.5) / cells) * rect.height;
    const dx = clientX - headX;
    const dy = clientY - headY;
    if (Math.abs(dx) > Math.abs(dy)) {
        return dx > 0 ? 'right' : 'left';
    }
    return dy > 0 ? 'down' : 'up';
}

function updateTouchCue(clientX, clientY, direction) {
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(canvas.width, ((clientX - rect.left) / rect.width) * canvas.width));
    const y = Math.max(0, Math.min(canvas.height, ((clientY - rect.top) / rect.height) * canvas.height));
    game.touchCue = { x, y, direction, life: 18 };
}

function handleTapSteering(event) {
    const target = event.target;
    if (target.closest('button, input, label, a, select, textarea, .side-panel')) {
        return;
    }
    if (!target.closest('.play-panel') && !target.closest('.canvas-wrap')) {
        return;
    }
    const isTouchLike = event.pointerType === 'touch' || event.pointerType === 'pen';
    if (!isTouchLike && !target.closest('.canvas-wrap')) {
        return;
    }
    event.preventDefault();
    const direction = directionFromTouch(event.clientX, event.clientY);
    if (setDirection(direction)) {
        updateTouchCue(event.clientX, event.clientY, direction);
    }
}

function buildStageButtons() {
    stages.forEach((stage, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.title = `${stage.title}: ${stage.name}`;
        button.addEventListener('click', () => openStage(index));
        ui.stageList.appendChild(button);
    });
}

function buildStageCards() {
    stages.forEach((stage, index) => {
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'stage-card';
        card.innerHTML = `
            <span class="stage-card-number">${index + 1}</span>
            <strong>${stage.name}</strong>
            <span>${stage.kind === 'alphabet' ? 'A to Z' : (stage.letterBank || []).join(' ')}</span>
            <em class="stage-card-status">Ready</em>
        `;
        card.addEventListener('click', () => openStage(index));
        ui.stageCards.appendChild(card);
    });
}

function openStage(index) {
    if (!isStageUnlocked(index)) {
        return;
    }
    game.stageIndex = index;
    closeDrawer();
    ui.homeScreen.classList.add('is-hidden');
    ui.gameSurface.classList.remove('is-hidden');
    resetGame();
}

function openHome() {
    game.running = false;
    game.paused = false;
    clearTimeout(game.timer);
    closeDrawer();
    ui.gameSurface.classList.add('is-hidden');
    ui.homeScreen.classList.remove('is-hidden');
    updateStageCards();
}

function openDrawer() {
    ui.drawer.classList.add('is-open');
    ui.drawerScrim.classList.add('is-visible');
}

function closeDrawer() {
    ui.drawer.classList.remove('is-open');
    ui.drawerScrim.classList.remove('is-visible');
}

function togglePause() {
    if (!game.running) {
        return;
    }
    game.paused = !game.paused;
    if (game.paused) {
        showMessage('Paused', 'Press Pause again to continue.');
        clearTimeout(game.timer);
    } else {
        hideMessage();
        scheduleTick();
    }
    updateUi();
}

function toggleSound() {
    game.muted = !game.muted;
    ui.sound.setAttribute('aria-pressed', String(!game.muted));
    ui.sound.textContent = game.muted ? 'Sound' : 'Mute';
    if (game.muted) {
        ui.music.pause();
        return;
    }
    ui.music.play().catch(() => {
        game.muted = true;
        ui.sound.textContent = 'Sound';
        ui.sound.setAttribute('aria-pressed', 'false');
    });
}

ui.start.addEventListener('click', startGame);
ui.pause.addEventListener('click', togglePause);
ui.replay.addEventListener('click', () => resetGame());
ui.next.addEventListener('click', () => {
    const nextStage = game.stageIndex + 1;
    if (nextStage < stages.length && isStageUnlocked(nextStage)) {
        openStage(nextStage);
    }
});
ui.continue.addEventListener('click', () => openStage(firstPlayableStage()));
ui.home.addEventListener('click', openHome);
ui.drawerButton.addEventListener('click', openDrawer);
ui.closeDrawer.addEventListener('click', closeDrawer);
ui.drawerScrim.addEventListener('click', closeDrawer);
ui.sound.addEventListener('click', toggleSound);
ui.speed.addEventListener('input', () => {
    localStorage.setItem('snakeSpeedPerfect', ui.speed.value);
    scheduleTick();
});

document.addEventListener('pointerdown', handleTapSteering, { passive: false });

window.addEventListener('keydown', event => {
    const map = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
        w: 'up',
        s: 'down',
        a: 'left',
        d: 'right',
    };
    if (event.key === ' ') {
        event.preventDefault();
        togglePause();
        return;
    }
    const direction = map[event.key];
    if (direction) {
        event.preventDefault();
        setDirection(direction);
    }
});

for (const img of images.values()) {
    img.addEventListener('load', draw);
}

const savedSpeed = Number(localStorage.getItem('snakeSpeedPerfect'));
if (savedSpeed >= 220 && savedSpeed <= 620) {
    ui.speed.value = String(Math.max(savedSpeed, 360));
}

buildStageButtons();
buildStageCards();
resetGame(false);
openHome();
requestAnimationFrame(animationLoop);
window.wordSerpentGame = game;
