export interface StackGroup {
    label: string;
    items: string[];
}

export const stack: StackGroup[] = [
    {label: 'Language', items: ['Java 25']},
    {label: 'Platform', items: ['Paper API', 'Bukkit API']},
    {label: 'Data', items: ['MySQL / MariaDB', 'Redis']},
    {label: 'Build', items: ['Gradle']}
];
