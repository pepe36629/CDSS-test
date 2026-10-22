import { useMemo, useState } from "react";
import {
  plasters,
  type InventorySelection,
} from "../data/plasters";

interface InventoryManagerProps {
  error: string | null;
  initialStock: InventorySelection[];
  isLoading: boolean;
  onApply: (stock: InventorySelection[]) => void;
}

function createSelection(brand: string): InventorySelection {
  return {
    brand,
    sizes: [],
    latexFreeConfirmed: false,
    adhesiveFreeConfirmed: false,
  };
}

export default function InventoryManager({
  error,
  initialStock,
  isLoading,
  onApply,
}: InventoryManagerProps) {
  const [stock, setStock] = useState(
    () => new Map(initialStock.map((item) => [item.brand, item])),
  );
  const [search, setSearch] = useState("");
  const [sizeDrafts, setSizeDrafts] = useState<Record<string, string>>({});
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
    setStock((current) => {
      const next = new Map(current);
      if (next.has(brand)) {
        next.delete(brand);
      } else {
        next.set(brand, createSelection(brand));
      }
      return next;
    });
  }

  function updateSelection(
    brand: string,
    updates: Partial<Omit<InventorySelection, "brand">>,
  ) {
    setStock((current) => {
      const next = new Map(current);
      const selection = next.get(brand);
      if (selection) {
        next.set(brand, { ...selection, ...updates });
      }
      return next;
    });
  }

  function selectAll(checked: boolean) {
    setStock(
      checked
        ? new Map(
            plasters.map((product) => [
              product.brand,
              stock.get(product.brand) ?? createSelection(product.brand),
            ]),
          )
        : new Map(),
    );
  }

  function addSize(brand: string) {
    const size = (sizeDrafts[brand] ?? "").trim();
    const selection = stock.get(brand);
    if (!size || !selection || selection.sizes.includes(size)) {
      return;
    }
    updateSelection(brand, { sizes: [...selection.sizes, size] });
    setSizeDrafts((current) => ({ ...current, [brand]: "" }));
  }

  return (
    <section className="rounded-[2rem] border border-[#e2ece9] bg-white p-5 shadow-[0_22px_70px_-48px_rgba(24,59,55,0.35)] sm:p-8">
      <div>
        <p className="text-sm font-semibold text-[#508078]">สำหรับเภสัชกร</p>
        <h2 className="mt-1 text-xl font-bold text-[#183b37]">
          ตั้งค่าสต็อกและรายการตรวจสอบ
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          เลือกผลิตภัณฑ์ที่มีในร้าน เพิ่มขนาดตามฉลากสินค้า และยืนยันข้อมูลวัสดุ
          ที่ตรวจสอบแล้ว การประเมินจะใช้รายการนี้กรองตัวเลือก
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
              เลือกแล้ว {stock.size} จาก {plasters.length} ผลิตภัณฑ์
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
                      .map((product) => {
                        const selection = stock.get(product.brand);
                        return (
                          <div
                            className="rounded-xl border border-[#e8efed] p-3"
                            key={product.brand}
                          >
                            <label className="flex cursor-pointer items-start gap-3">
                              <input
                                checked={Boolean(selection)}
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
                                {selection ? "มีในร้าน" : "ไม่มีในร้าน"}
                              </span>
                            </label>
                            {selection && (
                              <div className="ml-7 mt-3 space-y-3 border-t border-[#edf2f0] pt-3">
                                <div>
                                  <label
                                    className="block text-xs font-semibold text-[#254943]"
                                    htmlFor={`size-${product.brand}`}
                                  >
                                    ขนาดที่มี (กรอกตามฉลากสินค้า)
                                  </label>
                                  <div className="mt-1 flex gap-2">
                                    <input
                                      className="min-w-0 flex-1 rounded-lg border border-[#dce8e4] px-3 py-2 text-sm outline-none focus:border-[#4b9a88]"
                                      id={`size-${product.brand}`}
                                      onChange={(event) =>
                                        setSizeDrafts((current) => ({
                                          ...current,
                                          [product.brand]: event.target.value,
                                        }))
                                      }
                                      onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                          event.preventDefault();
                                          addSize(product.brand);
                                        }
                                      }}
                                      placeholder="เช่น 5 × 7 cm"
                                      value={sizeDrafts[product.brand] ?? ""}
                                    />
                                    <button
                                      className="rounded-lg border border-[#c9ddd7] px-3 text-xs font-semibold text-[#286d62] hover:bg-[#f2f8f6]"
                                      onClick={() => addSize(product.brand)}
                                      type="button"
                                    >
                                      เพิ่ม
                                    </button>
                                  </div>
                                  {selection.sizes.length > 0 && (
                                    <ul
                                      aria-label={`ขนาดที่มีของ ${product.brand}`}
                                      className="mt-2 flex flex-wrap gap-2"
                                    >
                                      {selection.sizes.map((size) => (
                                        <li
                                          className="inline-flex items-center gap-1 rounded-full bg-[#edf7f2] px-2.5 py-1 text-xs text-[#367268]"
                                          key={size}
                                        >
                                          {size}
                                          <button
                                            aria-label={`ลบขนาด ${size}`}
                                            className="font-bold"
                                            onClick={() =>
                                              updateSelection(product.brand, {
                                                sizes: selection.sizes.filter(
                                                  (item) => item !== size,
                                                ),
                                              })
                                            }
                                            type="button"
                                          >
                                            ×
                                          </button>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                                <label className="flex items-start gap-2 text-xs leading-5 text-slate-600">
                                  <input
                                    checked={selection.latexFreeConfirmed}
                                    className="mt-1 accent-[#286d62]"
                                    onChange={(event) =>
                                      updateSelection(product.brand, {
                                        latexFreeConfirmed: event.target.checked,
                                      })
                                    }
                                    type="checkbox"
                                  />
                                  <span>
                                    ตรวจสอบฉลากแล้ว: ยืนยันว่าไม่มีลาเท็กซ์
                                  </span>
                                </label>
                                <label className="flex items-start gap-2 text-xs leading-5 text-slate-600">
                                  <input
                                    checked={selection.adhesiveFreeConfirmed}
                                    className="mt-1 accent-[#286d62]"
                                    onChange={(event) =>
                                      updateSelection(product.brand, {
                                        adhesiveFreeConfirmed:
                                          event.target.checked,
                                      })
                                    }
                                    type="checkbox"
                                  />
                                  <span>
                                    ตรวจสอบฉลากแล้ว: ยืนยันว่าไม่มีสารยึดติด
                                  </span>
                                </label>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </fieldset>
                ))
            )}
          </div>

          <p className="mt-5 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-900">
            ระบบจะกรองผลิตภัณฑ์เมื่อมีการเลือกความไวต่อวัสดุ
            เฉพาะรายการที่เภสัชกรยืนยันจากฉลากแล้วเท่านั้น
            โปรดตรวจสอบข้อมูลของแต่ละรุ่นและขนาดก่อนบันทึก
          </p>
          <button
            className="mt-4 w-full rounded-xl bg-[#286d62] px-5 py-3.5 font-semibold text-white transition hover:bg-[#205a51]"
            onClick={() => onApply([...stock.values()])}
            type="button"
          >
            บันทึกการตั้งค่าสต็อก
          </button>
        </>
      )}
    </section>
  );
}
