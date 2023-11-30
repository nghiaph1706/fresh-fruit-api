/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  const Refund = sequelize.define(
    'refunds',
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        comment: 'null',
        autoIncrement: true,
      },
      amount: {
        type: 'DOUBLE',
        allowNull: false,
        defaultValue: '0',
        comment: 'null',
      },
      status: {
        type: DataTypes.STRING(191),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'null',
      },
      title: {
        type: DataTypes.STRING(191),
        allowNull: true,
        comment: 'null',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'null',
      },
      images: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'null',
      },
      order_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        comment: 'null',
        references: {
          model: 'orders',
          key: 'id',
        },
      },
      customer_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        comment: 'null',
        references: {
          model: 'users',
          key: 'id',
        },
      },
      shop_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        comment: 'null',
        references: {
          model: 'shops',
          key: 'id',
        },
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'null',
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'null',
      },
    },
    {
      tableName: 'refunds',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  );
  Refund.associate = (models) => {
    Refund.belongsTo(models.User, { foreignKey: 'customer_id' });
    Refund.belongsTo(models.Shop, { foreignKey: 'shop_id' });
    Refund.belongsTo(models.Order, { foreignKey: 'order_id' });
  };
  return Refund;
}
