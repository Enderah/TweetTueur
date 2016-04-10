var socket = io('127.0.0.1:1337');

socket.on('pouet', function (data) {
  console.log(data);
  socket.emit('pouet', { pouet: 'yeeah' });
});

/*
 * TODO: changer les noms des messages Recuperer les objets, les comprendre et les afficher
 * TODO: ENSUITE il restera plus qu'a les casser quand on clique dessus et faire un score.
 */