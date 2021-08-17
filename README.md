<div align="center">
  <h1>discord-utils-spanish</h1>
  <p>
    <a href="https://www.npmjs.com/package/discord-utils-spanish"><img src="https://img.shields.io/npm/v/discord-utils-spanish?maxAge=3600" alt="NPM version" /></a>
    <a href="https://www.npmjs.com/package/discord-utils-spanish"><img src="https://img.shields.io/npm/dt/discord-utils-spanish?maxAge=3600" alt="NPM downloads" /></a>
  </p>
  <p>
    <a href="https://www.npmjs.com/package/discord-utils-spanish"><img src="https://nodei.co/npm/discord-utils-spanish.png?downloads=true&stars=true" alt="NPM Banner"></a>
  </p>
</div>

## Que es **discord-utils-spanish**
- Un NPM Multiproposito que tiene Funciones y Caracteristicas para Entretener e Implementarlas en tu Bot de Discord!

## Caracteristicas (En progreso 🛠️)
- **Messages Tracker con MongoDB**

## Instala el package 📥
```cli
npm install discord-utils-spanish
```

## Setup Basico 📚

- **Messages Tracker**

```js
const { mongoConnect, messages } = require('discord-utils-spanish') 

mongoConnect("mongodb://...") //Aqui enlazamos con la url de nuestra db de MongoDB
/* 
  * Necesitas crear un cluster con MongoDB para usar esta caracteristica
  * Aqui enlazamos con la url de nuestra db de MongoDB
  * Este proceso solo se hace 1 vez
*/
```

## Metodos y/o Funciones ✏️

- **addMessages**

```js
messages.addMessages(<GuildID - String>, <UserID - String>, <Amount - Number>)
```
- Salida

```cli
Promise<Boolean>
```


- **removeMessages**

```js
messages.removeMessages(<GuildID - String>, <UserID - String>, <Amount - Number>)
```
- Salida

```cli
Promise<Boolean>
```


- **setMessages**

```js
messages.setMessages(<GuildID - String>, <UserID - String>, <Amount - Number>)
```
- Salida

```cli
Promise<Boolean>
```


- **deleteUserData**

```js
messages.deleteUserData(<GuildID - String>, <UserID - String>)
```
- Salida

```cli
Promise<Boolean>
```


- **deleteGuildData**

```js
messages.deleteGuildData(<GuildID - String>)
```
- Salida

```cli
Promise<Boolean>
```

- **fetchUser**

```js
messages.fetchUser(<GuildID - String>, <UserID - String>)
```
- Salida

```cli
Promise<Boolean/Object>
```

- **fetchLeaderboard**

```js
messages.fetchLeaderboard(<CLient - Discord.js Client>, <GuildID - String>)
```
- Salida

```cli
Promise<Array>
```


## Informacion 🤝
- Este package esta en desarrollo, por lo cual esta constantemente actualizandose
- Si encuentras algun error o bug puedes informar de el en nuestro **[Servidor de Discord](https://discord.gg/8yEY9AXz74)**.

## Necesitas Soporte o Ayuda ❔
<div aling="center">
	<p>
		<a href="https://discord.gg/8yEY9AXz74"><img src="https://invidget.switchblade.xyz/8yEY9AXz74"/></a>
	</p>
</div>
