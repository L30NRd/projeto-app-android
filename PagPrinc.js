import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, StatusBar, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function PagPrinc() {
  const [salas, setSalas] = useState([]);
  const [nomeSala, setNomeSala] = useState('');
  const [tipoSala, setTipoSala] = useState('docs');
  const navigation = useNavigation();

  function criarSala() {
    if (nomeSala.trim()) {
        const novaSala = {
            nome: nomeSala,
            tipo: tipoSala
        };
        fetch('http://localhost:3000/salas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novaSala),
        })
        .then(response => response.json())
        .then(data => {
            if (data.sala) {
                setSalas([...salas, data.sala]);
                setNomeSala('');
            } else {
                Alert.alert('Erro', data.error || 'Falha ao criar sala');
            }
        })
        .catch(error => {
            console.error('Erro ao criar sala:', error);
            Alert.alert('Erro', 'Falha ao conectar ao servidor');
        });
    }
}

  function apagarSala(id) {
    setSalas(salas.filter(sala => sala.id !== id));
  }

  function navegar(id, nome, tipo) {
    if (tipo === 'arcade') {
      navigation.navigate('ArcadeSala', { salaId: id, salaNome: nome });
    } else {
      navigation.navigate('Documento', { salaId: id, salaNome: nome });
    }
  }

  const Item = ({ nome, id, tipo }) => {
    const [longPressTimer, setLongPressTimer] = useState(null);

    const handleLongPress = () => {
      const timer = setTimeout(() => {
        apagarSala(id);
        setLongPressTimer(null);
      }, 1000);
      setLongPressTimer(timer);
    };

    const handlePressOut = () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        setLongPressTimer(null);
      }
    };

    return (
      <View style={styles.item}>
        <Text style={styles.titulo}>{nome} ({tipo})</Text>
        <View style={styles.botafex}>
          <TouchableOpacity
            style={styles.entrar}
            onPress={() => navegar(id, nome, tipo)}
            color="#ff9900">
            <Text style={styles.entrartxt}>Entrar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.fechar}
            onLongPress={handleLongPress}
            onPressOut={handlePressOut}
          >
            <Text style={styles.fechartxt}>Segure p/ excluir</Text>
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
          <Text style={styles.txtdefault}>Você esta na no lobby</Text>
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
          onPress={() => setTipoSala('docs')}
          color={tipoSala === 'docs' ? 'green' : '#ff9900'}
        />
        <Button
          title="Arcade"
          onPress={() => setTipoSala('arcade')}
          color={tipoSala === 'arcade' ? 'green' : '#ff9900'}
        />
      </View>

      <Button
        style={styles.entrar}
        title="Criar Sala"
        onPress={criarSala}
        color='#ff9900'
      />

      <FlatList
        data={salas}
        renderItem={({ item }) => <Item nome={item.nome} id={item.id} tipo={item.tipo} />}
        keyExtractor={item => item.id}
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
    bottom: -40,
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
