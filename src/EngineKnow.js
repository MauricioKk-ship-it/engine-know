import { KnowledgeBase } from './KnowledgeBase.js';
import { Memory } from './Memory.js';
import { Planner } from './Planner.js'; // Le planificateur GOAP

export class EngineKnow {
  constructor(config) {
    this.goal = config.goal;
    this.identity = config.identity;

    // Le cerveau a accès à la connaissance universelle
    this.knowledge = new KnowledgeBase();
    if (config.corpus) {
      this.knowledge.load(config.corpus);
    }
    
    // Et à sa propre mémoire
    this.memory = new Memory(config.memoryId);

    // Le cerveau a un ensemble d'actions qu'il peut faire
    this.actions = config.actions;
    
    this.planner = new Planner(this.actions);
  }

  // La fonction principale appelée à chaque frame
  think(gameState) {
    console.log(`[${this.identity.name}] Mon objectif: ${this.goal}. Je réfléchis...`);

    // 1. Fusionner les connaissances (corpus + mémoire)
    const worldKnowledge = { ...this.knowledge.facts, ...this.memory.learnedFacts };
    
    // 2. Demander au planificateur de trouver un plan
    const plan = this.planner.createPlan(this.goal, gameState, worldKnowledge);
    
    if (plan && plan.length > 0) {
      // Le plan est une séquence d'actions, on retourne la première
      console.log(`[${this.identity.name}] Mon plan: ${plan.map(a => a.name).join(' -> ')}`);
      return plan[0]; // Retourne la prochaine action à exécuter
    }

    console.log(`[${this.identity.name}] Je ne sais pas quoi faire.`);
    return { name: 'idle' }; // Action par défaut
  }

  // Le développeur donne un feedback au cerveau
  learn(action, result) {
    // Logique pour analyser le résultat et mettre à jour la mémoire
    // Exemple : si l'action était "attaquer" et le résultat "dégâts_faibles",
    // le bot peut en déduire une résistance et l'enregistrer dans sa mémoire.
    this.memory.recordFact(/* ... */);
  }
}
