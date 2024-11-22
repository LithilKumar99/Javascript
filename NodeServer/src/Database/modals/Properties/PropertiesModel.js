import { Model, DataTypes, QueryTypes } from 'sequelize';

class PropertiesModel extends Model { }

const createPropertiesModel = async (dbConnection) => {

    PropertiesModel.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        backgroundColor: {
            type: DataTypes.STRING,
            allowNull: false
        },
        textColor: {
            type: DataTypes.STRING,
            allowNull: false
        },
        borderColor: {
            type: DataTypes.STRING,
            allowNull: false
        },
        TypographicColor: {
            type: DataTypes.STRING,
            allowNull: false
        },
        CardColor: {
            type: DataTypes.STRING,
            allowNull: false
        },
        FontFamily: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fillColor: {
            type: DataTypes.STRING,
            allowNull: false
        },
        strokeColor: {
            type: DataTypes.STRING,
            allowNull: false
        },
        circleColor: {
            type: DataTypes.STRING,
            allowNull: false
        },
        projectId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        },
        componentId: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        sequelize: dbConnection,
        modelName: 'PropertiesModel',
        tableName: 'tblProperties',
        timestamps: false
    });

    const propertiesModelExists = await dbConnection.query(
        `SELECT EXISTS (
            SELECT 1 
            FROM   information_schema.tables 
            WHERE  table_schema = 'public'
            AND    table_name   = 'tblProperties'
        );`,
        { type: QueryTypes.SELECT }
    );

    if (propertiesModelExists[0].exists) {
        console.log("tblProperties table already exists.");
    } else {
        await PropertiesModel.sync({ force: false });
        console.log("tblProperties table created successfully.");
    }
};

export { PropertiesModel, createPropertiesModel };
