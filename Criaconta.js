import React, { useState } from 'react';
import { Text, StyleSheet, Image, TextInput, Button, View, ScrollView, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Criaconta() {
  const [criaNick, setCriaNick] = useState('');
  const [criaEmail, setCriaEmail] = useState('');
  const [criaSenha, setCriaSenha] = useState('');
  const [isGM, setIsGM] = useState(false);

  const toggleSwitch = () => setIsGM(previousState => !previousState);
  const navigation = useNavigation();

  const registrar = async (nome, email, senha, role) => {
    try {
      const response = await fetch('http://192.168.3.5:3000/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha, role }),
      });
      const data = await response.json();
      console.log(data);
      navigation.goBack();
    } catch (error) {
      console.error("Erro no registro:", error);
    }
  };

  return (
    <ScrollView style={styles.fundo}>
      <View style={styles.headline}>
        <View style={styles.logobox}>
          <Image style={styles.logo} source={require('../assets/logo.png')} />
        </View>
        <View style={styles.logobox}>
          <Text style={styles.txtdefault}>Você está na tela de registrar conta</Text>
        </View>
      </View>

      <View style={styles.register}>
        <Text style={styles.titulo}>Criando uma conta:</Text>
        <View style={styles.alinhamentogeral}>
          <View style={styles.alinhamento}>
            <Text style={styles.txtdefault}>Usuário:</Text>
            <TextInput
              style={styles.caixaDeTexto}
              placeholder="Digite seu nome de usuário"
              placeholderTextColor="#B3B5B8"
              onChangeText={setCriaNick}
            />
          </View>
          <View style={styles.alinhamento}>
            <Text style={styles.txtdefault}>Email:</Text>
            <TextInput
              style={styles.caixaDeTexto}
              placeholder="Digite seu email"
              placeholderTextColor="#B3B5B8"
              onChangeText={setCriaEmail}
              keyboardType="email-address"
            />
          </View>
          <View style={styles.alinhamento}>
            <Text style={styles.txtdefault}>Senha:</Text>
            <TextInput
              style={styles.caixaDeTexto}
              placeholder="Digite sua senha"
              placeholderTextColor="#B3B5B8"
              textContentType="newPassword"
              secureTextEntry={true}
              onChangeText={setCriaSenha}
            />
          </View>
          <View style={styles.alinhamento}>
            <Text style={styles.txtdefault}>Marque para ser
              <Text style={{ fontWeight: 'bold' }}> MESTRE </Text>
            </Text>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isGM ? "#f5dd4b" : "#f4f3f4"}
              onValueChange={toggleSwitch}
              value={isGM}
            />
          </View>
        </View>
        <Button 
          title="Criar Conta" 
          onPress={() => registrar(criaNick, criaEmail, criaSenha, isGM ? 'GM' : 'PC')}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  caixaDeTexto: {
    flex: 1,
    padding: 10,
    margin: 10,
    backgroundColor: 'white',
    color: 'black',
    borderColor: 'gray',
    borderWidth: 3,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  register: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    margin: 15,
    padding: 5,
    borderColor: 'gray',
  },
  alinhamento: {
    flexDirection: 'row',
  },
  alinhamentogeral: {
    flexDirection: 'column',
    width: '100%',
    padding: 5,
  },
  fundo: {
    backgroundColor: '#606060',
    flex: 1,
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
    fontSize: 14,
  },
  titulo: {
    color: '#cdcdcd',
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
