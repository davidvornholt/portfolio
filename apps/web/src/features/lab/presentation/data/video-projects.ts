export type VideoProject = Readonly<{
  id: string;
  title: string;
  date: string;
  language: string;
  type: string;
  description: string;
  href: string;
}>;

export const videoProjects: ReadonlyArray<VideoProject> = [
  {
    id: 'im-schatten-des-roten-sterns',
    title:
      'Im Schatten des Roten Sterns – Die Geschichte der UdSSR (Dokumentarfilm)',
    date: 'July 2026',
    language: 'German',
    type: 'Documentary',
    description:
      'A documentary on the history of the Soviet Union, from Lenin’s revolution to its traces in the war in Ukraine and in Hardbass internet culture. I made it for history class and spent more than 250 hours on the script, the research, the sound, and the color grading.',
    href: 'https://youtu.be/cD70oOa5XaU',
  },
  {
    id: 'pas-besoin-de-souffrir',
    title: 'Pas besoin de souffrir',
    date: 'February 2026',
    language: 'French',
    type: 'Ad',
    description:
      'An ad for Duolingo: learning a language takes five minutes a day, wherever you are, and no dusty textbook.',
    href: 'https://youtu.be/jMUOCHRh5MY',
  },
  {
    id: 'une-journee-normale',
    title: 'Une Journée Normale',
    date: 'March 2025',
    language: 'French',
    type: 'Short film',
    description: 'A short film about one ordinary day.',
    href: 'https://youtu.be/RtGm4i7SXvs',
  },
  {
    id: 'comment-ne-pas-faire-ses-devoirs',
    title: 'Comment ne pas faire ses devoirs',
    date: 'June 2024',
    language: 'French',
    type: 'Short film',
    description: 'A comedy about putting off homework.',
    href: 'https://youtu.be/E9z5RkngZE8',
  },
  {
    id: 'das-blut',
    title: 'Das Blut — Blutaufbau, Bluttransfusionen & mehr',
    date: 'April 2024',
    language: 'German',
    type: 'Educational',
    description:
      'An explainer on blood: what it is made of, how transfusions work, and more.',
    href: 'https://youtu.be/LbB7rjdWX7U',
  },
  {
    id: 'nous-sommes-louis-et-david',
    title: 'Nous Sommes Louis et David',
    date: 'September 2023',
    language: 'French',
    type: 'Short film',
    description:
      'An early film made with a friend, about friendship across two cultures.',
    href: 'https://youtu.be/2TE7iCxApk0',
  },
];
