const mongoose = require('mongoose')
const db = require('../models/messages.js')
const { Client } = require('discord.js')

module.exports = {

    /**
     * @param {guildID} [string] - La ID del servidor
     * @param {userID} [string] - La ID del usuario
     * @param {amount} [number] - La cantidad de mensajes a agregar
     */

    addMessages: async(guildID, userID, amount) => {
        if(!guildID) throw new TypeError("No se ha introducido la ID del servidor");
        if(!userID) throw new TypeError("No se ha introducido la ID del usuario");
        if(!amount) throw new TypeError("No se ha introducido la cantidad de mensajes a agregar");
        if(!/^[0-9]{18}$/gm.test(guildID)) throw new TypeError("Se ha introducido una ID de servidor invalida");
        if(!/^[0-9]{18}$/gm.test(userID)) throw new TypeError("Se ha introducido una ID de usuario invalida");
        if(amount == 0 || !amount || isNaN(parseInt(amount))) throw new TypeError("Se ha introducido una cantidad de mensajes invalida");

        const user = await db.findOne({ userID: userID, guildID: guildID });

        if(!user) {
            const userNew = new db({
                userID: userID,
                guildID: guildID,
                messages: parseInt(amount)
            })

            userNew.save().catch(err => console.log(`Ha ocurrido un error registrando a un nuevo usuario: ${err}`))

            return true;
        }

        user.messages += parseInt(amount);

        user.save().catch(err => console.log(`Hubo un error agregando mensajes a un usuario: ${err}`))

        return true;
    },
    
    /**
     * @param {guildID} [string] - La ID del servidor
     * @param {userID} [string] - La ID del usuario
     * @param {amount} [number] - La cantidad de mensajes a remover
     */

    removeMessages: async(guildID, userID, amount) => {
        if(!guildID) throw new TypeError("No se ha introducido la ID del servidor");
        if(!userID) throw new TypeError("No se ha introducido la ID del usuario");
        if(!amount) throw new TypeError("No se ha introducido la cantidad de mensajes a remover");
        if(!/^[0-9]{18}$/gm.test(guildID)) throw new TypeError("Se ha introducido una ID de servidor invalida");
        if(!/^[0-9]{18}$/gm.test(userID)) throw new TypeError("Se ha introducido una ID de usuario invalida");
        if(amount == 0 || !amount || isNaN(parseInt(amount))) throw new TypeError("Se ha introducido una cantidad de mensajes invalida");

        const user = await db.findOne({ userID: userID, guildID: guildID });

        if(!user) return false;

        if(user.messages < amount) return false;

        user.messages -= parseInt(amount);;

        user.save().catch(err => console.log(`Hubo un error removiendo mensajes a un usuario: ${err}`))

        return true;
    },

    /**
     * @param {guildID} [string] - La ID del servidor
     * @param {userID} [string] - La ID del usuario
     * @param {amount} [number] - La cantidad de mensajes a setear
     */

    setMessages: async(guildID, userID, amount) => {
        if(!guildID) throw new TypeError("No se ha introducido la ID del servidor");
        if(!userID) throw new TypeError("No se ha introducido la ID del usuario");
        if(!amount) throw new TypeError("No se ha introducido la cantidad de mensajes a setear");
        if(!/^[0-9]{18}$/gm.test(guildID)) throw new TypeError("Se ha introducido una ID de servidor invalida");
        if(!/^[0-9]{18}$/gm.test(userID)) throw new TypeError("Se ha introducido una ID de usuario invalida");
        if(amount == 0 || !amount || isNaN(parseInt(amount))) throw new TypeError("Se ha introducido una cantidad de mensajes invalida");

        const user = await db.findOne({ userID: userID, guildID: guildID });

        if(!user) {
            const userNew = new db({
                userID: userID,
                guildID: guildID,
                messages: parseInt(amount)
            })

            userNew.save().catch(err => console.log(`Ha ocurrido un error registrando a un nuevo usuario: ${err}`))

            return true;
        }

        user.messages = parseInt(amount);

        user.save().catch(err => console.log(`Hubo un error seteando mensajes a un usuario: ${err}`))

        return true;
    },

    /**
     * @param {guildID} [string] - La ID del servidor
     * @param {userID} [string] - La ID del usuario
     */

    deleteUserData: async(guildID, userID) => {
        if(!guildID) throw new TypeError("No se ha introducido la ID del servidor");
        if(!userID) throw new TypeError("No se ha introducido la ID del usuario");
        if(!/^[0-9]{18}$/gm.test(guildID)) throw new TypeError("Se ha introducido una ID de servidor invalida");
        if(!/^[0-9]{18}$/gm.test(userID)) throw new TypeError("Se ha introducido una ID de usuario invalida");

        const user = await db.findOne({ userID: userID, guildID: guildID });

        if(!user) return false;

        await db.findOneAndDelete({ userID: userID, guildID: guildID });

        return true;
    },

    /**
     * @param {guildID} [string] - La ID del servidor
     */

    deleteGuildData: async(guildID) => {
        if(!guildID) throw new TypeError("No se ha introducido la ID del servidor");
        if(!/^[0-9]{18}$/gm.test(guildID)) throw new TypeError("Se ha introducido una ID de servidor invalida");

        await db.deleteMany({ guildID: guildId }).catch(err => console.log(`Hubo un error eliminando los datos de mensajes en un servidor: ${err}`));

        return true;
    },

    /**
     * @param {guildID} [string] - La ID del servidor
     * @param {userID} [string] - La ID del usuario
     */

    fetchUser: async(guildID, userID) => {
        if(!guildID) throw new TypeError("No se ha introducido la ID del servidor");
        if(!userID) throw new TypeError("No se ha introducido la ID del usuario");
        if(!/^[0-9]{18}$/gm.test(guildID)) throw new TypeError("Se ha introducido una ID de servidor invalida");
        if(!/^[0-9]{18}$/gm.test(userID)) throw new TypeError("Se ha introducido una ID de usuario invalida");

        const user = await db.findOne({ userID: userID, guildID: guildID });

        if(!user) return false;

        const leaderboard = await db.find({ guildID: guildID }).sort([['messages', 'descending']]).exec();

        let data = {
            userID: user.userID,
            guildID: user.guildID,
            messages: user.messages,
            position: leaderboard.findIndex(user => user.userID === userID) + 1
        }

        return data;
    },

    /**
     * @param {Client} [client] - Tu Discord.js Client
     * @param {guildID} [string] - La ID del servidor
     */
    
    fetchLeaderboard: async(client, guildID) => {
        if(!client) throw new TypeError("No se ha introducido el cliente del bot");
        if(typeof client !== 'object') throw new TypeError("El parametro \"client\" debe ser un objeto");
        if(!guildID) throw new TypeError("No se ha introducido la ID del servidor");
        if(!/^[0-9]{18}$/gm.test(guildID)) throw new TypeError("Se ha introducido una ID de servidor invalida");

        const leaderboardUsers = await db.find({ guildID: guildID }).sort([['messages', 'descending']]).exec();

        if(!leaderboardUsers || leaderboardUsers.length < 1) return [];

        let leaderboardArray = [];

        leaderboardUsers.map(async(data) => {
            const user = await client.users.fetch(data.userID) || { username: "Unknown", discriminator: "0000", tag: "Unknown#0000" };
            leaderboardArray.push({
                guildID: data.guildID,
                user: {
                    id: data.userID,
                    username: user.username,
                    discriminator: user.discriminator,
                    tag: user.tag
                },
                messages: data.messages,
                position: (leaderboardUsers.findIndex(i => i.guildID === data.guildID && i.userID === data.userID) + 1)
            });
        })
        
        return leaderboardArray;
    }
}
