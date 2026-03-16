require('dotenv').config();
const mongoose = require('mongoose');
const Claim = require('./models/Claim');

const cities = [
  'ירושלים', 'תל אביב-יפו', 'חיפה', 'ראשון לציון', 'פתח תקווה',
  'אשדוד', 'נתניה', 'באר שבע', 'חולון', 'בני ברק',
  'רמת גן', 'אשקלון', 'רחובות', 'בת ים', 'הרצליה',
  'כפר סבא', 'חדרה', 'לוד', 'רעננה', 'עכו',
  'נהריה', 'כרמיאל', 'שדרות', 'נתיבות', 'אופקים',
  'קריית שמונה', 'עפולה', 'קריית גת', 'יבנה', 'בית שמש'
];

const streets = [
  'הרצל', 'בן גוריון', 'ז\'בוטינסקי', 'רוטשילד', 'ויצמן',
  'אלנבי', 'דיזנגוף', 'בגין', 'רבין', 'סוקולוב',
  'ביאליק', 'אחד העם', 'הנשיא', 'הפלמ"ח', 'גולדה מאיר',
  'שד\' ירושלים', 'העצמאות', 'הבנים', 'השלום', 'התקווה'
];

const firstNames = [
  'יוסי', 'דוד', 'משה', 'אברהם', 'יעקב', 'חיים', 'שלמה', 'אלי', 'רון', 'גיל',
  'שרה', 'רחל', 'לאה', 'מרים', 'חנה', 'דנה', 'נועה', 'מיכל', 'ענת', 'אורית',
  'עומר', 'נועם', 'איתי', 'יונתן', 'אריאל', 'תמר', 'שירה', 'יעל', 'הילה', 'ליאור'
];

const lastNames = [
  'כהן', 'לוי', 'מזרחי', 'פרץ', 'ביטון', 'דהן', 'אברהם', 'פרידמן', 'שרון', 'גולן',
  'אזולאי', 'חדד', 'נחום', 'גבאי', 'מלכה', 'עמר', 'יוסף', 'בן דוד', 'שמעון', 'אוחיון',
  'רוזנברג', 'גרינברג', 'שפירא', 'ברקוביץ', 'גולדשטיין', 'קפלן', 'אלון', 'בר', 'זוהר', 'טל'
];

const carMakes = ['טויוטה', 'יונדאי', 'קיה', 'מאזדה', 'סקודה', 'פולקסווגן', 'ניסאן', 'הונדה', 'סובארו', 'ב.מ.וו', 'מרצדס', 'רנו', 'סוזוקי', 'שברולט', 'מיצובישי'];
const insuranceCompanies = ['הראל', 'כלל ביטוח', 'מגדל', 'מנורה מבטחים', 'הפניקס', 'ביטוח ישיר', 'AIG', 'שירביט', 'הכשרה'];
const businessTypes = ['מסעדה / בית קפה', 'סופרמרקט / מכולת', 'חנות בגדים', 'חנות מוצרי חשמל', 'מספרה / סלון יופי', 'מוסך / שירותי רכב', 'בית מרקחת', 'משרד עורכי דין', 'קליניקה רפואית', 'מאפייה / קונדיטוריה', 'מכון כושר / סטודיו', 'גן ילדים / מעון'];
const medicalInstitutions = ['מרכז רפואי שיבא', 'מרכז רפואי רמב"ם', 'מרכז רפואי סורוקה', 'מרכז רפואי הדסה עין כרם', 'מרכז רפואי איכילוב', 'מרכז רפואי בילינסון', 'מרכז רפואי וולפסון', 'מרכז רפואי ברזילי', 'מרכז רפואי שערי צדק'];
const injuryTypes = ['שבר', 'כוויה', 'חתך / פצע פתוח', 'חבלת ראש', 'פגיעת הדף', 'פגיעה בגפיים', 'פגיעת שמיעה', 'פגיעה נפשית (PTSD)', 'שאיפת עשן / חומרים'];

const residentialDamage = [
  'נזק ישיר מפגיעת רקטה בקיר חיצוני ותקרה',
  'נזק מרסיסים לחלונות, תריסים ומרפסת',
  'סדקים בקירות ובתקרה כתוצאה מגל הדף',
  'הצפה כתוצאה מפגיעה בצנרת הבניין',
  'נזק למערכת החשמל והתקשורת של הדירה',
  'קריסה חלקית של קיר פנימי מגל הדף',
  'נזק לגג ולאיטום כתוצאה מרסיסים',
  'נזק לממ"ד - דלת ותריס פלדה',
  'פגיעה במבנה הבטון - סדקים מבניים',
  'נזק למעלית ולחדר מדרגות מגל הדף',
  'ריצוף שבור וקירות מתקלפים מזעזוע',
  'נזק לדוד שמש וצנרת על הגג',
];

const carDamage = [
  'שברי זכוכית מרסיסים - שמשה קדמית ואחורית',
  'מכות ושריטות בפח מרסיסים',
  'פגיעה ישירה בגג הרכב מרסיס',
  'נזק למנוע ולמערכת ההנעה מגל הדף',
  'פנצ\'ר מרובה מרסיסי מתכת בכביש',
  'שריפה חלקית כתוצאה מפגיעה סמוכה',
  'נזק לרכב מקריסת מבנה סמוך',
  'פגיעה במערכת האלקטרוניקה מגל הדף',
  'מראות וחיישנים שבורים מגל הדף',
  'נזק כבד - רכב הושמד כליל מפגיעה ישירה',
];

const businessDamage = [
  'נזק לחזית העסק, ויטרינות ודלתות',
  'נזק למלאי ולציוד מקצועי',
  'קריסת תקרה חלקית והצפה',
  'נזק למערכות מיזוג, חשמל ותקשורת',
  'שריפה חלקית כתוצאה מפגיעה סמוכה',
  'נזק לריהוט ולציוד משרדי מגל הדף',
  'ציוד מקצועי שנהרס מרסיסים',
  'נזק מבני - סדקים בקירות וברצפה',
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const padId = () => String(rand(200000000, 399999999));
const padPhone = () => '05' + rand(0, 8) + '-' + String(rand(1000000, 9999999));
const licensePlate = () => String(rand(100, 999)) + '-' + String(rand(10, 99)) + '-' + String(rand(100, 999));

function generateClaim(type) {
  const first = pick(firstNames);
  const last = pick(lastNames);
  const city = pick(cities);
  const street = pick(streets) + ' ' + rand(1, 120);
  const status = pick(['new', 'new', 'new', 'in_review', 'in_review', 'approved', 'approved', 'approved', 'rejected']);
  const daysAgo = rand(0, 180);
  const createdAt = new Date(Date.now() - daysAgo * 86400000);

  const base = {
    type,
    status,
    claimantName: first + ' ' + last,
    idNumber: padId(),
    phone: padPhone(),
    email: first.toLowerCase() + '.' + last.toLowerCase() + '@gmail.com',
    city,
    createdAt,
    updatedAt: createdAt,
    photos: [],
  };

  if (type === 'residential') {
    base.details = {
      city,
      street,
      damageDescription: pick(residentialDamage),
      estimatedCost: String(rand(5000, 350000)),
      roomsAffected: String(rand(1, 6)),
      damageDate: createdAt.toISOString().split('T')[0],
    };
  } else if (type === 'business') {
    const bTypes = ['מסעדת ' + first, 'חנות ' + last, last + ' ובניו', first + ' סחר', 'סטודיו ' + first];
    base.details = {
      businessName: pick(bTypes),
      businessId: String(rand(510000000, 559999999)),
      city,
      street,
      businessType: pick(businessTypes),
      damageDescription: pick(businessDamage),
      estimatedLoss: String(rand(10000, 800000)),
    };
  } else if (type === 'car') {
    base.details = {
      licensePlate: licensePlate(),
      carMake: pick(carMakes),
      carModel: 'אחר',
      carYear: String(rand(2012, 2026)),
      damageDescription: pick(carDamage),
      estimatedRepairCost: String(rand(2000, 120000)),
      insuranceCompany: pick(insuranceCompanies),
    };
  } else if (type === 'bodily_harm') {
    base.details = {
      injuryType: pick(injuryTypes),
      injuryDescription: 'נפגע/ת מ' + pick(injuryTypes).toLowerCase() + ' כתוצאה מאירוע ביטחוני באזור ' + city,
      hospitalized: pick(['כן', 'כן', 'לא']),
      medicalInstitution: pick(medicalInstitutions),
      treatmentCost: String(rand(5000, 200000)),
      daysUnableToWork: String(rand(3, 120)),
    };
  }

  return base;
}

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Clear existing
  await Claim.deleteMany({});
  console.log('Cleared existing claims');

  const total = 10000;
  // Distribution: ~40% residential, ~30% business, ~22% car, ~8% bodily harm
  const distribution = [
    { type: 'residential', count: 4000 },
    { type: 'business', count: 3000 },
    { type: 'car', count: 2200 },
    { type: 'bodily_harm', count: 800 },
  ];

  const batchSize = 1000;
  let inserted = 0;

  for (const { type, count } of distribution) {
    for (let i = 0; i < count; i += batchSize) {
      const batch = [];
      const end = Math.min(i + batchSize, count);
      for (let j = i; j < end; j++) {
        batch.push(generateClaim(type));
      }
      await Claim.insertMany(batch);
      inserted += batch.length;
      console.log(`Inserted ${inserted}/${total} (${type})`);
    }
  }

  console.log(`Done! Seeded ${total} claims.`);
  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
