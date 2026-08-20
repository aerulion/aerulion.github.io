export const BIRTH_DATE = new Date('1999-05-12');

export function getCurrentYear(): number {
    return new Date().getFullYear();
}

export function calculateAge(birthDate: Date, today = new Date()): number {
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
}

export const age = calculateAge(BIRTH_DATE);
