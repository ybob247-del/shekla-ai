import { useEffect, useState } from "react";
import { Link } from "wouter";

interface PurchasedFile {
  id: string;
  name: string;
}

type State =
  | { status: "loading" }
  | { status: "ready"; files: PurchasedFile[] }
  | { status: "error"; message: string };

export default function Success() {
  const [state, setState] = useState<State>({ status: "loading" });
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("session_id") || "";
    setSessionId(id);

    if (!id) {
      setState({ status: "error", message: "This page needs a purchase reference to show your downloads." });
      return;
    }

    let cancelled = false;
    fetch(`/api/download?session_id=${encodeURIComponent(id)}`)
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "We could not confirm that purchase.");
        return data as { files: PurchasedFile[] };
      })
      .then((data) => {
        if (!cancelled) setState({ status: "ready", files: data.files || [] });
      })
      .catch((error: Error) => {
        if (!cancelled) setState({ status: "error", message: error.message });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      {state.status === "loading" && (
        <div className="text-center py-16">
          <p className="text-gray-500">Confirming your purchase…</p>
        </div>
      )}

      {state.status === "error" && (
        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-3">We could not load your downloads</h1>
          <p className="text-gray-600 mb-6">{state.message}</p>
          <p className="text-gray-500 text-sm mb-6">
            If you were charged, email{" "}
            <a className="text-emerald-600 font-semibold" href="mailto:hello@shekla.ai">
              hello@shekla.ai
            </a>{" "}
            and we will send your files straight over.
          </p>
          <Link href="/resources">
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
              Back to Toolkits
            </button>
          </Link>
        </div>
      )}

      {state.status === "ready" && (
        <>
          <div className="text-center mb-10">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✓</span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Payment complete</h1>
            <p className="text-gray-600">
              {state.files.length === 1
                ? "Your toolkit is ready to download."
                : `All ${state.files.length} toolkits are ready to download.`}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl divide-y divide-gray-100 mb-8">
            {state.files.map((file) => (
              <div key={file.id} className="flex items-center justify-between gap-4 p-4">
                <span className="font-semibold text-gray-900">{file.name}</span>
                <a
                  href={`/api/download?session_id=${encodeURIComponent(sessionId)}&file=${encodeURIComponent(file.id)}`}
                  className="shrink-0 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  Download
                </a>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-900">
            <p className="font-semibold mb-1">Save this page</p>
            <p>
              Bookmark this link or download your files now. These downloads stay available for 30 days. After that,
              email <a className="underline font-semibold" href="mailto:hello@shekla.ai">hello@shekla.ai</a> and we
              will resend them.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
