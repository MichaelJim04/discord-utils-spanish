# Haciendo el Setup
Primero que todo, deberemos iniciar el modulo en nuestro proyecto a usar
```js
const { mongoConnect, messages } = require("discord-utils-spanish");
```
Despues de definir esto, usaremos la funcion de `mongoConnect` para conectar con MongoDB donde guardaremos todos estos datos.
```js
mongoConnect("mongodb://...");
```
Nota: **Este proceso solo se hace una vez en todo el proyecto**

## Notas

- Estos ejemplos se basan asumiendo que tu `Discord.js Client` esta definido como `client`
- Aqui estamos basandonos en <a href="https://www.npmjs.com/package/discord.js">Discord.js v13</a> por lo cual factores como lo son `client.on("messageCreate", async(message)...` deben ser reemplazados por `client.on("message", async(message)...` si estas usando Discord.js v12
- Todas las funciones del NPM devuelven una promesa por lo tanto deben usarse en codigos asincronicas. Usando `await`

## Metodos y/o Funciones ✏️

- **addMessages**

Agrega una cantidad de mensajes a un usuario

```js
messages.addMessages(<GuildID - String>, <UserID - String>, <Amount - Number>)
```
- Salida

```cli
Promise<Boolean>
```


- **removeMessages**

Remueve una cantidad de mensajes a un usuario

```js
messages.removeMessages(<GuildID - String>, <UserID - String>, <Amount - Number>)
```
- Salida

```cli
Promise<Boolean>
```


- **setMessages**

Setea la cantidad de mensajes a un usuario

```js
messages.setMessages(<GuildID - String>, <UserID - String>, <Amount - Number>)
```
- Salida

```cli
Promise<Boolean>
```


- **deleteUserData**

Borra los datos de un usuario en la db si este existe

```js
messages.deleteUserData(<GuildID - String>, <UserID - String>)
```
- Salida

```cli
Promise<Boolean>
```


- **deleteGuildData**

Borra los datos de un servidor en la db si este existe

```js
messages.deleteGuildData(<GuildID - String>)
```
- Salida

```cli
Promise<Boolean>
```

- **fetchUser**

Obtiene la informacion de un usuario en la db

```js
messages.fetchUser(<GuildID - String>, <UserID - String>)
```
- Salida

```cli
Promise<Boolean/Object>
```

- **fetchLeaderboard**

Obtiene la informacion de todos los usuarios en un servidor de forma descendente de acuerdo a su cantidad de mensajes actual

```js
messages.fetchLeaderboard(<CLient - Discord.js Client>, <GuildID - String>)
```
- Salida

```cli
Promise<Array>
```

# Ejemplos y Usos

Asumiendo que ya se ha hecho el Setup anteriormente procedemos a iniciar con el sistema de mensajes

- **Iniciando el trackeo de mensajes**

```js
client.on("messageCreate", async (message) => { // Abrimos el evento de "messageCreate" en este caso
  if (!message.guild) return; // Si el mensaje no se ha enviado desde un servidor, se ignora
  if (message.author.bot) return; // Si el autor del mensaje es un bot, se ignora
    
  messages.addMessages(message.guild.id, message.author.id, 1) //Aqui se agrega 1 mensaje al enviar este
}); //Se cierra el evento
```

- **Obteniendo los mensajes y la posicion del usuario en el servidor**

```js
const user = message.mentions.users.first() || message.author; // Definimos el usuario a buscar los datos

const userData = await messages.fetchUser(message.guild.id, user.id); // Buscamos los datos del usuario en la db

if(!user) return message.reply({ content: 'No tengo registrado mensajes del usuario en el servidor :(' })  // Si no se encuentra informacion sobre el usuario se retorna que no se ha encontrado este

message.reply({ content: `${user.tag} tiene ${userData.messages} en el servidor y se encuentra en la posicion ${userData.position}` }) //Se regresa los mensajes y la posicion del usuario en el servidor
```

- **Comando de Leaderboard**

```js
const leaderboard = await messages.fetchLeaderboard(client, message.guild.id) // Obtenemos informacion de la leaderboard

if(leaderboard.length < 1) message.reply({ content: 'No he encontrado mensajes registrados de ningun miembro en el servidor' }) // Si no ha encontrado informacion en la db retornara que no se ha podido encontrar

const leaderboardUsers = leaderboard.slice(0, 15).map(data => `${data.position}. ${data.user.tag} | Mensajes: \`${data.messages.toLocaleString()}\``).join('\n') // Mapeamos la leaderboard para obtener la informacion de los usuarios

message.reply({ content: `**Leaderboard de Mensajes en ${message.guild.name}**\n\n${leaderboardUsers}` }) //Regresamos la leaderboard con los usuarios con mas mensajes
```

Todos estos ejemplos son para guiarte en como puedes usar estas caracteristicas y funciones. De resto depende de ti y tu creatividad de usar estos datos como gustes 👍
