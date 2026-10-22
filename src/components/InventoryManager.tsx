import { useMemo, useState } from "react";
import { plasters } from "../data/plasters";

interface InventoryManagerProps {
  error: string | null;
  initialBrands: string[];
  isLoading: boolean;
  onApply: (brands: string[]) => void;
}

export default function InventoryManager({
  error,
  initialBrands,
  isLoading,
  onApply,
}: InventoryManagerProps) {
  const [selectedBrands, setSelectedBrands] = useState(
    () => new Set(initialBrands),
  );
  const [search, setSearch] = useState("");
  const categories = [...new Set(plasters.map((product) => product.category))];
  const normalizedSearch = search.trim().toLowerCase();
  const filteredPlasters = useMemo(
    () =>
      plasters.filter((product) =>
        `${product.brand} ${product.manufacturer} ${product.description} ${product.category}`
          .toLowerCase()
          .includes(normalizedSearch),
      ),
    [normalizedSearch],
  );

  function toggleBrand(brand: string) {
    setSelectedBrands((current) => {
      const next = new Set(current);
      if (next.has(brand)) {
        next.delete(brand);
      } else {
        next.add(brand);
      }
      return next;
    });
  }

  function selectAll(checked: boolean) {
    setSelectedBrands(
      checked ? new Set(plasters.map((product) => product.brand)) : new Set(),
    );
  }

  return (
    <section className="rounded-[2rem] border border-[#e2ece9] bg-white p-5 shadow-[0_22px_70px_-48px_rgba(24,59,55,0.35)] sm:p-8">
      <div>
        <p className="text-sm font-semibold text-[#508078]">สำหรับเภสัชกร</p>
        <h2 className="mt-1 text-xl font-bold text-[#183b37]">
          สินค้าที่มีในร้าน
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          เลือกแบรนด์ที่มีอยู่ในร้าน ระบบจะใช้รายการนี้กรองผลิตภัณฑ์เมื่อประเมินแผล
        </p>
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

      {isLoading ? (
        <p aria-live="polite" className="mt-6 text-sm text-slate-500">
          กำลังโหลดรายการสต็อก...
        </p>
      ) : (
        <>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#f6faf8] p-3">
            <p className="text-sm font-semibold text-[#254943]">
              เลือกแล้ว {selectedBrands.size} จาก {plasters.length} แบรนด์
            </p>
            <div className="flex gap-2">
              <button
                className="rounded-lg px-3 py-2 text-xs font-semibold text-[#286d62] hover:bg-white"
                onClick={() => selectAll(true)}
                type="button"
              >
                เลือกทั้งหมด
              </button>
              <button
                className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-white"
                onClick={() => selectAll(false)}
                type="button"
              >
                ล้างรายการ
              </button>
            </div>
          </div>

          <label className="mt-4 block">
            <span className="mb-2 block text-sm font-semibold text-[#254943]">
              ค้นหาผลิตภัณฑ์
            </span>
            <input
              className="w-full rounded-xl border border-[#dce8e4] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#4b9a88]"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="ชื่อแบรนด์ ผู้ผลิต หรือประเภท"
              type="search"
              value={search}
            />
          </label>

          <div className="mt-5 space-y-5">
            {filteredPlasters.length === 0 ? (
              <p className="rounded-xl bg-[#f6faf8] p-4 text-sm text-slate-600">
                ไม่พบผลิตภัณฑ์ที่ตรงกับคำค้นหา
              </p>
            ) : (
              categories
                .filter((category) =>
                  filteredPlasters.some(
                    (product) => product.category === category,
                  ),
                )
                .map((category) => (
                  <fieldset className="space-y-2" key={category}>
                    <legend className="mb-2 text-sm font-bold text-[#254943]">
                      {category}
                    </legend>
                    {filteredPlasters
                      .filter((product) => product.category === category)
                      .map((product) => (
                        <label
                          className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#e8efed] p-3 transition hover:border-[#a8cdc4]"
                          key={product.brand}
                        >
                          <input
                            checked={selectedBrands.has(product.brand)}
                            className="mt-1 h-4 w-4 accent-[#286d62]"
                            onChange={() => toggleBrand(product.brand)}
                            type="checkbox"
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block font-semibold text-[#254943]">
                              {product.brand}
                            </span>
                            <span className="mt-0.5 block text-xs text-slate-500">
                              {product.manufacturer} · {product.description}
                            </span>
                          </span>
                          <span className="shrink-0 pt-0.5 text-xs font-medium text-slate-500">
                            {selectedBrands.has(product.brand)
                              ? "มีในร้าน"
                              : "ไม่มีในร้าน"}
                          </span>
                        </label>
                      ))}
                  </fieldset>
                ))
            )}
          </div>

          <button
            className="mt-7 w-full rounded-xl bg-[#286d62] px-5 py-3.5 font-semibold text-white transition hover:bg-[#205a51]"
            onClick={() => onApply([...selectedBrands])}
            type="button"
          >
            บันทึกสต็อกและใช้กับการประเมิน
          </button>
        </>
      )}
    </section>
  );
}
