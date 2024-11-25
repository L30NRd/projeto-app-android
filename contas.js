import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TextInput, StyleSheet, ScrollView, Image, Alert } from 'react-native';

export default function Contas() {
  const [contas, setContas] = useState([]);
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [originalRole, setOriginalRole] = useState(false);

  const fetchContas = async () => {
    try {
      const response = await fetch('http://192.168.3.5:3000/contas');
      const data = await response.json();
      setContas(data);
    } catch (error) {
      console.error("Erro ao buscar contas:", error);
    }
  };

  useEffect(() => {
    fetchContas();
  }, []);

  const criaConta = async () => {
    try {
      const response = await fetch('http://192.168.3.5:3000/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha, role }),
      });
      const data = await response.json();
      console.log(data.message);
      fetchContas();
    } catch (error) {
      console.error("Erro ao criar conta:", error);
    }
  };

  const deleteConta = async (id) => {
    try {
      const response = await fetch(`http://192.168.3.5:3000/conta/${id}`, { method: 'DELETE' });
      const data = await response.json();
      console.log(data.message);
      fetchContas();
    } catch (error) {
      console.error("Erro ao deletar conta:", error);
    }
  };

  const confirmDeleteConta = (id) => {
    Alert.alert(
      "Excluir Conta",
      "Tem certeza que deseja excluir esta conta? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", onPress: () => deleteConta(id), style: "destructive" }
      ]
    );
  };

  const updateConta = async () => {
    if (selectedUserId) {
      try {
        const response = await fetch(`http://192.168.3.5:3000/conta/${selectedUserId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome, email, senha, role }),
        });
        const data = await response.json();
        console.log(data.message);
        setSelectedUserId(null);
        setOriginalRole(false);
        fetchContas();
      } catch (error) {
        console.error("Erro ao atualizar conta:", error);
      }
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.flexCont}>
      <Text style={styles.txtdefault}>{item.nome} | {item.senha} | ({item.role ? 'GM' : 'PC'})</Text>
      <Button title="Editar" onPress={() => {
        setNome(item.nome);
        setEmail(item.email);
        setSenha('');
        setRole(item.role);
        setOriginalRole(item.role);
        setSelectedUserId(item.id);
      }} />
      <Button 
        title="Deletar" 
        onPress={() => confirmDeleteConta(item.id)} 
        color="red"
      />
    </View>
  );

  return (
    <ScrollView style={styles.fundo}>
      <View style={styles.headline}>
        <View style={styles.logobox}>
          <Image style={styles.logo} source={require('../assets/logo.png')} />
        </View>
        <View style={styles.logobox}>
          <Text style={styles.txtdefault}>Você está na página secreta.</Text>
        </View>
      </View>
      
      <Text style={styles.titulo}>Contas registradas</Text>
      <FlatList
        data={contas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
      <View style={styles.flexCont}>
        <TextInput
          style={styles.input}
          placeholder="Nome de usuário"
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={true}
        />
        <Button 
          title={role ? 'Definir como PC' : 'Definir como GM'} 
          onPress={() => setRole(!role)}
          color={role ? 'red' : 'purple'}
        />
      </View>
      <View style={{ padding: 10 }}>
        <Button 
          title="Criar Usuário"
          onPress={criaConta}
          disabled={!!selectedUserId}
          color='#ff9900'
        />
        <Button 
          title="Atualizar Usuário"
          onPress={updateConta}
          disabled={!selectedUserId || role === originalRole}
          color='#ff9900'
        />
        <Button
          title="Salas Criadas"
          onPress={() => {}}
        />
      </View>
    </ScrollView>
  );
}



const styles = StyleSheet.create({
    flexCont: {
        flex: 1,
        margin: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
    },
    caixa: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,

    },
    alinhar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    fundo: {
        backgroundColor: '#606060',
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
    input: {
        backgroundColor: '#f2f2f2',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 8,
        width: '75%',
        alignSelf: 'center',
    },
    titulo: {
        margin: 20,
        fontWeight: 'bold',
        fontSize: 18,
        alignSelf: 'center',
        color: 'white',
    },
    botao: {
        backgroundColor: '#ff9900',
        width: '75%',
        justifyContent: 'center',
        alignItems: 'center',
    
      },
    delete: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#146eb4',
        width: 150,
        height: 40,
        borderRadius: 5,
        padding: 10,
    },
});
