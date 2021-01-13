import { CommandTypes, MenuCommand } from 'commands/command.helpers';
import { ProfileDoc } from '../../models/Profile';
import { BaseData } from '../pipeline-helper';

export interface ProfileData extends BaseData {
    profile?: ProfileDoc;
}

export enum createProfileStatuses {
    SUCCESS,
    WRONG_ARGS,
    WRONG_ARG_NUMS,
}

export {};
