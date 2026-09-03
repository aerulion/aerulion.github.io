export interface ProjectMeta {
    label: string;
    value: string;
}

export interface Project {
    title: string;
    tagline: string;
    iconUrl: string;
    meta: ProjectMeta[];
    description: string[];
    capabilities: string[];
}

export const projects: Project[] = [
    {
        title: 'Erenos',
        tagline: 'The platform the rest of Corpium is built on.',
        iconUrl: '/assets/images/erenos-icon.svg',
        meta: [
            {label: 'Type', value: 'Server platform & plugin API'},
            {label: 'Scale', value: '44 subsystems, 100,000+ lines'},
            {label: 'Platform', value: 'Paper / Java 25'}
        ],
        description: [
            'Erenos is the plugin the rest of Corpium runs on. What began in 2021 as a merge of several standalone plugins now spans forty-four subsystems — items, mobs and drops, economy and auctions, parties, trading, mining, chat, and the player data underneath all of it.',
            'Almost everything a player touches passes through it: thousands of custom items, mob families and drop tables, all defined in code rather than configuration. It is published as a library as well, so the plugins built alongside it compile against Erenos — what started as a merge of plugins became the foundation the next ones are written on.'
        ],
        capabilities: [
            'Items, mobs & drops',
            'Damage & attributes',
            'Economy & auctions',
            'Parties & trading',
            'Player data',
            'Published plugin API'
        ]
    },
    {
        title: 'CloudStorage',
        tagline: 'A server-wide logistics backbone for items and experience.',
        iconUrl: '/assets/images/cloudstorage-icon.svg',
        meta: [
            {label: 'Type', value: 'Virtual storage system'},
            {label: 'Scale', value: 'Server-wide item & XP pool'},
            {label: 'Platform', value: 'Custom Paper plugin'}
        ],
        description: [
            'CloudStorage is a fully integrated virtual storage system for Minecraft, designed to manage massive quantities of items and experience with ease. Inspired by systems like Applied Energistics and Refined Storage, it brings a server-friendly, survival-balanced take on cloud-based inventory — built specifically for Corpium.',
            'Every item is handled with precision: stacking logic, permissions, filters and upgrade tiers all ensure performance and flexibility at scale. It acts as a central logistics backbone, simplifying inventory management without removing the challenge of resource handling.'
        ],
        capabilities: [
            'Virtual XP storage',
            'Import / export buses',
            'Full inventory syncing',
            'Stacking logic & filters',
            'Permissions',
            'Upgrade tiers'
        ]
    }
];
