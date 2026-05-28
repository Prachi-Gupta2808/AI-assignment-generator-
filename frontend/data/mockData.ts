//for testing purpose only
import { Assignment } from "@/types";

export const mockAssignmentsList: Assignment[] = [
  {
    id: "1",
    title: "Quiz on Electricity",
    assignedDate: "20-06-2025",
    dueDate: "21-06-2025",
  },
  {
    id: "2",
    title: "Quiz on Electricity",
    assignedDate: "20-06-2025",
    dueDate: "21-06-2025",
  },
  {
    id: "3",
    title: "Quiz on Electricity",
    assignedDate: "20-06-2025",
    dueDate: "21-06-2025",
  },
  {
    id: "4",
    title: "Quiz on Electricity",
    assignedDate: "20-06-2025",
    dueDate: "21-06-2025",
  },
  {
    id: "5",
    title: "Quiz on Electricity",
    assignedDate: "20-06-2025",
    dueDate: "21-06-2025",
  },
  {
    id: "6",
    title: "Quiz on Electricity",
    assignedDate: "20-06-2025",
    dueDate: "21-06-2025",
  },
];

export const mockAcademicAssignment = {
  schoolName: "Delhi Public School, Sector-4, Bokaro",
  subjectClass: "Subject: English | Class: 5th",
  timeAllowed: "45 minutes",
  maxMarks: 20,
  instructions: "All questions are compulsory unless stated otherwise.",
  section: "Section A",
  sectionTitle: "Short Answer Questions",
  sectionSubtitle: "Attempt all questions. Each question carries 2 marks",
  questions: [
    {
      id: 1,
      difficulty: "Easy",
      text: "Define electroplating. Explain its purpose.",
      marks: 2,
    },
    {
      id: 2,
      difficulty: "Moderate",
      text: "What is the role of a conductor in the process of electrolysis?",
      marks: 2,
    },
    {
      id: 3,
      difficulty: "Easy",
      text: "Why does a solution of copper sulfate conduct electricity?",
      marks: 2,
    },
    {
      id: 4,
      difficulty: "Moderate",
      text: "Describe one example of the chemical effect of electric current in daily life.",
      marks: 2,
    },
    {
      id: 5,
      difficulty: "Moderate",
      text: "Explain why electric current is said to have chemical effects.",
      marks: 2,
    },
    {
      id: 6,
      difficulty: "Challenging",
      text: "How is sodium hydroxide prepared during the electrolysis of brine? Write the chemical reaction involved.",
      marks: 2,
    },
    {
      id: 7,
      difficulty: "Challenging",
      text: "What happens at the cathode and anode during the electrolysis of water? Name the gases evolved.",
      marks: 2,
    },
    {
      id: 8,
      difficulty: "Easy",
      text: "Mention the type of current used in electroplating and justify why it is used.",
      marks: 2,
    },
    {
      id: 9,
      difficulty: "Moderate",
      text: "What is the importance of electric current in the field of metallurgy?",
      marks: 2,
    },
    {
      id: 10,
      difficulty: "Challenging",
      text: "Explain with a chemical equation how copper is deposited during the electroplating of an object.",
      marks: 2,
    },
  ],
  answerKeys: [
    {
      id: 1,
      text: "Electroplating is the process of depositing a thin layer of metal on the surface of another metal using electric current. Its purpose is to prevent corrosion, improve appearance, or increase thickness.",
    },
    {
      id: 2,
      text: "A conductor allows the flow of electric current, causing ions in the electrolyte to move and enabling chemical changes at electrodes.",
    },
    {
      id: 3,
      text: "Copper sulfate solution contains free copper and sulfate ions which carry electric charge, thus conducting electricity.",
    },
    {
      id: 4,
      text: "An example is the electroplating of silver or jewelry to prevent tarnishing.",
    },
    {
      id: 5,
      text: "Electric current causes the movement of ions leading to chemical changes at the electrodes, hence it shows chemical effects.",
    },
    {
      id: 6,
      text: "Sodium hydroxide is formed at the cathode during brine electrolysis as water gains electrons:\n2H2O + 2e- → H2 + 2OH-\nNa+ + OH- → NaOH (in solution)",
    },
    {
      id: 7,
      text: "At the cathode: water is reduced to hydrogen gas and hydroxide ions.\nAt the anode: water is oxidized to oxygen gas and hydrogen ions.",
    },
    {
      id: 8,
      text: "Direct current (DC) is used because it produces a consistent flow of electrons necessary for controlled deposition of metals.",
    },
    {
      id: 9,
      text: "Electric current helps extract metals from their ores and purify metals by electrolysis in metallurgy.",
    },
    {
      id: 10,
      text: "During copper electroplating, copper ions in solution gain electrons at the cathode and deposit as copper metal:\nCu2+ + 2e- → Cu (solid)",
    },
  ],
};
