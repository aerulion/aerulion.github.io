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
    /** A page of its own, linked from the card. */
    href?: string;
}

export const projects: Project[] = [
    {
        title: 'Taerra',
        tagline: 'A live web map that renders the whole world in minutes.',
        iconUrl: '/assets/images/taerra-icon.svg',
        meta: [
            {label: 'Type', value: 'Web map plugin & Fabric mod'},
            {label: 'Scale', value: '6,000-block radius in 2 min 46 s'},
            {label: 'Platform', value: 'Paper / Java 25'}
        ],
        description: [
            'Taerra renders a Paper server’s worlds as a pixel-art web map: a top-down view for finding the way and an isometric view, turnable to all four corners, for showing off what people built. It reads the region files directly from its own threads, so the server never loads a chunk for it, and a companion Fabric mod shows the same map in game as a minimap and a full world map.',
            'Corpium’s main world renders completely in under three minutes, where an established map plugin needed more than sixteen hours on the same machine for less. Changes are recorded as they happen and redrawn on an interval, what each viewer may see follows their permissions even while they are offline, and logging in takes one command in chat. It is public on Modrinth and still running live on Corpium.'
        ],
        capabilities: [
            'Top-down & isometric',
            'Four rotations',
            'Live tile updates',
            'Players & markers',
            'In-game minimap',
            'Passwordless login',
            'Permission snapshots'
        ],
        href: '/work/taerra/'
    },
    {
        title: 'Corplexium',
        tagline: 'The platform the rest of Corpium is built on.',
        iconUrl: '/assets/images/corplexium-icon.svg',
        meta: [
            {label: 'Type', value: 'Server platform & plugin API'},
            {label: 'Scale', value: '58 subsystems, 140,000+ lines'},
            {label: 'Platform', value: 'Paper / Java 25'}
        ],
        description: [
            'Corplexium is the plugin the rest of Corpium runs on. What began in 2021 as a merge of several standalone plugins now spans fifty-eight subsystems: items, mobs and drops, economy and auctions, parties, trading, mining, chat, and the player data underneath all of it.',
            'Almost everything a player touches passes through it: thousands of custom items, mob families and drop tables, all defined in code rather than configuration. It is published as a library as well, so the plugins built alongside it compile against Corplexium. What started as a merge of plugins became the foundation the next ones are written on.'
        ],
        capabilities: [
            'Items, mobs & drops',
            'Damage, attributes & enchantments',
            'Economy, auctions & trading',
            'Menus, HUD & scoreboards',
            'Regions, worlds & blocks',
            'Player data & migrations'
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
            'CloudStorage is a fully integrated virtual storage system for Minecraft, designed to manage massive quantities of items and experience with ease. Inspired by systems like Applied Energistics and Refined Storage, it brings a server-friendly, survival-balanced take on cloud-based inventory, built specifically for Corpium.',
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
