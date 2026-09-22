export interface Milestone {
    year: string;
    title: string;
    note: string;
    track: string;
}

export const FIRST_YEAR = 2012;

export const timeline: Milestone[] = [
    {
        year: '2012',
        title: 'First Java',
        note: 'Started writing Java, two years before any of it had a name.',
        track: 'Personal'
    },
    {
        year: '2014',
        title: 'The aerulion name',
        note: 'Picked the name. Personal and hobby work has run under it ever since.',
        track: 'Personal'
    },
    {
        year: '2016',
        title: 'Corpium',
        note: 'Joined the staff as a supporter, and started writing plugins for the server the same year.',
        track: 'Corpium'
    },
    {
        year: '2019',
        title: 'Developer',
        note: 'The rank caught up with the work that was already being done.',
        track: 'Corpium'
    },
    {
        year: '2020',
        title: 'CloudStorage',
        note: 'Started on 27 August: a server-wide pool for items and experience.',
        track: 'CloudStorage'
    },
    {
        year: '2021',
        title: 'Corplexium',
        note: 'Years of separate plugins merged into one engine. Erenos then, Corplexium now.',
        track: 'Corplexium'
    },
    {
        year: '2024',
        title: 'The item service',
        note: 'The system most of Corplexium leans on, taken apart and rebuilt in one pass.',
        track: 'Corplexium'
    },
    {
        year: '2026',
        title: 'The database layer',
        note: 'Hibernate out, a purpose-built CRUD layer in. Two years in the branch and close to 30.000 lines.',
        track: 'Corplexium'
    },
    {
        year: '2026',
        title: 'Admin',
        note: 'Promoted from developer on 9 September, after ten years on the staff.',
        track: 'Corpium'
    },
    {
        year: 'Today',
        title: '140.000+ lines',
        note: 'Corplexium alone, still under active development.',
        track: 'Corplexium'
    }
];
