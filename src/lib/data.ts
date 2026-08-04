import { supabase } from "@/lib/supabase/client";
import type { CareerWithFaculty, Faculty, LeaderWithCareer } from "@/lib/types";

const CAREER_SELECT = "*, faculty:faculties(*)";
const LEADER_SELECT = "*, career:careers(*, faculty:faculties(*))";

export async function getFaculties(): Promise<Faculty[]> {
  const { data, error } = await supabase
    .from("faculties")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getFacultyBySlug(slug: string): Promise<Faculty | null> {
  const { data, error } = await supabase
    .from("faculties")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getCareers(): Promise<CareerWithFaculty[]> {
  const { data, error } = await supabase
    .from("careers")
    .select(CAREER_SELECT)
    .order("name", { ascending: true });

  if (error) throw error;
  return (data ?? []) as unknown as CareerWithFaculty[];
}

export async function getCareersByFacultySlug(
  facultySlug: string,
): Promise<CareerWithFaculty[]> {
  const { data, error } = await supabase
    .from("careers")
    .select(CAREER_SELECT)
    .eq("faculty.slug", facultySlug)
    .order("name", { ascending: true });

  if (error) throw error;
  // Supabase's embedded-filter can return non-matching rows with a null
  // relation on some plans; filter defensively.
  return ((data ?? []) as unknown as CareerWithFaculty[]).filter(
    (career) => career.faculty?.slug === facultySlug,
  );
}

export async function getCareerBySlug(
  facultySlug: string,
  careerSlug: string,
): Promise<CareerWithFaculty | null> {
  const { data, error } = await supabase
    .from("careers")
    .select(CAREER_SELECT)
    .eq("slug", careerSlug)
    .maybeSingle();

  if (error) throw error;
  const career = data as unknown as CareerWithFaculty | null;
  if (!career || career.faculty?.slug !== facultySlug) return null;
  return career;
}

export async function getCareerById(id: string): Promise<CareerWithFaculty | null> {
  const { data, error } = await supabase
    .from("careers")
    .select(CAREER_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data as unknown as CareerWithFaculty | null;
}

export type LeaderFilters = {
  facultySlug?: string;
  careerId?: string;
  semester?: number;
  search?: string;
};

export async function getLeaders(filters: LeaderFilters = {}): Promise<LeaderWithCareer[]> {
  let query = supabase
    .from("leaders")
    .select(LEADER_SELECT)
    .order("created_at", { ascending: false });

  if (filters.careerId) {
    query = query.eq("career_id", filters.careerId);
  }
  if (filters.semester) {
    query = query.eq("semester", filters.semester);
  }
  if (filters.search) {
    const term = filters.search.trim();
    if (term) {
      query = query.or(
        `first_name.ilike.%${term}%,middle_name.ilike.%${term}%,last_name.ilike.%${term}%,second_last_name.ilike.%${term}%,cedula.ilike.%${term}%`,
      );
    }
  }

  const { data, error } = await query;
  if (error) throw error;

  let leaders = (data ?? []) as unknown as LeaderWithCareer[];

  if (filters.facultySlug) {
    leaders = leaders.filter((leader) => leader.career?.faculty?.slug === filters.facultySlug);
  }

  return leaders;
}

export async function getLeaderById(id: string): Promise<LeaderWithCareer | null> {
  const { data, error } = await supabase
    .from("leaders")
    .select(LEADER_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data as unknown as LeaderWithCareer | null;
}

export async function getStats() {
  const [{ count: totalLeaders }, { count: totalFaculties }, { count: totalCareers }] =
    await Promise.all([
      supabase.from("leaders").select("*", { count: "exact", head: true }),
      supabase.from("faculties").select("*", { count: "exact", head: true }),
      supabase.from("careers").select("*", { count: "exact", head: true }),
    ]);

  return {
    totalLeaders: totalLeaders ?? 0,
    totalFaculties: totalFaculties ?? 0,
    totalCareers: totalCareers ?? 0,
  };
}
