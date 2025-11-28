/**
 * Dictionnaire centralisé des messages d'aide contextuels
 * Structure: route ou fonctionnalité -> message d'aide
 */

export const helpMessages: Record<string, string> = {
  // Dashboard pages
  '/dashboard': 'Bienvenue sur votre tableau de bord ! Consultez les métriques clés, les statistiques et les informations importantes sur votre garage. Utilisez le menu latéral pour naviguer vers les différentes sections.',

  '/dashboard/interventions': 'Gérez toutes les interventions de votre garage. Créez une nouvelle intervention, consultez les détails, modifiez le statut, ajoutez des pièces utilisées et suivez le temps passé. Les interventions permettent de tracer complètement le travail effectué.',

  '/dashboard/stock_materiel': 'Consultez et gérez votre inventaire de pièces et matériaux. Ajoutez des éléments au stock, modifiez les quantités disponibles, et suivez les consommations lors des interventions.',

  '/dashboard/photos_vehicules': 'Stockez et organisez les photos des véhicules de vos clients. Chaque photo est liée à un véhicule spécifique pour un suivi complet de l\'état et de l\'historique.',

  '/dashboard/clients': 'Gérez la base de données de vos clients. Consultez leurs informations, historique de réparations, et coordonnées de contact.',

  '/dashboard/facturation': 'Créez, consultez et gérez les factures. Associez les interventions aux factures, définissez les tarifs et suivez les paiements.',

  '/dashboard/caisse': 'Suivi des entrées et sorties d\'argent. Enregistrez les paiements, dépenses et générez des rapports financiers.',

  '/dashboard/atelier': 'Tableau de bord de l\'atelier. Consultez les tâches en cours, les interventions prioritaires et l\'emploi du temps des techniciens.',

  '/dashboard/agents': 'Gérez les techniciens et employés. Consultez leurs fiches, assignez les interventions, et suivez leur productivité.',

  '/dashboard/super': 'Panneau d\'administration super-admin. Gérez les utilisateurs, les locataires, les paramètres système et les accès.',

  '/dashboard/tenant': 'Paramètres du locataire. Configurez les informations de votre garage, les tarifs par défaut et les préférences.',

  // Auth pages
  '/auth': 'Connectez-vous avec votre compte ou créez un nouveau compte pour accéder à votre garage. Assurez-vous que vos identifiants sont corrects.',

  '/onboarding/super-admin': 'Configuration initiale super-admin. Créez votre premier compte administrateur pour gérer la plateforme.',

  '/onboarding/tenant-admin': 'Configuration du locataire. Remplissez les informations de votre garage et créez votre compte administrateur.',

  // Generic fallback
  'default': 'Besoin d\'aide ? Utilisez ce bouton pour obtenir des informations contextuelles sur cette page ou consultez la page d\'aide complète.',
};

/**
 * Récupère le message d'aide pour un chemin donné
 */
export function getHelpForPath(path: string): string {
  return helpMessages[path] || helpMessages['default'];
}

/**
 * Récupère le message d'aide depuis un dataset HTML
 */
export function getHelpFromDataset(dataset: DOMStringMap): string | null {
  return dataset.pageHelp || null;
}

/**
 * Récupère le message d'aide avec priorité : dataset > path > default
 */
export function resolveHelpMessage(
  path: string,
  datasetHelp?: string | null
): string {
  if (datasetHelp) return datasetHelp;
  return getHelpForPath(path);
}
