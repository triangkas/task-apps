import Form from "../../form";
import { api } from "@/lib/api";

export default async function EditTaskPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const res = await api.get(`/task/${id}`);
    const data = res.data.data ?? res.data;

    return (
        <div className="container mt-4">
            <h4>Edit Task</h4>
            <Form initialData={data} id={Number(id)} />
        </div>
    );
}