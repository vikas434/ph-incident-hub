"use client";

// Simple authentication utilities for supplier portal
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("supplier_authenticated") === "true";
}

export function getSupplierEmail(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("supplier_email");
}

export function getSupplierName(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("supplier_name") || "XYZ Supplier";
}

export function logout(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("supplier_authenticated");
  localStorage.removeItem("supplier_email");
  localStorage.removeItem("supplier_name");
  window.location.href = "/login";
}

