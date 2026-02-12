// Data Dummy untuk ATK Items
export interface Quotation {
  id: string;
  supplier: string;
  price: number;
  unit: string;
  remark?: string;
}

export interface AtkItem {
  id: string;
  ipd: string;
  description: string;
  specification: string;
  qty: number;
  uom: string;
  lastOrder: string;
  remark: string;
  foto: string;
  quotations: Quotation[];
}

export const atkItems: AtkItem[] = [
  {
    id: "1",
    ipd: "5010010010002",
    description: "Pulpen Ballpoint Biru",
    specification: "Tinta biru, diameter 0.7mm",
    qty: 500,
    uom: "BOX",
    lastOrder: "2025-12-15",
    remark: "Stok standar",
    foto: "https://via.placeholder.com/100?text=Pulpen+Biru",
    quotations: [
      { id: "q1", supplier: "Berkat Karya", price: 15000, unit: "Unit" },
      { id: "q2", supplier: "Smoothman", price: 14500, unit: "Unit" },
      { id: "q3", supplier: "Jaya Grafis", price: 16000, unit: "Unit" },
    ],
  },
  {
    id: "2",
    ipd: "5010010010003",
    description: "Pensil HB 2B",
    specification: "Pensil kayu, keras menengah",
    qty: 1000,
    uom: "BOX",
    lastOrder: "2025-12-10",
    remark: "Penggunaan umum",
    foto: "https://via.placeholder.com/100?text=Pensil",
    quotations: [
      { id: "q4", supplier: "Berkat Karya", price: 12000, unit: "Unit" },
      { id: "q5", supplier: "Smoothman", price: 11500, unit: "Unit" },
      { id: "q6", supplier: "Usaha Bersama", price: 13000, unit: "Unit" },
    ],
  },
  {
    id: "3",
    ipd: "5010010010004",
    description: "Kertas A4 80 gsm",
    specification: "Kertas putih 80 gsm, 500 lembar per rim",
    qty: 50,
    uom: "RIM",
    lastOrder: "2025-12-20",
    remark: "Kertas fotokopi standar",
    foto: "https://via.placeholder.com/100?text=Kertas+A4",
    quotations: [
      { id: "q7", supplier: "Berkat Karya", price: 55000, unit: "RIM" },
      { id: "q8", supplier: "Smoothman", price: 52000, unit: "RIM" },
      { id: "q9", supplier: "Usaha Bersama", price: 54500, unit: "RIM" },
    ],
  },
  {
    id: "4",
    ipd: "5010010010005",
    description: "Map Plastik Amplop",
    specification: "Map plastik transparan, A4 size",
    qty: 200,
    uom: "BOX",
    lastOrder: "2025-12-05",
    remark: "Penyimpanan dokumen",
    foto: "https://via.placeholder.com/100?text=Map+Plastik",
    quotations: [
      { id: "q10", supplier: "Berkat Karya", price: 25000, unit: "BOX" },
      { id: "q11", supplier: "Smoothman", price: 24000, unit: "BOX" },
      { id: "q12", supplier: "Pronto", price: 26000, unit: "BOX" },
    ],
  },
  {
    id: "5",
    ipd: "5010010010006",
    description: "Eraser Pensil Kecil",
    specification: "Penghapus putih, ukuran kecil",
    qty: 500,
    uom: "BOX",
    lastOrder: "2025-11-28",
    remark: "Aksesori kantor",
    foto: "https://via.placeholder.com/100?text=Eraser",
    quotations: [
      { id: "q13", supplier: "Berkat Karya", price: 8000, unit: "BOX" },
      { id: "q14", supplier: "Smoothman", price: 7500, unit: "BOX" },
      { id: "q15", supplier: "Usaha Bersama", price: 8500, unit: "BOX" },
    ],
  },
  {
    id: "6",
    ipd: "5010010010007",
    description: "Stapler Mini",
    specification: "Stapler plastik, kapasitas 20 lembar",
    qty: 30,
    uom: "PCS",
    lastOrder: "2025-12-01",
    remark: "Peralatan meja kerja",
    foto: "https://via.placeholder.com/100?text=Stapler",
    quotations: [
      { id: "q16", supplier: "Berkat Karya", price: 45000, unit: "PCS" },
      { id: "q17", supplier: "Smoothman", price: 42000, unit: "PCS" },
      { id: "q18", supplier: "Pronto", price: 48000, unit: "PCS" },
    ],
  },
  {
    id: "7",
    ipd: "5010010010008",
    description: "Staples Isi Ulang",
    specification: "Staples 23/6, 1000 pcs per box",
    qty: 100,
    uom: "BOX",
    lastOrder: "2025-11-30",
    remark: "Konsumsi stapler",
    foto: "https://via.placeholder.com/100?text=Staples",
    quotations: [
      { id: "q19", supplier: "Berkat Karya", price: 12000, unit: "BOX" },
      { id: "q20", supplier: "Smoothman", price: 11000, unit: "BOX" },
      { id: "q21", supplier: "Jaya Grafis", price: 13000, unit: "BOX" },
    ],
  },
  {
    id: "8",
    ipd: "5010010010009",
    description: "Marker Permanent Assorted",
    specification: "Marker warna, set 12 warna",
    qty: 50,
    uom: "SET",
    lastOrder: "2025-12-08",
    remark: "Alat tulis warna",
    foto: "https://via.placeholder.com/100?text=Marker",
    quotations: [
      { id: "q22", supplier: "Berkat Karya", price: 150000, unit: "SET" },
      { id: "q23", supplier: "Smoothman", price: 145000, unit: "SET" },
      { id: "q24", supplier: "Usaha Bersama", price: 155000, unit: "SET" },
    ],
  },
  {
    id: "9",
    ipd: "5010010010010",
    description: "Amplop Putih Besar",
    specification: "Amplop putih 10x24 cm",
    qty: 1000,
    uom: "PACK",
    lastOrder: "2025-12-12",
    remark: "Pengiriman surat",
    foto: "https://via.placeholder.com/100?text=Amplop",
    quotations: [
      { id: "q25", supplier: "Berkat Karya", price: 85000, unit: "PACK" },
      { id: "q26", supplier: "Smoothman", price: 80000, unit: "PACK" },
      { id: "q27", supplier: "Pronto", price: 87000, unit: "PACK" },
    ],
  },
  {
    id: "10",
    ipd: "5010010010011",
    description: "Lakban Cokelat",
    specification: "Lakban perekat cokelat 48mm x 50m",
    qty: 100,
    uom: "ROLL",
    lastOrder: "2025-12-18",
    remark: "Penyegelan kemasan",
    foto: "https://via.placeholder.com/100?text=Lakban",
    quotations: [
      { id: "q28", supplier: "Berkat Karya", price: 25000, unit: "ROLL" },
      { id: "q29", supplier: "Smoothman", price: 23000, unit: "ROLL" },
      { id: "q30", supplier: "Usaha Bersama", price: 26000, unit: "ROLL" },
    ],
  },
];
