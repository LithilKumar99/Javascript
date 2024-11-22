import { Model, DataTypes, QueryTypes } from 'sequelize';

class UserModel extends Model { }

const createUserModel = async (dbConnection) => {
    UserModel.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM('admin', 'user'),
            allowNull: false,
            defaultValue: 'user'
        }
    }, {
        sequelize: dbConnection,
        modelName: 'UserModel',
        tableName: 'tblUsers',
        timestamps: false
    });

    const userTableExists = await dbConnection.query(
        `SELECT EXISTS (
            SELECT 1 
            FROM   information_schema.tables 
            WHERE  table_schema = 'public'
            AND    table_name   = 'tblUsers'
        );`,
        { type: QueryTypes.SELECT }
    );

    if (userTableExists[0].exists) {
        console.log("tblUsers table already exists.");
    } else {
        await UserModel.sync({ force: false });
        console.log("tblUsers table created successfully.");
    }
}

export { UserModel, createUserModel };
