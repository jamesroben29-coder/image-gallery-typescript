import type { ChangeEvent } from "react";

type GalleryToolbarProps = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onImageUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  sourceFilter: "all" | "api" | "local";
  onSourceFilterChange: (value: "all" | "api" | "local") => void;
  imageCount: number;
  onDeleteAll: () => void;
};

const GalleryToolbar = ({ searchTerm, onSearchChange, sourceFilter,onSourceFilterChange,
    onImageUpload,imageCount,onDeleteAll}: GalleryToolbarProps) => {
  return (
  <section className="mb-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
    
    <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-end">
    <div className="min-w-0 flex-1">
        <label
        htmlFor="gallery-search"
        className="mb-2 block text-sm font-medium text-gray-700"
        >
        Search images
        </label>

        <input
        id="gallery-search"
        type="text"
        placeholder="Search your gallery..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
        />
    </div>

    <div className="flex shrink-0 flex-wrap gap-2 cursor-pointer">
        {[
        { label: "All Images", value: "all" },
        { label: "API Images", value: "api" },
        { label: "Local Uploads", value: "local" },
        ].map((filter) => (
        <button
            key={filter.value}
            type="button"
            onClick={() =>
            onSourceFilterChange(filter.value as "all" | "api" | "local")
            }
            className={`rounded-lg cursor-pointer px-3 py-3 text-sm font-medium transition ${
            sourceFilter === filter.value
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
        >
            {filter.label}
        </button>
        ))}
    </div>
    </div>



    <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <label className="flex cursor-pointer items-center justify-center rounded-xl bg-green-600 
      px-5 py-3 font-medium text-white transition hover:bg-green-700">
        Upload Images
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={onImageUpload}
          className="sr-only"
        />
      </label>

      <p className="text-sm font-medium text-gray-600">
        Total Images:{" "}
        <span className="font-bold text-green-700">{imageCount}</span>
      </p>

      <button
        type="button"
        onClick={onDeleteAll}
        className="rounded-xl border cursor-pointer border-red-300 px-5 py-3 font-medium text-red-600 transition hover:bg-red-50"
      >
        Delete All
      </button>
    </div>
  </section>
);
}

export default GalleryToolbar;