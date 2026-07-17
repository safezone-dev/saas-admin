"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Check } from "lucide-react";

type Option = {
  id: string;
  name: string;
};

type Props = {
    options: Option[];
    value: string;
    placeholder?: string;
    onChange: (option: Option) => void;
  
    allowCreate?: boolean;
  
    onCreate?: (value: string) => void;
  };
  
  export default function SearchSelect({

    options,
  
    value,
  
    placeholder = "Buscar...",
  
    onChange,
  
    allowCreate = false,
  
    onCreate,
  
  }: Props) {

  const [query, setQuery] = useState("");

  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {

    if (!value) {
  
      setQuery("");
  
      return;
  
    }
  
    const option = options.find(
  
      o => o.name === value
  
    );
  
    if (option) {
  
      setQuery(option.name);
  
    }
  
  }, [value, options]);

  useEffect(() => {

    function handleClickOutside(event: MouseEvent) {

      if (

        wrapperRef.current &&

        !wrapperRef.current.contains(event.target as Node)

      ) {

        setOpen(false);

      }

    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>

      document.removeEventListener("mousedown", handleClickOutside);

  }, []);

  const filteredOptions = useMemo(() => {

    const search = query.trim().toLowerCase();
  
    return options
      .filter(option =>
        option.name
          .toLowerCase()
          .includes(search)
      )
      .sort((a, b) => {
  
        const aStarts = a.name
          .toLowerCase()
          .startsWith(search);
  
        const bStarts = b.name
          .toLowerCase()
          .startsWith(search);
  
        if (aStarts && !bStarts) return -1;
  
        if (!aStarts && bStarts) return 1;
  
        return a.name.localeCompare(b.name);
  
      });
  
  }, [query, options]);

  const exactMatch = useMemo(() => {

    return options.some(
  
      option =>
  
        option.name.trim().toLowerCase() ===
  
        query.trim().toLowerCase()
  
    );
  
  }, [options, query]);

  return (

    <div ref={wrapperRef} className="relative">

      <div className="relative">

        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

<input

value={query}

placeholder={placeholder}

onFocus={() => {

    setOpen(true);
  
    setSelectedIndex(0);
  
  }}

onChange={(e) => {

  setQuery(e.target.value);

  setSelectedIndex(0);

  setOpen(true);

}}

onKeyDown={(e) => {

  if (!open) return;

  if (e.key === "ArrowDown") {

    e.preventDefault();

    setSelectedIndex((prev) =>

      Math.min(

        prev + 1,

        filteredOptions.length - 1

      )

    );

  }

  if (e.key === "ArrowUp") {

    e.preventDefault();

    setSelectedIndex((prev) =>

      Math.max(prev - 1, 0)

    );

  }

  if (e.key === "Escape") {

    setOpen(false);

  }

  if (

    e.key === "Enter" &&

    filteredOptions[selectedIndex]

  ) {

    e.preventDefault();

    const option =

      filteredOptions[selectedIndex];

    setQuery(option.name);

    onChange(option);

    setOpen(false);

  }

}}

className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-black"
/>

      </div>

      {open && (

        <div className="absolute z-50 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl">

<>
  {filteredOptions.length === 0 && (
    <div className="px-4 py-3 text-sm text-gray-500">
      No se encontraron resultados
    </div>
  )}

  {filteredOptions.map((option, index) => (
    <button
      key={option.id}
      type="button"
      onClick={() => {
        setQuery(option.name);
        onChange(option);
        setSelectedIndex(0);
        setOpen(false);
      }}
      className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm ${
        selectedIndex === index
          ? "bg-gray-100"
          : "hover:bg-gray-100"
      }`}
    >
      <span>
        {query === "" ? (
          option.name
        ) : (
          <>
            {option.name
              .split(new RegExp(`(${query})`, "gi"))
              .map((part, i) =>
                part.toLowerCase() === query.toLowerCase() ? (
                  <mark
                    key={i}
                    className="rounded bg-yellow-200 px-0.5"
                  >
                    {part}
                  </mark>
                ) : (
                  <span key={i}>{part}</span>
                )
              )}
          </>
        )}
      </span>

      {value === option.name && <Check size={16} />}
    </button>
  ))}

  {allowCreate && query.trim() !== "" && !exactMatch && (
    <div className="border-t border-gray-200">
      <button
        type="button"
        onClick={() => {
          onCreate?.(query);
          setOpen(false);
        }}
        className="w-full px-4 py-3 text-left text-sm font-medium hover:bg-gray-100"
      >
        ➕ Crear "{query}"
      </button>
    </div>
  )}
</>

        </div>

      )}

    </div>

  );

}