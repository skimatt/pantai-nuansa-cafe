import type { Metadata, Viewport } from 'next';
import '@fontsource/cormorant-garamond/latin-400.css';
import '@fontsource/cormorant-garamond/latin-400-italic.css';
import '@fontsource/cormorant-garamond/latin-500.css';
import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-500.css';
import './globals.css';
import './journey.css';
import './cafe.css';
import './golden.css';
import './living-world.css';
import './scene-continuity.css';
import './folder-photos.css';
import './detail-pages.css';
import { content } from '@/lib/content';

export const metadata:Metadata={
  title:content.site.brand,description:content.site.description,
  robots:{index:false,follow:false},
  openGraph:{title:content.site.brand,description:content.site.description,locale:'id_ID',type:'website'},
};
export const viewport:Viewport={width:'device-width',initialScale:1,themeColor:'#173746'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang={content.site.language}><body>{children}</body></html>;}
