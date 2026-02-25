"use client";

import React from "react";
import CreatableSelect from "react-select/creatable";
import type { ActionMeta, OnChangeValue } from "react-select";

type Option = { value: string; label: string };

type Props = {
  value?: string[];                       // selected tag values
  onChange?: (tags: string[]) => void;   // callback when selection changes
  placeholder?: string;
  isClearable?: boolean;
  isMulti?: boolean;
};

const DEFAULT_TAGS: Option[] = [
  { value: "technology", label: "Technology" },
  { value: "research", label: "Research" },
  { value: "customer-stories", label: "Customer Stories" },
  { value: "podcasts", label: "Podcasts" },
  { value: "best-practices", label: "Best Practices" },
  { value: "tutorials", label: "Tutorials" },
  { value: "case-studies", label: "Case Studies" },
  { value: "announcements", label: "Announcements" },
  { value: "how-to", label: "How-to" },
  { value: "opinion", label: "Opinion" },
  { value: "product-updates", label: "Product Updates" },
  { value: "community", label: "Community" },
  { value: "events", label: "Events" },
  { value: "guides", label: "Guides" },
  { value: "insights", label: "Insights" },
  { value: "api", label: "API" },
  { value: "security", label: "Security" },
  { value: "career", label: "Career" },
  { value: "anniversary", label: "Anniversary" },
  { value: "design", label: "Design" }
];

export default function TagMultiSelect({
  value = [],
  onChange,
  placeholder = "Select or create tags...",
  isClearable = true,
  isMulti = true,
}: Props) {
  // Map incoming value (string[]) to react-select options
  const selectedOptions: Option[] = value.map((v) => ({ value: v, label: beautifyLabel(v) }));

  // Options state: start with defaults but allow created ones
  const [options, setOptions] = React.useState<Option[]>(DEFAULT_TAGS);

  // When the selection changes, notify parent with an array of string values
  const handleChange = (newValue: OnChangeValue<Option, true>, _actionMeta: ActionMeta<Option>) => {
    const tags = (newValue || []).map((o) => o.value);
    onChange?.(tags);
  };

  // When user creates a new option
  const handleCreate = (inputValue: string) => {
    const normalized = normalizeValue(inputValue);
    const newOption: Option = { value: normalized, label: beautifyLabel(normalized) };
    setOptions((prev) => [...prev, newOption]);
    // also update selection — append the new option to currently selected ones
    const next = [...selectedOptions, newOption];
    onChange?.(next.map((o) => o.value));
  };

  return (
    <div>
      <CreatableSelect
        isMulti={isMulti}
        options={options}
        onChange={handleChange}
        onCreateOption={handleCreate}
        value={selectedOptions}
        placeholder={placeholder}
        isClearable={isClearable}
        formatCreateLabel={(input) => `Create tag: "${input}"`}
        classNamePrefix="react-select"
        styles={{
          control: (base) => ({ ...base, borderRadius: 8, padding: 2, minHeight: 44 }),
          multiValue: (base) => ({ ...base, backgroundColor: "#eef2ff" }),
          multiValueLabel: (base) => ({ ...base, color: "#3730a3", fontWeight: 600 }),
          multiValueRemove: (base) => ({ ...base, color: "#7c3aed", ':hover': { backgroundColor: "#f3e8ff", color: "#4c1d95" } }),
        }}
        // accessible aria props
        aria-label="Tags"
      />
      <p className="mt-2 text-sm text-gray-500">Tip: start typing and press Enter to create a new tag.</p>
    </div>
  );
}

/** Helpers **/

function normalizeValue(s: string) {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "");
}

function beautifyLabel(val: string) {
  // Convert dashed value back to human readable
  return val
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
