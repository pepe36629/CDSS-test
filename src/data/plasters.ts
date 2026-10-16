export type DressingCategory =
  | "Wound Cleansing"
  | "Debridement"
  | "Antimicrobial / Silver"
  | "Alginate / Hydrofiber"
  | "Foam"
  | "Hydrogel"
  | "Hydrocolloid"
  | "Film / Island Dressing"
  | "Skin Care";

export interface DressingProduct {
  category: DressingCategory;
  brand: string;
  manufacturer: string;
  description: string;
}

export const plasters: DressingProduct[] = [
  {
    category: "Wound Cleansing",
    brand: "Prontosan Irrigation",
    manufacturer: "B. Braun",
    description: "น้ำยาล้างแผล ขจัด Biofilm",
  },
  {
    category: "Debridement",
    brand: "DEBRICHEM",
    manufacturer: "DEBx Medical",
    description: "สารเคมีขจัด Biofilm และเนื้อตาย",
  },
  {
    category: "Antimicrobial / Silver",
    brand: "ACTICOAT",
    manufacturer: "Smith+Nephew",
    description: "แผ่นฟิล์มซิลเวอร์นาโน ฆ่าเชื้อ",
  },
  {
    category: "Antimicrobial / Silver",
    brand: "Cutimed Sorbact",
    manufacturer: "Essity",
    description: "จับแบคทีเรียด้วยกลไกกายภาพ ไม่ใช้ยา",
  },
  {
    category: "Alginate / Hydrofiber",
    brand: "Aquacel Extra",
    manufacturer: "Convatec",
    description: "เส้นใยซับน้ำเหลืองมาก เปลี่ยนเป็นเจล",
  },
  {
    category: "Foam",
    brand: "ALLEVYN Gentle Border",
    manufacturer: "Smith & Nephew",
    description: "โฟมซับน้ำเหลือง ขอบซิลิโคน",
  },
  {
    category: "Hydrogel",
    brand: "Intrasite Gel",
    manufacturer: "Smith & Nephew",
    description: "ไฮโดรเจลเพิ่มความชุ่มชื้น ย่อยเนื้อตาย",
  },
  {
    category: "Hydrocolloid",
    brand: "DuoDERM CGF",
    manufacturer: "Convatec",
    description: "ไฮโดรคอลลอยด์กักเก็บความชื้น",
  },
  {
    category: "Film / Island Dressing",
    brand: "Tegaderm Film",
    manufacturer: "3M",
    description: "ฟิล์มใสกันน้ำ ระบายอากาศได้",
  },
  {
    category: "Skin Care",
    brand: "Flamigel",
    manufacturer: "Flen Health",
    description: "เจลรักษาสมดุลความชื้น สำหรับแผลถลอก",
  },
];
