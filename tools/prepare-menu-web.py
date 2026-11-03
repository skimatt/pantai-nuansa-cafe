import urllib.request,json,re,html,time
from pathlib import Path
root=Path('assets-source/menu-web')
data=json.loads((root/'candidates.json').read_text(encoding='utf-8'))
choices=[('rambeu-bakar','ikan bakar',1),('kakap-bakar','ikan bakar',2),('ikan-asam-manis','sweet sour fish',0),('mie-aceh-spesial','mie aceh',0),('mie-aceh-telur','mie aceh',2),('mie-bakso','mie bakso',2),('nasi-pataya-seafood','nasi goreng pattaya',1),('nasi-ayam','ayam penyet',0),('sanger-espreso','kopi susu',3),('aneka-jus','fruit juice',3),('lemon-madu','lemon honey drink',0)]
rows=[]
for id,q,i in choices:
 a=data[q][i];m=a['extmetadata'];license=m['LicenseShortName']['value']
 assert license in ['CC BY-SA 4.0','CC BY-SA 3.0','CC BY-SA 2.0','CC BY 2.0','CC0','CC BY 3.0','CC BY 4.0','Public domain']
 p=root/(id+'.jpg');success=p.exists() and id not in ['sanger-espreso','aneka-jus','lemon-madu']
 if not success:
  for url in [a.get('thumburl'),a['url']]:
   if not url:continue
   try:
    req=urllib.request.Request(url,headers={'User-Agent':'NuansaCafe/1.0 (licensed media research)'})
    with urllib.request.urlopen(req,timeout=25) as f:body=f.read(25000000)
    p.write_bytes(body);success=True;break
   except Exception as e:print(id,str(e),flush=True)
 if success:
  rows.append(dict(id=id,title=a['title'],url=a['url'],sourcePage=a['descriptionurl'],license=license,licenseUrl=m.get('LicenseUrl',{}).get('value','https://creativecommons.org/publicdomain/zero/1.0/'),author=html.unescape(re.sub('<[^>]+>','',m.get('Artist',{}).get('value',''))),originalWidth=a['width'],originalHeight=a['height'],local=p.as_posix(),changes='Resize/WebP conversion; CSS display crop. Illustrative serving, not a venue product photograph.'))
  print('OK',id,flush=True)
 (root/'selected.json').write_text(json.dumps(rows,ensure_ascii=True,indent=2),encoding='utf-8')
from PIL import Image,ImageOps,ImageDraw
board=Image.new('RGB',(1000,900),'#f9edda');d=ImageDraw.Draw(board)
for i,a in enumerate(rows):
 im=ImageOps.fit(Image.open(a['local']).convert('RGB'),(245,245));x=i%4*250;y=i//4*300;board.paste(im,(x,y));d.text((x+5,y+255),a['id'],fill='#173746')
board.save(root/'review.jpg')

