import { useState } from "react";
import {
  questions,
  type WoundAnswerKey,
  type WoundAnswers,
  type WoundAnswerValue,
} from "../data/questions";

interface QuestionnaireProps {
  answers: Partial<WoundAnswers>;
  onAnswer: <K extends WoundAnswerKey>(key: K, value: WoundAnswers[K]) => void;
  onSubmit: () => void;
}

export default function Questionnaire({
  answers,
  onAnswer,
  onSubmit,
}: QuestionnaireProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const question = questions[currentStep];
  const selectedValue = answers[question.id] as WoundAnswerValue | undefined;
  const progress = ((currentStep + 1) / questions.length) * 100;

  function handleContinue() {
    if (currentStep === questions.length - 1) {
      onSubmit();
      return;
    }
    setCurrentStep((step) => step + 1);
  }

  return (
    <section className="rounded-[2rem] border border-[#e2ece9] bg-white p-5 shadow-[0_22px_70px_-48px_rgba(24,59,55,0.35)] sm:p-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold tracking-wide text-[#508078]">
            ขั้นตอน {currentStep + 1} จาก {questions.length}
          </p>
          <p className="mt-1 text-xs text-slate-500">การประเมินเบื้องต้น</p>
        </div>
        <span className="rounded-full bg-[#edf7f4] px-3 py-1.5 text-xs font-semibold text-[#367268]">
          {Math.round(progress)}%
        </span>
      </div>

      <div
        aria-label="ความคืบหน้า"
        className="mb-8 h-2 overflow-hidden rounded-full bg-[#edf2f0]"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={questions.length}
        aria-valuenow={currentStep + 1}
      >
        <div
          className="h-full rounded-full bg-[#4b9a88] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold leading-snug text-[#183b37] sm:text-2xl">
          {question.title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {question.description}
        </p>
      </div>

      <fieldset className="space-y-3">
        <legend className="sr-only">{question.title}</legend>
        {question.options.map((option) => {
          const selected = selectedValue === option.value;
          const inputId = `${question.id}-${option.value}`;
          return (
            <label
              key={option.value}
              htmlFor={inputId}
              className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-colors ${
                selected
                  ? "border-[#4b9a88] bg-[#f0f8f5] ring-2 ring-[#4b9a88]/15"
                  : "border-[#e7eeec] hover:border-[#a8cdc4] hover:bg-[#fbfdfc]"
              }`}
            >
              <input
                checked={selected}
                className="sr-only"
                id={inputId}
                name={question.id}
                onChange={() => onAnswer(question.id, option.value as WoundAnswers[typeof question.id])}
                type="radio"
                value={option.value}
              />
              <span
                aria-hidden="true"
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                  selected ? "border-[#4b9a88]" : "border-slate-300"
                }`}
              >
                {selected && <span className="h-2.5 w-2.5 rounded-full bg-[#4b9a88]" />}
              </span>
              <span className="min-w-0">
                <span className="block font-semibold text-[#254943]">
                  {option.label}
                </span>
                {option.description && (
                  <span className="mt-0.5 block text-sm text-slate-500">
                    {option.description}
                  </span>
                )}
              </span>
            </label>
          );
        })}
      </fieldset>

      <div className="mt-8 flex items-center justify-between gap-3">
        <button
          className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-50 disabled:invisible"
          disabled={currentStep === 0}
          onClick={() => setCurrentStep((step) => Math.max(0, step - 1))}
          type="button"
        >
          ย้อนกลับ
        </button>
        <button
          className="rounded-xl bg-[#286d62] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#205a51] disabled:cursor-not-allowed disabled:bg-slate-300"
          disabled={!selectedValue}
          onClick={handleContinue}
          type="button"
        >
          {currentStep === questions.length - 1 ? "ดูผลการประเมิน" : "ถัดไป"}
        </button>
      </div>
    </section>
  );
}
