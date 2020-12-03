module.exports = (sequelize, DataTypes) => {
    let Term = sequelize.define('term', {
        version: DataTypes.BIGINT,
        content: DataTypes.STRING
    });
    Term.associate = function (models) {
        Term.hasMany(models.user,{
            foreignKey: 'userId'
        })
    };
    return Term;
};
