"use client";

import { Eye, Share2, ThumbsUp } from "lucide-react";

type Post = {
  heading: string;
  coverImage?: string;
  content: string;
  date: string;
};

type BlogPreviewProps = {
  post: Post;
  previewWidth: number;
  getReadMinutes: (content: string) => number;
};

export default function BlogPreview({ post, previewWidth, getReadMinutes }: BlogPreviewProps) {
  return (
    <div
      className="mx-auto border rounded shadow bg-white p-4 space-y-6"
      style={{ width: `${previewWidth}px` }}
    >

      {/* Cover Image */}
      {post.coverImage && (
          <img
          src={post.coverImage}
          alt="cover preview"
          className="w-full rounded shadow my-4"
          />
        )}

        {/* Heading */}
        <h2 className="text-3xl font-bold">{post.heading}</h2>
      {/* Top Interaction */}
      <div className="flex flex-wrap gap-6 justify-between sm:justify-start text-sm text-gray-500">
        <div className="flex gap-2">

        <span>Admin</span>
        <span> 22 sep 2025 </span>
        </div>
        <div className="flex gap-2">

        <div className="flex items-center gap-1">{100} <ThumbsUp className="-mt-1" size={16} />  </div>
        <div className="flex gap-1 items-center">{100} <Eye  size={16} />  </div>
        </div>
      </div>
        {/* tags */}
      {post.tags && (
        <div className="flex flex-wrap gap-2 mt-2">
          {post.tags.map((tag) => (
            <span key={tag} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Content */}
      <div
        className="prose max-w-none leading-relaxed [&_p]:my-2 [&_h1]:my-3 [&_h2]:my-2 [&_ul]:my-2"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Bottom Interaction */}
      <div className="flex flex-wrap gap-4 mt-6 items-center border-t border-gray-200 pt-4">
  {/* 3D-like Like Button (static) */}
  <div
    className="flex gap-2 items-center px-4 py-2 rounded-lg font-semibold shadow-md bg-gray-100 text-gray-800"
  >
    <ThumbsUp className="text-gray-800" />
    <span>120</span> {/* Replace with your static number */}
  </div>

  {/* Single Share/Copy Button (static) */}
  <div
    className="flex gap-2 items-center px-4 py-2 rounded-lg font-semibold bg-blue-500 text-white shadow-md"
  >
    <Share2 />
    <span>Share</span>
  </div>

  {/* Views (static) */}
  <div className="flex gap-2 items-center ml-auto text-gray-500">
    <Eye />
    <span>350</span> {/* Replace with your static number */}
  </div>
</div>
    </div>
  );
}

/* Extracted Interaction Bar */
function InteractionBar({
  readMinutes,
  date,
}: {
  readMinutes?: number;
  date?: string;
}) {
  return (
    <div className="border-t border-b border-gray-200 py-2 flex justify-between">
      {/* Left side: Likes + Share */}
      <div className="text-sm flex gap-4 items-center">
        <div className="flex items-center gap-0 cursor-pointer">
          <span className="text-xl">👍</span>
          <span className="text-sm">100</span>
        </div>
        <Share2 className="cursor-pointer" />
      </div>

      {/* Right side: Time + Date (only for top bar) */}
      {(readMinutes !== undefined || date) && (
        <div className="text-sm flex gap-4">
          {readMinutes !== undefined && <span>{readMinutes} min read</span>}
          {date && <span>{date}</span>}
        </div>
      )}
    </div>
  );
}
