from bs4 import BeautifulSoup
from urllib.request import urlopen

url = 'https://medium.com/fair-warning/fair-warning-good-maps-bad-maps-and-ugly-maps-efb38a138076'

with open('y.html', 'w', encoding='utf-8') as f:
    f.write(BeautifulSoup(urlopen(url.strip()).read(), 'html.parser').prettify())