import { BaseData } from 'kbotify';
import { ProfileDoc } from '../../models/Profile';

export interface ProfileData extends BaseData {
    profile?: ProfileDoc;
}

export enum createProfileStatuses {
    SUCCESS,
    WRONG_ARGS,
    WRONG_ARG_NUMS,
}

export {};
