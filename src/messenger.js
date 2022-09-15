class Messenger {
  _messages = [
    (user) =>
      `:sos: Procura-se ${user}! :sos: Qualquer pista sobre sua localização entre em contato pelo telefone 4002-8922 :telephone:`,
    (user) =>
      `:sos: Procura-se ${user} vivo ou morto. Recompensa: R$420 :moneybag: :dollar:`,
    (user) => `Alguém viu o ${user}? :eyes:`,
    (user) =>
      `Alguém viu o ${user}? :eyes: Já faz um tempo que ele não aparece. :sob:`,
    (user) =>
      `Ainda não há relatos sobre o :comet: ${user} ter passado pelo grupo nesses dias... :satellite:`,
    (user) =>
      `Estamos com saúdades de você ${user}. :sob: :point_right: :heart:`,
    (user) => `RIP ${user} :dizzy_face:`,
    (user) => `Só damos valor quando perdemos. Saudades ${user} :hugging:`,
    (user) => `
    - Você já viu uma estrela cadente? :dizzy:
    - Via muitas. :thumbsup:
    - Via? Não vê mais? :thinking:
    - Não. Faz muito tempo. :person_gesturing_no: :timer:
    - Por quê? Deixou de olhar para o céu? :thinking: :eyes: :white_sun_cloud:
    - Não. Ele deixou de aparecer ${user} :person_gesturing_no: :sob:`,
  ];

  sendMessage(user, channel) {
    const randomMessage =
      this._messages[Math.floor(Math.random() * this._messages.length)];

    channel.send(randomMessage(user.toString()));
  }
}

export default new Messenger();
