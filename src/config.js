import Conf from 'conf';

const config = new Conf({ projectName: 'ai-research-cli' });

export const getApiKey = () => config.get('apiKey');
export const setApiKey = (key) => config.set('apiKey', key);
export const deleteApiKey = () => config.delete('apiKey');
