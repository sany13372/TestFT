const users = new Map<number, { isActive: boolean; expiryDate: Date }>();

export const addUser = (userId: number, days: number) => {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);
    users.set(userId, { isActive: true, expiryDate });
};

export const getUser = (userId: number) => {
    return users.get(userId);
};

export const removeUser = (userId: number) => {
    users.delete(userId);
};