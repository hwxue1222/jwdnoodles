import { Lang } from '@/lib/i18n';

export type LocalizedText = Record<Lang, string>;

export type Store = {
  id: string;
  name: LocalizedText;
  status: 'open' | 'opening_soon';
  openingDate: LocalizedText;
  address: LocalizedText;
  note?: LocalizedText;
  hours?: LocalizedText;
  photoSrc?: string;
  map: { placeQuery: string };
  acceptsReservation: boolean;
  reservationWhatsAppPhone?: string;
};

export type MenuItem = {
  id: string;
  code: string;
  name: Record<Lang, string>;
  desc: Record<Lang, string>;
  priceMYR?: number;
  priceText?: Record<Lang, string>;
  photoSrc?: string;
};

export type MenuCategory = {
  id: string;
  title: Record<Lang, string>;
  subtitle?: Record<Lang, string>;
  items: MenuItem[];
};

export type NewsItem = {
  id: string;
  dateISO: string;
  title: Record<Lang, string>;
  body: Record<Lang, string>;
  photoSrc?: string;
  url?: string;
};

export type GlobalLocation = {
  id: string;
  label: Record<Lang, string>;
  pin: { xPct: number; yPct: number };
  photoSrc?: string;
};

export const BRAND = {
  name: 'Lanzhou China Muslim Specialties',
  chineseName: '兰州牛肉面',
  tagline: {
    zh: '来自中国的兰州味 · 现已来到马来西亚',
    en: 'Authentic Lanzhou taste from China, now in Malaysia',
    ms: 'Rasa Lanzhou dari China, kini di Malaysia',
  } satisfies Record<Lang, string>,
};

export const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/JWDfood',
  tiktok: 'https://www.tiktok.com/@jwdmeetarik',
  xiaohongshu: 'https://www.xiaohongshu.com/user/profile/5482367737',
  whatsapp: 'https://wa.me/60123456789',
} as const;

export const CONTACT = {
  phone: '+60 17-812 6685',
  email: 'jinweide.my@gmail.com',
  address: {
    zh: 'RG14 Residensi Encorp, Persiaran Dato Seri Amar Diraja, Puteri Harbour, 79000, Iskandar Puteri, Johor, Malaysia',
    en: 'RG14 Residensi Encorp, Persiaran Dato Seri Amar Diraja, Puteri Harbour, 79000, Iskandar Puteri, Johor, Malaysia',
    ms: 'RG14 Residensi Encorp, Persiaran Dato Seri Amar Diraja, Puteri Harbour, 79000, Iskandar Puteri, Johor, Malaysia',
  } satisfies Record<Lang, string>,
} as const;

export const STORES: Store[] = [
  {
    id: 'puteri_harbour',
    name: {
      zh: 'Puteri Harbour（Nusajaya）',
      en: 'Puteri Harbour (Nusajaya)',
      ms: 'Puteri Harbour (Nusajaya)',
    },
    status: 'open',
    openingDate: { zh: '2024年12月', en: 'Dec 2024', ms: 'Dis 2024' },
    address: {
      zh: 'RG13A/14 Residensi Encorp, Persiaran Dato Seri Amar Diraja, Puteri Harbour, 79000, Iskandar Puteri, Johor, Malaysia',
      en: 'RG13A/14 Residensi Encorp, Persiaran Dato Seri Amar Diraja, Puteri Harbour, 79000, Iskandar Puteri, Johor, Malaysia',
      ms: 'RG13A/14 Residensi Encorp, Persiaran Dato Seri Amar Diraja, Puteri Harbour, 79000, Iskandar Puteri, Johor, Malaysia',
    },
    note: {
      zh: '（Restoran TKR 旁）',
      en: '(next to Restoran TKR)',
      ms: '(sebelah Restoran TKR)',
    },
    hours: {
      zh: '周一至周四 10:00–22:30；周五至周日 10:00–23:00',
      en: '10:00am–10:30pm (Mon–Thu), 10:00am–11:00pm (Fri–Sun)',
      ms: '10:00 pagi–10:30 malam (Isnin–Khamis), 10:00 pagi–11:00 malam (Jumaat–Ahad)',
    },
    photoSrc: '/images/stores/puteri-harbour.jpg',
    map: {
      placeQuery:
        'RG13A/14 Residensi Encorp, Persiaran Dato Seri Amar Diraja, Puteri Harbour, 79000 Iskandar Puteri, Johor, Malaysia',
    },
    acceptsReservation: true,
    reservationWhatsAppPhone: '+0183177524',
  },
  {
    id: 'kulai_commune',
    name: { zh: 'The Commune（Kulai）', en: 'The Commune (Kulai)', ms: 'The Commune (Kulai)' },
    status: 'open',
    openingDate: { zh: '2025年9月', en: 'Sep 2025', ms: 'Sep 2025' },
    address: {
      zh: 'Ground Floor, G-06, THE COMMUNE Lifestyle Mall, Pusat Komersial Indah, 291, Jalan Kiambang 10, Bandar Indahpura, 81000 Kulai, Johor',
      en: 'Ground Floor, G-06, THE COMMUNE Lifestyle Mall, Pusat Komersial Indah, 291, Jalan Kiambang 10, Bandar Indahpura, 81000 Kulai, Johor',
      ms: 'Ground Floor, G-06, THE COMMUNE Lifestyle Mall, Pusat Komersial Indah, 291, Jalan Kiambang 10, Bandar Indahpura, 81000 Kulai, Johor',
    },
    hours: {
      zh: '周一至周日 10:00–22:00',
      en: '10:00am–10:00pm (Mon–Sun)',
      ms: '10:00 pagi–10:00 malam (Isnin–Ahad)',
    },
    photoSrc: '/images/stores/kulai-commune.jpg',
    map: {
      placeQuery:
        'G-06, THE COMMUNE Lifestyle Mall, Pusat Komersial Indah, 291, Jalan Kiambang 10, Bandar Indahpura, 81000 Kulai, Johor',
    },
    acceptsReservation: true,
    reservationWhatsAppPhone: '+01163792571',
  },
  {
    id: 'lotus_mutiara_rini',
    name: { zh: "Lotus's Mutiara Rini（JB）", en: "Lotus's Mutiara Rini (JB)", ms: "Lotus's Mutiara Rini (JB)" },
    status: 'opening_soon',
    openingDate: { zh: '2026年7月', en: 'July 2026', ms: 'Julai 2026' },
    address: {
      zh: "Ground floor, G4&G5, Lotus's Mutiara Rini, No.1, Jalan Persiaran Jasa 1, Taman Mutiara Rini, 81380 Skudai, Johor Bahru, Johor",
      en: "Ground floor, G4&G5, Lotus's Mutiara Rini, No.1, Jalan Persiaran Jasa 1, Taman Mutiara Rini, 81380 Skudai, Johor Bahru, Johor",
      ms: "Ground floor, G4&G5, Lotus's Mutiara Rini, No.1, Jalan Persiaran Jasa 1, Taman Mutiara Rini, 81380 Skudai, Johor Bahru, Johor",
    },
    photoSrc: '/images/stores/lotus-mutiara-rini.jpg',
    map: {
      placeQuery:
        "Ground floor, G4&G5, Lotus's Mutiara Rini, No.1, Jalan Persiaran Jasa 1, Taman Mutiara Rini, 81380 Skudai, Johor Bahru, Johor",
    },
    acceptsReservation: false,
  },
];

export const GLOBAL_LOCATIONS: GlobalLocation[] = [
  {
    id: 'lanzhou_china',
    label: { zh: '兰州，中国', en: 'Lanzhou, China', ms: 'Lanzhou, China' },
    pin: { xPct: 76.0, yPct: 31.4 },
    photoSrc: '/images/global/lanzhou-china.jpg',
  },
  {
    id: 'san_francisco',
    label: { zh: '旧金山，美国', en: 'San Francisco, USA', ms: 'San Francisco, USA' },
    pin: { xPct: 7.8, yPct: 30.4 },
    photoSrc: '/images/global/san-francisco.jpg',
  },
  {
    id: 'london',
    label: { zh: '伦敦，英国', en: 'London, UK', ms: 'London, UK' },
    pin: { xPct: 44.7, yPct: 19.3 },
    photoSrc: '/images/global/london.jpg',
  },
  {
    id: 'amsterdam',
    label: { zh: '阿姆斯特丹，荷兰', en: 'Amsterdam, Netherlands', ms: 'Amsterdam, Netherlands' },
    pin: { xPct: 46.2, yPct: 19.3 },
    photoSrc: '/images/global/amsterdam.jpg',
  },
  {
    id: 'frankfurt',
    label: { zh: '法兰克福，德国', en: 'Frankfurt, Germany', ms: 'Frankfurt, Germany' },
    pin: { xPct: 47.8, yPct: 21.1 },
    photoSrc: '/images/global/frankfurt.jpg',
  },
  {
    id: 'spain',
    label: { zh: '巴塞罗那，西班牙', en: 'Barcelona, Spain', ms: 'Barcelona, Sepanyol' },
    pin: { xPct: 45.4, yPct: 23.1 },
    photoSrc: '/images/global/barcelona.jpg',
  },
  {
    id: 'turkmenistan',
    label: { zh: '土库曼斯坦', en: 'Turkmenistan', ms: 'Turkmenistan' },
    pin: { xPct: 61.3, yPct: 27.6 },
    photoSrc: '/images/global/turkmenistan.jpg',
  },
  {
    id: 'puteri_harbour_my',
    label: { zh: 'Puteri Harbour，马来西亚', en: 'Puteri Harbour, Malaysia', ms: 'Puteri Harbour, Malaysia' },
    pin: { xPct: 77.8, yPct: 55.6 },
    photoSrc: '/images/stores/puteri-harbour.jpg',
  },
  {
    id: 'kulai_my',
    label: { zh: 'Kulai，马来西亚', en: 'Kulai, Malaysia', ms: 'Kulai, Malaysia' },
    pin: { xPct: 77.2, yPct: 54.7 },
    photoSrc: '/images/stores/kulai-commune.jpg',
  },
  {
    id: 'jb_mutiara_rini_my',
    label: { zh: 'Johor Bahru，马来西亚', en: 'Johor Bahru, Malaysia', ms: 'Johor Bahru, Malaysia' },
    pin: { xPct: 78.4, yPct: 55.0 },
    photoSrc: '/images/stores/lotus-mutiara-rini.jpg',
  },
  {
    id: 'perth',
    label: { zh: '珀斯，澳大利亚', en: 'Perth, Australia', ms: 'Perth, Australia' },
    pin: { xPct: 80.7, yPct: 81.4 },
    photoSrc: '/images/global/perth.jpg',
  },
  {
    id: 'sydney',
    label: { zh: '悉尼，澳大利亚', en: 'Sydney, Australia', ms: 'Sydney, Australia' },
    pin: { xPct: 91.5, yPct: 82.8 },
    photoSrc: '/images/global/sydney.jpg',
  },
  {
    id: 'auckland',
    label: { zh: '奥克兰，新西兰', en: 'Auckland, New Zealand', ms: 'Auckland, New Zealand' },
    pin: { xPct: 98.0, yPct: 85.2 },
    photoSrc: '/images/global/auckland.jpg',
  },
  {
    id: 'christchurch',
    label: { zh: '基督城，新西兰', en: 'Christchurch, New Zealand', ms: 'Christchurch, New Zealand' },
    pin: { xPct: 96.3, yPct: 90.1 },
    photoSrc: '/images/global/christchurch.jpg',
  },
  {
    id: 'cambridge_uk',
    label: { zh: '剑桥，英国', en: 'Cambridge, UK', ms: 'Cambridge, UK' },
    pin: { xPct: 45.2, yPct: 18.7 },
    photoSrc: '/images/global/london.jpg',
  },
];

export const MENU_PAGES: { src: string; label: Record<Lang, string> }[] = [
  { src: '/images/menu/menu-03.png', label: { zh: '菜单 1/8', en: 'Menu 1/8', ms: 'Menu 1/8' } },
  { src: '/images/menu/menu-04.png', label: { zh: '菜单 2/8', en: 'Menu 2/8', ms: 'Menu 2/8' } },
  { src: '/images/menu/menu-05.png', label: { zh: '菜单 3/8', en: 'Menu 3/8', ms: 'Menu 3/8' } },
  { src: '/images/menu/menu-06.png', label: { zh: '菜单 4/8', en: 'Menu 4/8', ms: 'Menu 4/8' } },
  { src: '/images/menu/menu-07.png', label: { zh: '菜单 5/8', en: 'Menu 5/8', ms: 'Menu 5/8' } },
  { src: '/images/menu/menu-08.png', label: { zh: '菜单 6/8', en: 'Menu 6/8', ms: 'Menu 6/8' } },
  { src: '/images/menu/menu-09.png', label: { zh: '菜单 7/8', en: 'Menu 7/8', ms: 'Menu 7/8' } },
  { src: '/images/menu/menu-10.png', label: { zh: '菜单 8/8', en: 'Menu 8/8', ms: 'Menu 8/8' } },
];

export const MENU: MenuCategory[] = [
  {
    id: 'mee-sup',
    title: { zh: 'A. 汤面类', en: 'A. Noodles in soup', ms: 'A. Mee Sup' },
    subtitle: { zh: 'Noodle soup', en: 'Noodle soup', ms: 'Mee Sup' },
    items: [
      {
        id: 'A1',
        code: 'A1',
        name: { zh: '清汤牛肉面', en: 'Beef noodles in soup', ms: 'Mee sup daging lembu' },
        desc: { zh: '', en: '', ms: '' },
        priceMYR: 14.9,
      },
      {
        id: 'A2',
        code: 'A2',
        name: { zh: '红烧牛肉面', en: 'Braised beef noodles in soup', ms: 'Mee sup daging lembu rebus' },
        desc: { zh: '', en: '', ms: '' },
        priceMYR: 15.9,
      },
      {
        id: 'A3',
        code: 'A3',
        name: { zh: '酸菜牛肉面', en: 'Beef noodles with pickled Chinese cabbage soup', ms: 'Mee daging dengan acar sup kubis cina' },
        desc: { zh: '', en: '', ms: '' },
        priceMYR: 15.9,
      },
      { id: 'A4', code: 'A4', name: { zh: '酸菜鸡肉面', en: 'Chicken noodles with pickled Chinese cabbage soup', ms: 'Mee sup ayam dengan acar sup kubis cina' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 13.9 },
      { id: 'A5', code: 'A5', name: { zh: '鸡肉面', en: 'Chicken noodles soup', ms: 'Mee sup ayam' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 13.9 },
      { id: 'A6', code: 'A6', name: { zh: '鸡蛋面', en: 'Egg noodles soup', ms: 'Mee sup telur' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 12.9 },
    ],
  },
  {
    id: 'dumplings',
    title: { zh: 'B. 饺子类', en: 'B. Dumplings', ms: 'B. Ladu' },
    subtitle: { zh: '10 pieces', en: '10 pieces', ms: '10 pieces' },
    items: [
      { id: 'B1', code: 'B1', name: { zh: '牛肉水饺（10个）', en: 'Beef dumplings', ms: 'Ladu daging lembu' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 13.0 },
      { id: 'B2', code: 'B2', name: { zh: '鸡肉水饺（10个）', en: 'Chicken dumplings', ms: 'Ladu daging ayam' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 13.0 },
      { id: 'B3', code: 'B3', name: { zh: '牛肉煎饺（10个）', en: 'Beef fried dumplings', ms: 'Ladu goreng daging lembu' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 13.0 },
      { id: 'B4', code: 'B4', name: { zh: '鸡肉煎饺（10个）', en: 'Chicken fried dumplings', ms: 'Ladu goreng ayam' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 13.0 },
    ],
  },
  {
    id: 'fried-noodles',
    title: { zh: 'C. 炒面类', en: 'C. Fried Noodles', ms: 'C. Mee Goreng' },
    items: [
      { id: 'C1', code: 'C1', name: { zh: '牛肉炒面', en: 'Beef fried noodles', ms: 'Mee goreng daging' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 17.9 },
      { id: 'C2', code: 'C2', name: { zh: '牛肉干煸炒面', en: 'Beef stir-fried noodles', ms: 'Mee tumis daging' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 17.9 },
      { id: 'C3', code: 'C3', name: { zh: '牛肉干拌面', en: 'Beef mixed fried noodles (dry)', ms: 'Mee kering campur daging' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 15.9 },
      { id: 'C4', code: 'C4', name: { zh: '牛肉凉面', en: 'Beef cold noodles', ms: 'Mee sejuk daging' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 14.9 },
      { id: 'C5', code: 'C5', name: { zh: '鸡肉炒面', en: 'Chicken fried noodles', ms: 'Mee goreng ayam' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 15.9 },
      { id: 'C6', code: 'C6', name: { zh: '鸡肉干煸炒面', en: 'Chicken stir-fried noodles', ms: 'Mee tumis ayam' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 15.9 },
    ],
  },
  {
    id: 'fried-rice',
    title: { zh: 'D. 炒饭类', en: 'D. Fried rice', ms: 'D. Nasi Goreng' },
    items: [
      { id: 'D1', code: 'D1', name: { zh: '牛肉炒饭', en: 'Beef fried rice', ms: 'Nasi goreng daging' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 15.9 },
      { id: 'D2', code: 'D2', name: { zh: '兰州炒饭', en: 'Lanzhou fried rice', ms: 'Nasi goreng Lanzhou' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 15.9 },
      { id: 'D3', code: 'D3', name: { zh: '鸡肉炒饭', en: 'Chicken fried rice', ms: 'Nasi goreng ayam' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 12.9 },
      { id: 'D4', code: 'D4', name: { zh: '鸡蛋炒饭', en: 'Egg fried rice', ms: 'Nasi goreng telur' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 11.9 },
    ],
  },
  {
    id: 'rice-with-toppings',
    title: { zh: 'E. 盖饭类', en: 'E. Rice with toppings', ms: 'E. Nasi Dengan' },
    items: [
      { id: 'E1', code: 'E1', name: { zh: '红烧牛肉盖饭', en: 'Rice with braised beef toppings', ms: 'Nasi dengan daging rebus' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 18.9 },
      { id: 'E2', code: 'E2', name: { zh: '孜然牛肉盖饭', en: 'Rice with cumin beef toppings', ms: 'Nasi dengan daging jintan manis' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 18.9 },
      { id: 'E3', code: 'E3', name: { zh: '香菇牛肉盖饭', en: 'Rice with mushroom and beef toppings', ms: 'Nasi dengan cendawan dan daging' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 15.9 },
      { id: 'E4', code: 'E4', name: { zh: '土豆牛肉盖饭', en: 'Rice with potatoes and beef toppings', ms: 'Nasi dengan kentang dan daging' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 15.9 },
      { id: 'E5', code: 'E5', name: { zh: '黄焖鸡盖饭', en: 'Rice with yellow braised chicken toppings', ms: 'Nasi dengan ayam rebus kuning' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 15.9 },
      { id: 'E6', code: 'E6', name: { zh: '红烧鸡盖饭', en: 'Rice with braised chicken toppings', ms: 'Nasi dengan ayam rebus' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 15.9 },
      { id: 'E7', code: 'E7', name: { zh: '番茄鸡蛋盖饭', en: 'Rice with tomatoes and egg toppings', ms: 'Nasi dengan tomato dan telur' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 14.9 },
    ],
  },
  {
    id: 'hand-pulled-noodles-with-toppings',
    title: { zh: 'F. 盖面类', en: 'F. Hand-pulled noodles with toppings', ms: 'F. Mee Tarik Dengan' },
    items: [
      { id: 'F1', code: 'F1', name: { zh: '土豆牛肉盖浇面', en: 'Hand-pulled noodles with potato and beef toppings', ms: 'Mee tarik dengan kentang dan daging' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 15.9 },
      { id: 'F2', code: 'F2', name: { zh: '香菇牛肉盖浇面', en: 'Hand-pulled noodles with mushroom and beef toppings', ms: 'Mee tarik dengan cendawan dan daging' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 15.9 },
      { id: 'F3', code: 'F3', name: { zh: '孜然牛肉盖浇面', en: 'Hand-pulled noodles with cumin beef toppings', ms: 'Mee tarik dengan daging jintan manis' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 18.9 },
      { id: 'F4', code: 'F4', name: { zh: '红烧牛肉盖浇面', en: 'Hand-pulled noodles with braised beef toppings', ms: 'Mee tarik dengan daging rebus' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 18.9 },
      { id: 'F5', code: 'F5', name: { zh: '红烧鸡肉盖浇面', en: 'Hand-pulled noodles with braised chicken toppings', ms: 'Mee tarik dengan ayam rebus' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 14.9 },
      { id: 'F6', code: 'F6', name: { zh: '番茄鸡蛋盖浇面', en: 'Hand-pulled noodles with tomatoes and eggs toppings', ms: 'Mee tarik dengan tomato dan telur' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 14.9 },
      { id: 'F7', code: 'F7', name: { zh: '新疆大盘鸡盖浇面', en: 'Hand-pulled noodles with Xinjiang mala chicken toppings', ms: 'Mee tarik dengan ayam mala xinjiang' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 21.9 },
    ],
  },
  {
    id: 'side-dishes',
    title: { zh: 'G. 凉菜类', en: 'G. Side dishes', ms: 'G. Makanan Sampingan' },
    subtitle: { zh: '（1–2人份）', en: '(for 1–2 pax)', ms: '(for 1–2 pax)' },
    items: [
      {
        id: 'G1',
        code: 'G1',
        name: { zh: '凉拌牛肉', en: 'Beef slice salad', ms: 'Hirisan daging dengan salad' },
        desc: { zh: '', en: '', ms: '' },
        priceText: { zh: 'RM 8.00 / 15.00', en: 'RM 8.00 / 15.00', ms: 'RM 8.00 / 15.00' },
      },
      {
        id: 'G2',
        code: 'G2',
        name: { zh: '凉拌土豆丝', en: 'Potato strip salad', ms: 'Salad dengan jalur kentang' },
        desc: { zh: '', en: '', ms: '' },
        priceText: { zh: 'RM 7.00 / 12.00', en: 'RM 7.00 / 12.00', ms: 'RM 7.00 / 12.00' },
      },
      {
        id: 'G3',
        code: 'G3',
        name: { zh: '凉拌黄瓜', en: 'Cucumber salad (spicy and sour)', ms: 'Salad timun' },
        desc: { zh: '', en: '', ms: '' },
        priceText: { zh: 'RM 7.00 / 12.00', en: 'RM 7.00 / 12.00', ms: 'RM 7.00 / 12.00' },
      },
      {
        id: 'G4',
        code: 'G4',
        name: { zh: '凉拌木耳', en: 'Chinese black fungus salad', ms: 'Salad kulat hitam cina' },
        desc: { zh: '', en: '', ms: '' },
        priceText: { zh: 'RM 7.00 / 12.00', en: 'RM 7.00 / 12.00', ms: 'RM 7.00 / 12.00' },
      },
      {
        id: 'G5',
        code: 'G5',
        name: { zh: '川味鸡丝', en: 'Chinese Pepper Chicken salad', ms: 'Salad ayam cina lada' },
        desc: { zh: '', en: '', ms: '' },
        priceText: { zh: 'RM 7.00 / 12.00', en: 'RM 7.00 / 12.00', ms: 'RM 7.00 / 12.00' },
      },
    ],
  },
  {
    id: 'special-dishes',
    title: { zh: 'H. 特色类', en: 'H. Special dishes', ms: 'H. Hidangan Istimewa' },
    subtitle: { zh: '（2–4人份）', en: '(for 2–4 pax)', ms: '(for 2–4 pax)' },
    items: [
      { id: 'H1', code: 'H1', name: { zh: '新疆麻辣鸡', en: 'Xinjiang mala chicken', ms: 'Xinjiang mala ayam' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 59.0 },
      { id: 'H2', code: 'H2', name: { zh: '黄焖鸡', en: 'Yellow braised chicken', ms: 'Ayam rebus kuning' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 38.0 },
      { id: 'H3', code: 'H3', name: { zh: '辣子鸡块', en: 'Spicy chicken nuggets', ms: 'Nugget ayam pedas' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 28.0 },
      { id: 'H4', code: 'H4', name: { zh: '糖醋里脊', en: 'Sweet and sour chicken tenderloin', ms: 'Tenderloin ayam masam manis' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 28.0 },
      { id: 'H5', code: 'H5', name: { zh: '孜然牛肉', en: 'Cumin beef', ms: 'Daging jintan manis' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 35.0 },
      { id: 'H6', code: 'H6', name: { zh: '土豆炖牛肉', en: 'Braised beef with potatoes', ms: 'Daging rebus dengan kentang' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 28.0 },
      { id: 'H7', code: 'H7', name: { zh: '凉拌牛肉（大份）', en: 'Beef slice salad (big portion)', ms: 'Hirisan daging dengan salad (bahagian besar)' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 35.0 },
      { id: 'H8', code: 'H8', name: { zh: '酸辣土豆丝', en: 'Sour and spicy shredded potatoes', ms: 'Kentang cincang masam dan pedas' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 16.0 },
      { id: 'H9', code: 'H9', name: { zh: '酸辣白菜', en: 'Sour and spicy cabbage', ms: 'Kobis masam dan pedas' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 16.0 },
      { id: 'H10', code: 'H10', name: { zh: '番茄炒鸡蛋', en: 'Scrambled eggs with tomatoes', ms: 'Telur hancur dengan tomato' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 16.0 },
    ],
  },
  {
    id: 'soup',
    title: { zh: 'I. 汤类', en: 'I. Soup', ms: 'I. Sup' },
    items: [
      { id: 'I1', code: 'I1', name: { zh: '牛肉汤', en: 'Beef soup', ms: 'Sup daging' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 15.0 },
      { id: 'I2', code: 'I2', name: { zh: '番茄鸡蛋汤', en: 'Tomato and egg soup', ms: 'Sup tomato dan telur' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 15.0 },
    ],
  },
  {
    id: 'snacks',
    title: { zh: 'J. 小吃类', en: 'J. Snacks', ms: 'J. Snek' },
    items: [
      { id: 'J1', code: 'J1', name: { zh: '牛肉串', en: 'Beef kebab', ms: 'Kebab daging' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 8.0 },
      { id: 'J2', code: 'J2', name: { zh: '葱油饼', en: 'Scallion pancake', ms: 'Pancake daun bawang' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 5.0 },
      { id: 'J3', code: 'J3', name: { zh: '干切牛肉', en: 'Beef slice', ms: 'Hirisan daging' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 15.0 },
      { id: 'J4', code: 'J4', name: { zh: '卤牛肉', en: 'Braised beef', ms: 'Daging rebus' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 19.0 },
      { id: 'J5', code: 'J5', name: { zh: '煎蛋', en: 'Sunny egg', ms: 'Telur mata' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 3.0 },
      { id: 'J6', code: 'J6', name: { zh: '茶叶蛋', en: 'Tea egg', ms: 'Tea telur' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 5.0 },
    ],
  },
  {
    id: 'grill',
    title: { zh: 'K. 烧烤类', en: 'K. Grill', ms: 'K. Barbeku' },
    subtitle: { zh: '3 sticks', en: '3 sticks', ms: '3 sticks' },
    items: [
      { id: 'K1', code: 'K1', name: { zh: '羊肉串（三串）', en: 'Lamb kebab', ms: 'Kebab kambing' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 15.0 },
      { id: 'K2', code: 'K2', name: { zh: '烤鸡翅（三串）', en: 'Chicken wing BBQ', ms: 'Kepak ayam' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 15.0 },
    ],
  },
  {
    id: 'drinks',
    title: { zh: 'L. 饮品', en: 'L. Drinks', ms: 'L. Minuman' },
    items: [
      { id: 'L1', code: 'L1', name: { zh: '八宝茶', en: 'Eight Treasure Tea', ms: 'Lapan teh harta karun' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 8.0 },
      { id: 'L2', code: 'L2', name: { zh: '美禄', en: 'Nestle Milo', ms: 'Nestle Milo' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 3.5 },
      { id: 'L3', code: 'L3', name: { zh: '雀巢焦糖白咖啡', en: "Nestle 'caramel' white coffee", ms: "Nestle 'caramel' white coffee" }, desc: { zh: '', en: '', ms: '' }, priceMYR: 3.0 },
      { id: 'L4', code: 'L4', name: { zh: '雀巢奶茶', en: 'Nestle Teh tarik', ms: 'Nestle Teh tarik' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 3.0 },
      { id: 'L5', code: 'L5', name: { zh: '雀巢柠檬茶', en: 'Nestle lemon tea', ms: 'Nestle lemon tea' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 2.5 },
      { id: 'L6', code: 'L6', name: { zh: '雀巢桃子茶', en: 'Nestle Peach tea', ms: 'Nestle Peach tea' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 2.5 },
      { id: 'L7', code: 'L7', name: { zh: '雀巢柠檬水', en: 'Nestle lemonade', ms: 'Nestle lemonade' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 2.5 },
      { id: 'L8', code: 'L8', name: { zh: '雀巢果汁', en: 'Nestle Orange drink', ms: 'Nestle Orange drink' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 2.5 },
      { id: 'L9', code: 'L9', name: { zh: '可口可乐', en: 'Coca Cola', ms: 'Coca Cola' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 2.5 },
      { id: 'L10', code: 'L10', name: { zh: '100 Plus', en: '100 Plus', ms: '100 Plus' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 2.5 },
      { id: 'L11', code: 'L11', name: { zh: '矿泉水', en: 'Mineral water', ms: 'Mineral water' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 1.5 },
    ],
  },
  {
    id: 'add-on',
    title: { zh: 'M. 其他', en: 'M. Add-on', ms: 'M. Tambahan' },
    items: [
      { id: 'M1', code: 'M1', name: { zh: '米饭', en: 'Plain rice', ms: 'Nasi putih' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 2.0 },
      { id: 'M2', code: 'M2', name: { zh: '拉面', en: 'Hand-pulled noodle', ms: 'Mee tarik' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 4.0 },
      { id: 'M3', code: 'M3', name: { zh: '汤', en: 'Soup', ms: 'Sup kosong' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 0.5 },
      { id: 'M4', code: 'M4', name: { zh: '温水', en: 'Warm water', ms: 'Air suam' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 0.3 },
      { id: 'M5', code: 'M5', name: { zh: '冰', en: 'Ice', ms: 'Ais kosong' }, desc: { zh: '', en: '', ms: '' }, priceMYR: 0.2 },
    ],
  },
];

export const NEWS: NewsItem[] = [
  {
    id: 'halal-jakim-20250716',
    dateISO: '2025-07-16',
    title: {
      zh: 'Restoran JWD 获得马来西亚清真认证（JAKIM）',
      en: 'Restoran JWD receives Malaysia Halal certification (JAKIM)',
      ms: 'Restoran JWD menerima sijil Halal Malaysia (JAKIM)',
    },
    body: {
      zh: '我们很高兴宣布，Restoran JWD 门店已获得马来西亚 JAKIM 颁发的清真（Halal）认证。认证日期为 2025-07-16，有效期 2 年，至 2027-07-15 截止。Halal certification issued by JAKIM。',
      en: 'We are pleased to announce that Restoran JWD has received Malaysia Halal certification issued by JAKIM. The certificate is issued on 2025-07-16 and is valid for 2 years, until 2027-07-15.',
      ms: 'Kami dengan sukacitanya memaklumkan bahawa Restoran JWD telah menerima sijil Halal Malaysia yang dikeluarkan oleh JAKIM. Sijil ini dikeluarkan pada 2025-07-16 dan sah selama 2 tahun sehingga 2027-07-15.',
    },
    photoSrc: '/images/halal/cert-1.jpg',
  },
  {
    id: 'kjt-173931375',
    dateISO: '2024-06-13',
    title: {
      zh: '兰州：市科技局调研甘肃金味德拉面文化产业集团有限公司',
      en: 'Lanzhou: Science & Tech Bureau visits Gansu JWD Noodle Culture Industry Group',
      ms: 'Lanzhou: Biro Sains & Teknologi melawat Kumpulan Industri Budaya Mi JWD Gansu',
    },
    body: { zh: '', en: '', ms: '' },
    url: 'https://kjt.gansu.gov.cn/kjt/c111534/202406/173931375.shtml',
    photoSrc: '/images/news/kjt-173931375.png',
  },
  {
    id: 'ifeng-8e2rg1CUsQq',
    dateISO: '2024-10-28',
    title: {
      zh: '中国非遗征服巴塞罗那 金味德兰州牛肉拉面大火',
      en: 'Chinese intangible heritage wins Barcelona: JWD Lanzhou beef noodles go viral',
      ms: 'Warisan budaya tidak ketara China memukau Barcelona: mee daging Lanzhou JWD menjadi tular',
    },
    body: { zh: '', en: '', ms: '' },
    url: 'https://sz.ifeng.com/c/8e2rg1CUsQq',
    photoSrc: '/images/news/ifeng-8e2rg1CUsQq.jpg',
  },
  {
    id: 'gansu-swt-174137203',
    dateISO: '2025-04-25',
    title: {
      zh: '一碗面的环球之旅｜在全球60余个国家注册商标 金味德以连锁业务打造中国美食IP',
      en: 'JWD: Building a Chinese culinary IP',
      ms: 'JWD: Membina IP kulinari China',
    },
    body: { zh: '', en: '', ms: '' },
    url: 'https://swt.gansu.gov.cn/swt/c108416/202505/174137203.shtml',
    photoSrc: '/images/news/gansu-swt-174137203.png',
  },
  {
    id: 'gansu-wsb-174224859',
    dateISO: '2025-06-17',
    title: {
      zh: '甘肃省人民政府外事办公室关于对省十四届人大三次会议第81号建议的答复',
      en: 'Reply to proposal (No.81)',
      ms: 'Jawapan kepada cadangan (No.81)',
    },
    body: { zh: '', en: '', ms: '' },
    url: 'https://wsb.gansu.gov.cn/wsb/c108836/202510/174224859.shtml',
    photoSrc: '/images/news/gansu-wsb-174224859.png',
  },
];
