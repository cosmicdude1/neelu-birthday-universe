/**
 * ===================================================================
 *  A LITTLE UNIVERSE FOR NEELU - MASTER CONFIGURATION
 * ===================================================================
 *  All content, photos, messages, dates, and customizable parameters
 *  are organized here for easy modification and updates.
 * ===================================================================
 */

window.NEELU_CONFIG = {
  // Birthday Girl Details
  person: {
    fullName: "Neelam",
    nickname: "Neelu",
    birthDay: 18,
    birthMonth: "November", // Nov 18
    birthYear: 2004, // Used for birthday milestone
    zodiac: "Scorpio ♏",
    title: "A Little Universe for Neelu",
    tagline: "A cosmic journey through the stars for someone who shines brighter than all of them."
  },

  // Color Palette Constants (for UI & 3D particle accents)
  theme: {
    pastelPink: "#F8BBD0",
    lavender: "#D1C4E9",
    softPeach: "#FFE0B2",
    cream: "#FFFDF9",
    deepPurple: "#2A0845",
    midnightBlue: "#0B132B",
    gold: "#FFD700",
    roseGold: "#B76E79",
    celestialBlue: "#4A90E2"
  },

  // Audio & Music Settings
  audio: {
    // Primary background music path (easily replaceable with any .mp3 or .aac in assets/music/)
    bgMusicPath: "assets/music/bg-music.aac",
    bgMusicTitle: "A Little Universe • Birthday Melody",
    // Dedicated voice note for Scene 7 (right before the letter)
    customAudioPath: "assets/audio/birthday wish by sahil.ogg",
    customAudioTitle: "Special Voice Note for Neelu",
    ambientTrackTitle: "Celestial Lullaby (Ambient Chimes)",
    defaultVolume: 0.65,
    soundEffectsEnabled: true,
    autoplayPrompt: "Tap anywhere to begin your musical journey 🎵"
  },

  // Video Settings
  video: {
    path: "assets/video/memory-video.mp4",
    title: "A Glimpse of Her Radiance",
    subtitle: "Every frame captures a soul full of grace, warmth, and innocence."
  },

  // Scene 1: Cinematic Welcome
  welcome: {
    preTitle: "A SPECIAL CELEBRATION • NOVEMBER 18",
    title: "A Little Universe for Neelu",
    subtitle: "Because some souls are too pure, too kind, and too luminous for just an ordinary birthday card.",
    welcomeQuote: "“In the vastness of space and the immensity of time, it is my greatest joy to share a universe with you.”",
    ctaButton: "Step into Your Universe ✦"
  },

  // Scene 2: Interactive Birthday Envelope
  envelope: {
    sealText: "Touch the heart seal to open 💌",
    heading: "A Special Delivery For You",
    subtitle: "Prepared with love and wrapped in starlight",
    salutation: "Hey Neelu!",
    messageLines: [
      "Someone has prepared a little universe just for you.",
      "Today, you don't have to do anything except smile, enjoy and feel special.",
      "Because today is YOUR day!"
    ],
    buttonText: "Let's Celebrate! 🎂"
  },

  // Scene 3: 3D Birthday Cake
  cake: {
    title: "Happy Birthday, Neelu!",
    subtitle: "Make a wish! ✨",
    candlesCount: 5,
    flavor: "Lavender & Vanilla Cloud with Rose Frosting",
    instructions: "Close your eyes, make a silent wish, and blow out the candles!",
    blowButtonText: "Blow the Candles 🎂",
    wishUnlockedTitle: "May all your wishes come true! ❤️",
    wishUnlockedText: "May this year surround you with boundless love, genuine smiles, peace of mind, and all the magical dreams your heart has ever wished for.",
    continueButton: "Continue to Our Story 💫"
  },

  // Scene 4: An Unexpected Friendship (Storytelling)
  story: {
    title: "AN UNEXPECTED FRIENDSHIP",
    centralIdea: "Sometimes, the best friendships are the ones we never planned.",
    sentences: [
      "Funny how life works...",
      "I wasn't searching for a friend like you.",
      "I wasn't expecting someone like you to enter my life.",
      "But somehow, our paths crossed.",
      "And what started as a completely unplanned friendship became something I genuinely cherish."
    ],
    climaxQuote: "Some of life's best surprises are the ones we never planned.",
    continueButton: "Explore Beautiful Memories (Photo Gallery) 📸"
  },

  // Scene 5: Beautiful Memories Photo Gallery (Using actual photographs provided)
  gallery: {
    title: "Every picture has a story...",
    subtitle: "Here are a few little moments featuring one very special person.",
    continueButton: "Discover My Guardian Angel 🕊️",
    photos: [
      {
        id: 1,
        src: "assets/photos/photo-01.jpeg",
        title: "Effortless Grace",
        caption: "A quiet moment reflecting your natural calm and kindness.",
        backNote: "You bring so much gentle peace wherever you are.",
        date: "Memory 01",
        tag: "Radiance"
      },
      {
        id: 2,
        src: "assets/photos/photo-02.jpeg",
        title: "Unspoken Warmth",
        caption: "That genuine expression that makes people feel safe and heard.",
        backNote: "A heart that listens without any judgment.",
        date: "Memory 02",
        tag: "Smiles"
      },
      {
        id: 3,
        src: "assets/photos/photo-03.jpeg",
        title: "Pure Radiance",
        caption: "Shining bright and naturally true to yourself.",
        backNote: "Never let anything dim this golden glow.",
        date: "Memory 03",
        tag: "Radiance"
      },
      {
        id: 4,
        src: "assets/photos/photo-04.jpeg",
        title: "Golden Aura",
        caption: "Your infectious warmth that softens the world around you.",
        backNote: "One smile that turns heavy days into light.",
        date: "Memory 04",
        tag: "Moments"
      },
      {
        id: 5,
        src: "assets/photos/photo-05.jpeg",
        title: "Simply Stunning",
        caption: "Naturally poised and effortlessly yourself in every way.",
        backNote: "True elegance is just being authentic.",
        date: "Memory 05",
        tag: "Elegance"
      },
      {
        id: 6,
        src: "assets/photos/photo-06.jpeg",
        title: "The Brightest Light",
        caption: "Your laughter and energy that makes everything memorable.",
        backNote: "Life is so much more fun with your cheerful soul.",
        date: "Memory 06",
        tag: "Smiles"
      },
      {
        id: 7,
        src: "assets/photos/photo-07.jpeg",
        title: "Gentle Spirit",
        caption: "A rare, compassionate soul with the kindest heart.",
        backNote: "You notice things others miss and care deeply.",
        date: "Memory 07",
        tag: "Moments"
      },
      {
        id: 8,
        src: "assets/photos/photo-08.jpeg",
        title: "Timeless Charm",
        caption: "A portrait of quiet serenity and gentle strength.",
        backNote: "Poised, strong, and always graceful.",
        date: "Memory 08",
        tag: "Elegance"
      },
      {
        id: 9,
        src: "assets/photos/photo-09.jpeg",
        title: "Heart Full of Joy",
        caption: "Never lose the sparkle in your eyes, Neelu.",
        backNote: "May your upcoming year be filled with this joy.",
        date: "Memory 09",
        tag: "Radiance"
      },
      {
        id: 10,
        src: "assets/photos/photo-10.jpeg",
        title: "Sweet Simplicity",
        caption: "True beauty doesn't demand attention; it quietly shines.",
        backNote: "One of the most genuine people I'll ever know.",
        date: "Memory 10",
        tag: "Elegance"
      },
      {
        id: 11,
        src: "assets/photos/photo-11.jpeg",
        title: "Sunny Disposition",
        caption: "Always bringing a wave of comfort and positivity.",
        backNote: "Thank you for always being a light.",
        date: "Memory 11",
        tag: "Smiles"
      },
      {
        id: 12,
        src: "assets/photos/photo-12.jpeg",
        title: "True Best Friend",
        caption: "The friend who understood me even when words fell short.",
        backNote: "Blessed to have you by my side.",
        date: "Memory 12",
        tag: "Moments"
      },
      {
        id: 13,
        src: "assets/photos/photo-13.jpeg",
        title: "Radiant & Confident",
        caption: "Walking forward with resilience, dignity and grace.",
        backNote: "You are stronger and wiser than you realize.",
        date: "Memory 13",
        tag: "Radiance"
      },
      {
        id: 14,
        src: "assets/photos/photo-14.jpeg",
        title: "Cherished Memories",
        caption: "Moments frozen in time that remind me of how lucky I am.",
        backNote: "Every memory with you is a treasure.",
        date: "Memory 14",
        tag: "Moments"
      },
      {
        id: 15,
        src: "assets/photos/photo-15.jpeg",
        title: "Luminous Soul",
        caption: "A pure heart that makes the world a better place.",
        backNote: "Keep spreading this wonderful energy.",
        date: "Memory 15",
        tag: "Elegance"
      },
      {
        id: 16,
        src: "assets/photos/photo-16.jpeg",
        title: "Innocent & True",
        caption: "Honest, compassionate, and always true to your word.",
        backNote: "A loyalty that is rare and precious.",
        date: "Memory 16",
        tag: "Smiles"
      },
      {
        id: 17,
        src: "assets/photos/photo-17.jpeg",
        title: "Laughter in the Air",
        caption: "Unfiltered laughter that makes any cloudy day vanish.",
        backNote: "Never stop laughing like this!",
        date: "Memory 17",
        tag: "Moments"
      },
      {
        id: 18,
        src: "assets/photos/photo-18.jpeg",
        title: "Golden Glow",
        caption: "Radiating love, happiness, and an adventurous spirit.",
        backNote: "Excited for all your upcoming adventures.",
        date: "Memory 18",
        tag: "Radiance"
      },
      {
        id: 19,
        src: "assets/photos/photo-19.jpeg",
        title: "Poised & Gentle",
        caption: "Soft-spoken yet possessing a fierce, loyal strength.",
        backNote: "A pillar of strength in the gentlest way.",
        date: "Memory 19",
        tag: "Elegance"
      },
      {
        id: 20,
        src: "assets/photos/photo-20.jpeg",
        title: "Queen of 18 November",
        caption: "Celebrating the wonderful human being that you are today!",
        backNote: "Happy Birthday, Neelu! You deserve the world. ❤️",
        date: "Memory 20",
        tag: "Radiance"
      }
    ]
  },

  // Scene 6: My Guardian Angel
  angel: {
    title: "MY GUARDIAN ANGEL",
    subtitle: "A quiet light that guided me through the storm.",
    lines: [
      "Some people don't even realise how much they mean to others.",
      "You came into my life when I was going through a difficult phase.",
      "I was dealing with a lot of things, especially regarding my love life.",
      "But you listened, supported me and helped me get through things that weren't easy.",
      "Maybe you don't realise it, but you made a difference.",
      "Sometimes I feel like you're a little guardian angel who entered my life completely unexpectedly.",
      "And honestly, I'm genuinely grateful that I found a friend like you."
    ],
    ending: "Thank you for being my guardian angel, Neelu. ❤️",
    continueButton: "Read Your Birthday Letter 📜"
  },

  // Scene 7: A Personalized Birthday Letter
  letter: {
    title: "A Letter for Neelam",
    date: "18 November • With Endless Gratitude",
    salutation: "Hey Neelu! ❤️",
    paragraphs: [
      "Hey Neelu! ❤️",
      "Firstly, a very, very, VERY HAPPY BIRTHDAY TO YOUUU! 🎂🥳",
      "I hope this day brings you as much happiness as you bring into the lives of the people around you.",
      "You know what? Sometimes life gives us people we never planned to meet, never searched for, and never expected to become such an important part of our lives.",
      "And you're one of those people for me.",
      "Our friendship was completely unplanned. I wasn't looking for a friend like you, but somehow, I found one.",
      "You came into my life at a time when I wasn't really doing well. I was dealing with a lot of things, especially with my love life, and honestly, there were days when things felt pretty difficult.",
      "But you were there.",
      "You listened, you helped me, you supported me, and in your own little ways, you helped me find my way out of that phase.",
      "Maybe you don't even realise how much that meant to me.",
      "I sometimes think that you're like a guardian angel who entered my life unexpectedly.",
      "I don't know how life planned this friendship, but I'm really glad it happened.",
      "On your birthday, I just want to wish you endless happiness, success, good health, lots of laughter and all the beautiful things you deserve.",
      "May you always have reasons to smile. May all your dreams come true. And may life surprise you with beautiful moments just as unexpectedly as it surprised me with your friendship.",
      "Keep smiling, keep being the amazing person you are.",
      "And yes, thank you for being YOU!",
      "Once again, HAPPY BIRTHDAY, NEELU! ❤️",
      "Lots of happiness and best wishes always!",
      "— Your friend ❤️"
    ],
    fullRawText: `Hey Neelu! ❤️\n\nFirstly, a very, very, VERY HAPPY BIRTHDAY TO YOUUU! 🎂🥳\n\nI hope this day brings you as much happiness as you bring into the lives of the people around you.\n\nYou know what? Sometimes life gives us people we never planned to meet, never searched for, and never expected to become such an important part of our lives.\n\nAnd you're one of those people for me.\n\nOur friendship was completely unplanned. I wasn't looking for a friend like you, but somehow, I found one.\n\nYou came into my life at a time when I wasn't really doing well. I was dealing with a lot of things, especially with my love life, and honestly, there were days when things felt pretty difficult.\n\nBut you were there.\n\nYou listened, you helped me, you supported me, and in your own little ways, you helped me find my way out of that phase.\n\nMaybe you don't even realise how much that meant to me.\n\nI sometimes think that you're like a guardian angel who entered my life unexpectedly.\n\nI don't know how life planned this friendship, but I'm really glad it happened.\n\nOn your birthday, I just want to wish you endless happiness, success, good health, lots of laughter and all the beautiful things you deserve.\n\nMay you always have reasons to smile. May all your dreams come true. And may life surprise you with beautiful moments just as unexpectedly as it surprised me with your friendship.\n\nKeep smiling, keep being the amazing person you are.\n\nAnd yes, thank you for being YOU!\n\nOnce again, HAPPY BIRTHDAY, NEELU! ❤️\n\nLots of happiness and best wishes always!\n\n— Your friend ❤️`,
    continueButton: "Enter The Grand Finale 🎆"
  },

  // Scene 8: Grand Birthday Finale (Visual Climax)
  finale: {
    badge: "✨ 18 NOVEMBER • CELESTIAL FINALE ✨",
    greeting: "HAPPY BIRTHDAY!",
    name: "NEELAM ❤️",
    blessing: "Keep shining, Neelu. The world is a little more beautiful with people like you in it.",
    oneLastThingBtn: "One Last Thing... 💌",
    hiddenMessageParagraphs: [
      "Neelu, I don't know whether our friendship was written somewhere or whether it was just a coincidence.",
      "But if I could choose one thing to be grateful for, this unexpected friendship would definitely be on that list.",
      "Thank you for being you. ❤️"
    ],
    closingPrefix: "With lots of wishes,",
    closingSignature: "Your Friend ❤️",
    replayButton: "Replay Our Little Universe ↺"
  }
};

