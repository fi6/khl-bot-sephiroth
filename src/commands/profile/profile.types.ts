import { BaseData, BaseSession } from 'kbotify';
import { ProfileDoc } from '../../models/Profile';

export interface ProfileSession extends BaseSession {
    profile?: ProfileDoc;
}

export enum createProfileStatuses {
    SUCCESS,
    WRONG_ARGS,
    WRONG_ARG_NUMS,
}

export {};
