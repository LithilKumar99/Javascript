import { Model, DataTypes, QueryTypes } from 'sequelize';

class LogoConfigModel extends Model { }

const createLogoConfigModel = async (dbConnection) => {

    LogoConfigModel.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        image: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        projectId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        },
    }, {
        sequelize: dbConnection,
        modelName: 'LogoConfigModel',
        tableName: 'tblLogoImage',
        timestamps: false
    });

    const logoConfigModelExists = await dbConnection.query(
        `SELECT EXISTS (
            SELECT 1 
            FROM   information_schema.tables 
            WHERE  table_schema = 'public'
            AND    table_name   = 'tblLogoImage'
        );`,
        { type: QueryTypes.SELECT }
    );

    if (logoConfigModelExists[0].exists) {
        console.log("tblLogoImage table already exists.");
    } else {
        await LogoConfigModel.sync({ force: false });
        console.log("tblLogoImage table created successfully.");
    }
};

export { LogoConfigModel, createLogoConfigModel };
