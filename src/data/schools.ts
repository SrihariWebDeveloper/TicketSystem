export type SchoolStatus = "Active" | "Onboarding" | "On Hold" | "Inactive";

export interface School {
  id: string;
  name: string;
  code: string;
  location: string;
  email: string;
  phone: string;
  contactPerson: string;
  status: SchoolStatus;
  createdAt: string;
}

export const schoolStatuses: SchoolStatus[] = [
  "Active",
  "Onboarding",
  "On Hold",
  "Inactive",
];

export const schoolsSeed: School[] = [
  {
    id: "school-green-valley",
    name: "Green Valley High School",
    code: "GVHS-01",
    location: "Hyderabad",
    email: "schooladmin@greenvalley.edu",
    phone: "+91 98765 43210",
    contactPerson: "Anita Rao",
    status: "Active",
    createdAt: "2025-10-14",
  },
  {
    id: "school-sunrise",
    name: "Sunrise International School",
    code: "SIS-02",
    location: "Vijayawada",
    email: "admin@sunrise.edu",
    phone: "+91 91234 56789",
    contactPerson: "Sandeep Kumar",
    status: "Onboarding",
    createdAt: "2025-11-09",
  },
  {
    id: "school-st-marys",
    name: "St. Mary's School",
    code: "SMS-03",
    location: "Warangal",
    email: "admin@stmarys.edu",
    phone: "+91 99887 66554",
    contactPerson: "Maria James",
    status: "Active",
    createdAt: "2025-08-23",
  },
  {
    id: "school-bright-future",
    name: "Bright Future Academy",
    code: "BFA-04",
    location: "Guntur",
    email: "admin@brightfuture.edu",
    phone: "+91 97654 32109",
    contactPerson: "Raghav Sharma",
    status: "On Hold",
    createdAt: "2025-09-18",
  },
  {
    id: "school-crestwood",
    name: "Crestwood Academy",
    code: "CRA-05",
    location: "Vizag",
    email: "helpdesk@crestwood.edu",
    phone: "+91 95432 10987",
    contactPerson: "Neha Reddy",
    status: "Inactive",
    createdAt: "2025-07-05",
  },
];

export const schoolsStorageKey = "crm-schools-v1";

export function readSchools(): School[] {
  try {
    const raw = localStorage.getItem(schoolsStorageKey);
    if (!raw) return schoolsSeed;
    const parsed = JSON.parse(raw) as School[];
    return parsed.length ? parsed : schoolsSeed;
  } catch {
    return schoolsSeed;
  }
}

export function getSchoolById(schools: School[], id: string) {
  return schools.find((school) => school.id === id) ?? null;
}
