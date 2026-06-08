// Single source of truth for the Betera naming convention (Excel v3).
// Changing dictionary values here is the ONLY edit needed when the convention evolves.

// L0 — platform/vendor/publisher (metadata, NOT part of any name).
// group → MIL Group; tGroup → URL t_group param (used by URL builder for Media/PR).
export const L0 = [
  { code: 'yandex', label: 'Яндекс Директ', group: 'Yandex Direct', tGroup: '' },
  { code: 'google', label: 'Google Ads', group: 'Google Ads', tGroup: '' },
  { code: 'tiktok', label: 'TikTok Ads', group: 'TikTok Ads', tGroup: '' },
  { code: 'meta', label: 'Meta / Facebook', group: 'Meta', tGroup: '' },
  { code: 'etarg', label: 'Сетки PF — Etarg', group: 'Setki', tGroup: 'setki' },
  { code: 'kadam', label: 'Сетки PF — Kadam', group: 'Setki', tGroup: 'setki' },
  { code: 'mybid', label: 'Сетки PF — MyBid', group: 'Setki', tGroup: 'setki' },
  { code: 'propeller', label: 'Сетки PF — Propeller', group: 'Setki', tGroup: 'setki' },
  { code: 'adw', label: 'Сетки BA — ADW', group: 'Setki', tGroup: 'setki' },
  { code: 'fsm', label: 'Сетки BA — FSM', group: 'Setki', tGroup: 'setki' },
  { code: 'kufar', label: 'Медиа — Kufar', group: 'Media', tGroup: 'media' },
  { code: 'myfin', label: 'Медиа — Myfin', group: 'Media', tGroup: 'media' },
  { code: 'sport5', label: 'Медиа — Sport5', group: 'Media', tGroup: 'media' },
  { code: 'onliner', label: 'Медиа — Onliner', group: 'Media', tGroup: 'media' },
  { code: 'championat', label: 'Медиа — Championat', group: 'Media', tGroup: 'media' },
  { code: 'avby', label: 'Медиа — av.by', group: 'Media', tGroup: 'media' },
]

// Enum option dictionaries (code + Russian description, verbatim from "Справочник").
export const OPTIONS = {
  status: [
    { code: 'NS', desc: 'Nonstop (постоянная)' },
    { code: 'TC', desc: 'Tactical (тактическая)' },
    { code: 'CP', desc: 'Campaign (централизованная инициатива)' },
    { code: 'TS', desc: 'Test (тестовая)' },
  ],
  objective: [
    { code: 'BA', desc: 'Brand Awareness (охват/показы, без CTA на рег)' },
    { code: 'PF', desc: 'Performance (конверсия: рег/FTD/CPA)' },
  ],
  product: [
    { code: 'SPO', desc: 'Спорт' },
    { code: 'CAS', desc: 'Казино' },
    { code: 'GEN', desc: 'Общий / кросс-продукт' },
  ],
  audience: [
    { code: 'ACQ', desc: 'Аквизиция (холодная, не регистрировались)' },
    { code: 'RTG', desc: 'Ретаргетинг (тёплая, не конвертировались)' },
    { code: 'RET', desc: 'Удержание (зарегистрированные / активные)' },
    { code: 'WIN', desc: 'Возврат (ушедшие игроки)' },
    { code: 'LAL', desc: 'Lookalike (моделированная)' },
  ],
  geo: [
    { code: 'BY', desc: 'Беларусь' },
    { code: 'KZ', desc: 'Казахстан' },
    { code: 'UZ', desc: 'Узбекистан' },
  ],
  format: [
    { code: 'SRC', desc: 'Поиск (Search)' },
    { code: 'DSP', desc: 'Дисплей (Display)' },
    { code: 'VID', desc: 'Видео' },
    { code: 'YTS', desc: 'YouTube Shorts' },
    { code: 'PSH', desc: 'Push-уведомления' },
    { code: 'POP', desc: 'Popunder' },
    { code: 'PRE', desc: 'Преролл' },
    { code: 'NAT', desc: 'Нативная реклама' },
    { code: 'FSC', desc: 'Fullscreen' },
    { code: 'INT', desc: 'Interscroller' },
    { code: 'MIX', desc: 'Смешанные форматы (Meta Advantage+)' },
    { code: 'TGO', desc: 'Текстово-графическое (Yandex Direct / РСЯ)' },
  ],
  device: [
    { code: 'MOB', desc: 'Мобильное' },
    { code: 'DSK', desc: 'Десктоп' },
  ],
  flow: [
    { code: 'W2W', desc: 'Веб → Веб' },
    { code: 'W2A', desc: 'Веб → Приложение' },
    { code: 'A2A', desc: 'Приложение → Приложение' },
  ],
  placement: [
    { code: 'FEED', desc: 'Feed / основная лента' },
    { code: 'STR', desc: 'Stories / Reels / короткие вертикальные' },
    { code: 'SRCH', desc: 'Search / поисковая выдача' },
    { code: 'NTW', desc: 'Display network / РСЯ, GDN' },
    { code: 'DIR', desc: 'Direct media buy / прямой паблишер' },
    { code: 'AUTO', desc: 'Platform-managed / Advantage+, PMax' },
  ],
  variant: Array.from({ length: 10 }, (_, i) => ({ code: `V${i + 1}`, desc: `Вариант ${i + 1}` })),
  source: [
    { code: 'studio', desc: 'Креативная студия' },
    { code: 'dmt', desc: 'Команда диджитал-маркетинга' },
    { code: 'agency', desc: 'Внешнее агентство' },
    { code: 'ugc', desc: 'Пользовательский контент' },
  ],
}

// Ordered field definitions per level. kind: 'enum' | 'camelText' | 'date'.
export const L1_FIELDS = [
  { key: 'status', label: 'Статус', kind: 'enum', options: 'status', required: true },
  { key: 'objective', label: 'Цель', kind: 'enum', options: 'objective', required: true },
  { key: 'product', label: 'Продукт', kind: 'enum', options: 'product', required: true },
  { key: 'audience', label: 'Аудитория', kind: 'enum', options: 'audience', required: true },
  { key: 'geo', label: 'Гео', kind: 'enum', options: 'geo', required: true },
  { key: 'campaign', label: 'Campaign (опц., обяз. при CP)', kind: 'camelText', required: false },
]

export const L2_FIELDS = [
  { key: 'format', label: 'Формат', kind: 'enum', options: 'format', required: true },
  { key: 'device', label: 'Устройство (опц.)', kind: 'enum', options: 'device', required: false },
  { key: 'flow', label: 'Поток', kind: 'enum', options: 'flow', required: true },
  { key: 'placement', label: 'Плейсмент', kind: 'enum', options: 'placement', required: true },
  { key: 'targeting', label: 'Таргетинг', kind: 'camelText', required: true },
]

export const L3_FIELDS = [
  { key: 'theme', label: 'Тема креатива', kind: 'camelText', required: true },
  { key: 'variant', label: 'Вариант', kind: 'enum', options: 'variant', required: true },
  { key: 'source', label: 'Источник', kind: 'enum', options: 'source', required: true },
  { key: 'date', label: 'Дата L3 (ММГГ, опц.)', kind: 'date', required: false },
]

// utm_medium derived from L2 Format. MIX has no documented mapping → display (fallback).
export const UTM_MEDIUM = {
  SRC: 'search',
  DSP: 'display', FSC: 'display', INT: 'display', TGO: 'display', MIX: 'display',
  VID: 'video', YTS: 'video',
  PSH: 'push', POP: 'pop', PRE: 'preroll', NAT: 'native',
}

// Soft length limits (warnings, not blocking). L3 is a [min, max] range.
export const LIMITS = { L1: 30, L2: 60, L3: [20, 35] }

export const optionCodes = (name) => OPTIONS[name].map((o) => o.code)
