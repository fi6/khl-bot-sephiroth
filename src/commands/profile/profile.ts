import { ProfileDoc } from '../../models/Profile';
import { BaseData } from '../pipeline-helper';

interface ProfileData extends BaseData {
    profile?: ProfileDoc;
}
