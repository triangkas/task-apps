import { api } from "@/lib/api";
import TaskTable from "./task-table";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getTasks(page: number, limit: number) {
  const res = await api.get(`/task?page=${page}&limit=${limit}`);
  return res.data;
}

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string; limit?: string }>;
}) {
  const params = await searchParams;

  const page = Number(params?.page ?? 1);
  const limit = Number(params?.limit ?? 10);

  const data = await getTasks(page, limit);

  return (
    <div className="container mt-5">
      <Link href="/task/create" className="btn btn-primary mb-3">
        Create Task
      </Link>
      <TaskTable
        rows={data.data}
        meta={data.meta}
        page={page}
        limit={limit}
      />
    </div>
  );
}