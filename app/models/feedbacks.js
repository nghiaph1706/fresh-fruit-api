/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  return sequelize.define('feedbacks', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: 'null',
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: 'null',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    model_type: {
      type: DataTypes.STRING(191),
      allowNull: false,
      comment: 'null'
    },
    model_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: 'null'
    },
    positive: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      comment: 'null'
    },
    negative: {
      type: DataTypes.INTEGER(1),
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
    tableName: 'feedbacks'
  })
};
