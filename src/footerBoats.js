// Line-art boats drawn as SVG paths: [path, hover colour]; a null colour stays outline-only.
// The waterline sits near the bottom edge of each drawing.

const c = (cx, cy, r) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0z`
const row = (n, x, step, fn) => Array.from({ length: n }, (_, i) => fn(x + i * step)).join('')

export const SVG_BOATS = {
  dhow: {
    width: 120,
    height: 110,
    paths: [
      ['M58 86V14', null],
      ['M32 28L98 12Q92 50 86 80H40Q44 52 32 28z', '#f6e7c8'],
      ['M50 24Q56 52 52 80M68 19Q73 50 70 80M30 30L100 10', null],
      ['M58 14l11 3-11 3z', '#e53935'],
      ['M8 86H112L100 102Q60 108 20 102z', '#8d5524'],
      ['M14 92H106M18 97H102', null],
    ],
  },
  trawler: {
    width: 140,
    height: 90,
    paths: [
      ['M40 66V14M40 18L18 60M40 18L64 60M18 60Q30 50 42 62Q52 52 64 60', null],
      ['M40 14l11 3-11 3z', '#ffca28'],
      ['M70 66V42H108V66z', '#fafafa'],
      ['M76 48h8v7h-8zM90 48h8v7h-8z', '#90caf9'],
      ['M66 42H112L108 35H70z', '#e53935'],
      ['M4 66H136L124 84Q70 90 16 84z', '#1e88e5'],
      ['M10 72H130', null],
    ],
  },
  ferry: {
    width: 170,
    height: 92,
    paths: [
      [c(104, 12, 5) + c(115, 7, 6) + c(128, 4, 5), '#e3eaf0'],
      ['M92 36V18H108V36z', '#ffb300'],
      ['M92 24H108', null],
      ['M44 48V36H124V48z', '#f5f5f5'],
      [row(7, 52, 10, (x) => `M${x} 40h6v5h-6z`), '#4fc3f7'],
      ['M18 64V48H150V64z', '#ffffff'],
      [row(11, 26, 11, (x) => `M${x} 52h7v6h-7z`), '#4fc3f7'],
      ['M2 64H168L156 82Q85 88 14 82z', '#c62828'],
      ['M8 70H162', null],
    ],
  },
  'snake-boat': {
    width: 220,
    height: 62,
    paths: [
      [row(14, 22, 12, (x) => `M${x} 44l-7 14`), null],
      [row(14, 22, 12, (x) => `M${x - 3} 46v-8h6v8z`), '#fafafa'],
      [row(14, 22, 12, (x) => c(x, 34, 3)), '#ffcc80'],
      ['M214 6l8 3-8 3z', '#e53935'],
      ['M4 46Q100 54 196 46Q206 30 214 6Q212 30 204 50Q100 60 8 52z', '#5d4037'],
      ['M10 49Q100 56 199 48', null],
    ],
  },
  yacht: {
    width: 110,
    height: 120,
    paths: [
      ['M50 96V8', null],
      ['M52 12Q70 52 92 90H52z', '#ff7043'],
      ['M48 16L14 90H48z', '#ffd54f'],
      ['M52 40H74M52 64H84', null],
      ['M6 96H104L94 110Q55 114 16 110z', '#fafafa'],
      ['M10 102H100', null],
    ],
  },
  rowboat: {
    width: 90,
    height: 60,
    paths: [
      ['M48 26L80 6M80 6V40', null],
      [c(44, 18, 5), '#f0c69c'],
      ['M36 15L44 8L52 15z', '#e9c46a'],
      ['M40 24h8l2 14H38z', '#2e7d32'],
      ['M4 42H86L78 54Q45 58 12 54z', '#a1662f'],
      ['M8 47H82', null],
    ],
  },
}
