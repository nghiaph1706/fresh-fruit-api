/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  const Tax = sequelize.define('tax_classes', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: 'null',
      autoIncrement: true
    },
    country: {
      type: DataTypes.STRING(191),
      allowNull: true,
      comment: 'null'
    },
    state: {
      type: DataTypes.STRING(191),
      allowNull: true,
      comment: 'null'
    },
    zip: {
      type: DataTypes.STRING(191),
      allowNull: true,
      comment: 'null'
    },
    city: {
      type: DataTypes.STRING(191),
      allowNull: true,
      comment: 'null'
    },
    rate: {
      type: 'DOUBLE',
      allowNull: false,
      comment: 'null'
    },
    name: {
      type: DataTypes.STRING(191),
      allowNull: true,
      comment: 'null'
    },
    is_global: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      comment: 'null'
    },
    priority: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      comment: 'null'
    },
    on_shipping: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '1',
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
    tableName: 'tax_classes',
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  })

  return Tax
};
