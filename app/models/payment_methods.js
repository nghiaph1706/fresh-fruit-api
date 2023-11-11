/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  return sequelize.define('payment_methods', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: 'null',
      autoIncrement: true
    },
    method_key: {
      type: DataTypes.STRING(191),
      allowNull: false,
      comment: 'null',
      unique: true
    },
    payment_gateway_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: 'null',
      references: {
        model: 'payment_gateways',
        key: 'id'
      }
    },
    default_card: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0',
      comment: 'null'
    },
    fingerprint: {
      type: DataTypes.STRING(191),
      allowNull: false,
      comment: 'null',
      unique: true
    },
    owner_name: {
      type: DataTypes.STRING(191),
      allowNull: true,
      comment: 'null'
    },
    network: {
      type: DataTypes.STRING(191),
      allowNull: true,
      comment: 'null'
    },
    type: {
      type: DataTypes.STRING(191),
      allowNull: true,
      comment: 'null'
    },
    last4: {
      type: DataTypes.STRING(191),
      allowNull: true,
      comment: 'null'
    },
    expires: {
      type: DataTypes.STRING(191),
      allowNull: true,
      comment: 'null'
    },
    origin: {
      type: DataTypes.STRING(191),
      allowNull: true,
      comment: 'null'
    },
    verification_check: {
      type: DataTypes.STRING(191),
      allowNull: true,
      comment: 'null'
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
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
    tableName: 'payment_methods'
  })
};
