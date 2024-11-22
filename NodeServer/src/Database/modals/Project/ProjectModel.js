import { Model, DataTypes, QueryTypes } from 'sequelize';

class ProjectModel extends Model { }

const createProjectModel = async (dbConnection) => {
    ProjectModel.init({
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
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
        sequelize: dbConnection,
        modelName: 'ProjectModel',
        tableName: 'tblProjects',
        timestamps: false
    });

    const projectModelExists = await dbConnection.query(
        `SELECT EXISTS (
            SELECT 1 
            FROM   information_schema.tables 
            WHERE  table_schema = 'public'
            AND    table_name   = 'tblProjects'
        );`,
        { type: QueryTypes.SELECT }
    );

    if (projectModelExists[0].exists) {
        console.log("tblProjects table already exists.");
    } else {
        await ProjectModel.sync({ force: false });
        console.log("tblProjects table created successfully.");
    }
}

export { ProjectModel, createProjectModel };
