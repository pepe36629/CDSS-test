import { useMemo, useState } from "react";
import { plasters } from "../data/plasters";

interface ProductCatalogProps {
  stock: Map<string, string[]>;
}

export default function ProductCatalog({ stock }: ProductCatalogProps) {
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();
  const products = useMemo(
    () =>
      plasters.filter((product) =>
        `${product.brand} ${product.manufacturer} ${product.category} ${product.description}`
          .toLowerCase()
          .includes(query),
      ),
    [query],
  );

  return (
    <section className="rounded-[2rem] border border-[#e2ece9] bg-white p-5 shadow-[0_22px_70px_-48px_rgba(24,59,55,0.35)] sm:p-8">
      <p className="text-sm font-semibold text-[#508078]">ข้อมูลอ้างอิง</p>
      <h2 className="mt-1 text-xl font-bold text-[#183b37]">
        ค้นหาผลิตภัณฑ์ปิดแผล
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        ค้นหาตามชื่อแบรนด์ ผู้ผลิต หรือประเภท ข้อมูลนี้เป็นสรุปเบื้องต้น
        โปรดตรวจสอบฉลากและเอกสารกำกับของผลิตภัณฑ์จริงก่อนใช้
      </p>
      <label className="mt-5 block">
        <span className="mb-2 block text-sm font-semibold text-[#254943]">
          ค้นหาในแค็ตตาล็อก
        </span>
        <input
          className="w-full rounded-xl border border-[#dce8e4] px-4 py-3 text-sm outline-none focus:border-[#4b9a88]"
          onChange={(event) => setSearch(event.target.value)}
          placeholder="แบรนด์ ผู้ผลิต หรือประเภทวัสดุ"
          type="search"
          value={search}
        />
      </label>

      {products.length === 0 ? (
        <p className="mt-5 rounded-xl bg-[#f6faf8] p-4 text-sm text-slate-600">
          ไม่พบผลิตภัณฑ์ที่ตรงกับคำค้นหา
        </p>
      ) : (
        <ul className="mt-5 space-y-3">
          {products.map((product) => (
            <li
              className="rounded-2xl border border-[#e8efed] p-4"
              key={product.brand}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="font-bold text-[#254943]">{product.brand}</h3>
                <span className="rounded-full bg-[#f0f6f4] px-2.5 py-1 text-xs font-medium text-[#527a72]">
                  {product.category}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                ผู้ผลิต: {product.manufacturer}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {product.description}
              </p>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                ข้อมูลการใช้และขนาด: ตรวจสอบตามรุ่น ฉลาก
                และเอกสารกำกับของผู้ผลิต
              </p>
              {stock.has(product.brand) && (
                <p className="mt-2 text-xs font-semibold text-[#367268]">
                  มีในร้าน
                  {stock.get(product.brand)?.length
                    ? ` · ขนาด ${stock.get(product.brand)?.join(", ")}`
                    : ""}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
