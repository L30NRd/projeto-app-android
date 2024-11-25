import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, Image, View, ScrollView, Button, TextInput, Alert } from 'react-native';

const BASE_URL = 'http://192.168.3.5:3000';

export default function Arcade({ route }) {
  const [activeTab, setActiveTab] = useState('Status');
  const [characterName, setCharacterName] = useState('Nome');
  const [newCharName, setNewCharName] = useState('');
  const [statusBars, setStatusBars] = useState([]);
  const [text1, setText1] = useState('');
  const [newTxt1, setNewTxt1] = useState('');
  const [text2, setText2] = useState('');
  const [newTxt2, setNewTxt2] = useState('');
  const [text3, setText3] = useState('');
  const [newTxt3, setNewTxt3] = useState('');
  const [roomId, setRoomId] = useState(null); // Estado para armazenar o ID da sala
  

  useEffect(() => {
    const fetchRoomInfo = async () => {
      try {
        // Mudando a URL para buscar pela sala com um identificador único (ex: nome)
        const response = await fetch(`${BASE_URL}/salaArcade`);
        const data = await response.json();
        
        // Supondo que a sala seja a primeira na lista ou usando algum critério específico
        const room = data[0]; // Modificar conforme a lógica para determinar a sala
        setRoomId(room.id); // Armazenando o ID da sala
        setCharacterName(room.nome || 'Nome');
        setText1(room.texto1 || '');
        setText2(room.texto2 || '');
        setText3(room.texto3 || '');
        
        const bars = [
          { id: 1, name: room.barra1Nome || 'barra1', value: room.barra1, maxValue: room.barra1MAX},
          { id: 2, name: room.barra2Nome || 'barra2', value: room.barra2, maxValue: room.barra2MAX},
          { id: 3, name: room.barra3Nome || 'barra3', value: room.barra3, maxValue: room.barra3MAX},
          { id: 4, name: room.barra4Nome || 'barra4', value: room.barra4, maxValue: room.barra4MAX}
        ];
        
        setStatusBars(bars);
      } catch (error) {
        console.error('Erro ao buscar dados da sala:', error);
        Alert.alert('Erro ao buscar dados da sala.');
      }
    };

    fetchRoomInfo();
  }, []); // Remover a dependência de `route.params.id`

  const updateBarValue = (index, change) => {
    setStatusBars(prevBars => {
      const updatedBars = [...prevBars];
      const bar = updatedBars[index];
      const newValue = bar.value + change;
      bar.value = Math.min(Math.max(0, newValue), bar.maxValue);  // Limita entre 0 e o valor máximo
  
      fetch(`${BASE_URL}/salaArcade/${roomId}/barra${bar.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: bar.value }),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Erro ao salvar o valor da barra');
          }
        })
        .catch(error => {
          console.error('Erro ao salvar o valor da barra:', error);
          Alert.alert('Erro ao salvar o valor da barra');
        });
  
      return updatedBars;
    });
  };

  const addBar = () => {
    if (statusBars.length < 4) {
      const newBar = {
        id: statusBars.length + 1,
        name: `Barra ${statusBars.length + 1}`,
        value: 20,
        maxValue: 20,
      };
      setStatusBars(prevBars => [...prevBars, newBar]);
    }
  };

  const removeBar = () => {
    if (statusBars.length > 1) {
      setStatusBars(prevBars => prevBars.slice(0, -1));
    }
  };
  const updateMaxBarValue = (index, change) => {
    setStatusBars(prevBars => {
      const updatedBars = [...prevBars];
      const bar = updatedBars[index];
      
      // Calcula o novo valor máximo sem cair abaixo de 1
      const newMaxValue = Math.max(1, bar.maxValue + change);
      
      // Se o valor máximo for menor que o valor atual, ajusta o valor atual
      if (newMaxValue < bar.value) {
        bar.value = newMaxValue;
      }
      
      bar.maxValue = newMaxValue;
      
      // Chama a função de atualização do backend para os valores da barra
      updateBarValues(bar.id, bar.value, bar.maxValue); 
      
      return updatedBars;
    });
  };

  const updateBarValues = async (barId, value, maxValue) => {
    try {
      const response = await fetch(`${BASE_URL}/salaArcade/${roomId}/barra${barId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          value: value,
          maxValue: maxValue,
        }),
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log('Bar values updated successfully:', result);
      } else {
        const result = await response.json();
        console.log('Error updating bar values:', result);
      }
    } catch (error) {
      console.error('Error updating bar values:', error);
    }
  };

  const saveRoomInfo = async () => {
    try {
      // Atualiza o valor das barras se o valor atual for maior que o máximo
      const updatedBars = statusBars.map(bar => {
        const updatedValue = bar.value > bar.maxValue ? bar.maxValue : bar.value;
        return { ...bar, value: updatedValue };
      });
  
      const roomData = {
        nome: newCharName.trim() !== '' ? newCharName : characterName,
        texto1: newTxt1.trim() !== '' ? newTxt1 : text1,  // Salvando o texto1
        texto2: newTxt2.trim() !== '' ? newTxt2 : text2,  // Salvando o texto2
        texto3: newTxt3.trim() !== '' ? newTxt3 : text3,  // Salvando o texto3
        barras: updatedBars.map(bar => ({
          id: bar.id,
          nome: bar.name,
          valorAtual: bar.value,
          valorMaximo: bar.maxValue,
        })),
      };
  
      const response = await fetch(`${BASE_URL}/salaArcade/${roomId}/salvarInformacoes`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roomData),
      });
  
      if (!response.ok) {
        throw new Error('Erro ao salvar as informações da sala.');
      }
  
      Alert.alert('Informações salvas com sucesso!');
      
      // Adicionando a mudança para a aba 'Status' após o sucesso
      setActiveTab('Status');
    } catch (error) {
      console.error('Erro ao salvar as informações da sala:', error);
      Alert.alert('Erro ao salvar as informações da sala.');
    }
  };
  


  const renderStatusBarView = (bar, index) => {
    const barWidth = (bar.value / bar.maxValue) * 100;

    return (
      <View key={bar.id} style={styles.barContainer}>
        <Text style={styles.barText}>{bar.name}: {bar.value}/{bar.maxValue}</Text>
        <View style={styles.buttonsContainer}>
          <Button title="-5" onPress={() => updateBarValue(index, -5)} />
          <Button title="-1" onPress={() => updateBarValue(index, -1)} />
          <View style={styles.barBackView}>
            <View style={[styles.barForeground, { width: `${barWidth}%` }]} />
          </View>
          <Button title="+1" onPress={() => updateBarValue(index, 1)} />
          <Button title="+5" onPress={() => updateBarValue(index, 5)} />
        </View>
      </View>
    );
  };

  const renderMaxStatusBarView = (bar, index) => {
    const barWidth = (bar.value / bar.maxValue) * 100;

    const updateBarName = (index, newName) => {
      setStatusBars(prevBars => {
        const updatedBars = [...prevBars];
        updatedBars[index].name = newName; // Atualiza o nome da barra com o novo valor
        return updatedBars;
      });
    };

    return (
      <View key={bar.id} style={styles.barContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite o nome da barra"
          value={bar.name}
          onChangeText={(newName) => updateBarName(index, newName)} // Atualiza o nome da barra
        />
       <Text style={styles.barText}> {bar.value}/{bar.maxValue}</Text>
        <View style={styles.buttonsContainer}>
          <Button title="-5" onPress={() => updateMaxBarValue(index, -5)} />
          <Button title="-1" onPress={() => updateMaxBarValue(index, -1)} />
          <View style={styles.barBackView}>
            <View style={[styles.barForeground, { width: `${barWidth}%` }]} />
          </View>
          <Button title="+1" onPress={() => updateMaxBarValue(index, 1)} />
          <Button title="+5" onPress={() => updateMaxBarValue(index, 5)} />
        </View>
      </View>
    );
  };

  const alterarTexto = () => {

  }

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

      <View style={styles.tabContainer}>
        <Button title="Status" onPress={() => setActiveTab('Status')} />
        <Button title="Edição" onPress={() => setActiveTab('Edição')} />
      </View>

      {activeTab === 'Status' && (
        <ScrollView style={styles.caixageral}>
          <Text style={styles.characterName}>{characterName}</Text>
          {statusBars.map(renderStatusBarView)}
          <Text style={styles.textoStatus}>{text1}</Text>
          <Text style={styles.textoStatus}>{text2}</Text>
          <Text style={styles.textoStatus}>{text3}</Text>
        </ScrollView>
      )}

      {activeTab === 'Edição' && (
        <ScrollView style={styles.caixageral}>
          <TextInput
            style={styles.input}
            placeholder="Digite o nome do personagem"
            value={newCharName}
            onChangeText={setNewCharName}
          />
          {statusBars.map(renderMaxStatusBarView)}
          <Text style={styles.txtdefault}>Digite a história aqui!</Text>
          <TextInput
            style={styles.longinput}
            placeholder="Digite a história aqui!"
            value={newTxt1}
            onChangeText={setNewTxt1}
          />
          <Text style={styles.txtdefault}>Digite as habilidades aqui!</Text>
          <TextInput
            style={styles.longinput}
            placeholder="Digite as habilidades aqui!"
            value={newTxt2}
            onChangeText={setNewTxt2}
          />
          <Text style={styles.txtdefault}>Digite suas anotações aqui!</Text>
          <TextInput
            style={styles.longinput}
            placeholder="Digite suas anotações aqui!"
            value={newTxt3}
            onChangeText={setNewTxt3}
          />
          <Button title="Salvar" onPress={saveRoomInfo} />

        </ScrollView>
      )}
    </ScrollView>
  );
  
}

const styles = StyleSheet.create({
  fundo: {
    backgroundColor: '#303030',
    minHeight: '100%',
  },
  mid: {
    backgroundColor: '#303030',
    minHeight: '100%',
    padding: 20,
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
  logobox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logo: {
    width: 30,
    height: 30,
    alignSelf: 'center',
  },
  txtdefault: {
    color: '#cdcdcd',
    alignSelf: 'center',
    fontSize: 16,
  },
  characterContainer: {
    alignItems: 'center',
    padding: 10,
  },
  characterName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'lightgreen',
  },
  barContainer: {
    marginVertical: 10,
  },
  barText: {
    color: '#FFF',
    fontSize: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  botoes: {
    height:'10',
  },
  barBackView: {
    backgroundColor: '#666',
    height: 15,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    width: 'auto',
    alignSelf: 'center',
    justifyContent:'center',
  },
  barForeground: {
    backgroundColor: '#ff0000',
    height: '100%',
    borderRadius: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 15,
  },
  input: {
    backgroundColor: '#A0A0A0',
    padding: 8,
    marginVertical: 10,
    borderRadius: 5,
  },
  longinput: {
    backgroundColor: '#A0A0A0',
    padding: 8,
    marginVertical: 10,
    borderRadius: 5,
    height:150,
  },
  caixageral: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#404040',
  },
  titulo: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
  },
  botaoBarra: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textoStatus: {
    color: 'black',
    fontSize: 16,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#A0A0A0',
    borderBottomWidth: 2,
    borderColor: 'gold',
    borderRadius: 5,
  }
});