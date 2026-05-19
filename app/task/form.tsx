"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

type Props = {
    initialData?: {
        title: string;
        description: string;
    };
    id?: number;
};

export default function Form({ initialData, id }: Props) {
    const router = useRouter();
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [message, setMessage] = useState("");

    const [form, setForm] = useState({
        title: initialData?.title || "",
        description: initialData?.description || "",
    });

    console.log("initialData", initialData);
    console.log("form", form);

    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setMessage("");

        try {
            const res = id
                ? await api.put(`/task/${id}`, form)
                : await api.post(`/task`, form);

                console.log("REQUEST:", res.config?.method, res.config?.url);

            if (res.data?.success === false) {
                setErrors(res.data.message);
                return;
            }

            // setMessage(res.data.message || "Success");

            localStorage.setItem("alert", JSON.stringify({
                type: "success",
                message: res.data.message || "Success",
            }));

            router.push("/");
            router.refresh();

            // setTimeout(() => {
                
            // }, 800);
        } catch (err: any) {
            const status = err.response?.status;
            const response = err.response?.data;

            if (status === 422 && response?.message) {
                setErrors(response.message);
            } else {
                setMessage("Terjadi kesalahan server API");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {message && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {message}

                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setMessage("")}
                    ></button>
                </div>
            )}
            <form onSubmit={handleSubmit} className="p-4 border rounded">
                <div className="mb-3">
                    <label>Title <span className="text-danger">*</span></label>
                    <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        className="form-control"
                    />
                    {errors.title && (
                        <small className="text-danger">
                            {errors.title[0]}
                        </small>
                    )}
                </div>

                <div className="mb-3">
                    <label>Description <span className="text-danger">*</span></label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        className="form-control"
                    />
                    {errors.description && (
                        <small className="text-danger">
                            {errors.description[0]}
                        </small>
                    )}
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Loading..." : id ? "Update" : "Simpan"}
                </button>
                <button type="button" className="btn btn-secondary ms-2" onClick={() => router.push("/")}>
                    Batal
                </button>
            </form>
        </div>
    );
}