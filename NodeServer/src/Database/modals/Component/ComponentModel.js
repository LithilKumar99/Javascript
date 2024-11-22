import { Model, DataTypes, QueryTypes } from 'sequelize';

class ComponentModel extends Model { }

const createComponentModel = async (dbConnection) => {
    ComponentModel.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        component: {
            type: DataTypes.STRING,
            allowNull: false
        },
        projectId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
        sequelize: dbConnection,
        modelName: 'ComponentModel',
        tableName: 'tblComponents',
        timestamps: false
    });

    const componentModelExists = await dbConnection.query(
        `SELECT EXISTS (
            SELECT 1 
            FROM   information_schema.tables 
            WHERE  table_schema = 'public'
            AND    table_name   = 'tblComponents'
        );`,
        { type: QueryTypes.SELECT }
    );

    if (componentModelExists[0].exists) {
        console.log("tblComponents table already exists.");
    } else {
        await ComponentModel.sync({ force: false });
        console.log("tblComponents table created successfully.");
    }
};

export { ComponentModel, createComponentModel };
