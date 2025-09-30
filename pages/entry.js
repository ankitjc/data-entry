"use client";
import EntryForm from "@/components/EntryForm";

export default function EntryPage() {
    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Create Entry</h2>
            <EntryForm />
        </div>
    );
}
