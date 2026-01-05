export const games = [
  {
    slug: "catspin",
    title: "Cat Spin",
    banner: "/assets/banners/catspin.png",
    tagline: "Rotate levels while keeping Neko safe.",
    description: `CatSpin is a puzzle/adventure game with a whole new spin to it!

    Our hero's name is Neko. His cool hat might make him look a bit mysterious, but it's just something random he came up with while dreaming this whole thing.

    After running around and playing the whole day, Neko goes home to get some rest. Soon he is dreaming about a world full of lucky coins and he wants to collect them all!

    It seems that every time he collects all the lucky coins around, a magical door opens and he is able to go to another room. To his surprise the next rooms also have coins in them. Neko's curious about how many rooms there could be and how many lucky coins he will be able to get.

    And that is where you step in! You can help Neko by controlling him through the world! And not only that; you can control the world itself! By rotating it round and round, using either the virtual buttons or the accelerometer, you make sure Neko is able to get to places that he would otherwise not have been able to reach, but watch out! When you rotate, keep in mind that fire always wants to burn up, rocks always fall down and wind keeps coming from the sides; this might just do all kinds of funky stuff inside a rotating room!

    After reaching the exit, your progress is automatically saved. The game also keeps track of your 5 fastest times! Try beating the highest score for every level!

    Will Neko find out how many rooms there are?

    Will he get all the lucky coins?

    Let's find out!`,
    platforms: ["iOS", "Android"],
    features: [
      "A whole new concept of playing a platform game!",
      "Virtual buttons or Accelerometer controls!",
      "Online High Scores, Leaderboards and Friendslist through OpenFeint! Compete with players all over the world!",
      "Adventure and puzzle elements!",
      "55 levels to unlock!",
      "Crisp and beautiful 2D graphics!",
      "Funky music and soundeffects!",
    ],
  },
  {
    slug: "gorogorohero",
    title: "Goro Goro Hero",
    banner: "/assets/banners/gorogorohero.png",
    tagline: "Roll down a volcano, dodge lava and rocks.",
    description:
      "Race down a volcano in a constantly changing world. Dodge lava, rocks and debris while chasing high scores.",
    platforms: ["iOS", "Android"],
    features: [
      "Procedurally generated runs",
      "Fast, arcade-style gameplay",
      "Global leaderboards",
    ],
  },
  {
    slug: "hiddentemple",
    title: "Hidden Temple",
    banner: "/assets/banners/hiddentemple.png",
    tagline: "Adventure through a mysterious temple.",
    description:
      "Explore an ancient temple, solve environmental puzzles, and uncover the secrets hidden deep within.",
    platforms: ["PC", "Console"],
    features: [
      "Atmospheric exploration",
      "Story-driven progression",
      "Puzzles with multiple solutions",
    ],
  },
];

export function getGameBySlug(slug) {
  return games.find((g) => g.slug === slug);
}
