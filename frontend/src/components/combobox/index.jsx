import React, { useState, useEffect, useRef } from 'react';

const ComboBox = ({ data = [], onSelect, placeholder = "Select an option" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState(data);
  const wrapperRef = useRef();

  useEffect(() => {
    setFiltered(
      data.filter((item) =>
        item.label.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, data]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item) => {
    setSelected(item);
    setIsOpen(false);
    onSelect(item);
  };

  return (
    <div className="relative w-64" ref={wrapperRef}>
      <div
        className="border px-4 py-2 rounded cursor-pointer bg-white shadow-sm"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {selected ? selected.label : placeholder}
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border mt-1 rounded shadow-lg z-10">
          <input
            type="text"
            className="w-full px-3 py-2 border-b outline-none"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="max-h-48 overflow-y-auto">
            {filtered.map((item) => (
              <div
                key={item.value}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelect(item)}
              >
                {item.label}
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="px-4 py-2 text-gray-500">No results</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComboBox;
