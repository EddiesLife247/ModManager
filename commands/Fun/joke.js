const jokes = [
  'I went to a street where the houses were numbered 8k, 16k, 32k, 64k, 128k, 256k and 512k. It was a trip down Memory Lane.',
  '�Debugging� is like being the detective in a crime drama where you are also the murderer.',
  'The best thing about a Boolean is that even if you are wrong, you are only off by a bit.',
  'A programmer puts two glasses on his bedside table before going to sleep. A full one, in case he gets thirsty, and an empty one, in case he doesn�t.',
  'If you listen to a UNIX shell, can you hear the C?',
  'Why do Java programmers have to wear glasses? Because they don�t C#.',
  'What sits on your shoulder and says �Pieces of 7! Pieces of 7!�? A Parroty Error.',
  'When Apple employees die, does their life HTML5 in front of their eyes?',
  'Without requirements or design, programming is the art of adding bugs to an empty text file.',
  'Before software can be reusable it first has to be usable.',
  'The best method for accelerating a computer is the one that boosts it by 9.8 m/s2.',
  'I think Microsoft named .Net so it wouldn�t show up in a Unix directory listing.',
  'There are two ways to write error-free programs; only the third one works.',
];
const aircraftjokes = [
  'Where does a mountain climber keep his plane? .... In a cliff-hangar.',
  'Why do people take an instant dislike to flight attendants? .... To save time later.',
  'Will invisible airplanes be a thing?..... I just can not see them taking off.',
  'A businessman was having a tough time lugging his lumpy, oversized travel bag onto the plane. Helped by a flight attendant, he finally managed to stuff it in the overhead bin. "Do you always carry such heavy luggage?" she sighed. �No more,� the man said. �Next time, I�m riding in the bag, and my partner can buy the ticket!�',
  'What is the difference between God and an airline pilot? God doesn�t think he�s an airline pilot.',
  'A Boeing 737 Max flight attendant walks into a bar and orders a martini. �You�re here later than usual,� the bartender comments. �Problems at work?� �Yes, just as our flight was about to take off, we had to turn around and wait at the gate for an hour.� �What was the problem?� the bartender asks. �The pilot was bothered by a noise in the engine,� she replies. �It took us a while to find a new pilot.�',
  'Why did the airplane get sent to his room? Bad altitude.',
  'A plane lands, and shortly after, the flight attendant comes over the speaker. �Hi, folks! Sorry about that rough landing. It wasn�t the captain�s fault. It definitely wasn�t my fault� It was the asphalt.�',
  'A plane is full of a bunch of Redditors, and suddenly a man starts having a heart attack. One of the flight attendants (who frequents r/AskReddit) notices this and quickly shouts: �People of the plane, we�re having an emergency! Is anyone on this plane a doctor?� Immediately, five people stand up and all say, �I�m not a doctor, but��',
  'Flight Announcement: �Last one off the plane has to clean it.�',
  'Flight Announcement: �There may be 50 ways to leave your lover, but there are only four ways out of this airplane.�',
  'Why won�t a Redbull travel by airplane? It already has wings.',
]
module.exports = {
  name: "joke", //the command name for the Slash Command
  category: "Fun",
  usage: "joke [aircraft]",
  aliases: [],
  description: "Gets A random Joke of the internet", //the command description for Slash Command Overview
  cooldown: 15,
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  run: async (client, message, args) => {
    try {
    if (args[0] == 'aircraft') {
      message.channel.send(aircraftjokes[Math.floor(Math.random() * aircraftjokes.length)]);
    }
    else {
      message.channel.send(jokes[Math.floor(Math.random() * jokes.length)]);
    }
  } catch (err) {
    const { logMessage } = require(`../../handlers/newfunctions`);
    logMessage(client, `error`, message.guild, `Error with JOKE command: \${err.message} | \`\`\` ${err.stack} \`\`\``);
}
  }
};