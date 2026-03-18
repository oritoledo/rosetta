// ─── Types ────────────────────────────────────────────────────────────────────

export interface PersonaMessage {
  role: 'ai' | 'user'
  text: string
  translation?: string
}

export interface PersonaConversation {
  cafe: PersonaMessage[]
  doctor: PersonaMessage[]
  train: PersonaMessage[]
  market: PersonaMessage[]
}

export interface Persona {
  id: string
  name: string
  role: string
  location: string
  emoji: string
  avatarBg: string
  avatarAccent: string
  personality: string
  style: string
  difficulty: 'beginner-friendly' | 'intermediate' | 'challenging' | 'advanced'
  difficultyLabel: string
  difficultyColor: string
  ttsLang: string
  ttsGender: 'male' | 'female'
  tags: string[]
  bestFor: string[]
  conversation: PersonaConversation
}

// ─── Persona Data ─────────────────────────────────────────────────────────────

export const PERSONAS: Persona[] = [
  {
    id: 'sofia',
    name: 'Sofia',
    role: 'Barista',
    location: 'Rome, Italy',
    emoji: '👩‍🦰',
    avatarBg: '#1b3a5c',
    avatarAccent: '#5b8fd6',
    personality:
      'Warm, fast-talking, uses Roman slang, very forgiving of mistakes, adds little jokes',
    style: 'Casual and friendly. Short sentences. Lots of "dai!", "vabbè", "esatto!"',
    difficulty: 'beginner-friendly',
    difficultyLabel: 'Great for beginners',
    difficultyColor: '#52d48a',
    ttsLang: 'it-IT',
    ttsGender: 'female',
    tags: ['Casual', 'Encouraging', 'Slang'],
    bestFor: ['cafe', 'market'],
    conversation: {
      cafe: [
        {
          role: 'ai',
          text: 'Ciao ciao! Cosa ti porto?',
          translation: 'Hey hey! What can I get you?',
        },
        {
          role: 'user',
          text: 'Vorrei un cappuccino, per favore.',
        },
        {
          role: 'ai',
          text: 'Esatto! Grande o normale? Dai, non preoccuparti se sbagli — siamo tutti amici qui! 😄',
          translation: 'Exactly! Large or regular? Come on, don\'t worry about mistakes — we\'re all friends here!',
        },
        {
          role: 'user',
          text: 'Normale, grazie. E un cornetto?',
        },
        {
          role: 'ai',
          text: 'Vabbè, un cappuccino normale e un cornetto. Vuoi con crema, cioccolato, o vuoto?',
          translation: 'OK, one regular cappuccino and a croissant. Do you want cream, chocolate, or plain?',
        },
        {
          role: 'user',
          text: 'Con la crema, per favore.',
        },
        {
          role: 'ai',
          text: 'Ottima scelta! Ahh, i cornetti con la crema sono i migliori. Fatto subito!',
          translation: 'Great choice! Ahh, cream croissants are the best. Done in a second!',
        },
        {
          role: 'user',
          text: 'Quanto costa?',
        },
        {
          role: 'ai',
          text: 'Allora… fa due euro e ottanta. Al banco o al tavolo? Al banco ti conviene, costa meno! 😉',
          translation: 'So… that\'s two euros eighty. At the counter or at a table? The counter is better, it costs less!',
        },
      ],
      doctor: [
        {
          role: 'ai',
          text: 'Ciao! Dai, siediti pure. Come stai? Cosa ti fa male?',
          translation: 'Hi! Come on, sit down. How are you? What hurts?',
        },
        {
          role: 'user',
          text: 'Ho mal di testa da ieri.',
        },
        {
          role: 'ai',
          text: 'Ahi, che schifo! Da ieri, dici? È forte o lieve? E hai febbre?',
          translation: 'Ugh, that\'s rough! Since yesterday, you say? Is it strong or mild? And do you have a fever?',
        },
        {
          role: 'user',
          text: 'È abbastanza forte. Non lo so se ho febbre.',
        },
        {
          role: 'ai',
          text: 'Vabbè, ti misuro io. *pausa* Hai trentasette e cinque — niente di che, ma capisco che fa male.',
          translation: 'OK, I\'ll measure it for you. *pause* You have 37.5 — nothing serious, but I understand it hurts.',
        },
        {
          role: 'user',
          text: 'Devo prendere qualcosa?',
        },
        {
          role: 'ai',
          text: 'Dai, ti do una ricetta. Tachipirina ogni otto ore, e bevi tanta acqua, eh! E riposati — niente scherzi.',
          translation: 'Come on, I\'ll give you a prescription. Paracetamol every eight hours, and drink lots of water, OK! And rest — no jokes about it.',
        },
        {
          role: 'user',
          text: 'Grazie mille, dottoressa.',
        },
        {
          role: 'ai',
          text: 'Figurati! Dai, rimettiti presto. E se peggiora, torna subito da me, capito?',
          translation: 'Don\'t mention it! Come on, get better soon. And if it gets worse, come back to me right away, understood?',
        },
      ],
      train: [
        {
          role: 'ai',
          text: 'Ciao! Dove devi andare? Dimmi tutto!',
          translation: 'Hi! Where do you need to go? Tell me everything!',
        },
        {
          role: 'user',
          text: 'Devo andare a Firenze.',
        },
        {
          role: 'ai',
          text: 'Firenze! Bellissima città, dai. Hai una preferenza sull\'orario?',
          translation: 'Florence! Beautiful city, come on. Do you have a time preference?',
        },
        {
          role: 'user',
          text: 'Sì, al mattino se possibile.',
        },
        {
          role: 'ai',
          text: 'Vabbè, c\'è un Frecciarossa alle nove e venti. Ci mette solo un\'ora e mezza! Perfetto, no?',
          translation: 'OK, there\'s a Frecciarossa at nine twenty. It only takes an hour and a half! Perfect, right?',
        },
        {
          role: 'user',
          text: 'Perfetto! Un biglietto di andata e ritorno, per favore.',
        },
        {
          role: 'ai',
          text: 'Esatto! Prima o seconda classe? Con la seconda risparmi un botto, per dirti.',
          translation: 'Exactly! First or second class? With second you save a ton, just so you know.',
        },
        {
          role: 'user',
          text: 'Seconda classe va bene.',
        },
        {
          role: 'ai',
          text: 'Ottimo! Fa quarantadue euro. E ricordati di obliterare il biglietto prima di salire, eh! Sennò ti multano!',
          translation: 'Great! That\'s forty-two euros. And remember to validate your ticket before boarding, OK! Otherwise they\'ll fine you!',
        },
      ],
      market: [
        {
          role: 'ai',
          text: 'Ciao bella! Guarda che roba fresca ho oggi! Cosa cerchi?',
          translation: 'Hey there! Look at the fresh stuff I have today! What are you looking for?',
        },
        {
          role: 'user',
          text: 'Cerco dei pomodori buoni.',
        },
        {
          role: 'ai',
          text: 'Dai, questi sono i migliori di tutto il mercato! Profumano ancora di campo, guarda!',
          translation: 'Come on, these are the best in the whole market! They still smell of the field, look!',
        },
        {
          role: 'user',
          text: 'Quanto costano?',
        },
        {
          role: 'ai',
          text: 'Per te? Tre euro al chilo. Ma se ne prendi due chili, te li do a cinque e cinquanta. Vabbè?',
          translation: 'For you? Three euros per kilo. But if you take two kilos, I\'ll give them to you for five fifty. Deal?',
        },
        {
          role: 'user',
          text: 'Va bene! Ne prendo due chili.',
        },
        {
          role: 'ai',
          text: 'Esatto! Sei sveglia! *pesa* Eccoli, bella — due chili precisi. Vuoi anche qualcos\'altro?',
          translation: 'Exactly! You\'re sharp! *weighs* Here you go — exactly two kilos. Do you want anything else?',
        },
        {
          role: 'user',
          text: 'Sì, hai delle pesche?',
        },
        {
          role: 'ai',
          text: 'Le pesche! Certo certo! Queste sono dolcissime — assaggia, dai! Non ci credo se non ti piacciono.',
          translation: 'Peaches! Of course of course! These are super sweet — try one, come on! I don\'t believe you if you don\'t like them.',
        },
      ],
    },
  },

  {
    id: 'marco',
    name: 'Marco',
    role: 'University Professor',
    location: 'Florence, Italy',
    emoji: '👨‍🏫',
    avatarBg: '#2a1a0e',
    avatarAccent: '#c9a84c',
    personality:
      'Strict, precise, corrects every mistake directly, formal, high standards, occasionally dry humour',
    style: 'Formal Italian. Complete sentences. Pauses to correct grammar mid-conversation.',
    difficulty: 'challenging',
    difficultyLabel: 'For serious learners',
    difficultyColor: '#e8a090',
    ttsLang: 'it-IT',
    ttsGender: 'male',
    tags: ['Formal', 'Strict', 'Grammar-focused'],
    bestFor: ['doctor', 'train'],
    conversation: {
      cafe: [
        {
          role: 'ai',
          text: 'Buongiorno. Prego, mi dica.',
          translation: 'Good morning. Please, tell me what you\'d like.',
        },
        {
          role: 'user',
          text: 'Voglio un cappuccino.',
        },
        {
          role: 'ai',
          text: 'Permetta che la corregga — si dice "vorrei", non "voglio". "Voglio" è troppo diretto. "Vorrei un cappuccino, per favore." È più educato.',
          translation: 'Allow me to correct you — one says "vorrei", not "voglio". "Voglio" is too direct. "Vorrei un cappuccino, per favore." It\'s more polite.',
        },
        {
          role: 'user',
          text: 'Vorrei un cappuccino, per favore.',
        },
        {
          role: 'ai',
          text: 'Molto meglio. Grande o piccolo?',
          translation: 'Much better. Large or small?',
        },
        {
          role: 'user',
          text: 'Piccolo, grazie.',
        },
        {
          role: 'ai',
          text: 'Bene. Desidera anche qualcosa da mangiare? Abbiamo cornetti appena sfornati.',
          translation: 'Good. Would you also like something to eat? We have freshly baked croissants.',
        },
        {
          role: 'user',
          text: 'No, grazie. Solo il caffè.',
        },
        {
          role: 'ai',
          text: 'Corretto. "Solo il caffè" — benissimo. Un momento, prego.',
          translation: 'Correct. "Solo il caffè" — very good. One moment, please.',
        },
      ],
      doctor: [
        {
          role: 'ai',
          text: 'Buongiorno. Si accomodi. Le chiedo di descrivere i sintomi con precisione.',
          translation: 'Good morning. Please have a seat. I ask you to describe your symptoms precisely.',
        },
        {
          role: 'user',
          text: 'Ho mal di testa.',
        },
        {
          role: 'ai',
          text: 'Da quando ha questo dolore? Indichi anche l\'intensità su una scala da uno a dieci.',
          translation: 'Since when have you had this pain? Also indicate the intensity on a scale from one to ten.',
        },
        {
          role: 'user',
          text: 'Da ieri. Forse sette.',
          translation: 'Since yesterday. Maybe a seven.',
        },
        {
          role: 'ai',
          text: 'Capisco. Ha anche nausea, sensibilità alla luce, o rigidità al collo? Risponda con ordine.',
          translation: 'I understand. Do you also have nausea, light sensitivity, or neck stiffness? Answer in order.',
        },
        {
          role: 'user',
          text: 'Solo un po\' di nausea.',
        },
        {
          role: 'ai',
          text: 'Noti che ha omesso il soggetto. Si dice: "Ho solo un po\' di nausea." Il soggetto in italiano si può omettere, ma la sua esitazione suggerisce incertezza grammaticale, non idiomatica.',
          translation: 'Note that you omitted the subject. One says: "Ho solo un po\' di nausea." The subject in Italian can be omitted, but your hesitation suggests grammatical uncertainty, not idiomatic.',
        },
        {
          role: 'user',
          text: 'Capisco. Ho solo un po\' di nausea.',
        },
        {
          role: 'ai',
          text: 'Preciso. Le prescriverò un analgesico. Ritorni se i sintomi persistono oltre quarantotto ore.',
          translation: 'Precise. I will prescribe you a painkiller. Return if symptoms persist beyond forty-eight hours.',
        },
      ],
      train: [
        {
          role: 'ai',
          text: 'Buongiorno. Come posso aiutarla?',
          translation: 'Good morning. How may I help you?',
        },
        {
          role: 'user',
          text: 'Voglio un biglietto per Roma.',
        },
        {
          role: 'ai',
          text: 'Osservo che usa "voglio". In un contesto formale come questo, "vorrei" o "desidero" sarebbero più appropriati. Detto questo, per quale data desidera viaggiare?',
          translation: 'I note that you use "voglio". In a formal context like this, "vorrei" or "desidero" would be more appropriate. That said, for what date do you wish to travel?',
        },
        {
          role: 'user',
          text: 'Per oggi pomeriggio, se possibile.',
        },
        {
          role: 'ai',
          text: 'Corretto. Abbiamo partenze alle quindici e trenta e alle diciassette. Prima o seconda classe?',
          translation: 'Correct. We have departures at fifteen thirty and seventeen hundred. First or second class?',
        },
        {
          role: 'user',
          text: 'Prima classe, per favore.',
        },
        {
          role: 'ai',
          text: 'Ottima scelta. Il biglietto di sola andata in prima classe è di novantadue euro. Desidera anche il ritorno?',
          translation: 'Excellent choice. The one-way ticket in first class is ninety-two euros. Do you also desire the return?',
        },
        {
          role: 'user',
          text: 'Sì, anche il ritorno, per domani mattina.',
          translation: 'Yes, the return too, for tomorrow morning.',
        },
        {
          role: 'ai',
          text: 'Benissimo. Ricordi: i biglietti regionali vanno obliterati prima della salita. I Frecciarossa no. Si tratta di una distinzione importante.',
          translation: 'Very good. Remember: regional tickets must be validated before boarding. Frecciarossa ones do not. This is an important distinction.',
        },
      ],
      market: [
        {
          role: 'ai',
          text: 'Buongiorno. Cosa desidera?',
          translation: 'Good morning. What do you desire?',
        },
        {
          role: 'user',
          text: 'Quanto costano i pomodori?',
        },
        {
          role: 'ai',
          text: 'Tre euro e cinquanta al chilo. Sono pomodori San Marzano — di qualità superiore.',
          translation: 'Three euros fifty per kilo. They are San Marzano tomatoes — of superior quality.',
        },
        {
          role: 'user',
          text: 'Può fare un prezzo migliore?',
        },
        {
          role: 'ai',
          text: 'Apprezzo la domanda — corretta grammaticalmente, tra l\'altro. Posso offrirle tre euro al chilo se ne acquista almeno due chili.',
          translation: 'I appreciate the question — grammatically correct, incidentally. I can offer you three euros per kilo if you purchase at least two kilos.',
        },
        {
          role: 'user',
          text: 'Va bene, prendo due chili.',
          translation: 'All right, I\'ll take two kilos.',
        },
        {
          role: 'ai',
          text: 'Perfetto. Noti la costruzione: "prendo due chili" — senza "li" pleonastico. Eloquente e corretto.',
          translation: 'Perfect. Note the construction: "prendo due chili" — without a redundant pronoun. Eloquent and correct.',
        },
        {
          role: 'user',
          text: 'Grazie per la lezione.',
          translation: 'Thank you for the lesson.',
        },
        {
          role: 'ai',
          text: 'Prego. L\'apprendimento non ha confini — nemmeno al mercato. Buona giornata.',
          translation: 'You\'re welcome. Learning has no boundaries — not even at the market. Have a good day.',
        },
      ],
    },
  },

  {
    id: 'yusuf',
    name: 'Yusuf',
    role: 'Market Vendor',
    location: 'Naples, Italy',
    emoji: '🧔',
    avatarBg: '#1a2a1a',
    avatarAccent: '#52b788',
    personality:
      'High energy, speaks fast, uses hand gestures (described in text), dramatic, great deals, colourful expressions',
    style: 'Rapid Neapolitan-influenced Italian. Interrupts. Enthusiastic. Tests your listening speed.',
    difficulty: 'intermediate',
    difficultyLabel: 'Tests your listening',
    difficultyColor: '#5b8fd6',
    ttsLang: 'it-IT',
    ttsGender: 'male',
    tags: ['Fast', 'Energetic', 'Listening challenge'],
    bestFor: ['market', 'cafe'],
    conversation: {
      cafe: [
        {
          role: 'ai',
          text: 'Eeeh! Benvenuto benvenuto! Cosa vuole, cosa vuole? Abbiamo tutto, tutto fresco, guardi!',
          translation: 'Eeeh! Welcome welcome! What do you want, what do you want? We have everything, all fresh, look!',
        },
        {
          role: 'user',
          text: 'Vorrei un caffè.',
        },
        {
          role: 'ai',
          text: 'Un caffè! Subito subito! *gesticola* Solo caffè o anche qualcosa di mangiare? Abbiamo sfogliatelle, graffe, pastiere — tutto freschissimo!',
          translation: 'A coffee! Right away right away! *gestures* Just coffee or also something to eat? We have sfogliatelle, doughnuts, pastiera — all super fresh!',
        },
        {
          role: 'user',
          text: 'Solo caffè, grazie.',
        },
        {
          role: 'ai',
          text: 'Solo caffè, dice! *scuote la testa* Eh, ma guardi la sfogliatella — GUARDI! Come fa a dire no? Un euro solo, eh! Un euro!',
          translation: 'Just coffee, you say! *shakes head* Eh, but look at the sfogliatella — LOOK! How can you say no? Just one euro, eh! One euro!',
        },
        {
          role: 'user',
          text: 'Va bene, prendo anche la sfogliatella.',
        },
        {
          role: 'ai',
          text: 'Ecco! Sapevo! *batte le mani* Lo sapevo che non poteva resistere! Bravo bravo! Fa un euro e settanta in tutto — affare!',
          translation: 'There! I knew it! *claps hands* I knew you couldn\'t resist! Well done well done! That\'s one euro seventy altogether — bargain!',
        },
        {
          role: 'user',
          text: 'Ecco a lei.',
        },
        {
          role: 'ai',
          text: 'Grazie grazie! *conta veloce* Esatto! Torni presto, eh! La prossima volta le faccio assaggiare la pastiera — cambia la vita, giuro!',
          translation: 'Thank you thank you! *counts quickly* Exactly! Come back soon, eh! Next time I\'ll make you try the pastiera — it changes your life, I swear!',
        },
      ],
      doctor: [
        {
          role: 'ai',
          text: 'Prego prego! Si sieda, si sieda! Allora — che succede? Dove fa male? Dica dica!',
          translation: 'Please please! Sit down, sit down! So — what\'s happening? Where does it hurt? Tell me tell me!',
        },
        {
          role: 'user',
          text: 'Ho mal di stomaco.',
        },
        {
          role: 'ai',
          text: 'Stomaco! *fa gesto circolare sulla pancia* Da quando? Stamattina? Ieri? La settimana scorsa? Mangiato qualcosa di strano?',
          translation: 'Stomach! *makes circular gesture on belly* Since when? This morning? Yesterday? Last week? Eaten something strange?',
        },
        {
          role: 'user',
          text: 'Da stamattina. Forse ho mangiato qualcosa di pesante ieri.',
        },
        {
          role: 'ai',
          text: 'Aaah! Ecco ecco! *annuisce forte* Questo succede! Mangiamo troppo, poi paghiamo il prezzo! Ha anche nausea? Vomito? Diarrea? Dica tutto!',
          translation: 'Aaah! There it is! *nods strongly* This happens! We eat too much, then we pay the price! Do you also have nausea? Vomiting? Diarrhea? Tell me everything!',
        },
        {
          role: 'user',
          text: 'Un po\' di nausea, ma non ho vomitato.',
        },
        {
          role: 'ai',
          text: 'Meno male! Meno male! Senta — le dò una cosa leggera, niente di complicato. Carbone vegetale e dieta leggera oggi. Riso in bianco, brodo, niente fritture!',
          translation: 'Thank goodness! Thank goodness! Listen — I\'ll give you something light, nothing complicated. Activated charcoal and light diet today. White rice, broth, no fried food!',
        },
        {
          role: 'user',
          text: 'Capito. Grazie dottore.',
        },
        {
          role: 'ai',
          text: 'Figurarsi! *stringe la mano energicamente* Stia bene, stia bene! E la prossima volta — mangia piano, mastica bene! La digestione si rispetta!',
          translation: 'Don\'t mention it! *shakes hand energetically* Take care, take care! And next time — eat slowly, chew well! Digestion deserves respect!',
        },
      ],
      train: [
        {
          role: 'ai',
          text: 'Sì sì sì! Dove deve andare? Dica subito, dica — ho altri clienti che aspettano!',
          translation: 'Yes yes yes! Where do you need to go? Say it quickly, say it — I have other customers waiting!',
        },
        {
          role: 'user',
          text: 'Devo andare a Milano.',
        },
        {
          role: 'ai',
          text: 'Milano! *fischia* Lontano lontano! Okay, aspetti — *digita velocissimo* — Frecciarossa ore dieci o Intercity ore undici. Quale preferisce? Parli, parli!',
          translation: 'Milan! *whistles* Far far away! Okay, wait — *types very fast* — Frecciarossa at ten or Intercity at eleven. Which do you prefer? Speak, speak!',
        },
        {
          role: 'user',
          text: 'Il Frecciarossa, per favore.',
        },
        {
          role: 'ai',
          text: 'Frecciarossa, bravo! Classe? Prima, seconda, Business? La Business è bella eh, ma costa! *strizza l\'occhio*',
          translation: 'Frecciarossa, good! Class? First, second, Business? Business is nice eh, but it costs! *winks*',
        },
        {
          role: 'user',
          text: 'Seconda classe va bene.',
        },
        {
          role: 'ai',
          text: 'Seconda! Bene bene! Andata sola o andata e ritorno? Se fa ritorno oggi, le faccio vedere se c\'è sconto!',
          translation: 'Second! Good good! One way or round trip? If you return today, I\'ll check if there\'s a discount!',
        },
        {
          role: 'user',
          text: 'Solo andata.',
        },
        {
          role: 'ai',
          text: 'Solo andata! *stampa veloce* Ecco — cinquantotto euro. Pagamento carta o contanti? Faccia in fretta però, il treno parte tra venti minuti!',
          translation: 'One way only! *prints fast* Here — fifty-eight euros. Card or cash payment? But hurry up, the train leaves in twenty minutes!',
        },
      ],
      market: [
        {
          role: 'ai',
          text: 'Eeeh! Benvenuto benvenuto! Cosa vuole, cosa vuole? Abbiamo tutto, tutto fresco!',
          translation: 'Eeeh! Welcome welcome! What do you want, what do you want? We have everything, all fresh!',
        },
        {
          role: 'user',
          text: 'Cerco della frutta.',
        },
        {
          role: 'ai',
          text: 'Frutta! *apre le braccia* Guardi guardi — fragole, pesche, albicocche, meloni! Tutto locale, tutto oggi! Da dove vuole cominciare?',
          translation: 'Fruit! *opens arms* Look look — strawberries, peaches, apricots, melons! All local, all today! Where do you want to start?',
        },
        {
          role: 'user',
          text: 'Quanto costano le fragole?',
        },
        {
          role: 'ai',
          text: 'Le fragole! *prende in mano la cassetta* Due euro e cinquanta a chilo — PREZZO DI OGGI SOLO! Domani chi lo sa, eh! *ride*',
          translation: 'The strawberries! *picks up the tray* Two euros fifty per kilo — TODAY\'S PRICE ONLY! Tomorrow who knows, eh! *laughs*',
        },
        {
          role: 'user',
          text: 'Troppo caro. Fa due euro?',
        },
        {
          role: 'ai',
          text: 'DUE EURO! *si porta la mano al cuore* Mi fa soffrire! Senta, senta — due euro e venti, e le metto una fragola in bocca adesso! Affare o no?',
          translation: 'TWO EUROS! *puts hand on heart* You\'re making me suffer! Listen, listen — two euros twenty, and I\'ll put a strawberry in your mouth right now! Deal or not?',
        },
        {
          role: 'user',
          text: 'Va bene, due euro e venti.',
        },
        {
          role: 'ai',
          text: 'Ecco! Sapevo che era una persona ragionevole! *pesa veloce* Due chili — quattro euro e quaranta. Vuole anche le pesche? Sono ancora più buone!',
          translation: 'There! I knew you were a reasonable person! *weighs fast* Two kilos — four euros forty. Do you also want the peaches? They\'re even better!',
        },
      ],
    },
  },

  {
    id: 'elena',
    name: 'Elena',
    role: 'Business Executive',
    location: 'Milan, Italy',
    emoji: '👩‍💼',
    avatarBg: '#1a1a2a',
    avatarAccent: '#9aaabb',
    personality:
      'Precise, professional, expects formal address, minimal small talk, appreciates efficiency and correct register',
    style: 'Formal register only. Lei form. Business vocabulary. Brief responses. Expects the same formality back.',
    difficulty: 'advanced',
    difficultyLabel: 'Advanced register',
    difficultyColor: '#c9a84c',
    ttsLang: 'it-IT',
    ttsGender: 'female',
    tags: ['Formal', 'Business', 'Advanced'],
    bestFor: ['doctor', 'train'],
    conversation: {
      cafe: [
        {
          role: 'ai',
          text: 'Buongiorno. Ho poco tempo. Cosa desidera?',
          translation: 'Good morning. I have little time. What would you like?',
        },
        {
          role: 'user',
          text: 'Vorrei un caffè macchiato, per favore.',
        },
        {
          role: 'ai',
          text: 'Bene. Un macchiato. Desidera anche qualcosa da accompagnare?',
          translation: 'Good. A macchiato. Does she also want something to accompany it?',
        },
        {
          role: 'user',
          text: 'No, grazie. Solo il caffè.',
        },
        {
          role: 'ai',
          text: 'Perfetto. Prego, faccia con calma. Ma ricordi: in un contesto formale, si usa sempre il Lei.',
          translation: 'Perfect. Please, take your time. But remember: in a formal context, always use Lei.',
        },
        {
          role: 'user',
          text: 'Grazie per il consiglio.',
        },
        {
          role: 'ai',
          text: 'È una questione di rispetto professionale, non di formalità fine a sé stessa. Fa tre euro. Carta o contanti?',
          translation: 'It\'s a matter of professional respect, not formality for its own sake. That\'s three euros. Card or cash?',
        },
        {
          role: 'user',
          text: 'Carta, per favore.',
        },
        {
          role: 'ai',
          text: 'Prego. Buona giornata.',
          translation: 'Here you are. Good day.',
        },
      ],
      doctor: [
        {
          role: 'ai',
          text: 'Buongiorno. Si accomodi. Ha già effettuato l\'accettazione?',
          translation: 'Good morning. Please have a seat. Have you already completed registration?',
        },
        {
          role: 'user',
          text: 'Sì, ho fatto l\'accettazione.',
        },
        {
          role: 'ai',
          text: 'Bene. Quali sono i Suoi sintomi? Le chiedo di essere precisa.',
          translation: 'Good. What are your symptoms? I ask you to be precise.',
        },
        {
          role: 'user',
          text: 'Ho un dolore alla schiena da circa tre giorni.',
        },
        {
          role: 'ai',
          text: 'Intende dolore muscolare o vertebrale? Ha avuto traumi recenti? Specifichi.',
          translation: 'Do you mean muscular or vertebral pain? Have you had recent trauma? Specify.',
        },
        {
          role: 'user',
          text: 'Muscolare, penso. Nessun trauma.',
        },
        {
          role: 'ai',
          text: 'Capisco. Le prescriverò un antinfiammatorio. Eviti sforzi fisici per quarantotto ore. Riprenda l\'attività gradualmente.',
          translation: 'I understand. I will prescribe an anti-inflammatory. Avoid physical exertion for forty-eight hours. Resume activity gradually.',
        },
        {
          role: 'user',
          text: 'La ringrazio, dottoressa.',
        },
        {
          role: 'ai',
          text: 'Prego. Noti che ha usato il Lei in modo appropriato. Questo facilita sempre la comunicazione professionale.',
          translation: 'You\'re welcome. Note that you used the Lei form appropriately. This always facilitates professional communication.',
        },
      ],
      train: [
        {
          role: 'ai',
          text: 'Buongiorno. Come posso esserLe utile?',
          translation: 'Good morning. How may I be of use to you?',
        },
        {
          role: 'user',
          text: 'Desidero un biglietto per Torino.',
        },
        {
          role: 'ai',
          text: 'Bene. Ha scelto il verbo corretto — "desidero" è appropriato in questo contesto. Per quale data e orario?',
          translation: 'Good. You chose the correct verb — "desidero" is appropriate in this context. For what date and time?',
        },
        {
          role: 'user',
          text: 'Per domani mattina, preferibilmente entro le nove.',
        },
        {
          role: 'ai',
          text: 'Abbiamo un Frecciarossa alle sette e quarantacinque. Arrivo a Torino alle nove e dieci. Prima classe è disponibile.',
          translation: 'We have a Frecciarossa at seven forty-five. Arrival in Turin at nine ten. First class is available.',
        },
        {
          role: 'user',
          text: 'Prima classe, per favore. Andata e ritorno.',
          translation: 'First class, please. Round trip.',
        },
        {
          role: 'ai',
          text: 'Centoquarantotto euro complessivi. Richiede posto finestrino o corridoio?',
          translation: 'One hundred forty-eight euros total. Do you require a window or aisle seat?',
        },
        {
          role: 'user',
          text: 'Finestrino, per favore.',
        },
        {
          role: 'ai',
          text: 'Assegnato. Ecco il Suo biglietto. Buon viaggio.',
          translation: 'Assigned. Here is your ticket. Have a good journey.',
        },
      ],
      market: [
        {
          role: 'ai',
          text: 'Buongiorno. Cosa desidera?',
          translation: 'Good morning. What do you desire?',
        },
        {
          role: 'user',
          text: 'Buongiorno. Desidero acquistare alcune verdure per la settimana.',
          translation: 'Good morning. I wish to purchase some vegetables for the week.',
        },
        {
          role: 'ai',
          text: 'Apprezzo la chiarezza della richiesta. Abbiamo zucchine, fagiolini, peperoni e melanzane. Tutto di prima scelta.',
          translation: 'I appreciate the clarity of the request. We have zucchini, green beans, peppers and aubergines. All first choice.',
        },
        {
          role: 'user',
          text: 'Vorrei un chilo di zucchine e mezzo chilo di peperoni.',
        },
        {
          role: 'ai',
          text: 'Perfetto. Le zucchine sono due euro al chilo; i peperoni, due euro e cinquanta. In totale: tre euro e venticinque.',
          translation: 'Perfect. The zucchini are two euros per kilo; the peppers, two euros fifty. Total: three euros twenty-five.',
        },
        {
          role: 'user',
          text: 'Accettate pagamento con carta?',
        },
        {
          role: 'ai',
          text: 'Certamente. Utilizziamo POS contactless. È una domanda ragionevole e ben formulata.',
          translation: 'Certainly. We use contactless POS. It is a reasonable and well-formulated question.',
        },
        {
          role: 'user',
          text: 'La ringrazio.',
        },
        {
          role: 'ai',
          text: 'Prego. L\'uso del Lei è stato costante e appropriato. Buona giornata.',
          translation: 'You\'re welcome. The use of Lei was consistent and appropriate. Good day.',
        },
      ],
    },
  },
]

// ─── Helper ───────────────────────────────────────────────────────────────────

export function getPersonaById(id: string): Persona {
  return PERSONAS.find((p) => p.id === id) ?? PERSONAS[0]
}

export function languageToLocale(language: string): string {
  const map: Record<string, string> = {
    Italian: 'it-IT',
    Spanish: 'es-ES',
    French: 'fr-FR',
    German: 'de-DE',
  }
  return map[language] ?? 'it-IT'
}
