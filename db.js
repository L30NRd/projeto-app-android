import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

const Conta = sequelize.define('Conta', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  role: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

const SalaArcade = sequelize.define('SalaArcade', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nomePersonagem:{
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Nome',
  },
  tipo: {
    type: DataTypes.STRING,
    defaultValue: 'Arcade',
  },
  barranome1: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'barra 1',
  },
  barra1: {
    type: DataTypes.INTEGER,
    defaultValue: 20,
  },
  barra1MAX: {
    type: DataTypes.INTEGER,
    defaultValue: 20,
  },
  barranome2: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'barra 2',
  },
  barra2: {
    type: DataTypes.INTEGER,
    defaultValue: 20,
  },
  barra2MAX: {
    type: DataTypes.INTEGER,
    defaultValue: 20,
  },
  barranome3: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'barra 3',
  },
  barra3: {
    type: DataTypes.INTEGER,
    defaultValue: 20,
  },
  barra3MAX: {
    type: DataTypes.INTEGER,
    defaultValue: 20,
  },
  barranome4: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'barra 4',
  },
  barra4: {
    type: DataTypes.INTEGER,
    defaultValue: 20,
  },
  barra4MAX: {
    type: DataTypes.INTEGER,
    defaultValue: 20,
  },
  texto1: {
    type: DataTypes.TEXT,
  },
  texto2: {
    type: DataTypes.TEXT,
  },
  texto3: {
    type: DataTypes.TEXT,
  },
});

const SalaDocs = sequelize.define('SalaDocs', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipo: {
    type: DataTypes.STRING,
    defaultValue: 'Documento',
  },
  texto1: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  texto2: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

(async () => {
  await sequelize.sync({ force: false });
  console.log('Tabelas criadas com sucesso!');
})();

export { sequelize, Conta, SalaArcade, SalaDocs };
