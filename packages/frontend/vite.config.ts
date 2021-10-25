import { defineConfig, searchForWorkspaceRoot } from "vite";
import react from "@vitejs/plugin-react";

console.log("path: ", searchForWorkspaceRoot(process.cwd()));
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // server: {
  //   fs: {
  //     strict: true,
  //     // allow: [
  //     //   // search up for workspace root
  //     //   path.join(searchForWorkspaceRoot(process.cwd()), "packages/frontend"),
  //     // ],
  //   },
  // },
});
