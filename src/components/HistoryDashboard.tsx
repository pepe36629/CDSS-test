import type { ConsultationRecord } from "../data/history";

interface HistoryDashboardProps {
  error: string | null;
  onClear: () => void;
  records: ConsultationRecord[];
}

const sensitivityLabels = {
  latex: "ลาเท็กซ์",
  adhesive: "สารยึดติด",
} as const;

export default function HistoryDashboard({
  error,
  onClear,
  records,
}: HistoryDashboardProps) {
  return (
    <section className="rounded-[2rem] border border-[#e2ece9] bg-white p-5 shadow-[0_22px_70px_-48px_rgba(24,59,55,0.35)] sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[#508078]">
            จัดเก็บในอุปกรณ์นี้
          </p>
          <h2 className="mt-1 text-xl font-bold text-[#183b37]">
            ประวัติการประเมิน
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            บันทึกสรุปและผลิตภัณฑ์แนะนำล่าสุด โดยไม่เก็บชื่อหรือข้อมูลระบุตัวผู้ป่วย
          </p>
        </div>
        {(records.length > 0 || error) && (
          <button
            className="rounded-lg px-3 py-2 text-sm font-semibold text-[#286d62] hover:bg-[#f2f8f6]"
            onClick={onClear}
            type="button"
          >
            ล้างประวัติ
          </button>
        )}
      </div>

      {error && (
        <p
          aria-live="polite"
          className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"
          role="alert"
        >
          {error}
        </p>
      )}

      {records.length === 0 ? (
        <p className="mt-5 rounded-xl bg-[#f6faf8] p-4 text-sm text-slate-600">
          ยังไม่มีประวัติ เมื่อประเมินเสร็จ สรุปจะปรากฏที่นี่
        </p>
      ) : (
        <ol className="mt-5 space-y-3">
          {records.map((record) => (
            <li
              className="rounded-2xl border border-[#e8efed] p-4"
              key={record.id}
            >
              <p className="text-xs font-medium text-slate-500">
                {new Intl.DateTimeFormat("th-TH", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(record.createdAt))}
              </p>
              <h3 className="mt-2 font-bold text-[#254943]">
                {record.recommendedCategory}
              </h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {record.woundSummary}
              </p>
              {record.sensitivities.length > 0 && (
                <p className="mt-2 text-xs text-slate-500">
                  ความไวที่เลือก:{" "}
                  {record.sensitivities
                    .map((item) => sensitivityLabels[item])
                    .join(", ")}
                </p>
              )}
              <p className="mt-2 text-sm leading-6 text-slate-600">
                ผลิตภัณฑ์:{" "}
                {record.products.length > 0
                  ? record.products.join(", ")
                  : "ไม่มีผลิตภัณฑ์ที่ผ่านตัวกรอง"}
              </p>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
