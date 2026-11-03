import type {Metadata} from 'next';
import {content} from '@/lib/content';
import DetailFrame from '@/components/DetailFrame';
import MenuCollection from '@/components/MenuCollection';
export const metadata:Metadata={title:content.pages.menu.metaTitle,description:content.pages.menu.description,openGraph:{title:content.pages.menu.metaTitle,description:content.pages.menu.description}};
export default function MenuPage(){return <DetailFrame content={content} kind="menu"><MenuCollection content={content}/></DetailFrame>;}
