import arenaConfig from './arena';
import { default as roles } from './roles';
import { default as channels } from './channels';

export { default as channels } from './channels';
export { default as roles } from './roles';
export default {
    server: '',
    arena: arenaConfig,
    roles: roles,
    channels: channels,
};
