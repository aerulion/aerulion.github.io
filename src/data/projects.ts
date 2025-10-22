export interface Project {
    title: string;
    description: string;
    iconUrl: string;
    iconAlt: string;
}

export const projects: Project[] = [
    {
        title: "Erenos",
        iconUrl: "/assets/images/erenos-icon.svg",
        iconAlt: "Erenos project icon",
        description: "Erenos is the core gameplay engine powering the Corpium Minecraft server. It was developed as a large-scale custom Paper plugin. Constructed from the ground up, it introduces a fully dynamic item system, a reworked damage and attribute model, and extensive support for custom mechanics that go far beyond the original. Erenos offers a comprehensive suite of features to enhance gameplay, including custom enchantments, interactive blocks, advanced chat handling, and internal messaging systems. It serves as the foundation for the server's unique identity, enabling deep customization and tight integration between features. With over 80,000 lines of meticulously crafted code, Erenos is more than a plugin; it is a comprehensive platform designed to create sophisticated, immersive Minecraft experiences tailored specifically for Corpium."
    },
    {
        title: "CloudStorage",
        iconUrl: "/assets/images/cloudstorage-icon.svg",
        iconAlt: "CloudStorage project icon",
        description: "CloudStorage is a fully integrated virtual storage system for Minecraft, designed to manage massive quantities of items and experience with ease. Inspired by systems like Applied Energistics and Refined Storage, it brings a server-friendly, survival-balanced take on cloud-based inventory—built specifically for Corpium. The system also supports virtual XP storage, automatic import/export via buses, and full inventory syncing with powerful interfaces. Every item is handled with precision—stacking logic, permissions, filters, and upgrade tiers all ensure performance and flexibility at scale. Cloud Storage offers deep gameplay integration and a user-friendly interface, acting as a central logistics backbone for the server. It simplifies inventory management without removing the challenge of resource handling."
    }
];