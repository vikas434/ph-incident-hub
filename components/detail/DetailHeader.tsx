"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface DetailHeaderProps {
  sku: string;
  name: string;
  manufacturer: string;
}

export default function DetailHeader({ sku, name, manufacturer }: DetailHeaderProps) {
  return (
    <div className="sticky top-16 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-600 hover:text-purple-600 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to List
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{name}</h1>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>SKU: {sku}</span>
            <span>•</span>
            <span>Manufacturer: {manufacturer}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

