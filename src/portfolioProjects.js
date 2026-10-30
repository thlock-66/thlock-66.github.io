import rwsCover from './project-assets/rws-cover.png';
import rwsConcepts from './project-assets/rws-concepts.png';
import rwsScreens from './project-assets/rws-screens.png';
// Add your real project content here. Empty fields render honest preview states.
// No sample findings, metrics or quotes are presented as completed work.
export const portfolioProjects = [
  { id: 'planning-with-clarity', number: '01', name: 'CHISEL', category: 'Product design', discipline: 'Complex workflows', title: 'Planning, with clarity.', shortTitle: 'Planning', description: 'Making complex mission-planning workflows easier to understand, navigate, and trust.', accent: 'lavender', art: 'planning', tags: ['UX research', 'Workflow design', 'Prototyping'], role: '', team: '', timeline: '', status: '', challenge: '', contribution: '', outcome: '', chapters: {}, evidence: [], decisions: [], images: [] },
  { id: 'a-clearer-path', number: '02', name: 'QUALIFLY', category: 'Product design', discipline: 'Qualification management', title: 'Keeping qualifications on track.', shortTitle: 'QualiFly', description: 'Designing dashboards and modules to help teams keep qualifications current, including UX research and module design for LSS.', accent: 'butter', art: 'learning', tags: ['UX research', 'Dashboard design', 'Module design'], role: 'UX designer', team: '', timeline: '', status: '', challenge: '', contribution: 'Designed qualification dashboards and modules, and conducted UX research to inform the LSS module.', outcome: '', chapters: {}, evidence: [], decisions: [], images: [] },
  {"category": "", "role": "Senior UX Designer", "team": "A*STAR Integrated Digital Product Center, in collaboration with NDC dentists", "timeline": "", "status": "Confidential project", "challenge": "Support dentists in creating removable partial dentures for older patients.", "contribution": "Worked on the UX of a removable denture design application as part of A*STAR’s Integrated Digital Product Center.", "outcome": "", "chapters": {"context": {"title": "Research, shaped into a digital product.", "lead": "At A*STAR’s Integrated Digital Product Center, I worked as a Senior UX Designer to turn research into digital products.", "paragraphs": ["This project focused on a removable partial denture design application, developed in collaboration with dentists from NDC. The application was intended to help dentists create removable partial dentures for older patients."]}, "direction": {"title": "Working with clinical expertise.", "lead": "The application was developed in collaboration with dentists from NDC.", "paragraphs": ["The full screens and detailed design process are confidential. This overview shares the project context without reproducing restricted product interfaces."]}}, "evidence": [], "decisions": [], "images": [], "tags": [], "id": "rpd", "number": "03", "name": "RPD", "shortTitle": "RPD", "discipline": "Denture design", "title": "Supporting better denture design.", "description": "A removable partial denture design application developed at A*STAR in collaboration with dentists from NDC, helping them create dentures for older patients.", "accent": "rose", "art": "dental"},
  {"category": "", "role": "UX designer", "team": "NCS Experience Design × Resorts World Sentosa", "timeline": "2 months", "status": "", "challenge": "Redesign the RWS website, member portal and kiosks around the information and tasks members needed.", "contribution": "User testing, homepage concept exploration, a shared design system and feature design with the relevant business units.", "outcome": "", "chapters": {"context": {"title": "One member experience, across touchpoints.", "lead": "As part of NCS Experience Design, we were engaged by Resorts World Sentosa to redesign its website, portal and kiosks over two months.", "paragraphs": ["The portal and kiosks served Genting Rewards members. The work covered features including merchandise and checkout, a voucher wallet, event listings and redemption flows."]}, "research": {"title": "Start with the existing experience.", "lead": "We interviewed participants and observed how they used the current portal and kiosks.", "paragraphs": ["The research focused on understanding the key information members wanted to see and the tasks they wanted to complete."]}, "direction": {"title": "Explore the homepage. Establish the system.", "lead": "We developed different homepage concepts for the client to choose from, then created a design system for the remaining pages.", "image": {"src": rwsConcepts, "alt": "RWS design visuals from the original portfolio", "caption": "Design visuals shared in the original portfolio."}}, "iteration": {"title": "Work through the details with each business unit.", "lead": "We worked with the relevant RWS business units to design portal features around their business needs.", "paragraphs": ["These included merchandise and checkout, a voucher wallet, event listings and redemption flows."], "image": {"src": rwsScreens, "alt": "RWS portal and kiosk designs from the original portfolio", "caption": "Portal and kiosk design visuals from the original portfolio."}}}, "evidence": [], "decisions": [], "images": [], "tags": [], "id": "rws", "number": "04", "name": "RWS", "shortTitle": "RWS", "discipline": "Portal and kiosk design", "title": "A clearer member experience.", "description": "Revamping the Resorts World Sentosa portal and kiosks for Genting Rewards members, from discovering events to managing vouchers and redeeming rewards.", "accent": "lavender", "art": "rws", "cover": {"src": rwsCover, "alt": "RWS portal and kiosk project cover from the original portfolio"}},
];

// Each chapters entry accepts { lead: '...', paragraphs: ['...'], image: {src, alt, caption} }.
// Keys: context, research, direction, iteration, outcome.
// evidence: [{ title, finding, implication, source }] — use anonymised approved evidence.
// decisions: [{ title, why, tradeoff, before: {src, alt}, after: {src, alt} }].
// images: [{src, alt, caption}] — opening these uses the full-size image viewer.

const caseStudyDetails = {
  "planning-with-clarity": {
    "role": "UX designer",
    "team": "Product and engineering team, working with operational users",
    "focus": "Make complex planning easier to navigate while keeping users in control.",
    "challenge": "Help users organise multiple areas, interpret automated outputs and prepare a clear report without losing their place in a complex map workflow.",
    "contribution": "User interviews and usability testing, workflow design, interaction design and research-led prioritisation.",
    "journey": [
      [
        "Observe",
        "Follow the existing workflow.",
        "January: moderated sessions and task walkthroughs revealed interaction, annotation and export friction."
      ],
      [
        "Prioritise",
        "Separate blockers from polish.",
        "Synthesise issues around editing reliability, segmentation usefulness and reporting needs."
      ],
      [
        "Revisit",
        "Study real reports after release.",
        "July: 45-minute interviews explored multiple areas, sectorisation and time-planning features already in use."
      ],
      [
        "Refocus",
        "Improve the complete workflow.",
        "Prioritise editable sectors, presentation and responsiveness alongside improvements to planning tools."
      ]
    ],
    "chapters": {
      "context": {
        "title": "Planning did not end when the map was complete.",
        "lead": "Chisel helps users create imagery-planning reports. But the wider job includes organising areas, refining annotations and turning the plan into something others can understand.",
        "paragraphs": [
          "My research followed that end-to-end workflow across two rounds in 2026: an early usability study in January and post-release interviews in July. This made it possible to distinguish persistent workflow gaps from issues that changed as the product evolved."
        ]
      },
      "research": {
        "title": "Good task ratings did not tell the whole story.",
        "lead": "January’s moderated sessions combined task walkthroughs, observation and interviews. Six people were interviewed; five relevant users were included in the synthesis.",
        "paragraphs": [
          "Average task-ease scores were 6.42/7 for crop, segmentation and report creation, and 6/7 for annotation creation. Those scores described the tested tasks; the observations still exposed costly workarounds.",
          "Users wanted to edit an area after a mistake instead of recreating it. Overlapping annotations disrupted work. Exported views omitted context they needed, so users assembled screenshots elsewhere.",
          "Early segmentation results also required too much correction for some users to find them useful. That finding changed in the later research round."
        ]
      },
      "direction": {
        "title": "Design for recovery, organisation and a usable output.",
        "lead": "The early findings pointed to three priorities: reduce workflow-blocking issues, make complex map content manageable and bring the output closer to the user’s actual reporting needs.",
        "paragraphs": [
          "Recommendations included editable vertices, clearer annotation controls, grouping and visibility controls, flexible text styling and live measurements during cropping.",
          "Export needed to reflect the user’s chosen view and retain orientation and scale information. The design opportunity extended beyond exporting a selected area to supporting a readable, contextual report."
        ]
      },
      "iteration": {
        "title": "The next round changed the question.",
        "lead": "July’s post-release interviews examined reports users had already created with multiple areas, sectorisation and time-planning norms.",
        "paragraphs": [
          "Users described improved segmentation and valued terrain-adjusted calculations. Automation was becoming a useful starting point, provided they could refine it.",
          "The strongest remaining gaps concerned what happened after generation: editing sector boundaries, keeping the interface responsive and presenting the plan without assembling screenshots in another tool.",
          "This shifted the recommendation towards making existing workflows more editable, responsive and presentation-ready. These were research priorities, not a claim that every recommendation had shipped."
        ]
      },
      "outcome": {
        "title": "A roadmap grounded in the complete task.",
        "lead": "The research produced a prioritised set of recommendations around editable sectors, presentation/export and performance, supported by further needs in annotation organisation and spatial review.",
        "paragraphs": [
          "The contrast between the two rounds mattered: early users questioned whether segmentation was worth correcting; later users valued its improvements but still needed control and reliable surrounding workflows.",
          "The case study demonstrates how follow-up research changed the priorities as the product matured. The task-ease scores and interview feedback are research evidence, rather than measured production-wide efficiency gains."
        ]
      }
    },
    "evidence": [
      {
        "title": "A small edit could mean starting again",
        "finding": "January participants could not easily correct crop vertices, while July participants described deleting and recreating sectors to make changes.",
        "implication": "Correction and recovery needed to be designed as core interactions, with discoverable editing controls.",
        "source": "January usability study and July post-release interviews"
      },
      {
        "title": "The report needed context beyond the selected area",
        "finding": "Users captured multiple views and added orientation, scale and supporting context outside Chisel. July interviews again identified briefing and presentation friction.",
        "implication": "Presentation and export should support the reporting workflow, including control over the visible map and interface.",
        "source": "January usability study and July post-release interviews"
      },
      {
        "title": "Trust in segmentation changed over time",
        "finding": "Early participants hid or ignored inaccurate overlays. Later interviews described improved segmentation as a useful starting point that still needed refinement.",
        "implication": "Evaluate automation in the context of correction effort and the wider task, and revisit findings after product changes.",
        "source": "Comparison across the two research rounds"
      },
      {
        "title": "Processing time and responsiveness were different problems",
        "finding": "July users could accept processing, but freezing, interaction lag and unclear completion feedback reduced confidence.",
        "implication": "Prioritise responsive interactions and clear progress feedback alongside calculation speed.",
        "source": "July post-release interviews"
      }
    ],
    "decisions": [
      {
        "title": "Keep generated content editable",
        "why": "Users bring judgement that an automated classification cannot replace.",
        "tradeoff": "Editing adds interaction complexity, but helps users inspect and correct the output."
      },
      {
        "title": "Reduce clutter through grouping and visibility",
        "why": "People need to focus on one part of a growing report without discarding other information.",
        "tradeoff": "Hidden information needs clear visibility states and a predictable way to bring it back."
      },
      {
        "title": "Support a dedicated presentation view",
        "why": "The interface needed for editing can obstruct the information needed for briefing.",
        "tradeoff": "Presentation controls must preserve a clear way back to the working view."
      }
    ],
    "timeline": "Research rounds: January & July 2026",
    "metrics": [
      {
        "value": "5",
        "label": "Users included in January synthesis",
        "note": "6 interviewed; 1 outside the relevant workflow excluded."
      },
      {
        "value": "4",
        "label": "Hands-on users informing July evaluation",
        "note": "A participant without new-workflow experience was excluded where relevant."
      }
    ]
  },
  "a-clearer-path": {
    "role": "UX designer",
    "team": "Product team, working with training and planning stakeholders",
    "focus": "Clear qualification journeys for trainees, with trainer tools grounded in existing workflows.",
    "challenge": "Replace fragmented qualification and training administration with clearer trainee and trainer journeys, while making status and responsibilities unambiguous.",
    "contribution": "Designed qualification dashboards and LSS trainee/trainer workflows, with UX research and usability testing informing the module.",
    "journey": [
      [
        "Frame",
        "Understand both sides of training.",
        "Cover trainee enrolment, booking and tracking alongside trainer slot creation, attendance and assessment."
      ],
      [
        "Test",
        "Observe the prototypes in use.",
        "Run moderated think-aloud sessions with 4 trainees and 5 trainers, using task ratings and post-session SUS."
      ],
      [
        "Synthesise",
        "Look beyond the overall score.",
        "Find the specific tasks and labels that still caused confusion despite a high usability score."
      ],
      [
        "Refine",
        "Adapt to each role’s work.",
        "Validate the trainee experience, refine trainer workflows and implement calendar views, training history and waitlists."
      ]
    ],
    "chapters": {
      "context": {
        "title": "From manual administration to a visible training journey.",
        "lead": "QualiFly is a qualification-management platform spanning several qualification tracks. My LSS work focused on Life Support & Survival training for trainees and trainers.",
        "paragraphs": [
          "The brief connected tasks that had relied on manual coordination: creating slots, managing capacity, checking attendance and recording assessments. Trainees also needed to understand their qualification status and take ownership of their next training step.",
          "The challenge was to bring these tasks together without obscuring the different responsibilities of trainees and trainers."
        ]
      },
      "research": {
        "title": "Nine sessions. Two roles. One connected journey.",
        "lead": "The study used moderated think-aloud testing of Figma trainee and trainer prototypes, with four trainees and five trainers. Sessions lasted approximately 60–90 minutes.",
        "paragraphs": [
          "Tasks covered enrolment, booking and qualification tracking for trainees, and slot creation, attendance and assessment for trainers. Task ratings were paired with a post-session System Usability Scale questionnaire.",
          "The overall SUS score was 86.9, with trainee and trainer averages of 92.5 and 82.5. This established a strong prototype baseline, but it did not mean every task was clear. Three of four trainees could not find their past training records without prompting."
        ]
      },
      "direction": {
        "title": "Treat language as part of the interaction.",
        "lead": "Several labels did not match the users’ vocabulary or expectations. These were problems of meaning, not simply tone of voice.",
        "paragraphs": [
          "“Authorised” could be interpreted more broadly than qualification currency. Assessment terms such as “Partial Pass” did not reflect the “Complete / Incomplete” language trainers used.",
          "The research recommended clearer training-history navigation, qualification-specific assessment terms and more explicit labels for attendance and session structure. Status needed to be understandable before users opened its details."
        ]
      },
      "iteration": {
        "title": "Keep what worked. Adapt what did not.",
        "lead": "Testing validated the overall trainee experience. The trainer experience needed more refinement to reflect how training was organised and managed in practice.",
        "paragraphs": [
          "All five trainers expected a monthly calendar. The implemented calendar view supported that planning habit, while training history became a clearer destination and waitlists were implemented as part of the module.",
          "Trainer refinements focused on fitting the experience to existing workflows and operational needs. The goal was to preserve a coherent product while making the tools specific enough for the people running training.",
          "The evidence also identified terminology improvements. The implemented changes confirmed here are calendar views, training history and waitlists; automated queue assignment and notification behaviour are not assumed."
        ]
      },
      "outcome": {
        "title": "A validated foundation, refined for each role.",
        "lead": "The trainee design was validated overall, while trainer flows were refined to better match operational needs and current workflows. Calendar views, training history and waitlists were implemented.",
        "paragraphs": [
          "The prototype study established an overall SUS score of 86.9 across nine participants. Task observations explained where the experience still needed to change, particularly on the trainer side.",
          "The result was a stronger connection between a consistent qualification-management experience and role-specific ways of working. The SUS score remains a prototype baseline, rather than a measurement of the revised or live product."
        ]
      }
    },
    "evidence": [
      {
        "title": "Training history was difficult to find",
        "finding": "3 of 4 trainees could not locate past training records without prompting.",
        "implication": "Make history easier to find and use labels that describe the records people expect.",
        "source": "LSS prototype usability study · trainees n=4"
      },
      {
        "title": "Assessment terms did not match practice",
        "finding": "All 5 trainers used Complete / Incomplete terminology rather than the prototype’s Partial Pass wording. Some qualification-specific exceptions remained.",
        "implication": "Use domain language and support qualification-specific outcomes rather than imposing one generic assessment model.",
        "source": "LSS prototype usability study · trainers n=5"
      },
      {
        "title": "Trainers expected a monthly view",
        "finding": "All 5 trainers looked for a monthly calendar when reviewing upcoming training.",
        "implication": "Support the monthly planning horizon and consider established habits during migration.",
        "source": "LSS prototype usability study · trainers n=5"
      },
      {
        "title": "Waitlist status was buried",
        "finding": "Trainees did not expect to find waitlisted slots under training details.",
        "implication": "Surface waitlist status earlier; assess notification and queue behaviour separately from the visibility fix.",
        "source": "LSS prototype usability study"
      }
    ],
    "decisions": [
      {
        "title": "Make history a recognisable destination",
        "why": "Three of four trainees struggled to locate past records. Training history was implemented as a clearer destination.",
        "tradeoff": "Navigation needs to distinguish historical records from upcoming activity without creating duplicate destinations."
      },
      {
        "title": "Align assessment labels to the domain",
        "why": "Trainers’ completion language differed from the prototype, and qualification status needed to avoid implying broader authorisation.",
        "tradeoff": "Terminology requires stakeholder agreement and may need to vary by qualification."
      },
      {
        "title": "Bring the calendar into the training workflow",
        "why": "All five trainers expected a monthly view. Calendar views were implemented to better fit their existing planning practice.",
        "tradeoff": "Different views need consistent training information so people can move between them without losing context."
      },
      {
        "title": "Make waitlists part of the experience",
        "why": "Waitlist status was hard to find in testing. Waitlists were implemented within the qualification-management module.",
        "tradeoff": "Queue rules and notifications need their own clear behaviour; implementing a waitlist does not by itself imply automatic booking."
      }
    ],
    "timeline": "LSS prototype testing: June 2026",
    "metrics": [
      {
        "value": "86.9",
        "label": "Overall SUS score",
        "note": "Prototype usability baseline · n=9; not a post-launch measure."
      },
      {
        "value": "9",
        "label": "Moderated usability sessions",
        "note": "4 trainees + 5 trainers · Figma prototypes."
      },
      {
        "value": "92.5",
        "label": "Trainee SUS",
        "note": "4 participants."
      },
      {
        "value": "82.5",
        "label": "Trainer SUS",
        "note": "5 participants."
      }
    ],
    "outcome": "Validated the trainee experience and refined trainer workflows to fit existing practice. Calendar views, training history and waitlists were implemented."
  },
  "rpd": {
    "focus": "Support the move from manual denture modelling to a digital design workflow, informed by clinical expertise.",
    "chapters": {
      "context": {
        "title": "A skilled process, with a lot of manual work.",
        "lead": "Creating removable partial dentures involved lengthy manual processes, including modelling dentures by hand. This was the core problem behind the digital design application.",
        "paragraphs": [
          "At A*STAR’s Integrated Digital Product Center, I owned the research and design of the whole app in collaboration with dentists from NDC. The application was intended to help dentists design removable partial dentures for older patients."
        ]
      },
      "research": {
        "title": "Understand the work before digitising it.",
        "lead": "I interviewed dentists and dental assistants to understand the manual process and the needs the application had to support.",
        "paragraphs": [
          "The lengthy, hands-on modelling process gave the project a concrete starting point. Working closely with dentists helped me build the specialist understanding needed to design a digital experience around their work."
        ]
      },
      "direction": {
        "title": "Make the digital workflow fit the clinical task.",
        "lead": "The design challenge was to translate a process grounded in hands-on modelling into a usable digital application.",
        "paragraphs": [
          "I owned the whole application’s design, connecting what I learned in interviews with the interfaces and workflows. Close collaboration with dentists kept clinical expertise involved as the digital experience took shape."
        ]
      },
      "iteration": {
        "title": "Keep domain experts involved.",
        "lead": "I worked closely with dentists throughout the project as the application took shape.",
        "paragraphs": [
          "This collaboration was central to designing in a specialist domain. Detailed workflow examples and product screens are not reproduced here because the work is confidential."
        ]
      },
      "outcome": {
        "title": "From a manual-process problem to a complete app design.",
        "lead": "I researched and designed the whole application around the challenge of lengthy manual denture modelling, working with dentists and dental assistants.",
        "paragraphs": [
          "The project reflects end-to-end design ownership in a specialist domain: understanding the existing process, learning from the people doing it and shaping a digital workflow with clinical input. Detailed launch results and measured time savings are not claimed here."
        ]
      }
    },
    "role": "Senior UX Designer · End-to-end research and design",
    "contribution": "Owned the research and design of the whole application, interviewing dentists and dental assistants and working closely with dentists throughout the project.",
    "journey": [
      [
        "Discover",
        "Understand the manual process.",
        "Interview dentists and dental assistants about the lengthy work of modelling dentures by hand."
      ],
      [
        "Understand",
        "Build domain understanding.",
        "Work closely with dentists to understand the specialist context behind the application."
      ],
      [
        "Design",
        "Shape the complete experience.",
        "Own the design of the whole application, connecting research with the interface and workflows."
      ],
      [
        "Collaborate",
        "Keep clinical expertise close.",
        "Work closely with dentists as the design takes shape."
      ]
    ],
    "description": "Researching and designing a digital denture-design application at A*STAR with dentists from NDC, addressing a lengthy process of modelling removable partial dentures by hand.",
    "challenge": "Creating dentures involved lengthy manual processes, including modelling by hand. The challenge was to support this specialist work through a digital design application."
  },
  "rws": {
    "focus": "Create a consistent member experience across the portal and kiosks.",
    "journey": [
      [
        "Observe",
        "Start with existing behaviour.",
        "Interview participants and observe their use of the current portal and kiosks."
      ],
      [
        "Explore",
        "Compare homepage directions.",
        "Develop different concepts for the client to review."
      ],
      [
        "Unify",
        "Build a shared design language.",
        "Establish a design system to support the rest of the pages."
      ],
      [
        "Extend",
        "Work through each feature.",
        "Collaborate with business units on merchandise, vouchers, events and redemption flows."
      ]
    ],
    "chapters": {
      "outcome": {
        "title": "A shared foundation across touchpoints.",
        "lead": "The two-month engagement covered concept exploration, a design system and feature design across the RWS portal and kiosks.",
        "paragraphs": [
          "The project connected user testing with client and business-unit collaboration. It brought member needs and the requirements of different business units into a shared design direction."
        ]
      }
    },
    "evidence": [],
    "decisions": [
      {
        "title": "Research the existing portal and kiosks first",
        "why": "Observing the current experience helped the team understand the information and tasks members wanted.",
        "tradeoff": "Research needed to fit within a two-month engagement alongside design and stakeholder review."
      },
      {
        "title": "Establish a design system after concept selection",
        "why": "A shared system provided a foundation for the remaining pages and features.",
        "tradeoff": "The system needed enough consistency to unify the experience and enough flexibility for different business needs."
      },
      {
        "title": "Design features with the relevant business units",
        "why": "Merchandise, vouchers and events each brought their own requirements.",
        "tradeoff": "Those requirements needed to fit within a coherent member journey."
      }
    ]
  }
};
portfolioProjects.forEach(project => {
  const details = caseStudyDetails[project.id];
  if (details) Object.assign(project, details, { chapters: { ...project.chapters, ...details.chapters } });
});
