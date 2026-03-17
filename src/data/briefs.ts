// ─── Types ────────────────────────────────────────────────────────────────────

export type Difficulty = 'easy' | 'medium' | 'hard'

export interface VocabItem {
  id: string
  word: string
  phonetic: string
  translation: string
  difficulty: Difficulty
  example: string
  exampleTranslation: string
}

export type SlotType = 'subject' | 'verb' | 'object' | 'connector'

export interface GrammarSlot {
  text: string
  type: SlotType
  note?: string
}

export interface GrammarExample {
  it: string
  en: string
}

export interface GrammarItem {
  id: string
  name: string
  title: string
  slots: GrammarSlot[]
  examples: GrammarExample[]
  whenToUse: string
}

export interface PronunciationItem {
  id: string
  word: string
  syllables: string[]
  stressed: number   // index of stressed syllable
  ipa: string
  difficulty: Difficulty
  mistake: string
}

export interface ContextCard {
  icon: string
  title: string
  body: string
}

export interface Culture {
  insiderTip: string
  insiderSource: string
  tagline: string
  dos: string[]
  donts: string[]
  contextCards: ContextCard[]
  tips: string[]
}

export interface SceneBrief {
  vocabulary: VocabItem[]
  grammar: GrammarItem[]
  pronunciation: PronunciationItem[]
  culture: Culture
  difficulty: {
    vocabulary: number      // 0-100
    grammar: number
    speakingSpeed: number
    culturalNuance: number
  }
}

// ─── Café ─────────────────────────────────────────────────────────────────────

const cafeBrief: SceneBrief = {
  difficulty: { vocabulary: 70, grammar: 55, speakingSpeed: 40, culturalNuance: 80 },

  vocabulary: [
    {
      id: 'v1', word: 'Vorrei', phonetic: 'vor-REI',
      translation: 'I would like', difficulty: 'easy',
      example: 'Vorrei un cappuccino, per favore.',
      exampleTranslation: 'I would like a cappuccino, please.',
    },
    {
      id: 'v2', word: 'Il conto', phonetic: 'il KON-to',
      translation: 'The bill / check', difficulty: 'easy',
      example: 'Potrei avere il conto, per favore?',
      exampleTranslation: 'Could I have the bill, please?',
    },
    {
      id: 'v3', word: 'Al banco', phonetic: 'al BAN-ko',
      translation: 'At the bar (standing)', difficulty: 'medium',
      example: 'Prendo un caffè al banco.',
      exampleTranslation: "I'll have a coffee at the bar.",
    },
    {
      id: 'v4', word: 'A parte', phonetic: 'a PAR-teh',
      translation: 'On the side / separately', difficulty: 'medium',
      example: 'Vorrei la crema a parte.',
      exampleTranslation: "I'd like the cream on the side.",
    },
    {
      id: 'v5', word: 'Cornetto', phonetic: 'kor-NET-to',
      translation: 'Italian croissant', difficulty: 'easy',
      example: 'Un cornetto alla crema, grazie.',
      exampleTranslation: 'A cream-filled croissant, thanks.',
    },
    {
      id: 'v6', word: 'Quanto costa?', phonetic: 'KWAN-to KOS-ta',
      translation: 'How much does it cost?', difficulty: 'easy',
      example: 'Quanto costa un cappuccino?',
      exampleTranslation: 'How much is a cappuccino?',
    },
    {
      id: 'v7', word: 'Sfogliatella', phonetic: 'sfo-lya-TEL-la',
      translation: 'Flaky shell-shaped pastry', difficulty: 'hard',
      example: 'Una sfogliatella fresca, per favore.',
      exampleTranslation: 'A fresh sfogliatella, please.',
    },
    {
      id: 'v8', word: 'Macchiato', phonetic: 'mak-KYA-to',
      translation: 'Espresso with a dash of milk', difficulty: 'medium',
      example: 'Un caffè macchiato caldo.',
      exampleTranslation: 'A warm macchiato.',
    },
  ],

  grammar: [
    {
      id: 'g1', name: 'POLITE REQUESTS',
      title: 'Using Condizionale for Requests',
      slots: [
        { text: 'Vorrei', type: 'verb', note: 'I would like' },
        { text: 'un', type: 'connector' },
        { text: 'cappuccino', type: 'object', note: 'the thing you want' },
        { text: 'per favore', type: 'connector' },
      ],
      examples: [
        { it: 'Vorrei un tavolo per due.', en: 'I would like a table for two.' },
        { it: 'Vorrei vedere il menù.', en: 'I would like to see the menu.' },
        { it: 'Vorrei pagare adesso.', en: 'I would like to pay now.' },
      ],
      whenToUse: "Use vorrei (I would like) instead of voglio (I want) whenever ordering or requesting anything in a service setting. Voglio sounds blunt — vorrei is always polite.",
    },
    {
      id: 'g2', name: 'ASKING PRICES',
      title: 'Price Questions with Quanto',
      slots: [
        { text: 'Quanto', type: 'subject', note: 'how much' },
        { text: 'costa', type: 'verb', note: 'does it cost' },
        { text: 'un caffè', type: 'object', note: 'the item' },
      ],
      examples: [
        { it: 'Quanto costano questi?', en: 'How much do these cost?' },
        { it: 'Quanto viene in totale?', en: 'How much is the total?' },
        { it: 'Quanto mi fa?', en: 'How much do I owe you?' },
      ],
      whenToUse: "Costa (singular) vs costano (plural). Quanto mi fa? is the most natural way to ask the total in informal settings.",
    },
    {
      id: 'g3', name: 'GETTING ATTENTION',
      title: 'Polite Address Forms',
      slots: [
        { text: 'Scusi', type: 'verb', note: 'excuse me (formal)' },
        { text: '—', type: 'connector' },
        { text: 'mi porta', type: 'verb', note: 'could you bring me' },
        { text: "un bicchiere d'acqua?", type: 'object', note: 'a glass of water?' },
      ],
      examples: [
        { it: 'Scusi, posso ordinare?', en: 'Excuse me, can I order?' },
        { it: 'Mi porta il menù?', en: 'Could you bring me the menu?' },
        { it: "Scusi, dov'è il bagno?", en: 'Excuse me, where is the bathroom?' },
      ],
      whenToUse: "Scusi is formal (use with strangers/staff). Scusa is informal (friends). Always use Scusi in service situations — never Ehi (Hey) to get a waiter's attention.",
    },
  ],

  pronunciation: [
    {
      id: 'p1', word: 'Sfogliatella',
      syllables: ['sfo', 'glia', 'TEL', 'la'], stressed: 2,
      ipa: '/sfoʎʎaˈtɛlla/', difficulty: 'hard',
      mistake: 'English speakers say "sfo-glee-ah-TELL-ah" — the "gli" is a soft L sound, like "million" in English, not "glee".',
    },
    {
      id: 'p2', word: 'Cornetto',
      syllables: ['cor', 'NET', 'to'], stressed: 1,
      ipa: '/korˈnetto/', difficulty: 'medium',
      mistake: 'Stress falls on the second syllable — cor-NET-to, not COR-net-to.',
    },
    {
      id: 'p3', word: 'Cappuccino',
      syllables: ['cap', 'puc', 'CI', 'no'], stressed: 2,
      ipa: '/kapputˈtʃiːno/', difficulty: 'medium',
      mistake: 'The double "p" and "c" are both pronounced distinctly — cap-puc-CI-no with a "ch" sound, not "cap-poo-SEEN-oh".',
    },
    {
      id: 'p4', word: 'Macchiato',
      syllables: ['mac', 'CHIA', 'to'], stressed: 1,
      ipa: '/makˈkjaːto/', difficulty: 'medium',
      mistake: 'The "ch" here is a hard K sound — mac-KYA-to, not "mac-ee-AH-to" as English speakers often say.',
    },
    {
      id: 'p5', word: 'Grazie',
      syllables: ['GRA', 'zie'], stressed: 0,
      ipa: '/ˈɡrattsje/', difficulty: 'easy',
      mistake: 'Two syllables only — GRA-tsye, not "gra-ZEE-ay" (three syllables). The final e is very short.',
    },
  ],

  culture: {
    tagline: "What every tourist gets wrong at an Italian café",
    insiderTip: "Standing at the bar (al banco) is a completely different price than sitting at a table. Locals always stand for their morning coffee — it's faster, cheaper, and more social. Ask for \"al banco\" when you order.",
    insiderSource: '— As told by Sofia, barista at Caffè della Pace, Rome',
    dos: [
      'Say "un caffè" when you want an espresso — locals never say "un espresso"',
      'Greet the barista with "Buongiorno" before ordering — it\'s considered rude not to',
      'Pay at the till first (cassa), then take your receipt to the bar in traditional cafés',
      'Leave small change (10–20 cents) on the counter as a tip — it\'s appreciated',
      'Drink your coffee quickly — lingering at the bar is fine, but tables turn fast',
    ],
    donts: [
      "Don't order a cappuccino after 11am — it's a breakfast drink and marks you as a tourist",
      "Don't ask for a \"large\" coffee — Italian coffees are small by design",
      "Don't sit down without checking if there's table service — sometimes you must order at the bar",
      "Don't add extra sugar and then stir loudly — taste it first",
      "Don't say \"gracias\" — you're in Italy, not Spain. Easy mistake, gets laughs.",
    ],
    contextCards: [
      { icon: '🎩', title: 'Formality Level', body: 'Semi-formal. Use "Lei" (formal you) with staff unless they switch to "tu" first.' },
      { icon: '💶', title: 'Tipping Culture', body: 'Not expected but appreciated. Round up or leave coins — never a percentage.' },
      { icon: '🤌', title: 'Common Gestures', body: '"Perfetto" pinched fingers. Chin flick means "I don\'t care." Index finger wagging = no.' },
    ],
    tips: [
      'If you\'re unsure what to order, "un caffè e un cornetto" is the classic Italian breakfast',
      'The word "prego" has 5 meanings — you\'re welcome, go ahead, here you go, please, after you',
      'Italians rarely drink coffee to go — pause, enjoy it at the bar, it\'s part of the culture',
    ],
  },
}

// ─── Doctor ───────────────────────────────────────────────────────────────────

const doctorBrief: SceneBrief = {
  difficulty: { vocabulary: 85, grammar: 70, speakingSpeed: 35, culturalNuance: 60 },

  vocabulary: [
    {
      id: 'v1', word: 'Mi fa male', phonetic: 'mi FA MA-le',
      translation: 'It hurts / I have pain here', difficulty: 'easy',
      example: 'Mi fa male la testa da stamattina.',
      exampleTranslation: 'My head has been hurting since this morning.',
    },
    {
      id: 'v2', word: 'Ho la febbre', phonetic: 'o la FEB-bre',
      translation: 'I have a fever', difficulty: 'easy',
      example: 'Ho la febbre da due giorni.',
      exampleTranslation: 'I have had a fever for two days.',
    },
    {
      id: 'v3', word: 'La ricetta', phonetic: 'la ri-CHET-ta',
      translation: 'The prescription', difficulty: 'medium',
      example: 'Può darmi la ricetta per gli antibiotici?',
      exampleTranslation: 'Can you give me a prescription for antibiotics?',
    },
    {
      id: 'v4', word: 'Da quanto tempo', phonetic: 'da KWAN-to TEM-po',
      translation: 'Since when / How long', difficulty: 'medium',
      example: 'Da quanto tempo ha questi sintomi?',
      exampleTranslation: 'How long have you had these symptoms?',
    },
    {
      id: 'v5', word: 'Allergia', phonetic: 'al-ler-JEE-a',
      translation: 'Allergy', difficulty: 'medium',
      example: "Ho un'allergia alla penicillina.",
      exampleTranslation: 'I am allergic to penicillin.',
    },
    {
      id: 'v6', word: 'Farmacia', phonetic: 'far-MA-cha',
      translation: 'Pharmacy', difficulty: 'easy',
      example: "C'è una farmacia qui vicino?",
      exampleTranslation: 'Is there a pharmacy nearby?',
    },
  ],

  grammar: [
    {
      id: 'g1', name: 'DESCRIBING SYMPTOMS',
      title: 'Reporting Pain with Mi Fa Male',
      slots: [
        { text: 'Mi fa male', type: 'verb', note: 'it hurts me' },
        { text: 'il', type: 'connector' },
        { text: 'petto', type: 'object', note: 'the body part' },
      ],
      examples: [
        { it: 'Mi fa male la schiena.', en: 'My back hurts.' },
        { it: 'Mi fanno male le gambe.', en: 'My legs hurt.' },
        { it: 'Mi fa molto male il ginocchio.', en: 'My knee hurts a lot.' },
      ],
      whenToUse: "Note the agreement: 'mi fa male' (singular body part) vs 'mi fanno male' (plural). The verb agrees with the body part, not with 'mi'.",
    },
    {
      id: 'g2', name: 'DURATION',
      title: 'Expressing Duration with Da',
      slots: [
        { text: 'Ho', type: 'verb', note: 'I have had' },
        { text: 'la febbre', type: 'object', note: 'the condition' },
        { text: 'da', type: 'connector' },
        { text: 'tre giorni', type: 'subject', note: 'the duration' },
      ],
      examples: [
        { it: 'Ho mal di testa da stamattina.', en: 'I have had a headache since this morning.' },
        { it: "Ho la tosse da un'altra settimana.", en: 'I have had a cough for another week.' },
        { it: 'Ho dolore al petto da ieri sera.', en: 'I have had chest pain since last night.' },
      ],
      whenToUse: "Italian uses the present tense + 'da' to express ongoing states. Unlike English, you don't use past tense — the condition is still happening now.",
    },
  ],

  pronunciation: [
    {
      id: 'p1', word: 'Farmacia',
      syllables: ['far', 'MA', 'cha'], stressed: 1,
      ipa: '/farˈmaːtʃa/', difficulty: 'medium',
      mistake: 'English speakers say "far-ma-SEE-ah" — the "-cia" is a single "cha" sound, not two syllables.',
    },
    {
      id: 'p2', word: 'Allergia',
      syllables: ['al', 'ler', 'JEE', 'a'], stressed: 2,
      ipa: '/alˈlɛrdʒia/', difficulty: 'medium',
      mistake: 'Stress on the third syllable — al-ler-JEE-a. The final "a" is short and unstressed.',
    },
    {
      id: 'p3', word: 'Ricetta',
      syllables: ['ri', 'CET', 'ta'], stressed: 1,
      ipa: '/riˈtʃetta/', difficulty: 'easy',
      mistake: 'The "c" before "e" is a "ch" sound — ri-CHET-ta. The double "t" is also held slightly longer.',
    },
    {
      id: 'p4', word: 'Antibiotici',
      syllables: ['an', 'ti', 'bi', 'O', 'ti', 'ci'], stressed: 3,
      ipa: '/antibiˈɔːtitʃi/', difficulty: 'hard',
      mistake: 'Six syllables! Stress on the fourth — an-ti-bi-O-ti-ci. The final "ci" is a soft "chi" sound.',
    },
    {
      id: 'p5', word: 'Sintomi',
      syllables: ['SIN', 'to', 'mi'], stressed: 0,
      ipa: '/ˈsintomi/', difficulty: 'easy',
      mistake: 'Stress on the first syllable — SIN-to-mi, not "sin-TO-mi" as the English "symptoms" might suggest.',
    },
  ],

  culture: {
    tagline: "Navigating Italy's public health system with confidence",
    insiderTip: "Italian doctors expect you to describe your symptoms precisely and in order. Vague complaints like 'I feel bad' may lead to a short appointment. Lead with the main symptom, add duration, then mention anything relevant. They appreciate a patient who is organised.",
    insiderSource: '— Dr. Marco Ferretti, GP at Policlinico Umberto I, Rome',
    dos: [
      'Always use "Lei" (formal you) when speaking with medical professionals',
      'Bring your health insurance card (tessera sanitaria) or EHIC if EU citizen',
      'Describe symptoms specifically — location, intensity (1-10), and duration',
      'Ask for a ricetta (prescription) to take to the farmacia separately',
      'Public clinics (ASL) require appointments — walk-ins are for emergencies only',
    ],
    donts: [
      "Don't use informal \"tu\" with doctors — always the formal \"Lei\"",
      "Don't expect a long consultation — Italian GP appointments are typically 10–15 minutes",
      "Don't self-diagnose out loud — let the doctor lead the conversation",
      "Don't forget to ask for a receipt (ricevuta) for insurance claims",
    ],
    contextCards: [
      { icon: '🏥', title: 'Formality Level', body: 'Formal throughout. Lei with all medical staff. Surnames only until invited to use first names.' },
      { icon: '💊', title: 'Prescription Culture', body: 'Many drugs requiring prescriptions in other countries are over-the-counter in Italian pharmacies.' },
      { icon: '🤝', title: 'Bedside Manner', body: 'Italian doctors are warm but direct. Eye contact is important — it signals honesty and trust.' },
    ],
    tips: [
      "'Ho bisogno di una visita urgente' means 'I need an urgent appointment'",
      "Pharmacists (farmacisti) in Italy are highly trained — ask them first for minor issues",
      "Bring a list of any medications you take — generic names, not brand names",
    ],
  },
}

// ─── Train ────────────────────────────────────────────────────────────────────

const trainBrief: SceneBrief = {
  difficulty: { vocabulary: 55, grammar: 40, speakingSpeed: 60, culturalNuance: 50 },

  vocabulary: [
    {
      id: 'v1', word: 'Un biglietto', phonetic: 'un bi-LYET-to',
      translation: 'A ticket', difficulty: 'easy',
      example: 'Un biglietto per Roma, per favore.',
      exampleTranslation: 'A ticket to Rome, please.',
    },
    {
      id: 'v2', word: 'Il binario', phonetic: 'il bi-NA-rio',
      translation: 'The platform / track', difficulty: 'easy',
      example: 'Da quale binario parte il treno?',
      exampleTranslation: 'From which platform does the train leave?',
    },
    {
      id: 'v3', word: 'Obliterare', phonetic: 'ob-li-te-RA-re',
      translation: 'To validate (stamp) a ticket', difficulty: 'hard',
      example: 'Ricorda di obliterare il biglietto prima di salire.',
      exampleTranslation: 'Remember to validate your ticket before boarding.',
    },
    {
      id: 'v4', word: 'In ritardo', phonetic: 'in ri-TAR-do',
      translation: 'Late / delayed', difficulty: 'easy',
      example: 'Il treno è in ritardo di venti minuti.',
      exampleTranslation: 'The train is twenty minutes late.',
    },
    {
      id: 'v5', word: 'A che ora', phonetic: 'a ke O-ra',
      translation: 'At what time', difficulty: 'easy',
      example: "A che ora arriva il treno a Firenze?",
      exampleTranslation: 'What time does the train arrive in Florence?',
    },
    {
      id: 'v6', word: 'Prenotato', phonetic: 'pre-no-TA-to',
      translation: 'Reserved / booked', difficulty: 'medium',
      example: 'Ho un posto prenotato al finestrino.',
      exampleTranslation: 'I have a window seat reserved.',
    },
  ],

  grammar: [
    {
      id: 'g1', name: 'BUYING TICKETS',
      title: 'Requesting with Vorrei + Destination',
      slots: [
        { text: 'Vorrei', type: 'verb', note: "I'd like" },
        { text: 'un biglietto', type: 'object', note: 'a ticket' },
        { text: 'per', type: 'connector' },
        { text: 'Firenze', type: 'subject', note: 'destination' },
      ],
      examples: [
        { it: 'Vorrei un biglietto di andata e ritorno.', en: 'I would like a return ticket.' },
        { it: 'Vorrei prenotare un posto.', en: 'I would like to reserve a seat.' },
        { it: 'Vorrei il treno delle undici.', en: "I'd like the 11 o'clock train." },
      ],
      whenToUse: "Always lead with 'vorrei' at ticket windows. Follow with destination, class (prima/seconda), and date. One-way is 'solo andata', return is 'andata e ritorno'.",
    },
    {
      id: 'g2', name: 'ASKING FOR INFO',
      title: 'Indirect Questions with Sapere',
      slots: [
        { text: 'Sa', type: 'verb', note: 'do you know (formal)' },
        { text: 'da quale binario', type: 'subject', note: 'from which platform' },
        { text: 'parte', type: 'verb', note: 'departs' },
        { text: 'il treno?', type: 'object', note: 'the train?' },
      ],
      examples: [
        { it: "Sa se il treno è in orario?", en: 'Do you know if the train is on time?' },
        { it: "Sa dove si trova la biglietteria?", en: 'Do you know where the ticket office is?' },
        { it: "Sa a che ora arriva?", en: 'Do you know what time it arrives?' },
      ],
      whenToUse: "'Sa' is the formal version of 'sai'. Use it with station staff, guards, and strangers. It's polite and expected. 'Lo sa?' (do you know it?) is useful for follow-up questions.",
    },
  ],

  pronunciation: [
    {
      id: 'p1', word: 'Biglietto',
      syllables: ['bi', 'LYET', 'to'], stressed: 1,
      ipa: '/biʎˈʎɛtto/', difficulty: 'medium',
      mistake: 'The "gli" sounds like the "ll" in "million" — bi-LYET-to, not "big-lee-ET-to".',
    },
    {
      id: 'p2', word: 'Binario',
      syllables: ['bi', 'NA', 'rio'], stressed: 1,
      ipa: '/biˈnaːrjo/', difficulty: 'easy',
      mistake: 'Three syllables only — bi-NA-rio. The "rio" is one sound, not "ree-oh".',
    },
    {
      id: 'p3', word: 'Obliterare',
      syllables: ['ob', 'li', 'te', 'RA', 're'], stressed: 3,
      ipa: '/obliteˈraːre/', difficulty: 'hard',
      mistake: 'Five syllables — ob-li-te-RA-re. Stress on fourth syllable. This word trips every tourist.',
    },
    {
      id: 'p4', word: 'Coincidenza',
      syllables: ['co', 'in', 'ci', 'DEN', 'za'], stressed: 3,
      ipa: '/koIntʃiˈdɛntsa/', difficulty: 'hard',
      mistake: '"Coincidenza" means a connection/transfer, not a coincidence in this context. Stress: co-in-ci-DEN-za.',
    },
    {
      id: 'p5', word: 'Ritardo',
      syllables: ['ri', 'TAR', 'do'], stressed: 1,
      ipa: '/riˈtardo/', difficulty: 'easy',
      mistake: 'Stress on second syllable — ri-TAR-do, not "RI-tar-do". Rolls off the tongue quickly.',
    },
  ],

  culture: {
    tagline: "The unwritten rules of Italian train travel",
    insiderTip: "The golden rule: always validate (obliterare) your regional train ticket in the yellow machines on the platform before boarding. Inspectors fine you even if you bought the ticket — the stamp proves you boarded at the right time. Trenitalia high-speed tickets (Frecciarossa) don't need stamping.",
    insiderSource: '— Lucia, ticket agent at Firenze Santa Maria Novella station',
    dos: [
      "Validate regional tickets in the yellow machines before boarding",
      "Check the departure board (partenze) 10 minutes before — tracks change last minute",
      "Book Frecciarossa seats in advance — they cost more but are reliably on time",
      "Keep your ticket until you exit the station — inspectors check on platforms too",
      "Say 'Permesso' to squeeze past people in the aisle",
    ],
    donts: [
      "Don't board a regional train without validating — fines are €50+",
      "Don't block the doors when people are trying to board or exit",
      "Don't assume the seat number on your ticket matches the carriage layout — check the carriage number",
      "Don't eat strong-smelling food — it's frowned upon on long journeys",
    ],
    contextCards: [
      { icon: '🚄', title: 'Train Types', body: 'Frecciarossa (fast, reserved), Intercity (medium, optional), Regionale (slow, no reservation needed).' },
      { icon: '🎫', title: 'Ticket Culture', body: 'Buy at biglietteria, tabaccheria, or online. Many stations have self-service machines in English.' },
      { icon: '💼', title: 'Luggage Rules', body: 'No luggage limits on most trains, but store bags in overhead racks — don\'t block the aisle.' },
    ],
    tips: [
      "'Posso sedermi qui?' means 'May I sit here?' — always ask if the seat looks taken",
      "Italian trains announce stops in Italian only — know your stop name before boarding",
      "'Dove si trova il vagone ristorante?' = 'Where is the dining car?' — useful on long Frecciarossa journeys",
    ],
  },
}

// ─── Market ───────────────────────────────────────────────────────────────────

const marketBrief: SceneBrief = {
  difficulty: { vocabulary: 65, grammar: 50, speakingSpeed: 75, culturalNuance: 90 },

  vocabulary: [
    {
      id: 'v1', word: 'Quanto costa?', phonetic: 'KWAN-to KOS-ta',
      translation: 'How much does it cost?', difficulty: 'easy',
      example: 'Quanto costano questi pomodori?',
      exampleTranslation: 'How much are these tomatoes?',
    },
    {
      id: 'v2', word: 'Mi fa uno sconto?', phonetic: 'mi FA UNO SKON-to',
      translation: 'Can you give me a discount?', difficulty: 'medium',
      example: 'Mi fa uno sconto se prendo due chili?',
      exampleTranslation: "Can you discount it if I take two kilos?",
    },
    {
      id: 'v3', word: 'Troppo caro', phonetic: 'TROP-po CA-ro',
      translation: 'Too expensive', difficulty: 'easy',
      example: 'È troppo caro per me, grazie.',
      exampleTranslation: "It's too expensive for me, thanks.",
    },
    {
      id: 'v4', word: 'Un chilo', phonetic: 'un KI-lo',
      translation: 'One kilogram', difficulty: 'easy',
      example: 'Mezzo chilo di olive nere, per favore.',
      exampleTranslation: 'Half a kilo of black olives, please.',
    },
    {
      id: 'v5', word: 'Fresco di giornata', phonetic: 'FRES-ko di jor-NA-ta',
      translation: "Today's fresh catch / produce", difficulty: 'hard',
      example: 'È fresco di giornata questo pesce?',
      exampleTranslation: 'Is this fish today\'s fresh catch?',
    },
    {
      id: 'v6', word: "L'offerta", phonetic: "l'of-FER-ta",
      translation: 'The deal / the offer', difficulty: 'medium',
      example: "Che offerta mi fa per tutto insieme?",
      exampleTranslation: "What deal do you offer me for everything together?",
    },
  ],

  grammar: [
    {
      id: 'g1', name: 'HAGGLING',
      title: "The Art of mi fa il prezzo",
      slots: [
        { text: 'Mi fa', type: 'verb', note: 'can you make me' },
        { text: 'il prezzo', type: 'object', note: 'the price' },
        { text: 'per', type: 'connector' },
        { text: 'tutto?', type: 'subject', note: 'everything?' },
      ],
      examples: [
        { it: 'Mi fa un prezzo speciale?', en: "Can you make me a special price?" },
        { it: 'Le faccio un buon prezzo.', en: "I'll give you a good price. (vendor reply)" },
        { it: 'Non posso scendere più di così.', en: "I can't go lower than this." },
      ],
      whenToUse: "'Mi fa il prezzo?' is the classic opener for market negotiation. It invites the vendor to offer their best price without you naming a number first — a classic Neapolitan strategy.",
    },
    {
      id: 'g2', name: 'COMPLIMENTING',
      title: 'Superlatives to Warm Up the Vendor',
      slots: [
        { text: 'Che', type: 'connector' },
        { text: 'buonissima', type: 'verb', note: 'incredibly delicious (fem.)' },
        { text: "questa mozzarella!", type: 'object', note: 'the product' },
      ],
      examples: [
        { it: 'Che freschezza! Non ho mai visto pomodori così.', en: "What freshness! I've never seen tomatoes like this." },
        { it: 'Questo profumo è straordinario.', en: 'This fragrance is extraordinary.' },
        { it: 'Siete i migliori del mercato.', en: 'You are the best in the market.' },
      ],
      whenToUse: "Complimenting the quality of goods before haggling is essential etiquette. Vendors respond better to buyers who appreciate their produce. Never open with a low offer — build rapport first.",
    },
  ],

  pronunciation: [
    {
      id: 'p1', word: 'Sconto',
      syllables: ['SKON', 'to'], stressed: 0,
      ipa: '/ˈskonto/', difficulty: 'easy',
      mistake: 'SKON-to — stress on first syllable. The "sc" before "o" is a hard "sk" sound, not "sh".',
    },
    {
      id: 'p2', word: 'Sfogliatella',
      syllables: ['sfo', 'glia', 'TEL', 'la'], stressed: 2,
      ipa: '/sfoʎʎaˈtɛlla/', difficulty: 'hard',
      mistake: 'The "gli" is a palatal L — like "ll" in "million". Not "glee". sfo-lya-TEL-la.',
    },
    {
      id: 'p3', word: 'Buonissimo',
      syllables: ['bwo', 'NIS', 'si', 'mo'], stressed: 1,
      ipa: '/bwɔˈnissimo/', difficulty: 'medium',
      mistake: 'The "buo" is one sound — "bwo", not "boo-oh". Four syllables: bwo-NIS-si-mo.',
    },
    {
      id: 'p4', word: 'Mozzarella',
      syllables: ['mots', 'za', 'REL', 'la'], stressed: 2,
      ipa: '/mottsaˈrɛlla/', difficulty: 'medium',
      mistake: 'The "zz" is a double "ts" sound — mot-tsa-REL-la. Not "motz-ah-REL-ah".',
    },
    {
      id: 'p5', word: 'Freschezza',
      syllables: ['fres', 'CHEZ', 'za'], stressed: 1,
      ipa: '/fresˈkettsa/', difficulty: 'hard',
      mistake: '"sch" before "e" is "sk" — fres-KETZ-za, not "fres-CHEZ-za" as English-trained mouths produce.',
    },
  ],

  culture: {
    tagline: "How to bargain like a Neapolitan",
    insiderTip: "In Neapolitan markets, the first price is never the real price — it's the opening move in a performance. Show genuine admiration for the goods, express mild shock at the price, then make a counteroffer at 60-70% of the ask. The vendor expects this. Walking away slowly often brings the price down further.",
    insiderSource: '— Gennaro, market vendor at Mercato di Porta Nolana, Naples',
    dos: [
      'Compliment the quality of the goods before asking the price',
      'Make eye contact and engage warmly — relationships drive the deal',
      'Use cash — vendors give better prices than for card payments',
      'Buy in quantity to negotiate bulk discounts',
      'Accept a small free sample if offered — refusing is impolite',
    ],
    donts: [
      "Don't open with your lowest offer — build up to it slowly",
      "Don't touch produce without asking the vendor to select for you",
      "Don't walk away rudely — say 'grazie, ci penso' (thanks, I'll think about it)",
      "Don't compare prices loudly with a nearby stall — it's disrespectful",
    ],
    contextCards: [
      { icon: '🤝', title: 'Formality Level', body: 'Informal and warm. "Tu" is fine after the first exchange. First names once offered.' },
      { icon: '💵', title: 'Tipping Culture', body: 'No tipping at markets. Generosity is in accepting the deal gracefully and coming back.' },
      { icon: '🤌', title: 'Common Gestures', body: 'Open palm shake = "no deal". Pinched fingers upward = "what do you want?" Thumbs up = "excellent quality".' },
    ],
    tips: [
      "'Questo è il mio ultimo prezzo' = 'This is my final price' — say it firmly and mean it",
      "Saturday morning is the best time — vendors discount remaining stock before the weekend crowd peaks",
      "'Me lo porta a casa?' (can you deliver to my house?) — rarely yes, but asking builds rapport",
    ],
  },
}

// ─── Export ───────────────────────────────────────────────────────────────────

export const briefs: Record<string, SceneBrief> = {
  cafe:   cafeBrief,
  doctor: doctorBrief,
  train:  trainBrief,
  market: marketBrief,
}
