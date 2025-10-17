export class KnowledgeBase {
  constructor() {
    this.facts = new Map();
  }

  // Charge un objet de faits (depuis un JSON)
  load(corpusData) {
    for (const key in corpusData) {
      this.facts.set(key, corpusData[key]);
    }
  }

  // Permet au bot de "demander" quelque chose
  // Exemple : query('gobelin.faiblesses') -> ['feu', 'lumiere']
  query(queryString) {
    const parts = queryString.split('.');
    let current = this.facts.get(parts[0]);
    for (let i = 1; i < parts.length; i++) {
      if (!current) return undefined;
      current = current[parts[i]];
    }
    return current;
  }
}
