/**
 * Исторические данные Берлина.
 * Координаты — WGS84 [lon, lat]. Годы — по данным общедоступных источников.
 * Границы застройки (urban extents) — стилизованная аппроксимация.
 */

export type Landmark = {
  id: string;
  name: string;
  nameRu?: string;
  coord: [number, number];
  built: number; // год появления
  gone?: number; // год исчезновения/сноса
  kind: "building" | "infra" | "wall" | "event";
  note: string;
};

/** Знаковые объекты и события */
export const LANDMARKS: Landmark[] = [
  { id: "brandenburger-tor", name: "Brandenburger Tor", nameRu: "Бранденбургские ворота", coord: [13.37770, 52.51628], built: 1791, kind: "building", note: "Построены по проекту Лангханса. 1961–1989 — в полосе отчуждения, недоступны." },
  { id: "reichstag", name: "Reichstag", nameRu: "Рейхстаг", coord: [13.37613, 52.51861], built: 1894, kind: "building", note: "Пожар 1933, руина после 1945, восстановлен 1961–1973, стеклянный купол Нормана Фостера — 1999." },
  { id: "fernsehturm", name: "Fernsehturm", nameRu: "Телебашня", coord: [13.40942, 52.52080], built: 1969, kind: "building", note: "368 м, строилась 1965–1969, символ столицы ГДР." },
  { id: "stadtschloss", name: "Berliner Stadtschloss", nameRu: "Городской дворец", coord: [13.40170, 52.51760], built: 1451, gone: 1950, kind: "building", note: "Повреждён в войну, взорван в 1950 по решению властей ГДР." },
  { id: "palast", name: "Palast der Republik", nameRu: "Дворец Республики", coord: [13.40220, 52.51800], built: 1976, gone: 2008, kind: "building", note: "Народная палата ГДР. Закрыт в 1990 из-за асбеста, демонтирован 2006–2008." },
  { id: "humboldt", name: "Humboldt Forum", nameRu: "Форум Гумбольдта", coord: [13.40170, 52.51760], built: 2020, kind: "building", note: "Реконструкция барочных фасадов дворца, строительство 2013–2020." },
  { id: "hauptbahnhof", name: "Berlin Hauptbahnhof", nameRu: "Главный вокзал", coord: [13.36940, 52.52500], built: 2006, kind: "infra", note: "Построен 1998–2006 на месте товарной станции Лертер Бангоф." },
  { id: "lehrter", name: "Lehrter Bahnhof", coord: [13.36850, 52.52560], built: 1871, gone: 1959, kind: "infra", note: "Разрушен в войну, здание снесено в 1957–1959." },
  { id: "anhalter", name: "Anhalter Bahnhof", coord: [13.38200, 52.50400], built: 1880, gone: 1960, kind: "infra", note: "«Ворота в южную Европу». Разрушен бомбардировками, портик сохранён, зал снесён в 1960." },
  { id: "potsdamer", name: "Potsdamer Platz", nameRu: "Потсдамская площадь", coord: [13.37600, 52.50950], built: 1838, kind: "event", note: "Оживлённейшая площадь Европы до 1939; 1945 — руины; 1961–1989 — пустырь у Стены; 1994–2000 — новый квартал." },
  { id: "sonycenter", name: "Sony Center", coord: [13.37330, 52.50950], built: 2000, kind: "building", note: "Квартал Хельмута Яна, 1996–2000." },
  { id: "kollhoff", name: "Kollhoff-Tower", coord: [13.37560, 52.50890], built: 1999, kind: "building", note: "Кирпичная высотка на Потсдамер-плац." },
  { id: "checkpoint", name: "Checkpoint Charlie", coord: [13.39040, 52.50750], built: 1961, gone: 1990, kind: "wall", note: "КПП союзников на Фридрихштрассе; танковое противостояние в октябре 1961." },
  { id: "traenenpalast", name: "Tränenpalast", coord: [13.38700, 52.52050], built: 1962, kind: "building", note: "Павильон выезда на вокзале Фридрихштрассе — «Дворец слёз»." },
  { id: "eastside", name: "East Side Gallery", coord: [13.43970, 52.50520], built: 1990, kind: "wall", note: "1,3 км сохранённой Стены, расписанной художниками в 1990." },
  { id: "bernauer", name: "Gedenkstätte Berliner Mauer", coord: [13.39100, 52.53530], built: 1998, kind: "wall", note: "Мемориал на Бернауэр-штрассе: окна домов замуровывались в 1961." },
  { id: "siegessaeule", name: "Siegessäule", nameRu: "Колонна Победы", coord: [13.35000, 52.51450], built: 1939, kind: "building", note: "Перенесена с Кёнигсплац на Гроссер-Штерн в 1938–1939 и надстроена." },
  { id: "siegessaeule-old", name: "Siegessäule (Königsplatz)", coord: [13.37390, 52.51950], built: 1873, gone: 1938, kind: "building", note: "Первоначальное место — перед Рейхстагом." },
  { id: "funkturm", name: "Funkturm", nameRu: "Радиобашня", coord: [13.27860, 52.50500], built: 1926, kind: "building", note: "«Длинный Лулач», 147 м, сталь, 1924–1926." },
  { id: "icc", name: "ICC Berlin", coord: [13.27740, 52.50530], built: 1979, kind: "building", note: "Конгресс-центр, 1975–1979, один из крупнейших в мире." },
  { id: "olympia", name: "Olympiastadion", coord: [13.23940, 52.51470], built: 1936, kind: "building", note: "Построен к Олимпиаде 1936 на месте Немецкого стадиона 1913 года." },
  { id: "gedaechtnis", name: "Kaiser-Wilhelm-Gedächtniskirche", coord: [13.33500, 52.50480], built: 1895, kind: "building", note: "Разрушена в ноябре 1943; руина сохранена, новая церковь Эйермана — 1961–1963." },
  { id: "europacenter", name: "Europa-Center", coord: [13.33600, 52.50450], built: 1965, kind: "building", note: "Символ «витрины Запада» на Курфюрстендамм." },
  { id: "kadewe", name: "KaDeWe", coord: [13.34260, 52.50200], built: 1907, kind: "building", note: "Крупнейший универмаг континентальной Европы." },
  { id: "philharmonie", name: "Philharmonie", coord: [13.36980, 52.51000], built: 1963, kind: "building", note: "Шарун, «цирк Караяна», начало Культурфорума." },
  { id: "neue-nationalgalerie", name: "Neue Nationalgalerie", coord: [13.36730, 52.50670], built: 1968, kind: "building", note: "Мис ван дер Роэ, стальной «храм света»." },
  { id: "staatsbib", name: "Staatsbibliothek", coord: [13.37220, 52.50780], built: 1978, kind: "building", note: "Шарун/Виснер — «Небо над Берлином»." },
  { id: "hdkw", name: "Haus der Kulturen der Welt", coord: [13.36500, 52.51900], built: 1957, kind: "building", note: "Конгресс-холл, подарок США; обрушение крыши 1980, восстановлен 1987." },
  { id: "hansaviertel", name: "Hansaviertel (Interbau)", coord: [13.34200, 52.51800], built: 1957, kind: "building", note: "Международная строительная выставка 1957 — витрина Запада против Сталиналлее." },
  { id: "kma", name: "Karl-Marx-Allee", coord: [13.43000, 52.51800], built: 1958, kind: "building", note: "«Сталиналлее»: дворцы для рабочих, 1952–1960; переименована в 1961." },
  { id: "hausdeslehrers", name: "Haus des Lehrers", coord: [13.41550, 52.52150], built: 1964, kind: "building", note: "Фриз «Наша жизнь» Вальтера Вомаки." },
  { id: "weltzeituhr", name: "Weltzeituhr", nameRu: "Часы мира", coord: [13.41320, 52.52150], built: 1969, kind: "building", note: "Урания-Weltzeituhr на Александерплац." },
  { id: "nikolaiviertel", name: "Nikolaiviertel", coord: [13.40750, 52.51650], built: 1987, kind: "building", note: "Воссоздан к 750-летию Берлина из панельных домов «под старину»." },
  { id: "marxengels", name: "Marx-Engels-Forum", coord: [13.40460, 52.51880], built: 1986, kind: "building", note: "Памятник на месте снесённого квартала у Ратуши." },
  { id: "rotesrathaus", name: "Rotes Rathaus", coord: [13.40860, 52.51860], built: 1869, kind: "building", note: "Краснокирпичная ратуша; восстановлена после войны к 1956." },
  { id: "berlinerdom", name: "Berliner Dom", coord: [13.40100, 52.51900], built: 1905, kind: "building", note: "Купол разрушен в 1944, восстановление 1975–1993 (и далее)." },
  { id: "altesmuseum", name: "Altes Museum", coord: [13.39830, 52.51970], built: 1830, kind: "building", note: "Шинкель; начало Музейного острова." },
  { id: "tempelhof", name: "Flughafen Tempelhof", coord: [13.39000, 52.47300], built: 1936, gone: 2008, kind: "infra", note: "Терминал 1936–1941; «воздушный мост» 1948–1949; с 2010 — народный парк." },
  { id: "tempelhofer-feld", name: "Tempelhofer Feld (Park)", coord: [13.40200, 52.47500], built: 2010, kind: "infra", note: "Аэродром открыт как парк площадью 355 га." },
  { id: "tegel", name: "Flughafen Tegel", coord: [13.28770, 52.55970], built: 1948, gone: 2020, kind: "infra", note: "Построен за 90 дней в 1948 для воздушного моста; шестиугольный терминал — 1974; закрыт 8.11.2020." },
  { id: "ber", name: "Flughafen BER", coord: [13.50330, 52.36670], built: 2020, kind: "infra", note: "Строился с 2006, открыт 31.10.2020." },
  { id: "schoenefeld", name: "Flughafen Schönefeld", coord: [13.52200, 52.38800], built: 1946, kind: "infra", note: "Главный аэропорт ГДР." },
  { id: "mercedes", name: "Uber Arena (O2 World)", coord: [13.44300, 52.50600], built: 2008, kind: "building", note: "Начало застройки Mediaspree на бывшей пограничной полосе." },
  { id: "mallofberlin", name: "Mall of Berlin", coord: [13.37890, 52.51000], built: 2014, kind: "building", note: "На месте универмага Wertheim и пустыря Лейпцигер-плац." },
  { id: "spreepark", name: "Spreepark Plänterwald", coord: [13.49200, 52.48300], built: 1969, gone: 2002, kind: "infra", note: "Единственный парк аттракционов ГДР; закрыт в 2002." },
  { id: "velodrom", name: "Velodrom", coord: [13.44900, 52.54100], built: 1997, kind: "building", note: "Доминик Перро, «врезанный в землю» стадион." },
  { id: "bierpinsel", name: "Bierpinsel", coord: [13.32280, 52.45680], built: 1976, kind: "building", note: "Поп-арт-башня в Штеглице." },
  { id: "nkz", name: "Neues Kreuzberger Zentrum", coord: [13.41800, 52.49900], built: 1974, kind: "building", note: "Мегаструктура у Коттбуссер Тор." },
  { id: "marzahn", name: "Großsiedlung Marzahn", coord: [13.55800, 52.54500], built: 1979, kind: "building", note: "Крупнейший панельный район ГДР, 1977–1989, более 100 000 жителей." },
  { id: "gropiusstadt", name: "Gropiusstadt", coord: [13.46500, 52.42500], built: 1968, kind: "building", note: "Западный «город в городе» по плану Вальтера Гропиуса, 1962–1975." },
  { id: "maerkisches", name: "Märkisches Viertel", coord: [13.36000, 52.60000], built: 1968, kind: "building", note: "Западноберлинский крупнопанельный район, 1963–1974." },
  { id: "hellersdorf", name: "Hellersdorf", coord: [13.61000, 52.53600], built: 1986, kind: "building", note: "Последняя большая стройка ГДР, 1985–1990." },
  { id: "charlottenburg", name: "Schloss Charlottenburg", coord: [13.29600, 52.52090], built: 1699, kind: "building", note: "Летний дворец Софии Шарлотты; восстановлен после войны." },
  { id: "ostbahnhof", name: "Ostbahnhof", coord: [13.43450, 52.51050], built: 1842, kind: "infra", note: "Менял имена: Frankfurter Bahnhof → Schlesischer → Hauptbahnhof (1987) → Ostbahnhof (1998)." },
  { id: "stadtbahn", name: "Stadtbahn", coord: [13.39500, 52.52100], built: 1882, kind: "infra", note: "Эстакада через центр: Шарлоттенбург — Александерплац." },
  { id: "ubahn1", name: "Erste U-Bahn", coord: [13.44400, 52.50200], built: 1902, kind: "infra", note: "Первая линия надземки Штралауэр Тор — Потсдамер Плац." },
  { id: "luftbruecke", name: "Luftbrückendenkmal", coord: [13.38700, 52.48400], built: 1951, kind: "event", note: "«Голодные грабли» — памятник воздушному мосту 1948/49." },
  { id: "wall-build", name: "Bau der Mauer", coord: [13.37800, 52.51600], built: 1961, gone: 1989, kind: "event", note: "13 августа 1961 — начало строительства; 9 ноября 1989 — падение." },
];

/** Переименования улиц: ключ — современное имя в OSM */
export type Rename = { current: string; history: { name: string; from: number; to: number }[] };

export const STREET_RENAMES: Rename[] = [
  { current: "Karl-Marx-Allee", history: [
    { name: "Stalinallee", from: 1949, to: 1961 },
    { name: "Große Frankfurter Straße", from: 1700, to: 1949 },
  ]},
  { current: "Frankfurter Allee", history: [
    { name: "Stalinallee", from: 1949, to: 1961 },
  ]},
  { current: "Torstraße", history: [
    { name: "Wilhelm-Pieck-Straße", from: 1951, to: 1994 },
    { name: "Elsasser Straße / Lothringer Straße", from: 1800, to: 1951 },
  ]},
  { current: "Straße des 17. Juni", history: [
    { name: "Charlottenburger Chaussee", from: 1700, to: 1953 },
  ]},
  { current: "Dorotheenstraße", history: [
    { name: "Clara-Zetkin-Straße", from: 1951, to: 1995 },
  ]},
  { current: "Wilhelmstraße", history: [
    { name: "Otto-Grotewohl-Straße", from: 1964, to: 1993 },
  ]},
  { current: "Niederkirchnerstraße", history: [
    { name: "Prinz-Albrecht-Straße", from: 1800, to: 1951 },
  ]},
  { current: "Otto-Braun-Straße", history: [
    { name: "Hans-Beimler-Straße", from: 1966, to: 1995 },
    { name: "Neue Königstraße", from: 1800, to: 1966 },
  ]},
  { current: "Littenstraße", history: [
    { name: "Neue Friedrichstraße", from: 1800, to: 1951 },
  ]},
  { current: "Landsberger Allee", history: [
    { name: "Leninallee", from: 1950, to: 1992 },
  ]},
  { current: "Danziger Straße", history: [
    { name: "Dimitroffstraße", from: 1950, to: 1995 },
  ]},
  { current: "Weißenseer Weg", history: [
    { name: "Ho-Chi-Minh-Straße", from: 1966, to: 1991 },
  ]},
  { current: "Karl-Liebknecht-Straße", history: [
    { name: "Kaiser-Wilhelm-Straße", from: 1886, to: 1947 },
  ]},
  { current: "Karl-Marx-Straße", history: [
    { name: "Berliner Straße", from: 1800, to: 1947 },
  ]},
  { current: "Straße der Pariser Kommune", history: [
    { name: "Fruchtstraße", from: 1800, to: 1971 },
  ]},
  { current: "Rathausstraße", history: [
    { name: "Königstraße", from: 1700, to: 1951 },
  ]},
  { current: "Anton-Wilhelm-Amo-Straße", history: [
    { name: "Mohrenstraße", from: 1707, to: 2024 },
  ]},
  { current: "Theodor-Heuss-Platz", history: [
    { name: "Reichskanzlerplatz", from: 1947, to: 1963 },
    { name: "Adolf-Hitler-Platz", from: 1933, to: 1945 },
    { name: "Reichskanzlerplatz", from: 1906, to: 1933 },
  ]},
  { current: "Ernst-Reuter-Platz", history: [
    { name: "Knie", from: 1800, to: 1953 },
  ]},
  { current: "Breitscheidplatz", history: [
    { name: "Auguste-Viktoria-Platz", from: 1892, to: 1947 },
  ]},
  { current: "Mehringplatz", history: [
    { name: "Belle-Alliance-Platz", from: 1815, to: 1947 },
  ]},
  { current: "Bebelplatz", history: [
    { name: "August-Bebel-Platz", from: 1947, to: 2000 },
    { name: "Opernplatz", from: 1800, to: 1947 },
  ]},
  { current: "Gendarmenmarkt", history: [
    { name: "Platz der Akademie", from: 1950, to: 1991 },
  ]},
  { current: "Schloßplatz", history: [
    { name: "Marx-Engels-Platz", from: 1951, to: 1994 },
  ]},
  { current: "Rosa-Luxemburg-Platz", history: [
    { name: "Liebknechtplatz", from: 1945, to: 1947 },
    { name: "Horst-Wessel-Platz", from: 1933, to: 1945 },
    { name: "Bülowplatz", from: 1910, to: 1933 },
  ]},
  { current: "Platz der Luftbrücke", history: [
    { name: "Flughafenring", from: 1930, to: 1949 },
  ]},
];

/** Участки, выглядевшие иначе: накрывают современную застройку */
export type Patch = {
  id: string;
  label?: string;
  from: number;
  to: number;
  fill: "ground" | "rubble" | "rail" | "fields" | "water" | "airfield";
  coords: [number, number][];
};

const rect = (w: number, s: number, e: number, n: number): [number, number][] => [
  [w, s], [e, s], [e, n], [w, n], [w, s],
];

export const PATCHES: Patch[] = [
  { id: "potsdamer-brache", label: "Brache am Potsdamer Platz", from: 1945, to: 1994, fill: "ground",
    coords: [[13.3690, 52.5065], [13.3812, 52.5058], [13.3826, 52.5103], [13.3800, 52.5134], [13.3700, 52.5130], [13.3690, 52.5065]] },
  { id: "europacity", label: "Güterbahnhof / Brache", from: 1945, to: 2004, fill: "rail",
    coords: rect(13.3600, 52.5225, 13.3790, 52.5330) },
  { id: "schlossplatz-parade", label: "Marx-Engels-Platz (Aufmarschplatz)", from: 1951, to: 1973, fill: "ground",
    coords: rect(13.3985, 52.5160, 13.4045, 52.5195) },
  { id: "schlossplatz-lot", label: "Baugrube / Rasen", from: 2009, to: 2019, fill: "ground",
    coords: rect(13.3985, 52.5160, 13.4045, 52.5195) },
  { id: "mediaspree", label: "Brache an der Spree", from: 1961, to: 2007, fill: "ground",
    coords: rect(13.4330, 52.5020, 13.4500, 52.5085) },
  { id: "marzahn-felder", label: "Rieselfelder & Dörfer", from: 1800, to: 1977, fill: "fields",
    coords: rect(13.5300, 52.5300, 13.6050, 52.5700) },
  { id: "hellersdorf-felder", label: "Felder", from: 1800, to: 1985, fill: "fields",
    coords: rect(13.5850, 52.5180, 13.6400, 52.5450) },
  { id: "gropiusstadt-felder", label: "Felder & Kleingärten", from: 1800, to: 1962, fill: "fields",
    coords: rect(13.4500, 52.4150, 13.4850, 52.4360) },
  { id: "maerkisches-felder", label: "Rieselfelder", from: 1800, to: 1963, fill: "fields",
    coords: rect(13.3430, 52.5930, 13.3790, 52.6120) },
  { id: "ber-felder", label: "Felder bei Selchow", from: 1800, to: 2006, fill: "fields",
    coords: rect(13.4800, 52.3520, 13.5450, 52.3800) },
  { id: "tempelhof-air", label: "Flughafen Tempelhof", from: 1923, to: 2008, fill: "airfield",
    coords: rect(13.3830, 52.4680, 13.4190, 52.4835) },
  { id: "tegel-air", label: "Flughafen Tegel", from: 1948, to: 2020, fill: "airfield",
    coords: rect(13.2740, 52.5470, 13.3050, 52.5680) },
];

/** Здания, которых сегодня нет — рисуем поверх карты */
export type HistBuilding = {
  id: string;
  label: string;
  from: number;
  to: number;
  coords: [number, number][];
};

export const HIST_BUILDINGS: HistBuilding[] = [
  { id: "stadtschloss", label: "Berliner Schloss", from: 1451, to: 1950,
    coords: rect(13.39930, 52.51650, 13.40390, 52.51880) },
  { id: "palast", label: "Palast der Republik", from: 1976, to: 2008,
    coords: rect(13.40080, 52.51730, 13.40440, 52.51860) },
  { id: "staatsrat", label: "Staatsratsgebäude", from: 1964, to: 2100,
    coords: rect(13.40120, 52.51560, 13.40430, 52.51640) },
  { id: "aussenministerium", label: "Außenministerium der DDR", from: 1967, to: 1995,
    coords: rect(13.39730, 52.51560, 13.40050, 52.51700) },
  { id: "anhalter", label: "Anhalter Bahnhof", from: 1880, to: 1960,
    coords: rect(13.38080, 52.50300, 13.38450, 52.50470) },
  { id: "lehrter", label: "Lehrter Bahnhof", from: 1871, to: 1959,
    coords: rect(13.36700, 52.52480, 13.37050, 52.52620) },
  { id: "reichskanzlei", label: "Neue Reichskanzlei", from: 1939, to: 1949,
    coords: rect(13.38020, 52.51060, 13.38350, 52.51230) },
  { id: "sportpalast", label: "Berliner Sportpalast", from: 1910, to: 1973,
    coords: rect(13.35650, 52.49600, 13.35850, 52.49700) },
  { id: "ahornblatt", label: "Ahornblatt (Mensa)", from: 1973, to: 2000,
    coords: rect(13.40700, 52.51200, 13.40850, 52.51280) },
  { id: "wertheim", label: "Warenhaus Wertheim", from: 1897, to: 1955,
    coords: rect(13.37700, 52.50930, 13.38050, 52.51080) },
  { id: "hotel-adlon-alt", label: "Hotel Adlon (alt)", from: 1907, to: 1945,
    coords: rect(13.38000, 52.51580, 13.38160, 52.51660) },
  { id: "schlossfreiheit", label: "Nationaldenkmal Wilhelm I.", from: 1897, to: 1950,
    coords: rect(13.39830, 52.51680, 13.39930, 52.51800) },
];

/** Приблизительные контуры застроенной территории */
export type Extent = { year: number; main: { c: [number, number]; rx: number; ry: number }; sats: { c: [number, number]; r: number; name?: string }[] };

export const URBAN_EXTENTS: Extent[] = [
  { year: 1850, main: { c: [13.398, 52.518], rx: 0.030, ry: 0.016 }, sats: [
    { c: [13.200, 52.535], r: 0.012, name: "Spandau" },
    { c: [13.578, 52.445], r: 0.010, name: "Köpenick" },
    { c: [13.065, 52.400], r: 0.014, name: "Potsdam" },
  ]},
  { year: 1875, main: { c: [13.398, 52.518], rx: 0.048, ry: 0.026 }, sats: [
    { c: [13.200, 52.535], r: 0.014, name: "Spandau" },
    { c: [13.578, 52.445], r: 0.012, name: "Köpenick" },
    { c: [13.290, 52.585], r: 0.010, name: "Tegel" },
    { c: [13.065, 52.400], r: 0.016, name: "Potsdam" },
  ]},
  { year: 1900, main: { c: [13.395, 52.517], rx: 0.075, ry: 0.040 }, sats: [
    { c: [13.200, 52.535], r: 0.020, name: "Spandau" },
    { c: [13.578, 52.445], r: 0.016, name: "Köpenick" },
    { c: [13.290, 52.588], r: 0.013, name: "Tegel" },
    { c: [13.258, 52.433], r: 0.015, name: "Zehlendorf" },
    { c: [13.640, 52.455], r: 0.012, name: "Friedrichshagen" },
  ]},
  { year: 1920, main: { c: [13.392, 52.515], rx: 0.105, ry: 0.055 }, sats: [
    { c: [13.198, 52.537], r: 0.028, name: "Spandau" },
    { c: [13.585, 52.448], r: 0.024, name: "Köpenick" },
    { c: [13.255, 52.430], r: 0.022, name: "Zehlendorf" },
    { c: [13.640, 52.455], r: 0.014, name: "Friedrichshagen" },
  ]},
  { year: 1940, main: { c: [13.390, 52.514], rx: 0.135, ry: 0.070 }, sats: [
    { c: [13.198, 52.537], r: 0.034, name: "Spandau" },
    { c: [13.590, 52.448], r: 0.030, name: "Köpenick" },
    { c: [13.645, 52.455], r: 0.016, name: "Friedrichshagen" },
  ]},
  { year: 1965, main: { c: [13.388, 52.513], rx: 0.160, ry: 0.082 }, sats: [
    { c: [13.195, 52.537], r: 0.040, name: "Spandau" },
    { c: [13.595, 52.448], r: 0.034, name: "Köpenick" },
  ]},
  { year: 1985, main: { c: [13.388, 52.513], rx: 0.185, ry: 0.095 }, sats: [
    { c: [13.193, 52.537], r: 0.046, name: "Spandau" },
    { c: [13.600, 52.448], r: 0.040, name: "Köpenick" },
  ]},
];

/** Ключевые годы для быстрых переходов */
export const PRESETS: { year: number; label: string; hint: string }[] = [
  { year: 2026, label: "2026", hint: "Сегодня" },
  { year: 2010, label: "2010", hint: "Темпельхофер Фельд открыт как парк" },
  { year: 1999, label: "1999", hint: "Переезд правительства, купол Рейхстага" },
  { year: 1989, label: "1989", hint: "Падение Стены" },
  { year: 1975, label: "1975", hint: "Разделённый город, расцвет ГДР-модернизма" },
  { year: 1961, label: "1961", hint: "13 августа — построена Стена" },
  { year: 1953, label: "1953", hint: "Восстание 17 июня" },
  { year: 1948, label: "1948", hint: "Блокада и воздушный мост" },
  { year: 1936, label: "1936", hint: "Олимпиада, «Германия» Шпеера" },
  { year: 1920, label: "1920", hint: "Создание Большого Берлина" },
  { year: 1900, label: "1900", hint: "Имперская столица, доходные дома" },
  { year: 1875, label: "1875", hint: "Грюндерцайт" },
  { year: 1850, label: "1850", hint: "Железные дороги и первые заводы" },
];

export const MIN_YEAR = 1850;
export const MAX_YEAR = 2026;
