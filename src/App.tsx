import { useEffect, useState } from "react";
import HomeMenu, { type AppScreen } from "./components/HomeMenu";
import InventoryManager from "./components/InventoryManager";
import Questionnaire from "./components/Questionnaire";
import ResultCard from "./components/ResultCard";
import SafetyGuide from "./components/SafetyGuide";
import { plasters } from "./data/plasters";
import type { WoundAnswers } from "./data/questions";
import { evaluateWound, type WoundEvaluation } from "./utils/scorer";

const INVENTORY_STORAGE_KEY = "wound-dressing-inventory";
const plasterBrands = plasters.map((product) => product.brand);

export default function App() {
  const [answers, setAnswers] = useState<Partial<WoundAnswers>>({});
  const [evaluation, setEvaluation] = useState<WoundEvaluation | null>(null);
  const [screen, setScreen] = useState<AppScreen>("home");
  const [availableBrands, setAvailableBrands] = useState<string[] | null>(null);
  const [isInventoryLoading, setIsInventoryLoading] = useState(true);
  const [inventoryError, setInventoryError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    try {
      const storedInventory = window.localStorage.getItem(INVENTORY_STORAGE_KEY);
      if (storedInventory !== null) {
        const parsed: unknown = JSON.parse(storedInventory);
        if (
          !Array.isArray(parsed) ||
          parsed.some(
            (brand) =>
              typeof brand !== "string" ||
              !plasterBrands.includes(brand),
          )
        ) {
          throw new Error("Stored inventory has an invalid format.");
        }
        setAvailableBrands(parsed);
      }
    } catch {
      setInventoryError("อ่านข้อมูลสต็อกจากอุปกรณ์นี้ไม่ได้ กรุณาบันทึกสต็อกใหม่");
    } finally {
      setIsInventoryLoading(false);
    }
  }, []);

  function handleAnswer<K extends keyof WoundAnswers>(
    key: K,
    value: WoundAnswers[K],
  ) {
    setAnswers((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit() {
    if (
      !answers.cause ||
      !answers.tissue ||
      !answers.exudate ||
      !answers.infection
    ) {
      return;
    }

    const completeAnswers: WoundAnswers = {
      cause: answers.cause,
      tissue: answers.tissue,
      exudate: answers.exudate,
      infection: answers.infection,
    };

    setIsLoading(true);
    window.setTimeout(() => {
      setEvaluation(
        evaluateWound(
          completeAnswers,
          availableBrands === null ? undefined : new Set(availableBrands),
        ),
      );
      setIsLoading(false);
    }, 1000);
  }

  function handleInventoryApply(brands: string[]) {
    try {
      window.localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(brands));
      setAvailableBrands(brands);
      setInventoryError(null);
      setScreen("home");
    } catch {
      setInventoryError("บันทึกสต็อกในอุปกรณ์นี้ไม่ได้ กรุณาลองอีกครั้ง");
    }
  }

  function handleNavigate(nextScreen: AppScreen) {
    if (nextScreen === "assess") {
      setAnswers({});
      setEvaluation(null);
      setIsLoading(false);
    }
    setScreen(nextScreen);
  }

  function handleReset() {
    setAnswers({});
    setEvaluation(null);
    setIsLoading(false);
    setScreen("assess");
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8 text-center sm:mb-10">
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
            className="mb-4 rounded-xl px-3 py-2 text-sm font-semibold text-[#286d62] transition hover:bg-white"
            onClick={() => handleNavigate("home")}
            type="button"
          >
            ← กลับหน้าหลัก
          </button>
        )}

        {screen === "home" ? (
          <HomeMenu
            availableBrandCount={availableBrands?.length ?? null}
            isInventoryLoading={isInventoryLoading}
            onNavigate={handleNavigate}
          />
        ) : screen === "inventory" ? (
          <InventoryManager
            error={inventoryError}
            initialBrands={availableBrands ?? []}
            isLoading={isInventoryLoading}
            onApply={handleInventoryApply}
          />
        ) : screen === "safety" ? (
          <SafetyGuide />
        ) : screen === "about" ? (
          <section className="space-y-4 rounded-[2rem] border border-[#e2ece9] bg-white p-6 shadow-[0_22px_70px_-48px_rgba(24,59,55,0.35)] sm:p-8">
            <h2 className="text-xl font-bold text-[#183b37]">เกี่ยวกับเครื่องมือนี้</h2>
            <p className="text-sm leading-6 text-slate-600">
              เครื่องมือนี้ใช้คำตอบที่ให้เพื่อแสดงกลุ่มวัสดุปิดแผลตัวอย่างตามกฎเบื้องต้น
              และกรองผลิตภัณฑ์ตามสต็อกที่เภสัชกรบันทึกไว้ในเบราว์เซอร์นี้
            </p>
            <p className="text-sm leading-6 text-slate-600">
              คำตอบการประเมินไม่ได้ถูกบันทึก ส่วนรายการสต็อกจะเก็บไว้ในอุปกรณ์นี้เท่านั้น
              ไม่ได้ซิงก์ไปยังอุปกรณ์อื่น
            </p>
            <p className="rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">
              ผลลัพธ์เป็นข้อมูลประกอบการพิจารณา ไม่ใช่การวินิจฉัยหรือคำสั่งการรักษา
              โปรดให้บุคลากรทางการแพทย์ประเมินผู้ป่วยและเลือกผลิตภัณฑ์อย่างเหมาะสม
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
            inventoryConfigured={availableBrands !== null}
            onReset={handleReset}
          />
        ) : (
          <Questionnaire
            answers={answers}
            onAnswer={handleAnswer}
            onSubmit={handleSubmit}
          />
        )}

        <footer className="mt-6 text-center text-xs leading-5 text-slate-400">
          ข้อมูลเพื่อการศึกษาและสนับสนุนการพิจารณาทางคลินิกเท่านั้น
        </footer>
      </div>
    </main>
  );
}
