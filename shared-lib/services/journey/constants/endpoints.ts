const contextRoot = 'myvoyage/ws/ers/';
const journeys = 'journeys/';
export const endpoints = {
  getJourneys: contextRoot + journeys + 'get/',
  saveStepProgress: contextRoot + journeys + 'steps/saveProgress/',
  getStepContent: contextRoot + 'content/section/',
  completionStatus: 'myvoyage/hsa/journey/status',
};
