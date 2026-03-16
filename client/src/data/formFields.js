import {
  carMakes, carModels, insuranceCompanies,
  medicalInstitutions, businessTypes, roomsOptions, injuryTypes
} from './hebrewOptions'

export const claimTypes = {
  residential: {
    label: 'מגורים',
    icon: '🏠',
    color: 'blue',
    fields: [
      { name: 'city', label: 'עיר', type: 'city', required: true },
      { name: 'street', label: 'רחוב', type: 'street', required: true, cityField: 'city' },
      { name: 'houseNumber', label: 'מספר בית', type: 'text', required: false },
      { name: 'damageDescription', label: 'תיאור הנזק', type: 'textarea', required: true },
      { name: 'estimatedCost', label: 'עלות משוערת (₪)', type: 'number', required: true },
      { name: 'roomsAffected', label: 'מספר חדרים שנפגעו', type: 'select', required: false, options: roomsOptions },
      { name: 'damageDate', label: 'תאריך הנזק', type: 'date', required: true },
    ]
  },
  business: {
    label: 'עסק',
    icon: '🏢',
    color: 'emerald',
    fields: [
      { name: 'businessName', label: 'שם העסק', type: 'text', required: true },
      { name: 'businessId', label: 'ח.פ / עוסק מורשה', type: 'text', required: true },
      { name: 'city', label: 'עיר', type: 'city', required: true },
      { name: 'street', label: 'רחוב', type: 'street', required: true, cityField: 'city' },
      { name: 'houseNumber', label: 'מספר', type: 'text', required: false },
      { name: 'businessType', label: 'סוג העסק', type: 'searchable', required: true, options: businessTypes },
      { name: 'damageDescription', label: 'תיאור הנזק', type: 'textarea', required: true },
      { name: 'estimatedLoss', label: 'הפסד משוער (₪)', type: 'number', required: true },
    ]
  },
  car: {
    label: 'רכב',
    icon: '🚗',
    color: 'amber',
    fields: [
      { name: 'licensePlate', label: 'מספר רישוי', type: 'text', required: true },
      { name: 'carMake', label: 'יצרן', type: 'searchable', required: true, options: carMakes },
      { name: 'carModel', label: 'דגם', type: 'dependentSearchable', required: true, parentField: 'carMake', optionsMap: carModels },
      { name: 'carYear', label: 'שנת ייצור', type: 'select', required: false, options: Array.from({ length: 30 }, (_, i) => String(2026 - i)) },
      { name: 'damageDescription', label: 'תיאור הנזק', type: 'textarea', required: true },
      { name: 'estimatedRepairCost', label: 'עלות תיקון משוערת (₪)', type: 'number', required: true },
      { name: 'insuranceCompany', label: 'חברת ביטוח', type: 'searchable', required: false, options: insuranceCompanies },
    ]
  },
  bodily_harm: {
    label: 'נזקי גוף',
    icon: '🏥',
    color: 'red',
    fields: [
      { name: 'injuryType', label: 'סוג הפגיעה', type: 'searchable', required: true, options: injuryTypes },
      { name: 'injuryDescription', label: 'תיאור הפגיעה', type: 'textarea', required: true },
      { name: 'hospitalized', label: 'אשפוז', type: 'select', required: true, options: ['כן', 'לא'] },
      { name: 'medicalInstitution', label: 'מוסד רפואי', type: 'searchable', required: false, options: medicalInstitutions },
      { name: 'treatmentCost', label: 'עלות טיפול משוערת (₪)', type: 'number', required: true },
      { name: 'daysUnableToWork', label: 'ימי אי-כושר עבודה', type: 'number', required: false },
    ]
  }
};

export const commonFields = [
  { name: 'claimantName', label: 'שם מלא', type: 'text', required: true },
  { name: 'idNumber', label: 'תעודת זהות', type: 'text', required: true },
  { name: 'phone', label: 'טלפון', type: 'tel', required: true },
  { name: 'email', label: 'דוא"ל', type: 'email', required: false },
  { name: 'city', label: 'עיר מגורים', type: 'city', required: true },
];

export const statusLabels = {
  new: 'חדשה',
  in_review: 'בבדיקה',
  approved: 'אושרה',
  rejected: 'נדחתה',
};

export const typeLabels = {
  residential: 'מגורים',
  business: 'עסק',
  car: 'רכב',
  bodily_harm: 'נזקי גוף',
};
