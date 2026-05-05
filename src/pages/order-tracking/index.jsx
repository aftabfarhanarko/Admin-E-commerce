import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useLazyTrackOrderUnifiedQuery } from "@/features/order/orderApiSlice";

const HISTORY_KEY = "order_tracking_history";

const OrderTrackingPublicPage = () => {
  const [searchParams] = useSearchParams();
  const [trackingId, setTrackingId] = useState(searchParams.get("trackingId") || "");
  const [hasSearched, setHasSearched] = useState(false);
  const [history, setHistory] = useState([]);
  const lastFetchedRef = useRef("");
  const [trackOrder, { data, isLoading, isError }] = useLazyTrackOrderUnifiedQuery();

  const saveToHistory = (id) => {
    const trimmed = (id || "").trim();
    if (!trimmed) return;
    setHistory((prev) => {
      const next = [trimmed, ...prev.filter((item) => item !== trimmed)].slice(0, 8);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  };

  const fetchById = async (id) => {
    const trimmed = (id || "").trim();
    if (!trimmed) return;
    if (lastFetchedRef.current === trimmed) return;
    lastFetchedRef.current = trimmed;
    setHasSearched(true);
    await trackOrder(trimmed);
    saveToHistory(trimmed);
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) {
        setHistory(parsed.filter((item) => typeof item === "string"));
      }
    } catch {
      setHistory([]);
    }
  }, []);

  useEffect(() => {
    const fromQuery = (searchParams.get("trackingId") || "").trim();
    if (!fromQuery) return;
    setTrackingId(fromQuery);
    fetchById(fromQuery);
  }, [searchParams]);

  useEffect(() => {
    const trimmed = trackingId.trim();
    if (!trimmed) return;
    const timer = setTimeout(() => {
      fetchById(trimmed);
    }, 450);
    return () => clearTimeout(timer);
  }, [trackingId]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const id = trackingId.trim();
    if (!id) return;
    await fetchById(id);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Order Tracking</h1>

        <form onSubmit={onSubmit} className="flex gap-2">
          <input
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            placeholder="Enter tracking ID"
            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-black"
          />
          <button
            type="submit"
            disabled={isLoading || !trackingId.trim()}
            className="rounded-lg bg-black px-5 py-3 font-medium text-white disabled:opacity-60"
          >
            {isLoading ? "Searching..." : "Track"}
          </button>
        </form>
        {history.length > 0 && (
          <div className="rounded-lg border border-gray-200 bg-white p-3">
            <p className="mb-2 text-xs font-semibold uppercase text-gray-500">
              Previous Tracking
            </p>
            <div className="flex flex-wrap gap-2">
              {history.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setTrackingId(item);
                    fetchById(item);
                  }}
                  className="rounded-full border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {hasSearched && isError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            Tracking not found. Please check the ID and try again.
          </div>
        )}

        {hasSearched && data && (
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">Courier</p>
            <p className="text-lg font-semibold text-gray-900">{data.courier || "Unknown"}</p>

            <p className="mt-4 text-sm text-gray-500">Tracking ID</p>
            <p className="font-mono text-base font-semibold text-gray-900">
              {data.tracking_id || trackingId}
            </p>

            <p className="mt-4 text-sm text-gray-500">Current Status</p>
            <p className="text-base font-semibold text-gray-900">{data.status || "Unknown"}</p>

            {Array.isArray(data.tracking) && data.tracking.length > 0 && (
              <div className="mt-6 space-y-3">
                <p className="text-sm font-semibold text-gray-900">Tracking History</p>
                {data.tracking.map((item, idx) => (
                  <div key={idx} className="rounded-lg border border-gray-200 p-3">
                    <p className="text-sm font-medium text-gray-900">
                      {item.messageEn || item.messageBn || item.status || "Status update"}
                    </p>
                    {item.time && (
                      <p className="mt-1 text-xs text-gray-500">
                        {new Date(item.time).toLocaleString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTrackingPublicPage;
