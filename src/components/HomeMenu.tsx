export type AppScreen =
  | "home"
  | "assess"
  | "inventory"
  | "history"
  | "catalog"
  | "safety"
  | "about";

interface HomeMenuProps {
  availableProductCount: number | null;
  isInventoryLoading: boolean;
  onNavigate: (screen: AppScreen) => void;
}

const menuItems: {
  screen: AppScreen;
  number: string;
  title: string;
  description: string;
}[] = [
  {
    screen: "assess",
    number: "01",
    title: "เริ่มประเมินแผล",
    description: "ตอบคำถามเกี่ยวกับแผลเพื่อดูวัสดุปิดแผลที่อาจเหมาะสม",
  },
  {
    screen: "inventory",
    number: "02",
    title: "ตั้งค่าสต็อกและรายการตรวจสอบ",
    description: "เลือกแบรนด์ ขนาดที่มี และข้อมูลความไวต่อวัสดุของสินค้า",
  },
  {
    screen: "history",
    number: "03",
    title: "ประวัติการประเมิน",
    description: "ดูสรุปการประเมินและผลิตภัณฑ์ที่แนะนำล่าสุดบนอุปกรณ์นี้",
  },
  {
    screen: "catalog",
    number: "04",
    title: "ค้นหาผลิตภัณฑ์",
    description: "ค้นหากลุ่มผลิตภัณฑ์ ผู้ผลิต และข้อมูลอ้างอิงเบื้องต้น",
  },
  {
    screen: "safety",
    number: "05",
    title: "สัญญาณเตือนและการส่งต่อ",
    description: "ดูอาการที่ควรได้รับการประเมินจากบุคลากรทางการแพทย์",
  },
  {
    screen: "about",
    number: "06",
    title: "วิธีใช้และความเป็นส่วนตัว",
    description: "ทำความเข้าใจขอบเขตของเครื่องมือและข้อมูลที่จัดเก็บ",
  },
];

export default function HomeMenu({
  availableProductCount,
  isInventoryLoading,
  onNavigate,
}: HomeMenuProps) {
  return (
    <nav aria-label="เมนูหลัก" className="grid gap-3">
      {menuItems.map((item) => (
        <button
          className="flex w-full items-start gap-4 rounded-2xl border border-[#e2ece9] bg-white p-5 text-left shadow-[0_12px_36px_-30px_rgba(24,59,55,0.4)] transition hover:border-[#a8cdc4] hover:bg-[#fbfdfc] sm:p-6"
          key={item.screen}
          onClick={() => onNavigate(item.screen)}
          type="button"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf7f2] text-sm font-bold text-[#367268]">
            {item.number}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-bold text-[#183b37]">{item.title}</span>
            <span className="mt-1 block text-sm leading-6 text-slate-500">
              {item.description}
            </span>
            {item.screen === "inventory" && (
              <span className="mt-2 block text-xs font-semibold text-[#508078]">
                {isInventoryLoading
                  ? "กำลังโหลดสต็อก..."
                  : availableProductCount === null
                    ? "ยังไม่ได้ตั้งค่าสต็อก"
                    : `เลือกสินค้าไว้ ${availableProductCount} รายการ`}
              </span>
            )}
          </span>
          <span aria-hidden="true" className="pt-2 text-[#82a79f]">
            →
          </span>
        </button>
      ))}
    </nav>
  );
}
