import express from 'express';
import cors from 'cors';
import { Conta, SalaArcade, SalaDocs } from './db.js';
import { sequelize } from './db.js';

const app = express();
app.use(express.json());

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Criar conta
app.post('/registro', async (req, res) => {
    try {
        const { nome, email, senha, role } = req.body;
        const novaConta = await Conta.create({ nome, email, senha, role });
        res.status(201).json({ message: 'Conta criada com sucesso!', conta: novaConta });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar conta', details: error.message });
    }
});

// Buscar contas
app.get('/contas', async (req, res) => {
    try {
        const contas = await Conta.findAll();
        res.status(200).json(contas);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar contas', details: error.message });
    }
});

app.put('/conta/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, email, senha, role } = req.body;
  
    try {
      const conta = await Conta.findByPk(id);
  
      if (!conta) {
        return res.status(404).json({ message: 'Conta não encontrada' });
      }
      conta.nome = nome || conta.nome;
      conta.email = email || conta.email;
      conta.senha = senha || conta.senha;
      conta.role = role !== undefined ? role : conta.role;
  
      await conta.save();
  
      res.status(200).json({ message: 'Conta atualizada com sucesso', conta });
    } catch (error) {
      console.error("Erro ao atualizar conta:", error);
      res.status(500).json({ message: 'Erro ao atualizar conta', error });
    }
  });

// Excluir contsa
app.delete('/conta/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const conta = await Conta.findByPk(id);
        if (conta) {
            await conta.destroy();
            res.status(200).json({ message: 'Conta excluída com sucesso!' });
        } else {
            res.status(404).json({ error: 'Conta não encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao excluir conta', details: error.message });
    }
});

// Login
app.post('/login', async (req, res) => {
    const { nome, senha } = req.body;

    try {
        const usuario = await Conta.findOne({ where: { nome, senha } });

        if (!usuario) {
            return res.status(401).json({ error: 'Usuário ou senha inválidos' });
        }

        res.json({ role: usuario.role });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
});

// Buscar salas
app.get('/salasB', async (req, res) => {
    const { tipo } = req.query;

    try {
        let salas;
        if (tipo === 'Arcade') {
            salas = await SalaArcade.findAll();
        } else if (tipo === 'Documento') {
            salas = await SalaDocs.findAll();
        } else {
            return res.status(400).json({ error: 'Tipo de sala inválido' });
        }
        res.json(salas);
    } catch (error) {
        console.error('Erro ao buscar salas:', error);
        res.status(500).json({ error: 'Erro ao buscar salas' });
    }
});

// Criar sala
app.post('/salasC', async (req, res) => {
    const { nome, tipo } = req.body;

    if (!nome) {
        return res.status(400).json({ message: 'Nome é necessário' });
    }

    try {
        let novaSala;
        if (tipo === 'Arcade') {
            novaSala = await SalaArcade.create({ nome, tipo: 'Arcade' });
        } else if (tipo === 'Documento') {
            novaSala = await SalaDocs.create({ nome, tipo });
        } else {
            return res.status(400).json({ message: 'Tipo de sala inválido' });
        }

        res.json({ sala: novaSala });
    } catch (error) {
        console.error('Erro ao criar sala:', error);
        res.status(500).json({ message: 'Erro ao criar sala' });
    }
});

// Excluir sala
app.delete('/salasD/:id', async (req, res) => {
    const { tipo } = req.body;
    const id = req.params.id;

    try {
        let result;
        if (tipo === 'Arcade') {
            result = await SalaArcade.destroy({ where: { id } });
        } else if (tipo === 'Documento') {
            result = await SalaDocs.destroy({ where: { id } });
        } else {
            return res.status(400).json({ message: 'Tipo de sala inválido' });
        }

        if (result) {
            res.json({ message: `Sala ${tipo} excluída com sucesso` });
        } else {
            res.status(404).json({ message: 'Sala não encontrada' });
        }
    } catch (error) {
        console.error('Erro ao excluir sala:', error);
        res.status(500).json({ message: 'Erro ao excluir sala' });
    }
});

app.post('/salaDocs/:id/textos', async (req, res) => {
    const { id } = req.params;
    const { texto1, texto2 } = req.body;

    try {
        const sala = await SalaDocs.findByPk(id);

        if (!sala) {
            return res.status(404).json({ message: 'Sala não encontrada' });
        }
        if (texto1 !== undefined) sala.texto1 = texto1;
        if (texto2 !== undefined) sala.texto2 = texto2;
        await sala.save();
        res.status(200).json({ message: 'Textos atualizados com sucesso', sala });
    } catch (error) {
        console.error('Erro ao atualizar textos:', error);
        res.status(500).json({ error: 'Erro ao atualizar textos', details: error.message });
    }
});

app.put('/salasDocs/:id', async (req, res) => {
    const { id } = req.params;
    const { texto1, texto2 } = req.body; // Certifique-se de que `texto2` está sendo recebido
    
    try {
      await SalaDocs.update(
        { texto1, texto2 },
        { where: { id } }
      );
      res.status(200).send('Dados atualizados com sucesso!');
    } catch (error) {
      res.status(500).send('Erro ao salvar dados.');
      console.error('Erro no backend:', error);
    }
  });

app.get('/salasDocs/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const sala = await SalaDocs.findByPk(id);
        if (!sala) {
            return res.status(404).json({ message: 'Sala não encontrada' });
        }
        res.status(200).json(sala);
    } catch (error) {
        console.error('Erro ao buscar sala:', error);
        res.status(500).json({ error: 'Erro ao buscar sala', details: error.message });
    }
});

  app.get('/salaArcade', async (req, res) => {
    try {
      const salas = await SalaArcade.findAll();
      if (!salas) {
        return res.status(404).json({ message: 'Nenhuma sala encontrada' });
      }
      res.json(salas);
    } catch (error) {
      console.error('Erro ao buscar dados da sala:', error);
      res.status(500).json({ message: 'Erro interno no servidor' });
    }
  });

  app.get('/salaArcade/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const sala = await SalaArcade.findOne({ where: { id } });
      
      if (!sala) {
        return res.status(404).json({ error: 'Sala não encontrada' });
      }
  
      res.json(sala);
    } catch (error) {
      console.error('Erro ao buscar sala:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });
  

  app.put('/salaArcade/:id/barra:barId', async (req, res) => {
    try {
      const { id, barId } = req.params;
      const { value, maxValue } = req.body;
      const sala = await SalaArcade.findByPk(id);
  
      if (sala) {
        sala[`barra${barId}`] = value;
        if (maxValue) {
          sala[`barra${barId}Max`] = maxValue; 
        }
        await sala.save();
        res.json(sala);
      } else {
        res.status(404).json({ error: 'Sala não encontrada' });
      }
    } catch (error) {
      console.error('Erro ao atualizar barra:', error);
      res.status(500).json({ error: 'Erro ao atualizar barra' });
    }
  });
  

  
  app.put('/salaArcade/:id/salvarInformacoes', async (req, res) => {
    try {
      const { id } = req.params;
      const { nome, texto1, texto2, texto3, barras } = req.body;
      const sala = await SalaArcade.findByPk(id);
  
      if (sala) {
        sala.nome = nome;
        sala.texto1 = texto1;
        sala.texto2 = texto2;
        sala.texto3 = texto3;
  
        barras.forEach(bar => {
          sala[`barra${bar.id}`] = bar.valorAtual;
          sala[`barra${bar.id}Nome`] = bar.nome;
          sala[`barra${bar.id}MAX`] = bar.valorMaximo;
        });
  
        await sala.save();
        res.json(sala);
      } else {
        res.status(404).json({ error: 'Sala não encontrada' });
      }
    } catch (error) {
      console.error('Erro ao salvar informações da sala:', error);
      res.status(500).json({ error: 'Erro ao salvar informações da sala' });
    }
  });
  app.put('/salaArcade/updateMaxBar/:id', async (req, res) => {
    const { id } = req.params;
    const { value, maxValue } = req.body;
  
    try {
      const sala = await SalaArcade.findOne({ where: { id } });
      
      if (!sala) {
        return res.status(404).json({ message: 'Sala não encontrada' });
      }
      const updatedBars = sala.barras.map(bar => {
        if (bar.id === id) {
          return { ...bar, value, maxValue };
        }
        return bar;
      });
      await sala.update({ barras: updatedBars });
  
      return res.status(200).json({ message: 'Valores das barras atualizados com sucesso' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao atualizar valores das barras', error });
    }
  });
  
sequelize.sync()
    .then(() => {
        console.log('Banco de dados conectado e sincronizado!');
    })
    .catch((error) => {
        console.error('Erro ao conectar ao banco de dados:', error);
    });

const port = 3000;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
