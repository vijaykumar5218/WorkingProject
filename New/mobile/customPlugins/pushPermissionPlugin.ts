import {registerPlugin} from '@capacitor/core';

export interface PushPermissionPlugin {
  checkPushPermissions(): Promise<{result: boolean}>;
}

const PushPermission = registerPlugin<PushPermissionPlugin>('PushPermission');

export default PushPermission;
