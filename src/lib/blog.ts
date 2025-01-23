import * as fsWalk from "@nodelib/fs.walk";
import { Entry } from "@nodelib/fs.walk";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
//import * as toml from "toml";

interface BlogFrontMatter {
  name?: string;
  path?: string;
  [key: string]: unknown;
}

interface BlogPage {
  path: string;
  frontmatter: BlogFrontMatter;
  content: string;
}

// This is the entry point for blog content generation.
// This function should look for Markdown files,
// parse front matter, dynamically generate pages,
// and anything else the blog needs.
export function pages(): BlogPage[] {
  const contentFolder = path.join(process.env.NEXTJS_ROOT || ".", "content");
  const files = findFilesInContentFolder(contentFolder);
  const pages = files.map((entry) =>
    convertFsWalkEntryIntoBlogPage(contentFolder, entry)
  );
  return pages;
}

function findFilesInContentFolder(contentFolder: string): Entry[] {
  const settings = new fsWalk.Settings({
    entryFilter: (entry) => entry.name.endsWith(".md"),
  });
  return fsWalk.walkSync(contentFolder, settings);
}

const matterOptions = {};

// TODO: add support for TOML front matter
function convertFsWalkEntryIntoBlogPage(
  contentFolder: string,
  entry: Entry
): BlogPage {
  const fileContents = fs.readFileSync(entry.path).toString();
  const parsedContents = matter(fileContents, matterOptions);
  return {
    path: path.relative(contentFolder, entry.path.replace(/\.md$/i, "")),
    frontmatter: parsedContents.data,
    content: parsedContents.content.trim(),
  };
}
