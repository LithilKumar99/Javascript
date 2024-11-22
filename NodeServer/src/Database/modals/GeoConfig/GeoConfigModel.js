import { Model, DataTypes, QueryTypes } from 'sequelize';

class GeoConfigModel extends Model { }

const createGeoConfigModel = async (dbConnection) => {
    
    GeoConfigModel.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, {
        sequelize: dbConnection,
        modelName: 'GeoConfigModel',
        tableName: 'tblGeoConfig',
        timestamps: false
    });

    const geoConfigModelExists = await dbConnection.query(
        `SELECT EXISTS (
            SELECT 1 
            FROM   information_schema.tables 
            WHERE  table_schema = 'public'
            AND    table_name   = 'tblGeoConfig'
        );`,
        { type: QueryTypes.SELECT }
    );

    if (geoConfigModelExists[0].exists) {
        console.log("tblGeoConfig table already exists.");
    } else {
        await GeoConfigModel.sync({ force: false });
        console.log("tblGeoConfig table created successfully.");
    }
};

export { GeoConfigModel, createGeoConfigModel };
