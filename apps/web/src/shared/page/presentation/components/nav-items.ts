export type NavItem = {
  readonly label: string;
  readonly href: string;
};

// The sections live on the home page, so the fragments carry its path to work
// from every route that renders the header or footer.
export const navItems: ReadonlyArray<NavItem> = [
  { label: 'Work', href: '/#work' },
  { label: 'How I work', href: '/#rules' },
  { label: 'Writing', href: '/#writing' },
  { label: 'About', href: '/#about' },
] as const;

export const contactItem: NavItem = { label: 'Write to me', href: '/#contact' };
