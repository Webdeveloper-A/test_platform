"use client";

import { useEffect, useMemo, useState } from "react";

type OptionKey = "A" | "B" | "C" | "D";

type StartOption = {
  displayKey: OptionKey;
  valueKey: OptionKey;
  textUz: string;
  textRu?: string | null;
};

type StartQuestionPayload = {
  id: string;
  textUz: string;
  textRu?: string | null;
  difficulty: "MEDIUM" | "HARD" | "VERY_HARD";
  options: StartOption[];
};

type ResultPayload = {
  correctCount: number;
  totalCount: number;
  scorePercent: number;
  durationSeconds: number;
  breakdown: Array<{
    questionId: string;
    textUz: string;
    textRu?: string | null;
    selectedOption: string | null;
    correctOption: string;
    options: {
      A: { textUz: string; textRu?: string | null };
      B: { textUz: string; textRu?: string | null };
      C: { textUz: string; textRu?: string | null };
      D: { textUz: string; textRu?: string | null };
    };
  }>;
};

type AttemptDraft = {
  answers: Record<string, string>;
  currentIndex: number;
};

function formatSeconds(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function pick(locale: string, uz: string, ru?: string | null) {
  return locale === "ru" && ru ? ru : uz;
}

async function readJsonSafe(response: Response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

function getDraftKey(attemptId: string) {
  return `ctp_attempt_draft_${attemptId}`;
}

function readDraft(attemptId: string): AttemptDraft | null {
  try {
    const raw = localStorage.getItem(getDraftKey(attemptId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AttemptDraft;
    return {
      answers: parsed.answers || {},
      currentIndex: Number.isFinite(parsed.currentIndex) ? parsed.currentIndex : 0,
    };
  } catch {
    return null;
  }
}

function saveDraft(attemptId: string, draft: AttemptDraft) {
  try {
    localStorage.setItem(getDraftKey(attemptId), JSON.stringify(draft));
  } catch {}
}

function clearDraft(attemptId: string) {
  try {
    localStorage.removeItem(getDraftKey(attemptId));
  } catch {}
}

export function TestRunner({
  locale,
  testId,
  testTitle,
  durationMinutes,
}: {
  locale: string;
  testId: string;
  testTitle: string;
  durationMinutes: number;
}) {
  const [status, setStatus] = useState<"idle" | "active" | "submitting" | "done">("idle");
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<StartQuestionPayload[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
  const [result, setResult] = useState<ResultPayload | null>(null);
  const [error, setError] = useState("");
  const [resumeNotice, setResumeNotice] = useState("");

  useEffect(() => {
    if (status !== "active") return;

    if (timeLeft <= 0) {
      void submit();
      return;
    }

    const interval = window.setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [status, timeLeft]);

  useEffect(() => {
    if (status !== "active" || !attemptId) return;

    saveDraft(attemptId, {
      answers,
      currentIndex,
    });
  }, [attemptId, answers, currentIndex, status]);

  const progress = useMemo(() => {
    if (!questions.length) return 0;
    return Math.round((Object.keys(answers).length / questions.length) * 100);
  }, [answers, questions]);

  async function start() {
    try {
      setError("");
      setResumeNotice("");

      const response = await fetch("/api/attempts/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testId }),
      });

      const data = await readJsonSafe(response);

      if (!response.ok) {
        setError((data as { message?: string }).message || "Testni boshlashda xatolik yuz berdi");
        return;
      }

      const payload = data as {
        attemptId: string;
        resumed: boolean;
        durationMinutes: number;
        timeLeftSeconds: number;
        questions: StartQuestionPayload[];
      };

      setAttemptId(payload.attemptId);
      setQuestions(payload.questions || []);
      setTimeLeft(payload.timeLeftSeconds ?? payload.durationMinutes * 60);
      setStatus("active");

      const draft = readDraft(payload.attemptId);

      if (draft) {
        setAnswers(draft.answers || {});
        setCurrentIndex(
          Math.max(0, Math.min(draft.currentIndex || 0, (payload.questions?.length || 1) - 1))
        );
      } else {
        setAnswers({});
        setCurrentIndex(0);
      }

      if (payload.resumed) {
        setResumeNotice("Oldingi urinish davom ettirildi.");
      }
    } catch {
      setError("Server bilan bog‘lanishda xatolik yuz berdi.");
    }
  }

  async function submit() {
    if (!attemptId) return;

    try {
      setStatus("submitting");
      setError("");

      const response = await fetch("/api/attempts/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attemptId,
          answers,
        }),
      });

      const data = await readJsonSafe(response);

      if (!response.ok) {
        setError((data as { message?: string }).message || "Testni yakunlashda xatolik yuz berdi");
        setStatus("active");
        return;
      }

      clearDraft(attemptId);
      setResult(data as ResultPayload);
      setStatus("done");
    } catch {
      setError("Server bilan bog‘lanishda xatolik yuz berdi.");
      setStatus("active");
    }
  }

  const currentQuestion = questions[currentIndex];

  if (status === "idle") {
    return (
      <div className="card">
        <h2>{testTitle}</h2>
        <p className="muted">Davomiyligi: {durationMinutes} daqiqa</p>
        {error ? (
          <p className="small" style={{ color: "crimson" }}>
            {error}
          </p>
        ) : null}
        <button className="btn btn-primary" onClick={start} type="button">
          Testni boshlash
        </button>
      </div>
    );
  }

  if (status === "done" && result) {
    return (
      <div className="grid">
        <div className="card">
          <h2>Natija</h2>
          <div className="stat-list">
            <div className="kpi">
              <div>To‘g‘ri</div>
              <div className="kpi-number">{result.correctCount}</div>
            </div>
            <div className="kpi">
              <div>Jami</div>
              <div className="kpi-number">{result.totalCount}</div>
            </div>
            <div className="kpi">
              <div>Foiz</div>
              <div className="kpi-number">{result.scorePercent.toFixed(1)}%</div>
            </div>
            <div className="kpi">
              <div>Vaqt</div>
              <div className="kpi-number">{formatSeconds(result.durationSeconds)}</div>
            </div>
          </div>
        </div>

        <div className="grid">
          {result.breakdown.map((item, index) => (
            <div key={item.questionId} className="card">
              <strong>
                {index + 1}. {pick(locale, item.textUz, item.textRu)}
              </strong>

              <div className="options">
                {(["A", "B", "C", "D"] as const).map((optionKey) => {
                  const option = item.options[optionKey];
                  const isCorrect = item.correctOption === optionKey;
                  const isSelected = item.selectedOption === optionKey;

                  return (
                    <div
                      key={optionKey}
                      className={`option-btn ${isCorrect ? "correct" : ""} ${
                        !isCorrect && isSelected ? "wrong" : ""
                      }`.trim()}
                    >
                      <strong>{optionKey})</strong> {pick(locale, option.textUz, option.textRu)}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid">
      <div className="card">
        <div className="header">
          <div>
            <h2>{testTitle}</h2>
            <p className="muted">
              Savol {currentIndex + 1} / {questions.length}
            </p>
          </div>
          <div className="badge">{formatSeconds(timeLeft)}</div>
        </div>

        <div className="progress">
          <span style={{ width: `${progress}%` }} />
        </div>

        <div className="space-top muted small">
          Javob berilgan: {Object.keys(answers).length} / {questions.length}
        </div>

        {resumeNotice ? <p className="small muted">{resumeNotice}</p> : null}

        {error ? (
          <p className="small" style={{ color: "crimson" }}>
            {error}
          </p>
        ) : null}
      </div>

      {currentQuestion ? (
        <div className="card">
          <div className="row space-bottom">
            <span
              className={`badge ${
                currentQuestion.difficulty === "HARD"
                  ? "hard"
                  : currentQuestion.difficulty === "VERY_HARD"
                  ? "very-hard"
                  : ""
              }`.trim()}
            >
              {currentQuestion.difficulty}
            </span>
          </div>

          <h3>{pick(locale, currentQuestion.textUz, currentQuestion.textRu)}</h3>

          <div className="options">
            {currentQuestion.options.map((option) => (
              <button
                key={`${currentQuestion.id}-${option.displayKey}-${option.valueKey}`}
                type="button"
                className={`option-btn ${
                  answers[currentQuestion.id] === option.valueKey ? "active" : ""
                }`.trim()}
                onClick={() =>
                  setAnswers((prev) => ({
                    ...prev,
                    [currentQuestion.id]: option.valueKey,
                  }))
                }
              >
                <strong>{option.displayKey})</strong> {pick(locale, option.textUz, option.textRu)}
              </button>
            ))}
          </div>

          <div className="row space-top">
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
            >
              Oldingi
            </button>

            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1))}
            >
              Keyingi
            </button>

            <button
              className="btn btn-primary"
              type="button"
              onClick={submit}
              disabled={status === "submitting"}
            >
              {status === "submitting" ? "Yuborilmoqda..." : "Testni yakunlash"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}