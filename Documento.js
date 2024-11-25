import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, Image, TextInput, Button, View, ScrollView, Switch, Alert } from 'react-native';

export default function TemplateTeste({ route }) {
  const [twodoc, setTwodoc] = useState(true);
  const toggleSwitch = () => setTwodoc(previousState => !previousState);
  const { salaId, salaNome } = route.params;
  const [content1, setContent1] = useState('');
  const [content2, setContent2] = useState('');
  const [enviar, setEnviar] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [tamimp, setTamimp] = useState(40);

  // Buscar conteúdo salvo ao carregar a tela
  useEffect(() => {
    fetch(`http://192.168.3.5:3000/salasDocs/${salaId}`)
      .then(response => {
        if (response.ok) {
          return response.json(); // Se a resposta for válida, tenta convertê-la para JSON
        } else {
          throw new Error('Erro ao buscar dados do servidor');
        }
      })
      .then(data => {
        if (data.texto1) setContent1(data.texto1);
        if (data.texto2) {
          setContent2(data.texto2);
          setTwodoc(true);  // Ativa o switch se content2 existir
        } else {
          setTwodoc(false); // Desativa o switch se content2 estiver vazio
        }
        console.log("Dados carregados:", data); // Verifique os dados recebidos
      })
      .catch(error => {
        console.error('Erro ao buscar textos:', error);
        Alert.alert("Erro", "Não foi possível carregar os dados.");
      });
  }, [salaId]);
  
  const envcont = () => {
    if (content1.trim() !== '') {
      if (content1 || (twodoc && content2)) {
        if(content2.trim() === ''){
          setTwodoc(false);
        }
        setEnviar(true);
        setIsEditing(false);
  
        // Enviando os dados para o backend
        fetch(`http://192.168.3.5:3000/salasDocs/${salaId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            texto1: content1,
            texto2: twodoc ? content2 : '',  // Envia content2 apenas se twodoc for true
          }),
        })
        .then(response => response.json())
        .then(data => {
          console.log("Dados enviados com sucesso:", data);
          Alert.alert("Sucesso", "Conteúdo enviado com sucesso!");
        })
        .catch(error => {
          console.error('Erro ao enviar conteúdo:', error);
          Alert.alert("Erro", "Não foi possível enviar o conteúdo.");
        });
  
      } else {
        Alert.alert("Erro", "Impossível enviar conteúdo em branco");
      }
    } else {
      Alert.alert("Erro", "O conteúdo 1 não pode estar vazio");
    }
  };
  
  const editarCont = () => {
    setIsEditing(true);
    setEnviar(false);
  };

  return (
    <ScrollView style={styles.fundo}>
      <View style={styles.headline}>
        <View style={styles.logobox}>
          <Image style={styles.logo} source={require('../assets/logo.png')} />
        </View>
        <View style={styles.logobox}>
          <Text style={styles.txtdefault}>Você está na tela de Documentação</Text>
        </View>
      </View>
  
      <View style={styles.borda}>
        <Text style={styles.titulo}>Bem vindo à {salaNome}</Text>
        <View style={styles.imgTop}>
          <Image source={require('../assets/imgTopPlaceH.png')} />
        </View>
      </View>
  
      <View style={styles.centro}>
        <Text style={{ color: 'white', fontSize: 15, justifyContent: 'center'}}>marque para ter anotações temporarias: </Text>
          <Switch
            trackColor={{ false: 'black', true: '#f2f2f2' }}
            thumbColor={twodoc ? '#ff9900' : 'gray'}
            onValueChange={toggleSwitch}
            value={twodoc}
            disabled={enviar && content2 === ''}
          />
      </View>
  
      <View>
        <View style={styles.borda1}>
          <View style={twodoc ? styles.docs : styles.docs1}>
            {enviar && !isEditing ? (
              <>
                <View style={styles.block}>
                  <Text>{content1}</Text>
                </View>
                {twodoc && content2 && ( 
                  <View style={styles.borda2}>
                    <View style={styles.block}>
                      <View style={styles.linha}></View>
                      <Text>{content2}</Text>
                    </View>
                  </View>
                )}
              </>
            ) : (
              <>
                <View style={styles.block}>
                  <TextInput
                    style={[styles.input, { height: Math.max(40, tamimp) }]}
                    value={content1}
                    onChangeText={setContent1}
                    multiline={true}
                    placeholder="Digite o conteúdo "
                    onContentSizeChange={(event) =>
                      setTamimp(event.nativeEvent.contentSize.height)
                    }
                  />
                </View>
                {twodoc && (
                  <View style={styles.borda2}>
                    <View style={styles.block}>
                      <View style={styles.linha}></View>
                      <TextInput
                        style={[styles.input, { height: Math.max(40, tamimp) }]}
                        value={content2}
                        onChangeText={setContent2}
                        multiline={true}
                        placeholder="sua anotação temporaria"
                        onContentSizeChange={(event) =>
                          setTamimp(event.nativeEvent.contentSize.height)
                        }
                      />
                    </View>
                  </View>
                )}
              </>
            )}
          </View>

          <View style={styles.containbutao}>
            <Button
              style={styles.botaodown}
              title="Enviar Conteúdo"
              onPress={envcont}
              width="25%"
              color="#ff9900"
            />
            <Button
              style={styles.botaodown}
              title="Editar Conteúdo"
              onPress={editarCont}
              width="25%"
              color="#146eb4"
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  fundo: {
    backgroundColor: '#303030',
    minHeight: '100%',
  },
  titulo: {
    fontWeight: 'bold',
    paddingTop: 10,
    fontSize: 18,
    color: '#f2f2f2',
  },
  block: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    width: '100%',
    height: 'auto',
    borderWidth: 1,
    padding: 5,
  },
  borda: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#232f3e',
  },
  borda1: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#232f3e',
  },
  borda2:{
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#232f3e',
    borderRadius: 8,
    borderTopEndRadius: 0,
    borderTopStartRadius: 0,
  },
  imgTop: {
    flex: 1,
    alignItems: 'center',
    width: '97%',
    margin: '3%',
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    borderBottomEndRadius: 0,
    borderBottomStartRadius: 0,
    borderWidth: 1,
  },
  centro:{
    alignContent: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#232f3e',
    padding: 10,
    justifyContent: 'center',
  },
  docs: {
    flex: 1,
    alignItems: 'center',
    width: '97%',
    margin: '3%',
    backgroundColor: '#f2f2f2',
    borderRadius: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  docs1: {
    flex: 1,
    alignItems: 'center',
    width: '97%',
    margin: '3%',
    backgroundColor: '#f2f2f2',
    borderRadius: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  linha: {
    width: '5%',
    backgroundColor: '#232f3e',
  },
  input: {
    backgroundColor: '#f2f2f2',
    marginBottom: 10,
    padding: 5,
    height: 'auto',
  },
  containbutao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
  },
  botaodown: {
    width: '30%',
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