import { useEffect, useState } from "react";
import HomeMenu, { type AppScreen } from "./components/HomeMenu";
import HistoryDashboard from "./components/HistoryDashboard";
import InventoryManager from "./components/InventoryManager";
import ProductCatalog from "./components/ProductCatalog";
import Questionnaire from "./components/Questionnaire";
import ResultCard from "./components/ResultCard";
import SafetyGuide from "./components/SafetyGuide";
import type { ConsultationRecord } from "./data/history";
import {
  plasters,
  type InventorySelection,
  type Sensitivity,
} from "./data/plasters";
import type { WoundAnswers } from "./data/questions";
import { evaluateWound, type WoundEvaluation } from "./utils/scorer";

const INVENTORY_STORAGE_KEY = "wound-dressing-inventory";
const HISTORY_STORAGE_KEY = "wound-dressing-consultation-history";
const plasterBrands = plasters.map((product) => product.brand);

function isInventorySelection(value: unknown): value is InventorySelection {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const selection = value as Record<string, unknown>;
  return (
    typeof selection.brand === "string" &&
    plasterBrands.includes(selection.brand) &&
    Array.isArray(selection.sizes) &&
    selection.sizes.every((size) => typeof size === "string") &&
    typeof selection.latexFreeConfirmed === "boolean" &&
    typeof selection.adhesiveFreeConfirmed === "boolean"
  );
}

function isConsultationRecord(value: unknown): value is ConsultationRecord {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    typeof record.id === "string" &&
    typeof record.createdAt === "string" &&
    !Number.isNaN(Date.parse(record.createdAt)) &&
    typeof record.woundSummary === "string" &&
    typeof record.recommendedCategory === "string" &&
    Array.isArray(record.products) &&
    record.products.every((product) => typeof product === "string") &&
    Array.isArray(record.sensitivities) &&
    record.sensitivities.every(
      (sensitivity) => sensitivity === "latex" || sensitivity === "adhesive",
    )
  );
}

function hasCompleteAnswers(
  answers: Partial<WoundAnswers>,
): answers is WoundAnswers {
  return Boolean(
    answers.cause && answers.tissue && answers.exudate && answers.infection,
  );
}

function getFilteredEvaluation(
  answers: WoundAnswers,
  stock: InventorySelection[] | null,
  sensitivities: Sensitivity[],
): WoundEvaluation {
  const availableBrands =
    stock === null
      ? undefined
      : new Set(stock.map((selection) => selection.brand));
  const evaluation = evaluateWound(answers, availableBrands);
  if (sensitivities.length === 0) {
    return evaluation;
  }

  const stockByBrand = new Map(stock?.map((selection) => [selection.brand, selection]));
  const productMatchesSensitivities = (brand: string) => {
    const selection = stockByBrand.get(brand);
    return (
      (!sensitivities.includes("latex") ||
        selection?.latexFreeConfirmed === true) &&
      (!sensitivities.includes("adhesive") ||
        selection?.adhesiveFreeConfirmed === true)
    );
  };

  return {
    ...evaluation,
    recommended_products: evaluation.recommended_products.filter((product) =>
      productMatchesSensitivities(product.brand),
    ),
    alternative_products: evaluation.alternative_products.filter((product) =>
      productMatchesSensitivities(product.brand),
    ),
  };
}

function createConsultationRecord(
  evaluation: WoundEvaluation,
  sensitivities: Sensitivity[],
  stock: InventorySelection[] | null,
): ConsultationRecord {
  const stockByBrand = new Map(
    stock?.map((selection) => [selection.brand, selection.sizes]) ?? [],
  );
  return {
    id: `${Date.now()}-${Math.random()}`,
    createdAt: new Date().toISOString(),
    woundSummary: evaluation.woundTypeEval,
    recommendedCategory: evaluation.recommended_category,
    products: evaluation.recommended_products.map((product) => {
      const sizes = stockByBrand.get(product.brand);
      return sizes && sizes.length > 0
        ? `${product.brand} (${sizes.join(", ")})`
        : product.brand;
    }),
    sensitivities: [...sensitivities],
  };
}

export default function App() {
  const [answers, setAnswers] = useState<Partial<WoundAnswers>>({});
  const [sensitivities, setSensitivities] = useState<Sensitivity[]>([]);
  const [evaluation, setEvaluation] = useState<WoundEvaluation | null>(null);
  const [screen, setScreen] = useState<AppScreen>("home");
  const [availableStock, setAvailableStock] = useState<
    InventorySelection[] | null
  >(null);
  const [history, setHistory] = useState<ConsultationRecord[]>([]);
  const [isInventoryLoading, setIsInventoryLoading] = useState(true);
  const [inventoryError, setInventoryError] = useState<string | null>(null);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    try {
      const storedInventory = window.localStorage.getItem(INVENTORY_STORAGE_KEY);
      if (storedInventory !== null) {
        const parsed: unknown = JSON.parse(storedInventory);
        if (!Array.isArray(parsed)) {
          throw new Error("Stored inventory has an invalid format.");
        }
        if (parsed.every((brand) => typeof brand === "string")) {
          const legacyBrands = parsed as string[];
          if (
            legacyBrands.some((brand) => !plasterBrands.includes(brand)) ||
            new Set(legacyBrands).size !== legacyBrands.length
          ) {
            throw new Error("Stored inventory has an invalid format.");
          }
          setAvailableStock(
            legacyBrands.map((brand) => ({
              brand,
              sizes: [],
              latexFreeConfirmed: false,
              adhesiveFreeConfirmed: false,
            })),
          );
        } else if (parsed.every(isInventorySelection)) {
          const validStock = parsed as InventorySelection[];
          if (
            new Set(validStock.map((selection) => selection.brand)).size !==
            validStock.length
          ) {
            throw new Error("Stored inventory has duplicate products.");
          }
          setAvailableStock(validStock);
        } else {
          throw new Error("Stored inventory has an invalid format.");
        }
      }
    } catch {
      setInventoryError(
        "อ่านข้อมูลสต็อกจากอุปกรณ์นี้ไม่ได้ กรุณาตรวจสอบและบันทึกสต็อกใหม่",
      );
    } finally {
      setIsInventoryLoading(false);
    }

    try {
      const storedHistory = window.localStorage.getItem(HISTORY_STORAGE_KEY);
      if (storedHistory !== null) {
        const parsed: unknown = JSON.parse(storedHistory);
        if (!Array.isArray(parsed) || !parsed.every(isConsultationRecord)) {
          throw new Error("Stored consultation history has an invalid format.");
        }
        setHistory((parsed as ConsultationRecord[]).slice(0, 50));
      }
    } catch {
      setHistoryError(
        "อ่านประวัติจากอุปกรณ์นี้ไม่ได้ กรุณาล้างประวัติหรือใช้เบราว์เซอร์อื่น",
      );
    }
  }, []);

  function handleAnswer<K extends keyof WoundAnswers>(
    key: K,
    value: WoundAnswers[K],
  ) {
    setAnswers((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit() {
    if (!hasCompleteAnswers(answers)) {
      return;
    }

    const completeAnswers = answers;
    setIsLoading(true);
    window.setTimeout(() => {
      const nextEvaluation = getFilteredEvaluation(
        completeAnswers,
        availableStock,
        sensitivities,
      );
      setEvaluation(nextEvaluation);
      setIsLoading(false);

      const record = createConsultationRecord(
        nextEvaluation,
        sensitivities,
        availableStock,
      );
      const nextHistory = [record, ...history].slice(0, 50);
      try {
        window.localStorage.setItem(
          HISTORY_STORAGE_KEY,
          JSON.stringify(nextHistory),
        );
        setHistory(nextHistory);
        setHistoryError(null);
      } catch {
        setHistoryError("บันทึกประวัติในอุปกรณ์นี้ไม่ได้");
      }
    }, 1000);
  }

  function handleInventoryApply(stock: InventorySelection[]) {
    try {
      window.localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(stock));
      setAvailableStock(stock);
      setInventoryError(null);
      if (evaluation && hasCompleteAnswers(answers)) {
        setEvaluation(getFilteredEvaluation(answers, stock, sensitivities));
      }
      setScreen("home");
    } catch {
      setInventoryError("บันทึกสต็อกในอุปกรณ์นี้ไม่ได้ กรุณาลองอีกครั้ง");
    }
  }

  function handleClearHistory() {
    try {
      window.localStorage.removeItem(HISTORY_STORAGE_KEY);
      setHistory([]);
      setHistoryError(null);
    } catch {
      setHistoryError("ล้างประวัติในอุปกรณ์นี้ไม่ได้ กรุณาลองอีกครั้ง");
    }
  }

  function handleNavigate(nextScreen: AppScreen) {
    if (nextScreen === "assess") {
      setAnswers({});
      setSensitivities([]);
      setEvaluation(null);
      setIsLoading(false);
    }
    setScreen(nextScreen);
  }

  function handleReset() {
    setAnswers({});
    setSensitivities([]);
    setEvaluation(null);
    setIsLoading(false);
    setScreen("assess");
  }

  const catalogStock = new Map(
    availableStock?.map((selection) => [selection.brand, selection.sizes]) ?? [],
  );

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8 text-center sm:mb-10 print:hidden">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#286d62] text-white shadow-lg shadow-[#286d62]/15">
            <svg
              aria-hidden="true"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21s-7.5-4.4-7.5-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20.5 10c0 6.6-8.5 11-8.5 11Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m-3-3h6"
              />
            </svg>
          </div>
          <p className="text-xs font-bold tracking-[0.12em] text-[#58877e]">
            ระบบช่วยตัดสินใจทางคลินิก
          </p>
          <h1 className="mt-2 text-2xl font-bold text-[#183b37] sm:text-3xl">
            ผู้ช่วยเลือกวัสดุปิดแผล
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">
            เครื่องมือช่วยประเมินเบื้องต้นและค้นหาผลิตภัณฑ์ที่มีในร้าน
          </p>
        </header>

        {screen !== "home" && (
          <button
            className="mb-4 rounded-xl px-3 py-2 text-sm font-semibold text-[#286d62] transition hover:bg-white print:hidden"
            onClick={() => handleNavigate("home")}
            type="button"
          >
            ← กลับหน้าหลัก
          </button>
        )}

        {screen === "home" ? (
          <HomeMenu
            availableProductCount={availableStock?.length ?? null}
            isInventoryLoading={isInventoryLoading}
            onNavigate={handleNavigate}
          />
        ) : screen === "inventory" ? (
          <InventoryManager
            error={inventoryError}
            initialStock={availableStock ?? []}
            isLoading={isInventoryLoading}
            onApply={handleInventoryApply}
          />
        ) : screen === "history" ? (
          <HistoryDashboard
            error={historyError}
            onClear={handleClearHistory}
            records={history}
          />
        ) : screen === "catalog" ? (
          <ProductCatalog stock={catalogStock} />
        ) : screen === "safety" ? (
          <SafetyGuide />
        ) : screen === "about" ? (
          <section className="space-y-4 rounded-[2rem] border border-[#e2ece9] bg-white p-6 shadow-[0_22px_70px_-48px_rgba(24,59,55,0.35)] sm:p-8">
            <h2 className="text-xl font-bold text-[#183b37]">
              เกี่ยวกับเครื่องมือนี้
            </h2>
            <p className="text-sm leading-6 text-slate-600">
              เครื่องมือนี้ใช้คำตอบที่ให้เพื่อแสดงกลุ่มวัสดุปิดแผลตัวอย่างตามกฎเบื้องต้น
              และกรองผลิตภัณฑ์ตามสต็อกกับข้อมูลความไวที่เภสัชกรบันทึกไว้
            </p>
            <p className="text-sm leading-6 text-slate-600">
              รายการสต็อกและประวัติการประเมินจัดเก็บในเบราว์เซอร์นี้เท่านั้น
              ไม่ซิงก์ไปยังอุปกรณ์อื่น และประวัติไม่เก็บชื่อหรือข้อมูลระบุตัวผู้ป่วย
            </p>
            <p className="rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">
              ผลลัพธ์เป็นข้อมูลประกอบการพิจารณา ไม่ใช่การวินิจฉัยหรือคำสั่งการรักษา
              โปรดให้บุคลากรทางการแพทย์ประเมินผู้ป่วยและตรวจสอบข้อมูลผลิตภัณฑ์ก่อนเลือกใช้
            </p>
          </section>
        ) : isLoading ? (
          <section
            aria-live="polite"
            className="flex min-h-80 flex-col items-center justify-center rounded-[2rem] border border-[#e2ece9] bg-white p-8 text-center shadow-[0_22px_70px_-48px_rgba(24,59,55,0.35)]"
          >
            <span className="h-12 w-12 animate-spin rounded-full border-4 border-[#dcebe5] border-t-[#398675]" />
            <h2 className="mt-5 text-lg font-bold text-[#183b37]">
              กำลังประมวลผลข้อมูลแผล
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              โปรดรอสักครู่ ระบบกำลังจัดเตรียมผลการประเมิน
            </p>
          </section>
        ) : evaluation ? (
          <ResultCard
            evaluation={evaluation}
            inventoryConfigured={availableStock !== null}
            inventorySizes={catalogStock}
            onReset={handleReset}
            sensitivities={sensitivities}
          />
        ) : (
          <Questionnaire
            answers={answers}
            onAnswer={handleAnswer}
            onSensitivitiesChange={setSensitivities}
            onSubmit={handleSubmit}
            sensitivities={sensitivities}
          />
        )}

        {historyError && screen === "assess" && evaluation && (
          <p
            aria-live="polite"
            className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"
            role="alert"
          >
            {historyError}
          </p>
        )}

        <footer className="mt-6 text-center text-xs leading-5 text-slate-400 print:hidden">
          ข้อมูลเพื่อการศึกษาและสนับสนุนการพิจารณาทางคลินิกเท่านั้น
        </footer>
      </div>
    </main>
  );
}
