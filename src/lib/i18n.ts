export type Lang = 'zh' | 'en' | 'ms';

export const LANG_STORAGE_KEY = 'lanzhou:lang';

export const LANG_LABEL: Record<Lang, string> = {
  zh: '中文',
  en: 'English',
  ms: 'Bahasa Melayu',
};

type I18nParams = Record<string, string | number>;
type I18nValue = string | ((params: I18nParams) => string);

export const I18N: Record<Lang, Record<string, I18nValue>> = {
  zh: {
    'nav.about': '品牌介绍',
    'nav.stores': '门店',
    'nav.menu': '菜单',
    'nav.halal': '清真认证',
    'nav.news': '新闻',
    'nav.reservation': '订位',
    'nav.contact': '联系我们',

    'hero.title': '兰州牛肉面 · 兰州传统清汤拉面',
    'hero.subtitle':
      '兰州牛肉面，是甘肃省兰州市的特色美食，是一种食品名称，原名“兰州牛肉面”，始于清朝嘉庆年间（1799年）。牛肉面以“一清（汤）二白（萝卜）三红（辣子）四绿（香菜蒜苗）五黄（面条黄亮）”统一了兰州牛肉面的标准。在其后一百多年的漫长岁月里，以“一碗面品尝天下”，以肉烂汤鲜、面质精细黄莹中见外，走向世界，赢得了国内乃至全世界范围内食客的好评和荣誉。',
    'hero.cta.menu': '查看菜单',
    'hero.cta.reserve': '立即订位',

    'section.about.title': '关于我们',
    'section.about.p0':
      '兰州牛肉面，是甘肃省兰州市的特色美食，是一种食品名称，原名“兰州牛肉面”，始于清朝嘉庆年间（1799年）。牛肉面以“一清（汤）二白（萝卜）三红（辣子）四绿（香菜蒜苗）五黄（面条黄亮）”统一了兰州牛肉面的标准。在其后一百多年的漫长岁月里，以“一碗面品尝天下”，以肉烂汤鲜、面质精细黄莹中见外，走向世界，赢得了国内乃至全世界范围内食客的好评和荣誉。',
    'section.about.p1':
      '金味德牛肉拉面品牌，总部位于甘肃兰州，创始于1986年，是一家兰州牛肉拉面国际连锁品牌，目前在美国、新西兰、西班牙、荷兰、德国、英国、马来西亚等世界60多个国家注册商标、开展业务，海外外连锁店数量达百余家。',
    'section.about.p2':
      '“金味德，一个始于兰州的传奇”，品牌以正宗传统兰州牛肉拉面为主导，辅以西北特色如肉夹馍、烤肉、凉菜、小吃等。荣获“2018年中国快餐50强”、“改革开放40年中国餐饮行业模式创新突出贡献企业”等多项荣誉。',

    'section.global.title': '全球门店',
    'section.global.subtitle': '点击地图标记查看各地门店照片',

    'section.stores.title': '门店与营业时间',
    'section.stores.subtitle': '公共假期照常营业',
    'store.opened': ({ date }) => `开业：${date}`,
    'store.openingSoon': ({ date }) => `即将开业：${date}`,
    'store.hours': '营业时间',
    'store.viewOnMaps': '在 Google Maps 打开',

    'section.menu.title': '菜单',
    'menu.subtitle': '点击图片可放大查看',
    'menu.price': ({ value }) => `MYR ${value}`,

    'section.halal.title': '清真认证',
    'halal.p1': '我们尊重并遵守清真要求。门店在取得相关认证/批准后，将在此展示证书与更新信息。',
    'halal.p2': '如需了解门店当前状态，请通过 WhatsApp 联系我们。',
    'halal.badge': 'Halal Friendly',

    'section.news.title': '新闻',
    'news.subtitle': '品牌动态、开业信息与活动公告',

    'section.reservation.title': '订位',
    'reservation.subtitle': '填写信息后将自动跳转到 WhatsApp，发送订位信息给门店。',
    'reservation.name': '姓名',
    'reservation.phone': '电话',
    'reservation.store': '门店',
    'reservation.date': '日期',
    'reservation.time': '时间',
    'reservation.pax': '人数',
    'reservation.note': '备注（可选）',
    'reservation.disclaimer': '订位不保证一定有座位，但我们会在您到店时尽量优先安排。',
    'reservation.submit': '用 WhatsApp 发送订位',
    'reservation.placeholder.note': '例如：靠窗、儿童椅、过敏提示…',

    'section.contact.title': '联系我们',
    'contact.subtitle': '合作/加盟/媒体咨询欢迎联系',
    'contact.phone': '电话',
    'contact.email': '邮箱',
    'contact.address': '地址',
    'contact.follow': '关注我们',

    'footer.rights': () => `© 2022 JWD Mee Tarik (M). All rights reserved.`,
  },
  en: {
    'nav.about': 'About',
    'nav.stores': 'Stores',
    'nav.menu': 'Menu',
    'nav.halal': 'Halal',
    'nav.news': 'News',
    'nav.reservation': 'Reservation',
    'nav.contact': 'Contact',

    'hero.title': 'Lanzhou Beef Noodles · A classic clear-broth noodle from Lanzhou',
    'hero.subtitle':
      "Originated in Lanzhou, Gansu (1799). Known for the “one clear, two white, three red, four green, five yellow” standard—now freshly hand-pulled in Malaysia.",
    'hero.cta.menu': 'View Menu',
    'hero.cta.reserve': 'Reserve Now',

    'section.about.title': 'About Us',
    'section.about.p0':
      "Originated in Lanzhou, Gansu (1799). Known for the “one clear, two white, three red, four green, five yellow” standard—now freshly hand-pulled in Malaysia.",
    'section.about.p1':
      '金味德 (Jinweide Beef Noodles) was founded in 1986 with headquarters in Lanzhou, Gansu. It is an international chain brand of Lanzhou beef noodles, with trademarks and operations in more than 60 countries including the USA, New Zealand, Spain, the Netherlands, Germany, the UK, and Malaysia, and over 100 chain stores overseas.',
    'section.about.p2':
      '“Jinweide, a legend originating from Lanzhou.” The brand focuses on authentic traditional Lanzhou beef noodles, complemented by northwest specialties such as roujiamo (Chinese hamburger), roasted meat, cold dishes, and snacks. It has received honors including “China Fast Food Top 50 (2018)” and “Outstanding Contribution Enterprise in Catering Model Innovation (40 Years of Reform and Opening-up)”.',

    'section.global.title': 'Global Footprint',
    'section.global.subtitle': 'Click a pin to view store photos around the world',

    'section.stores.title': 'Stores & Operating',
    'section.stores.subtitle': 'We are open on public holidays.',
    'store.opened': ({ date }) => `Opened: ${date}`,
    'store.openingSoon': ({ date }) => `Opening soon: ${date}`,
    'store.hours': 'Opening hours',
    'store.viewOnMaps': 'Open in Google Maps',

    'section.menu.title': 'Menu',
    'menu.subtitle': 'Click any image to zoom in',
    'menu.price': ({ value }) => `MYR ${value}`,

    'section.halal.title': 'Halal Status',
    'halal.p1':
      'We respect and follow halal requirements. Once a store obtains the relevant certification/approval, we will display the certificate and updates here.',
    'halal.p2': 'For the latest status, please contact us via WhatsApp.',
    'halal.badge': 'Halal Friendly',

    'section.news.title': 'News',
    'news.subtitle': 'Brand updates, openings, and promotions',

    'section.reservation.title': 'Reservation',
    'reservation.subtitle': 'Fill in the form and it will open WhatsApp with a pre-filled reservation message.',
    'reservation.name': 'Name',
    'reservation.phone': 'Phone',
    'reservation.store': 'Store',
    'reservation.date': 'Date',
    'reservation.time': 'Time',
    'reservation.pax': 'Guests',
    'reservation.note': 'Notes (optional)',
    'reservation.disclaimer':
      'the reservation does not guarantee you a seat but we will try to prioritize your seating upon arrival.',
    'reservation.submit': 'Send via WhatsApp',
    'reservation.placeholder.note': 'e.g. window seat, baby chair, allergy notes…',

    'section.contact.title': 'Contact Us',
    'contact.subtitle': 'Partnership / franchising / media inquiries',
    'contact.phone': 'Phone',
    'contact.email': 'Email',
    'contact.address': 'Address',
    'contact.follow': 'Follow',

    'footer.rights': () => `© 2022 JWD Mee Tarik (M). All rights reserved.`,
  },
  ms: {
    'nav.about': 'Tentang',
    'nav.stores': 'Cawangan',
    'nav.menu': 'Menu',
    'nav.halal': 'Halal',
    'nav.news': 'Berita',
    'nav.reservation': 'Tempahan',
    'nav.contact': 'Hubungi',

    'hero.title': 'Mee Tarik Lanzhou · Mee sup jernih tradisi dari Lanzhou',
    'hero.subtitle':
      'Berasal dari Lanzhou, Gansu (1799). Mengikut piawaian “satu jernih, dua putih, tiga merah, empat hijau, lima kuning”—kini mee tarik segar di Malaysia.',
    'hero.cta.menu': 'Lihat Menu',
    'hero.cta.reserve': 'Tempah Sekarang',

    'section.about.title': 'Tentang Kami',
    'section.about.p0':
      'Berasal dari Lanzhou, Gansu (1799). Mengikut piawaian “satu jernih, dua putih, tiga merah, empat hijau, lima kuning”—kini mee tarik segar di Malaysia.',
    'section.about.p1':
      '金味德 (Jinweide Beef Noodles) diasaskan pada tahun 1986 dan beribu pejabat di Lanzhou, Gansu. Ia merupakan jenama rangkaian antarabangsa mee sup daging Lanzhou, dengan tanda dagangan dan operasi di lebih 60 negara termasuk Amerika Syarikat, New Zealand, Sepanyol, Belanda, Jerman, United Kingdom dan Malaysia, serta mempunyai lebih 100 cawangan di luar negara.',
    'section.about.p2':
      '“Jinweide, legenda yang bermula dari Lanzhou.” Jenama ini menumpukan mee sup daging Lanzhou tradisional yang asli, serta hidangan istimewa barat laut seperti roujiamo, daging panggang, hidangan sejuk dan snek. Ia juga menerima pelbagai anugerah termasuk “China Fast Food Top 50 (2018)” dan “Outstanding Contribution Enterprise in Catering Model Innovation (40 Years of Reform and Opening-up)”.',

    'section.global.title': 'Jejak Global',
    'section.global.subtitle': 'Klik pin untuk melihat foto cawangan di seluruh dunia',

    'section.stores.title': 'Cawangan & Waktu Operasi',
    'section.stores.subtitle': 'Kami dibuka pada cuti umum.',
    'store.opened': ({ date }) => `Dibuka: ${date}`,
    'store.openingSoon': ({ date }) => `Akan dibuka: ${date}`,
    'store.hours': 'Waktu operasi',
    'store.viewOnMaps': 'Buka di Google Maps',

    'section.menu.title': 'Menu',
    'menu.subtitle': 'Klik gambar untuk zum',
    'menu.price': ({ value }) => `MYR ${value}`,

    'section.halal.title': 'Status Halal',
    'halal.p1':
      'Kami menghormati dan mematuhi keperluan halal. Setelah cawangan mendapat pensijilan/kelulusan berkaitan, sijil dan kemas kini akan dipaparkan di sini.',
    'halal.p2': 'Untuk status terkini, sila hubungi kami melalui WhatsApp.',
    'halal.badge': 'Halal Friendly',

    'section.news.title': 'Berita',
    'news.subtitle': 'Kemas kini jenama, pembukaan, dan promosi',

    'section.reservation.title': 'Tempahan',
    'reservation.subtitle': 'Isi borang dan WhatsApp akan dibuka dengan mesej tempahan siap diisi.',
    'reservation.name': 'Nama',
    'reservation.phone': 'Telefon',
    'reservation.store': 'Cawangan',
    'reservation.date': 'Tarikh',
    'reservation.time': 'Masa',
    'reservation.pax': 'Bilangan',
    'reservation.note': 'Nota (pilihan)',
    'reservation.disclaimer':
      'Tempahan tidak menjamin tempat duduk, namun kami akan cuba memberi keutamaan tempat duduk apabila anda tiba.',
    'reservation.submit': 'Hantar melalui WhatsApp',
    'reservation.placeholder.note': 'cth. tempat tepi tingkap, kerusi bayi, alahan…',

    'section.contact.title': 'Hubungi Kami',
    'contact.subtitle': 'Kerjasama / francais / pertanyaan media',
    'contact.phone': 'Telefon',
    'contact.email': 'Emel',
    'contact.address': 'Alamat',
    'contact.follow': 'Ikuti',

    'footer.rights': () => `© 2022 JWD Mee Tarik (M). All rights reserved.`,
  },
};

export const t = (lang: Lang, key: string, params?: I18nParams) => {
  const val = I18N[lang]?.[key] ?? I18N.zh[key] ?? key;
  if (typeof val === 'function') return val(params ?? {});
  return val;
};

export const detectLang = (browserLang: string): Lang => {
  const l = (browserLang ?? '').toLowerCase();
  if (l.startsWith('zh')) return 'zh';
  if (l.startsWith('ms')) return 'ms';
  return 'en';
};
