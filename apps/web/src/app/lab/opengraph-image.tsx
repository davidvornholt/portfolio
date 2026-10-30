import type { ImageResponse } from 'next/og';
import { ogImageSize } from '@/shared/og/services/og-image-size';
import SiteOpengraphImage, { alt as siteAlt } from '../opengraph-image';

// The lab sets its own Open Graph fields, which replaces the image it would
// otherwise inherit, so it serves the site card explicitly.
export const alt = siteAlt;
export const size = ogImageSize;
export const contentType = 'image/png';

const LabOpengraphImage = (): Promise<ImageResponse> => SiteOpengraphImage();

export default LabOpengraphImage;
