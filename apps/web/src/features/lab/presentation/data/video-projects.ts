export type VideoProject = Readonly<{
  id: string;
  number: string;
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
    number: '01',
    title:
      'Im Schatten des Roten Sterns – Die Geschichte der UdSSR (Dokumentarfilm)',
    date: 'July 2026',
    language: 'German',
    type: 'Documentary',
    description:
      'A cinematic journey through the history of the Soviet Union, from Lenin’s revolution to its legacy in the Ukraine war and Hardbass internet culture. Created for history class, this documentary represents more than 250 hours of work across scripting, audio mastering, colour grading, and historical research.',
    href: 'https://youtu.be/cD70oOa5XaU',
  },
  {
    id: 'pas-besoin-de-souffrir',
    number: '02',
    title: 'Pas besoin de souffrir',
    date: 'February 2026',
    language: 'French',
    type: 'Ad',
    description:
      'A Duolingo ad proving there is a much simpler, fun, and dust-free way to learn a new language — 5 minutes a day is all it takes, wherever you are.',
    href: 'https://youtu.be/jMUOCHRh5MY?si=5kwsj5Jruru9_U-q',
  },
  {
    id: 'une-journee-normale',
    number: '03',
    title: 'Une Journée Normale',
    date: 'March 2025',
    language: 'French',
    type: 'Short Film',
    description:
      'A short film exploring narrative daily life through the lens of mundane moments transformed into visual poetry.',
    href: 'https://youtu.be/RtGm4i7SXvs',
  },
  {
    id: 'comment-ne-pas-faire-ses-devoirs',
    number: '04',
    title: 'Comment ne pas faire ses devoirs',
    date: 'June 2024',
    language: 'French',
    type: 'Short Film',
    description:
      'A creative and humorous take on productivity and student life, exploring the art of procrastination.',
    href: 'https://youtu.be/E9z5RkngZE8',
  },
  {
    id: 'das-blut',
    number: '05',
    title: 'Das Blut — Blutaufbau, Bluttransfusionen & mehr',
    date: 'April 2024',
    language: 'German',
    type: 'Educational',
    description:
      'An educational deep dive into biology and system structures, making complex medical concepts accessible.',
    href: 'https://youtu.be/LbB7rjdWX7U',
  },
  {
    id: 'nous-sommes-louis-et-david',
    number: '06',
    title: 'Nous Sommes Louis et David',
    date: 'September 2023',
    language: 'French',
    type: 'Short Film',
    description:
      'An early collaborative storytelling project exploring friendship, identity, and cross-cultural connection.',
    href: 'https://youtu.be/2TE7iCxApk0',
  },
];
