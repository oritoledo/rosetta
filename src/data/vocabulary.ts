export interface VocabWord {
  id: string
  word: string
  translation: string
  pronunciation?: string
  exampleSentence?: string
  language: string
  sceneId: string
  learnedDate: number
  nextReview: number
  interval: number
  easeFactor: number
  repetitions: number
  lastScore: number
}

const now = Date.now()
const DAY = 86400000

export const seedVocabulary: VocabWord[] = [
  // ── Café scene ──────────────────────────────────────────────────────────────
  {
    id: 'cafe_1', word: 'cornetto', translation: 'croissant',
    pronunciation: 'cor-NET-to', exampleSentence: 'Vorrei un cornetto e un cappuccino.',
    language: 'Italian', sceneId: 'cafe',
    learnedDate: now - 5 * DAY, nextReview: now - 2 * DAY,
    interval: 3, easeFactor: 2.5, repetitions: 1, lastScore: 4,
  },
  {
    id: 'cafe_2', word: 'cappuccino', translation: 'milky espresso coffee',
    pronunciation: 'cap-pu-CHEE-no', exampleSentence: 'Un cappuccino, per favore.',
    language: 'Italian', sceneId: 'cafe',
    learnedDate: now - 5 * DAY, nextReview: now + 1 * DAY,
    interval: 6, easeFactor: 2.6, repetitions: 2, lastScore: 5,
  },
  {
    id: 'cafe_3', word: 'colazione', translation: 'breakfast',
    pronunciation: 'co-la-TSYO-ne', exampleSentence: 'Faccio colazione al bar ogni mattina.',
    language: 'Italian', sceneId: 'cafe',
    learnedDate: now - 4 * DAY, nextReview: now - 1 * DAY,
    interval: 3, easeFactor: 2.3, repetitions: 1, lastScore: 3,
  },
  {
    id: 'cafe_4', word: 'al banco', translation: 'at the counter (standing)',
    pronunciation: 'al BAN-ko', exampleSentence: 'Prendo il caffè al banco.',
    language: 'Italian', sceneId: 'cafe',
    learnedDate: now - 4 * DAY, nextReview: now - 3 * DAY,
    interval: 1, easeFactor: 2.1, repetitions: 0, lastScore: 2,
  },
  {
    id: 'cafe_5', word: 'a parte', translation: 'separately / on the side',
    pronunciation: 'a PAR-te', exampleSentence: 'Il latte a parte, grazie.',
    language: 'Italian', sceneId: 'cafe',
    learnedDate: now - 3 * DAY, nextReview: now + 3 * DAY,
    interval: 6, easeFactor: 2.5, repetitions: 2, lastScore: 4,
  },
  {
    id: 'cafe_6', word: 'per favore', translation: 'please',
    pronunciation: 'per fa-VO-re', exampleSentence: 'Un caffè, per favore.',
    language: 'Italian', sceneId: 'cafe',
    learnedDate: now - 6 * DAY, nextReview: now + 10 * DAY,
    interval: 14, easeFactor: 2.8, repetitions: 3, lastScore: 5,
  },
  {
    id: 'cafe_7', word: 'vorrei', translation: 'I would like',
    pronunciation: 'vor-REI', exampleSentence: 'Vorrei un caffè macchiato.',
    language: 'Italian', sceneId: 'cafe',
    learnedDate: now - 5 * DAY, nextReview: now - 2 * DAY,
    interval: 3, easeFactor: 2.4, repetitions: 1, lastScore: 4,
  },
  {
    id: 'cafe_8', word: 'prego', translation: "you're welcome / please go ahead",
    pronunciation: 'PRE-go', exampleSentence: 'Grazie mille! — Prego!',
    language: 'Italian', sceneId: 'cafe',
    learnedDate: now - 5 * DAY, nextReview: now + 5 * DAY,
    interval: 6, easeFactor: 2.7, repetitions: 2, lastScore: 5,
  },
  {
    id: 'cafe_9', word: 'quanto costa', translation: 'how much does it cost?',
    pronunciation: 'KWAN-to KOS-ta', exampleSentence: 'Quanto costa un cappuccino?',
    language: 'Italian', sceneId: 'cafe',
    learnedDate: now - 4 * DAY, nextReview: now,
    interval: 4, easeFactor: 2.5, repetitions: 1, lastScore: 4,
  },
  {
    id: 'cafe_10', word: 'il conto', translation: 'the bill / check',
    pronunciation: 'il KON-to', exampleSentence: 'Scusi, posso avere il conto?',
    language: 'Italian', sceneId: 'cafe',
    learnedDate: now - 3 * DAY, nextReview: now - 1 * DAY,
    interval: 2, easeFactor: 2.3, repetitions: 1, lastScore: 3,
  },

  // ── Market scene ─────────────────────────────────────────────────────────────
  {
    id: 'market_1', word: 'scontrino', translation: 'receipt',
    pronunciation: 'skon-TREE-no', exampleSentence: 'Posso avere lo scontrino?',
    language: 'Italian', sceneId: 'market',
    learnedDate: now - 3 * DAY, nextReview: now - 1 * DAY,
    interval: 2, easeFactor: 2.2, repetitions: 1, lastScore: 3,
  },
  {
    id: 'market_2', word: 'quanto', translation: 'how much / how many',
    pronunciation: 'KWAN-to', exampleSentence: 'Quanto vengono questi pomodori?',
    language: 'Italian', sceneId: 'market',
    learnedDate: now - 3 * DAY, nextReview: now + 3 * DAY,
    interval: 6, easeFactor: 2.5, repetitions: 2, lastScore: 4,
  },
  {
    id: 'market_3', word: 'troppo caro', translation: 'too expensive',
    pronunciation: 'TROP-po CA-ro', exampleSentence: 'È troppo caro per me.',
    language: 'Italian', sceneId: 'market',
    learnedDate: now - 2 * DAY, nextReview: now - 2 * DAY,
    interval: 1, easeFactor: 2.1, repetitions: 0, lastScore: 2,
  },
  {
    id: 'market_4', word: 'uno sconto', translation: 'a discount',
    pronunciation: 'UNO SKON-to', exampleSentence: 'Può farmi uno sconto?',
    language: 'Italian', sceneId: 'market',
    learnedDate: now - 2 * DAY, nextReview: now + 1 * DAY,
    interval: 3, easeFactor: 2.4, repetitions: 1, lastScore: 4,
  },
  {
    id: 'market_5', word: 'mi fa il prezzo', translation: "what's your price for me?",
    pronunciation: 'mi FA il PRETS-so', exampleSentence: 'Mi fa il prezzo per tutto?',
    language: 'Italian', sceneId: 'market',
    learnedDate: now - 2 * DAY, nextReview: now - 1 * DAY,
    interval: 1, easeFactor: 2.0, repetitions: 0, lastScore: 1,
  },
  {
    id: 'market_6', word: 'offerta', translation: 'offer / deal',
    pronunciation: 'of-FER-ta', exampleSentence: 'Che offerta fantastica!',
    language: 'Italian', sceneId: 'market',
    learnedDate: now - 1 * DAY, nextReview: now + 5 * DAY,
    interval: 6, easeFactor: 2.6, repetitions: 2, lastScore: 5,
  },
  {
    id: 'market_7', word: 'fresco', translation: 'fresh',
    pronunciation: 'FRES-ko', exampleSentence: 'È tutto fresco oggi?',
    language: 'Italian', sceneId: 'market',
    learnedDate: now - 1 * DAY, nextReview: now + 2 * DAY,
    interval: 3, easeFactor: 2.5, repetitions: 1, lastScore: 4,
  },
  {
    id: 'market_8', word: 'buonissimo', translation: 'very tasty / excellent',
    pronunciation: 'bwo-NIS-si-mo', exampleSentence: 'Questo formaggio è buonissimo!',
    language: 'Italian', sceneId: 'market',
    learnedDate: now - 1 * DAY, nextReview: now + 6 * DAY,
    interval: 6, easeFactor: 2.7, repetitions: 2, lastScore: 5,
  },
  {
    id: 'market_9', word: 'prendere', translation: 'to take / to buy',
    pronunciation: 'PREN-de-re', exampleSentence: 'Prendo un chilo di pomodori.',
    language: 'Italian', sceneId: 'market',
    learnedDate: now - 3 * DAY, nextReview: now - 2 * DAY,
    interval: 1, easeFactor: 2.2, repetitions: 0, lastScore: 2,
  },
  {
    id: 'market_10', word: 'vendere', translation: 'to sell',
    pronunciation: 'VEN-de-re', exampleSentence: 'Vende prodotti biologici?',
    language: 'Italian', sceneId: 'market',
    learnedDate: now - 3 * DAY, nextReview: now + 1 * DAY,
    interval: 4, easeFactor: 2.4, repetitions: 1, lastScore: 4,
  },

  // ── Doctor scene ──────────────────────────────────────────────────────────────
  {
    id: 'doctor_1', word: 'mi fa male', translation: 'it hurts / I have pain here',
    pronunciation: 'mi FA MA-le', exampleSentence: 'Mi fa male la testa da stamattina.',
    language: 'Italian', sceneId: 'doctor',
    learnedDate: now - 7 * DAY, nextReview: now - 3 * DAY,
    interval: 4, easeFactor: 2.3, repetitions: 1, lastScore: 3,
  },
  {
    id: 'doctor_2', word: 'ho la febbre', translation: 'I have a fever',
    pronunciation: 'o la FEB-bre', exampleSentence: 'Ho la febbre da due giorni.',
    language: 'Italian', sceneId: 'doctor',
    learnedDate: now - 7 * DAY, nextReview: now - 5 * DAY,
    interval: 2, easeFactor: 2.1, repetitions: 0, lastScore: 2,
  },
  {
    id: 'doctor_3', word: 'da quanto tempo', translation: 'since when / how long',
    pronunciation: 'da KWAN-to TEM-po', exampleSentence: 'Da quanto tempo ha questi sintomi?',
    language: 'Italian', sceneId: 'doctor',
    learnedDate: now - 6 * DAY, nextReview: now - 2 * DAY,
    interval: 4, easeFactor: 2.4, repetitions: 1, lastScore: 4,
  },
  {
    id: 'doctor_4', word: 'la ricetta', translation: 'the prescription',
    pronunciation: 'la ri-CHET-ta', exampleSentence: 'Ecco la ricetta per gli antibiotici.',
    language: 'Italian', sceneId: 'doctor',
    learnedDate: now - 6 * DAY, nextReview: now + 4 * DAY,
    interval: 6, easeFactor: 2.5, repetitions: 2, lastScore: 4,
  },
  {
    id: 'doctor_5', word: 'farmacia', translation: 'pharmacy',
    pronunciation: 'far-MA-cha', exampleSentence: "C'è una farmacia qui vicino?",
    language: 'Italian', sceneId: 'doctor',
    learnedDate: now - 5 * DAY, nextReview: now + 1 * DAY,
    interval: 6, easeFactor: 2.6, repetitions: 2, lastScore: 5,
  },
  {
    id: 'doctor_6', word: 'dolore', translation: 'pain',
    pronunciation: 'do-LO-re', exampleSentence: 'Sento un dolore al petto.',
    language: 'Italian', sceneId: 'doctor',
    learnedDate: now - 5 * DAY, nextReview: now - 4 * DAY,
    interval: 1, easeFactor: 2.0, repetitions: 0, lastScore: 1,
  },
  {
    id: 'doctor_7', word: 'stomaco', translation: 'stomach',
    pronunciation: 'STO-ma-ko', exampleSentence: 'Ho dolore allo stomaco.',
    language: 'Italian', sceneId: 'doctor',
    learnedDate: now - 4 * DAY, nextReview: now - 1 * DAY,
    interval: 3, easeFactor: 2.3, repetitions: 1, lastScore: 3,
  },
  {
    id: 'doctor_8', word: 'testa', translation: 'head',
    pronunciation: 'TES-ta', exampleSentence: 'Mi fa male la testa.',
    language: 'Italian', sceneId: 'doctor',
    learnedDate: now - 4 * DAY, nextReview: now + 2 * DAY,
    interval: 6, easeFactor: 2.5, repetitions: 2, lastScore: 4,
  },
  {
    id: 'doctor_9', word: 'allergia', translation: 'allergy',
    pronunciation: 'al-ler-JEE-a', exampleSentence: "Ho un'allergia alla penicillina.",
    language: 'Italian', sceneId: 'doctor',
    learnedDate: now - 3 * DAY, nextReview: now - 3 * DAY,
    interval: 1, easeFactor: 2.1, repetitions: 0, lastScore: 2,
  },
  {
    id: 'doctor_10', word: 'visita', translation: 'visit / appointment',
    pronunciation: 'VEE-si-ta', exampleSentence: 'Vorrei prenotare una visita.',
    language: 'Italian', sceneId: 'doctor',
    learnedDate: now - 2 * DAY, nextReview: now + 4 * DAY,
    interval: 6, easeFactor: 2.6, repetitions: 2, lastScore: 5,
  },

  // ── Train / travel scene ──────────────────────────────────────────────────────
  {
    id: 'train_1', word: 'mi porti a', translation: 'take me to',
    pronunciation: 'mi POR-ti A', exampleSentence: 'Mi porti a Piazza Navona, per favore.',
    language: 'Italian', sceneId: 'train',
    learnedDate: now - 4 * DAY, nextReview: now - 2 * DAY,
    interval: 2, easeFactor: 2.2, repetitions: 1, lastScore: 3,
  },
  {
    id: 'train_2', word: 'quanto ci vuole', translation: 'how long does it take?',
    pronunciation: 'KWAN-to chi VWO-le', exampleSentence: 'Quanto ci vuole per arrivare?',
    language: 'Italian', sceneId: 'train',
    learnedDate: now - 4 * DAY, nextReview: now - 3 * DAY,
    interval: 1, easeFactor: 2.1, repetitions: 0, lastScore: 2,
  },
  {
    id: 'train_3', word: 'per favore si affretti', translation: 'please hurry',
    pronunciation: 'per fa-VO-re si af-FRET-ti', exampleSentence: 'Per favore si affretti, sono in ritardo.',
    language: 'Italian', sceneId: 'train',
    learnedDate: now - 3 * DAY, nextReview: now - 2 * DAY,
    interval: 1, easeFactor: 2.0, repetitions: 0, lastScore: 1,
  },
  {
    id: 'train_4', word: 'il traffico', translation: 'traffic',
    pronunciation: 'il TRAF-fi-ko', exampleSentence: "C'è molto traffico oggi.",
    language: 'Italian', sceneId: 'train',
    learnedDate: now - 3 * DAY, nextReview: now + 3 * DAY,
    interval: 6, easeFactor: 2.5, repetitions: 2, lastScore: 4,
  },
  {
    id: 'train_5', word: 'dritto', translation: 'straight ahead',
    pronunciation: 'DRIT-to', exampleSentence: 'Vada dritto per due isolati.',
    language: 'Italian', sceneId: 'train',
    learnedDate: now - 2 * DAY, nextReview: now + 1 * DAY,
    interval: 3, easeFactor: 2.4, repetitions: 1, lastScore: 4,
  },
  {
    id: 'train_6', word: 'a sinistra', translation: 'to the left',
    pronunciation: 'a si-NIS-tra', exampleSentence: 'Giri a sinistra al semaforo.',
    language: 'Italian', sceneId: 'train',
    learnedDate: now - 2 * DAY, nextReview: now + 4 * DAY,
    interval: 6, easeFactor: 2.6, repetitions: 2, lastScore: 5,
  },
  {
    id: 'train_7', word: 'a destra', translation: 'to the right',
    pronunciation: 'a DES-tra', exampleSentence: 'Poi giri a destra.',
    language: 'Italian', sceneId: 'train',
    learnedDate: now - 2 * DAY, nextReview: now + 4 * DAY,
    interval: 6, easeFactor: 2.6, repetitions: 2, lastScore: 5,
  },
  {
    id: 'train_8', word: 'qui va bene', translation: 'here is fine / stop here',
    pronunciation: 'kwi VA BEH-ne', exampleSentence: 'Qui va bene, grazie mille.',
    language: 'Italian', sceneId: 'train',
    learnedDate: now - 1 * DAY, nextReview: now - 1 * DAY,
    interval: 1, easeFactor: 2.2, repetitions: 0, lastScore: 2,
  },
  {
    id: 'train_9', word: 'il resto', translation: 'the change (money)',
    pronunciation: 'il RES-to', exampleSentence: 'Tenga pure il resto.',
    language: 'Italian', sceneId: 'train',
    learnedDate: now - 1 * DAY, nextReview: now + 5 * DAY,
    interval: 6, easeFactor: 2.7, repetitions: 2, lastScore: 5,
  },
  {
    id: 'train_10', word: 'ricevuta', translation: 'receipt',
    pronunciation: 'ri-che-VU-ta', exampleSentence: 'Può darmi la ricevuta?',
    language: 'Italian', sceneId: 'train',
    learnedDate: now - 1 * DAY, nextReview: now + 2 * DAY,
    interval: 3, easeFactor: 2.5, repetitions: 1, lastScore: 4,
  },
]
