import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList, StatusBar, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function SalaPC() {
  const [salas, setSalas] = useState([]);
  const [nomeSala, setNomeSala] = useState('');
  const [tipoSala, setTipoSala] = useState('Documento');
  const [salasFiltradas, setSalasFiltradas] = useState([]);
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
            setSalasFiltradas(data);
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

  const navegar = (id, nome, tipo) => {
    if (tipo === 'Arcade') {
      navigation.navigate('ArcadeSala', { salaId: id, salaNome: nome });
    } else {
      navigation.navigate('Documento', { salaId: id, salaNome: nome });
    }
  };

  const filtrarSalas = (nome) => {
    setNomeSala(nome);
    if (nome.trim() === '') {
      setSalasFiltradas(salas);
    } else {
      const salasFiltradas = salas.filter(sala => sala.nome.toLowerCase().includes(nome.toLowerCase()));
      setSalasFiltradas(salasFiltradas);
    }
  };

  const Item = ({ nome, id, tipo }) => (
    <View style={styles.item}>
      <Text style={styles.titulo}>{nome}, ({tipo} id={id})</Text>
      <View style={styles.botafex}>
        <TouchableOpacity style={styles.entrar} onPress={() => navegar(id, nome, tipo)}>
          <Text style={styles.entrartxt}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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
          onChangeText={filtrarSalas}
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

        <FlatList
          data={salasFiltradas}
          renderItem={({ item }) => <Item nome={item.nome} id={item.id} tipo={item.tipo} />}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  textos: {
    color: 'black',
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
    height: '100%',
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
    width: '100%',
    height: '200%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  entrartxt: {
    color: 'white',
    fontWeight: 'bold',
  },
  botafex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    bottom: 1,
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
