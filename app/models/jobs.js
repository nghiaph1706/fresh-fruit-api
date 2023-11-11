/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  return sequelize.define('jobs', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: 'null',
      autoIncrement: true
    },
    queue: {
      type: DataTypes.STRING(191),
      allowNull: false,
      comment: 'null'
    },
    payload: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'null'
    },
    attempts: {
      type: DataTypes.INTEGER(3).UNSIGNED,
      allowNull: false,
      comment: 'null'
    },
    reserved_at: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true,
      comment: 'null'
    },
    available_at: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      comment: 'null'
    },
    created_at: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      comment: 'null'
    }
  }, {
    tableName: 'jobs'
  })
};
