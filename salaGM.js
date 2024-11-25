import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, StatusBar, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function SalaGM() {
  const [salas, setSalas] = useState([]);
  const [nomeSala, setNomeSala] = useState('');
  const [tipoSala, setTipoSala] = useState('Documento');
  const navigation = useNavigation();

  useEffect(() => {
    const carregarSalas = async () => {
      try {
        const response = await fetch(`http://192.168.3.5:3000/salasB?tipo=${tipoSala}`);
        const data = await response.json();
        console.log('Resposta ao carregar salas:', data);

        if (response.ok) {
          if (Array.isArray(data)) {
            setSalas(data);
          } else {
            console.error('Formato de dados inesperado:', data);
            Alert.alert('Erro', 'Formato de dados inesperado recebido do servidor');
          }
        } else {
          Alert.alert('Erro', 'Falha ao carregar salas');
        }
      } catch (error) {
        console.error('Erro ao carregar salas:', error);
        Alert.alert('Erro', 'Falha ao conectar ao servidor');
      }
    };

    carregarSalas();
  }, [tipoSala]);

const criarSala = async () => {
  if (nomeSala.trim()) {
    const novaSala = {
      nome: nomeSala,
      tipo: tipoSala,
    };

    console.log('Tipo de sala ao criar:', tipoSala);

    try {
      const response = await fetch('http://192.168.3.5:3000/salasC', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaSala),
      });

      const data = await response.json();
      console.log('Resposta do servidor ao criar sala:', data);

      if (response.ok && data.sala) {
        setSalas((prevSalas) => [...prevSalas, data.sala]);
        setNomeSala('');
      } else {
        Alert.alert('Erro', data.message || 'Falha ao criar sala');
      }
    } catch (error) {
      console.error('Erro ao criar sala:', error);
      Alert.alert('Erro', 'Falha ao conectar ao servidor');
    }
  }
};


  const excluirSala = async (id, tipo) => {
    if (!tipo) {
      Alert.alert('Erro', 'Tipo de sala não encontrado');
      return;
    }

    try {
      const response = await fetch(`http://192.168.3.5:3000/salasD/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo }),
      });

      if (response.ok) {
        alert(`Sala ${tipo} excluída com sucesso`);
        setSalas(salas.filter((sala) => sala.id !== id));
      } else {
        const data = await response.json();
        alert(data.message || 'Erro ao excluir sala');
      }
    } catch (error) {
      console.error('Erro ao excluir sala:', error);
      alert('Erro ao excluir sala');
    }
  };

  const navegar = (id, nome, tipo) => {
    if (tipo === 'Arcade') {
      navigation.navigate('ArcadeSala', { salaId: id, salaNome: nome });
    } else {
      navigation.navigate('Documento', { salaId: id, salaNome: nome });
    }
  };

  const Item = ({ nome, id, tipo }) => {
    return (
      <View style={styles.item}>
        <Text style={styles.titulo}>{nome}, ({tipo} id={id})</Text>
        <View style={styles.botafex}>
          <TouchableOpacity style={styles.entrar} onPress={() => navegar(id, nome, tipo)}>
            <Text style={styles.entrartxt}>Entrar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.fechar} onPress={() => excluirSala(id, tipo)}>
            <Text style={styles.fechartxt}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.fundo}>
      <View style={styles.headline}>
        <View style={styles.logobox}>
          <Image style={styles.logo} source={require('../assets/logo.png')} />
        </View>
        <View style={styles.logobox}>
          <Text style={styles.txtdefault}>Você está na lobby GM</Text>
        </View>
      </View>
      <View style={styles.container}>
        <Text style={styles.textos}>Tela de Início</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o nome da sala"
          value={nomeSala}
          onChangeText={setNomeSala}
          placeholderTextColor="#B3B5B8"
        />
        <View style={styles.tipoSalaContainer}>
          <Button
            title="Documentação"
            onPress={() => setTipoSala('Documento')}
            color={tipoSala === 'Documento' ? 'green' : '#ff9900'}
          />
          <Button
            title="Arcade"
            onPress={() => setTipoSala('Arcade')}  
            color={tipoSala === 'Arcade' ? 'green' : '#ff9900'}
          />
        </View>
        <Button style={styles.entrar} title="Criar Sala" onPress={criarSala} color="#ff9900" />
        <FlatList
          data={salas}
          renderItem={({ item }) => <Item nome={item.nome} id={item.id} tipo={item.tipo} />}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  textos: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    alignSelf: 'center',
  },
  fundo: {
    height: '100%',
    backgroundColor: '#505050',
  },
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
    padding: 16,
  },
  input: {
    backgroundColor: '#f2f2f2',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  item: {
    backgroundColor: '#232f3e',
    height: 130,
    marginVertical: 8,
    padding: 10,
  },
  titulo: {
    margin: 20,
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white',
  },
  entrar: {
    backgroundColor: '#ff9900',
    width: 75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  entrartxt: {
    color: 'white',
    fontWeight: 'bold',
  },
  fechar: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#146eb4',
    width: 150,
    height: 40,
    borderRadius: 5,
    padding: 10,
  },
  fechartxt: {
    color: 'white',
    fontWeight: 'bold',
  },
  botafex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    bottom: 1,
  },
  tipoSalaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headline: {
    alignSelf: 'center',
    backgroundColor: '#202020',
    borderBottomColor: 'gray',
    borderBottomWidth: 2,
    width: '100%',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 7,
  },
  logo: {
    width: 30,
    height: 30,
    alignSelf: 'center',
  },
  logobox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  txtdefault: {
    color: '#cdcdcd',
    alignSelf: 'center',
    fontSize: 16,
  },
});