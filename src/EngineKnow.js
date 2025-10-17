import { KnowledgeBase } from './KnowledgeBase.js';
import { Memory } from './Memory.js';
import { Planner } from './Planner.js'; // Le planificateur GOAP

// ... (imports)

export class EngineKnow {
  constructor(config) {
    // ... (initialisation de knowledge, memory, etc.)
    this.actions = config.actions || [];
    this.planner = new Planner();

    this.currentPlan = null; // Le plan en cours d'exécution
  }

  think(gameState) {
    // 1. A-t-on déjà un plan et est-il toujours valide ?
    if (this.currentPlan && this.currentPlan.length > 0) {
      const nextAction = this.currentPlan[0];
      // Vérifier si les préconditions de la prochaine action sont toujours vraies
      if (this.isActionPossible(nextAction, gameState)) {
        // Le plan est toujours bon, on continue
        return this.executeNextAction();
      } else {
        // Le plan a échoué ! (Ex: le joueur a disparu)
        console.log(`[${this.identity.name}] Mon plan a échoué ! Je dois réfléchir à nouveau.`);
        this.currentPlan = null; // On abandonne le plan
      }
    }

    // 2. Si pas de plan, en créer un nouveau
    console.log(`[${this.identity.name}] Objectif: ${this.goal}. Je cherche un plan...`);
    
    // On doit définir un "goalState" à partir du "goal" textuel.
    // Pour l'instant, on fait une conversion simple.
    const goalState = { [this.goal]: true };
    
    const worldState = this.buildWorldState(gameState); // Créer l'état du monde

    this.currentPlan = this.planner.createPlan(goalState, worldState, this.actions);

    if (this.currentPlan && this.currentPlan.length > 0) {
      console.log(`[${this.identity.name}] Nouveau plan trouvé: ${this.currentPlan.map(a => a.name).join(' -> ')}`);
      return this.executeNextAction();
    }

    console.log(`[${this.identity.name}] Aucun plan trouvé pour atteindre mon objectif.`);
    return { name: 'idle' };
  }
  
  // Exécute la prochaine action du plan
  executeNextAction() {
    const actionToExecute = this.currentPlan.shift(); // Récupère et retire la 1ère action
    console.log(`[${this.identity.name}] Action suivante: ${actionToExecute.name}`);
    return actionToExecute;
  }
  
  // Crée un objet simple représentant l'état du monde pour le planificateur
  buildWorldState(gameState) {
    // C'est au développeur de jeu de fournir les "faits" du monde
    // Exemple simple :
    return {
      voitLeJoueur: gameState.isPlayerVisible,
      aUneArme: gameState.bot.hasWeapon,
      estEnPoste: gameState.bot.atPost,
      joueurElimine: gameState.player.isDead,
      // ...etc
    };
  }

  isActionPossible(action, gameState) {
    const worldState = this.buildWorldState(gameState);
    for (const key in action.preconditions) {
      if (action.preconditions[key] !== worldState[key]) {
        return false;
      }
    }
    return true;
  }

  learn(action, result) {
    // ... La logique d'apprentissage vient ici plus tard
  }
}
