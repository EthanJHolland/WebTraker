from bs4 import BeautifulSoup
from urllib.request import urlopen

if __name__=='__main__':
    data=urlopen("https://stackexchange.com/sites").read() #read from url     
    soup=BeautifulSoup(data, 'html.parser')

    print('"https://*.stackexchange.com/questions/*",')
    print('"https://*.stackoverflow.com/questions/*",')
    for tag in soup.find_all('a','noscript-link'):
        if 'stackexchange' not in tag.attrs['href'] and 'stackoverflow' not in tag.attrs['href']:
            print('"{}/questions/*",'.format(tag.attrs['href']))