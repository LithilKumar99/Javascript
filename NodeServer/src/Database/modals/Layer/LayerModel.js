import { Model, DataTypes, QueryTypes } from 'sequelize';

class LayerModel extends Model { }

const createLayerModel = async (dbConnection) => {
    LayerModel.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        workspace: {
            type: DataTypes.STRING,
            allowNull: false
        },
        layer: {
            type: DataTypes.STRING,
            allowNull: false
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        index: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        projectId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize: dbConnection,
        modelName: 'LayerModel',
        tableName: 'tblLayers',
        timestamps: false
    });

    const LayerModelExists = await dbConnection.query(
        `SELECT EXISTS (
            SELECT 1 
            FROM   information_schema.tables 
            WHERE  table_schema = 'public'
            AND    table_name   = 'tblLayers'
        );`,
        { type: QueryTypes.SELECT }
    );

    if (LayerModelExists[0].exists) {
        console.log("tblLayers table already exists.");
    } else {
        await LayerModel.sync({ force: false });
        console.log("tblLayers table created successfully.");
    }
};

export { LayerModel, createLayerModel };
