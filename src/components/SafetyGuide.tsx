const warningSigns = [
  "มีไข้ หนาวสั่น สับสน หรือรู้สึกป่วยมาก",
  "รอยแดง บวม หรือความร้อนรอบแผลลุกลามหรือแย่ลงอย่างรวดเร็ว",
  "ปวดรุนแรงขึ้น มีหนอง กลิ่นผิดปกติ หรือมีเส้นแดงพาดออกจากแผล",
  "แผลเปลี่ยนเป็นสีคล้ำ/ดำ หรือบริเวณนั้นเย็น ชา โดยเฉพาะผู้ป่วยเบาหวาน",
];

export default function SafetyGuide() {
  return (
    <section className="rounded-[2rem] border border-[#e2ece9] bg-white p-6 shadow-[0_22px_70px_-48px_rgba(24,59,55,0.35)] sm:p-8">
      <p className="text-sm font-semibold text-[#a45b36]">แนวทางความปลอดภัย</p>
      <h2 className="mt-1 text-xl font-bold text-[#183b37]">
        เมื่อใดควรขอการประเมินจากบุคลากรทางการแพทย์
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        หากพบอาการต่อไปนี้ ควรให้บุคลากรทางการแพทย์ประเมินโดยเร็ว
        หากอาการรุนแรงหรือทรุดลงอย่างรวดเร็ว ให้ไปพบแพทย์ฉุกเฉิน
      </p>

      <ul className="mt-5 space-y-3">
        {warningSigns.map((sign) => (
          <li
            className="flex gap-3 rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm leading-6 text-amber-950"
            key={sign}
          >
            <span aria-hidden="true" className="font-bold text-amber-700">
              !
            </span>
            <span>{sign}</span>
          </li>
        ))}
      </ul>

      <p className="mt-5 text-xs leading-5 text-slate-500">
        รายการนี้เป็นข้อมูลทั่วไป ไม่ครอบคลุมทุกภาวะและไม่ใช้แทนการวินิจฉัย
        ให้พิจารณาประวัติและอาการของผู้ป่วยร่วมด้วยเสมอ
      </p>
    </section>
  );
}
