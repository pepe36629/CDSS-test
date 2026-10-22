import { plasters, type DressingCategory, type DressingProduct } from "../data/plasters";
import type { WoundAnswers } from "../data/questions";

export interface WoundEvaluation {
  woundTypeEval: string;
  clinical_reason: string;
  recommended_category: DressingCategory;
  recommended_products: DressingProduct[];
  alternative_products: DressingProduct[];
}

export function evaluateWound(
  answers: WoundAnswers,
  availableBrands?: ReadonlySet<string>,
): WoundEvaluation {
  let recommendedCategory: DressingCategory;
  let clinicalReason: string;

  if (answers.cause === "diabetes" || answers.cause === "pressure") {
    if (answers.infection === "yes") {
      recommendedCategory = "Antimicrobial / Silver";
      clinicalReason = "พบสัญญาณติดเชื้อ จึงพิจารณากลุ่มวัสดุปิดแผลต้านจุลชีพ";
    } else if (answers.tissue === "slough" || answers.tissue === "necrotic") {
      recommendedCategory = "Hydrogel";
      clinicalReason = "ไม่พบสัญญาณติดเชื้อและมีเนื้อเยื่อสลัฟหรือเนื้อตาย จึงพิจารณากลุ่มไฮโดรเจล";
    } else if (answers.exudate === "heavy") {
      recommendedCategory = "Alginate / Hydrofiber";
      clinicalReason = "ไม่พบสัญญาณติดเชื้อหรือเนื้อเยื่อสลัฟ/เนื้อตาย และมีสารคัดหลั่งมาก จึงพิจารณากลุ่มแอลจิเนต/ไฮโดรไฟเบอร์";
    } else {
      recommendedCategory = "Foam";
      clinicalReason = "ไม่เข้าเงื่อนไขข้างต้น จึงพิจารณากลุ่มโฟม";
    }
  } else if (answers.cause === "surgical") {
    if (answers.infection === "yes") {
      recommendedCategory = "Antimicrobial / Silver";
      clinicalReason = "พบสัญญาณติดเชื้อ จึงพิจารณากลุ่มวัสดุปิดแผลต้านจุลชีพ";
    } else if (answers.exudate === "heavy") {
      recommendedCategory = "Alginate / Hydrofiber";
      clinicalReason = "ไม่พบสัญญาณติดเชื้อและมีสารคัดหลั่งมาก จึงพิจารณากลุ่มแอลจิเนต/ไฮโดรไฟเบอร์";
    } else {
      recommendedCategory = "Film / Island Dressing";
      clinicalReason = "ไม่พบสัญญาณติดเชื้อและมีสารคัดหลั่งไม่มาก จึงพิจารณากลุ่มฟิล์มหรือแผ่นปิดแผล";
    }
  } else if (answers.infection === "no" && answers.exudate === "low") {
    recommendedCategory = "Hydrocolloid";
    clinicalReason = "เป็นแผลถลอก ไม่มีสัญญาณติดเชื้อ และมีสารคัดหลั่งน้อย จึงพิจารณากลุ่มไฮโดรคอลลอยด์";
  } else if (answers.infection === "yes") {
    recommendedCategory = "Antimicrobial / Silver";
    clinicalReason = "พบสัญญาณติดเชื้อ จึงพิจารณากลุ่มวัสดุปิดแผลต้านจุลชีพ";
  } else {
    recommendedCategory = "Foam";
    clinicalReason = "เป็นแผลถลอกที่ไม่เข้าเงื่อนไขไฮโดรคอลลอยด์ จึงพิจารณากลุ่มโฟม";
  }

  const recommendedProducts = plasters.filter(
    (product) =>
      product.category === recommendedCategory ||
      product.category === "Wound Cleansing",
  ).filter(
    (product) =>
      availableBrands === undefined || availableBrands.has(product.brand),
  );
  const alternativeProducts =
    availableBrands === undefined
      ? []
      : plasters.filter(
          (product) =>
            product.category !== recommendedCategory &&
            product.category !== "Wound Cleansing" &&
            availableBrands.has(product.brand),
        );

  return {
    woundTypeEval: `${getCauseLabel(answers.cause)} · ${getTissueLabel(answers.tissue)} · สารคัดหลั่ง${getExudateLabel(answers.exudate)} · ${answers.infection === "yes" ? "มี" : "ไม่มี"}สัญญาณติดเชื้อ`,
    clinical_reason: clinicalReason,
    recommended_category: recommendedCategory,
    recommended_products: recommendedProducts,
    alternative_products: alternativeProducts,
  };
}

function getCauseLabel(cause: WoundAnswers["cause"]): string {
  const labels: Record<WoundAnswers["cause"], string> = {
    diabetes: "แผลเบาหวาน",
    pressure: "แผลกดทับ",
    surgical: "แผลผ่าตัด",
    abrasion: "แผลถลอก",
  };
  return labels[cause];
}

function getTissueLabel(tissue: WoundAnswers["tissue"]): string {
  const labels: Record<WoundAnswers["tissue"], string> = {
    necrotic: "เนื้อตาย",
    slough: "เนื้อเยื่อสลัฟ",
    granulation: "เนื้อเยื่อแกรนูเลชัน",
  };
  return labels[tissue];
}

function getExudateLabel(exudate: WoundAnswers["exudate"]): string {
  const labels: Record<WoundAnswers["exudate"], string> = {
    low: "น้อย",
    moderate: "ปานกลาง",
    heavy: "มาก",
  };
  return labels[exudate];
}
