import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './components/login'; 
import PagPrinc from './components/PagPrinc'; 
import SalaTemplate from './components/Documento';
import ArcadeSala from './components/ArcadeSala';
import Criaconta from './components/Criaconta';
import Contas from './components/contas'
import SalaGM from './components/salaGM';
import SalaPC from './components/salaPC';

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="login">
        <Stack.Group screenOptions={{headerSown:false}}>
          <Stack.Screen name="Login" component={Login} />

          <Stack.Screen name="PagPrinc" component={PagPrinc} />
          <Stack.Screen name="salaGM" component={SalaGM} />
          <Stack.Screen name="salaPC" component={SalaPC} />

          <Stack.Screen name="Documento" component={SalaTemplate} 
          options={({ route }) => ({ title: `Sala ${route.params.salaNome}` })} />
          <Stack.Screen name="ArcadeSala" component={ArcadeSala} 
          options={({ route }) => ({ title: `Sala ${route.params.salaNome}` })} />
          <Stack.Screen name="Criaconta" component={Criaconta} />
          <Stack.Screen name="contas" component={Contas} />

        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}