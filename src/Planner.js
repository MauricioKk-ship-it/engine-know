export class Planner {

  /**
   * Crée un plan d'actions pour atteindre un objectif depuis un état du monde donné.
   * @param {Object} goalState - L'objectif à atteindre (ex: { joueurElimine: true }).
   * @param {Object} worldState - L'état actuel du monde (ex: { voitLeJoueur: true, aUneArme: false }).
   * @param {Array} availableActions - La liste de toutes les actions possibles.
   * @returns {Array|null} Un tableau d'actions formant le plan, ou null si aucun plan n'est trouvé.
   */
  createPlan(goalState, worldState, availableActions) {
    // On cherche en partant de l'objectif
    let startNode = { state: goalState, action: null, parent: null, cost: 0 };
    let openSet = [startNode]; // Les "chemins" possibles à explorer
    let closedSet = new Set(); // Les états déjà explorés pour ne pas tourner en boucle

    while (openSet.length > 0) {
      // Trier pour prendre le chemin le moins coûteux en premier
      openSet.sort((a, b) => a.cost - b.cost);
      let currentNode = openSet.shift(); // Le chemin le plus prometteur

      // Si l'état du noeud actuel est réalisable depuis l'état du monde...
      if (this.isStateMet(currentNode.state, worldState)) {
        // ... on a trouvé un plan ! On le reconstruit en remontant les parents.
        return this.reconstructPlan(currentNode);
      }
      
      const stateKey = JSON.stringify(currentNode.state);
      if (closedSet.has(stateKey)) {
        continue; // On a déjà exploré cet état, on ignore
      }
      closedSet.add(stateKey);

      // Pour chaque action possible...
      for (const action of availableActions) {
        // ... est-ce que son effet nous aide à atteindre l'état du noeud actuel ?
        if (this.isStateMet(currentNode.state, action.effects)) {
          // Si oui, les préconditions de cette action deviennent notre nouveau sous-objectif
          let newState = { ...currentNode.state, ...action.preconditions };
          
          let newNode = {
            state: newState,
            action: action,
            parent: currentNode,
            cost: currentNode.cost + action.cost
          };
          openSet.push(newNode);
        }
      }
    }

    return null; // Aucun plan trouvé
  }

  // Vérifie si un état A est contenu dans un état B
  isStateMet(stateA, stateB) {
    for (const key in stateA) {
      if (stateA[key] !== stateB[key]) {
        return false;
      }
    }
    return true;
  }
  
  // Reconstruit le plan en suivant la chaîne des parents
  reconstructPlan(finalNode) {
    let plan = [];
    let current = finalNode;
    while (current.parent) {
      plan.unshift(current.action); // Ajoute l'action au début du plan
      current = current.parent;
    }
    return plan;
  }
  }
