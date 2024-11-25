import React, { useState } from 'react';
import { Text, StyleSheet, Image, TextInput, Button, TouchableOpacity, View, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Login() {
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const navigation = useNavigation();

  const login = async () => {
    console.log("Tentando login com nome:", nome, "e senha:", senha);
  
    //fiz isso para manejar as contas sem precisar reiniciar o data base
    if (nome === 'admin' && senha === 'admin') {
      console.log("Login como admin: direcionando para a sala de contas");
      navigation.navigate('contas'); // sala de debbug
      return; 
    }
  
    try {
      const response = await fetch('http://192.168.3.5:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, senha }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Login bem-sucedido:', data);
  
        console.log('Role do usuário:', data.role);
  
        if (data.role === 'GM') {
          navigation.navigate('salaGM');
        } else {
          navigation.navigate('salaPC');
        }
      } else {
        const errorData = await response.json();
        console.error("Erro no servidor:", errorData.error);
        Alert.alert('Erro', errorData.error || 'Erro ao fazer login');
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error.message);
      Alert.alert('Erro', error.message);
    }
  };
  
  

  return (
    <ScrollView style={styles.fundo}>
      <View style={styles.headline}>
        <View style={styles.logobox}>
          <Image style={styles.logo} source={require('../assets/logo.png')} />
        </View>
        <View style={styles.logobox}>
          <Text style={styles.txtdefault}>Você está na tela de login</Text>
        </View>
      </View>

      <View style={styles.fundoImagem}>
        <View style={styles.caixaicone}>
          <Image style={styles.image} source={require('../assets/icone.png')} />
        </View>
      </View>

      <View style={styles.login}>
        <View>
          <Text style={styles.titulo}>Não possui uma conta? 
            <TouchableOpacity onPress={() => navigation.navigate('Criaconta')}>
              <Text style={styles.criaconta}> clique aqui</Text>
            </TouchableOpacity>
          </Text>
        </View>

        <Text style={styles.texto}>Usuário:</Text>
        <TextInput
          style={styles.caixaDeTexto}
          placeholder="digite o usuário"
          placeholderTextColor="#B3B5B8"
          value={nome}
          onChangeText={(valor1) => setNome(valor1)}
        />

        <Text style={styles.texto}>Senha:</Text>
        <TextInput
          style={styles.caixaDeTexto}
          placeholder="digite sua senha"
          placeholderTextColor="#B3B5B8"
          textContentType="newPassword"
          secureTextEntry={true}
          value={senha}
          onChangeText={(valor2) => setSenha(valor2)}
        />

        <View style={styles.botao1}>
          <Button
            title="Entrar"
            color="#ff9900"
            onPress={login}
            backgroundColor="#ff0000"
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  caixaicone: {
    justifyContent: 'flex-end',
    height: 150,
  },
  image: {
    alignSelf: 'center',
    flex: 1,
    width: 190,
  },
  titulo: {
    margin: 20,
    fontWeight: 'bold',
    fontSize: 18,
  },
  texto: {
    marginLeft: 20,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  caixaDeTexto: {
    flex: 1,
    padding: 10,
    margin: 10,
    width: 250,
    backgroundColor: 'white',
    marginLeft: 20,
    color: 'black',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  fundoImagem: {
    backgroundColor: '#232f3e',
    justifyContent: 'center',
    alignContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'gray',
  },
  fundo: {
    backgroundColor: '#606060',
  },
  login: {
    justifyContent: 'center',
    alignItems: 'center',
    borderStartStartRadius: 0,
    borderStartEndRadius: 0,
  },
  botao1: {
    padding: 5,
    justifyContent: 'center',
    flexDirection: 'row',
    fontWeight: 'bold',
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
  criaconta: {
    alignContent: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'lightblue',
  },
});
