export interface ClubConfig {
  id: string;
  clubCode: string; // Backend identifier
  name: string;
  nameKo: string;
  shortName: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    white: string;
    darkAccent: string;
    surface?: string;
  };
  links: {
    officialTickets: string;
    officialStore: string;
  };
  assets: {
    logoText: string;
  };
  design: {
    patternType: 'dots' | 'piping' | 'grunge' | 'cannon' | 'cockerel' | 'moon';
    fontType: 'bebas' | 'kanit';
  };
}

export const CLUBS: Record<string, ClubConfig> = {
  manutd: {
    id: 'manutd',
    clubCode: 'MAN_UTD',
    name: 'Manchester United',
    nameKo: '맨유',
    shortName: 'RED DEVILS',
    colors: {
      primary: '#DA291C',
      secondary: '#0f1015',
      accent: '#FFFFFF',
      white: '#FFFFFF',
      darkAccent: '#DA291C',
      surface: '#DA291C',
    },
    links: {
      officialTickets: 'https://tickets.manutd.com/?dd_referrer=https%3A%2F%2Fwww.manutd.com%2F&int_campaign=match_tickets&int_content=meganav&int_medium=menu&int_source=muwebsite&t=y',
      officialStore: 'https://store.manutd.com/',
    },
    assets: {
      logoText: 'DEVILS',
    },
    design: {
      patternType: 'dots',
      fontType: 'bebas',
    },
  },
  liverpool: {
    id: 'liverpool',
    clubCode: 'LIVERPOOL',
    name: 'Liverpool FC',
    nameKo: '리버풀',
    shortName: 'KOP',
    colors: {
      primary: '#C8102E',
      secondary: '#0a2f2d',
      accent: '#00B2A9',
      white: '#FFFFFF',
      darkAccent: '#00B2A9',
      surface: '#C8102E',
    },
    links: {
      officialTickets: 'https://www.liverpoolfc.com/tickets',
      officialStore: 'https://store.liverpoolfc.com/',
    },
    assets: {
      logoText: 'KOP',
    },
    design: {
      patternType: 'piping',
      fontType: 'kanit',
    },
  },
  chelsea: {
    id: 'chelsea',
    clubCode: 'CHELSEA',
    name: 'Chelsea FC',
    nameKo: '첼시',
    shortName: 'THE BLUES',
    colors: {
      primary: '#034694',
      secondary: '#003366',
      accent: '#EE242C',
      white: '#FFFFFF',
      darkAccent: '#EE242C',
      surface: '#034694',
    },
    links: {
      officialTickets: 'https://www.chelseafc.com/en/tickets',
      officialStore: 'https://store.chelseafc.com/',
    },
    assets: {
      logoText: 'BLUES',
    },
    design: {
      patternType: 'grunge',
      fontType: 'bebas',
    },
  },
  arsenal: {
    id: 'arsenal',
    clubCode: 'ARSENAL',
    name: 'Arsenal FC',
    nameKo: '아스날',
    shortName: 'GUNNERS',
    colors: {
      primary: '#EF0107', // Arsenal Red
      secondary: '#063672', // Arsenal Blue
      accent: '#DBA111', // Arsenal Gold
      white: '#FFFFFF',
      darkAccent: '#EF0107',
      surface: '#EF0107',
    },
    links: {
      officialTickets: 'https://www.arsenal.com/tickets',
      officialStore: 'https://arsenaldirect.arsenal.com/',
    },
    assets: {
      logoText: 'GUNNERS',
    },
    design: {
      patternType: 'cannon',
      fontType: 'bebas',
    },
  },
  tottenham: {
    id: 'tottenham',
    clubCode: 'TOTTENHAM',
    name: 'Tottenham Hotspur',
    nameKo: '토트넘',
    shortName: 'SPURS',
    colors: {
      primary: '#132257', // Navy Blue
      secondary: '#FFFFFF', // White
      accent: '#132257',
      white: '#FFFFFF',
      darkAccent: '#132257',
      surface: '#132257',
    },
    links: {
      officialTickets: 'https://www.tottenhamhotspur.com/tickets/',
      officialStore: 'https://shop.tottenhamhotspur.com/',
    },
    assets: {
      logoText: 'SPURS',
    },
    design: {
      patternType: 'cockerel',
      fontType: 'kanit',
    },
  },
  mancity: {
    id: 'mancity',
    clubCode: 'MAN_CITY',
    name: 'Manchester City',
    nameKo: '맨시티',
    shortName: 'CITIZENS',
    colors: {
      primary: '#85C6F2', // Sky Blue
      secondary: '#1C2C5B', // Dark Blue
      accent: '#FFC85F', // Gold/Yellow
      white: '#FFFFFF',
      darkAccent: '#85C6F2',
      surface: '#85C6F2',
    },
    links: {
      officialTickets: 'https://www.mancity.com/tickets',
      officialStore: 'https://shop.mancity.com/',
    },
    assets: {
      logoText: 'CITIZENS',
    },
    design: {
      patternType: 'moon',
      fontType: 'kanit',
    },
  },
};

export const CLUB_ORDER = [
  'arsenal',
  'mancity',
  'manutd',
  'liverpool',
  'chelsea',
  'tottenham',
];
