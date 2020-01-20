const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');

/**
 * index   -> mostrar uma lista
 * show    -> mostrar apenas um 
 * store   -> criar um
 * update  -> atualizar um
 * destroy -> deletar um
 */

module.exports = {
  async index (request, response ){
    const devs = await Dev.find();

    return response.json(devs);
  },

  async store(request, response) {
    const { github_username, techs, latitude, longitude } = request.body;
  
    let dev = await Dev.findOne({ github_username });

    if(!dev){
      const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
  
      const { name = login , avatar_url, bio } = apiResponse.data;
    
      const techsArray = parseStringAsArray(techs);
    
      const location = {
        type: 'Point',
        coordinates: [longitude, latitude],
      };
    
      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location,
      });

      //filtrar as conexoes que estao a no raio de 10km do ponto do user, 
      // que o novo dev possue pelo menos uma das techs filtradas
      const sendSocketMessageTo = findConnections(
        { latitude, longitude },
        techsArray,
      );

      sendMessage(sendSocketMessageTo, 'new-dev', dev);
    }

    return response.json(dev);
  },

  async update(request, response){
    const { github_username } = request.params;

    const dev = Dev.findOne({ github_username })

    if(!dev) {
      return response.json({ message: 'User not found!'});
    }

    const { name, avatar_url, bio, latitude, longitude, techs } = request.body;

    const techsArray = parseStringAsArray(techs);

    const location = {
      type: 'Point',
      coordinates: [longitude, latitude],
    };

    const resp = await dev.update({
      name,
      avatar_url,
      bio,
      techs: techsArray
    });
    
    return response.json(resp);
  },

  async destroy(request, response){

  }
};