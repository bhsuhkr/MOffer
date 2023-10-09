cp -r -fo C:\Projects\MOffer\M-Offer.UI\dist\* C:\nginx\html

cd C:\nginx-1.25.1
taskkill /f /IM nginx.exe
start nginx
cd C:\Users\NEWSONG
Echo "MOffer has been deployed."