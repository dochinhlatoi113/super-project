import React from 'react';

export default function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
      <ol className="list-none p-0 inline-flex">
        {items.map((item, idx) => (
          <li key={item.label} className="flex items-center">
            {item.href ? (
              <a href={item.href} className="hover:underline text-blue-600">{item.label}</a>
            ) : (
              <span className="text-gray-700 font-semibold">{item.label}</span>
            )}
            {idx < items.length - 1 && <span className="mx-2">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
