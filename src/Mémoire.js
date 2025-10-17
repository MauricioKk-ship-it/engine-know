export class Memory {
  constructor(storageKey) {
    this.storageKey = storageKey; // Pour sauvegarder entre les sessions
    this.learnedFacts = new Map(); // Les faits appris
  }

  // Le bot note une observation
  // Exemple: recordFact('armure_brillante', 'resiste_a', 'physique')
  recordFact(subject, property, value) {
    if (!this.learnedFacts.has(subject)) {
      this.learnedFacts.set(subject, {});
    }
    const subjectFacts = this.learnedFacts.get(subject);
    
    // Pourrait inclure une logique de confiance ici
    subjectFacts[property] = value; 
    console.log(`[Memory] J'ai appris que ${subject} ${property} ${value}`);
  }

  // La mémoire peut être interrogée comme la KnowledgeBase
  query(queryString) {
    // ... logique similaire à KnowledgeBase
  }
}
