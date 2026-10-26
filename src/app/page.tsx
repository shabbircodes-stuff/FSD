"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, NotebookPen, Search, X } from "lucide-react";

import {
  cupboard,
  deductions,
  evidence,
  fresh,
  motive,
  locations,
  suspects,
  type Evidence,
  type Progress,
} from "../data/case";
import { CaseContent } from "../components/CaseContent";

function cx(...v: (string | boolean | undefined)[]) {
  return v.filter(Boolean).join(" ");
}

export default function Home() {
  const [p, setP] = useState<Progress>(fresh),
    [ready, setReady] = useState(false),
    [inspect, setInspect] = useState<string | null>(null),
    [toast, setToast] = useState(""),
    [sync, setSync] = useState("Local save"),
    [showLog, setShowLog] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("paradox.case001.v1");
      if (raw) {
        const s = JSON.parse(raw);
        setP({ ...fresh, ...s });
        setSync("Saved locally");
      }
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem("paradox.case001.v1", JSON.stringify(p));
      setSync("Saved locally");
    } catch {
      setSync("Save unavailable");
    }
  }, [p, ready]);
  const discovered = useMemo(
    () =>
      evidence
        .filter((e) => p.evidence.includes(e.id))
        .concat(p.evidence.includes("weapon") ? [cupboard] : []),
    [p.evidence],
  );
  const progress = Math.min(
    100,
    Math.round((discovered.length / (evidence.length + 1)) * 100),
  );
  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2700);
  };
  const upd = (v: Partial<Progress>) => setP((old) => ({ ...old, ...v }));
  function start() {
    setP({ ...fresh, started: true, section: "case" });
    notify("A new investigation has begun. Progress saves on this device.");
  }
  function collect(id: string) {
    if (p.evidence.includes(id)) return;
    upd({ evidence: [...p.evidence, id] });
    notify("Added to the evidence notebook");
  }
  function askQuestion(id: string) {
    const questionId = `${p.suspect}:${id}`;
    if (!p.asked.includes(questionId)) upd({ asked: [...p.asked, questionId] });
  }
  function connectClue(deductionId: string, clueId: string) {
    const current = p.connections[deductionId] ?? [];
    const next = current.includes(clueId)
      ? current.filter((id) => id !== clueId)
      : [...current, clueId];
    upd({ connections: { ...p.connections, [deductionId]: next } });
  }
  function discoverWeapon() {
    if (!p.evidence.includes("weapon")) {
      upd({ evidence: [...p.evidence, "weapon"] });
      notify("New evidence recovered · the wrapped bronze mount");
    } else notify("The cupboard has already been searched.");
  }
  function completeDeduction(id: string) {
    const d = deductions.find((x) => x.id === id)!;
    const selected = p.connections[id] ?? [];
    if (
      d.clues.every((c) => selected.includes(c)) &&
      !p.deductions.includes(id)
    ) {
      upd({ deductions: [...p.deductions, id] });
      notify(`Deduction recorded · ${d.name}`);
    } else if (p.deductions.includes(id))
      notify("This deduction is already in your case notes.");
    else
      notify("Connect the listed evidence before recording this conclusion.");
  }
  async function accuse() {
    if (p.support.length !== 3) {
      notify("Select exactly three pieces of collected evidence.");
      return;
    }
    try {
      const r = await fetch("/api/cases/case-001/accusation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          suspect: p.killer,
          motive: p.motive,
          evidenceIds: p.support,
        }),
      });
      const result = await r.json();
      upd({
        attempts: p.attempts + 1,
        ...(result.correct ? { solved: true } : {}),
      });
      if (result.correct) {
        upd({ solved: true, attempts: p.attempts + 1, section: "resolution" });
        notify("The evidence holds. Case closed.");
      } else if (result.identityCorrect) {
        notify(
          "Your theory is right. Strengthen the evidence before presenting it.",
        );
      } else notify("Contradictions remain. Revisit the case and try again.");
    } catch {
      notify(
        "Unable to check the accusation. Check your connection and retry.",
      );
    }
  }
  function nav(section: string) {
    upd({ section });
    setInspect(null);
  }
  if (!ready)
    return (
      <main className="loading">
        PARADOX <span>Opening case file</span>
      </main>
    );
  const activeLoc = locations[p.location],
    activeObject = activeLoc?.objects.find((o) => o[0] === inspect),
    selectedEvidence = discovered.find((e) => e.id === inspect);
  const canOpenCupboard =
    p.evidence.includes("mount") &&
    (p.evidence.includes("note") || p.evidence.includes("report"));
  return (
    <main className="app-shell">
      <header className="topbar">
        <a
          className="wordmark"
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            nav("home");
          }}
        >
          <span className="brand-mark">P.</span>
          <span>
            PARA<span className="muted-word">DOX</span>
          </span>
        </a>
        <div className="top-center">
          Case 001 <i>·</i> The Last Light at Bellweather
        </div>
        <div className="top-actions">
          <span className="save-status">
            <span className="save-dot" />
            {sync}
          </span>
        </div>
      </header>
      {p.section === "home" || !p.started ? (
        <section className="landing" id="home">
          <div className="landing-copy">
            <p className="eyebrow">A museum murder mystery</p>
            <div className="landing-case">
              <div className="case-no">Case 001 · About 10 minutes</div>
              <h2>The Last Light at Bellweather</h2>
              <p>
                A curator is dead, a museum record is missing, and five people
                have different stories. Explore the rooms, gather evidence, and
                decide what happened.
              </p>
            </div>
            <button
              className="primary-button start-button"
              onClick={() =>
                p.started ? nav(p.solved ? "resolution" : "case") : start()
              }
            >
              {p.started ? "Continue investigation" : "Begin investigation"}{" "}
              <ArrowRight size={17} />
            </button>
          </div>
        </section>
      ) : (
        <div className="workspace">
          <nav className="game-nav" aria-label="Case sections">
            <label className="section-picker">
              <span>Go to</span>
              <select
                value={p.section}
                onChange={(event) => nav(event.target.value)}
                aria-label="Choose a case section"
              >
                {[
                  ["case", "Briefing"],
                  ["explore", "Explore the museum"],
                  ["notebook", `Evidence (${discovered.length})`],
                  ["interviews", "Interview suspects"],
                  ["deduction", "Connect the clues"],
                  ["timeline", "Review the timeline"],
                  ["accusation", "Make an accusation"],
                ].map(([section, label]) => (
                  <option key={section} value={section}>{label}</option>
                ))}
                {p.solved && <option value="resolution">Case resolution</option>}
              </select>
            </label>
            <div className="game-progress">
              <span>Progress</span>
              <b>{progress}%</b>
              <div className="progress-track">
                <i style={{ width: `${progress}%` }} />
              </div>
            </div>
          </nav>{" "}
          <section className="main-panel">
            <CaseContent
              p={p}
              discovered={discovered}
              activeLoc={activeLoc}
              canOpenCupboard={canOpenCupboard}
              nav={nav}
              setInspect={setInspect}
              upd={upd}
              notify={notify}
              collect={collect}
              discoverWeapon={discoverWeapon}
              askQuestion={askQuestion}
              completeDeduction={completeDeduction}
              connectClue={connectClue}
              accuse={accuse}
              start={start}
            />
          </section>
        </div>
      )}
      {toast && (
        <div role="status" className="toast">
          <span className="toast-mark">
            <Check size={14} />
          </span>
          {toast}
        </div>
      )}
      {(activeObject || selectedEvidence) && (
        <div className="modal-backdrop" onClick={() => setInspect(null)}>
          <section
            className="inspection"
            role="dialog"
            aria-modal="true"
            aria-labelledby="inspection-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="inspection-top">
              <span>
                <Search size={14} /> EVIDENCE EXAMINATION
              </span>
              <button
                className="icon-button"
                onClick={() => setInspect(null)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            {activeObject ? (
              <>
                <span className="eyebrow">
                  {activeLoc.name} <i>·</i> {activeObject[5]}
                </span>
                <h2 id="inspection-title">{activeObject[1]}</h2>
                <p>{activeObject[2]}</p>
                <div className="inspection-detail">
                  <span>Observation</span>
                  <p>{activeObject[4]}</p>
                </div>
                {p.evidence.includes(activeObject[0]) ? (
                  <div className="already-collected">
                    <Check size={15} /> RECORDED IN YOUR NOTEBOOK
                  </div>
                ) : (
                  <button
                    className="primary-button"
                    onClick={() => collect(activeObject[0])}
                  >
                    Add to evidence notebook <ArrowRight size={16} />
                  </button>
                )}
                {activeObject[0] === "mount" && canOpenCupboard && (
                  <button
                    className="secondary-button"
                    onClick={() => {
                      setInspect(null);
                      discoverWeapon();
                    }}
                  >
                    Search the staff cupboard
                  </button>
                )}
              </>
            ) : (
              selectedEvidence && (
                <>
                  <span className="eyebrow">
                    {selectedEvidence.place} <i>·</i>{" "}
                    {selectedEvidence.category}
                  </span>
                  <h2 id="inspection-title">{selectedEvidence.title}</h2>
                  <p>{selectedEvidence.text}</p>
                  <div className="inspection-detail">
                    <span>Investigator’s observation</span>
                    <p>{selectedEvidence.detail}</p>
                  </div>
                  <div className="already-collected">
                    <Check size={15} /> COLLECTED · CASE NOTE RETAINED
                  </div>
                </>
              )
            )}
          </section>
        </div>
      )}
      {showLog && (
        <div className="modal-backdrop" onClick={() => setShowLog(false)}>
          <section
            className="inspection case-log"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="inspection-top">
              <span>
                <NotebookPen size={14} /> INVESTIGATION NOTES
              </span>
              <button
                className="icon-button"
                onClick={() => setShowLog(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <h2>Case notes</h2>
            <p>
              {discovered.length} evidence items collected.{" "}
              {p.deductions.length} deductions established.{" "}
              {p.interviews.length} interviews recorded.
            </p>
            <div className="inspection-detail">
              <span>Current theory</span>
              <p>
                {p.solved
                  ? "Case closed. Mara Voss was responsible."
                  : p.deductions.length
                    ? deductions
                        .filter((d) => p.deductions.includes(d.id))
                        .map((d) => d.name)
                        .join(" · ")
                    : "No conclusions recorded yet."}
              </p>
            </div>
            <button
              className="secondary-button"
              onClick={() => {
                setShowLog(false);
                nav("notebook");
              }}
            >
              Open evidence notebook
            </button>
          </section>
        </div>
      )}
      <footer className="mobile-footer">
        <span>
          PARADOX <i>·</i> Case 001
        </span>
        <span>{sync}</span>
      </footer>
    </main>
  );
}
