"use client";

import { useRef } from "react";

function FilterIcon() {
  return (
    <svg aria-hidden="true" className="catalog-filter-icon" viewBox="0 0 24 24" fill="none">
      <path d="M4 7h16M4 12h16M4 17h16" />
      <circle cx="9" cy="7" r="2" />
      <circle cx="15" cy="12" r="2" />
      <circle cx="11" cy="17" r="2" />
    </svg>
  );
}

export default function CatalogFilters({ fields, filters, onChange, onReset, resultCount, resultNoun, title, triggerLabel }) {
  const dialogRef = useRef(null);
  const searchRef = useRef(null);
  const activeFilters = fields.filter((field) => {
    const value = filters[field.id];
    return field.kind === "search" ? Boolean(value.trim()) : value !== "all";
  }).length;
  const resultLabel = `${resultCount} ${resultCount === 1 ? resultNoun.singular : resultNoun.plural}`;

  function openDialog() {
    dialogRef.current?.showModal();
    window.requestAnimationFrame(() => searchRef.current?.focus());
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  function closeOnBackdrop(event) {
    if (event.target === event.currentTarget) closeDialog();
  }

  return (
    <>
      <div className="destinations-filter-launcher">
        <button className="destinations-filter-trigger" type="button" onClick={openDialog}>
          <FilterIcon />
          <span>{triggerLabel}</span>
          {activeFilters ? <span className="destinations-filter-trigger__count">{activeFilters}</span> : null}
        </button>
      </div>

      <dialog className="destinations-filter-dialog" ref={dialogRef} onClick={closeOnBackdrop} aria-labelledby="catalog-filters-title">
        <form className="destinations-filter-dialog__panel" onSubmit={(event) => { event.preventDefault(); closeDialog(); }}>
          <div className="destinations-filter-dialog__header">
            <div>
              <h2 id="catalog-filters-title">{title}</h2>
              <p aria-live="polite">{resultLabel}</p>
            </div>
            <button className="destinations-filter-dialog__close" type="button" onClick={closeDialog}>Close</button>
          </div>

          <div className="destinations-filter-dialog__fields">
            {fields.map((field) => (
              <label className="destinations-filter" key={field.id}>
                <span>{field.label}</span>
                {field.kind === "search" ? (
                  <input
                    ref={searchRef}
                    type="search"
                    value={filters[field.id]}
                    onChange={(event) => onChange({ [field.id]: event.target.value })}
                    placeholder={field.placeholder}
                  />
                ) : (
                  <select value={filters[field.id]} onChange={(event) => onChange({ [field.id]: event.target.value })}>
                    <option value="all">{field.allLabel}</option>
                    {field.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                )}
              </label>
            ))}
          </div>

          <div className="destinations-filter-dialog__actions">
            <button className="destinations-filter-dialog__reset" type="button" onClick={onReset}>Clear filters</button>
            <button className="destinations-filter-dialog__apply" type="submit">Show {resultLabel}</button>
          </div>
        </form>
      </dialog>
    </>
  );
}
