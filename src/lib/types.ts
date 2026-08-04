export type Faculty = {
  id: string;
  name: string;
  slug: string;
};

export type Career = {
  id: string;
  faculty_id: string;
  name: string;
  slug: string;
  degree_title: string | null;
  level: string | null;
  duration_semesters: number | null;
  credits: number | null;
  methodology: string | null;
  schedule: string | null;
  resolution_type: string | null;
  resolution_number: string | null;
  accreditation_number: string | null;
  approval_date: string | null;
  location: string | null;
};

export type CareerWithFaculty = Career & {
  faculty: Faculty;
};

export type Leader = {
  id: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  second_last_name: string | null;
  cedula: string;
  birth_date: string;
  birth_place: string;
  age: number;
  semester: number;
  career_id: string;
  phone: string | null;
  created_at: string;
  updated_at: string;
};

export type LeaderWithCareer = Leader & {
  career: CareerWithFaculty;
};

export function fullName(
  leader: Pick<
    Leader,
    "first_name" | "middle_name" | "last_name" | "second_last_name"
  >,
) {
  return [
    leader.first_name,
    leader.middle_name,
    leader.last_name,
    leader.second_last_name,
  ]
    .filter(Boolean)
    .join(" ");
}
