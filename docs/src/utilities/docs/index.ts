import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Types
import type { ParsedUrlQuery } from 'querystring';
import { DocProps } from 'types/docs';

const docsDirectory = path.join(process.cwd(), '/src/docs');

export const getAllDocsPaths = (): { params: ParsedUrlQuery }[] => {
  const sections = fs.readdirSync(docsDirectory);

  const allDocsPaths: { params: ParsedUrlQuery }[] = [];

  sections.forEach((sectionName) => {
    const docsDir = path.join(docsDirectory, sectionName);
    const docNames = fs.readdirSync(docsDir);

    docNames.forEach((docName) =>
      allDocsPaths.push({
        params: {
          id: docName.replace(/\.mdx$/, ''),
          section: sectionName,
        },
      })
    );
  });

  return allDocsPaths;
};

export const getDocData = (
  sectionName: string,
  docId: string
): DocProps | null => {
  const sections = fs.readdirSync(docsDirectory);
  const section = sections.find((section) => section === sectionName);

  if (section) {
    const docsDir = path.join(docsDirectory, section);
    const docNames = fs.readdirSync(docsDir);

    const id = docNames.find((id) => id.replace(/\.mdx$/, '') === docId);

    if (id) {
      const fullPath = path.join(docsDir, id);
      const fileContents = fs.readFileSync(fullPath, 'utf-8');

      const matterResult = matter(fileContents);

      return {
        id: docId,
        section: sectionName,
        title: matterResult.data.title,
        content: matterResult.content,
      };
    }
  }

  return null;
};