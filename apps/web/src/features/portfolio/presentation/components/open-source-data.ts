export type OpenSourceProject = Readonly<{
  name: string;
  description: string;
  tags: ReadonlyArray<string>;
  href: string;
}>;

export const openSourceProjects: ReadonlyArray<OpenSourceProject> = [
  {
    name: 'standards',
    description:
      'The operating contract, agent skills, and strict quality gates behind every repository I run, plus the sync engine that keeps them aligned.',
    tags: ['TypeScript', 'Bun'],
    href: 'https://github.com/davidvornholt/standards',
  },
  {
    name: 'runlet',
    description:
      'A secure ephemeral GitHub Actions runner orchestrator for NixOS hosts and rootless Podman.',
    tags: ['Rust', 'Nix'],
    href: 'https://github.com/davidvornholt/runlet',
  },
  {
    name: 'mail-mcp',
    description:
      'A draft-only IMAP helper for Thunderbird, as an MCP server and CLI on one shared Effect core. It reads and drafts; it never sends.',
    tags: ['TypeScript', 'Effect'],
    href: 'https://github.com/davidvornholt/mail-mcp',
  },
  {
    name: 'punktlandung',
    description:
      'Grade tracking for the Gymnasium in Baden-Württemberg: weighted averages, report preview, study days.',
    tags: ['TypeScript', 'TanStack Start'],
    href: 'https://github.com/davidvornholt/punktlandung',
  },
];
