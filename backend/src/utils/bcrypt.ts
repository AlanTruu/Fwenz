import bcrypt from 'bcryptjs'

export const hashValue = async (value : string, saltRounds?: number) => {
    return bcrypt.hash(value, saltRounds || 8);
} 

export const compareValue = async (value : string, hashValue : string) => {
    const same = await bcrypt.compare(value, hashValue);
    return same;
}