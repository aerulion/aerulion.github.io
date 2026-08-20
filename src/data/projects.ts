export interface ProjectMeta {
    label: string;
    value: string;
}

export interface Project {
    title: string;
    tagline: string;
    description: string[];
    iconUrl: string;
    iconAlt: string;
    meta: ProjectMeta[];
    capabilities: string[];
}

export const projects: Project[] = [
    {
        title: "Erenos",
        tagline: "The core gameplay engine behind Corpium.",
        iconUrl: "/assets/images/erenos-icon.svg",
        iconAlt: "Erenos project icon",
        meta: [
            {label: "Type", value: "Core gameplay engine"},
            {label: "Scale", value: "80.000+ lines"},
            {label: "Platform", value: "Custom Paper plugin"}
        ],
        capabilities: [
            "Dynamic item system",
            "Reworked damage & attributes",
            "Custom enchantments",
            "Interactive blocks",
            "Advanced chat handling",
            "Internal messaging"
        ],
        description: [
            "Erenos is the core gameplay engine powering the Corpium Minecraft server, developed as a large-scale custom Paper plugin. Constructed from the ground up, it introduces a fully dynamic item system, a reworked damage and attribute model, and extensive support for custom mechanics that go far beyond the original.",
            "It serves as the foundation for the server's identity, enabling deep customization and tight integration between features. With over 80.000 lines of meticulously crafted code, Erenos is more than a plugin — it is a platform for sophisticated, immersive Minecraft experiences built specifically for Corpium."
        ]
    },
    {
        title: "CloudStorage",
        tagline: "A server-wide logistics backbone for items and experience.",
        iconUrl: "/assets/images/cloudstorage-icon.svg",
        iconAlt: "CloudStorage project icon",
        meta: [
            {label: "Type", value: "Virtual storage system"},
            {label: "Scale", value: "Server-wide item & XP pool"},
            {label: "Platform", value: "Custom Paper plugin"}
        ],
        capabilities: [
            "Virtual XP storage",
            "Import / export buses",
            "Full inventory syncing",
            "Stacking logic & filters",
            "Permissions",
            "Upgrade tiers"
        ],
        description: [
            "CloudStorage is a fully integrated virtual storage system for Minecraft, designed to manage massive quantities of items and experience with ease. Inspired by systems like Applied Energistics and Refined Storage, it brings a server-friendly, survival-balanced take on cloud-based inventory — built specifically for Corpium.",
            "Every item is handled with precision: stacking logic, permissions, filters and upgrade tiers all ensure performance and flexibility at scale. It acts as a central logistics backbone, simplifying inventory management without removing the challenge of resource handling."
        ]
    }
];
