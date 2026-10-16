import { useState } from "react";
import Questionnaire from "./components/Questionnaire";
import ResultCard from "./components/ResultCard";
import type { WoundAnswers } from "./data/questions";
import { evaluateWound, type WoundEvaluation } from "./utils/scorer";

export default function App() {
  const [answers, setAnswers] = useState<Partial<WoundAnswers>>({});
  const [evaluation, setEvaluation] = useState<WoundEvaluation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
      setEvaluation(evaluateWound(completeAnswers));
      setIsLoading(false);
    }, 1000);
  }

  function handleReset() {
    setAnswers({});
    setEvaluation(null);
    setIsLoading(false);
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
            ตอบคำถามเกี่ยวกับแผลทีละขั้น เพื่อดูตัวเลือกวัสดุปิดแผลที่สอดคล้องกับข้อมูลที่ให้
          </p>
        </header>

        {isLoading ? (
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
          <ResultCard evaluation={evaluation} onReset={handleReset} />
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
