/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  return sequelize.define('failed_jobs', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: 'null',
      autoIncrement: true
    },
    uuid: {
      type: DataTypes.STRING(191),
      allowNull: false,
      comment: 'null',
      unique: true
    },
    connection: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'null'
    },
    queue: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'null'
    },
    payload: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'null'
    },
    exception: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'null'
    },
    failed_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.fn('current_timestamp'),
      comment: 'null'
    }
  }, {
    tableName: 'failed_jobs'
  })
};
