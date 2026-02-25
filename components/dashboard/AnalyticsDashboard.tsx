"use client";

import { useEffect, useState, useMemo } from "react";
import { collection, onSnapshot, query, limit } from "firebase/firestore";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";
import { db } from "../../lib/firebaseconfig";

type Interaction = {
  views?: number;
  like?: number;
  share?: number;
  posts?: number;
};

type AnalyticsDoc = {
  interactions: Record<string, Interaction>;
};

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<"7" | "30" | "65">("7");

  // --- Listen to changes in the analytics document ---
  useEffect(() => {
    const q = query(collection(db, "analytics"), limit(1));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const docData = snapshot.docs[0].data() as AnalyticsDoc;
          setAnalytics(docData);
        } else {
          setAnalytics(null);
          console.warn("No analytics document found");
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error listening to analytics:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // --- Prepare data for charts and totals ---
  const {
    viewsData,
    reactionsData,
    postsData,
    totalViews,
    totalInteractions,
    totalPosts,
  } = useMemo(() => {
    if (!analytics) {
      return {
        viewsData: [],
        reactionsData: [],
        postsData: [],
        totalViews: 0,
        totalInteractions: 0,
        totalPosts: 0,
      };
    }

    const dates = Object.keys(analytics.interactions).sort(
      (a, b) =>
        new Date(a.split("-").reverse().join("-")).getTime() -
        new Date(b.split("-").reverse().join("-")).getTime()
    );

    const viewsArray = dates.map((d) => ({
      date: d,
      count: Number(analytics.interactions[d]?.views ?? 0),
    }));

    const reactionsArray = dates.map((d) => ({
      date: d,
      like: Number(analytics.interactions[d]?.like ?? 0),
      share: Number(analytics.interactions[d]?.share ?? 0),
    }));

    const postsArray = dates.map((d) => ({
      date: d,
      posts: Number(analytics.interactions[d]?.posts ?? 0),
    }));

    const rangeNum = Number(range);
    const viewsData = viewsArray.slice(-rangeNum);
    const reactionsData = reactionsArray.slice(-rangeNum);
    const postsData = postsArray.slice(-rangeNum);

    const totalViews = viewsData.reduce((sum, v) => sum + v.count, 0);
    const totalInteractions = reactionsData.reduce(
      (sum, r) => sum + (r.like ?? 0) + (r.share ?? 0),
      0
    );
    const totalPosts = postsData.reduce((sum, p) => sum + (p.posts ?? 0), 0);

    return {
      viewsData,
      reactionsData,
      postsData,
      totalViews,
      totalInteractions,
      totalPosts,
    };
  }, [analytics, range]);

  // --- Loading skeleton ---
  if (loading)
    return (
      <div className="p-6 space-y-6">
        <h2 className="text-2xl font-semibold mb-4">Analytics Dashboard</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 rounded-lg p-4 border-gray-300 border grid content-between bg-gray-200 animate-pulse"
            >
              <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
              <div className="h-6 w-1/3 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-72 bg-gray-200 rounded-xl animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );

  if (!analytics)
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-gray-500">No analytics data found.</p>
      </div>
    );

  const totals = [
    { label: "Total Posts", value: totalPosts },
    { label: "Total Views", value: totalViews },
    { label: "Total Interactions", value: totalInteractions },
  ];

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Analytics Dashboard</h2>

      {/* Range Selector */}
      <div className="flex gap-2 mb-4">
        {["7", "30", "65"].map((r) => (
          <button
            key={r}
            onClick={() => setRange(r as "7" | "30" | "65")}
            className={`px-3 py-1 rounded transition ${
              range === r
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Last {r} Days
          </button>
        ))}
      </div>

      {/* Totals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {totals.map((item) => (
          <div
            key={item.label}
            className="h-24 rounded-lg p-4 border-gray-300 border grid content-between bg-white shadow-sm"
          >
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className="text-xl font-semibold">{item.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6">
        {/* Views Line Chart */}
        <div className="bg-white p-4 rounded-xl shadow w-full">
          <h2 className="text-lg font-normal mb-3">Views</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={viewsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Reactions Bar Chart */}
        <div className="bg-white p-4 rounded-xl shadow w-full">
          <h2 className="text-lg font-normal mb-3">Reactions</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reactionsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="like" fill="#10b981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="share" fill="#f59e0b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Posts Area Chart */}
        <div className="bg-white p-4 rounded-xl shadow w-full">
          <h2 className="text-lg font-normal mb-3">Posts (Daily)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={postsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="posts" stroke="#f59e0b" fill="#fcd34d" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
