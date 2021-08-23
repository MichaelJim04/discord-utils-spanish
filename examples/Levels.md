# Haciendo el Setup
Primero que todo, deberemos iniciar el modulo en nuestro proyecto a usar
```js
const { mongoConnect, levels } = require("discord-utils-spanish");
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

- **addXP**

Agrega una cantidad de XP a un usuario. Este es versatil, ya que en el mismo proceso calcula el nivel de acuerdo al XP que ya se ha agregado, y devuelve `true` o `false` dependiendo si el usuario ha subido de nivel o no

```js
levels.addXP(<GuildID - String>, <UserID - String>, <Amount - Number>)
```
- Salida

```cli
Promise<Boolean>
```


- **addLevel**

Añade una cantidad de niveles a un usuario

```js
levels.addLevel(<GuildID - String>, <UserID - String>, <Amount - Number>)
```
- Salida

```cli
Promise<Boolean>
```


- **removeXP**

Remueve una cantidad de XP a un usuario. Este igual que la funcion de `addXP` calcula el nivel de acuerdo al XP ya agregado

```js
levels.removeXP(<GuildID - String>, <UserID - String>, <Amount - Number>)
```
- Salida

```cli
Promise<Boolean>
```


- **setXP**

Setea la cantidad de XP a un usuario. Esta funcion tambien calcula el nivel de acuerdo al XP a setear

```js
levels.setXP(<GuildID - String>, <UserID - String>, <Amount - Number>)
```
- Salida

```cli
Promise<Boolean>
```


- **deleteUserData**

Borra los datos de un usuario en la db si este existe

```js
levels.deleteUserData(<GuildID - String>, <UserID - String>)
```
- Salida

```cli
Promise<Boolean>
```


- **deleteGuildData**

Borra los datos de un servidor en la db si este existe

```js
levels.deleteGuildData(<GuildID - String>)
```
- Salida

```cli
Promise<Boolean>
```

- **fetchUser**

Obtiene la informacion de un usuario en la db

```js
levels.fetchUser(<GuildID - String>, <UserID - String>)
```
- Salida

```cli
Promise<Boolean/Object>
```

- **fetchLeaderboard**

Obtiene la informacion de todos los usuarios en un servidor de forma descendente de acuerdo a su XP actual

```js
levels.fetchLeaderboard(<CLient - Discord.js Client>, <GuildID - String>)
```
- Salida

```cli
Promise<Array>
```

- **xpNeedFor**

Calcula el XP necesario para un nivel en especifico

```js
levels.xpNeedFor(<Level - Number>)
```
- Salida

```cli
Number
```

# Ejemplos y Usos

Asumiendo que ya se ha hecho el Setup anteriormente procedemos a iniciar con el sistema de XP 

- **Iniciando el trackeo de XP**

```js
client.on("messageCreate", async (message) => { // Abrimos el evento de "messageCreate" en este caso
  if (!message.guild) return; // Si el mensaje no se ha enviado desde un servidor, se ignora
  if (message.author.bot) return; // Si el autor del mensaje es un bot, se ignora
  
  let xpAdd = Math.floor(Math.random() * 29) + 1; // Aqui se agregara una cantidad de XP random que puede ser de 1 a 30 como maximo

  let levelUp = await levels.addXP(message.guild.id, message.author.id, xpAdd) // Aqui agregamos la cantidad de XP random al usuario

  if(levelUp) { // Recordemos que el metodo `addXP` regresa un boolean dependiendo si el usuario sube o no de nivel, en este caso si llega a surbir de nivel se abre una condicion
    const userData = await levels.fetchUser(message.guild.id, message.author.id) // Obtenemos la informacion del usuario
    message.reply({ content: `GG ${message.author}! Has subido al nivel **${userData.level}**. Sigue asi!`}) // Enviamos el mensaje avisando que ha subido de nivel
  } // Cerramos condicion
}); // Se cierra el evento
```

- **Obteniendo los niveles, el XP y la posicion del usuario en el servidor**

```js
const user = message.mentions.users.first() || message.author; // Definimos el usuario a buscar los datos

const userData = await levels.fetchUser(message.guild.id, user.id); // Buscamos los datos del usuario en la db

if(!user) return message.reply({ content: 'No tengo registrado XP del usuario en el servidor :(' })  // Si no se encuentra informacion sobre el usuario se retorna que no se ha encontrado este

message.reply({ content: `${user.tag} tiene **${userData.xp} XP**, **nivel ${userData.level}** en el servidor y se encuentra en la posicion ${userData.position}` }) //Se regresa los datos de XP y nivel junto con la posicion del usuario en el servidor
```

- **Comando de Leaderboard**

```js
const leaderboard = await levels.fetchLeaderboard(client, message.guild.id) // Obtenemos informacion de la leaderboard

if(leaderboard.length < 1) message.reply({ content: 'No he encontrado XP registrado de ningun miembro en el servidor' }) // Si no ha encontrado informacion en la db retornara que no se ha podido encotrar

const leaderboardUsers = leaderboard.slice(0, 15).map(data => `${data.position}. ${data.user.tag} | XP: \`${data.xp.toLocaleString()}/${levels.xpNeedFor(data.level + 1).toLocaleString()}\` | Nivel: \`${data.level}\``).join('\n') // Mapeamos la leaderboard para obtener la informacion de los usuarios

message.reply({ content: `**Leaderboard de XP en ${message.guild.name}**\n\n${leaderboardUsers}` }) //Regresamos la leaderboard con los usuarios con mas XP y nivel en el servidor
```

- **Ejemplo de RankCard con Canvacord**

Aqui explicaremos como se puede usar los datos del sistema de XP para hacer una RankCard usando <a href="https://www.npmjs.com/package/canvacord">Canvacord</a>. Previamente debemos haberlo instalado usando `npm install canvacord`

```js
const { Rank } = require('canvacord') //Definimos el constructor para hacer la RankCard

const user = message.mentions.users.first() || message.author; // Definimos el usuario a buscar los datos

const userData = await levels.fetchUser(message.guild.id, user.id); // Buscamos los datos del usuario en la db

if(!user) return message.reply({ content: 'No tengo registrado XP del usuario en el servidor :(' })  // Si no se encuentra informacion sobre el usuario se retorna que no se ha encontrado este

const rank = new Rank() // Definimos 'rank' como un nuevo constructor para la RankCard del usuario
.setAvatar(user.displayAvatarURL({ format: 'png', size: 512 })) // Seteamos el avatar del usuario
.setCurrentXP(userData.xp) // Seteamos el XP actual del usuario
.setRequiredXP(parseInt(levels.xpNeedFor(userData.level + 1))) // Seteamos la XP requerida para que el usuario pase al siguiente nivel
.setRank(userData.position) // Seteamos la posicion del usuario en el servidor
.setLevel(userData.level) // Seteamos el nivel del usuario
.setProgressBar("#00FFFF", "COLOR") // Seteamos el color de la barra de XP. Esta es personalizable
.setUsername(user.username) // Seteamos el username 
.setDiscriminator(user.discriminator); // Y seteamos el dicriminator del usuario

const dataRank = await rank.build() // Por ultimo obtenemos el buffer de la RankCard ya hecha

const attachment = new MessageAttachment(dataRank, 'rank.png') // La pasamos a un Attachment de Discord

message.reply({ files: [attachment] }) // Y la enviamos
```

Todos estos ejemplos son para guiarte en como puedes usar estas caracteristicas y funciones. De resto depende de ti y tu creatividad de usar estos datos como gustes 👍