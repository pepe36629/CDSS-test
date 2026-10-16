import type { WoundEvaluation } from "../utils/scorer";
import type { DressingCategory } from "../data/plasters";

const categoryLabels: Record<DressingCategory, string> = {
  "Wound Cleansing": "ทำความสะอาดแผล",
  Debridement: "ขจัดเนื้อตาย",
  "Antimicrobial / Silver": "วัสดุปิดแผลต้านจุลชีพ / ซิลเวอร์",
  "Alginate / Hydrofiber": "แอลจิเนต / ไฮโดรไฟเบอร์",
  Foam: "โฟม",
  Hydrogel: "ไฮโดรเจล",
  Hydrocolloid: "ไฮโดรคอลลอยด์",
  "Film / Island Dressing": "ฟิล์มหรือแผ่นปิดแผล",
  "Skin Care": "ดูแลผิว",
};

interface ResultCardProps {
  evaluation: WoundEvaluation;
  onReset: () => void;
}

export default function ResultCard({ evaluation, onReset }: ResultCardProps) {
  return (
    <section className="space-y-5">
      <div className="rounded-[2rem] border border-[#dcebe5] bg-white p-6 shadow-[0_22px_70px_-48px_rgba(24,59,55,0.35)] sm:p-8">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#edf7f2] px-3 py-1.5 text-sm font-semibold text-[#367268]">
          <span aria-hidden="true">✓</span>
          ผลการประเมินเบื้องต้น
        </div>
        <p className="text-sm font-medium text-slate-500">กลุ่มวัสดุปิดแผลที่พิจารณา</p>
        <h2 className="mt-2 text-2xl font-bold leading-snug text-[#183b37] sm:text-3xl">
          {categoryLabels[evaluation.recommended_category]}
        </h2>

        <div className="mt-6 rounded-2xl bg-[#f6faf8] p-4">
          <h3 className="text-sm font-bold text-[#254943]">เหตุผลทางคลินิก</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {evaluation.clinical_reason}
          </p>
        </div>

        <div className="mt-5">
          <h3 className="text-sm font-bold text-[#254943]">สรุปข้อมูลแผล</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {evaluation.woundTypeEval}
          </p>
        </div>
      </div>

      <div className="rounded-[2rem] border border-[#e2ece9] bg-white p-6 shadow-[0_22px_70px_-48px_rgba(24,59,55,0.25)] sm:p-8">
        <div className="mb-5">
          <h3 className="text-lg font-bold text-[#183b37]">
            ผลิตภัณฑ์ที่เกี่ยวข้อง
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            ตัวอย่างผลิตภัณฑ์ตามกลุ่มวัสดุปิดแผล พร้อมผลิตภัณฑ์ทำความสะอาดแผล
          </p>
        </div>

        <ul className="space-y-3">
          {evaluation.recommended_products.map((product) => {
            return (
              <li
                className="rounded-2xl border border-[#e8efed] p-4"
                key={`${product.category}-${product.brand}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h4 className="font-bold text-[#254943]">{product.brand}</h4>
                  <span className="rounded-full bg-[#f0f6f4] px-2.5 py-1 text-xs font-medium text-[#527a72]">
                    {categoryLabels[product.category]}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  ผู้ผลิต: {product.manufacturer}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {product.description}
                </p>
              </li>
            );
          })}
        </ul>
      </div>

      <aside className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
        <p className="font-bold">ข้อควรทราบ</p>
        <p className="mt-1">
          ผลลัพธ์นี้เป็นเครื่องมือช่วยประกอบการพิจารณาเบื้องต้นจากกฎตัวอย่าง ไม่ใช่การวินิจฉัยหรือคำสั่งการรักษา
          ควรให้บุคลากรทางการแพทย์ประเมินแผลและเลือกผลิตภัณฑ์ให้เหมาะกับผู้ป่วยแต่ละราย
        </p>
      </aside>

      <button
        className="w-full rounded-xl border border-[#c9ddd7] bg-white px-5 py-3.5 font-semibold text-[#286d62] transition hover:bg-[#f2f8f6]"
        onClick={onReset}
        type="button"
      >
        เริ่มประเมินใหม่
      </button>
    </section>
  );
}
