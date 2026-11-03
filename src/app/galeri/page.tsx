import type {Metadata} from 'next';
import {content} from '@/lib/content';
import {completeGallery} from '@/lib/homepage';
import DetailFrame from '@/components/DetailFrame';
import GalleryCollection from '@/components/GalleryCollection';
export const metadata:Metadata={title:content.pages.gallery.metaTitle,description:content.pages.gallery.description,openGraph:{title:content.pages.gallery.metaTitle,description:content.pages.gallery.description}};
export default function GalleryPage(){return <DetailFrame content={content} kind="gallery"><GalleryCollection content={content} entries={completeGallery(content)}/></DetailFrame>;}
