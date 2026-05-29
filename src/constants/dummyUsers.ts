
export interface DummyUser {
  id: string;
  name: string;
  email: string;
  role: 'researcher' | 'admin';
  specialization: string;
  avatar?: string;
  password?: string;
}

export const DUMMY_RESEARCHERS: DummyUser[] = [
  {
    id: "alice_researcher_001",
    name: "Alice",
    email: "alice@archeomind.edu",
    role: "researcher",
    specialization: "Indus Valley Glyptics",
    password: "Password123!"
  },
  {
    id: "bob_researcher_002",
    name: "Bob",
    email: "bob@archeomind.edu",
    role: "researcher",
    specialization: "Mauryan Numismatics",
    password: "Password123!"
  },
  {
    id: "charli_researcher_003",
    name: "Charli",
    email: "charli@archeomind.edu",
    role: "researcher",
    specialization: "Chola Bronze Metallurgy",
    password: "Password123!"
  },
  {
    id: "maya_researcher_004",
    name: "Maya",
    email: "maya@archeomind.edu",
    role: "researcher",
    specialization: "Mughal Architecture & Lapidary",
    password: "Password123!"
  },
  {
    id: "anya_researcher_005",
    name: "Anya",
    email: "anya@archeomind.edu",
    role: "researcher",
    specialization: "Gupta Era Epigraphy",
    password: "Password123!"
  }
];
