import React from "react";

interface PageHeaderProps {
  title: string;
  description: string;
}

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="w-full">
      <h1 className="text-xl font-bold text-gray-900 md:text-3xl">{title}</h1>
      <p className="mt-2 text-xs text-gray-600 md:text-base">{description}</p>
    </div>
  );
}
