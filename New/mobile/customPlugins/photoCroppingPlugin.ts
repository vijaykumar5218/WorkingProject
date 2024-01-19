import {registerPlugin} from '@capacitor/core';

export interface PhotoCroppingPlugin {
  cropPhoto(options: {image: string}): Promise<{image: string}>;
}

const PhotoCropping = registerPlugin<PhotoCroppingPlugin>('PhotoCropping');

export default PhotoCropping;
