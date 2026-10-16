export type WoundCause = "diabetes" | "pressure" | "surgical" | "abrasion";
export type TissueType = "necrotic" | "slough" | "granulation";
export type ExudateLevel = "low" | "moderate" | "heavy";
export type InfectionSigns = "no" | "yes";

export interface WoundAnswers {
  cause: WoundCause;
  tissue: TissueType;
  exudate: ExudateLevel;
  infection: InfectionSigns;
}

export type WoundAnswerKey = keyof WoundAnswers;
export type WoundAnswerValue = WoundAnswers[WoundAnswerKey];

export interface QuestionOption<T extends WoundAnswerValue = WoundAnswerValue> {
  value: T;
  label: string;
  description?: string;
}

export interface WoundQuestion {
  id: WoundAnswerKey;
  title: string;
  description: string;
  options: QuestionOption[];
}

export const questions: WoundQuestion[] = [
  {
    id: "cause",
    title: "แผลเกิดจากสาเหตุใด?",
    description: "เลือกสาเหตุหลักของแผลที่ต้องการประเมิน",
    options: [
      { value: "diabetes", label: "แผลเบาหวาน" },
      { value: "pressure", label: "แผลกดทับ" },
      { value: "surgical", label: "แผลผ่าตัด" },
      { value: "abrasion", label: "แผลถลอก" },
    ],
  },
  {
    id: "tissue",
    title: "พบเนื้อเยื่อชนิดใดในแผล?",
    description: "พิจารณาลักษณะเนื้อเยื่อหลักบริเวณพื้นแผล",
    options: [
      { value: "necrotic", label: "เนื้อตาย", description: "เนื้อเยื่อสีดำหรือน้ำตาล" },
      { value: "slough", label: "เนื้อเยื่อสลัฟ", description: "เนื้อเยื่อสีเหลืองหรือขาว" },
      { value: "granulation", label: "เนื้อเยื่อแกรนูเลชัน", description: "เนื้อเยื่อสีแดงหรือชมพู" },
    ],
  },
  {
    id: "exudate",
    title: "แผลมีสารคัดหลั่งมากน้อยเพียงใด?",
    description: "ประเมินปริมาณสารคัดหลั่งที่แผลในช่วงปัจจุบัน",
    options: [
      { value: "low", label: "น้อย" },
      { value: "moderate", label: "ปานกลาง" },
      { value: "heavy", label: "มาก" },
    ],
  },
  {
    id: "infection",
    title: "มีสัญญาณบ่งชี้การติดเชื้อหรือไม่?",
    description: "พิจารณาจากอาการและการประเมินทางคลินิก",
    options: [
      { value: "no", label: "ไม่มี" },
      { value: "yes", label: "มี" },
    ],
  },
];
