export type NavItem = {
  readonly label: string;
  readonly href: string;
};

// The sections live on the home page, so the fragments carry its path to work
// from every route that renders the header or footer.
export const navItems: ReadonlyArray<NavItem> = [
  { label: 'Works', href: '/#works' },
  { label: 'Expertise', href: '/#expertise' },
  { label: 'Blog', href: '/#blog' },
  { label: 'Contact', href: '/#contact' },
] as const;
