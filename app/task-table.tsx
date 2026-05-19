"use client";

import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function formatDate(dateString: string) {
    const d = new Date(dateString);

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}`;
}

export default function TaskTable({ rows, meta, page, limit }: any) {
    const router = useRouter();

    const [alert, setAlert] = useState<{
        type: "success" | "danger" | "";
        message: string;
    }>({ type: "", message: "" });

    useEffect(() => {
        const data = localStorage.getItem("alert");

        if (data) {
            setAlert(JSON.parse(data));
            localStorage.removeItem("alert");
        }
    }, []);

    const changePage = (p: number) => {
        router.push(`/?page=${p}&limit=${limit}`);
        router.refresh();
    };

    const changeLimit = (l: number) => {
        router.push(`/?page=1&limit=${l}`);
        router.refresh();
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case "done":
                return "bg-success";
            case "pending":
                return "bg-secondary";
            default:
                return "bg-dark";
        }
    };

    const capitalize = (text: string) =>
        text.charAt(0).toUpperCase() + text.slice(1);

    const handleToggleStatus = async (id: number) => {
        try {
            const res = await api.post(`/task/${id}/status`);

            setAlert({
                type: "success",
                message: res.data.message,
            });

            router.refresh();
        } catch (err: any) {
            const status = err.response?.status;
            const response = err.response?.data;

            setAlert({
                type: "danger",
                message: "Terjadi kesalahan server API",
            });
        }
    };

    const handleDelete = async (id: number) => {
        const confirmDelete = confirm("Yakin ingin menghapus data ini?");
        if (!confirmDelete) return;

        try {
            const res = await api.delete(`/task/${id}`);
            
            setAlert({
                type: "success",
                message: res.data.message,
            });

            router.refresh();
        } catch (err: any) {
            const status = err.response?.status;
            const response = err.response?.data;

            setAlert({
                type: "danger",
                message: "Terjadi kesalahan server API",
            });
        }
    };

    return (
        <div>

            {/* {message && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    {message}

                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setMessage("")}
                    ></button>
                </div>
            )} */}

            {alert.message && (
                <div className={`alert alert-${alert.type} alert-dismissible fade show`}>
                    {alert.message}

                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setAlert({ type: "", message: "" })}
                    />
                </div>
            )}
            <div className="card">
                <div className="card-header d-flex justify-content-between">
                    <h5>List Task</h5>

                    <select
                        className="form-select w-auto"
                        value={limit}
                        onChange={(e) => changeLimit(Number(e.target.value))}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                    </select>
                </div>

                <div className="card-body p-0">
                    <table className="table table-striped mb-0">
                        <thead className="table-secondary">
                            <tr>
                                <th className="text-center" style={{ width: "7%" }}>No.</th>
                                <th className="text-center" style={{ width: "15%" }}>Action</th>
                                <th style={{ width: "20%" }}>Title</th>
                                <th style={{ width: "30%" }}>Description</th>
                                <th className="text-center" style={{ width: "7%" }}>Status</th>
                                <th className="text-center" style={{ width: "15%" }}>Updated</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((item: any, index: number) => {
                                const no = (page - 1) * limit + index + 1;
                                return (
                                    <tr key={item.id}>
                                        <td className="text-center">{no}</td>
                                        <td className="text-center">
                                            <div className="d-flex justify-content-center gap-2">
                                                <button
                                                    className={`btn btn-sm ${item.status === "done" ? "btn-secondary" : "btn-success"}`}
                                                    onClick={() => handleToggleStatus(item.id)}
                                                >
                                                    {item.status === "done" ? "Pending" : "Done"}
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-primary"
                                                    onClick={() => router.push(`/task/edit/${item.id}`)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => handleDelete(item.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                        <td>{item.title}</td>
                                        <td>{item.description}</td>
                                        <td className="text-center">
                                            <span className={`badge ${getStatusClass(item.status)}`}>
                                                {capitalize(item.status)}
                                            </span></td>
                                        <td className="text-center">{formatDate(item.updated_at)}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="card-footer d-flex justify-content-between">
                    <button
                        className="btn btn-sm btn-secondary"
                        disabled={meta.current_page === 1}
                        onClick={() => changePage(meta.current_page - 1)}
                    >
                        Prev
                    </button>

                    <span>
                        Page {meta.current_page} of {meta.last_page} | Total: {meta.total}
                    </span>

                    <button
                        className="btn btn-sm btn-secondary"
                        disabled={meta.current_page === meta.last_page}
                        onClick={() => changePage(meta.current_page + 1)}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}