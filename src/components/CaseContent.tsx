"use client";

import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  Fingerprint,
  KeyRound,
  NotebookPen,
  Search,
} from "lucide-react";
import {
  cupboard,
  deductions,
  evidence,
  motive,
  locations,
  suspects,
  type Evidence,
  type Progress,
} from "../data/case";

type Props = {
  p: Progress;
  discovered: Evidence[];
  activeLoc: (typeof locations)[number];
  canOpenCupboard: boolean;
  nav: (section: string) => void;
  setInspect: (id: string | null) => void;
  upd: (values: Partial<Progress>) => void;
  notify: (message: string) => void;
  collect: (id: string) => void;
  discoverWeapon: () => void;
  askQuestion: (id: string) => void;
  completeDeduction: (id: string) => void;
  connectClue: (deductionId: string, clueId: string) => void;
  accuse: () => Promise<void>;
  start: () => void;
};

const cx = (...values: (string | boolean | undefined)[]) =>
  values.filter(Boolean).join(" ");

export function CaseContent({
  p,
  discovered,
  activeLoc,
  canOpenCupboard,
  nav,
  setInspect,
  upd,
  notify,
  collect,
  discoverWeapon,
  askQuestion,
  completeDeduction,
  connectClue,
  accuse,
  start,
}: Props) {
  return (
    <>
      {p.section === "case" && (
        <>
          <div className="section-kicker">
            <span>Case 001</span>
            <span>Bellweather Museum</span>
          </div>
          <div className="brief-layout">
            <div className="brief-main">
              <p className="eyebrow">Initial briefing</p>
              <h1 className="display-title">The Last Light at Bellweather</h1>
              <p className="standfirst">
                At 9:30 PM, Dr. Elias Rowan was found dead in the museum’s
                restoration room. The corridor camera had stopped recording. The
                astrolabe remained behind glass. Nothing appeared to be missing.
              </p>
              <div className="brief-facts">
                <Fact label="Victim" value="Dr. Elias Rowan, 54" />
                <Fact label="Time of death" value="9:12–9:19 PM" />
                <Fact label="Location" value="Restoration room" />
                <Fact label="Suspects" value="Five persons of interest" />
              </div>
              <div className="quote-note">
                “The catalogue is correct. The restoration record is not.”
                <span>— ELIAS ROWAN · UNFINISHED NOTE</span>
              </div>
            </div>
            <aside className="brief-aside">
              <p className="eyebrow">What we know</p>
              <ul className="fact-list">
                <li>A bronze display mount is missing.</li>
                <li>The corridor camera went dark.</li>
                <li>Elias found discrepancies in the records.</li>
                <li>Five people had reason to fear what he found.</li>
              </ul>
              <div className="brief-note">
                <span>
                  Your task: find the evidence, question the suspects, and work
                  out who had a reason to kill Elias.
                </span>
              </div>
            </aside>
          </div>
          <div className="brief-footer">
            <span>
              01 <i>/</i> THE INVESTIGATION
            </span>
            <button
              className="primary-button"
              onClick={() => {
                upd({ section: "explore" });
                notify("Investigation underway");
              }}
            >
              Enter the museum <ArrowRight size={17} />
            </button>
          </div>
        </>
      )}
      {p.section === "explore" && (
        <>
          <div className="section-kicker">
            <span>Investigation · Locations</span>
            <span>Select an object to examine</span>
          </div>
          <div className="explore-heading">
            <div>
              <p className="eyebrow">Scene examination</p>
              <h1 className="display-title small-title">Explore the museum</h1>
            </div>
            <p className="muted-copy">
              Four rooms. A dozen small details.
              <br />
              Choose where to look closer.
            </p>
          </div>
          <div className="location-summary">
            <span className="location-index">
              Room {p.location + 1} of {locations.length}
            </span>
            <div>
              <span className="eyebrow">{activeLoc.sub}</span>
              <h2>{activeLoc.name}</h2>
              <p>{activeLoc.intro}</p>
            </div>
          </div>
          <div className="location-tabs">
            {locations.map((l, i) => (
              <button
                key={l.name}
                className={cx(p.location === i && "active")}
                onClick={() => {
                  upd({ location: i });
                  setInspect(null);
                }}
              >
                <span>0{i + 1}</span>
                {l.name.replace("The ", "")}
                <i className={p.location === i ? "tab-current" : ""} />
              </button>
            ))}
          </div>
          <div className="object-list">
            <div className="object-list-head">
              <span>Objects to examine</span>
              <span>Look for useful evidence</span>
            </div>
            <div className="object-grid">
              {activeLoc.objects.map((o, i) => (
                <button
                  key={o[0]}
                  className="object-card"
                  onClick={() => {
                    setInspect(o[0]);
                  }}
                >
                  <span className="object-no">
                    0{i + 1} <ChevronRight size={14} />
                  </span>
                  <span className="object-title">{o[1]}</span>
                  <span className="object-blurb">{o[2]}</span>
                  <span className="object-footer">
                    <span>
                      {p.evidence.includes(o[0]) ? (
                        <>
                          <Check size={12} /> COLLECTED
                        </>
                      ) : (
                        "Examine"
                      )}
                    </span>
                    <ArrowRight size={14} />
                  </span>
                </button>
              ))}
            </div>
          </div>
          {canOpenCupboard && (
            <button className="hidden-discovery" onClick={discoverWeapon}>
              <span>
                <Search size={17} /> NEW AREA DISCOVERED
              </span>
              <b>
                Staff supply cupboard <ArrowRight size={15} />
              </b>
              <small>
                A narrow groove in the pedestal and a trace of wax suggest
                checking the service corridor.
              </small>
            </button>
          )}
        </>
      )}
      {p.section === "notebook" && (
        <>
          <SectionHead
            eyebrow="Investigation record"
            title="Evidence &amp; observations"
            desc="A record of what you’ve found. Read closely; individual details may mean more together."
          />
          <div className="notebook-summary">
            <NotebookPen size={18} />
            <span>
              <b>{discovered.length} pieces recorded</b>
              <small>
                Collected evidence remains available throughout the
                investigation.
              </small>
            </span>
            <span className="notebook-count">Case 001</span>
          </div>
          {["PHYSICAL", "DOCUMENT", "TESTIMONY", "TIMELINE"].map((cat) => (
            <div className="evidence-group" key={cat}>
              <div className="object-list-head">
                <span>
                  {cat === "DOCUMENT"
                    ? "Documents & records"
                    : cat === "TESTIMONY"
                      ? "Testimony"
                      : cat === "TIMELINE"
                        ? "Timeline & observations"
                        : "Physical evidence"}
                </span>
                <span>
                  {discovered
                    .filter((e) => e.category === cat)
                    .length.toString()
                    .padStart(2, "0")}{" "}
                  ITEMS
                </span>
              </div>
              <div className="evidence-rows">
                {discovered
                  .filter((e) => e.category === cat)
                  .map((e) => (
                    <button
                      className="evidence-row"
                      onClick={() => setInspect(e.id)}
                      key={e.id}
                    >
                      <span className="evidence-type">
                        {e.category === "PHYSICAL" ? (
                          <Fingerprint size={16} />
                        ) : e.category === "TIMELINE" ? (
                          <Clock3 size={16} />
                        ) : (
                          <BookOpen size={16} />
                        )}
                      </span>
                      <span>
                        <b>{e.title}</b>
                        <small>
                          {e.place} <i>·</i> {e.text}
                        </small>
                      </span>
                      <ChevronRight size={15} />
                    </button>
                  ))}
              </div>
            </div>
          ))}
          {!discovered.length && (
            <EmptyState
              text="No evidence collected yet. Explore the museum and examine objects to begin."
              onClick={() => nav("explore")}
            />
          )}
        </>
      )}
      {p.section === "interviews" && (
        <>
          <div className="section-kicker">
            <span>Investigation · Interviews</span>
            <span>{p.interviews.length} of 5 interviewed</span>
          </div>
          <div className="interview-layout">
            <div className="suspect-list">
              <p className="eyebrow">Choose someone to interview</p>
              {suspects.map((s, i) => (
                <button
                  key={s.name}
                  onClick={() => upd({ suspect: i })}
                  className={cx("suspect-tab", p.suspect === i && "active")}
                >
                  <span className={`avatar av-${i}`}>{s.portrait}</span>
                  <span>
                    <b>{s.name}</b>
                    <small>{s.role}</small>
                  </span>
                  {p.interviews.includes(s.name) && (
                    <Check className="interview-check" size={14} />
                  )}
                </button>
              ))}
            </div>
            <div className="interview-sheet">
              <div className="portrait-strip">
                <div className={`portrait-large av-${p.suspect}`}>
                  {suspects[p.suspect].portrait}
                </div>
                <div>
                  <span className="eyebrow">
                    PERSON OF INTEREST 0{p.suspect + 1}
                  </span>
                  <h1>{suspects[p.suspect].name}</h1>
                  <p>
                    {suspects[p.suspect].age} <i>·</i>{" "}
                    {suspects[p.suspect].role}
                  </p>
                </div>
              </div>
              <div className="relation-line">
                <span>Relationship to Elias</span>
                <b>{suspects[p.suspect].relation}</b>
              </div>
              <div className="testimony">
                <span className="eyebrow">First statement</span>
                <p>{suspects[p.suspect].initial}</p>
              </div>
              <div className="questions">
                <span className="eyebrow">Ask a question</span>
                {suspects[p.suspect].lines.map((line, i) => {
                  const id = `${p.suspect}:${i}`;
                  return (
                    <div className="question-item" key={id}>
                      <button
                        className="question-choice"
                        onClick={() => askQuestion(String(i))}
                      >
                        {
                          [
                            "Ask about their relationship",
                            "Ask about the record discrepancies",
                            "Ask where they were at 9:15 PM",
                          ][i]
                        }{" "}
                        <ChevronDown size={14} />
                      </button>
                      {p.asked.includes(id) && (
                        <p className="dialogue-a">{line}</p>
                      )}
                    </div>
                  );
                })}
                {suspects[p.suspect].unlock
                  .filter((u) => p.evidence.includes(u.needs))
                  .map((u) => {
                    const id = `${p.suspect}:unlock-${u.needs}`;
                    const title =
                      evidence.find((e) => e.id === u.needs)?.title ||
                      cupboard.title;
                    return (
                      <div className="question-item unlocked" key={id}>
                        <button
                          className="question-choice"
                          onClick={() => askQuestion(`unlock-${u.needs}`)}
                        >
                          Ask about {title} <ChevronDown size={14} />
                        </button>
                        {p.asked.includes(id) && (
                          <p className="dialogue-a">{u.say}</p>
                        )}
                      </div>
                    );
                  })}
                <button
                  className="text-button"
                  onClick={() => {
                    if (!p.interviews.includes(suspects[p.suspect].name))
                      upd({
                        interviews: [...p.interviews, suspects[p.suspect].name],
                      });
                    notify(`Interview recorded · ${suspects[p.suspect].name}`);
                  }}
                >
                  <Check size={15} /> MARK INTERVIEWED
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      {p.section === "deduction" && (
        <>
          <SectionHead
            eyebrow="Investigation · Analysis"
            title="The deduction board"
            desc="Connect what you’ve found. The right conclusion requires more than one clue."
          />
          <div className="deduction-note">
            <span>
              Choose a question. Compare the listed evidence with the items in
              your notebook, then record your conclusion.
            </span>
          </div>
          <div className="deduction-list">
            {deductions.map((d, i) => {
              const linked = p.connections[d.id] ?? [],
                ready = d.clues.every((c) => linked.includes(c)),
                done = p.deductions.includes(d.id);
              return (
                <article
                  key={d.id}
                  className={cx("deduction-card", done && "deduction-done")}
                >
                  <div className="deduction-no">0{i + 1}</div>
                  <div className="deduction-body">
                    <span className="eyebrow">
                      {done
                        ? "Conclusion recorded"
                        : `${linked.length} OF ${d.clues.length} CLUES CONNECTED`}
                    </span>
                    <h2>{d.name}</h2>
                    <p>{d.question}</p>
                    <div className="clue-chips">
                      {d.clues.map((c) => {
                        const ev = evidence.find((e) => e.id === c) || cupboard,
                          has = p.evidence.includes(c),
                          selected = linked.includes(c);
                        return (
                          <button
                            type="button"
                            key={c}
                            disabled={!has || done}
                            aria-pressed={selected}
                            className={cx(
                              has && "clue-found",
                              selected && "clue-linked",
                            )}
                            onClick={() => connectClue(d.id, c)}
                          >
                            {selected ? (
                              <Check size={12} />
                            ) : has ? (
                              <BookOpen size={12} />
                            ) : (
                              <KeyRound size={12} />
                            )}{" "}
                            {has ? ev.title : "Clue not found yet"}
                          </button>
                        );
                      })}
                    </div>
                    {done && (
                      <p className="deduction-conclusion">“{d.conclusion}”</p>
                    )}
                  </div>
                  <button
                    className={cx("record-button", !ready && "disabled")}
                    disabled={!ready || done}
                    onClick={() => completeDeduction(d.id)}
                  >
                    {done ? (
                      <>
                        <Check size={15} /> RECORDED
                      </>
                    ) : ready ? (
                      "Record deduction"
                    ) : d.clues.every((c) => p.evidence.includes(c)) ? (
                      "Connect clues"
                    ) : (
                      "Find evidence"
                    )}
                    {!ready && <ChevronRight size={14} />}
                  </button>
                </article>
              );
            })}
          </div>
        </>
      )}
      {p.section === "timeline" && (
        <>
          <SectionHead
            eyebrow="Investigation · Timeline"
            title="A night in fragments"
            desc="The times emerge as witnesses and records are compared. The camera gap leaves seven minutes unaccounted for."
          />
          <div className="timeline-key">
            <span>
              <i className="known-dot" /> Established
            </span>
            <span>
              <i className="inferred-dot" /> Inferred
            </span>
            <span>
              <i className="unknown-dot" /> Unconfirmed
            </span>
          </div>
          <div className="timeline">
            {[
              {
                time: "7:45 PM",
                name: "Museum staff prepare for the exhibition",
                clue: "base",
                status: "known",
              },
              {
                time: "8:00 PM",
                name: "Guests arrive at Bellweather",
                clue: "base",
                status: "known",
              },
              {
                time: "8:25 PM",
                name: "Victor and Elias discuss the catalogue",
                clue: "catalogue",
                status: "unknown",
              },
              {
                time: "8:40 PM",
                name: "Clara argues with Elias",
                clue: "note",
                status: "unknown",
              },
              {
                time: "8:55 PM",
                name: "Nina meets Elias privately",
                clue: "note",
                status: "unknown",
              },
              {
                time: "9:05 PM",
                name: "A witness sees Mara enter the kitchen",
                clue: "witness",
                status: "known",
              },
              {
                time: "9:08 PM",
                name: "Mara leaves the kitchen",
                clue: "witness",
                status: "known",
              },
              {
                time: "9:10 PM",
                name: "Elias expects a meeting with M. V.",
                clue: "appointment",
                status: "known",
              },
              {
                time: "9:12 PM",
                name: "Corridor recording stops",
                clue: "camera",
                status: "known",
              },
              {
                time: "≈ 9:14 PM",
                name: "Murder window",
                clue: "camera",
                status: "inferred",
              },
              {
                time: "9:16 PM",
                name: "Mount concealed in a supply cupboard",
                clue: "weapon",
                status: "unknown",
              },
              {
                time: "9:19 PM",
                name: "Corridor recording resumes",
                clue: "camera",
                status: "known",
              },
              {
                time: "9:24 PM",
                name: "Mara returns to the public area",
                clue: "witness",
                status: "unknown",
              },
              {
                time: "9:30 PM",
                name: "Jonas discovers Elias",
                clue: "base",
                status: "known",
              },
              {
                time: "9:40 PM",
                name: "Police are contacted",
                clue: "base",
                status: "known",
              },
            ]
              .filter((e) => e.clue === "base" || p.evidence.includes(e.clue))
              .map((e, i) => (
                <div className={cx("timeline-event", e.status)} key={i}>
                  <div className="timeline-marker" />
                  <time>{e.time}</time>
                  <p>{e.name}</p>
                  <span>
                    {e.status === "known"
                      ? "Supported by evidence"
                      : e.status === "inferred"
                        ? "Inferred from camera log"
                        : "Still investigating"}
                  </span>
                </div>
              ))}
          </div>
          <div className="timeline-window">
            <Clock3 size={18} />
            <div>
              <span className="eyebrow">Estimated time of death</span>
              <b>
                {p.evidence.includes("camera")
                  ? "9:12 — 9:19 PM"
                  : "Time window not established"}
              </b>
            </div>
            <small>
              {p.evidence.includes("camera")
                ? "The camera log bounds the gap. The exact minute remains uncertain."
                : "Examine the corridor camera log to establish the missing interval."}
            </small>
          </div>
        </>
      )}
      {p.section === "accusation" && (
        <>
          <SectionHead
            eyebrow="Investigation · Final decision"
            title="Make your accusation."
            desc="Name the person responsible, establish the motive, and support your case with three pieces of evidence."
          />
          <div className="accusation-layout">
            <div className="accusation-form">
              <div className="form-step">
                <span className="step-index">01</span>
                <div>
                  <span className="eyebrow">Who killed Elias Rowan?</span>
                  <div className="suspect-options">
                    {suspects.map((s) => (
                      <button
                        key={s.name}
                        className={cx(p.killer === s.name && "selected")}
                        onClick={() => upd({ killer: s.name })}
                      >
                        <span className={`avatar av-${suspects.indexOf(s)}`}>
                          {s.portrait}
                        </span>
                        <b>{s.name}</b>
                        {p.killer === s.name && <Check size={14} />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="form-step">
                <span className="step-index">02</span>
                <div>
                  <span className="eyebrow">What was the motive?</span>
                  <label
                    className={cx(
                      "motive-choice",
                      p.motive === motive && "selected",
                    )}
                  >
                    <input
                      type="radio"
                      checked={p.motive === motive}
                      onChange={() => upd({ motive })}
                    />
                    <span>
                      <b>Protecting a concealed fraud</b>
                      <small>
                        Prevent Elias from exposing the astrolabe substitution
                        and falsified records.
                      </small>
                    </span>
                    <Check size={15} />
                  </label>
                </div>
              </div>
              <div className="form-step">
                <span className="step-index">03</span>
                <div>
                  <span className="eyebrow">
                    Select 3 pieces of supporting evidence{" "}
                    <i>{p.support.length}/3</i>
                  </span>
                  <div className="support-list">
                    {discovered.map((e) => (
                      <button
                        key={e.id}
                        className={cx(p.support.includes(e.id) && "selected")}
                        onClick={() => {
                          const next = p.support.includes(e.id)
                            ? p.support.filter((id) => id !== e.id)
                            : p.support.length < 3
                              ? [...p.support, e.id]
                              : p.support;
                          upd({ support: next });
                        }}
                      >
                        <span className="check-box">
                          {p.support.includes(e.id) && <Check size={13} />}
                        </span>
                        <span>
                          <b>{e.title}</b>
                          <small>{e.place}</small>
                        </span>
                      </button>
                    ))}
                  </div>
                  {!discovered.length && (
                    <p className="muted-copy">
                      Collect evidence before making an accusation.
                    </p>
                  )}
                </div>
              </div>
              <button
                className="primary-button submit-accusation"
                disabled={!p.killer || !p.motive || p.support.length !== 3}
                onClick={accuse}
              >
                Present my case <ArrowRight size={16} />
              </button>
              {p.attempts > 0 && (
                <p className="retry-note">
                  ATTEMPT {p.attempts} <span>·</span> You may revisit the case
                  and try again at any time.
                </p>
              )}
            </div>
            <aside className="accusation-aside">
              <span className="eyebrow">A strong case explains</span>
              <div className="proof-word">
                <span>01</span>
                <b>Motive</b>
                <small>What was Elias about to expose?</small>
              </div>
              <div className="proof-word">
                <span>02</span>
                <b>Opportunity</b>
                <small>Who could reach him in time?</small>
              </div>
              <div className="proof-word">
                <span>03</span>
                <b>Contradiction</b>
                <small>Which account fails against the record?</small>
              </div>
              <div className="proof-stamp">
                <Fingerprint size={24} />
                <span>
                  THE EVIDENCE
                  <br />
                  MUST SPEAK
                </span>
              </div>
            </aside>
          </div>
        </>
      )}
      {p.section === "resolution" && p.solved && (
        <div className="resolution">
          <div className="resolution-top">
            <span>
              CASE 001 <i>·</i> FINAL REPORT
            </span>
            <span className="closed-label">
              <Check size={13} /> CASE CLOSED
            </span>
          </div>
          <div className="resolution-head">
            <p className="eyebrow">
              <span className="rule" /> THE LAST LIGHT AT BELLWEATHER
            </p>
            <h1 className="display-title">
              The truth
              <br />
              <em>survives.</em>
            </h1>
            <p className="resolution-deck">
              Mara Voss killed Dr. Elias Rowan to keep him from exposing the
              substitution of the original Asterion Astrolabe with a replica.
            </p>
          </div>
          <div className="reveal-text">
            <p>
              For hours, Bellweather Museum had been a room full of secrets.
            </p>
            <p>
              Clara hid her grief behind anger. Jonas hid his mistakes behind
              procedure. Victor hid his fear behind money. Nina hid the truth
              behind a promise to a source.
            </p>
            <p>And Mara hid a crime behind a record.</p>
            <p>
              Months earlier, she arranged the sale of the original astrolabe
              through an intermediary and replaced it with a convincing replica.
              She falsified the restoration reports and used the proceeds to
              cover personal debts. Elias compared the serial markings with
              archival photographs and found the discrepancy.
            </p>
            <p>
              At 9:10 PM, he expected Mara to bring the original ledger. During
              the seven-minute camera gap, she confronted him in the restoration
              room. When he said he would expose the fraud the following
              morning, she struck him with the bronze display mount.
            </p>
            <p>
              She wiped it, wrapped it in a cleaning cloth, hid it in the staff
              supply cupboard and returned to the public area. The camera gap
              obscured her movements. Her kitchen alibi did not survive the
              witness statement. Restoration wax on the cloth connected the
              weapon to her work area.
            </p>
            <p className="reveal-italic">
              She had changed the records. She had hidden the weapon. She had
              prepared her explanation. But she had overlooked one thing.
            </p>
            <p className="reveal-last">
              The truth does not need to be preserved perfectly.
              <br />
              <em>It only needs to survive.</em>
            </p>
          </div>
          <div className="red-herrings">
            <p className="eyebrow">The other stories</p>
            <div>
              <span>Clara Rowan</span>
              <p>
                Her secret archive visit was to find photographs of her parents.
              </p>
            </div>
            <div>
              <span>Jonas Reed</span>
              <p>
                His earlier camera test did not explain the later interruption.
              </p>
            </div>
            <div>
              <span>Victor Hale</span>
              <p>
                He feared scandal but was not placed in the restoration room.
              </p>
            </div>
            <div>
              <span>Nina Park</span>
              <p>
                She protected her confidential source and could not identify the
                recorded voice.
              </p>
            </div>
          </div>
          <div className="resolution-bottom">
            <button
              className="secondary-button"
              onClick={() => nav("notebook")}
            >
              Review the evidence
            </button>
            <button
              className="text-button"
              onClick={() => {
                if (
                  confirm(
                    "Restart Case 001? This clears investigation progress on this device.",
                  )
                )
                  start();
              }}
            >
              Restart case <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="brief-fact">
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}

function SectionHead({
  eyebrow,
  title,
  desc,
}: {
  eyebrow: string;
  title: string;
  desc: string;
}) {
  return (
    <>
      <div className="section-kicker">
        <span>{eyebrow}</span>
        <span>Case 001 · Bellweather Museum</span>
      </div>
      <div className="section-heading">
        <p className="eyebrow">
          <span className="rule" /> {eyebrow.split("/").at(-1)?.trim()}
        </p>
        <h1
          className="display-title"
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <p className="section-desc">{desc}</p>
      </div>
    </>
  );
}

function EmptyState({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <div className="empty-state">
      <NotebookPen size={24} />
      <p>{text}</p>
      <button className="text-button" onClick={onClick}>
        Explore locations <ArrowRight size={14} />
      </button>
    </div>
  );
}
