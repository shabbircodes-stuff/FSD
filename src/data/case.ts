export type Evidence = {
  id: string;
  title: string;
  place: string;
  category: string;
  text: string;
  detail: string;
};
export type Progress = {
  started: boolean;
  evidence: string[];
  deductions: string[];
  interviews: string[];
  asked: string[];
  connections: Record<string, string[]>;
  section: string;
  location: number;
  suspect: number;
  attempts: number;
  solved: boolean;
  killer: string;
  motive: string;
  support: string[];
};
export const fresh: Progress = {
  started: false,
  evidence: [],
  deductions: [],
  interviews: [],
  asked: [],
  connections: {},
  section: "case",
  location: 0,
  suspect: 0,
  attempts: 0,
  solved: false,
  killer: "",
  motive: "",
  support: [],
};
export const locations = [
  {
    name: "The Main Gallery",
    sub: "PUBLIC EXHIBITION · EAST WING",
    intro:
      "The lamps are still warm. The guests have gone, leaving the centerpiece beneath its glass dome and an empty place on the pedestal.",
    objects: [
      [
        "asterion",
        "THE ASTERION ASTROLABE",
        "The instrument sits beneath a glass dome. Its brass surface has been polished recently. Its serial markings do not match the archival photographs.",
        "Displayed object · serial markings differ from the archive.",
        "Cataloguing photographs show a different instrument. The discrepancy is too exact to be wear.",
        "DOCUMENT",
      ],
      [
        "mount",
        "THE EMPTY PEDESTAL",
        "A heavy bronze display mount is missing. A fresh scratch scores the stone where its base once rested.",
        "Physical trace · the mount was removed recently.",
        "The missing mount is heavy enough to have caused a fatal injury.",
        "PHYSICAL",
      ],
      [
        "catalogue",
        "EXHIBITION CATALOGUE",
        "The printed catalogue calls the astrolabe an authentic eighteenth-century instrument. Its restoration date differs from an earlier draft.",
        "Document discrepancy · two dates, one object.",
        "The revised date aligns with a period when the restoration room was officially closed.",
        "DOCUMENT",
      ],
    ],
  },
  {
    name: "The Restoration Room",
    sub: "STAFF ONLY · WEST WING",
    intro:
      "A fallen chair. The desk lamp burns over scattered papers. Whatever happened here was interrupted before it could be put away.",
    objects: [
      [
        "note",
        "ELIAS’S UNFINISHED NOTE",
        "“The catalogue is correct. The restoration record is not. Someone has changed the dates, and someone else has paid for the silence.”",
        "Written by Elias · found beside the desk.",
        "He believed the catalogue was sound, but the restoration record had been changed.",
        "TESTIMONY",
      ],
      [
        "appointment",
        "APPOINTMENT BOOK",
        "“9:10 PM — M. V. Bring original ledger. No more excuses.”",
        "Personal record · entry written at 6:30 PM.",
        "Elias expected Mara at the room shortly before the camera interruption.",
        "TIMELINE",
      ],
      [
        "report",
        "RESTORATION REPORT",
        "The report lists work on a date when the restoration room was officially closed. An amendment bears Mara Voss’s signature.",
        "Record anomaly · signed amendment.",
        "The document was altered after Elias raised questions about the astrolabe.",
        "DOCUMENT",
      ],
      [
        "computer",
        "UNSENT DRAFT",
        "“I have compared the photographs with the current instrument. The markings are not the same. Tomorrow, I will put this right.”",
        "Draft message · never sent.",
        "Elias had independently verified that the displayed instrument was a replica.",
        "DOCUMENT",
      ],
    ],
  },
  {
    name: "The Security Office",
    sub: "RESTRICTED ACCESS · BASEMENT",
    intro:
      "The camera wall holds on empty corridors. Paper logs sit beside a monitor whose clock is three minutes fast.",
    objects: [
      [
        "camera",
        "CORRIDOR CAMERA LOG",
        "The restoration corridor camera stopped recording at 9:12 PM and resumed at 9:19 PM.",
        "Recording gap · seven minutes.",
        "The gap frames the estimated time of death, but says nothing by itself about who used it.",
        "TIMELINE",
      ],
      [
        "maintenance",
        "MAINTENANCE LOG",
        "A routine system test took place earlier in the evening. It does not explain the later interruption.",
        "Routine test · earlier, unrelated.",
        "Jonas’s test was not the cause of the corridor camera gap.",
        "DOCUMENT",
      ],
      [
        "access",
        "ACCESS PERMISSIONS",
        "A temporary maintenance credential assigned to Mara was used during the interruption.",
        "System record · credential use at 9:12 PM.",
        "The credential connects Mara to the camera interruption, not necessarily the murder by itself.",
        "PHYSICAL",
      ],
      [
        "notebook",
        "JONAS’S NOTEBOOK",
        "“Do not report test unless asked. No impact on corridor camera.”",
        "Private note · Jonas withheld an earlier test.",
        "Jonas feared blame for a test that did not cause the gap. His secrecy has an explanation.",
        "TESTIMONY",
      ],
    ],
  },
  {
    name: "The Staff Kitchen",
    sub: "SERVICE CORRIDOR · NORTH WING",
    intro:
      "A cup sits beside the sink. The kettle is cold. Someone came through here, but not for long.",
    objects: [
      [
        "duty",
        "KITCHEN DUTY SHEET",
        "Mara was not assigned kitchen duties on the night of the exhibition.",
        "Staff record · no kitchen shift.",
        "Her account of preparing refreshments has no support from the duty roster.",
        "DOCUMENT",
      ],
      [
        "kettle",
        "THE COLD KETTLE",
        "The kettle is cold. A cup of tea sits barely touched beside the sink.",
        "Scene observation · no reliable timestamp.",
        "The kettle does not place Mara here during the whole murder window.",
        "TIMELINE",
      ],
      [
        "witness",
        "WITNESS STATEMENT",
        "“I saw Mara enter the kitchen shortly after nine. She was there for a few minutes, then she left. I assumed she had returned to the exhibition.”",
        "Staff testimony · witnessed shortly after 9:00 PM.",
        "Mara’s stated alibi extends beyond the few minutes the witness saw her in the kitchen.",
        "TESTIMONY",
      ],
    ],
  },
];
export const evidence: Evidence[] = locations.flatMap((l) =>
  l.objects.map((o) => ({
    id: o[0],
    title: o[1],
    place: l.name,
    category: o[5],
    text: o[3],
    detail: o[4],
  })),
);
export const cupboard: Evidence = {
  id: "weapon",
  title: "THE WRAPPED BRONZE MOUNT",
  place: "Staff supply cupboard",
  category: "PHYSICAL",
  text: "The missing mount lies wrapped in a cleaning cloth. A distinctive restoration wax remains in a narrow groove.",
  detail:
    "The conservation inventory identifies the wax as a blend used in Mara’s assigned work area.",
};
export const suspects = [
  {
    name: "Mara Voss",
    age: 38,
    role: "Senior conservator",
    relation: "Trusted colleague · 8 years",
    initial:
      "“I was preparing refreshments in the staff kitchen when the incident happened. Elias was under enormous pressure. He accused half the museum of incompetence this week, including me, but I had no reason to hurt him.”",
    portrait: "MV",
    lines: [
      "“Professional. Difficult, perhaps. He believed every discrepancy was evidence of a conspiracy.”",
      "“He asked questions. I answered them. I can’t control what he chose to believe.”",
      "“In the kitchen. I was making tea. I never entered the restoration room that evening.”",
    ],
    unlock: [
      {
        needs: "appointment",
        say: "“He scheduled meetings constantly. That doesn’t mean I attended every one. The ledger would have proved nothing.”",
      },
      {
        needs: "report",
        say: "“That is an administrative record. It proves nothing about his death.”",
      },
      {
        needs: "witness",
        say: "“Then perhaps your witness has the time wrong.”",
      },
      {
        needs: "weapon",
        say: "“You’re putting together a story from unrelated details.”",
      },
    ],
  },
  {
    name: "Clara Rowan",
    age: 29,
    role: "Freelance photographer",
    relation: "Elias’s niece",
    initial:
      "“We argued, yes. He thought I was irresponsible, and I thought he cared more about old objects than living people. But I didn’t kill him.”",
    portrait: "CR",
    lines: [
      "“He promised to help with my project, then withdrew the offer. He said he had more important problems.”",
      "“I was in the courtyard, taking photographs before the rain got worse.”",
      "“I was looking for old photographs of my parents. Elias knew I was there.”",
    ],
    unlock: [
      {
        needs: "catalogue",
        say: "“I didn’t deny going into the archive because I killed anyone. I was looking for photographs of my parents. I thought you’d use it against me.”",
      },
    ],
  },
  {
    name: "Jonas Reed",
    age: 46,
    role: "Head of security",
    relation: "Responsible for the museum’s security",
    initial:
      "“I was monitoring the security desk. The corridor camera experienced a brief interruption. Equipment fails. It happens. I found Elias when I checked the restoration room.”",
    portrait: "JR",
    lines: [
      "“A maintenance interruption. I didn’t consider it important until the body was found.”",
      "“I can override the cameras. The director can, too. A few staff have limited maintenance permissions.”",
      "“I checked whether he was breathing and secured the corridor. I wasn’t trying to hide anything.”",
    ],
    unlock: [
      {
        needs: "maintenance",
        say: "“I did run a test earlier. I kept quiet because I knew it would look bad. It doesn’t explain the later interruption.”",
      },
      {
        needs: "access",
        say: "“That temporary credential belonged to Mara. My own test was earlier.”",
      },
    ],
  },
  {
    name: "Victor Hale",
    age: 57,
    role: "Museum benefactor",
    relation: "Financed the astrolabe acquisition",
    initial:
      "“Elias was an excellent curator, but he had become obsessed with paperwork. The astrolabe is genuine as far as I know. I donated it to preserve history, not to participate in a scandal.”",
    portrait: "VH",
    lines: [
      "“I knew he had questions. Curators always have questions.”",
      "“The exhibition had deadlines. My name was attached to it.”",
      "“I was in the main gallery, speaking with guests.”",
    ],
    unlock: [
      {
        needs: "catalogue",
        say: "“I knew there were gaps in the documentation. I didn’t know anyone had substituted the artifact.”",
      },
    ],
  },
  {
    name: "Nina Park",
    age: 34,
    role: "Investigative journalist",
    relation: "Elias’s confidential contact",
    initial:
      "“Elias called me here because he believed something was wrong. He said the museum’s records told two different stories. He was frightened, but not for his own safety.”",
    portrait: "NP",
    lines: [
      "“That an important artifact might not be what the museum claimed.”",
      "“A confidential source trusted me. I needed to understand what I had before publishing.”",
      "“The recording captures only part of the conversation. Listen carefully; it doesn’t capture everything.”",
    ],
    unlock: [
      {
        needs: "note",
        say: "“My recording catches Elias saying, ‘The record was changed after I questioned it.’ Someone answers, ‘Then you should stop looking.’ I can’t identify the voice with certainty.”",
      },
    ],
  },
];
export const deductions = [
  {
    id: "fraud",
    name: "The Fraud",
    question: "What was Elias about to expose?",
    clues: ["note", "report", "computer"],
    conclusion:
      "The Asterion may have been replaced with a replica. Someone manipulated the restoration records to hide the substitution.",
  },
  {
    id: "opportunity",
    name: "The Opportunity",
    question: "Who could meet Elias during the gap?",
    clues: ["appointment", "camera", "access"],
    conclusion:
      "Elias expected Mara near the murder window. Her temporary credential was used during the recording interruption.",
  },
  {
    id: "alibi",
    name: "The False Alibi",
    question: "Whose account fails the timeline?",
    clues: ["witness", "duty", "kettle"],
    conclusion:
      "Mara claimed to remain in the kitchen, but a witness saw her leave after only a few minutes.",
  },
  {
    id: "weapon",
    name: "The Concealed Weapon",
    question: "What physical clue ties the crime to the workshop?",
    clues: ["mount", "weapon"],
    conclusion:
      "The missing mount was hidden in a staff cupboard. Restoration wax links it to the conservation work area.",
  },
];
export const motive =
  "Mara feared that Elias would expose her substitution of the original Asterion Astrolabe with a replica and the falsified restoration records.";
