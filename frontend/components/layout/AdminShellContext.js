"use client";

import { createContext, useContext } from "react";

export const AdminShellContext = createContext({ search: "", setSearch: () => {} });

export function useAdminSearch() {
  return useContext(AdminShellContext);
}
