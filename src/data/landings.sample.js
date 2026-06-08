// DEMO stub. Real registry (~555 landings / ~13 promocodes) plugs in here later, same shape.
export const LANDINGS = [
  { slug: 'chicken_road_nb', label: 'Chicken Road (рег)', promocode: 'CHICK100500' },
  { slug: 'gates_of_olympus', label: 'Gates of Olympus (рег)', promocode: 'OLYMP100500' },
  { slug: 'general_registration', label: 'Общая регистрация', promocode: 'WELCOME500' },
  { slug: 'sport_welcome', label: 'Спорт welcome', promocode: 'SPORT100' },
  { slug: 'casino_bonus_100_500', label: 'Казино бонус 100+500', promocode: 'CAS100500' },
  { slug: 'betera_pass', label: 'Betera Pass', promocode: '' },
]

export const promocodeFor = (slug) => (LANDINGS.find((l) => l.slug === slug)?.promocode ?? '')
