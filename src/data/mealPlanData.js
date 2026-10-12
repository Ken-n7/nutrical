// ======================
// FOOD ITEMS
// Every list is transcribed from the FNRI Food Exchange Lists for Meal Planning;
// "FEL p. …" gives the book's printed page. Most groups hold a selection, so
// more rows can be added from the same pages at any time. The book's "cnd" is
// spelled out as "canned".
// ======================
const FRESH_VEG = { category: 'Fresh Vegetables', measure: '½ cup raw or cooked' };

export const FOOD_ITEMS = {
  // FEL pp. 19–20, Vegetable exchange (3 g carbohydrate, 1 g protein, 16 kcal). A selection.
  // Fresh vegetables share one measure (Table 2.2): ½ cup raw (40 g) or ½ cup cooked (45 g).
  // Vegetables on the book's free list (p. 21: kangkong, pechay, tomato, eggplant,
  // cabbage, bell pepper, unripe papaya, okra…) are not exchanges and are left out.
  veg: [
    { ...FRESH_VEG, filipino: 'Malunggay, dahon', name: 'Horseradish tree, leaves' },
    { ...FRESH_VEG, filipino: 'Sitaw, bunga', name: 'String/yard long bean, pod' },
    { ...FRESH_VEG, filipino: 'Kalabasa, bunga', name: 'Squash, fruit' },
    { ...FRESH_VEG, filipino: 'Kalabasa, dahon', name: 'Squash, leaves' },
    { ...FRESH_VEG, filipino: 'Carrot', name: 'Carrot' },
    { ...FRESH_VEG, filipino: 'Broccoli', name: 'Broccoli' },
    { ...FRESH_VEG, filipino: 'Kabuti, sariwa', name: 'Mushroom, fresh' },
    { ...FRESH_VEG, filipino: 'Sibuyas, ulo (Bombay, Tagalog)', name: 'Onion bulb (Bombay, Tagalog)' },
    { ...FRESH_VEG, filipino: 'Toge', name: 'Mung bean sprout' },
    { ...FRESH_VEG, filipino: 'Saluyot, dahon', name: 'Jute, leaves' },
    { ...FRESH_VEG, filipino: 'Langka, hilaw', name: 'Jackfruit, unripe' },
    { ...FRESH_VEG, filipino: 'Ampalaya, dahon', name: 'Bittermelon/gourd, leaves' },
    { ...FRESH_VEG, filipino: 'Sitsaro', name: 'Snow/Sugar pea, pod' },
    { category: 'Processed Vegetables', filipino: 'Mais, mura, de lata', name: 'Baby corn/young corn, canned', weight: 75, measure: '2 pcs (8 × 1.5 cm)' },
    { category: 'Processed Vegetables', filipino: 'Gisantes (de lata, frozen)', name: 'Green peas (canned, frozen)', weight: 25, measure: '1 Tbsp' },
    { category: 'Processed Vegetables', filipino: 'Mixed vegetables (carrot, peas and corn), frozen', name: 'Mixed vegetables (carrot, peas and corn), frozen', weight: 25, measure: '2 Tbsp' },
    { category: 'Processed Vegetables', filipino: 'Kabuti, de lata', name: 'Mushroom (whole, sliced), canned', weight: 110, measure: '¾ cup' },
    { category: 'Processed Vegetables', filipino: 'Kamatis, de lata', name: 'Tomato, canned', weight: 50, measure: '3 Tbsp' },
  ],

  // FEL pp. 24–27, Fruit exchange (10 g carbohydrate, 40 kcal). A selection.
  // weight is grams of edible portion; (AP) dimensions are of the whole fruit as purchased.
  fruit: [
    { category: 'Fresh Fruits', filipino: 'Saging, lakatan', name: 'Banana, lacatan', weight: 40, measure: '½ pc', dimension: '14 × 3.5 cm (AP)' },
    { category: 'Fresh Fruits', filipino: 'Saging, latundan', name: 'Banana, latundan', weight: 40, measure: '½ pc', dimension: '12.5 × 3 cm (AP)' },
    { category: 'Fresh Fruits', filipino: 'Saging, saba', name: 'Banana, saba', weight: 40, measure: '½ pc', dimension: '12 × 4.5 cm (AP)' },
    { category: 'Fresh Fruits', filipino: 'Mangga, kalabaw, hinog', name: 'Mango, Manila super, ripe', weight: 70, measure: '½ cup or 1 slice', dimension: '8 × 7 cm' },
    { category: 'Fresh Fruits', filipino: 'Pakwan', name: 'Watermelon', weight: 150, measure: '1 cup or 1 slice', dimension: '11.5 × 2.5 × 9 cm' },
    { category: 'Fresh Fruits', filipino: 'Papaya, hinog', name: 'Papaya, ripe', weight: 90, measure: '¾ cup or 1 slice', dimension: '16 × 4.5 × 2 cm' },
    { category: 'Fresh Fruits', filipino: 'Pinya', name: 'Pineapple', weight: 80, measure: '½ cup or 1 slice', dimension: '14.5 × 2.5 × 4.5 cm' },
    { category: 'Fresh Fruits', filipino: 'Mansanas, pula', name: 'Apple, red', weight: 75, measure: '1 pc', dimension: '6 cm diameter (AP)' },
    { category: 'Fresh Fruits', filipino: 'Orange, ponkan', name: 'Orange, ponkan', weight: 80, measure: '1 pc', dimension: '7 cm diameter (AP)' },
    { category: 'Fresh Fruits', filipino: 'Dalandan (Ladu/Szinkom)', name: 'Orange (Ladu/Szinkom)', weight: 155, measure: '3 pcs', dimension: '6 cm diameter each (AP)' },
    { category: 'Fresh Fruits', filipino: 'Bayabas, puti', name: 'Guava, white', weight: 80, measure: '3 pcs', dimension: '3.5 cm diameter each (AP)' },
    { category: 'Fresh Fruits', filipino: 'Lansones', name: 'Lanzon', weight: 80, measure: '5 pcs', dimension: '3 × 3 cm each (AP)' },
    { category: 'Fresh Fruits', filipino: 'Ubas', name: 'Grapes', weight: 55, measure: '5 pcs or 12 pcs', dimension: '2.5 cm, or 2 cm, diameter each' },
    { category: 'Fresh Juices', filipino: 'Niyog, tubig', name: 'Coconut water', volume: 240, measure: '1 cup' },
    { category: 'Processed Fruits', filipino: 'Raisins', name: 'Raisins', weight: 15, measure: '2 Tbsp' },
  ],

  // FEL p. 30, Milk exchange. The full list. One exchange has 12 g carbohydrate and
  // 8 g protein; fat is 10 g (whole), 5 g (low fat) or none (skim).
  // volume is mL; weight is grams (powders).
  milkWhole: [
    { filipino: 'Gatas, kalabaw', name: 'Milk, carabao', volume: 200, measure: '¾ cup', note: 'Equivalent to 1 cup cow\'s milk plus 2 exchanges of fat' },
    { filipino: 'Gatas, baka', name: 'Milk, cow', volume: 250, measure: '1 cup' },
    { filipino: 'Gatas, evaporada', name: 'Milk, evaporated', volume: 125, measure: '½ cup' },
    { filipino: 'Gatas, evaporada, filled', name: 'Milk, evaporated, filled', volume: 125, measure: '½ cup' },
    { filipino: 'Gatas, kambing', name: 'Milk, goat', volume: 250, measure: '1 cup' },
    { filipino: 'Gatas, recombined', name: 'Milk, recombined', volume: 200, measure: '¾ cup' },
    { filipino: 'Gatas, pulbos, filled, instant', name: 'Milk, powder, filled, instant', weight: 35, measure: '5 Tbsp, level' },
    { filipino: 'Gatas, pulbos, full cream', name: 'Milk, powder, full cream', weight: 35, measure: '5 Tbsp, level' },
  ],

  milk: [
    { filipino: 'Gatas, low fat', name: 'Milk, low fat', volume: 250, measure: '1 cup' },
    { filipino: 'Yogurt', name: 'Yogurt', volume: 150, measure: '½ cup' },
  ],

  milkSkim: [
    { filipino: 'Buttermilk', name: 'Buttermilk', volume: 180, measure: '¾ cup' },
    { filipino: 'Gatas, skim', name: 'Milk, skim', volume: 250, measure: '1 cup' },
    { filipino: 'Gatas, pulbos, skim', name: 'Milk, powder, skim', weight: 25, measure: '4 Tbsp, level' },
    { filipino: 'Gatas, pulbos, non-fat, instant', name: 'Milk, powder, non-fat, instant', weight: 25, measure: '4 Tbsp, level' },
    { filipino: 'Yogurt, plain, skim', name: 'Yogurt, plain, skim', volume: 150, measure: '½ cup' },
  ],

  // FEL pp. 54–55, Sugar exchange (5 g carbohydrate, 20 kcal). A selection.
  sugar: [
    { filipino: 'Asukal (muscovado, pula, puti)', name: 'Sugar (muscovado, brown, white)', weight: 5, measure: '1 tsp' },
    { filipino: 'Arnibal', name: 'Syrup', weight: 5, measure: '1 tsp' },
    { filipino: 'Pulot-pukyutan', name: 'Honey', weight: 5, measure: '1 tsp' },
    { filipino: 'Jam at jellies', name: 'Jam and jellies', weight: 10, measure: '2 tsp' },
    { filipino: 'Gatas, sweetened, kondensada, filled', name: 'Milk, sweetened, condensed, filled', weight: 5, measure: '1 tsp' },
    { filipino: 'Pasas', name: 'Raisins', weight: 5, measure: '1 tsp' },
    { filipino: 'Candy (caramel, hard, toffee)', name: 'Candy (caramel, hard, toffee)', weight: 5, measure: '1 pc' },
    { filipino: 'Chocolate', name: 'Chocolate', weight: 5, measure: '2 pcs' },
    { filipino: 'Marshmallow', name: 'Marshmallow', weight: 5, measure: '3 pcs (2 cm diameter each)' },
    { filipino: 'Banana chips', name: 'Banana chips', weight: 5, measure: '2 pc' },
    { filipino: 'Dried mango', name: 'Dried mango', weight: 5, measure: '1 pc (6 × 2.5 × 0.1 cm)' },
    { filipino: 'Leche flan', name: 'Crème custard', weight: 10, measure: '1 slice (3.5 × 2 × 1.5 cm)' },
  ],

  // FEL p. 33, Rice A: Low Protein (23 g carbohydrate, zero or negligible protein). The full list.
  // Transcribed from the book; weight is grams of edible portion.
  riceA: [
    { category: 'Rice and Rice Products', filipino: 'Kanin, "protein-reduced"', name: 'Rice, "protein-reduced"', weight: 55, measure: '⅓ cup' },
    { category: 'Rice and Rice Products', filipino: 'Ampaw, pinipig', name: 'Ampaw, pinipig', weight: 25, measure: '2 pcs', dimension: '7 × 4 × 1.5 cm each' },
    { category: 'Rice and Rice Products', filipino: 'Biko', name: 'Rice cake (glutinous), biko', weight: 40, measure: '1 slice', dimension: '5 × 3.5 × 2 cm' },
    { category: 'Rice and Rice Products', filipino: 'Cuchinta', name: 'Rice cake, cuchinta', weight: 60, measure: '2 pcs (5 cm) or 6 pcs (3 cm)', dimension: '5 or 3 cm diameter × 1.5 cm each' },
    { category: 'Rice and Rice Products', filipino: 'Sapin-sapin', name: 'Rice prep (glutinous), sapin-sapin', weight: 75, measure: '1 slice', dimension: '7 × 4 × 2 cm' },
    { category: 'Corn and Corn Products', filipino: 'Cornstarch', name: 'Cornstarch', weight: 25, measure: '¼ cup' },
    { category: 'Corn and Corn Products', filipino: 'Maja blanca', name: 'Corn pudding, maja blanca', weight: 65, measure: '½ slice', dimension: '4.5 × 4 × 3.5 cm' },
    { category: 'Corn and Corn Products', filipino: 'Maja mais', name: 'Corn pudding, maja mais, yellow', weight: 75, measure: '1 slice', dimension: '6 × 4 × 2.5 cm' },
    { category: 'Noodles and Pasta', filipino: 'Bihon', name: 'Noodles, rice', weight: 100, measure: '1 cup' },
    { category: 'Noodles and Pasta', filipino: 'Misua', name: 'Noodles, wheat, thin', weight: 100, measure: '1 cup' },
    { category: 'Noodles and Pasta', filipino: 'Sotanghon', name: 'Noodles, mungbean starch', weight: 100, measure: '1 cup' },
    { category: 'Noodles and Pasta', filipino: 'Sweet potato noodles', name: 'Noodles, sweet potato', weight: 100, measure: '1 cup' },
    { category: 'Rootcrops and Products', filipino: 'Gabi', name: 'Taro', weight: 100, measure: '¾ cup, cubed' },
    { category: 'Rootcrops and Products', filipino: 'Kamote (dilaw, murado, puti)', name: 'Sweet potato (yellow, purple, white)', weight: 85, measure: '1 pc or ¾ cup, cubed', dimension: '4 cm diameter × 9 cm long' },
    { category: 'Rootcrops and Products', filipino: 'Kamoteng kahoy/balinghoy', name: 'Cassava', weight: 85, measure: '1 slice or ¾ cup, cubed', dimension: '6 × 5 cm' },
    { category: 'Rootcrops and Products', filipino: 'Kamoteng kahoy, bibingka', name: 'Cassava cake, bibingka', weight: 55, measure: '1 slice', dimension: '3.5 × 4.5 × 3.5 cm' },
    { category: 'Rootcrops and Products', filipino: 'Kamoteng kahoy, linupak', name: 'Cassava, mashed, w/sugar and margarine', weight: 55, measure: '1 pc', dimension: '7 × 3 × 3.5 cm' },
    { category: 'Rootcrops and Products', filipino: 'Kamoteng kahoy, pichi-pichi', name: 'Cassava, pichi-pichi', weight: 45, measure: '1 pc', dimension: '5 cm diameter' },
    { category: 'Rootcrops and Products', filipino: 'Kamoteng kahoy, suman', name: 'Cassava, suman', weight: 45, measure: '1 pc', dimension: '8.5 × 3 × 2 cm' },
    { category: 'Rootcrops and Products', filipino: 'Tugi', name: 'Yam, spiny', weight: 150, measure: '1 pc or 1¼ cups, cubed', dimension: '11.5 × 4.5 cm' },
    { category: 'Rootcrops and Products', filipino: 'Ubi', name: 'Yam, purple', weight: 130, measure: '1 cup, cubed' },
    { category: 'Others', filipino: 'Saging, saba, nilaga', name: 'Banana, saba, boiled', weight: 65, measure: '1 pc', dimension: '9.5 × 3.5 × 3.5 cm' },
    { category: 'Others', filipino: 'Sago, nilaga', name: 'Palm starch ball, boiled', weight: 120, measure: '½ cup' },
    { category: 'Others', filipino: 'Sago, tapioca', name: 'Tapioca pearls', weight: 160, measure: '¾ cup' },
  ],

  // FEL pp. 34–36, Rice B: Medium Protein (23 g carbohydrate, 2 g protein). A selection.
  riceB: [
    { category: 'Rice and rice products', filipino: 'Bigas, maputi, sinaing', name: 'Rice, well-milled, boiled', weight: 80, measure: '½ cup' },
    { category: 'Rice and rice products', filipino: 'Pinawa, sinaing', name: 'Rice (undermilled/brown rice), boiled', weight: 80, measure: '½ cup' },
    { category: 'Rice and rice products', filipino: 'Lugaw', name: 'Rice gruel, thick consistency', weight: 250, measure: '1½ cups' },
    { category: 'Rice and rice products', filipino: 'Bibingka, galapong', name: 'Rice cake, bibingka', weight: 45, measure: '½ slice', dimension: '7 cm diameter × 3 cm' },
    { category: 'Rice and rice products', filipino: 'Palitaw, walang niyog', name: 'Rice prep (glutinous), palitaw', weight: 50, measure: '3 pcs', dimension: '6.5 × 3.5 × 0.5 cm each' },
    { category: 'Rice and rice products', filipino: 'Puto, puti/Puto, Calasiao', name: 'Rice cake, puto white', weight: 50, measure: '1 slice or 3–4 pcs', dimension: '4.5 × 3.5 × 5.5 cm, or 4 cm diameter × 2 cm each' },
    { category: 'Rice and rice products', filipino: 'Suman sa ibos', name: 'Rice prep (glutinous), ibos', weight: 60, measure: '1 pc', dimension: '11 × 2.5 × 2.5 cm' },
    { category: 'Bakery Products', filipino: 'Marie', name: 'Cookies, marie', weight: 25, measure: '8 pcs', dimension: '6 cm diameter × 0.5 cm each' },
    { category: 'Bakery Products', filipino: 'Sponge cake', name: 'Cake, sponge', weight: 35, measure: '1 slice', dimension: '7.5 × 4 × 4 cm' },
    { category: 'Corn and corn products', filipino: 'Corn flakes', name: 'Corn flakes', weight: 25, measure: '½ cup' },
    { category: 'Corn and corn products', filipino: 'Mais butil, de lata', name: 'Corn, whole kernel, canned', weight: 160, measure: '1 cup' },
    { category: 'Corn and corn products', filipino: 'Mais sa busal (dilaw, puti)', name: 'Corn on cob (yellow, white)', weight: 65, measure: '½ pc', dimension: '12.5 × 4 cm (AP)' },
    { category: 'Rootcrop', filipino: 'Patatas', name: 'Potato', weight: 170, measure: '1 pc or 1¼ cup, cubed', dimension: '6 cm diameter × 8 cm' },
  ],

  // FEL p. 37, Rice C: High Protein (23 g carbohydrate, 4 g protein). A selection.
  riceC: [
    { category: 'Bakery products', filipino: 'Pan de sal', name: 'Bread, pan de sal', weight: 35, measure: '1½ pcs', dimension: '7 × 6 × 3.5 cm' },
    { category: 'Bakery products', filipino: 'Loaf bread/Pan Amerikano', name: 'Bread, white, loaf', weight: 35, measure: '2 pcs or 1½ pcs', dimension: '7.5 × 6.5 × 1.5 cm each, or 10 × 9.5 × 1.5 cm' },
    { category: 'Bakery products', filipino: 'Bread, wheat', name: 'Bread, wheat', weight: 40, measure: '1½ pcs', dimension: '10 × 9.5 × 1.5 cm' },
    { category: 'Bakery products', filipino: 'Ensaymada', name: 'Bread, sweet roll', weight: 35, measure: '1 pc or ½ pc', dimension: '6.5 cm diameter × 4 cm, or 11.5 cm diameter × 3.5 cm' },
    { category: 'Bakery products', filipino: 'Hamburger bun', name: 'Bread, hamburger bun', weight: 35, measure: '1 pc', dimension: '13 × 5.5 × 3 cm' },
    { category: 'Bakery products', filipino: 'Hotdog roll', name: 'Bread, hotdog roll', weight: 35, measure: '1 pc', dimension: '8 cm diameter × 4.5 cm' },
    { category: 'Bakery products', filipino: 'Pan de monay', name: 'Bread, pan de monay', weight: 35, measure: '½ pc', dimension: '8.5 × 8 × 6.5 cm' },
    { category: 'Bakery products', filipino: 'Tinapay, tostado', name: 'Bread, toast/toasted', weight: 30, measure: '5 pcs or 1½ pc', dimension: '4.5 × 3.5 × 1 cm each, or 9 × 9 × 1 cm' },
    { category: 'Noodles and Pasta', filipino: 'Pasta (enriched/unenriched)', name: 'Pasta (enriched/unenriched)', weight: 70, measure: '½ cup' },
    { category: 'Others', filipino: 'Balat ng lumpia', name: 'Spring roll wrapper, plain', weight: 35, measure: '7 pcs', dimension: '16.5 cm diameter each' },
  ],

  // FEL pp. 40–47, Meat exchanges (8 g protein). A selection. Weights are cooked edible portion.
  // The book lists cuts under an animal heading ("Beef: Laman – Lean meat"); here the
  // animal is written into the name, and "mbs" is spelled out as matchbox size.
  // Low fat: 1 g fat, 41 kcal.
  meatLow: [
    { category: 'Fish', filipino: 'Bangus', name: 'Milkfish', weight: 35, measure: '1 slice', dimension: '4.5 × 6 × 1.5 cm' },
    { category: 'Fish', filipino: 'Galunggong', name: 'Scad, round', weight: 35, measure: '1 pc', dimension: '13 × 3 cm' },
    { category: 'Fish', filipino: 'Tilapia', name: 'Tilapia', weight: 35, measure: '½ slice', dimension: '15.5 × 6 cm' },
    { category: 'Fish', filipino: 'Tulingan', name: 'Tuna, frigate/bullet', weight: 35, measure: '½ slice', dimension: '9 × 6 × 1.5 cm' },
    { category: 'Fish', filipino: 'Dilis, buo', name: 'Anchovy, long-jawed, whole', weight: 35, measure: '⅓ cup' },
    { category: 'Lean Meat', filipino: 'Baka, laman', name: 'Beef, lean meat', weight: 35, measure: '1 slice, matchbox size', dimension: '5 × 3.5 × 2 cm' },
    { category: 'Lean Meat', filipino: 'Baboy, lomo', name: 'Pork, tenderloin', weight: 35, measure: '1 slice, matchbox size', dimension: '5 × 3.5 × 2 cm' },
    { category: 'Lean Meat', filipino: 'Manok, pitso', name: 'Chicken, breast', weight: 30, measure: '1 slice', dimension: '5 × 3 × 1.5 cm' },
    { category: 'Variety meats/Internal organs', filipino: 'Atay', name: 'Liver (pork, beef, carabeef, chicken)', weight: 30, measure: '¼ cup or 1 pc' },
    { category: 'Other Seafoods', filipino: 'Pusit', name: 'Squid', weight: 50, measure: '2 pcs', dimension: '11 × 3 cm each' },
    { category: 'Other Seafoods', filipino: 'Hipon, suwahe', name: 'Shrimp, greasy back', weight: 40, measure: '4 pcs', dimension: '16 cm each (AP)' },
    { category: 'Other Seafoods', filipino: 'Alimasag, laman', name: 'Crab, blue swimming, meat', weight: 40, measure: '⅓ cup or 1 pc', dimension: '9 × 5 cm' },
    { category: 'Processed Foods', filipino: 'Tuna flakes, in brine', name: 'Tuna flakes, in brine', weight: 45, measure: '¼ cup' },
    { category: 'Processed Foods', filipino: 'Tamban, tuyo', name: 'Sardine, Indian, dried', weight: 20, measure: '2 pcs', dimension: '10.5 × 3 cm each' },
    { category: 'Processed Foods', filipino: 'Galunggong, tinapa', name: 'Scad, round, smoked', weight: 25, measure: '½ pc', dimension: '15.5 × 3.5 cm' },
  ],

  // Medium fat: 6 g fat, 86 kcal.
  meatMed: [
    { category: 'Chicken', filipino: 'Manok, binti', name: 'Chicken, leg/drumstick', weight: 35, measure: '1 pc', dimension: '11 × 4 cm' },
    { category: 'Chicken', filipino: 'Manok, hita', name: 'Chicken, thigh', weight: 35, measure: '1 pc', dimension: '11.5 × 4 cm' },
    { category: 'Chicken', filipino: 'Manok, pakpak', name: 'Chicken, wing', weight: 35, measure: '1 pc' },
    { category: 'Egg', filipino: 'Itlog ng manok, buo', name: 'Egg, chicken, whole', weight: 55, measure: '1 pc medium', dimension: '4.5 cm diameter × 5.5 cm' },
    { category: 'Egg', filipino: 'Itlog ng pugo', name: 'Egg, quail', weight: 55, measure: '7 pcs small' },
    { category: 'Beef and Pork', filipino: 'Baka, paypay, laman', name: 'Beef, chuck, lean', weight: 35, measure: '1 slice, matchbox size', dimension: '5 × 3.5 × 2 cm' },
    { category: 'Beef and Pork', filipino: 'Baboy, pata', name: 'Pork, leg', weight: 35, measure: '1 slice, matchbox size', dimension: '5 × 3.5 × 2 cm' },
    { category: 'Processed Foods', filipino: 'Cheddar, pasteurized, processed', name: 'Cheese, cheddar, pasteurized, processed', weight: 30, measure: '1 slice', dimension: '5.5 × 2.5 × 2 cm' },
    { category: 'Processed Foods', filipino: 'Bangus, tinapa', name: 'Milkfish, smoked', weight: 30, measure: '1 slice' },
    { category: 'Processed Foods', filipino: 'Sardinas sa tomato sauce', name: 'Sardines, in tomato sauce', weight: 80, measure: '2 pcs', dimension: '5.5 × 3.5 cm each' },
    { category: 'Processed Foods', filipino: 'Karne norte, de lata', name: 'Corned beef, canned', weight: 45, measure: '¼ cup' },
    { category: 'Processed Foods', filipino: 'Sausage, ham', name: 'Sausage, ham', weight: 55, measure: '2 pcs', dimension: '9 × 0.3 cm each' },
    { category: 'Processed Foods', filipino: 'Tofu', name: 'Soy bean curd, tofu', weight: 100, measure: '½ cup', dimension: '8.5 × 3.5 × 3 cm' },
    { category: 'Processed Foods', filipino: 'Tokwa', name: 'Soy bean curd, tokwa', weight: 70, measure: '1 pc', dimension: '5 × 5.5 × 2 cm' },
  ],

  // High fat: 10 g fat, 122 kcal.
  meatHigh: [
    { category: 'Pork and Beef', filipino: 'Baboy, liempo, malaman', name: 'Pork, belly, less fat', weight: 35, measure: '1 slice', dimension: '6.5 × 3.5 × 1 cm' },
    { category: 'Pork and Beef', filipino: 'Baboy, kasim', name: 'Pork, picnic', weight: 35, measure: '1 slice, matchbox size', dimension: '5 × 3.5 × 2 cm' },
    { category: 'Pork and Beef', filipino: 'Baboy, tadyang', name: 'Pork, spare rib', weight: 35, measure: '1 slice', dimension: '3.5 × 3.5 × 3 cm' },
    { category: 'Pork and Beef', filipino: 'Baka, tadyang', name: 'Beef, plate', weight: 35, measure: '1 slice, matchbox size', dimension: '5 × 3.5 × 2 cm' },
    { category: 'Egg', filipino: 'Balut', name: 'Egg, duck, fertilized', weight: 65, measure: '1 pc', dimension: '5.5 × 4.5 cm' },
    { category: 'Egg', filipino: 'Itlog ng pato, buo', name: 'Egg, duck, whole', weight: 65, measure: '1 pc', dimension: '5.5 × 4.5 cm' },
    { category: 'Nuts/Bean', filipino: 'Mani, may balok, binusa', name: 'Peanut w/ skin, roasted', weight: 20, measure: '2 Tbsp' },
    { category: 'Processed Foods', filipino: 'Keso de bola', name: 'Cheese, Edam', weight: 35, measure: '1 slice', dimension: '3 × 6 × 2.5 cm' },
    { category: 'Processed Foods', filipino: 'Sardinas, Spanish style', name: 'Sardines, in spiced oil', weight: 30, measure: '3 pcs', dimension: '5.5 × 2 × 1.5 cm each' },
    { category: 'Processed Foods', filipino: 'Tuna flakes in vegetable oil', name: 'Tuna flakes in vegetable oil', weight: 45, measure: '¼ cup' },
    { category: 'Processed Foods', filipino: 'Longanisa, chorizo', name: 'Sausage, chorizo', weight: 30, measure: '1 pc', dimension: '2 cm diameter × 8 cm' },
    { category: 'Processed Foods', filipino: 'Sausage, frankfurter', name: 'Sausage, frankfurter', weight: 60, measure: '1½ pc', dimension: '2 cm diameter × 11 cm' },
  ],

  // FEL pp. 50–51, Fat exchange (5 g fat, 45 kcal). A selection.
  fat: [
    { category: 'Monounsaturated Fats', filipino: 'Avocado', name: 'Avocado', weight: 65, measure: '12.5 × 6.5 × 2 cm' },
    { category: 'Monounsaturated Fats', filipino: 'Mantika/Langis (olive, peanut)', name: 'Oil (olive, peanut)', weight: 5, measure: '1 tsp' },
    { category: 'Monounsaturated Fats', filipino: 'Kasuy, binusa', name: 'Cashew nut, roasted', weight: 9, measure: '6 pcs, whole' },
    { category: 'Monounsaturated Fats', filipino: 'Mixed nuts', name: 'Mixed nuts', weight: 7, measure: '1 Tbsp' },
    { category: 'Monounsaturated Fats', filipino: 'Peanut butter', name: 'Peanut butter', weight: 10, measure: '½ Tbsp' },
    { category: 'Polyunsaturated Fats', filipino: 'Mantika/Langis (canola, corn, flaxseed, sesame, soybean, sunflower)', name: 'Oil (canola, corn, flaxseed, sesame, soybean, sunflower)', weight: 5, measure: '1 tsp' },
    { category: 'Saturated Fats', filipino: 'Mantika/Langis, niyog', name: 'Oil, coconut', weight: 5, measure: '1 tsp' },
    { category: 'Saturated Fats', filipino: 'Mantekilya', name: 'Butter', weight: 5, measure: '1 tsp' },
    { category: 'Saturated Fats', filipino: 'Margarine', name: 'Margarine', weight: 5, measure: '1 tsp' },
    { category: 'Saturated Fats', filipino: 'Mayonnaise', name: 'Mayonnaise', weight: 5, measure: '1 tsp' },
    { category: 'Saturated Fats', filipino: 'Niyog, kakang gata', name: 'Coconut cream', weight: 15, measure: '1 Tbsp' },
    { category: 'Saturated Fats', filipino: 'Cream, all purpose', name: 'Cream, all purpose', weight: 15, measure: '1 Tbsp' },
    { category: 'Saturated Fats', filipino: 'Bacon', name: 'Bacon', weight: 10, measure: '1 strip' },
    { category: 'Saturated Fats', filipino: 'Sitsaron baboy/Sitsarong balat', name: 'Pork crackling, skin', weight: 10, measure: '5 pcs (2 × 2 cm)' },
  ],
};

// ======================
// LABELS & KEYS
// ======================
export const GROUP_LABELS = {
  veg: 'Vegetable',
  fruit: 'Fruit',
  milkWhole: 'Whole Milk',
  milk: 'Low-Fat Milk',
  milkSkim: 'Skim / Fat-Free Milk',
  sugar: 'Sugar',
  riceA: 'Rice A (Low Protein)',
  riceB: 'Rice B (Medium Protein)',
  riceC: 'Rice C (High Protein)',
  meatLow: 'Low-Fat Meat',
  meatMed: 'Medium-Fat Meat',
  meatHigh: 'High-Fat Meat',
  fat: 'Fat',
};

export const GROUP_KEYS = Object.keys(GROUP_LABELS);

export const MEAL_PERIODS = [
  { key: 'breakfast', label: 'Breakfast' },
  { key: 'amSnack', label: 'AM Snack' },
  { key: 'lunch', label: 'Lunch' },
  { key: 'pmSnack', label: 'PM Snack' },
  { key: 'supper', label: 'Supper' },
];

// ======================
// DEFAULTS
// ======================
// Length caps for typed foods (inputs, saved bank, restored sessions).
export const FOOD_NAME_MAX = 80;
export const FOOD_MEASURE_MAX = 40;

// Food used by "+ Add" and "Generate Plan", by English name: the book's sample
// menu choice (Table 1.7) where it has one. Groups not listed use their first food.
export const DEFAULT_FOOD = {
  veg: 'Horseradish tree, leaves',
  fruit: 'Banana, lacatan',
  riceA: 'Sweet potato (yellow, purple, white)',
  milkWhole: 'Milk, powder, full cream',
  milkSkim: 'Milk, skim',
  sugar: 'Sugar (muscovado, brown, white)',
  riceB: 'Rice, well-milled, boiled',
  riceC: 'Bread, pan de sal',
  meatLow: 'Milkfish',
  meatMed: 'Chicken, leg/drumstick',
  meatHigh: 'Pork, belly, less fat',
  fat: 'Oil, coconut',
};

// "Gabi (Taro)"; a single name when Filipino and English are the same. Names that
// already contain brackets are joined with a dash instead of nesting them.
export const foodLabel = ({ filipino, name }) => {
  if (!filipino || filipino === name) return name;
  return /[()]/.test(filipino + name) ? `${filipino} – ${name}` : `${filipino} (${name})`;
};

/** The name and measure a row starts with for a group. */
export function defaultFood(group) {
  const foods = FOOD_ITEMS[group] || [];
  const food = foods.find((f) => f.name === DEFAULT_FOOD[group]) || foods[0];
  return food ? { name: foodLabel(food), measure: food.measure } : { name: '', measure: '' };
}

/** 0.5 -> "½", 1.5 -> "1½", 2 -> "2" */
export const fmtExchanges = (n) => {
  const whole = Math.floor(n);
  return n === whole ? String(whole) : `${whole || ''}½`;
};

// ======================
// HELPERS
// ======================
// Seeded from the clock so ids stay unique next to rows restored after a reload.
let _idCounter = Date.now();

// Single source of row ids, so generated and hand-added rows never collide.
export const nextRowId = () => _idCounter++;

function snapToInt(n) {
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.round(n);
}

/** Turn 5 into [1, 1, 1, 1, 1] */
function splitExchangeCount(total) {
  const t = snapToInt(total);
  if (t <= 0) return [];
  return Array.from({ length: t }, () => 1);
}

/**
 * Distribute an array of parts across `slots` buckets as evenly as possible.
 * Returns array of arrays, length === slots.
 */
function distributeParts(parts, slots) {
  const buckets = Array.from({ length: slots }, () => []);
  if (!parts.length || slots <= 0) return buckets;
  parts.forEach((part, i) => {
    buckets[i % slots].push(part);
  });
  return buckets;
}

// A row carries its own food name and measure, so lists can grow or be
// reordered without breaking saved plans, and typed foods need no lookup.
export function createRow(group, n = 1) {
  return {
    id: nextRowId(),
    group,
    n: snapToInt(n) || 1,
    ...defaultFood(group),
    custom: false,
  };
}

// ======================
// GENERATE MEAL PLAN
// ======================
export function generateMealPlan(exchanges = {}) {
  const e = exchanges;

  const breakfast = [];
  const amSnack = [];
  const lunch = [];
  const pmSnack = [];
  const supper = [];

  // --- Vegetable → breakfast, lunch, supper ---
  {
    const parts = splitExchangeCount(e.veg || 0);
    const [vB, vL, vS] = distributeParts(parts, 3);
    vB.forEach((n) => breakfast.push(createRow('veg', n)));
    vL.forEach((n) => lunch.push(createRow('veg', n)));
    vS.forEach((n) => supper.push(createRow('veg', n)));
  }

  // --- Fruit → all 5 meals ---
  {
    const parts = splitExchangeCount(e.fruit || 0);
    const [fB, fAm, fL, fPm, fS] = distributeParts(parts, 5);
    fB.forEach((n) => breakfast.push(createRow('fruit', n)));
    fAm.forEach((n) => amSnack.push(createRow('fruit', n)));
    fL.forEach((n) => lunch.push(createRow('fruit', n)));
    fPm.forEach((n) => pmSnack.push(createRow('fruit', n)));
    fS.forEach((n) => supper.push(createRow('fruit', n)));
  }

  // --- Milk (prefer breakfast → amSnack → pmSnack → lunch for leftovers) ---
  ['milkWhole', 'milk', 'milkSkim'].forEach((key) => {
    const parts = splitExchangeCount(e[key] || 0);
    if (parts.length === 0) return;
    if (parts.length === 1) {
      breakfast.push(createRow(key, parts[0]));
    } else if (parts.length === 2) {
      breakfast.push(createRow(key, parts[0]));
      amSnack.push(createRow(key, parts[1]));
    } else if (parts.length === 3) {
      breakfast.push(createRow(key, parts[0]));
      amSnack.push(createRow(key, parts[1]));
      pmSnack.push(createRow(key, parts[2]));
    } else {
      breakfast.push(createRow(key, parts[0]));
      amSnack.push(createRow(key, parts[1]));
      pmSnack.push(createRow(key, parts[2]));
      for (let i = 3; i < parts.length; i++) {
        lunch.push(createRow(key, parts[i]));
      }
    }
  });

  // --- Sugar (prefer breakfast → amSnack → pmSnack → lunch) ---
  {
    const parts = splitExchangeCount(e.sugar || 0);
    if (parts.length === 1) {
      breakfast.push(createRow('sugar', parts[0]));
    } else if (parts.length === 2) {
      breakfast.push(createRow('sugar', parts[0]));
      amSnack.push(createRow('sugar', parts[1]));
    } else if (parts.length === 3) {
      breakfast.push(createRow('sugar', parts[0]));
      amSnack.push(createRow('sugar', parts[1]));
      pmSnack.push(createRow('sugar', parts[2]));
    } else {
      for (let i = 0; i < parts.length; i++) {
        if (i === 0) breakfast.push(createRow('sugar', parts[i]));
        else if (i === 1) amSnack.push(createRow('sugar', parts[i]));
        else if (i === 2) pmSnack.push(createRow('sugar', parts[i]));
        else lunch.push(createRow('sugar', parts[i]));
      }
    }
  }

  // --- Rice A → pmSnack + breakfast ---
  {
    const parts = splitExchangeCount(e.riceA || 0);
    const [rPm, rB] = distributeParts(parts, 2);
    rPm.forEach((n) => pmSnack.push(createRow('riceA', n)));
    rB.forEach((n) => breakfast.push(createRow('riceA', n)));
  }

  // --- Rice B → breakfast, amSnack, lunch, supper ---
  {
    const parts = splitExchangeCount(e.riceB || 0);
    const [rB, rAm, rL, rS] = distributeParts(parts, 4);
    rB.forEach((n) => breakfast.push(createRow('riceB', n)));
    rAm.forEach((n) => amSnack.push(createRow('riceB', n)));
    rL.forEach((n) => lunch.push(createRow('riceB', n)));
    rS.forEach((n) => supper.push(createRow('riceB', n)));
  }

  // --- Rice C → breakfast ---
  {
    const parts = splitExchangeCount(e.riceC || 0);
    parts.forEach((n) => breakfast.push(createRow('riceC', n)));
  }

  // --- Low-Fat Meat → lunch, supper ---
  {
    const parts = splitExchangeCount(e.meatLow || 0);
    const [mL, mS] = distributeParts(parts, 2);
    mL.forEach((n) => lunch.push(createRow('meatLow', n)));
    mS.forEach((n) => supper.push(createRow('meatLow', n)));
  }

  // --- Medium-Fat Meat → breakfast, lunch, supper ---
  {
    const parts = splitExchangeCount(e.meatMed || 0);
    const [mB, mL, mS] = distributeParts(parts, 3);
    mB.forEach((n) => breakfast.push(createRow('meatMed', n)));
    mL.forEach((n) => lunch.push(createRow('meatMed', n)));
    mS.forEach((n) => supper.push(createRow('meatMed', n)));
  }

  // --- High-Fat Meat → lunch ---
  {
    const parts = splitExchangeCount(e.meatHigh || 0);
    parts.forEach((n) => lunch.push(createRow('meatHigh', n)));
  }

  // --- Fat → breakfast, lunch, supper ---
  {
    const parts = splitExchangeCount(e.fat || 0);
    const [fB, fL, fS] = distributeParts(parts, 3);
    fB.forEach((n) => breakfast.push(createRow('fat', n)));
    fL.forEach((n) => lunch.push(createRow('fat', n)));
    fS.forEach((n) => supper.push(createRow('fat', n)));
  }

  return {
    breakfast,
    amSnack,
    lunch,
    pmSnack,
    supper,
  };
}

// Optional: empty starting plan
export const EMPTY_MEAL_PLAN = {
  breakfast: [],
  amSnack: [],
  lunch: [],
  pmSnack: [],
  supper: [],
};