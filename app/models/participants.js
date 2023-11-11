/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  return sequelize.define('participants', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: 'null',
      autoIncrement: true
    },
    conversation_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: 'null',
      references: {
        model: 'conversations',
        key: 'id'
      }
    },
    type: {
      type: DataTypes.ENUM('shop', 'user'),
      allowNull: false,
      comment: 'null'
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
    shop_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: 'null',
      references: {
        model: 'shops',
        key: 'id'
      }
    },
    message_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: 'null',
      references: {
        model: 'messages',
        key: 'id'
      }
    },
    notify: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '0',
      comment: 'null'
    },
    last_read: {
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
    tableName: 'participants'
  })
};
