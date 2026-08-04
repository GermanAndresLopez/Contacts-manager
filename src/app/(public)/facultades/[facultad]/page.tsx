import { redirect } from "next/navigation";

type Params = Promise<{ facultad: string }>;

export default async function FacultyRedirectPage({ params }: { params: Params }) {
  const { facultad } = await params;
  redirect(`/facultades?f=${facultad}`);
}
