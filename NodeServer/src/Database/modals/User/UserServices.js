import { UserModel } from './UserModel.js';

const getAllUsers = async () => {
    try {
        const allUsers = await UserModel.findAll();
        return allUsers;
    } catch (error) {
        throw new Error('Failed to fetch users');
    }
};

// Create a new user
const createUser = async (userData) => {
    try {
        const newUser = await UserModel.create(userData);
        return newUser;
    } catch (error) {
        throw new Error('Failed to create user');
    }
};

// Update an existing user
const updateUser = async (userId, userData) => {
    try {
        const user = await UserModel.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }
        await user.update(userData);
        return user;
    } catch (error) {
        throw new Error('Failed to update user');
    }
};

// Delete a user
const deleteUser = async (userId) => {
    try {
        const user = await UserModel.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }
        await user.destroy();
    } catch (error) {
        throw new Error('Failed to delete user');
    }
};

export {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser
};
