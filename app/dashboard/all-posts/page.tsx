"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchPosts } from "../../../lib/fetchPosts";
import { Post } from "../../../schema/postSchema";
import { formatDateFromTimestamp } from "../../../components/utils/funcs";
import { updatePostStatus } from "../../../lib/updatePostStatus";
import { toast } from "react-toastify";

export default function PostsTable() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const handleStatusChange = async (
    id: string,
    index: number,
    newStatus: "active" | "archived"
  ) => {
    const result = await updatePostStatus(id, newStatus);
    if (result.success) {
      // toast.success("Post status updated");
    } else {
      toast.error("Error: " + result.error);
    }
    const updated = [...posts];
    updated[index].status = newStatus;
    setPosts(updated);
  };

  useEffect(() => {
    fetchPosts()
      .then((data) => {
        setPosts(data as unknown as Post[]);
      })
      .finally(() => setLoading(false));
  }, []);

  // --- Skeleton Loader ---
  if (loading) {
    return (
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3">Cover</th>
              <th className="p-3">Heading</th>
              <th className="p-3">Views</th>
              <th className="p-3">Reactions</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
              <th className="p-3">Edit</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="border-t">
                <td className="p-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-md animate-pulse" />
                </td>
                <td className="p-3">
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                </td>
                <td className="p-3">
                  <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                </td>
                <td className="p-3">
                  <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                </td>
                <td className="p-3">
                  <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
                </td>
                <td className="p-3">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                </td>
                <td className="p-3">
                  <div className="h-4 w-10 bg-gray-200 rounded animate-pulse" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // --- Actual Table ---
  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="p-3">Cover</th>
            <th className="p-3">Heading</th>
            <th className="p-3">Views</th>
            <th className="p-3">Reactions</th>
            <th className="p-3">Status</th>
            <th className="p-3">Date</th>
            <th className="p-3">Edit</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post, index) => (
            <tr
              key={post.id}
              className="border-t hover:bg-gray-50 transition-colors"
            >
              {/* Cover Image */}
              <td className="p-3">
                <img
                  src={post.coverImage}
                  alt={post.heading}
                  className="w-12 h-12 rounded-md object-cover"
                />
              </td>

              {/* Heading */}
              <td className="p-3 font-medium text-gray-800">
                {post.heading}
              </td>

              {/* Views */}
              <td className="p-3">{post.interactions.views}</td>

              {/* Reactions */}
              <td className="p-3">
                {post.interactions.like + post.interactions.share}
              </td>

              {/* Status Dropdown */}
              <td className="p-3">
                <select
                  value={post.status}
                  onChange={(e) =>
                    handleStatusChange(
                      post.id,
                      index,
                      e.target.value as "active" | "archived"
                    )
                  }
                  className="px-2 py-1 border rounded-md text-sm"
                >
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </select>
              </td>

              {/* Date */}
              <td className="p-3 text-gray-600">
                {formatDateFromTimestamp(post.createdAt)}
              </td>

              {/* Edit Link */}
              <td className="p-3">
                <Link
                  href={`/dashboard/edit/${post.id}`}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
