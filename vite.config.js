import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

const pages = [
  "About.html",
  "branding-design.html",
  "Contact.html",
  "index.html",
  "Motion-design.html",
  "Personal-design.html",
  "Photography.html",
  "Project.html",
  "resume.html",
  "Service.html",
];

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        pages.map((page) => [page.replace(/\.html$/i, ""), resolve(rootDir, page)])
      ),
    },
  },
});
