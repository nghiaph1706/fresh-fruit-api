/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  return sequelize.define('resources', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: 'null',
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(191),
      allowNull: false,
      comment: 'null'
    },
    slug: {
      type: DataTypes.STRING(191),
      allowNull: false,
      comment: 'null'
    },
    language: {
      type: DataTypes.STRING(191),
      allowNull: false,
      defaultValue: 'en',
      comment: 'null'
    },
    icon: {
      type: DataTypes.STRING(191),
      allowNull: true,
      comment: 'null'
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'null'
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'null'
    },
    is_approved: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '0',
      comment: 'null'
    },
    price: {
      type: 'DOUBLE',
      allowNull: true,
      comment: 'null'
    },
    type: {
      type: DataTypes.ENUM('DROPOFF_LOCATION', 'PICKUP_LOCATION', 'PERSON', 'DEPOSIT', 'FEATURES'),
      allowNull: false,
      comment: 'null'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'null'
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'null'
    }
  }, {
    tableName: 'resources'
  })
};
